import metadata from './domain-metadata.json';
export const domains = metadata;
export const learningPaths = [
  { name: 'Design your first agent system', tag: 'FOUNDATIONS', description: 'Build a mental model of coordination, tools, memory, and safe execution.', ids: [1, 2, 3, 5, 8, 11, 12, 21, 41, 55] },
  { name: 'Take a system into production', tag: 'PRODUCTION', description: 'Put explicit boundaries around access, failure, recovery, and operational ownership.', ids: [22, 24, 27, 34, 44, 49, 50, 57, 58, 60] },
  { name: 'Engineer retrieval and inference', tag: 'SCALE', description: 'Connect useful evidence to efficient inference, then validate the whole system.', ids: [62, 63, 65, 67, 70, 71, 81, 84, 90, 93] },
  { name: 'Build the next layer', tag: 'ADVANCED', description: 'Explore protocol boundaries, evaluation, durable execution, and agent identity.', ids: [101, 102, 103, 104, 105, 106, 107, 109, 110, 112] },
];
export const lifecycle = [
  { title: 'Define', text: 'Set the task, evidence, and decision boundary.', ids: [1, 5, 8] },
  { title: 'Connect', text: 'Give agents the right tools and knowledge.', ids: [11, 62, 67] },
  { title: 'Secure', text: 'Authorize actions and protect enterprise data.', ids: [21, 22, 27] },
  { title: 'Operate', text: 'Observe failures and recover useful work.', ids: [41, 49, 55] },
  { title: 'Improve', text: 'Evaluate quality, capacity, and cost.', ids: [81, 93, 102] },
];
