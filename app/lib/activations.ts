export type ActivationImage = {
  id: string;
  url: string;
  altText: string;
  width: number;
  height: number;
  type?: 'image' | 'video';
};

export type ActivationPress = {
  label: string;
  url: string;
};

export type Activation = {
  slug: string;
  title: string;
  shortTitle?: string;
  meta: string;
  subtitle: string;
  category: string;
  /** 'activation' = event (default); 'work' = collection / collaboration. */
  kind?: 'activation' | 'work';
  /** When set, image + gallery are sourced from this Shopify product at runtime. */
  productHandle?: string;
  copy: string;
  description: string[];
  image: string;
  gallery: ActivationImage[];
  pressTitle?: string;
  press?: ActivationPress[];
};

export const ACTIVATIONS: Activation[] = [
  {
    slug: 'chaises-musicales',
    title: 'Chaises Musicales: Art Salon & Dinner',
    shortTitle: 'Chaises Musicales',
    meta: 'Art Basel Paris 2025 · Curated by Vanessa Fuchs · Chef/Artist: John Black',
    subtitle: 'DREAM Architects · Paris · 10.25',
    category: 'Culinary Activation',
    copy: 'A multisensory salon where cuisine, painting, and sound moved as one composition.',
    description: [
      'Presented at Art Basel Paris 2025 by NYC Culture Club, MCLIV founder John Black helmed the kitchen and exhibited new work in a multisensory experience of cuisine, art, and sound.',
      'The evening framed cuisine as functional art: a shared table, a temporal installation, and a direct line between material, gesture, and appetite.',
    ],
    image: '/images/activations/cm1.jpeg',
    gallery: [
      {
        id: 'cm-01',
        url: '/images/activations/cm1.jpeg',
        altText: 'Chaises Musicales dinner and art salon',
        width: 1600,
        height: 1200,
      },
      {
        id: 'cm-02',
        url: '/images/activations/cm2.jpeg',
        altText: 'Chaises Musicales detail image',
        width: 1600,
        height: 1200,
      },
    ],
    press: [
      {
        label: 'Whitewall',
        url: 'https://whitewall.art/lifestyle/paris-fete-inside-the-most-exclusive-events-of-art-basel-paris-week/',
      },
      {
        label: 'Vogue Italia',
        url: 'https://www.vogue.it/article/art-basel-paris-2025-installazioni-piu-incredibili',
      },
    ],
  },
  {
    slug: 'apoc-nothing-ear-3',
    title: "APOC's US Debut · NOTHING Ear(3)",
    shortTitle: "APOC's US Debut",
    meta: 'New York Fashion Week · Fall 2025',
    subtitle: 'Earshot · New York City · 09.25',
    category: 'Retail Installation',
    copy: 'A sculptural product display system for an NYFW launch environment.',
    description: [
      'Sculptural display system for the NOTHING Ear(3) launch at APOC’s first US pop-up during fall NYFW 2025 in collaboration with Adorno Design.',
      'MCLIV approached the product environment as an object-led installation: functional, precise, and built to hold attention without spectacle.',
    ],
    image: '/images/activations/apoc1.jpeg',
    gallery: [
      {
        id: 'apoc-01',
        url: '/images/activations/apoc1.jpeg',
        altText: 'APOC and NOTHING Ear(3) activation installation',
        width: 1600,
        height: 1200,
      },
      {
        id: 'apoc-02',
        url: '/images/activations/apoc2-v.jpg',
        altText: 'APOC and NOTHING Ear(3) activation detail',
        width: 1200,
        height: 1600,
      },
    ],
    press: [
      {
        label: 'Office Mag',
        url: 'https://officemagazine.net/apocs-us-debut',
      },
      {
        label: 'Dazed',
        url: 'https://www.dazeddigital.com/fashion/article/68721/1/apoc-londons-coolest-online-concept-store-has-come-to-new-york-nothing-adorno',
      },
    ],
  },
  {
    slug: 'the-art-of-giving',
    title: 'The Art of Giving',
    shortTitle: 'The Art of Giving',
    meta: 'Singapore · April 2025 · Peranakan Museum x Employees Only',
    subtitle: 'Peranakan Museum · Singapore · 04.25',
    category: 'Cultural Program',
    copy: 'A private event and dialogue staged around hospitality, philanthropy, and taste.',
    description: [
      'A dialogue and private event in collaboration with Employees Only, with hors d’oeuvres by John Black, transforming the Peranakan Museum into an intimate tasting and conversation on giving and philanthropy.',
      'The format treated food as a social object: designed to gather people around ideas, memory, and exchange.',
    ],
    image: '/images/activations/aog1.jpeg',
    gallery: [
      {
        id: 'aog-01',
        url: '/images/activations/aog1.jpeg',
        altText: 'The Art of Giving event at Peranakan Museum',
        width: 1600,
        height: 1200,
      },
    ],
    pressTitle: 'Watch',
    press: [
      {
        label: 'Recap',
        url: 'https://www.instagram.com/p/DH_o3DsyiF2/?img_index=1&igsh=MTg0MG1taDF3aHFpbA==',
      },
    ],
  },
  {
    slug: 'mcliv-in-studio-dinner',
    title: 'MCLIV In-Studio Dinner',
    shortTitle: 'MCLIV In-Studio Dinner',
    meta: 'New York · January 2025 · WTC3 Residency',
    subtitle: 'MCLIV Studio · New York City · 01.25',
    category: 'Culinary Activation',
    copy: 'A fine-dining experience inside the studio, surrounded by works in progress.',
    description: [
      'We transformed our work studio in WTC3 into a private fine-dining experience, pairing the viewing of in-progress works with a bespoke tasting menu.',
      'The dinner made the studio itself part of the activation: production space, gallery, and table operating as one environment.',
    ],
    image: '/images/activations/instudio1.jpeg',
    gallery: [
      {
        id: 'instudio-01',
        url: '/images/activations/instudio1.jpeg',
        altText: 'MCLIV in-studio dinner',
        width: 1600,
        height: 1200,
      },
      {
        id: 'instudio-video',
        url: '/images/activations/instudio.webm',
        altText: 'MCLIV in-studio dinner recap video',
        width: 1600,
        height: 900,
        type: 'video',
      },
    ],
    pressTitle: 'Watch',
    press: [
      {
        label: 'Recap',
        url: '/images/activations/instudio.webm',
      },
    ],
  },
  {
    slug: 'alternating-currents',
    title: 'Alternating Currents',
    shortTitle: 'Alternating Currents',
    meta: 'Key West · April 2024 · Sanger Gallery',
    subtitle: 'Sanger Gallery · Key West, FL · 04.24',
    category: 'Culinary Activation',
    copy: 'A gallery exhibition and private dinner joining color studies with a tasting sequence.',
    description: [
      'Art exhibition and private dinner at Sanger Gallery in Key West where MCLIV founder John Black served as chef and solo artist, blending culinary courses with his studies in color and technique.',
      'The project connected painting, place, and food into a single evening: each course acting as another way into the work.',
    ],
    image: '/images/activations/ackw1.jpeg',
    gallery: [
      {
        id: 'ackw-01',
        url: '/images/activations/ackw1.jpeg',
        altText: 'Alternating Currents exhibition and dinner',
        width: 1600,
        height: 1200,
      },
      {
        id: 'ackw-02',
        url: '/images/activations/ackw2.jpeg',
        altText: 'Alternating Currents detail image',
        width: 1600,
        height: 1200,
      },
    ],
    press: [
      {
        label: 'TSKW',
        url: 'https://tskw.org/alternating-currents-john-black/',
      },
      {
        label: 'Florida Weekly',
        url: 'https://www.floridaweekly.com/articles/key-west-key-west-arts-and-entertainment-news/the-color-theory-of-john-blacks-alternating-currents/',
      },
    ],
  },
  {
    slug: 'genesis',
    title: 'Genesis — Functional Art Collection',
    shortTitle: 'Genesis',
    meta: 'MCLIV Studio · New York · Drop 01',
    subtitle: 'MCLIV Studio · New York · Drop 01',
    category: 'Functional Art Collection',
    kind: 'work',
    productHandle: 'studio-hat',
    copy: 'The studio’s first functional art collection — objects designed to be worn, used, and kept.',
    description: [
      'Genesis is MCLIV’s first functional art collection: a debut drop that carries the studio’s language into objects you can wear and use. It opens with the Studio Hat — 3D-embroidered green corduroy, editioned 1–100.',
      'The collection treats apparel as functional art: limited, numbered, and made to be kept rather than consumed.',
    ],
    // image + gallery are sourced from the Shopify product (see productHandle) at runtime.
    image: '',
    gallery: [],
  },
  {
    slug: 'eo-collab',
    title: 'Employees Only — 10 Year Anniversary',
    shortTitle: 'Employees Only',
    meta: 'Employees Only · Singapore · 10 Year Anniversary',
    subtitle: 'Employees Only · Singapore',
    category: 'Collaboration',
    kind: 'work',
    copy: 'Commemorative apparel and graphic design for Employees Only Singapore’s 10-year anniversary.',
    description: [
      'A collaboration with Employees Only marking the bar’s tenth anniversary in Singapore. MCLIV designed the commemorative apparel and graphic identity, translating the city and the house’s iconography into a wearable edition.',
      'The work pairs MCLIV’s functional-art approach with Employees Only’s hospitality legacy.',
    ],
    image: '/images/work/eo/eo-design-01.png',
    gallery: [
      {
        id: 'eo-1',
        url: '/images/work/eo/eo-design-01.png',
        altText: 'Employees Only 10 Year Anniversary apparel design',
        width: 1086,
        height: 1448,
      },
      {
        id: 'eo-2',
        url: '/images/work/eo/eo-design-02.png',
        altText: 'Employees Only collaboration design',
        width: 1536,
        height: 1024,
      },
      {
        id: 'eo-3',
        url: '/images/work/eo/eo-design-03.png',
        altText: 'Employees Only collaboration design',
        width: 1085,
        height: 1449,
      },
    ],
  },
];

/** Events only (the activations archive + hero). */
export const EVENTS = ACTIVATIONS.filter((a) => (a.kind ?? 'activation') === 'activation');

/** Collections & collaborations (the Work page). */
export const WORKS = ACTIVATIONS.filter((a) => a.kind === 'work');

/**
 * Storefront query for an activation whose media lives on a Shopify product
 * (e.g. the Genesis collection → studio-hat). Pulls all product images.
 */
export const ACTIVATION_PRODUCT_MEDIA_QUERY = `#graphql
  query ActivationProductMedia($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      featuredImage { url altText width height }
      images(first: 20) {
        nodes { id url altText width height }
      }
    }
  }
` as const;

type ProductMediaSource = {
  featuredImage?: {
    url?: string | null;
    altText?: string | null;
    width?: number | null;
    height?: number | null;
  } | null;
  images?: {
    nodes: Array<{
      id?: string | null;
      url?: string | null;
      altText?: string | null;
      width?: number | null;
      height?: number | null;
    }>;
  } | null;
} | null | undefined;

/** Map a Shopify product's media into an activation image + gallery. */
export function productToActivationMedia(product: ProductMediaSource): {
  image: string;
  gallery: ActivationImage[];
} {
  const nodes = product?.images?.nodes ?? [];
  const gallery: ActivationImage[] = nodes
    .filter((n) => !!n?.url)
    .map((n, i) => ({
      id: n.id ?? `genesis-${i}`,
      url: n.url as string,
      altText: n.altText ?? 'Genesis collection',
      width: n.width ?? 1200,
      height: n.height ?? 1200,
    }));
  const image = product?.featuredImage?.url ?? gallery[0]?.url ?? '';
  return {image, gallery};
}

export function getActivation(slug: string | undefined) {
  return ACTIVATIONS.find((activation) => activation.slug === slug);
}
