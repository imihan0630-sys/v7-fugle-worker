import assert from 'node:assert/strict';
import {buildSystem1C4RankingRedundancyAudit} from '../research/system1_c4_ranking_redundancy_v0_1.mjs';
import {buildSystem1C4SaturationCarryoverAudit as saturation} from '../research/system1_c4_saturation_carryover_v0_1.mjs';

const day='2026-10-05',decisionAt=day+'T08:00:00.000Z',generationId='C1:'+day+':sat-fixture';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),round=(x,d=1)=>Math.round(x*10**d)/10**d;
function row({symbol,pool='GENERAL',ord,setup=80,sector=80,inst=80,fund=80,rs=0,rr=3,sources=0,selected=false}){
  const rsComponent=clamp(50+rs*2,0,100),rrComponent=clamp(rr*20,0,100);
  const bonus=sources<2?0:Math.min(7,(sources-1)*2),consensus=sources<2?0:Math.min(100,20+sources*15);
  const pre=round(clamp(setup*.28+sector*.14+inst*.16+fund*.14+rsComponent*.14+rrComponent*.14,0,100),1);
  const post=round(clamp(pre+bonus,0,100),1);
  const tuple={priorityScore:post,rewardPerRisk:rr,marketConsensusScore:consensus,setupQuality:setup,
    sectorFlow:round(sector,1),relativeStrength:round(rs,1),preSortOrdinal:ord};
  const rankInput={schemaVersion:'SYSTEM1_ZERO_PICK_COUNTERFACTUAL_RANK_INPUT_V0_1',scanDate:day,symbol,pool,
    captureGeneration:generationId,decisionAt,rankingTupleKnownAt:decisionAt,
    rankComparatorVersion:'PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30',preSortOrdinal:ord,
    postConsensusPriorityScore:post,rewardPerRisk:rr,marketConsensusScore:consensus,setupQuality:setup,
    sectorFlow:sector,relativeStrength:rs,
    decomposition:{preConsensusPriorityScore:pre,marketConsensusSources:sources,marketConsensusBonus:bonus,
      institutionalScore:inst,fundamentalScore:fund,rsComponent,rrComponent,
      marketConsensusState:sources?'EXACT_DATE_REFERENCE':'ABSENT_OR_WRONG_DATE_AT_DECISION',
      marketConsensusReferenceDate:sources?day:null}};
  return {symbol,pricePool:pool,formalResult:{ok:true,selected,actualRankingTuple:tuple},
    zeroPickRankObservation:{rankInputStatus:'COMPLETE',actualFormalRank:false,rankInput}};
}
function receipt(rows){
  return {sessionDate:day,generationId,decisionAt,rows,researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    shadowMembershipCapture:{rankComparatorVersion:'PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30',
      selectionRuleVersion:'FORMAL_UNCHANGED_FROM_V8_16_0'}};
}

// RR saturation: same PriorityScore because RR component is already capped; raw RR decides 3rd/4th.
const rrRows=[
  row({symbol:'R1',ord:0,setup:100,sector:100,inst:100,fund:100,rs:25,rr:8,selected:true}),
  row({symbol:'R2',ord:1,setup:95,sector:95,inst:95,fund:95,rs:20,rr:7,selected:true}),
  row({symbol:'R3',ord:2,setup:80,sector:80,inst:80,fund:80,rs:0,rr:6,selected:true}),
  row({symbol:'R4',ord:3,setup:80,sector:80,inst:80,fund:80,rs:0,rr:5})
];
let rrReceipt=receipt(rrRows),rrBase=buildSystem1C4RankingRedundancyAudit(rrReceipt),a=saturation(rrReceipt,{baseAudit:rrBase});
assert.equal(a.rr.saturatedN,4);
assert.equal(a.rr.rawRrDifferentiatedPairs>=1,true);
assert.equal(a.cutline.GENERAL.decidingKey,'rewardPerRisk');
assert.equal(a.cutline.GENERAL.rrSaturationCarryover,true);

// RS saturation: all earlier comparator fields equal; raw RS >25 breaks the cutline after score saturation.
const rsRows=[
  row({symbol:'S1',pool:'THOUSAND',ord:0,setup:100,sector:100,inst:100,fund:100,rs:30,rr:5,selected:true}),
  row({symbol:'S2',pool:'THOUSAND',ord:1,setup:90,sector:90,inst:90,fund:90,rs:25,rr:5,selected:true}),
  row({symbol:'S3',pool:'THOUSAND',ord:2,setup:80,sector:80,inst:80,fund:80,rs:30,rr:5,selected:true}),
  row({symbol:'S4',pool:'THOUSAND',ord:3,setup:80,sector:80,inst:80,fund:80,rs:25,rr:5})
];
let rsReceipt=receipt(rsRows),rsBase=buildSystem1C4RankingRedundancyAudit(rsReceipt),b=saturation(rsReceipt,{baseAudit:rsBase});
assert.equal(b.rs.highSaturatedN,4);
assert.equal(b.rs.rawRsDifferentiatedPairs>=1,true);
assert.equal(b.cutline.THOUSAND.decidingKey,'relativeStrength');
assert.equal(b.cutline.THOUSAND.rsSaturationCarryover,true);

// Consensus saturation: +7 bonus is identical at sourceCount 5 and 6, score ties, consensusScore 100 beats 95.
const cRows=[
  row({symbol:'C1',ord:0,setup:100,sector:100,inst:100,fund:100,rs:25,rr:5,sources:6,selected:true}),
  row({symbol:'C2',ord:1,setup:90,sector:90,inst:90,fund:90,rs:10,rr:5,sources:6,selected:true}),
  row({symbol:'C3',ord:2,setup:80,sector:80,inst:80,fund:80,rs:0,rr:4,sources:6,selected:true}),
  row({symbol:'C4',ord:3,setup:80,sector:80,inst:80,fund:80,rs:0,rr:4,sources:5})
];
let cReceipt=receipt(cRows),cBase=buildSystem1C4RankingRedundancyAudit(cReceipt),c=saturation(cReceipt,{baseAudit:cBase});
assert.equal(c.consensus.saturatedN,4);
assert.equal(c.consensus.sourceCount5N,1);
assert.equal(c.consensus.sourceCount6PlusN,3);
assert.equal(c.consensus.consensusScoreDifferentiatedPairs>=1,true);
assert.equal(c.cutline.GENERAL.decidingKey,'marketConsensusScore');
assert.equal(c.cutline.GENERAL.consensusSaturationCarryover,true);

assert.equal(a.economicSuperiority,'UNKNOWN');
assert.equal(a.formalOptimizationCandidate,'NONE');
assert.equal(a.interpretation.noOutcomeUsed,true);

const bad=structuredClone(rrReceipt);
bad.rows[0].zeroPickRankObservation.rankInput.decomposition.rrComponent=99;
assert.throws(()=>saturation(bad),/RR_COMPONENT_MAPPING|PRECONSENSUS_REBUILD_MISMATCH/);

console.log(JSON.stringify({ok:true,
  rrCarryPairs:a.rr.rawRrDifferentiatedPairs,
  rsCarryPairs:b.rs.rawRsDifferentiatedPairs,
  consensusCarryPairs:c.consensus.consensusScoreDifferentiatedPairs,
  formalCoreImpact:false}));
