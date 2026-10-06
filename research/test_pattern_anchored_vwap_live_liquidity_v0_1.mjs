import assert from "node:assert/strict";
import {
  classifyAnchor,
  validateVwapReceipt,
  classifyBookReceipt,
  referenceDistance,
  buildLineageDiagnostics,
  classifyContext
} from "./pattern_anchored_vwap_live_liquidity_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const freeze="2026-10-06T10:00:00+08:00";

t("AV01 structural anchor is valid but dependent",()=>{
  const r=classifyAnchor({anchorLineage:"D01_STRUCTURAL_EVENT_ANCHOR",anchorAt:"2026-10-06T09:15:00+08:00",anchorKnownAt:"2026-10-06T09:15:00+08:00",predictorFreezeAt:freeze});
  assert.equal(r.status,"VALID"); assert.equal(r.structuralDependence,true);
});
t("AV02 outcome-selected anchor prohibited",()=>{
  const r=classifyAnchor({anchorLineage:"OUTCOME_SELECTED_ANCHOR",anchorAt:"2026-10-06T09:30:00+08:00",anchorKnownAt:"2026-10-06T09:30:00+08:00",predictorFreezeAt:freeze});
  assert.equal(r.status,"PROHIBITED");
});
t("AV03 future-known anchor post hoc",()=>{
  const r=classifyAnchor({anchorLineage:"EXTERNAL_EVENT_ANCHOR",anchorAt:"2026-10-06T09:00:00+08:00",anchorKnownAt:"2026-10-06T10:05:00+08:00",predictorFreezeAt:freeze});
  assert.equal(r.status,"POST_HOC_NOT_ELIGIBLE");
});
t("AV04 provider average stays proxy",()=>{
  const r=validateVwapReceipt({kind:"PROVIDER_AVERAGE_PRICE_PROXY"});
  assert.equal(r.status,"VALID_PROXY"); assert.equal(r.exactVwap,false);
});
t("AV05 exact VWAP needs verified semantics",()=>{
  const r=validateVwapReceipt({kind:"EXACT_SESSION_VWAP",sourceSemanticsVerified:false,coverageComplete:true,flowStart:"2026-10-06T09:00:00+08:00",flowEnd:"2026-10-06T09:59:00+08:00",predictorFreezeAt:freeze});
  assert.equal(r.status,"DATA_BLOCKED");
});
t("AV06 exact VWAP needs complete flow coverage",()=>{
  const r=validateVwapReceipt({kind:"EXACT_SESSION_VWAP",sourceSemanticsVerified:true,coverageComplete:false,flowStart:"2026-10-06T09:00:00+08:00",flowEnd:"2026-10-06T09:59:00+08:00",predictorFreezeAt:freeze});
  assert.equal(r.reason,"TRADE_FLOW_COVERAGE_INCOMPLETE");
});
t("AV07 OHLCV synthetic AVWAP prohibited",()=>{
  const r=validateVwapReceipt({kind:"ANCHORED_VWAP_CANDIDATE",syntheticFromOhlcv:true});
  assert.equal(r.status,"PROHIBITED");
});
t("AV08 post-freeze trade flow prohibited",()=>{
  const r=validateVwapReceipt({kind:"ANCHORED_VWAP_CANDIDATE",sourceSemanticsVerified:true,coverageComplete:true,flowStart:"2026-10-06T09:15:00+08:00",flowEnd:"2026-10-06T10:05:00+08:00",predictorFreezeAt:freeze});
  assert.equal(r.status,"POST_HOC_NOT_ELIGIBLE");
});
t("AV09 valid exact flow accepted",()=>{
  const r=validateVwapReceipt({kind:"ANCHORED_VWAP_CANDIDATE",sourceSemanticsVerified:true,coverageComplete:true,flowStart:"2026-10-06T09:15:00+08:00",flowEnd:"2026-10-06T09:59:00+08:00",predictorFreezeAt:freeze});
  assert.equal(r.status,"VALID_EXACT");
});
t("AV10 future book snapshot prohibited",()=>{
  const r=classifyBookReceipt({snapshotAt:"2026-10-06T10:01:00+08:00",sourceFetchedAt:"2026-10-06T10:01:00+08:00",predictorFreezeAt:freeze,freshnessState:"FRESH",sessionMechanism:"CONTINUOUS",coverageComplete:true});
  assert.equal(r.status,"POST_HOC_NOT_ELIGIBLE");
});
t("AV11 stale book explicit",()=>{
  const r=classifyBookReceipt({snapshotAt:"2026-10-06T09:59:00+08:00",sourceFetchedAt:"2026-10-06T09:59:00+08:00",predictorFreezeAt:freeze,freshnessState:"STALE",sessionMechanism:"CONTINUOUS",coverageComplete:true});
  assert.equal(r.status,"BOOK_CONTEXT_STALE");
});
t("AV12 missing book coverage data blocked",()=>{
  const r=classifyBookReceipt({snapshotAt:"2026-10-06T09:59:00+08:00",sourceFetchedAt:"2026-10-06T09:59:00+08:00",predictorFreezeAt:freeze,freshnessState:"FRESH",sessionMechanism:"CONTINUOUS",coverageComplete:false});
  assert.equal(r.status,"DATA_BLOCKED");
});
t("AV13 inside-zone reference distance zero",()=>{
  const r=referenceDistance({referencePrice:102,lower:100,upper:104,tickSize:0.5,atr:2});
  assert.equal(r.referenceInsideZone,true); assert.equal(r.referenceDistancePrice,0);
});
t("AV14 outside reference normalized without moving zone",()=>{
  const r=referenceDistance({referencePrice:110,lower:100,upper:104,tickSize:1,atr:3});
  assert.equal(r.referenceDistancePrice,6); assert.equal(r.referenceDistanceAtr,2);
});
t("AV15 structural-anchor AVWAP remains one effective evidence count",()=>{
  const r=buildLineageDiagnostics({anchorLineage:"D01_STRUCTURAL_EVENT_ANCHOR",hasProfile:false,hasFreshBook:false});
  assert.equal(r.effectiveIndependentEvidenceCount,1); assert.equal(r.independentVoteAllowed,false);
});
t("AV16 fresh book raw root does not automatically create second vote",()=>{
  const r=buildLineageDiagnostics({anchorLineage:"SESSION_MECHANIC_ANCHOR",hasProfile:false,hasFreshBook:true});
  assert.ok(r.informationRoots.includes("LIVE_ORDER_BOOK")); assert.equal(r.effectiveIndependentEvidenceCount,1);
});
t("AV17 external event anchor carries event clock root",()=>{
  const r=buildLineageDiagnostics({anchorLineage:"EXTERNAL_EVENT_ANCHOR",hasProfile:false,hasFreshBook:false});
  assert.ok(r.informationRoots.includes("EVENT_CLOCK"));
});
t("AV18 volume profile shares trade roots with VWAP",()=>{
  const r=buildLineageDiagnostics({anchorLineage:"SESSION_MECHANIC_ANCHOR",hasProfile:true,hasFreshBook:false});
  assert.equal(r.volumeProfileSharesTradeRoots,true);
});
t("AV19 structure plus VWAP plus book has explicit context class",()=>{
  assert.equal(classifyContext({hasStructure:true,hasVwap:true,hasProfile:false,hasFreshBook:true,evaluable:true}),"C5_STRUCTURE_VWAP_BOOK_COINCIDENT");
});
t("AV20 missing context never becomes zero or false evidence",()=>{
  assert.equal(classifyContext({hasStructure:true,hasVwap:false,hasProfile:false,hasFreshBook:false,evaluable:false}),"C6_CONTEXT_NOT_EVALUABLE");
});

console.log(`SUMMARY ${pass}/20 PASS`);
