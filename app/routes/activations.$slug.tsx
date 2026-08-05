import {brandText} from '~/components/BrandMark';
import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/activations.$slug';
import {
  ACTIVATION_PRODUCT_MEDIA_QUERY,
  EVENTS,
  WORKS,
  getActivation,
  productToActivationMedia,
} from '~/lib/activations';
import {MediaCarousel} from '~/components/MediaCarousel';
import {SITE_URL, buildMeta} from '~/lib/seo';

export const meta: Route.MetaFunction = ({data, location}) => {
  const activation = data?.activation;
  const image = activation?.image
    ? activation.image.startsWith('http')
      ? activation.image
      : `${SITE_URL}${activation.image}`
    : undefined;
  return buildMeta({
    title: activation ? `${activation.title} · MCLIV Studio` : 'Activation · MCLIV Studio',
    description: activation?.copy,
    pathname: location.pathname,
    image,
  });
};

export async function loader({params, context}: Route.LoaderArgs) {
  const base = getActivation(params.slug);
  if (!base) {
    throw new Response('Activation not found', {status: 404});
  }

  // Collections source their media from a Shopify product, not local files.
  let activation = base;
  if (base.productHandle) {
    try {
      const data = await context.storefront.query(ACTIVATION_PRODUCT_MEDIA_QUERY, {
        variables: {handle: base.productHandle},
      });
      const media = productToActivationMedia(data.product);
      if (media.gallery.length) {
        activation = {...base, image: media.image || base.image, gallery: media.gallery};
      }
    } catch (error) {
      console.error(error);
    }
  }

  return {activation};
}

export default function ActivationDetail() {
  const {activation} = useLoaderData<typeof loader>();
  const isWork = activation.kind === 'work';
  const siblings = isWork ? WORKS : EVENTS;
  const backTo = isWork ? '/work' : '/activations';
  const backLabel = isWork ? 'Work' : 'Activations';
  const index = siblings.findIndex((item) => item.slug === activation.slug);
  const number = String(index + 1).padStart(2, '0');
  const total = String(siblings.length).padStart(2, '0');
  const metaFacts = activation.meta
    .split('·')
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <main className="content-page activation-detail-page">
      <nav className="detail-breadcrumb" aria-label="Breadcrumb">
        <Link className="back-link" to={backTo}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
            <path
              d="M15 5 8 12l7 7"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="square"
            />
          </svg>
          {backLabel}
        </Link>
        <span className="detail-index" aria-hidden="true">
          {number} / {total}
        </span>
      </nav>

      <header className="detail-masthead">
        <p className="eyebrow">{brandText(activation.subtitle)}</p>
        <h1 className="detail-title">{brandText(activation.title)}</h1>
        <p className="detail-lede">{brandText(activation.copy)}</p>
      </header>

      <section className="detail-lead" aria-label={`${activation.title} media`}>
        <MediaCarousel items={activation.gallery} title={activation.title} />
      </section>

      <section className="detail-body">
        <div className="detail-text">
          {activation.description.map((paragraph) => (
            <p key={paragraph}>{brandText(paragraph)}</p>
          ))}
        </div>
        <div className="detail-meta" role="complementary" aria-label="Project details">
          <dl className="detail-facts">
            <div>
              <dt>Context</dt>
              <dd>
                {metaFacts.map((fact) => (
                  <span key={fact}>{brandText(fact)}</span>
                ))}
              </dd>
            </div>
          </dl>
          {activation.press?.length ? (
            <div className="detail-links">
              <p className="detail-links-label">{activation.pressTitle ?? 'Press'}</p>
              {activation.press.map((item) => (
                <a key={item.url} href={item.url} target="_blank" rel="noreferrer">
                  {item.label}
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true">
                    <path
                      d="M7 17 17 7M9 7h8v8"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="square"
                    />
                  </svg>
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </section>

    </main>
  );
}
