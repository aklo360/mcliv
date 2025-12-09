import {useEffect, useRef, useState} from 'react';
import {useLoaderData} from 'react-router';
import {FiVolume2, FiVolumeX} from 'react-icons/fi';
import type { Route } from './+types/_index';
import { Money } from '@shopify/hydrogen';
import { ProductCarousel } from '~/components/ProductCarousel';
import { ContinueToCheckoutButton } from '~/components/ContinueToCheckoutButton';

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
  const [gateDismissed, setGateDismissed] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
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

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (event: MediaQueryListEvent) => setReduceMotion(event.matches);
    mq.addEventListener('change', handler);
    if (videoRef.current) {
      videoRef.current.volume = 0.25;
    }
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleEnter = () => {
    setGateDismissed(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (contentRef.current) {
      contentRef.current.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth'});
    }
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (videoRef.current) {
      videoRef.current.muted = next;
      if (!next) {
        videoRef.current.volume = 0.25;
        videoRef.current.play().catch(() => setIsMuted(true));
      }
    }
  };

  return (
    <>
      {!gateDismissed && (
        <section className={`hero-gate ${reduceMotion ? 'hero-gate--static' : ''}`}>
          <video
            ref={videoRef}
            className="hero-video"
            autoPlay
            muted={isMuted}
            loop
            playsInline
            aria-hidden="true"
          >
            <source src="/mcliv-bg.webm" type="video/webm" />
          </video>
          <div className="hero-overlay">
            <div className="hero-center">
              <video
                className="hero-logo-video"
                autoPlay
                muted
                playsInline
                loop
                aria-label="MCLIV Studio"
              >
                <source
                  src="/mclivstudio-hevc.mp4"
                  type='video/mp4; codecs="hvc1"'
                />
                <source src="/mclivstudio.webm" type="video/webm" />
              </video>
            </div>
            <div className="hero-actions">
              <button className="hero-enter" onClick={handleEnter}>
                ENTER
              </button>
            </div>
            <button
              className="hero-audio"
              type="button"
              onClick={handleToggleMute}
              aria-pressed={!isMuted}
              aria-label={isMuted ? 'Unmute background video' : 'Mute background video'}
            >
              {isMuted ? <FiVolume2 size={16} aria-hidden /> : <FiVolumeX size={16} aria-hidden />}
              <span className="sr-only">{isMuted ? 'Unmute' : 'Mute'}</span>
            </button>
          </div>
        </section>
      )}
      <main className="product-page" ref={contentRef}>
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
                    <ContinueToCheckoutButton variantId={variant.id} />
                  </div>
                ) : (
                  <button className="primary" disabled>
                    Sold out
                  </button>
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
    </>
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
