export const PRODUCT_BY_HANDLE_QUERY = `#graphql
  query ProductByHandle($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      descriptionHtml
      handle
      featuredImage { id url altText width height }
      images(first: 10) { nodes { id url altText width height } }
      variants(first: 5) {
        nodes { id availableForSale title price { amount currencyCode } }
      }
    }
  }
` as const;
