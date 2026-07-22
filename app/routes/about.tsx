import {Link} from 'react-router';
import type {Route} from './+types/about';
import {ACTIVATIONS} from '~/lib/activations';
import {buildMeta} from '~/lib/seo';

export const meta: Route.MetaFunction = ({location}) => {
  return buildMeta({
    title: 'Studio · John Black · MCLIV',
    description:
      'John Black — chef, artist, and creative director of MCLIV Studio. An international culinary career and an abstract painting practice, treated as one discipline.',
    pathname: location.pathname,
  });
};

// Kitchen résumé. Confirmed entries only — add the rest of the CV as provided.
const KITCHENS = [
  {place: 'Radio', city: 'Copenhagen'},
  {place: 'Employees Only', city: 'Singapore'},
];

export default function AboutPage() {
  return (
    <main className="content-page about-page">
      <header className="detail-masthead">
        <p className="eyebrow">Studio — John Black</p>
        <h1 className="detail-title">Chef &amp; Creative Director</h1>
        <p className="detail-lede">
          John Black works between the kitchen and the studio — cuisine and abstract
          painting treated as a single discipline. He is the founder, chef, and
          creative director of MCLIV.
        </p>
      </header>

      <figure className="detail-lead-media">
        <img src="/images/activations/instudio1.jpeg" alt="MCLIV Studio, 3 World Trade Center" loading="eager" />
      </figure>

      <section className="detail-body">
        <div className="detail-text">
          <p>
            Born in southern West Virginia and based in New York, John Black builds
            functional art at the intersection of food and abstraction. His cooking
            and his canvases share the same vocabulary: material, heat, repetition,
            rhythm, and process.
          </p>
          <p>
            As a chef he has cooked internationally, including Radio in Copenhagen and
            Employees Only in Singapore, carrying a fine-dining discipline into salons,
            private dinners, museums, and gallery environments.
          </p>
          <p>
            As an artist his abstract works move through symbols, marks, and patterns —
            bridging the contemporary and the primal, the seen and the unseen. The two
            practices meet in MCLIV: edible objects, functional artworks, and ritual
            spaces, prepared in New York and archived permanently.
          </p>
        </div>

        <aside className="detail-meta" aria-label="Résumé">
          <dl className="detail-facts">
            <div>
              <dt>Role</dt>
              <dd>
                <span>Founder</span>
                <span>Chef</span>
                <span>Creative Director</span>
              </dd>
            </div>
            <div>
              <dt>Kitchens</dt>
              <dd>
                {KITCHENS.map((k) => (
                  <span key={k.place}>
                    {k.place} · {k.city}
                  </span>
                ))}
                <span className="muted">Full kitchen CV — to be added</span>
              </dd>
            </div>
            <div>
              <dt>Practice</dt>
              <dd>
                <span>Cuisine</span>
                <span>Functional Art</span>
                <span>Abstract Painting</span>
              </dd>
            </div>
            <div>
              <dt>Studio</dt>
              <dd>
                <span>MCLIV</span>
                <span>3 World Trade Center, New York</span>
              </dd>
            </div>
            <div>
              <dt>Origin</dt>
              <dd>
                <span>Southern West Virginia</span>
              </dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="detail-related" aria-label="Selected work">
        <div className="detail-related-head">
          <h2 className="detail-related-title">Selected work</h2>
          <Link className="text-link" to="/activations">
            Full archive
          </Link>
        </div>
        <div className="detail-related-grid">
          {ACTIVATIONS.slice(0, 3).map((item) => (
            <Link className="related-card" key={item.slug} to={`/activations/${item.slug}`}>
              <span className="related-card-media">
                <img src={item.image} alt={item.title} loading="lazy" />
              </span>
              <span className="related-card-title">{item.shortTitle ?? item.title}</span>
              <span className="related-card-context mono">{item.subtitle}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-contact" aria-label="Contact">
        <p className="contact-eyebrow mono">Enquiries</p>
        <h2 className="contact-line">
          Commissions, cuisine-led activations, and studio collaborations.
        </h2>
        <a className="contact-email" href="mailto:info@mcliv.studio">
          info@mcliv.studio
        </a>
      </section>
    </main>
  );
}
