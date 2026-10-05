import assert from "node:assert/strict";
import { buildBoundedRevisionHistoryCensusV0_1 } from "../runtime/bounded_revision_history_census_v0_1.mjs";

const laneEvents={
  TWSE_CAPITAL_REDUCTION_REFERENCE:[
    {symbol:"1111",effectiveDate:"2026-06-01",eventVersionId:"A"},
  ],
  TWSE_PAR_VALUE_CHANGE_REFERENCE:[
    {symbol:"2222",effectiveDate:"2026-07-01",eventVersionId:"B"},
  ],
  TPEX_CAPITAL_REDUCTION_REFERENCE:[
    {symbol:"3333",effectiveDate:"2026-08-01",eventVersionId:"C"},
  ],
  TPEX_PAR_VALUE_CHANGE_REFERENCE:[
    {symbol:"4444",effectiveDate:"2026-09-01",eventVersionId:"D"},
  ],
};
const issuerHistories={
  "1111":{transportReady:true,queriedYears:[2025,2026],payloadCount:2,familyRowsByActionFamily:{
    CAPITAL_REDUCTION:[
      {date:"2026-05-01",rowText:"減資",correctionOrCancellationHint:false},
      {date:"2026-05-10",rowText:"更正減資",correctionOrCancellationHint:true},
    ],
  }},
  "2222":{transportReady:true,queriedYears:[2025,2026],payloadCount:2,familyRowsByActionFamily:{
    PAR_VALUE_CHANGE:[{date:"2026-06-01",rowText:"股票面額變更",correctionOrCancellationHint:false}],
  }},
  "3333":{transportReady:true,queriedYears:[2025,2026],payloadCount:2,familyRowsByActionFamily:{
    CAPITAL_REDUCTION:[{date:"2026-07-01",rowText:"撤銷減資",correctionOrCancellationHint:true}],
  }},
  "4444":{transportReady:true,queriedYears:[2025,2026],payloadCount:2,familyRowsByActionFamily:{
    PAR_VALUE_CHANGE:[{date:"2026-08-01",rowText:"股票面額變更",correctionOrCancellationHint:false}],
  }},
};

const receipt=await buildBoundedRevisionHistoryCensusV0_1({
  startDate:"2026-04-05",endDate:"2026-10-02",laneEvents,issuerHistories,
  generatedAt:"2026-10-05T08:00:00Z",
});
assert.equal(receipt.requiredLaneCount,4);
assert.equal(receipt.finalEventCount,4);
assert.equal(receipt.uniqueSymbolCount,4);
assert.equal(receipt.issuerTransportCoverageComplete,true);
assert.equal(receipt.issuerFamilyObservabilityCoverageComplete,true);
assert.equal(receipt.preEffectiveIssuerEvidenceCoverageComplete,true);
assert.equal(receipt.boundedEventUniverseFrozen,true);
assert.equal(receipt.boundedRevisionHistoryCoverageComplete,false);
assert.equal(receipt.correctionHistoryComplete,false);
assert.equal(receipt.cancellationHistoryComplete,false);
assert.equal(receipt.knownAtVersionClockCertified,false);
assert.equal(receipt.revisionCoverageComplete,false);
assert.equal(receipt.selectionAuthority,false);
assert.equal(receipt.system1RuntimeUsed,false);

const broken=await buildBoundedRevisionHistoryCensusV0_1({
  startDate:"2026-04-05",endDate:"2026-10-02",
  laneEvents,
  issuerHistories:{...issuerHistories,"4444":{transportReady:false,queriedYears:[2025,2026],payloadCount:0,familyRowsByActionFamily:{}}},
  generatedAt:"2026-10-05T08:00:00Z",
});
assert.equal(broken.issuerTransportCoverageComplete,false);
assert.equal(broken.issuerFamilyObservabilityCoverageComplete,false);
assert.equal(broken.revisionCoverageComplete,false);

console.log("bounded revision-history census V0.1 tests PASS");
