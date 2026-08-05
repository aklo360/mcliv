import {brandText} from '~/components/BrandMark';
import type {Route} from './+types/about';
import {buildMeta} from '~/lib/seo';

export const meta: Route.MetaFunction = ({location}) => {
  return buildMeta({
    title: 'About · MCLIV Studio',
    description:
      'MCLIV is a creative studio & event production company based in New York City, working at the intersection of fine art & hospitality.',
    pathname: location.pathname,
  });
};

// Kitchen résumé. Confirmed entries only, add the rest of the CV as provided.
const KITCHENS = [
  {place: 'Radio', city: 'Copenhagen'},
  {place: 'Employees Only', city: 'Singapore'},
];

export default function AboutPage() {
  return (
    <main className="content-page activations-page about-page">
      <header className="editorial-masthead">
        <p className="eyebrow">{brandText('MCLIV · About')}</p>
        <div className="masthead-grid">
          <h1 className="masthead-title">The Studio</h1>
          <div className="masthead-aside">
            <p className="masthead-lede">
              {brandText('MCLIV is a creative studio & event production company based in New York City, with activations across Singapore, Paris, NYC, Key West & more. The studio works at the exact intersection of fine art & hospitality, where dinners are staged like exhibitions, and spaces, objects, and menus are treated as one design language.')}
            </p>
            <p className="masthead-lede">
              {brandText('Each activation is a study for something more permanent: rooms, tables, and menus of the studio’s own, composed as total works of art.')}
            </p>
            <dl className="masthead-facts">
              <div>
                <dt>Base</dt>
                <dd>New York City</dd>
              </div>
              <div>
                <dt>Activations</dt>
                <dd>Singapore · Paris · NYC · Key West</dd>
              </div>
              <div>
                <dt>Focus</dt>
                <dd>Fine Art &amp; Hospitality</dd>
              </div>
            </dl>
          </div>
        </div>
      </header>

      <figure className="about-hero">
        <img
          src="/images/about/studio.jpg"
          alt="MCLIV objects staged in a stone garden"
          loading="eager"
        />
      </figure>

      <section className="about-founder" aria-label="Founder">
        <figure className="about-founder-media">
          <img
            src="/images/activations/sacred-table/st-ig-01.jpg"
            alt="John Black plating a course"
            loading="lazy"
          />
        </figure>
        <div className="about-founder-text">
          <p className="eyebrow">Founder</p>
          <h2 className="masthead-title">John Black</h2>
          <p className="masthead-lede">
            John Black works between the kitchen and the studio, moving across
            cuisine, painting, and sculpture. Michelin-star restaurant trained and
            specializing in private dining and bespoke events, he is the founder,
            chef, and creative director of {brandText('MCLIV')}.
          </p>
          <p>
            Born in southern West Virginia and based in New York, his cooking and
            his canvases share the same vocabulary: material, heat, repetition,
            rhythm, and process.
          </p>
          <p>
            As a chef he brings more than ten years of global culinary experience,
            cooking in Copenhagen, India, the Maldives, Paris, and beyond, carrying
            a fine-dining discipline into salons, private dinners, museums, and
            gallery environments. His plates are elevated Southern American cuisine
            built on classic French technique, balancing comfort, sophistication,
            and seasonal ingredients.
          </p>
          <p>
            As an artist his abstract works move through symbols, marks, and
            patterns, bridging the contemporary and the primal, the seen and the
            unseen. The two practices meet in {brandText('MCLIV')}: edible objects,
            functional artworks, and ritual spaces.
          </p>
          <dl className="masthead-facts">
            <div>
              <dt>Role</dt>
              <dd>Founder · Chef · Creative Director</dd>
            </div>
            <div>
              <dt>Kitchens</dt>
              <dd>{KITCHENS.map((k) => `${k.place} · ${k.city}`).join('  /  ')}</dd>
            </div>
            <div>
              <dt>Practice</dt>
              <dd>Private Dining · Bespoke Events · Painting · Sculpture · Clothing Design</dd>
            </div>
            <div>
              <dt>Origin</dt>
              <dd>West Virginia</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="about-founder about-founder--flip" aria-label="Co-Founder">
        <figure className="about-founder-media">
          <img
            src="/images/about/mike-carrera.jpg"
            alt="Mike Carrera, AKLO"
            loading="lazy"
          />
        </figure>
        <div className="about-founder-text">
          <p className="eyebrow">Co-Founder</p>
          <h2 className="masthead-title">Mike AKLO Carrera</h2>
          <p className="masthead-lede">
            Mike is a creative multihyphenate working professionally for 15
            years in media &amp; event production as well as graphic &amp; web
            design.
          </p>
          <p>
            As co-founder of {brandText('MCLIV')}, he leads operations &amp;
            digital media.
          </p>
          <p>
            As a photographer &amp; media director he has worked for Telfar, LUAR, Jeremy Scott,
            KOCHÉ, VFiles, and CFDA/Vogue Fashion Fund winner{' '}
            <a
              href="https://www.youtube.com/@TheRioWorld"
              target="_blank"
              rel="noreferrer"
            >
              Rio Uribe
            </a>
            , with work
            published in Vogue, Paper, Dazed, i-D, Hypebeast, and Complex. Behind
            the camera he has shot with Post Malone, Cardi B,{' '}
            <a
              href="https://www.youtube.com/watch?v=Ny028kALxb0"
              target="_blank"
              rel="noreferrer"
            >
              Virgil Abloh
            </a>
            , Kevin Gates, Omari Hardwick &amp; more,
            and was an in-house music video director
            for Atlantic Records, where his videos have amassed hundreds of
            millions of views.
          </p>
          <p>
            He has also produced art &amp; fashion events, including the{' '}
            <a
              href="https://www.youtube.com/watch?v=1fGwwOEpm7A"
              target="_blank"
              rel="noreferrer"
            >
              Paper Magazine YOUth Issue release party
            </a>{' '}
            at Superchief Digital Art Gallery,
            the Gypsy Sport FW17 NYFW after party, the{' '}
            <a
              href="https://www.vice.com/en/article/this-emotional-video-from-hooliganradguitar5-is-your-roadmap-to-nyc-nightlife/"
              target="_blank"
              rel="noreferrer"
            >
              Take It On Down music video premiere
            </a>{' '}
            with Noisey / VICE, and Poppington Academy, an 8-hour
            creative entrepreneurship seminar &amp; art exhibition curated for
            Dame Dash&rsquo;s Poppington Gallery.
          </p>
          <p>
            Some of his previous commercial clients include Sports Illustrated
            Swimsuit, Bud Light / Anheuser-Busch, Island Def Jam, Universal Music
            Group, Ford Models, M13 Ventures, NBCU &amp; more. He is currently a
            motion graphics designer for Merck Pharmaceutical.
          </p>
          <dl className="masthead-facts">
            <div>
              <dt>Role</dt>
              <dd>Co-Founder · Web &amp; Graphic Designer · Operations Manager</dd>
            </div>
            <div>
              <dt>Education</dt>
              <dd>BFA, Film &amp; TV Production · NYU Tisch</dd>
            </div>
            <div>
              <dt>Published</dt>
              <dd>Vogue · Complex · Paper · Dazed · i-D · Hypebeast</dd>
            </div>
            <div>
              <dt>Origin</dt>
              <dd>New York City</dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  );
}
