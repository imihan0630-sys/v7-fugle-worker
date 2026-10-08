import assert from "node:assert/strict";
import { sha256Hex } from "../runtime/decision_archive.mjs";
import { buildD18StrategyDependencePanelV0_1 } from "../runtime/d18_strategy_dependence_panel_v0_1.mjs";

async function attr({id,strategy,date,value,symbol="2330",state="QUALIFIED_NOT_SELECTED"}) {
  const base={
    state:"KNOWN",
    regimeEvidenceValid:true,
    regimeEvidenceBlockers:[],
    semantics:"DESCRIPTIVE_REGIME_ATTRIBUTION_NOT_POLICY_VALUE",
    policyValueEstimated:false,
    causalClaimMade:false,
    horizon:5,
    strategyId:strategy,
    strategyVersion:"V1",
    decisionId:id,
    symbol,
    marketDate:date,
    candidateState:state,
    grossReturn:value,
    relativeBenchmarkReturn:value-0.01,
  };
  return {...base,receiptHash:await sha256Hex(base)};
}

const rows=[
  await attr({id:"A1",strategy:"A",date:"2026-10-01",value:0.04,symbol:"2330"}),
  await attr({id:"A2",strategy:"A",date:"2026-10-01",value:0.02,symbol:"2317"}),
  await attr({id:"B1",strategy:"B",date:"2026-10-01",value:0.01}),
  await attr({id:"A3",strategy:"A",date:"2026-10-02",value:-0.02}),
  await attr({id:"A4",strategy:"A",date:"2026-10-03",value:0.03}),
  await attr({id:"B3",strategy:"B",date:"2026-10-03",value:0.04}),
];

const input={
  panelId:"P1",
  horizon:5,
  metric:"GROSS_RETURN",
  expectedStrategies:[
    {strategyId:"A",strategyVersion:"V1"},
    {strategyId:"B",strategyVersion:"V1"},
  ],
  includedCandidateStates:["QUALIFIED_NOT_SELECTED"],
  attributionObservations:rows,
  createdAt:"2026-10-10T00:00:00Z",
};
const out=await buildD18StrategyDependencePanelV0_1(input);
assert.equal(out.independentDateCount,3);
assert.equal(out.dateRows[0].cells["A@V1"].value,0.03);
assert.equal(out.dateRows[0].cells["A@V1"].decisionCount,2);
assert.equal(out.dateRows[1].cells["B@V1"].state,"MISSING");
assert.equal(out.dateRows[1].cells["B@V1"].value,null);
assert.equal(out.missingReturnImputedAsZero,false);
assert.equal(out.pairwise[0].commonDateCount,2);
assert.deepEqual(out.pairwise[0].commonDates,["2026-10-01","2026-10-03"]);
assert.equal(out.pairwise[0].correlationEstimated,false);
assert.equal(out.ensembleWeightsEstimated,false);
assert.equal(out.diversificationClaimMade,false);

const replay=await buildD18StrategyDependencePanelV0_1(input);
assert.equal(replay.panelHash,out.panelHash);

await assert.rejects(
  ()=>buildD18StrategyDependencePanelV0_1({
    ...input,
    attributionObservations:[...rows,{...rows[0]}],
  }),
  /duplicate decisionId/,
);

await assert.rejects(
  ()=>buildD18StrategyDependencePanelV0_1({
    ...input,
    attributionObservations:[{...rows[0],horizon:10}],
  }),
  /mixed attribution horizons/,
);

const contaminated=await buildD18StrategyDependencePanelV0_1({
  ...input,
  panelId:"P-CONTAMINATED",
  attributionObservations:[
    ...rows.filter((x)=>x.decisionId!=="B1"),
    {
      ...rows.find((x)=>x.decisionId==="B1"),
      state:"UNKNOWN",
      regimeEvidenceValid:false,
      regimeEvidenceBlockers:["REGIME_VECTOR_EVIDENCE_INVALID"],
    },
  ],
});
assert.equal(contaminated.excludedRegimeEvidenceCount,1);
assert.equal(contaminated.dateRows[0].cells["B@V1"].state,"MISSING");
assert.equal(contaminated.dateRows[0].cells["B@V1"].reason,"REGIME_EVIDENCE_UNKNOWN_OR_INVALID");
assert.equal(contaminated.dateRows[0].cells["B@V1"].value,null);
assert.deepEqual(
  contaminated.dateRows[0].cells["B@V1"].regimeEvidenceBlockers,
  ["REGIME_VECTOR_EVIDENCE_INVALID"],
);
assert.equal(contaminated.pairwise[0].commonDateCount,1);
assert.deepEqual(contaminated.pairwise[0].commonDates,["2026-10-03"]);

console.log("D18 strategy dependence panel tests: PASS");
