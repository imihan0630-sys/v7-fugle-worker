import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import {
  normalizeSelectedPlan,
  buildSelectedPlanReceipts,
  assessSelectedParentPlanLink,
} from "./selected_plan_set_hash_v0_1.mjs";

const basePlan={
  planDate:"2026-09-30",
  strategy:"A_BREAKOUT",
  strategyPool:"GENERAL",
  signalLevel:"A",
  formalClose:100,
  buyLow:98,
  buyHigh:101,
  breakout:102,
  maxChase:104,
  stop:94,
  sellBelow:93,
  reduceAt:110,
  profitCheck:115,
  priorityScore:80,
  rewardRisk:2.1,
  allocationRatio:0.21,
  totalAllocation:42000,
  firstShares:250,
  secondShares:150,
  totalShares:400,
  selectedReason:"FORMAL",
};

const plans=[
  {...basePlan,symbol:"2330"},
  {...basePlan,symbol:"1101",strategyPool:"THOUSAND",priorityScore:79},
];

const a=await buildSelectedPlanReceipts(plans,webcrypto);
const b=await buildSelectedPlanReceipts([plans[1],plans[0]],webcrypto);
assert.equal(a.planCount,2);
assert.equal(a.selectedPlanSetHash,b.selectedPlanSetHash);
assert.deepEqual(a.receipts.map(x=>x.symbol),["1101","2330"]);

// One semantic plan field change must change set hash.
const changed=await buildSelectedPlanReceipts([
  plans[0],
  {...plans[1],stop:95},
],webcrypto);
assert.notEqual(changed.selectedPlanSetHash,a.selectedPlanSetHash);

// strategyPool is mandatory because Formal 3+3 pools are semantically distinct.
assert.throws(
  ()=>normalizeSelectedPlan({...basePlan,symbol:"9999",strategyPool:null}),
  /MISSING_strategyPool/
);

// Duplicate symbol is invalid.
await assert.rejects(
  ()=>buildSelectedPlanReceipts([plans[0],{...plans[0]}],webcrypto),
  /DUPLICATE_SELECTED_PLAN_SYMBOL/
);

const parents=[
  {symbol:"1101",formalState:"SELECTED",selectedFlag:true},
  {symbol:"2330",formalState:"SELECTED",selectedFlag:true},
  {symbol:"3105",formalState:"QUALIFIED_NOT_SELECTED",selectedFlag:false},
];
assert.equal(assessSelectedParentPlanLink({parents,planReceipts:a}).valid,true);

const wrongPlans=await buildSelectedPlanReceipts([
  plans[0],
  {...basePlan,symbol:"9999",strategyPool:"GENERAL"},
],webcrypto);
assert.equal(assessSelectedParentPlanLink({parents,planReceipts:wrongPlans}).valid,false);

console.log(JSON.stringify({ok:true,planSetHash:a.selectedPlanSetHash}));
