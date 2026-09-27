export const PLAN_CONSTRUCTION_STATE = Object.freeze({
  COMPLETE: "PLAN_CONSTRUCTION_COMPLETE_CURRENT_GENERATION",
  ZERO_COMPLETE: "ZERO_SELECTION_COMPLETE_CURRENT_GENERATION",
  INCOMPLETE: "PLAN_CONSTRUCTION_INCOMPLETE_OBSERVED",
  UNKNOWN: "PLAN_CONSTRUCTION_UNKNOWN"
});

function finitePositive(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0;
}

function sameNumber(a,b,epsilon=1e-9) {
  const x=Number(a), y=Number(b);
  return Number.isFinite(x) && Number.isFinite(y) && Math.abs(x-y)<=epsilon;
}

function channelOf(stock) {
  if(stock?.channel==="A" || stock?.mode==="PULLBACK") return "A";
  if(stock?.channel==="B" || stock?.mode==="MOMENTUM") return "B";
  return null;
}

function planFieldsComplete(stock) {
  const channel=channelOf(stock);
  if(!stock || !String(stock.symbol || stock.code || "").trim()) return false;
  if(!String(stock.planDate || "").trim() || !channel) return false;
  if(!finitePositive(stock.buyLow) || !finitePositive(stock.buyHigh) ||
     !finitePositive(stock.stop)) return false;
  if(Number(stock.buyLow)>Number(stock.buyHigh)) return false;
  if(channel==="B" && (!finitePositive(stock.breakout) || !finitePositive(stock.maxChase))) return false;
  if(channel==="A" && stock.maxChase!==null && stock.maxChase!==undefined && stock.maxChase!=="" &&
     !finitePositive(stock.maxChase)) return false;
  return true;
}

function rowMatchesStock(row,stock) {
  const symbol=String(stock.symbol || stock.code || "");
  if(String(row.symbol || "")!==symbol) return false;
  if(String(row.plan_date || "")!==String(stock.planDate || "")) return false;
  if(!sameNumber(row.buy_low,stock.buyLow) || !sameNumber(row.buy_high,stock.buyHigh) ||
     !sameNumber(row.stop,stock.stop)) return false;
  const channel=channelOf(stock);
  if(channel==="B") {
    if(!sameNumber(row.breakout,stock.breakout) || !sameNumber(row.max_chase,stock.maxChase)) return false;
  }
  return true;
}

function result(state,reason,extra={}) {
  return {schemaVersion:"PLAN_CONSTRUCTION_COMPLETENESS_CLASSIFIER_V0_1",state,reason,...extra};
}

export function classifyPlanConstructionCompleteness({scan,journalHealth,journalRead}={}) {
  if(!scan || scan.dryRun===true || !scan.scanDate) {
    return result(PLAN_CONSTRUCTION_STATE.UNKNOWN,"SCAN_RECEIPT_MISSING_OR_NOT_FORMAL");
  }

  const embedded=scan.journal;
  if(!embedded || embedded.simulated===true) {
    return result(PLAN_CONSTRUCTION_STATE.UNKNOWN,"EMBEDDED_FORMAL_JOURNAL_RECEIPT_UNAVAILABLE");
  }

  const selectedCount=Number(scan.selectedCount);
  if(!Number.isInteger(selectedCount) || selectedCount<0 ||
     !Array.isArray(scan.stocks) || scan.stocks.length!==selectedCount) {
    return result(PLAN_CONSTRUCTION_STATE.UNKNOWN,"SCAN_DENOMINATOR_UNCERTAIN");
  }

  if(embedded.stored===false || embedded.verified===false) {
    return result(PLAN_CONSTRUCTION_STATE.INCOMPLETE,"SAME_RUN_JOURNAL_WRITE_NOT_VERIFIED",{
      scanDate:String(scan.scanDate),selectedCount
    });
  }

  if(embedded.stored!==true || embedded.verified!==true ||
     String(embedded.scanDate||"")!==String(scan.scanDate) ||
     Number(embedded.selectedCount)!==selectedCount ||
     !embedded.recordedAt || !Number.isFinite(Date.parse(embedded.recordedAt))) {
    return result(PLAN_CONSTRUCTION_STATE.UNKNOWN,"EMBEDDED_JOURNAL_LINEAGE_INCOMPLETE");
  }

  if(!journalHealth || journalHealth.configured!==true ||
     String(journalHealth.scanDate||"")!==String(scan.scanDate)) {
    return result(PLAN_CONSTRUCTION_STATE.UNKNOWN,"EXACT_DATE_HEALTH_UNAVAILABLE");
  }

  if(String(journalHealth.updatedAt||"")!==String(embedded.recordedAt)) {
    return result(PLAN_CONSTRUCTION_STATE.UNKNOWN,"CURRENT_GENERATION_TIMESTAMP_MISMATCH",{
      embeddedRecordedAt:embedded.recordedAt,healthUpdatedAt:journalHealth.updatedAt||null
    });
  }

  const healthSelected=Number(journalHealth.selectedCount);
  const healthPlans=Number(journalHealth.planCount);
  if(journalHealth.ok!==true || healthSelected!==selectedCount || healthPlans!==selectedCount) {
    return result(PLAN_CONSTRUCTION_STATE.INCOMPLETE,"SAME_GENERATION_COUNT_MISMATCH",{
      selectedCount,healthSelected,healthPlans
    });
  }

  const allRows=Array.isArray(journalRead?.planRows)?journalRead.planRows:null;
  if(!allRows) return result(PLAN_CONSTRUCTION_STATE.UNKNOWN,"PLAN_ROW_READ_SURFACE_UNAVAILABLE");
  const rows=allRows.filter(row=>String(row.scan_date||"")===String(scan.scanDate));

  // If health proves N rows but the bounded reader surfaces fewer, do not turn reader truncation into a plan failure.
  if(rows.length!==healthPlans) {
    return result(PLAN_CONSTRUCTION_STATE.UNKNOWN,"PLAN_ROW_READ_SURFACE_INCOMPLETE",{
      expected:healthPlans,observed:rows.length
    });
  }

  if(rows.some(row=>String(row.recorded_at||"")!==String(embedded.recordedAt))) {
    return result(PLAN_CONSTRUCTION_STATE.UNKNOWN,"PLAN_ROW_GENERATION_TIMESTAMP_MISMATCH");
  }

  if(selectedCount===0) {
    if(rows.length!==0) return result(PLAN_CONSTRUCTION_STATE.INCOMPLETE,"ZERO_SELECTION_WITH_PLAN_ROWS");
    return result(PLAN_CONSTRUCTION_STATE.ZERO_COMPLETE,"ZERO_SELECTION_SAME_GENERATION_CERTIFIED",{
      scanDate:String(scan.scanDate),recordedAt:embedded.recordedAt
    });
  }

  const scanSymbols=scan.stocks.map(stock=>String(stock.symbol || stock.code || ""));
  if(new Set(scanSymbols).size!==scanSymbols.length || scan.stocks.some(stock=>!planFieldsComplete(stock))) {
    return result(PLAN_CONSTRUCTION_STATE.INCOMPLETE,"SCAN_PLAN_FIELDS_INCOMPLETE_OR_DUPLICATE");
  }

  const bySymbol=new Map();
  for(const row of rows) {
    const symbol=String(row.symbol||"");
    if(!symbol || bySymbol.has(symbol)) {
      return result(PLAN_CONSTRUCTION_STATE.INCOMPLETE,"JOURNAL_PLAN_SYMBOL_DUPLICATE_OR_EMPTY");
    }
    bySymbol.set(symbol,row);
  }

  for(const stock of scan.stocks) {
    const symbol=String(stock.symbol || stock.code || "");
    const row=bySymbol.get(symbol);
    if(!row || !rowMatchesStock(row,stock)) {
      return result(PLAN_CONSTRUCTION_STATE.INCOMPLETE,"SAME_GENERATION_PLAN_VALUE_MISMATCH",{symbol});
    }
  }

  return result(PLAN_CONSTRUCTION_STATE.COMPLETE,"CURRENT_GENERATION_THREE_SURFACE_ALIGNMENT_CERTIFIED",{
    scanDate:String(scan.scanDate),
    recordedAt:embedded.recordedAt,
    selectedCount,
    evidence:[
      "scan.journal stored+verified from same run",
      "journalHealth.updatedAt equals scan.journal.recordedAt",
      "all exact-date plan rows share the same recorded_at",
      "count, symbol and required plan fields match current scan stocks"
    ],
    scope:"Current accessible scan generation only; not an immutable historical generation ID."
  });
}
