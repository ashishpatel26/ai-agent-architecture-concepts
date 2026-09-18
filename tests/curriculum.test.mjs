import assert from 'node:assert/strict';
import test from 'node:test';
import {
  loadCorpus, validateInventory, validateHindiIntent, validateConcept, validateIndustry,
  validateUniqueContent, validatePublishedTerminology, validateDownload, validateGeneratedContent,
} from '../scripts/validate-content.mjs';

const corpus = loadCorpus();

test('canonical 100 titles, IDs, order, five domains, and the separate 12 advanced lessons are preserved', () => {
  validateInventory(corpus);
});

test('source Hindi retains explanatory intent while allowing vendor-neutral terminology corrections', () => {
  validateHindiIntent(corpus);
});

for (const entry of corpus.concepts) {
  test(`concept ${String(entry.value.id).padStart(3, '0')}: complete schema, substantive prose, references, and safe diagram definitions`, () => {
    validateConcept(entry);
  });
}

for (const entry of corpus.industries) {
  test(`industry ${entry.value.slug}: bounded specialists, deep architecture, controls, metrics, and rollout criteria`, () => {
    validateIndustry(entry);
  });
}

test('lessons and blueprints have unique diagrams and independently authored substantive sections', () => {
  validateUniqueContent(corpus);
});

test('all related IDs resolve to actual lessons without self-links or duplicates', () => {
  const ids = new Set(corpus.concepts.map(entry => entry.value.id));
  for (const { file, value } of [...corpus.concepts, ...corpus.industries]) {
    assert.ok(value.related.length >= 4, `${file} requires at least four related topics`);
    assert.equal(new Set(value.related).size, value.related.length, `${file} repeats related IDs`);
    for (const id of value.related) {
      assert.ok(ids.has(id), `${file} links to missing concept ${id}`);
      if ('id' in value) assert.notEqual(id, value.id, `${file} links to itself`);
    }
  }
});

test('the downloadable curriculum contains the complete vendor-neutral canonical source', () => {
  validateDownload(corpus);
});

test('source, public content, search data, URLs, and metadata exclude prohibited terminology in both scripts', () => {
  validatePublishedTerminology();
});

test('published JSON, catalog fallbacks, and full-text search cover every current lesson and blueprint', () => {
  validateGeneratedContent(corpus);
});
