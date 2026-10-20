import type {Route} from './+types/artists.settlements.$id.agreement[.pdf]';
import {artistSession} from '~/lib/settlements/security.server';
import {downloadAgreement} from '~/lib/settlements/store.server';

export async function loader({request, context, params}: Route.LoaderArgs) {
  const session = await artistSession(request, context.env, params.id);
  if (!session)
    throw new Response(
      'Open your private invitation to download the agreement.',
      {status: 401},
    );
  return downloadAgreement(context.env, params.id, session.revision);
}
