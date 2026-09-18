import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const base = '/ai-agent-architecture-concepts/';
const directory = resolve('docs');
const html = readFileSync(join(directory, 'index.html'), 'utf8');
const assets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1]);
assert.ok(assets.some(asset => asset.endsWith('.js')), 'No application bundle found');
for (const asset of assets) {
  assert.ok(asset.startsWith(base), `Asset escapes the GitHub Pages project path: ${asset}`);
  assert.ok(existsSync(join(directory, asset.slice(base.length))), `Missing built asset: ${asset}`);
}
for (const filename of ['.nojekyll', 'curriculum.md', 'favicon.svg', 'licenses/dm-sans.txt', 'licenses/manrope.txt', 'licenses/noto-sans-devanagari.txt']) {
  assert.ok(existsSync(join(directory, filename)), `Missing public file: ${filename}`);
}
const css = readdirSync(join(directory, 'assets')).filter(file => file.endsWith('.css'));
assert.ok(css.length > 0, 'No stylesheet found');
for (const file of css) {
  const content = readFileSync(join(directory, 'assets', file), 'utf8');
  for (const match of content.matchAll(/url\((?:["']?)([^)"']+)(?:["']?)\)/g)) {
    const asset = match[1];
    if (asset.startsWith('data:')) continue;
    assert.ok(asset.startsWith(base), `Font or image escapes the project path: ${asset}`);
    assert.ok(existsSync(join(directory, asset.slice(base.length))), `Missing stylesheet asset: ${asset}`);
  }
}
console.log(`GitHub Pages build verified: ${base} (application, styles, fonts, downloads, and licenses)`);
