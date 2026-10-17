// Owner-approved System1 isolated EPS candidate quarantine SHADOW V0.1.
// Research-only: consumes the original V8 post-score, pre-quota cohort.
// No Worker, D1, KV, 3Min, phone or holding writes; no Formal admission.
// A failed source verifies NO candidate, rather than inventing neutral EPS.
// Verify source identity/date/basis before ranking; global data absence blocks all.
export const SCHEMA="SYSTEM1_P0_EPS_CANDIDATE_QUARANTINE_SHADOW_V0_1";
export const REQUIRED_C_URL="https://mopsov.twse.com.tw/mops/web/ajax_t164sb04";
export const INPUT_KIND="ORIGINAL_SYSTEM1_POST_SCORE_PRE_QUOTA";
const CODE=/^[1-9][0-9]{3}$/;
const DAY=/^20\d\d-\d\d-\d\d$/;
const isObj=x=>x!==null&&typeof x==="object"&&!Array.isArray(x);
const dateOk=s=>typeof s==="string"&&DAY.test(s)&&!Number.isNaN(Date.parse(s+"T00:00:00Z"))&&
  new Date(s+"T00:00:00Z").toISOString().slice(0,10)===s;
const finite=x=>typeof x==="number"&&Number.isFinite(x);
function fail(reason,marketDate=null,details={}){
 return Object.freeze({
  schema:SCHEMA,mode:"SHADOW_ONLY",status:"BLOCKED",
  reason,marketDate,selectedCount:null,
  selected:[],quarantined:[],remainingGeneral:0,remainingThousand:0,
  originalCandidateCount:null,missingDoesNotMeanZero:true,
  formalEligible:false,productionActivation:false,
  canWriteD1:false,canWriteKV:false,canSendPush:false,
  canTrade:false,canMutateHoldings:false,...details
 });
}
function originalRank(a,b){
 return b.rewardPerRisk-a.rewardPerRisk||b.priorityScore-a.priorityScore||
  b.setupQuality-a.setupQuality||b.sectorFlow-a.sectorFlow||
  b.relativeStrength-a.relativeStrength;
}
function quarterProof(row,{year,quarter}){
 if(!isObj(row))return "SOURCE_ROW_MISSING";
 // Existing production parser is C-only. A/individual MUST stay blocked;
 // positive PDF figures alone cannot launder A into C.
 if(row.quarterEpsSource!==REQUIRED_C_URL||
    typeof row.epsBasis!=="string"||!row.epsBasis.includes("MOPS合併綜合損益表"))
   return "SOURCE_BASIS_OR_ORIGINAL_PARSER_NOT_CONFIRMED";
 if(row.quarterEpsYear!==year||row.quarterEpsQuarter!==quarter)
   return "SOURCE_COMPANY_PERIOD_MISMATCH";
 if(row.quarterEpsVerified!==true||!finite(row.quarterEPS))
   return "CURRENT_QUARTER_EPS_UNVERIFIED";
 if(quarter>1){
  if(row.previousQuarterEpsVerified!==true||
     row.previousQuarterEpsYear!==year||
     row.previousQuarterEpsQuarter!==quarter-1||
     !finite(row.previousQuarterEPS))
    return "PREVIOUS_QUARTER_EPS_UNVERIFIED";
 }
 // This is original-parser-consistent SHADOW, not authenticated source SHA /
 // historical first-seen or proof of original D1 byte lineage.
 return null;
}
/**
 * A "preScored" candidate is a member of the actual original V8
 * scoreCandidate success cohort BEFORE either 3-stock quota is applied.
 * Absence of an individual EPS row can only remove that candidate, never
 * replace independent full-market readiness or change score/rank economics.
 */
export function reviewEpsQuarantineShadow({
 marketDate,officialMarketDate,year,quarter,preScored,
 cohortKind,verifiedOriginalSelectorCohort=false,
 originalFullUniverseScanComplete=false,
 globalGates={},quarterSnapshot,holdings=[],
}={}){
 if(!dateOk(marketDate)||officialMarketDate!==marketDate||
    !Number.isInteger(year)||!Number.isInteger(quarter)||quarter<1||quarter>3)
  return fail("DATE_OR_QUARTER_NOT_VERIFIED",marketDate??null);
 if(cohortKind!==INPUT_KIND||verifiedOriginalSelectorCohort!==true||
    originalFullUniverseScanComplete!==true)
  return fail("ORIGINAL_PRE_QUOTA_COHORT_NOT_VERIFIED",marketDate);
 // One missing full-market parent blocks the whole run. Never "quarantine"
 // an exchange, a fiscal period, a source dataset or 60-day price history.
 for(const gate of ["TWSE","TPEx","HISTORY60","INSTITUTION","FINANCIAL","VALUATION","ANNOUNCEMENTS","INDEX","TDCC"]){
  if(globalGates?.[gate]!==true)return fail("GLOBAL_GATE_"+gate+"_NOT_READY",marketDate);
 }
 if(!isObj(quarterSnapshot)||
    quarterSnapshot.asOfDate!==marketDate||
    quarterSnapshot.year!==year||quarterSnapshot.quarter!==quarter||
    !isObj(quarterSnapshot.stocks))
  return fail("GLOBAL_QUARTER_EPS_SNAPSHOT_WRONG_DATE_OR_MISSING",marketDate);
 const keys=Object.keys(quarterSnapshot.stocks);
 if(keys.length>200||keys.some(x=>!CODE.test(x))||
    quarterSnapshot.count!==keys.length)
  return fail("GLOBAL_QUARTER_EPS_SNAPSHOT_INVALID_COUNT_OR_KEYS",marketDate);
 if(!Array.isArray(preScored)||preScored.length>200||
    preScored.some(c=>!isObj(c)||!CODE.test(c.symbol)||!finite(c.close)||
      c.close<10||!["A","B"].includes(c.channel)||
      (c.signalLevel!==undefined&&!["A","B"].includes(c.signalLevel))||
      !["rewardPerRisk","priorityScore","setupQuality","sectorFlow","relativeStrength"].every(k=>finite(c[k]))))
  return fail("ORIGINAL_RANKED_CANDIDATES_INVALID",marketDate);
 if(new Set(preScored.map(c=>c.symbol)).size!==preScored.length)
  return fail("DUPLICATE_CANDIDATE_REJECTED",marketDate);
 if(!Array.isArray(holdings) || holdings.some(h=>!isObj(h)||!CODE.test(h.symbol)||
    typeof h.positionStage!=="string"))
  return fail("HOLDING_STATE_UNKNOWN",marketDate);

 const selectedEligible=[],quarantined=[];
 for(const c of preScored){
  const why=quarterProof(quarterSnapshot.stocks[c.symbol],{year,quarter});
  if(why){
   quarantined.push({symbol:c.symbol,reason:why,
    pool:c.close>=1000?"THOUSAND":"GENERAL",
    canBuy:false,formalEntryAllowed:false});
  }else{
   selectedEligible.push(c);
  }
 }
 const general=selectedEligible.filter(c=>c.close<1000).sort(originalRank).slice(0,3);
 const thousand=selectedEligible.filter(c=>c.close>=1000).sort(originalRank).slice(0,3);
 const selected=[...general,...thousand].sort(originalRank).map(c=>({
  symbol:c.symbol,pool:c.close>=1000?"THOUSAND":"GENERAL",
  channel:c.channel,signalLevel:c.signalLevel??null,
  rankEvidence:"UNCHANGED_V8_COMPARATOR_FROM_POST_SCORE",
  shadowEligible:true,formalEligible:false,canTrade:false
 }));
 const hasActualPositions=holdings.some(h=>h.positionStage!=="NONE");
 // Zero preliminaries: the isolated classifier cannot certify true full
 // Formal zero by itself, even if the caller asserts a full-market run.
 const allQuarantined=preScored.length>0&&selectedEligible.length===0;
 const emptyCohort=preScored.length===0;
 const status=emptyCohort?"EMPTY_COHORT_REQUIRES_FORMAL_PARENT_PROOF":
  allQuarantined?"ALL_PRE_CANDIDATES_QUARANTINED_NOT_ZERO":
  hasActualPositions?"SHADOW_WITH_OPEN_POSITIONS_PRESERVED":
  "SHADOW_PARTIAL_OR_COMPLETE_EPS_VERIFIED";
 return Object.freeze({
  schema:SCHEMA,marketDate,mode:"SHADOW_ONLY",status,
  originalCandidateCount:preScored.length,
  verifiedCandidateCount:selectedEligible.length,
  quarantinedCount:quarantined.length,
  quarantined,selected,
  selectedCount:selected.length,
  remainingGeneral:3-general.length,
  remainingThousand:3-thousand.length,
  poolsIndependent:true,rankComparatorUnchanged:true,
  hasActualPositions,existingHoldingsRetained:true,
  // Caller may only compare and report; this is NEVER a Formal zero.
  missingDoesNotMeanZero:emptyCohort||allQuarantined,
  zeroPicksCertified:false,
  originalHtmlAndHashReadbackCertified:false,
  historicalFirstKnownAtCertified:false,sourcePitCertified:false,
  originalD1SourceReadbackCertified:false,
  formalEligible:false,productionActivation:false,canWriteD1:false,
  canWriteKV:false,canSendPush:false,canTrade:false,canMutateHoldings:false
 });
}
