import {
  data as routeData,
  useActionData,
  useLoaderData,
  useRouteError,
  isRouteErrorResponse,
} from 'react-router';
import type {Route} from './+types/artists.settlements.$id';
import {Portal} from '~/components/settlements/Portal';
import {ArtistFlow} from '~/components/settlements/ArtistFlow';
import type {Terms} from '~/lib/settlements/domain';
import {
  artistSession,
  db,
  exchangeInvite,
  PRIVATE_HEADERS,
  readForm,
} from '~/lib/settlements/security.server';
import {
  getPayments,
  getSettlement,
  requestHelp,
  signAgreement,
} from '~/lib/settlements/store.server';
import styles from '~/styles/settlements.css?url';
import signingStyles from '~/styles/signing.css?url';

export const links = () => [
  {rel: 'stylesheet', href: styles},
  {rel: 'stylesheet', href: signingStyles},
];
export const meta = () => [
  {title: 'Artist payment | MCLIV'},
  {name: 'robots', content: 'noindex, nofollow'},
];
export const headers = () => PRIVATE_HEADERS;

export async function loader({request, context, params}: Route.LoaderArgs) {
  db(context.env);
  const session = await artistSession(request, context.env, params.id);
  if (!session) return {authenticated: false as const};
  const row = await getSettlement(context.env, params.id);
  const terms = JSON.parse(row.terms) as Terms;
  const payments = await getPayments(context.env, params.id);
  return {
    authenticated: true as const,
    terms,
    document: row.document,
    documentHash: row.documentHash,
    signedAt: row.signedAt,
    artistSigner: row.artistSigner,
    mclivSigner: row.mclivSigner,
    mclivSignedAt: row.mclivSignedAt,
    issue: row.issue,
    fundsCleared: !!row.fundsCleared,
    destinationVerified: !!row.recipientVerified,
    last4: row.destinationLast4,
    entitlement: row.entitlementCents,
    payments: payments.map((p) => ({
      id: p.id,
      status: p.status,
      amountCents: p.amountCents,
      returnedCents: p.returnedCents,
      updatedAt: p.updatedAt,
    })),
  };
}
export async function action({request, context, params}: Route.ActionArgs) {
  const form = await readForm(request);
  try {
    if (form.get('intent') === 'exchange') {
      const cookie = await exchangeInvite(
        request,
        context.env,
        params.id,
        form.get('token') || '',
      );
      return routeData(
        {opened: true},
        {headers: {'Set-Cookie': cookie, ...PRIVATE_HEADERS}},
      );
    }
    const session = await artistSession(request, context.env, params.id);
    if (!session)
      throw new Response(
        'Your session expired. Contact MCLIV for a new private link.',
        {status: 401},
      );
    if (form.get('intent') === 'sign')
      await signAgreement(context.env, params.id, session.revision, form);
    else if (form.get('intent') === 'help')
      await requestHelp(
        context.env,
        params.id,
        form.get('reason')?.trim() || '',
      );
    else throw new Error('Unknown action.');
    return {
      message:
        form.get('intent') === 'help'
          ? 'Your request is in MCLIV’s queue. Your payment deadline is unchanged.'
          : 'Your agreement is signed. You can download a copy below.',
    };
  } catch (error) {
    if (error instanceof Response) throw error;
    return {
      error:
        error instanceof Error &&
        !/D1|SQL|constraint|UNIQUE/i.test(error.message)
          ? error.message
          : 'This request could not be completed. Reload to check its status before trying again.',
    };
  }
}
export default function ArtistSettlement() {
  const data = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  return <ArtistFlow data={data} result={result} />;
}
export function ErrorBoundary() {
  const error = useRouteError();
  return (
    <Portal>
      <h1>We can help.</h1>
      <p>
        {isRouteErrorResponse(error) && typeof error.data === 'string'
          ? error.data
          : 'The artist payment page is unavailable. Contact info@mcliv.studio.'}
      </p>
      <a href="mailto:info@mcliv.studio">Contact MCLIV</a>
    </Portal>
  );
}
