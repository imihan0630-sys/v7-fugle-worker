export const GATE_STATE=Object.freeze({
  PASS:"PASS",FAIL:"FAIL",UNKNOWN:"UNKNOWN",NOT_EVALUABLE:"NOT_EVALUABLE"
});

function finite(value){
  if(value===null||value===undefined||value==="") return null;
  const n=Number(value);
  return Number.isFinite(n)?n:null;
}
function bool(value){return value===true||value===false?value:null;}
function formalTruthyEvidence(value){
  if(value===null||value===undefined||value==="") return null;
  return Boolean(value);
}
function result(status,reason=null,details={}){return {status,reason,...details};}
function observedNumber(value,label){
  const n=finite(value);
  return n===null?result(GATE_STATE.UNKNOWN,"MISSING_"+label):{value:n};
}

export function observeFormalGateOverlap({
  feature={},sector={},derived={},formalResult=null,
  rules={}
}={}){
  const cfg={
    minClose:10,
    minRewardRisk:2,
    signalGradeBMin:65,
    generalMinLots:1000,
    thousandMinLots:300,
    ...rules
  };
  const gates={};
  const close=finite(feature.close);
  gates.PRICE_FLOOR=close===null
    ? result(GATE_STATE.UNKNOWN,"MISSING_CLOSE")
    : result(close>=cfg.minClose?GATE_STATE.PASS:GATE_STATE.FAIL,null,{value:close,threshold:cfg.minClose});

  const historyDays=finite(feature.historyDays);
  gates.HISTORY_60D=historyDays===null
    ? result(GATE_STATE.UNKNOWN,"MISSING_HISTORY_DAYS")
    : result(historyDays>=60?GATE_STATE.PASS:GATE_STATE.FAIL,null,{value:historyDays,threshold:60});

  const marketReturn20=finite(feature.marketReturn20),sectorReturn20=finite(feature.sectorReturn20);
  gates.RS_CONTEXT=marketReturn20===null||sectorReturn20===null
    ? result(GATE_STATE.UNKNOWN,"MISSING_MARKET_OR_SECTOR_RETURN20")
    : result(GATE_STATE.PASS,null,{marketReturn20,sectorReturn20});

  const marketCapYi=finite(feature.marketCapYi);
  gates.MARKET_CAP_FLOOR=marketCapYi===null
    ? result(GATE_STATE.UNKNOWN,"MISSING_MARKET_CAP")
    : result(marketCapYi>=10?GATE_STATE.PASS:GATE_STATE.FAIL,null,{value:marketCapYi,threshold:10});

  const changePct=finite(feature.changePercent);
  gates.DAILY_ABNORMALITY=changePct===null
    ? result(GATE_STATE.UNKNOWN,"MISSING_CHANGE_PERCENT")
    : result(Math.abs(changePct)<9.8?GATE_STATE.PASS:GATE_STATE.FAIL,null,{value:changePct,absoluteThreshold:9.8});

  const minLots=close!==null&&close>=1000?cfg.thousandMinLots:cfg.generalMinLots;
  const avgLots=finite(feature.avgVolume20Lots);
  let liquidityExceptionState="NOT_NEEDED";
  if(avgLots===null){
    gates.LIQUIDITY=result(GATE_STATE.UNKNOWN,"MISSING_AVG_VOLUME20");
  }else if(avgLots>=minLots){
    gates.LIQUIDITY=result(GATE_STATE.PASS,null,{avgVolume20Lots:avgLots,minLots,liquidityExceptionState});
  }else{
    const avgAmount20=finite(feature.avgAmount20),spread=finite(feature.spreadPercent);
    const depthBool=bool(feature.orderBookDepthGood),depthScore=finite(feature.depthScore);
    if(avgAmount20===null||spread===null||(depthBool===null&&depthScore===null)){
      liquidityExceptionState="UNKNOWN";
      gates.LIQUIDITY=result(GATE_STATE.UNKNOWN,"LIQUIDITY_EXCEPTION_INPUT_MISSING",{avgVolume20Lots:avgLots,minLots});
    }else{
      const goodDepth=depthBool===true||(depthScore!==null&&depthScore>=80);
      const exception=avgAmount20>=50000000&&spread<=0.5&&goodDepth;
      liquidityExceptionState=exception?"PASS":"FAIL";
      gates.LIQUIDITY=result(exception?GATE_STATE.PASS:GATE_STATE.FAIL,null,{avgVolume20Lots:avgLots,minLots,avgAmount20,spreadPercent:spread,goodDepth,liquidityExceptionState});
    }
  }

  const instScore=finite(derived.institutionalScore);
  if(marketCapYi===null){
    gates.SMALL_CAP_SPECIAL=result(GATE_STATE.UNKNOWN,"MISSING_MARKET_CAP");
  }else if(marketCapYi<10){
    gates.SMALL_CAP_SPECIAL=result(GATE_STATE.NOT_EVALUABLE,"MARKET_CAP_FLOOR_NOT_PASSED");
  }else if(marketCapYi>=30){
    gates.SMALL_CAP_SPECIAL=result(GATE_STATE.PASS,"NOT_APPLICABLE_CAP_GTE_30");
  }else if(avgLots===null||instScore===null){
    gates.SMALL_CAP_SPECIAL=result(GATE_STATE.UNKNOWN,"MISSING_VOLUME_OR_INSTITUTIONAL_SCORE");
  }else{
    gates.SMALL_CAP_SPECIAL=result(avgLots>=minLots*1.5&&instScore>=70?GATE_STATE.PASS:GATE_STATE.FAIL,null,{avgVolume20Lots:avgLots,requiredLots:minLots*1.5,institutionalScore:instScore,requiredInstitutionalScore:70});
  }

  if(marketCapYi===null){
    gates.MID_CAP_LIQUIDITY=result(GATE_STATE.UNKNOWN,"MISSING_MARKET_CAP");
  }else if(marketCapYi>=100){
    gates.MID_CAP_LIQUIDITY=result(GATE_STATE.PASS,"NOT_APPLICABLE_CAP_GTE_100");
  }else if(avgLots===null){
    gates.MID_CAP_LIQUIDITY=result(GATE_STATE.UNKNOWN,"MISSING_AVG_VOLUME20");
  }else if(avgLots>=minLots*1.2){
    gates.MID_CAP_LIQUIDITY=result(GATE_STATE.PASS,null,{avgVolume20Lots:avgLots,requiredLots:minLots*1.2});
  }else if(liquidityExceptionState==="PASS"){
    gates.MID_CAP_LIQUIDITY=result(GATE_STATE.PASS,"LIQUIDITY_EXCEPTION");
  }else if(liquidityExceptionState==="UNKNOWN"){
    gates.MID_CAP_LIQUIDITY=result(GATE_STATE.UNKNOWN,"LIQUIDITY_EXCEPTION_UNKNOWN");
  }else{
    gates.MID_CAP_LIQUIDITY=result(GATE_STATE.FAIL,null,{avgVolume20Lots:avgLots,requiredLots:minLots*1.2});
  }

  const concentration=finite(feature.chipConcentration);
  gates.CHIP_CONCENTRATION_PRESENT=concentration===null
    ? result(GATE_STATE.UNKNOWN,"MISSING_CHIP_CONCENTRATION")
    : result(GATE_STATE.PASS,null,{value:concentration});

  const financialFields={
    quarterRevenue:finite(feature.quarterRevenue),
    financialBasis:formalTruthyEvidence(feature.financialBasis),
    revenueQoQ:finite(feature.revenueQoQ),
    revenueQuarterYoY:finite(feature.revenueQuarterYoY),
    valuationObserved:bool(feature.valuationObserved),
    priceBookRatio:finite(feature.priceBookRatio),
    announcementsVerified:bool(feature.announcementsVerified)
  };
  const financialKnown=financialFields.quarterRevenue!==null&&financialFields.financialBasis!==null&&
    financialFields.revenueQoQ!==null&&financialFields.revenueQuarterYoY!==null&&
    financialFields.valuationObserved!==null&&financialFields.priceBookRatio!==null&&
    financialFields.announcementsVerified!==null;
  gates.FINANCIAL_SOURCE_COMPLETENESS=!financialKnown
    ? result(GATE_STATE.UNKNOWN,"FINANCIAL_COMPLETENESS_INPUT_MISSING")
    : (financialFields.financialBasis!==true||financialFields.valuationObserved!==true||financialFields.announcementsVerified!==true
      ? result(GATE_STATE.UNKNOWN,"SOURCE_COMPLETENESS_NOT_PROVEN",financialFields)
      : result(financialFields.quarterRevenue>0?GATE_STATE.PASS:GATE_STATE.FAIL,null,financialFields));

  const announcementsVerified=bool(feature.announcementsVerified);
  if(announcementsVerified!==true){
    gates.ANNOUNCEMENT_RISK=result(GATE_STATE.UNKNOWN,"ANNOUNCEMENT_SOURCE_NOT_VERIFIED");
  }else{
    // Canonical Formal semantics: a verified announcement source with no per-symbol array means zero
    // matching announcements for that symbol in the validated snapshot, because scoreCandidate uses
    // (f.officialAnnouncements || []).
    const announcements=Array.isArray(feature.officialAnnouncements)?feature.officialAnnouncements:[];
    const risky=announcements.some(item=>/停止交易|重大損失|重整|退票|財報不實/.test(String(item?.title||"")));
    gates.ANNOUNCEMENT_RISK=result(risky?GATE_STATE.FAIL:GATE_STATE.PASS,null,{risky,announcementCount:announcements.length});
  }

  const pe=finite(feature.priceEarningsRatio),sectorMedianPe=finite(feature.sectorMedianPe);
  if(pe===null||pe<=0){
    gates.VALUATION_RELATIVE_RISK=result(GATE_STATE.NOT_EVALUABLE,"NO_POSITIVE_TTM_PE");
  }else if(sectorMedianPe===null||sectorMedianPe<=0){
    gates.VALUATION_RELATIVE_RISK=result(GATE_STATE.UNKNOWN,"MISSING_POSITIVE_SECTOR_MEDIAN_PE");
  }else{
    const revQ=finite(feature.revenueQuarterYoY),epsYoY=finite(feature.epsYoY);
    if(revQ===null){
      // Formal cannot legitimately reach this gate with missing revenueQuarterYoY because
      // FINANCIAL_SOURCE_COMPLETENESS is ordered earlier. Keep the research observer fail-closed.
      gates.VALUATION_RELATIVE_RISK=result(GATE_STATE.UNKNOWN,"UPSTREAM_REVENUE_GROWTH_MISSING",{pe,sectorMedianPe,epsYoY});
    }else{
      // Exact Formal semantics: epsYoY may legitimately be null. In JavaScript, null > 25 is false,
      // so missing EPS YoY does NOT make the deployed veto unknown. Revenue growth can still earn
      // the >25 exception; otherwise a >2.5x relative PE row is rejected.
      const revenueGrowthException=revQ>25;
      const epsGrowthException=epsYoY!==null&&epsYoY>25;
      const highGrowth=revenueGrowthException||epsGrowthException;
      const fail=pe/sectorMedianPe>2.5&&!highGrowth;
      gates.VALUATION_RELATIVE_RISK=result(fail?GATE_STATE.FAIL:GATE_STATE.PASS,null,{
        pe,sectorMedianPe,revenueQuarterYoY:revQ,epsYoY,
        revenueGrowthException,epsGrowthException,
        epsGrowthEvidenceObserved:epsYoY!==null,
        formalMissingEpsActsAsNoException:epsYoY===null
      });
    }
  }

  const breadth=finite(sector.breadth),avgChange=finite(sector.avgChange),amountVs20=finite(sector.amountVs20DayAverage);
  gates.SECTOR_GATE=breadth===null||avgChange===null||amountVs20===null
    ? result(GATE_STATE.UNKNOWN,"SECTOR_GATE_INPUT_MISSING")
    : result(breadth>=40&&avgChange>=-1&&amountVs20>=0.5?GATE_STATE.PASS:GATE_STATE.FAIL,null,{breadth,avgChange,amountVs20DayAverage:amountVs20});

  const setup=derived.setupState;
  const aPass=bool(setup?.A?.pass),bPass=bool(setup?.B?.pass);
  gates.AB_SETUP=aPass===null||bPass===null
    ? result(GATE_STATE.UNKNOWN,"SETUP_STATE_MISSING")
    : result(aPass||bPass?GATE_STATE.PASS:GATE_STATE.FAIL,null,{A:aPass,B:bPass});

  const fundamentalCount=finite(derived.fundamentalCount);
  gates.FUNDAMENTAL_COMPONENT_COUNT=fundamentalCount===null
    ? result(GATE_STATE.UNKNOWN,"FUNDAMENTAL_COUNT_MISSING")
    : result(fundamentalCount>=3?GATE_STATE.PASS:GATE_STATE.FAIL,null,{value:fundamentalCount,threshold:3});

  const fundamentalScore=finite(derived.fundamentalScore);
  if(fundamentalCount!==null&&fundamentalCount<3){
    gates.FUNDAMENTAL_QUALITY=result(GATE_STATE.NOT_EVALUABLE,"INSUFFICIENT_COMPONENT_COUNT");
  }else if(fundamentalCount===null||fundamentalScore===null){
    gates.FUNDAMENTAL_QUALITY=result(GATE_STATE.UNKNOWN,"FUNDAMENTAL_SCORE_OR_COUNT_MISSING");
  }else{
    gates.FUNDAMENTAL_QUALITY=result(fundamentalScore>=25?GATE_STATE.PASS:GATE_STATE.FAIL,null,{value:fundamentalScore,threshold:25});
  }

  const atr=finite(feature.atrPercent);
  gates.ATR_QUALITY=atr===null
    ? result(GATE_STATE.UNKNOWN,"MISSING_ATR_PERCENT")
    : result(atr>=1&&atr<=10?GATE_STATE.PASS:GATE_STATE.FAIL,null,{value:atr,min:1,max:10});

  const targetState=String(derived.targetState||"UNKNOWN");
  if(gates.AB_SETUP.status===GATE_STATE.FAIL){
    gates.TARGET_AVAILABLE=result(GATE_STATE.NOT_EVALUABLE,"NO_FORMAL_CHANNEL");
  }else if(gates.AB_SETUP.status===GATE_STATE.UNKNOWN){
    gates.TARGET_AVAILABLE=result(GATE_STATE.UNKNOWN,"SETUP_STATE_UNKNOWN");
  }else if(targetState==="FOUND"){
    gates.TARGET_AVAILABLE=result(GATE_STATE.PASS,null,{target:finite(derived.target)});
  }else if(targetState==="NONE"){
    gates.TARGET_AVAILABLE=result(GATE_STATE.FAIL,"NO_VERIFIABLE_RESISTANCE");
  }else{
    gates.TARGET_AVAILABLE=result(GATE_STATE.UNKNOWN,"TARGET_EVALUATION_NOT_CAPTURED");
  }

  const rr=finite(derived.rewardPerRisk);
  if(gates.TARGET_AVAILABLE.status===GATE_STATE.FAIL||gates.TARGET_AVAILABLE.status===GATE_STATE.NOT_EVALUABLE){
    gates.REWARD_RISK=result(GATE_STATE.NOT_EVALUABLE,"TARGET_NOT_AVAILABLE");
  }else if(gates.TARGET_AVAILABLE.status===GATE_STATE.UNKNOWN||rr===null){
    gates.REWARD_RISK=result(GATE_STATE.UNKNOWN,"RR_INPUT_OR_TARGET_STATE_UNKNOWN");
  }else{
    gates.REWARD_RISK=result(rr>=cfg.minRewardRisk?GATE_STATE.PASS:GATE_STATE.FAIL,null,{value:rr,threshold:cfg.minRewardRisk});
  }

  const setupQuality=finite(derived.setupQuality);
  if(gates.REWARD_RISK.status===GATE_STATE.FAIL||gates.REWARD_RISK.status===GATE_STATE.NOT_EVALUABLE){
    gates.FINAL_SIGNAL_GRADE=result(GATE_STATE.NOT_EVALUABLE,"RR_NOT_PASSED");
  }else if(gates.REWARD_RISK.status===GATE_STATE.UNKNOWN||setupQuality===null){
    gates.FINAL_SIGNAL_GRADE=result(GATE_STATE.UNKNOWN,"SETUP_QUALITY_OR_RR_UNKNOWN");
  }else{
    gates.FINAL_SIGNAL_GRADE=result(setupQuality>=cfg.signalGradeBMin?GATE_STATE.PASS:GATE_STATE.FAIL,null,{value:setupQuality,threshold:cfg.signalGradeBMin});
  }

  const counts=Object.values(gates).reduce((acc,row)=>{
    acc[row.status]=(acc[row.status]||0)+1;
    return acc;
  },{PASS:0,FAIL:0,UNKNOWN:0,NOT_EVALUABLE:0});

  return {
    schemaVersion:"formal-gate-overlap-observer-v0.1",
    rulesVersion:"FORMAL_GATES_OBSERVER_V0_1",
    gates,
    counts,
    formalResult:{
      ok:formalResult?.ok===true,
      firstFailure:formalResult?.ok===true?null:String(formalResult?.reason||""),
      basePassed:formalResult?.basePassed===true,
      rrPassed:formalResult?.rrPassed===true
    },
    policy:"Missing provenance is UNKNOWN, conditional gates with failed prerequisites are NOT_EVALUABLE, and no overlap state changes the original Formal result.",
    researchOnly:true,
    decisionImpact:false,
    formalCoreImpact:false
  };
}
