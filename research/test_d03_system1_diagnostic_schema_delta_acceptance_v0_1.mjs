import fs from 'node:fs';
import assert from 'node:assert/strict';

const spec = JSON.parse(fs.readFileSync(new URL('./d03_system1_diagnostic_schema_delta_cases_20261005_v0_1.json', import.meta.url), 'utf8'));

const base = {
  rawSignalCount: 3,
  rawScore: 3,
  dedupedEvidenceFamilyCount: 1,
  dedupedShadowScore: 1,
  effectiveIndependentEvidenceCount: 0,
  independentEvidenceStatus: 'NOT_PROVEN_NO_PROMOTION_PATH',
  formalSelectedSymbols: ['2330'],
  rawVoteShadowTop6: ['2330'],
  dedupShadowTop6: ['2330'],
  validActiveRefs: [
    {factorId:'D03_MA_TREND',factorVersion:'V1',signalIndex:0,informationRoot:['PRICE_OHLC'],redundancyGroupId:'RG_D03_PRICE_TREND'},
    {factorId:'D03_MACD',factorVersion:'V1',signalIndex:1,informationRoot:['PRICE_OHLC'],redundancyGroupId:'RG_D03_PRICE_TREND'},
    {factorId:'D01_BREAKOUT',factorVersion:'V2',signalIndex:2,informationRoot:['PRICE_OHLC'],redundancyGroupId:'RG_D01_PRICE_STRUCTURE'}
  ],
  redundancyGroupContributions: [{
    componentOrdinal: 0,
    factorRefs: [
      {factorId:'D01_BREAKOUT',factorVersion:'V2',signalIndex:2},
      {factorId:'D03_MACD',factorVersion:'V1',signalIndex:1},
      {factorId:'D03_MA_TREND',factorVersion:'V1',signalIndex:0}
    ],
    informationRoots: ['PRICE_OHLC'],
    redundancyGroupIds: ['RG_D01_PRICE_STRUCTURE','RG_D03_PRICE_TREND'],
    contribution: 1
  }],
  dominantInformationRoots: ['PRICE_OHLC'],
  overlappingSignalRefs: [
    {factorId:'D01_BREAKOUT',factorVersion:'V2',signalIndex:2},
    {factorId:'D03_MACD',factorVersion:'V1',signalIndex:1},
    {factorId:'D03_MA_TREND',factorVersion:'V1',signalIndex:0}
  ],
  invalid: []
};

const stableKey = row => row.factorId + '@' + row.factorVersion;
const sortedUnique = values => [...new Set(values)].sort();
const clone = value => JSON.parse(JSON.stringify(value));

function expectedDominantRoots(receipt) {
  const counts = new Map();
  for (const row of receipt.validActiveRefs) {
    for (const root of row.informationRoot) {
      if (!counts.has(root)) counts.set(root, new Set());
      counts.get(root).add(stableKey(row));
    }
  }
  if (!counts.size) return [];
  const max = Math.max(...[...counts.values()].map(x => x.size));
  return [...counts].filter(([,refs]) => refs.size === max).map(([root]) => root).sort();
}

function validate(receipt) {
  for (const field of spec.requiredFields) {
    if (!Array.isArray(receipt[field])) return 'REJECT_CANONICAL_FIELDS_MISSING';
  }
  if (receipt.overlappingSignalRefs.some(row => !row.factorId || !row.factorVersion || !Number.isInteger(row.signalIndex))) {
    return 'REJECT_STABLE_OVERLAP_IDENTITY';
  }
  const validKeys = new Set(receipt.validActiveRefs.map(stableKey));
  if (receipt.redundancyGroupContributions.some(c => c.factorRefs.some(ref => !validKeys.has(stableKey(ref))))) {
    return 'REJECT_INVALID_SIGNAL_LEAKAGE';
  }
  const sum = receipt.redundancyGroupContributions.reduce((n,row) => n + row.contribution, 0);
  if (receipt.redundancyGroupContributions.length !== receipt.dedupedEvidenceFamilyCount || sum !== receipt.dedupedShadowScore || receipt.redundancyGroupContributions.some(row => row.contribution !== 1)) {
    return 'REJECT_CONTRIBUTION_RECONCILIATION';
  }
  if (JSON.stringify(sortedUnique(receipt.dominantInformationRoots)) !== JSON.stringify(expectedDominantRoots(receipt))) {
    return 'REJECT_DOMINANT_ROOT_RECONCILIATION';
  }
  if (receipt.effectiveIndependentEvidenceCount !== 0 || receipt.independentEvidenceStatus !== 'NOT_PROVEN_NO_PROMOTION_PATH') {
    return 'REJECT_PROMOTION_FIREWALL_CHANGE';
  }
  return 'PASS';
}

function mutate(name) {
  const x = clone(base);
  if (name === 'REMOVE_REQUIRED_FIELDS') {
    delete x.redundancyGroupContributions;
    delete x.dominantInformationRoots;
    delete x.overlappingSignalRefs;
  } else if (name === 'DELETE_FIRST_OVERLAP_FACTOR_VERSION') {
    delete x.overlappingSignalRefs[0].factorVersion;
  } else if (name === 'INCREMENT_FIRST_CONTRIBUTION') {
    x.redundancyGroupContributions[0].contribution = 2;
  } else if (name === 'REPLACE_DOMINANT_ROOT') {
    x.dominantInformationRoots = ['VOLUME_TURNOVER'];
  } else if (name === 'ADD_UNKNOWN_SIGNAL_TO_CONTRIBUTION') {
    x.redundancyGroupContributions[0].factorRefs.push({factorId:'UNKNOWN',factorVersion:'V1',signalIndex:9});
  } else if (name === 'REORDER_SIGNAL_INDICES_ONLY') {
    const map = new Map([[0,2],[1,0],[2,1]]);
    x.validActiveRefs.forEach(row => { row.signalIndex = map.get(row.signalIndex); });
    x.overlappingSignalRefs.forEach(row => { row.signalIndex = map.get(row.signalIndex); });
    x.redundancyGroupContributions[0].factorRefs.forEach(row => { row.signalIndex = map.get(row.signalIndex); });
  }
  return x;
}

for (const row of spec.cases) {
  assert.equal(validate(mutate(row.mutation)), row.expectedStatus, row.caseId);
}

const reordered = mutate('REORDER_SIGNAL_INDICES_ONLY');
assert.deepEqual(sortedUnique(base.overlappingSignalRefs.map(stableKey)), sortedUnique(reordered.overlappingSignalRefs.map(stableKey)));
assert.deepEqual(base.dominantInformationRoots, reordered.dominantInformationRoots);
for (const field of spec.protectedFields) assert.deepEqual(reordered[field], base[field], field);
assert.equal(spec.formalCoreImpact, 'NONE_LOCKED');

console.log(JSON.stringify({
  status:'PASS',
  acceptanceCases:spec.cases.length,
  completeSchema:'PASS',
  genericOnly:'REJECT_CANONICAL_FIELDS_MISSING',
  permutationInvariant:true,
  stableOverlapIdentity:true,
  dominantRootReconciled:true,
  effectiveIndependentEvidenceCount:0,
  formalCoreImpact:'NONE_LOCKED'
}));
