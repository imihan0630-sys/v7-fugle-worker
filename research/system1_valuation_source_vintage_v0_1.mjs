import {canonicalJcsJson,sha256HexUtf8} from './canonical_receipt_hash_v0_1.mjs';

export const VINTAGE_SCHEMA='SYSTEM1_VALUATION_SOURCE_VINTAGE_V0_1';
export const MEDIAN_DERIVATION='SAME_SCAN_POSITIVE_PE_MEDIAN_V0_1';
const hash=x=>sha256HexUtf8('SYSTEM1_VALUATION_VINTAGE_V1|'+canonicalJcsJson(x));
const assert=(v,reason)=>{if(!v)throw Error('VALUATION_VINTAGE_'+reason);};
const nullable=x=>x===undefined?null:x;
const dateOnly=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&Number.isFinite(Date.parse(x+'T00:00:00Z'))&&new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;
const eq=(a,b)=>nullable(a)===nullable(b);
const freeze=x=>{if(x&&typeof x==='object'){Object.values(x).forEach(freeze);Object.freeze(x);}return x;};
const blocked=reason=>({schemaVersion:VINTAGE_SCHEMA,status:'DATA_QUALITY_BLOCKED',reason,researchOnly:true,decisionImpact:false,promotionGradeOutcomeJoin:false,officialFirstKnownAt:null,officialFirstKnownState:'NOT_PROVEN'});

// Exact normalized payloads already returned by readQualitySnapshot. No I/O or later repair.
export async function captureValuationSourceVintage({valuation,financial,quarterEps,scanDate,epsReviewOnly=false,captureObservedAt=new Date().toISOString()}){
 try{
  assert(Number.isFinite(Date.parse(captureObservedAt)),'CAPTURE_TIME');
  const sources={},payloads={};
  for(const [key,value] of Object.entries({valuation,financial,quarterEps})){
   const payload=value===null||value===undefined?null:JSON.parse(canonicalJcsJson(value));
   payloads[key]=payload;
   sources[key]={present:payload!==null,asOfDate:payload?.asOfDate??null,
    ...(key==='valuation'?{}:{year:payload?.year??null,quarter:payload?.quarter??null}),
    captureObservedAt:payload?captureObservedAt:null,contentDigest:payload?await hash(payload):null,
    stockCount:payload?.stocks?Object.keys(payload.stocks).length:0,
    sourceState:payload?'OFFICIAL_VALIDATED_SNAPSHOT':'ABSENT',
    ...(key==='quarterEps'?{scope:'REVIEWED_SYMBOLS_ONLY_NOT_FULL_UNIVERSE',applied:!!(!epsReviewOnly&&payload&&payload.year===financial?.year&&payload.quarter===financial?.quarter)}:{})};
  }
  const symbols={};
  for(const symbol of new Set(Object.values(payloads).flatMap(p=>Object.keys(p?.stocks||{})))){
   const v=payloads.valuation?.stocks?.[symbol],f=payloads.financial?.stocks?.[symbol];
   const q=sources.quarterEps.applied?payloads.quarterEps?.stocks?.[symbol]:null;
   // EPS values may already come from FINANCIAL (e.g. Q4). Preserve that lineage, not an unused EPS snapshot.
   const used={...f,...q};
   symbols[symbol]={valuationDate:v?.valuationDate??null,valuationSource:v?.valuationSource??null,
    quarterEpsSource:used.quarterEpsSource??null,quarterEpsYear:used.quarterEpsYear??null,quarterEpsQuarter:used.quarterEpsQuarter??null,
    epsOrigin:q&&Object.hasOwn(q,'epsYoY')?'QUARTER_EPS':f&&Object.hasOwn(f,'epsYoY')?'FINANCIAL':'UNKNOWN',
    pe:v?.priceEarningsRatio??null,pb:v?.priceBookRatio??null,revenue:f?.revenueQuarterYoY??null,eps:used.epsYoY??null,
    valuationPresent:!!v,financialPresent:!!f};
  }
  return freeze({schemaVersion:VINTAGE_SCHEMA,scanDate,captureRequestId:crypto.randomUUID(),sources,symbols});
 }catch{return blocked('SNAPSHOT_CAPTURE_FAILED');}
}

export function attachValuationSourceVintage(receipt,context,features){
 try{
  assert(context?.schemaVersion===VINTAGE_SCHEMA&&context.sources,'REQUEST_CAPTURE_MISSING');
  assert(context.scanDate===receipt.sessionDate,'REQUEST_DATE_MISMATCH');
  const decision=Date.parse(receipt.decisionAt);
  assert(Number.isFinite(decision),'DECISION_TIME');
  for(const s of Object.values(context.sources))if(s.present){
   assert(Number.isFinite(Date.parse(s.captureObservedAt))&&Date.parse(s.captureObservedAt)<=decision,'FUTURE_CAPTURE');
   assert(s.asOfDate===null||dateOnly(s.asOfDate)&&s.asOfDate<=receipt.sessionDate,'FUTURE_ASOF');
  }
  const featureMap=new Map(features.map(f=>[String(f.symbol),f]));
  const peers=new Map();
  for(const f of features)if(f.priceEarningsRatio>0){const group=peers.get(f.industry)||[];group.push(f);peers.set(f.industry,group);}
  const root={schemaVersion:VINTAGE_SCHEMA,status:'SELECTION_TIME_SOURCE_VINTAGE_CAPTURED',researchOnly:true,decisionImpact:false,
   decisionAt:receipt.decisionAt,captureGeneration:receipt.generationId,captureRequestId:context.captureRequestId,
   knownAt:receipt.decisionAt,knownAtSemantics:'REQUEST_LOCAL_KNOWN_BY_DECISION_AT_UPPER_BOUND',notSourceEventTime:true,
   officialFirstKnownAt:null,officialFirstKnownState:'NOT_PROVEN',systemFirstObservedContinuity:'NOT_PROVEN',
   promotionGradeOutcomeJoin:false,providerCallDelta:0,refs:{V1:'valuationSourceVintage',S1:'valuationSourceVintage.sectorMedianPe'},
   ...context.sources,sectorMedianPe:{derivationVersion:MEDIAN_DERIVATION,valuationSnapshotRef:'valuation',knownAt:receipt.decisionAt}};
  const rows=receipt.rows.map(row=>{
   const f=featureMap.get(row.symbol),s=context.symbols[row.symbol];
   const sourceReady=!!(f&&s?.valuationPresent&&s.financialPresent&&dateOnly(s.valuationDate)&&s.valuationDate<=receipt.sessionDate&&s.valuationSource&&
    context.sources.valuation.asOfDate===receipt.sessionDate&&context.sources.financial.asOfDate&&
    context.sources.financial.year!==null&&context.sources.financial.quarter!==null&&
    eq(f.priceEarningsRatio,s.pe)&&eq(f.priceBookRatio,s.pb)&&eq(f.revenueQuarterYoY,s.revenue)&&eq(f.epsYoY,s.eps));
   const group=f?(peers.get(f.industry)||[]):[];
   const peerSourcesBound=!!f&&group.every(p=>context.symbols[p.symbol]?.valuationPresent&&eq(p.priceEarningsRatio,context.symbols[p.symbol].pe));
   return {...row,valuationProvenance:{ref:'V1',valuationDate:s?.valuationDate??null,valuationSource:s?.valuationSource??null,
    quarterEpsSource:s?.quarterEpsSource??null,quarterEpsYear:s?.quarterEpsYear??null,quarterEpsQuarter:s?.quarterEpsQuarter??null,
    epsOrigin:s?.epsOrigin??'UNKNOWN',sourceKnownByDecisionAt:sourceReady?true:null},
    sectorMedianPeProvenance:{ref:'S1',industry:f?.industry??null,positivePePeerCount:f?group.length:null,peerSourcesBound:peerSourcesBound?true:null}};
  });
  return {...receipt,rows,valuationSourceVintage:root};
 }catch(error){return {...receipt,valuationSourceVintage:blocked(String(error).slice(0,120))};}
}

export async function finalizeValuationSourceVintage(receipt){
 if(!receipt?.valuationSourceVintage)return receipt; // Historical receipts remain byte-identical.
 assert(/^8\.(?:1[89]|[2-9]\d)\./.test(receipt.effectiveRuntimeVersion),'LEGACY_NO_BACKFILL');
 try{
  const root=receipt.valuationSourceVintage;
  const digest=await hash(root);
  const result={...receipt,rows:receipt.rows.map((r,i)=>i===0?{...r,valuationSourceVintageDigest:digest}:r)};
  if(new TextEncoder().encode(JSON.stringify(result)).byteLength>=10000000||new TextEncoder().encode(JSON.stringify(root)).byteLength>90000)throw Error('CAPTURE_BUDGET');
  return result;
 }catch{
  const root=blocked('FINALIZE_FAILED');
  // Failure is explicit and cannot become a rank/promotion input. Existing C1 rows survive.
  return {...receipt,valuationSourceVintage:root,rows:receipt.rows.map(r=>{const {valuationProvenance,sectorMedianPeProvenance,valuationSourceVintageDigest,...old}=r;return old;})};
 }
}

export async function verifyValuationSourceVintage(receipt){
 const root=receipt?.valuationSourceVintage;
 if(!root){assert(!receipt.rows?.some(r=>r.valuationProvenance||r.sectorMedianPeProvenance||r.valuationSourceVintageDigest),'ORPHAN_CHILD');return {status:'LEGACY_NO_SOURCE_VINTAGE',promotionGradeOutcomeJoin:false};}
 assert(/^8\.(?:1[89]|[2-9]\d)\./.test(receipt.effectiveRuntimeVersion),'LEGACY_NO_BACKFILL');
 assert(root.schemaVersion===VINTAGE_SCHEMA&&root.researchOnly===true&&root.decisionImpact===false&&root.promotionGradeOutcomeJoin===false,'FIREWALL');
 assert(root.officialFirstKnownAt===null&&root.officialFirstKnownState==='NOT_PROVEN','OFFICIAL_FIRST_KNOWN_NOT_PROVEN');
 // Explicit digest failure carries no provenance child. It remains blocked, never a successful capture.
 if(root.status==='DATA_QUALITY_BLOCKED'&&root.reason==='FINALIZE_FAILED'){
  assert(!receipt.rows.some(r=>r.valuationProvenance||r.sectorMedianPeProvenance||r.valuationSourceVintageDigest),'FAILED_CHILD');return {status:root.status,promotionGradeOutcomeJoin:false};
 }
 assert(receipt.rows.length>0&&receipt.rows[0].valuationSourceVintageDigest===await hash(root),'ROOT_DIGEST_MISMATCH');
 if(root.status==='DATA_QUALITY_BLOCKED')return {status:root.status,promotionGradeOutcomeJoin:false};
 assert(root.status==='SELECTION_TIME_SOURCE_VINTAGE_CAPTURED','STATUS');
 assert(typeof root.captureRequestId==='string'&&root.captureRequestId.length>0,'REQUEST_ID');
 assert(root.captureGeneration===receipt.generationId&&root.decisionAt===receipt.decisionAt&&root.knownAt===receipt.decisionAt,'GENERATION_BINDING');
 assert(root.notSourceEventTime===true&&root.systemFirstObservedContinuity==='NOT_PROVEN'&&root.providerCallDelta===0,'PIT_STATE');
 assert(root.sectorMedianPe.derivationVersion===MEDIAN_DERIVATION&&root.sectorMedianPe.valuationSnapshotRef==='valuation'&&root.sectorMedianPe.knownAt===receipt.decisionAt,'MEDIAN_LINEAGE');
 for(const key of ['valuation','financial','quarterEps']){
  const s=root[key];assert(s&&typeof s.present==='boolean','SNAPSHOT');
  if(s.present){assert(/^[a-f0-9]{64}$/.test(s.contentDigest)&&Number.isInteger(s.stockCount)&&s.stockCount>=0,'SNAPSHOT_DIGEST');
   assert(Number.isFinite(Date.parse(s.captureObservedAt))&&Date.parse(s.captureObservedAt)<=Date.parse(receipt.decisionAt),'FUTURE_CAPTURE');
   assert(s.asOfDate===null||dateOnly(s.asOfDate)&&s.asOfDate<=receipt.sessionDate,'FUTURE_ASOF');
  }else assert(s.contentDigest===null&&s.captureObservedAt===null&&s.stockCount===0,'ABSENT_SNAPSHOT');
 }
 const peerCounts=new Map();
 for(const row of receipt.rows)if(row.feature?.priceEarningsRatio>0&&row.sectorMedianPeProvenance?.industry!==null){const industry=row.sectorMedianPeProvenance?.industry;peerCounts.set(industry,(peerCounts.get(industry)||0)+1);}
 let complete=0;
 for(const row of receipt.rows){
  const v=row.valuationProvenance,m=row.sectorMedianPeProvenance;
  assert(v?.ref==='V1'&&m?.ref==='S1','ROW_REFERENCE');
  assert(v.sourceKnownByDecisionAt===true||v.sourceKnownByDecisionAt===null,'MISSING_NOT_UNKNOWN');
  assert(m.positivePePeerCount===null||Number.isInteger(m.positivePePeerCount)&&m.positivePePeerCount>=0,'PEER_COUNT');
  assert(m.peerSourcesBound===true||m.peerSourcesBound===null,'PEER_SOURCE_STATE');
  if(m.positivePePeerCount!==null){
   assert(typeof m.industry==='string','PEER_INDUSTRY');
   const count=peerCounts.get(m.industry)||0;
   assert(count===m.positivePePeerCount,'PEER_COUNT_MISMATCH');
  }
  if(v.sourceKnownByDecisionAt===true){assert(dateOnly(v.valuationDate)&&v.valuationDate<=receipt.sessionDate&&v.valuationSource&&root.valuation.present&&root.financial.present,'ROW_SOURCE');complete++;}
 }
 return {status:root.status,completeSourceRows:complete,unknownSourceRows:receipt.rows.length-complete,officialFirstKnownState:'NOT_PROVEN',systemFirstObservedContinuity:'NOT_PROVEN',promotionGradeOutcomeJoin:false};
}
