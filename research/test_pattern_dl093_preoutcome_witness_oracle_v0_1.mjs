import assert from "node:assert/strict";
import {validateWitnessFreeze,validateNoSwitch,validateWindowIdentity,validateR5,validateR6,validateUpstreamBundle,canGenerateR7} from "./pattern_dl093_preoutcome_witness_oracle_v0_1.mjs";

let p=0;
const t=(n,f)=>{f();p++;console.log("PASS",n);};

t("D9301 frozen identity passes",()=>assert.equal(
  validateWitnessFreeze({market:"TWSE",symbol:"1101",targetDate:"2021-06-15",requiredPriorEligibleSessions:60,expectedWindowSize:61,outcomeJoin:"CLOSED"}).status,
  "WITNESS_FROZEN_VALID"
));

t("D9302 symbol drift fails",()=>assert.equal(
  validateWitnessFreeze({market:"TWSE",symbol:"1102",targetDate:"2021-06-15",requiredPriorEligibleSessions:60,expectedWindowSize:61,outcomeJoin:"CLOSED"}).status,
  "WITNESS_IDENTITY_DRIFT"
));

t("D9303 post-context switch fails",()=>assert.equal(
  validateNoSwitch({originalSymbol:"1101",originalDate:"2021-06-15",candidateSymbol:"1102",candidateDate:"2021-06-15",contextInspected:true}).status,
  "POST_CONTEXT_WITNESS_SWITCH_PROHIBITED"
));

t("D9304 unchanged witness passes",()=>assert.equal(
  validateNoSwitch({originalSymbol:"1101",originalDate:"2021-06-15",candidateSymbol:"1101",candidateDate:"2021-06-15",contextInspected:true}).status,
  "WITNESS_IDENTITY_PRESERVED"
));

const dates=Array.from({length:61},(_,i)=>"D"+String(i+1).padStart(2,"0"));

t("D9305 exact date set passes",()=>assert.equal(
  validateWindowIdentity({expectedDates:dates,observedDates:[...dates],expectedSessionHash:"h",observedSessionHash:"h"}).status,
  "EXACT_WINDOW_READY"
));

t("D9306 older substitution date drift fails",()=>{
  const observed=[...dates];
  observed[0]="D00";
  assert.equal(
    validateWindowIdentity({expectedDates:dates,observedDates:observed,expectedSessionHash:"h",observedSessionHash:"h"}).status,
    "EXPECTED_OBSERVED_DATESET_MISMATCH"
  );
});

t("D9307 session hash mismatch fails",()=>assert.equal(
  validateWindowIdentity({expectedDates:dates,observedDates:[...dates],expectedSessionHash:"a",observedSessionHash:"b"}).status,
  "SESSION_HASH_MISMATCH"
));

t("D9308 factual R5 without knownAt/hash remains pending",()=>assert.equal(
  validateR5({upperLimitPrice:56.5,openingAuctionReferencePrice:51.4,lowerLimitPrice:46.3}).status,
  "R5_PROVENANCE_PENDING"
));

t("D9309 fully proven R5 passes",()=>assert.equal(
  validateR5({upperLimitPrice:56.5,openingAuctionReferencePrice:51.4,lowerLimitPrice:46.3,ruleVersion:"v",firstObservableAt:"2021-06-15T23:30:00+08:00",sourceHash:"abc",replaySafe:true}).status,
  "R5_READY"
));

t("D9310 no disposition match without complete coverage fails",()=>assert.equal(
  validateR6({coverageCompleteForWindow:false,state:"CERTIFIED_NORMAL_MATCHING",changedTradingMethodResolved:true}).status,
  "R6_COVERAGE_UNKNOWN"
));

t("D9311 certified normal needs changed-trading-method resolution",()=>assert.equal(
  validateR6({coverageCompleteForWindow:true,state:"CERTIFIED_NORMAL_MATCHING",changedTradingMethodResolved:false}).status,
  "R6_MATCHING_REGIME_UNKNOWN"
));

t("D9312 verified disposition cadence passes",()=>assert.equal(
  validateR6({coverageCompleteForWindow:true,state:"VERIFIED_DISPOSITION_MATCHING",matchingCadenceSeconds:120}).status,
  "R6_READY_DISPOSITION"
));

t("D9313 one missing upstream family blocks",()=>assert.equal(
  validateUpstreamBundle({R1:"PASS",R2:"PASS",R3:"PASS",R4:"PASS",R5:"PASS",R6:"BLOCKED"}).status,
  "R1_R6_BUNDLE_BLOCKED"
));

t("D9314 all upstream families pass",()=>assert.equal(
  validateUpstreamBundle({R1:"PASS",R2:"PASS",R3:"PASS",R4:"PASS",R5:"PASS",R6:"PASS"}).status,
  "R1_R6_BUNDLE_READY"
));

t("D9315 R7 blocked before upstream",()=>assert.equal(
  canGenerateR7({upstreamState:"R1_R6_BUNDLE_BLOCKED",outcomesOpened:false}).status,
  "R7_GENERATION_BLOCKED"
));

t("D9316 R7 cannot be formed after outcome opening",()=>assert.equal(
  canGenerateR7({upstreamState:"R1_R6_BUNDLE_READY",outcomesOpened:true}).status,
  "R7_OUTCOME_FIREWALL_BREACH"
));

console.log(`SUMMARY ${p}/16 PASS`);
