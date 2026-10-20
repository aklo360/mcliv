import {data as routeData, useActionData, useLoaderData} from 'react-router';
import type {Route} from './+types/artists.settlements.preview.aklo';
import {ArtistFlow} from '~/components/settlements/ArtistFlow';
import {
  previewCookie,
  previewSession,
  previewView,
  PREVIEW_HASH,
} from '~/lib/settlements/preview.server';
import {PRIVATE_HEADERS, readForm} from '~/lib/settlements/security.server';
import styles from '~/styles/settlements.css?url';
import signingStyles from '~/styles/signing.css?url';

export const links = () => [
  {rel: 'stylesheet', href: styles},
  {rel: 'stylesheet', href: signingStyles},
];
export const meta = () => [
  {title: 'AKLO test walkthrough | MCLIV'},
  {name: 'robots', content: 'noindex, nofollow'},
];
export const headers = () => PRIVATE_HEADERS;
export async function loader({request, context}: Route.LoaderArgs) {
  const session = await previewSession(request, context.env);
  if (!session.opened) return {authenticated: false as const};
  const view = previewView(session.signedAt);
  return view;
}
export async function action({request, context}: Route.ActionArgs) {
  const form = await readForm(request);
  const cookie = previewCookie(context.env);
  if (form.get('intent') === 'exchange')
    return routeData(
      {message: undefined},
      {
        headers: {
          ...PRIVATE_HEADERS,
          'Set-Cookie': await cookie.serialize({opened: true, signedAt: null}),
        },
      },
    );
  const session = await previewSession(request, context.env);
  if (!session.opened) return {error: 'Reopen the walkthrough to continue.'};
  if (form.get('intent') === 'help')
    return {
      message:
        'Test request complete. No message was sent and no support case was created.',
    };
  if (form.get('intent') === 'sign') {
    if (
      form.get('artistSigner')?.trim() !== 'AKLO' ||
      form.get('documentHash') !== PREVIEW_HASH ||
      form.get('consent') !== 'on' ||
      form.get('destinationComplete') !== 'on'
    )
      return {
        error:
          'Type AKLO, complete payment setup, and confirm electronic signing.',
      };
    return routeData(
      {message: 'Test complete. No legal signature or payout was recorded.'},
      {
        headers: {
          ...PRIVATE_HEADERS,
          'Set-Cookie': await cookie.serialize({
            opened: true,
            signedAt: session.signedAt || new Date().toISOString(),
          }),
        },
      },
    );
  }
  return {error: 'Unknown test action.'};
}
export default function AkloWalkthrough() {
  const data = useLoaderData<typeof loader>();
  const result = useActionData<typeof action>();
  return <ArtistFlow data={data} result={result} preview />;
}
