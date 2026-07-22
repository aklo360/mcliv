import {useEffect, useState} from 'react';
import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {Money} from '@shopify/hydrogen';
import {ProductCarousel} from '~/components/ProductCarousel';
import {ContinueToCheckoutButton} from '~/components/ContinueToCheckoutButton';
import {EVENTS} from '~/lib/activations';
import {buildMeta} from '~/lib/seo';

const DEFAULT_HANDLE = 'studio-hat';
const HERO = EVENTS.slice(0, 5);

export const meta: Route.MetaFunction = ({location}) => {
  return buildMeta({
    title: 'MCLIV Studio',
    description:
      'Creative studio at the intersection of functional art and cuisine. New York.',
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
              <span className="mono hero-caption-meta">{active.subtitle}</span>
              <span className="hero-caption-title">{active.shortTitle ?? active.title}</span>
            </Link>
            <div className="hero-meter" role="tablist" aria-label="Hero slides">
              {HERO.map((item, i) => (
                <button
                  key={item.slug}
                  type="button"
                  className={`hero-tick ${i === hero ? 'is-active' : ''}`}
                  aria-label={`Show ${item.shortTitle ?? item.title}`}
                  aria-pressed={i === hero}
                  onClick={() => setHero(i)}
                />
              ))}
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
          MCLIV is a creative studio at the intersection of functional art &amp; cuisine.
        </p>
        <p className="statement-sub mono">
          Edible objects · functional artworks · ritual spaces · prepared in New York, archived permanently.
        </p>
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
          {EVENTS.map((item, i) => (
            <li key={item.slug}>
              <Link className="work-row no-strike" to={`/activations/${item.slug}`}>
                <span className="work-num mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="work-media">
                  <img src={item.image} alt={item.title} loading="lazy" />
                </span>
                <span className="work-title">{item.title}</span>
                <span className="work-type mono">{item.category}</span>
                <span className="work-context mono">{item.subtitle}</span>
                <span className="work-cta mono" aria-hidden="true">View</span>
              </Link>
            </li>
          ))}
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
        <p className="contact-eyebrow mono">Studio</p>
        <h2 className="contact-line">
          Functional art commissions, cuisine-led activations, and studio collaborations.
        </h2>
        <a className="contact-email" href="mailto:info@mcliv.studio">
          info@mcliv.studio
        </a>
      </section>

      <SiteFooter />
    </main>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-row">
        <span className="mono">© 2026 MCLIV Studio</span>
        <span className="mono">3 World Trade Center, New York NY 10007</span>
      </div>
      <div className="footer-row footer-links mono">
        <a href="https://instagram.com/mcliv_studio" target="_blank" rel="noreferrer">
          Instagram
        </a>
        <a href="https://tiktok.com/@mcliv.studio" target="_blank" rel="noreferrer">
          TikTok
        </a>
        <a href="mailto:info@mcliv.studio">Email</a>
      </div>
    </footer>
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
      featuredImage { id url altText width height }
      images(first: 10) { nodes { id url altText width height } }
      variants(first: 5) {
        nodes { id availableForSale title price { amount currencyCode } }
      }
    }
  }
` as const;
