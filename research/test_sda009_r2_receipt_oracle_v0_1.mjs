import assert from "node:assert/strict";
import { classifySda009Row, analyzeSda009Receipt } from "./sda009_r2_receipt_oracle_v0_1.mjs";

const base = {
  scanDate: "2026-10-06", candidateSymbol: "9999", candidateName: "測試",
  classificationSchemeId: "TWSE_FORMAL_INDUSTRY", membershipVersion: "v1",
  inclusiveSectorState: { hardGatePass: true, sectorScore: 70 },
  leaveOneOutSectorState: { hardGatePass: true, sectorScore: 70 },
  rawRank: 3, leaveOneOutDiagnosticRank: 3, rawTop6: true, leaveOneOutTop6: true,
  supportState: "SUPPORTED", replayTrust: "PASS"
};

assert.equal(classifySda009Row(base).primaryClassification, "NO_MATERIAL_SELF_EFFECT");
assert.equal(classifySda009Row({...base, leaveOneOutSectorState:{hardGatePass:true,sectorScore:60}}).primaryClassification, "SCORE_ONLY_SELF_EFFECT");
assert.equal(classifySda009Row({...base, leaveOneOutSectorState:{hardGatePass:false,sectorScore:60}}).primaryClassification, "GATE_FLIP");
assert.equal(classifySda009Row({...base, leaveOneOutDiagnosticRank:8, rawTop6:true, leaveOneOutTop6:true}).primaryClassification, "RANK_FLIP");
assert.equal(classifySda009Row({...base, leaveOneOutDiagnosticRank:8, rawTop6:true, leaveOneOutTop6:false}).primaryClassification, "TOP6_FLIP");
assert.equal(classifySda009Row({...base, supportState:"SMALL_N_SENSITIVE"}).primaryClassification, "SMALL_N_SENSITIVE");
assert.equal(classifySda009Row({...base, membershipVersion:null}).primaryClassification, "BLOCKED");
assert.equal(classifySda009Row({...base, leaveOneOutSectorState:{state:"UNKNOWN"}}).primaryClassification, "BLOCKED");
const score = classifySda009Row({...base, inclusiveSectorState:{hardGatePass:true,sectorScore:80}, leaveOneOutSectorState:{hardGatePass:true,sectorScore:50}});
assert.equal(score.sectorScoreDelta, 30);
assert.equal(score.priorityScoreDeltaFromSector, 4.2);
const report = analyzeSda009Receipt({scanDate:"2026-10-06",generationId:"g1",rows:[base,{...base,candidateSymbol:"8888",leaveOneOutDiagnosticRank:7,rawTop6:true,leaveOneOutTop6:false}]});
assert.equal(report.rowCount,2);
assert.equal(report.effectCounts.top6FlipN,1);
assert.equal(report.formalDecisionImpact,false);
console.log(JSON.stringify({result:"PASS", assertions:12, report}, null, 2));
