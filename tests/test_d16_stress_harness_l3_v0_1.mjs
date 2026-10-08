import assert from "node:assert/strict";
import {
  sha256,
  runStressScenario,
  reverseStressThreshold,
} from "../research/d16_stress_harness_l3_v0_1.mjs";

let passed=0;
function test(name,fn){
  try{fn();passed+=1;console.log("PASS",name);}
  catch(err){console.error("FAIL",name,err?.stack||err);process.exitCode=1;}
}
function throws(name,fn,pat){test(name,()=>assert.throws(fn,pat));}

const decisionTimestamp="2026-10-08T06:10:00.000Z";
const snapshot={
  market:"TW",
  marketDate:"2026-10-08",
  decisionTimestamp,
  snapshotHash:"a".repeat(64),
  sourceCutHash:"b".repeat(64),
  universeVersion:"TW_RESEARCH_UNIVERSE_V0_1",
  pointInTimeEligible:true,
  positions:[
    {
      positionId:"P-2330",
      symbol:"2330",
      sourceReceiptHash:"1".repeat(64),
      weight:0.6,
      betaToMarket:1.1,
      sectorBeta:0.4,
      liquidityShockSensitivity:0.15,
      gapShockSensitivity:0.2,
      exposureState:"KNOWN",
    },
    {
      positionId:"P-2454",
      symbol:"2454",
      sourceReceiptHash:"2".repeat(64),
      weight:0.3,
      betaToMarket:1.2,
      sectorBeta:0.5,
      liquidityShockSensitivity:0.2,
      gapShockSensitivity:0.25,
      exposureState:"KNOWN",
    },
  ],
};
const scenarioBase={
  scenarioId:"TW_ADVERSE_COMPOSITE_01",
  scenarioVersion:"V0_1",
  registrationState:"PREREGISTERED_RESEARCH",
  registeredAt:"2026-10-08T05:00:00.000Z",
  availableAt:"2026-10-08T05:01:00.000Z",
  outcomeSelected:false,
  marketShock:-0.06,
  sectorShock:-0.04,
  liquidityShock:-0.02,
  gapShock:-0.03,
};
scenarioBase.parameterHash=sha256({
  scenarioId:scenarioBase.scenarioId,
  scenarioVersion:scenarioBase.scenarioVersion,
  marketShock:scenarioBase.marketShock,
  sectorShock:scenarioBase.sectorShock,
  liquidityShock:scenarioBase.liquidityShock,
  gapShock:scenarioBase.gapShock,
});
scenarioBase.scenarioHash=sha256({
  scenarioId:scenarioBase.scenarioId,
  scenarioVersion:scenarioBase.scenarioVersion,
  parameterHash:scenarioBase.parameterHash,
  registeredAt:scenarioBase.registeredAt,
  availableAt:scenarioBase.availableAt,
});

test("ST-T01 deterministic Taiwan PIT stress receipt",()=>{
  const a=runStressScenario({snapshot,scenario:scenarioBase});
  const b=runStressScenario({snapshot:{...snapshot,positions:[snapshot.positions[1],snapshot.positions[0]]},scenario:scenarioBase});
  assert.equal(a.receiptHash,b.receiptHash);
  assert.equal(a.market,"TW");
  assert.equal(a.positionCount,2);
  assert.equal(a.currentOrFutureOutcomeAccessed,false);
  assert.equal(a.formalCoreChanged,false);
  assert.ok(a.portfolioStressReturn<0);
});
throws("ST-T02 non-Taiwan scope rejected",()=>runStressScenario({snapshot:{...snapshot,market:"US"},scenario:scenarioBase}),/MARKET_SCOPE_MUST_BE_TW/);
throws("ST-T03 non-PIT snapshot rejected",()=>runStressScenario({snapshot:{...snapshot,pointInTimeEligible:false},scenario:scenarioBase}),/SNAPSHOT_NOT_PIT_ELIGIBLE/);
throws("ST-T04 unknown exposure rejected",()=>runStressScenario({snapshot:{...snapshot,positions:[{...snapshot.positions[0],exposureState:"UNKNOWN"}]},scenario:scenarioBase}),/UNKNOWN_EXPOSURE_FORBIDDEN/);
throws("ST-T05 duplicate position rejected",()=>runStressScenario({snapshot:{...snapshot,positions:[snapshot.positions[0],{...snapshot.positions[1],positionId:"P-2330"}]},scenario:scenarioBase}),/DUPLICATE_POSITION_ID/);
throws("ST-T06 over-invested snapshot rejected",()=>runStressScenario({snapshot:{...snapshot,positions:[{...snapshot.positions[0],weight:0.8},{...snapshot.positions[1],weight:0.5}]},scenario:scenarioBase}),/TOTAL_WEIGHT_EXCEEDS_ONE/);
throws("ST-T07 post-decision scenario rejected",()=>runStressScenario({snapshot,scenario:{...scenarioBase,availableAt:"2026-10-08T06:11:00.000Z"}}),/SCENARIO_AVAILABLE_AFTER_DECISION/);
throws("ST-T08 outcome-selected scenario rejected",()=>runStressScenario({snapshot,scenario:{...scenarioBase,outcomeSelected:true}}),/OUTCOME_SELECTED_SCENARIO_FORBIDDEN/);
throws("ST-T09 scenario mutation rejected",()=>runStressScenario({snapshot,scenario:{...scenarioBase,marketShock:-0.20}}),/SCENARIO_PARAMETER_HASH_MISMATCH/);
throws("ST-T10 positive favorable shock rejected",()=>runStressScenario({snapshot,scenario:{...scenarioBase,marketShock:0.02,parameterHash:sha256({
  scenarioId:scenarioBase.scenarioId,scenarioVersion:scenarioBase.scenarioVersion,marketShock:0.02,
  sectorShock:scenarioBase.sectorShock,liquidityShock:scenarioBase.liquidityShock,gapShock:scenarioBase.gapShock
})}}),/ADVERSE_SHOCK_SIGN_INVALID/);

const lossLimit=-0.15;
const shockScaleGrid=[0.5,1,1.5,2];
const reverseParameterHash=sha256({
  scenarioId:scenarioBase.scenarioId,
  scenarioVersion:scenarioBase.scenarioVersion,
  baseParameterHash:scenarioBase.parameterHash,
  lossLimit,
  shockScaleGrid,
});
const reverseRegistration={
  registrationState:"PREREGISTERED_RESEARCH",
  registeredAt:"2026-10-08T05:05:00.000Z",
  availableAt:"2026-10-08T05:06:00.000Z",
  outcomeSelected:false,
  parameterHash:reverseParameterHash,
  registrationHash:"e".repeat(64),
};
function rev(overrides={}){
  return reverseStressThreshold({
    snapshot,
    scenarioTemplate:scenarioBase,
    lossLimit,
    shockScaleGrid,
    reverseRegistration,
    ...overrides,
  });
}
test("RS-T01 preregistered reverse-stress grid deterministic",()=>{
  const a=rev(),b=rev();
  assert.equal(a.receiptHash,b.receiptHash);
  assert.deepEqual(a.shockScaleGrid,[0.5,1,1.5,2]);
  assert.equal(a.thresholdTuningPerformed,false);
  assert.equal(a.currentOrFutureOutcomeAccessed,false);
  assert.ok(a.firstBreachScale===null || shockScaleGrid.includes(a.firstBreachScale));
});
throws("RS-T02 unregistered reverse grid rejected",()=>rev({reverseRegistration:null}),/REVERSE_REGISTRATION_NOT_PREREGISTERED/);
throws("RS-T03 post-decision reverse registration rejected",()=>rev({reverseRegistration:{...reverseRegistration,availableAt:"2026-10-08T06:11:00.000Z"}}),/REVERSE_AVAILABLE_AFTER_DECISION/);
throws("RS-T04 outcome-selected grid rejected",()=>rev({reverseRegistration:{...reverseRegistration,outcomeSelected:true}}),/OUTCOME_SELECTED_REVERSE_GRID_FORBIDDEN/);
throws("RS-T05 grid mutation rejected",()=>rev({shockScaleGrid:[0.25,0.5,1,2]}),/REVERSE_PARAMETER_HASH_MISMATCH/);
throws("RS-T06 loss-limit mutation rejected",()=>rev({lossLimit:-0.10}),/REVERSE_PARAMETER_HASH_MISMATCH/);
throws("RS-T07 future scenario template rejected",()=>rev({scenarioTemplate:{...scenarioBase,registeredAt:"2026-10-08T06:11:00.000Z"}}),/SCENARIO_REGISTERED_AFTER_DECISION/);

if(process.exitCode) process.exit(process.exitCode);
console.log(`D16 Taiwan PIT stress harness L3 falsification suite PASS: ${passed} tests`);
