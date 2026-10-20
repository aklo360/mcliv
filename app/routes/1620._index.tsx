import {Link} from 'react-router';
import type {Route} from './+types/1620._index';
import {artists, exhibition, artworkPrice} from '~/lib/exhibition-1620';
import {ExhibitionArtwork} from '~/components/ExhibitionArtwork';
import {buildMeta, SITE_URL} from '~/lib/seo';
import {ExhibitionArrow} from '~/components/ExhibitionArrow';
import {EXHIBITION_1620_GALLERY} from '~/lib/galleries/1620';
import {MediaCarousel} from '~/components/MediaCarousel';

export const meta: Route.MetaFunction = () => [
  ...buildMeta({
    title: '1620 · Group Exhibition · MCLIV',
    description: exhibition.statement,
    pathname: '/1620',
  }),
  {tagName: 'link', rel: 'canonical', href: `${SITE_URL}/1620`},
];

export default function ExhibitionIndex() {
  return (
    <>
      <section className="exhibition-intro" aria-labelledby="exhibition-title">
        <div>
          <h1 id="exhibition-title">
            <span className="exhibition-title-one">1</span>620
          </h1>
          <p className="exhibition-subtitle">
            A group exhibition of 18 artists.
          </p>
        </div>
        <div className="exhibition-intro-copy">
          <p className="exhibition-statement">{exhibition.statement}</p>
          <dl className="exhibition-facts">
            <div>
              <dt>Opening</dt>
              <dd>
                {exhibition.date} · {exhibition.time}
              </dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>
                {exhibition.venueDetail}
                <br />
                {exhibition.venuePublicName}
                <br />
                {exhibition.venueAddress}
                <br />
                {exhibition.venueFloor}
              </dd>
            </div>
            <div>
              <dt>Format</dt>
              <dd>{exhibition.workFormat}</dd>
            </div>
          </dl>
        </div>
      </section>
      <section
        className="exhibition-installation"
        aria-label="1620 exhibition photographs"
      >
        <MediaCarousel
          items={EXHIBITION_1620_GALLERY}
          title="1620 installation views"
          sideControls
        />
      </section>
      <section
        id="artworks"
        className="exhibition-works"
        aria-labelledby="works-title"
      >
        <div className="exhibition-section-heading">
          <h2 id="works-title">The works</h2>
          <span className="exhibition-label">01 — 18</span>
        </div>
        <ol className="exhibition-grid">
          {artists.map((artist) => (
            <li key={artist.slug}>
              <Link
                to={`/1620/${artist.slug}`}
                className="exhibition-work-link"
              >
                <ExhibitionArtwork artist={artist} />
                <div className="exhibition-work-caption">
                  <span className="exhibition-label">
                    {String(artist.number).padStart(2, '0')}
                  </span>
                  <div>
                    <h3>{artist.name}</h3>
                    <p>{artist.artworkName}</p>
                  </div>
                  <ExhibitionArrow direction="up-right" />
                </div>
                <p className="exhibition-grid-price">{artworkPrice(artist)}</p>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
