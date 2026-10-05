import assert from "node:assert/strict";
import {
  evaluateScheduleIdentity,
  evaluateBaselineReadiness,
  evaluateFetchBoundaryProvenance,
  evaluatePve247
} from "../research/d02_pve247_remediation_acceptance_oracle_v0_1.mjs";

let n=0;
const test=(name,fn)=>{fn();n+=1;console.log(`ok ${n} - ${name}`);};

const repairedSchedule={
  cloudflareSchedules:[
    "0-24 5 * * MON-FRI",
    "* 1-4 * * MON-FRI",
    "35,55 15 * * mon-fri",
    "* 9 * * MON-FRI"
  ],
  afterMarketRows:[
    {taipeiClock:"23:35",jobType:"AFTER_MARKET_SCAN",status:"SUCCESS"},
    {taipeiClock:"23:55",jobType:"AFTER_MARKET_RECOVERY",status:"SKIPPED",reason:"ALREADY_SCANNED"}
  ]
};

const readyBaseline={
  bootstrapAttemptAt:"2026-10-06T23:35:10+08:00",
  symbol:"2454",
  from:"2026-04-09",
  to:"2026-10-05",
  providerStatus:"HTTP_200",
  rawRowCount:3200,
  normalizedSessionCount:120,
  rejectedSessionCount:0,
  rejectedSessionReasons:[],
  finalValidSessions:120,
  slotHistoryCount:20,
  pvSlotRvol20:1.23,
  sameSlotBaselineClean:true
};

const goodProv={
  provider:"FUGLE",
  endpoint:"https://api.fugle.tw/marketdata/v1.0/stock/intraday/candles/2454?timeframe=15",
  rawPayloadHash:"a".repeat(64),
  rawPayloadHashBasis:"EXACT_PROVIDER_RESPONSE_SHA256",
  capturedAt:"2026-10-06T10:31:47+08:00",
  normalizationVersion:"PV_SHADOW_V0_2",
  semanticFingerprint:"pv-semantic-v1:abc"
};

const futureReceipt={
  marketDate:"2026-10-06",
  canonicalReceiptGuardPass:true,
  h001LaneGuardPass:true,
  commonSupportPass:true,
  cohortGenerationFormalIsolationPass:true
};

test("current physical 23:35/23:55 intraday misclassification fails",()=>{
  const r=evaluateScheduleIdentity({
    cloudflareSchedules:["35,55 15 * * mon-fri"],
    afterMarketRows:[
      {taipeiClock:"23:35",jobType:"INTRADAY_MONITOR",status:"SKIPPED"},
      {taipeiClock:"23:55",jobType:"INTRADAY_MONITOR",status:"SKIPPED"}
    ]
  });
  assert.equal(r.pass,false);
  assert.ok(r.reasons.includes("AFTER_MARKET_MISCLASSIFIED_AS_INTRADAY"));
});

test("repaired primary+recovery family passes",()=>{
  assert.equal(evaluateScheduleIdentity(repairedSchedule).pass,true);
});

test("two successful business scans fail duplicate guard",()=>{
  const x=structuredClone(repairedSchedule);
  x.afterMarketRows[1]={taipeiClock:"23:55",jobType:"AFTER_MARKET_RECOVERY",status:"SUCCESS"};
  const r=evaluateScheduleIdentity(x);
  assert.equal(r.pass,false);
  assert.ok(r.reasons.includes("DUPLICATE_AFTER_MARKET_SUCCESS"));
});

test("baseline below 20 fails",()=>{
  const x={...readyBaseline,normalizedSessionCount:19,finalValidSessions:19,slotHistoryCount:19,pvSlotRvol20:null};
  assert.equal(evaluateBaselineReadiness(x).pass,false);
});

test("baseline requires explicit rejection accounting",()=>{
  const x={...readyBaseline};
  delete x.rejectedSessionReasons;
  assert.equal(evaluateBaselineReadiness(x).pass,false);
});

test("ready 20-session same-slot baseline passes",()=>{
  assert.equal(evaluateBaselineReadiness(readyBaseline).pass,true);
});

test("missing raw payload hash fails provenance",()=>{
  const x={...goodProv,rawPayloadHash:null};
  assert.equal(evaluateFetchBoundaryProvenance(x).pass,false);
});

test("wrong hash basis fails provenance",()=>{
  const x={...goodProv,rawPayloadHashBasis:"SEMANTIC_FINGERPRINT"};
  assert.equal(evaluateFetchBoundaryProvenance(x).pass,false);
});

test("secret-bearing endpoint fails provenance",()=>{
  const x={...goodProv,endpoint:"https://example.test/candles?api_key=SECRET"};
  assert.equal(evaluateFetchBoundaryProvenance(x).pass,false);
});

test("good fetch-boundary provenance passes",()=>{
  assert.equal(evaluateFetchBoundaryProvenance(goodProv).pass,true);
});

test("remediation ready can be true before future H001 receipt exists",()=>{
  const r=evaluatePve247({
    schedule:repairedSchedule,baseline:readyBaseline,provenance:goodProv,futureReceipt:{}
  });
  assert.equal(r.remediationReady,true);
  assert.equal(r.h001ReceiptEligible,false);
});

test("2026-10-05 can never become eligible retrospectively",()=>{
  const r=evaluatePve247({
    schedule:repairedSchedule,
    baseline:readyBaseline,
    provenance:goodProv,
    futureReceipt:{...futureReceipt,marketDate:"2026-10-05"}
  });
  assert.equal(r.h001ReceiptEligible,false);
  assert.ok(r.receipt.reasons.includes("NON_RETROACTIVITY_VIOLATION"));
});

test("future receipt still fails without canonical guard",()=>{
  const r=evaluatePve247({
    schedule:repairedSchedule,
    baseline:readyBaseline,
    provenance:goodProv,
    futureReceipt:{...futureReceipt,canonicalReceiptGuardPass:false}
  });
  assert.equal(r.h001ReceiptEligible,false);
});

test("future receipt still fails without H001 lane guard",()=>{
  const r=evaluatePve247({
    schedule:repairedSchedule,
    baseline:readyBaseline,
    provenance:goodProv,
    futureReceipt:{...futureReceipt,h001LaneGuardPass:false}
  });
  assert.equal(r.h001ReceiptEligible,false);
});

test("fully repaired future receipt is eligible for evidence admission only",()=>{
  const r=evaluatePve247({
    schedule:repairedSchedule,baseline:readyBaseline,provenance:goodProv,futureReceipt
  });
  assert.equal(r.remediationReady,true);
  assert.equal(r.h001ReceiptEligible,true);
  assert.deepEqual(r.authorizations,{
    outcomeAccessAuthorized:false,
    numericalTargetAuthorized:false,
    d16MethodSelectionAuthorized:false,
    maturityPromotionAuthorized:false,
    formalCoreChangeAuthorized:false
  });
});

console.log(`1..${n}`);
