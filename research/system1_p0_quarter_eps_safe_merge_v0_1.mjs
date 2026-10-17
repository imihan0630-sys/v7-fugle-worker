// Offline-only formal EPS snapshot repair planner.
// Original 2026-10-16 D1 QUARTER_EPS stock map is authoritative and MUST
// be fetched with independent read receipt before planning an addition.
// This module NEVER writes D1/KV, replays scans or changes production scoring.
const DATE=/^20\d\d-\d\d-\d\d$/;
const SYMBOL=/^[1-9][0-9]{3}$/;
const SHA=/^[a-f0-9]{64}$/i;
const allowedSource="https://mopsov.twse.com.tw/mops/web/ajax_t164sb04";
const valid=(s)=>typeof s==="string"&&DATE.test(s)&&Number.isFinite(Date.parse(s+"T00:00:00Z"))&&
  new Date(s+"T00:00:00Z").toISOString().slice(0,10)===s;
const safeClone=x=>structuredClone(x);
function assert(ok,code){if(!ok)throw Error("S1_P0_EPS_"+code);}
function bounded(payload,date,tag) {
 assert(payload&&typeof payload==="object"&&!Array.isArray(payload),tag+"_MISSING");
 assert(payload.asOfDate===date&&payload.year===2026&&payload.quarter===2,tag+"_WRONG_PERIOD");
 assert(payload.stocks&&typeof payload.stocks==="object"&&!Array.isArray(payload.stocks),tag+"_MAP_INVALID");
 const symbols=Object.keys(payload.stocks);
 assert(symbols.length<=200&&symbols.every(x=>SYMBOL.test(x)),tag+"_STOCK_LIST_INVALID");
 assert(Number.isInteger(payload.count)&&payload.count===symbols.length,tag+"_COUNT_NOT_MATCHED");
 for(const code of symbols) {
  const row=payload.stocks[code];
  assert(row&&typeof row==="object"&&!Array.isArray(row),tag+"_ROW_INVALID");
  assert(row.quarterEpsVerified===true&&row.previousQuarterEpsVerified===true,tag+"_UNVERIFIED_QUARTER");
  assert(typeof row.quarterEPS==="number"&&Number.isFinite(row.quarterEPS),tag+"_EPS_MISSING");
  assert(typeof row.previousQuarterEPS==="number"&&Number.isFinite(row.previousQuarterEPS),tag+"_PRIOR_EPS_MISSING");
 }
 return symbols;
}
export function planOriginalQuarterEpsSnapshotMerge({
 existingSnapshot,supplement,sourceReceipts,requiredCandidates,marketDate,
 originalD1SourceAuthenticated=false,originalD1ReadbackProven=false
}={}) {
 assert(valid(marketDate)&&marketDate==="2026-10-16","PINNED_DATE_REQUIRED");
 assert(originalD1SourceAuthenticated===true&&originalD1ReadbackProven===true,"ORIGINAL_D1_EVIDENCE_REQUIRED");
 const oldSymbols=bounded(existingSnapshot,marketDate,"EXISTING");
 const newSymbols=bounded(supplement,marketDate,"SUPPLEMENT");
 assert(Array.isArray(requiredCandidates)&&requiredCandidates.length>0&&requiredCandidates.length<=6&&
  requiredCandidates.every(x=>SYMBOL.test(x))&&new Set(requiredCandidates).size===requiredCandidates.length,
  "EXACT_CANDIDATE_UNIVERSE_REQUIRED");
 assert(sourceReceipts&&typeof sourceReceipts==="object"&&!Array.isArray(sourceReceipts),"ORIGINAL_RECEIPTS_MISSING");
 assert(newSymbols.length===Object.keys(sourceReceipts).length,"RECEIPTS_NOT_EXACTLY_PAIRED");
 for(const code of newSymbols) {
  const x=sourceReceipts[code];
  assert(x?.sourceUrl===allowedSource&&SHA.test(x?.quarterRawSha256||"")&&
   SHA.test(x?.priorRawSha256||"")&&x?.currentOriginalParserVerified===true&&
   x?.previousOriginalParserVerified===true&&x?.fiscalYear===2026&&x?.fiscalQuarter===2,
   "SOURCE_NOT_ORIGINAL_VERIFIED_"+code);
  // This review candidate accepts only the existing production C contract.
  // A-only 5340 needs its independent accounting/legal certification first.
  assert(x?.reportId==="C","INDIVIDUAL_A_NEEDS_LEGAL_APPROVAL_"+code);
  if(Object.hasOwn(existingSnapshot.stocks,code))
   assert(JSON.stringify(existingSnapshot.stocks[code])===JSON.stringify(supplement.stocks[code]),
    "CONFLICTING_EXISTING_EPS_"+code);
 }
 const merged={...safeClone(existingSnapshot),
  stocks:{...safeClone(existingSnapshot.stocks),...safeClone(supplement.stocks)}};
 merged.count=Object.keys(merged.stocks).length;
 const unverified=requiredCandidates.filter(x=>!merged.stocks[x]?.quarterEpsVerified||
  !merged.stocks[x]?.previousQuarterEpsVerified);
 return Object.freeze({schema:"SYSTEM1_P0_ORIGINAL_EPS_SNAPSHOT_MERGE_REVIEW_V0_1",
  originalDate:marketDate,existingCount:oldSymbols.length,supplementCount:newSymbols.length,
  prospectiveCount:merged.count,unverifiedRequiredCandidates:unverified,
  sourceOnlyVerifiedSymbols:newSymbols,readyToApply:false,formalEligible:false,
  canTrade:false,canCreateFormalParent:false,pitFirstKnownCertified:false,
  persisted:false,originalD1DataMutated:false,sourceRawHtmlCommitted:false,
  operatorMustRecheckOriginalD1CAS:true,
  potentialContent:merged, // local only; never send to production without review
  status:unverified.length?"REMAINS_INCOMPLETE_DO_NOT_SCAN":"SOURCE_COVERAGE_PROPOSED_PENDING_D1_CAS_AND_PIT"});
}
