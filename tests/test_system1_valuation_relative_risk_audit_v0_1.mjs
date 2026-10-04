import assert from 'node:assert/strict';
import {buildSystem1ValuationRelativeRiskAudit as audit} from '../research/system1_valuation_relative_risk_audit_v0_1.mjs';

const base={sessionDate:'2026-10-05',generationId:'C1:g',decisionAt:'2026-10-05T08:00:00Z',researchOnly:true,decisionImpact:false,formalCoreImpact:false};
const before=['PRICE_FLOOR','HISTORY_60D','RS_CONTEXT','MARKET_CAP_FLOOR','DAILY_ABNORMALITY','LIQUIDITY','SMALL_CAP_SPECIAL','MID_CAP_LIQUIDITY','CHIP_CONCENTRATION_PRESENT','FINANCIAL_SOURCE_COMPLETENESS','ANNOUNCEMENT_RISK'];
const after=['SECTOR_GATE','AB_SETUP','FUNDAMENTAL_COMPONENT_COUNT','FUNDAMENTAL_QUALITY','ATR_QUALITY','TARGET_AVAILABLE','REWARD_RISK','FINAL_SIGNAL_GRADE'];
function expected(pe,sector,rev,eps){
  if(pe===null||pe<=0)return 'NOT_EVALUABLE';
  if(sector===null||sector<=0)return 'UNKNOWN';
  const ratio=pe/sector;
  if(ratio>2.5&&(rev===null||eps===null))return 'UNKNOWN';
  return ratio>2.5&&!((rev!==null&&rev>25)||(eps!==null&&eps>25))?'FAIL':'PASS';
}
const mk=(symbol,{pe,sector=10,rev=10,eps=10,reach='PASS',first=null,nextFail=null,pool='GENERAL',mcap=50}={})=>{
  const gates=Object.fromEntries(before.map(id=>[id,{status:reach}]));
  gates.VALUATION_RELATIVE_RISK={status:expected(pe,sector,rev,eps)};
  for(const id of after)gates[id]={status:id===nextFail?'FAIL':'PASS'};
  return {
    raw:{symbol,pricePool:pool,feature:{close:pool==='THOUSAND'?1200:100,marketCapYi:mcap,
      priceEarningsRatio:pe,sectorMedianPe:sector,revenueQuarterYoY:rev,epsYoY:eps,valuationObserved:true,financialBasis:true}},
    obs:{symbol,pool,firstFailureReason:first,formalResult:{ok:false},gates}
  };
};
const cases=[
  mk('FAIL',{pe:40,sector:10,rev:10,eps:10,first:'本益比明顯高於族群但成長未配合，估值風險過高',nextFail:'SECTOR_GATE'}),
  mk('WITHIN',{pe:20,sector:10,rev:10,eps:10}),
  mk('REV',{pe:30,sector:10,rev:30,eps:10}),
  mk('EPS',{pe:30,sector:10,rev:10,eps:30}),
  mk('BOTH',{pe:30,sector:10,rev:30,eps:30,pool:'THOUSAND',mcap:200}),
  mk('GROWTH_UNKNOWN',{pe:30,sector:10,rev:null,eps:10}),
  mk('SECTOR_UNKNOWN',{pe:30,sector:null,rev:10,eps:10}),
  mk('NO_PE',{pe:0,sector:10,rev:10,eps:10}),
  mk('EARLY_FAIL',{pe:40,sector:10,rev:10,eps:10,reach:'FAIL',first:'20日流動性不足'})
];
const adapted={...base,rows:cases.map(x=>x.raw)};
const diagnosis={...base,schemaVersion:'SYSTEM1_C1_ISOLATED_V0_1',observations:cases.map(x=>x.obs)};
const ff={perGate:{VALUATION_RELATIVE_RISK:{firstFailureN:1,observedFailN:2,hiddenBehindOtherFirstFailureN:1}}};
const x=audit({adapted,diagnosis,firstFailureMasking:ff});
assert.equal(x.populationN,9);
assert.equal(x.upstreamReachN,8);
assert.equal(x.upstreamFailN,1);
assert.equal(x.reached.states.FAIL_HIGH_RELATIVE_PE_NO_GROWTH,1);
assert.equal(x.reached.states.PASS_WITHIN_RELATIVE_PE_MULTIPLE,1);
assert.equal(x.reached.states.PASS_HIGH_GROWTH_EXCEPTION,3);
assert.equal(x.reached.states.HIGH_RELATIVE_PE_GROWTH_CONTEXT_MISSING,1);
assert.equal(x.reached.states.MISSING_POSITIVE_SECTOR_MEDIAN_PE,1);
assert.equal(x.reached.states.NO_POSITIVE_TTM_PE,1);
assert.equal(x.highGrowthExceptionControl.revenueOnlyN,1);
assert.equal(x.highGrowthExceptionControl.epsOnlyN,1);
assert.equal(x.highGrowthExceptionControl.bothN,1);
assert.equal(x.failedGateCohort.singleGateReplay.counts.NEXT_OBSERVED_FAIL,1);
assert.equal(x.failedGateCohort.singleGateReplay.nextGateCounts.SECTOR_GATE,1);
assert.equal(x.sourceProvenance.promotionGradeOutcomeJoin,false);
assert.equal(x.sourceProvenance.blocker,'VALUATION_SOURCE_ASOF_AND_VINTAGE_NOT_FROZEN_IN_C1');
assert.equal(x.observerParityMismatchN,0);
assert.equal(x.evidenceTrust,'VALUATION_GATE_PARITY_VERIFIED');
assert.equal(x.economicSuperiority,'UNKNOWN');
assert.equal(x.formalOptimizationCandidate,'NONE');

const bad=structuredClone(diagnosis);
bad.observations[0].gates.VALUATION_RELATIVE_RISK.status='PASS';
const y=audit({adapted,diagnosis:bad});
assert.equal(y.observerParityMismatchN,1);
assert.equal(y.evidenceTrust,'DATA_QUALITY_BLOCKED');
assert.throws(()=>audit({adapted:{...adapted,researchOnly:false},diagnosis}),/VALUATION_RISK_C1_DIAGNOSIS_REQUIRED/);

console.log(JSON.stringify({ok:true,reach:x.upstreamReachN,fail:x.failedGateCohort.n,
  highGrowthExceptions:x.highGrowthExceptionControl.n,sourceVintageReady:x.sourceProvenance.immutableSourceVintageCaptured,
  formalCoreImpact:false}));
