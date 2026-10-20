import {Form, useActionData, useLoaderData} from 'react-router';
import type {Route} from './+types/admin.settlements.$id';
import {
  Portal,
  Submit,
  Notice,
  SaleStatement,
} from '~/components/settlements/Portal';
import {AgreementForm} from '~/components/settlements/AgreementForm';
import {dollars, deadlineLabel, type Terms} from '~/lib/settlements/domain';
import {
  db,
  PRIVATE_HEADERS,
  readForm,
  requireAdmin,
} from '~/lib/settlements/security.server';
import {
  adminUpdate,
  getPayments,
  getSettlement,
  issueInvite,
} from '~/lib/settlements/store.server';
import styles from '~/styles/settlements.css?url';
export const links = () => [{rel: 'stylesheet', href: styles}];
export const meta = () => [
  {title: 'Artist settlement | MCLIV'},
  {name: 'robots', content: 'noindex, nofollow'},
];
export const headers = () => PRIVATE_HEADERS;
export async function loader({request, context, params}: Route.LoaderArgs) {
  await requireAdmin(request, context.env);
  const row = await getSettlement(context.env, params.id);
  const payments = await getPayments(context.env, params.id);
  const audit: {id: string; event: string; actor: string; createdAt: string}[] =
    (
      await db(context.env)
        .prepare(
          'SELECT id,event,actor,createdAt FROM settlement_audit WHERE settlementId=? ORDER BY createdAt DESC LIMIT 100',
        )
        .bind(params.id)
        .all<{id: string; event: string; actor: string; createdAt: string}>()
    ).results;
  return {
    requestId: crypto.randomUUID(),
    row,
    terms: JSON.parse(row.terms) as Terms,
    payments,
    audit,
  };
}
export async function action({request, context, params}: Route.ActionArgs) {
  const actor = await requireAdmin(request, context.env);
  const form = await readForm(request);
  try {
    if (form.get('intent') === 'invite')
      return {
        invite: await issueInvite(
          context.env,
          params.id,
          actor,
          new URL(request.url).origin,
        ),
      };
    await adminUpdate(context.env, params.id, form, actor);
    return {message: 'Record updated. No funds were sent by this application.'};
  } catch (error) {
    if (error instanceof Response) throw error;
    return {
      error:
        error instanceof Error &&
        !/D1|SQL|constraint|UNIQUE/i.test(error.message)
          ? error.message
          : 'Update blocked. Check signatures, cleared funds, recipient verification, open requests, payment state and available balance. Reload before retrying.',
    };
  }
}
export default function SettlementAdmin() {
  const {row, terms, payments, audit, requestId} =
    useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  const paid = payments
    .filter((p) => p.status === 'confirmed')
    .reduce((s, p) => s + p.amountCents - p.returnedCents, 0);
  const held = payments
    .filter((p) => p.status === 'reserved' || p.status === 'processing')
    .reduce((s, p) => s + p.amountCents, 0);
  return (
    <Portal admin>
      <a href="/admin/settlements">Artist payment queue</a>
      <div className="settlement-heading" style={{marginTop: 32}}>
        <p className="settlement-eyebrow">
          {terms.artistName} / Revision {row.revision}
        </p>
        <h1>{terms.title}</h1>
        <p>
          {deadlineLabel(
            terms.dueDate,
            paid === row.entitlementCents,
            row.issue !== null,
          )}
        </p>
      </div>
      <Notice
        message={
          result &&
          ('error' in result
            ? result.error
            : 'message' in result
              ? result.message
              : null)
        }
      />
      <div className="settlement-grid">
        <aside>
          <SaleStatement terms={terms} />
          <p>
            Confirmed: {dollars(paid)}
            <br />
            Reserved / processing: {dollars(held)}
            <br />
            Available to reserve: {dollars(row.entitlementCents - paid - held)}
          </p>
          <p>
            Artist:{' '}
            {row.signedAt
              ? `Signed ${row.signedAt.slice(0, 10)}`
              : 'Awaiting signature'}
            <br />
            Funds: {row.fundsCleared ? 'Cleared' : 'Not verified'}
            <br />
            Destination:{' '}
            {row.recipientVerified
              ? `Verified · •••• ${row.destinationLast4}`
              : 'Not verified'}
          </p>
          {row.signedAt && (
            <a href={`/admin/settlements/${row.id}/agreement.pdf`}>
              Download signed PDF
            </a>
          )}
          <p className="settlement-small">
            Document SHA-256
            <br />
            <code>{row.documentHash}</code>
          </p>
        </aside>
        <section>
          <h2>Private invitation</h2>
          <p>
            Recipient: {terms.artistEmail}. Review the draft, then send it
            through your approved email account. This app does not send email.
          </p>
          <Form method="post">
            <Submit name="intent" value="invite">
              Prepare invitation link &amp; email draft
            </Submit>
          </Form>
          <p className="settlement-small">
            A new link expires in 72 hours and revokes earlier links and
            sessions. Treat the link as private access.
          </p>
          {result && 'invite' in result && result.invite && (
            <div className="settlement-callout">
              <label>
                Email draft
                <textarea
                  rows={13}
                  readOnly
                  value={`To: ${result.invite.to}\nSubject: ${result.invite.subject}\n\n${result.invite.body}`}
                />
              </label>
              <button
                type="button"
                className="settlement-button secondary"
                onClick={() => {
                  void navigator.clipboard.writeText(result.invite!.body);
                }}
              >
                Copy email text
              </button>
            </div>
          )}
          <details>
            <summary>Review the full agreement</summary>
            <pre className="settlement-admin-document">{row.document}</pre>
            <p>
              MCLIV signer: {row.mclivSigner} · {row.mclivSignedAt}
            </p>
          </details>
        </section>
      </div>
      <section className="settlement-admin-actions">
        {row.issue && (
          <div className="settlement-callout">
            <h2>Artist request</h2>
            <p>{row.issue}</p>
            <p>
              The payment deadline is unchanged. Amend terms if needed; resolve
              only after direct contact with the artist.
            </p>
            <Form method="post">
              <label className="settlement-check">
                <input type="checkbox" name="resolved" required />
                <span>
                  I resolved this request with the artist. No agreement terms
                  changed.
                </span>
              </label>
              <Submit name="intent" value="resolve">
                Record resolution
              </Submit>
            </Form>
          </div>
        )}
        <details className="settlement-form-section">
          <summary>Verify destination and approve payout</summary>
          <Form method="post">
            <input type="hidden" name="intent" value="verify" />
            <label>
              Provider recipient ID
              <input
                name="destinationRef"
                required
                defaultValue={row.destinationRef || ''}
                maxLength={160}
                placeholder="Recipient ID, never a full bank account number"
              />
            </label>
            <label>
              Account last four digits
              <input
                name="destinationLast4"
                required
                pattern="[0-9]{4}"
                maxLength={4}
                defaultValue={row.destinationLast4 || ''}
              />
            </label>
            <label>
              Verification evidence / record reference
              <textarea
                name="verificationNote"
                required
                minLength={10}
                maxLength={2000}
                defaultValue={row.verificationNote || ''}
                placeholder="Reference the provider identity check, verified contact check and cleared sale funds. No full bank numbers or tax IDs."
              />
            </label>
            {[
              [
                'fundsCleared',
                'The actual sale funds have cleared and no sale/return dispute is unresolved.',
              ],
              [
                'recipientVerified',
                'The recipient and bank destination match the artist or verified authorized payee. I verified this independently of a changed email instruction.',
              ],
              [
                'approve',
                'I reconciled all prior and pending payments and approve this exact net artist entitlement.',
              ],
            ].map(([name, label]) => (
              <label className="settlement-check" key={name}>
                <input type="checkbox" name={name} required />
                <span>{label}</span>
              </label>
            ))}
            <Submit>Record verification &amp; approval</Submit>
          </Form>
        </details>
        <details className="settlement-form-section">
          <summary>Reserve a manual payout</summary>
          <p>
            Reserve the amount here before making one transfer in the
            bank/provider. A reservation holds the balance but sends no funds.
            If a transfer times out, reconcile its status before releasing the
            reservation or retrying.
          </p>
          <Form method="post">
            <input type="hidden" name="requestId" value={requestId} />
            <label>
              Amount to reserve (USD)
              <input name="amount" required inputMode="decimal" />
            </label>
            <Submit name="intent" value="reserve">
              Reserve payout
            </Submit>
          </Form>
        </details>
        <div className="settlement-form-section">
          <h2>Payment ledger</h2>
          {payments.length === 0 ? (
            <p>No funds have been recorded as sent.</p>
          ) : (
            payments.map((p) => (
              <details key={p.id}>
                <summary>
                  {dollars(p.amountCents)} · {p.status}
                  {p.returnedCents
                    ? ` · ${dollars(p.returnedCents)} returned`
                    : ''}
                </summary>
                <p className="settlement-small">
                  Payment ID: {p.id}
                  <br />
                  Provider reference: {p.reference || 'Not yet recorded'}
                </p>
                <p>{p.evidence}</p>
                {p.status !== 'failed' && (
                  <Form method="post">
                    <input type="hidden" name="intent" value="payment" />
                    <input type="hidden" name="paymentId" value={p.id} />
                    <label>
                      Actual provider status
                      <select
                        name="status"
                        defaultValue={
                          p.status === 'confirmed' ? 'confirmed' : 'processing'
                        }
                      >
                        {p.status !== 'confirmed' && (
                          <option value="processing">
                            Processing / submitted to provider
                          </option>
                        )}
                        {p.status !== 'reserved' && (
                          <option value="confirmed">
                            Confirmed by reconciled provider records
                          </option>
                        )}
                        {p.status !== 'confirmed' && (
                          <option value="failed">
                            Failed / cancelled — verified no funds sent
                          </option>
                        )}
                      </select>
                    </label>
                    <label>
                      Unique provider transfer reference
                      <input
                        name="reference"
                        defaultValue={p.reference || ''}
                        readOnly={!!p.reference}
                        maxLength={160}
                      />
                    </label>
                    <label>
                      Total returned so far (USD)
                      <input
                        name="returned"
                        defaultValue={(p.returnedCents / 100).toFixed(2)}
                        required
                      />
                    </label>
                    <label>
                      Reconciliation evidence
                      <textarea
                        name="evidence"
                        required
                        minLength={5}
                        maxLength={2000}
                      />
                    </label>
                    <label className="settlement-check">
                      <input type="checkbox" name="reconciled" required />
                      <span>
                        I checked the actual bank/provider record. A timeout is
                        not proof of failure. This update matches the evidence.
                      </span>
                    </label>
                    <Submit>Record payment status</Submit>
                  </Form>
                )}
              </details>
            ))
          )}
        </div>
        <details className="settlement-form-section">
          <summary>Amend the agreement</summary>
          <p>
            Creates a new version and requires fresh signatures. Earlier signed
            records are retained. Pending or completed payments block this
            shortcut and need manual reconciliation first. The deadline must not
            be reset simply because paperwork changes.
          </p>
          <AgreementForm terms={terms} reviseId={row.id} />
        </details>
        <details className="settlement-form-section">
          <summary>Audit record</summary>
          {audit.map((a) => (
            <p key={a.id} className="settlement-small">
              {a.createdAt} · {a.actor}
              <br />
              {a.event}
            </p>
          ))}
        </details>
      </section>
    </Portal>
  );
}
