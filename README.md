# Top 100 AI Agent Architecture Design Concepts

Architect Atlas 2.0.0 is an enterprise architecture reference with **100 canonical lessons, 12 advanced extensions, 28 industry blueprints, and 190 Mermaid diagrams**.

[Open the website](https://ashishpatel26.github.io/ai-agent-architecture-concepts/).

The canonical numbering, titles, and five domains come from the supplied `Anaplan_AI_Architect_Top_100_Topics.md`. That original file remains unchanged. Published source summaries and the downloadable curriculum use vendor-neutral terminology; the download is an adapted edition, not an identical copy of the original.

## Explore the reference

Every lesson explains the concept, its progression from proof of concept to enterprise scale, components, runtime flow, an illustrative industry case, architecture diagrams, tradeoffs, failures and recovery, common mistakes, selection guidance, a production checklist, related concepts, and primary references.

- **Canonical collection:** all 100 original topics, with a complete home-page index and five domain pages containing 20 topics each.
- **Advanced collection:** extensions 101–112 cover MCP, evaluation, durable execution, sandboxing, delegated authorization, event sourcing, residency, multimodal pipelines, budgets, memory lifecycle, human handoffs, and supply chain security.
- **Industry library:** 28 blueprints define specialist agents, tools, authority limits, enterprise integrations, runtime and failure paths, controls, measurement definitions, tradeoffs, and rollout acceptance criteria.
- **Architecture studio:** choose an industry, inspect its agents, step through its workflow, examine failures, and compare two industries. This is a deterministic educational walkthrough; it does not execute live agents or enterprise actions.
- **Search and navigation:** global full-text search covers all 140 guides, including prose, components, keywords, and use cases. Catalogs support domain filters, sorting, and grid/list views. Lessons provide section links and sequential navigation.
- **Learning tools:** four curated learning paths, bookmarks, self-assessed completion and practice, persistent checklists, progress export, and light/dark themes.
- **Diagram tools:** lazy rendering, accessible titles and captions, source view and copy, zoom/reset, fullscreen where supported, and SVG download.

Industry examples are illustrative reference designs, not reports of company deployments or measured business improvements. The 28 sectors provide broad coverage rather than an exhaustive enumeration of every economic subsector. Consequential clinical, legal, financial, safety, and operational decisions remain with the appropriate accountable people in the examples.

## Run locally

Use a maintained Node.js release; Node.js 22 is used for this project.

```sh
npm ci
npm run dev
```

Open the project URL printed by Vite, typically `http://localhost:5173/ai-agent-architecture-concepts/`. The development command prepares the catalog and public content before starting the server. File watching uses polling for the Windows-mounted WSL workspace.

```sh
npm run build
npm run preview
```

The production build prepares structured content, checks TypeScript, builds assets into `dist/`, and generates readable HTML for each route. The app requires no model credentials or backend service.

## Content and application structure

```text
src/
  content/
    concepts/              # 112 independently maintained lesson JSON files
    industries/            # 28 independently maintained blueprint JSON files
  data/
    source.json            # Ordered canonical titles and neutral Hindi summaries
    domains.ts             # Five domains, learning paths, and lifecycle
    catalog.json           # Generated summaries for navigation and search fallback
  lib/
    content-types.ts       # Concept, Industry, Diagram, and Reference contracts
  pages/                   # Welcome, guides, catalogs, studio, and learning pages
  ui/                      # Shared documentation and Mermaid components
  styles.css               # Responsive light/dark design system
public/
  content/                 # Generated per-guide JSON and full-text search index
  curriculum.md            # Generated vendor-neutral canonical curriculum
  licenses/                # Bundled font licenses
scripts/
  prepare-content.mjs      # Generate catalog, public JSON, search, and download
  render-pages.mjs         # Generate route HTML, metadata, and sitemap
  validate-content.mjs     # Validate authored and generated content
  validate-diagrams.mjs    # Browser rendering checks for diagram definitions
  verify-pages.mjs         # Validate generated routes, metadata, links, and assets
  qa.mjs                   # Interactive browser regression checks
```

Edit the individual files under `src/content/`, following [the content schema](src/lib/content-types.ts). Preserve canonical IDs 1–100, their titles, and category assignments. Advanced lessons use category 5. Regenerate derived files after content changes:

```sh
node scripts/prepare-content.mjs
npm test
```

Do not hand-edit generated catalog entries, public guide copies, the search index, or built HTML. Primary-reference links document the underlying standards, research, and implementation guidance. [The research map](planning/industry-research.md) explains how those sources relate to the illustrative architectures.

## Static routes and GitHub Pages

The build generates **155 actual HTML routes**, including all concept and industry pages. Each guide has complete static prose, embedded initial content data, its own title and description, canonical URL, Open Graph metadata, keywords, and a sitemap entry. Lesson text remains readable without JavaScript; interactive search, learning tools, the studio, and Mermaid rendering use JavaScript. Legacy hash links from the first edition resolve to the corresponding current routes.

The five canonical domain routes are:

- `/agentic-frameworks/`
- `/security-governance/`
- `/resilience-reliability/`
- `/rag-data-architecture/`
- `/model-optimization-infrastructure/`

GitHub Pages publishes the committed `docs/` folder on `main` in `ashishpatel26/ai-agent-architecture-concepts`. Assets and internal links use the project base path `/ai-agent-architecture-concepts/`; `.nojekyll` preserves the generated files.

```sh
npm ci
npm run build:pages
```

This command prepares content, runs the content tests and TypeScript checks, builds `docs/`, generates the route HTML and sitemap, and verifies the published files. Commit source changes and regenerated `docs/` together. Merging into `main` triggers GitHub's configured Pages deployment. Building locally does not itself publish a release.

## Verification

The content suite contains 147 assertions covering the canonical source, all lesson and industry schemas, substantive prose, references, related links, diagram uniqueness, prohibited terminology, the adapted download, and parity between authored content, public JSON, catalog summaries, and the full-text search index. The source Hindi checks preserve explanatory intent while allowing vendor-neutral corrections.

```sh
node scripts/prepare-content.mjs
npm test
node scripts/validate-content.mjs
npm run build:pages
node scripts/validate-content.mjs --published
```

Content checks validate diagram structure and safe authored definitions. Browser rendering is a separate check. With a local Vite development server and the installed gstack browse binary, run:

```sh
BROWSE_BIN=/path/to/browse node scripts/validate-diagrams.mjs --url http://localhost:5173/ai-agent-architecture-concepts/
QA_BASE_URL=http://localhost:5173/ai-agent-architecture-concepts BROWSE_BIN=/path/to/browse node scripts/qa.mjs
```

The browser scripts write their reports and screenshots under `artifacts/`. Use the current reports to establish which checks passed; the presence of a script is not evidence of a completed run. Run interactive QA against a disposable local preview because it exercises and may reset browser learning state.

## Browser data and accessibility

Progress, bookmarks, checklists, and theme preferences stay in browser local storage and do not synchronize between devices. The progress JSON export contains completion, saved and practiced concepts, and the last topic; it does not export separate checklist or theme storage. Import is not implemented. Reading times are estimates, and learning paths and difficulty groupings are editorial navigation aids.

Canonical lessons include an expandable Hindi source-summary note; the expanded architecture lessons are in English. Manrope, DM Sans, and Noto Sans Devanagari are bundled locally through Fontsource, with licenses in `public/licenses/`. Font loading does not contact an external font service.

The interface includes keyboard search (`Ctrl/Cmd + K` or `/`), visible focus states, a skip link, responsive navigation, reduced-motion handling, and light/dark diagram styling. Architecture lessons and practice prompts are independent educational material, with no claim to official interview questions or regulatory certification.
