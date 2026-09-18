#!/usr/bin/env node
// Run against a Vite dev server: node scripts/validate-diagrams.mjs --url http://localhost:5175/ai-agent-architecture-concepts/
// Requires the existing gstack browse binary; no extra browser or package is installed.
import { readFile, readdir, writeFile, mkdir, unlink, access } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { setTimeout as delay } from 'node:timers/promises';

const exec = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const option = (name, fallback) => {
  const position = args.indexOf(name);
  if (position < 0) return fallback;
  if (!args[position + 1] || args[position + 1].startsWith('--')) throw new Error(`${name} requires a value`);
  return args[position + 1];
};
if (args.includes('--help')) {
  console.log('Usage: node scripts/validate-diagrams.mjs [--url DEV_URL] [--report PATH] [--state PATH]');
  console.log('Environment: BROWSE_BIN, BROWSE_STATE_FILE, GSTACK_HOME. Uses an isolated browse daemon by default.');
  process.exit(0);
}
const baseUrl = new URL(option('--url', process.env.DIAGRAM_QA_URL || 'http://localhost:5175/ai-agent-architecture-concepts/'));
if (!['http:', 'https:'].includes(baseUrl.protocol)) throw new Error('The dev server URL must use HTTP or HTTPS.');
if (!baseUrl.pathname.endsWith('/')) baseUrl.pathname += '/';
const stateFile = resolve(option('--state', process.env.BROWSE_STATE_FILE || join(tmpdir(), 'architecture-diagram-qa', 'state.json')));
const reportPath = resolve(root, option('--report', 'artifacts/diagram-validation.json'));
const browse = process.env.BROWSE_BIN || 'browse';
const temporaryDirectory = dirname(stateFile);
const harnessName = `.atlas-diagram-validation-${process.pid}.html`;
const harnessPath = join(root, harnessName);
const evalPath = join(temporaryDirectory, `start-${process.pid}.js`);
const hash = text => createHash('sha256').update(text).digest('hex');
const environment = {
  ...process.env,
  PATH: process.env.PATH || '',
  BROWSE_STATE_FILE: stateFile,
  BROWSE_PARENT_PID: '0',
  GSTACK_HOME: process.env.GSTACK_HOME || join(tmpdir(), 'architecture-gstack'),
};

async function command(...commandArgs) {
  const { stdout } = await exec(browse, commandArgs, { cwd: root, env: environment, timeout: 60_000, maxBuffer: 8 * 1024 * 1024 });
  return stdout;
}
function jsonOutput(output) {
  const start = output.indexOf('{');
  const end = output.lastIndexOf('}');
  if (start < 0 || end < start) throw new Error(`Browser returned no JSON: ${output.slice(0, 400)}`);
  return JSON.parse(output.slice(start, end + 1));
}
async function inventory() {
  const entries = [];
  const files = [];
  for (const group of ['concepts', 'industries']) {
    const directory = join(root, 'src/content', group);
    for (const filename of (await readdir(directory)).filter(name => name.endsWith('.json')).sort()) {
      const path = join(directory, filename);
      const raw = await readFile(path, 'utf8');
      const content = JSON.parse(raw);
      files.push({ file: `src/content/${group}/${filename}`, hash: hash(raw) });
      content.diagrams.forEach((diagram, index) => entries.push({
        key: `${group}/${content.id ?? content.slug}/${index}`,
        file: `src/content/${group}/${filename}`,
        contentTitle: content.title,
        index,
        diagram,
        hash: hash(JSON.stringify(diagram)),
      }));
    }
  }
  return { entries, files, hash: hash(JSON.stringify(files)) };
}

if (browse.includes('/') || browse.includes('\\')) await access(browse);
await mkdir(temporaryDirectory, { recursive: true });
const runtimeSource = await readFile(join(root, 'src/ui/MermaidDiagram.tsx'), 'utf8');
const initializerStart = runtimeSource.indexOf('mermaid.initialize(');
if (initializerStart < 0) throw new Error('Cannot find the application Mermaid initializer.');
const initializerEnd = runtimeSource.indexOf(');', initializerStart);
const initializer = runtimeSource.slice(initializerStart + 'mermaid.initialize('.length, initializerEnd);
if (!initializer.includes("securityLevel:'strict'") || !initializer.includes('htmlLabels:false')) {
  throw new Error('Runtime configuration changed: review strict security and label settings before using this harness.');
}
if (!runtimeSource.includes('accTitle:') || !runtimeSource.includes('accDescr:')) {
  throw new Error('Runtime accessibility metadata handling changed; update this validator to match it.');
}
const startedAt = new Date().toISOString();
const initial = await inventory();

const harness = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Mermaid browser validation</title>
<style>body{margin:0;padding:24px;font-family:'DM Sans',sans-serif}#host{width:1400px;min-height:1px}svg{display:block}</style>
</head><body><h1>Mermaid browser validation</h1><div id="host"></div>
<script type="module">
import mermaid from 'mermaid';
import '@fontsource-variable/dm-sans';
const configure = dark => (${initializer});
const state = window.__atlasDiagramQa = { ready:false, running:false, done:false, fatal:null, results:[], total:0, current:null };
const host = document.getElementById('host');
await document.fonts.ready;
state.ready = true;
window.__atlasRunDiagrams = entries => {
  if (state.running) throw new Error('A validation run is already active.');
  state.running = true; state.done = false; state.total += entries.length * 2;
  (async () => {
    for (const entry of entries) {
      for (const dark of [false, true]) {
        const theme = dark ? 'dark' : 'light';
        const record = { key:entry.key, file:entry.file, contentTitle:entry.contentTitle, index:entry.index, title:entry.diagram.title, type:entry.diagram.type, sourceHash:entry.hash, theme, passed:false };
        state.current = entry.key + ':' + theme;
        const start = performance.now();
        try {
          mermaid.initialize(configure(dark));
          await mermaid.parse(entry.diagram.code);
          record.originalParsePassed = true;
          const definition = entry.diagram.code.split('\\n');
          definition.splice(1, 0, 'accTitle: ' + entry.diagram.title.replace(/\\n/g, ' '), 'accDescr: ' + entry.diagram.caption.replace(/\\n/g, ' '));
          const result = await mermaid.render('qa-diagram-' + state.results.length + '-' + theme, definition.join('\\n'));
          document.documentElement.dataset.theme = theme;
          document.body.style.background = dark ? '#13212b' : '#f7fafb';
          document.body.style.color = dark ? '#e9f3f4' : '#183b36';
          host.innerHTML = result.svg;
          const svg = host.querySelector('svg');
          if (!svg) throw new Error('Renderer returned no SVG element.');
          if (host.querySelector('.error-icon,.error-text')) throw new Error('Mermaid rendered its error illustration.');
          // Mermaid may emit inert foreignObject labels even when its nested flowchart flag is false.
          // Validate active content directly instead of treating every HTML label as executable content.
          if (svg.querySelector('script,iframe,object,embed')) throw new Error('Unexpected active element in strict SVG.');
          for (const element of svg.querySelectorAll('*')) {
            for (const attribute of element.attributes) {
              if (/^on/i.test(attribute.name)) throw new Error('Unexpected event handler in strict SVG.');
              if (/^(?:xlink:)?href$/i.test(attribute.name) && /^(?:javascript|data):/i.test(attribute.value.trim())) throw new Error('Unexpected executable URL in strict SVG.');
            }
          }
          const viewBox = svg.viewBox.baseVal;
          const bounds = svg.getBoundingClientRect();
          const drawing = svg.getBBox();
          if (!(viewBox.width > 0 && viewBox.height > 0 && bounds.width > 0 && bounds.height > 0 && drawing.width > 0 && drawing.height > 0)) throw new Error('SVG has empty drawing dimensions.');
          const visibleElements = svg.querySelectorAll('path,rect,circle,ellipse,polygon,line,text');
          if (!visibleElements.length) throw new Error('SVG contains no drawing elements.');
          const title = svg.querySelector('title');
          const description = svg.querySelector('desc');
          if (!title?.textContent.trim() || !description?.textContent.trim()) throw new Error('Accessible title or description is missing.');
          if (!svg.getAttribute('aria-labelledby') || !svg.getAttribute('aria-describedby')) throw new Error('SVG does not expose its accessibility metadata.');
          Object.assign(record, { passed:true, svgBytes:new TextEncoder().encode(result.svg).length, elements:visibleElements.length, foreignObjectLabels:svg.querySelectorAll('foreignObject').length, viewBox:{width:viewBox.width,height:viewBox.height}, renderedSize:{width:bounds.width,height:bounds.height}, accessibleTitle:title.textContent, accessibleDescription:description.textContent });
        } catch (error) {
          record.error = error?.message || String(error);
        } finally {
          record.durationMs = Math.round(performance.now() - start);
          state.results.push(record);
          host.replaceChildren();
        }
      }
    }
    state.running = false; state.done = true; state.current = null;
  })().catch(error => { state.fatal = error?.stack || String(error); state.running = false; state.done = true; });
  return { started:entries.length * 2 };
};
</script></body></html>`;

try {
  await writeFile(harnessPath, harness);
  const harnessUrl = new URL(harnessName, baseUrl).href;
  // A newly launched daemon or a cold Vite server can outlive the first CLI timeout.
  try { await command('goto', harnessUrl); }
  catch { await command('goto', harnessUrl); }
  for (let attempt = 0; attempt < 60; attempt++) {
    const status = jsonOutput(await command('js', 'JSON.stringify({ready:!!window.__atlasDiagramQa?.ready})'));
    if (status.ready) break;
    if (attempt === 59) throw new Error('Browser harness did not initialize.');
    await delay(1_000);
  }

  const validated = new Map();
  async function run(entries) {
    if (!entries.length) return;
    await writeFile(evalPath, `window.__atlasRunDiagrams(${JSON.stringify(entries)})`);
    await command('eval', evalPath);
    let lastReported = -1;
    const deadline = Date.now() + 20 * 60_000;
    while (Date.now() < deadline) {
      const status = jsonOutput(await command('js', 'JSON.stringify({done:window.__atlasDiagramQa.done,total:window.__atlasDiagramQa.total,completed:window.__atlasDiagramQa.results.length,current:window.__atlasDiagramQa.current,fatal:window.__atlasDiagramQa.fatal})'));
      if (status.fatal) throw new Error(status.fatal);
      if (status.completed !== lastReported) {
        console.log(`Rendered ${status.completed}/${status.total}${status.current ? `; current ${status.current}` : ''}`);
        lastReported = status.completed;
      }
      if (status.done) {
        entries.forEach(entry => validated.set(entry.key, entry.hash));
        return;
      }
      await delay(2_000);
    }
    throw new Error('Browser diagram run exceeded its 20-minute limit.');
  }

  console.log(`Validating ${initial.entries.length} diagrams in Chromium, in light and dark themes.`);
  await run(initial.entries);
  let finalInventory = await inventory();
  // Re-read disk after rendering so late content updates cannot silently escape validation.
  for (let pass = 0; pass < 3; pass++) {
    const pending = finalInventory.entries.filter(entry => validated.get(entry.key) !== entry.hash);
    if (!pending.length) break;
    console.log(`Rechecking ${pending.length} new or changed diagrams.`);
    await run(pending);
    finalInventory = await inventory();
  }
  const stillPending = finalInventory.entries.filter(entry => validated.get(entry.key) !== entry.hash);
  if (stillPending.length) throw new Error('Content continued changing during validation; rerun on a stable snapshot.');
  if (hash(await readFile(join(root, 'src/ui/MermaidDiagram.tsx'), 'utf8')) !== hash(runtimeSource)) {
    throw new Error('Mermaid runtime configuration changed during validation; rerun with the final component.');
  }
  const browserResults = jsonOutput(await command('js', 'JSON.stringify({userAgent:navigator.userAgent,results:window.__atlasDiagramQa.results})'));
  const currentHashes = new Map(finalInventory.entries.map(entry => [entry.key, entry.hash]));
  const latest = new Map();
  for (const result of browserResults.results) {
    if (currentHashes.get(result.key) === result.sourceHash) latest.set(`${result.key}:${result.theme}`, result);
  }
  const results = [...latest.values()];
  const failures = results.filter(result => !result.passed);
  const report = {
    startedAt, completedAt:new Date().toISOString(), devServer:baseUrl.href, browser:browserResults.userAgent,
    runtimeFile:'src/ui/MermaidDiagram.tsx', runtimeHash:hash(runtimeSource),
    runtimeConfigurationHash:hash(initializer), runtimeConfiguration:initializer, inventoryHash:finalInventory.hash,
    contentFiles:finalInventory.files.length, uniqueDiagrams:finalInventory.entries.length,
    themes:['light','dark'], renders:results.length, passed:results.length-failures.length, failed:failures.length,
    checks:['Original definition parses in the browser','Runtime accessibility metadata is inserted','Strict configuration matches the application initializer','SVG and drawing dimensions are nonempty','SVG contains drawing elements','Accessible SVG title and description are linked','No Mermaid error illustration or unexpected active SVG content'],
    files:finalInventory.files, failures, results,
  };
  await mkdir(dirname(reportPath), { recursive:true });
  await writeFile(reportPath, JSON.stringify(report, null, 2) + '\n');
  if (results.length !== finalInventory.entries.length * 2) throw new Error('The report is missing one or more theme renders.');
  console.log(`${report.passed}/${report.renders} renders passed; ${report.uniqueDiagrams} unique diagrams across ${report.contentFiles} content files.`);
  console.log(`Report: ${reportPath}`);
  if (failures.length) {
    failures.forEach(result => console.error(`${result.file} [${result.index}] ${result.theme}: ${result.error}`));
    process.exitCode = 1;
  }
} finally {
  await unlink(harnessPath).catch(() => {});
  await unlink(evalPath).catch(() => {});
}
