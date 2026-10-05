import fs from 'node:fs';
import assert from 'node:assert/strict';

const registry = JSON.parse(fs.readFileSync(new URL('./d03_indicator_lineage_registry_20261005_v0_1.json', import.meta.url), 'utf8'));
const required = ['factorId','factorVersion','domainId','sourceFamily','informationRoot','representationFamily','featureLineageId','parentFeatureIds','redundancyGroupId','independenceStatus','decisionClock','firstObservableAt','provenance','parameterFamilyId'];

assert.equal(registry.formalCoreImpact, 'NONE_LOCKED');
assert.equal(registry.modules.length, 12);
assert.equal(new Set(registry.modules.map(x => x.factorId)).size, 12);
assert.equal(registry.retiredAliases['D03-11'].canonicalOwner, 'D03-02');
for (const row of registry.modules) for (const key of required) assert.ok(row[key] !== undefined && row[key] !== null && row[key] !== '', `${row.factorId}:${key}`);

const dedup = rows => new Set(rows.map(row => row?.redundancyGroupId || 'UNKNOWN')).size;
const directReturnAliases = ['ret20','ROC20','Momentum20','logReturn20'].map(factorId => ({factorId,redundancyGroupId:'RG_D03_DIRECT_RETURN'}));
assert.equal(dedup(directReturnAliases), 1);

const trendAliases = ['EMA16','EMA64','MACD','MA_TREND'].map(factorId => ({factorId,redundancyGroupId:'RG_D03_PRICE_TREND'}));
assert.equal(dedup(trendAliases), 1);
assert.equal(dedup([...trendAliases, trendAliases[0]]), 1);

const missingLineage = {factorId:'UNREGISTERED'};
assert.equal(missingLineage.redundancyGroupId || 'UNKNOWN', 'UNKNOWN');
assert.equal(registry.modules.find(x => x.factorId === 'D03-13').votingEligibility, 'ONE_CONFLICT_STATE_NOT_ONE_VOTE_PER_TIMEFRAME');

console.log(JSON.stringify({status:'PASS',modules:12,retiredRocOwner:'D03-02',directReturnAliasFamilies:dedup(directReturnAliases),trendAliasFamilies:dedup(trendAliases),missingLineage:'UNKNOWN',formalCoreImpact:'NONE_LOCKED'}));
