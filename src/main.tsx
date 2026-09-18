import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import { concepts, conceptPath, href } from './lib/catalog';

// Preserve shared links from the first edition while publishing canonical URLs.
if (location.hash.startsWith('#/')) {
  const legacy = location.hash.slice(2);
  const [route, query = ''] = legacy.split('?');
  const topic = /^topic\/(\d+)$/.exec(route);
  const mapped:Record<string,string> = {overview:'',topics:'concepts/',path:'learning-paths/',diagrams:'diagrams/',practice:'practice/',saved:'saved/',progress:'progress/'};
  const concept = topic ? concepts.find(c=>c.id===Number(topic[1])) : undefined;
  const category = new URLSearchParams(query).get('category');
  const domainRoutes = ['agentic-frameworks','security-governance','resilience-reliability','rag-data-architecture','model-optimization-infrastructure'];
  const mappedRoute = Object.prototype.hasOwnProperty.call(mapped,route) ? mapped[route] : undefined;
  const destination = concept ? conceptPath(concept) : route==='topics'&&category!==null&&/^[0-4]$/.test(category) ? `${domainRoutes[Number(category)]}/` : mappedRoute;
  if(destination!==undefined) history.replaceState({},'',href(destination));
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>,
);
