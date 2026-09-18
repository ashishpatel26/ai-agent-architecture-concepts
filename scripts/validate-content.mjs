import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const forbiddenTerminology = /anaplan|अनप्लान|अनाप्लान/iu;
export const advancedTitles = [
  'Model Context Protocol (MCP)', 'Agent Evaluation & Regression Suites',
  'Durable Workflow Execution', 'Agent Sandboxing & Capability Isolation',
  'Agent Identity & Delegated Authorization', 'Event Sourcing for Agent Workflows',
  'Data Residency & Tenant Isolation', 'Multimodal Agent Pipelines',
  'Agent Budgeting & Admission Control', 'Memory Lifecycle & Forgetting',
  'Agent-to-Human Handoffs', 'Agent Supply Chain Security',
];
export const industrySlugs = [
  'banking', 'insurance', 'capital-markets', 'healthcare', 'life-sciences',
  'manufacturing', 'retail', 'ecommerce', 'supply-chain', 'logistics', 'telecom',
  'energy', 'utilities', 'automotive', 'aerospace', 'agriculture', 'construction',
  'real-estate', 'travel-hospitality', 'media', 'education', 'government', 'legal',
  'professional-services', 'enterprise-software', 'mining', 'maritime', 'nonprofits',
];

// Curated publisher/project domains are a provenance gate, not a network or claim-support check.
const primaryHosts = new Set([
  'a2a-protocol.org', 'arxiv.org', 'aws.amazon.com', 'c2pa.org', 'cheatsheetseries.owasp.org',
  'cloudevents.io', 'csrc.nist.gov', 'd1.awsstatic.com', 'debezium.io', 'developers.openai.com',
  'docs.aws.amazon.com', 'docs.langchain.com', 'docs.nvidia.com', 'docs.python.org',
  'docs.ragas.io', 'docs.temporal.io', 'docs.vllm.ai', 'fairlearn.org', 'github.com',
  'hl7.org', 'www.hl7.org', 'html.spec.whatwg.org', 'huggingface.co', 'json-schema.org',
  'kserve.github.io', 'kubernetes.io', 'learn.microsoft.com', 'microsoft.github.io',
  'milvus.io', 'modelcontextprotocol.io', 'openlineage.io', 'opcfoundation.org',
  'opentelemetry.io', 'platform.claude.com', 'redis.io', 'resilience4j.readme.io',
  'sbert.net', 'slsa.dev', 'www.anthropic.com', 'www.iso.org', 'www.mlflow.org',
  'www.nist.gov', 'www.openpolicyagent.org', 'www.postgresql.org', 'www.rfc-editor.org',
  'www.sbert.net', 'www.trulens.org', 'www.w3.org',
]);
const primaryGithubOwners = new Set([
  'cloudevents', 'ggml-org', 'langchain-ai', 'open-telemetry', 'vllm-project',
  'nvidia', 'kserve', 'huggingface', 'mlflow', 'modelcontextprotocol', 'a2aproject',
]);

const text = (value, location) => {
  assert.equal(typeof value, 'string', `${location} must be a string`);
  assert.ok(value.trim(), `${location} must not be blank`);
  assert.ok(!/^(?:TODO|TBD|coming soon|placeholder)$/i.test(value.trim()), `${location} is a placeholder`);
};
const integer = (value, location) => assert.ok(Number.isInteger(value), `${location} must be an integer`);
const list = (itemValidator, minimum = 1, maximum = Infinity) => (value, location) => {
  assert.ok(Array.isArray(value), `${location} must be an array`);
  assert.ok(value.length >= minimum && value.length <= maximum, `${location} requires ${minimum}–${maximum} items; found ${value.length}`);
  value.forEach((item, index) => itemValidator(item, `${location}[${index}]`));
  assert.equal(new Set(value.map(item => JSON.stringify(item))).size, value.length, `${location} contains duplicate items`);
};
const shape = fields => (value, location) => {
  assert.ok(value && typeof value === 'object' && !Array.isArray(value), `${location} must be an object`);
  assert.deepEqual(Object.keys(value).sort(), Object.keys(fields).sort(), `${location} must match the content schema exactly`);
  for (const [key, validator] of Object.entries(fields)) validator(value[key], `${location}.${key}`);
};
const namedRole = shape({ name: text, role: text });
const flowStep = shape({ title: text, description: text });
const tradeoff = shape({ decision: text, benefit: text, cost: text });
const failure = shape({ scenario: text, detection: text, recovery: text });
const mistake = shape({ mistake: text, fix: text });
const reference = shape({ title: text, url: text });
const diagram = shape({ title: text, type: text, code: text, caption: text });
const conceptShape = shape({
  id: integer, title: text, slug: text, category: integer, summary: text,
  overview: list(text, 2), production: shape({ poc: text, production: text, scale: text }),
  components: list(namedRole, 4), flow: list(flowStep, 5), diagrams: list(diagram),
  useCase: shape({ industry: text, title: text, situation: text, problem: text, requirement: text,
    architecture: text, runtime: list(text, 2), failure: text, impact: text }),
  tradeoffs: list(tradeoff, 3), failures: list(failure, 2), mistakes: list(mistake, 3),
  whenToUse: list(text, 3), whenNotToUse: list(text, 3), checklist: list(text, 6),
  related: list(integer, 4), keywords: list(text, 3), references: list(reference),
});
const industryShape = shape({
  slug: text, name: text, sector: text, icon: text, title: text, summary: text,
  situation: text, problem: text, whyAgents: text, outcome: text,
  agents: list(shape({ name: text, responsibility: text, tools: list(text), boundary: text }), 4, 6),
  systems: list(namedRole, 3), flow: list(flowStep, 6), diagrams: list(diagram, 2),
  failures: list(failure, 2), controls: list(text, 5),
  metrics: list(shape({ name: text, definition: text }), 4), tradeoffs: list(tradeoff, 3),
  rollout: list(shape({ phase: text, acceptance: text }), 3), related: list(integer, 4), references: list(reference),
});

const readJson = path => JSON.parse(readFileSync(path, 'utf8'));
export function readCollection(relativePath) {
  return readdirSync(join(projectRoot, relativePath)).filter(name => name.endsWith('.json')).sort()
    .map(name => ({ file: join(relativePath, name), value: readJson(join(projectRoot, relativePath, name)) }));
}
export function parseCurriculum(markdown) {
  return [...markdown.matchAll(/^(\d+)\.\s+\*\*(.+?):\*\*\s*(.+)$/gm)]
    .map(([, id, title, hindi]) => ({ id: Number(id), title, hindi, category: Math.floor((Number(id) - 1) / 20) }));
}
export function loadCorpus() {
  const originalNames = readdirSync(projectRoot).filter(name => /_AI_Architect_Top_100_Topics\.md$/.test(name));
  assert.equal(originalNames.length, 1, 'Exactly one original canonical Markdown fixture must be available');
  const original = parseCurriculum(readFileSync(join(projectRoot, originalNames[0]), 'utf8'));
  return {
    original,
    source: readJson(join(projectRoot, 'src/data/source.json')),
    concepts: readCollection('src/content/concepts'),
    industries: readCollection('src/content/industries'),
  };
}

const excludedProseKeys = new Set(['id', 'slug', 'category', 'diagrams', 'related', 'references', 'keywords', 'icon']);
export function proseStrings(value) {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(proseStrings);
  if (value && typeof value === 'object') return Object.entries(value).filter(([key]) => !excludedProseKeys.has(key)).flatMap(([, child]) => proseStrings(child));
  return [];
}
export function countProseWords(value) {
  return proseStrings(value).join(' ').match(/[\p{L}\p{N}][\p{L}\p{M}\p{N}'’-]*/gu)?.length ?? 0;
}
const normalizedText = value => value.normalize('NFKC').replace(/[\u200B-\u200D\uFEFF]/g, '');
export function assertNeutral(value, location) {
  assert.ok(!forbiddenTerminology.test(normalizedText(value)), `${location} contains prohibited source terminology`);
}

export function validateReferences(references, location) {
  for (const [index, ref] of references.entries()) {
    const label = `${location}.references[${index}]`;
    let url;
    assert.doesNotThrow(() => { url = new URL(ref.url); }, `${label} must be a valid absolute URL`);
    assert.equal(url.protocol, 'https:', `${label} must use HTTPS`);
    assert.ok(!url.username && !url.password, `${label} must not contain credentials`);
    assert.ok(primaryHosts.has(url.hostname), `${label} needs review of its primary publisher: ${url.hostname}`);
    if (url.hostname === 'github.com') assert.ok(primaryGithubOwners.has(url.pathname.split('/')[1]?.toLowerCase()), `${label} must identify an approved first-party project repository`);
    if (url.hostname === 'arxiv.org') assert.match(url.pathname, /^\/(?:abs|pdf|html)\//, `${label} must link to a research paper`);
  }
}
export function validateDiagrams(diagrams, location) {
  for (const [index, item] of diagrams.entries()) {
    const label = `${location}.diagrams[${index}]`;
    const headers = { flowchart: /^(?:flowchart|graph)\s+(?:TB|TD|BT|RL|LR)\b/, sequence: /^sequenceDiagram\b/, state: /^stateDiagram(?:-v2)?\b/ };
    assert.ok(headers[item.type], `${label} uses an unsupported diagram type`);
    assert.match(item.code.trim(), headers[item.type], `${label} code does not match its declared type`);
    assert.ok(item.code.trim().split('\n').length >= 4, `${label} is too short to explain its architecture`);
    assert.ok(!/<\/?\s*[a-z][^>]*>/i.test(item.code), `${label} must not contain HTML labels`);
    assert.ok(!/^\s*(?:click|href)\b/im.test(item.code), `${label} must not contain navigation directives`);
    assert.ok(!/%%\{\s*(?:init|config)\b/i.test(item.code), `${label} must not override global rendering security`);
  }
}
export function validateConcept(entry) {
  const { value: value, file } = entry;
  conceptShape(value, file);
  assert.ok(value.id >= 1 && value.id <= 112, `${file} has an invalid ID`);
  assert.equal(value.category, value.id <= 100 ? Math.floor((value.id - 1) / 20) : 5, `${file} has the wrong category`);
  assert.match(value.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${file} has an invalid slug`);
  assert.equal(basename(file), `${String(value.id).padStart(3, '0')}-${value.slug}.json`, `${file} filename must identify its ID and slug`);
  assert.ok(countProseWords(value) >= 550, `${file} requires at least 550 substantive prose words; found ${countProseWords(value)}`);
  assert.ok(value.related.every(id => id >= 1 && id <= 112 && id !== value.id), `${file} has an invalid or self-related ID`);
  assertNeutral(JSON.stringify(value), file);
  validateReferences(value.references, file);
  validateDiagrams(value.diagrams, file);
}
export function validateIndustry(entry) {
  const { value, file } = entry;
  industryShape(value, file);
  assert.match(value.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/, `${file} has an invalid slug`);
  assert.equal(basename(file), `${value.slug}.json`, `${file} filename must match its slug`);
  assert.ok(countProseWords(value) >= 550, `${file} requires at least 550 substantive prose words; found ${countProseWords(value)}`);
  assert.ok(value.related.every(id => id >= 1 && id <= 100), `${file} must link to valid canonical topic IDs`);
  assert.equal(new Set(value.agents.map(agent => agent.name.toLowerCase())).size, value.agents.length, `${file} repeats an agent name`);
  assert.equal(new Set(value.metrics.map(metric => metric.name.toLowerCase())).size, value.metrics.length, `${file} repeats a metric name`);
  assertNeutral(JSON.stringify(value), file);
  validateReferences(value.references, file);
  validateDiagrams(value.diagrams, file);
}
export function validateInventory(corpus) {
  const { original, source, concepts, industries } = corpus;
  assert.equal(original.length, 100, 'The canonical fixture must define exactly 100 topics');
  assert.equal(source.length, 100, 'The source catalog must retain exactly 100 canonical topics');
  assert.equal(concepts.length, 112, 'Expected 100 canonical and 12 advanced concept files');
  assert.equal(industries.length, 28, 'Expected all 28 industry blueprint files');
  assert.deepEqual(concepts.map(entry => entry.value.id), Array.from({ length: 112 }, (_, i) => i + 1), 'Concept files must retain exact numeric ordering with no gaps or duplicate IDs');
  assert.deepEqual(industries.map(entry => entry.value.slug).sort(), [...industrySlugs].sort(), 'Industry coverage changed');
  const slugs = [...concepts, ...industries].map(entry => entry.value.slug);
  assert.equal(new Set(slugs).size, slugs.length, 'Content slugs must be unique');
  for (const [index, expected] of original.entries()) {
    assert.equal(expected.id, index + 1, 'Original source sequence must remain 1–100');
    for (const [label, actual] of [['source catalog', source[index]], ['concept', concepts[index].value]]) {
      assert.equal(actual.id, expected.id, `${label} ID differs at canonical position ${index + 1}`);
      assert.equal(actual.title, expected.title, `${label} title differs for canonical topic ${expected.id}`);
      assert.equal(actual.category, expected.category, `${label} category differs for canonical topic ${expected.id}`);
    }
  }
  for (const [index, title] of advancedTitles.entries()) assert.equal(concepts[index + 100].value.title, title, `Advanced topic ${index + 101} differs`);
  for (let category = 0; category < 5; category++) {
    const expected = Array.from({ length: 20 }, (_, i) => category * 20 + i + 1);
    assert.deepEqual(source.filter(item => item.category === category).map(item => item.id), expected, `Source domain ${category} must have its original 20 IDs`);
    assert.deepEqual(concepts.filter(entry => entry.value.category === category).map(entry => entry.value.id), expected, `Concept domain ${category} must have its original 20 IDs`);
  }
}
export function validateHindiIntent(corpus) {
  for (const [index, topic] of corpus.source.entries()) {
    text(topic.hindi, `source topic ${topic.id}.hindi`);
    assert.match(topic.hindi, /[\u0900-\u097F]/, `Source topic ${topic.id} must retain a Hindi explanation`);
    assertNeutral(topic.hindi, `source topic ${topic.id}.hindi`);
    const words = value => new Set(normalizedText(value).toLowerCase().replace(/anaplan|अनप्लान|अनाप्लान/giu, '').match(/[\p{L}\p{M}\p{N}]+/gu) ?? []);
    const before = words(corpus.original[index].hindi);
    const after = words(topic.hindi);
    const preserved = [...before].filter(word => after.has(word)).length / before.size;
    assert.ok(preserved >= 0.65, `Source topic ${topic.id} lost its Hindi explanatory intent (${Math.round(preserved * 100)}% source-word coverage)`);
  }
  const specificIntent = { 59: ['एजेंट', 'फेल', 'सिस्टम'], 77: ['डेटा', 'वेक्टर', 'अपडेट'], 79: ['शब्दावली', 'एम्बेडिंग', 'ट्रेन'] };
  for (const [id, anchors] of Object.entries(specificIntent)) for (const anchor of anchors) assert.ok(corpus.source[Number(id) - 1].hindi.includes(anchor), `Vendor-neutral topic ${id} lost its ${anchor} intent anchor`);
}
export function validateUniqueContent(corpus) {
  const diagramSources = new Map();
  for (const entry of [...corpus.concepts, ...corpus.industries]) for (const diagram of entry.value.diagrams) {
    const normalized = diagram.code.replace(/\s+/g, ' ').trim();
    assert.ok(!diagramSources.has(normalized), `${entry.file} repeats a diagram from ${diagramSources.get(normalized)}`);
    diagramSources.set(normalized, entry.file);
  }
  const groups = [
    [corpus.concepts, ['summary', 'overview', 'production', 'components', 'flow', 'useCase', 'tradeoffs', 'failures', 'mistakes', 'whenToUse', 'whenNotToUse', 'checklist']],
    [corpus.industries, ['summary', 'situation', 'problem', 'whyAgents', 'agents', 'systems', 'flow', 'failures', 'controls', 'metrics', 'tradeoffs', 'rollout']],
  ];
  for (const [entries, sections] of groups) for (const section of sections) {
    const seen = new Map();
    for (const { value, file } of entries) {
      let normalized = JSON.stringify(value[section]).toLowerCase().replace(/\s+/g, ' ').trim();
      // Renaming only the heading does not make copied lesson sections substantive.
      for (const label of [value.title, value.slug]) normalized = normalized.split(label.toLowerCase()).join('[topic]');
      assert.ok(!seen.has(normalized), `${file}.${section} duplicates ${seen.get(normalized)}; author concept-specific content`);
      seen.set(normalized, `${file}.${section}`);
    }
  }
}
function textFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return textFiles(path);
    return /\.(?:json|[cm]?jsx?|tsx?|css|html|md|txt|xml|svg|webmanifest|map)$/i.test(extname(path)) ? [path] : [];
  });
}
export function validatePublishedTerminology({ published = false } = {}) {
  const directories = ['src', 'public', ...(published ? ['docs'] : [])];
  const files = directories.flatMap(directory => textFiles(join(projectRoot, directory)));
  assert.ok(files.length > 100, 'Terminology scan must include authored and generated content');
  for (const file of files) {
    assertNeutral(file.slice(projectRoot.length), `Published path ${file}`);
    assertNeutral(readFileSync(file, 'utf8'), file);
  }
  return files.length;
}
export function validateDownload(corpus) {
  const markdown = readFileSync(join(projectRoot, 'public/curriculum.md'), 'utf8');
  assert.ok(markdown.startsWith('# Top 100 AI Agent Architecture Design Concepts'), 'The curriculum download needs the required public title');
  const topics = parseCurriculum(markdown);
  assert.equal(topics.length, 100, 'The public curriculum must preserve all canonical topics');
  for (const [index, topic] of topics.entries()) {
    assert.equal(topic.id, corpus.source[index].id, 'Public curriculum order differs from source');
    assert.equal(topic.title, corpus.source[index].title, `Public curriculum title differs at ${topic.id}`);
    assert.equal(topic.hindi, corpus.source[index].hindi, `Public curriculum must use the neutral source explanation for ${topic.id}`);
  }
  assertNeutral(markdown, 'public/curriculum.md');
}
export function validateGeneratedContent(corpus) {
  const catalog = readJson(join(projectRoot, 'src/data/catalog.json'));
  const index = readJson(join(projectRoot, 'public/content/search-index.json'));
  assert.equal(catalog.concepts.length, 112, 'Generated catalog must include all 112 lessons');
  assert.equal(catalog.industries.length, 28, 'Generated catalog must include all 28 industries');
  assert.deepEqual(catalog.concepts.map(item => item.id), corpus.concepts.map(entry => entry.value.id), 'Generated catalog order or IDs are stale');
  assert.equal(index.length, 140, 'Search index must include all 112 lessons and 28 industries; run node scripts/prepare-content.mjs');
  const bySearchKey = new Map(index.map(item => [`${item.type}/${item.key}`, item]));
  assert.equal(bySearchKey.size, index.length, 'Search index contains duplicate record keys');
  for (const [kind, entries, summaries] of [
    ['concept', corpus.concepts, catalog.concepts], ['industry', corpus.industries, catalog.industries],
  ]) {
    const directory = join(projectRoot, 'public/content', `${kind === 'concept' ? 'concepts' : 'industries'}`);
    assert.deepEqual(readdirSync(directory).filter(name => name.endsWith('.json')).sort(), entries.map(({ value }) => `${value.slug}.json`).sort(), `Published ${kind} file inventory is stale`);
    for (const { file, value } of entries) {
      assert.deepEqual(readJson(join(directory, `${value.slug}.json`)), value, `Published ${value.slug} differs from ${file}; regenerate public content`);
      const summary = summaries.find(item => item.slug === value.slug);
      assert.ok(summary, `Catalog is missing ${value.slug}`);
      for (const key of ['title', 'slug', 'summary']) assert.equal(summary[key], value[key], `Catalog ${value.slug}.${key} is stale`);
      if (kind === 'concept') {
        assert.equal(summary.category, value.category, `Catalog ${value.slug} category differs`);
        assert.deepEqual(summary.keywords, value.keywords, `Catalog ${value.slug} keywords differ`);
        assert.deepEqual(summary.componentNames, value.components.map(component => component.name), `Catalog ${value.slug} component search fallback is stale`);
        assert.equal(summary.industry, value.useCase.industry, `Catalog ${value.slug} use-case industry differs`);
      }
      const key = `${kind}/${kind === 'concept' ? value.id : value.slug}`;
      const searchable = bySearchKey.get(key);
      assert.ok(searchable, `Search index is missing ${key}`);
      text(searchable.text, `Search index ${key}.text`);
      assert.equal(searchable.text, searchable.text.toLowerCase(), `Search index ${key} must be normalized for case-insensitive matching`);
      const requiredStrings = [...proseStrings(value), ...(kind === 'concept' ? value.keywords : [])];
      for (const field of requiredStrings) assert.ok(searchable.text.includes(field.toLowerCase()), `Search index ${key} omits authored text: ${field.slice(0, 90)}`);
    }
  }
}

export function validateAll(options = {}) {
  const corpus = loadCorpus();
  validateInventory(corpus);
  validateHindiIntent(corpus);
  corpus.concepts.forEach(validateConcept);
  corpus.industries.forEach(validateIndustry);
  validateUniqueContent(corpus);
  validateDownload(corpus);
  validateGeneratedContent(corpus);
  const scannedFiles = validatePublishedTerminology(options);
  return { concepts: corpus.concepts.length, industries: corpus.industries.length,
    diagrams: [...corpus.concepts, ...corpus.industries].reduce((sum, entry) => sum + entry.value.diagrams.length, 0), scannedFiles };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log('Content validation passed:', validateAll({ published: process.argv.includes('--published') })); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
