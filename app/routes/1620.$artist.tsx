import {Form, Link, data, redirect, useActionData, useLoaderData, useNavigation} from 'react-router';
import type {Route} from './+types/1620.$artist';
import {artists, findArtist, artworkPrice, exhibition} from '~/lib/exhibition-1620';
import {EXHIBITION_PRODUCT_QUERY, getExhibitionOffer} from '~/lib/exhibition-commerce.server';
import {ExhibitionArtwork} from '~/components/ExhibitionArtwork';
import {buildMeta, SITE_URL} from '~/lib/seo';

export const meta: Route.MetaFunction = ({data: loaded}) => {
  if (!loaded) return [{title: 'Artist not found · MCLIV'}];
  const {artist} = loaded;
  return [
    ...buildMeta({title: `${artist.name} · 1620 · MCLIV`, description: artist.missingSubmission ? `${artist.name} in 1620, a group exhibition presented by MCLIV.` : `${artist.artworkName}. ${artist.materialMedia}. ${exhibition.workFormat}`, pathname: `/1620/${artist.slug}`}),
    {tagName: 'link', rel: 'canonical', href: `${SITE_URL}/1620/${artist.slug}`},
  ];
};

export async function loader({params, context}: Route.LoaderArgs) {
  if (params.artist === 'aclo') return redirect('/1620/aklo', 301);
  if (params.artist === 'gazoo-tothemoon') return redirect('/1620/gazoo', 301);
  const artist = findArtist(params.artist);
  if (!artist) throw new Response('Artist not found', {status: 404});
  let offer = getExhibitionOffer(artist, null);
  if (artist.priceAmount) {
    try {
      const {product} = await context.storefront.query(EXHIBITION_PRODUCT_QUERY, {
        variables: {handle: artist.productHandle}, cache: context.storefront.CacheNone(),
      });
      offer = getExhibitionOffer(artist, product);
    } catch {
      // Keep the exhibition readable when commerce is temporarily unavailable.
      offer = {status: 'unavailable', variantId: null};
    }
  }
  return {artist, offer};
}

export async function action({params, request, context}: Route.ActionArgs) {
  const artist = findArtist(params.artist);
  if (!artist) throw new Response('Artist not found', {status: 404});
  if (request.method !== 'POST') throw new Response('Method not allowed', {status: 405});
  const form = await request.formData();
  if (form.get('intent') !== 'buy' || !artist.priceAmount) {
    return data({error: 'This work is not available to purchase yet.'}, {status: 400});
  }
  try {
    // Recheck trusted price, currency, inventory and identity at purchase time.
    // Never accept a client-supplied price, quantity or variant ID.
    const {product} = await context.storefront.query(EXHIBITION_PRODUCT_QUERY, {
      variables: {handle: artist.productHandle}, cache: context.storefront.CacheNone(),
    });
    const offer = getExhibitionOffer(artist, product);
    if (!offer.variantId) return data({error: 'This work is currently unavailable. Please refresh the page.'}, {status: 409});
    const result = await context.cart.addLines([{merchandiseId: offer.variantId, quantity: 1}]);
    const headers = result.cart?.id ? context.cart.setCartId(result.cart.id) : new Headers();
    if (result.errors?.length || result.warnings?.length || !result.cart?.checkoutUrl) {
      return data({error: 'We could not add this work. Please check your bag before trying again.'}, {status: 409, headers});
    }
    return redirect(result.cart.checkoutUrl, {status: 303, headers});
  } catch {
    return data({error: 'Checkout is temporarily unavailable. Please check your bag before trying again.'}, {status: 503});
  }
}

export default function ExhibitionArtist() {
  const {artist, offer} = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const pending = navigation.state !== 'idle' && navigation.formData?.get('intent') === 'buy';
  const previous = artists[(artist.number - 2 + artists.length) % artists.length];
  const next = artists[artist.number % artists.length];
  return (
    <>
      <nav className="exhibition-breadcrumb" aria-label="Breadcrumb"><Link to="/1620">1620</Link><span aria-hidden="true">/</span><span>{artist.name}</span><span className="exhibition-label">{String(artist.number).padStart(2, '0')} / 18</span></nav>
      <article className="exhibition-piece">
        <ExhibitionArtwork artist={artist} eager showPlaceholderFormat={false} />
        <div className="exhibition-piece-detail">
          <p className="exhibition-label">1620</p>
          <h1>{artist.name}</h1>
          <h2>{artist.artworkName}</h2>
          <dl className="exhibition-facts">
            <div><dt>Material / media</dt><dd>{artist.materialMedia}</dd></div>
            <div><dt>Dimensions</dt><dd>{exhibition.workFormat}</dd></div>
          </dl>
          <div className="exhibition-purchase">
            <p className="exhibition-price">{artworkPrice(artist)}</p>
            <Form method="post">
              <input type="hidden" name="intent" value="buy" />
              <button type="submit" disabled={offer.status !== 'available' || pending}>
                {pending ? 'Opening checkout…' : offer.status === 'sold-out' ? 'Sold out' : 'Buy artwork'}
              </button>
            </Form>
            {offer.status === 'pending' && <p className="exhibition-purchase-note">Price and artwork details to be confirmed.</p>}
            {offer.status === 'unavailable' && <p className="exhibition-purchase-note">Online purchase will be available soon.</p>}
            {actionData?.error && <p role="alert" className="exhibition-purchase-note">{actionData.error}</p>}
          </div>
          <section className="exhibition-bio" aria-labelledby="bio-title">
            <h3 id="bio-title" className="exhibition-label">About the artist</h3>
            {artist.artistBio.split(/\n\s*\n/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
        </div>
      </article>
      <nav className="exhibition-pagination" aria-label="More artists">
        <Link to={`/1620/${previous.slug}`}><span className="exhibition-label">← Previous artist</span><span>{previous.name}</span></Link>
        <Link to="/1620#artworks">All 18 artists</Link>
        <Link to={`/1620/${next.slug}`}><span className="exhibition-label">Next artist →</span><span>{next.name}</span></Link>
      </nav>
    </>
  );
}
