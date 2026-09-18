export type Diagram = { title: string; type: 'flowchart' | 'sequence' | 'state'; code: string; caption: string };
export type Reference = { title: string; url: string };
export type Concept = {
  id: number; title: string; slug: string; category: number; summary: string;
  overview: string[];
  production: { poc: string; production: string; scale: string };
  components: { name: string; role: string }[];
  flow: { title: string; description: string }[];
  diagrams: Diagram[];
  useCase: { industry: string; title: string; situation: string; problem: string; requirement: string; architecture: string; runtime: string[]; failure: string; impact: string };
  tradeoffs: { decision: string; benefit: string; cost: string }[];
  failures: { scenario: string; detection: string; recovery: string }[];
  mistakes: { mistake: string; fix: string }[];
  whenToUse: string[]; whenNotToUse: string[]; checklist: string[];
  related: number[]; keywords: string[]; references: Reference[];
};
export type Industry = {
  slug: string; name: string; sector: string; icon: string; title: string; summary: string;
  situation: string; problem: string; whyAgents: string; outcome: string;
  agents: { name: string; responsibility: string; tools: string[]; boundary: string }[];
  systems: { name: string; role: string }[];
  flow: { title: string; description: string }[];
  diagrams: Diagram[];
  failures: { scenario: string; detection: string; recovery: string }[];
  controls: string[]; metrics: { name: string; definition: string }[];
  tradeoffs: { decision: string; benefit: string; cost: string }[];
  rollout: { phase: string; acceptance: string }[];
  related: number[]; references: Reference[];
};
