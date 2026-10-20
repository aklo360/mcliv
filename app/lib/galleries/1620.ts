import type {ActivationImage} from '~/lib/activations';

// Edited exhibition installation photographs supplied by Parker via John.
const view = (
  number: string,
  width: number,
  height: number,
  altText: string,
): ActivationImage => ({
  id: `1620-${number}`,
  url: `/images/1620/exhibition/1620-wide-${number}-v1.webp`,
  altText,
  width,
  height,
});

export const EXHIBITION_1620_GALLERY: ActivationImage[] = [
  view(
    '01959',
    2400,
    1600,
    'Wide view of the 1620 exhibition, with works along two white gallery walls and two benches',
  ),
  view(
    '01961',
    1800,
    1188,
    'The 1620 exhibition room seen across both walls and the gallery floor',
  ),
  view(
    '01920',
    1800,
    1200,
    'Five artworks installed along a wall of the 1620 exhibition',
  ),
  view(
    '01922',
    1800,
    1200,
    'Three artworks on a white gallery wall at the 1620 exhibition',
  ),
  view(
    '01924',
    1800,
    1200,
    'Closer view of three artworks at the 1620 exhibition',
  ),
  view(
    '01931',
    1800,
    1200,
    'Three colorful artworks installed in the 1620 exhibition',
  ),
  view(
    '01933',
    1800,
    1200,
    'Three artworks and a bench in the 1620 exhibition',
  ),
  view(
    '01938',
    1800,
    1200,
    'Yellow, pink, and dark artworks installed together at 1620',
  ),
  view(
    '01940',
    1800,
    1200,
    'Three artworks on a gallery wall at the 1620 exhibition',
  ),
];
