import { createHash } from "node:crypto";
import { computeD08HistoricalValuationPercentilesV0_1, validateD08ScanDateAgainstRawSnapshotV0_1 } from "./d08_historical_valuation_percentile_engine_v0_1.mjs";

export const D08_HISTORICAL_VALUATION_PERCENTILE_SNAPSHOT_VERSION="0.1-RESEARCH";
const sha=v=>createHash("sha256").update(typeof v==="string"?v:JSON.stringify(v)).digest("hex");

function dateOf(r){return String(r?.marketDate??r?.tradeDate??"");}

function fiscalTransition(historyRows,scanDate){
  const rows=[...historyRows].filter(r=>dateOf(r)<=scanDate).sort((a,b)=>dateOf(a).localeCompare(dateOf(b)));
  const current=rows.find(r=>dateOf(r)===scanDate)||null;
  if(!current) return {state:"UNKNOWN",changed:null,priorFiscalReportPeriod:null,currentFiscalReportPeriod:null};
  const cur=current.fiscalReportPeriod??null;
  if(cur===null) return {state:"SOURCE_NOT_PROVIDED",changed:null,priorFiscalReportPeriod:null,currentFiscalReportPeriod:null};
  let prior=null;
  for(const r of rows){
    if(dateOf(r)>=scanDate) break;
    if(r.fiscalReportPeriod!==null&&r.fiscalReportPeriod!==undefined) prior=String(r.fiscalReportPeriod);
  }
  if(prior===null) return {state:"UNKNOWN_PRIOR",changed:null,priorFiscalReportPeriod:null,currentFiscalReportPeriod:String(cur)};
  return {
    state:"KNOWN",
    changed:prior!==String(cur),
    priorFiscalReportPeriod:prior,
    currentFiscalReportPeriod:String(cur),
  };
}

export function buildD08HistoricalValuationPercentileSnapshotV0_1({
  scanDate,
  members,
  rawRows,
  historyBySymbol,
  semanticRegistryHash,
  scanDateListHash,
}={}){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(String(scanDate))) throw new Error("scanDate invalid");
  if(!Array.isArray(members)||!Array.isArray(rawRows)) throw new Error("members/rawRows required");
  if(!(historyBySymbol instanceof Map)) throw new Error("historyBySymbol must be Map");
  const rawBySymbol=new Map(rawRows.map(r=>[String(r.symbol),r]));
  if(rawBySymbol.size!==rawRows.length) throw new Error("duplicate raw snapshot symbol");
  const seen=new Set();
  const rows=[];

  for(const m of [...members].sort((a,b)=>String(a.symbol).localeCompare(String(b.symbol)))){
    const symbol=String(m.symbol);
    if(seen.has(symbol)) throw new Error("duplicate cohort member "+symbol);
    seen.add(symbol);
    const raw=rawBySymbol.get(symbol);
    if(!raw) throw new Error("RAW_SNAPSHOT_COHORT_ROW_MISSING:"+symbol);
    const effectiveFrom=String(m.effectiveFrom??"");
    const effectiveTo=m.effectiveTo===null||m.effectiveTo===undefined?null:String(m.effectiveTo);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(effectiveFrom)) {
      throw new Error("MEMBERSHIP_EFFECTIVE_FROM_REQUIRED:"+symbol);
    }
    if(effectiveFrom>scanDate || (effectiveTo!==null&&effectiveTo<scanDate)) {
      throw new Error("MEMBERSHIP_NOT_ACTIVE_AT_SCAN:"+symbol);
    }
    const allSymbolHistory=historyBySymbol.get(symbol)||[];
    const preMembershipHistoryRowsExcluded=allSymbolHistory.filter(r=>dateOf(r)<effectiveFrom).length;
    const history=allSymbolHistory.filter(r=>
      dateOf(r)>=effectiveFrom && (effectiveTo===null||dateOf(r)<=effectiveTo)
    );
    const daily=history.find(r=>dateOf(r)===scanDate)||null;
    const cross=validateD08ScanDateAgainstRawSnapshotV0_1({symbol,scanDate,dailyRow:daily,rawRow:raw});
    if(!cross.ok) throw new Error("raw crosscheck failed "+symbol);
    const pe=computeD08HistoricalValuationPercentilesV0_1({historyRows:history,metric:"pe",scanDate});
    const pb=computeD08HistoricalValuationPercentilesV0_1({historyRows:history,metric:"pb",scanDate});
    rows.push({
      market:"TWSE",scanDate,symbol,
      membershipEpisode:{
        effectiveFrom,
        effectiveTo,
        semanticMembershipHash:m.semanticMembershipHash??null,
      },
      valuationObserved:raw.valuationObserved===true,
      pe:raw.pe??null,pb:raw.pb??null,
      peState:raw.peState??(raw.pe===null?"UNKNOWN":"KNOWN"),
      pbState:raw.pbState??(raw.pb===null?"UNKNOWN":"KNOWN"),
      fiscalReportPeriod:raw.fiscalReportPeriod??null,
      fiscalTransition:fiscalTransition(history,scanDate),
      pePercentiles:pe.windows,
      pbPercentiles:pb.windows,
      historyDiagnostics:{
        peValidThroughScanDate:pe.validObservationCountThroughScanDate,
        pbValidThroughScanDate:pb.validObservationCountThroughScanDate,
        peFutureRowsExcluded:pe.futureRowsExcluded,
        pbFutureRowsExcluded:pb.futureRowsExcluded,
        preMembershipHistoryRowsExcluded,
      },
    });
  }

  if(rows.length!==members.length) throw new Error("cohort accounting mismatch");
  const coverage={
    memberCount:rows.length,
    rawValuationObservedCount:rows.filter(r=>r.valuationObserved).length,
    peKnownCount:rows.filter(r=>Number.isFinite(r.pe)).length,
    pbKnownCount:rows.filter(r=>Number.isFinite(r.pb)).length,
    pe252KnownCount:rows.filter(r=>r.pePercentiles.trailing252.state==="KNOWN").length,
    pe756KnownCount:rows.filter(r=>r.pePercentiles.trailing756.state==="KNOWN").length,
    pe1260KnownCount:rows.filter(r=>r.pePercentiles.trailing1260.state==="KNOWN").length,
    peExpandingKnownCount:rows.filter(r=>r.pePercentiles.expanding.state==="KNOWN").length,
    pb252KnownCount:rows.filter(r=>r.pbPercentiles.trailing252.state==="KNOWN").length,
    pb756KnownCount:rows.filter(r=>r.pbPercentiles.trailing756.state==="KNOWN").length,
    pb1260KnownCount:rows.filter(r=>r.pbPercentiles.trailing1260.state==="KNOWN").length,
    pbExpandingKnownCount:rows.filter(r=>r.pbPercentiles.expanding.state==="KNOWN").length,
    fiscalTransitionKnownCount:rows.filter(r=>r.fiscalTransition.state==="KNOWN").length,
  };
  const canonical={
    market:"TWSE",scanDate,
    semanticRegistryHash:String(semanticRegistryHash||""),
    scanDateListHash:String(scanDateListHash||""),
    coverage,rows,
    outcomeAccess:false,decisionImpact:false,
    schemaVersion:"D08_TWSE_HISTORICAL_VALUATION_PERCENTILE_SNAPSHOT_V0_1",
  };
  return {...canonical,snapshotPayloadHash:sha(canonical)};
}
