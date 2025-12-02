# .cursor/rules/hydrogen-react-router.mdc

```mdc
---
description: 
globs: 
alwaysApply: true
---

# React Router Import Rule for Hydrogen

## Overview

This Hydrogen project is based on React Router, not Remix. When working with documentation or code examples, you should always use imports from the appropriate React Router packages instead of Remix packages.

## Import Replacements

When you see imports from Remix packages, replace them with their equivalent React Router v7 packages. Here are the common replacements:

| Remix v2 Package | React Router v7 Package |
|------------------|-------------------------|
| `@remix-run/react` | `react-router` |
| `@remix-run/dev` | `@react-router/dev` |
| `@remix-run/architect` | `@react-router/architect` |
| `@remix-run/cloudflare` | `@react-router/cloudflare` |
| `@remix-run/express` | `@react-router/express` |
| `@remix-run/fs-routes` | `@react-router/fs-routes` |
| `@remix-run/node` | `@react-router/node` |
| `@remix-run/route-config` | `@react-router/dev` |
| `@remix-run/routes-option-adapter` | `@react-router/remix-routes-option-adapter` |
| `@remix-run/serve` | `@react-router/serve` |
| `@remix-run/server-runtime` | `react-router` |
| `@remix-run/testing` | `react-router` |

NEVER USE 'react-router-dom' imports!

## Common Import Examples

\`\`\`js
// INCORRECT (Remix style)
import { useLoaderData, Link, Form, useActionData, useNavigation, useSubmit } from '@remix-run/react';

// CORRECT (React Router style)
import { useLoaderData, Link, Form, useActionData, useNavigation, useSubmit } from 'react-router';
\`\`\`

## Development Guidelines

1. Always check existing code in the project to understand which specific React Router hooks and components are being used
2. When generating new code or modifying existing code, ensure all routing-related imports come from the correct React Router packages
3. If following documentation or examples based on Remix, adapt the code to use React Router equivalents

When working in this codebase, always follow the React Router patterns that are already established in the existing code.

For more information, consult the official Remix to React Router upgrade guide: https://reactrouter.com/upgrading/remix
```

# .gitignore

```
node_modules
.next
.env.local
.DS_Store
dist
coverage
*.log
.env
.open-next
.react-router
build

.shopify

```

# .graphqlrc.ts

```ts
import type {IGraphQLConfig} from 'graphql-config';
import {getSchema} from '@shopify/hydrogen-codegen';

/**
 * GraphQL Config
 * @see https://the-guild.dev/graphql/config/docs/user/usage
 * @type {IGraphQLConfig}
 */
export default {
  projects: {
    default: {
      schema: getSchema('storefront'),
      documents: [
        './*.{ts,tsx,js,jsx}',
        './app/**/*.{ts,tsx,js,jsx}',
        '!./app/graphql/**/*.{ts,tsx,js,jsx}',
      ],
    },

    customer: {
      schema: getSchema('customer-account'),
      documents: ['./app/graphql/customer-account/*.{ts,tsx,js,jsx}'],
    },

    // Add your own GraphQL projects here for CMS, Shopify Admin API, etc.
  },
} as IGraphQLConfig;

```

# AGENTS.md

```md
# Repository Guidelines

## Project Structure & Module Organization
- Root: Next.js 15 (App Router) with TypeScript and Tailwind v4.
- `app/`: Route segments (e.g., `app/page.tsx`, `app/releases/page.tsx`).
- `components/`: Reusable UI (PascalCase files, colocated styles).
- `lib/`: Utilities (fetchers, helpers, config).
- `public/`: Static assets: `fonts/`, `audio/`, `images/`, `icons/` (see PRD for expected files).
- `styles/` or `app/globals.css`: Tailwind import and design tokens.
- `tests/`: Unit and component tests.

Example routes:
`app/`, `app/releases/page.tsx`, `app/activations/page.tsx`, `app/multimedia/page.tsx`.

## Build, Test, and Development Commands
- `npm run dev`: Start local dev server.
- `npm run build`: Production build (Next.js + TypeScript).
- `npm start`: Run production build locally.
- `npm run lint`: ESLint (TypeScript, React, Tailwind plugins).
- `npm test`: Run unit/component tests (Vitest + Testing Library).
- `npx shadcn@latest add <component>`: Generate UI components used by the design system.

## Cloudflare Workers (OpenNext) Deployment
- Worker name: `mclivstudio` (see `wrangler.jsonc`)
- Config files:
  - `open-next.config.ts` — minimal OpenNext Cloudflare config
  - `wrangler.jsonc` — points to `.open-next/worker.js`, flags `nodejs_compat`, assets binding
  - `.gitignore` includes `.open-next/`
- Env vars (Cloudflare → Workers → Settings → Variables):
  - Text: `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_API_VERSION` (optional; defaults to `2025-07`)
  - Secret: `SHOPIFY_ADMIN_TOKEN`
- Scripts:
  - `npm run opennext:build` — build OpenNext output to `.open-next/`
  - `npm run deploy` — deploy via Wrangler using `wrangler.jsonc`
  - `npm run preview` — local Workers dev (requires prior build)
- Notes:
  - No Edge runtime exports; Node-compat is enabled via `nodejs_compat`.
  - API route `/api/newsletter` uses manual redirect-follow for Shopify and avoids PII reads.

## Coding Style & Naming Conventions
- TypeScript required; strict types preferred.
- Components: PascalCase (`Header.tsx`), hooks: `useThing.ts`.
- Files in `app/` follow Next.js conventions (`page.tsx`, `layout.tsx`, `route.ts`).
- CSS: Tailwind utilities first; custom tokens via `@property` in globals.
- Format with Prettier; lint with ESLint before pushing.

## Testing Guidelines
- Frameworks: Vitest + React Testing Library.
- Location: `tests/` mirrors `app/` and `components/` paths.
- Naming: `*.test.ts`/`*.test.tsx`.
- Coverage: Focus on critical flows (audio toggle, motion prefs, grid behavior). Run via `npm test`.

## Commit & Pull Request Guidelines
- Commits: Prefer Conventional Commits (e.g., `feat: add SoundToggle`), scoped and atomic.
- PRs: Clear description, linked issue, screenshots or screen-caps for UI, list of changes and test notes.
- CI must pass build, lint, and tests.

## Security & Configuration Tips
- Env vars: Use `.env.local` (never commit). Example: `NEXT_PUBLIC_ANALYTICS_KEY=...`.
- Assets: Optimize images (WebP/AVIF). Do not auto-play audio; respect user preferences.
- Accessibility: Uphold WCAG 2.1 AA; include ARIA for controls and keyboard support.


## Project Overview

MCLIV Studio is a NYC based functional art and design house developing limited-run capsule collections and collaborative activations that subvert the way we think about the world while creating lasting transformative impact beyond mere spectacle. 

The name MCLIV (roman numeral 1154) is a nod to the Badder-Meinhof Phenomenon. Once seen, it cannot be unseen, it’s everywhere. Attention multiplies meaning, through art objects and experiences that evoke mindful conscious awareness, we elevate signal from the noise. 


This is a Next.js-based website focusing on minimal, architectural design with optional ambient wind soundscape functionality, built around the Wind/Water theme.

## Target Audience

- **Design-literate viewers**: Collectors, curators, brand partners who appreciate sophisticated aesthetic choices
- **Press & galleries**: Need clean assets, one-sheet facts, and professional presentation materials
- **Collaborators**: Require quick contact options and project collaboration capabilities

## Key Design Principles

- **Brand Voice**: Minimal, architectural, technical-poetic
- **Palette**: Black (#000000), White (#FFFFFF), Charcoal (#0A0A0A), Heather (#6E6E6E)
- **Typography**: GFS Didot Italic for display (H1/H2), Inter for body/UI
- **Motion Philosophy**: Micro-motion only, respect `prefers-reduced-motion`
- **Wind/Water Theme**: Calm flow, negative space, meditative micro-motion

## Technical Architecture

### Tech Stack
- Next.js 15 (App Router) with React 19
- TypeScript
- Tailwind CSS v4.0 (with custom design tokens, cascade layers, container queries)
- shadcn/ui v3.0 (component system with CLI)
- Motion (formerly Framer Motion) - production-grade animation
- GSAP (now free) - advanced animations and micro-interactions  
- Web Audio API for wind soundscape

### Design System Implementation

#### Modern CSS Implementation (Tailwind v4.0)

**Installation & Setup**
\`\`\`css
/* Single-line CSS import - no more @tailwind directives */
@import "tailwindcss";

/* Custom design tokens using @property for better performance */
@property --black { syntax: "<color>"; inherits: true; initial-value: #000000; }
@property --white { syntax: "<color>"; inherits: true; initial-value: #FFFFFF; }
@property --charcoal { syntax: "<color>"; inherits: true; initial-value: #0A0A0A; }
@property --heather { syntax: "<color>"; inherits: true; initial-value: #6E6E6E; }
\`\`\`

**Cascade Layers Structure**
\`\`\`css
@layer reset, base, components, utilities, overrides;

@layer base {
  :root {
    /* Grid System with Container Queries */
    --grid-columns: 12;
    --grid-gutters: 72px;
    --grid-margins: 96px;
    --baseline: 6px;
    
    /* Spacing Units (6px baseline) */
    --u1: 6px; --u2: 12px; --u4: 24px; --u6: 36px; --u12: 72px; --u16: 96px;
    
    /* Typography with Modern CSS Features */
    --h1-size: 84px; --h1-lh: 96px;
    --h2-size: 56px; --h2-lh: 60px;
    --h3-size: 28px; --h3-lh: 36px;
    --body-size: 16px; --body-lh: 24px;
    --meta-size: 13px; --meta-lh: 20px;
  }

  /* Base Styles with color-mix() for future theming */
  html, body {
    background: color-mix(in srgb, var(--white) 100%, transparent);
    color: color-mix(in srgb, var(--black) 100%, transparent);
  }
}

@layer components {
  /* Typography Classes */
  .h1 {
    font: 700 italic var(--h1-size)/var(--h1-lh) "GFS Didot", serif;
    letter-spacing: -0.01em;
    margin: 0 0 var(--u12);
  }

  .h2 {
    font: 700 italic var(--h2-size)/var(--h2-lh) "GFS Didot", serif;
    letter-spacing: -0.005em;
    margin: 0 0 var(--u6);
  }

  body {
    font: 400 var(--body-size)/var(--body-lh) Inter, system-ui, sans-serif;
  }

  .meta {
    color: var(--heather);
    font-size: var(--meta-size);
    line-height: var(--meta-lh);
  }

  /* Frequency Pattern with CSS Houdini support */
  .freq {
    background-image: radial-gradient(var(--charcoal) 1px, transparent 1px);
    background-size: 72px 72px;
    opacity: 0.08;
  }

  /* Container Query Support */
  .grid-container {
    container-type: inline-size;
  }

  @container (min-width: 768px) {
    .grid-responsive {
      grid-template-columns: repeat(6, 1fr);
    }
  }

  @container (min-width: 1024px) {
    .grid-responsive {
      grid-template-columns: repeat(12, 1fr);
    }
  }
}
\`\`\`

### Core Components to Implement

**shadcn/ui Integration**
\`\`\`bash
# Initialize shadcn/ui in existing project
npx shadcn@latest init

# Add specific components
npx shadcn@latest add button card badge slider
\`\`\`

**Component Architecture**
- `Header` - Logo left, Wind control right, sticky navigation (shadcn/ui NavigationMenu)
- `Footer` - Studio email, founders contact, minimal nav
- `Hero` - Display H1 with Didot Italic, mission statement, founder introduction
- `ReleaseCard` - shadcn/ui Card with Image, title, type (Merch/Furniture/Sculptural), status, edition info
- `ActivationCard` - shadcn/ui Card with project image, type (Culinary/Installation/Experiential), description
- `MultimediaCard` - Portfolio piece with category (Web/Photo/Video)
- `EditionStamp` - shadcn/ui Badge component - "MCLIV / 1154 / No. 00X" formatting for releases
- `PatternPanel` - Frequency background at 5-8% charcoal opacity (ties to 1154 concept)
- `SoundToggle` - shadcn/ui Button + Slider for audio toggle with volume control
- `GridContainer` - 12-column grid with container queries and proper margins
- `PillarSection` - Component for displaying the 3 pillars framework with Motion animations

**Advanced UI Components**
- `AnimatedBackground` - GSAP-powered frequency pattern animations
- `ScrollProgress` - Motion-based scroll indicators
- `ImageHover` - Micro-interactions with Motion (1.01 scale + 0.5px blur)
- `LoadingStates` - shadcn/ui Skeleton components for graceful loading
- `AccessibilityControls` - Motion preference toggles, audio controls with proper ARIA

## Audio System Requirements

### Critical Audio Rules
- **NEVER auto-play** - Audio only starts after explicit user interaction
- User-initiated only via Wind toggle button
- Persistent controls with localStorage preference storage
- Fade in/out over 1.5-2.0 seconds
- Target loudness: ~-20 LUFS, peaks ≤ -12 dBFS
- Respect `prefers-reduced-data` and iOS Low Power mode

### Audio Implementation
- Load audio files on first user interaction (deferred loading)
- Support both wind.m4a (AAC) and wind.ogg (Opus) formats
- Seamless loop, 45-90 seconds duration
- Web Audio API or `<audio>` element hybrid approach

## Accessibility Requirements

- WCAG 2.1 AA compliance
- No content depends solely on motion or sound
- Visible focus styles throughout
- Audio controls: `aria-pressed` for toggle, `aria-valuenow` for volume
- Keyboard navigation: Space/Enter toggles audio, ←/→ adjusts volume
- All decorative patterns must be `aria-hidden`

## Performance Requirements

- LCP ≤ 2.5s on 4G networks
- CLS ≤ 0.1
- TTI ≤ 3.5s
- Critical CSS inline, `font-display: swap`
- Lazy-load all non-critical media
- WebP/AVIF with 1×/2× responsive images
- Hero images target < 250KB

## Page Structure

### Information Architecture
- `/` - Home (mission, founders, philosophy, Wind/Water theme)
- `/releases` - Merch, Furniture, Sculptural collections
- `/activations` - Culinary, Installation & Experiential Marketing projects
- `/multimedia` - Web, Photo, Video portfolio

### 3 Pillars Framework
The site architecture reflects MCLIV's three core pillars:

**Releases**: Limited-run capsule collections including merchandise, furniture, and sculptural works with edition numbering system (1154)

**Activations**: Culinary experiences, installation art, and experiential marketing collaborations

**Multimedia**: Web development, photography, and video production services and portfolio

## Motion Design Guidelines

### Modern Animation Stack
- **Motion (Framer Motion)**: Primary animation library for React components
- **GSAP (Free 2025)**: Advanced micro-interactions, ScrollTrigger, and complex animations
- **CSS Animations**: Simple transitions and @starting-style for enter/exit effects

### Animation Principles
- Micro-motion only, no parallax > 10%
- Scroll ease-out (180-220ms) for "exhale" feel
- Image hover: 1.01 scale + 0.5px blur (≤160ms)
- Entrance animations: fade/slide-up ≤180ms, 10px distance, 60ms stagger
- Always guard with `prefers-reduced-motion: reduce`

### Motion Implementation Examples
\`\`\`tsx
// Motion component with prefers-reduced-motion support
const AnimatedCard = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ 
      duration: 0.18, 
      ease: "easeOut",
      reduce: { duration: 0 } // Respects prefers-reduced-motion
    }}
  >
    {children}
  </motion.div>
);

// GSAP micro-interaction
useEffect(() => {
  const tl = gsap.timeline({ paused: true });
  tl.to(".freq-pattern", {
    opacity: 0.12,
    scale: 1.01,
    duration: 0.16,
    ease: "power2.out"
  });

  // Respect motion preferences
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    tl.duration(0);
  }
}, []);
\`\`\`

### CSS Animations with Modern Features
\`\`\`css
/* @starting-style for enter transitions */
.fade-in {
  opacity: 1;
  transition: opacity 0.18s ease-out;
}

@starting-style {
  .fade-in {
    opacity: 0;
  }
}

/* Container-based responsive animations */
@container (min-width: 768px) {
  .scroll-reveal {
    animation: slideUp 0.22s ease-out;
  }
}

@keyframes slideUp {
  from { 
    opacity: 0; 
    transform: translateY(10px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}
\`\`\`

## Development Notes

### Modern Setup & Installation
\`\`\`bash
# Project initialization with latest stack
npx create-next-app@latest mcliv-studio --typescript --tailwind --app
cd mcliv-studio

# Install cutting-edge UI tooling
npm install shadcn/ui@latest motion gsap
npx shadcn@latest init

# Add specific shadcn components
npx shadcn@latest add button card badge slider navigation-menu skeleton
\`\`\`

### Key Implementation Details
- **Grid system**: 12 columns with 72px gutters, 96px margins, container queries for responsive behavior
- **Baseline grid**: All spacing aligns to 6px baseline grid system
- **Edition stamp format**: "MCLIV / 1154 / No. 00X" using shadcn/ui Badge components  
- **Frequency pattern**: Micro dot/square field at 5-8% charcoal opacity with GSAP animations
- **Breath zones**: Minimum 120px around hero headings for meditative spacing
- **Font loading**: Preload GFS Didot display weights with font-display: swap, fallback to system serif
- **Modern CSS**: Use cascade layers, @property, color-mix(), @starting-style for optimal performance

### Package.json Dependencies
\`\`\`json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0", 
    "typescript": "^5.0.0",
    "tailwindcss": "^4.0.0",
    "motion": "^11.0.0",
    "gsap": "^3.13.0",
    "shadcn/ui": "^3.0.0"
  }
}
\`\`\`

## Font Implementation

### Google Fonts Implementation
\`\`\`html
<link href="https://fonts.googleapis.com/css2?family=GFS+Didot:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
\`\`\`

### Self-Hosted Implementation (Recommended)
\`\`\`css
@font-face {
  font-family: 'GFS Didot';
  src: url('/fonts/GFSDidot-Italic.woff2') format('woff2'),
       url('/fonts/GFSDidot-Italic.woff') format('woff');
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}

@font-face {
  font-family: 'GFS Didot';
  src: url('/fonts/GFSDidot-BoldItalic.woff2') format('woff2');
  font-weight: 700;
  font-style: italic;
  font-display: swap;
}
\`\`\`

## Required Assets

### Audio Files
- `wind.m4a` (AAC format) - 45-90s seamless loop at 44.1kHz
- `wind.ogg` (Opus format) - Same content, alternative format
- Target loudness: ~-20 LUFS, peaks ≤ -12 dBFS

### Visual Assets
- OG images: 1200×630px for social sharing
- Square images: 1080×1080px for Instagram/social
- Frequency pattern SVG tile for background implementation
- Logo SVG: GFS Didot Italic wordmark
- Edition stamp SVG: "1154" stamp design
- Release images: 6-12 capsule images in WebP/AVIF formats

### File Organization
\`\`\`
/public/
  /fonts/
    GFSDidot-Italic.woff2
    GFSDidot-BoldItalic.woff2
  /audio/
    wind.m4a
    wind.ogg
  /images/
    /og/
    /releases/
    /activations/
    /multimedia/
  /icons/
    logo.svg
    stamp-1154.svg
    pattern-freq.svg
\`\`\`

## Content Guidelines

### Founder Information
- John Black: Painter, Sculptor, Chef - highlight interdisciplinary approach
- Mike Carrera: Graphic Designer, Software Developer - emphasize technical and creative fusion

### MCLIV/1154 Concept
- Emphasize frequency illusion theme throughout
- Use 1154 edition numbering system for releases
- "Once seen, cannot be unseen" messaging
- "Elevate signal from the noise" philosophy

### Content Structure by Pillar
- **Releases**: Focus on limited-run nature, edition numbers, materials, availability
- **Activations**: Highlight collaborative nature, experiential impact, transformative goals
- **Multimedia**: Showcase technical and creative capabilities, process documentation

### Tone and Messaging
- "Subvert the way we think about the world"
- "Lasting transformative impact beyond mere spectacle"
- "Mindful conscious awareness through art objects and experiences"

## Analytics & Tracking

### Event Tracking (Privacy-Lite)
- `page_view` - Track page visits across all sections
- `sound_on`, `sound_off`, `sound_volume_change` - Audio interaction monitoring
- `subscribe_submit` - Email capture conversions
- `release_view`, `activation_view`, `multimedia_view` - Pillar engagement tracking
- `cta_notify_click` - Call-to-action effectiveness
- `pillar_navigation` - Navigation pattern analysis
- No auto-capture of fine-grained user input data

### Privacy Considerations
- Respect user privacy with minimal data collection
- Focus on aggregate usage patterns rather than individual tracking
- Comply with privacy regulations and user expectations

## Acceptance Criteria & Testing

### Critical Requirements
- **A1**: Audio **never auto-plays** - only starts after explicit user interaction with Wind toggle
- **A2**: Audio toggle fades in/out over ~2 seconds; state persists across pages and browser refresh
- **A3**: `prefers-reduced-motion: reduce` disables all nonessential animations
- **A4**: Grid renders as 12 columns, 72px gutters, 96px margins at ≥1280px; responsive stacking (6/4/1 columns)
- **A5**: Home page LCP ≤ 2.5s on 4G networks; font swap within ~100ms; 3 Pillars preview loads efficiently
- **A6**: Full keyboard navigation - Tab cycles through main nav (Home, Releases, Activations, Multimedia); Enter/Space toggles audio; Esc closes modals
- **A7**: SEO tags present for all pillar pages; OG images for releases/activations/multimedia; Lighthouse accessibility score ≥ 95

### Performance Benchmarks
- **LCP (Largest Contentful Paint)**: ≤ 2.5s on 4G networks
- **CLS (Cumulative Layout Shift)**: ≤ 0.1
- **TTI (Time to Interactive)**: ≤ 3.5s
- **Font loading**: Critical display fonts load within 100ms
- **Image optimization**: Hero images < 250KB, WebP/AVIF with responsive sources

### Accessibility Testing
- WCAG 2.1 AA compliance across all pages
- Screen reader compatibility with proper ARIA labels
- High contrast mode support (black/white palette advantage)
- Keyboard-only navigation functionality
- Audio control compliance with WCAG 1.4.2 Audio Control

## Risk Mitigation

### Technical Risks
- **Auto-play blocking**: Implement user-initiated audio only with clear controls and state persistence
- **Font rendering issues**: Preload display weights with robust fallbacks to system serif fonts
- **Media performance**: Strict lazy-loading implementation with responsive image sources
- **Browser compatibility**: Test audio implementation across Safari, Chrome, Firefox
- **Mobile performance**: Optimize for iOS Low Power mode and reduced-data preferences

### User Experience Risks
- **Motion sensitivity**: Comprehensive `prefers-reduced-motion` implementation
- **Audio accessibility**: Volume controls with proper ARIA labels and keyboard navigation
- **Loading states**: Graceful degradation for slow connections
- **Content accessibility**: Ensure no critical content depends solely on motion or sound

## Future Roadmap & Considerations

### Post-V1 Features
- **"Breath mode"**: Timed inhale/exhale gradient animation on hero section using GSAP timeline (fully `prefers-reduced-motion` aware)
- **Advanced theming**: CSS anchor positioning for floating UI elements, color-mix() based theme system
- **E-commerce integration**: Stripe-based commerce with shadcn/ui form components and checkout flows
- **CMS integration**: Sanity or Contentlayer with shadcn/ui data tables and admin interfaces
- **Collaboration hub**: Real-time project collaboration using shadcn/ui components with Socket.io

### Technical Enhancements (2025+)
- **Advanced CSS features**: CSS anchor positioning for tooltip/floating elements, view transitions API
- **Animation improvements**: GSAP ScrollTrigger, Motion layout animations, CSS @starting-style
- **PWA capabilities**: Service worker integration with Next.js, offline-first architecture  
- **Performance optimization**: Container queries for responsive design, cascade layers for CSS organization
- **Modern browser APIs**: Web Audio API spatialization, Intersection Observer v2, CSS Houdini worklets

### Content Expansion
- Multi-language support for international audiences
- Advanced filtering and search for releases/activations
- Artist collaboration spotlight features
- Behind-the-scenes process documentation
- Interactive project timelines and case studies

### Development Considerations
- **Performance**: Maintain LCP ≤ 2.5s benchmarks with modern features like container queries and cascade layers
- **Accessibility**: WCAG 2.1 AA compliance with shadcn/ui accessible components and proper ARIA implementation
- **Audio system**: Keep Web Audio API simple and user-controlled, leverage GSAP for audio visualizations
- **Design consistency**: Preserve minimalist aesthetic with shadcn/ui component customization matching brand guidelines
- **Scalable architecture**: Plan for CMS integration with typesafe APIs, component-driven development with shadcn/ui
- **Modern CSS**: Leverage cascade layers for maintainable styles, container queries for responsive components
- **Animation performance**: Use Motion for React components, GSAP for complex sequences, CSS for simple transitions

```

# app/assets/favicon.svg

This is a file of the type: SVG Image

# app/components/AddToCartButton.tsx

```tsx
import {type FetcherWithComponents} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
}: {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
}) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <>
          <input
            name="analytics"
            type="hidden"
            value={JSON.stringify(analytics)}
          />
          <button
            type="submit"
            onClick={onClick}
            disabled={disabled ?? fetcher.state !== 'idle'}
          >
            {children}
          </button>
        </>
      )}
    </CartForm>
  );
}

```

# app/components/Aside.tsx

```tsx
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

/**
 * A side bar component with Overlay
 * @example
 * \`\`\`jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * \`\`\`
 */
export function Aside({
  children,
  heading,
  type,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;

  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      document.addEventListener(
        'keydown',
        function handler(event: KeyboardEvent) {
          if (event.key === 'Escape') {
            close();
          }
        },
        {signal: abortController.signal},
      );
    }
    return () => abortController.abort();
  }, [close, expanded]);

  return (
    <div
      aria-modal
      className={`overlay ${expanded ? 'expanded' : ''}`}
      role="dialog"
    >
      <button className="close-outside" onClick={close} />
      <aside>
        <header>
          <h3>{heading}</h3>
          <button className="close reset" onClick={close} aria-label="Close">
            &times;
          </button>
        </header>
        <main>{children}</main>
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}

```

# app/components/CartLineItem.tsx

```tsx
import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 */
export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  return (
    <li key={id} className="cart-line">
      {image && (
        <Image
          alt={title}
          aspectRatio="1/1"
          data={image}
          height={100}
          loading="lazy"
          width={100}
        />
      )}

      <div className="cart-line-body">
        <Link
          prefetch="intent"
          to={lineItemUrl}
          onClick={() => {
            if (layout === 'aside') {
              close();
            }
          }}
        >
          <h3 className="cart-line-title">{product.title}</h3>
        </Link>
        <ProductPrice price={line?.cost?.totalAmount} />
        <div className="cart-line-controls">
          <CartLineQuantity line={line} />
        </div>
      </div>
    </li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 */
function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="cart-line-quantity">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || !!isOptimistic}
          name="decrease-quantity"
          value={prevQuantity}
        >
          <span>&#8722;</span>
        </button>
      </CartLineUpdateButton>
      <span className="cart-qty">{quantity}</span>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          aria-label="Increase quantity"
          name="increase-quantity"
          value={nextQuantity}
          disabled={!!isOptimistic}
        >
          <span>&#43;</span>
        </button>
      </CartLineUpdateButton>
      <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
    </div>
  );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 */
function CartLineRemoveButton({
  lineIds,
  disabled,
}: {
  lineIds: string[];
  disabled: boolean;
}) {
  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button disabled={disabled} type="submit">
        Remove
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

/**
 * Returns a unique key for the update action. This is used to make sure actions modifying the same line
 * items are not run concurrently, but cancel each other. For example, if the user clicks "Increase quantity"
 * and "Decrease quantity" in rapid succession, the actions will cancel each other and only the last one will run.
 * @param lineIds - line ids affected by the update
 * @returns
 */
function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}

```

# app/components/CartMain.tsx

```tsx
import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';

export type CartLayout = 'page' | 'aside';

export type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: CartLayout;
};

/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 */
export function CartMain({layout, cart: originalCart}: CartMainProps) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const className = `cart-main`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <div className="cart-details">
        <div aria-labelledby="cart-lines">
          <ul>
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>
        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </div>
  );
}

function CartEmpty({
  hidden = false,
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  const {close} = useAside();
  return (
    <div hidden={hidden}>
      <br />
      <p>
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <br />
      <Link to="/collections" onClick={close} prefetch="viewport">
        Continue shopping →
      </Link>
    </div>
  );
}

```

# app/components/CartSummary.tsx

```tsx
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  return (
    <div aria-labelledby="cart-summary" className={className}>
      <div className="cart-totals">
        <div className="cart-total-row">
          <span>Subtotal</span>
          <span>
            {cart?.cost?.subtotalAmount?.amount ? (
              <Money data={cart?.cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </span>
        </div>
        <p className="muted">Shipping calculated at checkout.</p>
      </div>
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  if (!checkoutUrl) return null;

  return (
    <div className="cart-checkout">
      <a className="cart-checkout-link" href={checkoutUrl} target="_self">
        Continue to checkout →
      </a>
    </div>
  );
}

```

# app/components/ContinueToCheckoutButton.tsx

```tsx
"use client";

import {useMemo, useState} from 'react';
import {QuantitySelector} from '~/components/QuantitySelector';

type Props = {
  variantId: string;
  quantity?: number;
};

function variantGidToNumeric(id: string) {
  const parts = id.split('/');
  return parts[parts.length - 1] || id;
}

export function ContinueToCheckoutButton({variantId, quantity = 1}: Props) {
  const [qty, setQty] = useState(quantity);
  const numericId = useMemo(() => variantGidToNumeric(variantId), [variantId]);
  const checkoutHref = `/cart/${numericId}:${qty}`;

  return (
    <>
      <QuantitySelector defaultValue={quantity} onChange={setQty} />
      <a className="order-link" href={checkoutHref}>
        Order now →
      </a>
    </>
  );
}

```

# app/components/Footer.tsx

```tsx
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';
import {SocialLinks} from '~/components/SocialLinks';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer(_: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <address className="footer-address">
          © MCLIV Studio, 3 World Trade Center, 69th Fl, 175 Greenwich St, New York, NY 10007
        </address>
        <SocialLinks />
      </div>
    </footer>
  );
}

```

# app/components/Header.tsx

```tsx
import {Suspense} from 'react';
import {Await, NavLink, useAsyncValue} from 'react-router';
import {useOptimisticCart} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';
import {FiUser, FiShoppingBag} from 'react-icons/fi';

interface HeaderProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

type Viewport = 'desktop' | 'mobile';

export function Header({
  header,
  isLoggedIn,
  cart,
  publicStoreDomain,
}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <header className="header">
      <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
        <span className="brand">
          <img src="/icons/logo.svg" alt="MCLIV Studio" />
          <span className="sr-only">{shop.name}</span>
        </span>
      </NavLink>
      <nav className="header-menu-desktop">
        <NavLink prefetch="intent" to="/" style={activeLinkStyle} end>
          Home
        </NavLink>
        <NavLink prefetch="intent" to="/about" style={activeLinkStyle}>
          About
        </NavLink>
      </nav>
      <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
    </header>
  );
}

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
  viewport: Viewport;
  publicStoreDomain: HeaderProps['publicStoreDomain'];
}) {
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          style={activeLinkStyle}
          to="/"
        >
          Home
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="header-menu-item"
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
}: Pick<HeaderProps, 'isLoggedIn' | 'cart'>) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle />
      <NavLink prefetch="intent" to="/account" style={activeLinkStyle} aria-label="Account">
        <FiUser size={18} aria-hidden />
      </NavLink>
      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  const {open} = useAside();
  return (
    <button
      className="header-menu-mobile-toggle reset"
      onClick={() => open('mobile')}
      aria-label="Open navigation"
    >
      <h3 aria-hidden>☰</h3>
    </button>
  );
}

function SearchToggle() {
  const {open} = useAside();
  return (
    <button className="reset" onClick={() => open('search')}>
      Search
    </button>
  );
}

function CartBadge({count}: {count: number | null}) {
  const {open} = useAside();

  return (
    <button
      type="button"
      className="reset header-cart"
      aria-label="Cart"
      onClick={() => {
        open('cart');
      }}
    >
      <FiShoppingBag size={18} aria-hidden />
      <span className="sr-only">Cart</span>
      <span className="cart-count">{count === null ? '' : count}</span>
    </button>
  );
}

function CartToggle({cart}: Pick<HeaderProps, 'cart'>) {
  return (
    <Suspense fallback={<CartBadge count={null} />}>
      <Await resolve={cart}>
        {(data) => {
          const cart = data as CartApiQueryFragment | null;
          return <CartBadge count={cart?.totalQuantity ?? 0} />;
        }}
      </Await>
    </Suspense>
  );
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}

```

# app/components/PageLayout.tsx

```tsx
import {Await, Link} from 'react-router';
import {Suspense, useId} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/CartMain';
import {
  SEARCH_ENDPOINT,
  SearchFormPredictive,
} from '~/components/SearchFormPredictive';
import {SearchResultsPredictive} from '~/components/SearchResultsPredictive';

interface PageLayoutProps {
  cart: Promise<CartApiQueryFragment | null>;
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
  children?: React.ReactNode;
}

export function PageLayout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  publicStoreDomain,
}: PageLayoutProps) {
  return (
    <Aside.Provider>
      <CartAside cart={cart} />
      <SearchAside />
      <MobileMenuAside header={header} publicStoreDomain={publicStoreDomain} />
      {header && (
        <Header
          header={header}
          cart={cart}
          isLoggedIn={isLoggedIn}
          publicStoreDomain={publicStoreDomain}
        />
      )}
      <main>{children}</main>
      <Footer
        footer={footer}
        header={header}
        publicStoreDomain={publicStoreDomain}
      />
    </Aside.Provider>
  );
}

function CartAside({cart}: {cart: PageLayoutProps['cart']}) {
  return (
    <Aside type="cart" heading="CART">
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Aside>
  );
}

function SearchAside() {
  const queriesDatalistId = useId();
  return (
    <Aside type="search" heading="SEARCH">
      <div className="predictive-search">
        <br />
        <SearchFormPredictive>
          {({fetchResults, goToSearch, inputRef}) => (
            <>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
                list={queriesDatalistId}
              />
              &nbsp;
              <button onClick={goToSearch}>Search</button>
            </>
          )}
        </SearchFormPredictive>

        <SearchResultsPredictive>
          {({items, total, term, state, closeSearch}) => {
            const {articles, collections, pages, products, queries} = items;

            if (state === 'loading' && term.current) {
              return <div>Loading...</div>;
            }

            if (!total) {
              return <SearchResultsPredictive.Empty term={term} />;
            }

            return (
              <>
                <SearchResultsPredictive.Queries
                  queries={queries}
                  queriesDatalistId={queriesDatalistId}
                />
                <SearchResultsPredictive.Products
                  products={products}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Collections
                  collections={collections}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Pages
                  pages={pages}
                  closeSearch={closeSearch}
                  term={term}
                />
                <SearchResultsPredictive.Articles
                  articles={articles}
                  closeSearch={closeSearch}
                  term={term}
                />
                {term.current && total ? (
                  <Link
                    onClick={closeSearch}
                    to={`${SEARCH_ENDPOINT}?q=${term.current}`}
                  >
                    <p>
                      View all results for <q>{term.current}</q>
                      &nbsp; →
                    </p>
                  </Link>
                ) : null}
              </>
            );
          }}
        </SearchResultsPredictive>
      </div>
    </Aside>
  );
}

function MobileMenuAside({
  header,
  publicStoreDomain,
}: {
  header: PageLayoutProps['header'];
  publicStoreDomain: PageLayoutProps['publicStoreDomain'];
}) {
  return (
    header.menu &&
    header.shop.primaryDomain?.url && (
      <Aside type="mobile" heading="MENU">
        <HeaderMenu
          menu={header.menu}
          viewport="mobile"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
      </Aside>
    )
  );
}

```

# app/components/PaginatedResourceSection.tsx

```tsx
import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';

/**
 * <PaginatedResourceSection > is a component that encapsulate how the previous and next behaviors throughout your application.
 */
export function PaginatedResourceSection<NodesType>({
  connection,
  children,
  resourcesClassName,
}: {
  connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'];
  children: React.FunctionComponent<{node: NodesType; index: number}>;
  resourcesClassName?: string;
}) {
  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => {
        const resourcesMarkup = nodes.map((node, index) =>
          children({node, index}),
        );

        return (
          <div>
            <PreviousLink>
              {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
            </PreviousLink>
            {resourcesClassName ? (
              <div className={resourcesClassName}>{resourcesMarkup}</div>
            ) : (
              resourcesMarkup
            )}
            <NextLink>
              {isLoading ? 'Loading...' : <span>Load more ↓</span>}
            </NextLink>
          </div>
        );
      }}
    </Pagination>
  );
}

```

# app/components/ProductCarousel.tsx

```tsx
"use client";

import {useMemo, useState} from 'react';
import {Image} from '@shopify/hydrogen';

type CarouselImage = {
  id: string;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

export function ProductCarousel({
  images,
  title,
}: {
  images: CarouselImage[];
  title: string;
}) {
  const safeImages = useMemo(
    () => images.filter((img) => !!img?.url),
    [images],
  );
  const [index, setIndex] = useState(0);
  const current = safeImages[index] ?? safeImages[0];

  if (!current) return null;

  const aspectRatio =
    current.width && current.height
      ? `${current.width}/${current.height}`
      : "4/5";

  const next = () => {
    if (!safeImages.length) return;
    setIndex((prev) => (prev + 1) % safeImages.length);
  };

  const prev = () => {
    if (!safeImages.length) return;
    setIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  return (
    <div className="product-carousel">
      <div className="carousel-frame" style={{aspectRatio}}>
        <Image
          data={current}
          sizes="(min-width: 960px) 50vw, 90vw"
          className="carousel-image"
        />
        {safeImages.length > 1 ? (
          <>
            <button
              type="button"
              className="carousel-control left"
              onClick={prev}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              type="button"
              className="carousel-control right"
              onClick={next}
              aria-label="Next image"
            >
              ›
            </button>
            <div
              className="carousel-dots"
              role="tablist"
              aria-label="Product images"
            >
              {safeImages.map((img, i) => (
                <button
                  key={img.id}
                  type="button"
                  className={`dot ${i === index ? "active" : ""}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Show image ${i + 1} of ${safeImages.length}`}
                  aria-pressed={i === index}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

```

# app/components/ProductForm.tsx

```tsx
import {Link, useNavigate} from 'react-router';
import {type MappedProductOptions} from '@shopify/hydrogen';
import type {
  Maybe,
  ProductOptionValueSwatch,
} from '@shopify/hydrogen/storefront-api-types';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import type {ProductFragment} from 'storefrontapi.generated';

export function ProductForm({
  productOptions,
  selectedVariant,
}: {
  productOptions: MappedProductOptions[];
  selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
}) {
  const navigate = useNavigate();
  const {open} = useAside();
  return (
    <div className="product-form">
      {productOptions.map((option) => {
        // If there is only a single value in the option values, don't display the option
        if (option.optionValues.length === 1) return null;

        return (
          <div className="product-options" key={option.name}>
            <h5>{option.name}</h5>
            <div className="product-options-grid">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                if (isDifferentProduct) {
                  // SEO
                  // When the variant is a combined listing child product
                  // that leads to a different url, we need to render it
                  // as an anchor tag
                  return (
                    <Link
                      className="product-options-item"
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      style={{
                        border: selected
                          ? '1px solid black'
                          : '1px solid transparent',
                        opacity: available ? 1 : 0.3,
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  // SEO
                  // When the variant is an update to the search param,
                  // render it as a button with javascript navigating to
                  // the variant so that SEO bots do not index these as
                  // duplicated links
                  return (
                    <button
                      type="button"
                      className={`product-options-item${
                        exists && !selected ? ' link' : ''
                      }`}
                      key={option.name + name}
                      style={{
                        border: selected
                          ? '1px solid black'
                          : '1px solid transparent',
                        opacity: available ? 1 : 0.3,
                      }}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          void navigate(`?${variantUriQuery}`, {
                            replace: true,
                            preventScrollReset: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </button>
                  );
                }
              })}
            </div>
            <br />
          </div>
        );
      })}
      <AddToCartButton
        disabled={!selectedVariant || !selectedVariant.availableForSale}
        onClick={() => {
          open('cart');
        }}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: 1,
                  selectedVariant,
                },
              ]
            : []
        }
      >
        {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

function ProductOptionSwatch({
  swatch,
  name,
}: {
  swatch?: Maybe<ProductOptionValueSwatch> | undefined;
  name: string;
}) {
  const image = swatch?.image?.previewImage?.url;
  const color = swatch?.color;

  if (!image && !color) return name;

  return (
    <div
      aria-label={name}
      className="product-option-label-swatch"
      style={{
        backgroundColor: color || 'transparent',
      }}
    >
      {!!image && <img src={image} alt={name} />}
    </div>
  );
}

```

# app/components/ProductImage.tsx

```tsx
import type {ProductVariantFragment} from 'storefrontapi.generated';
import {Image} from '@shopify/hydrogen';

export function ProductImage({
  image,
}: {
  image: ProductVariantFragment['image'];
}) {
  if (!image) {
    return <div className="product-image" />;
  }
  return (
    <div className="product-image">
      <Image
        alt={image.altText || 'Product Image'}
        aspectRatio="1/1"
        data={image}
        key={image.id}
        sizes="(min-width: 45em) 50vw, 100vw"
      />
    </div>
  );
}

```

# app/components/ProductItem.tsx

```tsx
import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';

export function ProductItem({
  product,
  loading,
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  return (
    <Link
      className="product-item"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {image && (
        <Image
          alt={image.altText || product.title}
          aspectRatio="1/1"
          data={image}
          loading={loading}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <h4>{product.title}</h4>
      <small>
        <Money data={product.priceRange.minVariantPrice} />
      </small>
    </Link>
  );
}

```

# app/components/ProductPrice.tsx

```tsx
import {Money} from '@shopify/hydrogen';
import type {MoneyV2} from '@shopify/hydrogen/storefront-api-types';

export function ProductPrice({
  price,
  compareAtPrice,
}: {
  price?: MoneyV2;
  compareAtPrice?: MoneyV2 | null;
}) {
  return (
    <div className="product-price">
      {compareAtPrice ? (
        <div className="product-price-on-sale">
          {price ? <Money data={price} /> : null}
          <s>
            <Money data={compareAtPrice} />
          </s>
        </div>
      ) : price ? (
        <Money data={price} />
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}

```

# app/components/QuantitySelector.tsx

```tsx
"use client";

import {useState} from 'react';

type Props = {
  min?: number;
  max?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
};

export function QuantitySelector({
  min = 1,
  max = 10,
  defaultValue = 1,
  onChange,
}: Props) {
  const [value, setValue] = useState(defaultValue);

  const update = (next: number) => {
    const clamped = Math.min(Math.max(next, min), max);
    setValue(clamped);
    onChange?.(clamped);
  };

  return (
    <div className="qty">
      <button type="button" onClick={() => update(value - 1)} aria-label="Decrease quantity">
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={() => update(value + 1)} aria-label="Increase quantity">
        +
      </button>
      <input type="hidden" name="quantity" value={value} />
    </div>
  );
}

```

# app/components/SearchForm.tsx

```tsx
import {useRef, useEffect} from 'react';
import {Form, type FormProps} from 'react-router';

type SearchFormProps = Omit<FormProps, 'children'> & {
  children: (args: {
    inputRef: React.RefObject<HTMLInputElement>;
  }) => React.ReactNode;
};

/**
 * Search form component that sends search requests to the `/search` route.
 * @example
 * \`\`\`tsx
 * <SearchForm>
 *  {({inputRef}) => (
 *    <>
 *      <input
 *        ref={inputRef}
 *        type="search"
 *        defaultValue={term}
 *        name="q"
 *        placeholder="Search…"
 *      />
 *      <button type="submit">Search</button>
 *   </>
 *  )}
 *  </SearchForm>
 */
export function SearchForm({children, ...props}: SearchFormProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useFocusOnCmdK(inputRef);

  if (typeof children !== 'function') {
    return null;
  }

  return (
    <Form method="get" {...props}>
      {children({inputRef})}
    </Form>
  );
}

/**
 * Focuses the input when cmd+k is pressed
 */
function useFocusOnCmdK(inputRef: React.RefObject<HTMLInputElement>) {
  // focus the input when cmd+k is pressed
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'k' && event.metaKey) {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if (event.key === 'Escape') {
        inputRef.current?.blur();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [inputRef]);
}

```

# app/components/SearchFormPredictive.tsx

```tsx
import {
  useFetcher,
  useNavigate,
  type FormProps,
  type Fetcher,
} from 'react-router';
import React, {useRef, useEffect} from 'react';
import type {PredictiveSearchReturn} from '~/lib/search';
import {useAside} from './Aside';

type SearchFormPredictiveChildren = (args: {
  fetchResults: (event: React.ChangeEvent<HTMLInputElement>) => void;
  goToSearch: () => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  fetcher: Fetcher<PredictiveSearchReturn>;
}) => React.ReactNode;

type SearchFormPredictiveProps = Omit<FormProps, 'children'> & {
  children: SearchFormPredictiveChildren | null;
};

export const SEARCH_ENDPOINT = '/search';

/**
 *  Search form component that sends search requests to the `/search` route
 **/
export function SearchFormPredictive({
  children,
  className = 'predictive-search-form',
  ...props
}: SearchFormPredictiveProps) {
  const fetcher = useFetcher<PredictiveSearchReturn>({key: 'search'});
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const aside = useAside();

  /** Reset the input value and blur the input */
  function resetInput(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (inputRef?.current?.value) {
      inputRef.current.blur();
    }
  }

  /** Navigate to the search page with the current input value */
  function goToSearch() {
    const term = inputRef?.current?.value;
    void navigate(SEARCH_ENDPOINT + (term ? `?q=${term}` : ''));
    aside.close();
  }

  /** Fetch search results based on the input value */
  function fetchResults(event: React.ChangeEvent<HTMLInputElement>) {
    void fetcher.submit(
      {q: event.target.value || '', limit: 5, predictive: true},
      {method: 'GET', action: SEARCH_ENDPOINT},
    );
  }

  // ensure the passed input has a type of search, because SearchResults
  // will select the element based on the input
  useEffect(() => {
    inputRef?.current?.setAttribute('type', 'search');
  }, []);

  if (typeof children !== 'function') {
    return null;
  }

  return (
    <fetcher.Form {...props} className={className} onSubmit={resetInput}>
      {children({inputRef, fetcher, fetchResults, goToSearch})}
    </fetcher.Form>
  );
}

```

# app/components/SearchResults.tsx

```tsx
import {Link} from 'react-router';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams, type RegularSearchReturn} from '~/lib/search';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & {term: string}) => React.ReactNode;
};

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchResultsArticles({
  term,
  articles,
}: PartialSearchResult<'articles'>) {
  if (!articles?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2>Articles</h2>
      <div>
        {articles?.nodes?.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <div className="search-results-item" key={article.id}>
              <Link prefetch="intent" to={articleUrl}>
                {article.title}
              </Link>
            </div>
          );
        })}
      </div>
      <br />
    </div>
  );
}

function SearchResultsPages({term, pages}: PartialSearchResult<'pages'>) {
  if (!pages?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2>Pages</h2>
      <div>
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <div className="search-results-item" key={page.id}>
              <Link prefetch="intent" to={pageUrl}>
                {page.title}
              </Link>
            </div>
          );
        })}
      </div>
      <br />
    </div>
  );
}

function SearchResultsProducts({
  term,
  products,
}: PartialSearchResult<'products'>) {
  if (!products?.nodes.length) {
    return null;
  }

  return (
    <div className="search-result">
      <h2>Products</h2>
      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => {
          const ItemsMarkup = nodes.map((product) => {
            const productUrl = urlWithTrackingParams({
              baseUrl: `/products/${product.handle}`,
              trackingParams: product.trackingParameters,
              term,
            });

            const price = product?.selectedOrFirstAvailableVariant?.price;
            const image = product?.selectedOrFirstAvailableVariant?.image;

            return (
              <div className="search-results-item" key={product.id}>
                <Link prefetch="intent" to={productUrl}>
                  {image && (
                    <Image data={image} alt={product.title} width={50} />
                  )}
                  <div>
                    <p>{product.title}</p>
                    <small>{price && <Money data={price} />}</small>
                  </div>
                </Link>
              </div>
            );
          });

          return (
            <div>
              <div>
                <PreviousLink>
                  {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
                </PreviousLink>
              </div>
              <div>
                {ItemsMarkup}
                <br />
              </div>
              <div>
                <NextLink>
                  {isLoading ? 'Loading...' : <span>Load more ↓</span>}
                </NextLink>
              </div>
            </div>
          );
        }}
      </Pagination>
      <br />
    </div>
  );
}

function SearchResultsEmpty() {
  return <p>No results, try a different search.</p>;
}

```

# app/components/SearchResultsPredictive.tsx

```tsx
import {Link, useFetcher, type Fetcher} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import React, {useRef, useEffect} from 'react';
import {
  getEmptyPredictiveSearchResult,
  urlWithTrackingParams,
  type PredictiveSearchReturn,
} from '~/lib/search';
import {useAside} from './Aside';

type PredictiveSearchItems = PredictiveSearchReturn['result']['items'];

type UsePredictiveSearchReturn = {
  term: React.MutableRefObject<string>;
  total: number;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  items: PredictiveSearchItems;
  fetcher: Fetcher<PredictiveSearchReturn>;
};

type SearchResultsPredictiveArgs = Pick<
  UsePredictiveSearchReturn,
  'term' | 'total' | 'inputRef' | 'items'
> & {
  state: Fetcher['state'];
  closeSearch: () => void;
};

type PartialPredictiveSearchResult<
  ItemType extends keyof PredictiveSearchItems,
  ExtraProps extends keyof SearchResultsPredictiveArgs = 'term' | 'closeSearch',
> = Pick<PredictiveSearchItems, ItemType> &
  Pick<SearchResultsPredictiveArgs, ExtraProps>;

type SearchResultsPredictiveProps = {
  children: (args: SearchResultsPredictiveArgs) => React.ReactNode;
};

/**
 * Component that renders predictive search results
 */
export function SearchResultsPredictive({
  children,
}: SearchResultsPredictiveProps) {
  const aside = useAside();
  const {term, inputRef, fetcher, total, items} = usePredictiveSearch();

  /*
   * Utility that resets the search input
   */
  function resetInput() {
    if (inputRef.current) {
      inputRef.current.blur();
      inputRef.current.value = '';
    }
  }

  /**
   * Utility that resets the search input and closes the search aside
   */
  function closeSearch() {
    resetInput();
    aside.close();
  }

  return children({
    items,
    closeSearch,
    inputRef,
    state: fetcher.state,
    term,
    total,
  });
}

SearchResultsPredictive.Articles = SearchResultsPredictiveArticles;
SearchResultsPredictive.Collections = SearchResultsPredictiveCollections;
SearchResultsPredictive.Pages = SearchResultsPredictivePages;
SearchResultsPredictive.Products = SearchResultsPredictiveProducts;
SearchResultsPredictive.Queries = SearchResultsPredictiveQueries;
SearchResultsPredictive.Empty = SearchResultsPredictiveEmpty;

function SearchResultsPredictiveArticles({
  term,
  articles,
  closeSearch,
}: PartialPredictiveSearchResult<'articles'>) {
  if (!articles.length) return null;

  return (
    <div className="predictive-search-result" key="articles">
      <h5>Articles</h5>
      <ul>
        {articles.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.blog.handle}/${article.handle}`,
            trackingParams: article.trackingParameters,
            term: term.current ?? '',
          });

          return (
            <li className="predictive-search-result-item" key={article.id}>
              <Link onClick={closeSearch} to={articleUrl}>
                {article.image?.url && (
                  <Image
                    alt={article.image.altText ?? ''}
                    src={article.image.url}
                    width={50}
                    height={50}
                  />
                )}
                <div>
                  <span>{article.title}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveCollections({
  term,
  collections,
  closeSearch,
}: PartialPredictiveSearchResult<'collections'>) {
  if (!collections.length) return null;

  return (
    <div className="predictive-search-result" key="collections">
      <h5>Collections</h5>
      <ul>
        {collections.map((collection) => {
          const collectionUrl = urlWithTrackingParams({
            baseUrl: `/collections/${collection.handle}`,
            trackingParams: collection.trackingParameters,
            term: term.current,
          });

          return (
            <li className="predictive-search-result-item" key={collection.id}>
              <Link onClick={closeSearch} to={collectionUrl}>
                {collection.image?.url && (
                  <Image
                    alt={collection.image.altText ?? ''}
                    src={collection.image.url}
                    width={50}
                    height={50}
                  />
                )}
                <div>
                  <span>{collection.title}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictivePages({
  term,
  pages,
  closeSearch,
}: PartialPredictiveSearchResult<'pages'>) {
  if (!pages.length) return null;

  return (
    <div className="predictive-search-result" key="pages">
      <h5>Pages</h5>
      <ul>
        {pages.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term: term.current,
          });

          return (
            <li className="predictive-search-result-item" key={page.id}>
              <Link onClick={closeSearch} to={pageUrl}>
                <div>
                  <span>{page.title}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveProducts({
  term,
  products,
  closeSearch,
}: PartialPredictiveSearchResult<'products'>) {
  if (!products.length) return null;

  return (
    <div className="predictive-search-result" key="products">
      <h5>Products</h5>
      <ul>
        {products.map((product) => {
          const productUrl = urlWithTrackingParams({
            baseUrl: `/products/${product.handle}`,
            trackingParams: product.trackingParameters,
            term: term.current,
          });

          const price = product?.selectedOrFirstAvailableVariant?.price;
          const image = product?.selectedOrFirstAvailableVariant?.image;
          return (
            <li className="predictive-search-result-item" key={product.id}>
              <Link to={productUrl} onClick={closeSearch}>
                {image && (
                  <Image
                    alt={image.altText ?? ''}
                    src={image.url}
                    width={50}
                    height={50}
                  />
                )}
                <div>
                  <p>{product.title}</p>
                  <small>{price && <Money data={price} />}</small>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function SearchResultsPredictiveQueries({
  queries,
  queriesDatalistId,
}: PartialPredictiveSearchResult<'queries', never> & {
  queriesDatalistId: string;
}) {
  if (!queries.length) return null;

  return (
    <datalist id={queriesDatalistId}>
      {queries.map((suggestion) => {
        if (!suggestion) return null;

        return <option key={suggestion.text} value={suggestion.text} />;
      })}
    </datalist>
  );
}

function SearchResultsPredictiveEmpty({
  term,
}: {
  term: React.MutableRefObject<string>;
}) {
  if (!term.current) {
    return null;
  }

  return (
    <p>
      No results found for <q>{term.current}</q>
    </p>
  );
}

/**
 * Hook that returns the predictive search results and fetcher and input ref.
 * @example
 * '''ts
 * const { items, total, inputRef, term, fetcher } = usePredictiveSearch();
 * '''
 **/
function usePredictiveSearch(): UsePredictiveSearchReturn {
  const fetcher = useFetcher<PredictiveSearchReturn>({key: 'search'});
  const term = useRef<string>('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (fetcher?.state === 'loading') {
    term.current = String(fetcher.formData?.get('q') || '');
  }

  // capture the search input element as a ref
  useEffect(() => {
    if (!inputRef.current) {
      inputRef.current = document.querySelector('input[type="search"]');
    }
  }, []);

  const {items, total} =
    fetcher?.data?.result ?? getEmptyPredictiveSearchResult();

  return {items, total, inputRef, term, fetcher};
}

```

# app/components/SocialLinks.tsx

```tsx
import {SOCIAL} from '~/lib/site';
import {siInstagram, siYoutube, siX, siTiktok} from 'simple-icons';
import {FiMail} from 'react-icons/fi';

type Props = {
  className?: string;
};

export function SocialLinks({className = ''}: Props) {
  const c = `${className}`.trim();
  const emailAddress = SOCIAL.email.replace(/^mailto:/, '');
  return (
    <div className={c}>
      <nav aria-label="Social and contact">
        <ul className="social-list">
          <li>
            <a
              href={SOCIAL.email}
              title={emailAddress}
              aria-label="Email"
              className="social-link"
            >
              <FiMail size={18} aria-hidden />
              <span className="sr-only">Email</span>
            </a>
          </li>
          <li>
            <a
              href={SOCIAL.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="social-link"
            >
              <BrandIcon path={siInstagram.path} />
              <span className="sr-only">Instagram</span>
            </a>
          </li>
          <li>
            <a
              href={SOCIAL.youtube}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="social-link"
            >
              <BrandIcon path={siYoutube.path} />
              <span className="sr-only">YouTube</span>
            </a>
          </li>
          <li>
            <a
              href={SOCIAL.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="social-link"
            >
              <BrandIcon path={siX.path} />
              <span className="sr-only">X</span>
            </a>
          </li>
          <li>
            <a
              href={SOCIAL.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="social-link"
            >
              <BrandIcon path={siTiktok.path} />
              <span className="sr-only">TikTok</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

function BrandIcon({path}: {path: string}) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="social-icon">
      <path d={path} fill="currentColor" />
    </svg>
  );
}

```

# app/entry.client.tsx

```tsx
import {HydratedRouter} from 'react-router/dom';
import {startTransition, StrictMode} from 'react';
import {hydrateRoot} from 'react-dom/client';
import {NonceProvider} from '@shopify/hydrogen';

if (!window.location.origin.includes('webcache.googleusercontent.com')) {
  startTransition(() => {
    // Extract nonce from existing script tags
    const existingNonce = document
      .querySelector<HTMLScriptElement>('script[nonce]')
      ?.nonce;

    hydrateRoot(
      document,
      <StrictMode>
        <NonceProvider value={existingNonce}>
          <HydratedRouter />
        </NonceProvider>
      </StrictMode>,
    );
  });
}

```

# app/entry.server.tsx

```tsx
import {ServerRouter} from 'react-router';
import {isbot} from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {
  createContentSecurityPolicy,
  type HydrogenRouterContextProvider,
} from '@shopify/hydrogen';
import type {EntryContext} from 'react-router';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  reactRouterContext: EntryContext,
  context: HydrogenRouterContextProvider,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <ServerRouter
        context={reactRouterContext}
        url={request.url}
        nonce={nonce}
      />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

```

# app/graphql/customer-account/CustomerAddressMutations.ts

```ts
// NOTE: https://shopify.dev/docs/api/customer/latest/mutations/customerAddressUpdate
export const UPDATE_ADDRESS_MUTATION = `#graphql
  mutation customerAddressUpdate(
    $address: CustomerAddressInput!
    $addressId: ID!
    $defaultAddress: Boolean
    $language: LanguageCode
 ) @inContext(language: $language) {
    customerAddressUpdate(
      address: $address
      addressId: $addressId
      defaultAddress: $defaultAddress
    ) {
      customerAddress {
        id
      }
      userErrors {
        code
        field
        message
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/customer/latest/mutations/customerAddressDelete
export const DELETE_ADDRESS_MUTATION = `#graphql
  mutation customerAddressDelete(
    $addressId: ID!
    $language: LanguageCode
  ) @inContext(language: $language) {
    customerAddressDelete(addressId: $addressId) {
      deletedAddressId
      userErrors {
        code
        field
        message
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/customer/latest/mutations/customerAddressCreate
export const CREATE_ADDRESS_MUTATION = `#graphql
  mutation customerAddressCreate(
    $address: CustomerAddressInput!
    $defaultAddress: Boolean
    $language: LanguageCode
  ) @inContext(language: $language) {
    customerAddressCreate(
      address: $address
      defaultAddress: $defaultAddress
    ) {
      customerAddress {
        id
      }
      userErrors {
        code
        field
        message
      }
    }
  }
` as const;

```

# app/graphql/customer-account/CustomerDetailsQuery.ts

```ts
// NOTE: https://shopify.dev/docs/api/customer/latest/objects/Customer
export const CUSTOMER_FRAGMENT = `#graphql
  fragment Customer on Customer {
    id
    firstName
    lastName
    defaultAddress {
      ...Address
    }
    addresses(first: 6) {
      nodes {
        ...Address
      }
    }
  }
  fragment Address on CustomerAddress {
    id
    formatted
    firstName
    lastName
    company
    address1
    address2
    territoryCode
    zoneCode
    city
    zip
    phoneNumber
  }
` as const;

// NOTE: https://shopify.dev/docs/api/customer/latest/queries/customer
export const CUSTOMER_DETAILS_QUERY = `#graphql
  query CustomerDetails($language: LanguageCode) @inContext(language: $language) {
    customer {
      ...Customer
    }
  }
  ${CUSTOMER_FRAGMENT}
` as const;

```

# app/graphql/customer-account/CustomerOrderQuery.ts

```ts
// NOTE: https://shopify.dev/docs/api/customer/latest/queries/order
export const CUSTOMER_ORDER_QUERY = `#graphql
  fragment OrderMoney on MoneyV2 {
    amount
    currencyCode
  }
  fragment DiscountApplication on DiscountApplication {
    value {
      __typename
      ... on MoneyV2 {
        ...OrderMoney
      }
      ... on PricingPercentageValue {
        percentage
      }
    }
  }
  fragment OrderLineItemFull on LineItem {
    id
    title
    quantity
    price {
      ...OrderMoney
    }
    discountAllocations {
      allocatedAmount {
        ...OrderMoney
      }
      discountApplication {
        ...DiscountApplication
      }
    }
    totalDiscount {
      ...OrderMoney
    }
    image {
      altText
      height
      url
      id
      width
    }
    variantTitle
  }
  fragment Order on Order {
    id
    name
    confirmationNumber
    statusPageUrl
    fulfillmentStatus
    processedAt
    fulfillments(first: 1) {
      nodes {
        status
      }
    }
    totalTax {
      ...OrderMoney
    }
    totalPrice {
      ...OrderMoney
    }
    subtotal {
      ...OrderMoney
    }
    shippingAddress {
      name
      formatted(withName: true)
      formattedArea
    }
    discountApplications(first: 100) {
      nodes {
        ...DiscountApplication
      }
    }
    lineItems(first: 100) {
      nodes {
        ...OrderLineItemFull
      }
    }
  }
  query Order($orderId: ID!, $language: LanguageCode)
    @inContext(language: $language) {
    order(id: $orderId) {
      ... on Order {
        ...Order
      }
    }
  }
` as const;

```

# app/graphql/customer-account/CustomerOrdersQuery.ts

```ts
// NOTE: https://shopify.dev/docs/api/customer/latest/objects/Order
export const ORDER_ITEM_FRAGMENT = `#graphql
  fragment OrderItem on Order {
    totalPrice {
      amount
      currencyCode
    }
    financialStatus
    fulfillmentStatus
    fulfillments(first: 1) {
      nodes {
        status
      }
    }
    id
    number
    confirmationNumber
    processedAt
  }
` as const;

// NOTE: https://shopify.dev/docs/api/customer/latest/objects/Customer
export const CUSTOMER_ORDERS_FRAGMENT = `#graphql
  fragment CustomerOrders on Customer {
    orders(
      sortKey: PROCESSED_AT,
      reverse: true,
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor,
      query: $query
    ) {
      nodes {
        ...OrderItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        endCursor
        startCursor
      }
    }
  }
  ${ORDER_ITEM_FRAGMENT}
` as const;

// NOTE: https://shopify.dev/docs/api/customer/latest/queries/customer
export const CUSTOMER_ORDERS_QUERY = `#graphql
  ${CUSTOMER_ORDERS_FRAGMENT}
  query CustomerOrders(
    $endCursor: String
    $first: Int
    $last: Int
    $startCursor: String
    $query: String
    $language: LanguageCode
  ) @inContext(language: $language) {
    customer {
      ...CustomerOrders
    }
  }
` as const;

```

# app/graphql/customer-account/CustomerUpdateMutation.ts

```ts
// NOTE: https://shopify.dev/docs/api/customer/latest/mutations/customerUpdate
export const CUSTOMER_UPDATE_MUTATION = `#graphql
  mutation customerUpdate(
    $customer: CustomerUpdateInput!
    $language: LanguageCode
  ) @inContext(language: $language) {
    customerUpdate(input: $customer) {
      customer {
        firstName
        lastName
        emailAddress {
          emailAddress
        }
        phoneNumber {
          phoneNumber
        }
      }
      userErrors {
        code
        field
        message
      }
    }
  }
` as const;

```

# app/lib/context.ts

```ts
import {createHydrogenContext} from '@shopify/hydrogen';
import {AppSession} from '~/lib/session';
import {CART_QUERY_FRAGMENT} from '~/lib/fragments';

// Define the additional context object
const additionalContext = {
  // Additional context for custom properties, CMS clients, 3P SDKs, etc.
  // These will be available as both context.propertyName and context.get(propertyContext)
  // Example of complex objects that could be added:
  // cms: await createCMSClient(env),
  // reviews: await createReviewsClient(env),
} as const;

// Automatically augment HydrogenAdditionalContext with the additional context type
type AdditionalContextType = typeof additionalContext;

declare global {
  interface HydrogenAdditionalContext extends AdditionalContextType {}
}

/**
 * Creates Hydrogen context for React Router 7.9.x
 * Returns HydrogenRouterContextProvider with hybrid access patterns
 * */
export async function createHydrogenRouterContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
) {
  /**
   * Open a cache instance in the worker and a custom session instance.
   */
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil = executionContext.waitUntil.bind(executionContext);
  const [cache, session] = await Promise.all([
    caches.open('hydrogen'),
    AppSession.init(request, [env.SESSION_SECRET]),
  ]);

  const hydrogenContext = createHydrogenContext(
    {
      env,
      request,
      cache,
      waitUntil,
      session,
      // Or detect from URL path based on locale subpath, cookies, or any other strategy
      i18n: {language: 'EN', country: 'US'},
      cart: {
        queryFragment: CART_QUERY_FRAGMENT,
      },
    },
    additionalContext,
  );

  return hydrogenContext;
}

```

# app/lib/fragments.ts

```ts
// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/cart
export const CART_QUERY_FRAGMENT = `#graphql
  fragment Money on MoneyV2 {
    currencyCode
    amount
  }
  fragment CartLine on CartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      totalAmount {
        ...Money
      }
      amountPerQuantity {
        ...Money
      }
      compareAtAmountPerQuantity {
        ...Money
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        availableForSale
        compareAtPrice {
          ...Money
        }
        price {
          ...Money
        }
        requiresShipping
        title
        image {
          id
          url
          altText
          width
          height

        }
        product {
          handle
          title
          id
          vendor
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
  fragment CartLineComponent on ComponentizableCartLine {
    id
    quantity
    attributes {
      key
      value
    }
    cost {
      totalAmount {
        ...Money
      }
      amountPerQuantity {
        ...Money
      }
      compareAtAmountPerQuantity {
        ...Money
      }
    }
    merchandise {
      ... on ProductVariant {
        id
        availableForSale
        compareAtPrice {
          ...Money
        }
        price {
          ...Money
        }
        requiresShipping
        title
        image {
          id
          url
          altText
          width
          height
        }
        product {
          handle
          title
          id
          vendor
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
  fragment CartApiQuery on Cart {
    updatedAt
    id
    appliedGiftCards {
      id
      lastCharacters
      amountUsed {
        ...Money
      }
    }
    checkoutUrl
    totalQuantity
    buyerIdentity {
      countryCode
      customer {
        id
        email
        firstName
        lastName
        displayName
      }
      email
      phone
    }
    lines(first: $numCartLines) {
      nodes {
        ...CartLine
      }
      nodes {
        ...CartLineComponent
      }
    }
    cost {
      subtotalAmount {
        ...Money
      }
      totalAmount {
        ...Money
      }
      totalDutyAmount {
        ...Money
      }
      totalTaxAmount {
        ...Money
      }
    }
    note
    attributes {
      key
      value
    }
    discountCodes {
      code
      applicable
    }
  }
` as const;

const MENU_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
` as const;

export const HEADER_QUERY = `#graphql
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
        }
      }
    }
  }
  query Header(
    $country: CountryCode
    $headerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    shop {
      ...Shop
    }
    menu(handle: $headerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;

export const FOOTER_QUERY = `#graphql
  query Footer(
    $country: CountryCode
    $footerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;

```

# app/lib/orderFilters.ts

```ts
/**
 * Field name constants for order filtering
 */
export const ORDER_FILTER_FIELDS = {
  NAME: 'name',
  CONFIRMATION_NUMBER: 'confirmation_number',
} as const;

/**
 * Parameters for filtering customer orders, see: https://shopify.dev/docs/api/customer/latest/queries/customer#returns-Customer.fields.orders.arguments.query
 */
export interface OrderFilterParams {
  /** Order name or number (e.g., "#1001" or "1001") */
  name?: string;
  /** Order confirmation number */
  confirmationNumber?: string;
}

/**
 * Sanitizes a filter value to prevent injection attacks or malformed queries.
 * Allows only alphanumeric characters, underscore, and dash.
 * @param value - The input string to sanitize
 * @returns The sanitized string
 */
function sanitizeFilterValue(value: string): string {
  // Only allow alphanumeric, underscore, and dash
  // Remove anything else to prevent injection
  return value.replace(/[^a-zA-Z0-9_\-]/g, '');
}

/**
 * Builds a query string for filtering customer orders using the Customer Account API
 * @param filters - The filter parameters
 * @returns A formatted query string for the GraphQL query parameter, or undefined if no filters
 * @example
 * buildOrderSearchQuery(\{ name: '1001' \}) // returns "name:1001"
 * buildOrderSearchQuery(\{ name: '1001', confirmationNumber: 'ABC123' \}) // returns "name:1001 AND confirmation_number:ABC123"
 */
export function buildOrderSearchQuery(
  filters: OrderFilterParams,
): string | undefined {
  const queryParts: string[] = [];

  if (filters.name) {
    // Remove # if present and trim
    const cleanName = filters.name.replace(/^#/, '').trim();
    const sanitizedName = sanitizeFilterValue(cleanName);
    if (sanitizedName) {
      queryParts.push(`name:${sanitizedName}`);
    }
  }

  if (filters.confirmationNumber) {
    const cleanConfirmation = filters.confirmationNumber.trim();
    const sanitizedConfirmation = sanitizeFilterValue(cleanConfirmation);
    if (sanitizedConfirmation) {
      queryParts.push(`confirmation_number:${sanitizedConfirmation}`);
    }
  }

  return queryParts.length > 0 ? queryParts.join(' AND ') : undefined;
}

/**
 * Parses order filter parameters from URLSearchParams
 * @param searchParams - The URL search parameters
 * @returns Parsed filter parameters
 * @example
 * const url = new URL('https://example.com/orders?name=1001&confirmation_number=ABC123');
 * parseOrderFilters(url.searchParams) // returns \{ name: '1001', confirmationNumber: 'ABC123' \}
 */
export function parseOrderFilters(
  searchParams: URLSearchParams,
): OrderFilterParams {
  const filters: OrderFilterParams = {};

  const name = searchParams.get(ORDER_FILTER_FIELDS.NAME);
  if (name) {
    filters.name = name;
  }

  const confirmationNumber = searchParams.get(
    ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER,
  );
  if (confirmationNumber) {
    filters.confirmationNumber = confirmationNumber;
  }

  return filters;
}

```

# app/lib/redirect.ts

```ts
import {redirect} from 'react-router';

export function redirectIfHandleIsLocalized(
  request: Request,
  ...localizedResources: Array<{
    handle: string;
    data: {handle: string} & unknown;
  }>
) {
  const url = new URL(request.url);
  let shouldRedirect = false;

  localizedResources.forEach(({handle, data}) => {
    if (handle !== data.handle) {
      url.pathname = url.pathname.replace(handle, data.handle);
      shouldRedirect = true;
    }
  });

  if (shouldRedirect) {
    throw redirect(url.toString());
  }
}

```

# app/lib/search.ts

```ts
import type {
  PredictiveSearchQuery,
  RegularSearchQuery,
} from 'storefrontapi.generated';

type ResultWithItems<Type extends 'predictive' | 'regular', Items> = {
  type: Type;
  term: string;
  error?: string;
  result: {total: number; items: Items};
};

export type RegularSearchReturn = ResultWithItems<
  'regular',
  RegularSearchQuery
>;
export type PredictiveSearchReturn = ResultWithItems<
  'predictive',
  NonNullable<PredictiveSearchQuery['predictiveSearch']>
>;

/**
 * Returns the empty state of a predictive search result to reset the search state.
 */
export function getEmptyPredictiveSearchResult(): PredictiveSearchReturn['result'] {
  return {
    total: 0,
    items: {
      articles: [],
      collections: [],
      products: [],
      pages: [],
      queries: [],
    },
  };
}

interface UrlWithTrackingParams {
  /** The base URL to which the tracking parameters will be appended. */
  baseUrl: string;
  /** The trackingParams returned by the Storefront API. */
  trackingParams?: string | null;
  /** Any additional query parameters to be appended to the URL. */
  params?: Record<string, string>;
  /** The search term to be appended to the URL. */
  term: string;
}

/**
 * A utility function that appends tracking parameters to a URL. Tracking parameters are
 * used internally by Shopify to enhance search results and admin dashboards.
 * @example
 * \`\`\`ts
 * const baseUrl = 'www.example.com';
 * const trackingParams = 'utm_source=shopify&utm_medium=shopify_app&utm_campaign=storefront';
 * const params = { foo: 'bar' };
 * const term = 'search term';
 * const url = urlWithTrackingParams({ baseUrl, trackingParams, params, term });
 * console.log(url);
 * // Output: 'https://www.example.com?foo=bar&q=search%20term&utm_source=shopify&utm_medium=shopify_app&utm_campaign=storefront'
 * \`\`\`
 */
export function urlWithTrackingParams({
  baseUrl,
  trackingParams,
  params: extraParams,
  term,
}: UrlWithTrackingParams) {
  let search = new URLSearchParams({
    ...extraParams,
    q: encodeURIComponent(term),
  }).toString();

  if (trackingParams) {
    search = `${search}&${trackingParams}`;
  }

  return `${baseUrl}?${search}`;
}

```

# app/lib/session.ts

```ts
import type {HydrogenSession} from '@shopify/hydrogen';
import {
  createCookieSessionStorage,
  type SessionStorage,
  type Session,
} from 'react-router';

/**
 * This is a custom session implementation for your Hydrogen shop.
 * Feel free to customize it to your needs, add helper methods, or
 * swap out the cookie-based implementation with something else!
 */
export class AppSession implements HydrogenSession {
  public isPending = false;

  #sessionStorage;
  #session;

  constructor(sessionStorage: SessionStorage, session: Session) {
    this.#sessionStorage = sessionStorage;
    this.#session = session;
  }

  static async init(request: Request, secrets: string[]) {
    const storage = createCookieSessionStorage({
      cookie: {
        name: 'session',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secrets,
      },
    });

    const session = await storage
      .getSession(request.headers.get('Cookie'))
      .catch(() => storage.getSession());

    return new this(storage, session);
  }

  get has() {
    return this.#session.has;
  }

  get get() {
    return this.#session.get;
  }

  get flash() {
    return this.#session.flash;
  }

  get unset() {
    this.isPending = true;
    return this.#session.unset;
  }

  get set() {
    this.isPending = true;
    return this.#session.set;
  }

  destroy() {
    return this.#sessionStorage.destroySession(this.#session);
  }

  commit() {
    this.isPending = false;
    return this.#sessionStorage.commitSession(this.#session);
  }
}

```

# app/lib/site.ts

```ts
export type SocialLinks = {
  email: string; // mailto: link
  instagram: string;
  youtube: string;
  twitter: string; // X
  tiktok: string;
};

export const SOCIAL: SocialLinks = {
  email: 'mailto:info@mcliv.studio',
  instagram: 'https://www.instagram.com/mcliv_studio',
  youtube: 'https://www.youtube.com/@mcliv.studio',
  twitter: 'https://x.com/mcliv_studio',
  tiktok: 'https://www.tiktok.com/@mcliv.studio',
};

```

# app/lib/variants.ts

```ts
import {useLocation} from 'react-router';
import type {SelectedOption} from '@shopify/hydrogen/storefront-api-types';
import {useMemo} from 'react';

export function useVariantUrl(
  handle: string,
  selectedOptions?: SelectedOption[],
) {
  const {pathname} = useLocation();

  return useMemo(() => {
    return getVariantUrl({
      handle,
      pathname,
      searchParams: new URLSearchParams(),
      selectedOptions,
    });
  }, [handle, selectedOptions, pathname]);
}

export function getVariantUrl({
  handle,
  pathname,
  searchParams,
  selectedOptions,
}: {
  handle: string;
  pathname: string;
  searchParams: URLSearchParams;
  selectedOptions?: SelectedOption[];
}) {
  const match = /(\/[a-zA-Z]{2}-[a-zA-Z]{2}\/)/g.exec(pathname);
  const isLocalePathname = match && match.length > 0;

  const path = isLocalePathname
    ? `${match![0]}products/${handle}`
    : `/products/${handle}`;

  selectedOptions?.forEach((option) => {
    searchParams.set(option.name, option.value);
  });

  const searchString = searchParams.toString();

  return path + (searchString ? '?' + searchParams.toString() : '');
}

```

# app/root.tsx

```tsx
import {Analytics, getShopAnalytics} from '@shopify/hydrogen';
import {
  Outlet,
  useRouteError,
  isRouteErrorResponse,
  type ShouldRevalidateFunction,
  Links,
  Meta,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from 'react-router';
import type {Route} from './+types/root';
import favicon from '~/assets/favicon.svg';
import {FOOTER_QUERY, HEADER_QUERY} from '~/lib/fragments';
import resetStyles from '~/styles/reset.css?url';
import appStyles from '~/styles/app.css?url';
import {PageLayout} from './components/PageLayout';

export type RootLoader = typeof loader;

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') return true;

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) return true;

  // Defaulting to no revalidation for root loader data to improve performance.
  // When using this feature, you risk your UI getting out of sync with your server.
  // Use with caution. If you are uncomfortable with this optimization, update the
  // line below to `return defaultShouldRevalidate` instead.
  // For more details see: https://remix.run/docs/en/main/route/should-revalidate
  return false;
};

/**
 * The main and reset stylesheets are added in the Layout component
 * to prevent a bug in development HMR updates.
 *
 * This avoids the "failed to execute 'insertBefore' on 'Node'" error
 * that occurs after editing and navigating to another page.
 *
 * It's a temporary fix until the issue is resolved.
 * https://github.com/remix-run/remix/issues/9242
 */
export function links() {
  return [
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: '/icon.svg'},
  ];
}

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  const {storefront, env} = args.context;

  return {
    ...deferredData,
    ...criticalData,
    publicStoreDomain: env.PUBLIC_STORE_DOMAIN,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
      withPrivacyBanner: false,
      // localize the privacy banner
      country: args.context.storefront.i18n.country,
      language: args.context.storefront.i18n.language,
    },
  };
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context}: Route.LoaderArgs) {
  const {storefront} = context;

  const [header] = await Promise.all([
    storefront.query(HEADER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        headerMenuHandle: 'main-menu', // Adjust to your header menu handle
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {header};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  const {storefront, customerAccount, cart} = context;

  // defer the footer query (below the fold)
  const footer = storefront
    .query(FOOTER_QUERY, {
      cache: storefront.CacheLong(),
      variables: {
        footerMenuHandle: 'footer', // Adjust to your footer menu handle
      },
    })
    .catch((error: Error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });
  return {
    cart: cart.get(),
    isLoggedIn: customerAccount.isLoggedIn(),
    footer,
  };
}

export function Layout({children}: {children?: React.ReactNode}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="stylesheet" href={resetStyles}></link>
        <link rel="stylesheet" href={appStyles}></link>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData<RootLoader>('root');

  if (!data) {
    return <Outlet />;
  }

  return (
    <Analytics.Provider
      cart={data.cart}
      shop={data.shop}
      consent={data.consent}
    >
      <PageLayout {...data}>
        <Outlet />
      </PageLayout>
    </Analytics.Provider>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="route-error">
      <h1>Oops</h1>
      <h2>{errorStatus}</h2>
      {errorMessage && (
        <fieldset>
          <pre>{errorMessage}</pre>
        </fieldset>
      )}
    </div>
  );
}

```

# app/routes.ts

```ts
import {flatRoutes} from '@react-router/fs-routes';
import {type RouteConfig} from '@react-router/dev/routes';
import {hydrogenRoutes} from '@shopify/hydrogen';

export default hydrogenRoutes([
  ...(await flatRoutes()),
  // Manual route definitions can be added to this array, in addition to or instead of using the `flatRoutes` file-based routing convention.
  // See https://reactrouter.com/api/framework-conventions/routes.ts#routests
]) satisfies RouteConfig;

```

# app/routes/_index.tsx

```tsx
import { useLoaderData } from 'react-router';
import type { Route } from './+types/_index';
import { Money } from '@shopify/hydrogen';
import { AddToCartButton } from '~/components/AddToCartButton';
import { ProductCarousel } from '~/components/ProductCarousel';
import { ContinueToCheckoutButton } from '~/components/ContinueToCheckoutButton';

const DEFAULT_HANDLE = 'capsule-collection-001';

export const meta: Route.MetaFunction = ({ data }) => {
  if (!data?.product) {
    return [{ title: 'Product unavailable · MCLIV Studio' }];
  }
  return [{ title: `${data.product.title} · MCLIV Studio` }];
};

export async function loader({ context }: Route.LoaderArgs) {
  const handle = context.env.PRIMARY_PRODUCT_HANDLE || DEFAULT_HANDLE;

  try {
    const data = await context.storefront.query(PRODUCT_BY_HANDLE_QUERY, {
      variables: { handle },
    });

    return {
      product: data.product,
      handle,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    };
  } catch (error) {
    console.error(error);
    return {
      product: null,
      handle,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    };
  }
}

export default function SingleProductPage() {
  const { product, handle, storeDomain } = useLoaderData<typeof loader>();
  const variant = product?.variants?.nodes?.[0];
  const images = product?.images?.nodes ?? [];
  const fallbackUrl = storeDomain
    ? `https://${storeDomain}/products/${handle}`
    : `https://studiomcliv.myshopify.com/products/${handle}`;

  if (!product) {
    return (
      <main className="product-page">
        <section className="product-content">
          <div className="product-copy">
            <p className="eyebrow">Limited Release</p>
            <h1>Product unavailable</h1>
            <p className="muted">
              We couldn&apos;t load this release. Check your storefront token and
              domain, or open the Shopify product page directly.
            </p>
            <a className="primary" href={fallbackUrl}>
              View on Shopify
            </a>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="product-page">
      <section className="product-content">
        <div className="product-media">
          <ProductCarousel images={images} title={product.title} />
        </div>

        <div className="product-copy">
          <p className="eyebrow">Limited Release</p>
          <h1>{product.title}</h1>
          <div
            className="description"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />

          {variant ? (
            <div className="purchase">
              <div className="price">
                <Money data={variant.price} />
              </div>
              {variant.availableForSale ? (
                <div className="purchase-row">
                  <ContinueToCheckoutButton variantId={variant.id} />
                </div>
              ) : (
                <AddToCartButton
                  lines={[
                    {
                      merchandiseId: variant.id,
                      quantity: 1,
                    },
                  ]}
                  disabled
                >
                  Sold out
                </AddToCartButton>
              )}
            </div>
          ) : (
            <a className="primary" href={fallbackUrl}>
              View on Shopify
            </a>
          )}
        </div>
      </section>
    </main>
  );
}

const PRODUCT_BY_HANDLE_QUERY = `#graphql
  query ProductByHandle($handle: String!, $country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      id
      title
      descriptionHtml
      handle
      featuredImage {
        id
        url
        altText
        width
        height
      }
      images(first: 10) {
        nodes {
          id
          url
          altText
          width
          height
        }
      }
      variants(first: 5) {
        nodes {
          id
          availableForSale
          title
          price {
            amount
            currencyCode
          }
        }
      }
    }
  }
` as const;

```

# app/routes/[robots.txt].tsx

```tsx
import type {Route} from './+types/[robots.txt]';
import {parseGid} from '@shopify/hydrogen';

export async function loader({request, context}: Route.LoaderArgs) {
  const url = new URL(request.url);

  const {shop} = await context.storefront.query(ROBOTS_QUERY);

  const shopId = parseGid(shop.id).id;
  const body = robotsTxtData({url: url.origin, shopId});

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',

      'Cache-Control': `max-age=${60 * 60 * 24}`,
    },
  });
}

function robotsTxtData({url, shopId}: {shopId?: string; url?: string}) {
  const sitemapUrl = url ? `${url}/sitemap.xml` : undefined;

  return `
User-agent: *
${generalDisallowRules({sitemapUrl, shopId})}

# Google adsbot ignores robots.txt unless specifically named!
User-agent: adsbot-google
Disallow: /checkouts/
Disallow: /checkout
Disallow: /carts
Disallow: /orders
${shopId ? `Disallow: /${shopId}/checkouts` : ''}
${shopId ? `Disallow: /${shopId}/orders` : ''}
Disallow: /*?*oseid=*
Disallow: /*preview_theme_id*
Disallow: /*preview_script_id*

User-agent: Nutch
Disallow: /

User-agent: AhrefsBot
Crawl-delay: 10
${generalDisallowRules({sitemapUrl, shopId})}

User-agent: AhrefsSiteAudit
Crawl-delay: 10
${generalDisallowRules({sitemapUrl, shopId})}

User-agent: MJ12bot
Crawl-Delay: 10

User-agent: Pinterest
Crawl-delay: 1
`.trim();
}

/**
 * This function generates disallow rules that generally follow what Shopify's
 * Online Store has as defaults for their robots.txt
 */
function generalDisallowRules({
  shopId,
  sitemapUrl,
}: {
  shopId?: string;
  sitemapUrl?: string;
}) {
  return `Disallow: /admin
Disallow: /cart
Disallow: /orders
Disallow: /checkouts/
Disallow: /checkout
${shopId ? `Disallow: /${shopId}/checkouts` : ''}
${shopId ? `Disallow: /${shopId}/orders` : ''}
Disallow: /carts
Disallow: /account
Disallow: /collections/*sort_by*
Disallow: /*/collections/*sort_by*
Disallow: /collections/*+*
Disallow: /collections/*%2B*
Disallow: /collections/*%2b*
Disallow: /*/collections/*+*
Disallow: /*/collections/*%2B*
Disallow: /*/collections/*%2b*
Disallow: */collections/*filter*&*filter*
Disallow: /blogs/*+*
Disallow: /blogs/*%2B*
Disallow: /blogs/*%2b*
Disallow: /*/blogs/*+*
Disallow: /*/blogs/*%2B*
Disallow: /*/blogs/*%2b*
Disallow: /*?*oseid=*
Disallow: /*preview_theme_id*
Disallow: /*preview_script_id*
Disallow: /policies/
Disallow: /*/*?*ls=*&ls=*
Disallow: /*/*?*ls%3D*%3Fls%3D*
Disallow: /*/*?*ls%3d*%3fls%3d*
Disallow: /search
Allow: /search/
Disallow: /search/?*
Disallow: /apple-app-site-association
Disallow: /.well-known/shopify/monorail
${sitemapUrl ? `Sitemap: ${sitemapUrl}` : ''}`;
}

const ROBOTS_QUERY = `#graphql
  query StoreRobots($country: CountryCode, $language: LanguageCode)
   @inContext(country: $country, language: $language) {
    shop {
      id
    }
  }
` as const;

```

# app/routes/[sitemap.xml].tsx

```tsx
import type {Route} from './+types/[sitemap.xml]';
import {getSitemapIndex} from '@shopify/hydrogen';

export async function loader({
  request,
  context: {storefront},
}: Route.LoaderArgs) {
  const response = await getSitemapIndex({
    storefront,
    request,
  });

  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}`);

  return response;
}

```

# app/routes/$.tsx

```tsx
import type {Route} from './+types/$';

export async function loader({request}: Route.LoaderArgs) {
  throw new Response(`${new URL(request.url).pathname} not found`, {
    status: 404,
  });
}

export default function CatchAllPage() {
  return null;
}

```

# app/routes/account_.authorize.tsx

```tsx
import type {Route} from './+types/account_.authorize';

export async function loader({context}: Route.LoaderArgs) {
  return context.customerAccount.authorize();
}

```

# app/routes/account_.login.tsx

```tsx
import type {Route} from './+types/account_.login';

export async function loader({request, context}: Route.LoaderArgs) {
  return context.customerAccount.login({
    countryCode: context.storefront.i18n.country,
  });
}

```

# app/routes/account_.logout.tsx

```tsx
import {redirect} from 'react-router';
import type {Route} from './+types/account_.logout';

// if we don't implement this, /account/logout will get caught by account.$.tsx to do login
export async function loader() {
  return redirect('/');
}

export async function action({context}: Route.ActionArgs) {
  return context.customerAccount.logout();
}

```

# app/routes/account._index.tsx

```tsx
import {redirect} from 'react-router';

export async function loader() {
  return redirect('/account/orders');
}

```

# app/routes/account.$.tsx

```tsx
import {redirect} from 'react-router';
import type {Route} from './+types/account.$';

// fallback wild card for all unauthenticated routes in account section
export async function loader({context}: Route.LoaderArgs) {
  context.customerAccount.handleAuthStatus();

  return redirect('/account');
}

```

# app/routes/account.addresses.tsx

```tsx
import type {CustomerAddressInput} from '@shopify/hydrogen/customer-account-api-types';
import type {
  AddressFragment,
  CustomerFragment,
} from 'customer-accountapi.generated';
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
  type Fetcher,
} from 'react-router';
import type {Route} from './+types/account.addresses';
import {
  UPDATE_ADDRESS_MUTATION,
  DELETE_ADDRESS_MUTATION,
  CREATE_ADDRESS_MUTATION,
} from '~/graphql/customer-account/CustomerAddressMutations';

export type ActionResponse = {
  addressId?: string | null;
  createdAddress?: AddressFragment;
  defaultAddress?: string | null;
  deletedAddress?: string | null;
  error: Record<AddressFragment['id'], string> | null;
  updatedAddress?: AddressFragment;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Addresses'}];
};

export async function loader({context}: Route.LoaderArgs) {
  context.customerAccount.handleAuthStatus();

  return {};
}

export async function action({request, context}: Route.ActionArgs) {
  const {customerAccount} = context;

  try {
    const form = await request.formData();

    const addressId = form.has('addressId')
      ? String(form.get('addressId'))
      : null;
    if (!addressId) {
      throw new Error('You must provide an address id.');
    }

    // this will ensure redirecting to login never happen for mutatation
    const isLoggedIn = await customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return data(
        {error: {[addressId]: 'Unauthorized'}},
        {
          status: 401,
        },
      );
    }

    const defaultAddress = form.has('defaultAddress')
      ? String(form.get('defaultAddress')) === 'on'
      : false;
    const address: CustomerAddressInput = {};
    const keys: (keyof CustomerAddressInput)[] = [
      'address1',
      'address2',
      'city',
      'company',
      'territoryCode',
      'firstName',
      'lastName',
      'phoneNumber',
      'zoneCode',
      'zip',
    ];

    for (const key of keys) {
      const value = form.get(key);
      if (typeof value === 'string') {
        address[key] = value;
      }
    }

    switch (request.method) {
      case 'POST': {
        // handle new address creation
        try {
          const {data, errors} = await customerAccount.mutate(
            CREATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                defaultAddress,
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressCreate?.userErrors?.length) {
            throw new Error(data?.customerAddressCreate?.userErrors[0].message);
          }

          if (!data?.customerAddressCreate?.customerAddress) {
            throw new Error('Customer address create failed.');
          }

          return {
            error: null,
            createdAddress: data?.customerAddressCreate?.customerAddress,
            defaultAddress,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      case 'PUT': {
        // handle address updates
        try {
          const {data, errors} = await customerAccount.mutate(
            UPDATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                addressId: decodeURIComponent(addressId),
                defaultAddress,
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressUpdate?.userErrors?.length) {
            throw new Error(data?.customerAddressUpdate?.userErrors[0].message);
          }

          if (!data?.customerAddressUpdate?.customerAddress) {
            throw new Error('Customer address update failed.');
          }

          return {
            error: null,
            updatedAddress: address,
            defaultAddress,
          };
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      case 'DELETE': {
        // handles address deletion
        try {
          const {data, errors} = await customerAccount.mutate(
            DELETE_ADDRESS_MUTATION,
            {
              variables: {
                addressId: decodeURIComponent(addressId),
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (data?.customerAddressDelete?.userErrors?.length) {
            throw new Error(data?.customerAddressDelete?.userErrors[0].message);
          }

          if (!data?.customerAddressDelete?.deletedAddressId) {
            throw new Error('Customer address delete failed.');
          }

          return {error: null, deletedAddress: addressId};
        } catch (error: unknown) {
          if (error instanceof Error) {
            return data(
              {error: {[addressId]: error.message}},
              {
                status: 400,
              },
            );
          }
          return data(
            {error: {[addressId]: error}},
            {
              status: 400,
            },
          );
        }
      }

      default: {
        return data(
          {error: {[addressId]: 'Method not allowed'}},
          {
            status: 405,
          },
        );
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return data(
        {error: error.message},
        {
          status: 400,
        },
      );
    }
    return data(
      {error},
      {
        status: 400,
      },
    );
  }
}

export default function Addresses() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();
  const {defaultAddress, addresses} = customer;

  return (
    <div className="account-addresses">
      <h2>Addresses</h2>
      <br />
      {!addresses.nodes.length ? (
        <p>You have no addresses saved.</p>
      ) : (
        <div>
          <div>
            <legend>Create address</legend>
            <NewAddressForm />
          </div>
          <br />
          <hr />
          <br />
          <ExistingAddresses
            addresses={addresses}
            defaultAddress={defaultAddress}
          />
        </div>
      )}
    </div>
  );
}

function NewAddressForm() {
  const newAddress = {
    address1: '',
    address2: '',
    city: '',
    company: '',
    territoryCode: '',
    firstName: '',
    id: 'new',
    lastName: '',
    phoneNumber: '',
    zoneCode: '',
    zip: '',
  } as CustomerAddressInput;

  return (
    <AddressForm
      addressId={'NEW_ADDRESS_ID'}
      address={newAddress}
      defaultAddress={null}
    >
      {({stateForMethod}) => (
        <div>
          <button
            disabled={stateForMethod('POST') !== 'idle'}
            formMethod="POST"
            type="submit"
          >
            {stateForMethod('POST') !== 'idle' ? 'Creating' : 'Create'}
          </button>
        </div>
      )}
    </AddressForm>
  );
}

function ExistingAddresses({
  addresses,
  defaultAddress,
}: Pick<CustomerFragment, 'addresses' | 'defaultAddress'>) {
  return (
    <div>
      <legend>Existing addresses</legend>
      {addresses.nodes.map((address) => (
        <AddressForm
          key={address.id}
          addressId={address.id}
          address={address}
          defaultAddress={defaultAddress}
        >
          {({stateForMethod}) => (
            <div>
              <button
                disabled={stateForMethod('PUT') !== 'idle'}
                formMethod="PUT"
                type="submit"
              >
                {stateForMethod('PUT') !== 'idle' ? 'Saving' : 'Save'}
              </button>
              <button
                disabled={stateForMethod('DELETE') !== 'idle'}
                formMethod="DELETE"
                type="submit"
              >
                {stateForMethod('DELETE') !== 'idle' ? 'Deleting' : 'Delete'}
              </button>
            </div>
          )}
        </AddressForm>
      ))}
    </div>
  );
}

export function AddressForm({
  addressId,
  address,
  defaultAddress,
  children,
}: {
  addressId: AddressFragment['id'];
  address: CustomerAddressInput;
  defaultAddress: CustomerFragment['defaultAddress'];
  children: (props: {
    stateForMethod: (method: 'PUT' | 'POST' | 'DELETE') => Fetcher['state'];
  }) => React.ReactNode;
}) {
  const {state, formMethod} = useNavigation();
  const action = useActionData<ActionResponse>();
  const error = action?.error?.[addressId];
  const isDefaultAddress = defaultAddress?.id === addressId;
  return (
    <Form id={addressId}>
      <fieldset>
        <input type="hidden" name="addressId" defaultValue={addressId} />
        <label htmlFor="firstName">First name*</label>
        <input
          aria-label="First name"
          autoComplete="given-name"
          defaultValue={address?.firstName ?? ''}
          id="firstName"
          name="firstName"
          placeholder="First name"
          required
          type="text"
        />
        <label htmlFor="lastName">Last name*</label>
        <input
          aria-label="Last name"
          autoComplete="family-name"
          defaultValue={address?.lastName ?? ''}
          id="lastName"
          name="lastName"
          placeholder="Last name"
          required
          type="text"
        />
        <label htmlFor="company">Company</label>
        <input
          aria-label="Company"
          autoComplete="organization"
          defaultValue={address?.company ?? ''}
          id="company"
          name="company"
          placeholder="Company"
          type="text"
        />
        <label htmlFor="address1">Address line*</label>
        <input
          aria-label="Address line 1"
          autoComplete="address-line1"
          defaultValue={address?.address1 ?? ''}
          id="address1"
          name="address1"
          placeholder="Address line 1*"
          required
          type="text"
        />
        <label htmlFor="address2">Address line 2</label>
        <input
          aria-label="Address line 2"
          autoComplete="address-line2"
          defaultValue={address?.address2 ?? ''}
          id="address2"
          name="address2"
          placeholder="Address line 2"
          type="text"
        />
        <label htmlFor="city">City*</label>
        <input
          aria-label="City"
          autoComplete="address-level2"
          defaultValue={address?.city ?? ''}
          id="city"
          name="city"
          placeholder="City"
          required
          type="text"
        />
        <label htmlFor="zoneCode">State / Province*</label>
        <input
          aria-label="State/Province"
          autoComplete="address-level1"
          defaultValue={address?.zoneCode ?? ''}
          id="zoneCode"
          name="zoneCode"
          placeholder="State / Province"
          required
          type="text"
        />
        <label htmlFor="zip">Zip / Postal Code*</label>
        <input
          aria-label="Zip"
          autoComplete="postal-code"
          defaultValue={address?.zip ?? ''}
          id="zip"
          name="zip"
          placeholder="Zip / Postal Code"
          required
          type="text"
        />
        <label htmlFor="territoryCode">Country Code*</label>
        <input
          aria-label="territoryCode"
          autoComplete="country"
          defaultValue={address?.territoryCode ?? ''}
          id="territoryCode"
          name="territoryCode"
          placeholder="Country"
          required
          type="text"
          maxLength={2}
        />
        <label htmlFor="phoneNumber">Phone</label>
        <input
          aria-label="Phone Number"
          autoComplete="tel"
          defaultValue={address?.phoneNumber ?? ''}
          id="phoneNumber"
          name="phoneNumber"
          placeholder="+16135551111"
          pattern="^\+?[1-9]\d{3,14}$"
          type="tel"
        />
        <div>
          <input
            defaultChecked={isDefaultAddress}
            id="defaultAddress"
            name="defaultAddress"
            type="checkbox"
          />
          <label htmlFor="defaultAddress">Set as default address</label>
        </div>
        {error ? (
          <p>
            <mark>
              <small>{error}</small>
            </mark>
          </p>
        ) : (
          <br />
        )}
        {children({
          stateForMethod: (method) => (formMethod === method ? state : 'idle'),
        })}
      </fieldset>
    </Form>
  );
}

```

# app/routes/account.orders._index.tsx

```tsx
import {
  Link,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from 'react-router';
import type {Route} from './+types/account.orders._index';
import {useRef} from 'react';
import {
  Money,
  getPaginationVariables,
  flattenConnection,
} from '@shopify/hydrogen';
import {
  buildOrderSearchQuery,
  parseOrderFilters,
  ORDER_FILTER_FIELDS,
  type OrderFilterParams,
} from '~/lib/orderFilters';
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/CustomerOrdersQuery';
import type {
  CustomerOrdersFragment,
  OrderItemFragment,
} from 'customer-accountapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

type OrdersLoaderData = {
  customer: CustomerOrdersFragment;
  filters: OrderFilterParams;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Orders'}];
};

export async function loader({request, context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 20,
  });

  const url = new URL(request.url);
  const filters = parseOrderFilters(url.searchParams);
  const query = buildOrderSearchQuery(filters);

  const {data, errors} = await customerAccount.query(CUSTOMER_ORDERS_QUERY, {
    variables: {
      ...paginationVariables,
      query,
      language: customerAccount.i18n.language,
    },
  });

  if (errors?.length || !data?.customer) {
    throw Error('Customer orders not found');
  }

  return {customer: data.customer, filters};
}

export default function Orders() {
  const {customer, filters} = useLoaderData<OrdersLoaderData>();
  const {orders} = customer;

  return (
    <div className="orders">
      <OrderSearchForm currentFilters={filters} />
      <OrdersTable orders={orders} filters={filters} />
    </div>
  );
}

function OrdersTable({
  orders,
  filters,
}: {
  orders: CustomerOrdersFragment['orders'];
  filters: OrderFilterParams;
}) {
  const hasFilters = !!(filters.name || filters.confirmationNumber);

  return (
    <div className="acccount-orders" aria-live="polite">
      {orders?.nodes.length ? (
        <PaginatedResourceSection connection={orders}>
          {({node: order}) => <OrderItem key={order.id} order={order} />}
        </PaginatedResourceSection>
      ) : (
        <EmptyOrders hasFilters={hasFilters} />
      )}
    </div>
  );
}

function EmptyOrders({hasFilters = false}: {hasFilters?: boolean}) {
  return (
    <div>
      {hasFilters ? (
        <>
          <p>No orders found matching your search.</p>
          <br />
          <p>
            <Link to="/account/orders">Clear filters →</Link>
          </p>
        </>
      ) : (
        <>
          <p>You haven&apos;t placed any orders yet.</p>
          <br />
          <p>
            <Link to="/collections">Start Shopping →</Link>
          </p>
        </>
      )}
    </div>
  );
}

function OrderSearchForm({
  currentFilters,
}: {
  currentFilters: OrderFilterParams;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const isSearching =
    navigation.state !== 'idle' &&
    navigation.location?.pathname?.includes('orders');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    const name = formData.get(ORDER_FILTER_FIELDS.NAME)?.toString().trim();
    const confirmationNumber = formData
      .get(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER)
      ?.toString()
      .trim();

    if (name) params.set(ORDER_FILTER_FIELDS.NAME, name);
    if (confirmationNumber)
      params.set(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER, confirmationNumber);

    setSearchParams(params);
  };

  const hasFilters = currentFilters.name || currentFilters.confirmationNumber;

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="order-search-form"
      aria-label="Search orders"
    >
      <fieldset className="order-search-fieldset">
        <legend className="order-search-legend">Filter Orders</legend>

        <div className="order-search-inputs">
          <input
            type="search"
            name={ORDER_FILTER_FIELDS.NAME}
            placeholder="Order #"
            aria-label="Order number"
            defaultValue={currentFilters.name || ''}
            className="order-search-input"
          />
          <input
            type="search"
            name={ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER}
            placeholder="Confirmation #"
            aria-label="Confirmation number"
            defaultValue={currentFilters.confirmationNumber || ''}
            className="order-search-input"
          />
        </div>

        <div className="order-search-buttons">
          <button type="submit" disabled={isSearching}>
            {isSearching ? 'Searching' : 'Search'}
          </button>
          {hasFilters && (
            <button
              type="button"
              disabled={isSearching}
              onClick={() => {
                setSearchParams(new URLSearchParams());
                formRef.current?.reset();
              }}
            >
              Clear
            </button>
          )}
        </div>
      </fieldset>
    </form>
  );
}

function OrderItem({order}: {order: OrderItemFragment}) {
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;
  return (
    <>
      <fieldset>
        <Link to={`/account/orders/${btoa(order.id)}`}>
          <strong>#{order.number}</strong>
        </Link>
        <p>{new Date(order.processedAt).toDateString()}</p>
        {order.confirmationNumber && (
          <p>Confirmation: {order.confirmationNumber}</p>
        )}
        <p>{order.financialStatus}</p>
        {fulfillmentStatus && <p>{fulfillmentStatus}</p>}
        <Money data={order.totalPrice} />
        <Link to={`/account/orders/${btoa(order.id)}`}>View Order →</Link>
      </fieldset>
      <br />
    </>
  );
}

```

# app/routes/account.orders.$id.tsx

```tsx
import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/account.orders.$id';
import {Money, Image} from '@shopify/hydrogen';
import type {
  OrderLineItemFullFragment,
  OrderQuery,
} from 'customer-accountapi.generated';
import {CUSTOMER_ORDER_QUERY} from '~/graphql/customer-account/CustomerOrderQuery';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Order ${data?.order?.name}`}];
};

export async function loader({params, context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  if (!params.id) {
    return redirect('/account/orders');
  }

  const orderId = atob(params.id);
  const {data, errors}: {data: OrderQuery; errors?: Array<{message: string}>} =
    await customerAccount.query(CUSTOMER_ORDER_QUERY, {
      variables: {
        orderId,
        language: customerAccount.i18n.language,
      },
    });

  if (errors?.length || !data?.order) {
    throw new Error('Order not found');
  }

  const {order} = data;

  // Extract line items directly from nodes array
  const lineItems = order.lineItems.nodes;

  // Extract discount applications directly from nodes array
  const discountApplications = order.discountApplications.nodes;

  // Get fulfillment status from first fulfillment node
  const fulfillmentStatus = order.fulfillments.nodes[0]?.status ?? 'N/A';

  // Get first discount value with proper type checking
  const firstDiscount = discountApplications[0]?.value;

  // Type guard for MoneyV2 discount
  const discountValue =
    firstDiscount?.__typename === 'MoneyV2'
      ? (firstDiscount as Extract<
          typeof firstDiscount,
          {__typename: 'MoneyV2'}
        >)
      : null;

  // Type guard for percentage discount
  const discountPercentage =
    firstDiscount?.__typename === 'PricingPercentageValue'
      ? (
          firstDiscount as Extract<
            typeof firstDiscount,
            {__typename: 'PricingPercentageValue'}
          >
        ).percentage
      : null;

  return {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  };
}

export default function OrderRoute() {
  const {
    order,
    lineItems,
    discountValue,
    discountPercentage,
    fulfillmentStatus,
  } = useLoaderData<typeof loader>();
  return (
    <div className="account-order">
      <h2>Order {order.name}</h2>
      <p>Placed on {new Date(order.processedAt!).toDateString()}</p>
      {order.confirmationNumber && (
        <p>Confirmation: {order.confirmationNumber}</p>
      )}
      <br />
      <div>
        <table>
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((lineItem, lineItemIndex) => (
              // eslint-disable-next-line react/no-array-index-key
              <OrderLineRow key={lineItemIndex} lineItem={lineItem} />
            ))}
          </tbody>
          <tfoot>
            {((discountValue && discountValue.amount) ||
              discountPercentage) && (
              <tr>
                <th scope="row" colSpan={3}>
                  <p>Discounts</p>
                </th>
                <th scope="row">
                  <p>Discounts</p>
                </th>
                <td>
                  {discountPercentage ? (
                    <span>-{discountPercentage}% OFF</span>
                  ) : (
                    discountValue && <Money data={discountValue!} />
                  )}
                </td>
              </tr>
            )}
            <tr>
              <th scope="row" colSpan={3}>
                <p>Subtotal</p>
              </th>
              <th scope="row">
                <p>Subtotal</p>
              </th>
              <td>
                <Money data={order.subtotal!} />
              </td>
            </tr>
            <tr>
              <th scope="row" colSpan={3}>
                Tax
              </th>
              <th scope="row">
                <p>Tax</p>
              </th>
              <td>
                <Money data={order.totalTax!} />
              </td>
            </tr>
            <tr>
              <th scope="row" colSpan={3}>
                Total
              </th>
              <th scope="row">
                <p>Total</p>
              </th>
              <td>
                <Money data={order.totalPrice!} />
              </td>
            </tr>
          </tfoot>
        </table>
        <div>
          <h3>Shipping Address</h3>
          {order?.shippingAddress ? (
            <address>
              <p>{order.shippingAddress.name}</p>
              {order.shippingAddress.formatted ? (
                <p>{order.shippingAddress.formatted}</p>
              ) : (
                ''
              )}
              {order.shippingAddress.formattedArea ? (
                <p>{order.shippingAddress.formattedArea}</p>
              ) : (
                ''
              )}
            </address>
          ) : (
            <p>No shipping address defined</p>
          )}
          <h3>Status</h3>
          <div>
            <p>{fulfillmentStatus}</p>
          </div>
        </div>
      </div>
      <br />
      <p>
        <a target="_blank" href={order.statusPageUrl} rel="noreferrer">
          View Order Status →
        </a>
      </p>
    </div>
  );
}

function OrderLineRow({lineItem}: {lineItem: OrderLineItemFullFragment}) {
  return (
    <tr key={lineItem.id}>
      <td>
        <div>
          {lineItem?.image && (
            <div>
              <Image data={lineItem.image} width={96} height={96} />
            </div>
          )}
          <div>
            <p>{lineItem.title}</p>
            <small>{lineItem.variantTitle}</small>
          </div>
        </div>
      </td>
      <td>
        <Money data={lineItem.price!} />
      </td>
      <td>{lineItem.quantity}</td>
      <td>
        <Money data={lineItem.totalDiscount!} />
      </td>
    </tr>
  );
}

```

# app/routes/account.profile.tsx

```tsx
import type {CustomerFragment} from 'customer-accountapi.generated';
import type {CustomerUpdateInput} from '@shopify/hydrogen/customer-account-api-types';
import {CUSTOMER_UPDATE_MUTATION} from '~/graphql/customer-account/CustomerUpdateMutation';
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
} from 'react-router';
import type {Route} from './+types/account.profile';

export type ActionResponse = {
  error: string | null;
  customer: CustomerFragment | null;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Profile'}];
};

export async function loader({context}: Route.LoaderArgs) {
  context.customerAccount.handleAuthStatus();

  return {};
}

export async function action({request, context}: Route.ActionArgs) {
  const {customerAccount} = context;

  if (request.method !== 'PUT') {
    return data({error: 'Method not allowed'}, {status: 405});
  }

  const form = await request.formData();

  try {
    const customer: CustomerUpdateInput = {};
    const validInputKeys = ['firstName', 'lastName'] as const;
    for (const [key, value] of form.entries()) {
      if (!validInputKeys.includes(key as any)) {
        continue;
      }
      if (typeof value === 'string' && value.length) {
        customer[key as (typeof validInputKeys)[number]] = value;
      }
    }

    // update customer and possibly password
    const {data, errors} = await customerAccount.mutate(
      CUSTOMER_UPDATE_MUTATION,
      {
        variables: {
          customer,
          language: customerAccount.i18n.language,
        },
      },
    );

    if (errors?.length) {
      throw new Error(errors[0].message);
    }

    if (!data?.customerUpdate?.customer) {
      throw new Error('Customer profile update failed.');
    }

    return {
      error: null,
      customer: data?.customerUpdate?.customer,
    };
  } catch (error: any) {
    return data(
      {error: error.message, customer: null},
      {
        status: 400,
      },
    );
  }
}

export default function AccountProfile() {
  const account = useOutletContext<{customer: CustomerFragment}>();
  const {state} = useNavigation();
  const action = useActionData<ActionResponse>();
  const customer = action?.customer ?? account?.customer;

  return (
    <div className="account-profile">
      <h2>My profile</h2>
      <br />
      <Form method="PUT">
        <legend>Personal information</legend>
        <fieldset>
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="First name"
            aria-label="First name"
            defaultValue={customer.firstName ?? ''}
            minLength={2}
          />
          <label htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            placeholder="Last name"
            aria-label="Last name"
            defaultValue={customer.lastName ?? ''}
            minLength={2}
          />
        </fieldset>
        {action?.error ? (
          <p>
            <mark>
              <small>{action.error}</small>
            </mark>
          </p>
        ) : (
          <br />
        )}
        <button type="submit" disabled={state !== 'idle'}>
          {state !== 'idle' ? 'Updating' : 'Update'}
        </button>
      </Form>
    </div>
  );
}

```

# app/routes/account.tsx

```tsx
import {
  data as remixData,
  Form,
  NavLink,
  Outlet,
  useLoaderData,
} from 'react-router';
import type {Route} from './+types/account';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';

export function shouldRevalidate() {
  return true;
}

export async function loader({context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  const {data, errors} = await customerAccount.query(
    CUSTOMER_DETAILS_QUERY,
    {
      variables: {
        language: customerAccount.i18n.language,
      },
    },
  );

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  return remixData(
    {customer: data.customer},
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountLayout() {
  const {customer} = useLoaderData<typeof loader>();

  const heading = customer
    ? customer.firstName
      ? `Welcome, ${customer.firstName}`
      : `Welcome to your account.`
    : 'Account Details';

  return (
    <div className="account">
      <h1>{heading}</h1>
      <br />
      <AccountMenu />
      <br />
      <br />
      <Outlet context={{customer}} />
    </div>
  );
}

function AccountMenu() {
  function isActiveStyle({
    isActive,
    isPending,
  }: {
    isActive: boolean;
    isPending: boolean;
  }) {
    return {
      fontWeight: isActive ? 'bold' : undefined,
      color: isPending ? 'grey' : 'black',
    };
  }

  return (
    <nav role="navigation">
      <NavLink to="/account/orders" style={isActiveStyle}>
        Orders &nbsp;
      </NavLink>
      &nbsp;|&nbsp;
      <NavLink to="/account/profile" style={isActiveStyle}>
        &nbsp; Profile &nbsp;
      </NavLink>
      &nbsp;|&nbsp;
      <NavLink to="/account/addresses" style={isActiveStyle}>
        &nbsp; Addresses &nbsp;
      </NavLink>
      &nbsp;|&nbsp;
      <Logout />
    </nav>
  );
}

function Logout() {
  return (
    <Form className="account-logout" method="POST" action="/account/logout">
      &nbsp;<button type="submit">Sign out</button>
    </Form>
  );
}

```

# app/routes/api.$version.[graphql.json].tsx

```tsx
import type {Route} from './+types/api.$version.[graphql.json]';

export async function action({params, context, request}: Route.ActionArgs) {
  const response = await fetch(
    `https://${context.env.PUBLIC_CHECKOUT_DOMAIN}/api/${params.version}/graphql.json`,
    {
      method: 'POST',
      body: request.body,
      headers: request.headers,
    },
  );

  return new Response(response.body, {headers: new Headers(response.headers)});
}

```

# app/routes/blogs._index.tsx

```tsx
import {
  Link,
  useLoaderData,
} from 'react-router';
import type {Route} from './+types/blogs._index';
import {getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import type {BlogsQuery} from 'storefrontapi.generated';

type BlogNode = BlogsQuery['blogs']['nodes'][0];

export const meta: Route.MetaFunction = () => {
  return [{title: `Hydrogen | Blogs`}];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 10,
  });

  const [{blogs}] = await Promise.all([
    context.storefront.query(BLOGS_QUERY, {
      variables: {
        ...paginationVariables,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {blogs};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Blogs() {
  const {blogs} = useLoaderData<typeof loader>();

  return (
    <div className="blogs">
      <h1>Blogs</h1>
      <div className="blogs-grid">
        <PaginatedResourceSection<BlogNode> connection={blogs}>
          {({node: blog}) => (
            <Link
              className="blog"
              key={blog.handle}
              prefetch="intent"
              to={`/blogs/${blog.handle}`}
            >
              <h2>{blog.title}</h2>
            </Link>
          )}
        </PaginatedResourceSection>
      </div>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
  query Blogs(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    blogs(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        title
        handle
        seo {
          title
          description
        }
      }
    }
  }
` as const;

```

# app/routes/blogs.$blogHandle._index.tsx

```tsx
import {
  Link,
  useLoaderData,
} from 'react-router';
import type {Route} from './+types/blogs.$blogHandle._index';
import {Image, getPaginationVariables} from '@shopify/hydrogen';
import type {ArticleItemFragment} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data?.blog.title ?? ''} blog`}];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  request,
  params,
}: Route.LoaderArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  if (!params.blogHandle) {
    throw new Response(`blog not found`, {status: 404});
  }

  const [{blog}] = await Promise.all([
    context.storefront.query(BLOGS_QUERY, {
      variables: {
        blogHandle: params.blogHandle,
        ...paginationVariables,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!blog?.articles) {
    throw new Response('Not found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle: params.blogHandle, data: blog});

  return {blog};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Blog() {
  const {blog} = useLoaderData<typeof loader>();
  const {articles} = blog;

  return (
    <div className="blog">
      <h1>{blog.title}</h1>
      <div className="blog-grid">
        <PaginatedResourceSection<ArticleItemFragment> connection={articles}>
          {({node: article, index}) => (
            <ArticleItem
              article={article}
              key={article.id}
              loading={index < 2 ? 'eager' : 'lazy'}
            />
          )}
        </PaginatedResourceSection>
      </div>
    </div>
  );
}

function ArticleItem({
  article,
  loading,
}: {
  article: ArticleItemFragment;
  loading?: HTMLImageElement['loading'];
}) {
  const publishedAt = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt!));
  return (
    <div className="blog-article" key={article.id}>
      <Link to={`/blogs/${article.blog.handle}/${article.handle}`}>
        {article.image && (
          <div className="blog-article-image">
            <Image
              alt={article.image.altText || article.title}
              aspectRatio="3/2"
              data={article.image}
              loading={loading}
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        )}
        <h3>{article.title}</h3>
        <small>{publishedAt}</small>
      </Link>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
  query Blog(
    $language: LanguageCode
    $blogHandle: String!
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(language: $language) {
    blog(handle: $blogHandle) {
      title
      handle
      seo {
        title
        description
      }
      articles(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ArticleItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          hasNextPage
          endCursor
          startCursor
        }

      }
    }
  }
  fragment ArticleItem on Article {
    author: authorV2 {
      name
    }
    contentHtml
    handle
    id
    image {
      id
      altText
      url
      width
      height
    }
    publishedAt
    title
    blog {
      handle
    }
  }
` as const;

```

# app/routes/blogs.$blogHandle.$articleHandle.tsx

```tsx
import {useLoaderData} from 'react-router';
import type {Route} from './+types/blogs.$blogHandle.$articleHandle';
import {Image} from '@shopify/hydrogen';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data?.article.title ?? ''} article`}];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request, params}: Route.LoaderArgs) {
  const {blogHandle, articleHandle} = params;

  if (!articleHandle || !blogHandle) {
    throw new Response('Not found', {status: 404});
  }

  const [{blog}] = await Promise.all([
    context.storefront.query(ARTICLE_QUERY, {
      variables: {blogHandle, articleHandle},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!blog?.articleByHandle) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(
    request,
    {
      handle: articleHandle,
      data: blog.articleByHandle,
    },
    {
      handle: blogHandle,
      data: blog,
    },
  );

  const article = blog.articleByHandle;

  return {article};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Article() {
  const {article} = useLoaderData<typeof loader>();
  const {title, image, contentHtml, author} = article;

  const publishedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(article.publishedAt));

  return (
    <div className="article">
      <h1>
        {title}
        <div>
          <time dateTime={article.publishedAt}>{publishedDate}</time> &middot;{' '}
          <address>{author?.name}</address>
        </div>
      </h1>

      {image && <Image data={image} sizes="90vw" loading="eager" />}
      <div
        dangerouslySetInnerHTML={{__html: contentHtml}}
        className="article"
      />
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog#field-blog-articlebyhandle
const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      handle
      articleByHandle(handle: $articleHandle) {
        handle
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
` as const;

```

# app/routes/cart.$lines.tsx

```tsx
import {redirect} from 'react-router';
import type {Route} from './+types/cart.$lines';

/**
 * Automatically creates a new cart based on the URL and redirects straight to checkout.
 * Expected URL structure:
 * \`\`\`js
 * /cart/<variant_id>:<quantity>
 *
 * \`\`\`
 *
 * More than one `<variant_id>:<quantity>` separated by a comma, can be supplied in the URL, for
 * carts with more than one product variant.
 *
 * @example
 * Example path creating a cart with two product variants, different quantities, and a discount code in the querystring:
 * \`\`\`js
 * /cart/41007289663544:1,41007289696312:2?discount=HYDROBOARD
 *
 * \`\`\`
 */
export async function loader({request, context, params}: Route.LoaderArgs) {
  const {cart} = context;
  const {lines} = params;
  if (!lines) return redirect('/cart');
  const linesMap = lines.split(',').map((line) => {
    const lineDetails = line.split(':');
    const variantId = lineDetails[0];
    const quantity = parseInt(lineDetails[1], 10);

    return {
      merchandiseId: `gid://shopify/ProductVariant/${variantId}`,
      quantity,
    };
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);

  const discount = searchParams.get('discount');
  const discountArray = discount ? [discount] : [];

  // create a cart
  const result = await cart.create({
    lines: linesMap,
    discountCodes: discountArray,
  });

  const cartResult = result.cart;

  if (result.errors?.length || !cartResult) {
    throw new Response('Link may be expired. Try checking the URL.', {
      status: 410,
    });
  }

  // Update cart id in cookie
  const headers = cart.setCartId(cartResult.id);

  // redirect to checkout
  if (cartResult.checkoutUrl) {
    return redirect(cartResult.checkoutUrl, {headers});
  } else {
    throw new Error('No checkout URL found');
  }
}

export default function Component() {
  return null;
}

```

# app/routes/cart.tsx

```tsx
import {
  useLoaderData,
  data,
  redirect,
  type HeadersFunction,
} from 'react-router';
import type {Route} from './+types/cart';
import type {CartQueryDataReturn} from '@shopify/hydrogen';
import {CartForm} from '@shopify/hydrogen';
import {CartMain} from '~/components/CartMain';

export const meta: Route.MetaFunction = () => {
  return [{title: `Hydrogen | Cart`}];
};

export const headers: HeadersFunction = ({actionHeaders}) => actionHeaders;

export async function action({request, context}: Route.ActionArgs) {
  const {cart} = context;

  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesUpdate: {
      const formGiftCardCode = inputs.giftCardCode;

      // User inputted gift card code
      const giftCardCodes = (
        formGiftCardCode ? [formGiftCardCode] : []
      ) as string[];

      // Combine gift card codes already applied on cart
      giftCardCodes.push(...inputs.giftCardCodes);

      result = await cart.updateGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesRemove: {
      const appliedGiftCardIds = inputs.giftCardCodes as string[];
      result = await cart.removeGiftCardCodes(appliedGiftCardIds);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const {cart: cartResult, errors, warnings} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    if (redirectTo === 'checkout' && cartResult?.checkoutUrl) {
      return redirect(cartResult.checkoutUrl, {headers});
    }
    status = 303;
    headers.set('Location', redirectTo);
  }

  return data(
    {
      cart: cartResult,
      errors,
      warnings,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

export async function loader({context}: Route.LoaderArgs) {
  const {cart} = context;
  return await cart.get();
}

export default function Cart() {
  const cart = useLoaderData<typeof loader>();

  return (
    <div className="cart">
      <h1>Cart</h1>
      <CartMain layout="page" cart={cart} />
    </div>
  );
}

```

# app/routes/collections._index.tsx

```tsx
import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/collections._index';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 4,
  });

  const [{collections}] = await Promise.all([
    context.storefront.query(COLLECTIONS_QUERY, {
      variables: paginationVariables,
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {collections};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <div className="collections">
      <h1>Collections</h1>
      <PaginatedResourceSection<CollectionFragment>
        connection={collections}
        resourcesClassName="collections-grid"
      >
        {({node: collection, index}) => (
          <CollectionItem
            key={collection.id}
            collection={collection}
            index={index}
          />
        )}
      </PaginatedResourceSection>
    </div>
  );
}

function CollectionItem({
  collection,
  index,
}: {
  collection: CollectionFragment;
  index: number;
}) {
  return (
    <Link
      className="collection-item"
      key={collection.id}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
    >
      {collection?.image && (
        <Image
          alt={collection.image.altText || collection.title}
          aspectRatio="1/1"
          data={collection.image}
          loading={index < 3 ? 'eager' : undefined}
          sizes="(min-width: 45em) 400px, 100vw"
        />
      )}
      <h5>{collection.title}</h5>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }
  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;

```

# app/routes/collections.$handle.tsx

```tsx
import {redirect, useLoaderData} from 'react-router';
import type {Route} from './+types/collections.$handle';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {ProductItem} from '~/components/ProductItem';
import type {ProductItemFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data?.collection.title ?? ''} Collection`}];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  if (!handle) {
    throw redirect('/collections');
  }

  const [{collection}] = await Promise.all([
    storefront.query(COLLECTION_QUERY, {
      variables: {handle, ...paginationVariables},
      // Add other queries here, so that they are loaded in parallel
    }),
  ]);

  if (!collection) {
    throw new Response(`Collection ${handle} not found`, {
      status: 404,
    });
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: collection});

  return {
    collection,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();

  return (
    <div className="collection">
      <h1>{collection.title}</h1>
      <p className="collection-description">{collection.description}</p>
      <PaginatedResourceSection<ProductItemFragment>
        connection={collection.products}
        resourcesClassName="products-grid"
      >
        {({node: product, index}) => (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        )}
      </PaginatedResourceSection>
      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />
    </div>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2022-04/objects/collection
const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor
      ) {
        nodes {
          ...ProductItem
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
  }
` as const;

```

# app/routes/collections.all.tsx

```tsx
import type {Route} from './+types/collections.all';
import {
  useLoaderData,
} from 'react-router';
import {getPaginationVariables, Image, Money} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductItem} from '~/components/ProductItem';
import type {CollectionItemFragment} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = () => {
  return [{title: `Hydrogen | Products`}];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);
  return {products};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Collection() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div className="collection">
      <h1>Products</h1>
      <PaginatedResourceSection<CollectionItemFragment>
        connection={products}
        resourcesClassName="products-grid"
      >
        {({node: product, index}) => (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        )}
      </PaginatedResourceSection>
    </div>
  );
}

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
` as const;

```

# app/routes/discount.$code.tsx

```tsx
import {redirect} from 'react-router';
import type {Route} from './+types/discount.$code';

/**
 * Automatically applies a discount found on the url
 * If a cart exists it's updated with the discount, otherwise a cart is created with the discount already applied
 *
 * @example
 * Example path applying a discount and optional redirecting (defaults to the home page)
 * \`\`\`js
 * /discount/FREESHIPPING?redirect=/products
 *
 * \`\`\`
 */
export async function loader({request, context, params}: Route.LoaderArgs) {
  const {cart} = context;
  const {code} = params;

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  let redirectParam =
    searchParams.get('redirect') || searchParams.get('return_to') || '/';

  if (redirectParam.includes('//')) {
    // Avoid redirecting to external URLs to prevent phishing attacks
    redirectParam = '/';
  }

  searchParams.delete('redirect');
  searchParams.delete('return_to');

  const redirectUrl = `${redirectParam}?${searchParams}`;

  if (!code) {
    return redirect(redirectUrl);
  }

  const result = await cart.updateDiscountCodes([code]);
  const headers = cart.setCartId(result.cart.id);

  // Using set-cookie on a 303 redirect will not work if the domain origin have port number (:3000)
  // If there is no cart id and a new cart id is created in the progress, it will not be set in the cookie
  // on localhost:3000
  return redirect(redirectUrl, {
    status: 303,
    headers,
  });
}

```

# app/routes/pages.$handle.tsx

```tsx
import {
  useLoaderData,
} from 'react-router';
import type {Route} from './+types/pages.$handle';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data?.page.title ?? ''}`}];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  request,
  params,
}: Route.LoaderArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const [{page}] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {
      variables: {
        handle: params.handle,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle: params.handle, data: page});

  return {
    page,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}

export default function Page() {
  const {page} = useLoaderData<typeof loader>();

  return (
    <div className="page">
      <header>
        <h1>{page.title}</h1>
      </header>
      <main dangerouslySetInnerHTML={{__html: page.body}} />
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
    }
  }
` as const;

```

# app/routes/policies._index.tsx

```tsx
import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/policies._index';
import type {PoliciesQuery, PolicyItemFragment} from 'storefrontapi.generated';

export async function loader({context}: Route.LoaderArgs) {
  const data: PoliciesQuery = await context.storefront.query(POLICIES_QUERY);
  
  const shopPolicies = data.shop;
  const policies: PolicyItemFragment[] = [
    shopPolicies?.privacyPolicy,
    shopPolicies?.shippingPolicy,
    shopPolicies?.termsOfService,
    shopPolicies?.refundPolicy,
    shopPolicies?.subscriptionPolicy,
  ].filter((policy): policy is PolicyItemFragment => policy != null);

  if (!policies.length) {
    throw new Response('No policies found', {status: 404});
  }

  return {policies};
}

export default function Policies() {
  const {policies} = useLoaderData<typeof loader>();

  return (
    <div className="policies">
      <h1>Policies</h1>
      <div>
        {policies.map((policy) => (
          <fieldset key={policy.id}>
            <Link to={`/policies/${policy.handle}`}>{policy.title}</Link>
          </fieldset>
        ))}
      </div>
    </div>
  );
}

const POLICIES_QUERY = `#graphql
  fragment PolicyItem on ShopPolicy {
    id
    title
    handle
  }
  query Policies ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    shop {
      privacyPolicy {
        ...PolicyItem
      }
      shippingPolicy {
        ...PolicyItem
      }
      termsOfService {
        ...PolicyItem
      }
      refundPolicy {
        ...PolicyItem
      }
      subscriptionPolicy {
        id
        title
        handle
      }
    }
  }
` as const;

```

# app/routes/policies.$handle.tsx

```tsx
import {
  Link,
  useLoaderData,
} from 'react-router';
import type {Route} from './+types/policies.$handle';
import {type Shop} from '@shopify/hydrogen/storefront-api-types';

type SelectedPolicies = keyof Pick<
  Shop,
  'privacyPolicy' | 'shippingPolicy' | 'termsOfService' | 'refundPolicy'
>;

export const meta: Route.MetaFunction = ({data}) => {
  return [{title: `Hydrogen | ${data?.policy.title ?? ''}`}];
};

export async function loader({params, context}: Route.LoaderArgs) {
  if (!params.handle) {
    throw new Response('No handle was passed in', {status: 404});
  }

  const policyName = params.handle.replace(
    /-([a-z])/g,
    (_: unknown, m1: string) => m1.toUpperCase(),
  ) as SelectedPolicies;

  const data = await context.storefront.query(POLICY_CONTENT_QUERY, {
    variables: {
      privacyPolicy: false,
      shippingPolicy: false,
      termsOfService: false,
      refundPolicy: false,
      [policyName]: true,
      language: context.storefront.i18n?.language,
    },
  });

  const policy = data.shop?.[policyName];

  if (!policy) {
    throw new Response('Could not find the policy', {status: 404});
  }

  return {policy};
}

export default function Policy() {
  const {policy} = useLoaderData<typeof loader>();

  return (
    <div className="policy">
      <br />
      <br />
      <div>
        <Link to="/policies">← Back to Policies</Link>
      </div>
      <br />
      <h1>{policy.title}</h1>
      <div dangerouslySetInnerHTML={{__html: policy.body}} />
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/Shop
const POLICY_CONTENT_QUERY = `#graphql
  fragment Policy on ShopPolicy {
    body
    handle
    id
    title
    url
  }
  query Policy(
    $country: CountryCode
    $language: LanguageCode
    $privacyPolicy: Boolean!
    $refundPolicy: Boolean!
    $shippingPolicy: Boolean!
    $termsOfService: Boolean!
  ) @inContext(language: $language, country: $country) {
    shop {
      privacyPolicy @include(if: $privacyPolicy) {
        ...Policy
      }
      shippingPolicy @include(if: $shippingPolicy) {
        ...Policy
      }
      termsOfService @include(if: $termsOfService) {
        ...Policy
      }
      refundPolicy @include(if: $refundPolicy) {
        ...Policy
      }
    }
  }
` as const;

```

# app/routes/products.$handle.tsx

```tsx
import {
  redirect,
  useLoaderData,
} from 'react-router';
import type {Route} from './+types/products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import {ProductImage} from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

export const meta: Route.MetaFunction = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({
  context,
  params,
  request,
}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront.query(PRODUCT_QUERY, {
      variables: {handle, selectedOptions: getSelectedProductOptions(request)},
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  // The API handle might be localized, so redirect to the localized handle
  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {
    product,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context, params}: Route.LoaderArgs) {
  // Put any API calls that is not critical to be available on first page render
  // For example: product reviews, product recommendations, social feeds.

  return {};
}

export default function Product() {
  const {product} = useLoaderData<typeof loader>();

  // Optimistically selects a variant with given available variant information
  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  // Sets the search param to the selected variant without navigation
  // only when no search params are set in the url
  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  // Get the product options array
  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {title, descriptionHtml} = product;

  return (
    <div className="product">
      <ProductImage image={selectedVariant?.image} />
      <div className="product-main">
        <h1>{title}</h1>
        <ProductPrice
          price={selectedVariant?.price}
          compareAtPrice={selectedVariant?.compareAtPrice}
        />
        <br />
        <ProductForm
          productOptions={productOptions}
          selectedVariant={selectedVariant}
        />
        <br />
        <br />
        <p>
          <strong>Description</strong>
        </p>
        <br />
        <div dangerouslySetInnerHTML={{__html: descriptionHtml}} />
        <br />
      </div>
      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
      ...ProductVariant
    }
    adjacentVariants (selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

```

# app/routes/search.tsx

```tsx
import {
  useLoaderData,
} from 'react-router';
import type {Route} from './+types/search';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {SearchForm} from '~/components/SearchForm';
import {SearchResults} from '~/components/SearchResults';
import {
  type RegularSearchReturn,
  type PredictiveSearchReturn,
  getEmptyPredictiveSearchResult,
} from '~/lib/search';
import type {RegularSearchQuery, PredictiveSearchQuery} from 'storefrontapi.generated';

export const meta: Route.MetaFunction = () => {
  return [{title: `Hydrogen | Search`}];
};

export async function loader({request, context}: Route.LoaderArgs) {
  const url = new URL(request.url);
  const isPredictive = url.searchParams.has('predictive');
  const searchPromise: Promise<PredictiveSearchReturn | RegularSearchReturn> =
    isPredictive
      ? predictiveSearch({request, context})
      : regularSearch({request, context});

  searchPromise.catch((error: Error) => {
    console.error(error);
    return {term: '', result: null, error: error.message};
  });

  return await searchPromise;
}

/**
 * Renders the /search route
 */
export default function SearchPage() {
  const {type, term, result, error} = useLoaderData<typeof loader>();
  if (type === 'predictive') return null;

  return (
    <div className="search">
      <h1>Search</h1>
      <SearchForm>
        {({inputRef}) => (
          <>
            <input
              defaultValue={term}
              name="q"
              placeholder="Search…"
              ref={inputRef}
              type="search"
            />
            &nbsp;
            <button type="submit">Search</button>
          </>
        )}
      </SearchForm>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {!term || !result?.total ? (
        <SearchResults.Empty />
      ) : (
        <SearchResults result={result} term={term}>
          {({articles, pages, products, term}) => (
            <div>
              <SearchResults.Products products={products} term={term} />
              <SearchResults.Pages pages={pages} term={term} />
              <SearchResults.Articles articles={articles} term={term} />
            </div>
          )}
        </SearchResults>
      )}
      <Analytics.SearchView data={{searchTerm: term, searchResults: result}} />
    </div>
  );
}

/**
 * Regular search query and fragments
 * (adjust as needed)
 */
const SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment SearchProduct on Product {
    __typename
    handle
    id
    publishedAt
    title
    trackingParameters
    vendor
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
      selectedOptions {
        name
        value
      }
      product {
        handle
        title
      }
    }
  }
` as const;

const SEARCH_PAGE_FRAGMENT = `#graphql
  fragment SearchPage on Page {
     __typename
     handle
    id
    title
    trackingParameters
  }
` as const;

const SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment SearchArticle on Article {
    __typename
    handle
    id
    title
    trackingParameters
  }
` as const;

const PAGE_INFO_FRAGMENT = `#graphql
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/search
export const SEARCH_QUERY = `#graphql
  query RegularSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $term: String!
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    articles: search(
      query: $term,
      types: [ARTICLE],
      first: $first,
    ) {
      nodes {
        ...on Article {
          ...SearchArticle
        }
      }
    }
    pages: search(
      query: $term,
      types: [PAGE],
      first: $first,
    ) {
      nodes {
        ...on Page {
          ...SearchPage
        }
      }
    }
    products: search(
      after: $endCursor,
      before: $startCursor,
      first: $first,
      last: $last,
      query: $term,
      sortKey: RELEVANCE,
      types: [PRODUCT],
      unavailableProducts: HIDE,
    ) {
      nodes {
        ...on Product {
          ...SearchProduct
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${SEARCH_PRODUCT_FRAGMENT}
  ${SEARCH_PAGE_FRAGMENT}
  ${SEARCH_ARTICLE_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;

/**
 * Regular search fetcher
 */
async function regularSearch({
  request,
  context,
}: Pick<
  Route.LoaderArgs,
  'request' | 'context'
>): Promise<RegularSearchReturn> {
  const {storefront} = context;
  const url = new URL(request.url);
  const variables = getPaginationVariables(request, {pageBy: 8});
  const term = String(url.searchParams.get('q') || '');

  // Search articles, pages, and products for the `q` term
  const {errors, ...items}: {errors?: Array<{message: string}>} & RegularSearchQuery = await storefront.query(SEARCH_QUERY, {
    variables: {...variables, term},
  });

  if (!items) {
    throw new Error('No search data returned from Shopify API');
  }

  const total = Object.values(items).reduce(
    (acc: number, {nodes}: {nodes: Array<unknown>}) => acc + nodes.length,
    0,
  );

  const error = errors
    ? errors.map(({message}: {message: string}) => message).join(', ')
    : undefined;

  return {type: 'regular', term, error, result: {total, items}};
}

/**
 * Predictive search query and fragments
 * (adjust as needed)
 */
const PREDICTIVE_SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment PredictiveArticle on Article {
    __typename
    id
    title
    handle
    blog {
      handle
    }
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_COLLECTION_FRAGMENT = `#graphql
  fragment PredictiveCollection on Collection {
    __typename
    id
    title
    handle
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_PAGE_FRAGMENT = `#graphql
  fragment PredictivePage on Page {
    __typename
    id
    title
    handle
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment PredictiveProduct on Product {
    __typename
    id
    title
    handle
    trackingParameters
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
    }
  }
` as const;

const PREDICTIVE_SEARCH_QUERY_FRAGMENT = `#graphql
  fragment PredictiveQuery on SearchQuerySuggestion {
    __typename
    text
    styledText
    trackingParameters
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/predictiveSearch
const PREDICTIVE_SEARCH_QUERY = `#graphql
  query PredictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $limit: Int!
    $limitScope: PredictiveSearchLimitScope!
    $term: String!
    $types: [PredictiveSearchType!]
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      limit: $limit,
      limitScope: $limitScope,
      query: $term,
      types: $types,
    ) {
      articles {
        ...PredictiveArticle
      }
      collections {
        ...PredictiveCollection
      }
      pages {
        ...PredictivePage
      }
      products {
        ...PredictiveProduct
      }
      queries {
        ...PredictiveQuery
      }
    }
  }
  ${PREDICTIVE_SEARCH_ARTICLE_FRAGMENT}
  ${PREDICTIVE_SEARCH_COLLECTION_FRAGMENT}
  ${PREDICTIVE_SEARCH_PAGE_FRAGMENT}
  ${PREDICTIVE_SEARCH_PRODUCT_FRAGMENT}
  ${PREDICTIVE_SEARCH_QUERY_FRAGMENT}
` as const;

/**
 * Predictive search fetcher
 */
async function predictiveSearch({
  request,
  context,
}: Pick<
  Route.ActionArgs,
  'request' | 'context'
>): Promise<PredictiveSearchReturn> {
  const {storefront} = context;
  const url = new URL(request.url);
  const term = String(url.searchParams.get('q') || '').trim();
  const limit = Number(url.searchParams.get('limit') || 10);
  const type = 'predictive';

  if (!term) return {type, term, result: getEmptyPredictiveSearchResult()};

  // Predictively search articles, collections, pages, products, and queries (suggestions)
  const {predictiveSearch: items, errors}: PredictiveSearchQuery & {errors?: Array<{message: string}>} = await storefront.query(
    PREDICTIVE_SEARCH_QUERY,
    {
      variables: {
        // customize search options as needed
        limit,
        limitScope: 'EACH',
        term,
      },
    },
  );

  if (errors) {
    throw new Error(
      `Shopify API errors: ${errors.map(({message}: {message: string}) => message).join(', ')}`,
    );
  }

  if (!items) {
    throw new Error('No predictive search data returned from Shopify API');
  }

  const total = Object.values(items).reduce(
    (acc: number, item: Array<unknown>) => acc + item.length,
    0,
  );

  return {type, term, result: {items, total}};
}

```

# app/routes/sitemap.$type.$page[.xml].tsx

```tsx
import type {Route} from './+types/sitemap.$type.$page[.xml]';
import {getSitemap} from '@shopify/hydrogen';

export async function loader({
  request,
  params,
  context: {storefront},
}: Route.LoaderArgs) {
  const response = await getSitemap({
    storefront,
    request,
    params,
    locales: ['EN-US', 'EN-CA', 'FR-CA'],
    getLink: ({type, baseUrl, handle, locale}) => {
      if (!locale) return `${baseUrl}/${type}/${handle}`;
      return `${baseUrl}/${locale}/${type}/${handle}`;
    },
  });

  response.headers.set('Cache-Control', `max-age=${60 * 60 * 24}`);

  return response;
}

```

# app/styles/app.css

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=GFS+Didot:ital,wght@1,400;1,700&display=swap");

:root {
  --aside-width: 400px;
  --cart-aside-summary-height-with-discount: 300px;
  --cart-aside-summary-height: 250px;
  --grid-item-width: 355px;
  --header-height: 72px;
  --color-dark: #000;
  --color-light: #fff;
  --font-body: "Inter", system-ui, sans-serif;
  --font-display: "GFS Didot", "Times New Roman", serif;
}

body {
  font-family: var(--font-body);
  background: var(--color-light);
  color: var(--color-dark);
}

h1, h2, h3, h4 {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 700;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

img {
  border-radius: 4px;
}

/*
* --------------------------------------------------
* Non anchor links
* --------------------------------------------------
*/
.link:hover {
  text-decoration: underline;
  cursor: pointer;
}

/*
* --------------------------------------------------
* components/Aside
* --------------------------------------------------
*/
@media (max-width: 45em) {
  html:has(.overlay.expanded) {
    overflow: hidden;
  }
}

aside {
  background: var(--color-light);
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.3);
  height: 100vh;
  width: var(--aside-width);
  max-width: 90vw;
  position: fixed;
  right: 0;
  top: 0;
  transform: translateX(100%);
  transition: transform 200ms ease-in-out;
}

aside header {
  align-items: center;
  border-bottom: 1px solid var(--color-dark);
  display: flex;
  height: var(--header-height);
  justify-content: space-between;
  padding: 0 20px;
}

aside header h3 {
  margin: 0;
}

aside header .close {
  font-weight: bold;
  opacity: 0.8;
  text-decoration: none;
  transition: all 200ms;
  width: 20px;
}

aside header .close:hover {
  opacity: 1;
}

aside header h2 {
  margin-bottom: 0.6rem;
  margin-top: 0;
}

aside main {
  margin: 1rem;
}

aside p {
  margin: 0 0 0.25rem;
}

aside p:last-child {
  margin: 0;
}

aside li {
  margin-bottom: 0.125rem;
}

.overlay {
  background: rgba(0, 0, 0, 0.2);
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  display: flex;
  justify-content: flex-end;
  transition: opacity 400ms ease-in-out;
  z-index: 9999;
}

.overlay .close-outside {
  background: transparent;
  border: none;
  color: transparent;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: calc(100% - min(var(--aside-width), 90vw));
}

.overlay .light {
  background: rgba(255, 255, 255, 0.5);
}

.overlay .cancel {
  cursor: default;
  height: 100%;
  position: absolute;
  width: 100%;
}

.overlay.expanded {
  opacity: 1;
  pointer-events: auto;
  visibility: visible;
  display: flex;
}
/* reveal aside */
.overlay.expanded aside {
  transform: translateX(0);
}

button.reset {
  border: 0;
  background: inherit;
  font-size: inherit;
}

button.reset > * {
  margin: 0;
}

button.reset:not(:has(> *)) {
  height: 1.5rem;
  line-height: 1.5rem;
}

button.reset:hover:not(:has(> *)) {
  text-decoration: underline;
  cursor: pointer;
}

/*
* --------------------------------------------------
* components/Header
* --------------------------------------------------
*/
.header {
  align-items: center;
  background: #fff;
  display: flex;
  height: var(--header-height);
  padding: 0 1.5rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.header-menu-mobile-toggle {
  @media (min-width: 48em) {
    display: none;
  }
}

.header-menu-mobile {
  display: flex;
  flex-direction: column;
  grid-gap: 1rem;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.brand img {
  height: 22px;
  width: auto;
  border-radius: 0;
}

.header-menu-desktop a {
  font-size: 0.92rem;
  text-decoration: none;
  color: inherit;
  font-family: var(--font-display);
  font-style: italic;
}

.header-menu-desktop a:hover {
  text-decoration: line-through;
}

.header-menu-desktop {
  display: none;
  grid-gap: 1rem;
  @media (min-width: 45em) {
    display: flex;
    grid-gap: 1rem;
    margin-left: 3rem;
  }
}

.header-menu-item {
  cursor: pointer;
}

/*
* --------------------------------------------------
* Single product page
* --------------------------------------------------
*/
.product-page {
  min-height: 100vh;
  background: var(--color-light);
  color: var(--color-dark);
  display: grid;
  place-items: center;
  padding: 0 1.25rem;
}

.product-content {
  width: min(1200px, 90vw);
  display: grid;
  gap: 2rem;
  grid-template-columns: 1fr;
}

.product-media {
  display: grid;
  gap: 1rem;
}

.hero-image {
  width: 100%;
  border-radius: 1.25rem;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 24px 70px -36px rgba(0, 0, 0, 0.35);
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.thumb-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
}

.thumb {
  aspect-ratio: 1 / 1;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.product-copy {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-copy h1 {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 700;
  font-size: clamp(2rem, 3.6vw, 3rem);
  line-height: 1.1;
  margin: 0;
}

.description {
  color: #303030;
  line-height: 1.6;
  display: grid;
  gap: 0.6rem;
}

.eyebrow {
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #6e6e6e;
  margin: 0;
}

.meta {
  margin: 0;
  color: #6e6e6e;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.8rem;
}

.muted {
  color: #555;
}

.purchase {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.price {
  font-size: 1.25rem;
  font-weight: 600;
}

.primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.95rem 1.4rem;
  border-radius: 999px;
  border: 1px solid #000;
  color: #fff;
  background: #000;
  text-decoration: none;
  transition: transform 120ms ease, background 160ms ease;
}

.primary:hover {
  transform: translateY(-1px);
  background: #111;
}

.primary:focus-visible {
  outline: 2px solid #000;
  outline-offset: 2px;
}

.product-content button[type='submit']:not(.order-link) {
  padding: 0.95rem 1.4rem;
  border-radius: 999px;
  border: 1px solid #000;
  color: #fff;
  background: #000;
  cursor: pointer;
  font-weight: 600;
  transition: transform 120ms ease, background 160ms ease;
}

.product-content button[type='submit']:not(.order-link):hover:not(:disabled) {
  transform: translateY(-1px);
  background: #111;
}

.product-content button[type='submit']:not(.order-link):disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.order-link {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 700;
  font-size: 1.25rem;
  color: #000;
  background: transparent;
  border: none;
  padding: 0;
  margin: 0;
  line-height: 1.1;
  border-radius: 0;
  box-shadow: none;
  appearance: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-left: 0.35rem;
  text-decoration: none;
}

.order-link:hover {
  text-decoration: underline;
}

.purchase-row {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

.purchase-row .primary {
  margin-left: 1.5rem;
}

.qty {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  border: 1px solid #e5e5e5;
  border-radius: 999px;
  background: #f8f8f8;
}

.qty button {
  border: none;
  background: transparent;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0 0.35rem;
}

.qty span {
  min-width: 1.5rem;
  text-align: center;
  font-weight: 600;
}

.product-carousel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.carousel-frame {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 1.25rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 24px 70px -36px rgba(0, 0, 0, 0.35);
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  color: #000;
  width: 42px;
  height: 42px;
  cursor: pointer;
  font-size: 20px;
}

.carousel-control.left {
  left: 12px;
}

.carousel-control.right {
  right: 12px;
}

.carousel-dots {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  display: inline-flex;
  gap: 0.4rem;
  align-items: center;
}

.carousel-dots .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1px solid #fff;
  background: rgba(255, 255, 255, 0.15);
  cursor: pointer;
  padding: 0;
}

.carousel-dots .dot.active {
  background: #fff;
}

@media (min-width: 900px) {
  .product-content {
    grid-template-columns: 1.1fr 0.9fr;
    align-items: center;
    gap: 3rem;
  }
}

.header-ctas {
  align-items: center;
  display: flex;
  grid-gap: 1rem;
  margin-left: auto;
}

.header-ctas > * {
  min-width: fit-content;
}

.header-ctas a,
.header-ctas button {
  font-size: 1rem;
}

.header-cart {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  pointer-events: auto;
  background: transparent;
  border: none;
}

.cart-count {
  margin-left: 0.35rem;
  font-weight: 600;
}

/*
* --------------------------------------------------
* components/Footer
* --------------------------------------------------
*/
.footer {
  background: #fff;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  margin-top: auto;
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.footer-address {
  font-size: 0.85rem;
  color: #555;
  font-style: normal;
  text-align: left;
}

.social-list {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.social-link {
  color: #000;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.social-icon {
  width: 18px;
  height: 18px;
  display: block;
}

/*
* --------------------------------------------------
* components/Cart
* --------------------------------------------------
*/
.cart-main {
  height: 100%;
  max-height: calc(100vh - var(--cart-aside-summary-height));
  overflow-y: auto;
  width: auto;
}

.cart-line {
  display: flex;
  padding: 1rem 0;
  gap: 0.75rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.cart-line img {
  height: 90px;
  width: 90px;
  display: block;
  border-radius: 12px;
}

.cart-summary-page {
  position: relative;
}

.cart-summary-aside {
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  bottom: 0;
  padding-top: 0.75rem;
  position: absolute;
  width: calc(var(--aside-width) - 40px);
}

.cart-line-quantity {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.1rem 0.2rem 0.1rem 0;
  border-radius: 999px;
}

.cart-line-quantity button {
  border: none;
  background: white;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0.25rem 0.45rem;
  border-radius: 999px;
}

.cart-qty {
  min-width: 1.5rem;
  text-align: center;
  font-weight: 600;
}

.cart-line-body {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.cart-line-title {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 700;
  font-size: 1.1rem;
  margin: 0;
}

.cart-line-options {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  color: #666;
  font-size: 0.85rem;
}

.cart-line-controls {
  margin-top: 0.15rem;
}

.cart-totals {
  padding: 1rem 0 0.5rem;
  display: grid;
  gap: 0.25rem;
}

.cart-total-row {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 1.05rem;
}

.cart-checkout {
  padding: 0.5rem 0 1rem;
}

.cart-checkout-link {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 700;
  font-size: 1.05rem;
  color: #000;
  text-decoration: none;
}

.cart-checkout-link:hover {
  text-decoration: underline;
}
/*
* --------------------------------------------------
* components/Search
* --------------------------------------------------
*/
.predictive-search {
  height: calc(100vh - var(--header-height) - 40px);
  overflow-y: auto;
}

.predictive-search-form {
  background: var(--color-light);
  position: sticky;
  top: 0;
}

.predictive-search-result {
  margin-bottom: 2rem;
}

.predictive-search-result h5 {
  text-transform: uppercase;
}

.predictive-search-result-item {
  margin-bottom: 0.5rem;
}

.predictive-search-result-item a {
  align-items: center;
  display: flex;
}

.predictive-search-result-item a img {
  margin-right: 0.75rem;
  height: 100%;
}

.search-result {
  margin-bottom: 1.5rem;
}

.search-results-item {
  margin-bottom: 0.5rem;
}

.search-results-item a {
  display: flex;
  flex: row;
  align-items: center;
  gap: 1rem;
}

/*
* --------------------------------------------------
* routes/__index
* --------------------------------------------------
*/
.featured-collection {
  display: block;
  margin-bottom: 2rem;
  position: relative;
}

.featured-collection-image {
  aspect-ratio: 1 / 1;
  @media (min-width: 45em) {
    aspect-ratio: 16 / 9;
  }
}

.featured-collection img {
  height: auto;
  max-height: 100%;
  object-fit: cover;
}

.recommended-products-grid {
  display: grid;
  grid-gap: 1.5rem;
  grid-template-columns: repeat(2, 1fr);
  @media (min-width: 45em) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.recommended-product img {
  height: auto;
}

/*
* --------------------------------------------------
* routes/collections._index.tsx
* --------------------------------------------------
*/
.collections-grid {
  display: grid;
  grid-gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(var(--grid-item-width), 1fr));
  margin-bottom: 2rem;
}

.collection-item img {
  height: auto;
}

/*
* --------------------------------------------------
* routes/collections.$handle.tsx
* --------------------------------------------------
*/
.collection-description {
  margin-bottom: 1rem;
  max-width: 95%;
  @media (min-width: 45em) {
    max-width: 600px;
  }
}

.products-grid {
  display: grid;
  grid-gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(var(--grid-item-width), 1fr));
  margin-bottom: 2rem;
}

.product-item img {
  height: auto;
  width: 100%;
}

/*
* --------------------------------------------------
* routes/products.$handle.tsx
* --------------------------------------------------
*/
.product {
  display: grid;
  @media (min-width: 45em) {
    grid-template-columns: 1fr 1fr;
    grid-gap: 4rem;
  }
}

.product h1 {
  margin-top: 0;
}

.product-image img {
  height: auto;
  width: 100%;
}

.product-main {
  align-self: start;
  position: sticky;
  top: 6rem;
}

.product-price-on-sale {
  display: flex;
  grid-gap: 0.5rem;
}

.product-price-on-sale s {
  opacity: 0.5;
}

.product-options-grid {
  display: flex;
  flex-wrap: wrap;
  grid-gap: 0.75rem;
}

.product-options-item,
.product-options-item:disabled {
  padding: 0.25rem 0.5rem;
  background-color: transparent;
  font-size: 1rem;
  font-family: inherit;
}

.product-option-label-swatch {
  width: 1.25rem;
  height: 1.25rem;
  margin: 0.25rem 0;
}

.product-option-label-swatch img {
  width: 100%;
}

/*
* --------------------------------------------------
* routes/blog._index.tsx
* --------------------------------------------------
*/
.blog-grid {
  display: grid;
  grid-gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(var(--grid-item-width), 1fr));
  margin-bottom: 2rem;
}

.blog-article-image {
  aspect-ratio: 3/2;
  display: block;
}

.blog-article-image img {
  height: 100%;
}

/*
* --------------------------------------------------
* routes/blog.$articlehandle.tsx
* --------------------------------------------------
*/
.article img {
  height: auto;
  width: 100%;
}

/*
* --------------------------------------------------
* routes/account
* --------------------------------------------------
*/

.account-logout {
  display: inline-block;
}

/*
* --------------------------------------------------
* Order Search Form - Minimal & Responsive
* --------------------------------------------------
*/
.order-search-form {
  margin-bottom: 1.5rem;
}

.order-search-fieldset {
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  padding: 1rem;
}

.order-search-legend {
  font-weight: 600;
  padding: 0 0.5rem;
}

.order-search-active {
  font-weight: normal;
  opacity: 0.7;
  margin-left: 0.5rem;
}

.order-search-inputs {
  display: grid;
  gap: 1rem;
  margin: 0.25rem 0 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .order-search-inputs {
    grid-template-columns: 1fr 1fr;
  }
}

.order-search-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 1rem;
}

.order-search-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

```

# app/styles/reset.css

```css
body {
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Open Sans',
    'Helvetica Neue',
    sans-serif;
  margin: 0;
  padding: 0;
}

h1,
h2,
p {
  margin: 0;
  padding: 0;
}

h1 {
  font-size: 1.6rem;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 2rem;
  margin-top: 2rem;
}

h2 {
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 1rem;
}

h4 {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

h5 {
  margin-bottom: 1rem;
  margin-top: 0.5rem;
}

p {
  font-size: 1rem;
  line-height: 1.4;
}

a {
  color: #000;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
  cursor: pointer;
}

hr {
  border-bottom: none;
  border-top: 1px solid #000;
  margin: 0;
}

pre {
  white-space: pre-wrap;
}

body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

body > main {
  margin: 0 1rem 1rem 1rem;
}

section {
  padding: 1rem 0;
  @media (min-width: 768px) {
    padding: 2rem 0;
  }
}

fieldset {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.5rem;
  padding: 1rem;
}

form {
  max-width: 100%;
  @media (min-width: 768px) {
    max-width: 400px;
  }
}

input {
  border-radius: 4px;
  border: 1px solid #000;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  margin-top: 0.25rem;
  padding: 0.5rem;
}

legend {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  margin-bottom: 0.5rem;
}

dl {
  margin: 0.5rem 0;
}

code {
  background: #ddd;
  border-radius: 4px;
  font-family: monospace;
  padding: 0.25rem;
}

```

# ARCHIVE.md

```md
## Archive Notice

- The original Next.js site has been moved to `archive-nextjs/`. Do not deploy it while the new Hydrogen storefront is in development.
- The Hydrogen storefront is now at the repository root. Work here for V2.
- No deployments have been triggered by these changes; everything is local only.

```

# CHANGELOG.md

```md
# skeleton

## 2025.7.0

### Major Changes

- Update Storefront API and Customer Account API to version 2025-07 ([#3082](https://github.com/Shopify/hydrogen/pull/3082)) by [@juanpprieto](https://github.com/juanpprieto)

  This update includes:
  - Updated API version constants to 2025-07
  - Regenerated GraphQL types for both Storefront and Customer Account APIs
  - Updated all hardcoded API version references in documentation and tests
  - Regenerated skeleton template types
  - Updated skeleton's @shopify/cli dependency to ~3.83.3

  Breaking changes may occur due to API schema changes between versions.

### Patch Changes

- Fix defer/streaming in development & preview ([#3039](https://github.com/Shopify/hydrogen/pull/3039)) by [@kdaviduik](https://github.com/kdaviduik)

- Upgrade Miniflare from v2 to v4 in mini-oxygen package. ([#3039](https://github.com/Shopify/hydrogen/pull/3039)) by [@kdaviduik](https://github.com/kdaviduik)
  - Internal MiniOxygen API has been refactored to work with Miniflare v4's new architecture.
  - Simplified MiniOxygen class - no longer extends MiniflareCore.
  - Updated global fetch handling to use Miniflare v4's `outboundService` API.
  - Fixed test infrastructure to use project-relative temporary directories.
  - Added support for Oxygen compatibility parameters (`compatibilityDate`, `compatibilityFlags`).
  - Removed dependency on multiple `@miniflare/*` packages in favor of the consolidated `miniflare` package.

- Update and pin react-router to 7.9.2 for 2025.7.0 ([#3138](https://github.com/Shopify/hydrogen/pull/3138)) by [@juanpprieto](https://github.com/juanpprieto)

- Add TypeScript ESLint rules for promise handling to prevent Cloudflare Workers errors ([#3146](https://github.com/Shopify/hydrogen/pull/3146)) by [@kdaviduik](https://github.com/kdaviduik)

  Added `@typescript-eslint/no-floating-promises` and `@typescript-eslint/no-misused-promises` rules to help prevent "The script will never generate a response" errors when deploying to Oxygen/Cloudflare Workers. These rules ensure promises are properly handled with await, return, or void operators, as recommended by [Cloudflare's error documentation](https://developers.cloudflare.com/workers/observability/errors/#the-script-will-never-generate-a-response-errors).

- Fixed React Context error that occurred during client-side hydration when using Content Security Policy (CSP) with nonces. The error "Cannot read properties of null (reading 'useContext')" was caused by the `NonceProvider` being present during server-side rendering but missing during client hydration. ([#3082](https://github.com/Shopify/hydrogen/pull/3082)) by [@juanpprieto](https://github.com/juanpprieto)

  #### Changes for Existing Projects

  If you have customized your `app/entry.client.tsx` file, you may need to wrap your app with the `NonceProvider` during hydration to avoid this error:

  \`\`\`diff
  // app/entry.client.tsx
  import {HydratedRouter} from 'react-router/dom';
  import {startTransition, StrictMode} from 'react';
  import {hydrateRoot} from 'react-dom/client';
  + import {NonceProvider} from '@shopify/hydrogen';

  if (!window.location.origin.includes('webcache.googleusercontent.com')) {
    startTransition(() => {
  +   // Extract nonce from existing script tags
  +   const existingNonce = document
  +     .querySelector<HTMLScriptElement>('script[nonce]')
  +     ?.nonce;
  +
      hydrateRoot(
        document,
        <StrictMode>
  -       <HydratedRouter />
  +       <NonceProvider value={existingNonce}>
  +         <HydratedRouter />
  +       </NonceProvider>
        </StrictMode>,
      );
    });
  }
  \`\`\`

  This ensures the React Context tree matches between server and client rendering, preventing hydration mismatches.

  #### Package Changes
  - **@shopify/hydrogen**: Exported `NonceProvider` from the main package to allow client-side usage and simplified Vite configuration to improve React Context stability during development
  - **skeleton**: Updated the template's `entry.client.tsx` to include the `NonceProvider` wrapper during hydration

- Add `fulfillmentStatus` to CAAPI order query and route ([#3039](https://github.com/Shopify/hydrogen/pull/3039)) by [@kdaviduik](https://github.com/kdaviduik)

- Add GraphQL @defer directive support to storefront client ([#3039](https://github.com/Shopify/hydrogen/pull/3039)) by [@kdaviduik](https://github.com/kdaviduik)

- Unpin react-router and react-router-dom versions in the skeleton template ([#3039](https://github.com/Shopify/hydrogen/pull/3039)) by [@kdaviduik](https://github.com/kdaviduik)

- Add `@inContext` language support to Customer Account API mutations ([#3039](https://github.com/Shopify/hydrogen/pull/3039)) by [@kdaviduik](https://github.com/kdaviduik)

- Add order filtering support to the skeleton /account/orders route for Customer Account API flow ([#3125](https://github.com/Shopify/hydrogen/pull/3125)) by [@juanpprieto](https://github.com/juanpprieto)

- Updated dependencies [[`6d067665562223ce2865f1c14be54b0b50258bd4`](https://github.com/Shopify/hydrogen/commit/6d067665562223ce2865f1c14be54b0b50258bd4), [`d57782a1ae3fa0017836d6010fb6ac5ab5d25965`](https://github.com/Shopify/hydrogen/commit/d57782a1ae3fa0017836d6010fb6ac5ab5d25965), [`48cbd450699a29a5667bee7174f3856430508ecc`](https://github.com/Shopify/hydrogen/commit/48cbd450699a29a5667bee7174f3856430508ecc), [`6d067665562223ce2865f1c14be54b0b50258bd4`](https://github.com/Shopify/hydrogen/commit/6d067665562223ce2865f1c14be54b0b50258bd4), [`0b4f01c9aa0e09332140a6a4e3114949873fb0f9`](https://github.com/Shopify/hydrogen/commit/0b4f01c9aa0e09332140a6a4e3114949873fb0f9), [`0d165ff280692411712176427bcd7e0df43b56fe`](https://github.com/Shopify/hydrogen/commit/0d165ff280692411712176427bcd7e0df43b56fe), [`ae7bedc89c1968b4a035f421b5ee6908f6376b1b`](https://github.com/Shopify/hydrogen/commit/ae7bedc89c1968b4a035f421b5ee6908f6376b1b), [`ae7bedc89c1968b4a035f421b5ee6908f6376b1b`](https://github.com/Shopify/hydrogen/commit/ae7bedc89c1968b4a035f421b5ee6908f6376b1b), [`75623a5bfdd8d6f0eab0d3547860341c20d9076c`](https://github.com/Shopify/hydrogen/commit/75623a5bfdd8d6f0eab0d3547860341c20d9076c), [`6681f92e84d42b5a6aca153fb49e31dcd8af84f6`](https://github.com/Shopify/hydrogen/commit/6681f92e84d42b5a6aca153fb49e31dcd8af84f6), [`4daf37ea291334b23bd543fdad5673ab7c9a6133`](https://github.com/Shopify/hydrogen/commit/4daf37ea291334b23bd543fdad5673ab7c9a6133)]:
  - @shopify/hydrogen@2026.0.0

## 2025.5.2

### Patch Changes

- Fixing the skeleton's Vite Config ([#2958](https://github.com/Shopify/hydrogen/pull/2958)) by [@balazsbajorics](https://github.com/balazsbajorics)

## 2025.5.1

### Patch Changes

- Bumping the cli to 3.80.4 ([#2956](https://github.com/Shopify/hydrogen/pull/2956)) by [@balazsbajorics](https://github.com/balazsbajorics)

## 2025.5.0

### Patch Changes

- Migrating to React Router 7 ([#2866](https://github.com/Shopify/hydrogen/pull/2866)) by [@balazsbajorics](https://github.com/balazsbajorics)

- Updated dependencies [[`e9132d88`](https://github.com/Shopify/hydrogen/commit/e9132d8888ad090d3db41fe4d5d63569a30e9d8e), [`e9132d88`](https://github.com/Shopify/hydrogen/commit/e9132d8888ad090d3db41fe4d5d63569a30e9d8e)]:
  - @shopify/remix-oxygen@3.0.0
  - @shopify/hydrogen@2025.5.0

## 2025.4.0

### Patch Changes

- Moved the Cursor rules into more generic LLM prompt files. If you were using the Cursor rules, you will find the prompts in the `cookbook/llms` folder and they can be put into your `.cursor/rules` folder manually. LLM prompt files will be maintained moving forward, while previous Cursor rules will not be updated anymore. ([#2936](https://github.com/Shopify/hydrogen/pull/2936)) by [@ruggishop](https://github.com/ruggishop)

- Bump skeleton @shopify/cli and @shopify/mini-oxygen ([#2883](https://github.com/Shopify/hydrogen/pull/2883)) by [@juanpprieto](https://github.com/juanpprieto)

- Update SFAPI and CAAPI versions to 2025.04 ([#2886](https://github.com/Shopify/hydrogen/pull/2886)) by [@juanpprieto](https://github.com/juanpprieto)

- Updated dependencies [[`af23e710`](https://github.com/Shopify/hydrogen/commit/af23e710dac83bb57498d9c2ef1d8bcf9df55d34), [`9d8a6644`](https://github.com/Shopify/hydrogen/commit/9d8a6644a5b67dca890c6687df390aee78fc85c3)]:
  - @shopify/hydrogen@2025.4.0

## 2025.1.7

### Patch Changes

- Fix an issue with our starter template where duplicate content can exist on URLs that use internationalized handles. For example, if you have a product handle in english of `the-havoc` and translate it to `das-chaos` in German, duplicate content exists at both: ([#2821](https://github.com/Shopify/hydrogen/pull/2821)) by [@blittle](https://github.com/blittle)
  1. https://hydrogen.shop/de-de/products/das-chaos
  2. https://hydrogen.shop/de-de/products/the-havoc

  We've changed the starter template to make the second redirect to the first.

- Added the Cursor rule for the subscriptions recipe. ([#2874](https://github.com/Shopify/hydrogen/pull/2874)) by [@ruggishop](https://github.com/ruggishop)

- Fix faulty truthiness check for cart quantity ([#2855](https://github.com/Shopify/hydrogen/pull/2855)) by [@frontsideair](https://github.com/frontsideair)

- Refactor ProductItem into a separate component ([#2872](https://github.com/Shopify/hydrogen/pull/2872)) by [@juanpprieto](https://github.com/juanpprieto)

- Updated dependencies [[`f80f3bc7`](https://github.com/Shopify/hydrogen/commit/f80f3bc7239b3ee6641cb468a17e15c77bb7815b), [`61ddf924`](https://github.com/Shopify/hydrogen/commit/61ddf92487524b3c04632ae2cfdaa2869a3ae02c), [`642bde4f`](https://github.com/Shopify/hydrogen/commit/642bde4f3df11511e125b013abd977618da25692)]:
  - @shopify/hydrogen@2025.1.4

## 2025.1.6

### Patch Changes

- Moved the `Layout` component back into `root.tsx` to avoid issues with styled errors. ([#2829](https://github.com/Shopify/hydrogen/pull/2829)) by [@ruggishop](https://github.com/ruggishop)
  1. If you have a separate `app/layout.tsx` file, delete it and move its default exported component into your `root.tsx`. For example:

     \`\`\`ts
     // /app/root.tsx
     export function Layout({children}: {children?: React.ReactNode}) {
       const nonce = useNonce();
       const data = useRouteLoaderData<RootLoader>('root');

       return (
         <html lang="en">
         ...
       );
     }
     \`\`\`

## 2025.1.5

### Patch Changes

- Fixed an issue with the creation of JavaScript projects. ([#2818](https://github.com/Shopify/hydrogen/pull/2818)) by [@seanparsons](https://github.com/seanparsons)

## 2025.1.4

### Patch Changes

- Updates the `@shopify/cli`, `@shopify/cli-kit` and `@shopify/plugin-cloudflare` dependencies to 3.77.1. ([#2816](https://github.com/Shopify/hydrogen/pull/2816)) by [@seanparsons](https://github.com/seanparsons)

## 2025.1.3

### Patch Changes

- Bump Remix to 2.16.1 and vite to 6.2.0 ([#2784](https://github.com/Shopify/hydrogen/pull/2784)) by [@wizardlyhel](https://github.com/wizardlyhel)

- Update skeleton and create-hydrogen cli to 3.75.4 ([#2769](https://github.com/Shopify/hydrogen/pull/2769)) by [@juanpprieto](https://github.com/juanpprieto)

- Fixing typescript compile ([#2787](https://github.com/Shopify/hydrogen/pull/2787)) by [@balazsbajorics](https://github.com/balazsbajorics)

  In tsconfig.json:

  \`\`\`diff
       "types": [
         "@shopify/oxygen-workers-types",
  -      "@remix-run/node",
  +      "@remix-run/server-runtime",
         "vite/client"
       ],
  \`\`\`

- Updates `@shopify/cli-kit`, `@shopify/cli` and `@shopify/plugin-cloudflare` to `3.77.0`. ([#2810](https://github.com/Shopify/hydrogen/pull/2810)) by [@seanparsons](https://github.com/seanparsons)

- Support for the Remix future flag `v3_routeConfig`. ([#2722](https://github.com/Shopify/hydrogen/pull/2722)) by [@seanparsons](https://github.com/seanparsons)

  Please refer to the Remix documentation for more details on `v3_routeConfig` future flag: [https://remix.run/docs/en/main/start/future-flags#v3_routeconfig](https://remix.run/docs/en/main/start/future-flags#v3_routeconfig)
  1. Update your `vite.config.ts`.

     \`\`\`diff
     export default defineConfig({
       plugins: [
         hydrogen(),
         oxygen(),
         remix({
     -      presets: [hydrogen.preset()],
     +      presets: [hydrogen.v3preset()],
         future: {
           v3_fetcherPersist: true,
           v3_relativeSplatPath: true,
           v3_throwAbortReason: true,
           v3_lazyRouteDiscovery: true,
           v3_singleFetch: true,
     +      v3_routeConfig: true,
         },
       }),
       tsconfigPaths(),
     ],
     \`\`\`

  1. Update your `package.json` and install the new packages. Make sure to match the Remix version along with other Remix npm packages and ensure the versions are 2.16.1 or above:

     \`\`\`diff
       "devDependencies": {
         "@remix-run/dev": "^2.16.1",
     +    "@remix-run/fs-routes": "^2.16.1",
     +    "@remix-run/route-config": "^2.16.1",
     \`\`\`

  1. Move the `Layout` component export from `root.tsx` into its own file. Make sure to supply an `<Outlet>` so Remix knows where to inject your route content.

     \`\`\`ts
     // /app/layout.tsx
     import {Outlet} from '@remix-run/react';

     export default function Layout() {
       const nonce = useNonce();
       const data = useRouteLoaderData<RootLoader>('root');

       return (
         <html lang="en">
           ...
           <Outlet />
           ...
         </html>
       );
     }

     // Remember to remove the Layout export from your root.tsx
     \`\`\`

  1. Add a routes.ts file. This is your new Remix route configuration file.

     \`\`\`ts
     import {flatRoutes} from '@remix-run/fs-routes';
     import {layout, type RouteConfig} from '@remix-run/route-config';
     import {hydrogenRoutes} from '@shopify/hydrogen';

     export default hydrogenRoutes([
       // Your entire app reading from routes folder using Layout from layout.tsx
       layout('./layout.tsx', await flatRoutes()),
     ]) satisfies RouteConfig;
     \`\`\`

- Updated dependencies [[`0425e50d`](https://github.com/Shopify/hydrogen/commit/0425e50dafe2f42326cba67076e5fcea2905e885), [`74ef1ba7`](https://github.com/Shopify/hydrogen/commit/74ef1ba7d41988350e9d2c81731c90381943d1f0)]:
  - @shopify/remix-oxygen@2.0.12
  - @shopify/hydrogen@2025.1.3

## 2025.1.2

### Patch Changes

- Bump cli version ([#2760](https://github.com/Shopify/hydrogen/pull/2760)) by [@rbshop](https://github.com/rbshop)

- Updated dependencies [[`128dfcd6`](https://github.com/Shopify/hydrogen/commit/128dfcd6b254a7465d93be49d3bcbff5251e5ffc)]:
  - @shopify/hydrogen@2025.1.2

## 2025.1.1

### Patch Changes

- Upgrade eslint to version 9 and unify eslint config across all packages (with the exception of the skeleton, which still keeps its own config) ([#2716](https://github.com/Shopify/hydrogen/pull/2716)) by [@liady](https://github.com/liady)

- Bump remix version ([#2740](https://github.com/Shopify/hydrogen/pull/2740)) by [@wizardlyhel](https://github.com/wizardlyhel)

- Turn on Remix `v3_singleFetch` future flag ([#2708](https://github.com/Shopify/hydrogen/pull/2708)) by [@wizardlyhel](https://github.com/wizardlyhel)

  Remix single fetch migration quick guide: https://remix.run/docs/en/main/start/future-flags#v3_singlefetch
  Remix single fetch migration guide: https://remix.run/docs/en/main/guides/single-fetch

  **Note:** If you have any routes that appends (or looks for) a search param named `_data`, make sure to rename it to something else.
  1. In your `vite.config.ts`, add the single fetch future flag.

     \`\`\`diff
     +  declare module "@remix-run/server-runtime" {
     +    interface Future {
     +     v3_singleFetch: true;
     +    }
     +  }

       export default defineConfig({
         plugins: [
           hydrogen(),
           oxygen(),
           remix({
             presets: [hydrogen.preset()],
             future: {
               v3_fetcherPersist: true,
               v3_relativeSplatPath: true,
               v3_throwAbortReason: true,
               v3_lazyRouteDiscovery: true,
     +         v3_singleFetch: true,
             },
           }),
           tsconfigPaths(),
         ],
     \`\`\`

  2. In your `entry.server.tsx`, add `nonce` to the `<RemixServer>`.

     \`\`\`diff
     const body = await renderToReadableStream(
       <NonceProvider>
         <RemixServer
           context={remixContext}
           url={request.url}
     +     nonce={nonce}
         />
       </NonceProvider>,
     \`\`\`

  3. Update the `shouldRevalidate` function in `root.tsx`.

     Defaulting to no revalidation for root loader data to improve performance. When using this feature, you risk your UI getting out of sync with your server. Use with caution. If you are uncomfortable with this optimization, update the `return false;` to `return defaultShouldRevalidate;` instead.

     For more details see: https://remix.run/docs/en/main/route/should-revalidate

     \`\`\`diff
     export const shouldRevalidate: ShouldRevalidateFunction = ({
       formMethod,
       currentUrl,
       nextUrl,
     -  defaultShouldRevalidate,
     }) => {
       // revalidate when a mutation is performed e.g add to cart, login...
       if (formMethod && formMethod !== 'GET') return true;

       // revalidate when manually revalidating via useRevalidator
       if (currentUrl.toString() === nextUrl.toString()) return true;

     -  return defaultShouldRevalidate;
     +  return false;
     };
     \`\`\`

  4. Update `cart.tsx` to add a headers export and update to `data` import usage.

     \`\`\`diff
       import {
     -  json,
     +  data,
         type LoaderFunctionArgs,
         type ActionFunctionArgs,
         type HeadersFunction
       } from '@shopify/remix-oxygen';
     + export const headers: HeadersFunction = ({actionHeaders}) => actionHeaders;

       export async function action({request, context}: ActionFunctionArgs) {
         ...
     -   return json(
     +   return data(
           {
             cart: cartResult,
             errors,
             warnings,
             analytics: {
               cartId,
             },
           },
           {status, headers},
         );
       }

       export async function loader({context}: LoaderFunctionArgs) {
         const {cart} = context;
     -    return json(await cart.get());
     +    return await cart.get();
       }
     \`\`\`

  5. Deprecate `json` and `defer` import usage from `@shopify/remix-oxygen`.

     Remove `json()`/`defer()` in favor of raw objects.

     Single Fetch supports JSON objects and Promises out of the box, so you can return the raw data from your loader/action functions:

     \`\`\`diff
     - import {json} from "@shopify/remix-oxygen";

       export async function loader({}: LoaderFunctionArgs) {
         let tasks = await fetchTasks();
     -   return json(tasks);
     +   return tasks;
       }
     \`\`\`

     \`\`\`diff
     - import {defer} from "@shopify/remix-oxygen";

       export async function loader({}: LoaderFunctionArgs) {
         let lazyStuff = fetchLazyStuff();
         let tasks = await fetchTasks();
     -   return defer({ tasks, lazyStuff });
     +   return { tasks, lazyStuff };
       }
     \`\`\`

     If you were using the second parameter of json/defer to set a custom status or headers on your response, you can continue doing so via the new data API:

     \`\`\`diff
     -  import {json} from "@shopify/remix-oxygen";
     +  import {data, type HeadersFunction} from "@shopify/remix-oxygen";

     +  /**
     +   * If your loader or action is returning a response with headers,
     +   * make sure to export a headers function that merges your headers
     +   * on your route. Otherwise, your headers may be lost.
     +   * Remix doc: https://remix.run/docs/en/main/route/headers
     +   **/
     +  export const headers: HeadersFunction = ({loaderHeaders}) => loaderHeaders;

       export async function loader({}: LoaderFunctionArgs) {
         let tasks = await fetchTasks();
     -    return json(tasks, {
     +    return data(tasks, {
           headers: {
             "Cache-Control": "public, max-age=604800"
           }
         });
       }
     \`\`\`

  6. If you are using legacy customer account flow or multipass, there are a couple more files that requires updating:

     In `root.tsx` and `routes/account.tsx`, add a `headers` export for `loaderHeaders`.

     \`\`\`diff
     + export const headers: HeadersFunction = ({loaderHeaders}) => loaderHeaders;
     \`\`\`

     In `routes/account_.register.tsx`, add a `headers` export for `actionHeaders`.

     \`\`\`diff
     + export const headers: HeadersFunction = ({actionHeaders}) => actionHeaders;
     \`\`\`

  7. If you are using multipass, in `routes/account_.login.multipass.tsx`

     a. export a `headers` export

     \`\`\`diff
     + export const headers: HeadersFunction = ({actionHeaders}) => actionHeaders;
     \`\`\`

     b. Update all `json` response wrapper to `remixData`

     \`\`\`diff
     import {
     - json,
     + data as remixData,
     } from '@shopify/remix-oxygen';

     -  return json(
     +  return remixData(
         ...
       );
     \`\`\`

- Updated dependencies [[`3af2e453`](https://github.com/Shopify/hydrogen/commit/3af2e4534eafe1467f70a35885a2fa2ef7724fa8), [`6bff6b62`](https://github.com/Shopify/hydrogen/commit/6bff6b6260af21b8025426c7031ab862dbecbc34), [`cd65685c`](https://github.com/Shopify/hydrogen/commit/cd65685c1036233faaead0330f25183900b102a7), [`8c717570`](https://github.com/Shopify/hydrogen/commit/8c7175701d9f4dd05d271ea46b6ab40d6e3210cb), [`4e81bd1b`](https://github.com/Shopify/hydrogen/commit/4e81bd1b0e99b5c760679b565d2f95c4fc15b934), [`3ea25820`](https://github.com/Shopify/hydrogen/commit/3ea25820b0b0094d982e481782e413165435cf00)]:
  - @shopify/hydrogen@2025.1.1
  - @shopify/remix-oxygen@2.0.11

## 2025.1.0

### Patch Changes

- Bump vite, Remix versions and tailwind v4 alpha to beta ([#2696](https://github.com/Shopify/hydrogen/pull/2696)) by [@wizardlyhel](https://github.com/wizardlyhel)

- Workaround for "Error: failed to execute 'insertBefore' on 'Node'" that sometimes happen during development. ([#2701](https://github.com/Shopify/hydrogen/pull/2701)) by [@wizardlyhel](https://github.com/wizardlyhel)

  \`\`\`diff
  // root.tsx

  /**
   * The main and reset stylesheets are added in the Layout component
   * to prevent a bug in development HMR updates.
   *
   * This avoids the "failed to execute 'insertBefore' on 'Node'" error
   * that occurs after editing and navigating to another page.
   *
   * It's a temporary fix until the issue is resolved.
   * https://github.com/remix-run/remix/issues/9242
   */
  export function links() {
    return [
  -    {rel: 'stylesheet', href: resetStyles},
  -    {rel: 'stylesheet', href: appStyles},
      {
        rel: 'preconnect',
        href: 'https://cdn.shopify.com',
      },
      {
        rel: 'preconnect',
        href: 'https://shop.app',
      },
      {rel: 'icon', type: 'image/svg+xml', href: favicon},
    ];
  }

  ...

  export function Layout({children}: {children?: React.ReactNode}) {
    const nonce = useNonce();
    const data = useRouteLoaderData<RootLoader>('root');

    return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
  +        <link rel="stylesheet" href={resetStyles}></link>
  +        <link rel="stylesheet" href={appStyles}></link>

  \`\`\`

- Turn on future flag `v3_lazyRouteDiscovery` ([#2702](https://github.com/Shopify/hydrogen/pull/2702)) by [@wizardlyhel](https://github.com/wizardlyhel)

  In your vite.config.ts, add the following line:

  \`\`\`diff
  export default defineConfig({
    plugins: [
      hydrogen(),
      oxygen(),
      remix({
        presets: [hydrogen.preset()],
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
  +        v3_lazyRouteDiscovery: true,
        },
      }),
      tsconfigPaths(),
    ],
  \`\`\`

  Test your app by running `npm run dev` and nothing should break

- Fix image size warnings on collections page ([#2703](https://github.com/Shopify/hydrogen/pull/2703)) by [@wizardlyhel](https://github.com/wizardlyhel)

- Bump cli version ([#2732](https://github.com/Shopify/hydrogen/pull/2732)) by [@wizardlyhel](https://github.com/wizardlyhel)

- Bump SFAPI to 2025-01 ([#2715](https://github.com/Shopify/hydrogen/pull/2715)) by [@rbshop](https://github.com/rbshop)

- Updated dependencies [[`fdab06f5`](https://github.com/Shopify/hydrogen/commit/fdab06f5d34076b526d406698bdf6fca6787660b), [`ae6d71f0`](https://github.com/Shopify/hydrogen/commit/ae6d71f0976f520ca177c69ff677f852af63859e), [`650d57b3`](https://github.com/Shopify/hydrogen/commit/650d57b3e07125661e23900e73c0bb3027ddbcde), [`064de138`](https://github.com/Shopify/hydrogen/commit/064de13890c68cabb1c3fdbe7f77409a0cf1c384)]:
  - @shopify/remix-oxygen@2.0.10
  - @shopify/hydrogen@2025.1.0

## 2024.10.4

### Patch Changes

- Bump cli version ([#2694](https://github.com/Shopify/hydrogen/pull/2694)) by [@wizardlyhel](https://github.com/wizardlyhel)

## 2024.10.3

### Patch Changes

- Prevent scroll reset on variant change ([#2672](https://github.com/Shopify/hydrogen/pull/2672)) by [@scottdixon](https://github.com/scottdixon)

## 2024.10.2

### Patch Changes

- Remove initial redirect from product display page ([#2643](https://github.com/Shopify/hydrogen/pull/2643)) by [@scottdixon](https://github.com/scottdixon)

- Optional updates for the product route and product form to handle combined listing and 2000 variant limit. ([#2659](https://github.com/Shopify/hydrogen/pull/2659)) by [@wizardlyhel](https://github.com/wizardlyhel)
  1. Update your SFAPI product query to bring in the new query fields:

  \`\`\`diff
  const PRODUCT_FRAGMENT = `#graphql
    fragment Product on Product {
      id
      title
      vendor
      handle
      descriptionHtml
      description
  +    encodedVariantExistence
  +    encodedVariantAvailability
      options {
        name
        optionValues {
          name
  +        firstSelectableVariant {
  +          ...ProductVariant
  +        }
  +        swatch {
  +          color
  +          image {
  +            previewImage {
  +              url
  +            }
  +          }
  +        }
        }
      }
  -    selectedVariant: selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
  +    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
  +      ...ProductVariant
  +    }
  +    adjacentVariants (selectedOptions: $selectedOptions) {
  +      ...ProductVariant
  +    }
  -    variants(first: 1) {
  -      nodes {
  -        ...ProductVariant
  -      }
  -    }
      seo {
        description
        title
      }
    }
    ${PRODUCT_VARIANT_FRAGMENT}
  ` as const;
  \`\`\`

  2. Update `loadDeferredData` function. We no longer need to load in all the variants. You can also remove `VARIANTS_QUERY` variable.

  \`\`\`diff
  function loadDeferredData({context, params}: LoaderFunctionArgs) {
  +  // Put any API calls that is not critical to be available on first page render
  +  // For example: product reviews, product recommendations, social feeds.
  -  // In order to show which variants are available in the UI, we need to query
  -  // all of them. But there might be a *lot*, so instead separate the variants
  -  // into it's own separate query that is deferred. So there's a brief moment
  -  // where variant options might show as available when they're not, but after
  -  // this deferred query resolves, the UI will update.
  -  const variants = context.storefront
  -    .query(VARIANTS_QUERY, {
  -      variables: {handle: params.handle!},
  -    })
  -    .catch((error) => {
  -      // Log query errors, but don't throw them so the page can still render
  -      console.error(error);
  -      return null;
  -    });

  +  return {}
  -  return {
  -    variants,
  -  };
  }
  \`\`\`

  3. Remove the redirect logic in the `loadCriticalData` function and completely remove `redirectToFirstVariant` function

  \`\`\`diff
  async function loadCriticalData({
    context,
    params,
    request,
  }: LoaderFunctionArgs) {
    const {handle} = params;
    const {storefront} = context;
    if (!handle) {
      throw new Error('Expected product handle to be defined');
    }
    const [{product}] = await Promise.all([
      storefront.query(PRODUCT_QUERY, {
        variables: {handle, selectedOptions: getSelectedProductOptions(request)},
      }),
      // Add other queries here, so that they are loaded in parallel
    ]);

    if (!product?.id) {
      throw new Response(null, {status: 404});
    }

  -  const firstVariant = product.variants.nodes[0];
  -  const firstVariantIsDefault = Boolean(
  -    firstVariant.selectedOptions.find(
  -      (option: SelectedOption) =>
  -        option.name === 'Title' && option.value === 'Default Title',
  -    ),
  -  );

  -  if (firstVariantIsDefault) {
  -    product.selectedVariant = firstVariant;
  -  } else {
  -    // if no selected variant was returned from the selected options,
  -    // we redirect to the first variant's url with it's selected options applied
  -    if (!product.selectedVariant) {
  -      throw redirectToFirstVariant({product, request});
  -    }
  -  }

    return {
      product,
    };
  }

  ...

  -  function redirectToFirstVariant({
  -    product,
  -    request,
  -  }: {
  -    product: ProductFragment;
  -    request: Request;
  -  }) {
  -    ...
  -  }
  \`\`\`

  4. Update the `Product` component to use the new data fields.

  \`\`\`diff
  import {
    getSelectedProductOptions,
    Analytics,
    useOptimisticVariant,
  +  getAdjacentAndFirstAvailableVariants,
  } from '@shopify/hydrogen';

  export default function Product() {
  +  const {product} = useLoaderData<typeof loader>();
  -  const {product, variants} = useLoaderData<typeof loader>();

  +  // Optimistically selects a variant with given available variant information
  +  const selectedVariant = useOptimisticVariant(
  +    product.selectedOrFirstAvailableVariant,
  +    getAdjacentAndFirstAvailableVariants(product),
  +  );
  -  const selectedVariant = useOptimisticVariant(
  -    product.selectedVariant,
  -    variants,
  -  );
  \`\`\`

  5. Handle missing search query param in url from selecting a first variant

  \`\`\`diff
  import {
    getSelectedProductOptions,
    Analytics,
    useOptimisticVariant,
    getAdjacentAndFirstAvailableVariants,
  +  useSelectedOptionInUrlParam,
  } from '@shopify/hydrogen';

  export default function Product() {
    const {product} = useLoaderData<typeof loader>();

    // Optimistically selects a variant with given available variant information
    const selectedVariant = useOptimisticVariant(
      product.selectedOrFirstAvailableVariant,
      getAdjacentAndFirstAvailableVariants(product),
    );

  +  // Sets the search param to the selected variant without navigation
  +  // only when no search params are set in the url
  +  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);
  \`\`\`

  6. Get the product options array using `getProductOptions`

  \`\`\`diff
  import {
    getSelectedProductOptions,
    Analytics,
    useOptimisticVariant,
  +  getProductOptions,
    getAdjacentAndFirstAvailableVariants,
    useSelectedOptionInUrlParam,
  } from '@shopify/hydrogen';

  export default function Product() {
    const {product} = useLoaderData<typeof loader>();

    // Optimistically selects a variant with given available variant information
    const selectedVariant = useOptimisticVariant(
      product.selectedOrFirstAvailableVariant,
      getAdjacentAndFirstAvailableVariants(product),
    );

    // Sets the search param to the selected variant without navigation
    // only when no search params are set in the url
    useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  +  // Get the product options array
  +  const productOptions = getProductOptions({
  +    ...product,
  +    selectedOrFirstAvailableVariant: selectedVariant,
  +  });
  \`\`\`

  7. Remove the `Await` and `Suspense` from the `ProductForm`. We no longer have any queries that we need to wait for.

  \`\`\`diff
  export default function Product() {

    ...

    return (
      ...
  +        <ProductForm
  +          productOptions={productOptions}
  +          selectedVariant={selectedVariant}
  +        />
  -        <Suspense
  -          fallback={
  -            <ProductForm
  -              product={product}
  -              selectedVariant={selectedVariant}
  -              variants={[]}
  -            />
  -          }
  -        >
  -          <Await
  -            errorElement="There was a problem loading product variants"
  -            resolve={variants}
  -          >
  -            {(data) => (
  -              <ProductForm
  -                product={product}
  -                selectedVariant={selectedVariant}
  -                variants={data?.product?.variants.nodes || []}
  -              />
  -            )}
  -          </Await>
  -        </Suspense>
  \`\`\`

  8. Update the `ProductForm` component.

  \`\`\`tsx
  import {Link, useNavigate} from '@remix-run/react';
  import {type MappedProductOptions} from '@shopify/hydrogen';
  import type {
    Maybe,
    ProductOptionValueSwatch,
  } from '@shopify/hydrogen/storefront-api-types';
  import {AddToCartButton} from './AddToCartButton';
  import {useAside} from './Aside';
  import type {ProductFragment} from 'storefrontapi.generated';

  export function ProductForm({
    productOptions,
    selectedVariant,
  }: {
    productOptions: MappedProductOptions[];
    selectedVariant: ProductFragment['selectedOrFirstAvailableVariant'];
  }) {
    const navigate = useNavigate();
    const {open} = useAside();
    return (
      <div className="product-form">
        {productOptions.map((option) => (
          <div className="product-options" key={option.name}>
            <h5>{option.name}</h5>
            <div className="product-options-grid">
              {option.optionValues.map((value) => {
                const {
                  name,
                  handle,
                  variantUriQuery,
                  selected,
                  available,
                  exists,
                  isDifferentProduct,
                  swatch,
                } = value;

                if (isDifferentProduct) {
                  // SEO
                  // When the variant is a combined listing child product
                  // that leads to a different url, we need to render it
                  // as an anchor tag
                  return (
                    <Link
                      className="product-options-item"
                      key={option.name + name}
                      prefetch="intent"
                      preventScrollReset
                      replace
                      to={`/products/${handle}?${variantUriQuery}`}
                      style={{
                        border: selected
                          ? '1px solid black'
                          : '1px solid transparent',
                        opacity: available ? 1 : 0.3,
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </Link>
                  );
                } else {
                  // SEO
                  // When the variant is an update to the search param,
                  // render it as a button with javascript navigating to
                  // the variant so that SEO bots do not index these as
                  // duplicated links
                  return (
                    <button
                      type="button"
                      className={`product-options-item${
                        exists && !selected ? ' link' : ''
                      }`}
                      key={option.name + name}
                      style={{
                        border: selected
                          ? '1px solid black'
                          : '1px solid transparent',
                        opacity: available ? 1 : 0.3,
                      }}
                      disabled={!exists}
                      onClick={() => {
                        if (!selected) {
                          navigate(`?${variantUriQuery}`, {
                            replace: true,
                          });
                        }
                      }}
                    >
                      <ProductOptionSwatch swatch={swatch} name={name} />
                    </button>
                  );
                }
              })}
            </div>
            <br />
          </div>
        ))}
        <AddToCartButton
          disabled={!selectedVariant || !selectedVariant.availableForSale}
          onClick={() => {
            open('cart');
          }}
          lines={
            selectedVariant
              ? [
                  {
                    merchandiseId: selectedVariant.id,
                    quantity: 1,
                    selectedVariant,
                  },
                ]
              : []
          }
        >
          {selectedVariant?.availableForSale ? 'Add to cart' : 'Sold out'}
        </AddToCartButton>
      </div>
    );
  }

  function ProductOptionSwatch({
    swatch,
    name,
  }: {
    swatch?: Maybe<ProductOptionValueSwatch> | undefined;
    name: string;
  }) {
    const image = swatch?.image?.previewImage?.url;
    const color = swatch?.color;

    if (!image && !color) return name;

    return (
      <div
        aria-label={name}
        className="product-option-label-swatch"
        style={{
          backgroundColor: color || 'transparent',
        }}
      >
        {!!image && <img src={image} alt={name} />}
      </div>
    );
  }
  \`\`\`

  9. Update `app.css`

  \`\`\`diff
  +  /*
  +  * --------------------------------------------------
  +  * Non anchor links
  +  * --------------------------------------------------
  +  */
  +  .link:hover {
  +    text-decoration: underline;
  +    cursor: pointer;
  +  }

  ...

  -  .product-options-item {
  +  .product-options-item,
  +  .product-options-item:disabled {
  +    padding: 0.25rem 0.5rem;
  +    background-color: transparent;
  +    font-size: 1rem;
  +    font-family: inherit;
  +  }

  +  .product-option-label-swatch {
  +    width: 1.25rem;
  +    height: 1.25rem;
  +    margin: 0.25rem 0;
  +  }

  +  .product-option-label-swatch img {
  +    width: 100%;
  +  }
  \`\`\`

  10. Update `lib/variants.ts`

  Make `useVariantUrl` and `getVariantUrl` flexible to supplying a selected option param

  \`\`\`diff
  export function useVariantUrl(
    handle: string,
  -  selectedOptions: SelectedOption[],
  +  selectedOptions?: SelectedOption[],
  ) {
    const {pathname} = useLocation();

    return useMemo(() => {
      return getVariantUrl({
        handle,
        pathname,
        searchParams: new URLSearchParams(),
        selectedOptions,
      });
    }, [handle, selectedOptions, pathname]);
  }
  export function getVariantUrl({
    handle,
    pathname,
    searchParams,
    selectedOptions,
  }: {
    handle: string;
    pathname: string;
    searchParams: URLSearchParams;
  -  selectedOptions: SelectedOption[];
  +  selectedOptions?: SelectedOption[],
  }) {
    const match = /(\/[a-zA-Z]{2}-[a-zA-Z]{2}\/)/g.exec(pathname);
    const isLocalePathname = match && match.length > 0;
    const path = isLocalePathname
      ? `${match![0]}products/${handle}`
      : `/products/${handle}`;

  -  selectedOptions.forEach((option) => {
  +  selectedOptions?.forEach((option) => {
      searchParams.set(option.name, option.value);
    });
  \`\`\`

  11. Update `routes/collections.$handle.tsx`

  We no longer need to query for the variants since product route can efficiently
  obtain the first available variants. Update the code to reflect that:

  \`\`\`diff
  const PRODUCT_ITEM_FRAGMENT = `#graphql
    fragment MoneyProductItem on MoneyV2 {
      amount
      currencyCode
    }
    fragment ProductItem on Product {
      id
      handle
      title
      featuredImage {
        id
        altText
        url
        width
        height
      }
      priceRange {
        minVariantPrice {
          ...MoneyProductItem
        }
        maxVariantPrice {
          ...MoneyProductItem
        }
      }
  -    variants(first: 1) {
  -      nodes {
  -        selectedOptions {
  -          name
  -          value
  -        }
  -      }
  -    }
    }
  ` as const;
  \`\`\`

  and remove the variant reference

  \`\`\`diff
  function ProductItem({
    product,
    loading,
  }: {
    product: ProductItemFragment;
    loading?: 'eager' | 'lazy';
  }) {
  -  const variant = product.variants.nodes[0];
  -  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  +  const variantUrl = useVariantUrl(product.handle);
    return (
  \`\`\`

  12. Update `routes/collections.all.tsx`

  Same reasoning as `collections.$handle.tsx`

  \`\`\`diff
  const PRODUCT_ITEM_FRAGMENT = `#graphql
    fragment MoneyProductItem on MoneyV2 {
      amount
      currencyCode
    }
    fragment ProductItem on Product {
      id
      handle
      title
      featuredImage {
        id
        altText
        url
        width
        height
      }
      priceRange {
        minVariantPrice {
          ...MoneyProductItem
        }
        maxVariantPrice {
          ...MoneyProductItem
        }
      }
  -    variants(first: 1) {
  -      nodes {
  -        selectedOptions {
  -          name
  -          value
  -        }
  -      }
  -    }
    }
  ` as const;
  \`\`\`

  and remove the variant reference

  \`\`\`diff
  function ProductItem({
    product,
    loading,
  }: {
    product: ProductItemFragment;
    loading?: 'eager' | 'lazy';
  }) {
  -  const variant = product.variants.nodes[0];
  -  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  +  const variantUrl = useVariantUrl(product.handle);
    return (
  \`\`\`

  13. Update `routes/search.tsx`

  Instead of using the first variant, use `selectedOrFirstAvailableVariant`

  \`\`\`diff
  const SEARCH_PRODUCT_FRAGMENT = `#graphql
    fragment SearchProduct on Product {
      __typename
      handle
      id
      publishedAt
      title
      trackingParameters
      vendor
  -    variants(first: 1) {
  -      nodes {
  +    selectedOrFirstAvailableVariant(
  +      selectedOptions: []
  +      ignoreUnknownOptions: true
  +      caseInsensitiveMatch: true
  +    ) {
          id
          image {
            url
            altText
            width
            height
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          product {
            handle
            title
          }
       }
  -    }
    }
  ` as const;
  \`\`\`

  \`\`\`diff
  const PREDICTIVE_SEARCH_PRODUCT_FRAGMENT = `#graphql
    fragment PredictiveProduct on Product {
      __typename
      id
      title
      handle
      trackingParameters
  -    variants(first: 1) {
  -      nodes {
  +    selectedOrFirstAvailableVariant(
  +      selectedOptions: []
  +      ignoreUnknownOptions: true
  +      caseInsensitiveMatch: true
  +    ) {
          id
          image {
            url
            altText
            width
            height
          }
          price {
            amount
            currencyCode
          }
       }
  -    }
    }
  \`\`\`

  14. Update `components/SearchResults.tsx`

  \`\`\`diff
  function SearchResultsProducts({
    term,
    products,
  }: PartialSearchResult<'products'>) {
    if (!products?.nodes.length) {
      return null;
    }

    return (
      <div className="search-result">
        <h2>Products</h2>
        <Pagination connection={products}>
          {({nodes, isLoading, NextLink, PreviousLink}) => {
            const ItemsMarkup = nodes.map((product) => {
              const productUrl = urlWithTrackingParams({
                baseUrl: `/products/${product.handle}`,
                trackingParams: product.trackingParameters,
                term,
              });

  +            const price = product?.selectedOrFirstAvailableVariant?.price;
  +            const image = product?.selectedOrFirstAvailableVariant?.image;

              return (
                <div className="search-results-item" key={product.id}>
                  <Link prefetch="intent" to={productUrl}>
  -                  {product.variants.nodes[0].image && (
  +                  {image && (
                      <Image
  -                      data={product.variants.nodes[0].image}
  +                      data={image}
                        alt={product.title}
                        width={50}
                      />
                    )}
                    <div>
                      <p>{product.title}</p>
                      <small>
  -                      <Money data={product.variants.nodes[0].price} />
  +                      {price &&
  +                        <Money data={price} />
  +                      }
                      </small>
                    </div>
                  </Link>
                </div>
              );
            });
  \`\`\`

  15. Update `components/SearchResultsPredictive.tsx`

  \`\`\`diff
  function SearchResultsPredictiveProducts({
    term,
    products,
    closeSearch,
  }: PartialPredictiveSearchResult<'products'>) {
    if (!products.length) return null;

    return (
      <div className="predictive-search-result" key="products">
        <h5>Products</h5>
        <ul>
          {products.map((product) => {
            const productUrl = urlWithTrackingParams({
              baseUrl: `/products/${product.handle}`,
              trackingParams: product.trackingParameters,
              term: term.current,
            });

  +          const price = product?.selectedOrFirstAvailableVariant?.price;
  -          const image = product?.variants?.nodes?.[0].image;
  +          const image = product?.selectedOrFirstAvailableVariant?.image;
            return (
              <li className="predictive-search-result-item" key={product.id}>
                <Link to={productUrl} onClick={closeSearch}>
                  {image && (
                    <Image
                      alt={image.altText ?? ''}
                      src={image.url}
                      width={50}
                      height={50}
                    />
                  )}
                  <div>
                    <p>{product.title}</p>
                    <small>
  -                    {product?.variants?.nodes?.[0].price && (
  +                    {price && (
  -                      <Money data={product.variants.nodes[0].price} />
  +                      <Money data={price} />
                      )}
                    </small>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  \`\`\`

- Update `Aside` to have an accessible close button label ([#2639](https://github.com/Shopify/hydrogen/pull/2639)) by [@lb-](https://github.com/lb-)

- Fix cart route so that it works with no-js ([#2665](https://github.com/Shopify/hydrogen/pull/2665)) by [@wizardlyhel](https://github.com/wizardlyhel)

- Bump Shopify cli version ([#2667](https://github.com/Shopify/hydrogen/pull/2667)) by [@wizardlyhel](https://github.com/wizardlyhel)

- Updated dependencies [[`8f64915e`](https://github.com/Shopify/hydrogen/commit/8f64915e934130299307417627a12caf756cd8da), [`a57d5267`](https://github.com/Shopify/hydrogen/commit/a57d5267daa2f22fe1a426fb9f62c242957f95b6), [`91d60fd2`](https://github.com/Shopify/hydrogen/commit/91d60fd2174b7c34f9f6b781cd5f0a70371fd899), [`23a80f3e`](https://github.com/Shopify/hydrogen/commit/23a80f3e7bf9f9908130fc9345397fc694420364)]:
  - @shopify/hydrogen@2024.10.1

## 2024.10.1

### Patch Changes

- Bump to get new cli package version by [@wizardlyhel](https://github.com/wizardlyhel)

## 2024.10.0

### Patch Changes

- Stabilize `getSitemap`, `getSitemapIndex` and implement on skeleton ([#2589](https://github.com/Shopify/hydrogen/pull/2589)) by [@juanpprieto](https://github.com/juanpprieto)
  1. Update the `getSitemapIndex` at `/app/routes/[sitemap.xml].tsx`

  \`\`\`diff
  - import {unstable__getSitemapIndex as getSitemapIndex} from '@shopify/hydrogen';
  + import {getSitemapIndex} from '@shopify/hydrogen';
  \`\`\`

  2. Update the `getSitemap` at `/app/routes/sitemap.$type.$page[.xml].tsx`

  \`\`\`diff
  - import {unstable__getSitemap as getSitemap} from '@shopify/hydrogen';
  + import {getSitemap} from '@shopify/hydrogen';
  \`\`\`

  For a reference implementation please see the skeleton template sitemap routes

- [**Breaking change**] ([#2588](https://github.com/Shopify/hydrogen/pull/2588)) by [@wizardlyhel](https://github.com/wizardlyhel)

  Set up Customer Privacy without the Shopify's cookie banner by default.

  If you are using Shopify's cookie banner to handle user consent in your app, you need to set `withPrivacyBanner: true` to the consent config. Without this update, the Shopify cookie banner will not appear.

  \`\`\`diff
    return defer({
      ...
      consent: {
        checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
        storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
  +      withPrivacyBanner: true,
        // localize the privacy banner
        country: args.context.storefront.i18n.country,
        language: args.context.storefront.i18n.language,
      },
    });
  \`\`\`

- Update to 2024-10 SFAPI ([#2570](https://github.com/Shopify/hydrogen/pull/2570)) by [@wizardlyhel](https://github.com/wizardlyhel)

- [**Breaking change**] ([#2546](https://github.com/Shopify/hydrogen/pull/2546)) by [@frandiox](https://github.com/frandiox)

  Update `createWithCache` to make it harder to accidentally cache undesired results. `request` is now mandatory prop when initializing `createWithCache`.

  \`\`\`diff
  // server.ts
  export default {
    async fetch(
      request: Request,
      env: Env,
      executionContext: ExecutionContext,
    ): Promise<Response> {
      try {
        // ...
  -     const withCache = createWithCache({cache, waitUntil});
  +     const withCache = createWithCache({cache, waitUntil, request});
  \`\`\`

  `createWithCache` now returns an object with two utility functions: `withCache.run` and `withCache.fetch`. Both have a new prop `shouldCacheResult` that must be defined.

  The original `withCache` callback function is now `withCache.run`. This is useful to run _multiple_ fetch calls and merge their responses, or run any arbitrary code. It caches anything you return, but you can throw if you don't want to cache anything.

  \`\`\`diff
    const withCache = createWithCache({cache, waitUntil, request});

    const fetchMyCMS = (query) => {
  -    return withCache(['my-cms', query], CacheLong(), async (params) => {
  +    return withCache.run({
  +      cacheKey: ['my-cms', query],
  +      cacheStrategy: CacheLong(),
  +      // Cache if there are no data errors or a specific data that make this result not suited for caching
  +      shouldCacheResult: (result) => !result?.errors,
  +    }, async(params) => {
        const response = await fetch('my-cms.com/api', {
          method: 'POST',
          body: query,
        });
        if (!response.ok) throw new Error(response.statusText);
        const {data, error} = await response.json();
        if (error || !data) throw new Error(error ?? 'Missing data');
        params.addDebugData({displayName: 'My CMS query', response});
        return data;
      });
    };
  \`\`\`

  New `withCache.fetch` is for caching simple fetch requests. This method caches the responses if they are OK responses, and you can pass `shouldCacheResponse`, `cacheKey`, etc. to modify behavior. `data` is the consumed body of the response (we need to consume to cache it).

  \`\`\`ts
  const withCache = createWithCache({cache, waitUntil, request});

  const {data, response} = await withCache.fetch<{data: T; error: string}>(
    'my-cms.com/api',
    {
      method: 'POST',
      headers: {'Content-type': 'application/json'},
      body,
    },
    {
      cacheStrategy: CacheLong(),
      // Cache if there are no data errors or a specific data that make this result not suited for caching
      shouldCacheResponse: (result) => !result?.error,
      cacheKey: ['my-cms', body],
      displayName: 'My CMS query',
    },
  );
  \`\`\`

- [**Breaking change**] ([#2585](https://github.com/Shopify/hydrogen/pull/2585)) by [@wizardlyhel](https://github.com/wizardlyhel)

  Deprecate usages of `product.options.values` and use `product.options.optionValues` instead.
  1. Update your product graphql query to use the new `optionValues` field.

  \`\`\`diff
    const PRODUCT_FRAGMENT = `#graphql
      fragment Product on Product {
        id
        title
        options {
          name
  -        values
  +        optionValues {
  +          name
  +        }
        }
  \`\`\`

  2. Update your `<VariantSelector>` to use the new `optionValues` field.

  \`\`\`diff
    <VariantSelector
      handle={product.handle}
  -    options={product.options.filter((option) => option.values.length > 1)}
  +    options={product.options.filter((option) => option.optionValues.length > 1)}
      variants={variants}
    >
  \`\`\`

- Updated dependencies [[`d97cd56e`](https://github.com/Shopify/hydrogen/commit/d97cd56e859abf8dd005fef2589d99e07fa87b6e), [`809c9f3d`](https://github.com/Shopify/hydrogen/commit/809c9f3d342b56dd3c0d340cb733e6f00053b71d), [`8c89f298`](https://github.com/Shopify/hydrogen/commit/8c89f298a8d9084ee510fb4d0d17766ec43c249c), [`a253ef97`](https://github.com/Shopify/hydrogen/commit/a253ef971acb08f2ee3a2743ca5c901c2922acc0), [`84a66b1e`](https://github.com/Shopify/hydrogen/commit/84a66b1e9d07bd6d6a10e5379ad3350b6bbecde9), [`227035e7`](https://github.com/Shopify/hydrogen/commit/227035e7e11df5fec5ac475b98fa6a318bdbe366), [`ac12293c`](https://github.com/Shopify/hydrogen/commit/ac12293c7b36e1b278bc929c682c65779c300cc7), [`c7c9f2eb`](https://github.com/Shopify/hydrogen/commit/c7c9f2ebd869a9d361504a10566c268e88b6096a), [`76cd4f9b`](https://github.com/Shopify/hydrogen/commit/76cd4f9ba3dd8eff4433d72f4422c06a7d567537), [`8337e534`](https://github.com/Shopify/hydrogen/commit/8337e5342ecca563fab557c3e833485466456cd5)]:
  - @shopify/hydrogen@2024.10.0
  - @shopify/remix-oxygen@2.0.9

## 2024.7.10

### Patch Changes

- Use HTML datalist element for query suggestions for autocomplete experience ([#2506](https://github.com/Shopify/hydrogen/pull/2506)) by [@frontsideair](https://github.com/frontsideair)

- Bump cli packages version ([#2592](https://github.com/Shopify/hydrogen/pull/2592)) by [@wizardlyhel](https://github.com/wizardlyhel)

- Updated dependencies [[`e963389d`](https://github.com/Shopify/hydrogen/commit/e963389d011b1cb44e2874fa332dc355c0d38eb9), [`d08d8c37`](https://github.com/Shopify/hydrogen/commit/d08d8c3779564cc55749f24bed1f6a2958a0a865)]:
  - @shopify/hydrogen@2024.7.9

## 2024.7.9

### Patch Changes

- Updated dependencies [[`f3363030`](https://github.com/Shopify/hydrogen/commit/f3363030a50bd24d946427e01b88ba77253a6cc9), [`bb5b0979`](https://github.com/Shopify/hydrogen/commit/bb5b0979ddffb007111885b3a9b7aa490a3c6882)]:
  - @shopify/hydrogen@2024.7.8
  - @shopify/remix-oxygen@2.0.8

## 2024.7.8

### Patch Changes

- Updated dependencies [[`39f8f8fd`](https://github.com/Shopify/hydrogen/commit/39f8f8fd42766d02c6e98f8090608e641db9f002)]:
  - @shopify/hydrogen@2024.7.7

## 2024.7.7

### Patch Changes

- Updated dependencies [[`d0ff37a9`](https://github.com/Shopify/hydrogen/commit/d0ff37a995bb64598930f8aa53f2612f3b1ea476)]:
  - @shopify/hydrogen@2024.7.6

## 2024.7.6

### Patch Changes

- Update Shopify CLI and cli-kit dependencies to 3.66.1 ([#2512](https://github.com/Shopify/hydrogen/pull/2512)) by [@frandiox](https://github.com/frandiox)

- createCartHandler supplies updateGiftCardCodes method ([#2298](https://github.com/Shopify/hydrogen/pull/2298)) by [@wizardlyhel](https://github.com/wizardlyhel)

- Fix menu links in side panel not working on mobile devices ([#2450](https://github.com/Shopify/hydrogen/pull/2450)) by [@wizardlyhel](https://github.com/wizardlyhel)

  \`\`\`diff
  // /app/components/Header.tsx

  export function HeaderMenu({
    menu,
    primaryDomainUrl,
    viewport,
    publicStoreDomain,
  }: {
    menu: HeaderProps['header']['menu'];
    primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
    viewport: Viewport;
    publicStoreDomain: HeaderProps['publicStoreDomain'];
  }) {
    const className = `header-menu-${viewport}`;
  +  const {close} = useAside();

  -  function closeAside(event: React.MouseEvent<HTMLAnchorElement>) {
  -    if (viewport === 'mobile') {
  -      event.preventDefault();
  -      window.location.href = event.currentTarget.href;
  -    }
  -  }

    return (
      <nav className={className} role="navigation">
        {viewport === 'mobile' && (
          <NavLink
            end
  -          onClick={closeAside}
  +          onClick={close}
            prefetch="intent"
            style={activeLinkStyle}
            to="/"
          >
            Home
          </NavLink>
        )}
        {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
          if (!item.url) return null;

          // if the url is internal, we strip the domain
          const url =
            item.url.includes('myshopify.com') ||
            item.url.includes(publicStoreDomain) ||
            item.url.includes(primaryDomainUrl)
              ? new URL(item.url).pathname
              : item.url;
          return (
            <NavLink
              className="header-menu-item"
              end
              key={item.id}
  -            onClick={closeAside}
  +            onClick={close}
              prefetch="intent"
              style={activeLinkStyle}
              to={url}
            >
              {item.title}
            </NavLink>
          );
        })}
      </nav>
    );
  }
  \`\`\`

- Add localization support to consent privacy banner ([#2457](https://github.com/Shopify/hydrogen/pull/2457)) by [@juanpprieto](https://github.com/juanpprieto)

- Updated dependencies [[`d633e49a`](https://github.com/Shopify/hydrogen/commit/d633e49aff244a985c58ec77fc2796c9c1cd5df4), [`1b217cd6`](https://github.com/Shopify/hydrogen/commit/1b217cd68ffd5362d201d4bd225ec72e99713461), [`d929b561`](https://github.com/Shopify/hydrogen/commit/d929b5612ec28e53ec216844add33682f131aba7), [`664a09d5`](https://github.com/Shopify/hydrogen/commit/664a09d57ef5d3c67da947a4e8546527c01e37c4), [`0c1e511d`](https://github.com/Shopify/hydrogen/commit/0c1e511df72e9605534bb9c960e86d5c9a4bf2ea), [`eefa8203`](https://github.com/Shopify/hydrogen/commit/eefa820383fa93657ca214991f6099ce9268a4ee)]:
  - @shopify/hydrogen@2024.7.5
  - @shopify/remix-oxygen@2.0.7

## 2024.7.5

### Patch Changes

- Updated dependencies [[`b0d3bc06`](https://github.com/Shopify/hydrogen/commit/b0d3bc0696d266fcfc4eb93d0a4adb9ccb56ade6)]:
  - @shopify/hydrogen@2024.7.4

## 2024.7.4

### Patch Changes

- Search & Predictive Search improvements ([#2363](https://github.com/Shopify/hydrogen/pull/2363)) by [@juanpprieto](https://github.com/juanpprieto)

- 1. Create a app/lib/context file and use `createHydrogenContext` in it. ([#2333](https://github.com/Shopify/hydrogen/pull/2333)) by [@michenly](https://github.com/michenly)

  \`\`\`.ts
  // in app/lib/context

  import {createHydrogenContext} from '@shopify/hydrogen';

  export async function createAppLoadContext(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ) {
      const hydrogenContext = createHydrogenContext({
        env,
        request,
        cache,
        waitUntil,
        session,
        i18n: {language: 'EN', country: 'US'},
        cart: {
          queryFragment: CART_QUERY_FRAGMENT,
        },
        // ensure to overwrite any options that is not using the default values from your server.ts
      });

    return {
      ...hydrogenContext,
      // declare additional Remix loader context
    };
  }

  \`\`\`

  2. Use `createAppLoadContext` method in server.ts Ensure to overwrite any options that is not using the default values in `createHydrogenContext`.

  \`\`\`diff
  // in server.ts

  - import {
  -   createCartHandler,
  -   createStorefrontClient,
  -   createCustomerAccountClient,
  - } from '@shopify/hydrogen';
  + import {createAppLoadContext} from '~/lib/context';

  export default {
    async fetch(
      request: Request,
      env: Env,
      executionContext: ExecutionContext,
    ): Promise<Response> {

  -   const {storefront} = createStorefrontClient(
  -     ...
  -   );

  -   const customerAccount = createCustomerAccountClient(
  -     ...
  -   );

  -   const cart = createCartHandler(
  -     ...
  -   );

  +   const appLoadContext = await createAppLoadContext(
  +      request,
  +      env,
  +      executionContext,
  +   );

      /**
        * Create a Remix request handler and pass
        * Hydrogen's Storefront client to the loader context.
        */
      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
  -      getLoadContext: (): AppLoadContext => ({
  -        session,
  -        storefront,
  -        customerAccount,
  -        cart,
  -        env,
  -        waitUntil,
  -      }),
  +      getLoadContext: () => appLoadContext,
      });
    }
  \`\`\`

  3. Use infer type for AppLoadContext in env.d.ts

  \`\`\`diff
  // in env.d.ts

  + import type {createAppLoadContext} from '~/lib/context';

  + interface AppLoadContext extends Awaited<ReturnType<typeof createAppLoadContext>> {
  - interface AppLoadContext {
  -  env: Env;
  -  cart: HydrogenCart;
  -  storefront: Storefront;
  -  customerAccount: CustomerAccount;
  -  session: AppSession;
  -  waitUntil: ExecutionContext['waitUntil'];
  }

  \`\`\`

- Use type `HydrogenEnv` for all the env.d.ts ([#2333](https://github.com/Shopify/hydrogen/pull/2333)) by [@michenly](https://github.com/michenly)

  \`\`\`diff
  // in env.d.ts

  + import type {HydrogenEnv} from '@shopify/hydrogen';

  + interface Env extends HydrogenEnv {}
  - interface Env {
  -   SESSION_SECRET: string;
  -  PUBLIC_STOREFRONT_API_TOKEN: string;
  -  PRIVATE_STOREFRONT_API_TOKEN: string;
  -  PUBLIC_STORE_DOMAIN: string;
  -  PUBLIC_STOREFRONT_ID: string;
  -  PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID: string;
  -  PUBLIC_CUSTOMER_ACCOUNT_API_URL: string;
  -  PUBLIC_CHECKOUT_DOMAIN: string;
  - }

  \`\`\`

- Add a hydration check for google web cache. This prevents an infinite redirect when viewing the cached version of a hydrogen site on Google. ([#2334](https://github.com/Shopify/hydrogen/pull/2334)) by [@blittle](https://github.com/blittle)

  Update your entry.server.jsx file to include this check:

  \`\`\`diff
  + if (!window.location.origin.includes("webcache.googleusercontent.com")) {
     startTransition(() => {
       hydrateRoot(
         document,
         <StrictMode>
           <RemixBrowser />
         </StrictMode>
       );
     });
  + }
  \`\`\`

- Updated dependencies [[`a2d9acf9`](https://github.com/Shopify/hydrogen/commit/a2d9acf95e019c39df0b10f4841a1d809b810c80), [`c0d7d917`](https://github.com/Shopify/hydrogen/commit/c0d7d9176c80b996064d8e897876f954807c7640), [`b09e9a4c`](https://github.com/Shopify/hydrogen/commit/b09e9a4ca7b931e48462c2d174ca9f67c37f1da2), [`c204eacf`](https://github.com/Shopify/hydrogen/commit/c204eacf0273f625109523ee81053cdc0c4de7e1), [`bf4e3d3c`](https://github.com/Shopify/hydrogen/commit/bf4e3d3c00744a066b50250a12e4f3c675691811), [`20a8e63b`](https://github.com/Shopify/hydrogen/commit/20a8e63b5fd1c8acadda7612c5d4cc411e0c5932), [`6e5d8ea7`](https://github.com/Shopify/hydrogen/commit/6e5d8ea71a2639925d5817b662af26a6b2ba3c6d), [`7c4f67a6`](https://github.com/Shopify/hydrogen/commit/7c4f67a684ad31edea10d1407d00201bbaaa9822), [`dfb9be77`](https://github.com/Shopify/hydrogen/commit/dfb9be7721c7d10cf4354fda60db4e666625518e), [`31ea19e8`](https://github.com/Shopify/hydrogen/commit/31ea19e8957dbc4487314b014a14920444d37f78)]:
  - @shopify/cli-hydrogen@8.4.0
  - @shopify/hydrogen@2024.7.3
  - @shopify/remix-oxygen@2.0.6

## 2024.7.3

### Patch Changes

- Updated dependencies [[`150854ed`](https://github.com/Shopify/hydrogen/commit/150854ed1352245eef180cc6b2bceb41dd8cc898)]:
  - @shopify/hydrogen@2024.7.2

## 2024.7.2

### Patch Changes

- Changed the GraphQL config file format to be TS/JS instead of YAML. ([#2311](https://github.com/Shopify/hydrogen/pull/2311)) by [@frandiox](https://github.com/frandiox)

- Updated dependencies [[`18ea233c`](https://github.com/Shopify/hydrogen/commit/18ea233cd327bf3001ec9b107ad66b05c9c78584), [`8b2322d7`](https://github.com/Shopify/hydrogen/commit/8b2322d783078298cd5d20ec5f3b1faf99b7895b)]:
  - @shopify/cli-hydrogen@8.3.0

## 2024.7.1

### Patch Changes

- Update `@shopify/oxygen-workers-types` to fix issues on Windows. ([#2252](https://github.com/Shopify/hydrogen/pull/2252)) by [@michenly](https://github.com/michenly)

- [**Breaking change**] ([#2113](https://github.com/Shopify/hydrogen/pull/2113)) by [@blittle](https://github.com/blittle)

  Previously the `VariantSelector` component would filter out options that only had one value. This is undesireable for some apps. We've removed that filter, if you'd like to retain the existing functionality, simply filter the options prop before it is passed to the `VariantSelector` component:

  \`\`\`diff
   <VariantSelector
     handle={product.handle}
  +  options={product.options.filter((option) => option.values.length > 1)}
  -  options={product.options}
     variants={variants}>
   </VariantSelector>
  \`\`\`

  Fixes [#1198](https://github.com/Shopify/hydrogen/discussions/1198)

- Update remix to v2.10.1 ([#2290](https://github.com/Shopify/hydrogen/pull/2290)) by [@michenly](https://github.com/michenly)

- Update root to use [Remix's Layout Export pattern](https://remix.run/docs/en/main/file-conventions/root#layout-export) and eliminate the use of `useLoaderData` in root. ([#2292](https://github.com/Shopify/hydrogen/pull/2292)) by [@michenly](https://github.com/michenly)

  The diff below showcase how you can make this refactor in existing application.

  \`\`\`diff
  import {
    Outlet,
  -  useLoaderData,
  +  useRouteLoaderData,
  } from '@remix-run/react';
  -import {Layout} from '~/components/Layout';
  +import {PageLayout} from '~/components/PageLayout';

  -export default function App() {
  +export function Layout({children}: {children?: React.ReactNode}) {
    const nonce = useNonce();
  -  const data = useLoaderData<typeof loader>();
  +  const data = useRouteLoaderData<typeof loader>('root');

    return (
      <html>
      ...
        <body>
  -        <Layout {...data}>
  -          <Outlet />
  -        </Layout>
  +        {data? (
  +          <PageLayout {...data}>{children}</PageLayout>
  +         ) : (
  +          children
  +        )}
        </body>
      </html>
    );
  }

  +export default function App() {
  +  return <Outlet />;
  +}

  export function ErrorBoundary() {
  - const rootData = useLoaderData<typeof loader>();

    return (
  -    <html>
  -    ...
  -      <body>
  -        <Layout {...rootData}>
  -          <div className="route-error">
  -            <h1>Error</h1>
  -            ...
  -          </div>
  -        </Layout>
  -      </body>
  -    </html>
  +    <div className="route-error">
  +      <h1>Error</h1>
  +      ...
  +    </div>
    );
  }

  \`\`\`

- Refactor the cart and product form components ([#2132](https://github.com/Shopify/hydrogen/pull/2132)) by [@blittle](https://github.com/blittle)

- Remove manual setting of session in headers and recommend setting it in server after response is created. ([#2137](https://github.com/Shopify/hydrogen/pull/2137)) by [@michenly](https://github.com/michenly)

  Step 1: Add `isPending` implementation in session

  \`\`\`diff
  // in app/lib/session.ts
  export class AppSession implements HydrogenSession {
  +  public isPending = false;

    get unset() {
  +    this.isPending = true;
      return this.#session.unset;
    }

    get set() {
  +    this.isPending = true;
      return this.#session.set;
    }

    commit() {
  +    this.isPending = false;
      return this.#sessionStorage.commitSession(this.#session);
    }
  }
  \`\`\`

  Step 2: update response header if `session.isPending` is true

  \`\`\`diff
  // in server.ts
  export default {
    async fetch(request: Request): Promise<Response> {
      try {
        const response = await handleRequest(request);

  +      if (session.isPending) {
  +        response.headers.set('Set-Cookie', await session.commit());
  +      }

        return response;
      } catch (error) {
        ...
      }
    },
  };
  \`\`\`

  Step 3: remove setting cookie with session.commit() in routes

  \`\`\`diff
  // in route files
  export async function loader({context}: LoaderFunctionArgs) {
    return json({},
  -    {
  -      headers: {
  -        'Set-Cookie': await context.session.commit(),
  -      },
      },
    );
  }
  \`\`\`

- Moved `@shopify/cli` from `dependencies` to `devDependencies`. ([#2312](https://github.com/Shopify/hydrogen/pull/2312)) by [@frandiox](https://github.com/frandiox)

- The `@shopify/cli` package now bundles the `@shopify/cli-hydrogen` plugin. Therefore, you can now remove the latter from your local dependencies: ([#2306](https://github.com/Shopify/hydrogen/pull/2306)) by [@frandiox](https://github.com/frandiox)

  \`\`\`diff
      "@shopify/cli": "3.64.0",
  -   "@shopify/cli-hydrogen": "^8.1.1",
      "@shopify/hydrogen": "2024.7.0",
  \`\`\`

- Updated dependencies [[`a0e84d76`](https://github.com/Shopify/hydrogen/commit/a0e84d76b67d4c57c4defee06185949c41782eab), [`426bb390`](https://github.com/Shopify/hydrogen/commit/426bb390b25f51e57499ff6673aef70ded935e87), [`4337200c`](https://github.com/Shopify/hydrogen/commit/4337200c7908d56c039171c283a4d92c31a8b7b6), [`710625c7`](https://github.com/Shopify/hydrogen/commit/710625c740a6656488d4b419e2d2451bef9d076f), [`8b9c726d`](https://github.com/Shopify/hydrogen/commit/8b9c726d34f3482b5b5a0da4c7c0c2f20e2c9caa), [`10a419bf`](https://github.com/Shopify/hydrogen/commit/10a419bf1db79cdfd8c41c0223ce695959f60da9), [`6a6278bb`](https://github.com/Shopify/hydrogen/commit/6a6278bb9187b3b5a98cd98ec9dd278882d03c0d), [`66236ca6`](https://github.com/Shopify/hydrogen/commit/66236ca65ddefac99eaa553c7877c85863d84cc2), [`dcbd0bbf`](https://github.com/Shopify/hydrogen/commit/dcbd0bbf4073a3e35e96f3cce257f7b19b2b2aea), [`a5e03e2a`](https://github.com/Shopify/hydrogen/commit/a5e03e2a1e99fcd83ee5a2be7bf6f5f6b47984b3), [`c2690653`](https://github.com/Shopify/hydrogen/commit/c2690653b6b24f7318e9088551a37195255a2247), [`54c2f7ad`](https://github.com/Shopify/hydrogen/commit/54c2f7ad3d0d52e6be10b2a54a1a4fd0cc107a35), [`4337200c`](https://github.com/Shopify/hydrogen/commit/4337200c7908d56c039171c283a4d92c31a8b7b6), [`e96b332b`](https://github.com/Shopify/hydrogen/commit/e96b332ba1aba79aa3d5c2ce18001292070faf49), [`f3065371`](https://github.com/Shopify/hydrogen/commit/f3065371c1dda222c6e40bd8c20528dc9fdea9a5), [`6cd5554b`](https://github.com/Shopify/hydrogen/commit/6cd5554b160d314d35964a5ee8976ed60972bf17), [`9eb60d73`](https://github.com/Shopify/hydrogen/commit/9eb60d73e552c3d22b9325ecbcd5878810893ad3), [`e432533e`](https://github.com/Shopify/hydrogen/commit/e432533e7391ec3fe16a4a24f2b3363206842580), [`de3f70be`](https://github.com/Shopify/hydrogen/commit/de3f70be1a838eda746903cbb38cc25cf0e09fa3), [`83cb96f4`](https://github.com/Shopify/hydrogen/commit/83cb96f42078bf79b20a153d8a8461f75d573ab1)]:
  - @shopify/remix-oxygen@2.0.5
  - @shopify/cli-hydrogen@8.2.0
  - @shopify/hydrogen@2024.7.1

## 2024.4.5

### Patch Changes

- Update remix to v2.9.2 ([#2135](https://github.com/Shopify/hydrogen/pull/2135)) by [@michenly](https://github.com/michenly)

- `<Analytics>` and `useAnalytics` are now stable. ([#2141](https://github.com/Shopify/hydrogen/pull/2141)) by [@wizardlyhel](https://github.com/wizardlyhel)

- Update the skeleton template to use React state in the aside dialogs ([#2088](https://github.com/Shopify/hydrogen/pull/2088)) by [@blittle](https://github.com/blittle)

- Updated dependencies [[`fe82119f`](https://github.com/Shopify/hydrogen/commit/fe82119f5e75df5a0f727bab6a2186e679abc73d), [`32d4c33e`](https://github.com/Shopify/hydrogen/commit/32d4c33e4421a9c56f62a8c392f5417edddd0402), [`8eea75ec`](https://github.com/Shopify/hydrogen/commit/8eea75ec5ead4de98d7d1b2baedce8511029bcae), [`27e51abf`](https://github.com/Shopify/hydrogen/commit/27e51abfc1f5444afa952c503886bfa12fc55c7e), [`f29c9085`](https://github.com/Shopify/hydrogen/commit/f29c9085eb1adbde9e01226484eba8a85b5074ed), [`7b838beb`](https://github.com/Shopify/hydrogen/commit/7b838beb7c43380ffc9c32c2bb9f34291912fa42), [`d702aec2`](https://github.com/Shopify/hydrogen/commit/d702aec2214646a78cdafc2c25d510489db73f6d), [`ca4cf045`](https://github.com/Shopify/hydrogen/commit/ca4cf045f7fb72ad98b62af7bd172ff8cf553de2), [`5a554b2e`](https://github.com/Shopify/hydrogen/commit/5a554b2e9d91894c2db8032f0c29666dce1ea3f2), [`27e51abf`](https://github.com/Shopify/hydrogen/commit/27e51abfc1f5444afa952c503886bfa12fc55c7e), [`5d6465b3`](https://github.com/Shopify/hydrogen/commit/5d6465b32d90052e5580fcb81d98427bcb8ad528), [`608389d6`](https://github.com/Shopify/hydrogen/commit/608389d6d69c6a9801935d528507c165d1dd4ccf), [`9dfd1cfe`](https://github.com/Shopify/hydrogen/commit/9dfd1cfeb3e96c6d3426427a4b5d97ef475dab6d), [`7def3e9f`](https://github.com/Shopify/hydrogen/commit/7def3e9fa6e28f4fde7af43e2f346aa32267c38e), [`65239c76`](https://github.com/Shopify/hydrogen/commit/65239c76ca1d0b294b59b1ad53624485859c4da5), [`ca7f2888`](https://github.com/Shopify/hydrogen/commit/ca7f28887367a4882e57a67c4e248b0f0bba1c9b)]:
  - @shopify/hydrogen@2024.4.3
  - @shopify/cli-hydrogen@8.1.0

## 2024.4.4

### Patch Changes

- Add JSdoc to `getSelectedProductOptions` utility and cleanup the skeleton implementation ([#2089](https://github.com/Shopify/hydrogen/pull/2089)) by [@juanpprieto](https://github.com/juanpprieto)

- Updated dependencies [[`286589ee`](https://github.com/Shopify/hydrogen/commit/286589ee281c161ad323e3d45a8b9b859aa5b11f), [`6f5061d9`](https://github.com/Shopify/hydrogen/commit/6f5061d9432f749fde7902548894e98c0d3f899c), [`ae262b61`](https://github.com/Shopify/hydrogen/commit/ae262b616127a7173d23a1a38a6e658af3105ce8), [`2c11ca3b`](https://github.com/Shopify/hydrogen/commit/2c11ca3b7a00ccca2b621dbc29abd319f9598cc8), [`b70f9c2c`](https://github.com/Shopify/hydrogen/commit/b70f9c2c3db8e863c65509097454b9ad7c81cd52), [`17528db1`](https://github.com/Shopify/hydrogen/commit/17528db1eb3d1baa001bafe0684b4bce28d2e271), [`58ea9bb0`](https://github.com/Shopify/hydrogen/commit/58ea9bb0f0eee83ff89e34e2f1f6ac3c4999e213)]:
  - @shopify/cli-hydrogen@8.0.4
  - @shopify/hydrogen@2024.4.2

## 1.0.10

### Patch Changes

- Update `@shopify/cli` dependency to avoid React version mismatches in your project: ([#2059](https://github.com/Shopify/hydrogen/pull/2059)) by [@frandiox](https://github.com/frandiox)

  \`\`\`diff
    "dependencies": {
      ...
  -   "@shopify/cli": "3.58.0",
  +   "@shopify/cli": "3.59.2",
      ...
    }
  \`\`\`

- Updated dependencies [[`d2bc720b`](https://github.com/Shopify/hydrogen/commit/d2bc720bb5f7cfb5f42617f98ad2dfcd29891f4b)]:
  - @shopify/cli-hydrogen@8.0.3

## 1.0.9

### Patch Changes

- Pin React dependency to 18.2.0 to avoid mismatches. ([#2051](https://github.com/Shopify/hydrogen/pull/2051)) by [@frandiox](https://github.com/frandiox)

- Updated dependencies [[`9c36c8a5`](https://github.com/Shopify/hydrogen/commit/9c36c8a566b1ae2ceac4846c4c9fe4f63f6f4ab3)]:
  - @shopify/cli-hydrogen@8.0.2

## 1.0.8

### Patch Changes

- Stop inlining the favicon in base64 to avoid issues with the Content-Security-Policy. In `vite.config.js`: ([#2006](https://github.com/Shopify/hydrogen/pull/2006)) by [@frandiox](https://github.com/frandiox)

  \`\`\`diff
  export default defineConfig({
    plugins: [
      ...
    ],
  + build: {
  +   assetsInlineLimit: 0,
  + },
  });
  \`\`\`

- To improve HMR in Vite, move the `useRootLoaderData` function from `app/root.tsx` to a separate file like `app/lib/root-data.ts`. This change avoids circular imports: ([#2014](https://github.com/Shopify/hydrogen/pull/2014)) by [@frandiox](https://github.com/frandiox)

  \`\`\`tsx
  // app/lib/root-data.ts
  import {useMatches} from '@remix-run/react';
  import type {SerializeFrom} from '@shopify/remix-oxygen';
  import type {loader} from '~/root';

  /**
   * Access the result of the root loader from a React component.
   */
  export const useRootLoaderData = () => {
    const [root] = useMatches();
    return root?.data as SerializeFrom<typeof loader>;
  };
  \`\`\`

  Import this hook from `~/lib/root-data` instead of `~/root` in your components.

- Updated dependencies [[`b4dfda32`](https://github.com/Shopify/hydrogen/commit/b4dfda320ca52855b2d4493a4306d15a883ca843), [`ffa57bdb`](https://github.com/Shopify/hydrogen/commit/ffa57bdbcdf51e03d565736f9388b5bb4f46292c), [`ac4e1670`](https://github.com/Shopify/hydrogen/commit/ac4e1670f0361a2cd2c6827e4162bbbee0ca37f3), [`0af624d5`](https://github.com/Shopify/hydrogen/commit/0af624d51afc7250db889ba5e736c85a6070c8b2), [`9723eaf3`](https://github.com/Shopify/hydrogen/commit/9723eaf3e5a42c30e657d1cadb123ed775d620e4), [`e842f68c`](https://github.com/Shopify/hydrogen/commit/e842f68c8e879d4c54e0730f3cb55214a760d7f5)]:
  - @shopify/cli-hydrogen@8.0.1
  - @shopify/hydrogen@2024.4.1

## 1.0.7

### Patch Changes

- Update internal libraries for parsing `.env` files. ([#1946](https://github.com/Shopify/hydrogen/pull/1946)) by [@aswamy](https://github.com/aswamy)

  Please update the `@shopify/cli` dependency in your app to avoid duplicated subdependencies:

  \`\`\`diff
  "dependencies": {
  -   "@shopify/cli": "3.56.3",
  +   "@shopify/cli": "3.58.0",
  }
  \`\`\`

- Add Adds magic Catalog route ([#1967](https://github.com/Shopify/hydrogen/pull/1967)) by [@juanpprieto](https://github.com/juanpprieto)

- Update Vite plugin imports, and how their options are passed to Remix: ([#1935](https://github.com/Shopify/hydrogen/pull/1935)) by [@frandiox](https://github.com/frandiox)

  \`\`\`diff
  -import {hydrogen, oxygen} from '@shopify/cli-hydrogen/experimental-vite';
  +import {hydrogen} from '@shopify/hydrogen/vite';
  +import {oxygen} from '@shopify/mini-oxygen/vite';
  import {vitePlugin as remix} from '@remix-run/dev';

  export default defineConfig({
      hydrogen(),
      oxygen(),
      remix({
  -     buildDirectory: 'dist',
  +     presets: [hydrogen.preset()],
        future: {
  \`\`\`

- Add `@shopify/mini-oxygen` as a dev dependency for local development: ([#1891](https://github.com/Shopify/hydrogen/pull/1891)) by [@frandiox](https://github.com/frandiox)

  \`\`\`diff
    "devDependencies": {
      "@remix-run/dev": "^2.8.0",
      "@remix-run/eslint-config": "^2.8.0",
  +   "@shopify/mini-oxygen": "^3.0.0",
      "@shopify/oxygen-workers-types": "^4.0.0",
      ...
    },
  \`\`\`

- Add the `customer-account push` command to the Hydrogen CLI. This allows you to push the current `--dev-origin` URL to the Shopify admin to enable secure connection to the Customer Account API for local development. ([#1804](https://github.com/Shopify/hydrogen/pull/1804)) by [@michenly](https://github.com/michenly)

- Fix types returned by the `session` object. ([#1869](https://github.com/Shopify/hydrogen/pull/1869)) by [@frandiox](https://github.com/frandiox)

  In `remix.env.d.ts` or `env.d.ts`, add the following types:

  \`\`\`diff
  import type {
    // ...
    HydrogenCart,
  + HydrogenSessionData,
  } from '@shopify/hydrogen';

  // ...

  declare module '@shopify/remix-oxygen' {
    // ...

  + interface SessionData extends HydrogenSessionData {}
  }
  \`\`\`

- Codegen dependencies must be now listed explicitly in `package.json`: ([#1962](https://github.com/Shopify/hydrogen/pull/1962)) by [@frandiox](https://github.com/frandiox)

  \`\`\`diff
  {
    "devDependencies": {
  +   "@graphql-codegen/cli": "5.0.2",
      "@remix-run/dev": "^2.8.0",
      "@remix-run/eslint-config": "^2.8.0",
  +   "@shopify/hydrogen-codegen": "^0.3.0",
      "@shopify/mini-oxygen": "^2.2.5",
      "@shopify/oxygen-workers-types": "^4.0.0",
      ...
    }
  }
  \`\`\`

- Updated dependencies [[`4eaec272`](https://github.com/Shopify/hydrogen/commit/4eaec272696f1a718aa7cab1070a54385ebc3686), [`14bb5df1`](https://github.com/Shopify/hydrogen/commit/14bb5df1c1513a7991183d34e72220cb2b139cf5), [`646b78d4`](https://github.com/Shopify/hydrogen/commit/646b78d4bc26310121b16000ed4d1c5d5e63957d), [`87072950`](https://github.com/Shopify/hydrogen/commit/870729505f7eb1f1c709799dd036ad02fd94be95), [`5f1295fe`](https://github.com/Shopify/hydrogen/commit/5f1295fe60b86396f364fefef339248a444c988a), [`3c8a7313`](https://github.com/Shopify/hydrogen/commit/3c8a7313cafb0ca21bbca19ac0b3f8ef4ab12655), [`ca1dcbb7`](https://github.com/Shopify/hydrogen/commit/ca1dcbb7d69c458006e25892c86c4478d394a428), [`11879b17`](https://github.com/Shopify/hydrogen/commit/11879b175d78e3326de090a56a044d1e55d0bae8), [`f4d6e5b0`](https://github.com/Shopify/hydrogen/commit/f4d6e5b0244392a7c13b9fa51c5046fd103c3e4f), [`788d86b3`](https://github.com/Shopify/hydrogen/commit/788d86b3a737bff53b4ec3aa9667458b2d45ade7), [`ebaf5529`](https://github.com/Shopify/hydrogen/commit/ebaf5529287b24a70b3146444b18f95b64f9f336), [`da95bb1c`](https://github.com/Shopify/hydrogen/commit/da95bb1c8c644f450053ce649b40dc380e7375dc), [`5bb43304`](https://github.com/Shopify/hydrogen/commit/5bb43304c08427786cfd4f2529e59bd38f593252), [`140e4768`](https://github.com/Shopify/hydrogen/commit/140e4768c880aaed4ba95b1d4c707df6963e011c), [`062d6be7`](https://github.com/Shopify/hydrogen/commit/062d6be7e031c388498ec3d359de51a4bfdfdfd8), [`b3323e59`](https://github.com/Shopify/hydrogen/commit/b3323e59a4381647f1df797c5dc54793f6e0a29a), [`ab0df5a5`](https://github.com/Shopify/hydrogen/commit/ab0df5a52bc587515880ae26f4edd18ba2be83cd), [`ebaf5529`](https://github.com/Shopify/hydrogen/commit/ebaf5529287b24a70b3146444b18f95b64f9f336), [`ebaf5529`](https://github.com/Shopify/hydrogen/commit/ebaf5529287b24a70b3146444b18f95b64f9f336), [`9e899218`](https://github.com/Shopify/hydrogen/commit/9e8992181ce7d27548d35f98b5a4f78b80795ce8), [`a209019f`](https://github.com/Shopify/hydrogen/commit/a209019f722ece4b65f8d5f37c8018c949956b1e), [`d007b7bc`](https://github.com/Shopify/hydrogen/commit/d007b7bc6f6c36e984d937108230ecc7c202fa42), [`a5511cd7`](https://github.com/Shopify/hydrogen/commit/a5511cd7bf9b0f0c4ef0e52cd72418f78c04785b), [`4afedb4d`](https://github.com/Shopify/hydrogen/commit/4afedb4d7202715df9a153e877e8eb281cc3e928), [`34fbae23`](https://github.com/Shopify/hydrogen/commit/34fbae23999eefbd1af1dff44816a52813d75b44), [`e3baaba5`](https://github.com/Shopify/hydrogen/commit/e3baaba54c701a48923ab3fe8078278f2db2c53f), [`99d72f7a`](https://github.com/Shopify/hydrogen/commit/99d72f7afc354abb66ed0e4ffb020bede2781286), [`9351f9f5`](https://github.com/Shopify/hydrogen/commit/9351f9f564267124bcbf986f5550a542c4bf1e30)]:
  - @shopify/cli-hydrogen@8.0.0
  - @shopify/hydrogen@2024.4.0
  - @shopify/remix-oxygen@2.0.4

## 1.0.6

### Patch Changes

- Improve performance of predictive search: ([#1823](https://github.com/Shopify/hydrogen/pull/1823)) by [@frandiox](https://github.com/frandiox)
  - Change the request to be GET instead of POST to avoid Remix route revalidations.
  - Add Cache-Control headers to the response to get quicker results when typing.

  Aside from that, it now shows a loading state when fetching the results instead of "No results found.".

- Updated dependencies [[`351b3c1b`](https://github.com/Shopify/hydrogen/commit/351b3c1b7768870793ff072ba91426107ba0180c), [`5060cf57`](https://github.com/Shopify/hydrogen/commit/5060cf57f69d8391b425b54acaa487af1f7405ae), [`2888014e`](https://github.com/Shopify/hydrogen/commit/2888014e54fab72c150e9eca55df3c6dd789503e)]:
  - @shopify/hydrogen@2024.1.4
  - @shopify/cli-hydrogen@7.1.2

## 1.0.5

### Patch Changes

- Update the `@shopify/cli` dependency: ([#1786](https://github.com/Shopify/hydrogen/pull/1786)) by [@frandiox](https://github.com/frandiox)

  \`\`\`diff
  - "@shopify/cli": "3.52.0",
  + "@shopify/cli": "3.56.3",
  \`\`\`

- Update Remix and associated packages to 2.8.0. ([#1781](https://github.com/Shopify/hydrogen/pull/1781)) by [@frandiox](https://github.com/frandiox)

  \`\`\`diff
  "dependencies": {
  -  "@remix-run/react": "^2.6.0",
  -  "@remix-run/server-runtime": "^2.6.0",
  +  "@remix-run/react": "^2.8.0",
  +  "@remix-run/server-runtime": "^2.8.0",
      //...
    },
    "devDependencies": {
  -   "@remix-run/dev": "^2.6.0",
  -   "@remix-run/eslint-config": "^2.6.0",
  +  "@remix-run/dev": "^2.8.0",
  +  "@remix-run/eslint-config": "^2.8.0",
      //...
    },
  \`\`\`

- Updated dependencies [[`ced1d4cb`](https://github.com/Shopify/hydrogen/commit/ced1d4cb5b1eeeb4303449eb1d60aac44f33480e), [`fc013401`](https://github.com/Shopify/hydrogen/commit/fc013401c5727948b602c9c6b6963a2df21cbd38), [`e641255e`](https://github.com/Shopify/hydrogen/commit/e641255eccc5783b41c8fabbc88313a610f539d0), [`d7e04cb6`](https://github.com/Shopify/hydrogen/commit/d7e04cb6a33d40ea86fa8ac2712d7a5ea785de2d), [`eedd9c49`](https://github.com/Shopify/hydrogen/commit/eedd9c497b36aba47a641cecbc710e18f5b14e46)]:
  - @shopify/cli-hydrogen@7.1.1
  - @shopify/hydrogen@2024.1.3

## 1.0.4

### Patch Changes

- This is an important fix to a bug with 404 routes and path-based i18n projects where some unknown routes would not properly render a 404. This fixes all new projects, but to fix existing projects, add a `($locale).tsx` route with the following contents: ([#1732](https://github.com/Shopify/hydrogen/pull/1732)) by [@blittle](https://github.com/blittle)

  \`\`\`ts
  import {type LoaderFunctionArgs} from '@remix-run/server-runtime';

  export async function loader({params, context}: LoaderFunctionArgs) {
    const {language, country} = context.storefront.i18n;

    if (
      params.locale &&
      params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
    ) {
      // If the locale URL param is defined, yet we still are still at the default locale
      // then the the locale param must be invalid, send to the 404 page
      throw new Response(null, {status: 404});
    }

    return null;
  }
  \`\`\`

- Add defensive null checks to the default cart implementation in the starter template ([#1746](https://github.com/Shopify/hydrogen/pull/1746)) by [@blittle](https://github.com/blittle)

- 🐛 Fix issue where customer login does not persist to checkout ([#1719](https://github.com/Shopify/hydrogen/pull/1719)) by [@michenly](https://github.com/michenly)

  ✨ Add `customerAccount` option to `createCartHandler`. Where a `?logged_in=true` will be added to the checkoutUrl for cart query if a customer is logged in.

- Updated dependencies [[`faeba9f8`](https://github.com/Shopify/hydrogen/commit/faeba9f8947d6b9420b33274a0f39b62418ff2e5), [`6d585026`](https://github.com/Shopify/hydrogen/commit/6d585026623204e99d54a5f2efa3d1c74f690bb6), [`fcecfb23`](https://github.com/Shopify/hydrogen/commit/fcecfb2307210b9d73a7cc90ba865508937217ba), [`28864d6f`](https://github.com/Shopify/hydrogen/commit/28864d6ffbb19b62a5fb8f4c9bbe27568de62411), [`c0ec7714`](https://github.com/Shopify/hydrogen/commit/c0ec77141fb1d7a713d91219b8777bc541780ae8), [`226cf478`](https://github.com/Shopify/hydrogen/commit/226cf478a5bdef1cca33fe8f69832ae0e557d9d9), [`06d9fd91`](https://github.com/Shopify/hydrogen/commit/06d9fd91140bd52a8ee41a20bc114ce2e7fb67dc)]:
  - @shopify/cli-hydrogen@7.1.0
  - @shopify/hydrogen@2024.1.2

## 1.0.3

### Patch Changes

- ♻️ `CustomerClient` type is deprecated and replaced by `CustomerAccount` ([#1692](https://github.com/Shopify/hydrogen/pull/1692)) by [@michenly](https://github.com/michenly)

- Updated dependencies [[`02798786`](https://github.com/Shopify/hydrogen/commit/02798786bf8ae5c53f6430723a86d62b8e94d120), [`52b15df4`](https://github.com/Shopify/hydrogen/commit/52b15df457ce723bbc83ad594ded73a7b06447d6), [`a2664362`](https://github.com/Shopify/hydrogen/commit/a2664362a7d89b34835553a9b0eb7af55ca70ae4), [`eee5d927`](https://github.com/Shopify/hydrogen/commit/eee5d9274b72404dfb0ffef30d5503fd553be5fe), [`c7b2017f`](https://github.com/Shopify/hydrogen/commit/c7b2017f11a2cb4d280dfd8f170e65a908b9ea02), [`06320ee4`](https://github.com/Shopify/hydrogen/commit/06320ee48b94dbfece945461031a252f454fd0a3)]:
  - @shopify/hydrogen@2024.1.1
  - @shopify/cli-hydrogen@7.0.1

## 1.0.2

### Patch Changes

- Use new parameters introduced in Storefront API v2024-01 to fix redirection to the product's default variant when there are unknown query params in the URL. ([#1642](https://github.com/Shopify/hydrogen/pull/1642)) by [@wizardlyhel](https://github.com/wizardlyhel)

  \`\`\`diff
  -   selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
  +   selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {
        ...ProductVariant
      }
  \`\`\`

- Update the GraphQL config in `.graphqlrc.yml` to use the more modern `projects` structure: ([#1577](https://github.com/Shopify/hydrogen/pull/1577)) by [@frandiox](https://github.com/frandiox)

  \`\`\`diff
  -schema: node_modules/@shopify/hydrogen/storefront.schema.json
  +projects:
  + default:
  +    schema: 'node_modules/@shopify/hydrogen/storefront.schema.json'
  \`\`\`

  This allows you to add additional projects to the GraphQL config, such as third party CMS schemas.

  Also, you can modify the document paths used for the Storefront API queries. This is useful if you have a large codebase and want to exclude certain files from being used for codegen or other GraphQL utilities:

  \`\`\`yaml
  projects:
    default:
      schema: 'node_modules/@shopify/hydrogen/storefront.schema.json'
      documents:
        - '!*.d.ts'
        - '*.{ts,tsx,js,jsx}'
        - 'app/**/*.{ts,tsx,js,jsx}'
  \`\`\`

- Improve resiliency of `HydrogenSession` ([#1583](https://github.com/Shopify/hydrogen/pull/1583)) by [@blittle](https://github.com/blittle)

- Update `@shopify/cli` dependency in `package.json`: ([#1579](https://github.com/Shopify/hydrogen/pull/1579)) by [@frandiox](https://github.com/frandiox)

  \`\`\`diff
  -   "@shopify/cli": "3.51.0",
  +   "@shopify/cli": "3.52.0",
  \`\`\`

- - Update example and template Remix versions to `^2.5.1` ([#1639](https://github.com/Shopify/hydrogen/pull/1639)) by [@wizardlyhel](https://github.com/wizardlyhel)

  - Enable Remix future flags:
    - [`v3_fetcherPersist`](https://remix.run/docs/en/main/hooks/use-fetchers#additional-resources)
    - [`v3_relativeSplatpath`](https://remix.run/docs/en/main/hooks/use-resolved-path#splat-paths)

- Updated dependencies [[`810f48cf`](https://github.com/Shopify/hydrogen/commit/810f48cf5d55f0cfcac6e01fe481db8c76e77cd2), [`8c477cb5`](https://github.com/Shopify/hydrogen/commit/8c477cb565c3e018bf4e13bad01804c21611fb8a), [`42ac4138`](https://github.com/Shopify/hydrogen/commit/42ac4138553c7e1a438b075c4f9cb781edffebc4), [`0241b7d2`](https://github.com/Shopify/hydrogen/commit/0241b7d2dcb887d259ce9033aca356d391bc07df), [`6a897586`](https://github.com/Shopify/hydrogen/commit/6a897586bd0908db90736921d11e4b6bdf29c912), [`0ff63bed`](https://github.com/Shopify/hydrogen/commit/0ff63bed840f5b8a5eb9968b67bd9a5a57099253), [`6bc1d61c`](https://github.com/Shopify/hydrogen/commit/6bc1d61c17a9c9be13f52338d2ab940e64e73495), [`eb0f4bcc`](https://github.com/Shopify/hydrogen/commit/eb0f4bccb57966a00ecb2b88d17dd694599da340), [`400bfee6`](https://github.com/Shopify/hydrogen/commit/400bfee6836a51c6ab5e4804e8b1e9ad48856dcb), [`a69c21ca`](https://github.com/Shopify/hydrogen/commit/a69c21caa15dfedb88afd50f262f17bf86f74836), [`970073e7`](https://github.com/Shopify/hydrogen/commit/970073e78258880505e0de563136b5379d5d24af), [`772118ca`](https://github.com/Shopify/hydrogen/commit/772118ca6aefbd47841fffc6ce42856c2dc779bd), [`335375a6`](https://github.com/Shopify/hydrogen/commit/335375a6b1a512f70e169a82bc87a8392dc8c92c), [`335371ce`](https://github.com/Shopify/hydrogen/commit/335371ceb6e1bd5aebb6104f131d3f22798a245f), [`94509b75`](https://github.com/Shopify/hydrogen/commit/94509b750afefd686971198ed86277e2c70f3176), [`36d6fa2c`](https://github.com/Shopify/hydrogen/commit/36d6fa2c4fa54ff79f06ef17aa41f60478977bc0), [`3e7b6e8a`](https://github.com/Shopify/hydrogen/commit/3e7b6e8a3bf66bad7fc0f9c224f1c163dbe3e288), [`cce65795`](https://github.com/Shopify/hydrogen/commit/cce6579580f849bec9a28cf575f7130ba3627f6b), [`9e3d88d4`](https://github.com/Shopify/hydrogen/commit/9e3d88d498efaa20fe23de9837e0f444180bc787), [`ca1161b2`](https://github.com/Shopify/hydrogen/commit/ca1161b29ad7b4d0838953782fb114d5fe82193a), [`92840e51`](https://github.com/Shopify/hydrogen/commit/92840e51820e5c7822f731affd3f591c0099be10), [`952fedf2`](https://github.com/Shopify/hydrogen/commit/952fedf27b869164550954d1c15f53b32ec02675), [`1bc053c9`](https://github.com/Shopify/hydrogen/commit/1bc053c94ba1be14ddc28be9eb70be7219b295d1)]:
  - @shopify/hydrogen@2024.1.0
  - @shopify/cli-hydrogen@7.0.0
  - @shopify/remix-oxygen@2.0.3

## 1.0.1

### Patch Changes

- Sync up environment variable names across all example & type files. ([#1542](https://github.com/Shopify/hydrogen/pull/1542)) by [@michenly](https://github.com/michenly)

- Remove error boundary from robots.txt file in the Skeleton template ([#1492](https://github.com/Shopify/hydrogen/pull/1492)) by [@andrewcohen](https://github.com/andrewcohen)

- Use the worker runtime by default when running the `dev` or `preview` commands. ([#1525](https://github.com/Shopify/hydrogen/pull/1525)) by [@frandiox](https://github.com/frandiox)

  Enable it in your project by adding the `--worker` flag to your package.json scripts:

  \`\`\`diff
  "scripts": {
    "build": "shopify hydrogen build",
  - "dev": "shopify hydrogen dev --codegen",
  + "dev": "shopify hydrogen dev --worker --codegen",
  - "preview": "npm run build && shopify hydrogen preview",
  + "preview": "npm run build && shopify hydrogen preview --worker",
    ...
  }
  \`\`\`

- Update to the latest version of `@shopify/oxygen-workers-types`. ([#1494](https://github.com/Shopify/hydrogen/pull/1494)) by [@frandiox](https://github.com/frandiox)

  In TypeScript projects, when updating to the latest `@shopify/remix-oxygen` adapter release, you should also update to the latest version of `@shopify/oxygen-workers-types`:

  \`\`\`diff
  "devDependencies": {
    "@remix-run/dev": "2.1.0",
    "@remix-run/eslint-config": "2.1.0",
  - "@shopify/oxygen-workers-types": "^3.17.3",
  + "@shopify/oxygen-workers-types": "^4.0.0",
    "@shopify/prettier-config": "^1.1.2",
    ...
  },
  \`\`\`

- Update internal dependencies for bug resolution. ([#1496](https://github.com/Shopify/hydrogen/pull/1496)) by [@vincentezw](https://github.com/vincentezw)

  Update your `@shopify/cli` dependency to avoid duplicated sub-dependencies:

  \`\`\`diff
    "dependencies": {
  -   "@shopify/cli": "3.50.2",
  +   "@shopify/cli": "3.51.0",
    }
  \`\`\`

- Update all Node.js dependencies to version 18. (Not a breaking change, since Node.js 18 is already required by Remix v2.) ([#1543](https://github.com/Shopify/hydrogen/pull/1543)) by [@michenly](https://github.com/michenly)

- 🐛 fix undefined menu error ([#1533](https://github.com/Shopify/hydrogen/pull/1533)) by [@michenly](https://github.com/michenly)

- Add `@remix-run/server-runtime` dependency. ([#1489](https://github.com/Shopify/hydrogen/pull/1489)) by [@frandiox](https://github.com/frandiox)

  Since Remix is now a peer dependency of `@shopify/remix-oxygen`, you need to add `@remix-run/server-runtime` to your dependencies, with the same version as the rest of your Remix dependencies.

  \`\`\`diff
  "dependencies": {
    "@remix-run/react": "2.1.0"
  + "@remix-run/server-runtime": "2.1.0"
    ...
  }
  \`\`\`

- Updated dependencies [[`b2a350a7`](https://github.com/Shopify/hydrogen/commit/b2a350a754ea2d29bc267c260dc298a02f8f4470), [`9b4f4534`](https://github.com/Shopify/hydrogen/commit/9b4f453407338874bd8f1a1f619b607670e021d0), [`74ea1dba`](https://github.com/Shopify/hydrogen/commit/74ea1dba9af37a146882df7ed9674be5659862b5), [`2be9ce82`](https://github.com/Shopify/hydrogen/commit/2be9ce82fd4a5121f1772bbb7349e96ed530e84e), [`a9b8bcde`](https://github.com/Shopify/hydrogen/commit/a9b8bcde96c22cedef7d87631d429199810b4a7a), [`bca112ed`](https://github.com/Shopify/hydrogen/commit/bca112ed7db49e533fe49898b663fa0dd318e6ba), [`848c6260`](https://github.com/Shopify/hydrogen/commit/848c6260a2db3a9cb0c86351f0f7128f61e028f0), [`d53b4ed7`](https://github.com/Shopify/hydrogen/commit/d53b4ed752eb0530622a666ea7dcf4b40239cafa), [`961fd8c6`](https://github.com/Shopify/hydrogen/commit/961fd8c630727784f77b9f693d2e8ff8601969fc), [`2bff9fc7`](https://github.com/Shopify/hydrogen/commit/2bff9fc75916fa95f9a9279d069408fb7a33755c), [`c8e8f6fd`](https://github.com/Shopify/hydrogen/commit/c8e8f6fd233e52cf5570b1904af710d6b907aae5), [`8fce70de`](https://github.com/Shopify/hydrogen/commit/8fce70de32bd61ee86a6d895ac43cc1f78f1bf49), [`f90e4d47`](https://github.com/Shopify/hydrogen/commit/f90e4d4713c6c1fc1e921a7ecd08e95fe5da1744), [`e8cc49fe`](https://github.com/Shopify/hydrogen/commit/e8cc49feff18f5ee72d5f6965ff2094addc23466)]:
  - @shopify/cli-hydrogen@6.1.0
  - @shopify/remix-oxygen@2.0.2
  - @shopify/hydrogen@2023.10.3

## 1.0.0

### Major Changes

- The Storefront API 2023-10 now returns menu item URLs that include the `primaryDomainUrl`, instead of defaulting to the Shopify store ID URL (example.myshopify.com). The skeleton template requires changes to check for the `primaryDomainUrl`: by [@blittle](https://github.com/blittle)
  1. Update the `HeaderMenu` component to accept a `primaryDomainUrl` and include
     it in the internal url check

  \`\`\`diff
  // app/components/Header.tsx

  + import type {HeaderQuery} from 'storefrontapi.generated';

  export function HeaderMenu({
    menu,
  +  primaryDomainUrl,
    viewport,
  }: {
    menu: HeaderProps['header']['menu'];
  +  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
    viewport: Viewport;
  }) {

    // ...code

    // if the url is internal, we strip the domain
    const url =
      item.url.includes('myshopify.com') ||
      item.url.includes(publicStoreDomain) ||
  +   item.url.includes(primaryDomainUrl)
        ? new URL(item.url).pathname
        : item.url;

     // ...code

  }
  \`\`\`

  2. Update the `FooterMenu` component to accept a `primaryDomainUrl` prop and include
     it in the internal url check

  \`\`\`diff
  // app/components/Footer.tsx

  - import type {FooterQuery} from 'storefrontapi.generated';
  + import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

  function FooterMenu({
    menu,
  +  primaryDomainUrl,
  }: {
    menu: FooterQuery['menu'];
  +  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
  }) {
    // code...

    // if the url is internal, we strip the domain
    const url =
      item.url.includes('myshopify.com') ||
      item.url.includes(publicStoreDomain) ||
  +   item.url.includes(primaryDomainUrl)
        ? new URL(item.url).pathname
        : item.url;

     // ...code

    );
  }
  \`\`\`

  3. Update the `Footer` component to accept a `shop` prop

  \`\`\`diff
  export function Footer({
    menu,
  + shop,
  }: FooterQuery & {shop: HeaderQuery['shop']}) {
    return (
      <footer className="footer">
  -      <FooterMenu menu={menu} />
  +      <FooterMenu menu={menu} primaryDomainUrl={shop.primaryDomain.url} />
      </footer>
    );
  }
  \`\`\`

  4. Update `Layout.tsx` to pass the `shop` prop

  \`\`\`diff
  export function Layout({
    cart,
    children = null,
    footer,
    header,
    isLoggedIn,
  }: LayoutProps) {
    return (
      <>
        <CartAside cart={cart} />
        <SearchAside />
        <MobileMenuAside menu={header.menu} shop={header.shop} />
        <Header header={header} cart={cart} isLoggedIn={isLoggedIn} />
        <main>{children}</main>
        <Suspense>
          <Await resolve={footer}>
  -          {(footer) => <Footer menu={footer.menu}  />}
  +          {(footer) => <Footer menu={footer.menu} shop={header.shop} />}
          </Await>
        </Suspense>
      </>
    );
  }
  \`\`\`

### Patch Changes

- If you are calling `useMatches()` in different places of your app to access the data returned by the root loader, you may want to update it to the following pattern to enhance types: ([#1289](https://github.com/Shopify/hydrogen/pull/1289)) by [@frandiox](https://github.com/frandiox)

  \`\`\`ts
  // root.tsx

  import {useMatches} from '@remix-run/react';
  import {type SerializeFrom} from '@shopify/remix-oxygen';

  export const useRootLoaderData = () => {
    const [root] = useMatches();
    return root?.data as SerializeFrom<typeof loader>;
  };

  export function loader(context) {
    // ...
  }
  \`\`\`

  This way, you can import `useRootLoaderData()` anywhere in your app and get the correct type for the data returned by the root loader.

- Updated dependencies [[`81400439`](https://github.com/Shopify/hydrogen/commit/814004397c1d17ef0a53a425ed28a42cf67765cf), [`a6f397b6`](https://github.com/Shopify/hydrogen/commit/a6f397b64dc6a0d856cb7961731ee1f86bf80292), [`3464ec04`](https://github.com/Shopify/hydrogen/commit/3464ec04a084e1ceb30ee19874dc1b9171ce2b34), [`7fc088e2`](https://github.com/Shopify/hydrogen/commit/7fc088e21bea47840788cb7c60f873ce1f253128), [`867e0b03`](https://github.com/Shopify/hydrogen/commit/867e0b033fc9eb04b7250baea97d8fd49d26ccca), [`ad45656c`](https://github.com/Shopify/hydrogen/commit/ad45656c5f663cc1a60eab5daab4da1dfd0e6cc3), [`f24e3424`](https://github.com/Shopify/hydrogen/commit/f24e3424c8e2b363b181b71fcbd3e45f696fdd3f), [`66a48573`](https://github.com/Shopify/hydrogen/commit/66a4857387148b6a104df5783314c74aca8aada0), [`0ae7cbe2`](https://github.com/Shopify/hydrogen/commit/0ae7cbe280d8351126e11dc13f35d7277d9b2d86), [`8198c1be`](https://github.com/Shopify/hydrogen/commit/8198c1befdfafb39fbcc88d71f91d21eae252973), [`ad45656c`](https://github.com/Shopify/hydrogen/commit/ad45656c5f663cc1a60eab5daab4da1dfd0e6cc3)]:
  - @shopify/hydrogen@2023.10.0
  - @shopify/remix-oxygen@2.0.0
  - @shopify/cli-hydrogen@6.0.0

```

# customer-accountapi.generated.d.ts

```ts
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as CustomerAccountAPI from '@shopify/hydrogen/customer-account-api-types';

export type CustomerAddressUpdateMutationVariables = CustomerAccountAPI.Exact<{
  address: CustomerAccountAPI.CustomerAddressInput;
  addressId: CustomerAccountAPI.Scalars['ID']['input'];
  defaultAddress?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['Boolean']['input']
  >;
  language?: CustomerAccountAPI.InputMaybe<CustomerAccountAPI.LanguageCode>;
}>;

export type CustomerAddressUpdateMutation = {
  customerAddressUpdate?: CustomerAccountAPI.Maybe<{
    customerAddress?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.CustomerAddress, 'id'>
    >;
    userErrors: Array<
      Pick<
        CustomerAccountAPI.UserErrorsCustomerAddressUserErrors,
        'code' | 'field' | 'message'
      >
    >;
  }>;
};

export type CustomerAddressDeleteMutationVariables = CustomerAccountAPI.Exact<{
  addressId: CustomerAccountAPI.Scalars['ID']['input'];
  language?: CustomerAccountAPI.InputMaybe<CustomerAccountAPI.LanguageCode>;
}>;

export type CustomerAddressDeleteMutation = {
  customerAddressDelete?: CustomerAccountAPI.Maybe<
    Pick<
      CustomerAccountAPI.CustomerAddressDeletePayload,
      'deletedAddressId'
    > & {
      userErrors: Array<
        Pick<
          CustomerAccountAPI.UserErrorsCustomerAddressUserErrors,
          'code' | 'field' | 'message'
        >
      >;
    }
  >;
};

export type CustomerAddressCreateMutationVariables = CustomerAccountAPI.Exact<{
  address: CustomerAccountAPI.CustomerAddressInput;
  defaultAddress?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['Boolean']['input']
  >;
  language?: CustomerAccountAPI.InputMaybe<CustomerAccountAPI.LanguageCode>;
}>;

export type CustomerAddressCreateMutation = {
  customerAddressCreate?: CustomerAccountAPI.Maybe<{
    customerAddress?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.CustomerAddress, 'id'>
    >;
    userErrors: Array<
      Pick<
        CustomerAccountAPI.UserErrorsCustomerAddressUserErrors,
        'code' | 'field' | 'message'
      >
    >;
  }>;
};

export type CustomerFragment = Pick<
  CustomerAccountAPI.Customer,
  'id' | 'firstName' | 'lastName'
> & {
  defaultAddress?: CustomerAccountAPI.Maybe<
    Pick<
      CustomerAccountAPI.CustomerAddress,
      | 'id'
      | 'formatted'
      | 'firstName'
      | 'lastName'
      | 'company'
      | 'address1'
      | 'address2'
      | 'territoryCode'
      | 'zoneCode'
      | 'city'
      | 'zip'
      | 'phoneNumber'
    >
  >;
  addresses: {
    nodes: Array<
      Pick<
        CustomerAccountAPI.CustomerAddress,
        | 'id'
        | 'formatted'
        | 'firstName'
        | 'lastName'
        | 'company'
        | 'address1'
        | 'address2'
        | 'territoryCode'
        | 'zoneCode'
        | 'city'
        | 'zip'
        | 'phoneNumber'
      >
    >;
  };
};

export type AddressFragment = Pick<
  CustomerAccountAPI.CustomerAddress,
  | 'id'
  | 'formatted'
  | 'firstName'
  | 'lastName'
  | 'company'
  | 'address1'
  | 'address2'
  | 'territoryCode'
  | 'zoneCode'
  | 'city'
  | 'zip'
  | 'phoneNumber'
>;

export type CustomerDetailsQueryVariables = CustomerAccountAPI.Exact<{
  language?: CustomerAccountAPI.InputMaybe<CustomerAccountAPI.LanguageCode>;
}>;

export type CustomerDetailsQuery = {
  customer: Pick<
    CustomerAccountAPI.Customer,
    'id' | 'firstName' | 'lastName'
  > & {
    defaultAddress?: CustomerAccountAPI.Maybe<
      Pick<
        CustomerAccountAPI.CustomerAddress,
        | 'id'
        | 'formatted'
        | 'firstName'
        | 'lastName'
        | 'company'
        | 'address1'
        | 'address2'
        | 'territoryCode'
        | 'zoneCode'
        | 'city'
        | 'zip'
        | 'phoneNumber'
      >
    >;
    addresses: {
      nodes: Array<
        Pick<
          CustomerAccountAPI.CustomerAddress,
          | 'id'
          | 'formatted'
          | 'firstName'
          | 'lastName'
          | 'company'
          | 'address1'
          | 'address2'
          | 'territoryCode'
          | 'zoneCode'
          | 'city'
          | 'zip'
          | 'phoneNumber'
        >
      >;
    };
  };
};

export type OrderMoneyFragment = Pick<
  CustomerAccountAPI.MoneyV2,
  'amount' | 'currencyCode'
>;

export type DiscountApplicationFragment = {
  value:
    | ({__typename: 'MoneyV2'} & Pick<
        CustomerAccountAPI.MoneyV2,
        'amount' | 'currencyCode'
      >)
    | ({__typename: 'PricingPercentageValue'} & Pick<
        CustomerAccountAPI.PricingPercentageValue,
        'percentage'
      >);
};

export type OrderLineItemFullFragment = Pick<
  CustomerAccountAPI.LineItem,
  'id' | 'title' | 'quantity' | 'variantTitle'
> & {
  price?: CustomerAccountAPI.Maybe<
    Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  discountAllocations: Array<{
    allocatedAmount: Pick<
      CustomerAccountAPI.MoneyV2,
      'amount' | 'currencyCode'
    >;
    discountApplication: {
      value:
        | ({__typename: 'MoneyV2'} & Pick<
            CustomerAccountAPI.MoneyV2,
            'amount' | 'currencyCode'
          >)
        | ({__typename: 'PricingPercentageValue'} & Pick<
            CustomerAccountAPI.PricingPercentageValue,
            'percentage'
          >);
    };
  }>;
  totalDiscount: Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>;
  image?: CustomerAccountAPI.Maybe<
    Pick<
      CustomerAccountAPI.Image,
      'altText' | 'height' | 'url' | 'id' | 'width'
    >
  >;
};

export type OrderFragment = Pick<
  CustomerAccountAPI.Order,
  | 'id'
  | 'name'
  | 'confirmationNumber'
  | 'statusPageUrl'
  | 'fulfillmentStatus'
  | 'processedAt'
> & {
  fulfillments: {nodes: Array<Pick<CustomerAccountAPI.Fulfillment, 'status'>>};
  totalTax?: CustomerAccountAPI.Maybe<
    Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  totalPrice: Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>;
  subtotal?: CustomerAccountAPI.Maybe<
    Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  shippingAddress?: CustomerAccountAPI.Maybe<
    Pick<
      CustomerAccountAPI.CustomerAddress,
      'name' | 'formatted' | 'formattedArea'
    >
  >;
  discountApplications: {
    nodes: Array<{
      value:
        | ({__typename: 'MoneyV2'} & Pick<
            CustomerAccountAPI.MoneyV2,
            'amount' | 'currencyCode'
          >)
        | ({__typename: 'PricingPercentageValue'} & Pick<
            CustomerAccountAPI.PricingPercentageValue,
            'percentage'
          >);
    }>;
  };
  lineItems: {
    nodes: Array<
      Pick<
        CustomerAccountAPI.LineItem,
        'id' | 'title' | 'quantity' | 'variantTitle'
      > & {
        price?: CustomerAccountAPI.Maybe<
          Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        discountAllocations: Array<{
          allocatedAmount: Pick<
            CustomerAccountAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          discountApplication: {
            value:
              | ({__typename: 'MoneyV2'} & Pick<
                  CustomerAccountAPI.MoneyV2,
                  'amount' | 'currencyCode'
                >)
              | ({__typename: 'PricingPercentageValue'} & Pick<
                  CustomerAccountAPI.PricingPercentageValue,
                  'percentage'
                >);
          };
        }>;
        totalDiscount: Pick<
          CustomerAccountAPI.MoneyV2,
          'amount' | 'currencyCode'
        >;
        image?: CustomerAccountAPI.Maybe<
          Pick<
            CustomerAccountAPI.Image,
            'altText' | 'height' | 'url' | 'id' | 'width'
          >
        >;
      }
    >;
  };
};

export type OrderQueryVariables = CustomerAccountAPI.Exact<{
  orderId: CustomerAccountAPI.Scalars['ID']['input'];
  language?: CustomerAccountAPI.InputMaybe<CustomerAccountAPI.LanguageCode>;
}>;

export type OrderQuery = {
  order?: CustomerAccountAPI.Maybe<
    Pick<
      CustomerAccountAPI.Order,
      | 'id'
      | 'name'
      | 'confirmationNumber'
      | 'statusPageUrl'
      | 'fulfillmentStatus'
      | 'processedAt'
    > & {
      fulfillments: {
        nodes: Array<Pick<CustomerAccountAPI.Fulfillment, 'status'>>;
      };
      totalTax?: CustomerAccountAPI.Maybe<
        Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      totalPrice: Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>;
      subtotal?: CustomerAccountAPI.Maybe<
        Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      shippingAddress?: CustomerAccountAPI.Maybe<
        Pick<
          CustomerAccountAPI.CustomerAddress,
          'name' | 'formatted' | 'formattedArea'
        >
      >;
      discountApplications: {
        nodes: Array<{
          value:
            | ({__typename: 'MoneyV2'} & Pick<
                CustomerAccountAPI.MoneyV2,
                'amount' | 'currencyCode'
              >)
            | ({__typename: 'PricingPercentageValue'} & Pick<
                CustomerAccountAPI.PricingPercentageValue,
                'percentage'
              >);
        }>;
      };
      lineItems: {
        nodes: Array<
          Pick<
            CustomerAccountAPI.LineItem,
            'id' | 'title' | 'quantity' | 'variantTitle'
          > & {
            price?: CustomerAccountAPI.Maybe<
              Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>
            >;
            discountAllocations: Array<{
              allocatedAmount: Pick<
                CustomerAccountAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              discountApplication: {
                value:
                  | ({__typename: 'MoneyV2'} & Pick<
                      CustomerAccountAPI.MoneyV2,
                      'amount' | 'currencyCode'
                    >)
                  | ({__typename: 'PricingPercentageValue'} & Pick<
                      CustomerAccountAPI.PricingPercentageValue,
                      'percentage'
                    >);
              };
            }>;
            totalDiscount: Pick<
              CustomerAccountAPI.MoneyV2,
              'amount' | 'currencyCode'
            >;
            image?: CustomerAccountAPI.Maybe<
              Pick<
                CustomerAccountAPI.Image,
                'altText' | 'height' | 'url' | 'id' | 'width'
              >
            >;
          }
        >;
      };
    }
  >;
};

export type OrderItemFragment = Pick<
  CustomerAccountAPI.Order,
  | 'financialStatus'
  | 'fulfillmentStatus'
  | 'id'
  | 'number'
  | 'confirmationNumber'
  | 'processedAt'
> & {
  totalPrice: Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>;
  fulfillments: {nodes: Array<Pick<CustomerAccountAPI.Fulfillment, 'status'>>};
};

export type CustomerOrdersFragment = {
  orders: {
    nodes: Array<
      Pick<
        CustomerAccountAPI.Order,
        | 'financialStatus'
        | 'fulfillmentStatus'
        | 'id'
        | 'number'
        | 'confirmationNumber'
        | 'processedAt'
      > & {
        totalPrice: Pick<CustomerAccountAPI.MoneyV2, 'amount' | 'currencyCode'>;
        fulfillments: {
          nodes: Array<Pick<CustomerAccountAPI.Fulfillment, 'status'>>;
        };
      }
    >;
    pageInfo: Pick<
      CustomerAccountAPI.PageInfo,
      'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
    >;
  };
};

export type CustomerOrdersQueryVariables = CustomerAccountAPI.Exact<{
  endCursor?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['String']['input']
  >;
  first?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['Int']['input']
  >;
  last?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['Int']['input']
  >;
  startCursor?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['String']['input']
  >;
  query?: CustomerAccountAPI.InputMaybe<
    CustomerAccountAPI.Scalars['String']['input']
  >;
  language?: CustomerAccountAPI.InputMaybe<CustomerAccountAPI.LanguageCode>;
}>;

export type CustomerOrdersQuery = {
  customer: {
    orders: {
      nodes: Array<
        Pick<
          CustomerAccountAPI.Order,
          | 'financialStatus'
          | 'fulfillmentStatus'
          | 'id'
          | 'number'
          | 'confirmationNumber'
          | 'processedAt'
        > & {
          totalPrice: Pick<
            CustomerAccountAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          fulfillments: {
            nodes: Array<Pick<CustomerAccountAPI.Fulfillment, 'status'>>;
          };
        }
      >;
      pageInfo: Pick<
        CustomerAccountAPI.PageInfo,
        'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
      >;
    };
  };
};

export type CustomerUpdateMutationVariables = CustomerAccountAPI.Exact<{
  customer: CustomerAccountAPI.CustomerUpdateInput;
  language?: CustomerAccountAPI.InputMaybe<CustomerAccountAPI.LanguageCode>;
}>;

export type CustomerUpdateMutation = {
  customerUpdate?: CustomerAccountAPI.Maybe<{
    customer?: CustomerAccountAPI.Maybe<
      Pick<CustomerAccountAPI.Customer, 'firstName' | 'lastName'> & {
        emailAddress?: CustomerAccountAPI.Maybe<
          Pick<CustomerAccountAPI.CustomerEmailAddress, 'emailAddress'>
        >;
        phoneNumber?: CustomerAccountAPI.Maybe<
          Pick<CustomerAccountAPI.CustomerPhoneNumber, 'phoneNumber'>
        >;
      }
    >;
    userErrors: Array<
      Pick<
        CustomerAccountAPI.UserErrorsCustomerUserErrors,
        'code' | 'field' | 'message'
      >
    >;
  }>;
};

interface GeneratedQueryTypes {
  '#graphql\n  query CustomerDetails($language: LanguageCode) @inContext(language: $language) {\n    customer {\n      ...Customer\n    }\n  }\n  #graphql\n  fragment Customer on Customer {\n    id\n    firstName\n    lastName\n    defaultAddress {\n      ...Address\n    }\n    addresses(first: 6) {\n      nodes {\n        ...Address\n      }\n    }\n  }\n  fragment Address on CustomerAddress {\n    id\n    formatted\n    firstName\n    lastName\n    company\n    address1\n    address2\n    territoryCode\n    zoneCode\n    city\n    zip\n    phoneNumber\n  }\n\n': {
    return: CustomerDetailsQuery;
    variables: CustomerDetailsQueryVariables;
  };
  '#graphql\n  fragment OrderMoney on MoneyV2 {\n    amount\n    currencyCode\n  }\n  fragment DiscountApplication on DiscountApplication {\n    value {\n      __typename\n      ... on MoneyV2 {\n        ...OrderMoney\n      }\n      ... on PricingPercentageValue {\n        percentage\n      }\n    }\n  }\n  fragment OrderLineItemFull on LineItem {\n    id\n    title\n    quantity\n    price {\n      ...OrderMoney\n    }\n    discountAllocations {\n      allocatedAmount {\n        ...OrderMoney\n      }\n      discountApplication {\n        ...DiscountApplication\n      }\n    }\n    totalDiscount {\n      ...OrderMoney\n    }\n    image {\n      altText\n      height\n      url\n      id\n      width\n    }\n    variantTitle\n  }\n  fragment Order on Order {\n    id\n    name\n    confirmationNumber\n    statusPageUrl\n    fulfillmentStatus\n    processedAt\n    fulfillments(first: 1) {\n      nodes {\n        status\n      }\n    }\n    totalTax {\n      ...OrderMoney\n    }\n    totalPrice {\n      ...OrderMoney\n    }\n    subtotal {\n      ...OrderMoney\n    }\n    shippingAddress {\n      name\n      formatted(withName: true)\n      formattedArea\n    }\n    discountApplications(first: 100) {\n      nodes {\n        ...DiscountApplication\n      }\n    }\n    lineItems(first: 100) {\n      nodes {\n        ...OrderLineItemFull\n      }\n    }\n  }\n  query Order($orderId: ID!, $language: LanguageCode)\n    @inContext(language: $language) {\n    order(id: $orderId) {\n      ... on Order {\n        ...Order\n      }\n    }\n  }\n': {
    return: OrderQuery;
    variables: OrderQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment CustomerOrders on Customer {\n    orders(\n      sortKey: PROCESSED_AT,\n      reverse: true,\n      first: $first,\n      last: $last,\n      before: $startCursor,\n      after: $endCursor,\n      query: $query\n    ) {\n      nodes {\n        ...OrderItem\n      }\n      pageInfo {\n        hasPreviousPage\n        hasNextPage\n        endCursor\n        startCursor\n      }\n    }\n  }\n  #graphql\n  fragment OrderItem on Order {\n    totalPrice {\n      amount\n      currencyCode\n    }\n    financialStatus\n    fulfillmentStatus\n    fulfillments(first: 1) {\n      nodes {\n        status\n      }\n    }\n    id\n    number\n    confirmationNumber\n    processedAt\n  }\n\n\n  query CustomerOrders(\n    $endCursor: String\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $query: String\n    $language: LanguageCode\n  ) @inContext(language: $language) {\n    customer {\n      ...CustomerOrders\n    }\n  }\n': {
    return: CustomerOrdersQuery;
    variables: CustomerOrdersQueryVariables;
  };
}

interface GeneratedMutationTypes {
  '#graphql\n  mutation customerAddressUpdate(\n    $address: CustomerAddressInput!\n    $addressId: ID!\n    $defaultAddress: Boolean\n    $language: LanguageCode\n ) @inContext(language: $language) {\n    customerAddressUpdate(\n      address: $address\n      addressId: $addressId\n      defaultAddress: $defaultAddress\n    ) {\n      customerAddress {\n        id\n      }\n      userErrors {\n        code\n        field\n        message\n      }\n    }\n  }\n': {
    return: CustomerAddressUpdateMutation;
    variables: CustomerAddressUpdateMutationVariables;
  };
  '#graphql\n  mutation customerAddressDelete(\n    $addressId: ID!\n    $language: LanguageCode\n  ) @inContext(language: $language) {\n    customerAddressDelete(addressId: $addressId) {\n      deletedAddressId\n      userErrors {\n        code\n        field\n        message\n      }\n    }\n  }\n': {
    return: CustomerAddressDeleteMutation;
    variables: CustomerAddressDeleteMutationVariables;
  };
  '#graphql\n  mutation customerAddressCreate(\n    $address: CustomerAddressInput!\n    $defaultAddress: Boolean\n    $language: LanguageCode\n  ) @inContext(language: $language) {\n    customerAddressCreate(\n      address: $address\n      defaultAddress: $defaultAddress\n    ) {\n      customerAddress {\n        id\n      }\n      userErrors {\n        code\n        field\n        message\n      }\n    }\n  }\n': {
    return: CustomerAddressCreateMutation;
    variables: CustomerAddressCreateMutationVariables;
  };
  '#graphql\n  mutation customerUpdate(\n    $customer: CustomerUpdateInput!\n    $language: LanguageCode\n  ) @inContext(language: $language) {\n    customerUpdate(input: $customer) {\n      customer {\n        firstName\n        lastName\n        emailAddress {\n          emailAddress\n        }\n        phoneNumber {\n          phoneNumber\n        }\n      }\n      userErrors {\n        code\n        field\n        message\n      }\n    }\n  }\n': {
    return: CustomerUpdateMutation;
    variables: CustomerUpdateMutationVariables;
  };
}

declare module '@shopify/hydrogen' {
  interface CustomerAccountQueries extends GeneratedQueryTypes {}
  interface CustomerAccountMutations extends GeneratedMutationTypes {}
}

```

# env.d.ts

```ts
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

```

# eslint.config.js

```js
import {fixupConfigRules, fixupPluginRules} from '@eslint/compat';
import eslintComments from 'eslint-plugin-eslint-comments';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11Y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import _import from 'eslint-plugin-import';
import tsParser from '@typescript-eslint/parser';
import jest from 'eslint-plugin-jest';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import js from '@eslint/js';
import {FlatCompat} from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      '**/node_modules/',
      '**/build/',
      '**/dist/',
      '**/*.graphql.d.ts',
      '**/*.graphql.ts',
      '**/*.generated.d.ts',
      '**/.react-router/',
      '**/packages/hydrogen/dist/',
    ],
  },
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:eslint-comments/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:jsx-a11y/recommended',
    ),
  ),
  {
    plugins: {
      'eslint-comments': fixupPluginRules(eslintComments),
      react: fixupPluginRules(react),
      'react-hooks': fixupPluginRules(reactHooks),
      'jsx-a11y': fixupPluginRules(jsxA11Y),
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'eslint-comments/no-unused-disable': 'error',
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],
      'no-use-before-define': 'off',
      'no-warning-comments': 'off',
      'object-shorthand': [
        'error',
        'always',
        {
          avoidQuotes: true,
        },
      ],
      'no-useless-escape': 'off',
      'no-case-declarations': 'off',
    },
  },
  ...fixupConfigRules(
    compat.extends(
      'plugin:react/recommended',
      'plugin:react/jsx-runtime',
      'plugin:react-hooks/recommended',
      'plugin:jsx-a11y/recommended',
    ),
  ).map((config) => ({
    ...config,
    files: ['**/*.{js,jsx,ts,tsx}'],
  })),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: fixupPluginRules(react),
      'jsx-a11y': fixupPluginRules(jsxA11Y),
    },
    settings: {
      react: {
        version: 'detect',
      },
      formComponents: ['Form'],
      linkComponents: [
        {
          name: 'Link',
          linkAttribute: 'to',
        },
        {
          name: 'NavLink',
          linkAttribute: 'to',
        },
      ],
      'import/resolver': {
        typescript: {},
      },
    },
    rules: {
      'jsx-a11y/control-has-associated-label': 'off',
      'jsx-a11y/label-has-for': 'off',
      'react/display-name': 'off',
      'react/no-array-index-key': 'warn',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
  ...fixupConfigRules(
    compat.extends(
      'plugin:@typescript-eslint/recommended',
      'plugin:import/recommended',
      'plugin:import/typescript',
    ),
  ).map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  })),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      import: fixupPluginRules(_import),
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      'import/internal-regex': '^~/',
      'import/resolvers': {
        node: {
          extensions: ['.ts', '.tsx'],
        },
        typescript: {
          alwaysTryTypes: true,
          project: __dirname,
        },
      },
    },
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allowSingleOrDouble',
          trailingUnderscore: 'allowSingleOrDouble',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'typeParameter',
          format: ['PascalCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'interface',
          format: ['PascalCase'],
        },
        {
          selector: 'property',
          format: null,
        },
      ],
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      'react/prop-types': 'off',
    },
  },
  {
    files: ['**/.eslintrc.cjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  ...compat.extends('plugin:jest/recommended').map((config) => ({
    ...config,
    files: ['**/*.test.*'],
  })),
  {
    files: ['**/*.test.*'],
    plugins: {
      jest,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  {
    files: ['**/*.server.*'],
    rules: {
      'react-hooks/rules-of-hooks': 'off',
    },
  },
];

```

# guides/predictiveSearch/predictiveSearch.jpg

This is a binary file of the type: Image

# guides/predictiveSearch/predictiveSearch.md

```md
# Hydrogen Predictive Search

Our skeleton template ships with predictive search functionality. While [regular search](../search/search.md)
provides paginated search of `pages`, `articles` and `products` inside the `/search` route,
predictive provides real-time results in a aside drawer for `pages`, `articles`, `products`, `collections` and
recommended `queries/suggestions`.

This integration uses the storefront API (SFAPI) [predictiveSearch](https://shopify.dev/docs/api/storefront/latest/queries/vpredictiveSearch) endpoint to retrieve predictive search results based on a search term.

## Components Architecture

![alt text](./predictiveSearch.jpg)

## Components

| File                                                                                             | Description                                                                                                                                            |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`app/components/SearchFormPredictive.tsx`](../../app/components/SearchFormPredictive.tsx)       | A fully customizable form component configured to make form `GET` requests to the `/search` route.                                                    |
| [`app/components/SearchResultsPredictive.tsx`](../../app/components/SearchResultsPredictive.tsx) | A fully customizable search results wrapper, that provides compound components to render `articles`, `pages`, `products`, `collections` and `queries`. |

## Instructions

### 1. Create the search route

Create a new file at `/routes/search.tsx` (if not already created)

### 3. Add `predictiveSearch` query and fetcher

The predictiveSearch fetcher parses the `q` and `limit` formData properties sent
by the `<SearchFormPredictive />` component and performs the predictive search
SFAPI request.

\`\`\`ts
/**
 * Predictive search query and fragments
 * (adjust as needed)
 */
const PREDICTIVE_SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment PredictiveArticle on Article {
    __typename
    id
    title
    handle
    blog {
      handle
    }
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_COLLECTION_FRAGMENT = `#graphql
  fragment PredictiveCollection on Collection {
    __typename
    id
    title
    handle
    image {
      url
      altText
      width
      height
    }
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_PAGE_FRAGMENT = `#graphql
  fragment PredictivePage on Page {
    __typename
    id
    title
    handle
    trackingParameters
  }
` as const;

const PREDICTIVE_SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment PredictiveProduct on Product {
    __typename
    id
    title
    handle
    trackingParameters
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
    }
  }
` as const;

const PREDICTIVE_SEARCH_QUERY_FRAGMENT = `#graphql
  fragment PredictiveQuery on SearchQuerySuggestion {
    __typename
    text
    styledText
    trackingParameters
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/predictiveSearch
const PREDICTIVE_SEARCH_QUERY = `#graphql
  query predictiveSearch(
    $country: CountryCode
    $language: LanguageCode
    $limit: Int!
    $limitScope: PredictiveSearchLimitScope!
    $term: String!
    $types: [PredictiveSearchType!]
  ) @inContext(country: $country, language: $language) {
    predictiveSearch(
      limit: $limit,
      limitScope: $limitScope,
      query: $term,
      types: $types,
    ) {
      articles {
        ...PredictiveArticle
      }
      collections {
        ...PredictiveCollection
      }
      pages {
        ...PredictivePage
      }
      products {
        ...PredictiveProduct
      }
      queries {
        ...PredictiveQuery
      }
    }
  }
  ${PREDICTIVE_SEARCH_ARTICLE_FRAGMENT}
  ${PREDICTIVE_SEARCH_COLLECTION_FRAGMENT}
  ${PREDICTIVE_SEARCH_PAGE_FRAGMENT}
  ${PREDICTIVE_SEARCH_PRODUCT_FRAGMENT}
  ${PREDICTIVE_SEARCH_QUERY_FRAGMENT}
` as const;

/**
 * Predictive search fetcher
 */
async function predictiveSearch({
  request,
  context,
}: Pick<ActionFunctionArgs, 'request' | 'context'>) {
  const {storefront} = context;
  const formData = await request.formData();
  const term = String(formData.get('q') || '');

  const limit = Number(formData.get('limit') || 10);

  // Predictively search articles, collections, pages, products, and queries (suggestions)
  const {predictiveSearch: items, errors} = await storefront.query(
    PREDICTIVE_SEARCH_QUERY,
    {
      variables: {
        // customize search options as needed
        limit,
        limitScope: 'EACH',
        term,
      },
    },
  );

  if (errors) {
    throw new Error(
      `Shopify API errors: ${errors.map(({message}) => message).join(', ')}`,
    );
  }

  if (!items) {
    throw new Error('No predictive search data returned');
  }

  const total = Object.values(items).reduce((acc, {length}) => acc + length, 0);

  return {term, result: {items, total}, error: null};
}
\`\`\`

### 3. Add a `loader` export to the route

This action receives and processes `GET` requests from the `<SearchFormPredictive />`
component. These request include the search parameter `predictive` to identify them over
regular search requests.

A `q` URL parameter will be used as the search term and appended automatically by
the form if present in it's children prop.

\`\`\`ts
/**
 * Handles predictive search GET requests
 * requested by the SearchFormPredictive component
 */
export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const isPredictive = url.searchParams.has('predictive');

  if (!isPredictive) {
    return {}
  }

  const searchPromise = predictiveSearch({request, context})

  searchPromise.catch((error: Error) => {
    console.error(error);
    return {term: '', result: null, error: error.message};
  });

  return await searchPromise;
}
\`\`\`

### 4. Render the predictive search form and results

Create a SearchAside or similar component to render the form and results.

\`\`\`ts
import { SearchFormPredictive } from '~/components/SearchFormPredictive';
import { SearchResultsPredictive } from '~/components/SearchResultsPredictive';

function SearchAside() {
  return (
    <Aside type="search" heading="SEARCH">
      <div className="predictive-search">
        <br />
        <SearchFormPredictive>
          {({ fetchResults, goToSearch, inputRef }) => (
            <>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
              />
              &nbsp;
              <button onClick={goToSearch}>
                Search
              </button>
            </>
          )}
        </SearchFormPredictive>

        <SearchResultsPredictive>
          {({ items, total, term, state, inputRef, closeSearch }) => {
            const { articles, collections, pages, products, queries } = items;

            if (state === 'loading' && term.current) {
              return <div>Loading...</div>;
            }

            if (!total) {
              return <SearchResultsPredictive.Empty term={term} />;
            }

            return (
              <>
                <SearchResultsPredictive.Queries
                   queries={queries}
                   term={term}
                   inputRef={inputRef}
                />
                <SearchResultsPredictive.Products
                   products={products}
                   closeSearch={closeSearch}
                   term={term}
                />
                <SearchResultsPredictive.Collections
                   collections={collections}
                   closeSearch={closeSearch}
                   term={term}
                />
                <SearchResultsPredictive.Pages
                   pages={pages}
                   closeSearch={closeSearch}
                   term={term}
                />
                <SearchResultsPredictive.Articles
                   articles={articles}
                   closeSearch={closeSearch}
                   term={term}
                />
                {term.current && total && (
                  <Link onClick={closeSearch} to={`/search?q=${term.current}`}>
                    <p>
                      View all results for <q>{term.current}</q> →
                    </p>
                  </Link>
                )}
              </>
            );
          }}
        </SearchResultsPredictive>
      </div>
    </Aside>
  );
}
\`\`\`

## Additional Notes

### How to use a different URL search parameter?

- Modify the `name` attribute in the forms input element. e.g

\`\`\`ts
<input name="query" />`.
\`\`\`

- Modify the fetchers term variable to parse the new name. e.g

\`\`\`ts
const term = String(searchParams.get('query') || '');
\`\`\`

### How to customize the way the results look?

Simply go to `/app/components/SearchResultsPredictive.tsx` and look for the compound
component you would like to modify.

Here we add images to each predictive product result item

\`\`\`diff
SearchResultsPredictive.Products = function ({
  products,
  closeSearch,
  term,
}: SearchResultsPredictiveProductsProps) {
  if (!products.length) return null;

  return (
    <div className="predictive-search-result" key="products">
      <h5>Products</h5>
      <ul>
        {products.map((product) => {
          const productUrl = urlWithTrackingParams({
            baseUrl: `/products/${product.handle}`,
            trackingParams: product.trackingParameters,
            term: term.current,
          });
+         const price = product?.selectedOrFirstAvailableVariant?.price;
+         const image = product?.selectedOrFirstAvailableVariant?.image;
          return (
            <li className="predictive-search-result-item" key={product.id}>
              <Link to={productUrl} onClick={closeSearch}>
+               {image && (
+                 <Image
+                   alt={image.altText ?? ''}
+                   src={image.url}
+                   width={50}
+                   height={50}
+                 />
+               )}
                <div>
                  <p>{product.title}</p>
                  <small>
+                 {price && (
+                   <Money
+                     data={price}
+                   />
+                 )}
                  </small>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  )
};
\`\`\`

```

# guides/search/search.jpg

This is a binary file of the type: Image

# guides/search/search.md

```md
# Hydrogen Search

Our skeleton template ships with a `/search` route and a set of components to easily
implement a traditional search flow.

This integration uses the storefront API (SFAPI) [search](https://shopify.dev/docs/api/storefront/latest/queries/search)
endpoint to retrieve search results based on a search term.

## Components Architecture

![alt text](./search.jpg)

## Components

| File                                                                   | Description                                                                                                                 |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| [`app/components/SearchForm.tsx`](app/components/SearchForm.tsx)       | A fully customizable form component configured to make (server-side) form `GET` requests to the `/search` route.            |
| [`app/components/SearchResults.tsx`](app/components/SearchResults.tsx) | A fully customizable search results wrapper, that provides compound components to render `articles`, `pages` and `products` |

## Instructions

### 1. Create the search route

Create a new file at `/routes/search.tsx`

### 3. Add `search` query and fetcher

The search fetcher parses the `q` parameter and performs the search SFAPI request.

\`\`\`ts
/**
 * Regular search query and fragments
 * (adjust as needed)
 */
const SEARCH_PRODUCT_FRAGMENT = `#graphql
  fragment SearchProduct on Product {
    __typename
    handle
    id
    publishedAt
    title
    trackingParameters
    vendor
    selectedOrFirstAvailableVariant(
      selectedOptions: []
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      id
      image {
        url
        altText
        width
        height
      }
      price {
        amount
        currencyCode
      }
      compareAtPrice {
        amount
        currencyCode
      }
      selectedOptions {
        name
        value
      }
      product {
        handle
        title
      }
    }
  }
` as const;

const SEARCH_PAGE_FRAGMENT = `#graphql
  fragment SearchPage on Page {
     __typename
     handle
    id
    title
    trackingParameters
  }
` as const;

const SEARCH_ARTICLE_FRAGMENT = `#graphql
  fragment SearchArticle on Article {
    __typename
    handle
    id
    title
    trackingParameters
  }
` as const;

const PAGE_INFO_FRAGMENT = `#graphql
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/latest/queries/search
export const SEARCH_QUERY = `#graphql
  query Search(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $term: String!
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    articles: search(
      query: $term,
      types: [ARTICLE],
      first: $first,
    ) {
      nodes {
        ...on Article {
          ...SearchArticle
        }
      }
    }
    pages: search(
      query: $term,
      types: [PAGE],
      first: $first,
    ) {
      nodes {
        ...on Page {
          ...SearchPage
        }
      }
    }
    products: search(
      after: $endCursor,
      before: $startCursor,
      first: $first,
      last: $last,
      query: $term,
      sortKey: RELEVANCE,
      types: [PRODUCT],
      unavailableProducts: HIDE,
    ) {
      nodes {
        ...on Product {
          ...SearchProduct
        }
      }
      pageInfo {
        ...PageInfoFragment
      }
    }
  }
  ${SEARCH_PRODUCT_FRAGMENT}
  ${SEARCH_PAGE_FRAGMENT}
  ${SEARCH_ARTICLE_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` as const;

/**
 * Regular search fetcher
 */
async function search({
  request,
  context,
}: Pick<LoaderFunctionArgs, 'request' | 'context'>) {
  const {storefront} = context;
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const variables = getPaginationVariables(request, {pageBy: 8});
  const term = String(searchParams.get('q') || '');

  // Search articles, pages, and products for the `q` term
  const {errors, ...items} = await storefront.query(SEARCH_QUERY, {
    variables: {...variables, term},
  });

  if (!items) {
    throw new Error('No search data returned from Shopify API');
  }

  if (errors) {
    throw new Error(errors[0].message);
  }

  const total = Object.values(items).reduce((acc, {nodes}) => {
    return acc + nodes.length;
  }, 0);

  return {term, result: {total, items}};
}
\`\`\`

### 3. Add a `loader` export to the route

This loader receives and processes `GET` requests from the `<SearchForm />` component.

A `q` URL parameter will be used as the search term and appended automatically by
the form if present in it's children prop

\`\`\`ts
/**
 * Handles regular search GET requests
 * requested by the SearchForm component and /search route visits
 */
export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const isRegular = !url.searchParams.has('predictive');

  if (!isRegular) {
    return {}
  }

  const searchPromise = regularSearch({request, context});

  searchPromise.catch((error: Error) => {
    console.error(error);
    return {term: '', result: null, error: error.message};
  });

  return await searchPromise;
}
\`\`\`

### 4. Render the search form and results

Finally, create a default export to render both the search form and the search results

\`\`\`ts
import {SearchForm} from '~/components/SearchForm';
import {SearchResults} from '~/components/SearchResults';

/**
 * Renders the /search route
 */
export default function SearchPage() {
  const {term, result} = useLoaderData<typeof loader>();

  return (
    <div className="search">
      <h1>Search</h1>
      <SearchForm>
        {({inputRef}) => (
          <>
            <input
              defaultValue={term}
              name="q"
              placeholder="Search…"
              ref={inputRef}
              type="search"
            />
            &nbsp;
            <button type="submit">Search</button>
          </>
        )}
      </SearchForm>
      {!term || !result?.total ? (
        <SearchResults.Empty />
      ) : (
        <SearchResults result={result} term={term}>
          {({articles, pages, products, term}) => (
            <div>
              <SearchResults.Products products={products} term={term} />
              <SearchResults.Pages pages={pages} term={term} />
              <SearchResults.Articles articles={articles} term={term} />
            </div>
          )}
        </SearchResults>
      )}
    </div>
  );
}
\`\`\`

## Additional Notes

### How to use a different URL search parameter?

- Modify the `name` attribute in the forms input element. e.g

\`\`\`ts
<input name="query" />`.
\`\`\`

- Modify the search fetcher term variable to parse the new name. e.g

\`\`\`ts
const term = String(searchParams.get('query') || '');
\`\`\`

### How to customize the way the results look?

Simply go to `/app/components/SearchResults.txx` and look for the compound component you
want to modify.

For example, let's render articles in a horizontal flex container

\`\`\`diff
SearchResults.Pages = function({
  pages,
  term,
}: {
  pages: SearchItems['pages'];
  term: string;
}) {
  if (!pages?.nodes.length) {
    return null;
  }
  return (
    <div className="search-result">
      <h2>Pages</h2>
+     <div className="flex">
        {pages?.nodes?.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });
          return (
            <div className="search-results-item" key={page.id}>
              <Link prefetch="intent" to={pageUrl}>
                {page.title}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
\`\`\`

```

# package.json

```json
{
  "name": "skeleton",
  "private": true,
  "sideEffects": false,
  "version": "2025.7.0",
  "type": "module",
  "scripts": {
    "build": "shopify hydrogen build --codegen",
    "dev": "shopify hydrogen dev --codegen",
    "preview": "shopify hydrogen preview --build",
    "lint": "eslint --no-error-on-unmatched-pattern .",
    "typecheck": "react-router typegen && tsc --noEmit",
    "codegen": "shopify hydrogen codegen && react-router typegen"
  },
  "prettier": "@shopify/prettier-config",
  "dependencies": {
    "@shopify/hydrogen": "2025.7.0",
    "graphql": "^16.10.0",
    "graphql-tag": "^2.12.6",
    "isbot": "^5.1.22",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "react-icons": "^5.5.0",
    "react-router": "7.9.2",
    "react-router-dom": "7.9.2",
    "simple-icons": "^16.0.0"
  },
  "devDependencies": {
    "@eslint/compat": "^1.2.5",
    "@eslint/eslintrc": "^3.2.0",
    "@eslint/js": "^9.18.0",
    "@graphql-codegen/cli": "5.0.2",
    "@react-router/dev": "7.9.2",
    "@react-router/fs-routes": "7.9.2",
    "@shopify/cli": "3.85.4",
    "@shopify/hydrogen-codegen": "^0.3.3",
    "@shopify/mini-oxygen": "^4.0.0",
    "@shopify/oxygen-workers-types": "^4.1.6",
    "@shopify/prettier-config": "^1.1.2",
    "@total-typescript/ts-reset": "^0.6.1",
    "@types/eslint": "^9.6.1",
    "@types/react": "^18.2.22",
    "@types/react-dom": "^18.2.7",
    "@typescript-eslint/eslint-plugin": "^8.21.0",
    "@typescript-eslint/parser": "^8.21.0",
    "eslint": "^9.18.0",
    "eslint-config-prettier": "^10.0.1",
    "eslint-import-resolver-typescript": "^3.7.0",
    "eslint-plugin-eslint-comments": "^3.2.0",
    "eslint-plugin-import": "^2.31.0",
    "eslint-plugin-jest": "^28.11.0",
    "eslint-plugin-jsx-a11y": "^6.10.2",
    "eslint-plugin-react": "^7.37.4",
    "eslint-plugin-react-hooks": "^5.1.0",
    "globals": "^15.14.0",
    "prettier": "^3.4.2",
    "typescript": "^5.9.2",
    "vite": "^6.2.4",
    "vite-tsconfig-paths": "^4.3.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}

```

# public/.gitkeep

```

```

# public/icon.svg

This is a file of the type: SVG Image

# public/icons/icon.svg

This is a file of the type: SVG Image

# public/icons/logo.svg

This is a file of the type: SVG Image

# public/icons/logov2.svg

This is a file of the type: SVG Image

# public/icons/tiktok.svg

This is a file of the type: SVG Image

# public/icons/x.svg

This is a file of the type: SVG Image

# public/icons/youtube.svg

This is a file of the type: SVG Image

# public/images/activations/event1.png

This is a binary file of the type: Image

# public/images/activations/event2.jpg

This is a binary file of the type: Image

# public/images/activations/event3.jpg

This is a binary file of the type: Image

# public/images/multimedia/campaign1.png

This is a binary file of the type: Image

# public/images/og/cover.jpg

This is a binary file of the type: Image

# public/images/og/readme.txt

```txt
Place Open Graph images here (e.g., cover.jpg 1200x630).

```

# public/images/releases/chair1.png

This is a binary file of the type: Image

# public/images/releases/hat1.png

This is a binary file of the type: Image

# public/images/releases/shirt1.png

This is a binary file of the type: Image

# react-router.config.ts

```ts
import type {Config} from '@react-router/dev/config';
import {hydrogenPreset} from '@shopify/hydrogen/react-router-preset';

/**
 * React Router 7.9.x Configuration for Hydrogen
 *
 * This configuration uses the official Hydrogen preset to provide optimal
 * React Router settings for Shopify Oxygen deployment. The preset enables
 * validated performance optimizations while ensuring compatibility.
 */
export default {
  presets: [hydrogenPreset()],
} satisfies Config;

```

# README.md

```md
# Hydrogen template: Skeleton

Hydrogen is Shopify’s stack for headless commerce. Hydrogen is designed to dovetail with [Remix](https://remix.run/), Shopify’s full stack web framework. This template contains a **minimal setup** of components, queries and tooling to get started with Hydrogen.

[Check out Hydrogen docs](https://shopify.dev/custom-storefronts/hydrogen)
[Get familiar with Remix](https://remix.run/docs/en/v1)

## What's included

- Remix
- Hydrogen
- Oxygen
- Vite
- Shopify CLI
- ESLint
- Prettier
- GraphQL generator
- TypeScript and JavaScript flavors
- Minimal setup of components and routes

## Getting started

**Requirements:**

- Node.js version 18.0.0 or higher

**Environment variables (create `.env` or `.env.local`):**

\`\`\`
PUBLIC_STORE_DOMAIN=studiomcliv.myshopify.com
PUBLIC_STOREFRONT_API_TOKEN=<storefront access token with read_products/listings>
PUBLIC_CHECKOUT_DOMAIN=studiomcliv.myshopify.com
PRIMARY_PRODUCT_HANDLE=capsule-collection-001
SESSION_SECRET=<random string>
\`\`\`

\`\`\`bash
npm create @shopify/hydrogen@latest
\`\`\`

## Building for production

\`\`\`bash
npm run build
\`\`\`

## Local development

\`\`\`bash
npm run dev
\`\`\`

## Setup for using Customer Account API (`/account` section)

Follow step 1 and 2 of <https://shopify.dev/docs/custom-storefronts/building-with-the-customer-account-api/hydrogen#step-1-set-up-a-public-domain-for-local-development>

```

# server.ts

```ts
// Virtual entry point for the app
import {storefrontRedirect} from '@shopify/hydrogen';
import {createRequestHandler} from '@shopify/hydrogen/oxygen';
import {createHydrogenRouterContext} from '~/lib/context';

/**
 * Export a fetch handler in module format.
 */
export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      const hydrogenContext = await createHydrogenRouterContext(
        request,
        env,
        executionContext,
      );

      /**
       * Create a Remix request handler and pass
       * Hydrogen's Storefront client to the loader context.
       */
      const handleRequest = createRequestHandler({
        // eslint-disable-next-line import/no-unresolved
        build: await import('virtual:react-router/server-build'),
        mode: process.env.NODE_ENV,
        getLoadContext: () => hydrogenContext,
      });

      const response = await handleRequest(request);

      if (hydrogenContext.session.isPending) {
        response.headers.set(
          'Set-Cookie',
          await hydrogenContext.session.commit(),
        );
      }

      if (response.status === 404) {
        /**
         * Check for redirects only when there's a 404 from the app.
         * If the redirect doesn't exist, then `storefrontRedirect`
         * will pass through the 404 response.
         */
        return storefrontRedirect({
          request,
          response,
          storefront: hydrogenContext.storefront,
        });
      }

      return response;
    } catch (error) {
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};

```

# storefrontapi.generated.d.ts

```ts
/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontAPI from '@shopify/hydrogen/storefront-api-types';

export type MoneyFragment = Pick<
  StorefrontAPI.MoneyV2,
  'currencyCode' | 'amount'
>;

export type CartLineFragment = Pick<
  StorefrontAPI.CartLine,
  'id' | 'quantity'
> & {
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    'id' | 'availableForSale' | 'requiresShipping' | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id' | 'vendor'>;
    selectedOptions: Array<
      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
    >;
  };
};

export type CartLineComponentFragment = Pick<
  StorefrontAPI.ComponentizableCartLine,
  'id' | 'quantity'
> & {
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  cost: {
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    amountPerQuantity: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  merchandise: Pick<
    StorefrontAPI.ProductVariant,
    'id' | 'availableForSale' | 'requiresShipping' | 'title'
  > & {
    compareAtPrice?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
    >;
    product: Pick<StorefrontAPI.Product, 'handle' | 'title' | 'id' | 'vendor'>;
    selectedOptions: Array<
      Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
    >;
  };
};

export type CartApiQueryFragment = Pick<
  StorefrontAPI.Cart,
  'updatedAt' | 'id' | 'checkoutUrl' | 'totalQuantity' | 'note'
> & {
  appliedGiftCards: Array<
    Pick<StorefrontAPI.AppliedGiftCard, 'id' | 'lastCharacters'> & {
      amountUsed: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    }
  >;
  buyerIdentity: Pick<
    StorefrontAPI.CartBuyerIdentity,
    'countryCode' | 'email' | 'phone'
  > & {
    customer?: StorefrontAPI.Maybe<
      Pick<
        StorefrontAPI.Customer,
        'id' | 'email' | 'firstName' | 'lastName' | 'displayName'
      >
    >;
  };
  lines: {
    nodes: Array<
      | (Pick<StorefrontAPI.CartLine, 'id' | 'quantity'> & {
          attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
          cost: {
            totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            amountPerQuantity: Pick<
              StorefrontAPI.MoneyV2,
              'currencyCode' | 'amount'
            >;
            compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
          };
          merchandise: Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'availableForSale' | 'requiresShipping' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            product: Pick<
              StorefrontAPI.Product,
              'handle' | 'title' | 'id' | 'vendor'
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
          };
        })
      | (Pick<StorefrontAPI.ComponentizableCartLine, 'id' | 'quantity'> & {
          attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
          cost: {
            totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            amountPerQuantity: Pick<
              StorefrontAPI.MoneyV2,
              'currencyCode' | 'amount'
            >;
            compareAtAmountPerQuantity?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
          };
          merchandise: Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'availableForSale' | 'requiresShipping' | 'title'
          > & {
            compareAtPrice?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
            >;
            price: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'url' | 'altText' | 'width' | 'height'
              >
            >;
            product: Pick<
              StorefrontAPI.Product,
              'handle' | 'title' | 'id' | 'vendor'
            >;
            selectedOptions: Array<
              Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
            >;
          };
        })
    >;
  };
  cost: {
    subtotalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalAmount: Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>;
    totalDutyAmount?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
    totalTaxAmount?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.MoneyV2, 'currencyCode' | 'amount'>
    >;
  };
  attributes: Array<Pick<StorefrontAPI.Attribute, 'key' | 'value'>>;
  discountCodes: Array<
    Pick<StorefrontAPI.CartDiscountCode, 'code' | 'applicable'>
  >;
};

export type MenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
>;

export type ChildMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
>;

export type ParentMenuItemFragment = Pick<
  StorefrontAPI.MenuItem,
  'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    >
  >;
};

export type MenuFragment = Pick<StorefrontAPI.Menu, 'id'> & {
  items: Array<
    Pick<
      StorefrontAPI.MenuItem,
      'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
    > & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        >
      >;
    }
  >;
};

export type ShopFragment = Pick<
  StorefrontAPI.Shop,
  'id' | 'name' | 'description'
> & {
  primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
  brand?: StorefrontAPI.Maybe<{
    logo?: StorefrontAPI.Maybe<{
      image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
    }>;
  }>;
};

export type HeaderQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  headerMenuHandle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type HeaderQuery = {
  shop: Pick<StorefrontAPI.Shop, 'id' | 'name' | 'description'> & {
    primaryDomain: Pick<StorefrontAPI.Domain, 'url'>;
    brand?: StorefrontAPI.Maybe<{
      logo?: StorefrontAPI.Maybe<{
        image?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, 'url'>>;
      }>;
    }>;
  };
  menu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            >
          >;
        }
      >;
    }
  >;
};

export type FooterQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  footerMenuHandle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type FooterQuery = {
  menu?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Menu, 'id'> & {
      items: Array<
        Pick<
          StorefrontAPI.MenuItem,
          'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
        > & {
          items: Array<
            Pick<
              StorefrontAPI.MenuItem,
              'id' | 'resourceId' | 'tags' | 'title' | 'type' | 'url'
            >
          >;
        }
      >;
    }
  >;
};

export type StoreRobotsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type StoreRobotsQuery = {shop: Pick<StorefrontAPI.Shop, 'id'>};

export type ProductByHandleQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ProductByHandleQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      'id' | 'title' | 'descriptionHtml' | 'handle'
    > & {
      featuredImage?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
      >;
      images: {
        nodes: Array<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
      };
      variants: {
        nodes: Array<
          Pick<
            StorefrontAPI.ProductVariant,
            'id' | 'availableForSale' | 'title'
          > & {price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>}
        >;
      };
    }
  >;
};

export type ArticleQueryVariables = StorefrontAPI.Exact<{
  articleHandle: StorefrontAPI.Scalars['String']['input'];
  blogHandle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type ArticleQuery = {
  blog?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Blog, 'handle'> & {
      articleByHandle?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.Article,
          'handle' | 'title' | 'contentHtml' | 'publishedAt'
        > & {
          author?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.ArticleAuthor, 'name'>
          >;
          image?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.Image,
              'id' | 'altText' | 'url' | 'width' | 'height'
            >
          >;
          seo?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Seo, 'description' | 'title'>
          >;
        }
      >;
    }
  >;
};

export type BlogQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  blogHandle: StorefrontAPI.Scalars['String']['input'];
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type BlogQuery = {
  blog?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Blog, 'title' | 'handle'> & {
      seo?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Seo, 'title' | 'description'>
      >;
      articles: {
        nodes: Array<
          Pick<
            StorefrontAPI.Article,
            'contentHtml' | 'handle' | 'id' | 'publishedAt' | 'title'
          > & {
            author?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.ArticleAuthor, 'name'>
            >;
            image?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'url' | 'width' | 'height'
              >
            >;
            blog: Pick<StorefrontAPI.Blog, 'handle'>;
          }
        >;
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
        >;
      };
    }
  >;
};

export type ArticleItemFragment = Pick<
  StorefrontAPI.Article,
  'contentHtml' | 'handle' | 'id' | 'publishedAt' | 'title'
> & {
  author?: StorefrontAPI.Maybe<Pick<StorefrontAPI.ArticleAuthor, 'name'>>;
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  blog: Pick<StorefrontAPI.Blog, 'handle'>;
};

export type BlogsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type BlogsQuery = {
  blogs: {
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
    >;
    nodes: Array<
      Pick<StorefrontAPI.Blog, 'title' | 'handle'> & {
        seo?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Seo, 'title' | 'description'>
        >;
      }
    >;
  };
};

export type MoneyProductItemFragment = Pick<
  StorefrontAPI.MoneyV2,
  'amount' | 'currencyCode'
>;

export type ProductItemFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'handle' | 'title'
> & {
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
};

export type CollectionQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars['String']['input'];
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type CollectionQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Collection,
      'id' | 'handle' | 'title' | 'description'
    > & {
      products: {
        nodes: Array<
          Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'> & {
            featuredImage?: StorefrontAPI.Maybe<
              Pick<
                StorefrontAPI.Image,
                'id' | 'altText' | 'url' | 'width' | 'height'
              >
            >;
            priceRange: {
              minVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
              maxVariantPrice: Pick<
                StorefrontAPI.MoneyV2,
                'amount' | 'currencyCode'
              >;
            };
          }
        >;
        pageInfo: Pick<
          StorefrontAPI.PageInfo,
          'hasPreviousPage' | 'hasNextPage' | 'endCursor' | 'startCursor'
        >;
      };
    }
  >;
};

export type CollectionFragment = Pick<
  StorefrontAPI.Collection,
  'id' | 'title' | 'handle'
> & {
  image?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'url' | 'altText' | 'width' | 'height'>
  >;
};

export type StoreCollectionsQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type StoreCollectionsQuery = {
  collections: {
    nodes: Array<
      Pick<StorefrontAPI.Collection, 'id' | 'title' | 'handle'> & {
        image?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'url' | 'altText' | 'width' | 'height'
          >
        >;
      }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
    >;
  };
};

export type MoneyCollectionItemFragment = Pick<
  StorefrontAPI.MoneyV2,
  'amount' | 'currencyCode'
>;

export type CollectionItemFragment = Pick<
  StorefrontAPI.Product,
  'id' | 'handle' | 'title'
> & {
  featuredImage?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Image, 'id' | 'altText' | 'url' | 'width' | 'height'>
  >;
  priceRange: {
    minVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
    maxVariantPrice: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  };
};

export type CatalogQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type CatalogQuery = {
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, 'id' | 'handle' | 'title'> & {
        featuredImage?: StorefrontAPI.Maybe<
          Pick<
            StorefrontAPI.Image,
            'id' | 'altText' | 'url' | 'width' | 'height'
          >
        >;
        priceRange: {
          minVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
          maxVariantPrice: Pick<
            StorefrontAPI.MoneyV2,
            'amount' | 'currencyCode'
          >;
        };
      }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasPreviousPage' | 'hasNextPage' | 'startCursor' | 'endCursor'
    >;
  };
};

export type PageQueryVariables = StorefrontAPI.Exact<{
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
}>;

export type PageQuery = {
  page?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Page, 'handle' | 'id' | 'title' | 'body'> & {
      seo?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Seo, 'description' | 'title'>
      >;
    }
  >;
};

export type PolicyFragment = Pick<
  StorefrontAPI.ShopPolicy,
  'body' | 'handle' | 'id' | 'title' | 'url'
>;

export type PolicyQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  privacyPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  refundPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  shippingPolicy: StorefrontAPI.Scalars['Boolean']['input'];
  termsOfService: StorefrontAPI.Scalars['Boolean']['input'];
}>;

export type PolicyQuery = {
  shop: {
    privacyPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    shippingPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    termsOfService?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
    refundPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'body' | 'handle' | 'id' | 'title' | 'url'>
    >;
  };
};

export type PolicyItemFragment = Pick<
  StorefrontAPI.ShopPolicy,
  'id' | 'title' | 'handle'
>;

export type PoliciesQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
}>;

export type PoliciesQuery = {
  shop: {
    privacyPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    shippingPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    termsOfService?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    refundPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicy, 'id' | 'title' | 'handle'>
    >;
    subscriptionPolicy?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ShopPolicyWithDefault, 'id' | 'title' | 'handle'>
    >;
  };
};

export type ProductVariantFragment = Pick<
  StorefrontAPI.ProductVariant,
  'availableForSale' | 'id' | 'sku' | 'title'
> & {
  compareAtPrice?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
  image?: StorefrontAPI.Maybe<
    {__typename: 'Image'} & Pick<
      StorefrontAPI.Image,
      'id' | 'url' | 'altText' | 'width' | 'height'
    >
  >;
  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
  product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
  selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>>;
  unitPrice?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
  >;
};

export type ProductFragment = Pick<
  StorefrontAPI.Product,
  | 'id'
  | 'title'
  | 'vendor'
  | 'handle'
  | 'descriptionHtml'
  | 'description'
  | 'encodedVariantExistence'
  | 'encodedVariantAvailability'
> & {
  options: Array<
    Pick<StorefrontAPI.ProductOption, 'name'> & {
      optionValues: Array<
        Pick<StorefrontAPI.ProductOptionValue, 'name'> & {
          firstSelectableVariant?: StorefrontAPI.Maybe<
            Pick<
              StorefrontAPI.ProductVariant,
              'availableForSale' | 'id' | 'sku' | 'title'
            > & {
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              image?: StorefrontAPI.Maybe<
                {__typename: 'Image'} & Pick<
                  StorefrontAPI.Image,
                  'id' | 'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              unitPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
            }
          >;
          swatch?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
              image?: StorefrontAPI.Maybe<{
                previewImage?: StorefrontAPI.Maybe<
                  Pick<StorefrontAPI.Image, 'url'>
                >;
              }>;
            }
          >;
        }
      >;
    }
  >;
  selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.ProductVariant,
      'availableForSale' | 'id' | 'sku' | 'title'
    > & {
      compareAtPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      image?: StorefrontAPI.Maybe<
        {__typename: 'Image'} & Pick<
          StorefrontAPI.Image,
          'id' | 'url' | 'altText' | 'width' | 'height'
        >
      >;
      price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
      selectedOptions: Array<
        Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
      >;
      unitPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
    }
  >;
  adjacentVariants: Array<
    Pick<
      StorefrontAPI.ProductVariant,
      'availableForSale' | 'id' | 'sku' | 'title'
    > & {
      compareAtPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
      image?: StorefrontAPI.Maybe<
        {__typename: 'Image'} & Pick<
          StorefrontAPI.Image,
          'id' | 'url' | 'altText' | 'width' | 'height'
        >
      >;
      price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
      selectedOptions: Array<
        Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
      >;
      unitPrice?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
      >;
    }
  >;
  seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
};

export type ProductQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  handle: StorefrontAPI.Scalars['String']['input'];
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  selectedOptions:
    | Array<StorefrontAPI.SelectedOptionInput>
    | StorefrontAPI.SelectedOptionInput;
}>;

export type ProductQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<
      StorefrontAPI.Product,
      | 'id'
      | 'title'
      | 'vendor'
      | 'handle'
      | 'descriptionHtml'
      | 'description'
      | 'encodedVariantExistence'
      | 'encodedVariantAvailability'
    > & {
      options: Array<
        Pick<StorefrontAPI.ProductOption, 'name'> & {
          optionValues: Array<
            Pick<StorefrontAPI.ProductOptionValue, 'name'> & {
              firstSelectableVariant?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.ProductVariant,
                  'availableForSale' | 'id' | 'sku' | 'title'
                > & {
                  compareAtPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                  image?: StorefrontAPI.Maybe<
                    {__typename: 'Image'} & Pick<
                      StorefrontAPI.Image,
                      'id' | 'url' | 'altText' | 'width' | 'height'
                    >
                  >;
                  price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
                  product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
                  selectedOptions: Array<
                    Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
                  >;
                  unitPrice?: StorefrontAPI.Maybe<
                    Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
                  >;
                }
              >;
              swatch?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.ProductOptionValueSwatch, 'color'> & {
                  image?: StorefrontAPI.Maybe<{
                    previewImage?: StorefrontAPI.Maybe<
                      Pick<StorefrontAPI.Image, 'url'>
                    >;
                  }>;
                }
              >;
            }
          >;
        }
      >;
      selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
        Pick<
          StorefrontAPI.ProductVariant,
          'availableForSale' | 'id' | 'sku' | 'title'
        > & {
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          image?: StorefrontAPI.Maybe<
            {__typename: 'Image'} & Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          unitPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
        }
      >;
      adjacentVariants: Array<
        Pick<
          StorefrontAPI.ProductVariant,
          'availableForSale' | 'id' | 'sku' | 'title'
        > & {
          compareAtPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
          image?: StorefrontAPI.Maybe<
            {__typename: 'Image'} & Pick<
              StorefrontAPI.Image,
              'id' | 'url' | 'altText' | 'width' | 'height'
            >
          >;
          price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
          product: Pick<StorefrontAPI.Product, 'title' | 'handle'>;
          selectedOptions: Array<
            Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
          >;
          unitPrice?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
          >;
        }
      >;
      seo: Pick<StorefrontAPI.Seo, 'description' | 'title'>;
    }
  >;
};

export type SearchProductFragment = {__typename: 'Product'} & Pick<
  StorefrontAPI.Product,
  'handle' | 'id' | 'publishedAt' | 'title' | 'trackingParameters' | 'vendor'
> & {
    selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ProductVariant, 'id'> & {
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
        compareAtPrice?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
        >;
        selectedOptions: Array<
          Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
        >;
        product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
      }
    >;
  };

export type SearchPageFragment = {__typename: 'Page'} & Pick<
  StorefrontAPI.Page,
  'handle' | 'id' | 'title' | 'trackingParameters'
>;

export type SearchArticleFragment = {__typename: 'Article'} & Pick<
  StorefrontAPI.Article,
  'handle' | 'id' | 'title' | 'trackingParameters'
>;

export type PageInfoFragmentFragment = Pick<
  StorefrontAPI.PageInfo,
  'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
>;

export type RegularSearchQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  endCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
  first?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  last?: StorefrontAPI.InputMaybe<StorefrontAPI.Scalars['Int']['input']>;
  term: StorefrontAPI.Scalars['String']['input'];
  startCursor?: StorefrontAPI.InputMaybe<
    StorefrontAPI.Scalars['String']['input']
  >;
}>;

export type RegularSearchQuery = {
  articles: {
    nodes: Array<
      {__typename: 'Article'} & Pick<
        StorefrontAPI.Article,
        'handle' | 'id' | 'title' | 'trackingParameters'
      >
    >;
  };
  pages: {
    nodes: Array<
      {__typename: 'Page'} & Pick<
        StorefrontAPI.Page,
        'handle' | 'id' | 'title' | 'trackingParameters'
      >
    >;
  };
  products: {
    nodes: Array<
      {__typename: 'Product'} & Pick<
        StorefrontAPI.Product,
        | 'handle'
        | 'id'
        | 'publishedAt'
        | 'title'
        | 'trackingParameters'
        | 'vendor'
      > & {
          selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.ProductVariant, 'id'> & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
              compareAtPrice?: StorefrontAPI.Maybe<
                Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>
              >;
              selectedOptions: Array<
                Pick<StorefrontAPI.SelectedOption, 'name' | 'value'>
              >;
              product: Pick<StorefrontAPI.Product, 'handle' | 'title'>;
            }
          >;
        }
    >;
    pageInfo: Pick<
      StorefrontAPI.PageInfo,
      'hasNextPage' | 'hasPreviousPage' | 'startCursor' | 'endCursor'
    >;
  };
};

export type PredictiveArticleFragment = {__typename: 'Article'} & Pick<
  StorefrontAPI.Article,
  'id' | 'title' | 'handle' | 'trackingParameters'
> & {
    blog: Pick<StorefrontAPI.Blog, 'handle'>;
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
    >;
  };

export type PredictiveCollectionFragment = {__typename: 'Collection'} & Pick<
  StorefrontAPI.Collection,
  'id' | 'title' | 'handle' | 'trackingParameters'
> & {
    image?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
    >;
  };

export type PredictivePageFragment = {__typename: 'Page'} & Pick<
  StorefrontAPI.Page,
  'id' | 'title' | 'handle' | 'trackingParameters'
>;

export type PredictiveProductFragment = {__typename: 'Product'} & Pick<
  StorefrontAPI.Product,
  'id' | 'title' | 'handle' | 'trackingParameters'
> & {
    selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
      Pick<StorefrontAPI.ProductVariant, 'id'> & {
        image?: StorefrontAPI.Maybe<
          Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
        >;
        price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
      }
    >;
  };

export type PredictiveQueryFragment = {
  __typename: 'SearchQuerySuggestion';
} & Pick<
  StorefrontAPI.SearchQuerySuggestion,
  'text' | 'styledText' | 'trackingParameters'
>;

export type PredictiveSearchQueryVariables = StorefrontAPI.Exact<{
  country?: StorefrontAPI.InputMaybe<StorefrontAPI.CountryCode>;
  language?: StorefrontAPI.InputMaybe<StorefrontAPI.LanguageCode>;
  limit: StorefrontAPI.Scalars['Int']['input'];
  limitScope: StorefrontAPI.PredictiveSearchLimitScope;
  term: StorefrontAPI.Scalars['String']['input'];
  types?: StorefrontAPI.InputMaybe<
    | Array<StorefrontAPI.PredictiveSearchType>
    | StorefrontAPI.PredictiveSearchType
  >;
}>;

export type PredictiveSearchQuery = {
  predictiveSearch?: StorefrontAPI.Maybe<{
    articles: Array<
      {__typename: 'Article'} & Pick<
        StorefrontAPI.Article,
        'id' | 'title' | 'handle' | 'trackingParameters'
      > & {
          blog: Pick<StorefrontAPI.Blog, 'handle'>;
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
        }
    >;
    collections: Array<
      {__typename: 'Collection'} & Pick<
        StorefrontAPI.Collection,
        'id' | 'title' | 'handle' | 'trackingParameters'
      > & {
          image?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.Image, 'url' | 'altText' | 'width' | 'height'>
          >;
        }
    >;
    pages: Array<
      {__typename: 'Page'} & Pick<
        StorefrontAPI.Page,
        'id' | 'title' | 'handle' | 'trackingParameters'
      >
    >;
    products: Array<
      {__typename: 'Product'} & Pick<
        StorefrontAPI.Product,
        'id' | 'title' | 'handle' | 'trackingParameters'
      > & {
          selectedOrFirstAvailableVariant?: StorefrontAPI.Maybe<
            Pick<StorefrontAPI.ProductVariant, 'id'> & {
              image?: StorefrontAPI.Maybe<
                Pick<
                  StorefrontAPI.Image,
                  'url' | 'altText' | 'width' | 'height'
                >
              >;
              price: Pick<StorefrontAPI.MoneyV2, 'amount' | 'currencyCode'>;
            }
          >;
        }
    >;
    queries: Array<
      {__typename: 'SearchQuerySuggestion'} & Pick<
        StorefrontAPI.SearchQuerySuggestion,
        'text' | 'styledText' | 'trackingParameters'
      >
    >;
  }>;
};

interface GeneratedQueryTypes {
  '#graphql\n  fragment Shop on Shop {\n    id\n    name\n    description\n    primaryDomain {\n      url\n    }\n    brand {\n      logo {\n        image {\n          url\n        }\n      }\n    }\n  }\n  query Header(\n    $country: CountryCode\n    $headerMenuHandle: String!\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    shop {\n      ...Shop\n    }\n    menu(handle: $headerMenuHandle) {\n      ...Menu\n    }\n  }\n  #graphql\n  fragment MenuItem on MenuItem {\n    id\n    resourceId\n    tags\n    title\n    type\n    url\n  }\n  fragment ChildMenuItem on MenuItem {\n    ...MenuItem\n  }\n  fragment ParentMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...ChildMenuItem\n    }\n  }\n  fragment Menu on Menu {\n    id\n    items {\n      ...ParentMenuItem\n    }\n  }\n\n': {
    return: HeaderQuery;
    variables: HeaderQueryVariables;
  };
  '#graphql\n  query Footer(\n    $country: CountryCode\n    $footerMenuHandle: String!\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    menu(handle: $footerMenuHandle) {\n      ...Menu\n    }\n  }\n  #graphql\n  fragment MenuItem on MenuItem {\n    id\n    resourceId\n    tags\n    title\n    type\n    url\n  }\n  fragment ChildMenuItem on MenuItem {\n    ...MenuItem\n  }\n  fragment ParentMenuItem on MenuItem {\n    ...MenuItem\n    items {\n      ...ChildMenuItem\n    }\n  }\n  fragment Menu on Menu {\n    id\n    items {\n      ...ParentMenuItem\n    }\n  }\n\n': {
    return: FooterQuery;
    variables: FooterQueryVariables;
  };
  '#graphql\n  query StoreRobots($country: CountryCode, $language: LanguageCode)\n   @inContext(country: $country, language: $language) {\n    shop {\n      id\n    }\n  }\n': {
    return: StoreRobotsQuery;
    variables: StoreRobotsQueryVariables;
  };
  '#graphql\n  query ProductByHandle($handle: String!, $country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      id\n      title\n      descriptionHtml\n      handle\n      featuredImage {\n        id\n        url\n        altText\n        width\n        height\n      }\n      images(first: 10) {\n        nodes {\n          id\n          url\n          altText\n          width\n          height\n        }\n      }\n      variants(first: 5) {\n        nodes {\n          id\n          availableForSale\n          title\n          price {\n            amount\n            currencyCode\n          }\n        }\n      }\n    }\n  }\n': {
    return: ProductByHandleQuery;
    variables: ProductByHandleQueryVariables;
  };
  '#graphql\n  query Article(\n    $articleHandle: String!\n    $blogHandle: String!\n    $country: CountryCode\n    $language: LanguageCode\n  ) @inContext(language: $language, country: $country) {\n    blog(handle: $blogHandle) {\n      handle\n      articleByHandle(handle: $articleHandle) {\n        handle\n        title\n        contentHtml\n        publishedAt\n        author: authorV2 {\n          name\n        }\n        image {\n          id\n          altText\n          url\n          width\n          height\n        }\n        seo {\n          description\n          title\n        }\n      }\n    }\n  }\n': {
    return: ArticleQuery;
    variables: ArticleQueryVariables;
  };
  '#graphql\n  query Blog(\n    $language: LanguageCode\n    $blogHandle: String!\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(language: $language) {\n    blog(handle: $blogHandle) {\n      title\n      handle\n      seo {\n        title\n        description\n      }\n      articles(\n        first: $first,\n        last: $last,\n        before: $startCursor,\n        after: $endCursor\n      ) {\n        nodes {\n          ...ArticleItem\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          hasNextPage\n          endCursor\n          startCursor\n        }\n\n      }\n    }\n  }\n  fragment ArticleItem on Article {\n    author: authorV2 {\n      name\n    }\n    contentHtml\n    handle\n    id\n    image {\n      id\n      altText\n      url\n      width\n      height\n    }\n    publishedAt\n    title\n    blog {\n      handle\n    }\n  }\n': {
    return: BlogQuery;
    variables: BlogQueryVariables;
  };
  '#graphql\n  query Blogs(\n    $country: CountryCode\n    $endCursor: String\n    $first: Int\n    $language: LanguageCode\n    $last: Int\n    $startCursor: String\n  ) @inContext(country: $country, language: $language) {\n    blogs(\n      first: $first,\n      last: $last,\n      before: $startCursor,\n      after: $endCursor\n    ) {\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n      nodes {\n        title\n        handle\n        seo {\n          title\n          description\n        }\n      }\n    }\n  }\n': {
    return: BlogsQuery;
    variables: BlogsQueryVariables;
  };
  '#graphql\n  #graphql\n  fragment MoneyProductItem on MoneyV2 {\n    amount\n    currencyCode\n  }\n  fragment ProductItem on Product {\n    id\n    handle\n    title\n    featuredImage {\n      id\n      altText\n      url\n      width\n      height\n    }\n    priceRange {\n      minVariantPrice {\n        ...MoneyProductItem\n      }\n      maxVariantPrice {\n        ...MoneyProductItem\n      }\n    }\n  }\n\n  query Collection(\n    $handle: String!\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(country: $country, language: $language) {\n    collection(handle: $handle) {\n      id\n      handle\n      title\n      description\n      products(\n        first: $first,\n        last: $last,\n        before: $startCursor,\n        after: $endCursor\n      ) {\n        nodes {\n          ...ProductItem\n        }\n        pageInfo {\n          hasPreviousPage\n          hasNextPage\n          endCursor\n          startCursor\n        }\n      }\n    }\n  }\n': {
    return: CollectionQuery;
    variables: CollectionQueryVariables;
  };
  '#graphql\n  fragment Collection on Collection {\n    id\n    title\n    handle\n    image {\n      id\n      url\n      altText\n      width\n      height\n    }\n  }\n  query StoreCollections(\n    $country: CountryCode\n    $endCursor: String\n    $first: Int\n    $language: LanguageCode\n    $last: Int\n    $startCursor: String\n  ) @inContext(country: $country, language: $language) {\n    collections(\n      first: $first,\n      last: $last,\n      before: $startCursor,\n      after: $endCursor\n    ) {\n      nodes {\n        ...Collection\n      }\n      pageInfo {\n        hasNextPage\n        hasPreviousPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n': {
    return: StoreCollectionsQuery;
    variables: StoreCollectionsQueryVariables;
  };
  '#graphql\n  query Catalog(\n    $country: CountryCode\n    $language: LanguageCode\n    $first: Int\n    $last: Int\n    $startCursor: String\n    $endCursor: String\n  ) @inContext(country: $country, language: $language) {\n    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {\n      nodes {\n        ...CollectionItem\n      }\n      pageInfo {\n        hasPreviousPage\n        hasNextPage\n        startCursor\n        endCursor\n      }\n    }\n  }\n  #graphql\n  fragment MoneyCollectionItem on MoneyV2 {\n    amount\n    currencyCode\n  }\n  fragment CollectionItem on Product {\n    id\n    handle\n    title\n    featuredImage {\n      id\n      altText\n      url\n      width\n      height\n    }\n    priceRange {\n      minVariantPrice {\n        ...MoneyCollectionItem\n      }\n      maxVariantPrice {\n        ...MoneyCollectionItem\n      }\n    }\n  }\n\n': {
    return: CatalogQuery;
    variables: CatalogQueryVariables;
  };
  '#graphql\n  query Page(\n    $language: LanguageCode,\n    $country: CountryCode,\n    $handle: String!\n  )\n  @inContext(language: $language, country: $country) {\n    page(handle: $handle) {\n      handle\n      id\n      title\n      body\n      seo {\n        description\n        title\n      }\n    }\n  }\n': {
    return: PageQuery;
    variables: PageQueryVariables;
  };
  '#graphql\n  fragment Policy on ShopPolicy {\n    body\n    handle\n    id\n    title\n    url\n  }\n  query Policy(\n    $country: CountryCode\n    $language: LanguageCode\n    $privacyPolicy: Boolean!\n    $refundPolicy: Boolean!\n    $shippingPolicy: Boolean!\n    $termsOfService: Boolean!\n  ) @inContext(language: $language, country: $country) {\n    shop {\n      privacyPolicy @include(if: $privacyPolicy) {\n        ...Policy\n      }\n      shippingPolicy @include(if: $shippingPolicy) {\n        ...Policy\n      }\n      termsOfService @include(if: $termsOfService) {\n        ...Policy\n      }\n      refundPolicy @include(if: $refundPolicy) {\n        ...Policy\n      }\n    }\n  }\n': {
    return: PolicyQuery;
    variables: PolicyQueryVariables;
  };
  '#graphql\n  fragment PolicyItem on ShopPolicy {\n    id\n    title\n    handle\n  }\n  query Policies ($country: CountryCode, $language: LanguageCode)\n    @inContext(country: $country, language: $language) {\n    shop {\n      privacyPolicy {\n        ...PolicyItem\n      }\n      shippingPolicy {\n        ...PolicyItem\n      }\n      termsOfService {\n        ...PolicyItem\n      }\n      refundPolicy {\n        ...PolicyItem\n      }\n      subscriptionPolicy {\n        id\n        title\n        handle\n      }\n    }\n  }\n': {
    return: PoliciesQuery;
    variables: PoliciesQueryVariables;
  };
  '#graphql\n  query Product(\n    $country: CountryCode\n    $handle: String!\n    $language: LanguageCode\n    $selectedOptions: [SelectedOptionInput!]!\n  ) @inContext(country: $country, language: $language) {\n    product(handle: $handle) {\n      ...Product\n    }\n  }\n  #graphql\n  fragment Product on Product {\n    id\n    title\n    vendor\n    handle\n    descriptionHtml\n    description\n    encodedVariantExistence\n    encodedVariantAvailability\n    options {\n      name\n      optionValues {\n        name\n        firstSelectableVariant {\n          ...ProductVariant\n        }\n        swatch {\n          color\n          image {\n            previewImage {\n              url\n            }\n          }\n        }\n      }\n    }\n    selectedOrFirstAvailableVariant(selectedOptions: $selectedOptions, ignoreUnknownOptions: true, caseInsensitiveMatch: true) {\n      ...ProductVariant\n    }\n    adjacentVariants (selectedOptions: $selectedOptions) {\n      ...ProductVariant\n    }\n    seo {\n      description\n      title\n    }\n  }\n  #graphql\n  fragment ProductVariant on ProductVariant {\n    availableForSale\n    compareAtPrice {\n      amount\n      currencyCode\n    }\n    id\n    image {\n      __typename\n      id\n      url\n      altText\n      width\n      height\n    }\n    price {\n      amount\n      currencyCode\n    }\n    product {\n      title\n      handle\n    }\n    selectedOptions {\n      name\n      value\n    }\n    sku\n    title\n    unitPrice {\n      amount\n      currencyCode\n    }\n  }\n\n\n': {
    return: ProductQuery;
    variables: ProductQueryVariables;
  };
  '#graphql\n  query RegularSearch(\n    $country: CountryCode\n    $endCursor: String\n    $first: Int\n    $language: LanguageCode\n    $last: Int\n    $term: String!\n    $startCursor: String\n  ) @inContext(country: $country, language: $language) {\n    articles: search(\n      query: $term,\n      types: [ARTICLE],\n      first: $first,\n    ) {\n      nodes {\n        ...on Article {\n          ...SearchArticle\n        }\n      }\n    }\n    pages: search(\n      query: $term,\n      types: [PAGE],\n      first: $first,\n    ) {\n      nodes {\n        ...on Page {\n          ...SearchPage\n        }\n      }\n    }\n    products: search(\n      after: $endCursor,\n      before: $startCursor,\n      first: $first,\n      last: $last,\n      query: $term,\n      sortKey: RELEVANCE,\n      types: [PRODUCT],\n      unavailableProducts: HIDE,\n    ) {\n      nodes {\n        ...on Product {\n          ...SearchProduct\n        }\n      }\n      pageInfo {\n        ...PageInfoFragment\n      }\n    }\n  }\n  #graphql\n  fragment SearchProduct on Product {\n    __typename\n    handle\n    id\n    publishedAt\n    title\n    trackingParameters\n    vendor\n    selectedOrFirstAvailableVariant(\n      selectedOptions: []\n      ignoreUnknownOptions: true\n      caseInsensitiveMatch: true\n    ) {\n      id\n      image {\n        url\n        altText\n        width\n        height\n      }\n      price {\n        amount\n        currencyCode\n      }\n      compareAtPrice {\n        amount\n        currencyCode\n      }\n      selectedOptions {\n        name\n        value\n      }\n      product {\n        handle\n        title\n      }\n    }\n  }\n\n  #graphql\n  fragment SearchPage on Page {\n     __typename\n     handle\n    id\n    title\n    trackingParameters\n  }\n\n  #graphql\n  fragment SearchArticle on Article {\n    __typename\n    handle\n    id\n    title\n    trackingParameters\n  }\n\n  #graphql\n  fragment PageInfoFragment on PageInfo {\n    hasNextPage\n    hasPreviousPage\n    startCursor\n    endCursor\n  }\n\n': {
    return: RegularSearchQuery;
    variables: RegularSearchQueryVariables;
  };
  '#graphql\n  query PredictiveSearch(\n    $country: CountryCode\n    $language: LanguageCode\n    $limit: Int!\n    $limitScope: PredictiveSearchLimitScope!\n    $term: String!\n    $types: [PredictiveSearchType!]\n  ) @inContext(country: $country, language: $language) {\n    predictiveSearch(\n      limit: $limit,\n      limitScope: $limitScope,\n      query: $term,\n      types: $types,\n    ) {\n      articles {\n        ...PredictiveArticle\n      }\n      collections {\n        ...PredictiveCollection\n      }\n      pages {\n        ...PredictivePage\n      }\n      products {\n        ...PredictiveProduct\n      }\n      queries {\n        ...PredictiveQuery\n      }\n    }\n  }\n  #graphql\n  fragment PredictiveArticle on Article {\n    __typename\n    id\n    title\n    handle\n    blog {\n      handle\n    }\n    image {\n      url\n      altText\n      width\n      height\n    }\n    trackingParameters\n  }\n\n  #graphql\n  fragment PredictiveCollection on Collection {\n    __typename\n    id\n    title\n    handle\n    image {\n      url\n      altText\n      width\n      height\n    }\n    trackingParameters\n  }\n\n  #graphql\n  fragment PredictivePage on Page {\n    __typename\n    id\n    title\n    handle\n    trackingParameters\n  }\n\n  #graphql\n  fragment PredictiveProduct on Product {\n    __typename\n    id\n    title\n    handle\n    trackingParameters\n    selectedOrFirstAvailableVariant(\n      selectedOptions: []\n      ignoreUnknownOptions: true\n      caseInsensitiveMatch: true\n    ) {\n      id\n      image {\n        url\n        altText\n        width\n        height\n      }\n      price {\n        amount\n        currencyCode\n      }\n    }\n  }\n\n  #graphql\n  fragment PredictiveQuery on SearchQuerySuggestion {\n    __typename\n    text\n    styledText\n    trackingParameters\n  }\n\n': {
    return: PredictiveSearchQuery;
    variables: PredictiveSearchQueryVariables;
  };
}

interface GeneratedMutationTypes {}

declare module '@shopify/hydrogen' {
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}

```

# tsconfig.json

```json
{
  "include": [
    "env.d.ts",
    "app/**/*.ts",
    "app/**/*.tsx",
    "app/**/*.d.ts",
    "*.ts",
    "*.tsx",
    "*.d.ts",
    ".graphqlrc.ts",
    ".react-router/types/**/*"
  ],
  "exclude": ["node_modules", "dist", "build", "packages/**/dist/**/*"],
  "compilerOptions": {
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "isolatedModules": true,
    "esModuleInterop": true,
    "jsx": "react-jsx",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "module": "ES2022",
    "target": "ES2022",
    "strict": true,
    "allowJs": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "types": [
      "@shopify/oxygen-workers-types",
      "react-router",
      "@shopify/hydrogen/react-router-types",
      "vite/client"
    ],
    "paths": {
      "~/*": ["app/*"]
    },
    "noEmit": true,
    "rootDirs": [".", "./.react-router/types"],
    "incremental": true,
    "composite": false,
    "verbatimModuleSyntax": true
  }
}

```

# vite.config.ts

```ts
import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {reactRouter} from '@react-router/dev/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [hydrogen(), oxygen(), reactRouter(), tsconfigPaths()],
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0,
  },
  ssr: {
    optimizeDeps: {
      /**
       * Include dependencies here if they throw CJS<>ESM errors.
       * For example, for the following error:
       *
       * > ReferenceError: module is not defined
       * >   at /Users/.../node_modules/example-dep/index.js:1:1
       *
       * Include 'example-dep' in the array below.
       * @see https://vitejs.dev/config/dep-optimization-options
       */
      include: ['set-cookie-parser', 'cookie', 'react-router'],
    },
  },
  server: {
    allowedHosts: ['.tryhydrogen.dev'],
  },
});

```

