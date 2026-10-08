import catalogue from './exhibition-1620.generated.json';

export const exhibition = catalogue.event;
export const artists = catalogue.artists;
export type ExhibitionArtist = (typeof artists)[number];

export function findArtist(slug: string | undefined) {
  return artists.find((artist) => artist.slug === slug);
}

export function artworkPrice(artist: ExhibitionArtist) {
  if (!artist.priceAmount) return 'Price to be confirmed';
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency: artist.currency,
    minimumFractionDigits: Number(artist.priceAmount) % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(Number(artist.priceAmount));
}
