import assert from 'node:assert/strict';
import {buildSystem1LiquidityRejectedControlEvidence as build} from '../research/system1_liquidity_rejected_control_v0_1.mjs';

const parent={
  schemaVersion:'SYSTEM1_SHADOW_COHORT_MEMBERSHIP_V0_1',
  scanDate:'2026-10-05',captureGeneration:'C1:g',parentContentDigest:'a'.repeat(64),
  firstFailureCounts:{
    'GENERAL|20日流動性不足':5,'THOUSAND|20日流動性不足':2,
    'GENERAL|10至30億市值缺少強力特殊理由':3,'THOUSAND|10至30億市值缺少強力特殊理由':0,
    'GENERAL|30至100億市值流動性要求未達':4,'THOUSAND|30至100億市值流動性要求未達':1
  },
  expectedCounts:{
    'GENERAL|LIQ_LOW_AVG_VOLUME_REJECTED':2,'THOUSAND|LIQ_LOW_AVG_VOLUME_REJECTED':1,
    'GENERAL|LIQ_SMALLCAP_SPECIAL_REASON_REJECTED':2,
    'GENERAL|LIQ_MIDCAP_EXTRA_REQUIREMENT_REJECTED':2,'THOUSAND|LIQ_MIDCAP_EXTRA_REQUIREMENT_REJECTED':1,
    'GENERAL|LIQ_LOW_VOLUME_EXCEPTION_PASS':1,
    'GENERAL|INDEPENDENT_BROAD_MARKET_CONTROL':2,'THOUSAND|INDEPENDENT_BROAD_MARKET_CONTROL':1,
    'GENERAL|RESIDUAL_CONTROL':1,'THOUSAND|RESIDUAL_CONTROL':1
  },
  frameCounts:[
    {membershipType:'LIQ_LOW_AVG_VOLUME_REJECTED',stratum:'GENERAL',semanticPopulationCount:5,sampledCount:2},
    {membershipType:'LIQ_LOW_AVG_VOLUME_REJECTED',stratum:'THOUSAND',semanticPopulationCount:2,sampledCount:1},
    {membershipType:'LIQ_SMALLCAP_SPECIAL_REASON_REJECTED',stratum:'GENERAL',semanticPopulationCount:3,sampledCount:2},
    {membershipType:'LIQ_MIDCAP_EXTRA_REQUIREMENT_REJECTED',stratum:'GENERAL',semanticPopulationCount:4,sampledCount:2},
    {membershipType:'LIQ_MIDCAP_EXTRA_REQUIREMENT_REJECTED',stratum:'THOUSAND',semanticPopulationCount:1,sampledCount:1},
    {membershipType:'LIQ_LOW_VOLUME_EXCEPTION_PASS',stratum:'GENERAL',semanticPopulationCount:2,sampledCount:1},
    {membershipType:'INDEPENDENT_BROAD_MARKET_CONTROL',stratum:'GENERAL',semanticPopulationCount:20,sampledCount:2},
    {membershipType:'INDEPENDENT_BROAD_MARKET_CONTROL',stratum:'THOUSAND',semanticPopulationCount:8,sampledCount:1},
    {membershipType:'RESIDUAL_CONTROL',stratum:'GENERAL',semanticPopulationCount:10,sampledCount:1},
    {membershipType:'RESIDUAL_CONTROL',stratum:'THOUSAND',semanticPopulationCount:4,sampledCount:1}
  ]
};
const liq=(avg,min=1000,pass=false)=>({minLots:min,avgVolume20Lots:avg,liquidityExceptionPass:pass,fullFormalCounterfactual:false});
let n=0;
const m=(type,pool,reason,l,frameCount,sampledCount)=>({
  symbol:'S'+(++n),membershipType:type,pool,firstFailureReason:reason,
  samplingFraction:sampledCount/frameCount,frameCount,sampleCount:sampledCount,
  liquidity:l,fullFormalCounterfactual:false,researchOnly:true,decisionImpact:false,formalCoreImpact:false
});
const memberships=[
  m('LIQ_LOW_AVG_VOLUME_REJECTED','GENERAL','20日流動性不足',liq(400),5,2),
  m('LIQ_LOW_AVG_VOLUME_REJECTED','GENERAL','20日流動性不足',liq(500),5,2),
  m('LIQ_LOW_AVG_VOLUME_REJECTED','THOUSAND','20日流動性不足',liq(100,300),2,1),
  m('LIQ_SMALLCAP_SPECIAL_REASON_REJECTED','GENERAL','10至30億市值缺少強力特殊理由',liq(1200),3,2),
  m('LIQ_SMALLCAP_SPECIAL_REASON_REJECTED','GENERAL','10至30億市值缺少強力特殊理由',liq(1300),3,2),
  m('LIQ_MIDCAP_EXTRA_REQUIREMENT_REJECTED','GENERAL','30至100億市值流動性要求未達',liq(1100),4,2),
  m('LIQ_MIDCAP_EXTRA_REQUIREMENT_REJECTED','GENERAL','30至100億市值流動性要求未達',liq(1150),4,2),
  m('LIQ_MIDCAP_EXTRA_REQUIREMENT_REJECTED','THOUSAND','30至100億市值流動性要求未達',liq(330,300),1,1),
  m('LIQ_LOW_VOLUME_EXCEPTION_PASS','GENERAL',null,liq(700,1000,true),2,1),
  m('INDEPENDENT_BROAD_MARKET_CONTROL','GENERAL',null,liq(1500),20,2),
  m('INDEPENDENT_BROAD_MARKET_CONTROL','GENERAL',null,liq(1600),20,2),
  m('INDEPENDENT_BROAD_MARKET_CONTROL','THOUSAND',null,liq(500,300),8,1),
  m('RESIDUAL_CONTROL','GENERAL',null,liq(1700),10,1),
  m('RESIDUAL_CONTROL','THOUSAND',null,liq(600,300),4,1)
];
const quality=[
  {overlayId:1,symbol:memberships[0].symbol,membershipType:memberships[0].membershipType,state:'VALID'},
  {overlayId:2,symbol:memberships[0].symbol,membershipType:memberships[0].membershipType,state:'SOURCE_QUALITY_BLOCKED'}
];
const shadow={status:'VERIFIED',parent,memberships,quality,captureIntegrity:'HEALTHY',
  researchOnly:true,decisionImpact:false,formalCoreImpact:false};
const x=build(shadow);
assert.equal(x.status,'VERIFIED_SELECTION_TIME');
assert.equal(x.selectionTimeEvidenceComplete,true);
assert.equal(x.rejected.LIQ_LOW_AVG_VOLUME_REJECTED.populationN,7);
assert.equal(x.rejected.LIQ_LOW_AVG_VOLUME_REJECTED.sampledN,3);
assert.equal(x.rejected.LIQ_SMALLCAP_SPECIAL_REASON_REJECTED.populationN,3);
assert.equal(x.rejected.LIQ_MIDCAP_EXTRA_REQUIREMENT_REJECTED.populationN,5);
assert.equal(x.controls.LIQ_LOW_VOLUME_EXCEPTION_PASS.populationN,2);
assert.equal(x.controls.INDEPENDENT_BROAD_MARKET_CONTROL.populationN,28);
assert.equal(x.overlaps.lowAvgVsBroad.length,0);
assert.equal(x.qualityEligibility,'QUALITY_PENDING_OR_BLOCKED');
assert.equal(x.focalQuality.blockedN,1);
assert.equal(x.eligibleForOutcomeJoin,false);
assert.equal(x.outcomeState,'NOT_JOINED');
assert.equal(x.economicSuperiority,'UNKNOWN');
assert.equal(x.formalOptimizationCandidate,'NONE');

// Sampling/denominator conflict must block.
const bad=structuredClone(shadow);
bad.parent.firstFailureCounts['GENERAL|20日流動性不足']=6;
assert.equal(build(bad).status,'DATA_QUALITY_BLOCKED');

// Primary low-volume reject may never also be broad-control sampled.
const contam=structuredClone(shadow);
contam.memberships.push({...contam.memberships[0],membershipType:'INDEPENDENT_BROAD_MARKET_CONTROL'});
contam.parent.expectedCounts['GENERAL|INDEPENDENT_BROAD_MARKET_CONTROL']=3;
const frame=contam.parent.frameCounts.find(x=>x.membershipType==='INDEPENDENT_BROAD_MARKET_CONTROL'&&x.stratum==='GENERAL');
frame.sampledCount=3;
assert.equal(build(contam).status,'DATA_QUALITY_BLOCKED');

// Parent failure is isolated and does not throw.
assert.equal(build({status:'DATA_QUALITY_BLOCKED'}).status,'PARENT_NOT_VERIFIED');

console.log(JSON.stringify({ok:true,status:x.status,lowAvgPopulation:x.rejected.LIQ_LOW_AVG_VOLUME_REJECTED.populationN,
  smallCapPopulation:x.rejected.LIQ_SMALLCAP_SPECIAL_REASON_REJECTED.populationN,
  midCapPopulation:x.rejected.LIQ_MIDCAP_EXTRA_REQUIREMENT_REJECTED.populationN,
  qualityEligibility:x.qualityEligibility,formalCoreImpact:false}));
