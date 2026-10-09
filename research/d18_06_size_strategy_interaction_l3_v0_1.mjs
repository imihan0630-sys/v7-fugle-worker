import crypto from "node:crypto";

function stable(v){
  if(Array.isArray(v)) return v.map(stable);
  if(v && typeof v==="object"){
    return Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])]));
  }
  return v;
}
export const stableJson=(v)=>JSON.stringify(stable(v));
export const sha256=(v)=>crypto.createHash("sha256").update(typeof v==="string"?v:stableJson(v)).digest("hex");
function must(c,m){ if(!c) throw new Error(m); }
function t(x,n){ const v=Date.parse(x); must(Number.isFinite(v),`${n}_INVALID`); return v; }

function validateStrategyDay(x){
  must(x?.marketDate && x?.decisionTimestamp && x?.strategyId && x?.strategyVersion && x?.frameHash,"STRATEGY_DAY_IDENTITY_INCOMPLETE");
  must(x.market==="TW","STRATEGY_DAY_MARKET_MUST_BE_TW");
}

function validateSizeReceipt(r, strategyDay){
  must(r?.version && r?.id && r?.capturedAt && r?.asOfTradeDate,"SIZE_RECEIPT_IDENTITY_INCOMPLETE");
  must(r.mode==="OUTCOME_BLIND_OFFICIAL_INDEX_STATE","SIZE_RECEIPT_MODE_INVALID");
  must(r.sourceAuthority==="Taiwan Stock Exchange","SIZE_RECEIPT_SOURCE_AUTHORITY_INVALID");
  must(r.futureStockOutcomesOpened===false,"SIZE_RECEIPT_FUTURE_OUTCOME_OPENED");
  must(r.formalCoreChanged===false,"SIZE_RECEIPT_FORMAL_CORE_CHANGED");
  must(r.indexSeries?.large && r.indexSeries?.mid && r.indexSeries?.small,"SIZE_RECEIPT_THREE_LEGS_REQUIRED");
  for(const leg of ["large","mid","small"]){
    const s=r.indexSeries[leg];
    must(typeof s.name==="string" && typeof s.sourceUrl==="string","SIZE_RECEIPT_SOURCE_IDENTITY_INCOMPLETE");
    must(Number.isFinite(s.asOfValue) && s.asOfValue>0,"SIZE_RECEIPT_ASOF_VALUE_INVALID");
  }
  must(t(r.capturedAt,"SIZE_CAPTURED_AT")<=t(strategyDay.decisionTimestamp,"DECISION_TIMESTAMP"),"SIZE_RECEIPT_AFTER_DECISION");
  must(r.asOfTradeDate<=strategyDay.marketDate,"SIZE_RECEIPT_FROM_FUTURE_DATE");
  must(r.descriptiveState && typeof r.descriptiveState==="object","SIZE_RECEIPT_STATE_MISSING");
}

function pickHorizonState(r,horizon){
  const state=r.descriptiveState?.[horizon];
  const returns=r.returnsPct?.[horizon];
  must(state && returns,"SIZE_HORIZON_NOT_AVAILABLE");
  for(const leg of ["large","mid","small"]) must(Number.isFinite(returns[leg]),"SIZE_HORIZON_RETURN_INVALID");
  if(state.includes("LARGE_LEAD")) return "LARGE_LED";
  if(state.includes("SMALL") || state.includes("MID")) return "SMALL_MID_LED";
  return "MIXED_OR_OTHER";
}

export function buildSizeStrategyInteractionFrame({strategyDay,sizeReceipt,horizon="D1",producerBlobSha=null}){
  validateStrategyDay(strategyDay);
  validateSizeReceipt(sizeReceipt,strategyDay);
  must(["D1","D5","D20","D60"].includes(horizon),"HORIZON_NOT_FROZEN");
  const sizeState=pickHorizonState(sizeReceipt,horizon);
  const producerContentHash=sha256(sizeReceipt);

  const base={
    schemaVersion:"D18_06_SIZE_STRATEGY_INTERACTION_FRAME_V0_1",
    market:"TW",
    marketDate:strategyDay.marketDate,
    decisionTimestamp:strategyDay.decisionTimestamp,
    strategyId:strategyDay.strategyId,
    strategyVersion:strategyDay.strategyVersion,
    strategyDayHash:strategyDay.frameHash,
    producerDomain:"D09-08",
    producerReceiptId:sizeReceipt.id,
    producerReceiptVersion:sizeReceipt.version,
    producerAsOfTradeDate:sizeReceipt.asOfTradeDate,
    producerCapturedAt:sizeReceipt.capturedAt,
    producerAuthority:sizeReceipt.sourceAuthority,
    producerContentHash,
    producerBlobSha,
    horizon,
    sizeState,
    sizeLegs:["large","mid","small"],
    commonBasis:"TOTAL_RETURN_INDEX",
    priceIndexSpliceAllowed:false,
    missingLegCarryForwardAllowed:false,
    permanentRiskOnLabelAssigned:false,
    policyActionApplied:false,
    policyValueEvaluated:false,
    currentOrFutureStockOutcomeAccessed:false,
    selectionImpact:false,
    rankingImpact:false,
    capitalImpact:false,
    formalCoreChanged:false
  };

  return {...base,frameHash:sha256(base)};
}

export function buildSizeInteractionUnknownFrame({strategyDay,reason,producerReceiptId=null}){
  validateStrategyDay(strategyDay);
  must(typeof reason==="string" && reason.length>0,"UNKNOWN_REASON_REQUIRED");
  const base={
    schemaVersion:"D18_06_SIZE_STRATEGY_INTERACTION_FRAME_V0_1",
    market:"TW",
    marketDate:strategyDay.marketDate,
    decisionTimestamp:strategyDay.decisionTimestamp,
    strategyId:strategyDay.strategyId,
    strategyVersion:strategyDay.strategyVersion,
    strategyDayHash:strategyDay.frameHash,
    producerDomain:"D09-08",
    producerReceiptId,
    disposition:"DATA_UNKNOWN",
    unknownReason:reason,
    sizeState:null,
    policyActionApplied:false,
    policyValueEvaluated:false,
    currentOrFutureStockOutcomeAccessed:false,
    selectionImpact:false,
    rankingImpact:false,
    capitalImpact:false,
    formalCoreChanged:false
  };
  return {...base,frameHash:sha256(base)};
}
