import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

export const slugify = title => title.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const readCollection = folder => readdirSync(folder).filter(name => name.endsWith('.json')).sort().map(name => JSON.parse(readFileSync(join(folder, name), 'utf8')));
const concepts = readCollection('src/content/concepts').sort((a, b) => a.id - b.id);
const industries = readCollection('src/content/industries').sort((a, b) => a.name.localeCompare(b.name));
const source = JSON.parse(readFileSync('src/data/source.json', 'utf8'));
const development = process.argv.includes('--development');
if (!development && (concepts.length !== 112 || industries.length !== 28)) throw new Error(`Expected 112 lessons and 28 industries; found ${concepts.length}/${industries.length}`);
const summaries = (development ? source.map(s => concepts.find(c => c.id === s.id) || { ...s, slug: slugify(s.title), summary: s.hindi, keywords: [], components: [], overview: [] }).concat(concepts.filter(c => c.id > 100)) : concepts).map(c => ({
  id: c.id, title: c.title, slug: c.slug, category: c.category, summary: c.summary,
  keywords: c.keywords, componentNames: c.components.map(x => x.name), industry: c.useCase?.industry || '',
  words: JSON.stringify(c).split(/\s+/).length, diagrams: c.diagrams?.length || 0,
}));
mkdirSync('public/content/concepts', {recursive:true});
mkdirSync('public/content/industries', {recursive:true});
for (const c of concepts) writeFileSync(`public/content/concepts/${c.slug}.json`, JSON.stringify(c));
for (const i of industries) writeFileSync(`public/content/industries/${i.slug}.json`, JSON.stringify(i));
writeFileSync('src/data/catalog.json', JSON.stringify({concepts:summaries, industries:industries.map(i => ({slug:i.slug,name:i.name,sector:i.sector,icon:i.icon,title:i.title,summary:i.summary,agents:i.agents.length,diagrams:i.diagrams.length}))}, null, 2));
const flatten = value => typeof value === 'string' ? value : Array.isArray(value) ? value.map(flatten).join(' ') : value && typeof value === 'object' ? Object.values(value).map(flatten).join(' ') : '';
writeFileSync('public/content/search-index.json', JSON.stringify([
  ...concepts.map(c=>({type:'concept',key:String(c.id),text:flatten({...c,diagrams:[],references:[]}).toLowerCase()})),
  ...industries.map(i=>({type:'industry',key:i.slug,text:flatten({...i,diagrams:[],references:[]}).toLowerCase()})),
]));
const curriculum = '# Top 100 AI Agent Architecture Design Concepts\n\n' + source.map(c=>`${c.id}. **${c.title}:** ${c.hindi}`).join('\n\n') + '\n';
writeFileSync('public/curriculum.md', curriculum);
console.log(`Prepared ${concepts.length} complete concepts and ${industries.length} industry blueprints${development?' (development catalog)':''}.`);
