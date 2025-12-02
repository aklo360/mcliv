import { useLoaderData } from 'react-router';
import type { Route } from './+types/_index';
import { Money } from '@shopify/hydrogen';
import { AddToCartButton } from '~/components/AddToCartButton';
import { ProductCarousel } from '~/components/ProductCarousel';
import { ContinueToCheckoutButton } from '~/components/ContinueToCheckoutButton';
import { useAside } from '~/components/Aside';

const DEFAULT_HANDLE = 'capsule-collection-001';

export const meta: Route.MetaFunction = ({ data }) => {
  if (!data?.product) {
    return [{ title: 'Product unavailable · MCLIV Studio' }];
  }
  return [{ title: `${data.product.title} · MCLIV Studio` }];
};

export async function loader({ context }: Route.LoaderArgs) {
  const handle = context.env.PRIMARY_PRODUCT_HANDLE || DEFAULT_HANDLE;

  try {
    const data = await context.storefront.query(PRODUCT_BY_HANDLE_QUERY, {
      variables: { handle },
    });

    return {
      product: data.product,
      handle,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    };
  } catch (error) {
    console.error(error);
    return {
      product: null,
      handle,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    };
  }
}

export default function SingleProductPage() {
  const { product, handle, storeDomain } = useLoaderData<typeof loader>();
  const { open } = useAside();
  const variant = product?.variants?.nodes?.[0];
  const images = product?.images?.nodes ?? [];
  const fallbackUrl = storeDomain
    ? `https://${storeDomain}/products/${handle}`
    : `https://studiomcliv.myshopify.com/products/${handle}`;

  if (!product) {
    return (
      <main className="product-page">
        <section className="product-content">
          <div className="product-copy">
            <p className="eyebrow">Limited Release</p>
            <h1>Product unavailable</h1>
            <p className="muted">
              We couldn&apos;t load this release. Check your storefront token and
              domain, or open the Shopify product page directly.
            </p>
            <a className="primary" href={fallbackUrl}>
              View on Shopify
            </a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="product-page">
      <section className="product-content">
        <div className="product-media">
          <ProductCarousel images={images} title={product.title} />
        </div>

        <div className="product-copy">
          <p className="eyebrow">Limited Release</p>
          <h1>{product.title}</h1>
          <div
            className="description"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />

          {variant ? (
            <div className="purchase">
              <div className="price">
                <Money data={variant.price} />
              </div>
              {variant.availableForSale ? (
                <div className="purchase-row">
                  <AddToCartButton
                    onClick={() => open('cart')}
                    lines={[
                      {
                        merchandiseId: variant.id,
                        quantity: 1,
                      },
                    ]}
                  >
                    Add to cart
                  </AddToCartButton>
                  <ContinueToCheckoutButton variantId={variant.id} />
                </div>
              ) : (
                <AddToCartButton
                  lines={[
                    {
                      merchandiseId: variant.id,
                      quantity: 1,
                    },
                  ]}
                  disabled
                >
                  Sold out
                </AddToCartButton>
              )}
            </div>
          ) : (
            <a className="primary" href={fallbackUrl}>
              View on Shopify
            </a>
          )}
        </div>
      </section>
    </main>
  );
}

const PRODUCT_BY_HANDLE_QUERY = `#graphql
  query ProductByHandle($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      descriptionHtml
      handle
      featuredImage {
        id
        url
        altText
        width
        height
      }
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
