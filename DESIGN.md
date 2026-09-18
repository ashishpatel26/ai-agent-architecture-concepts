# Architect Atlas design system

## Product direction

An enterprise architecture reference that connects complete technical lessons with inspectable industry examples. The welcome page provides a visual introduction; documentation pages prioritize sustained reading, evidence, diagrams, and navigation. Keep the exact public title: **Top 100 AI Agent Architecture Design Concepts**.

The original 100 concepts remain the canonical collection. Label the 12 extensions and 28 industry blueprints clearly so additions do not obscure the source structure. Present the studio as an educational walkthrough with bounded responsibilities and human decisions.

## Visual language

Use a navy welcome canvas with mint highlights, a visible branching agent architecture, concise entry points, and generous spacing. Continue into pale editorial documentation surfaces with restrained teal actions and domain accents. Avoid stock imagery, decorative animation, invented adoption figures, or promotional claims that compete with the reference material.

| Role | Light theme | Dark theme |
| --- | --- | --- |
| Documentation canvas | `#f9faf9` | `#101b24` |
| Main surface | `#ffffff` | `#172630` |
| Primary text | `#172f36` | `#e4eff0` |
| Secondary text | `#5f7379` | `#a2b7bd` |
| Border | `#dfe7e5` | `#2d414b` |
| Primary action | `#146757` | `#8cdec1` |
| Navigation surface | `#f4f7f5` | `#12212a` |

The welcome hero uses `#10252e` with pale mint typography and actions. Domain colors retain consistent meaning: teal for agent coordination, violet for governance, amber for resilience, blue for retrieval, and rose for model infrastructure. Use color alongside names, icons, and labels rather than as the only indicator.

## Typography and reading

- **Manrope:** headings, display text, and prominent figures.
- **DM Sans:** prose, navigation, controls, and diagram text.
- **Noto Sans Devanagari:** Hindi source summaries.
- Bundle fonts locally through Fontsource and preserve their license files. System sans-serif fallbacks support unavailable fonts without an external font-service dependency.
- Use descriptive headings, sentence case, short paragraphs, and explicit terminology. Keep tables for comparable tradeoffs and lists for steps, responsibilities, or checks.

## Navigation and page structure

The welcome page offers concepts, industry architectures, the studio, and learning paths, followed by the lifecycle, five domains, featured lessons, industry previews, and the complete canonical index.

Documentation pages use a persistent desktop sidebar, a sticky top bar, readable central content, and a right-side table of contents where space permits. On smaller screens, navigation becomes a dismissible drawer and content stacks vertically. Keep diagrams and wide tables in bounded scrollable regions so they do not force page-wide overflow.

Each concept shows its number, domain, summary, estimated reading time, diagram count, and save control. Its sections cover the architecture decision, production progression, components, diagrams, runtime, illustrative use case, tradeoffs, failures, mistakes, selection guidance, checklist, related concepts, and references. Sequential navigation preserves the boundary between the canonical and advanced collections.

Industry pages expose specialist responsibilities, tools, authority limits, systems, operational flow, failure recovery, controls, metrics, and rollout gates. The studio lets readers inspect those same records, move through runtime steps, review failure paths, and compare two industries. A common presentation must not imply that all industries share the same process.

## Diagrams and interaction

Use authored Mermaid flowcharts, sequences, and state diagrams that explain the particular concept or industry. Replace generic fixed-stage diagrams with appropriate topology and meaningful labels. Every diagram needs an accessible title, an explanatory caption, and supporting runtime prose.

Render diagrams lazily in strict security mode with HTML labels disabled. Support source view and copy, zoom/reset, SVG download, and fullscreen when available. Keep the source and prose accessible when rendering fails. Adapt diagram fills, borders, labels, and connections to the selected theme, and validate authored diagrams in both light and dark rendering.

Interactions should reveal useful details or support navigation. Do not start animation automatically. Respect reduced-motion preferences. Give controls descriptive accessible names and visible focus states; support keyboard operation, modal dismissal, focus restoration, and the skip-to-content link.

## Search and learning state

Global full-text search spans all 140 guides, including components, keywords, and use cases. Display the guide type, concept number or industry, title, and summary so readers understand a result before opening it. When the full index is unavailable, make the limited search state explicit.

Show bookmarks, completion, practice, and checklist progress only from actual browser state. Completion and practice are self-assessed; reading-time estimates and difficulty groupings are navigation aids. Do not suggest that local progress is synchronized or professionally certified.

## Content and publication rules

Preserve the exact canonical titles and numbering. Published Hindi summaries use vendor-neutral terminology while retaining the original explanatory intent. English lessons add production detail and caveats.

All industry architectures and case studies are illustrative designs. Metrics define what to measure rather than promise numerical improvements. State tool authority, evidence limitations, recovery behavior, and accountable human decisions explicitly. The 28 sectors represent broad coverage, not every possible economic subsector.

Generate real route HTML with complete readable prose, unique metadata, canonical links, and sitemap entries. JavaScript adds the interactive reading experience; essential lesson text must remain available before it loads or when it is disabled. Keep legacy entry links usable and regenerate published data with source changes.
