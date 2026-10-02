// D15 plan-generation provenance classifier v0.1 — research-only.
// Separates ordinary journal-certified plans, staged historical recovery plans,
// ambiguous partial-scan config side effects, and unproven mutable config.

function s(v){return String(v??"").trim()}
function ms(v){const t=Date.parse(v||"");return Number.isFinite(t)?t:null}

export function classifyPlanGenerationProvenance({
  planDate,
  d1JournalDay,
  d1JournalPlans=[],
  lastScan,
  currentConfig,
  recoveryEvidence
}={}){
  const date=s(planDate);
  if(!date) return {status:"UNKNOWN",cleanIndependentDate:false,reason:"PLAN_DATE_MISSING"};

  const plans=Array.isArray(d1JournalPlans)?d1JournalPlans:[];
  const dayExact=s(d1JournalDay?.scan_date??d1JournalDay?.scanDate)===date;
  const planRows=plans.filter(p=>s(p?.scan_date??p?.scanDate)===date);
  if(dayExact && planRows.length>=2){
    return {
      status:"D1_JOURNAL_CERTIFIED_MULTI_NAME",
      cleanIndependentDate:true,
      evidenceTier:"TIER_A_D1_JOURNAL",
      selectedCount:planRows.length
    };
  }

  const scanExact=s(lastScan?.scanDate)===date;
  const scanStatus=s(lastScan?.status);
  if(scanExact && scanStatus.includes("歷史恢復已完成選股寫入")){
    return {
      status:"STAGED_HISTORICAL_RECOVERY_KV_PLAN",
      cleanIndependentDate:false,
      evidenceTier:"TIER_B_RECOVERY_KV",
      selectedCount:Number(lastScan?.selectedCount??(Array.isArray(lastScan?.stocks)?lastScan.stocks.length:0)),
      reason:"Selection persisted through staged historical recovery after the ordinary decision clock; D1 journal generation is absent."
    };
  }

  const cfgStocks=Array.isArray(currentConfig?.stocks)?currentConfig.stocks:[];
  const configExact=cfgStocks.some(x=>s(x?.closeDate)===date);
  const cfgAt=ms(currentConfig?.updatedAt);
  const postStart=ms(recoveryEvidence?.postStartedAt);
  const postEnd=ms(recoveryEvidence?.postFailedAt);
  const recoveryDate=s(recoveryEvidence?.marketDate);
  const ambiguous503=recoveryDate===date &&
    recoveryEvidence?.result==="UNCONFIRMED_503_NO_RETRY" &&
    configExact && cfgAt!==null && postStart!==null && postEnd!==null &&
    cfgAt>=postStart && cfgAt<=postEnd;

  if(ambiguous503){
    return {
      status:"AMBIGUOUS_PARTIAL_SCAN_SIDE_EFFECT",
      cleanIndependentDate:false,
      evidenceTier:"TIER_C_CONFIG_SIDE_EFFECT_TIME_LINKED",
      reason:"Config mutation occurred inside the single /api/scan POST interval that later returned an unconfirmed 503; full scan/LAST_SCAN/D1 journal completion is not proven.",
      timing:{
        postStartedAt:recoveryEvidence.postStartedAt,
        configUpdatedAt:currentConfig.updatedAt,
        postFailedAt:recoveryEvidence.postFailedAt
      }
    };
  }

  if(configExact){
    return {
      status:"MUTABLE_CONFIG_PLAN_ORIGIN_UNPROVEN",
      cleanIndependentDate:false,
      evidenceTier:"TIER_D_MUTABLE_CONFIG_ONLY",
      reason:"Current config carries the date but original write origin/generation is not exposed by loadStockConfig."
    };
  }

  return {status:"NO_PLAN_EVIDENCE",cleanIndependentDate:false,evidenceTier:"NONE"};
}
