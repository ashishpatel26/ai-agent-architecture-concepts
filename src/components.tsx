import { useEffect, useId, useState } from 'react';
import { Activity, ArrowDown, ArrowRight, Bot, Check, ChevronRight, Cpu, Database, FileText, GitBranch, Layers3, LockKeyhole, Network, Pause, Play, RotateCcw, Search, ShieldCheck, Sparkles, Workflow } from 'lucide-react';
import { categories, type Topic } from './data/topics';

export const domainIcons = [Network, ShieldCheck, Activity, Database, Cpu];

export function Brand({ compact = false }: { compact?: boolean }) {
  return <a className="brand" href="#/overview" aria-label="Architect Atlas home"><span className="brand-mark"><svg viewBox="0 0 36 36" fill="none"><path d="M7 27 18 7l11 20h-6l-5-10-5 10H7Z" fill="currentColor"/><path d="M16 25h4v5h-4z" fill="currentColor"/></svg></span>{!compact && <span>architect<span className="brand-atlas">atlas<span className="brand-dot">.</span></span></span>}</a>;
}

export function MiniDiagram({ category, large = false }: { category: number; large?: boolean }) {
  const uid = useId().replace(/:/g, '');
  const labels = [
    ['Goal', 'Orchestrator', 'Research', 'Execute', 'Review'],
    ['Request', 'Policy gate', 'Identity', 'Permissions', 'Audit'],
    ['Request', 'Circuit breaker', 'Primary', 'Fallback', 'Recovery'],
    ['Query', 'Retrieval', 'Vectors', 'Keywords', 'Context'],
    ['Prompt', 'Model router', 'Small model', 'Large model', 'Metrics'],
  ][category];
  return <svg className={`mini-diagram ${large ? 'large' : ''}`} viewBox="0 0 330 135" role="img" aria-label={`${categories[category].short}: ${labels.join(' to ')}`}>
    <defs><pattern id={`dots-${uid}`} width="13" height="13" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".7" fill="currentColor" opacity=".17"/></pattern><marker id={`arrow-${uid}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="m1 1 6 4-6 4" fill="none" stroke="currentColor" strokeWidth="1.5"/></marker></defs>
    <rect width="330" height="135" fill={`url(#dots-${uid})`}/>
    <g fill="none" stroke="currentColor" strokeWidth="1.2" opacity=".5" markerEnd={`url(#arrow-${uid})`}>
      <path d="M65 67H106"/><path d="M200 67h15q8 0 8-8V32q0-7 8-7h9"/><path d="M200 67h40"/><path d="M200 67h15q8 0 8 8v27q0 7 8 7h9"/>
      {category === 2 && <path d="M284 119v8H154V86" strokeDasharray="3 3"/>}
    </g>
    <rect className="mini-node" x="8" y="53" width="57" height="28" rx="5"/>
    <rect className="mini-node primary" x="106" y="46" width="94" height="42" rx="6"/>
    <g className="mini-node"><rect x="240" y="12" width="81" height="27" rx="5"/><rect x="240" y="54" width="81" height="27" rx="5"/><rect x="240" y="96" width="81" height="27" rx="5"/></g>
    <g fill="currentColor" textAnchor="middle" fontFamily="inherit" fontSize="10"><text x="36" y="71">{labels[0]}</text><text x="153" y="71" fontSize="10" fontWeight="600">{labels[1]}</text><text x="280" y="29">{labels[2]}</text><text x="280" y="71">{labels[3]}</text><text x="280" y="113">{labels[4]}</text></g>
  </svg>;
}

const heroStages = [
  { title: 'Start with a question', text: 'A user asks the system to explain a change in the revenue forecast.' },
  { title: 'Make a plan', text: 'The orchestrator breaks the question into research, analysis, and review.' },
  { title: 'Bring in the specialists', text: 'Focused agents retrieve evidence, use tools, and verify the results.' },
  { title: 'Keep the context', text: 'Shared state preserves the task, evidence, and progress across the workflow.' },
];

export function HeroDiagram({ onExplore }: { onExplore: () => void }) {
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setStage(s => { if (s >= 3) { setPlaying(false); return 3; } return s + 1; }), 1700);
    return () => clearInterval(timer);
  }, [playing]);
  const click = (index: number) => { setStage(index); setPlaying(false); };
  const nodes = [
    { x: 16, y: 137, w: 110, title: 'User request', subtitle: 'The big question', icon: FileText, step: 0 },
    { x: 192, y: 123, w: 149, title: 'Orchestrator', subtitle: 'Plan · route · coordinate', icon: Workflow, step: 1 },
    { x: 405, y: 30, w: 142, title: 'Research agent', subtitle: 'Find the right context', icon: Search, step: 2 },
    { x: 405, y: 139, w: 142, title: 'Tool agent', subtitle: 'Take useful action', icon: GitBranch, step: 2 },
    { x: 405, y: 248, w: 142, title: 'Review agent', subtitle: 'Check the outcome', icon: ShieldCheck, step: 2 },
    { x: 195, y: 267, w: 143, title: 'Shared memory', subtitle: 'Context that carries on', icon: Database, step: 3 },
  ];
  return <div className="hero-visual">
    <div className="diagram-kicker"><span><span className="status-dot"/> ANATOMY OF AN AI SYSTEM</span><span className="diagram-tag">Interactive</span></div>
    <svg className={`hero-svg stage-${stage}`} viewBox="0 0 565 350" aria-label="Interactive multi-agent architecture diagram">
      <defs><pattern id="hero-grid" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".75" fill="#6c8975" opacity=".24"/></pattern><marker id="hero-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="m1 1 6 4-6 4" fill="none" stroke="#729b79" strokeWidth="1.6"/></marker><filter id="node-shadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#294832" floodOpacity=".05"/></filter></defs>
      <rect width="565" height="350" fill="url(#hero-grid)"/>
      <rect x="385" y="9" width="179" height="321" rx="15" className="agent-group"/>
      <g fill="none" stroke="#91ab90" strokeWidth="1.5" markerEnd="url(#hero-arrow)">
        <path className={stage >= 1 ? 'flow-active' : ''} d="M126 166H192"/>
        <path className={stage >= 2 ? 'flow-active' : ''} d="M341 161h20q10 0 10-10V69q0-10 10-10h24"/>
        <path className={stage >= 2 ? 'flow-active' : ''} d="M341 169H405"/>
        <path className={stage >= 2 ? 'flow-active' : ''} d="M341 177h20q10 0 10 10v83q0 10 10 10h24"/>
        <path className={stage >= 3 ? 'flow-active' : ''} d="M266 199V267" strokeDasharray="4 4"/>
      </g>
      <text x="274" y="241" fontSize="9" fill="#7a8a76">read / write</text>
      {nodes.map((n, i) => <g key={i} className={`hero-node ${i === 1 ? 'orchestrator' : ''} ${stage === n.step ? 'selected' : ''}`} role="button" tabIndex={0} aria-label={`Explore ${n.title}`} onClick={() => click(n.step)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); click(n.step); } }}>
        <rect x={n.x} y={n.y} width={n.w} height={i === 1 ? 76 : 61} rx="9" filter="url(#node-shadow)"/>
        <n.icon x={n.x + 12} y={n.y + 13} width="16" height="16" strokeWidth="1.6"/>
        <text x={n.x + 12} y={n.y + (i === 1 ? 46 : 39)} fontSize={i === 1 ? '13' : '11.5'} fontWeight="600">{n.title}</text>
        <text className="node-subtitle" x={n.x + 12} y={n.y + (i === 1 ? 62 : 52)} fontSize="8.5">{n.subtitle}</text>
        <circle cx={n.x + n.w - 12} cy={n.y + 17} r="2.8" className="node-status"/>
      </g>)}
      <rect x="22" y="34" width="142" height="27" rx="13.5" className="graph-label"/><text x="35" y="51" fontSize="9" fill="#667560">Intelligence, working together.</text>
    </svg>
    <div className="hero-diagram-footer"><button className="diagram-play" aria-label={playing ? 'Pause architecture walkthrough' : 'Play architecture walkthrough'} onClick={() => { if (stage === 3) setStage(0); setPlaying(!playing); }}>{playing ? <Pause size={12}/> : <Play size={12} fill="currentColor"/>}</button><span aria-live="polite">{heroStages[stage].title}</span><div className="stage-dots">{heroStages.map((s, i) => <button key={s.title} className={stage === i ? 'active' : ''} onClick={() => click(i)} aria-label={`Step ${i + 1}: ${s.title}`}/>)}</div><button className="diagram-open" onClick={onExplore} aria-label="Open multi-agent orchestration topic"><ArrowRight size={16}/></button></div>
    <p className="diagram-caption" aria-live="polite">{heroStages[stage].text}</p>
  </div>;
}

const stepIcons = [FileText, GitBranch, Layers3, Check];

export function TopicDiagram({ topic }: { topic: Topic }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  useEffect(() => { setActive(0); setPlaying(false); }, [topic.id]);
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => setActive(s => { if (s >= topic.steps.length - 1) { setPlaying(false); return s; } return s + 1; }), 1800);
    return () => clearInterval(timer);
  }, [playing, topic.steps.length]);
  return <div className={`topic-diagram theme-${categories[topic.category].color}`}>
    <div className="topic-diagram-toolbar"><span><Workflow size={16}/> THE CONCEPT, CONNECTED</span><div><button className="icon-button" onClick={() => { setActive(0); setPlaying(false); }} aria-label="Reset diagram"><RotateCcw size={15}/></button><button className="button small" onClick={() => { if (active === 3) setActive(0); setPlaying(!playing); }}>{playing ? <Pause size={13}/> : <Play size={13}/>} {playing ? 'Pause' : 'Walk through'}</button></div></div>
    <div className="flow-steps">{topic.steps.map((label, i) => { const Icon = stepIcons[i]; return <div className="flow-step-wrap" key={label}><button className={`flow-step ${active === i ? 'active' : ''} ${active > i ? 'passed' : ''}`} onClick={() => { setActive(i); setPlaying(false); }} aria-pressed={active === i}><span className="flow-step-number">0{i + 1}</span><Icon size={23}/><strong>{label}</strong><span className="flow-node-status">{active > i ? 'Explored' : active === i ? 'Exploring' : 'Next step'}</span></button>{i < 3 && <ArrowRight className="flow-arrow" size={22}/>}</div>; })}</div>
    <div className="flow-explainer" aria-live="polite"><span className="step-counter">0{active + 1} / 04</span><div><strong>{topic.steps[active]}</strong><p>{[topic.summary, `The key decision is “${topic.steps[1].toLowerCase()}”. Define the inputs and expected result of this step before passing control onward.`, `At “${topic.steps[2].toLowerCase()}”, check the result rather than assuming success. ${topic.tradeoff}`, `Finish by making the outcome of “${topic.steps[3].toLowerCase()}” visible and verifiable. ${categories[topic.category].takeaway}`][active]}</p></div><button className="icon-button" disabled={active === 3} onClick={() => setActive(a => Math.min(a + 1, 3))} aria-label="Next diagram step"><ChevronRight size={20}/></button></div>
    <p className="diagram-note">Conceptual flow · Select a step to explore it. Branches and recovery paths depend on your implementation.</p>
  </div>;
}

export function ProgressRing({ value, size = 45 }: { value: number; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 44 44" aria-label={`${value}% complete`}><circle cx="22" cy="22" r="18" fill="none" stroke="currentColor" strokeWidth="3" opacity=".12"/><circle cx="22" cy="22" r="18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray={`${value * 1.131} 113.1`} transform="rotate(-90 22 22)"/><text x="22" y="25" fill="currentColor" fontSize="10" fontFamily="inherit" textAnchor="middle" fontWeight="600">{value}%</text></svg>;
}

export function EmptyState({ icon: Icon = Search, title, text, action, onAction }: { icon?: typeof Search; title: string; text: string; action?: string; onAction?: () => void }) {
  return <div className="empty-state"><span><Icon size={28}/></span><h3>{title}</h3><p>{text}</p>{action && <button className="button primary" onClick={onAction}>{action}<ArrowRight size={16}/></button>}</div>;
}

export function LevelBadge({ level }: { level: Topic['level'] }) {
  return <span className={`level-badge level-${level.toLowerCase()}`}><span className="level-bars"><i/><i/><i/></span>{level}</span>;
}

export const featureIcons = { Bot, Sparkles, ArrowDown, LockKeyhole };
