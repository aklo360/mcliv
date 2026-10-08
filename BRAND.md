# MCLIV Brand

Status: Canonical · benchmarked to `1620` deck `v14` and public flyer `v20`

This system is extracted from the live storefront and shipped `1620` deck and flyer. Do not invent substitutes when these sources are available.

## Brand DNA

| Field | Canonical value |
|---|---|
| Name | MCLIV Studio |
| Pronunciation | /ˌɛm siː ɛl ˈaɪ viː/ |
| Name origin | Roman numeral 1154 |
| Entity | New York City creative studio |
| Focus | Functional art, multidisciplinary design, limited-run capsule collections, and experiential activations |
| Purpose | Subvert familiar ways of seeing while creating lasting impact beyond spectacle |
| Voice | Precise, cultured, direct, collected, and materially grounded |
| Audience | Collectors, cultural partners, collaborators, venues, guests, and design-led communities |

## Visual Identity

### Color

| Token | Value | Use |
|---|---:|---|
| Ink | `#0A0A0A` | Primary dark canvas and document ink |
| Paper | `#FFFFFF` | Primary light canvas |
| Bone | `#F4F4F4` | Secondary paper stock |
| Graphite | `#3A3A3A` | Supporting text |
| Stainless | `#C4C4C0` | Quiet structural detail |
| Hairline | `rgba(10,10,10,0.24)` | Internal rules and dividers |
| Light hairline | `rgba(255,255,255,0.50)` | Rules over photography |

Use one neutral mode per surface. Color belongs to real artwork, food, materials, and photography; do not add decorative accents.

### Typography

| Role | Stack | Rule |
|---|---|---|
| Document and interface sans | `Helvetica Neue`, `Inter`, Helvetica, Arial, sans-serif | Default voice; medium display weight, regular body, tight display tracking |
| Campaign metadata | `JetBrains Mono`, `Helvetica Neue`, Helvetica, Arial, sans-serif | Uppercase dates, indexes, dimensions, captions, and operational facts only |
| Editorial accent | `GFS Didot`, `Times New Roman`, serif | Storefront/editorial use only; it is not part of the `1620` deck or flyer register |

Use no more than two type voices in one artifact. Never use giant display type in a document register.

### Logo

| Asset | Canonical path | Use |
|---|---|---|
| Primary MCLIV mark | `public/icons/logo.svg` | Header mark, black on light or inverted over dark/photo |
| Extended studio lockup | `public/icons/logov2.svg` | Use only when the full studio descriptor is needed |

Keep the mark straight-on, uncropped, unskewed, and clear of neighboring content. Do not redraw it or bake it into generated artwork.

## Approved Reference Artifacts

| Register | Canonical output | Source | Frame |
|---|---|---|---|
| Client deck | `assets/1620/proposal/exports/1620-website-deck-v14.pdf` | `website-deck.css` + `deck.html` | 1920 × 1080 · 16:9 |
| Public flyer | `assets/1620/proposal/exports/1620-public-flyer-v20.png` | `public-flyer-v16.html` + CSS cascade `v9`–`v16` | 1080 × 1440 · 3:4 |

These two outputs are the taste benchmark. Copy their governing moves, not event-specific copy or imagery.

## Composition System

- Gold standard: `assets/1620/proposal/exports/1620-website-deck-v14.pdf`.
- Use a fixed 16:9 frame, 12-column grid, 64 px-equivalent outside gutter, and 28 px-equivalent column gap.
- Use a three-part header: MCLIV mark / subject and section / context or status.
- Use one shared uppercase micro-label spec for section indexes, captions, metadata, and folios.
- Use 1 px-equivalent hairlines as load-bearing structure, not decoration.
- Use asymmetric compositions with measured negative space; every block follows a shared axis.
- Use archive furniture: section index, descriptive caption, and `NN / TOTAL` folio.
- Use flat paper stocks and square corners. Do not use cards, pills, rounded panels, gradients, shadows, or interface chrome.
- Reserve full-bleed photography for covers, closers, and evidence that only photography can prove.
- Interior slides are typographic, image-led, or diagrammatic; never decorative.
- Preserve real artwork proportions. Do not distort, recolor, regenerate, or crop away material content.

## Deck Register

- Open and close deliberately; photographic bookends are preferred when approved source photography exists.
- Keep title hierarchy compact and editorial. Avoid oversized poster typography inside a presentation.
- Let supplied images carry all chroma; keep frames, labels, and grounds neutral.
- A portfolio may use two-up or three-up plates when the works remain legible. Reserve hero slides for visually dominant works.
- Every slide must read as one composition, not a set of modular UI panels.
- No animation is required. Stillness is part of the system.

## Flyer And Campaign Register

- Use the `v20` flyer as the approved public-campaign benchmark: black field, white type, grayscale documentary hero, and no added accent color.
- Use the same 12-column geometry as the deck: 64 px outside margin and 28 px gutter at 1080 px width.
- Use the header triad: MCLIV mark / event category / partner or venue mark, divided from the hero by one light hairline.
- Pair a large sans numeral or event title with compact monospaced facts. Large type is permitted here and on approved deck bookends, not on interior document slides.
- Make the information architecture visible: premise, measured format, location, numbered roster, and after-party or action band.
- Use evidence before decoration. The `16 × 20 IN.` crosshair diagram communicates the constraint; it is not an ornamental motif.
- Use JetBrains Mono only for metadata. Use Helvetica Neue for headlines, names, and reading text.
- Keep the roster ordered, numbered, and ruled. Facts must be verified; no promotional claim is a design element.
- Preserve the final after-party lockup as one centered horizontal group. Do not add a footer, cards, pills, badges, gradients, shadows, or color tags.

## Photography And Art Direction

- Favor documentary, installation, studio, process, food, and gathering imagery with real provenance.
- Use full-bleed images only when they can support type with controlled contrast.
- Keep grade, crop logic, horizon, and white balance consistent within a sequence.
- Never generate substitutes for supplied artwork, people, events, venues, press evidence, or product imagery.

## Content Pillars

1. Functional art and limited-run objects.
2. Multidisciplinary creative practice.
3. Art, hospitality, and cultural activations.
4. Studio tours, workshops, and process.
5. Artist collaborations and capsule releases.

## Domains And Social Channels

| Channel | Canonical route |
|---|---|
| Website | `https://mcliv.studio` |
| Email | `info@mcliv.studio` |
| Instagram | `https://www.instagram.com/mcliv_studio` |
| YouTube | `https://www.youtube.com/@mcliv.studio` |
| X | `https://x.com/mcliv_studio` |
| TikTok | `https://www.tiktok.com/@mcliv.studio` |

## Implementation Evidence

- Storefront tokens and typography: `app/styles/app.css`.
- Brand description and studio positioning: `app/routes/_index.tsx` and `app/lib/seo.ts`.
- Social routes: `app/lib/site.ts`.
- Logo paths: `public/icons/logo.svg` and `public/icons/logov2.svg`.
- Deck grid and document grammar: `assets/1620/proposal/website-deck.css` and `assets/1620/proposal/deck.html`.
- Shipped deck benchmark: `assets/1620/proposal/exports/1620-website-deck-v14.pdf`.
- Flyer grid and campaign grammar: `assets/1620/proposal/public-flyer-v9.css` through `public-flyer-v16.css` and `public-flyer-v16.html`.
- Shipped flyer benchmark: `assets/1620/proposal/exports/1620-public-flyer-v20.png`.
