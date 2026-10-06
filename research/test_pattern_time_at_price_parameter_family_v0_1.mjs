import assert from "node:assert/strict";
import {validateOccupancyParameterFamily} from "./pattern_time_at_price_inventory_v0_1.mjs";

let pass=0;
const t=(n,f)=>{f();pass++;console.log("PASS",n);};

const base={
  parameterFamilyId:"TAP-F1",
  registryFrozenAt:"2026-10-01T00:00:00+08:00",
  barInterval:"15m",
  priceBinRuleId:"LEGAL_TICK_GRID_V1",
  tickRuleReceipt:{
    verified:true,
    pointInTime:true,
    asOf:"2026-10-06T09:00:00+08:00",
    ruleId:"TWSE_TICK_V1"
  },
  semanticSpace:"TECHNICAL_CONTINUITY",
  sessionMechanism:"TWSE_CONTINUOUS",
  predictorFreezeAt:"2026-10-06T10:00:00+08:00",
  outcomeInspectionAt:"2026-10-07T00:00:00+08:00"
};

t("TP21",()=>{
  const r=validateOccupancyParameterFamily(base);
  assert.equal(r.status,"VALID");
  assert.equal(r.outcomeTunedSelectionAllowed,false);
});

t("TP22",()=>{
  const r=validateOccupancyParameterFamily({
    ...base,
    tickRuleReceipt:{...base.tickRuleReceipt,verified:false}
  });
  assert.equal(r.status,"DATA_BLOCKED");
  assert.equal(r.reason,"TICK_RULE_RECEIPT_INVALID");
});

t("TP23",()=>{
  const r=validateOccupancyParameterFamily({
    ...base,
    tickRuleReceipt:{...base.tickRuleReceipt,asOf:"2026-10-06T10:30:00+08:00"}
  });
  assert.equal(r.status,"POST_HOC_NOT_ELIGIBLE");
  assert.equal(r.reason,"TICK_RULE_AFTER_FREEZE");
});

t("TP24",()=>{
  const r=validateOccupancyParameterFamily({
    ...base,
    registryFrozenAt:"2026-10-08T00:00:00+08:00"
  });
  assert.equal(r.status,"PROHIBITED");
  assert.equal(r.reason,"PARAMETER_FAMILY_NOT_FROZEN_BEFORE_OUTCOME");
});

t("TP25",()=>{
  const r=validateOccupancyParameterFamily({
    ...base,
    familyChangedAfterOutcome:true
  });
  assert.equal(r.status,"PROHIBITED");
  assert.equal(r.reason,"POST_OUTCOME_PARAMETER_FAMILY_MUTATION");
});

t("TP26",()=>{
  const r=validateOccupancyParameterFamily({
    ...base,
    bestVariantSelectedAfterOutcome:true
  });
  assert.equal(r.status,"PROHIBITED");
  assert.equal(r.reason,"BEST_OCCUPANCY_VARIANT_AFTER_OUTCOME");
});

console.log(`SUMMARY ${pass}/6 PASS`);
