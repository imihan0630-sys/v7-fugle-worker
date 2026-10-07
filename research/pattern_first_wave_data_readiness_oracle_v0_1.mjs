// D01 DL-088~090 data readiness oracle v0.1
export function classifyMarketYear(row={}){
  if(row.dataCoverageState!=="PASS") return {status:"RAW_DATA_NOT_ACCEPTED"};
  if(row.pitReadiness!=="PASS_CONSERVATIVE_SESSION_FINALITY") return {status:"PIT_RAW_BLOCKED"};
  const raw="RAW_PRICE_ACCEPTED";
  if(row.replayReadinessState!=="PASS"||row.continuityReadiness!=="PASS"||row.technicalPriceReadiness!=="PASS"||row.symbolSessionReadiness!=="PASS")
    return {status:"RAW_PRICE_ACCEPTED_CAUSAL_REPLAY_PARTIAL",raw};
  return {status:"CAUSAL_REPLAY_READY",raw};
}
export function validateTwseBoundedYears(rows=[]){
  const required=[2018,2019,2020,2021,2022,2023,2024];
  for(const y of required){
    const r=rows.find(x=>x.market==="TWSE"&&x.year===y);
    if(!r||r.dataCoverageState!=="PASS") return {status:"TWSE_RAW_YEAR_MISSING",year:y};
    if(r.universeReadiness!=="PASS_OFFICIAL_CURRENT_NEWLISTING_DELISTING_UNION"||r.officialDelistingUnionComplete!==true)
      return {status:"TWSE_UNIVERSE_NOT_READY",year:y};
  }
  return {status:"TWSE_BOUNDED_RAW_AND_UNIVERSE_READY",years:required};
}
export function validateFullTaiwanPrimary(rows=[]){
  const tpex2024=rows.find(x=>x.market==="TPEX"&&x.year===2024);
  const tpexUniverseOk=rows.filter(x=>x.market==="TPEX"&&x.year>=2018&&x.year<=2023)
    .every(x=>x.officialDelistingUnionComplete===true);
  if(!tpex2024||tpex2024.dataCoverageState!=="PASS") return {status:"FULL_TAIWAN_BLOCKED_TPEX_2024"};
  if(!tpexUniverseOk) return {status:"FULL_TAIWAN_BLOCKED_TPEX_UNIVERSE"};
  return {status:"FULL_TAIWAN_RAW_UNIVERSE_READY"};
}
export function validateCausalReceipts(r={}){
  const keys=["membership","rawA1","symbolSession","corporateAction","priceLimit","disposition","observability","lineage","outcomeAvailability","d16Policy"];
  const missing=keys.filter(k=>r[k]!==true);
  return {status:missing.length?"CAUSAL_OOS_BLOCKED":"CAUSAL_OOS_READY",missing};
}
export function validateFoldPlan({warmupYear,folds=[],finalHoldoutYear,outcomeHorizons=[]}={}){
  if(warmupYear!==2018||finalHoldoutYear!==2024)return {status:"FOLD_PLAN_DRIFT"};
  const expected=JSON.stringify([
    {train:[2019,2020,2021],test:2022,minPurgeEligibleSessions:20},
    {train:[2019,2020,2021,2022],test:2023,minPurgeEligibleSessions:20}
  ]);
  if(JSON.stringify(folds)!==expected)return {status:"FOLD_PLAN_DRIFT"};
  if([...outcomeHorizons].sort((a,b)=>a-b).join(",")!=="1,5,20")return {status:"HORIZON_DRIFT"};
  return {status:"FROZEN_PLAN_VALID"};
}
export function classifyModuleReadiness({moduleId,rawFeatureReady,causalReceiptsReady}={}){
  if(!["D01-02","D01-03","D01-07","D01-09"].includes(moduleId))return {status:"MODULE_OUTSIDE_FIRST_WAVE"};
  if(rawFeatureReady!==true)return {status:"RAW_FEATURE_BLOCKED"};
  return {status:causalReceiptsReady===true?"OOS_EXECUTION_ELIGIBLE":"RAW_FEATURE_READY_CAUSAL_OOS_BLOCKED"};
}
