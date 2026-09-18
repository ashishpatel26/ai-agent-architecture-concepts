import catalog from '../data/catalog.json';
import type { Concept, Industry } from './content-types';
export const concepts = catalog.concepts;
export const industries = catalog.industries;
export type ConceptSummary = typeof concepts[number];
export type IndustrySummary = typeof industries[number];
export const BASE = '/ai-agent-architecture-concepts/';
export const SITE = 'https://ashishpatel26.github.io' + BASE;
export const SITE_TITLE = 'Top 100 AI Agent Architecture Design Concepts';
export const href = (path = '') => BASE + path.replace(/^\//, '');
export const conceptPath = (c: {slug:string}) => `concepts/${c.slug}/`;
export const industryPath = (i: {slug:string}) => `industries/${i.slug}/`;
export const conceptById = (id:number) => concepts.find(c=>c.id===id);
const cache = new Map<string, Concept | Industry>();
const embedded = document.getElementById('page-data');
if (embedded?.textContent) {
  try { const data = JSON.parse(embedded.textContent); if(data.kind && data.content?.slug) cache.set(`${data.kind}/${data.content.slug}`, data.content); } catch { /* Load the public content file if initial data is unavailable. */ }
}
export const getCached = (kind:'concepts'|'industries', slug:string) => cache.get(`${kind}/${slug}`);
export async function loadContent(kind:'concepts'|'industries', slug:string, signal?:AbortSignal) {
  const key = `${kind}/${slug}`;
  if(cache.has(key)) return cache.get(key)!;
  const response = await fetch(href(`content/${kind}/${slug}.json`), {signal});
  if(!response.ok) throw new Error(`This guide could not load (${response.status}).`);
  const data = await response.json() as Concept | Industry;
  cache.set(key,data);
  return data;
}
export type SearchEntry = {type:string;key:string;text:string};
let searchPromise:Promise<SearchEntry[]> | undefined;
export function loadSearchIndex() {
  if(!searchPromise) searchPromise = fetch(href('content/search-index.json')).then(r=>{if(!r.ok)throw new Error('Search index unavailable'); return r.json() as Promise<SearchEntry[]>;}).catch(e=>{searchPromise=undefined;throw e;});
  return searchPromise;
}
