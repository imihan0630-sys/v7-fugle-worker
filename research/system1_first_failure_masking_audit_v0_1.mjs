import {FORMAL_GATE_ORDER} from './formal_gate_replay_v0_1.mjs';

export const FIRST_FAILURE_MASKING_V0_1=Object.freeze({
  schemaVersion:'SYSTEM1_FIRST_FAILURE_MASKING_AUDIT_V0_1',
  reasonMapVersion:'FORMAL_SCORECANDIDATE_REASON_MAP_V8_17_0',
  researchOnly:true,
  formalCoreLocked:true
});

export const FORMAL_REASON_TO_GATE_V0_1=Object.freeze({
  '股價低於10元':'PRICE_FLOOR',
  '歷史資料未滿60日':'HISTORY_60D',
  '缺真實大盤或同日期族群RS資料':'RS_CONTEXT',
  '缺市值資料':'MARKET_CAP_FLOOR',
  '市值低於10億':'MARKET_CAP_FLOOR',
  '單日走勢過度異常':'DAILY_ABNORMALITY',
  '20日流動性不足':'LIQUIDITY',
  '10至30億市值缺少強力特殊理由':'SMALL_CAP_SPECIAL',
  '30至100億市值流動性要求未達':'MID_CAP_LIQUIDITY',
  '缺集保持股集中度，不補假值':'CHIP_CONCENTRATION_PRESENT',
  '季度財報、估值或公告資料不足，不能通過精篩':'FINANCIAL_SOURCE_COMPLETENESS',
  '官方公告有重大風險事件，暫不列可進場候選':'ANNOUNCEMENT_RISK',
  '本益比明顯高於族群但成長未配合，估值風險過高':'VALUATION_RELATIVE_RISK',
  '產業廣度、漲幅或資金活躍度偏弱':'SECTOR_GATE',
  'A拉回承接/B突破後承接皆未形成候選':'AB_SETUP',
  '基本面資料不足，不能以中立分數假裝通過':'FUNDAMENTAL_COMPONENT_COUNT',
  '基本面品質明顯不足':'FUNDAMENTAL_QUALITY',
  '波動品質不合格':'ATR_QUALITY',
  '上方無可驗證實質壓力，無法計算真實RR':'TARGET_AVAILABLE',
  '預期RR低於2比1':'REWARD_RISK',
  '策略品質低於B級，不列入推薦':'FINAL_SIGNAL_GRADE'
});

const inc=(obj,k,n=1)=>obj[k]=(obj[k]||0)+n;
const round=(x,d=4)=>Math.round(x*10**d)/10**d;
const ratio=(n,d)=>d?round(n/d):null;
const failSet=o=>FORMAL_GATE_ORDER.filter(id=>o?.gates?.[id]?.status==='FAIL');

export function buildSystem1FirstFailureMaskingAudit(diagnosis){
  if(diagnosis?.schemaVersion!=='SYSTEM1_C1_ISOLATED_V0_1'||
     diagnosis?.researchOnly!==true||diagnosis?.decisionImpact!==false||diagnosis?.formalCoreImpact!==false||
     !Array.isArray(diagnosis?.observations))
    throw new Error('FIRST_FAILURE_C1_DIAGNOSIS_REQUIRED');

  const firstFailureCounts={},observedFailCounts={},hiddenFailCounts={},uniqueFailCounts={},coFailCounts={};
  const unmappedReasons={},rows=[];
  let formalRejectedN=0,mappedFirstFailureN=0,unmappedFirstFailureN=0,
      multiFailRejectedN=0,singleFailRejectedN=0,zeroObservedFailRejectedN=0,
      mappedGateMismatchN=0,totalHiddenObservedFails=0;

  for(const o of diagnosis.observations){
    if(o?.formalResult?.ok!==false)continue;
    formalRejectedN++;
    const reason=String(o.firstFailureReason||'');
    const firstGate=FORMAL_REASON_TO_GATE_V0_1[reason]||null;
    const fails=failSet(o);
    for(const g of fails)inc(observedFailCounts,g);
    if(fails.length===0)zeroObservedFailRejectedN++;
    if(fails.length===1){singleFailRejectedN++;inc(uniqueFailCounts,fails[0]);}
    if(fails.length>1){multiFailRejectedN++;for(const g of fails)inc(coFailCounts,g);}
    if(firstGate){
      mappedFirstFailureN++;inc(firstFailureCounts,firstGate);
      if(!fails.includes(firstGate))mappedGateMismatchN++;
    }else{
      unmappedFirstFailureN++;inc(unmappedReasons,reason||'EMPTY_REASON');
    }
    const hidden=fails.filter(g=>g!==firstGate);
    totalHiddenObservedFails+=hidden.length;
    for(const g of hidden)inc(hiddenFailCounts,g);
    rows.push({
      symbol:String(o.symbol),pool:o.pool||'UNKNOWN',
      firstFailureReason:reason||null,firstFailureGate:firstGate,
      observedFailSet:fails,observedFailN:fails.length,
      hiddenObservedFailSet:hidden,hiddenObservedFailN:hidden.length,
      firstFailureGateObservedFail:firstGate?fails.includes(firstGate):null
    });
  }

  const perGate={};
  for(const gate of FORMAL_GATE_ORDER){
    const observed=Number(observedFailCounts[gate]||0);
    const first=Number(firstFailureCounts[gate]||0);
    const hidden=Number(hiddenFailCounts[gate]||0);
    perGate[gate]={
      firstFailureN:first,
      observedFailN:observed,
      hiddenBehindOtherFirstFailureN:hidden,
      uniqueObservedFailN:Number(uniqueFailCounts[gate]||0),
      coFailObservedN:Number(coFailCounts[gate]||0),
      firstFailureCaptureRateAmongObservedFails:ratio(first,observed),
      hiddenRateAmongObservedFails:ratio(hidden,observed)
    };
  }

  return {
    schemaVersion:FIRST_FAILURE_MASKING_V0_1.schemaVersion,
    reasonMapVersion:FIRST_FAILURE_MASKING_V0_1.reasonMapVersion,
    sessionDate:diagnosis.sessionDate,
    formalRejectedN,mappedFirstFailureN,unmappedFirstFailureN,
    mappingCoverageRate:ratio(mappedFirstFailureN,formalRejectedN),
    multiFailRejectedN,singleFailRejectedN,zeroObservedFailRejectedN,
    multiFailRateAmongRejected:ratio(multiFailRejectedN,formalRejectedN),
    mappedGateMismatchN,totalHiddenObservedFails,
    firstFailureCounts,observedFailCounts,hiddenFailCounts,unmappedReasons,perGate,rows,
    interpretation:{
      firstFailureIsOrderDependent:true,
      observedFailIsNotMarginalContribution:true,
      hiddenFailDoesNotMeanCausalImportance:true,
      uniqueObservedFailIsNotRecoveredSelection:true,
      mappingMismatchBlocksAttributionTrust:mappedGateMismatchN>0,
      unmappedReasonRequiresReasonMapReview:unmappedFirstFailureN>0,
      noOutcomeUsed:true,
      noGateChange:true
    },
    attributionTrust:mappedGateMismatchN===0&&unmappedFirstFailureN===0?'MAPPING_COMPLETE':'MAPPING_REVIEW_REQUIRED',
    economicSuperiority:'UNKNOWN',formalOptimizationCandidate:'NONE',prospectiveEvidenceMature:false,
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,formalCoreLocked:true,
    noPlanChanges:true,noTrade:true,noPush:true
  };
}
