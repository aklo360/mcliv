import {Link} from 'react-router';
import type {Route} from './+types/activations._index';
import {EVENTS} from '~/lib/activations';
import {buildMeta} from '~/lib/seo';

export const meta: Route.MetaFunction = ({location}) => {
  return buildMeta({
    title: 'Activations · MCLIV Studio',
    description:
      'Culinary installations, art salons, and brand environments by MCLIV Studio.',
    pathname: location.pathname,
  });
};

export default function ActivationsIndex() {
  const total = String(EVENTS.length).padStart(2, '0');

  return (
    <main className="content-page activations-page">
      <header className="editorial-masthead">
        <p className="eyebrow">MCLIV — Activations</p>
        <div className="masthead-grid">
          <h1 className="masthead-title">Experiential Activations</h1>
          <div className="masthead-aside">
            <p className="masthead-lede">
              Culinary installations, private dinners, art salons, and product environments
              designed around material, appetite, and attention.
            </p>
            <dl className="masthead-facts">
              <div>
                <dt>Index</dt>
                <dd>{total} Projects</dd>
              </div>
              <div>
                <dt>Years</dt>
                <dd>2024 — 2025</dd>
              </div>
              <div>
                <dt>Format</dt>
                <dd>Salons · Dinners · Exhibitions</dd>
              </div>
            </dl>
          </div>
        </div>
      </header>

      <section className="activation-index" aria-label="Activation projects">
        <div className="activation-index-labels" aria-hidden="true">
          <span>No.</span>
          <span>Image</span>
          <span>Project</span>
          <span>Location · Date</span>
          <span />
        </div>

        {EVENTS.map((activation, i) => (
          <Link
            className="activation-row"
            key={activation.slug}
            to={`/activations/${activation.slug}`}
          >
            <span className="activation-row-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="activation-row-media">
              <img src={activation.image} alt={activation.title} loading="lazy" />
            </span>
            <span className="activation-row-main">
              <span className="activation-row-title">{activation.title}</span>
              <span className="activation-row-copy">{activation.copy}</span>
            </span>
            <span className="activation-row-context">{activation.subtitle}</span>
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
