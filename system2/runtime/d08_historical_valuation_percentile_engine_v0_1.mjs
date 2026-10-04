import { averageRankPercentile } from "../../research/historical_valuation_replay_core_v0_1.mjs";

export const D08_HISTORICAL_VALUATION_PERCENTILE_ENGINE_VERSION="0.1-RESEARCH";

function dateOf(row){
  const d=String(row?.marketDate??row?.tradeDate??"").trim();
  if(!/^\d{4}-\d{2}-\d{2}$/.test(d)) throw new Error("history row date invalid");
  return d;
}
function valueOf(row,metric){
  const v=row?.[metric];
  return Number.isFinite(v)?Number(v):null;
}
function normalizeHistory(rows,metric,scanDate){
  if(!["pe","pb"].includes(metric)) throw new Error("metric must be pe or pb");
  if(!/^\d{4}-\d{2}-\d{2}$/.test(String(scanDate))) throw new Error("scanDate invalid");
  if(!Array.isArray(rows)) throw new Error("historyRows must be array");
  const seen=new Set();
  return rows.map(r=>({date:dateOf(r),value:valueOf(r,metric)}))
    .filter(x=>x.date<=scanDate)
    .sort((a,b)=>a.date.localeCompare(b.date))
    .map(x=>{
      if(seen.has(x.date)) throw new Error("duplicate history date "+x.date);
      seen.add(x.date);
      return x;
    });
}
function resultForValid(valid,currentValue,minValid,windowSize=null){
  const ref=windowSize===null?valid:valid.slice(-windowSize);
  const r=averageRankPercentile(ref.map(x=>x.value),currentValue,{minValid});
  return {
    state:r.state,
    reason:r.reason,
    percentile:r.percentile,
    validObservationCount:r.validObservationCount,
    historyStartDate:ref.at(0)?.date??null,
    historyEndDate:ref.at(-1)?.date??null,
  };
}

export function computeD08HistoricalValuationPercentilesV0_1({
  historyRows,metric,scanDate,
}={}){
  const all=normalizeHistory(historyRows,metric,scanDate);
  const currentRow=all.find(x=>x.date===scanDate)||null;
  const currentValue=currentRow?.value??null;
  const valid=all.filter(x=>Number.isFinite(x.value));
  const output={
    metric,
    scanDate,
    currentState:Number.isFinite(currentValue)?"KNOWN":"UNKNOWN",
    currentValue,
    validObservationCountThroughScanDate:valid.length,
    windows:{
      trailing252:resultForValid(valid,currentValue,252,252),
      trailing756:resultForValid(valid,currentValue,756,756),
      trailing1260:resultForValid(valid,currentValue,1260,1260),
      expanding:resultForValid(valid,currentValue,252,null),
    },
    futureRowsExcluded:historyRows.filter(r=>dateOf(r)>scanDate).length,
    formulaVersion:D08_HISTORICAL_VALUATION_PERCENTILE_ENGINE_VERSION,
    outcomeAccess:false,
    decisionImpact:false,
  };
  return output;
}

export function validateD08ScanDateAgainstRawSnapshotV0_1({
  symbol,scanDate,dailyRow=null,rawRow,
}={}){
  if(!rawRow||String(rawRow.symbol)!==String(symbol)||String(rawRow.marketDate)!==String(scanDate)){
    throw new Error("RAW_SNAPSHOT_IDENTITY_MISMATCH");
  }
  const rawObserved=rawRow.valuationObserved===true;
  const dailyObserved=!!dailyRow;
  if(rawObserved!==dailyObserved){
    throw new Error("CURRENT_RAW_SNAPSHOT_MISMATCH:OBSERVATION_PRESENCE");
  }
  if(!rawObserved){
    return {ok:true,state:"MATCHED_SOURCE_ROW_MISSING",symbol:String(symbol),scanDate:String(scanDate)};
  }
  if(String(dailyRow.symbol)!==String(symbol)||dateOf(dailyRow)!==String(scanDate)){
    throw new Error("CURRENT_DAILY_IDENTITY_MISMATCH");
  }
  for(const metric of ["pe","pb"]){
    const a=valueOf(dailyRow,metric), b=valueOf(rawRow,metric);
    if((a===null)!==(b===null) || (a!==null&&a!==b)){
      throw new Error("CURRENT_RAW_SNAPSHOT_MISMATCH:"+metric.toUpperCase());
    }
  }
  const dailyFiscal=dailyRow.fiscalReportPeriod===null||dailyRow.fiscalReportPeriod===undefined
    ?null:String(dailyRow.fiscalReportPeriod);
  const rawFiscal=rawRow.fiscalReportPeriod===null||rawRow.fiscalReportPeriod===undefined
    ?null:String(rawRow.fiscalReportPeriod);
  if(dailyFiscal!==rawFiscal){
    throw new Error("CURRENT_RAW_SNAPSHOT_MISMATCH:FISCAL_PERIOD");
  }
  return {ok:true,state:"MATCHED",symbol:String(symbol),scanDate:String(scanDate)};
}
