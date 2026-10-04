import crypto from "node:crypto";

export const D03_BOLLINGER_L3_ACCEPTANCE_VERSION = "D03_BOLLINGER_L3_ACCEPTANCE_V0_1";
export const D03_BOLLINGER_FORMULA_VERSION = "BBANDS_CLOSE_SMA20_POPSTD20_K2_V0_1";

const isoDay = x => typeof x==="string" && /^\d{4}-\d{2}-\d{2}$/.test(x);
const isoTime = x => typeof x==="string" && Number.isFinite(Date.parse(x));
const finite = x => Number.isFinite(Number(x));
const key = p => [p.scanDate,p.captureGeneration,p.symbol,p.parentSnapshotHash].join("|");
const uniq = xs => [...new Set(xs)];

function hash(value){
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
function blocked(parent,status,reasons,extra={}){
  return {
    schemaVersion:D03_BOLLINGER_L3_ACCEPTANCE_VERSION,
    parentKey:parent?key(parent):null,
    symbol:parent?.symbol||null,
    status,
    reasons:uniq(reasons),
    l3EvidenceEligible:false,
    formulaVersion:D03_BOLLINGER_FORMULA_VERSION,
    ...extra
  };
}

export function evaluateBollingerL3ParentV0_1({parent,continuityReceipt}={}){
  const reasons=[];
  if(!parent || typeof parent!=="object") return blocked(null,"UNKNOWN",["PARENT_MISSING"]);
  if(!isoDay(parent.scanDate)||!parent.captureGeneration||!parent.symbol||!parent.parentSnapshotHash||!isoTime(parent.knownAt)){
    return blocked(parent,"DATA_BLOCKED",["PARENT_IDENTITY_INVALID"]);
  }
  if(!continuityReceipt || typeof continuityReceipt!=="object") return blocked(parent,"UNKNOWN",["CONTINUITY_RECEIPT_MISSING"]);

  if(continuityReceipt.symbol!==parent.symbol) reasons.push("SYMBOL_MISMATCH");
  if(continuityReceipt.status!=="VALID" && continuityReceipt.status!=="VALID_BUT_CONSTRAINED") reasons.push("CONTINUITY_NOT_VALID");
  if(continuityReceipt.continuitySpace!=="TECHNICAL_CONTINUITY") reasons.push("WRONG_CONTINUITY_SPACE");
  if(continuityReceipt.formulaVersion!==D03_BOLLINGER_FORMULA_VERSION) reasons.push("FORMULA_VERSION_MISMATCH");
  if(continuityReceipt.stdDefinition!=="POPULATION") reasons.push("STD_DEFINITION_MISMATCH");
  if(!continuityReceipt.continuityReceiptId) reasons.push("CONTINUITY_RECEIPT_ID_MISSING");
  if(!isoTime(continuityReceipt.capturedAt) || Date.parse(continuityReceipt.capturedAt)>Date.parse(parent.knownAt)) reasons.push("CONTINUITY_CAPTURE_AFTER_PARENT");

  const expected=Array.isArray(continuityReceipt.expectedEligibleSymbolSessions)?continuityReceipt.expectedEligibleSymbolSessions:[];
  const bars=Array.isArray(continuityReceipt.bars)?continuityReceipt.bars:[];
  if(expected.length!==20 || expected.some(x=>!isoDay(x))) reasons.push("EXPECTED_SESSION_COUNT_NOT_20");
  if(uniq(expected).length!==expected.length) reasons.push("EXPECTED_SESSION_DUPLICATE");
  if(bars.length!==20) reasons.push("BAR_COUNT_NOT_20");

  const barDates=bars.map(x=>x?.date);
  if(uniq(barDates).length!==barDates.length) reasons.push("BAR_DATE_DUPLICATE");
  if(expected.length===20 && JSON.stringify([...barDates].sort())!==JSON.stringify([...expected].sort())) reasons.push("BAR_EXPECTED_DATESET_MISMATCH");

  for(const b of bars){
    if(!isoDay(b?.date)) reasons.push("BAR_DATE_INVALID");
    if(!finite(b?.close) || Number(b.close)<=0) reasons.push("BAR_CLOSE_INVALID");
    if(b?.symbolSessionVerified!==true) reasons.push("SYMBOL_SESSION_UNVERIFIED");
    if(b?.technicalContinuity!==true) reasons.push("TECHNICAL_CONTINUITY_FALSE");
    if(b?.corporateActionContinuityResolved!==true) reasons.push("CORPORATE_ACTION_UNRESOLVED");
    if(!isoTime(b?.sourceFetchedAt) || Date.parse(b.sourceFetchedAt)>Date.parse(parent.knownAt)) reasons.push("BAR_SOURCE_AFTER_PARENT");
  }
  if(Number(continuityReceipt.unresolvedMissingSessions||0)!==0) reasons.push("UNRESOLVED_MISSING_SESSIONS");
  if(Number(continuityReceipt.unresolvedRelevantEvents||0)!==0) reasons.push("UNRESOLVED_RELEVANT_EVENTS");

  if(reasons.length) return blocked(parent,"DATA_BLOCKED",reasons,{continuityReceiptId:continuityReceipt.continuityReceiptId||null});

  const ordered=[...bars].sort((a,b)=>a.date.localeCompare(b.date));
  const closes=ordered.map(x=>Number(x.close));
  const mean=closes.reduce((a,b)=>a+b,0)/20;
  const variance=closes.reduce((s,x)=>s+(x-mean)**2,0)/20;
  const sd=Math.sqrt(variance);
  const upper=mean+2*sd, lower=mean-2*sd, last=closes.at(-1);
  const bbw=mean!==0?(upper-lower)/mean:null;
  const pctB=upper!==lower?(last-lower)/(upper-lower):null;
  const constrained=continuityReceipt.status==="VALID_BUT_CONSTRAINED" || bars.some(x=>x.priceLimitConstrained===true);
  const values={sma20:mean,popStd20:sd,upper,lower,bbw,pctB,lastClose:last};
  return {
    schemaVersion:D03_BOLLINGER_L3_ACCEPTANCE_VERSION,
    parentKey:key(parent),symbol:parent.symbol,scanDate:parent.scanDate,captureGeneration:parent.captureGeneration,
    parentSnapshotHash:parent.parentSnapshotHash,parentKnownAt:parent.knownAt,
    continuityReceiptId:continuityReceipt.continuityReceiptId,
    formulaVersion:D03_BOLLINGER_FORMULA_VERSION,stdDefinition:"POPULATION",
    status:constrained?"VALID_BUT_CONSTRAINED":"VALID",
    reasons:[],
    l3EvidenceEligible:true,
    ordinaryInterpretationEligible:!constrained,
    expectedSessionCount:20,
    continuityWindowHash:hash(ordered.map(x=>({date:x.date,close:Number(x.close),sourceBarHash:x.sourceBarHash||null}))),
    values
  };
}

export function reconcileBollingerL3RunV0_1({expectedParents=[],attempts=[]}={}){
  const expectedKeys=expectedParents.map(key);
  const attemptKeys=attempts.map(x=>x.parentKey);
  const duplicateAttemptKeys=attemptKeys.filter((x,i,a)=>a.indexOf(x)!==i);
  const missingKeys=expectedKeys.filter(x=>!attemptKeys.includes(x));
  const orphanKeys=attemptKeys.filter(x=>!expectedKeys.includes(x));
  const complete=expectedKeys.length>0 && duplicateAttemptKeys.length===0 && missingKeys.length===0 && orphanKeys.length===0 && attempts.length===expectedKeys.length;
  return {
    schemaVersion:"D03_BOLLINGER_L3_RUN_RECEIPT_V0_1",
    status:complete?"COMPLETE":"INCOMPLETE",
    expectedAttemptCount:expectedKeys.length,
    persistedAttemptCount:attempts.length,
    missingCount:missingKeys.length,
    orphanCount:orphanKeys.length,
    duplicateCount:duplicateAttemptKeys.length,
    countsByStatus:Object.fromEntries(["VALID","VALID_BUT_CONSTRAINED","DATA_BLOCKED","UNKNOWN"].map(s=>[s,attempts.filter(x=>x.status===s).length])),
    parentKeysetHash:hash([...expectedKeys].sort()),
    completeForDescriptiveCoverage:complete
  };
}
