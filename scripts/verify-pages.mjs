import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
const base='/ai-agent-architecture-concepts/';
const site='https://ashishpatel26.github.io'+base;
const directory=resolve('docs');
const routes=JSON.parse(readFileSync(join(directory,'routes.json'),'utf8'));
assert.equal(routes.length,155,'Expected 155 complete published routes');
assert.equal(new Set(routes.map(r=>r.path)).size,routes.length,'Duplicate published paths');
const titles=new Set();
let links=0;
for(const route of routes){
 const html=readFileSync(join(directory,route.path,'index.html'),'utf8');
 const title=html.match(/<title>([^<]+)<\/title>/)?.[1];
 assert.ok(title,`Missing title: ${route.path}`);assert.ok(!titles.has(title),`Duplicate title: ${title}`);titles.add(title);
 assert.ok(html.includes(`<link rel="canonical" href="${site+route.path}"`),`Wrong canonical: ${route.path}`);
 assert.ok(/<meta name="description" content=".{30,}"/.test(html),`Missing description: ${route.path}`);
 for(const field of ['og:title','og:description','og:url'])assert.ok(html.includes(`property="${field}"`),`Missing ${field}: ${route.path}`);
 assert.ok(html.includes('<h1>'),`Missing visible initial content: ${route.path}`);
 if(route.kind!=='collection')assert.ok(html.includes('id="page-data"'),`Missing initial route data: ${route.path}`);
 assert.ok(!/anaplan|अनप्लान|अनाप्लान/i.test(html),`Prohibited terminology: ${route.path}`);
 for(const [,attribute,value] of html.matchAll(/\b(src|href)="([^"]+)"/g)){
  if(value.startsWith('https://')||value.startsWith('http://')||value.startsWith('#')||value.startsWith('data:'))continue;
  assert.ok(value.startsWith(base),`Resource escapes project path: ${route.path} ${attribute}=${value}`);
  const relative=decodeURIComponent(value.slice(base.length).split(/[?#]/)[0]);
  let target=join(directory,relative);if(existsSync(target)&&statSync(target).isDirectory())target=join(target,'index.html');
  assert.ok(existsSync(target),`Broken published link: ${route.path} -> ${relative}`);links++;
 }
}
for(const filename of ['.nojekyll','curriculum.md','favicon.svg','404.html','sitemap.xml','content/search-index.json','licenses/dm-sans.txt','licenses/manrope.txt','licenses/noto-sans-devanagari.txt'])assert.ok(existsSync(join(directory,filename)),`Missing public file: ${filename}`);
const index=JSON.parse(readFileSync(join(directory,'content/search-index.json'),'utf8'));assert.equal(index.length,140,'Full-text index must contain all112 concepts and28industries');
const css=readdirSync(join(directory,'assets')).filter(file=>file.endsWith('.css'));assert.ok(css.length);
for(const file of css){const content=readFileSync(join(directory,'assets',file),'utf8');for(const match of content.matchAll(/url\((?:["']?)([^)"']+)(?:["']?)\)/g)){const asset=match[1];if(asset.startsWith('data:')||asset.startsWith('#'))continue;assert.ok(asset.startsWith(base),`Stylesheet resource escapes base: ${asset}`);assert.ok(existsSync(join(directory,asset.slice(base.length))),`Missing stylesheet resource: ${asset}`);}}
const walk=folder=>readdirSync(folder).flatMap(name=>{const path=join(folder,name);return statSync(path).isDirectory()?walk(path):[path];});
for(const file of walk(directory).filter(f=>/\.(html|json|js|css|md|svg|xml)$/.test(f)))assert.ok(!/anaplan|अनप्लान|अनाप्लान/i.test(readFileSync(file,'utf8')),`Prohibited terminology in generated ${file}`);
console.log(`GitHub Pages verified: ${routes.length} complete routes, ${links} internal resources/links, 140 searchable guides, unique metadata, sitemap, fonts, diagrams, and vendor-neutral output.`);
