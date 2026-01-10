import {Image} from '@shopify/hydrogen';
import Sculpture from '~/components/Sculpture';
import type {Route} from './+types/archive-main';
import {buildMeta} from '~/lib/seo';

const releases = [
  {title: 'Studio Cap', status: 'Available', edition: 'No. 001', image: '/images/releases/hat1.png'},
  {title: 'Edition Chair', status: 'Upcoming', edition: 'No. 002', image: '/images/releases/chair1.png'},
  {title: 'Signal Tee', status: 'Sold Out', edition: 'No. 003', image: '/images/releases/shirt1.png'},
];

const activations = [
  {title: 'Culinary Installation', blurb: 'Meditative tasting sequence with sound and light.', image: '/images/activations/event1.png'},
  {title: 'Site-Specific Piece', blurb: 'Frequency pattern woven into architectural surface.', image: '/images/activations/event2.jpg'},
  {title: 'Brand Collaboration', blurb: 'Limited-run activation with mindful craft.', image: '/images/activations/event3.jpg'},
];

const multimedia = [
  {title: 'Web Launch', category: 'Web', image: '/images/multimedia/campaign1.png'},
  {title: 'Photo Direction', category: 'Photo', image: '/images/multimedia/campaign1.png'},
  {title: 'Motion Edit', category: 'Video', image: '/images/multimedia/campaign1.png'},
];

export const meta: Route.MetaFunction = ({location}) => {
  return buildMeta({
    title: 'MCLIV Studio · Legacy Layout',
    pathname: location.pathname,
  });
};

export default function ArchiveMain() {
  return (
    <main className="legacy-page">
      <section className="legacy-hero">
        <div className="legacy-hero-media sculpture-wrap">
          <Sculpture />
        </div>
        <div className="legacy-hero-copy">
          <p className="eyebrow">MCLIV / 1154</p>
          <h1 className="legacy-title">Functional art, frequency-led experiences.</h1>
          <p className="legacy-lede">
            Limited-run capsules and experiential activations that elevate signal from the noise.
            Built in NYC; inspired by wind, water, and architectural calm.
          </p>
          <div className="legacy-cta-row">
            <a className="primary" href="#releases">
              View releases
            </a>
            <a className="ghost" href="#contact">
              Contact
            </a>
          </div>
        </div>
      </section>

      <SectionBlock id="releases" title="Releases" subtitle="Objects, furniture, prints and wearables from the studio — material restraint, precise craft.">
        <div className="legacy-card-grid">
          {releases.map((item) => (
            <article className="legacy-card" key={item.title}>
              <div className="legacy-card-media">
                <Image
                  data={{url: item.image, altText: item.title, width: 900, height: 900}}
                  loading="lazy"
                  className="legacy-card-img"
                />
                <span className="badge">{item.status}</span>
              </div>
              <div className="legacy-card-copy">
                <h3>{item.title}</h3>
                <p className="meta">{item.edition}</p>
              </div>
            </article>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock id="activations" title="Activations" subtitle="Culinary, installation, and experiential productions that are transcendent & meaningful.">
        <div className="legacy-card-grid">
          {activations.map((item) => (
            <article className="legacy-card" key={item.title}>
              <div className="legacy-card-media">
                <Image
                  data={{url: item.image, altText: item.title, width: 1200, height: 800}}
                  loading="lazy"
                  className="legacy-card-img"
                />
                <span className="badge">Activation</span>
              </div>
              <div className="legacy-card-copy">
                <h3>{item.title}</h3>
                <p>{item.blurb}</p>
              </div>
            </article>
          ))}
        </div>
      </SectionBlock>

      <SectionBlock id="multimedia" title="Multimedia" subtitle="Photo/Video, Web, Logos & Brand Identity Systems Design.">
        <div className="legacy-card-grid">
          {multimedia.map((item) => (
            <article className="legacy-card" key={item.title}>
              <div className="legacy-card-media">
                <Image
                  data={{url: item.image, altText: item.title, width: 1200, height: 800}}
                  loading="lazy"
                  className="legacy-card-img"
                />
                <span className="badge">{item.category}</span>
              </div>
              <div className="legacy-card-copy">
                <h3>{item.title}</h3>
                <p>{item.category}</p>
              </div>
            </article>
          ))}
        </div>
      </SectionBlock>

      <section id="contact" className="legacy-contact">
        <h2 className="section-title">Contact</h2>
        <p className="section-lede">For collaborations, commissions, and press inquiries.</p>
        <a className="primary" href="mailto:info@mcliv.studio">
          Email info@mcliv.studio
        </a>
      </section>
    </main>
  );
}

function SectionBlock({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="legacy-section">
      <div className="section-header">
        <p className="eyebrow">{title}</p>
        <h2 className="section-title">{title}</h2>
        <p className="section-lede">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}
