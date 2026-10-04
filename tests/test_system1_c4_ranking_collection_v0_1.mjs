import assert from 'node:assert/strict';
import {collectC4RankingRedundancyEvidence} from '../research/system1_c4_ranking_collection_v0_1.mjs';

const day='2026-10-05',decisionAt=day+'T08:00:00.000Z',generationId='C1:'+day+':c4-collector';
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),round=(x,d=1)=>Math.round(x*10**d)/10**d;
function qualified({symbol,pool='GENERAL',ord,setup,sector,inst,fund,rs,rr,bonus=0,consensusScore=0,selected=false}){
  const rsComponent=clamp(50+rs*2,0,100),rrComponent=clamp(rr*20,0,100);
  const pre=round(clamp(setup*.28+sector*.14+inst*.16+fund*.14+rsComponent*.14+rrComponent*.14,0,100),1);
  const post=round(clamp(pre+bonus,0,100),1);
  const rankInput={schemaVersion:'SYSTEM1_ZERO_PICK_COUNTERFACTUAL_RANK_INPUT_V0_1',scanDate:day,symbol,pool,
    captureGeneration:generationId,decisionAt,rankingTupleKnownAt:decisionAt,
    rankComparatorVersion:'PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30',preSortOrdinal:ord,
    postConsensusPriorityScore:post,rewardPerRisk:rr,marketConsensusScore:consensusScore,
    setupQuality:setup,sectorFlow:sector,relativeStrength:rs,
    decomposition:{preConsensusPriorityScore:pre,marketConsensusSources:bonus?3:0,marketConsensusBonus:bonus,
      institutionalScore:inst,fundamentalScore:fund,rsComponent,rrComponent,
      marketConsensusState:bonus?'EXACT_DATE_REFERENCE':'ABSENT_OR_WRONG_DATE_AT_DECISION',
      marketConsensusReferenceDate:bonus?day:null}};
  return {symbol,pricePool:pool,feature:{close:pool==='THOUSAND'?1000:100},derived:{},
    formalResult:{ok:true,selected,actualRankingTuple:{priorityScore:post,rewardPerRisk:rr,
      marketConsensusScore:consensusScore,setupQuality:setup,sectorFlow:round(sector,1),
      relativeStrength:round(rs,1),preSortOrdinal:ord}},
    zeroPickRankObservation:{rankInputStatus:'COMPLETE',actualFormalRank:false,rankInput}};
}
const rows=[
  qualified({symbol:'G1',ord:0,setup:100,sector:90.04,inst:90,fund:90,rs:10.04,rr:4,selected:true}),
  qualified({symbol:'G2',ord:1,setup:95,sector:85,inst:85,fund:85,rs:8,rr:3.5,selected:true}),
  qualified({symbol:'G3',ord:2,setup:90,sector:80,inst:80,fund:80,rs:6,rr:3,selected:true}),
  qualified({symbol:'G4',ord:3,setup:85,sector:80,inst:80,fund:80,rs:6,rr:3}),
  qualified({symbol:'K1',pool:'THOUSAND',ord:0,setup:92,sector:88,inst:88,fund:88,rs:9,rr:3.8,selected:true})
];
const marker={schemaVersion:'SYSTEM1_SHADOW_COHORT_CAPTURE_V0_1',
  rankComparatorVersion:'PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30',
  selectionRuleVersion:'FORMAL_UNCHANGED_FROM_V8_16_0'};
function pagesFor(input=rows,change={}){
  const header={generationId,sessionDate:day,decisionAt,effectiveRuntimeVersion:'8.17.0-shadow-cohort-membership',
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,shadowMembershipCapture:marker,...change};
  return [input.slice(0,3),input.slice(3)].map((part,i)=>({header:structuredClone(header),
    chunks:[{chunkIndex:i,rows:structuredClone(part)}]}));
}
const good=collectC4RankingRedundancyEvidence({pages:pagesFor()});
assert.equal(good.status,'VERIFIED');
assert.equal(good.qualifiedN,5);
assert.equal(good.selectedN,4);
assert.equal(good.audit.baselineSelectionParity,true);
assert.equal(good.audit.noCrossPoolFill,true);
assert.equal(good.audit.economicSuperiority,'UNKNOWN');
assert.equal(good.eligibleForInference,false);
assert.equal(good.historicalBackfillPerformed,false);
assert.equal(good.audit.tieBreakAblations.length,5);
assert.equal(good.audit.scoreAblations.length,7);

const corrupt=structuredClone(rows);corrupt[0].formalResult.actualRankingTuple.priorityScore+=.1;
const blocked=collectC4RankingRedundancyEvidence({pages:pagesFor(corrupt)});
assert.equal(blocked.status,'DATA_QUALITY_BLOCKED');
assert.match(blocked.error,/ACTUAL_COUNTERFACTUAL_TUPLE_DIVERGENCE_PRIORITYSCORE/);
assert.equal(blocked.eligibleForDecisionIncidence,false);

const incomplete=structuredClone(rows);incomplete[0].zeroPickRankObservation.rankInputStatus='INCOMPLETE';
incomplete[0].zeroPickRankObservation.rankInput=null;
assert.equal(collectC4RankingRedundancyEvidence({pages:pagesFor(incomplete)}).status,'DATA_QUALITY_BLOCKED');

const changed=pagesFor();changed[1].header.shadowMembershipCapture={...marker,selectionRuleVersion:'changed'};
assert.equal(collectC4RankingRedundancyEvidence({pages:changed}).status,'DATA_QUALITY_BLOCKED');

const legacy=pagesFor(rows,{effectiveRuntimeVersion:'8.16.0-zero-pick-prospective-capture',shadowMembershipCapture:null});
const old=collectC4RankingRedundancyEvidence({pages:legacy});
assert.equal(old.status,'LEGACY_NO_C4_RANKING_INPUT');
assert.equal(old.historicalBackfillPerformed,false);

const rejectedRows=[{symbol:'X',pricePool:'GENERAL',formalResult:{ok:false,selected:false}}];
const none=collectC4RankingRedundancyEvidence({pages:pagesFor(rejectedRows)});
assert.equal(none.status,'NO_QUALIFIED_RANKING_POPULATION');
assert.equal(none.qualifiedN,0);
assert.equal(none.eligibleForDecisionIncidence,false);

assert.equal(collectC4RankingRedundancyEvidence({pages:[]}).status,'DATA_QUALITY_BLOCKED');
console.log(JSON.stringify({ok:true,status:good.status,qualifiedN:good.qualifiedN,selectedN:good.selectedN,
  tieBreakAblations:good.audit.tieBreakAblations.length,scoreAblations:good.audit.scoreAblations.length,
  noNetwork:true,formalCoreImpact:false}));
