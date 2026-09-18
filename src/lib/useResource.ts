import { useEffect, useState } from 'react';
import { getCached, loadContent } from './catalog';
import type { Concept, Industry } from './content-types';
export function useResource<T extends Concept|Industry>(kind:'concepts'|'industries',slug:string){
  const [data,setData]=useState<T|undefined>(()=>getCached(kind,slug) as T|undefined);
  const [error,setError]=useState('');const [attempt,setAttempt]=useState(0);
  useEffect(()=>{const controller=new AbortController();setError('');setData(getCached(kind,slug) as T|undefined);loadContent(kind,slug,controller.signal).then(value=>{if(!controller.signal.aborted)setData(value as T);}).catch(e=>{if(!controller.signal.aborted)setError(e instanceof Error?e.message:'This guide could not load.');});return()=>controller.abort();},[kind,slug,attempt]);
  return {data:data?.slug===slug?data:undefined,error,retry:()=>setAttempt(a=>a+1)};
}
