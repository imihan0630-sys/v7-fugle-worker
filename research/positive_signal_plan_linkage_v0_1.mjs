// Positive signal ↔ plan-store linkage classifier v0.1 — research-only.
// Distinguishes a durable signal from its attributable plan provenance across D1 journal and KV plan stores.

function s(v){return String(v??"").trim()}
function asRows(v){return Array.isArray(v)?v:[]}

export function classifyPositiveSignalPlanLinkage({
  signal,
  journalDay,
  journalPlans=[],
  scanStatus,
  configStocks=[]
}={}){
  const eventId=s(signal?.event_id??signal?.eventId);
  const symbol=s(signal?.symbol);
  const signalType=s(signal?.signal_type??signal?.signalType).toUpperCase();
  const planScanDate=s(signal?.plan_scan_date??signal?.planScanDate);
  if(!eventId||!symbol||signalType!=="BUY"||!planScanDate){
    return {status:"UNKNOWN",attributionEligible:false,reason:"INCOMPLETE_POSITIVE_BUY_IDENTITY"};
  }

  const dayExact=s(journalDay?.scan_date??journalDay?.scanDate)===planScanDate;
  const journalPlan=asRows(journalPlans).find(p=>
    s(p?.scan_date??p?.scanDate)===planScanDate &&
    s(p?.symbol)===symbol
  )||null;

  const scanExact=s(scanStatus?.scanDate)===planScanDate &&
    asRows(scanStatus?.stocks).some(p=>s(p?.symbol??p?.code)===symbol);

  const configExact=asRows(configStocks).some(p=>
    s(p?.symbol??p?.code)===symbol &&
    s(p?.closeDate)===planScanDate
  );

  if(dayExact&&journalPlan){
    return {
      status:"D1_JOURNAL_PLAN_LINKED",
      attributionEligible:true,
      eventId,symbol,planScanDate,
      evidence:{journalDay:true,journalPlan:true,scanStatus:scanExact,configPlan:configExact}
    };
  }

  if(scanExact && !dayExact && !journalPlan){
    return {
      status:"CROSS_STORE_PLAN_PRESENT_D1_JOURNAL_MISSING",
      attributionEligible:false,
      eventId,symbol,planScanDate,
      evidence:{journalDay:false,journalPlan:false,scanStatus:true,configPlan:configExact},
      reason:"Exact LAST_SCAN plan exists for the signal generation date/symbol, but D1 journal day/plan linkage is absent."
    };
  }

  if(configExact && !dayExact && !journalPlan){
    return {
      status:"CURRENT_CONFIG_MATCH_ONLY_D1_JOURNAL_MISSING",
      attributionEligible:false,
      eventId,symbol,planScanDate,
      evidence:{journalDay:false,journalPlan:false,scanStatus:false,configPlan:true},
      reason:"Current monitor config matches symbol/closeDate, but current config is mutable and does not independently prove immutable scan generation."
    };
  }

  return {
    status:"POSITIVE_SIGNAL_UNATTRIBUTED_TO_PLAN",
    attributionEligible:false,
    eventId,symbol,planScanDate,
    evidence:{journalDay:dayExact,journalPlan:Boolean(journalPlan),scanStatus:scanExact,configPlan:configExact},
    reason:"Positive signal exists, but exact plan provenance is not sufficiently linked on available read surfaces."
  };
}
