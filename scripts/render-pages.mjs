import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const directory=resolve(process.argv[2]||'dist');
const base='/ai-agent-architecture-concepts/';
const site='https://ashishpatel26.github.io'+base;
const siteTitle='Top 100 AI Agent Architecture Design Concepts';
const description='An enterprise architecture reference for designing, deploying, securing, scaling and operating AI agents.';
const readCollection=folder=>readdirSync(folder).filter(n=>n.endsWith('.json')).sort().map(n=>JSON.parse(readFileSync(join(folder,n),'utf8')));
const concepts=readCollection('src/content/concepts').sort((a,b)=>a.id-b.id);
const industries=readCollection('src/content/industries').sort((a,b)=>a.name.localeCompare(b.name));
const domains=JSON.parse(readFileSync('src/data/domain-metadata.json','utf8'));
const template=readFileSync(join(directory,'index.html'),'utf8');
const esc=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const url=path=>base+path;
const link=(path,text)=>`<a href="${esc(url(path))}">${esc(text)}</a>`;
const paragraphs=text=>Array.isArray(text)?text.map(t=>`<p>${esc(t)}</p>`).join(''):`<p>${esc(text)}</p>`;
const list=items=>`<ul>${items.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`;
const section=(id,title,content)=>`<section id="${id}" class="reference-section"><h2>${esc(title)}</h2>${content}</section>`;
const diagram=items=>items.map(d=>`<figure class="mermaid-figure"><figcaption>${esc(d.title)} — ${esc(d.caption)}</figcaption><pre class="diagram-source"><code>${esc(d.code)}</code></pre></figure>`).join('');
const flows=items=>`<ol class="runtime-flow">${items.map((s,i)=>`<li><span class="flow-index">${i+1}</span><div><h3>${esc(s.title)}</h3>${paragraphs(s.description)}</div></li>`).join('')}</ol>`;
const failures=items=>items.map(f=>`<article><h3>${esc(f.scenario)}</h3><p><strong>Detect:</strong> ${esc(f.detection)}</p><p><strong>Recover:</strong> ${esc(f.recovery)}</p></article>`).join('');
const tradeoffs=items=>`<div class="table-scroll"><table class="reference-table"><thead><tr><th>Decision</th><th>Benefit</th><th>Cost</th></tr></thead><tbody>${items.map(t=>`<tr><th>${esc(t.decision)}</th><td>${esc(t.benefit)}</td><td>${esc(t.cost)}</td></tr>`).join('')}</tbody></table></div>`;
const references=items=>`<ul class="references-list">${items.map(r=>`<li><a href="${esc(r.url)}" rel="noreferrer">${esc(r.title)}</a></li>`).join('')}</ul>`;
const conceptList=items=>`<div class="static-concept-list">${items.map(c=>`<article><h3>${link(`concepts/${c.slug}/`,`${String(c.id).padStart(2,'0')} — ${c.title}`)}</h3><p>${esc(c.summary)}</p></article>`).join('')}</div>`;
const related=ids=>`<ul>${ids.map(id=>{const c=concepts.find(t=>t.id===id);return c?`<li>${link(`concepts/${c.slug}/`,`${c.id} — ${c.title}`)}</li>`:'';}).join('')}</ul>`;
function conceptHTML(c){
 const u=c.useCase;const previous=concepts.find(x=>x.id===c.id-1&&c.id!==101);const next=concepts.find(x=>x.id===c.id+1&&c.id!==100);
 const sections=[['overview','Overview'],['production','Why it matters'],['components','Components'],['architecture','Architecture diagrams'],['runtime','Runtime flow'],['use-case','Industry use case'],['tradeoffs','Tradeoffs'],['failures','Failure scenarios'],['mistakes','Common mistakes'],['when-to-use','When to use / avoid'],['checklist','Architecture checklist'],['related','Related concepts'],['references','Primary references']];
 return `<header class="lesson-header"><div class="section-label">${esc(domains[c.category]?.title||'Advanced collection')}</div><h1>${c.id} — ${esc(c.title)}</h1><p>${esc(c.summary)}</p></header><nav class="static-toc" aria-label="On this page">${sections.map(([id,label])=>`<a href="#${id}">${label}</a>`).join('')}</nav>`+
 section('overview','Concept overview',paragraphs(c.overview))+
 section('production','Why it matters in production',`<h3>Proof of concept</h3>${paragraphs(c.production.poc)}<h3>Production</h3>${paragraphs(c.production.production)}<h3>Enterprise scale</h3>${paragraphs(c.production.scale)}`)+
 section('components','Architecture components',c.components.map(x=>`<h3>${esc(x.name)}</h3>${paragraphs(x.role)}`).join(''))+
 section('architecture','The architecture, mapped',diagram(c.diagrams))+
 section('runtime','Runtime flow',flows(c.flow))+
 section('use-case',u.title,`<p class="small-note">${esc(u.industry)} · Illustrative enterprise scenario, not a reported customer outcome.</p><h3>Business situation</h3>${paragraphs(u.situation)}<h3>The problem</h3>${paragraphs(u.problem)}<h3>Agent requirement</h3>${paragraphs(u.requirement)}<h3>Architecture</h3>${paragraphs(u.architecture)}<h3>Runtime</h3>${list(u.runtime)}<h3>Failure scenario</h3>${paragraphs(u.failure)}<h3>Operational impact</h3>${paragraphs(u.impact)}`)+
 section('tradeoffs','Architecture tradeoffs',tradeoffs(c.tradeoffs))+
 section('failures','Failure scenarios & recovery',failures(c.failures))+
 section('mistakes','Common architecture mistakes',c.mistakes.map(m=>`<h3>${esc(m.mistake)}</h3>${paragraphs(m.fix)}`).join(''))+
 section('when-to-use','When to choose this pattern',`<h3>Choose it when</h3>${list(c.whenToUse)}<h3>Avoid it when</h3>${list(c.whenNotToUse)}`)+
 section('checklist','Architecture checklist',list(c.checklist))+
 section('related','Related concepts',related(c.related))+
 section('references','Primary references',references(c.references))+
 `<nav class="previous-next">${previous?link(`concepts/${previous.slug}/`,`Previous: ${previous.title}`):'<span></span>'}${next?link(`concepts/${next.slug}/`,`Next: ${next.title}`):link('advanced/','Explore advanced concepts')}</nav>`;
}
function industryHTML(i){return `<header class="lesson-header"><div class="section-label">${esc(i.name)} · INDUSTRY BLUEPRINT</div><h1>${esc(i.title)}</h1><p>${esc(i.summary)}</p>${link(`studio/?industry=${i.slug}`,'Explore in the architecture studio')}</header>`+
 section('business','The business situation',`<p class="small-note">Illustrative reference architecture. Validate requirements for your organization.</p>${paragraphs(i.situation)}<h3>Problem</h3>${paragraphs(i.problem)}<h3>Why a multi-agent system?</h3>${paragraphs(i.whyAgents)}<h3>Intended outcome</h3>${paragraphs(i.outcome)}`)+
 section('agents','Specialist agent team',i.agents.map(a=>`<h3>${esc(a.name)}</h3>${paragraphs(a.responsibility)}<h4>Tools</h4>${list(a.tools)}<h4>Authority boundary</h4>${paragraphs(a.boundary)}`).join(''))+
 section('systems','Enterprise systems',i.systems.map(s=>`<h3>${esc(s.name)}</h3>${paragraphs(s.role)}`).join(''))+
 section('architecture','Architecture diagrams',diagram(i.diagrams))+
 section('runtime','Runtime flow',flows(i.flow))+
 section('failures','Failure recovery',failures(i.failures))+
 section('controls','Security & decision boundaries',list(i.controls))+
 section('metrics','Operational metrics',`<p>Measurement definitions, not promised improvements.</p>${i.metrics.map(m=>`<h3>${esc(m.name)}</h3>${paragraphs(m.definition)}`).join('')}`)+
 section('tradeoffs','Architecture tradeoffs',tradeoffs(i.tradeoffs))+
 section('rollout','Rollout plan',i.rollout.map(r=>`<h3>${esc(r.phase)}</h3>${paragraphs(r.acceptance)}`).join(''))+
 section('concepts','Connected concepts',related(i.related))+
 section('references','Primary references',references(i.references));}
const routes=[];
function writePage(path,title,summary,body,data,keywords=[]){
 const canonical=site+path;const pageTitle=path?`${title} — AI Agent Architecture`:title;
 const structured={'@context':'https://schema.org','@type':data?'TechArticle':'CollectionPage',headline:title,name:title,description:summary,url:canonical};
 const head=`<link rel="canonical" href="${canonical}"/><meta name="keywords" content="${esc(keywords.join(', ')||'AI architecture, multi-agent systems, enterprise architecture')}"/><meta property="og:type" content="${data?'article':'website'}"/><meta property="og:site_name" content="AI Architecture Reference"/><meta property="og:title" content="${esc(pageTitle)}"/><meta property="og:description" content="${esc(summary)}"/><meta property="og:url" content="${canonical}"/><meta name="twitter:card" content="summary"/><meta name="twitter:title" content="${esc(pageTitle)}"/><meta name="twitter:description" content="${esc(summary)}"/><script type="application/ld+json">${JSON.stringify(structured).replaceAll('<','\\u003c')}</script>`;
 const staticBody=`<div id="root"><div class="static-reference"><header class="static-masthead">${link('',siteTitle)}<nav>${link('concepts/','100 concepts')}${link('industries/','Industries')}${link('advanced/','Advanced collection')}</nav></header><main>${body}</main><footer>${link('','Return to the reference')}<p>Independent educational reference. Architecture examples are illustrative.</p></footer></div></div>${data?`<script type="application/json" id="page-data">${JSON.stringify(data).replaceAll('<','\\u003c')}</script>`:''}`;
 const html=template.replace(/<title>[\s\S]*?<\/title>/,`<title>${esc(pageTitle)}</title>`).replace(/<meta name="description" content="[^"]*"\s*\/>/,`<meta name="description" content="${esc(summary)}" />`).replace('</head>',head+'\n</head>').replace('<div id="root"></div>',staticBody);
 const target=join(directory,path);mkdirSync(target,{recursive:true});writeFileSync(join(target,'index.html'),html);routes.push({path,title,description:summary,kind:data?.kind||'collection'});
}
for(const c of concepts)writePage(`concepts/${c.slug}/`,c.title,c.summary,conceptHTML(c),{kind:'concepts',content:c},c.keywords);
for(const i of industries)writePage(`industries/${i.slug}/`,i.title,i.summary,industryHTML(i),{kind:'industries',content:i},[i.name,...i.agents.map(a=>a.name)]);
for(const d of domains)writePage(`${d.slug}/`,d.title,d.description,`<h1>${esc(d.title)}</h1>${paragraphs(d.description)}<h2>${esc(d.question)}</h2>${list(d.principles)}${conceptList(concepts.filter(c=>c.category===d.id))}`);
writePage('concepts/','All 100 AI Agent Architecture Concepts','Search and explore the exact 100 architecture concepts, organized into five domains in curriculum order.',`<h1>All 100 concepts</h1>${conceptList(concepts.filter(c=>c.id<=100))}`);
writePage('advanced/','Advanced Agent Architecture Collection','Twelve additional architecture guides covering protocols, evaluation, identity, durability, isolation, and operational control.',`<h1>Advanced collection</h1><p>Extensions 101–112 supplement the original 100 concepts.</p>${conceptList(concepts.filter(c=>c.id>100))}`);
const industryList=industries.map(i=>`<article><h2>${link(`industries/${i.slug}/`,i.name+': '+i.title)}</h2>${paragraphs(i.summary)}</article>`).join('');
writePage('industries/','Industry Multi-Agent Architecture Blueprints','Explore 28 illustrative industry architectures with specialist agents, enterprise integrations, failure handling, controls, metrics, and rollout plans.',`<h1>Industry architecture blueprints</h1>${industryList}`);
writePage('studio/','Interactive Architecture Studio','Compare industry agent teams and follow the runtime flow, authority boundaries, and recovery paths in an educational walkthrough.',`<h1>Architecture studio</h1><p>Enable JavaScript to use the interactive walkthrough. Every complete blueprint is also readable below.</p>${industryList}`);
writePage('diagrams/','Architecture Diagram Library','Browse concept-specific Mermaid flowcharts, sequences, and state machines across all 112 architecture guides.',`<h1>Architecture diagram library</h1>${conceptList(concepts)}`);
writePage('learning-paths/','AI Architecture Learning Paths','Follow curated routes through foundational design, production readiness, retrieval and inference, and advanced agent architecture.',`<h1>Learning paths</h1><p>Start with orchestration and tool contracts, build production controls, then connect retrieval and model infrastructure.</p>${conceptList(concepts.filter(c=>[1,2,3,11,21,41,55,62,81,102].includes(c.id)))}`);
for(const [path,title,text] of [['practice/','Architecture Interview Practice','Practice design decisions, failure handling, and tradeoffs with self-assessed prompts based on the full curriculum.'],['saved/','Saved Architecture Concepts','Build a personal reference collection. Saved concepts are stored in your browser.'],['progress/','Your Architecture Learning Progress','Track completed concepts and practice in your browser. Export your learning progress as JSON.']])writePage(path,title,text,`<h1>${title}</h1><p>${text}</p><p>Enable JavaScript for local learning tools.</p>${link('concepts/','Browse all concepts')}`);
writePage('',siteTitle,description,`<h1>${siteTitle}</h1><p>${description}</p><p>Read 100 full lessons, 12 advanced extensions, and 28 industry blueprints. Each connects architecture components, runtime flows, Mermaid diagrams, failure handling, tradeoffs, and review checklists.</p><h2>The architecture lifecycle</h2><ol><li>Define the task and decision boundary.</li><li>Connect tools and evidence.</li><li>Secure identity, data, and actions.</li><li>Operate with observability and recovery.</li><li>Improve quality, cost, and capacity.</li></ol><h2>Five connected domains</h2>${domains.map(d=>`<h3>${link(d.slug+'/',d.title)}</h3>${paragraphs(d.description)}`).join('')}<h2>Learning paths</h2>${link('learning-paths/','Find your learning path')}<h2>Industry architecture library</h2>${link('industries/','Explore all 28 industry blueprints')}<h2>All 100 concepts</h2>${conceptList(concepts.filter(c=>c.id<=100))}<h2>Advanced collection</h2>${link('advanced/','Explore the 12 additional concepts')}`);
writeFileSync(join(directory,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(r=>`<url><loc>${site+r.path}</loc></url>`).join('')}</urlset>`);
writeFileSync(join(directory,'routes.json'),JSON.stringify(routes,null,2));
const notFound=template.replace(/<title>.*?<\/title>/,'<title>Page not found — AI Architecture</title>').replace('</head>','<meta name="robots" content="noindex"/></head>').replace('<div id="root"></div>',`<div id="root"><div class="static-reference"><h1>Page not found</h1>${link('','Return to the architecture reference')}</div></div>`);
writeFileSync(join(directory,'404.html'),notFound);
console.log(`Generated ${routes.length} real HTML routes with complete readable content, initial page data, canonical metadata, and sitemap.`);
