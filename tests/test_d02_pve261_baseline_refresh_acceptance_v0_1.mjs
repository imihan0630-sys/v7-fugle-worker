import assert from "node:assert/strict";
import {evaluatePve261CandidateContract as candidate,evaluatePve261PhysicalReadback as physical,evaluatePve261} from "../research/d02_pve261_baseline_refresh_acceptance_v0_1.mjs";

const c={
  changeClass:"CLASS_B_PRODUCTION_RUNTIME",ownerApprovalRequired:true,formalCoreUnchanged:true,
  selectionLogicUnchanged:true,rankingLogicUnchanged:true,capitalLogicUnchanged:true,pushTradeLogicUnchanged:true,
  minimumCountCannotBypassFreshness:true,expectedLatestComparableSlotAuthority:"AUTHORITATIVE_SYMBOL_SESSION_EXACT_SLOT",
  expectedLatestComparableSlotIsPreOutcome:true,maxHistoricalLookbackDays:180,refreshThroughExpectedPriorSession:true,
  currentSessionExcludedFromBaselineFetch:true,futureDatesForbidden:true,requireExactProviderResponseSha256:true,
  preserveCorporateActionResetSemantics:true,missingSlotPolicy:"FAIL_CLOSED_UNEXPLAINED_MISSING_EXACT_SLOT",
  unknownFreshnessFailsClosed:true,retroactiveCleanDateForbidden:true
};
assert.equal(candidate(c).pass,true);
for(const [field,value] of [
 ["changeClass","OTHER"],["ownerApprovalRequired",false],["minimumCountCannotBypassFreshness",false],
 ["expectedLatestComparableSlotAuthority",""],["expectedLatestComparableSlotIsPreOutcome",false],
 ["maxHistoricalLookbackDays",500],["refreshThroughExpectedPriorSession",false],["currentSessionExcludedFromBaselineFetch",false],
 ["futureDatesForbidden",false],["requireExactProviderResponseSha256",false],["preserveCorporateActionResetSemantics",false],
 ["missingSlotPolicy","IGNORE_MISSING_SLOT"],["unknownFreshnessFailsClosed",false],["retroactiveCleanDateForbidden",false]
]) assert.equal(candidate({...c,[field]:value}).pass,false,field);

const p={
  marketDate:"2026-10-09",expectedLatestComparableSlotDate:"2026-10-08",baselineAsOfDate:"2026-10-08",
  slotHistoryCount:20,sameSlotBaselineClean:true,sameSlotHistoryValidityState:"PASS",
  provider:"FUGLE",endpoint:"historical/candles",rawPayloadHash:"a".repeat(64),rawPayloadHashBasis:"EXACT_PROVIDER_RESPONSE_SHA256",
  sourceFetchedAt:"2026-10-09T01:00:00.000Z",corporateActionContinuityState:"CLEAN",
  currentSessionExcludedFromBaseline:true,futureDatesAbsent:true,deployedAt:"2026-10-08T00:30:00.000Z",
  featureCapturedAt:"2026-10-09T02:15:00.000Z",decisionImpact:0
};
assert.equal(physical(p).pass,true);
assert.equal(physical({...p,baselineAsOfDate:"2026-10-07"}).pass,false);
assert.equal(physical({...p,featureCapturedAt:"2026-10-07T02:15:00.000Z"}).pass,false);
assert.equal(physical({...p,corporateActionContinuityState:"UNKNOWN"}).pass,false);
assert.equal(physical({...p,currentSessionExcludedFromBaseline:false}).pass,false);
assert.equal(evaluatePve261({candidate:c}).productionRemediationAccepted,false);
assert.equal(evaluatePve261({candidate:c,readback:p}).productionRemediationAccepted,true);

console.log(JSON.stringify({status:"PASS",candidateAssertions:15,physicalAssertions:7,totalAssertions:22}));
