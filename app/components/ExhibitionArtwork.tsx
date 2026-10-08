import type {ExhibitionArtist} from '~/lib/exhibition-1620';

export function ExhibitionArtwork({artist, eager = false, showPlaceholderFormat = true}: {artist: ExhibitionArtist; eager?: boolean; showPlaceholderFormat?: boolean}) {
  return (
    <div className="exhibition-artwork">
      {artist.image ? (
        <img src={artist.image} alt={`${artist.artworkName} by ${artist.name}`} loading={eager ? 'eager' : 'lazy'} decoding="async" />
      ) : (
        <div className="exhibition-image-placeholder" role="img" aria-label={`Artwork image to come for ${artist.name}`}>
          <span className="exhibition-label">{String(artist.number).padStart(2, '0')} / 18</span>
          {showPlaceholderFormat && <span className="exhibition-placeholder-format">16 × 20</span>}
          <span className="exhibition-label">Artwork image to come</span>
        </div>
      )}
    </div>
  );
}
