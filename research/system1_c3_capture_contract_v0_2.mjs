import {createHash} from "node:crypto";

export const C3_CAPTURE_SLOTS_V0_2=Object.freeze([
  "09:00","09:15","09:30","09:45","10:00","10:15","10:30","10:45","11:00",
  "11:15","11:30","11:45","12:00","12:15","12:30","12:45","13:00"
]);
export const C3_CALLS_PER_SYMBOL_PER_SLOT_V0_2=2;

const sha=x=>createHash("sha256").update(String(x)).digest("hex");
function verifyLedger(c2){
  if(c2?.schemaVersion!=="SYSTEM1_C2_PAIRED_LEDGER_V0_1"||c2?.completeMatchedCohort!==true||
     c2?.researchOnly!==true||c2?.formalCoreLocked!==true||!c2?.generationId||
     !Array.isArray(c2?.pairs)||c2.pairs.length!==c2?.tally?.populationN) throw new Error("C3_V02_VERIFIED_C2_REQUIRED");
  return c2;
}
function classification(pair){
  const missing=Array.isArray(pair?.short?.missingSafety)?pair.short.missingSafety:[];
  if(pair?.short?.gateStatus==="PASS"&&missing.length===0) return "FULL_SHORT_PASS";
  if(pair?.short?.withoutSafetyGateStatus==="PASS"&&pair?.short?.gateStatus==="UNKNOWN"&&missing.length>0)
    return "CONDITIONAL_SAFETY_UNKNOWN";
  return null;
}
function sample(rows,n,seed){
  return rows.map(row=>({row,key:sha([seed,row.pool,row.classification,row.symbol].join("|"))}))
    .sort((a,b)=>a.key.localeCompare(b.key)||a.row.symbol.localeCompare(b.row.symbol)).slice(0,n).map(x=>x.row);
}
export function buildC3ResearchCaptureContractV02(c2Ledger,{
  formalSymbols=[],maxShadowSymbols=3,sampleSeed="SYSTEM1_C3_CAPTURE_V0_2",
  providerBudgetCallsPerSession=102,includeConditionalSafetyUnknown=true
}={}){
  const c2=verifyLedger(c2Ledger);
  if(!Number.isInteger(maxShadowSymbols)||maxShadowSymbols<1||maxShadowSymbols>3) throw new Error("C3_V02_MAX_SHADOW_SYMBOLS_1_TO_3_REQUIRED");
  const formalList=(formalSymbols||[]).map(x=>String(x)).filter(Boolean),formal=new Set(formalList);
  if(formal.size!==formalList.length) throw new Error("C3_V02_DUPLICATE_FORMAL_SYMBOL");
  const eligible=c2.pairs.map(pair=>({
    symbol:String(pair.symbol),pool:pair.pool||"UNKNOWN",classification:classification(pair),
    formalQualified:pair?.formal?.qualified??null,formalSelected:pair?.formal?.selected??null,
    missingSafety:Array.isArray(pair?.short?.missingSafety)?[...pair.short.missingSafety]:[]
  })).filter(x=>x.classification&&(includeConditionalSafetyUnknown||x.classification==="FULL_SHORT_PASS"));
  const formalReuse=eligible.filter(x=>formal.has(x.symbol)),shadowOnly=eligible.filter(x=>!formal.has(x.symbol));
  const sampled=sample(shadowOnly,Math.min(maxShadowSymbols,shadowOnly.length),[sampleSeed,c2.generationId,c2.sessionDate].join("|"));
  const sampledSet=new Set(sampled.map(x=>x.symbol));
  const cohort=eligible.filter(x=>formal.has(x.symbol)||sampledSet.has(x.symbol)).map(x=>({
    ...x,captureSource:formal.has(x.symbol)?"REUSE_FORMAL_PV_CAPTURE":"EXTRA_RESEARCH_CANDLE_QUOTE_CAPTURE",
    formalMonitoringTarget:formal.has(x.symbol),tradingAuthority:false,signalAuthority:false,pushAuthority:false,allocationAuthority:false
  })).sort((a,b)=>a.captureSource.localeCompare(b.captureSource)||a.symbol.localeCompare(b.symbol));
  const candleCalls=sampled.length*C3_CAPTURE_SLOTS_V0_2.length;
  const quoteCalls=candleCalls,totalCalls=(candleCalls+quoteCalls);
  const budget=typeof providerBudgetCallsPerSession==="number"&&Number.isFinite(providerBudgetCallsPerSession)&&providerBudgetCallsPerSession>=0
    ? providerBudgetCallsPerSession:null;
  return {
    schemaVersion:"SYSTEM1_C3_RESEARCH_CAPTURE_CONTRACT_V0_2",
    generationId:c2.generationId,sessionDate:c2.sessionDate,sourceC2Fingerprint:c2.fingerprint||null,
    sampleSeed,maxShadowSymbols,includeConditionalSafetyUnknown,callsPerSymbolPerSlot:C3_CALLS_PER_SYMBOL_PER_SLOT_V0_2,
    expectedCompletedSlots:[...C3_CAPTURE_SLOTS_V0_2],
    eligibleN:eligible.length,eligibleFormalReuseN:formalReuse.length,eligibleShadowOnlyN:shadowOnly.length,
    capturedShadowOnlyN:sampled.length,shadowSamplingFraction:shadowOnly.length?sampled.length/shadowOnly.length:null,
    extraCandleCallsPerSession:candleCalls,extraQuoteCallsPerSession:quoteCalls,extraProviderCallsPerSession:totalCalls,
    providerBudgetCallsPerSession:budget,providerBudgetStatus:budget===null?"UNKNOWN":totalCalls<=budget?"PASS":"FAIL",
    cohort,excludedShadowSymbols:shadowOnly.filter(x=>!sampledSet.has(x.symbol)).map(x=>x.symbol).sort(),
    noFormalTargetMutation:true,noSignalPath:true,noPushPath:true,noOrderPath:true,noCapitalPath:true,
    rawQuoteContextOnly:true,intradayDepthScoreInvented:false,boundedSampleIsNotFullDenominator:true,
    c5MustUseFullC1C2Denominator:true,missingSafetyNeverUpgradedToPass:true,economicSuperiority:"UNKNOWN",
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true
  };
}
