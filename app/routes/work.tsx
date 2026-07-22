import {Link, useLoaderData} from 'react-router';
import type {Route} from './+types/work';
import {
  WORKS,
  ACTIVATION_PRODUCT_MEDIA_QUERY,
  productToActivationMedia,
} from '~/lib/activations';
import {buildMeta} from '~/lib/seo';

export const meta: Route.MetaFunction = ({location}) => {
  return buildMeta({
    title: 'Work · MCLIV Studio',
    description: 'Functional art collections and collaborations by MCLIV Studio.',
    pathname: location.pathname,
  });
};

export async function loader({context}: Route.LoaderArgs) {
  // Collections (e.g. Genesis) source their thumbnail from a Shopify product.
  const handles = [
    ...new Set(WORKS.map((w) => w.productHandle).filter(Boolean)),
  ] as string[];
  const media: Record<string, string> = {};
  await Promise.all(
    handles.map(async (handle) => {
      try {
        const data = await context.storefront.query(ACTIVATION_PRODUCT_MEDIA_QUERY, {
          variables: {handle},
        });
        media[handle] = productToActivationMedia(data.product).image;
      } catch (error) {
        console.error(error);
      }
    }),
  );
  return {media};
}

export default function WorkIndex() {
  const {media} = useLoaderData<typeof loader>();
  const total = String(WORKS.length).padStart(2, '0');

  return (
    <main className="content-page activations-page">
      <header className="editorial-masthead">
        <p className="eyebrow">MCLIV — Work</p>
        <div className="masthead-grid">
          <h1 className="masthead-title">Collections &amp; Collaborations</h1>
          <div className="masthead-aside">
            <p className="masthead-lede">
              Functional art collections and brand collaborations — objects, apparel, and
              editions designed by the studio.
            </p>
            <dl className="masthead-facts">
              <div>
                <dt>Index</dt>
                <dd>{total} Projects</dd>
              </div>
              <div>
                <dt>Format</dt>
                <dd>Collections · Collaborations</dd>
              </div>
            </dl>
          </div>
        </div>
      </header>

      <section className="activation-index" aria-label="Work">
        <div className="activation-index-labels" aria-hidden="true">
          <span>No.</span>
          <span>Image</span>
          <span>Project</span>
          <span>Type</span>
          <span />
        </div>

        {WORKS.map((work, i) => {
          const img =
            work.productHandle && media[work.productHandle]
              ? media[work.productHandle]
              : work.image;
          return (
            <Link className="activation-row" key={work.slug} to={`/activations/${work.slug}`}>
              <span className="activation-row-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="activation-row-media">
                <img src={img} alt={work.title} loading="lazy" />
              </span>
              <span className="activation-row-main">
                <span className="activation-row-title">{work.title}</span>
                <span className="activation-row-copy">{work.copy}</span>
              </span>
              <span className="activation-row-context">{work.category}</span>
              <span className="activation-row-cta" aria-hidden="true">
                View
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" aria-hidden="true">
                  <path
                    d="M7 17 17 7M9 7h8v8"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="square"
                  />
                </svg>
              </span>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
