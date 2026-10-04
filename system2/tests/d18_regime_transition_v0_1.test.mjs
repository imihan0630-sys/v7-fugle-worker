import assert from "node:assert/strict";
import { buildD18RegimeTransitionReceiptV0_1 } from "../runtime/d18_regime_transition_v0_1.mjs";

const prior={
  vectorVersion:"D18_OBSERVABLE_REGIME_VECTOR_V0_1_RESEARCH",
  marketDate:"2026-10-01",
  decisionTimestamp:"2026-10-01T06:30:00.000Z",
  pointInTimeEligible:true,
  receiptHash:"prior-vector-hash",
  dimensions:{
    trendContext:{state:"KNOWN",value:"UP_TREND_CONTEXT"},
    volatilityDirection:{state:"KNOWN",value:"VOL_EXPANDING"},
    breadthContext:{state:"CONTEXT_RAW",value:null},
    sizeLeadership:{state:"UNKNOWN",value:null},
  },
};

const current={
  vectorVersion:"D18_OBSERVABLE_REGIME_VECTOR_V0_1_RESEARCH",
  marketDate:"2026-10-02",
  decisionTimestamp:"2026-10-02T06:30:00.000Z",
  pointInTimeEligible:true,
  receiptHash:"current-vector-hash",
  dimensions:{
    trendContext:{state:"KNOWN",value:"DOWN_TREND_CONTEXT"},
    volatilityDirection:{state:"KNOWN",value:"VOL_EXPANDING"},
    breadthContext:{state:"CONTEXT_RAW",value:null},
    sizeLeadership:{state:"UNKNOWN",value:null},
  },
};

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

const changed=await buildD18RegimeTransitionReceiptV0_1({
  ...base,
  receiptId:"D18-TRANS-2",
  currentVector:{...current,receiptHash:"current-vector-hash-2",dimensions:{
    ...current.dimensions,
    volatilityDirection:{state:"KNOWN",value:"VOL_CONTRACTING"},
  }},
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

await assert.rejects(
  ()=>buildD18RegimeTransitionReceiptV0_1({
    ...base,
    receiptId:"D18-TRANS-nonpit",
    currentVector:{...current,pointInTimeEligible:false},
  }),
  /must be PIT eligible/,
);

await assert.rejects(
  ()=>buildD18RegimeTransitionReceiptV0_1({
    ...base,
    receiptId:"D18-TRANS-clock",
    observedAt:"2026-10-02T06:20:00.000Z",
  }),
  /observedAt cannot be earlier/,
);

console.log("D18 regime transition tests: PASS");
