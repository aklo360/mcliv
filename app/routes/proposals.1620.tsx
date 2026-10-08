import {useEffect, useState} from 'react';
import type {Route} from './+types/proposals.1620';
import deckStyles from '../../assets/1620/proposal/website-deck.css?url';
import interiorCorner from '../../assets/1620/venue-installed-nb2-v006-smaller-guided/PC_00515_16X20_CANVAS_INSTALL_SMALLER_NBPRO_4K_v006.jpg?url';
import exteriorStorefront from '../../assets/1620/venue-installed-nb2-v006-smaller-guided/PC_00616_16X20_CANVAS_INSTALL_SMALLER_NBPRO_4K_v006.jpg?url';
import opposingWall from '../../assets/1620/venue-installed-nb2-v006-smaller-guided/PC_00462_16X20_CANVAS_INSTALL_SMALLER_NBPRO_4K_v006.jpg?url';
import storefrontWall from '../../assets/1620/venue-installed-nb2-v006-smaller-guided/PC_00494_16X20_CANVAS_INSTALL_SMALLER_NBPRO_4K_v006.jpg?url';

const PROPOSAL_PATH = '/proposals/1620';
const PROPOSAL_URL = `https://mcliv.studio${PROPOSAL_PATH}`;
const OG_IMAGE = 'https://mcliv.studio/images/og/1620-proposal-cover-v002.jpg';
const TITLE = '1620 · Group Exhibition Proposal · MCLIV';
const DESCRIPTION =
  '1620: a group exhibition of 18 artists presented by MCLIV at NYC Culture Club, Port Authority, NYC.';
const SLIDE_COUNT = 6;
const MOBILE_LANDSCAPE_QUERY =
  '(max-width: 1024px) and (orientation: landscape) and (hover: none) and (pointer: coarse)';

const artists = [
  'Madsteez',
  'Trouble Andrew',
  'Hoxxoh',
  'Jerami Dean Goodwin',
  'Cavier Coleman',
  'Gianni Lee',
  'Steph Costello',
  'John Black',
  'Smurfo',
  'Jason Rohlf',
  'King Saladeen',
  'AKLO',
  'Lola Jiblazee',
  'Gazoo ToTheMoon',
  'NotYourMuse',
  'Keya Tama',
  'Kevin Cincotta',
  'Esteban',
];

export const meta: Route.MetaFunction = () => [
  {title: TITLE},
  {name: 'description', content: DESCRIPTION},
  {name: 'robots', content: 'noindex, nofollow, noarchive'},
  {property: 'og:title', content: TITLE},
  {property: 'og:description', content: DESCRIPTION},
  {property: 'og:image', content: OG_IMAGE},
  {property: 'og:image:width', content: '1200'},
  {property: 'og:image:height', content: '675'},
  {property: 'og:image:type', content: 'image/jpeg'},
  {property: 'og:type', content: 'website'},
  {property: 'og:url', content: PROPOSAL_URL},
  {property: 'og:site_name', content: 'MCLIV Studio'},
  {name: 'twitter:card', content: 'summary_large_image'},
  {name: 'twitter:title', content: TITLE},
  {name: 'twitter:description', content: DESCRIPTION},
  {name: 'twitter:image', content: OG_IMAGE},
  {tagName: 'link', rel: 'canonical', href: PROPOSAL_URL},
];

export const links: Route.LinksFunction = () => [
  {rel: 'stylesheet', href: deckStyles},
];

export const headers: Route.HeadersFunction = () => ({
  'Cache-Control': 'public, max-age=0, must-revalidate',
});

export default function Proposal1620() {
  useEffect(() => {
    const fitSlidesToViewport = () => {
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight =
        window.visualViewport?.height ?? document.documentElement.clientHeight;
      const safeWidth = Math.max(viewportWidth - 32, 320);
      const safeHeight = Math.max(viewportHeight - 32, 180);
      const scale = Math.min(safeWidth / 1920, safeHeight / 1080, 1);
      document.documentElement.style.setProperty(
        '--slide-scale',
        String(scale),
      );
    };

    fitSlidesToViewport();
    window.addEventListener('resize', fitSlidesToViewport, {passive: true});
    window.visualViewport?.addEventListener('resize', fitSlidesToViewport, {
      passive: true,
    });

    return () => {
      window.removeEventListener('resize', fitSlidesToViewport);
      window.visualViewport?.removeEventListener('resize', fitSlidesToViewport);
      document.documentElement.style.removeProperty('--slide-scale');
    };
  }, []);

  return <ProposalDeck />;
}

function ProposalDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const mobileLandscape = window.matchMedia(MOBILE_LANDSCAPE_QUERY);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!mobileLandscape.matches) return;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setCurrentSlide((slide) => Math.max(0, slide - 1));
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setCurrentSlide((slide) => Math.min(SLIDE_COUNT - 1, slide + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <main className="proposal-deck" aria-label="1620 group exhibition proposal">
      <SlideFrame active={currentSlide === 0}>
        <section className="slide image-slide cover" aria-label="Cover">
          <img
            className="background-image"
            src={interiorCorner}
            alt="Proposed gallery interior with evenly spaced blank 16 by 20 inch canvases"
          />
          <div className="image-scrim" aria-hidden="true" />
          <DeckHeader
            light
            center="Exhibition / Proposal"
            end="New York City"
          />
          <div className="hero-caption">
            <p className="meta-line">September 16 / 6:00PM ET</p>
            <h1>1620</h1>
            <div className="hero-meta-row">
              <p className="hero-subtitle">
                A group exhibition of 18 artists presented by MCLIV
              </p>
              <p className="hero-venue">
                NYC Culture Club @ Port Authority, NYC
              </p>
            </div>
          </div>
          <span className="folio folio-light">01 / 06</span>
        </section>
      </SlideFrame>

      <SlideFrame active={currentSlide === 1}>
        <section
          className="slide statement-page"
          aria-label="Exhibition premise"
        >
          <DeckHeader center="Exhibition / Premise" end="1620" />
          <div className="statement-copy">
            <p className="section-index">01 / Premise</p>
            <h2>
              One format.
              <br />
              Eighteen points
              <br />
              of view.
            </h2>
            <p className="body-copy">
              Artists from all walks of life come together in one cohesive
              exhibition. Every work shares the same 16 × 20-inch format; each
              artist brings a distinct point of view.
            </p>
          </div>
          <figure className="statement-image statement-canvas-figure">
            <div
              className="statement-canvas"
              aria-label="16 by 20 inch canvas proportion"
            >
              <span>16 × 20 IN.</span>
            </div>
            <figcaption>One fixed format / portrait orientation</figcaption>
          </figure>
          <span className="folio">02 / 06</span>
        </section>
      </SlideFrame>

      <SlideFrame active={currentSlide === 2}>
        <section className="slide format-page" aria-label="Exhibition format">
          <DeckHeader center="Exhibition / Format" end="1620" />
          <div className="format-title">
            <p className="section-index">02 / Format</p>
            <h2>
              The constraint
              <br />
              creates the rhythm.
            </h2>
          </div>
          <dl className="spec-list">
            <div>
              <dt>Artists</dt>
              <dd>18</dd>
            </div>
            <div>
              <dt>Canvas</dt>
              <dd>16 × 20 in.</dd>
            </div>
            <div>
              <dt>Gallery walls</dt>
              <dd>3</dd>
            </div>
            <div>
              <dt>Positions / wall</dt>
              <dd>9</dd>
            </div>
          </dl>
          <div
            className="wall-plan format-wall-plan"
            aria-label="Three gallery walls with nine artwork positions each"
          >
            {['A', 'B', 'C'].map((wall) => (
              <WallPlan key={wall} wall={wall} />
            ))}
          </div>
          <span className="folio">03 / 06</span>
        </section>
      </SlideFrame>

      <SlideFrame active={currentSlide === 3}>
        <section
          className="slide roster-page"
          aria-label="Final artist roster"
        >
          <DeckHeader center="Exhibition / Artists" end="Final roster" />
          <div className="roster-intro">
            <p className="section-index">03 / Artists</p>
            <h2>
              18 artists.
              <br />
              One field.
            </h2>
            <p className="body-copy">
              A broad roster connects distinct practices and communities through
              one shared physical rule.
            </p>
          </div>
          <div className="roster-index" aria-label="Artist archive index">
            <div className="roster-head">
              <span>Num</span>
              <span>Artist</span>
              <span>Status</span>
            </div>
            <ol className="artist-list">
              {artists.map((artist, index) => (
                <li key={artist}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {artist}
                </li>
              ))}
            </ol>
          </div>
          <span className="folio">04 / 06</span>
        </section>
      </SlideFrame>

      <SlideFrame active={currentSlide === 4}>
        <section
          className="slide reference-page"
          aria-label="The gallery space"
        >
          <DeckHeader
            center="Exhibition / Reference"
            end="Installation studies"
          />
          <div className="reference-intro">
            <p className="section-index">THE SPACE</p>
          </div>
          <div
            className="reference-grid"
            aria-label="Four blank-canvas installation studies"
          >
            <ReferenceImage
              src={exteriorStorefront}
              alt="Gallery installation study, exterior storefront entrance view"
              number="01"
            />
            <ReferenceImage
              src={interiorCorner}
              alt="Gallery installation study, interior corner view"
              number="02"
            />
            <ReferenceImage
              src={opposingWall}
              alt="Gallery installation study, opposing wall view"
              number="03"
            />
            <ReferenceImage
              src={storefrontWall}
              alt="Gallery installation study, storefront wall view"
              number="04"
            />
          </div>
          <span className="folio">05 / 06</span>
        </section>
      </SlideFrame>

      <SlideFrame active={currentSlide === 5}>
        <section
          className="slide image-slide opening-page"
          aria-label="Opening information"
        >
          <img
            className="background-image"
            src={exteriorStorefront}
            alt="Storefront entrance showing blank 16 by 20 inch canvases installed inside"
          />
          <div className="image-scrim image-scrim-strong" aria-hidden="true" />
          <DeckHeader light center="Exhibition / Opening" end="New York City" />
          <div className="opening-caption">
            <p className="meta-line">September 16 / 6:00PM ET</p>
            <h2>1620</h2>
            <p className="opening-venue">
              Port Authority, NYC
              <br />
              NYC Culture Club
            </p>
          </div>
          <span className="folio folio-light">06 / 06</span>
        </section>
      </SlideFrame>

      <div className="proposal-rotate-prompt" role="status">
        <svg
          aria-hidden="true"
          viewBox="0 0 48 48"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="15" y="8" width="18" height="32" />
          <path d="M9 20a16 16 0 0 1 7-10M9 20l-3-4m3 4 4-3" />
          <path d="M39 28a16 16 0 0 1-7 10m7-10 3 4m-3-4-4 3" />
        </svg>
        <span>Turn device sideways</span>
      </div>

      <nav className="proposal-slide-nav" aria-label="Slide navigation">
        <button
          className="proposal-slide-nav__zone proposal-slide-nav__zone--previous"
          type="button"
          aria-label="Previous slide"
          disabled={currentSlide === 0}
          onClick={() => setCurrentSlide((slide) => Math.max(0, slide - 1))}
        >
          <svg aria-hidden="true" viewBox="0 0 24 48">
            <path d="m18 6-12 18 12 18" />
          </svg>
        </button>
        <button
          className="proposal-slide-nav__zone proposal-slide-nav__zone--next"
          type="button"
          aria-label="Next slide"
          disabled={currentSlide === SLIDE_COUNT - 1}
          onClick={() =>
            setCurrentSlide((slide) => Math.min(SLIDE_COUNT - 1, slide + 1))
          }
        >
          <svg aria-hidden="true" viewBox="0 0 24 48">
            <path d="m6 6 12 18L6 42" />
          </svg>
        </button>
      </nav>
    </main>
  );
}

function SlideFrame({
  children,
  active,
}: {
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <div className="slide-frame" data-mobile-active={active}>
      {children}
    </div>
  );
}

function DeckHeader({
  center,
  end,
  light = false,
}: {
  center: string;
  end: string;
  light?: boolean;
}) {
  return (
    <header
      className={`proposal-deck-header${
        light ? ' proposal-deck-header-light' : ''
      }`}
    >
      <img
        className="proposal-deck-brand-mark"
        src="/icons/logo.svg"
        alt="MCLIV"
      />
      <span className="proposal-deck-header-center">{center}</span>
      <span className="proposal-deck-header-end">{end}</span>
    </header>
  );
}

function WallPlan({wall}: {wall: string}) {
  return (
    <article className="wall">
      <div className="wall-label">
        <span>Wall {wall}</span>
        <span>9 works</span>
      </div>
      <div
        className="work-grid"
        aria-label={`Nine artwork positions on wall ${wall}`}
      >
        {Array.from({length: 9}, (_, index) => (
          <span key={index} aria-label={`Artwork position ${index + 1}`} />
        ))}
      </div>
    </article>
  );
}

function ReferenceImage({
  src,
  alt,
  number,
}: {
  src: string;
  alt: string;
  number: string;
}) {
  return (
    <figure>
      <img src={src} alt={alt} />
      <span>{number}</span>
    </figure>
  );
}
