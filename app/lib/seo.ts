export const SITE_URL = 'https://mcliv.studio';
export const OG_IMAGE = `${SITE_URL}/images/og/cover.jpg`;
export const DEFAULT_TITLE = 'MCLIV Studio';
export const DEFAULT_DESCRIPTION =
  'MCLIV Studio is a NYC based creative studio creating limited-run capsule collections and experiential activations that elevate signal from the noise.';

type BuildMetaArgs = {
  title?: string;
  description?: string;
  pathname?: string;
  image?: string;
};

export function buildMeta({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  pathname = '/',
  image = OG_IMAGE,
}: BuildMetaArgs) {
  const url = `${SITE_URL}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;

  return [
    {title},
    {name: 'description', content: description},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:image', content: image},
    {property: 'og:image:width', content: '1200'},
    {property: 'og:image:height', content: '630'},
    {property: 'og:type', content: 'website'},
    {property: 'og:url', content: url},
    {property: 'og:site_name', content: 'MCLIV Studio'},
    {property: 'og:locale', content: 'en_US'},
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
    {name: 'twitter:image', content: image},
  ];
}
