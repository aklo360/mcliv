# MCLIV Project Rules

Read `ARCHITECTURE.md` completely before substantive work. It is the canonical
map of this project’s current implementation, identity boundary, deployment,
commands, and verification contract.

## Safety

- Preserve dirty and untracked work; never rebuild from an inferred older layout.
- Never print, commit, or expose Shopify tokens, session secrets, account data,
  environment files, or deployment credentials.
- Do not deploy, push, publish, change infrastructure, or contact anyone without
  explicit approval in the current conversation.
- Keep project context self-contained. Do not copy global operator context,
  personal paths, provider sessions, transcripts, or unrelated client data into
  this repository.

## Workflow

1. Inspect the exact files and current Git state before changing behavior.
2. Make the smallest coherent change that preserves the architecture.
3. Run the focused check, then `npm run lint`, `npm run typecheck`, or
   `npm run build` in proportion to the change.
4. Before any commit or push, verify the repository identity, visibility,
   tracked tree, staged diff, and secret exclusions.
