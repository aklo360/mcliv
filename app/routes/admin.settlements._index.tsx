import {redirect, useActionData, useLoaderData} from 'react-router';
import type {Route} from './+types/admin.settlements._index';
import {Portal, Notice} from '~/components/settlements/Portal';
import {AgreementForm} from '~/components/settlements/AgreementForm';
import {deadlineLabel, dollars, type Terms} from '~/lib/settlements/domain';
import {
  PRIVATE_HEADERS,
  readForm,
  requireAdmin,
} from '~/lib/settlements/security.server';
import {createAgreement, listSettlements} from '~/lib/settlements/store.server';
import styles from '~/styles/settlements.css?url';
export const links = () => [{rel: 'stylesheet', href: styles}];
export const meta = () => [
  {title: 'Artist payment queue | MCLIV'},
  {name: 'robots', content: 'noindex, nofollow'},
];
export const headers = () => PRIVATE_HEADERS;
export async function loader({request, context}: Route.LoaderArgs) {
  await requireAdmin(request, context.env);
  const rows = await listSettlements(context.env);
  return {
    rows: rows.map((r) => ({
      id: r.id,
      terms: JSON.parse(r.terms) as Terms,
      entitlement: r.entitlementCents,
      paid: r.paidCents === r.entitlementCents && r.entitlementCents > 0,
      signed: !!r.signedAt,
      issue: !!r.issue,
    })),
    create: new URL(request.url).searchParams.has('new'),
  };
}
export async function action({request, context}: Route.ActionArgs) {
  const actor = await requireAdmin(request, context.env);
  const form = await readForm(request);
  try {
    const id = await createAgreement(context.env, form, actor);
    return redirect(`/admin/settlements/${id}`);
  } catch (error) {
    if (error instanceof Response) throw error;
    return {
      error:
        error instanceof Error &&
        !/D1|SQL|constraint|UNIQUE/i.test(error.message)
          ? error.message
          : 'Agreement could not be saved. Check for an existing settlement for this order line or an active payment before amending.',
    };
  }
}
export default function Queue() {
  const {rows, create} = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  return (
    <Portal admin>
      <div className="settlement-heading">
        <p className="settlement-eyebrow">1620 / Artist services</p>
        <h1>Artist payments.</h1>
        <p>
          Agreements, payment setup, and settlement records for each sold work.
        </p>
      </div>
      <Notice message={result?.error} />
      {create || result?.error ? (
        <>
          <a href="/admin/settlements">Back to queue</a>
          <AgreementForm />
        </>
      ) : (
        <>
          <a
            className="settlement-button"
            style={{width: 'auto'}}
            href="?new=1"
          >
            Prepare an artist agreement
          </a>
          {rows.length ? (
            rows.map((row) => (
              <a
                className="settlement-row"
                key={row.id}
                href={`/admin/settlements/${row.id}`}
              >
                <div>
                  <strong>{row.terms.artistName}</strong>
                  <br />
                  {row.terms.title}
                </div>
                <div>
                  {row.signed
                    ? 'Agreement signed'
                    : 'Awaiting artist signature'}
                  <br />
                  {deadlineLabel(row.terms.dueDate, row.paid, row.issue)}
                </div>
                <strong>{dollars(row.entitlement)}</strong>
              </a>
            ))
          ) : (
            <div className="settlement-callout">
              <h2>Lola is first.</h2>
              <p>
                Prepare her verified sale, legal parties, agreement, and
                bank/provider link. Use the same flow for each artist as their
                work sells.
              </p>
              <p className="settlement-small">
                No sale amount or legal identity has been assumed.
              </p>
            </div>
          )}
        </>
      )}
    </Portal>
  );
}
