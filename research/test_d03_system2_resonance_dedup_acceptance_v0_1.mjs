import fs from 'node:fs';
import assert from 'node:assert/strict';

const bridge = JSON.parse(fs.readFileSync(new URL('./d03_system2_daily_resonance_lineage_bridge_20261005_v0_1.json', import.meta.url), 'utf8'));
const cases = JSON.parse(fs.readFileSync(new URL('./d03_system2_resonance_dedup_acceptance_cases_20261005_v0_1.json', import.meta.url), 'utf8'));
const registry = new Map(bridge.conditions.map(row => [row.conditionId, row]));

function diagnose(active, override = null) {
  const unique = [...new Set(active)];
  const rows = unique.map(id => registry.get(id));
  if (rows.some(row => !row)) {
    return {
      rawSignalCount: unique.length,
      dedupedEvidenceFamilyCount: null,
      effectiveIndependentEvidenceCount: null,
      status: 'UNKNOWN_LINEAGE_FAIL_CLOSED',
    };
  }
  if (override?.redundancyGroupId && rows.some(row => row.redundancyGroupId !== override.redundancyGroupId)) {
    return { status: 'REJECT_MAPPING_DRIFT' };
  }
  if (override?.parameterFamilyId && rows.some(row => row.parameterFamilyId !== override.parameterFamilyId)) {
    return { status: 'REJECT_PARAMETER_DRIFT' };
  }
  const groups = new Set(rows.map(row => row.redundancyGroupId));
  return {
    rawSignalCount: unique.length,
    dedupedEvidenceFamilyCount: groups.size,
    effectiveIndependentEvidenceCount: groups.size,
    status: 'PASS_DEDUPLICATED',
  };
}

assert.equal(bridge.conditions.length, 3);
assert.ok(bridge.conditions.every(row => row.informationRoot.includes('PRICE_OHLC')));
assert.ok(bridge.conditions.every(row => row.redundancyGroupId === 'RG_D03_PRICE_TREND'));
assert.equal(bridge.lifecycleSemantics.sameFamilyIndependenceClaim, false);

for (const row of cases.truthTable) {
  const got = diagnose(row.active);
  assert.equal(got.rawSignalCount, row.expectedRawSignalCount, row.caseId);
  assert.equal(got.dedupedEvidenceFamilyCount, row.expectedDedupedEvidenceFamilyCount, row.caseId);
  assert.equal(got.effectiveIndependentEvidenceCount, row.expectedEffectiveIndependentEvidenceCount, row.caseId);
}

for (const row of cases.adversarialCases) {
  const got = diagnose(row.active, row.override);
  assert.equal(got.status, row.expectedStatus, row.caseId);
  if ('expectedRawSignalCount' in row) assert.equal(got.rawSignalCount, row.expectedRawSignalCount, row.caseId);
  if ('expectedDedupedEvidenceFamilyCount' in row) assert.equal(got.dedupedEvidenceFamilyCount, row.expectedDedupedEvidenceFamilyCount, row.caseId);
  if ('expectedEffectiveIndependentEvidenceCount' in row) assert.equal(got.effectiveIndependentEvidenceCount, row.expectedEffectiveIndependentEvidenceCount, row.caseId);
}

const full = diagnose(cases.conditionIds);
assert.equal(full.rawSignalCount, 3);
assert.equal(full.dedupedEvidenceFamilyCount, 1);
assert.equal(full.effectiveIndependentEvidenceCount, 1);
assert.equal(cases.entryExitCountMayBeUsedAsAlphaVoteCount, false);
assert.equal(cases.formalCoreImpact, 'NONE_LOCKED');

console.log(JSON.stringify({
  status: 'PASS',
  truthTableCases: cases.truthTable.length,
  adversarialCases: cases.adversarialCases.length,
  fullResonanceRawSignalCount: full.rawSignalCount,
  fullResonanceDedupedEvidenceFamilyCount: full.dedupedEvidenceFamilyCount,
  fullResonanceEffectiveIndependentEvidenceCount: full.effectiveIndependentEvidenceCount,
  missingLineage: 'UNKNOWN_FAIL_CLOSED',
  formalCoreImpact: 'NONE_LOCKED'
}));
