import assert from "node:assert/strict";
import {
  classifyInformationReceipt,
  validateInformationTiming,
  classifySignalLineage,
  classifyMarkoutUsage,
  classifyMechanismCell,
  buildInformationOpportunityDenominator
} from "./pattern_information_content_firewall_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

t("IC01 no receipt remains information unknown",()=>{
  const r=classifyInformationReceipt({});
  assert.equal(r.state,"INFORMATION_CONTENT_UNKNOWN");
});

t("IC02 verified ex-ante signal is explicit",()=>{
  const r=classifyInformationReceipt({exAnteSignalReceipt:{verified:true}});
  assert.equal(r.state,"EX_ANTE_SIGNAL_RECEIPT_PRESENT");
  assert.equal(r.baselineEligible,true);
});

t("IC03 verified external information receipt is explicit",()=>{
  const r=classifyInformationReceipt({externalInformationReceipt:{verified:true}});
  assert.equal(r.state,"EXTERNAL_INFORMATION_RECEIPT_PRESENT");
});

t("IC04 post-trade adverse-selection proxy is not automatically baseline eligible",()=>{
  const r=classifyInformationReceipt({adverseSelectionProxy:{available:true}});
  assert.equal(r.state,"MICROSTRUCTURE_ADVERSE_SELECTION_PROXY_PRESENT");
  assert.equal(r.baselineEligible,false);
});

t("IC05 data blocking fails closed",()=>{
  const r=classifyInformationReceipt({dataBlocked:true});
  assert.equal(r.state,"INFORMATION_RECEIPT_DATA_BLOCKED");
});

t("IC06 information known before freeze is eligible",()=>{
  const r=validateInformationTiming({
    informationKnownAt:"2026-10-01T09:29:00+08:00",
    predictorFreezeAt:"2026-10-01T09:30:00+08:00",
    replaySafe:true
  });
  assert.equal(r.status,"PRE_FREEZE_INFORMATION_ELIGIBLE");
});

t("IC07 information known after freeze is post hoc",()=>{
  const r=validateInformationTiming({
    informationKnownAt:"2026-10-01T09:31:00+08:00",
    predictorFreezeAt:"2026-10-01T09:30:00+08:00",
    replaySafe:true
  });
  assert.equal(r.status,"POST_HOC_INFORMATION_NOT_ELIGIBLE");
});

t("IC08 replay unsafe information is blocked",()=>{
  const r=validateInformationTiming({
    informationKnownAt:"2026-10-01T09:29:00+08:00",
    predictorFreezeAt:"2026-10-01T09:30:00+08:00",
    replaySafe:false
  });
  assert.equal(r.status,"DATA_BLOCKED");
});

t("IC09 same PRICE_OHLC signal root is not automatically independent evidence",()=>{
  const r=classifySignalLineage({
    signalInformationRoot:"PRICE_OHLC",
    structuralInformationRoot:"PRICE_OHLC",
    residualIncrementalityValidated:false
  });
  assert.equal(r.status,"SAME_INFORMATION_ROOT");
  assert.equal(r.independentEvidenceAllowed,false);
});

t("IC10 same root requires explicit residual validation before independent use",()=>{
  const r=classifySignalLineage({
    signalInformationRoot:"PRICE_OHLC",
    structuralInformationRoot:"PRICE_OHLC",
    residualIncrementalityValidated:true
  });
  assert.equal(r.independentEvidenceAllowed,true);
});

t("IC11 distinct information root is only a candidate until validated",()=>{
  const r=classifySignalLineage({
    signalInformationRoot:"PUBLIC_EVENT_NEWS",
    structuralInformationRoot:"PRICE_OHLC"
  });
  assert.equal(r.status,"DISTINCT_INFORMATION_ROOT_CANDIDATE");
  assert.equal(r.independentEvidenceAllowed,false);
});

t("IC12 post-trade markout cannot rewrite baseline",()=>{
  const r=classifyMarkoutUsage({
    markoutKnownAt:"2026-10-01T10:00:00+08:00",
    predictorFreezeAt:"2026-10-01T09:30:00+08:00"
  });
  assert.equal(r.state,"POST_TRADE_MARKOUT");
  assert.equal(r.baselineAllowed,false);
});

t("IC13 unknown markout remains unknown",()=>{
  const r=classifyMarkoutUsage({});
  assert.equal(r.state,"MARKOUT_UNKNOWN");
});

t("IC14 high information plus high own impact is explicit mixed cell",()=>{
  const r=classifyMechanismCell({
    informationState:"EX_ANTE_SIGNAL_RECEIPT_PRESENT",
    ownImpactHigh:true
  });
  assert.equal(r.state,"M3_INFORMATION_PROXY_PLUS_HIGH_OWN_IMPACT");
});

t("IC15 high own impact with unknown information remains separate",()=>{
  const r=classifyMechanismCell({
    informationState:"INFORMATION_CONTENT_UNKNOWN",
    ownImpactHigh:true
  });
  assert.equal(r.state,"M2_LOW_OR_UNKNOWN_INFORMATION_PLUS_HIGH_OWN_IMPACT");
});

t("IC16 unknown information is not labeled uninformed",()=>{
  const r=classifyMechanismCell({
    informationState:"INFORMATION_CONTENT_UNKNOWN",
    ownImpactHigh:false
  });
  assert.equal(r.state,"M0_LOW_OR_UNKNOWN_INFORMATION_PLUS_LOW_OR_UNKNOWN_OWN_IMPACT");
});

t("IC17 denominator preserves unknown/proxy/data-blocked states",()=>{
  const r=buildInformationOpportunityDenominator([
    {state:"NO_ORDER"},
    {state:"INFORMATION_UNKNOWN"},
    {state:"EX_ANTE_SIGNAL"},
    {state:"PROXY_ONLY"},
    {state:"DATA_BLOCKED"}
  ]);
  assert.equal(r.total,5);
  assert.equal(r.counts.INFORMATION_UNKNOWN,1);
  assert.equal(r.counts.PROXY_ONLY,1);
});

t("IC18 profitable-case filtering is prohibited",()=>{
  const r=buildInformationOpportunityDenominator([{state:"EX_ANTE_SIGNAL"}]);
  assert.equal(r.profitableCaseFilteringAllowed,false);
});

t("IC19 persistent-move filtering is prohibited",()=>{
  const r=buildInformationOpportunityDenominator([{state:"EXTERNAL_INFORMATION"}]);
  assert.equal(r.persistentMoveFilteringAllowed,false);
});

t("IC20 linked information/mechanical/structural mechanisms remain one effective evidence family by default",()=>{
  const r=buildInformationOpportunityDenominator([{state:"EX_ANTE_SIGNAL"},{state:"PROXY_ONLY"}]);
  assert.equal(r.effectiveIndependentEvidenceCount,1);
});

console.log(`SUMMARY ${pass}/20 PASS`);
