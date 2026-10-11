import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const fixture=JSON.parse(readFileSync(new URL("./d03_artifact_provenance_indicator_input_cases_20261011_v0_1.json",import.meta.url),"utf8"));

function classify(x){
  if(x.nativeZipMatched!==x.nativeZipExpected||x.zipIntegrityPassed!==x.nativeZipExpected)
    return "ARTIFACT_PROVENANCE_CONFLICT";
  if(x.physicalAccepted>0 && (!x.readReserveAuthorized||!x.writeReserveAuthorized||!x.accountHeadroomAttested))
    return "INVALID_PHYSICAL_PROMOTION";
  const budget=x.readReserveAuthorized&&x.writeReserveAuthorized&&x.accountHeadroomAttested;
  if((x.readReserveAuthorized||x.writeReserveAuthorized)&&!budget)
    return "SOURCE_ACCESS_BUDGET_INCOMPLETE";
  if(x.sourcePhysicalDataAccepted&&!budget)
    return "INVALID_SOURCE_ATTESTATION_ORDER";
  if(x.destinationStorageParityAccepted&&!x.sourcePhysicalDataAccepted)
    return "INVALID_STORAGE_PARITY_ORDER";
  if(x.sourceRowsImported>0&&!x.destinationStorageParityAccepted)
    return "IMPORTED_STORAGE_UNVERIFIED";
  if(x.sourcePitAccepted&&(!x.sourcePhysicalDataAccepted||!x.sourceFrozenAccepted||!x.sourceRestoreAccepted))
    return "INVALID_PIT_ORDER";
  if(x.hotD1CensusAccepted===x.hotD1CensusRequired&&x.hotD1ScoutAccepted!==x.hotD1ScoutRequired)
    return "INVALID_CENSUS_BEFORE_SCOUT";
  if(x.hotD1ScoutAccepted===x.hotD1ScoutRequired&&!x.sourcePitAccepted)
    return "SCOUT_STORAGE_EVIDENCE_ONLY";
  if(x.w0Ready&&!x.sourcePitAccepted)
    return "INVALID_W0_ORDER";
  if(x.oosDates>0&&(!x.w0Ready||!x.genuineC1Ready))
    return "INVALID_OOS_WITHOUT_INPUTS";
  if(x.bollingerExactSessions>=20&&(!x.w0Ready||!x.genuineC1Ready))
    return "HISTORY_ONLY_NOT_BOLLINGER_READY";
  if(x.adxReplayCertified&&(!x.w0Ready||!x.genuineC1Ready))
    return "STATE_ONLY_NOT_ADX_READY";
  if(x.genuineC1Ready&&!x.w0Ready)
    return "PARENT_ONLY_NOT_INDICATOR_READY";
  if(x.perOperationCostKnown&&!x.sourcePhysicalDataAccepted)
    return "COST_ONLY_NOT_INPUT_READY";
  if(budget&&!x.sourcePhysicalDataAccepted)
    return "SOURCE_ACCESS_BUDGET_AUTHORIZED";
  return "ARTIFACT_PROVENANCE_VERIFIED";
}

assert.equal(fixture.cases.length,20);
for(const c of fixture.cases){
  const actual=classify({...fixture.evidence,...c.mutation});
  assert.equal(actual,c.expected,c.id);
}
assert.equal(fixture.evidence.destinationSchemaAccepted,true);
assert.equal(fixture.evidence.sourceRowsImported,0);
assert.equal(fixture.evidence.supportCompleted,15);
assert.equal(fixture.evidence.supportTotal,38);
assert.equal(fixture.evidence.physicalAccepted,0);
assert.equal(fixture.evidence.physicalTotal,5);
console.log(JSON.stringify({status:"PASS",cases:fixture.cases.length,currentState:classify(fixture.evidence),maturityPct:56.7,formalCoreImpact:"NONE_LOCKED"}));
