import {createCookie} from 'react-router';
import {findArtist} from '~/lib/exhibition-1620';
import type {ArtistView} from '~/components/settlements/ArtistFlow';
import {agreementText, cents, totals, type Terms} from './domain';
import {DRAFT_AGREEMENT} from './draft';

export const PREVIEW_HASH = 'aklo-test-walkthrough-v1';
type PreviewSession = {opened: boolean; signedAt: string | null};
export function previewCookie(env: Env) {
  if (!env.SESSION_SECRET)
    throw new Response('Preview unavailable.', {status: 503});
  return createCookie('__Secure-mcliv-aklo-walkthrough', {
    secrets: [env.SESSION_SECRET],
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/artists/settlements',
    maxAge: 3600,
  });
}
export async function previewSession(
  request: Request,
  env: Env,
): Promise<PreviewSession> {
  const session: unknown = await previewCookie(env).parse(
    request.headers.get('Cookie'),
  );
  if (
    !session ||
    typeof session !== 'object' ||
    !('opened' in session) ||
    session.opened !== true
  )
    return {opened: false, signedAt: null};
  const signedAt =
    'signedAt' in session &&
    typeof session.signedAt === 'string' &&
    Number.isFinite(Date.parse(session.signedAt))
      ? session.signedAt
      : null;
  return {opened: true, signedAt};
}
export function previewView(
  signedAt: string | null,
): Extract<ArtistView, {authenticated: true}> {
  const artist = findArtist('aklo')!;
  const amount = cents(artist.priceAmount);
  const terms: Terms = {
    artistSlug: 'aklo',
    artistName: 'AKLO',
    artistLegalName: 'AKLO',
    artistEmail: 'Not collected in this test',
    artistAddress: 'To be confirmed for the real agreement',
    artistCapacity: 'Test participant — no legal signature',
    mclivLegalName: 'MCLIV — legal party to be confirmed',
    mclivAddress: 'To be confirmed',
    title: artist.artworkName,
    description: `${artist.materialMedia}\n16 × 20 in.\nTEST ONLY: catalogue price, not a confirmed sale.`,
    orderId: 'TEST ONLY — no order',
    lineId: 'TEST ONLY — no sale line',
    saleDate: 'Not a real sale',
    dueDate: 'To be confirmed',
    artworkCents: amount,
    taxCents: 0,
    shippingCents: 0,
    totalCents: amount,
    deductionCents: 0,
    deductionReason:
      'Test calculation only; actual deductions and fees require approval.',
    method: 'ach',
    payoutUrl: '',
    feeTerms: 'Test only. No fee or bank/provider has been selected.',
    agreement: DRAFT_AGREEMENT.replace(
      /\[REPLACE WITH VERIFIED TERMS[^\]]+\]/,
      'TEST ONLY: delivery, custody, insurance and return terms will be confirmed for the real transaction.',
    ),
  };
  return {
    authenticated: true,
    terms,
    document: `TEST WALKTHROUGH — NOT A CONTRACT OR SIGNED AGREEMENT\nNo actual sale, legal signature, bank details, or payment is recorded.\n\n${agreementText(terms)}`,
    documentHash: PREVIEW_HASH,
    signedAt,
    artistSigner: signedAt ? 'AKLO — test only' : null,
    mclivSigner: 'MCLIV — test only, not countersigned',
    mclivSignedAt: 'Not signed',
    issue: null,
    fundsCleared: false,
    destinationVerified: false,
    last4: null,
    entitlement: totals(terms).artist,
    payments: [],
  };
}
