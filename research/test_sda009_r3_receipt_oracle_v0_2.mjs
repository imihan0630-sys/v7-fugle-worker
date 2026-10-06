import assert from "node:assert/strict";
import { classifySda009RowV02, analyzeSda009ReceiptV02 } from "./sda009_r3_receipt_oracle_v0_2.mjs";

const base = {
  scanDate:"2026-10-06",
  generationId:"g1",
  candidateSymbol:"9999",
  classificationSchemeId:"TWSE_FORMAL_INDUSTRY",
  membershipVersion:"v1",
  poolId:"GENERAL",
  replayTrust:"PASS",
  supportState:"SUPPORTED",
  inclusiveSectorState:{hardGatePass:true,sectorScore:70},
  leaveOneOutLocalState:{hardGatePass:true,sectorScore:70},
  leaveOneOutSectorState:{hardGatePass:true,sectorScore:70},
  rawPoolRank:2,
  leaveOneOutPoolRank:2,
  rawPoolTop3:true,
  leaveOneOutPoolTop3:true,
  rawPriorityScore:80,
  leaveOneOutPriorityScore:80,
  rawAllocationNTD:50000,
  leaveOneOutAllocationNTD:50000,
  peerAllocationDeltasNTD:[0,0],
  rawRemainingCashNTD:100000,
  leaveOneOutRemainingCashNTD:100000
};

assert.equal(classifySda009RowV02(base).primaryClassification,"NO_MATERIAL_SELF_EFFECT");

const decomp = classifySda009RowV02({
  ...base,
  inclusiveSectorState:{hardGatePass:true,sectorScore:80},
  leaveOneOutLocalState:{hardGatePass:true,sectorScore:60},
  leaveOneOutSectorState:{hardGatePass:true,sectorScore:55}
});
assert.equal(decomp.attribution.localSelfContribution,20);
assert.equal(decomp.attribution.maxNormalizerExternality,5);

assert.equal(classifySda009RowV02({
  ...base,
  leaveOneOutSectorState:{hardGatePass:false,sectorScore:60}
}).directionState,"SELF_PROMOTION");

assert.equal(classifySda009RowV02({
  ...base,
  inclusiveSectorState:{hardGatePass:false,sectorScore:60},
  leaveOneOutSectorState:{hardGatePass:true,sectorScore:70}
}).directionState,"SELF_SUPPRESSION");

assert.equal(classifySda009RowV02({
  ...base,
  rawPoolTop3:true,
  leaveOneOutPoolTop3:false,
  leaveOneOutPoolRank:4,
  rankComparatorAttribution:"priorityScore"
}).primaryClassification,"POOL_SEAT_FLIP");

assert.equal(classifySda009RowV02({
  ...base,
  rawPoolRank:2,
  leaveOneOutPoolRank:3
}).primaryClassification,"BLOCKED");

assert.equal(classifySda009RowV02({
  ...base,
  rawPoolRank:2,
  leaveOneOutPoolRank:3,
  rankComparatorAttribution:"priorityScore"
}).primaryClassification,"RANK_FLIP");

assert.equal(classifySda009RowV02({
  ...base,
  rawAllocationNTD:52000,
  leaveOneOutAllocationNTD:50000
}).primaryClassification,"ALLOCATION_SPILLOVER");

assert.equal(classifySda009RowV02({
  ...base,
  rawAllocationNTD:50000,
  leaveOneOutAllocationNTD:50000,
  peerAllocationDeltasNTD:[-2000,1000]
}).primaryClassification,"ALLOCATION_SPILLOVER");

assert.equal(classifySda009RowV02({
  ...base,
  supportState:"SMALL_N_SENSITIVE"
}).primaryClassification,"SMALL_N_SENSITIVE");

assert.equal(classifySda009RowV02({
  ...base,
  membershipVersion:null
}).primaryClassification,"BLOCKED");

const mix = classifySda009RowV02({
  ...base,
  inclusiveSectorState:{hardGatePass:true,sectorScore:60},
  leaveOneOutLocalState:{hardGatePass:false,sectorScore:70},
  leaveOneOutSectorState:{hardGatePass:false,sectorScore:70},
  rawAllocationNTD:48000,
  leaveOneOutAllocationNTD:50000
});
assert.equal(mix.directionState,"MIXED");

const report=analyzeSda009ReceiptV02({
  scanDate:"2026-10-06",
  generationId:"g1",
  rows:[
    base,
    {
      ...base,
      candidateSymbol:"8888",
      poolId:"THOUSAND",
      rawPoolTop3:true,
      leaveOneOutPoolTop3:false,
      leaveOneOutPoolRank:4,
      rankComparatorAttribution:"priorityScore"
    }
  ]
});
assert.equal(report.byPool.GENERAL.rows,1);
assert.equal(report.byPool.THOUSAND.seatFlips,1);
assert.equal(report.formalDecisionImpact,false);

console.log(JSON.stringify({
  result:"PASS",
  assertions:16,
  summary:{counts:report.counts,directions:report.directions,byPool:report.byPool}
},null,2));
