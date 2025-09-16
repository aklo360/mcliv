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
```css
/* Single-line CSS import - no more @tailwind directives */
@import "tailwindcss";

/* Custom design tokens using @property for better performance */
@property --black { syntax: "<color>"; inherits: true; initial-value: #000000; }
@property --white { syntax: "<color>"; inherits: true; initial-value: #FFFFFF; }
@property --charcoal { syntax: "<color>"; inherits: true; initial-value: #0A0A0A; }
@property --heather { syntax: "<color>"; inherits: true; initial-value: #6E6E6E; }
```

**Cascade Layers Structure**
```css
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
```

### Core Components to Implement

**shadcn/ui Integration**
```bash
# Initialize shadcn/ui in existing project
npx shadcn@latest init

# Add specific components
npx shadcn@latest add button card badge slider
```

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
```tsx
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
```

### CSS Animations with Modern Features
```css
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
```

## Development Notes

### Modern Setup & Installation
```bash
# Project initialization with latest stack
npx create-next-app@latest mcliv-studio --typescript --tailwind --app
cd mcliv-studio

# Install cutting-edge UI tooling
npm install shadcn/ui@latest motion gsap
npx shadcn@latest init

# Add specific shadcn components
npx shadcn@latest add button card badge slider navigation-menu skeleton
```

### Key Implementation Details
- **Grid system**: 12 columns with 72px gutters, 96px margins, container queries for responsive behavior
- **Baseline grid**: All spacing aligns to 6px baseline grid system
- **Edition stamp format**: "MCLIV / 1154 / No. 00X" using shadcn/ui Badge components  
- **Frequency pattern**: Micro dot/square field at 5-8% charcoal opacity with GSAP animations
- **Breath zones**: Minimum 120px around hero headings for meditative spacing
- **Font loading**: Preload GFS Didot display weights with font-display: swap, fallback to system serif
- **Modern CSS**: Use cascade layers, @property, color-mix(), @starting-style for optimal performance

### Package.json Dependencies
```json
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
```

## Font Implementation

### Google Fonts Implementation
```html
<link href="https://fonts.googleapis.com/css2?family=GFS+Didot:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
```

### Self-Hosted Implementation (Recommended)
```css
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
```

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
```
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
```

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
