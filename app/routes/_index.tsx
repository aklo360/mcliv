import { useEffect, useRef, useState } from 'react';
import { useLoaderData } from 'react-router';
import { FiVolume2, FiVolumeX } from 'react-icons/fi';
import type { Route } from './+types/_index';
import { Image as HydrogenImage, Money } from '@shopify/hydrogen';
import { ProductCarousel } from '~/components/ProductCarousel';
import { ContinueToCheckoutButton } from '~/components/ContinueToCheckoutButton';
import Sculpture from '~/components/Sculpture';

const DEFAULT_HANDLE = 'capsule-collection-001';

export const meta: Route.MetaFunction = ({ data }) => {
  return [{ title: 'MCLIV Studio' }];
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
  const [isChromeIOS, setIsChromeIOS] = useState(false);
  const [activationIndex, setActivationIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const variant = product?.variants?.nodes?.[0];
  const images = product?.images?.nodes ?? [];
  const carouselImages = images
    .filter((img) => !!img?.url)
    .map((img, idx) => ({
      id: img.id ?? `image-${idx}-${img.url}`,
      url: img.url,
      altText: img.altText ?? null,
      width: img.width ?? undefined,
      height: img.height ?? undefined,
    }));
  const pressItems = [
    { label: 'Design Week', copy: 'Frequency as form, built for presence.' },
    { label: 'Surface', copy: 'Architectural calm for the senses.' },
    { label: 'Hypebeast', copy: '1154 capsule series redefining drops.' },
  ];
  const activations = [
    {
      title: 'Chaises Musicales: Art Salon & Dinner',
      meta: 'Art Basel Paris 2025 · Curated by Vanessa Fuchs · Chef/Artist: John Black',
      subtitle: 'DREAM Architects · Paris',
      copy: 'Presented during Art Basel Paris 2025 by NYC Culture Club, MCLIV founder John Black helmed the kitchen and exhibited new work in a multisensory experience of food, art, and sound.',
      press: [
        {
          label: 'Whitewall',
          url: 'https://whitewall.art/lifestyle/paris-fete-inside-the-most-exclusive-events-of-art-basel-paris-week/',
        },
        {
          label: 'Vogue Italia',
          url: 'https://www.vogue.it/article/art-basel-paris-2025-installazioni-piu-incredibili',
        },
      ],
      image: '/images/activations/cm1.jpeg',
    },
    {
      title: "APOC's US Debut · NOTHING Ear(3)",
      meta: 'New York Fashion Week · Fall 2025',
      subtitle: 'Earshot · New York City',
      copy: 'Sculptural display system for the NOTHING Ear(3) launch at APOC’s first US pop-up during fall NYFW 2025.',
      press: [
        {
          label: 'Office Mag',
          url: 'https://officemagazine.net/apocs-us-debut',
        },
        {
          label: 'Dazed',
          url: 'https://www.dazeddigital.com/fashion/article/68721/1/apoc-londons-coolest-online-concept-store-has-come-to-new-york-nothing-adorno',
        },
      ],
      image: '/images/activations/apoc1.jpeg',
    },
    {
      title: 'The Art of Giving',
      meta: 'Singapore · April 2025 · Peranakan Museum x Employees Only',
      subtitle: 'Peranakan Museum · Singapore',
      copy: 'A dialogue and private event in collaboration with Employees Only, with hors d’oeuvres by John Black, transforming the Peranakan Museum, Singapore into an intimate tasting and conversation on giving & philanthropy.',
      pressTitle: 'Watch',
      press: [
        {
          label: 'Recap',
          url: 'https://www.instagram.com/p/DH_o3DsyiF2/?img_index=1&igsh=MTg0MG1taDF3aHFpbA==',
        },
      ],
      image: '/images/activations/aog1.jpeg',
    },
    {
      title: 'MCLIV In-Studio Dinner',
      meta: 'New York · January 2025 · WTC3 Residency',
      subtitle: 'MCLIV Studio · New York City',
      copy: 'We transformed the MCLIV work studio in WTC3 into a private fine-dining experience, pairing the viewing of in-progress works with a bespoke tasting menu.',
      pressTitle: 'Watch',
      press: [
        {
          label: 'Recap',
          url: '/images/activations/instudio.webm',
        },
      ],
      image: '/images/activations/instudio1.jpeg',
    },
    {
      title: 'Alternating Currents',
      meta: 'Key West · April 2024 · Sanger Gallery',
      subtitle: 'Sanger Gallery · Key West, FL',
      copy: 'Invite-only art exhibition and private dinner @ Sanger Gallery in Key West where MCLIV founder John Black served as chef and solo artist, blending culinary courses with his studies in color and technique.',
      press: [
        {
          label: 'TSKW',
          url: 'https://tskw.org/alternating-currents-john-black/',
        },
        {
          label: 'Florida Weekly',
          url: 'https://www.floridaweekly.com/articles/key-west-key-west-arts-and-entertainment-news/the-color-theory-of-john-blacks-alternating-currents/',
        },
      ],
      image: '/images/activations/ackw1.jpeg',
    },
  ];
  const services = [
    {
      title: 'Brand Systems',
      copy: 'Identity, typographic grids, packaging, and environmental graphics.',
    },
    {
      title: 'Digital & Motion',
      copy: 'Headless storefronts, launch sites, micro-interactions, and product films.',
    },
    {
      title: 'Content & Media',
      copy: 'Photo direction, color pipelines, and evergreen editorial toolkits.',
    },
    {
      title: 'Experiential',
      copy: 'Spatial concepts, partner collabs, live fabrication, and residency programming.',
    },
  ];
  const fallbackUrl = storeDomain
    ? `https://${storeDomain}/products/${handle}`
    : `https://studiomcliv.myshopify.com/products/${handle}`;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = (event: MediaQueryListEvent) => setReduceMotion(event.matches);
    mq.addEventListener('change', handler);
    if (videoRef.current) {
      videoRef.current.volume = 0.25;
    }
    if (typeof navigator !== 'undefined' && /CriOS/i.test(navigator.userAgent)) {
      setIsChromeIOS(true);
    }
    return () => mq.removeEventListener('change', handler);
  }, []);

  const handleEnter = () => {
    setGateDismissed(true);
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
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

  if (!product) {
    return (
      <main className="product-page">
        <section className="product-content">
          <div className="product-copy">
            <p className="eyebrow">Limited Release</p>
            <h1>Product unavailable</h1>
            <p className="muted">
              We couldn&apos;t load this release. Check your storefront token and domain, or open the
              Shopify product page directly.
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
            <track kind="captions" src="data:text/vtt,WEBVTT" label="Muted background" />
          </video>
          <div className={`hero-overlay ${isChromeIOS ? 'hero-overlay--chrome' : ''}`}>
            <div className="hero-center">
              <video
                className="hero-logo-video"
                autoPlay
                muted
                playsInline
                loop
                aria-label="MCLIV Studio"
              >
                <source src="/mclivstudio-hevc.mp4" type='video/mp4; codecs="hvc1"' />
                <source src="/mclivstudio.webm" type="video/webm" />
                <track kind="captions" src="data:text/vtt,WEBVTT" label="MCLIV logo mark" />
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
        <section className="section-shell sculpture-section">
          <div className="sculpture-wrap sculpture-wrap--transparent">
            <Sculpture />
          </div>
        </section>

        <section className="section-shell about">
          <div className="section-header section-header--center section-header--spaced">
            <p className="section-lede text-center">
              MCLIV /ˌɛm siː ɛl ˈaɪ viː/ (Roman numeral: 1154) is a NYC based creative studio with a focus on functional art and multidisciplinary
              design. We produce limited-run capsule collections and experiential activations that
              subvert the way we think about the world while creating lasting transformative impact
              beyond mere spectacle.
            </p>
          </div>
        </section>

        <section className="section-shell activations">
          <div className="section-header section-header--center">
            <h2 className="section-title text-center">ACTIVATIONS</h2>
          </div>
          <div className="activation-carousel">
            <div className="activation-frame">
              {activations.map((activation, i) => (
                <article
                  key={activation.title}
                  className={`activation-slide ${i === activationIndex ? 'active' : ''}`}
                  aria-hidden={i !== activationIndex}
                >
                  <div className="activation-media">
                    {(() => {
                      const mobileSrc = activation.image?.replace(/(\.[^.]+)$/, '-v$1');
                      return (
                        <picture>
                          {mobileSrc && (
                            <source media="(max-width: 640px)" srcSet={mobileSrc} />
                          )}
                          <img
                            src={activation.image}
                            alt={activation.title}
                            className="activation-img"
                            loading={i === activationIndex ? 'eager' : 'lazy'}
                          />
                        </picture>
                      );
                    })()}
                    <div className="activation-overlay">
                      <div className="activation-overlay-text">
                        <h3>{activation.title}</h3>
                        {activation.subtitle && (
                          <p className="activation-subtitle">{activation.subtitle}</p>
                        )}
                        <p>{activation.copy}</p>
                        {activation.press && (
                          <div className="activation-press">
                            <span>{activation.pressTitle ?? 'Press'}</span>
                            <div className="activation-press-links">
                              {activation.press.map((item) => (
                                <a key={item.url} href={item.url} target="_blank" rel="noreferrer">
                                  {item.label}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {activations.length > 1 && (
              <div className="activation-controls">
                <button
                  type="button"
                  aria-label="Previous activation"
                  onClick={() =>
                    setActivationIndex((prev) => (prev - 1 + activations.length) % activations.length)
                  }
                >
                  ‹
                </button>
                <div className="activation-dots" role="tablist" aria-label="Activation slides">
                  {activations.map((activation, i) => (
                    <button
                      key={activation.title}
                      type="button"
                      className={`dot ${i === activationIndex ? 'active' : ''}`}
                      aria-label={`Go to activation ${i + 1}`}
                      aria-pressed={i === activationIndex}
                      onClick={() => setActivationIndex(i)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  aria-label="Next activation"
                  onClick={() => setActivationIndex((prev) => (prev + 1) % activations.length)}
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="section-shell releases">
          <div className="section-header section-header--center">
            <h2 className="section-title text-center">RELEASES</h2>
          </div>
          <div className="product-grid">
            <div className="product-media">
              <ProductCarousel images={carouselImages} title={product.title} />
            </div>

            <div className="product-copy">
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
          </div>
        </section>

        <section className="section-shell creative">
          <div className="section-header section-header--center">
            <h2 className="section-title text-center">CREATIVE</h2>
            <p className="section-lede text-center">
              For all creative service needs including Brand Identity Systems Design, Web Development,
              Photo &amp; Video Production &amp; more please inquire via email:
            </p>
          </div>
          <div className="contact-cta">
            <a className="primary contact-button" href="mailto:info@mcliv.studio">
              info@mcliv.studio
            </a>
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
