function num(v){
  if(v===null||v===undefined||v==="") return null;
  const n=Number(v);
  return Number.isFinite(n)?n:null;
}
function dateMs(v){
  if(!v) return null;
  const t=Date.parse(String(v));
  return Number.isFinite(t)?t:null;
}
function dateOnlyMs(v){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(String(v||""))) return null;
  return Date.parse(String(v)+"T00:00:00Z");
}
function calendarAgeDays(scanDate,asOfDate){
  const a=dateOnlyMs(scanDate),b=dateOnlyMs(asOfDate);
  return a===null||b===null?null:Math.round((a-b)/86400000);
}
function pricePool(row){
  const explicit=String(row?.pool||"").toUpperCase();
  if(explicit==="GENERAL"||explicit==="THOUSAND") return explicit;
  const close=num(row?.close);
  return close!==null&&close>=1000?"THOUSAND":"GENERAL";
}
function bump(obj,key){obj[key]=(obj[key]||0)+1;}

export const CHIP_REACH_STATE=Object.freeze({
  REACHED:"REACHED",
  NOT_REACHED:"NOT_REACHED",
  UNKNOWN:"UNKNOWN"
});

export function classifyTdccSnapshot({
  scanDate,
  tdccSnapshot,
  decisionCutoffAt=null,
  firstKnownAt=null,
  minimumGlobalCount=1500,
  maxAgeCalendarDays=14
}={}){
  if(!tdccSnapshot){
    return {
      datasetState:"DATASET_MISSING",
      freshnessState:"UNKNOWN",
      pitAvailabilityState:"UNKNOWN",
      globalCoverageState:"UNKNOWN",
      asOfDate:null,
      ageCalendarDays:null,
      stockCount:0,
      declaredCount:null,
      promotionQuality:"BLOCKED"
    };
  }
  const asOfDate=String(tdccSnapshot.asOfDate||"");
  const ageCalendarDays=calendarAgeDays(scanDate,asOfDate);
  const stocks=tdccSnapshot.stocks&&typeof tdccSnapshot.stocks==="object"?tdccSnapshot.stocks:{};
  const stockCount=Object.keys(stocks).length;
  const declaredCount=num(tdccSnapshot.count);
  const dateValid=ageCalendarDays!==null&&ageCalendarDays>=0&&ageCalendarDays<=maxAgeCalendarDays;
  const countValid=stockCount>=minimumGlobalCount&&declaredCount!==null&&declaredCount===stockCount;
  const datasetState=dateValid&&countValid?"DATASET_VALIDATED_SHAPE":"DATASET_INVALID_OR_INCOMPLETE";
  const freshnessState=ageCalendarDays===null?"UNKNOWN":ageCalendarDays<0?"FUTURE_DATED":
    ageCalendarDays<=maxAgeCalendarDays?"WITHIN_FORMAL_14D_WINDOW":"STALE_GT_14D";
  const cutoffMs=dateMs(decisionCutoffAt),knownMs=dateMs(firstKnownAt);
  let pitAvailabilityState="UNKNOWN";
  if(cutoffMs!==null&&knownMs!==null){
    pitAvailabilityState=knownMs<=cutoffMs?"PIT_PROVEN_BY_FIRST_KNOWN_AT":"POST_DECISION_CAPTURE";
  }else if(knownMs!==null){
    pitAvailabilityState="FIRST_KNOWN_PRESENT_CUTOFF_UNKNOWN";
  }else{
    pitAvailabilityState="FIRST_KNOWN_NOT_CAPTURED";
  }
  const globalCoverageState=countValid?"GLOBAL_MINIMUM_COVERAGE_PASS":"GLOBAL_MINIMUM_COVERAGE_FAIL";
  const promotionQuality=
    datasetState==="DATASET_VALIDATED_SHAPE"&&pitAvailabilityState==="PIT_PROVEN_BY_FIRST_KNOWN_AT"
      ?"PIT_ELIGIBLE":"BLOCKED";
  return {
    datasetState,freshnessState,pitAvailabilityState,globalCoverageState,
    asOfDate:asOfDate||null,ageCalendarDays,stockCount,declaredCount,promotionQuality
  };
}

export function observeChipConcentrationReadiness(rows=[],{
  scanDate,
  tdccSnapshot,
  preChipReachBySymbol={},
  decisionCutoffAt=null,
  firstKnownAt=null,
  minimumGlobalCount=1500,
  maxAgeCalendarDays=14
}={}){
  const dataset=classifyTdccSnapshot({
    scanDate,tdccSnapshot,decisionCutoffAt,firstKnownAt,minimumGlobalCount,maxAgeCalendarDays
  });
  const stocks=tdccSnapshot?.stocks&&typeof tdccSnapshot.stocks==="object"?tdccSnapshot.stocks:{};
  const counts={
    rows:Array.isArray(rows)?rows.length:0,
    reached:0,notReached:0,parentUnknown:0,
    coveredAtReach:0,symbolAbsentAtReach:0,valueInvalidAtReach:0,datasetUnavailableAtReach:0
  };
  const poolCounts={GENERAL:{reached:0,covered:0,missing:0},THOUSAND:{reached:0,covered:0,missing:0}};
  const records=[];
  for(const row of Array.isArray(rows)?rows:[]){
    const symbol=String(row?.symbol||"").trim();
    const pool=pricePool(row);
    const reach=String(preChipReachBySymbol?.[symbol]||CHIP_REACH_STATE.UNKNOWN);
    if(reach===CHIP_REACH_STATE.NOT_REACHED){
      counts.notReached+=1;
      records.push({scanDate,symbol,pool,reachState:reach,chipEvidenceState:"NOT_EVALUABLE_PRE_GATE",formalMissingAction:"NOT_REACHED"});
      continue;
    }
    if(reach!==CHIP_REACH_STATE.REACHED){
      counts.parentUnknown+=1;
      records.push({scanDate,symbol,pool,reachState:CHIP_REACH_STATE.UNKNOWN,chipEvidenceState:"UNKNOWN_PARENT_REACH",formalMissingAction:"UNKNOWN"});
      continue;
    }
    counts.reached+=1;poolCounts[pool].reached+=1;
    if(dataset.datasetState!=="DATASET_VALIDATED_SHAPE"){
      counts.datasetUnavailableAtReach+=1;poolCounts[pool].missing+=1;
      records.push({scanDate,symbol,pool,reachState:reach,chipEvidenceState:"DATASET_UNAVAILABLE",chipConcentration:null,formalMissingAction:"SCAN_LEVEL_DATA_INCOMPLETE_OR_REJECT_NOT_INTERPRETABLE"});
      continue;
    }
    const entry=stocks[symbol];
    if(!entry){
      counts.symbolAbsentAtReach+=1;poolCounts[pool].missing+=1;
      records.push({scanDate,symbol,pool,reachState:reach,chipEvidenceState:"SYMBOL_ABSENT",chipConcentration:null,chipAsOfDate:dataset.asOfDate,formalMissingAction:"REJECT_MISSING_CHIP_CONCENTRATION"});
      continue;
    }
    const concentration=num(entry.chipConcentration);
    if(concentration===null){
      counts.valueInvalidAtReach+=1;poolCounts[pool].missing+=1;
      records.push({scanDate,symbol,pool,reachState:reach,chipEvidenceState:"VALUE_INVALID",chipConcentration:null,chipAsOfDate:entry.chipAsOfDate||dataset.asOfDate,formalMissingAction:"REJECT_MISSING_CHIP_CONCENTRATION"});
      continue;
    }
    counts.coveredAtReach+=1;poolCounts[pool].covered+=1;
    records.push({
      scanDate,symbol,pool,reachState:reach,chipEvidenceState:"COVERED",
      chipConcentration:concentration,chipAsOfDate:entry.chipAsOfDate||dataset.asOfDate,
      formalMissingAction:"PASS_PRESENCE_GATE",
      pitAvailabilityState:dataset.pitAvailabilityState
    });
  }
  return {
    schemaVersion:"chip-concentration-readiness-observer-v0.1",
    scanDate,
    dataset,
    counts,
    poolCounts,
    formalReachMissingRate:counts.reached>0?
      (counts.symbolAbsentAtReach+counts.valueInvalidAtReach)/counts.reached:null,
    semanticGuards:{
      productionMissingBehavior:"A per-symbol missing chipConcentration rejects when this gate is reached; a wholly missing TDCC snapshot aborts the scan before candidate scoring.",
      epistemicMeaning:"Missing concentration is DATA_QUALITY/UNKNOWN evidence, not proof of economically bad ownership concentration.",
      globalCountNotSymbolCoverage:true,
      freshnessNotAvailability:"asOfDate/freshness alone does not prove the weekly file was publicly available before the decision cutoff.",
      zeroIsObservedValue:true,
      outcomesUsed:false,
      formalCoreChanged:false
    },
    records
  };
}
