import { useEffect, useId, useRef, useState } from 'react';
import { Check, Code2, Copy, Download, Expand, Minus, Plus, RotateCcw, Workflow } from 'lucide-react';
import type { Diagram } from '../lib/content-types';
import { useDark } from '../lib/state';

let renderQueue:Promise<unknown>=Promise.resolve();
export default function MermaidDiagram({diagram}:{diagram:Diagram}){
  const dark=useDark();const id=useId().replace(/[^a-zA-Z0-9]/g,'');
  const frame=useRef<HTMLElement>(null);const host=useRef<HTMLDivElement>(null);
  const [visible,setVisible]=useState(false);const [status,setStatus]=useState('loading');const [source,setSource]=useState(false);const [zoom,setZoom]=useState(1);const [copied,setCopied]=useState(false);const [notice,setNotice]=useState('');const svg=useRef('');
  useEffect(()=>{const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setVisible(true);observer.disconnect();}},{rootMargin:'300px'});if(frame.current)observer.observe(frame.current);return()=>observer.disconnect();},[]);
  useEffect(()=>{
    if(!visible)return;let canceled=false;setStatus('loading');svg.current='';
    const task=async()=>{
      try{
        if(canceled)return;
        const {default:mermaid}=await import('mermaid');
        if(canceled)return;
        await document.fonts.ready;
        if(canceled)return;
        mermaid.initialize({startOnLoad:false,securityLevel:'strict',theme:'base',fontFamily:'DM Sans, sans-serif',flowchart:{htmlLabels:false,curve:'basis',useMaxWidth:false},sequence:{useMaxWidth:false},themeVariables:dark?{darkMode:true,background:'#13212b',primaryColor:'#193e43',primaryTextColor:'#e9f3f4',primaryBorderColor:'#4aaba0',lineColor:'#8aaeb7',secondaryColor:'#233347',tertiaryColor:'#27303e',fontSize:'14px'}:{background:'#f7fafb',primaryColor:'#e1f3ed',primaryTextColor:'#183b36',primaryBorderColor:'#6eaa99',lineColor:'#6d8994',secondaryColor:'#e9effb',tertiaryColor:'#f5f1e7',fontSize:'14px'}});
        const definition=diagram.code.split('\n');definition.splice(1,0,`accTitle: ${diagram.title.replace(/\n/g,' ')}`,`accDescr: ${diagram.caption.replace(/\n/g,' ')}`);
        const result=await mermaid.render(`architecture-${id}-${dark?'dark':'light'}`,definition.join('\n'));
        if(canceled)return;
        if(host.current){host.current.innerHTML=result.svg;svg.current=result.svg;setStatus('ready');}
      }catch{if(!canceled)setStatus('error');}
    };renderQueue=renderQueue.then(task,task);return()=>{canceled=true;};
  },[visible,dark,diagram.code,diagram.title,diagram.caption,id]);
  const copy=async()=>{try{await navigator.clipboard.writeText(diagram.code);setCopied(true);setTimeout(()=>setCopied(false),2000);}catch{setSource(true);setNotice('Select and copy the Mermaid definition below.');}};
  const download=()=>{if(!svg.current)return;const url=URL.createObjectURL(new Blob([svg.current],{type:'image/svg+xml'}));const a=document.createElement('a');a.href=url;a.download=`${diagram.title.toLowerCase().replace(/[^a-z0-9]+/g,'-')}.svg`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  const fullscreen=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await frame.current?.requestFullscreen();}catch{setNotice('Fullscreen is unavailable in this browser. Use the zoom controls to inspect the diagram.');}};
  return <figure ref={frame} className={`mermaid-figure ${status==='ready'?'is-rendered':''}`} data-diagram-title={diagram.title}>
    <div className="diagram-toolbar"><span><Workflow size={16}/>{diagram.title}</span><div><button className={`icon-button ${source?'selected':''}`} onClick={()=>setSource(!source)} aria-label="Show Mermaid source" aria-pressed={source}><Code2 size={15}/></button><button className="icon-button" onClick={copy} aria-label="Copy Mermaid source">{copied?<Check size={15}/>:<Copy size={15}/>}</button><button className="icon-button" onClick={download} disabled={status!=='ready'} aria-label="Download diagram as SVG"><Download size={15}/></button><button className="icon-button" onClick={fullscreen} aria-label="Expand diagram"><Expand size={15}/></button></div></div>
    <div className="diagram-canvas" hidden={source}>{status==='loading'&&<div className="diagram-loading" role="status"><Workflow size={23}/>Rendering architecture…</div>}{status==='error'&&<div className="diagram-error" role="alert">The visual could not render. The architecture flow and source remain available.<button className="text-link" onClick={()=>setSource(true)}>View Mermaid source</button></div>}<div ref={host} className="diagram-svg" style={{width:`${zoom*100}%`}} hidden={status!=='ready'}/></div>
    {source&&<pre className="diagram-source"><code>{diagram.code}</code></pre>}
    <div className="diagram-footer"><span>MERMAID · {diagram.type.toUpperCase()}</span><div className="zoom-controls"><button onClick={()=>setZoom(z=>Math.max(.5,z-.25))} disabled={zoom<=.5} aria-label="Zoom out"><Minus size={13}/></button><span>{Math.round(zoom*100)}%</span><button onClick={()=>setZoom(z=>Math.min(3,z+.25))} disabled={zoom>=3} aria-label="Zoom in"><Plus size={13}/></button><button onClick={()=>setZoom(1)} aria-label="Reset zoom"><RotateCcw size={13}/></button></div></div>
    <figcaption>{diagram.caption}</figcaption>{notice&&<p role="status" className="diagram-notice">{notice}</p>}
  </figure>;
}
