import {Money} from '@shopify/hydrogen';
import {useLoaderData} from 'react-router';
import type {Route} from './+types/shop';
import {ProductCarousel} from '~/components/ProductCarousel';
import {ContinueToCheckoutButton} from '~/components/ContinueToCheckoutButton';
import {PRODUCT_BY_HANDLE_QUERY} from '~/lib/product-query';
import {buildMeta} from '~/lib/seo';

const DEFAULT_HANDLE = 'studio-hat';

export const meta: Route.MetaFunction = ({location}) => {
  return buildMeta({
    title: 'Shop · MCLIV Studio',
    description: 'Objects and editions from MCLIV Studio.',
    pathname: location.pathname,
  });
};

export async function loader({context}: Route.LoaderArgs) {
  const handle = context.env.PRIMARY_PRODUCT_HANDLE || DEFAULT_HANDLE;
  try {
    const data = await context.storefront.query(PRODUCT_BY_HANDLE_QUERY, {
      variables: {handle},
    });
    return {product: data.product, handle};
  } catch (error) {
    console.error(error);
    return {product: null, handle};
  }
}

export default function ShopPage() {
  const {product, handle} = useLoaderData<typeof loader>();
  const variant = product?.variants?.nodes?.[0];
  const productImages = product?.images?.nodes ?? [];
  const images = productImages
    .filter((img) => !!img?.url)
    .map((img, idx) => ({
      id: img.id ?? `image-${idx}`,
      url: img.url,
      altText: img.altText ?? null,
      width: img.width ?? undefined,
      height: img.height ?? undefined,
    }));
  const fallbackUrl = `https://mcliv.studio/products/${handle}`;

  return (
    <main className="content-page shop-page">
      <header className="detail-masthead">
        <p className="eyebrow">Shop</p>
        <h1 className="detail-title">Art Objects &amp; Wearables</h1>
      </header>

      {product ? (
        <section className="home-object" aria-label="Object">
          <div className="object-media">
            <ProductCarousel images={images} title={product.title} />
          </div>
          <div className="object-info">
            <span className="mono object-eyebrow">Object 01 · Edition</span>
            <h2 className="object-title">{product.title}</h2>
            <div
              className="object-desc"
              dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
            />
            <div className="object-buy">
              {variant ? (
                <>
                  <span className="object-price mono">
                    <Money data={variant.price} />
                  </span>
                  {variant.availableForSale ? (
                    <ContinueToCheckoutButton variantId={variant.id} />
                  ) : (
                    <button className="button" disabled>
                      Sold out
                    </button>
                  )}
                </>
              ) : (
                <a className="button" href={fallbackUrl}>
                  View on Shopify
                </a>
              )}
            </div>
          </div>
        </section>
      ) : (
        <p className="shop-empty mono">The shop is momentarily closed.</p>
      )}
    </main>
  );
}
