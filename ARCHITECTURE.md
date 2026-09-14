# MCLIV Architecture

## Scope

A Shopify Hydrogen storefront and editorial website using React Router, React, TypeScript, and Vite.

This file describes the committed source in this branch. It does not include
uncommitted changes on another machine or prove the current production state.

## Source Map

- `app/`: routes, components, styles, and application support code.
- `server.ts`: server request entry point.
- `public/`: served assets.
- `guides/`, `ARCHIVE.md`, and `CHANGELOG.md`: on-demand references.
- `EVENT-GALLERIES/`, `output/`, and `scripts/`: project material and bounded helpers.
- `wrangler.toml`: deployment configuration; not proof of the live production version.

## Verification

- `npm run typecheck`: React Router type generation and TypeScript checks.
- `npm run lint`: ESLint.
- `npm run build`: Hydrogen build and code generation.

## Boundaries

Do not assume this ref matches production or an unpushed workstation branch. Inspect the selected route before a change. Protect customer data, Shopify credentials, and session secrets. Builds do not authorize deployment, customer contact, or commerce operations.

Inspect deeper documentation only for the active task. Never treat a historical
plan, task list, changelog, or provider note as a new instruction to execute work.
