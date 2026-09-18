import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Activity, ArrowRight, ArrowUpRight, BookOpen, Bookmark, Building2, Check, ChevronRight, GraduationCap, Layers3, Menu, Moon, Network, PanelLeftClose, Route, Search, Sparkles, Sun, Workflow, X } from 'lucide-react';
import { domains } from './data/domains';
import { concepts, conceptPath, href, industries, SITE, SITE_TITLE } from './lib/catalog';
import { cleanProgress, currentPath, emptyProgress, ThemeContext, usePersistent } from './lib/state';
import Welcome from './pages/Welcome';
import CatalogPage, { IndustriesPage } from './pages/CatalogPage';
import ConceptPage from './pages/ConceptPage';
import IndustryPage from './pages/IndustryPage';
import StudioPage from './pages/StudioPage';
import { LearningPaths, PracticePage, ProgressPage } from './pages/LearningPages';
import { Brand, domainIcons, EmptyState } from './ui/primitives';
const SearchDialog=lazy(()=>import('./ui/SearchDialog'));
const nav=[{path:'concepts',label:'All 100 concepts',Icon:BookOpen,badge:'100'},{path:'industries',label:'Industry architectures',Icon:Building2,badge:'28'},{path:'studio',label:'Architecture studio',Icon:Network,badge:'NEW'},{path:'diagrams',label:'Diagram library',Icon:Workflow},{path:'learning-paths',label:'Learning paths',Icon:Route},{path:'advanced',label:'Advanced collection',Icon:Sparkles,badge:'+12'},{path:'practice',label:'Interview practice',Icon:GraduationCap}];
const defaultDescription='An enterprise architecture reference for designing, deploying, securing, scaling and operating AI agents.';
const collectionMetadata:Record<string,{title:string;description:string}>={
  concepts:{title:'All 100 AI Agent Architecture Concepts',description:'Search and explore the exact 100 architecture concepts, organized into five domains in curriculum order.'},
  advanced:{title:'Advanced Agent Architecture Collection',description:'Twelve additional architecture guides covering protocols, evaluation, identity, durability, isolation, and operational control.'},
  industries:{title:'Industry Multi-Agent Architecture Blueprints',description:'Explore 28 illustrative industry architectures with specialist agents, enterprise integrations, failure handling, controls, metrics, and rollout plans.'},
  studio:{title:'Interactive Architecture Studio',description:'Compare industry agent teams and follow the runtime flow, authority boundaries, and recovery paths in an educational walkthrough.'},
  diagrams:{title:'Architecture Diagram Library',description:'Browse concept-specific Mermaid flowcharts, sequences, and state machines across all 112 architecture guides.'},
  'learning-paths':{title:'AI Architecture Learning Paths',description:'Follow curated routes through foundational design, production readiness, retrieval and inference, and advanced agent architecture.'},
  practice:{title:'Architecture Interview Practice',description:'Practice design decisions, failure handling, and tradeoffs with self-assessed prompts based on the full curriculum.'},
  saved:{title:'Saved Architecture Concepts',description:'Build a personal reference collection. Saved concepts are stored in your browser.'},
  progress:{title:'Your Architecture Learning Progress',description:'Track completed concepts and practice in your browser. Export your learning progress as JSON.'},
};

function App(){
  const [path,setPath]=useState(currentPath);const [progress,setProgress]=usePersistent('atlas-progress',emptyProgress,cleanProgress);
  const [dark,setDark]=useState(()=>{try{return localStorage.getItem('atlas-theme')==='dark';}catch{return false;}});
  const [search,setSearch]=useState(false);const [mobile,setMobile]=useState(false);const [isMobile,setIsMobile]=useState(()=>matchMedia('(max-width: 900px)').matches);const [toast,setToast]=useState('');
  const welcome=path==='';const parts=path.split('/');const selectedConcept=parts.length===2&&parts[0]==='concepts'&&parts[1]?concepts.find(c=>c.slug===parts[1]):undefined;
  const selectedIndustry=parts.length===2&&parts[0]==='industries'&&parts[1]?industries.find(i=>i.slug===parts[1]):undefined;const selectedDomain=domains.find(d=>d.slug===path);
  const knownRoute=welcome||Boolean(selectedConcept||selectedIndustry||selectedDomain)||Object.prototype.hasOwnProperty.call(collectionMetadata,path);
  const firstRoute=useRef(true);
  const pageNames:Record<string,string>={saved:'Saved concepts',progress:'My progress'};
  const pageName=Object.prototype.hasOwnProperty.call(pageNames,path)?pageNames[path]:undefined;
  const label=selectedConcept?.title||selectedIndustry?.name||selectedDomain?.short||nav.find(n=>n.path===path)?.label||pageName||'Welcome';
  useEffect(()=>{
    const change=()=>{setPath(currentPath());setMobile(false);};
    window.addEventListener('popstate',change);
    const click=(e:MouseEvent)=>{
      if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
      const a=(e.target as Element).closest('a');
      if(!a||a.target||a.hasAttribute('download')||a.getAttribute('href')?.startsWith('#'))return;
      const url=new URL(a.href);
      // Let the browser manage same-document fragments and their history entries.
      if(url.origin===location.origin&&url.pathname===location.pathname&&url.search===location.search&&url.hash)return;
      if(url.origin===location.origin&&url.pathname.startsWith(href())){
        e.preventDefault();history.pushState({},'',url.pathname+url.search+url.hash);change();
      }
    };
    document.addEventListener('click',click);
    const keys=(e:KeyboardEvent)=>{const typing=(e.target as HTMLElement)?.matches('input,textarea,select,[contenteditable=true]');if((e.metaKey||e.ctrlKey)&&e.key==='k'||e.key==='/'&&!typing){e.preventDefault();setSearch(s=>!s);}if(e.key==='Escape')setMobile(false);};
    window.addEventListener('keydown',keys);
    return()=>{window.removeEventListener('popstate',change);document.removeEventListener('click',click);window.removeEventListener('keydown',keys);};
  },[]);
  useEffect(()=>{
    const main=document.getElementById('main-content');
    if(!main)return;
    if(!firstRoute.current){window.scrollTo(0,0);main.focus({preventScroll:true});}
    firstRoute.current=false;
    let observer:MutationObserver|undefined;let frame:number|undefined;
    const cancel=()=>{observer?.disconnect();observer=undefined;if(frame!==undefined)cancelAnimationFrame(frame);frame=undefined;};
    const restoreFragment=(preserveNative=false)=>{
      cancel();const hash=location.hash;if(!hash)return;
      let id:string;try{id=decodeURIComponent(hash.slice(1));}catch{return;}
      const findTarget=()=>{const target=document.getElementById(id);return target&&main.contains(target)?target:null;};
      if(preserveNative&&findTarget())return;
      const restore=()=>{
        if(location.hash!==hash||currentPath()!==path){cancel();return;}
        const target=findTarget();if(!target)return;
        observer?.disconnect();observer=undefined;
        frame=requestAnimationFrame(()=>{frame=undefined;if(location.hash===hash&&currentPath()===path&&target.isConnected)target.scrollIntoView();});
      };
      // A fetched guide may not have mounted its section yet.
      observer=new MutationObserver(restore);observer.observe(main,{childList:true,subtree:true});restore();
    };
    restoreFragment();
    const hashChanged=()=>restoreFragment(true);
    window.addEventListener('hashchange',hashChanged);
    return()=>{cancel();window.removeEventListener('hashchange',hashChanged);};
  },[path]);
  useEffect(()=>{const media=matchMedia('(max-width: 900px)');const change=()=>{setIsMobile(media.matches);if(!media.matches)setMobile(false);};media.addEventListener('change',change);return()=>media.removeEventListener('change',change);},[]);
  useEffect(()=>{document.documentElement.dataset.theme=dark?'dark':'light';document.documentElement.style.colorScheme=dark?'dark':'light';try{localStorage.setItem('atlas-theme',dark?'dark':'light');}catch{}},[dark]);
  useEffect(()=>{document.body.style.overflow=mobile||search?'hidden':'';},[mobile,search]);
  useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(''),3000);return()=>clearTimeout(timer);},[toast]);
  useEffect(()=>{if(selectedConcept)setProgress(p=>p.lastTopic===selectedConcept.id?p:{...p,lastTopic:selectedConcept.id});},[selectedConcept,setProgress]);
  useEffect(()=>{
    const name=welcome?SITE_TITLE:selectedConcept?.title||selectedIndustry?.title||selectedDomain?.title||collectionMetadata[path]?.title||'Page not found';
    const title=welcome?name:`${name} — AI Agent Architecture`;
    const description=selectedConcept?.summary||selectedIndustry?.summary||selectedDomain?.description||collectionMetadata[path]?.description||(knownRoute?defaultDescription:'This page could not be found. Browse the architecture reference to find a concept or industry blueprint.');
    const canonicalUrl=SITE+path+(path?'/':'');const article=Boolean(selectedConcept||selectedIndustry);
    document.title=title;
    const meta=(name:string,content:string,property=false)=>{const attribute=property?'property':'name';let tag=document.head.querySelector(`meta[${attribute}="${name}"]`);if(!tag){tag=document.createElement('meta');tag.setAttribute(attribute,name);document.head.appendChild(tag);}tag.setAttribute('content',content);};
    meta('description',description);
    meta('keywords',selectedConcept?.keywords.join(', ')||(selectedIndustry?`${selectedIndustry.name}, ${selectedIndustry.sector}, multi-agent architecture`:'AI architecture, multi-agent systems, enterprise architecture'));
    meta('og:type',article?'article':'website',true);meta('og:site_name','AI Architecture Reference',true);
    meta('og:title',title,true);meta('og:description',description,true);meta('og:url',canonicalUrl,true);
    meta('twitter:card','summary');meta('twitter:title',title);meta('twitter:description',description);meta('twitter:url',canonicalUrl);
    if(knownRoute)document.head.querySelectorAll('meta[name="robots"]').forEach(tag=>tag.remove());else meta('robots','noindex');
    let canonical=document.head.querySelector('link[rel="canonical"]');
    if(knownRoute){if(!canonical){canonical=document.createElement('link');canonical.setAttribute('rel','canonical');document.head.appendChild(canonical);}canonical.setAttribute('href',canonicalUrl);}else canonical?.remove();
    const structuredTags=[...document.head.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]')];
    if(knownRoute){
      const structured=structuredTags.shift()||document.createElement('script');structured.type='application/ld+json';structured.id='route-structured-data';
      structured.textContent=JSON.stringify({'@context':'https://schema.org','@type':article?'TechArticle':'CollectionPage',headline:name,name,description,url:canonicalUrl});
      if(!structured.isConnected)document.head.appendChild(structured);
    }
    structuredTags.forEach(tag=>tag.remove());
  },[welcome,path,knownRoute,selectedConcept,selectedIndustry,selectedDomain]);
  const save=(id:number)=>{setProgress(p=>({...p,saved:p.saved.includes(id)?p.saved.filter(n=>n!==id):[...p.saved,id]}));setToast(progress.saved.includes(id)?'Removed from saved concepts':'Concept saved to your collection');};
  const complete=(id:number)=>{setProgress(p=>({...p,completed:p.completed.includes(id)?p.completed.filter(n=>n!==id):[...p.completed,id]}));setToast(progress.completed.includes(id)?'Concept marked incomplete':'Concept completed. Your progress is saved.');};
  const coreComplete=progress.completed.filter(id=>id<=100).length;
  let content:React.ReactNode;
  if(welcome)content=<Welcome progress={progress} onSave={save}/>;
  else if(selectedConcept)content=<ConceptPage key={selectedConcept.slug} summary={selectedConcept} progress={progress} onSave={save} onComplete={complete}/>;
  else if(selectedIndustry)content=<IndustryPage key={selectedIndustry.slug} summary={selectedIndustry}/>;
  else if(selectedDomain)content=<CatalogPage key={path} domain={selectedDomain.id} progress={progress} onSave={save}/>;
  else if(['concepts','advanced','saved','diagrams'].includes(path))content=<CatalogPage key={path} mode={path as 'concepts'|'advanced'|'saved'|'diagrams'} progress={progress} onSave={save}/>;
  else if(path==='industries')content=<IndustriesPage/>;
  else if(path==='studio')content=<StudioPage/>;
  else if(path==='learning-paths')content=<LearningPaths progress={progress}/>;
  else if(path==='practice')content=<PracticePage progress={progress} onPractice={id=>setProgress(p=>({...p,practiced:[...new Set([...p.practiced,id])]}))}/>;
  else if(path==='progress')content=<ProgressPage progress={progress}/>;
  else content=<EmptyState title="This path has not been mapped." text="The page may have moved. Search the reference or return to the full collection." action={<a href={href('concepts/')} className="button primary">Explore all concepts<ArrowRight size={16}/></a>}/>;
  return <ThemeContext.Provider value={dark}><div className={`app ${welcome?'is-welcome':''} ${mobile?'menu-open':''}`}><a className="skip-link" href="#main-content">Skip to content</a>{mobile&&<button className="nav-backdrop" onClick={()=>setMobile(false)} aria-label="Close navigation backdrop"/>}<aside className={`sidebar ${mobile?'open':''}`} aria-label="Primary navigation" inert={!mobile&&(isMobile||welcome)}><div className="sidebar-brand"><Brand/><button className="icon-button mobile-close" onClick={()=>setMobile(false)} aria-label="Close navigation"><PanelLeftClose size={20}/></button></div><a className="sidebar-home" href={href()}><Layers3 size={16}/><span>Enterprise design reference</span><ArrowUpRight size={13}/></a><div className="nav-label">EXPLORE THE REFERENCE</div><nav>{nav.map(item=><a className={`nav-item ${path===item.path||item.path==='concepts'&&Boolean(selectedConcept||selectedDomain)?'active':''}`} href={href(`${item.path}/`)} key={item.path} aria-current={path===item.path?'page':undefined}><item.Icon size={18}/><span>{item.label}</span>{item.badge&&<small className={item.badge==='NEW'?'new-badge':''}>{item.badge}</small>}</a>)}</nav><div className="nav-label">THE FIVE DOMAINS</div><nav className="domain-nav">{domains.map(d=>{const Icon=domainIcons[d.id];return <a key={d.id} href={href(`${d.slug}/`)} className={selectedDomain?.id===d.id?'active':''}><Icon size={14}/><span>{d.short}</span><small>20</small></a>;})}</nav><div className="nav-label">YOUR LEARNING</div><nav><a href={href('saved/')} className={`nav-item ${path==='saved'?'active':''}`}><Bookmark size={18}/><span>Saved concepts</span>{progress.saved.length>0&&<small>{progress.saved.length}</small>}</a><a href={href('progress/')} className={`nav-item ${path==='progress'?'active':''}`}><Activity size={18}/><span>My progress</span></a></nav><div className="sidebar-bottom"><div className="sidebar-learning"><div><Sparkles size={17}/><strong>Connect one more idea.</strong></div><p>{coreComplete} of 100 core concepts complete</p><div className="learning-track"><span style={{width:`${coreComplete}%`}}/></div><a href={href(conceptPath(concepts.find(c=>c.id===(progress.lastTopic||1))||concepts[0]))}>{progress.lastTopic?'Continue learning':'Start exploring'}<ArrowUpRight size={14}/></a></div><span className="sidebar-status"><span/>Built for curious architects</span></div></aside>
    <div className="site-shell" inert={isMobile&&mobile}><header className={`topbar ${welcome?'welcome-topbar':''}`}><div className="topbar-left"><button className="icon-button mobile-menu" aria-label="Open navigation" aria-expanded={mobile} onClick={()=>setMobile(true)}><Menu size={22}/></button>{welcome?<Brand/>:<div className="topbar-breadcrumb"><a href={href()}>Reference</a><ChevronRight size={13}/><span>{label}</span></div>}</div>{welcome&&<nav className="welcome-nav"><a href={href('concepts/')}>Concepts</a><a href={href('industries/')}>Industries</a><a href={href('studio/')}>Architecture studio<span>NEW</span></a><a href={href('learning-paths/')}>Learning paths</a></nav>}<div className="topbar-actions"><button className="header-search" onClick={()=>setSearch(true)} aria-label="Search architecture reference"><Search size={17}/><span>Search the reference</span><kbd>⌘ K</kbd></button><button className="icon-button theme-toggle" aria-label={dark?'Use light theme':'Use dark theme'} onClick={()=>setDark(!dark)}>{dark?<Sun size={18}/>:<Moon size={18}/>}</button>{welcome&&<a href={href('concepts/')} className="button small header-start">Start exploring<ArrowUpRight size={14}/></a>}</div></header><main id="main-content" tabIndex={-1} className={welcome?'welcome-main':'documentation-main'} key={path}>{content}</main><footer className="site-footer"><div><Brand/><p>A visual reference for thoughtful enterprise AI design.</p></div><div><a href={href('concepts/')}>100 concepts</a><a href={href('industries/')}>Industry architectures</a><a href={href('advanced/')}>Advanced collection</a><a href={href('curriculum.md')} download="AI_Agent_Architecture_Curriculum.md">Download curriculum</a></div><span>Independent educational reference · Illustrative architectures · Progress stays in your browser</span></footer></div>{search&&<Suspense fallback={<div className="search-loading" role="status">Opening search…</div>}><SearchDialog onClose={()=>setSearch(false)}/></Suspense>}{toast&&<div className="toast" role="status"><Check size={17}/>{toast}<button className="icon-button" onClick={()=>setToast('')} aria-label="Dismiss notification"><X size={14}/></button></div>}</div></ThemeContext.Provider>;
}
export default App;
