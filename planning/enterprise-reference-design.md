# Enterprise architecture reference expansion

Mode: Builder. Implementation authorized by the user's request to add every missing requirement, redesign the welcome page, add useful topics, and brainstorm industry architectures.

## Problem

The deployed first edition has all 100 titles but short lessons and four-stage diagrams. It does not meet the supplied content specification. Readers need to move from a concept to an actual enterprise design, understand failure boundaries, and compare the same pattern across industries.

## Chosen direction

Retain the exact canonical 100 IDs and titles. Add 12 independently labeled advanced concepts. Author 28 industry blueprints with explicit agent responsibilities, tools, authority, integrations, failure recovery, metrics, and staged rollout. All cases are illustrative reference designs, not claims about deployed customers.

A new welcome page introduces the architecture lifecycle and offers three entry points: concepts, industry blueprints, and an interactive architecture studio. The studio is a deterministic educational walkthrough, not a live agent execution service. Each industry remains distinct; a common runtime shell does not imply identical business processes.

## Alternatives considered

1. Extend the current short lesson template. Smallest change and retains the entire UI, but leaves the page-depth, canonical URL, Mermaid, and content-maintenance requirements unresolved.
2. Build a structured reference platform with independently maintained lessons, static route generation, and reusable documentation components. Selected: matches the full prompt and supports searchable content, public deep links, and per-page metadata.
3. Make a simulator the entire site. Visually engaging but hides prose, tradeoffs, and production caveats behind interactions. Use the simulator as a companion to complete readable lessons instead.

## Design

Technical editorial style: ink/navy welcome canvas, mint and blue diagram accents, a clear display heading, a visible architecture canvas, warm pale documentation surfaces, a persistent left navigation and a right table of contents. Self-hosted fonts. No stock images, automatic animation, invented adoption figures, or fake operational metrics. Light and dark themes apply to Mermaid diagrams too.

## Content and routes

- `/`: exact required title, subtitle, introduction, lifecycle, all-concepts entry, search, five domains, featured lessons, learning paths, industry previews.
- `/concepts/`: 100 canonical concepts, descriptions, search, category and level filters, sort, grid/list views.
- `/concepts/<slug>/`: all required sections, at least one unique Mermaid diagram, semantic related links, Previous/Next, source references, persistent checklist and bookmark/completion controls.
- Five exact domain routes from the prompt, each listing 20 concepts.
- `/advanced/` and 12 additional concept pages, separate from canonical counts.
- `/industries/` and 28 individual industry architecture routes.
- `/studio/`: choose industry, inspect agents, step through workflow, show recovery path, follow related concepts.
- Learning paths, diagram library, practice, bookmarks, progress retained.

## Implementation

React/TypeScript/Vite remains the interactive runtime. Structured JSON per lesson and industry feeds a generated summary/search catalog. Full content loads per route. Build generates actual HTML files for all canonical routes with visible semantic content, embedded initial page data, unique SEO metadata, canonical URLs, and sitemap. Hash links from the first edition redirect to their new canonical routes. GitHub Pages continues to publish `main/docs` at the existing URL.

Mermaid renders trusted authored definitions with strict security, lazy loading, accessible captions, a source view, zoom/reset, fullscreen, and SVG download. Every diagram is parsed and rendered in automated browser validation. Runtime prose remains available even if a diagram cannot load.

## Completion criteria

Exact source order and titles; prohibited terminology absent from published text/data; 112 complete lessons and 28 complete industry records; all required sections and references present; all Mermaid definitions valid; functional search covering components/keywords/use cases; canonical direct links and per-page metadata; no broken internal links; keyboard, dark-mode and responsive checks; build and content validation pass; production deployment verified against its merge commit.

## Boundaries

"All industries" means broad coverage of 28 named sectors in this release; it is not a claim to enumerate every economic subsector. Examples do not offer medical/legal/financial decisions, claim certification, or report fabricated business outcomes. Extra concepts supplement the original collection without changing its numbering.
