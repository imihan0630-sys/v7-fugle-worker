import fs from 'node:fs';
import assert from 'node:assert/strict';

const spec = JSON.parse(fs.readFileSync(new URL('./d03_cross_account_schema_data_readiness_cases_20261011_v0_1.json', import.meta.url), 'utf8'));

function decide(x) {
  if (x.inferDataReady) return 'REJECT_SCHEMA_AS_DATA';
  if (x.inferPitReady) return 'REJECT_SCHEMA_AS_PIT';
  if (x.inferProductionLive) return 'REJECT_SCHEMA_AS_LIVE';
  if (x.backdateFirstKnownAt) return 'REJECT_CLOCK_LAUNDERING';
  if (x.coerceZero) return 'REJECT_UNKNOWN_COERCION';
  if (x.storageParity && x.inferOriginalPit) return 'REJECT_STORAGE_AS_PIT';
  if (x.schemaApplyStatements && x.inferQuotaCost) return 'REJECT_QUOTA_INFERENCE';
  if (x.schemaReady && !x.independentAudit) return 'SCHEMA_PASS_PENDING_INDEPENDENT_AUDIT';
  if (x.rowsImported) {
    if (!x.countsReconciled || !x.valuesReconciled) return 'DATA_IMPORTED_STORAGE_UNVERIFIED';
    if (x.versionsReconciled) return 'DATA_STORAGE_PARITY_VERIFIED';
  }
  if (x.sourceHash && !x.destinationHash) return 'REJECT_VALUE_PARITY';
  if (x.sourceHash && x.destinationHash && !x.batchManifest) return 'REJECT_BATCH_IDENTITY';
  if (x.storageParity && (!x.causalClocks || !x.exactSessions)) return 'REJECT_PIT_LINEAGE';
  if (x.pitLineage && x.indicator === 'BOLLINGER20') {
    if (x.history < 20) return 'REJECT_INDICATOR_HISTORY';
    if (!x.parentVerified) return 'REJECT_PARENT_BINDING';
    return 'INDICATOR_INPUT_READY_NOT_OUTCOME_EVIDENCE';
  }
  if (x.pitLineage && x.indicator === 'ADX14' && !x.fullReplay && !x.trustedState) return 'REJECT_ADX_STATE';
  if (x.tables === 55 && x.indexes === 63 && x.schema === '1.1' && x.rows === 0)
    return 'SCHEMA_PHYSICAL_READY_DATA_EMPTY';
  return 'UNKNOWN';
}

assert.equal(spec.cases.length, 20);
for (const t of spec.cases) assert.equal(decide(t.input), t.expected, t.id);
assert.equal(spec.physicalSchema.sourceRowsCopied, 0);
assert.equal(spec.physicalSchema.fullMigrationAccepted, false);
assert.equal(spec.maturityPct, 56.7);
assert.equal(spec.formalCoreImpact, 'NONE_LOCKED');

console.log(JSON.stringify({
  status: 'PASS',
  cases: spec.cases.length,
  tables: spec.physicalSchema.tables,
  indexes: spec.physicalSchema.indexes,
  schemaVersion: spec.physicalSchema.schemaVersion,
  sourceRowsCopied: spec.physicalSchema.sourceRowsCopied,
  maturityPct: spec.maturityPct,
  formalCoreImpact: spec.formalCoreImpact
}));
