import assert from 'node:assert/strict';
import {buildSystem1C4RankingRedundancyAudit} from '../research/system1_c4_ranking_redundancy_v0_1.mjs';
import {buildSystem1C4PriorityRoundingCollisionAudit as audit} from '../research/system1_c4_priority_rounding_collision_v0_1.mjs';

const day='2026-10-05',decisionAt=day+'T08:00:00.000Z',generationId='C1:'+day+':rounding-fixture';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),round=(x,d=1)=>Math.round(x*10**d)/10**d;
function row({symbol,pool='GENERAL',ord,setup=80,sector=80,inst=80,fund=80,rs=0,rr=3,sources=0,selected=false}){
  const rsComponent=clamp(50+rs*2,0,100),rrComponent=clamp(rr*20,0,100);
  const bonus=sources<2?0:Math.min(7,(sources-1)*2),consensus=sources<2?0:Math.min(100,20+sources*15);
  const rawPre=clamp(setup*.28+sector*.14+inst*.16+fund*.14+rsComponent*.14+rrComponent*.14,0,100);
  const pre=round(rawPre,1),post=round(clamp(pre+bonus,0,100),1);
  const t={priorityScore:post,rewardPerRisk:rr,marketConsensusScore:consensus,setupQuality:setup,
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
  return {symbol,pricePool:pool,formalResult:{ok:true,selected,actualRankingTuple:t},
    zeroPickRankObservation:{rankInputStatus:'COMPLETE',actualFormalRank:false,rankInput}};
}
function receipt(rows){
  return {sessionDate:day,generationId,decisionAt,rows,researchOnly:true,decisionImpact:false,formalCoreImpact:false,
    shadowMembershipCapture:{rankComparatorVersion:'PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30',
      selectionRuleVersion:'FORMAL_UNCHANGED_FROM_V8_16_0'}};
}

// H1/H2 dominate. A has slightly higher full-precision priority from institutional score;
// B has slightly lower full-precision priority but higher RR. Both deploy at 73.0 after 0.1 rounding.
// Formal later comparator selects B; full-precision priority selects A.
const rows=[
  row({symbol:'H1',ord:0,setup:100,sector:100,inst:100,fund:100,rs:25,rr:5,selected:true}),
  row({symbol:'H2',ord:1,setup:95,sector:95,inst:95,fund:95,rs:20,rr:5,selected:true}),
  row({symbol:'B',ord:2,setup:80,sector:80,inst:80,fund:80,rs:0,rr:3.01,selected:true}),
  row({symbol:'A',ord:3,setup:80,sector:80,inst:80.3,fund:80,rs:0,rr:3})
];
const r=receipt(rows),base=buildSystem1C4RankingRedundancyAudit(r),x=audit(r,{baseAudit:base});
assert.equal(base.decisionIncidence.cutline.GENERAL.decidingKey,'rewardPerRisk');
assert.equal(x.collisions.collisionPairN>=1,true);
assert.equal(x.collisions.laterComparatorReversalN>=1,true);
assert.equal(x.cutline.GENERAL.roundingCollision,true);
assert.equal(x.cutline.GENERAL.fullPrecisionDirection,'REVERSES_DEPLOYED_SELECTED');
assert.equal(x.fullPrecisionCounterfactual.selectedMembershipChangedN,2);
assert.deepEqual(x.fullPrecisionCounterfactual.perPool.GENERAL.fullPrecision,['H1','H2','A']);
assert.ok(x.precision.maxAbsPreConsensusRoundingError<=0.0500000001);
assert.equal(x.interpretation.capCompressionExcludedFromPrecisionCollisionPairs,true);
assert.equal(x.economicSuperiority,'UNKNOWN');
assert.equal(x.formalOptimizationCandidate,'NONE');

// Same rounded tie where later comparator agrees with the higher full-precision score.
const agreeRows=[
  row({symbol:'G1',ord:0,setup:100,sector:100,inst:100,fund:100,rs:25,rr:5,selected:true}),
  row({symbol:'G2',ord:1,setup:95,sector:95,inst:95,fund:95,rs:20,rr:5,selected:true}),
  row({symbol:'C',ord:2,setup:80.1,sector:80,inst:80,fund:80,rs:0,rr:3,selected:true}),
  row({symbol:'D',ord:3,setup:80,sector:80,inst:80,fund:80,rs:0,rr:3})
];
const y=audit(receipt(agreeRows));
assert.equal(y.collisions.laterComparatorAgreementN>=1,true);
assert.equal(y.cutline.GENERAL.roundingCollision,true);
assert.equal(y.cutline.GENERAL.fullPrecisionDirection,'CONFIRMS_DEPLOYED_SELECTED');

// Priority=100 clamp is excluded from precision-collision pairs.
const capRows=[
  row({symbol:'P1',ord:0,setup:100,sector:100,inst:100,fund:100,rs:25,rr:5,sources:6,selected:true}),
  row({symbol:'P2',ord:1,setup:99.9,sector:100,inst:100,fund:100,rs:25,rr:5,sources:6,selected:true})
];
const z=audit(receipt(capRows));
assert.equal(z.precision.postPriorityCapN,2);
assert.equal(z.collisions.collisionPairN,0);

const bad=structuredClone(r);
bad.rows[2].zeroPickRankObservation.rankInput.decomposition.preConsensusPriorityScore+=.1;
assert.throws(()=>audit(bad),/PRECONSENSUS_REBUILD_MISMATCH/);

console.log(JSON.stringify({ok:true,collisionPairs:x.collisions.collisionPairN,
  reversals:x.collisions.laterComparatorReversalN,
  selectedMembershipChangedN:x.fullPrecisionCounterfactual.selectedMembershipChangedN,
  formalCoreImpact:false}));
