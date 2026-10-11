import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = new URL('../migration/SYSTEM1_SYSTEM2_SEVEN_GATE_PHYSICAL_ACCEPTANCE_20261011_V0_1.json', import.meta.url);
const matrix = JSON.parse(readFileSync(source, 'utf8'));
const byId = Object.fromEntries(matrix.gates.map(gate => [gate.id, gate]));
const final = matrix.summary.entireTwoAccountIndependentOperations;

test('seven numbered physical packages have unique valid statuses and truthful counts', () => {
  assert.equal(matrix.gates.length, 7);
  assert.deepEqual(matrix.gates.map(g => g.id), ['G1','G2','G3','G4','G5','G6','G7']);
  assert.equal(new Set(matrix.gates.map(g => g.id)).size, 7);
  for (const gate of matrix.gates) {
    assert.ok(matrix.statusVocabulary.includes(gate.verdict));
    assert.ok(gate.acceptanceScope);
    assert.ok(gate.lead);
    assert.ok(gate.auditor);
  }
  for (const value of matrix.statusVocabulary) {
    assert.equal(matrix.gates.filter(g => g.verdict === value).length, matrix.summary.sevenPackages[value]);
  }
  assert.equal(matrix.summary.sevenPackages.total, 7);
});

test('inventory and schema-only original Cloudflare physical records cannot certify real cutover', () => {
  assert.equal(byId.G1.verdict, 'PASS');
  assert.match(byId.G1.acceptanceScope, /PRE_MIGRATION/);
  assert.deepEqual(byId.G1.receipts, [38027260602, 38105177481]);
  assert.equal(byId.G2.verdict, 'PASS');
  assert.match(byId.G2.acceptanceScope, /SCHEMA_ONLY/);
  assert.equal(byId.G2.quantification.independentCriteriaMet, 25);
  assert.equal(byId.G2.quantification.independentCriteriaTotal, 25);
  assert.equal(byId.G2.quantification.tablesMatched, 55);
  assert.equal(byId.G2.quantification.indexesMatched, 63);
  assert.equal(byId.G2.quantification.sourceHistoryCopied, 0);
  assert.deepEqual(byId.G2.receipts, [38069750915, 38099562997]);
  assert.equal(final.accepted, 0);
  assert.equal(final.required, 1);
});

test('genuine source rows, PIT frozen restore and destination object bytes stay unproven', () => {
  assert.equal(byId.G3.verdict, 'BLOCKED');
  assert.equal(byId.G3.quantification.sourceD1FileSizeBytesFromMetadata, 316968960);
  assert.equal(byId.G3.quantification.realPerTableRowCounts, null);
  assert.equal(byId.G3.quantification.realPerTableHashes, null);
  assert.equal(byId.G3.quantification.sourcePhysicalEvidenceFamiliesAccepted, 0);
  assert.equal(byId.G4.verdict, 'BLOCKED');
  assert.equal(byId.G4.quantification.sourceTableRowsTotal, null);
  assert.equal(byId.G4.quantification.sourceR2ObjectBytes, null);
  assert.equal(byId.G4.quantification.sourceHistoryRowsCopied, 0);
});

test('CORR-003 physical support, hot D1 readings and reserve guard remain separate', () => {
  assert.equal(byId.G5.verdict, 'BLOCKED');
  const support = Object.values(byId.G5.quantification.support);
  assert.equal(support.reduce((a,x) => a + x.met, 0), 15);
  assert.equal(support.reduce((a,x) => a + x.total, 0), 38);
  assert.equal(byId.G5.quantification.physicalCriteriaAccepted, 0);
  assert.equal(byId.G5.quantification.physicalCriteriaTotal, 5);
  assert.equal(byId.G5.quantification.hotD1ScoutRows, 0);
  assert.equal(byId.G5.quantification.hotD1ScoutTarget, 36);
  assert.equal(byId.G5.quantification.hotD1CensusRows, 0);
  assert.equal(byId.G5.quantification.hotD1CensusTarget, 11843);
  assert.equal(byId.G5.quantification.authorizedWriteReserveRows, null);
  assert.equal(byId.G5.quantification.authorizedReadReserveRows, null);
});

test('physical Worker/Cron and independent audit remain fail closed', () => {
  assert.equal(byId.G6.verdict, 'BLOCKED');
  assert.equal(byId.G6.quantification.destinationWorkersObserved, 0);
  assert.equal(byId.G6.quantification.destinationCronsObserved, 0);
  assert.equal(byId.G7.verdict, 'BLOCKED');
  assert.equal(byId.G7.quantification.finalIndependentAccountOperationAccepted, 0);
  assert.ok(byId.G7.dependencies.includes('G6'));
  assert.equal(matrix.summary.sourceHistoricRowsCopied, 0);
});

test('this offline matrix does not authorize cloud or trading operations', () => {
  const forbidden = matrix.neverAutomaticallyAuthorized.join('|');
  for (const feature of ['billing','source D1 SQL','destination data','Worker/Cron','System1 Formal Core','APPLY_ONCE']) {
    assert.ok(forbidden.includes(feature), feature);
  }
  assert.equal(matrix.controllerIssue, 1128);
});
