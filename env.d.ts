/// <reference types="vite/client" />
/// <reference types="react-router" />
/// <reference types="@shopify/oxygen-workers-types" />
/// <reference types="@shopify/hydrogen/react-router-types" />

// Enhance TypeScript's built-in typings.
import '@total-typescript/ts-reset';
import type {HydrogenEnv} from '@shopify/hydrogen';

declare global {
  interface ArtistSubmissionEmailMessage {
    to: string;
    from: string | {email: string; name?: string};
    subject: string;
    html?: string;
    text?: string;
    attachments?: Array<{
      content: string | ArrayBuffer | ArrayBufferView;
      filename: string;
      type: string;
      disposition: 'attachment' | 'inline';
      contentId?: string;
    }>;
  }

  interface ArtistSubmissionEmail {
    send(message: ArtistSubmissionEmailMessage): Promise<{messageId: string}>;
  }

  interface Env extends HydrogenEnv {
    PRIMARY_PRODUCT_HANDLE?: string;
    ARTIST_SETTLEMENTS_ENABLED?: string;
    SETTLEMENT_ACCESS_ISSUER?: string;
    SETTLEMENT_ACCESS_AUDIENCE?: string;
    SETTLEMENT_ADMIN_EMAILS?: string;
    SETTLEMENT_PAYOUT_HOSTS?: string;
    SHOPIFY_ADMIN_TOKEN?: string;
    SHOPIFY_STORE_DOMAIN?: string;
    ARTIST_SUBMISSIONS_DB?: D1Database;
    ARTIST_SUBMISSION_IMAGES?: R2Bucket;
    ARTIST_SUBMISSION_EMAIL?: ArtistSubmissionEmail;
    TURNSTILE_SITE_KEY?: string;
    TURNSTILE_SECRET_KEY?: string;
  }
}
