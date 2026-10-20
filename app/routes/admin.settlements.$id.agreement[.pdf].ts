import type {Route} from './+types/admin.settlements.$id.agreement[.pdf]';
import {requireAdmin} from '~/lib/settlements/security.server';
import {downloadAgreement, getSettlement} from '~/lib/settlements/store.server';

export async function loader({request, context, params}: Route.LoaderArgs) {
  await requireAdmin(request, context.env);
  const row = await getSettlement(context.env, params.id);
  return downloadAgreement(context.env, params.id, row.revision);
}
