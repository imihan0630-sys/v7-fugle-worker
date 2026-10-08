import assert from "node:assert/strict";
import { buildD18RegimeTransitionReceiptV0_1 } from "../runtime/d18_regime_transition_v0_1.mjs";
import { sha256Hex } from "../runtime/decision_archive.mjs";

const D18_DIMENSIONS=[
  "trendContext",
  "breadthContext",
  "volatilityDirection",
  "activityDirection",
  "concentrationContext",
  "sizeLeadership",
  "institutionalContext",
  "globalTransmission",
  "sectorRotationContext",
];

async function hashedDimension({
  state="UNKNOWN",
  value=null,
  reason="fixture unknown",
  sourceRef=null,
  sourceIdentity=null,
  availableAt=null,
  pointInTimeEligible=false,
  blockerCodes=[],
}={}) {
  const base={state,value,reason,sourceRef,sourceIdentity,availableAt,pointInTimeEligible,blockerCodes};
  return {...base,evidenceHash:await sha256Hex(base)};
}

async function makeVector({
  marketDate,
  decisionTimestamp,
  trendValue,
  volatilityValue,
}){
  const dimensions={};
  for(const key of D18_DIMENSIONS) dimensions[key]=await hashedDimension();
  dimensions.trendContext=await hashedDimension({
    state:"KNOWN",value:trendValue,reason:null,
    sourceRef:"a".repeat(64),sourceIdentity:"A2_TAIEX_CLOSE",
    availableAt:marketDate+"T06:20:00.000Z",pointInTimeEligible:true,
  });
  dimensions.volatilityDirection=await hashedDimension({
    state:"KNOWN",value:volatilityValue,reason:null,
    sourceRef:"b".repeat(64),sourceIdentity:"A2_TAIEX_CLOSE",
    availableAt:marketDate+"T06:20:00.000Z",pointInTimeEligible:true,
  });
  dimensions.breadthContext=await hashedDimension({
    state:"CONTEXT_RAW",value:null,reason:"U2B_PENDING",
    sourceRef:"c".repeat(64),sourceIdentity:"D18.DIRECTION_BREADTH",
    availableAt:marketDate+"T06:20:00.000Z",pointInTimeEligible:true,
  });
  const base={
    vectorVersion:"D18_OBSERVABLE_REGIME_VECTOR_V0_1_RESEARCH",
    marketDate,
    decisionTimestamp,
    pointInTimeEligible:true,
    dimensions,
  };
  return {...base,receiptHash:await sha256Hex(base)};
}

const prior=await makeVector({
  marketDate:"2026-10-01",
  decisionTimestamp:"2026-10-01T06:30:00.000Z",
  trendValue:"UP_TREND_CONTEXT",
  volatilityValue:"VOL_EXPANDING",
});

const current=await makeVector({
  marketDate:"2026-10-02",
  decisionTimestamp:"2026-10-02T06:30:00.000Z",
  trendValue:"DOWN_TREND_CONTEXT",
  volatilityValue:"VOL_EXPANDING",
});

const base={
  receiptId:"D18-TRANS-1",
  priorVector:prior,
  currentVector:current,
  officialSessionDates:["2026-10-01","2026-10-02"],
  observedAt:"2026-10-02T06:31:00.000Z",
};

const out=await buildD18RegimeTransitionReceiptV0_1(base);
assert.equal(out.state,"KNOWN_TRANSITION_FRAME");
assert.equal(out.transitions.trendContext.state,"CHANGED");
assert.equal(out.transitions.volatilityDirection.state,"UNCHANGED");
assert.equal(out.transitions.breadthContext.state,"UNKNOWN");
assert.equal(out.transitions.sizeLeadership.state,"UNKNOWN");
assert.equal(out.summary.changedCount,1);
assert.equal(out.summary.unchangedCount,1);
assert.equal(out.summary.unknownCount,2);
assert.equal(out.transitionPolicyApplied,false);
assert.equal(out.smoothingApplied,false);
assert.equal(out.retrospectiveRelabelApplied,false);
assert.equal(out.strategyImpact,false);

const replay=await buildD18RegimeTransitionReceiptV0_1(base);
assert.equal(replay.receiptHash,out.receiptHash);

const changedCurrent=await makeVector({
  marketDate:"2026-10-02",
  decisionTimestamp:"2026-10-02T06:30:00.000Z",
  trendValue:"DOWN_TREND_CONTEXT",
  volatilityValue:"VOL_CONTRACTING",
});
const changed=await buildD18RegimeTransitionReceiptV0_1({
  ...base,
  receiptId:"D18-TRANS-2",
  currentVector:changedCurrent,
});
assert.notEqual(changed.receiptHash,out.receiptHash);
assert.equal(changed.transitions.volatilityDirection.state,"CHANGED");

await assert.rejects(
  ()=>buildD18RegimeTransitionReceiptV0_1({
    ...base,
    receiptId:"D18-TRANS-gap",
    officialSessionDates:["2026-09-30","2026-10-02"],
  }),
  /not adjacent official sessions/,
);

const tamperedCurrent={
  ...current,
  dimensions:{
    ...current.dimensions,
    trendContext:{
      ...current.dimensions.trendContext,
      value:"UP_TREND_CONTEXT",
    },
  },
};
const tampered=await buildD18RegimeTransitionReceiptV0_1({
  ...base,
  receiptId:"D18-TRANS-TAMPERED",
  currentVector:tamperedCurrent,
});
assert.equal(tampered.state,"UNKNOWN_TRANSITION_FRAME");
assert.equal(tampered.currentVectorEvidenceValid,false);
assert.equal(tampered.transitions.trendContext.state,"UNKNOWN");
assert.equal(tampered.transitions.trendContext.reason,"DIMENSION_EVIDENCE_INVALID");
assert.ok(tampered.regimeEvidenceBlockers.some((x)=>x.includes("DIMENSION_EVIDENCE_HASH_MISMATCH")));

await assert.rejects(
  ()=>buildD18RegimeTransitionReceiptV0_1({
    ...base,
    receiptId:"D18-TRANS-clock",
    observedAt:"2026-10-02T06:20:00.000Z",
  }),
  /observedAt cannot be earlier/,
);

console.log("D18 regime transition tests: PASS");
