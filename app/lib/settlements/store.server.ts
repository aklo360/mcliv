import {artists} from '~/lib/exhibition-1620';
import {
  agreementText,
  cents,
  CONSENT,
  totals,
  validateTerms,
  type Terms,
} from './domain';
import {approvedPayoutUrl, db, randomToken, sha256} from './security.server';
import {signedPdf} from './pdf.server';

export type Settlement = {
  id: string;
  artistSlug: string;
  revision: number;
  createdAt: string;
  fundsCleared: number;
  recipientVerified: number;
  destinationRef: string | null;
  destinationLast4: string | null;
  verificationNote: string | null;
  approved: number;
  issue: string | null;
  terms: string;
  document: string;
  documentHash: string;
  entitlementCents: number;
  mclivSigner: string;
  mclivSignedAt: string;
  signedAt: string | null;
  artistSigner: string | null;
  paidCents: number;
};
export type Payment = {
  id: string;
  revision: number;
  amountCents: number;
  returnedCents: number;
  status: 'reserved' | 'processing' | 'confirmed' | 'failed';
  reference: string | null;
  evidence: string | null;
  createdAt: string;
  updatedAt: string;
};

const SELECT = `SELECT s.*, v.terms, v.document, v.documentHash, v.entitlementCents, v.mclivSigner, v.mclivSignedAt, sig.signedAt, sig.artistSigner, COALESCE((SELECT SUM(p.amountCents-p.returnedCents) FROM settlement_payments p WHERE p.settlementId=s.id AND p.status='confirmed'),0) AS paidCents FROM settlements s JOIN settlement_versions v ON v.settlementId=s.id AND v.revision=s.revision LEFT JOIN settlement_signatures sig ON sig.settlementId=s.id AND sig.revision=s.revision`;
export async function getSettlement(env: Env, id: string): Promise<Settlement> {
  const row = await db(env)
    .prepare(`${SELECT} WHERE s.id=?`)
    .bind(id)
    .first<Settlement>();
  if (!row) throw new Response('Settlement not found.', {status: 404});
  return row;
}
export async function listSettlements(env: Env): Promise<Settlement[]> {
  return (
    await db(env)
      .prepare(`${SELECT} ORDER BY s.createdAt DESC LIMIT 200`)
      .all<Settlement>()
  ).results;
}
export async function getPayments(env: Env, id: string): Promise<Payment[]> {
  return (
    await db(env)
      .prepare(
        'SELECT * FROM settlement_payments WHERE settlementId=? ORDER BY createdAt DESC',
      )
      .bind(id)
      .all<Payment>()
  ).results;
}
function audit(env: Env, id: string, event: string, actor: string) {
  return db(env)
    .prepare(
      'INSERT INTO settlement_audit(id,settlementId,event,actor,createdAt) VALUES(?,?,?,?,?)',
    )
    .bind(crypto.randomUUID(), id, event, actor, new Date().toISOString());
}
export function formText(form: URLSearchParams, key: string, max = 500) {
  const value = form.get(key)?.trim() || '';
  if (value.length > max) throw new Error(`${key} is too long.`);
  return value;
}
export function parseTerms(form: URLSearchParams, env: Env): Terms {
  const artist = artists.find((a) => a.slug === form.get('artistSlug'));
  if (!artist) throw new Error('Select an exhibition artist.');
  const t = {
    artistSlug: artist.slug,
    artistName: artist.name,
    artistLegalName: formText(form, 'artistLegalName'),
    artistEmail: formText(form, 'artistEmail').toLowerCase(),
    artistAddress: formText(form, 'artistAddress'),
    artistCapacity: formText(form, 'artistCapacity'),
    mclivLegalName: formText(form, 'mclivLegalName'),
    mclivAddress: formText(form, 'mclivAddress'),
    title: formText(form, 'title'),
    description: formText(form, 'description', 3000),
    orderId: formText(form, 'orderId', 100),
    lineId: formText(form, 'lineId', 100),
    saleDate: formText(form, 'saleDate', 10),
    dueDate: formText(form, 'dueDate', 10),
    artworkCents: cents(form.get('artworkAmount') || ''),
    taxCents: cents(form.get('taxAmount') || ''),
    shippingCents: cents(form.get('shippingAmount') || ''),
    totalCents: cents(form.get('totalAmount') || ''),
    deductionCents: cents(form.get('deductionAmount') || '0'),
    deductionReason: formText(form, 'deductionReason', 2000),
    agreement: formText(form, 'agreement', 40000),
    method: form.get('method') as Terms['method'],
    payoutUrl: approvedPayoutUrl(formText(form, 'payoutUrl', 3000), env),
    feeTerms: formText(form, 'feeTerms', 2000),
  };
  validateTerms(t);
  return t;
}
export async function createAgreement(
  env: Env,
  form: URLSearchParams,
  actor: string,
) {
  for (const key of [
    'legalReviewed',
    'saleVerified',
    'contactVerified',
    'noPriorPayment',
    'mclivConsent',
  ])
    if (form.get(key) !== 'on')
      throw new Error(
        'Complete all review confirmations before countersigning.',
      );
  const signer = formText(form, 'mclivSigner');
  if (signer.length < 2)
    throw new Error('Enter the authorized MCLIV signer’s legal name.');
  const terms = parseTerms(form, env);
  const document = agreementText(terms);
  const hash = await sha256(document);
  const priorId = formText(form, 'reviseId', 80);
  const prior = priorId ? await getSettlement(env, priorId) : null;
  const priorTerms: Terms | null = prior
    ? (JSON.parse(prior.terms) as Terms)
    : null;
  if (
    priorTerms &&
    (priorTerms.orderId !== terms.orderId ||
      priorTerms.lineId !== terms.lineId ||
      priorTerms.artistSlug !== terms.artistSlug)
  )
    throw new Error(
      'An amendment must keep the same artist and Shopify order line.',
    );
  const id = prior?.id || crypto.randomUUID();
  const revision = (prior?.revision || 0) + 1;
  const now = new Date().toISOString();
  await db(env).batch([
    prior
      ? db(env)
          .prepare(
            'UPDATE settlements SET revision=?, fundsCleared=0, recipientVerified=0, destinationRef=NULL, destinationLast4=NULL, verificationNote=NULL, approved=0, issue=NULL WHERE id=? AND revision=?',
          )
          .bind(revision, id, prior.revision)
      : db(env)
          .prepare(
            'INSERT INTO settlements(id,artistSlug,orderId,lineId,createdAt) VALUES(?,?,?,?,?)',
          )
          .bind(id, terms.artistSlug, terms.orderId, terms.lineId, now),
    db(env)
      .prepare(
        'INSERT INTO settlement_versions(settlementId,revision,terms,document,documentHash,entitlementCents,mclivSigner,mclivSignedAt,adminEmail) VALUES(?,?,?,?,?,?,?,?,?)',
      )
      .bind(
        id,
        revision,
        JSON.stringify(terms),
        document,
        hash,
        totals(terms).artist,
        signer,
        now,
        actor,
      ),
    db(env)
      .prepare('UPDATE settlement_invites SET revoked=1 WHERE settlementId=?')
      .bind(id),
    audit(
      env,
      id,
      `MCLIV approved and signed revision ${revision}; legal text, sale, contact and no prior payments confirmed`,
      actor,
    ),
  ]);
  return id;
}
export async function issueInvite(
  env: Env,
  id: string,
  actor: string,
  origin: string,
) {
  const row = await getSettlement(env, id);
  if (row.issue)
    throw new Error(
      'Resolve the correction or assistance request before issuing an invitation.',
    );
  const token = randomToken();
  await db(env).batch([
    db(env)
      .prepare('UPDATE settlement_invites SET revoked=1 WHERE settlementId=?')
      .bind(id),
    db(env)
      .prepare(
        'INSERT INTO settlement_invites(tokenHash,settlementId,revision,expiresAt) VALUES(?,?,?,?)',
      )
      .bind(
        await sha256(token),
        id,
        row.revision,
        new Date(Date.now() + 72 * 3600000).toISOString(),
      ),
    audit(env, id, 'Invitation link prepared; not sent', actor),
  ]);
  const terms = JSON.parse(row.terms) as Terms;
  const link = `${origin}/artists/settlements/${id}#invite=${token}`;
  return {
    to: terms.artistEmail,
    subject: 'Your work sold — complete your artist payment details',
    body: `Hi ${terms.artistName},\n\nCongrats, your work sold! Please review and sign your consignment agreement and complete your payment details here:\n\n${link}\n\nThis private link expires in 72 hours and opens once. Your payment deadline is ${terms.dueDate}. If anything looks wrong or you prefer help completing the agreement, reply to this email or contact info@mcliv.studio.\n\nMCLIV`,
    link,
  };
}
export async function signAgreement(
  env: Env,
  id: string,
  revision: number,
  form: URLSearchParams,
) {
  const row = await getSettlement(env, id);
  const terms = JSON.parse(row.terms) as Terms;
  if (
    revision !== row.revision ||
    form.get('documentHash') !== row.documentHash ||
    row.issue
  )
    throw new Error(
      'This agreement needs review. Reload the page or contact MCLIV.',
    );
  if (row.signedAt) return;
  if (
    form.get('consent') !== 'on' ||
    form.get('destinationComplete') !== 'on' ||
    formText(form, 'artistSigner') !== terms.artistLegalName
  )
    throw new Error(
      'Confirm the payout step, electronic-signature consent, and your exact legal name. Request a correction if your name is wrong.',
    );
  const signedAt = new Date().toISOString();
  const bytes = await signedPdf(
    row.document,
    row.documentHash,
    row.mclivSigner,
    row.mclivSignedAt,
    terms.artistLegalName,
    signedAt,
    revision,
  );
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  await db(env).batch([
    db(env)
      .prepare(
        'INSERT INTO settlement_signatures(settlementId,revision,artistSigner,signedAt,consent,pdfBase64,pdfHash) VALUES(?,?,?,?,?,?,?) ON CONFLICT(settlementId,revision) DO NOTHING',
      )
      .bind(
        id,
        revision,
        terms.artistLegalName,
        signedAt,
        CONSENT,
        btoa(binary),
        await sha256(bytes),
      ),
    audit(
      env,
      id,
      `Artist signature requested for revision ${revision}; provider details submitted per artist`,
      'artist',
    ),
  ]);
}
export async function requestHelp(env: Env, id: string, reason: string) {
  if (reason.length < 3 || reason.length > 2000)
    throw new Error(
      'Describe the correction or help you need (3–2,000 characters). Do not include bank numbers.',
    );
  await db(env).batch([
    db(env)
      .prepare('UPDATE settlements SET issue=?, approved=0 WHERE id=?')
      .bind(reason, id),
    audit(
      env,
      id,
      'Artist requested correction or assisted completion; routine follow-up paused',
      'artist',
    ),
  ]);
}
export async function adminUpdate(
  env: Env,
  id: string,
  form: URLSearchParams,
  actor: string,
) {
  const intent = form.get('intent');
  const row = await getSettlement(env, id);
  const now = new Date().toISOString();
  if (intent === 'verify') {
    if (row.issue) throw new Error('Resolve the open request before approval.');
    if (
      form.get('fundsCleared') !== 'on' ||
      form.get('recipientVerified') !== 'on' ||
      form.get('approve') !== 'on'
    )
      throw new Error(
        'Confirm cleared funds, verified recipient and destination, and payout approval.',
      );
    const reference = formText(form, 'destinationRef', 160);
    const last4 = formText(form, 'destinationLast4', 4);
    const note = formText(form, 'verificationNote', 2000);
    if (
      !/^[a-zA-Z0-9_-]{3,160}$/.test(reference) ||
      !/^\d{4}$/.test(last4) ||
      note.length < 10
    )
      throw new Error(
        'Provide a provider recipient ID, last four account digits, and verification evidence. Never enter a full bank account number.',
      );
    if (
      row.recipientVerified &&
      (row.destinationRef !== reference || row.destinationLast4 !== last4)
    )
      throw new Error(
        'Destination changes require a new reviewed agreement and verified-contact notice.',
      );
    await db(env).batch([
      db(env)
        .prepare(
          'UPDATE settlements SET fundsCleared=1,recipientVerified=1,destinationRef=?,destinationLast4=?,verificationNote=?,approved=1 WHERE id=? AND revision=?',
        )
        .bind(reference, last4, note, id, row.revision),
      audit(
        env,
        id,
        'Cleared funds, recipient, destination and amount verified; payout approved',
        actor,
      ),
    ]);
  } else if (intent === 'resolve') {
    if (form.get('resolved') !== 'on')
      throw new Error(
        'Confirm you resolved the request directly with the artist. Amend the agreement if terms changed.',
      );
    await db(env).batch([
      db(env)
        .prepare('UPDATE settlements SET issue=NULL,approved=0 WHERE id=?')
        .bind(id),
      audit(
        env,
        id,
        'Assistance request resolved with artist; payout needs fresh approval',
        actor,
      ),
    ]);
  } else if (intent === 'reserve') {
    const amount = cents(form.get('amount') || '');
    const paymentId = formText(form, 'requestId', 36);
    if (!/^[a-f0-9-]{36}$/.test(paymentId))
      throw new Error('Reload this page before reserving a payment.');
    await db(env).batch([
      db(env)
        .prepare(
          "INSERT INTO settlement_payments(id,settlementId,revision,amountCents,status,createdAt,updatedAt,actor) VALUES(?,?,?,?,'reserved',?,?,?)",
        )
        .bind(paymentId, id, row.revision, amount, now, now, actor),
      audit(
        env,
        id,
        'Manual payout reserved; no transfer initiated by this application',
        actor,
      ),
    ]);
  } else if (intent === 'payment') {
    const paymentId = formText(form, 'paymentId', 80);
    const status = formText(form, 'status', 20);
    const reference = formText(form, 'reference', 160);
    const evidence = formText(form, 'evidence', 2000);
    if (
      !['processing', 'confirmed', 'failed'].includes(status) ||
      evidence.length < 5 ||
      form.get('reconciled') !== 'on'
    )
      throw new Error(
        'Check the actual provider status and add evidence before recording it.',
      );
    const returned = cents(form.get('returned') || '0');
    const result = await db(env).batch([
      db(env)
        .prepare(
          'UPDATE settlement_payments SET status=?,reference=COALESCE(reference,?),evidence=?,returnedCents=?,updatedAt=?,actor=? WHERE id=? AND settlementId=?',
        )
        .bind(
          status,
          reference || null,
          evidence,
          returned,
          now,
          actor,
          paymentId,
          id,
        ),
      audit(
        env,
        id,
        `Manual payment status recorded: ${status}; returned amount ${returned} cents`,
        actor,
      ),
    ]);
    if (!result[0].meta.changes)
      throw new Error('Payment record was not found.');
  } else throw new Error('Unknown action.');
}
export async function downloadAgreement(
  env: Env,
  id: string,
  revision: number,
) {
  const row = await db(env)
    .prepare(
      'SELECT pdfBase64,pdfHash FROM settlement_signatures WHERE settlementId=? AND revision=?',
    )
    .bind(id, revision)
    .first<{pdfBase64: string; pdfHash: string}>();
  if (!row)
    throw new Response('This agreement has not been signed.', {status: 404});
  const bytes = Uint8Array.from(atob(row.pdfBase64), (c) => c.charCodeAt(0));
  if ((await sha256(bytes)) !== row.pdfHash)
    throw new Response('File verification failed. Contact MCLIV.', {
      status: 500,
    });
  return new Response(bytes, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="MCLIV-agreement-v${revision}.pdf"`,
      'X-Document-SHA256': row.pdfHash,
    },
  });
}
