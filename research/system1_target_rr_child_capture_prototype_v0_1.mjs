import {createHash} from "node:crypto";
import {buildTargetRrAudit} from "./target_rr_audit_observer_v0_1.mjs";
import {shadowHash} from "./system1_shadow_cohort_membership_v0_1.mjs";

export const TARGET_RR_CHILD_SCHEMA="SYSTEM1_TARGET_RR_CHILD_CAPTURE_V0_1";
export const TARGET_RR_SOURCE_SCHEMA="SYSTEM1_TARGET_RR_SOURCE_STATE_V0_1";
export const TARGET_RR_STATES=Object.freeze([
  "TARGET_FOUND","TARGET_NONE_SEARCH_COMPLETE","TARGET_UNKNOWN_SOURCE","TARGET_UNKNOWN_GEOMETRY"
]);
const TARGET_STAGES=new Set([
  "TARGET_NULL_REJECTED","LOW_RR_REJECTED","FINAL_GRADE_REJECTED_AFTER_RR_PASS","RR_PASSED_FORMAL_OK"
]);
const pools=new Set(["GENERAL","THOUSAND"]);
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==="object"
  ?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
const hash=x=>createHash("sha256").update(JSON.stringify(canonical(x))).digest("hex");
const finite=x=>typeof x==="number"&&Number.isFinite(x);
const iso=x=>typeof x==="string"&&/(Z|[+-]\d\d:\d\d)$/.test(x)&&Number.isFinite(Date.parse(x));
const same=(a,b,t=1e-7)=>finite(a)&&finite(b)&&Math.abs(a-b)<=Math.max(1,Math.abs(a),Math.abs(b))*t;
const inc=(o,k)=>{o[k]=(o[k]||0)+1;};

function verifySourceState(s,receipt){
  if(s?.schemaVersion!==TARGET_RR_SOURCE_SCHEMA||s?.scanDate!==receipt.sessionDate||
     !iso(s?.capturedAt)||Date.parse(s.capturedAt)>Date.parse(receipt.decisionAt)||
     !["NONE","JSON","API"].includes(s?.customMode)||
     !["NOT_CONFIGURED","SUCCESS","FAILED"].includes(s?.customFetchStatus)||
     !["SOURCE_NOT_CONFIGURED","COMPLETE_SYMBOL_COVERAGE","UNKNOWN_SUBSET_COVERAGE"].includes(s?.targetPriceCoverageSemantics)||
     typeof s?.sourceReceiptId!=="string"||!s.sourceReceiptId)
    throw new Error("TARGET_RR_SOURCE_STATE_INVALID");
  if(s.customMode==="NONE"&&(s.customConfigured!==false||s.customFetchStatus!=="NOT_CONFIGURED"||
     s.targetPriceCoverageSemantics!=="SOURCE_NOT_CONFIGURED"))
    throw new Error("TARGET_RR_SOURCE_NONE_CONTRACT");
  if(s.customMode!=="NONE"&&s.customConfigured!==true)
    throw new Error("TARGET_RR_SOURCE_CONFIG_CONTRACT");
  return s;
}
function verifyParent(r){
  if(r?.readbackVerified!==true||r?.researchOnly!==true||r?.decisionImpact!==false||r?.formalCoreImpact!==false||
     !/^[0-9a-f]{40}$/i.test(String(r?.sourceMainSha||""))||!r?.generationId||
     !/^\d{4}-\d{2}-\d{2}$/.test(String(r?.sessionDate||""))||!iso(r?.decisionAt)||
     !Array.isArray(r?.rows)||r.rows.length!==r.populationN||
     !r?.shadowMembershipCapture?.schemaVersion)
    throw new Error("TARGET_RR_VERIFIED_V817_PARENT_REQUIRED");
  return r;
}
function historyState(raw,parent,sessionDate){
  const h=Array.isArray(raw?.history)?raw.history:[];
  const dates=h.map(x=>String(x?.date||""));
  const unique=new Set(dates).size===dates.length;
  const ordered=dates.every((d,i)=>i===0||dates[i-1]<d);
  const noFuture=dates.every(d=>/^\d{4}-\d{2}-\d{2}$/.test(d)&&d<=sessionDate);
  const current=dates.at(-1)===sessionDate;
  const admission=parent?.historyAdmission?.usable===true;
  const highs=h.map(x=>finite(x?.high)?x.high:(finite(x?.close)?x.close:null));
  const highCoverage=highs.every(finite);
  const recomputed20=highCoverage&&highs.length>1?Math.max(...(highs.length>=21?highs.slice(-21,-1):highs.slice(0,-1))):null;
  const recomputed60=highCoverage&&highs.length>1?Math.max(...(highs.length>=61?highs.slice(-61,-1):highs.slice(0,-1))):null;
  const derivedLevelsPresent=finite(raw?.priorHigh20)&&finite(raw?.priorHigh60);
  const derivedLevelsMatch=derivedLevelsPresent&&same(raw.priorHigh20,recomputed20)&&same(raw.priorHigh60,recomputed60);
  return {
    verified:admission&&h.length>=60&&unique&&ordered&&noFuture&&current&&highCoverage&&derivedLevelsMatch,
    bars:h.length,lookbackStart:dates[0]||null,lookbackEnd:dates.at(-1)||null,
    admissionStatus:parent?.historyAdmission?.status||"UNKNOWN",derivedLevelsPresent,derivedLevelsMatch,
    recomputedPriorHigh20:recomputed20,recomputedPriorHigh60:recomputed60
  };
}
function perSymbolTargetPriceSource(feature,source){
  const raw=finite(feature?.targetPrice)?feature.targetPrice:null;
  if(source.customMode==="NONE")
    return raw===null?{verified:true,state:"NOT_CONFIGURED",raw:null}:{verified:false,state:"UNEXPECTED_TARGET_PRICE_WITH_NO_SOURCE",raw};
  if(source.customFetchStatus!=="SUCCESS")
    return {verified:false,state:"CUSTOM_SOURCE_NOT_SUCCESSFUL",raw};
  if(raw!==null){
    const complete=typeof feature?.targetPriceSource==="string"&&feature.targetPriceSource.length>0&&
      iso(feature?.targetPriceAsOf)&&iso(feature?.targetPriceCapturedAt)&&feature?.targetPricePointInTimeEligible===true;
    return {verified:complete,state:complete?"PRESENT_PIT_VERIFIED":"PRESENT_PROVENANCE_UNKNOWN",raw};
  }
  if(source.targetPriceCoverageSemantics==="COMPLETE_SYMBOL_COVERAGE")
    return {verified:true,state:"ABSENT_COMPLETE_SOURCE_COVERAGE",raw:null};
  return {verified:false,state:"ABSENT_SUBSET_COVERAGE_UNKNOWN",raw:null};
}
function observerFeature(feature,parent){
  const channel=parent?.derived?.channel;
  const entry=parent?.derived?.entryGeometry?.entry;
  const f={...feature};
  if(channel==="A"&&finite(entry)) f.support=entry/1.0065;
  return f;
}
function targetSemantics({audit,history,targetPrice,parent,source,generationId,decisionAt}){
  if(!history.verified||!targetPrice.verified)
    return {state:"TARGET_UNKNOWN_SOURCE",reason:!history.verified?"HISTORY_SEARCH_SOURCE_NOT_VERIFIED":targetPrice.state,
      searchComplete:false,geometryQuality:"UNKNOWN",sourceVerified:false};
  if(audit?.schemaVersion!=="TARGET_RR_AUDIT_OBSERVER_V0_1"||audit?.geometry==null)
    return {state:"TARGET_UNKNOWN_GEOMETRY",reason:"AUDIT_GEOMETRY_NOT_VERIFIED",searchComplete:false,
      geometryQuality:"UNKNOWN",sourceVerified:true};
  const g=parent?.derived?.entryGeometry||{};
  if(!same(audit.geometry.entry,g.entry)||!same(audit.geometry.stop,g.stop))
    return {state:"TARGET_UNKNOWN_GEOMETRY",reason:"PARENT_OBSERVER_GEOMETRY_MISMATCH",searchComplete:false,
      geometryQuality:"MISMATCH",sourceVerified:true};
  if(audit.stageConsistent!==true)
    return {state:"TARGET_UNKNOWN_GEOMETRY",reason:"FORMAL_STAGE_REPLAY_MISMATCH",searchComplete:false,
      geometryQuality:"MISMATCH",sourceVerified:true};
  const parentTarget=parent?.derived?.entryGeometry?.target??null;
  const auditTarget=audit?.resistance?.selectedTarget??null;
  if((parentTarget===null)!==(auditTarget===null)||(parentTarget!==null&&!same(parentTarget,auditTarget)))
    return {state:"TARGET_UNKNOWN_GEOMETRY",reason:"PARENT_OBSERVER_TARGET_MISMATCH",searchComplete:false,
      geometryQuality:"MISMATCH",sourceVerified:true};
  const common={searchComplete:true,geometryQuality:"VERIFIED",sourceVerified:true,
    searchAlgorithmVersion:"FORMAL_NEAREST_REAL_RESISTANCE_V0_1",
    searchLookbackStart:history.lookbackStart,searchLookbackEnd:history.lookbackEnd,
    sourceReceiptIds:[source.sourceReceiptId,"C1_GENERATION:"+generationId],
    knownAt:decisionAt,decisionAt};
  return audit.resistance?.targetNull===true
    ?{...common,state:"TARGET_NONE_SEARCH_COMPLETE",reason:null}
    :{...common,state:"TARGET_FOUND",reason:null,target:audit.resistance?.selectedTarget??null};
}
function formalInput(parent){
  return {ok:parent?.formalResult?.ok===true,reason:parent?.formalResult?.firstFailure??parent?.formalResult?.reason??null};
}
function stratum(row){return [row.pool,row.channel,row.formalStage,row.targetStateV2].join("|");}

export async function buildTargetRrChildCapturePrototype({
  c1Receipt,sameScanFeatures=[],sourceState,capPerStratum=6
}={}){
  const receipt=verifyParent(c1Receipt),source=verifySourceState(sourceState,receipt);
  if(!Array.isArray(sameScanFeatures)||!Number.isInteger(capPerStratum)||capPerStratum<1||capPerStratum>6)
    throw new Error("TARGET_RR_CAPTURE_ARGUMENTS");
  const featureMap=new Map();
  for(const f of sameScanFeatures){
    const symbol=String(f?.symbol||"");
    if(!symbol||featureMap.has(symbol)) throw new Error("TARGET_RR_FEATURE_IDENTITY");
    featureMap.set(symbol,f);
  }
  const frameCounts={},rows=[],preTarget={count:0,reasons:{}};
  for(const parent of receipt.rows){
    const channel=parent?.derived?.channel;
    if(!["A","B"].includes(channel)){preTarget.count++;inc(preTarget.reasons,"NO_CHANNEL");continue;}
    const f=featureMap.get(String(parent.symbol));
    if(!f){preTarget.count++;inc(preTarget.reasons,"SAME_SCAN_FEATURE_MISSING");continue;}
    const audit=buildTargetRrAudit(observerFeature(f,parent),{channel,formalResult:formalInput(parent),minRewardRisk:2});
    if(!TARGET_STAGES.has(audit.formalStage)){preTarget.count++;inc(preTarget.reasons,audit.formalStage||"UNKNOWN");continue;}
    const history=historyState(f,parent,receipt.sessionDate),targetPrice=perSymbolTargetPriceSource(f,source);
    const semantics=targetSemantics({audit,history,targetPrice,parent,source,generationId:receipt.generationId,decisionAt:receipt.decisionAt});
    const pool=pools.has(parent.pricePool)?parent.pricePool:"UNKNOWN";
    const row={
      symbol:String(parent.symbol),pool,channel,formalStage:audit.formalStage,targetStateV2:semantics.state,
      parentSnapshotHash:await shadowHash(parent),parentContentDigest:receipt.contentDigest,
      captureGeneration:receipt.generationId,scanDate:receipt.sessionDate,decisionAt:receipt.decisionAt,
      audit,semantics,historySource:history,targetPriceSourceState:targetPrice,
      sourceReceiptId:source.sourceReceiptId,researchOnly:true,decisionImpact:false,formalCoreImpact:false,
      noPlanChanges:true,noTrade:true,noPush:true
    };
    inc(frameCounts,stratum(row));rows.push(row);
  }
  const byStratum=new Map();
  for(const row of rows){const k=stratum(row);if(!byStratum.has(k))byStratum.set(k,[]);byStratum.get(k).push(row);}
  const children=[];
  for(const [k,group] of [...byStratum].sort(([a],[b])=>a.localeCompare(b))){
    const ordered=[...group].sort((a,b)=>hash([receipt.sessionDate,k,a.symbol]).localeCompare(hash([receipt.sessionDate,k,b.symbol]))||a.symbol.localeCompare(b.symbol));
    const sample=ordered.slice(0,capPerStratum),fraction=sample.length/group.length;
    for(const row of sample){
      const child={schemaVersion:TARGET_RR_CHILD_SCHEMA,...row,samplingFrameId:k,samplingRuleVersion:TARGET_RR_CHILD_SCHEMA,
        semanticPopulationCount:group.length,sampledCount:sample.length,samplingFraction:fraction};
      children.push({...child,semanticFingerprint:hash(child)});
    }
  }
  children.sort((a,b)=>a.symbol.localeCompare(b.symbol)||a.samplingFrameId.localeCompare(b.samplingFrameId));
  const stateCounts={};for(const r of rows)inc(stateCounts,r.targetStateV2);
  const sourceReceipt={
    ...source,frameCount:Object.values(frameCounts).reduce((a,b)=>a+b,0),
    targetStateCounts:stateCounts,preTarget,providerCallDelta:0,
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true
  };
  const header={
    schemaVersion:"SYSTEM1_TARGET_RR_CHILD_HEADER_V0_1",scanDate:receipt.sessionDate,captureGeneration:receipt.generationId,
    parentContentDigest:receipt.contentDigest,sourceReceipt,frameCounts,fullFrameN:rows.length,sampledChildN:children.length,
    capPerStratum,samplingOutcomeBlind:true,childDigest:hash(children),economicSuperiority:"UNKNOWN",
    formalOptimizationCandidate:"NONE",researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    noPlanChanges:true,noTrade:true,noPush:true
  };
  return {header:{...header,semanticFingerprint:hash(header)},children};
}
