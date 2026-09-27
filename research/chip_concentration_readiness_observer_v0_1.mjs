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
    coveredAtReach:0,symbolAbsentAtReach:0,valueInvalidAtReach:0,datasetUnavailableAtReach:0,
    sameDayMarketCovered:0,sameDayMarketSymbolAbsent:0,sameDayMarketValueInvalid:0
  };
  if(dataset.datasetState==="DATASET_VALIDATED_SHAPE"){
    for(const row of Array.isArray(rows)?rows:[]){
      const symbol=String(row?.symbol||"").trim();
      const entry=stocks[symbol];
      if(!entry) counts.sameDayMarketSymbolAbsent+=1;
      else if(num(entry.chipConcentration)===null) counts.sameDayMarketValueInvalid+=1;
      else counts.sameDayMarketCovered+=1;
    }
  }
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
    sameDayMarketCoverageRate:counts.rows>0&&dataset.datasetState==="DATASET_VALIDATED_SHAPE"?
      counts.sameDayMarketCovered/counts.rows:null,
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


function rawMarketNumber(v){
  if(v===null||v===undefined||v==="") return null;
  const s=String(v).replaceAll(",","").replace("%","").trim();
  if(!s||s==="-"||s==="--") return null;
  const n=Number(s);
  return Number.isFinite(n)?n:null;
}

export function classifyTdccRawSymbolCoverage({
  rows=[],
  fields=null,
  marketSymbols=[],
  scanDate=null
}={}){
  const groups=new Map();
  const datasetFatal=[];
  let commonAsOfDate=null;
  for(let index=0;index<(Array.isArray(rows)?rows:[]).length;index+=1){
    const values=rows[index];
    const row=Array.isArray(values)&&Array.isArray(fields)
      ? Object.fromEntries(fields.map((field,i)=>[field,values[i]]))
      : values;
    const symbol=String(row?.["證券代號"]||"").trim();
    if(!/^[1-9][0-9]{3}$/.test(symbol)) continue;
    const rowDate=String(row?.["資料日期"]||"").trim();
    const grade=rawMarketNumber(row?.["持股分級"]);
    const shares=rawMarketNumber(row?.["股數"]);
    const ratio=rawMarketNumber(row?.["占集保庫存數比例%"]);
    if(commonAsOfDate&&rowDate&&commonAsOfDate!==rowDate){
      datasetFatal.push({index,symbol,reason:"MIXED_AS_OF_DATE",rowDate,commonAsOfDate});
    }
    if(rowDate&&!commonAsOfDate) commonAsOfDate=rowDate;
    const g=groups.get(symbol)||{symbol,grades:new Map(),duplicateGrades:[]};
    if(Number.isInteger(grade)){
      if(g.grades.has(grade)) g.duplicateGrades.push(grade);
      else g.grades.set(grade,{shares,ratio,rowDate});
    }
    groups.set(symbol,g);
  }

  const symbolStates={};
  const counts={VALID:0,NO_SOURCE_ROWS:0,INCOMPLETE_GRADE_SET:0,TOTAL_RATIO_NOT_100:0,TOTAL_SHARES_NONPOSITIVE:0,DUPLICATE_GRADE:0};
  for(const rawSymbol of Array.isArray(marketSymbols)?marketSymbols:[]){
    const symbol=String(rawSymbol||"").trim();
    const g=groups.get(symbol);
    let state="VALID";
    if(!g) state="NO_SOURCE_ROWS";
    else if(g.duplicateGrades.length) state="DUPLICATE_GRADE";
    else if(g.grades.size!==17||![...Array(17)].every((_,i)=>g.grades.has(i+1))) state="INCOMPLETE_GRADE_SET";
    else if(Math.abs((g.grades.get(17)?.ratio??NaN)-100)>.01) state="TOTAL_RATIO_NOT_100";
    else if(!((g.grades.get(17)?.shares??0)>0)) state="TOTAL_SHARES_NONPOSITIVE";
    symbolStates[symbol]={state,rawGradeCount:g?.grades.size||0,duplicateGrades:g?.duplicateGrades||[]};
    bump(counts,state);
  }
  return {
    schemaVersion:"tdcc-raw-symbol-coverage-v0.1",
    scanDate,
    rawAsOfDate:commonAsOfDate,
    marketSymbolCount:Array.isArray(marketSymbols)?marketSymbols.length:0,
    sourceSymbolGroupCount:groups.size,
    counts,
    symbolStates,
    datasetFatal,
    persistenceLossGuard:"After validateOfficialQualityData persists only validated stocks, NO_SOURCE_ROWS cannot be distinguished from silently skipped incomplete/invalid total-row groups unless raw-ingest diagnostics are separately frozen.",
    formalCoreChanged:false,
    outcomesUsed:false
  };
}
