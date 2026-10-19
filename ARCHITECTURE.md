# MCLIV Architecture

Status: Canonical

## Purpose

MCLIV is the studio’s headless Shopify storefront and editorial website. It
combines commerce flows with MCLIV’s releases, workshops, archive, and brand
presentation.

## Brand Identity

MCLIV uses a strict black, white, and bone editorial system with measured grids,
archive furniture, restrained typography, and source-authentic imagery. The
canonical visual and voice rules are in `BRAND.md`.

## Canonical Implementation

- Shopify Hydrogen `2026.1.0` supplies the storefront runtime and GraphQL data
  layer.
- React Router `7.12.0`, React `18.3.1`, TypeScript, and Vite implement the app.
- `server.ts` is the Worker request entry point. It creates the Hydrogen context,
  session, cache, cart, and storefront clients before dispatching the router.
- `wrangler.toml` defines the Cloudflare Worker `mclivstudio` and static asset
  directory. Deployment is an explicit external action.
- `/proposals/1620` is a standalone six-slide exhibition deck. `app/root.tsx`
  bypasses Shopify root-loader work and storefront chrome for this route; its
  component and versioned visual assets live in `app/routes/proposals.1620.tsx`
  and `assets/1620/`.
- The `1620` recap edit is a local Resolve production workflow, documented in
  `docs/1620-recap.md`. `assets/1620/recap-shot-log.csv` owns footage logging;
  `assets/1620/recap-edit.json` owns assembly timing and trims. The native Resolve
  project owns grades, stabilization and reframing. Versioned import drafts and
  rendered media stay in ignored `output/1620-recap/`. The original BRAW card
  remains read-only. This workflow does not change the website or deployment.
- `/1620` is the exhibition catalogue; `/1620/:artist` serves the 18 roster
  pages (`/1620/aclo` redirects to `/1620/aklo`, and `/1620/gazoo-tothemoon`
  redirects to `/1620/gazoo`). These standalone routes use
  `exhibition-1620.css` and preserve storefront navigation across the root-loader
  boundary. `scripts/export-1620-catalog.mjs` derives their public data from
  `assets/1620/proposal/content.js` and explicitly reviewed D1 submission IDs.
  The deployed catalogue includes 17 submissions through September 16, 2026,
  and 17 artwork images under `public/images/1620/` from the September 16
  studio photographs, plus Gianni Lee's artist-supplied iPhone photograph
  exported as a transparent PNG master with a WebP web copy
  (`gianni-lee-corrected-v2.webp`, served): the cowrie
  shells glued along the bottom edge and lower corners keep their silhouette
  through a texture matte, and the truncated bead curtain below is cropped
  away. Matted entries carry `extend` and `matte` fields in the manifest, the
  pipeline decodes HEIC too, and the catalogue export prefers the WebP.
  Trouble Andrew's artwork details remain placeholders (`Untitled`, `Details
  forthcoming.`); AKLO priced the work at USD 6,000 on September 16, 2026, so
  it now sells like the others. An unpriced work would show `Inquire within`
  with an email link to `info@mcliv.studio` instead of a buy button.
  `assets/1620/artist-bios.json` owns supplementary bios and editorial cleanup;
  submitted bios take precedence. Approved prices are USD 1,111 for AKLO,
  USD 2,000 for Smurfo, USD 1,500 for John Black and USD 6,000 for Trouble
  Andrew, retained as explicit export overrides. Raw database exports are temporary inputs,
  never public catalogue fields.
- `assets/1620/artwork-image-edits.json` (version 3) owns measured crop
  corners and photo corrections. `scripts/process-1620-artwork.mjs` decodes DNG
  or Sony ARW natively at 16 bits, applies neutral-wall white balance, a uniform
  +0.45 EV lift and 1.25 sigmoidal contrast, then four-corner rectification to
  versioned sRGB JPEGs (`<slug>-corrected-v3.jpg`, AKLO and King Saladeen `v4`,
  2400 px tall).
  Sources are the sharpest frame per work from Parker's Sony ILCE-7RM5 shoot,
  kept in `assets/1620/` as `<slug>-PC_xxxxx.ARW`; the earlier DNGs remain.
  Corners are the measured front face: the outer silhouette from wall-tracking
  scans, inset per side by the stretcher or frame side face measured as the
  flat low-variance band on the rectified export. Hung canvases lean forward,
  so bottom faces are widest and no depth model predicts them. Frames are
  included to their front face; Cavier Coleman's white frame matches the wall
  tone, so its top and right rails mirror the measured left rail width. The
  measurement tooling was session scratch and is not versioned; the corners
  are the data. Version 1 and the unshipped version 2 manifests remain as
  `superseded` entries. Catalogue exports prefer available corrected images.
- `app/lib/galleries/1620.ts` owns the nine edited horizontal exhibition
  photographs supplied by Parker through John Clements. The original JPEGs are
  preserved in `assets/1620/exhibition-photos/`; size-optimized WebP copies are
  served from `public/images/1620/exhibition/` without AI regeneration or
  content edits. The first full-room view leads the homepage hero. `/1620` is
  the canonical exhibition and activation page, with all nine installation
  views in one carousel above the works. It is first in the homepage and
  activation indexes; the former `/activations/1620` URL redirects to `/1620`.
- Exhibition product handles are stable catalogue identifiers; Gazoo retains
  `1620-gazoo-tothemoon` despite the shorter public URL. Purchase actions recheck
  the product, approved USD price, single variant and stock before adding one
  item and redirecting to Shopify checkout. Missing products or prices disable
  purchase. `scripts/export-1620-products.mjs` prepares versioned draft-product
  inputs; `scripts/create-1620-products.mjs --check|--apply` verifies the exact
  store and preserves existing products. Draft creation, product media, inventory
  activation, sales-channel publication and website deployment are distinct
  steps; website deployment does not imply any of them occurred. Version 13 of
  the draft-product import carries the 17 version-3 image URLs, Gianni Lee's
  WebP and all 18 prices (a `Price Pending` tag only while a price is missing). On September 16, 2026 a second setup preview ran the `media`
  action (upload the reviewed source, wait for READY, remove the old media,
  idempotent by filename) on all 18 products and the `weight` action set every
  variant to 2 lb. Shipping stays carrier-calculated on the general profile
  with free local pickup at the Shop location; a `shipping-setup` action exists
  for a dedicated flat-rate profile but was not run (AKLO withdrew the $75
  rate). The `scopes` action showed the `Front End` Admin token holds
  near-complete store scopes, including orders, shipping and themes; narrow it
  when convenient. On September 16, 2026, all 18 products were created in shop
  `gid://shopify/Shop/78018445562` (`g8x5xa-r0.myshopify.com`, USD). The existing
  `Front End` Admin token now has the required product, inventory, publication,
  location and file permissions; customer access remains intact.
  Seventeen priced originals are ACTIVE with one tracked unit each, inventory
  policy DENY, at `gid://shopify/Location/85980545274` (Shop location). They are
  published only to `gid://shopify/Publication/178928746746` (MCLIV / Hydrogen).
  Trouble Andrew's `1620-trouble-andrew` product was DRAFT with zero stock until
  September 16, 2026, when a setup preview set its price to USD 6,000, stocked
  one original (`stock-initial`: `inventoryAdjustQuantities` with
  `changeFromQuantity: 0` and a field-level `@idempotent` key, refused once a
  work was ever published or held stock) and published it to MCLIV; all 18
  originals are now ACTIVE.
  All 18 production artist pages and Storefront API results were verified; a
  priced work reached Shopify's payment step with free pickup available. No
  order or payment was submitted. Existing shipping and payment settings remain.
  `scripts/manage-1620-products.mjs` implements bounded setup operations for an
  authenticated, expiring Worker preview, never a production route. It fixes
  store, product manifest, inventory location and sales channel, preserves
  existing products and never restocks them. Shopify automatically added Meta
  and Microsoft Copilot; product-specific `publicationUpdate` removals excluded
  the exhibition from those channels without changing store-wide settings.
  `publishableUnpublish` did not remove those automatic catalog memberships.
  Admin requests preserve POST data across the reviewed one-hop redirect between
  the two MCLIV myshopify domains. Future price changes must update both the
  approved catalogue and Shopify variant; a mismatch disables purchasing.
- `/submit` is the standalone MCLIV artist-submission flow. Its five fields are
  artwork name, material/media, artist bio, price, and an optional image. The
  artist-bio step requires either entered text or a PDF, DOC, or DOCX upload up
  to 5 MB.
  `app/routes/submit.tsx` validates submissions server-side and sends each valid
  submission through the `ARTIST_SUBMISSION_EMAIL` binding from
  `submissions@mcliv.studio` to the fixed, verified `info@mcliv.studio`
  destination. The email includes every response, the optional bio document,
  and the optional original image. D1 stores the submission record, and R2
  stores the optional image; optional JPEG, PNG, or WEBP files are limited to
  10 MB. Cloudflare Turnstile protects production
  submissions through provider-managed `TURNSTILE_SITE_KEY` and
  `TURNSTILE_SECRET_KEY` bindings.
- The home-page newsletter uses `app/components/NewsletterSignup.tsx` and the
  same-origin `/api/newsletter` action. The action upserts the submitted email
  and records explicit marketing consent through Shopify Admin API `2026-07`,
  applies the `MCLIV Newsletter` customer tag, and manually preserves the POST
  body across Shopify's one-hop Admin API redirect. Its `SHOPIFY_ADMIN_TOKEN` binding
  remains provider-managed and server-only. Newsletter Admin API fetches must
  not set `RequestInit.cache`; Hydrogen's Worker runtime rejects that field
  before making the Shopify request. The action does not send welcome mail;
  Shopify Messaging must use a headless-compatible Flow rather than the standard
  form-subscription trigger, which does not run for Admin API submissions.

## Repository Map

- `app/routes/`: storefront, account, cart, products, collections, archive,
  workshops, proposals, search, policy, blog, sitemap, and API routes.
- `app/components/`: shared commerce and presentation components.
- `app/lib/`: Hydrogen context, sessions, GraphQL fragments, search, redirects,
  SEO, and site configuration.
- `app/styles/`: global application and reset styles.
- `migrations/`: D1 schema migrations for artist submissions.
- `public/`: versioned public media and static assets.
- `assets/`: non-runtime project source material, currently the `1620/`
  event-gallery collateral.
- `docs/`: project guides and historical reference, including `ARCHIVE.md`.
- `output/`: generated collateral; inspect ownership before editing or
  regenerating.
- `scripts/`: bounded export utilities for MCLIV collateral.
- `CHANGELOG.md`: technical history; retrieve on demand, never as startup context.
- `ARCHIVE.md`: historical reference; retrieve only when the task requires it.

## Data And Request Flow

Cloudflare invokes `server.ts`, which creates the Hydrogen request context from
Worker bindings and the incoming request. React Router loaders and actions use
that context for Shopify Storefront API, cart, customer-account, and session
operations. Route components render the response and static assets are served
from the Wrangler asset binding.

Runtime credentials belong only in local or provider-managed secret stores.
Required names are documented by `.env.example`; never place their values in
context files, source, logs, or commits.

## Identity And Deployment Boundary

- Git remote: repository identity must be verified immediately before any
  commit or push; never infer it from the remote URL alone.
- Deployment target: Cloudflare Worker `mclivstudio` as declared by
  `wrangler.toml`.
- Production version `4ddce356-36d7-4657-a82b-6038d2d666ba` was deployed on
  September 23, 2026, from the `feat/artist-settlements` worktree. `/1620` is
  the only exhibition/activation page, linked from the homepage and activation
  indexes. Its nine-photo carousel uses a three-column grid: side-arrow outer
  edges align exactly with the intro and works, with the photo in the centre
  column. The desktop frame is 5:3 with a modest vertical crop; mobile shows
  full photos. Source photos are unchanged. It has no redundant label, divider,
  caption, or lower gallery; the artist settlement walkthrough remains
  available. Previous version `5b1081f9-9f88-4a14-a819-66b76b492e5f` is the
  immediate rollback target.
  Local commit `50760df` on branch
  `release/1620-2026-09-16` (worktree `/private/tmp/mcliv-1620-production-20260916`)
  is the September 16 baseline source; it is not pushed. The release adds only the exhibition to
  the prior production source `b1b6c27`, preserving the existing homepage, shop,
  newsletter and artist-submission implementation. The dirty `main` checkout is
  not a production source and must not be deployed; the exhibition scripts and
  `assets/1620/` manifests live untracked in `main`. The GitHub repository
  `aklo360/mcliv` is public while tracking project context files; nothing from
  the release branch has been pushed. The exhibition header is a
  three-column grid so its centre label stays centred at every width, the cart
  link reads `Cart`, and arrows are the inline SVG `ExhibitionArrow`; MCLIV
  never uses emoji or arrow glyphs. The main header carries no
  `1620` link by AKLO's decision; the exhibition is reached by direct link until
  it is added under Activations. Rollback version
  `cc193fdf-8cab-4cb6-9f29-bf042767c327` preserves the site before Trouble
  Andrew's price; `6da28786-e0b5-45f6-b295-6a5b80b15c9a` preserves the site
  before the mobile header and arrow changes; `03e42130-b109-4874-a25c-9b6cd66eb83a` preserves
  the site with the header link; `336bf9ae-aae2-4fe9-8fbb-a589ebde5e98` preserves the site before the King
  Saladeen bottom-edge fix; `87a46a1e-0a56-413d-92ba-f233d901ff16` preserves
  the photographed catalogue before Gianni Lee's image; `ecfbd9b1-3fe7-431a-aed8-3ea74d049778` preserves
  the site before the photographed catalogue and the inquiry link; `e9b55336-296b-46ad-bdb4-fbae5b44ba30`
  preserves the exhibition before the Smurfo and John Black price revisions;
  `bc3ca1d0-ca07-4613-9c4d-c2ee44cdb0e4` preserves the August 31 site.
  Cloudflare returns 403 to non-browser user agents such as Python urllib; verify
  the live site with browser headers. Missing artwork titles use `Untitled`, and missing media
  uses `Details forthcoming.` Each artist page shows the size only in its
  Dimensions section, including when its artwork image is missing.
  Cloudflare Email Sending is enabled for `mcliv.studio`; its
  outbound authentication records are separate from the unchanged Google
  Workspace root MX and SPF records. `info@mcliv.studio` is a verified fixed
  destination.
  The D1 database is `mcliv-artist-submissions`; the R2 bucket is
  `mcliv-artist-submission-images`.
- A successful local build never authorizes a deploy.

## Artist Settlement Feature

The reusable artist agreement/manual-payout feature is on
`feat/artist-settlements`, based on production source `50760df`, in
`.worktrees/artist-settlements`. The temporary checkout was moved into the
project; use this permanent worktree for continued development. Main remains
an unrelated dirty historical checkout and must not be deployed.

The AKLO test walkthrough is live at
`https://mcliv.studio/artists/settlements/preview/aklo`. It reuses the artist
screens in a focused Review → Payment → Sign flow, with a white document viewer
and fixed action bar. It sets only a signed one-hour browser test cookie and
produces marked sample PDFs. Full agreement text is preserved; bank details
stay with the provider, and payment status is disclosed after signing. It does not create sales, real signatures, D1 records, emails,
provider destinations or transfers. Real artist/admin settlement routes remain
disabled pending legal parties, verified sale facts, provider/fees, and Access
configuration. Each sold painting has its own agreement and payout record;
Lola remains the first planned real case. No settlement migration was applied.

The real flow uses per-record cookie names with Path `/artists/settlements` so
React Router's `.data` requests retain the session. Agreement PDFs use dedicated
resource routes ending in `/agreement.pdf`. The shared UI and both paths were
verified against the production bundle. Workflow and rollout instructions are
owned by `docs/artist-settlements.md` in the feature worktree.

## Commands

```text
npm run dev        local Hydrogen development server
npm run lint       ESLint
npm run typecheck  React Router type generation plus TypeScript validation
npm run build      production Hydrogen build and code generation
npm run preview    local preview of the production build
npm run deploy     build and deploy; explicit approval required
node scripts/check-1620.mjs  verify catalogue and purchase guards
node --conditions=workerd scripts/check-1620-runtime.mjs  test the built exhibition with synthetic Shopify responses
node scripts/export-1620-price-sheet.mjs v1  two-sided Letter catalogue and price list PDF in output/ (v7 is current)
```

## Verification Contract

Use the narrowest check that covers the change. Type or routing changes require
`npm run typecheck`; application changes normally require lint plus a production
build. Commerce, session, account, checkout, or deployment changes require a
bounded integration check with non-production-safe data before promotion.

Never delete or overwrite rendered creative exports during iteration. Preserve
each new export as a new version unless a specific artifact is explicitly
approved for replacement or removal.
