# MCLIV — Project Context

## Commands

```bash
npm run dev        # shopify hydrogen dev --codegen (local dev + GraphQL codegen)
npm run build      # shopify hydrogen build --codegen
npm run preview    # shopify hydrogen preview --build
npm run lint       # eslint --no-error-on-unmatched-pattern .
npm run typecheck  # react-router typegen && tsc --noEmit
npm run codegen    # shopify hydrogen codegen && react-router typegen
npm run deploy     # npm run build && wrangler deploy
```

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Shopify Hydrogen | 2026.1.0 |
| Router | React Router | 7.12.0 |
| Bundler | Vite | 6.2.4 |
| CSS | Tailwind CSS v4 + custom properties | 4.1.17 |
| 3D | Three.js | 0.161.0 |
| Icons | react-icons (Feather) + simple-icons | 5.5.0 / 16.0.0 |
| Runtime | Cloudflare Workers | — |
| API | Shopify Storefront GraphQL | — |
| Language | TypeScript | 5.9.2 |

## Architecture

- **SSR on Workers** — `server.ts` exports a `fetch()` handler. Uses `createRequestHandler` from Hydrogen + React Router server build.
- **Data loading** — React Router loaders. Critical data awaited, deferred data streamed. Storefront client injected via `createHydrogenRouterContext`.
- **GraphQL** — Inline queries with `#graphql` tag. Shared fragments in `app/lib/fragments.ts`. Codegen via `@shopify/hydrogen-codegen`.
- **Routing** — File-based via `@react-router/fs-routes` configured in `app/routes.ts`.
- **Sessions** — Cookie-based via Hydrogen session utilities in `app/lib/session.ts`.

## Key Directories

```
app/
  routes/         # File-based routes (React Router convention)
  components/     # Shared React components
  lib/            # Utilities: context, fragments, seo, site, session, variants, search
  graphql/        # Customer account GraphQL operations
  styles/         # app.css (main) + reset.css
  assets/         # favicon.svg
server.ts         # CF Workers entry point
public/
  icons/          # logo.svg, logov2.svg, icon.svg, social icons
  images/         # activations/, multimedia/, og/, releases/
```

## Key Routes

| File | Path | Purpose |
|------|------|---------|
| `_index.tsx` | `/` | Homepage — studio identity, activations, product page |
| `archive.tsx` | `/archive` | Product archive layout |
| `archive-main.tsx` | `/archive-main` | Archive main view |
| `products.$handle.tsx` | `/products/:handle` | Individual product (Shopify) |
| `collections.$handle.tsx` | `/collections/:handle` | Collection page |
| `collections._index.tsx` | `/collections` | All collections |
| `cart.tsx` | `/cart` | Cart page |
| `search.tsx` | `/search` | Search results |
| `account.tsx` | `/account` | Account layout (authenticated) |
| `account._index.tsx` | `/account` | Account dashboard |
| `account.orders.*` | `/account/orders` | Order history |
| `activations._index.tsx` | `/activations` | Activation index |
| `activations.$slug.tsx` | `/activations/:slug` | Activation detail/gallery page |

## Environment Variables

See `.env.example`. Required:
- `PUBLIC_STORE_DOMAIN` — Shopify store domain
- `PUBLIC_STOREFRONT_API_TOKEN` — Storefront API token
- `PUBLIC_STOREFRONT_ID` — Storefront ID
- `PUBLIC_CHECKOUT_DOMAIN` — Checkout domain
- `PRIMARY_PRODUCT_HANDLE` — Default product handle
- `SESSION_SECRET` — Session cookie secret

## Conventions

### CSS
- All styling in `app/styles/app.css` using CSS custom properties (`--color-dark`, `--font-display`, etc.)
- Global `border-radius: 0 !important` override — all corners are sharp
- Tailwind v4 installed but custom properties are primary — check app.css before adding utility classes
- Responsive breakpoints: 640px (mobile), 768px (tablet), 900px (desktop split), 960px (wide)

### Components
- PascalCase filenames: `ProductCarousel.tsx`, `SocialLinks.tsx`
- Functional components with TypeScript
- `Sculpture.tsx` uses dynamic Three.js import (avoid SSR)

### GraphQL
- Inline queries with `#graphql` template tag
- Shared fragments in `app/lib/fragments.ts`
- Customer account queries in `app/graphql/customer-account/`
- Run `npm run codegen` after modifying queries

### Icons
- `react-icons` for UI icons (Feather set preferred)
- `simple-icons` for brand/social icons
- Custom SVGs in `/public/icons/` for brand marks

### Accessibility
- `.sr-only` class for screen-reader text
- `prefers-reduced-motion` media query disables animations
- Focus-visible outlines on interactive elements
- Semantic HTML with aria attributes

## Brand Identity

MCLIV (Roman numeral 1154) is a creative studio at the intersection of functional art & cuisine. Monochrome-first aesthetic with GFS Didot display type, sharp corners, and gallery-grade presentation. Full brand system in `BRAND.md`.
