/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';

declare global {
  interface Env {
    PUBLIC_STORE_DOMAIN: string;
    PUBLIC_STOREFRONT_API_TOKEN: string;
    PUBLIC_STOREFRONT_ID?: string;
    PUBLIC_CHECKOUT_DOMAIN?: string;
    PRIMARY_PRODUCT_HANDLE?: string;
    SESSION_SECRET: string;
  }
}
