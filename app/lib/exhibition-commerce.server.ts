type Artwork = {productHandle: string; priceAmount: string | null; currency: string};
type Variant = {
  id: string;
  availableForSale: boolean;
  currentlyNotInStock: boolean;
  price: {amount: string; currencyCode: string};
};
export type ExhibitionProduct = {
  handle: string;
  variants: {nodes: Variant[]};
};

export function getExhibitionOffer(artwork: Artwork, product: ExhibitionProduct | null | undefined) {
  if (!artwork.priceAmount || Number(artwork.priceAmount) <= 0) {
    return {status: 'pending' as const, variantId: null};
  }
  const variant = product?.variants.nodes[0];
  if (!product || product.handle !== artwork.productHandle || product.variants.nodes.length !== 1 || !variant) {
    return {status: 'unavailable' as const, variantId: null};
  }
  if (variant.price.currencyCode !== artwork.currency || Number(variant.price.amount) !== Number(artwork.priceAmount)) {
    return {status: 'unavailable' as const, variantId: null};
  }
  if (!variant.availableForSale || variant.currentlyNotInStock) {
    return {status: 'sold-out' as const, variantId: null};
  }
  return {status: 'available' as const, variantId: variant.id};
}

export const EXHIBITION_PRODUCT_QUERY = `#graphql
  query ExhibitionProduct($handle: String!) @inContext(country: US, language: EN) {
    product(handle: $handle) {
      handle
      variants(first: 2) {
        nodes {
          id
          availableForSale
          currentlyNotInStock
          price { amount currencyCode }
        }
      }
    }
  }
` as const;
