// Correlation/covariance data-readiness firewall v0.1 — research-only.
// Prevents RAW+UNVERIFIED historical closes from being treated as return-continuity-safe.

function t(v){return String(v??"").trim().toUpperCase()}
function n(v){const x=Number(v);return Number.isFinite(x)?x:null}

export function classifyCorrelationPanelEligibility(rows=[],{
  minCommonObservations=20,
  synchronizedDates=true,
  historicalUniverseProven=false,
  frozenReturnDefinition=false
}={}){
  if(!Array.isArray(rows)||rows.length===0) return {status:"NOT_READY",reasons:["NO_ROWS"]};
  const reasons=[];
  const bad=[];
  for(const r of rows){
    const ps=t(r?.priceSpace??r?.price_space);
    const cs=t(r?.continuityState??r?.continuity_state);
    const pit=Boolean(r?.pitReplayEligible??r?.pit_replay_eligible);
    if(!pit) bad.push("PIT_NOT_ELIGIBLE");
    if(ps==="ADJUSTED"){
      if(!["ADJUSTED_CONTINUITY","CLEAR_NO_ACTION"].includes(cs)) bad.push("ADJUSTED_CONTINUITY_NOT_PROVEN");
    }else if(ps==="RAW"){
      if(cs!=="CLEAR_NO_ACTION") bad.push("RAW_CONTINUITY_NOT_PROVEN");
    }else bad.push("PRICE_SPACE_UNKNOWN");
  }
  reasons.push(...new Set(bad));
  if(!synchronizedDates) reasons.push("SYNCHRONIZED_DATE_SUPPORT_NOT_PROVEN");
  if(!historicalUniverseProven) reasons.push("HISTORICAL_UNIVERSE_PROVENANCE_MISSING");
  if(!frozenReturnDefinition) reasons.push("RETURN_DEFINITION_NOT_FROZEN");
  const common=n(minCommonObservations);
  if(!(common>=20)) reasons.push("MIN_COMMON_OBSERVATIONS_TOO_LOW");
  return {
    status:reasons.length?"NOT_READY":"CORRELATION_RESEARCH_ELIGIBLE",
    reasons:[...new Set(reasons)],
    semantics:"Eligibility for correlation/covariance research only. Does not validate any correlation estimate, shrinkage method, clustering rule, or Effective Bets decomposition."
  };
}
