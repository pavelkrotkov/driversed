# Teen Hazard Perception Lab

A static site for practicing hazard perception: anticipating hidden risks, scanning, timing developing hazards, reading other road users, and managing space.

## Use

Open `index.html` locally or publish the repository root with GitHub Pages.

Progress is saved in the browser with `localStorage`. The site includes export/import buttons so the training log can be backed up as JSON.

A lesson is marked **Started** automatically once the learner has stayed on the page for a few seconds, and the session date is filled in at the same time if it is still empty. The **Pass criterion met** checkbox is self-declared. Either checkbox can be toggled by hand.

The numbered lesson HTML files are tiny clean-URL stubs. Each one only sets `window.LESSON_SLUG` (matching its filename) and loads the shared `curriculum.js` and `app.js` renderer, so they must stay uniform.

## Development

The site itself needs no build step, but linting, formatting, type-checking, and tests are wired up with [Biome](https://biomejs.dev/), the TypeScript compiler in JSDoc/`checkJs` mode, and the Node test runner. Install dev dependencies once with `npm install`, then:

- `npm run check` — lint and format-check everything (auto-fix with `npx biome check --write .`)
- `npm run format` — apply formatting
- `npm run typecheck` — type-check the JavaScript via `tsc --noEmit` against the JSDoc annotations and `types.d.ts`
- `npm test` — run the Node test suite

Type-checking stays buildless: the files remain plain `.js` loaded by `<script>` tags, and `tsc` only reads the JSDoc types and the shared shapes declared in `types.d.ts` without emitting anything. Edit `types.d.ts` when the curriculum or MCQ data format changes.

CI (`.github/workflows/ci.yml`) runs the same checks on every pull request and fails the build on any lint, formatting, type, or test error.
