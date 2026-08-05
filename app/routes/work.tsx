import {brandText} from '~/components/BrandMark';
import {Link} from 'react-router';
import type {Route} from './+types/work';
import {WORKS} from '~/lib/activations';
import {buildMeta} from '~/lib/seo';

export const meta: Route.MetaFunction = ({location}) => {
  return buildMeta({
    title: 'Work · MCLIV Studio',
    description:
      'Campaigns, installations, and design collaborations by MCLIV Studio.',
    pathname: location.pathname,
  });
};

export default function WorkIndex() {
  const items = WORKS.filter((work) => work.slug !== 'genesis');
  const total = String(items.length).padStart(2, '0');

  return (
    <main className="content-page activations-page">
      <header className="editorial-masthead">
        <p className="eyebrow">{brandText('MCLIV · Work')}</p>
        <div className="masthead-grid">
          <h1 className="masthead-title">Selected Work</h1>
          <div className="masthead-aside">
            <p className="masthead-lede">
              {brandText('Campaign direction, retail installations, and design work by MCLIV.')}
            </p>
            <dl className="masthead-facts">
              <div>
                <dt>Index</dt>
                <dd>{total} Projects</dd>
              </div>
              <div>
                <dt>Years</dt>
                <dd>2025–2026</dd>
              </div>
              <div>
                <dt>Format</dt>
                <dd>Campaigns · Installations · Fashion</dd>
              </div>
            </dl>
          </div>
        </div>
      </header>

      <section className="activation-index" aria-label="Work projects">
        <div className="activation-index-labels" aria-hidden="true">
          <span>No.</span>
          <span>Image</span>
          <span>Project</span>
          <span>Location · Date</span>
          <span />
        </div>

        {items.map((work, i) => (
          <Link
            className="activation-row"
            key={work.slug}
            to={`/activations/${work.slug}`}
          >
            <span className="activation-row-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="activation-row-media">
              <img src={work.image} alt={work.title} loading="lazy" />
            </span>
            <span className="activation-row-main">
              <span className="activation-row-title">{brandText(work.title)}</span>
              <span className="activation-row-copy">{brandText(work.copy)}</span>
            </span>
            <span className="activation-row-context">{brandText(work.subtitle)}</span>
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
        ))}
      </section>
    </main>
  );
}
