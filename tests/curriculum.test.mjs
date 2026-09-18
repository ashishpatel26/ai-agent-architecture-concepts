import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = JSON.parse(readFileSync(new URL('../src/data/source.json', import.meta.url), 'utf8'));
const markdown = readFileSync(new URL('../Anaplan_AI_Architect_Top_100_Topics.md', import.meta.url), 'utf8');
const notes = readFileSync(new URL('../src/data/topics.ts', import.meta.url), 'utf8')
  .match(/const notes = `([\s\S]*?)`\.trim/)[1].trim().split('\n');

test('all 100 source topics retain their order and original explanations', () => {
  assert.equal(source.length, 100);
  for (const [index, topic] of source.entries()) {
    assert.equal(topic.id, index + 1);
    assert.ok(markdown.includes(topic.title), `Missing source title: ${topic.id}`);
    assert.ok(markdown.includes(topic.hindi), `Missing Hindi explanation: ${topic.id}`);
  }
});

test('each source domain contains its original 20 consecutive topics', () => {
  for (let category = 0; category < 5; category++) {
    const domain = source.filter(topic => topic.category === category);
    assert.equal(domain.length, 20);
    assert.deepEqual(domain.map(topic => topic.id), Array.from({ length: 20 }, (_, i) => category * 20 + i + 1));
  }
});

test('every concept has a complete guide and its own four-stage diagram', () => {
  assert.equal(notes.length, 100);
  const diagrams = new Set();
  for (const [index, row] of notes.entries()) {
    const fields = row.split('|');
    assert.equal(fields.length, 4, `Incomplete guide: ${index + 1}`);
    assert.ok(fields.every(field => field.trim().length > 0));
    assert.equal(fields[1].split('>').length, 4, `Incomplete diagram: ${index + 1}`);
    diagrams.add(fields[1]);
  }
  assert.equal(diagrams.size, 100);
});

test('the downloadable curriculum is identical to the supplied document', () => {
  assert.equal(readFileSync(new URL('../public/curriculum.md', import.meta.url), 'utf8'), markdown);
});
