import type {Route} from './+types/artists.settlements.preview.aklo.agreement[.pdf]';
import {
  previewSession,
  previewView,
  PREVIEW_HASH,
} from '~/lib/settlements/preview.server';
import {signedPdf} from '~/lib/settlements/pdf.server';
import {PRIVATE_HEADERS} from '~/lib/settlements/security.server';

export async function loader({request, context}: Route.LoaderArgs) {
  const session = await previewSession(request, context.env);
  if (!session.opened || !session.signedAt)
    throw new Response('Complete the test first.', {status: 403});
  const view = previewView(session.signedAt);
  const pdf = await signedPdf(
    view.document,
    PREVIEW_HASH,
    'TEST ONLY',
    session.signedAt,
    'AKLO — TEST ONLY',
    session.signedAt,
    1,
    true,
  );
  return new Response(new Uint8Array(pdf).buffer, {
    headers: {
      ...PRIVATE_HEADERS,
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="AKLO-test-agreement.pdf"',
    },
  });
}
