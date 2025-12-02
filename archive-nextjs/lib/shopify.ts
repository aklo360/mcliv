const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const API_VERSION = process.env.SHOPIFY_API_VERSION || "2025-07";

if (!STORE_DOMAIN) {
  console.warn("[shopify] Missing SHOPIFY_STORE_DOMAIN. Set it in .env.local");
}
if (!STOREFRONT_TOKEN) {
  console.warn("[shopify] Missing SHOPIFY_STOREFRONT_TOKEN. Storefront calls will fall back to Admin where possible.");
}
if (!ADMIN_TOKEN) {
  console.warn("[shopify] Missing SHOPIFY_ADMIN_TOKEN. Admin fallback will be unavailable.");
}

const STOREFRONT_ENDPOINT = STORE_DOMAIN
  ? `https://${STORE_DOMAIN}/api/${API_VERSION}/graphql.json`
  : undefined;

const ADMIN_ENDPOINT = STORE_DOMAIN
  ? `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/graphql.json`
  : undefined;

type ShopifyImageNode = {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

type ShopifyVariantNode = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: {
    amount: string;
    currencyCode: string;
  };
};

export type ShopifyProduct = {
  id: string;
  title: string;
  descriptionHtml: string;
  images: ShopifyImageNode[];
  variants: ShopifyVariantNode[];
};

function variantGidToId(gid: string): string | null {
  if (!gid) return null;
  const parts = gid.split("/");
  return parts[parts.length - 1] || null;
}

async function storefrontFetch<T>(
  query: string,
  variables?: Record<string, any>,
  options: RequestInit = {},
): Promise<T> {
  if (!STOREFRONT_ENDPOINT || !STOREFRONT_TOKEN) {
    throw new Error("Shopify Storefront API is not configured");
  }

  const res = await fetch(STOREFRONT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
    ...options,
  });

  const text = await res.text();
  let json: any = {};

  try {
    json = text ? JSON.parse(text) : {};
  } catch (e) {
    throw new Error(`Shopify ${res.status} non-JSON response: ${text.slice(0, 400)}`);
  }

  if (!res.ok || json.errors) {
    throw new Error(
      `Shopify ${res.status} error: ${JSON.stringify(json.errors || json, null, 2)}`,
    );
  }

  return json.data as T;
}

async function adminFetch<T>(
  query: string,
  variables?: Record<string, any>,
  options: RequestInit = {},
): Promise<T> {
  if (!ADMIN_ENDPOINT || !ADMIN_TOKEN) {
    throw new Error("Shopify Admin API is not configured");
  }

  const res = await fetch(ADMIN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": ADMIN_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
    ...options,
  });

  const text = await res.text();
  let json: any = {};

  try {
    json = text ? JSON.parse(text) : {};
  } catch (e) {
    throw new Error(`Shopify Admin ${res.status} non-JSON response: ${text.slice(0, 400)}`);
  }

  if (!res.ok || json.errors) {
    throw new Error(`Shopify Admin ${res.status} error: ${JSON.stringify(json.errors || json, null, 2)}`);
  }

  return json.data as T;
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  // 1) Try Storefront first (preferred for customer data + pricing)
  if (STOREFRONT_TOKEN) {
    try {
      const query = /* GraphQL */ `
        query productByHandle($handle: String!) {
          product(handle: $handle) {
            id
            title
            descriptionHtml
            images(first: 10) {
              edges {
                node {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      `;

      const data = await storefrontFetch<{
        product: {
          id: string;
          title: string;
          descriptionHtml: string;
          images: { edges: { node: ShopifyImageNode }[] };
          variants: { edges: { node: ShopifyVariantNode }[] };
        } | null;
      }>(query, { handle });

      if (data?.product) {
        return {
          id: data.product.id,
          title: data.product.title,
          descriptionHtml: data.product.descriptionHtml,
          images: data.product.images.edges.map(({ node }) => node),
          variants: data.product.variants.edges.map(({ node }) => node),
        };
      }
    } catch (e) {
      console.warn("[shopify] Storefront product fetch failed, falling back to Admin:", e);
    }
  }

  // 2) Admin fallback (server-side only, do not expose token)
  if (ADMIN_TOKEN) {
    const query = /* GraphQL */ `
      query productByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          descriptionHtml
          images(first: 10) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                price: priceV2 {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    `;

    const data = await adminFetch<{
      productByHandle: {
        id: string;
        title: string;
        descriptionHtml: string;
        images: { edges: { node: ShopifyImageNode }[] };
        variants: { edges: { node: ShopifyVariantNode }[] };
      } | null;
    }>(query, { handle });

    const product = data?.productByHandle;
    if (!product) return null;

    return {
      id: product.id,
      title: product.title,
      descriptionHtml: product.descriptionHtml,
      images: product.images.edges.map(({ node }) => node),
      variants: product.variants.edges.map(({ node }) => node),
    };
  }

  return null;
}

export async function createCartWithLines(lines: {
  variantId: string;
  quantity?: number;
}[]): Promise<{ id: string | null; checkoutUrl: string }> {
  if (!STORE_DOMAIN) {
    throw new Error("Missing SHOPIFY_STORE_DOMAIN");
  }

  // Prefer Storefront cart for native checkout + multi-line support
  if (STOREFRONT_TOKEN) {
    const mutation = /* GraphQL */ `
      mutation cartCreate($lines: [CartLineInput!]!) {
        cartCreate(input: { lines: $lines }) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const data = await storefrontFetch<{
      cartCreate: {
        cart: { id: string; checkoutUrl: string } | null;
        userErrors: { field: string[]; message: string }[];
      };
    }>(mutation, { lines });

    const errors = data?.cartCreate?.userErrors;
    if (errors?.length) {
      throw new Error(errors.map((e) => e.message).join("; "));
    }

    const cart = data?.cartCreate?.cart;
    if (!cart?.checkoutUrl) {
      throw new Error("No checkout URL returned from Shopify");
    }

    return cart;
  }

  // Fallback: direct cart link using variant id (no Storefront token required)
  const first = lines[0];
  const variantNumericId = variantGidToId(first.variantId) ?? first.variantId;
  const qty = first.quantity || 1;
  const checkoutUrl = `https://${STORE_DOMAIN}/cart/${variantNumericId}:${qty}`;

  return { id: null, checkoutUrl };
}

export { variantGidToId };
