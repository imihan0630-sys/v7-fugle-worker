import assert from "node:assert/strict";
import { sha256Hex } from "../runtime/decision_archive.mjs";
import { buildD18RegimeAttributionReceiptV0_1 } from "../runtime/d18_regime_attribution_v0_1.mjs";

const decisionBase={
  evaluation:{
    decisionId:"D-2330-20261002",
    decisionHash:"decision-hash-1",
    symbol:"2330",
    marketDate:"2026-10-02",
    decisionTimestamp:"2026-10-02T06:30:00.000Z",
    strategyId:"SHORT_MOMENTUM",
    strategyVersion:"V0.1-CONTRACT",
    state:"QUALIFIED_NOT_SELECTED",
  },
};

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
  const base={
    state,
    value,
    reason,
    sourceRef,
    sourceIdentity,
    sourceHashField:pointInTimeEligible ? "receiptHash" : null,
    sourceHashRecomputed:pointInTimeEligible ? sourceRef : null,
    sourceHashVerified:pointInTimeEligible === true,
    availableAt,
    pointInTimeEligible,
    blockerCodes,
  };
  return {...base,evidenceHash:await sha256Hex(base)};
}

async function makeRegimeVector(){
  const dimensions={};
  for(const key of D18_DIMENSIONS) dimensions[key]=await hashedDimension();
  dimensions.trendContext=await hashedDimension({
    state:"KNOWN",value:"UP_TREND_CONTEXT",reason:null,
    sourceRef:"a".repeat(64),sourceIdentity:"A2_TAIEX_CLOSE",
    availableAt:"2026-10-02T06:20:00.000Z",pointInTimeEligible:true,
  });
  dimensions.volatilityDirection=await hashedDimension({
    state:"KNOWN",value:"VOL_CONTRACTING",reason:null,
    sourceRef:"b".repeat(64),sourceIdentity:"A2_TAIEX_CLOSE",
    availableAt:"2026-10-02T06:20:00.000Z",pointInTimeEligible:true,
  });
  dimensions.breadthContext=await hashedDimension({
    state:"CONTEXT_RAW",value:null,reason:"U2B_PENDING",
    sourceRef:"c".repeat(64),sourceIdentity:"D18.DIRECTION_BREADTH",
    availableAt:"2026-10-02T06:20:00.000Z",pointInTimeEligible:true,
  });
  dimensions.sizeLeadership=await hashedDimension({reason:"SIZE_PENDING"});
  const base={
    vectorVersion:"D18_OBSERVABLE_REGIME_VECTOR_V0_1_RESEARCH",
    marketDate:"2026-10-02",
    decisionTimestamp:"2026-10-02T06:30:00.000Z",
    pointInTimeEligible:true,
    dimensions,
  };
  return {...base,receiptHash:await sha256Hex(base)};
}

const regimeVector=await makeRegimeVector();

const outcomeBase={
  decisionId:"D-2330-20261002",
  symbol:"2330",
  decisionMarketDate:"2026-10-02",
  decisionTimestamp:"2026-10-02T06:30:00.000Z",
  performanceEligible:true,
  priceSpace:"ADJUSTED",
  corporateActionState:"ADJUSTED",
  maturedHorizons:[1,3,5],
  horizonReturns:{D1:0.01,D3:0.025,D5:0.04,D10:null,D20:null},
  benchmarkReturns:{D1:0.005,D3:0.01,D5:0.015,D10:null,D20:null},
  industryReturns:{D1:0.004,D3:0.012,D5:0.02,D10:null,D20:null},
  relativeBenchmarkReturns:{D1:0.005,D3:0.015,D5:0.025,D10:null,D20:null},
  relativeIndustryReturns:{D1:0.006,D3:0.013,D5:0.02,D10:null,D20:null},
  mfe:0.07,
  mae:-0.03,
  costScenarios:{
    BASE_COST:{
      roundTripCostRate:0.004,
      horizonReturns:{D1:0.006,D3:0.021,D5:0.036,D10:null,D20:null},
      semantics:"SIGNAL_RETURN_MINUS_COST_SCENARIO_NOT_REALIZED_FILL_RETURN",
    },
  },
  simulatedExecution:null,
  updatedAt:"2026-10-09T08:30:00.000Z",
};
const outcome={...outcomeBase,outcomeHash:await sha256Hex(outcomeBase)};

const base={
  receiptId:"D18-ATTR-1",
  decisionSnapshot:decisionBase,
  regimeVector,
  outcomeSnapshot:outcome,
  horizon:5,
  costScenarioId:"BASE_COST",
  observedAt:"2026-10-09T08:31:00.000Z",
};

const a=await buildD18RegimeAttributionReceiptV0_1(base);
assert.equal(a.state,"MATURED");
assert.equal(a.strategyId,"SHORT_MOMENTUM");
assert.equal(a.strategyVersion,"V0.1-CONTRACT");
assert.equal(a.discreteRegimeLabels.trendContext,"UP_TREND_CONTEXT");
assert.equal(a.discreteRegimeLabels.volatilityDirection,"VOL_CONTRACTING");
assert.equal(a.rawRegimeContexts.breadthContext.reason,"U2B_PENDING");
assert(a.unknownRegimeDimensions.includes("sizeLeadership"));
assert.ok(Math.abs(a.metrics.stockReturn-0.04)<1e-12);
assert.ok(Math.abs(a.metrics.relativeBenchmarkReturn-0.025)<1e-12);
assert.ok(Math.abs(a.metrics.costScenario.horizonReturn-0.036)<1e-12);
assert.equal(a.attributionOnly,true);
assert.equal(a.regimeEvidenceValid,true);
assert.deepEqual(a.regimeEvidenceBlockers,[]);
assert.equal(a.policyValueEvaluated,false);
assert.equal(a.switchingRuleApplied,false);
assert.equal(a.selectionImpact,false);

const replay=await buildD18RegimeAttributionReceiptV0_1(base);
assert.equal(replay.receiptHash,a.receiptHash);

const immature=await buildD18RegimeAttributionReceiptV0_1({
  ...base,receiptId:"D18-ATTR-IMM",horizon:10,costScenarioId:null,
});
assert.equal(immature.state,"IMMATURE");
assert(immature.reasons.includes("REQUESTED_HORIZON_NOT_MATURED"));
assert.equal(immature.metrics,null);

const badPerformance=await buildD18RegimeAttributionReceiptV0_1({
  ...base,
  receiptId:"D18-ATTR-UNKNOWN",
  outcomeSnapshot:{...outcome,performanceEligible:false,corporateActionState:"UNKNOWN"},
});
assert.equal(badPerformance.state,"UNKNOWN");
assert(badPerformance.reasons.includes("OUTCOME_NOT_PERFORMANCE_ELIGIBLE"));

const missingCost=await buildD18RegimeAttributionReceiptV0_1({
  ...base,receiptId:"D18-ATTR-COST",costScenarioId:"MISSING",
});
assert.equal(missingCost.state,"UNKNOWN");
assert(missingCost.reasons.includes("REQUESTED_COST_SCENARIO_MISSING"));

await assert.rejects(
  ()=>buildD18RegimeAttributionReceiptV0_1({
    ...base,
    receiptId:"D18-ATTR-WRONG",
    outcomeSnapshot:{...outcome,decisionId:"D-OTHER"},
  }),
  /outcome decisionId mismatch/,
);

await assert.rejects(
  ()=>buildD18RegimeAttributionReceiptV0_1({
    ...base,
    receiptId:"D18-ATTR-CLOCK",
    regimeVector:{...regimeVector,decisionTimestamp:"2026-10-02T06:31:00.000Z"},
  }),
  /regime decisionTimestamp mismatch/,
);

const tamperedRegime={
  ...regimeVector,
  dimensions:{
    ...regimeVector.dimensions,
    trendContext:{
      ...regimeVector.dimensions.trendContext,
      value:"DOWN_TREND_CONTEXT",
    },
  },
};
const tamperedAttribution=await buildD18RegimeAttributionReceiptV0_1({
  ...base,
  receiptId:"D18-ATTR-TAMPERED",
  regimeVector:tamperedRegime,
});
assert.equal(tamperedAttribution.state,"UNKNOWN");
assert.equal(tamperedAttribution.metrics,null);
assert.equal(tamperedAttribution.regimeEvidenceValid,false);
assert(tamperedAttribution.reasons.includes("REGIME_VECTOR_EVIDENCE_INVALID"));
assert.equal(Object.keys(tamperedAttribution.discreteRegimeLabels).length,0);


const forgedClosedOutcomeBase={
  ...outcomeBase,
  simulatedExecution:{
    state:"CLOSED",realizedReturnAfterCost:0.92,holdingSessions:2,
    fillQuality:"FILLED",executionVersion:"S2-SYNTHETIC",
  },
};
const forgedClosedOutcome={
  ...forgedClosedOutcomeBase,
  outcomeHash:await sha256Hex(forgedClosedOutcomeBase),
};
const gatedClosed=await buildD18RegimeAttributionReceiptV0_1({
  ...base,receiptId:"D18-ATTR-UNCERTIFIED-CLOSED",
  outcomeSnapshot:forgedClosedOutcome,
});
assert.equal(gatedClosed.state,"MATURED");
assert.equal(gatedClosed.metrics.stockReturn,0.04);
assert.equal(gatedClosed.signalHorizonObservationOnly,true);
assert.equal(gatedClosed.metrics.simulatedExecution.realizedReturnAfterCost,null);
assert.equal(gatedClosed.metrics.simulatedExecution.executionDenominatorEligible,false);
assert.equal(gatedClosed.executionEvidenceGate.classification,"MODELED_CLOSED_NOT_CERTIFIED");
assert.equal(gatedClosed.certifiedExecutionReturn,null);
assert.equal(gatedClosed.certifiedSelectedToTriggeredDenominator,null);
assert.equal(gatedClosed.certifiedNoFillDenominator,null);

const callerClaimsProvenNoFillBase={
  ...outcomeBase,
  simulatedExecution:{
    state:"NO_FILL",proofCompleteNoFill:true,
    noFillDenominatorEligible:true,calendarProof:"VERIFIED",
    realizedReturnAfterCost:null,
  },
};
const callerClaimsProvenNoFill=await buildD18RegimeAttributionReceiptV0_1({
  ...base,receiptId:"D18-ATTR-UNVERIFIED-NOFILL",
  outcomeSnapshot:{...callerClaimsProvenNoFillBase,
    outcomeHash:await sha256Hex(callerClaimsProvenNoFillBase)},
});
assert.equal(callerClaimsProvenNoFill.executionEvidenceGate.classification,"NO_FILL_NOT_CERTIFIED");
assert.equal(callerClaimsProvenNoFill.executionEvidenceGate.noFillDenominatorEligible,false);
assert.equal(callerClaimsProvenNoFill.certifiedNoFillDenominator,null);
assert.match(callerClaimsProvenNoFill.attributionVersion,/V0_2/);

console.log("D18 regime attribution tests: PASS");
