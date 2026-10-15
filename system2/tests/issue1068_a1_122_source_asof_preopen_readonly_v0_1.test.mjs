import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {ORIGINALS,evaluateA1OriginalSourceObservationAsOfV0_1}
 from "../migration/issue1068_a1_122_source_asof_preopen_readonly_v0_1.mjs";
const E=process.env;
const three=[E.S2_A1_AUDIT_NATIVE_PATH,E.S2_A1_ARCHIVE_NATIVE_PATH,E.S2_A1_BLOCKER_NATIVE_PATH];
const cutoff="2026-10-15T21:00:00.000Z"; // 2026-10-16 05:00 Taipei; actual original observed ~03:54
const evaluated="2026-10-15T21:20:00.000Z";
const missing=()=>evaluateA1OriginalSourceObservationAsOfV0_1({
 auditBytes:Buffer.alloc(0),archiveBytes:Buffer.alloc(0),
 blockerBytes:Buffer.alloc(0),decisionCutAtUtc:cutoff,actualEvaluationAtUtc:evaluated
});
test("missing original native receipts always fail closed",()=>{
 assert.throws(missing,/S2_A1_122_ORIGINAL_ASOF_AUDIT_ORIGINAL_NATIVE_BYTES_SHA_INVALID/);
 assert.equal(ORIGINALS.auditArtifactId,12002641996);
 assert.equal(ORIGINALS.archiveArtifactId,12002547345);
 assert.equal(ORIGINALS.blockerArtifactId,12002104499);
});
if(three.every(Boolean)){
 const bufs=three.map(p=>readFileSync(p));
 const evaluate=(decisionCutAtUtc=cutoff,actualEvaluationAtUtc=evaluated,mut=bufs)=>
  evaluateA1OriginalSourceObservationAsOfV0_1({
   auditBytes:mut[0],archiveBytes:mut[1],blockerBytes:mut[2],
   decisionCutAtUtc,actualEvaluationAtUtc
  });
 test("REAL three original GH sources independently bind 122/122 to actual PREOPEN research cutoff ONLY",()=>{
  const v=evaluate();
  assert.equal(v.status,"REAL_122_SOURCE_PAIRS_INDEPENDENTLY_OBSERVED_BY_PREOPEN_ASOF__STRATEGY_PIT_BLOCKED");
  assert.equal(v.sourcePairs,122);
  assert.equal(v.sourceTradingSessions,61);
  assert.equal(v.actualIndependentSourceRehashCount,122);
  assert.equal(v.exactOriginalArchivedContentAddressedPairs,122);
  assert.equal(v.sourceObservationPitForThisResearchCut,true);
  assert.equal(v.earliestFullyWitnessedAtUtc,"2026-10-15T19:54:35.094Z");
  assert.equal(v.strategyPitCertified,false);
  assert.equal(v.marketDayOriginalCloseFinalityPitAt2345,false);
  assert.equal(v.historicRawOHLCVAtOriginalTradingDateCertified,false);
  assert.equal(v.nativeSecurityClassFullHistoricalPitCertified,false);
  assert.equal(v.sixCaCompleteHistoricalRevisionsAndNoEventCertified,false);
  assert.equal(v.independentAuditLaneFormalPITSignoff,false);
  assert.equal(v.frozenDecisionCaptured,false);
  assert.equal(v.historicalPerformanceBacktestAuthorized,false);
  assert.equal(v.shadowAdmitted,false);
  assert.equal(v.selectionAuthorized,false);
  assert.equal(v.zeroPickDay,null);
  assert.equal(v.cloudflareD1Writes,0);
  assert.equal(v.system1FormalCoreTouched,false);
 });
 test("actual 03:54:35.094 Taipei predecessor boundary: before last independent witness blocks, equality is permitted",()=>{
  const before=evaluate("2026-10-15T19:54:35.093Z",evaluated);
  const eq=evaluate("2026-10-15T19:54:35.094Z",evaluated);
  assert.equal(before.sourceObservationPitForThisResearchCut,false);
  assert.equal(eq.sourceObservationPitForThisResearchCut,true);
  assert.equal(before.allRequiredSourceAndRiskReceiptsObservedBeforeDecision,false);
  assert.equal(eq.allRequiredSourceAndRiskReceiptsObservedBeforeDecision,true);
 });
 test("T market 23:45 claim is forbidden regardless of full original 122/122",()=>{
  const atOld=evaluate("2026-10-15T15:45:00.000Z",evaluated);
  assert.equal(atOld.sourceObservationPitForThisResearchCut,false);
  assert.equal(atOld.marketDayOriginalCloseFinalityPitAt2345,false);
 });
 test("post-market-open clock does NOT retro-authorize PREOPEN source selection",()=>{
  const afterOpen=evaluate("2026-10-16T01:01:00.000Z","2026-10-16T01:01:01.000Z");
  assert.equal(afterOpen.sourceObservationPitForThisResearchCut,false);
  assert.equal(afterOpen.nextDayResearchOnlyPreOpenWindow,false);
 });
 test("future decision cutoff is never accepted",()=>{
  assert.throws(()=>evaluate("2026-10-15T22:00:00Z","2026-10-15T21:00:00Z"),/FUTURE_OR_INVALID_RESEARCH_CUTOFF/);
 });
 test("unqualified decision offset is never accepted",()=>{
  assert.throws(()=>evaluate("2026-10-16T05:00:00+08:00",evaluated),/FUTURE_OR_INVALID_RESEARCH_CUTOFF/);
 });
 for(const [title,index,mutation] of [
   ["audit verdict altered",0,v=>{v.verdict="ACCEPTED_STRATEGY_PIT"}],
   ["audit original size changed",0,v=>{v.sourceMarketDatePairsVerified=121}],
   ["audit fake Frozen",0,v=>{v.frozenWritten=true}],
   ["audit fake Stage1",0,v=>{v.strategyPitCertified=true}],
   ["audit forged original hash",0,v=>{v.sourceReceiptHash="f".repeat(64)}],
   ["archive publicly published",1,v=>{v.publicRawPublication=true}],
   ["archive falsely permanent",1,v=>{v.providerLevelImmutability=true}],
   ["archive missing one raw pair",1,v=>{v.archivedPaths.pop()}],
   ["archive target changed",1,v=>{v.targetRepository="attacker/other"}],
   ["archive synthetic old receipt",1,v=>{v.sourceReceiptHash="f".repeat(64)}],
   ["archive fictitious trading selection",1,v=>{v.selectionPerformed=true}],
   ["journal fabricates no blocker",2,v=>{v.PITAssessorQualified=true}],
   ["journal fake Frozen",2,v=>{v.classifiedAsFrozen=true}],
   ["journal faked zero pick",2,v=>{v.zeroPickDay=true}],
   ["journal original hash changed",2,v=>{v.originalIndependentA1AuditHash="f".repeat(64)}]
 ]){
  test("failclosed native original bytes: "+title,()=>{
    const mutated=bufs.map(x=>Buffer.from(x));
    const v=JSON.parse(mutated[index].toString("utf8"));
    mutation(v);mutated[index]=Buffer.from(JSON.stringify(v),"utf8");
    assert.throws(()=>evaluate(cutoff,evaluated,mutated),/ORIGINAL_NATIVE_BYTES_SHA_INVALID/);
  });
 }
 for(let i=0;i<3;i++){
   test("trailing byte corruption in original artifact #"+i,()=>{
     const bad=bufs.map(x=>Buffer.from(x));
     bad[i]=Buffer.concat([bad[i],Buffer.from("\n")]);
     assert.throws(()=>evaluate(cutoff,evaluated,bad),/ORIGINAL_NATIVE_BYTES_SHA_INVALID/);
   });
 }
}else{
 test("full immutable GH original multi-artifact suite requires isolated original-artifact workflow",
  {skip:"Generic Research CI has no original GitHub Actions artifacts mounted"},()=>{});
}
