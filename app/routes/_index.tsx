import {brandText} from '~/components/BrandMark';
import {useEffect, useState} from 'react';
import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {Money} from '@shopify/hydrogen';
import {ProductCarousel} from '~/components/ProductCarousel';
import {ContinueToCheckoutButton} from '~/components/ContinueToCheckoutButton';
import {ACTIVATIONS, EVENTS} from '~/lib/activations';
import {PRODUCT_BY_HANDLE_QUERY} from '~/lib/product-query';
import {buildMeta} from '~/lib/seo';

const DEFAULT_HANDLE = 'studio-hat';
/* Hero order is curated independently of the index list: Paris leads. */
const HERO_ORDER = [
  'chaises-musicales',
  'pantalon-mikael-muradian',
  'apoc-nothing-ear-3',
  'the-art-of-giving',
  'mcliv-in-studio-dinner',
  'alternating-currents',
];
const HERO = HERO_ORDER.flatMap((slug) => {
  const match = ACTIVATIONS.find((event) => event.slug === slug);
  return match ? [match] : [];
});

export const meta: Route.MetaFunction = ({location}) => {
  return buildMeta({
    title: 'MCLIV Studio',
    description:
      'Creative studio & event production company at the intersection of fine art & hospitality. New York.',
    pathname: location.pathname,
  });
};

export async function loader({context}: Route.LoaderArgs) {
  const handle = context.env.PRIMARY_PRODUCT_HANDLE || DEFAULT_HANDLE;
  try {
    const data = await context.storefront.query(PRODUCT_BY_HANDLE_QUERY, {
      variables: {handle},
    });
    return {product: data.product, handle, storeDomain: context.env.PUBLIC_STORE_DOMAIN};
  } catch (error) {
    console.error(error);
    return {product: null, handle, storeDomain: context.env.PUBLIC_STORE_DOMAIN};
  }
}

export default function HomePage() {
  const {product, handle, storeDomain} = useLoaderData<typeof loader>();
  const [hero, setHero] = useState(0);

  useEffect(() => {
    if (HERO.length < 2) return;
    const id = setInterval(() => setHero((h) => (h + 1) % HERO.length), 5500);
    return () => clearInterval(id);
  }, []);

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
  const active = HERO[hero];

  return (
    <main className="home">
      {/* ---- Full-screen slideshow hero ---- */}
      <section className="home-hero" aria-label="MCLIV">
        <div className="hero-stage">
          {HERO.map((item, i) => {
            const mobileSrc = item.image?.replace(/(\.[^.]+)$/, '-v$1');
            return (
              <figure
                key={item.slug}
                className={`hero-slide ${i === hero ? 'is-active' : ''}`}
                aria-hidden={i !== hero}
              >
                <picture>
                  {mobileSrc && <source media="(max-width: 768px)" srcSet={mobileSrc} />}
                  <img src={item.image} alt={item.title} loading={i === 0 ? 'eager' : 'lazy'} />
                </picture>
              </figure>
            );
          })}
          <div className="hero-scrim" aria-hidden="true" />
        </div>

        <div className="hero-overlay">
          <div className="hero-foot">
            <Link className="hero-caption no-strike" to={`/activations/${active.slug}`}>
              <span className="mono hero-caption-meta">{brandText(active.subtitle)}</span>
              <span className="hero-caption-title">{brandText(active.shortTitle ?? active.title)}</span>
            </Link>
            <div className="hero-meter" aria-label="Hero slides">
              <button
                type="button"
                className="hero-arrow"
                aria-label="Previous slide"
                onClick={() => setHero((hero + HERO.length - 1) % HERO.length)}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                  <path d="M15 5 8 12l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                </svg>
              </button>
              <button
                type="button"
                className="hero-arrow"
                aria-label="Next slide"
                onClick={() => setHero((hero + 1) % HERO.length)}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                  <path d="m9 5 7 7-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
                </svg>
              </button>
              <span className="hero-counter mono">
                {String(hero + 1).padStart(2, '0')} / {String(HERO.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Studio statement ---- */}
      <section className="home-statement">
        <p className="statement-lede">
          {brandText('MCLIV is a creative studio & event production company at the intersection of fine art & cuisine.')}
        </p>
        <p className="statement-sub mono">
          Multisensory Experiences · Functional Art · Interior Design · Hospitality Branding
        </p>
        <Link className="button statement-cta no-strike" to="/about">
          Learn more
        </Link>
      </section>

      {/* ---- Selected work / archive index ---- */}
      <section className="home-index" aria-label="Selected work">
        <div className="index-head">
          <span className="mono index-label">Selected Work</span>
          <Link className="mono index-archive" to="/activations">
            Full archive →
          </Link>
        </div>
        <ol className="work-list">
          {EVENTS.map((item, i) => {
            const pressLinks = (item.press ?? [])
              .filter((p) => p.url.startsWith('http'))
              .slice(0, 2);
            return (
              <li key={item.slug}>
                <div className="work-row">
                  <Link
                    className="work-row-link no-strike"
                    to={`/activations/${item.slug}`}
                    aria-label={item.title}
                  />
                  <span className="work-num mono">{String(i + 1).padStart(2, '0')}</span>
                  <span className="work-media">
                    <img src={item.image} alt={item.title} loading="lazy" />
                  </span>
                  <span className="work-title">{brandText(item.title)}</span>
                  <span className="work-type mono">{item.category}</span>
                  <span className="work-press mono">
                    {pressLinks.map((p) => (
                      <a key={p.url} href={p.url} target="_blank" rel="noreferrer">
                        {p.label}
                      </a>
                    ))}
                  </span>
                  <span className="work-context mono">{brandText(item.subtitle)}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      {/* ---- Object / edition ---- */}
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
      ) : null}

      {/* ---- Contact ---- */}
      <section className="home-contact" aria-label="Contact">
        <p className="contact-eyebrow mono">Contact</p>
        <h2 className="contact-line">
          Functional art commissions, cuisine-led activations, and studio collaborations:
        </h2>
        <a className="contact-email" href="mailto:info@mcliv.studio">
          info@mcliv.studio
        </a>
      </section>

    </main>
  );
}
