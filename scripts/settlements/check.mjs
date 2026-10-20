import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {generateKeyPair, exportJWK, SignJWT} from 'jose';
import {Worker} from 'node:worker_threads';
import {readFileSync} from 'node:fs';

const {api, dir, sqlite, env, form} = await import('./fixture.mjs');
let passed = 0;
async function check(name, fn) {
  await fn();
  passed++;
  process.stdout.write(`PASS ${name}\n`);
}
const admin = 'operator@example.com';
let id, cookie, session, hash;
await check('integer money and tax-inclusive reconciliation', async () => {
  assert.equal(api.cents('1111.01'), 111101);
  assert.throws(() => api.cents('1.001'));
  assert.deepEqual(api.totals({artworkCents: 95000, deductionCents: 0}), {
    commission: 19000,
    artist: 76000,
  });
  const bad = new URLSearchParams(form);
  bad.set('totalAmount', '950.00');
  assert.throws(() => api.parseTerms(bad, env), /line total/);
  bad.set('totalAmount', '1034.31');
  bad.set('agreement', '[REPLACE THESE TERMS]'.repeat(10));
  assert.throws(() => api.parseTerms(bad, env), /placeholders/);
});
await check('approved provider URL and CSRF boundaries', async () => {
  assert.throws(() =>
    api.approvedPayoutUrl('https://payments.example.com.evil.test', env),
  );
  assert.throws(() => api.approvedPayoutUrl('javascript:alert(1)', env));
  assert.throws(() =>
    api.sameOrigin(
      new Request('https://mcliv.studio/artists/settlements/id', {
        method: 'POST',
        headers: {
          Origin: 'https://evil.test',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }),
    ),
  );
});
await check('create one immutable agreement per Shopify line', async () => {
  id = await api.createAgreement(env, form, admin);
  hash = (await api.getSettlement(env, id)).documentHash;
  await assert.rejects(() => api.createAgreement(env, form, admin));
  assert.throws(
    () =>
      sqlite
        .prepare(
          'UPDATE settlement_versions SET entitlementCents=1 WHERE settlementId=?',
        )
        .run(id),
    /immutable/,
  );
});
await check('hashed expiring one-use invitation and artist scope', async () => {
  const invite = await api.issueInvite(env, id, admin, 'https://mcliv.studio');
  const token = new URLSearchParams(new URL(invite.link).hash.slice(1)).get(
    'invite',
  );
  assert.notEqual(
    sqlite.prepare('SELECT tokenHash FROM settlement_invites').get().tokenHash,
    token,
  );
  cookie = await api.exchangeInvite(
    new Request('https://mcliv.studio'),
    env,
    id,
    token,
  );
  assert.match(cookie, /HttpOnly; Secure; SameSite=Strict/);
  const cookiePath = cookie.match(/; Path=([^;]+)/)[1];
  // Browser cookie path matching requires a slash after a non-exact path.
  const matchesCookiePath = (path) =>
    path === cookiePath || path.startsWith(`${cookiePath}/`);
  assert.ok(matchesCookiePath(`/artists/settlements/${id}`));
  assert.ok(matchesCookiePath(`/artists/settlements/${id}.data`));
  assert.ok(cookie.startsWith(`__Secure-mcliv-settlement-${id}=`));
  await assert.rejects(() =>
    api.exchangeInvite(new Request('https://mcliv.studio'), env, id, token),
  );
  session = await api.artistSession(
    new Request(`https://mcliv.studio/artists/settlements/${id}`, {
      headers: {Cookie: cookie},
    }),
    env,
    id,
  );
  assert.equal(session.revision, 1);
  assert.equal(
    await api.artistSession(
      new Request('https://mcliv.studio', {headers: {Cookie: cookie}}),
      env,
      'different-artist',
    ),
    null,
  );
});
const reserve = (amount, key = crypto.randomUUID()) =>
  api.adminUpdate(
    env,
    id,
    new URLSearchParams({intent: 'reserve', amount, requestId: key}),
    admin,
  );
await check('unsigned and uncleared payout blocked', async () => {
  await assert.rejects(() => reserve('760.00'));
  await assert.rejects(() =>
    api.signAgreement(
      env,
      id,
      1,
      new URLSearchParams({
        documentHash: hash,
        artistSigner: 'Wrong Person',
        consent: 'on',
        destinationComplete: 'on',
      }),
    ),
  );
  await api.signAgreement(
    env,
    id,
    1,
    new URLSearchParams({
      documentHash: hash,
      artistSigner: 'Example Artist',
      consent: 'on',
      destinationComplete: 'on',
    }),
  );
  await assert.rejects(() => reserve('760.00'));
});
await check('retained PDF hash and no second artist signature', async () => {
  const response = await api.downloadAgreement(env, id, 1);
  const bytes = new Uint8Array(await response.arrayBuffer());
  assert.equal(
    await api.sha256(bytes),
    response.headers.get('X-Document-SHA256'),
  );
  assert.ok(Buffer.from(bytes).subarray(0, 4).equals(Buffer.from('%PDF')));
  writeFileSync(join(dir, 'test-agreement.pdf'), bytes);
  assert.throws(
    () =>
      sqlite
        .prepare(
          'UPDATE settlement_signatures SET signedAt=? WHERE settlementId=?',
        )
        .run('changed', id),
    /immutable/,
  );
  await api.signAgreement(
    env,
    id,
    1,
    new URLSearchParams({documentHash: hash}),
  );
  assert.equal(
    sqlite.prepare('SELECT COUNT(*) AS n FROM settlement_signatures').get().n,
    1,
  );
});
const verification = new URLSearchParams({
  intent: 'verify',
  fundsCleared: 'on',
  recipientVerified: 'on',
  approve: 'on',
  destinationRef: 'test_recipient_001',
  destinationLast4: '1234',
  verificationNote:
    'TEST: reconciled funds, verified contact and bank recipient.',
});
await check('recipient verification and correction hold', async () => {
  await api.requestHelp(env, id, 'Please check this test statement.');
  await assert.rejects(() => api.adminUpdate(env, id, verification, admin));
  await api.adminUpdate(
    env,
    id,
    new URLSearchParams({intent: 'resolve', resolved: 'on'}),
    admin,
  );
  await api.adminUpdate(env, id, verification, admin);
  const change = new URLSearchParams(verification);
  change.set('destinationLast4', '9999');
  await assert.rejects(
    () => api.adminUpdate(env, id, change, admin),
    /Destination changes/,
  );
});
let firstPayment;
await check('duplicate payout request cannot reserve twice', async () => {
  firstPayment = crypto.randomUUID();
  await reserve('300.00', firstPayment);
  await assert.rejects(() => reserve('300.00', firstPayment));
  await assert.rejects(() => reserve('500.00'));
  assert.equal((await api.getPayments(env, id)).length, 1);
});
const update = (
  paymentId,
  status,
  returned = '0.00',
  reference = 'test_transfer_001',
) =>
  api.adminUpdate(
    env,
    id,
    new URLSearchParams({
      intent: 'payment',
      paymentId,
      status,
      returned,
      reference,
      evidence: 'TEST: checked provider transfer record.',
      reconciled: 'on',
    }),
    admin,
  );
await check(
  'partial, pending, confirmed and returned funds reconcile',
  async () => {
    await assert.rejects(() => update(firstPayment, 'confirmed'));
    await update(firstPayment, 'processing');
    await assert.rejects(() => reserve('500.00'));
    await update(firstPayment, 'confirmed');
    await update(firstPayment, 'confirmed', '100.00');
    assert.equal((await api.getSettlement(env, id)).paidCents, 20000);
    await assert.rejects(() => update(firstPayment, 'confirmed', '99.00'));
    await reserve('560.00');
    await assert.rejects(() => reserve('0.01'));
  },
);
await check(
  'new revision invalidates old invitations and signature',
  async () => {
    const amended = new URLSearchParams(form);
    amended.set('reviseId', id);
    await assert.rejects(
      () => api.createAgreement(env, amended, admin),
      /Reconcile/,
    );
    const other = new URLSearchParams(form);
    other.set('orderId', 'gid://shopify/Order/900000002');
    other.set('lineId', 'gid://shopify/LineItem/900000002');
    const second = await api.createAgreement(env, other, admin);
    const invite = await api.issueInvite(
      env,
      second,
      admin,
      'https://mcliv.studio',
    );
    const token = new URLSearchParams(new URL(invite.link).hash.slice(1)).get(
      'invite',
    );
    other.set('reviseId', second);
    other.set('title', 'Corrected test title');
    await api.createAgreement(env, other, admin);
    await assert.rejects(() =>
      api.exchangeInvite(
        new Request('https://mcliv.studio'),
        env,
        second,
        token,
      ),
    );
    assert.equal((await api.getSettlement(env, second)).revision, 2);
    assert.equal((await api.getSettlement(env, second)).signedAt, null);
  },
);
await check('expiry and deadline escalation', async () => {
  const expired = await api.issueInvite(env, id, admin, 'https://mcliv.studio');
  sqlite
    .prepare(
      "UPDATE settlement_invites SET expiresAt='2000-01-01' WHERE settlementId=?",
    )
    .run(id);
  await assert.rejects(() =>
    api.exchangeInvite(
      new Request('https://mcliv.studio'),
      env,
      id,
      new URLSearchParams(new URL(expired.link).hash.slice(1)).get('invite'),
    ),
  );
  assert.equal(
    api.deadlineLabel(
      '2026-09-28',
      false,
      false,
      new Date('2026-09-25T12:00:00Z'),
    ),
    'Due soon — review now',
  );
  assert.equal(
    api.deadlineLabel(
      '2026-09-20',
      false,
      true,
      new Date('2026-09-21T12:00:00Z'),
    ),
    'Overdue — contact required',
  );
});
await check('admin JWT signature, audience, issuer and allowlist', async () => {
  const {privateKey, publicKey} = await generateKeyPair('RS256', {
    extractable: true,
  });
  const jwk = await exportJWK(publicKey);
  jwk.kid = 'test-key';
  jwk.alg = 'RS256';
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(JSON.stringify({keys: [jwk]}), {
      headers: {'Content-Type': 'application/json'},
    });
  const authEnv = {
    ...env,
    SETTLEMENT_ACCESS_ISSUER: 'https://test-team.cloudflareaccess.com',
    SETTLEMENT_ACCESS_AUDIENCE: 'test-audience',
    SETTLEMENT_ADMIN_EMAILS: admin,
  };
  const token = async (email = admin, audience = 'test-audience') =>
    new SignJWT({email})
      .setProtectedHeader({alg: 'RS256', kid: 'test-key'})
      .setIssuer(authEnv.SETTLEMENT_ACCESS_ISSUER)
      .setAudience(audience)
      .setSubject('test-subject')
      .setIssuedAt()
      .setExpirationTime('5m')
      .sign(privateKey);
  try {
    const request = async (email, audience) =>
      new Request('https://mcliv.studio/admin/settlements', {
        headers: {'Cf-Access-Jwt-Assertion': await token(email, audience)},
      });
    assert.equal(
      await api.requireAdmin(await request(admin, 'test-audience'), authEnv),
      admin,
    );
    await assert.rejects(() =>
      api.requireAdmin(
        new Request('https://mcliv.studio', {
          headers: {'Cf-Access-Authenticated-User-Email': admin},
        }),
        authEnv,
      ),
    );
    await assert.rejects(async () =>
      api.requireAdmin(
        await request('stranger@example.com', 'test-audience'),
        authEnv,
      ),
    );
    await assert.rejects(async () =>
      api.requireAdmin(await request(admin, 'wrong-audience'), authEnv),
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});
await check('all 18 artists use the same agreement workflow', async () => {
  const catalogue = JSON.parse(
    readFileSync('app/lib/exhibition-1620.generated.json', 'utf8'),
  );
  assert.equal(catalogue.artists.length, 18);
  for (const [index, artist] of catalogue.artists.entries()) {
    const artistForm = new URLSearchParams(form);
    artistForm.set('artistSlug', artist.slug);
    artistForm.set('orderId', `gid://shopify/Order/${910000000 + index}`);
    artistForm.set('lineId', `gid://shopify/LineItem/${910000000 + index}`);
    const artistId = await api.createAgreement(env, artistForm, admin);
    const record = await api.getSettlement(env, artistId);
    assert.equal(record.artistSlug, artist.slug);
    assert.equal(record.entitlementCents, 76000);
  }
});
await check('concurrent reservations cannot overpay', async () => {
  const raceForm = new URLSearchParams(form);
  raceForm.set('orderId', 'gid://shopify/Order/920000001');
  raceForm.set('lineId', 'gid://shopify/LineItem/920000001');
  const raceId = await api.createAgreement(env, raceForm, admin);
  const record = await api.getSettlement(env, raceId);
  await api.signAgreement(
    env,
    raceId,
    1,
    new URLSearchParams({
      documentHash: record.documentHash,
      artistSigner: 'Example Artist',
      consent: 'on',
      destinationComplete: 'on',
    }),
  );
  await api.adminUpdate(env, raceId, verification, admin);
  const file = join(dir, 'concurrency.sqlite');
  sqlite.prepare('VACUUM INTO ?').run(file);
  const source = `const {parentPort,workerData}=require('node:worker_threads'); const {DatabaseSync}=require('node:sqlite'); const d=new DatabaseSync(workerData.file); d.exec('PRAGMA busy_timeout=5000; PRAGMA foreign_keys=ON;'); try { d.exec('BEGIN IMMEDIATE'); d.prepare("INSERT INTO settlement_payments(id,settlementId,revision,amountCents,status,createdAt,updatedAt,actor) VALUES(?,?,1,40000,'reserved',?,?,?)").run(workerData.key,workerData.id,'2026-09-21','2026-09-21','test'); d.exec('COMMIT'); parentPort.postMessage(true); } catch { d.exec('ROLLBACK'); parentPort.postMessage(false); } finally { d.close(); }`;
  const run = () =>
    new Promise((resolve, reject) => {
      const worker = new Worker(source, {
        eval: true,
        workerData: {file, id: raceId, key: crypto.randomUUID()},
      });
      worker.once('message', resolve);
      worker.once('error', reject);
    });
  const results = await Promise.all([run(), run()]);
  assert.equal(results.filter(Boolean).length, 1);
});
sqlite.close();
process.stdout.write(
  `${passed} checks passed. Synthetic PDF: ${join(dir, 'test-agreement.pdf')}\n`,
);
