/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';
import type {HydrogenEnv} from '@shopify/hydrogen';

declare global {
  interface Env extends HydrogenEnv {
    PRIMARY_PRODUCT_HANDLE?: string;
    ARTIST_SUBMISSIONS_DB?: D1Database;
    ARTIST_SUBMISSION_IMAGES?: R2Bucket;
    MEDIA?: R2Bucket;
    TURNSTILE_SITE_KEY?: string;
    TURNSTILE_SECRET_KEY?: string;
  }
}
