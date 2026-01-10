import {useLoaderData} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {Route} from './+types/archive';
import {ContinueToCheckoutButton} from '~/components/ContinueToCheckoutButton';
import {buildMeta} from '~/lib/seo';

const DEFAULT_HANDLE = 'capsule-collection-001';

export const meta: Route.MetaFunction = ({data, location}) => {
  const title = data?.product?.title
    ? `${data.product.title} · Legacy · MCLIV Studio`
    : 'MCLIV Studio · Legacy Layout';
  return buildMeta({title, pathname: location.pathname});
};

export async function loader({context}: Route.LoaderArgs) {
  const handle = context.env.PRIMARY_PRODUCT_HANDLE || DEFAULT_HANDLE;
  try {
    const product = await context.storefront.query(PRODUCT_BY_HANDLE_QUERY_ARCHIVE, {
      variables: {handle},
    });
    return {product: product.product, handle};
  } catch (error) {
    console.error(error);
    return {product: null, handle};
  }
}

export default function ArchivePage() {
  const {product, handle} = useLoaderData<typeof loader>();
  const primaryVariant = product?.variants?.nodes?.[0];
  const primaryImage = product?.images?.nodes?.[0];
  const fallbackProductUrl = `https://mcliv.studio/products/${handle}`;

  return (
    <main className="archive-page">
      <section className="archive-hero">
        {!product ? (
          <div className="archive-unavailable">
            <h1>Product unavailable</h1>
            <p>
              We could not load the release details. Please check your Shopify credentials or open
              the product page directly.
            </p>
            <a className="primary" href={fallbackProductUrl}>
              Open in Shopify
            </a>
          </div>
        ) : (
          <div className="archive-grid">
            <div className="archive-media">
              <div className="archive-primary">
                {primaryImage && (
                  <Image
                    data={primaryImage}
                    sizes="(min-width: 1024px) 50vw, 90vw"
                    className="archive-img"
                    loading="eager"
                  />
                )}
              </div>
              {product.images?.nodes && product.images.nodes.length > 1 && (
                <div className="archive-thumbs">
                  {product.images.nodes.slice(1).map((img) => (
                    <div className="archive-thumb" key={img.id ?? img.url}>
                      <Image
                        data={img}
                        sizes="140px"
                        className="archive-thumb-img"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="archive-copy">
              <p className="eyebrow">Limited Release</p>
              <h1 className="archive-title">{product.title}</h1>
              <div
                className="description"
                dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
              />

              {primaryVariant ? (
                <div className="archive-purchase">
                  <div className="archive-price">
                    <Money data={primaryVariant.price} />
                    <span className="meta">MCLIV / 1154 / No. 001</span>
                  </div>
                  <ContinueToCheckoutButton variantId={primaryVariant.id} />
                  {!primaryVariant.availableForSale && (
                    <p className="muted">Currently unavailable.</p>
                  )}
                </div>
              ) : (
                <a className="primary" href={fallbackProductUrl}>
                  View on Shopify
                </a>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

const PRODUCT_BY_HANDLE_QUERY_ARCHIVE = `#graphql
  query ProductByHandleArchive($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      descriptionHtml
      handle
      images(first: 10) {
        nodes {
          id
          url
          altText
          width
          height
        }
      }
      variants(first: 5) {
        nodes {
          id
          availableForSale
          title
          price {
            amount
            currencyCode
          }
        }
      }
    }
  }
` as const;
