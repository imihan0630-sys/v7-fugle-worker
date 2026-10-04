import assert from 'node:assert/strict';
import {buildSystem1C4RankingRedundancyAudit} from '../research/system1_c4_ranking_redundancy_v0_1.mjs';

const day='2026-10-05',decisionAt='2026-10-05T08:00:00.000Z',gen='C1:g';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));const round=(x,d=1)=>Math.round(x*10**d)/10**d;
function row({symbol,pool='GENERAL',ord,setup,sector,inst,fund,rs,rr,bonus=0,consensusScore=0,selected=false}){
 const rsComp=clamp(50+rs*2,0,100),rrComp=clamp(rr*20,0,100);
 const pre=round(clamp(setup*.28+sector*.14+inst*.16+fund*.14+rsComp*.14+rrComp*.14,0,100),1);
 const post=round(clamp(pre+bonus,0,100),1);
 const tuple={priorityScore:post,rewardPerRisk:rr,marketConsensusScore:consensusScore,setupQuality:setup,sectorFlow:round(sector,1),relativeStrength:round(rs,1),preSortOrdinal:ord};
 const rankInput={schemaVersion:'SYSTEM1_ZERO_PICK_COUNTERFACTUAL_RANK_INPUT_V0_1',scanDate:day,symbol,pool,captureGeneration:gen,decisionAt,
   rankingTupleKnownAt:decisionAt,rankComparatorVersion:'PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30',preSortOrdinal:ord,
   postConsensusPriorityScore:post,rewardPerRisk:rr,marketConsensusScore:consensusScore,setupQuality:setup,sectorFlow:sector,relativeStrength:rs,
   decomposition:{preConsensusPriorityScore:pre,marketConsensusSources:bonus?3:0,marketConsensusBonus:bonus,institutionalScore:inst,fundamentalScore:fund,rsComponent:rsComp,rrComponent:rrComp,marketConsensusState:bonus?'EXACT_DATE_REFERENCE':'ABSENT_OR_WRONG_DATE_AT_DECISION',marketConsensusReferenceDate:bonus?day:null}};
 return {symbol,pricePool:pool,formalResult:{ok:true,selected,actualRankingTuple:tuple},zeroPickRankObservation:{rankInputStatus:'COMPLETE',actualFormalRank:false,rankInput}};
}
function receipt(rows){return {sessionDate:day,decisionAt,generationId:gen,rows,researchOnly:true,decisionImpact:false,formalCoreImpact:false,
 shadowMembershipCapture:{rankComparatorVersion:'PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30',selectionRuleVersion:'FORMAL_UNCHANGED_FROM_V8_16_0'}};}

const baseRows=[
 row({symbol:'A',ord:0,setup:100,sector:70,inst:70,fund:70,rs:5,rr:3,selected:true}),
 row({symbol:'B',ord:1,setup:90,sector:70,inst:60,fund:60,rs:5,rr:3,bonus:2,consensusScore:65,selected:true}),
 row({symbol:'C',ord:2,setup:80,sector:80,inst:70,fund:70,rs:10,rr:4,selected:true}),
 row({symbol:'D',ord:3,setup:65,sector:75,inst:75,fund:75,rs:10,rr:3}),
 row({symbol:'T1',pool:'THOUSAND',ord:0,setup:90,sector:90,inst:90,fund:90,rs:15,rr:4,selected:true}),
 row({symbol:'T2',pool:'THOUSAND',ord:1,setup:85,sector:85,inst:85,fund:85,rs:10,rr:3.5,selected:true}),
 row({symbol:'T3',pool:'THOUSAND',ord:2,setup:80,sector:80,inst:80,fund:80,rs:5,rr:3,selected:true}),
 row({symbol:'T4',pool:'THOUSAND',ord:3,setup:79,sector:80,inst:80,fund:80,rs:5,rr:3})
];
let a=buildSystem1C4RankingRedundancyAudit(receipt(baseRows));
assert.equal(a.baselineSelectionParity,true);
assert.equal(a.selectedN,6);
assert.equal(a.noCrossPoolFill,true);
assert.equal(a.economicSuperiority,'UNKNOWN');
assert.equal(a.formalOptimizationCandidate,'NONE');
assert.equal(a.interpretation.noOutcomeUsed,true);
assert.equal(a.scoreAblations.find(x=>x.name==='REMOVE_SETUP_SCORE_COMPONENT').selectedMembershipChangedN>0,true);
assert.equal(a.scoreAblations.every(x=>x.renormalized===false),true);
assert.ok(a.decisionIncidence.cutline.GENERAL.decidingKey);

const tieRows=[
 row({symbol:'H1',ord:0,setup:100,sector:100,inst:100,fund:100,rs:20,rr:4,selected:true}),
 row({symbol:'H2',ord:1,setup:95,sector:95,inst:95,fund:95,rs:15,rr:4,selected:true}),
 row({symbol:'X',ord:2,setup:80,sector:80,inst:80,fund:80,rs:0,rr:3,bonus:7,consensusScore:95,selected:true}),
 row({symbol:'Y',ord:3,setup:90,sector:80,inst:80,fund:80,rs:0,rr:2,bonus:7,consensusScore:100})
];
let b=buildSystem1C4RankingRedundancyAudit(receipt(tieRows));
assert.equal(b.decisionIncidence.cutline.GENERAL.decidingKey,'rewardPerRisk');
const dropRr=b.tieBreakAblations.find(x=>x.name==='DROP_RR_TIEBREAK');
assert.equal(dropRr.selectedMembershipChangedN,2);
assert.deepEqual(dropRr.perPool.GENERAL.variant,['H1','H2','Y']);
assert.equal(b.tieBreakAblations.find(x=>x.name==='DROP_RS_TIEBREAK').selectedMembershipChangedN,0);

const poolRows=[
 row({symbol:'G1',ord:0,setup:100,sector:90,inst:90,fund:90,rs:10,rr:4,selected:true}),
 row({symbol:'G2',ord:1,setup:95,sector:90,inst:90,fund:90,rs:10,rr:4,selected:true}),
 row({symbol:'G3',ord:2,setup:90,sector:90,inst:90,fund:90,rs:10,rr:4,selected:true}),
 row({symbol:'G4',ord:3,setup:85,sector:90,inst:90,fund:90,rs:10,rr:4}),
 row({symbol:'K1',pool:'THOUSAND',ord:0,setup:90,sector:90,inst:90,fund:90,rs:10,rr:4,selected:true})
];
let c=buildSystem1C4RankingRedundancyAudit(receipt(poolRows));
assert.deepEqual(c.baselineSelectedSymbols.sort(),['G1','G2','G3','K1'].sort());


// Raw decomposition inputs may carry more precision than the one-decimal deployed comparator fields.
const roundingRows=[
 row({symbol:'R1',ord:0,setup:91.25,sector:80.04,inst:77.3,fund:66.2,rs:3.27,rr:3.14,selected:true}),
 row({symbol:'R2',ord:1,setup:88.15,sector:79.96,inst:76.1,fund:65.7,rs:2.84,rr:3.05,selected:true})
];
let roundingAudit=buildSystem1C4RankingRedundancyAudit(receipt(roundingRows));
assert.equal(roundingAudit.baselineSelectionParity,true);
assert.equal(roundingAudit.qualifiedN,2);

const bad=structuredClone(receipt(baseRows));bad.rows[0].formalResult.actualRankingTuple.priorityScore+=0.1;
assert.throws(()=>buildSystem1C4RankingRedundancyAudit(bad),/ACTUAL_COUNTERFACTUAL_TUPLE_DIVERGENCE_PRIORITYSCORE/);
const bad2=structuredClone(receipt(baseRows));bad2.rows[0].zeroPickRankObservation.rankInputStatus='INCOMPLETE';bad2.rows[0].zeroPickRankObservation.rankInput=null;
assert.throws(()=>buildSystem1C4RankingRedundancyAudit(bad2),/COMPLETE_COUNTERFACTUAL_DECOMPOSITION_REQUIRED/);
const bad3=structuredClone(receipt(baseRows));bad3.rows[0].formalResult.selected=false;
assert.throws(()=>buildSystem1C4RankingRedundancyAudit(bad3),/BASELINE_SELECTION_PARITY_FAILED/);

console.log(JSON.stringify({ok:true,assertions:'PASS',schema:a.schemaVersion,qualifiedN:a.qualifiedN,selectedN:a.selectedN,
 scoreAblations:a.scoreAblations.map(x=>[x.name,x.selectedMembershipChangedN]),formalCoreImpact:a.formalCoreImpact}));
