# mcliv — MCLIV Studio Shopify Hydrogen Storefront

## About the Business

**MCLIV Studio** (`mcliv.studio`) is a NYC-based multidisciplinary creative studio founded by John Black. The name is the Roman numeral for 1154. Based at 3 World Trade Center, New York NY 10007.
**Logline:** Creative studio at the intersection of functional art & cuisine.

**What they do:**
- **Limited-run capsule collections** — physical art/design products sold via Shopify (primary product: `studio-hat`)
- **Cuisine-led activations** — art salons, private fine-dining events, product environments, and gallery exhibitions (Art Basel Paris, NYFW, Singapore, Key West)
- **Creative services** — brand identity, web/digital, photo/video, experiential design for clients

**Tone:** High-design, editorial, art-world. Not a typical e-commerce shop — product is secondary to studio identity and cultural programming.

**Contact:** `info@mcliv.studio`

---

## Tech Stack

Shopify Hydrogen 2025.7.0 + React Router 7 + TypeScript (strict), deployed to Cloudflare Workers.

## Commands

```bash
npm run dev        # local dev server with codegen watch
npm run build      # production build
npm run preview    # preview built version
npm run deploy     # build + deploy to Cloudflare Workers
npm run lint       # ESLint
npm run typecheck  # TypeScript check + React Router type gen
npm run codegen    # regenerate GraphQL types + React Router types (run after modifying .graphql files)
```

## Architecture

### Routing
File-based routing in `app/routes/` following React Router v7 conventions. Path alias `~/*` → `app/*`.

### Homepage (`_index.tsx`)
Studio landing page with sequential sections:
1. **Sculpture** — three.js 3D element (`app/components/Sculpture.tsx`)
2. **About** — logline: "Creative studio at the intersection of functional art & cuisine."
3. **Activations** — slideshow carousel linking to individual activation pages
4. **Releases** — primary product (`studio-hat`) with image carousel + checkout button
5. **Creative** — services overview + email CTA
6. **Footer** — social links + copyright

### Activation Pages
- Shared activation data lives in `app/lib/activations.ts`.
- `/activations` renders the activation index.
- `/activations/:slug` renders a project detail page with copy, press links, and image/video gallery.

### Data Fetching
Route `loader()` functions fetch from Shopify Storefront API:
```ts
export async function loader({ context }: LoaderFunctionArgs) {
  const data = await context.storefront.query(GRAPHQL_QUERY, { variables: { ... } });
}
```
Root loader (`root.tsx`) loads nav menus and defers cart/footer. `shouldRevalidate` prevents unnecessary refetches.

Primary product handle is set via `context.env.PRIMARY_PRODUCT_HANDLE` (defaults to `studio-hat`).

### GraphQL
- Fragments centralized in `app/lib/fragments.ts`
- Generated types: `storefrontapi.generated.d.ts` and `customer-accountapi.generated.d.ts`
- Run `npm run codegen` after modifying any `.graphql` files

### SEO
SEO meta tags via `buildMeta()` in `app/lib/seo.ts`. Each route exports a `meta` function.

### Styling
Plain CSS with CSS variables in `app/styles/app.css`. No Tailwind in practice despite it being in deps.

### Layout
`PageLayout.tsx` wraps all pages with header, cart aside, search aside, and mobile menu using `Aside.Provider`.

### Notable Components
- `app/components/Sculpture.tsx` — three.js 3D homepage element
- `app/components/ProductCarousel.tsx` — image carousel used for product images
- `app/components/ContinueToCheckoutButton.tsx` — direct-to-checkout Shopify button
- `app/components/SocialLinks.tsx` — social icons (instagram, tiktok, email)

### Customer Account API
Requires a public domain for local dev. See README for setup instructions.
