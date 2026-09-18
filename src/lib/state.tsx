import { createContext, useContext, useEffect, useState } from 'react';
export const ThemeContext = createContext(false);
export const useDark = () => useContext(ThemeContext);
export function usePersistent<T>(key:string, initial:T, validate?:(value:unknown)=>T) {
  const [value,setValue] = useState<T>(()=>{try{const saved=localStorage.getItem(key);if(!saved)return initial;const parsed=JSON.parse(saved);return validate?validate(parsed):parsed;}catch{return initial;}});
  useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{/* Browser settings may disable persistent storage. */}},[key,value]);
  return [value,setValue] as const;
}
export type Progress = {completed:number[];saved:number[];practiced:number[];lastTopic:number|null};
const validIds = (value:unknown) => Array.isArray(value)?[...new Set(value.filter((id):id is number=>Number.isInteger(id)&&id>=1&&id<=112))]:[];
export const cleanProgress = (value:unknown):Progress=>{
  const p=(value&&typeof value==='object'?value:{}) as Partial<Progress>;
  return {completed:validIds(p.completed),saved:validIds(p.saved),practiced:validIds(p.practiced),lastTopic:typeof p.lastTopic==='number'&&p.lastTopic>=1&&p.lastTopic<=112?p.lastTopic:null};
};
export const emptyProgress:Progress={completed:[],saved:[],practiced:[],lastTopic:null};
export function currentPath(){return location.pathname.replace(/^\/ai-agent-architecture-concepts\/?/,'').replace(/^\/+|\/+$/g,'');}
export function navigate(path:string){history.pushState({},'',`/ai-agent-architecture-concepts/${path.replace(/^\//,'')}`);window.dispatchEvent(new PopStateEvent('popstate'));}
