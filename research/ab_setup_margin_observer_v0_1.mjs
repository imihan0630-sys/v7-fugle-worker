const A_ORDER=Object.freeze(["trend","pullback","nearSupport","volume","structure","notLate"]);
const B_ORDER=Object.freeze(["trend","breakout","volume","strongClose","upperShadow","notLate"]);

function num(v){
  if(v===null||v===undefined||v==="") return null;
  const n=Number(v);
  return Number.isFinite(n)?n:null;
}
function margin(a,b){return Number.isFinite(a)&&Number.isFinite(b)?a-b:null;}

function chooseDailySupportWithSource(f){
  const close=num(f?.close);
  const raw=[
    ["ma10",num(f?.ma10)],
    ["ma20",num(f?.ma20)],
    ["rightLow",num(f?.rightLow)],
    ["recentLow5Prev",num(f?.recentLow5Prev)]
  ];
  const eligible=raw.filter(([,level])=>Number.isFinite(level)&&level>0&&close!==null&&level<=close*1.015&&level>=close*0.82);
  if(eligible.length){
    const support=Math.max(...eligible.map(([,level])=>level));
    const sources=eligible.filter(([,level])=>Math.abs(level-support)<=1e-12).map(([name])=>name);
    return {support,sources,mode:"FILTERED_CANDIDATE",sourceAmbiguous:sources.length>1};
  }
  const fallback=num(f?.ma20);
  return {support:fallback,sources:["ma20"],mode:"MA20_FALLBACK",sourceAmbiguous:false};
}
function chooseDailySupport(f){return chooseDailySupportWithSource(f).support;}

function derivedMaDistance20Pct(f){
  const close=num(f?.close),ma20=num(f?.ma20);
  return close!==null&&ma20!==null&&ma20>0?(close/ma20-1)*100:null;
}

function derivedLateStage(f){
  const ret20=num(f?.ret20);
  const maDistance20Pct=derivedMaDistance20Pct(f);
  return (ret20??0)>35 || (maDistance20Pct??0)>25;
}

function exactState(f){
  const supportMeta=chooseDailySupportWithSource(f);
  const support=supportMeta.support;
  const close=num(f?.close);
  const recentHigh=Math.max(num(f?.recentHigh10)||0,num(f?.priorHigh20)||0);
  const pullbackPct=recentHigh>0&&close!==null?(recentHigh-close)/recentHigh*100:null;
  const supportDistancePct=support>0&&close!==null?Math.abs(close-support)/support*100:null;

  const ma20=num(f?.ma20),ma60=num(f?.ma60),prevMa20=num(f?.prevMa20),ma10=num(f?.ma10);
  const volumeToday=num(f?.volumeTodayVsPrev5);
  const volumeContraction=num(f?.volumeContraction5to20);
  const priorLow20=num(f?.priorLow20);
  const todayLow=num(f?.todayLow);
  const priorHigh20=num(f?.priorHigh20);
  const dailyClosePosition=num(f?.dailyClosePosition);
  const dailyUpperShadowRatio=num(f?.dailyUpperShadowRatio);
  const ret20=num(f?.ret20);

  // Mirror current Formal JavaScript truthiness semantics, including 0 -> fallback.
  const aVolumeTodayEffective=volumeToday||999;
  const aVolumeContractionEffective=volumeContraction||999;
  const bVolumeEffective=volumeToday||0;
  const bClosePositionEffective=dailyClosePosition||0;
  const bUpperShadowEffective=dailyUpperShadowRatio||0;
  const bRet20Effective=ret20||0;

  const trendA=(ma20??0)>0 && (ma60??0)>0 &&
    ma20>=ma60*0.995 && close!==null && close>=ma20*0.97 &&
    prevMa20!==null && prevMa20<=ma20*1.005;
  const pullbackOK=pullbackPct!==null&&pullbackPct>=2&&pullbackPct<=15;
  const nearSupport=supportDistancePct!==null&&supportDistancePct<=4;
  const volumeA=aVolumeTodayEffective<=1.05 || aVolumeContractionEffective<=0.95;
  const structureA=close!==null && close>=(support??0)*0.985 && (todayLow??0)>=(priorLow20||0);
  const notLate=f?.lateStage!==true;

  const trendB=(ma20??0)>0 && (ma60??0)>0 && ma20>=ma60*0.99 &&
    (f?.bullishStack===true || f?.justTurnBullish===true || (close!==null&&ma10!==null&&close>ma10));
  const breakoutB=(priorHigh20??0)>0 && close!==null && close>=priorHigh20*1.002;
  const volumeB=bVolumeEffective>=1.3;
  const strongCloseB=bClosePositionEffective>=0.65;
  const upperShadowB=bUpperShadowEffective<=0.35;
  const notLateB=f?.lateStage!==true && bRet20Effective<=30;

  return {
    metrics:{support,supportSources:supportMeta.sources,supportMode:supportMeta.mode,supportSourceAmbiguous:supportMeta.sourceAmbiguous,recentHigh,pullbackPct,supportDistancePct},
    A:{checks:{trend:trendA,pullback:pullbackOK,nearSupport,volume:volumeA,structure:structureA,notLate},pass:trendA&&pullbackOK&&nearSupport&&volumeA&&structureA&&notLate},
    B:{checks:{trend:trendB,breakout:breakoutB,volume:volumeB,strongClose:strongCloseB,upperShadow:upperShadowB,notLate:notLateB},pass:trendB&&breakoutB&&volumeB&&strongCloseB&&upperShadowB&&notLateB},
    effective:{aVolumeTodayEffective,aVolumeContractionEffective,bVolumeEffective,bClosePositionEffective,bUpperShadowEffective,bRet20Effective}
  };
}

function mask(checks,order){return order.map(k=>checks[k]===true?"1":"0").join("");}
function failed(checks,order){return order.filter(k=>checks[k]!==true);}
function poolOf(value){return ["GENERAL","THOUSAND"].includes(String(value))?String(value):"UNKNOWN";}

export function observeABSetupMargins(feature,{scanDate=null,pool="UNKNOWN",setupReach="UNKNOWN"}={}){
  const f=feature||{};
  const state=exactState(f);
  const aFailed=failed(state.A.checks,A_ORDER),bFailed=failed(state.B.checks,B_ORDER);
  const failedACount=aFailed.length,failedBCount=bFailed.length;
  const nearestChannel=failedACount<failedBCount?"A":failedBCount<failedACount?"B":"TIE";
  const close=num(f.close),ma20=num(f.ma20),ma60=num(f.ma60),prevMa20=num(f.prevMa20),ma10=num(f.ma10);
  const priorHigh20=num(f.priorHigh20),priorLow20=num(f.priorLow20),todayLow=num(f.todayLow);
  const vToday=num(f.volumeTodayVsPrev5),vContraction=num(f.volumeContraction5to20);
  const closePos=num(f.dailyClosePosition),upper=num(f.dailyUpperShadowRatio),ret20=num(f.ret20);
  const support=state.metrics.support;
  const maDistance20Pct=derivedMaDistance20Pct(f);
  const lateDerived=derivedLateStage(f);

  const warnings=[];
  if(vToday===0) warnings.push("A_VOLUME_TODAY_ZERO_COALESCED_TO_999_BY_FORMAL_TRUTHINESS");
  if(vContraction===0) warnings.push("A_VOLUME_CONTRACTION_ZERO_COALESCED_TO_999_BY_FORMAL_TRUTHINESS");
  if(upper===null) warnings.push("B_UPPER_SHADOW_MISSING_COALESCED_TO_0_BY_FORMAL_TRUTHINESS");
  if(closePos===null) warnings.push("B_CLOSE_POSITION_MISSING_COALESCED_TO_0_BY_FORMAL_TRUTHINESS");
  if(ret20===null) warnings.push("B_RET20_MISSING_COALESCED_TO_0_BY_FORMAL_TRUTHINESS");
  if(typeof f.lateStage==="boolean" && f.lateStage!==lateDerived) warnings.push("LATE_STAGE_FLAG_RAW_FEATURE_MISMATCH");

  return {
    schemaVersion:"ab-setup-margin-observer-v0.1",
    scanDate:scanDate===null?null:String(scanDate),
    symbol:String(f.symbol||f.code||""),
    pool:poolOf(pool),
    setupReach:["REACHED","NOT_REACHED","UNKNOWN"].includes(String(setupReach))?String(setupReach):"UNKNOWN",
    A:{
      pass:state.A.pass,checks:state.A.checks,bitmask:mask(state.A.checks,A_ORDER),
      failedChecks:aFailed,failedCount:failedACount,
      rawMargins:{
        trend:{
          ma20Positive:ma20!==null?ma20:null,
          ma60Positive:ma60!==null?ma60:null,
          ma20Minus0_995Ma60:ma20!==null&&ma60!==null?ma20-ma60*0.995:null,
          closeMinus0_97Ma20:close!==null&&ma20!==null?close-ma20*0.97:null,
          one_005Ma20MinusPrevMa20:ma20!==null&&prevMa20!==null?ma20*1.005-prevMa20:null
        },
        pullback:{
          valuePct:state.metrics.pullbackPct,
          marginAbove2:state.metrics.pullbackPct===null?null:state.metrics.pullbackPct-2,
          marginBelow15:state.metrics.pullbackPct===null?null:15-state.metrics.pullbackPct
        },
        nearSupport:{
          valuePct:state.metrics.supportDistancePct,
          marginBelow4:state.metrics.supportDistancePct===null?null:4-state.metrics.supportDistancePct
        },
        volumeOr:{
          volumeTodayVsPrev5Raw:vToday,
          volumeTodayFormalEffective:state.effective.aVolumeTodayEffective,
          marginBelow1_05:vToday===null?null:1.05-vToday,
          volumeContraction5to20Raw:vContraction,
          volumeContractionFormalEffective:state.effective.aVolumeContractionEffective,
          marginBelow0_95:vContraction===null?null:0.95-vContraction,
          rule:"OR"
        },
        structure:{
          support,
          supportSources:state.metrics.supportSources,
          supportMode:state.metrics.supportMode,
          supportSourceAmbiguous:state.metrics.supportSourceAmbiguous,
          filteredCandidateCloseClauseStructurallyClear:state.metrics.supportMode==="FILTERED_CANDIDATE",
          closeMinus0_985Support:close!==null&&support!==null?close-support*0.985:null,
          todayLowMinusPriorLow20:todayLow!==null?todayLow-(priorLow20||0):null
        },
        notLate:{
          observedLateStage:typeof f.lateStage==="boolean"?f.lateStage:null,
          derivedLateStage:lateDerived,
          ret20,
          marginRet20Below35:ret20===null?null:35-ret20,
          maDistance20Pct,
          marginMaDistanceBelow25:maDistance20Pct===null?null:25-maDistance20Pct
        }
      }
    },
    B:{
      pass:state.B.pass,checks:state.B.checks,bitmask:mask(state.B.checks,B_ORDER),
      failedChecks:bFailed,failedCount:failedBCount,
      rawMargins:{
        trend:{
          ma20Positive:ma20!==null?ma20:null,
          ma60Positive:ma60!==null?ma60:null,
          ma20Minus0_99Ma60:ma20!==null&&ma60!==null?ma20-ma60*0.99:null,
          bullishStack:f.bullishStack===true,
          justTurnBullish:f.justTurnBullish===true,
          closeMinusMa10:close!==null&&ma10!==null?close-ma10:null,
          alternativeRule:"bullishStack OR justTurnBullish OR close>ma10"
        },
        breakout:{
          priorHigh20,
          closeMinus1_002PriorHigh20:close!==null&&priorHigh20!==null?close-priorHigh20*1.002:null
        },
        volume:{value:vToday,formalEffective:state.effective.bVolumeEffective,marginAbove1_3:vToday===null?null:vToday-1.3},
        strongClose:{value:closePos,formalEffective:state.effective.bClosePositionEffective,marginAbove0_65:closePos===null?null:closePos-0.65},
        upperShadow:{value:upper,formalEffective:state.effective.bUpperShadowEffective,marginBelow0_35:upper===null?null:0.35-upper},
        notLate:{
          observedLateStage:typeof f.lateStage==="boolean"?f.lateStage:null,
          derivedLateStage:lateDerived,
          ret20,
          marginRet20Below30:ret20===null?null:30-ret20,
          maDistance20Pct,
          marginMaDistanceBelow25:maDistance20Pct===null?null:25-maDistance20Pct,
          structuralNote:"Under buildMarketFeatures lateStage=(ret20>35 OR maDistance20Pct>25), the separate ret20<=30 condition dominates the ret20>35 branch; B notLate reduces to ret20<=30 plus maDistance20Pct<=25 when raw features are coherent."
        }
      }
    },
    nearestChannel,
    formalPreferredChannel:state.B.pass?"B":state.A.pass?"A":null,
    failedACount,failedBCount,
    warnings,
    interpretation:{
      bitmaskOrder:{A:A_ORDER,B:B_ORDER},
      marginSign:"For simple threshold margins, non-negative means the continuous inequality is on the passing side; composite/OR checks retain sub-margins separately.",
      noCompositeDistance:true,
      noOutcomeUse:true,
      hammingDistanceOnly:"nearestChannel is based only on failed-check count and is not an economic distance."
    },
    researchOnly:true,decisionImpact:false,formalCoreImpact:false
  };
}

function bump(obj,key){obj[key]=(obj[key]||0)+1;}
export function summarizeABSetupMargins(rows=[]){
  const items=Array.isArray(rows)?rows:[];
  const byPool={GENERAL:{rows:0,nearest:{A:0,B:0,TIE:0},patterns:{}},THOUSAND:{rows:0,nearest:{A:0,B:0,TIE:0},patterns:{}},UNKNOWN:{rows:0,nearest:{A:0,B:0,TIE:0},patterns:{}}};
  const warnings={};
  for(const row of items){
    const pool=byPool[row?.pool]?row.pool:"UNKNOWN";
    byPool[pool].rows+=1;
    const near=["A","B","TIE"].includes(row?.nearestChannel)?row.nearestChannel:"TIE";
    byPool[pool].nearest[near]+=1;
    const pattern=`A:${row?.A?.bitmask||"??????"}|B:${row?.B?.bitmask||"??????"}`;
    bump(byPool[pool].patterns,pattern);
    for(const w of row?.warnings||[]) bump(warnings,w);
  }
  return {
    schemaVersion:"ab-setup-margin-summary-v0.1",
    rows:items.length,byPool,warnings,
    policy:"Pattern/margin denominator only. Caller must separately prove setup was sequentially reached before interpreting as setup-first-failure population. No outcome weighting, no normalized distance and no threshold recommendation.",
    researchOnly:true,decisionImpact:false,formalCoreImpact:false
  };
}

export const AB_SETUP_MARGIN_CHECK_ORDER=Object.freeze({A:A_ORDER,B:B_ORDER});
