# Architect Atlas

A complete, responsive learning website for the 100 topics in `Anaplan_AI_Architect_Top_100_Topics.md`.

Live website: **https://ashishpatel26.github.io/ai-agent-architecture-concepts/**

## Run locally

```sh
npm install
npm run dev
```

Open `http://localhost:5173/ai-agent-architecture-concepts/` (or the local URL printed by Vite).

```sh
npm run build    # TypeScript checks and production build
npm run preview  # Preview the production build
```

## What is included

- All 100 original topic titles and Hindi explanations, organized into the five source domains.
- Original English explanations, topic-specific conceptual flows, design tradeoffs, and interview questions for every topic.
- An interactive multi-agent architecture on the overview, 100 step-through topic diagrams, and a searchable diagram library.
- Topic search, domain and difficulty filters, grid/list views, and incremental catalog loading.
- Three curated learning paths, topic completion tracking, bookmarks, and self-assessed interview practice.
- Persistent progress in browser local storage, a JSON progress export, and a download of the original curriculum.
- Light/dark themes, English/Hindi explanation switching, keyboard search (`Ctrl/Cmd + K`), responsive navigation, and reduced-motion support.

## Structure

```text
src/
  App.tsx           # Navigation, pages, search, persistent learning state
  components.tsx    # Interactive diagrams and shared visual components
  styles.css        # Design system, themes, responsive layouts
  data/
    source.json     # All 100 original source topics, imported without editing
    topics.ts       # English guides, diagram steps, paths, domain references
public/
  curriculum.md     # Downloadable copy of the original curriculum
  favicon.svg
```

React, TypeScript, Vite, and Lucide icons. The application runs entirely in the browser. Hash-based routes work on static hosting without rewrite rules. Deploy the `dist/` directory after building. Set Vite's `base` if hosting under a subdirectory.

## GitHub Pages deployment

Repository: `ashishpatel26/ai-agent-architecture-concepts`.

GitHub Pages publishes the committed `docs/` folder on `main`. The Vite base path is `/ai-agent-architecture-concepts/`, so JavaScript, styles, fonts, downloads, and direct topic links work under the project URL. `.nojekyll` keeps the generated files unchanged.

To prepare an update:

```sh
npm ci
npm run build:pages
```

`build:pages` checks the curriculum, compiles TypeScript, builds the website into `docs/`, and verifies all asset paths. Commit the source changes and the regenerated `docs/` together. Merge them into `main`; GitHub's managed Pages build and deployment workflow then publishes the update automatically. This branch-based setup requires no deployment token or custom Actions workflow.

Progress is stored on this device and browser; it is not synchronized between devices. JSON export creates a backup for inspection; import is not currently implemented. Reading times are estimates, and difficulty labels and curated paths are editorial additions. Diagrams are conceptual explanations, not executable workflows. Hindi summaries preserve the original document, including simplified statements; the English guides add engineering caveats.

Manrope, DM Sans, and Noto Sans Devanagari are bundled locally through Fontsource. English and Hindi render without contacting an external font service.

Development file watching uses polling for reliable refreshes on the project's Windows-mounted WSL drive. Bundled font licenses are included in `public/licenses/`.

## Verification

`npm run build` runs strict TypeScript checks and produces the static build. `scripts/qa.mjs` exercises the website in the installed gstack browser, covering curriculum integrity, filters, diagrams, bookmarks, completion persistence, language switching, practice, keyboard search, themes, and mobile navigation. It writes screenshots and a report to `artifacts/`.

```sh
QA_BASE_URL=http://localhost:5173/ai-agent-architecture-concepts BROWSE_BIN=/path/to/browse node scripts/qa.mjs
```

The browser test resets learning data on its specified local preview origin. Run it against a disposable preview, not a browser profile whose study history you want to keep.

## Learning references

The curriculum is based on the user-supplied document. Domain references link to primary documentation:

- [Anthropic: Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)
- [Microsoft: Secure multitenant RAG](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/secure-multitenant-rag)
- [OpenTelemetry: Traces](https://opentelemetry.io/docs/concepts/signals/traces/)
- [Microsoft: RAG design and evaluation](https://learn.microsoft.com/en-us/azure/architecture/ai-ml/guide/rag/rag-solution-design-and-evaluation-guide)
- [vLLM documentation](https://docs.vllm.ai/en/latest/)

This is an independent educational resource and is not affiliated with Anaplan. Interview prompts are practice material, not official company interview questions. No AI provider credentials or backend services are required.
