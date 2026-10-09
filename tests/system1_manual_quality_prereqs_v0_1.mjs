import assert from "node:assert/strict";
import {planMissingInstitutionDates} from "./system1_institution_gap_resume_v0_1.mjs";

// Manual data_only QUALITY has no right to mutate D1 until prior stages
// have complete same-date authority readbacks. Never called by normal cron.
export function verifyManualQualityPrereqs(market,institution,targetDate){
 assert.match(String(targetDate||""),/^\d{4}-\d{2}-\d{2}$/,"Explicit quality target date required");
 assert.equal(market?.marketDate,targetDate,"Market cache readback date mismatch");
 assert.equal(market?.ready,true,"Both official market caches must be ready");
 assert.equal(market?.markets?.TWSE?.ready,true,"TWSE official cache not ready");
 assert.equal(market?.markets?.TPEx?.ready,true,"TPEx official cache not ready");
 for(const x of ["TWSE","TPEx"]){
   assert.ok(Number(market?.markets?.[x]?.count)>0,x+" official stocks missing");
 }
 const proof=planMissingInstitutionDates(institution,targetDate);
 assert.equal(proof.alreadyReady,true,"Three-dated official institution cache not ready");
 assert.equal(proof.physicalSnapshotsVerified,true,"Institution snapshot physical readback incomplete");
 return {ready:true,marketDate:targetDate,marketCounts:{
  TWSE:market.markets.TWSE.count,TPEx:market.markets.TPEx.count
 },institutionValidTradingDateCount:proof.tradingDateCount,
   selectedCount:null,noPlanMutation:true,noSelection:true,noPush:true};
}

// Resume a partially finished HISTORICAL quality import without downloading
// expensive official MOPS financial HTML and EPS documents twice.
// Never skip sources for regular scheduled/non-recovery quality runs.
export function canReuseHeavyMopsSources(recoveryOnly,existingQuality){
 return recoveryOnly===true &&
   existingQuality?.datasets?.FINANCIAL?.ready===true &&
   existingQuality?.datasets?.QUARTER_EPS?.ready===true;
}
