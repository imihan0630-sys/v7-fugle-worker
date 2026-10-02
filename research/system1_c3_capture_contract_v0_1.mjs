import {createHash} from "node:crypto";

export const C3_CAPTURE_SLOTS=Object.freeze([
  "09:00","09:15","09:30","09:45","10:00","10:15","10:30","10:45","11:00",
  "11:15","11:30","11:45","12:00","12:15","12:30","12:45","13:00"
]);

const sha=x=>createHash("sha256").update(String(x)).digest("hex");

function verifyLedger(c2){
  if(c2?.schemaVersion!=="SYSTEM1_C2_PAIRED_LEDGER_V0_1"||
     c2?.completeMatchedCohort!==true||c2?.researchOnly!==true||
     c2?.formalCoreLocked!==true||!c2?.generationId||
     !Array.isArray(c2?.pairs)||c2.pairs.length!==c2?.tally?.populationN){
    throw new Error("C3_CAPTURE_VERIFIED_C2_REQUIRED");
  }
  return c2;
}
function classification(pair){
  const missingSafety=Array.isArray(pair?.short?.missingSafety)?pair.short.missingSafety:[];
  if(pair?.short?.gateStatus==="PASS"&&missingSafety.length===0) return "FULL_SHORT_PASS";
  if(pair?.short?.withoutSafetyGateStatus==="PASS"&&pair?.short?.gateStatus==="UNKNOWN"&&missingSafety.length>0){
    return "CONDITIONAL_SAFETY_UNKNOWN";
  }
  return null;
}
function deterministicSample(rows,n,seed){
  return rows.map(row=>({row,key:sha([seed,row.pool,row.classification,row.symbol].join("|"))}))
    .sort((a,b)=>a.key.localeCompare(b.key)||a.row.symbol.localeCompare(b.row.symbol))
    .slice(0,n).map(x=>x.row);
}

export function buildC3ResearchCaptureContract(c2Ledger,{
  formalSymbols=[],
  maxShadowSymbols,
  sampleSeed="SYSTEM1_C3_CAPTURE_V0_1",
  providerBudgetCallsPerSession=null,
  includeConditionalSafetyUnknown=true
}={}){
  const c2=verifyLedger(c2Ledger);
  if(!Number.isInteger(maxShadowSymbols)||maxShadowSymbols<1) throw new Error("C3_CAPTURE_EXPLICIT_MAX_SHADOW_SYMBOLS_REQUIRED");
  const formal=new Set((formalSymbols||[]).map(x=>String(x)).filter(Boolean));
  if(formal.size!==(formalSymbols||[]).filter(Boolean).length) throw new Error("C3_CAPTURE_DUPLICATE_FORMAL_SYMBOL");

  const eligible=c2.pairs.map(pair=>({
    symbol:String(pair.symbol),pool:pair.pool||"UNKNOWN",classification:classification(pair),
    formalQualified:pair?.formal?.qualified??null,formalSelected:pair?.formal?.selected??null,
    missingSafety:Array.isArray(pair?.short?.missingSafety)?[...pair.short.missingSafety]:[]
  })).filter(x=>x.classification&&
    (includeConditionalSafetyUnknown||x.classification==="FULL_SHORT_PASS"));

  const existingFormal=eligible.filter(x=>formal.has(x.symbol));
  const shadowOnly=eligible.filter(x=>!formal.has(x.symbol));
  const sampledShadow=deterministicSample(shadowOnly,Math.min(maxShadowSymbols,shadowOnly.length),
    [sampleSeed,c2.generationId,c2.sessionDate].join("|"));
  const shadowSet=new Set(sampledShadow.map(x=>x.symbol));

  const cohort=eligible.filter(x=>formal.has(x.symbol)||shadowSet.has(x.symbol)).map(x=>({
    ...x,
    captureSource:formal.has(x.symbol)?"REUSE_FORMAL_PV_CAPTURE":"EXTRA_RESEARCH_CANDLE_CAPTURE",
    formalMonitoringTarget:formal.has(x.symbol),
    tradingAuthority:false,signalAuthority:false,pushAuthority:false,allocationAuthority:false
  })).sort((a,b)=>a.captureSource.localeCompare(b.captureSource)||a.symbol.localeCompare(b.symbol));

  const extraCalls=sampledShadow.length*C3_CAPTURE_SLOTS.length;
  const budget=typeof providerBudgetCallsPerSession==="number"&&Number.isFinite(providerBudgetCallsPerSession)&&providerBudgetCallsPerSession>=0
    ? providerBudgetCallsPerSession
    : null;
  const budgetStatus=budget===null?"UNKNOWN":(extraCalls<=budget?"PASS":"FAIL");

  return {
    schemaVersion:"SYSTEM1_C3_RESEARCH_CAPTURE_CONTRACT_V0_1",
    generationId:c2.generationId,sessionDate:c2.sessionDate,
    sourceC2Fingerprint:c2.fingerprint||null,
    sampleSeed,maxShadowSymbols,includeConditionalSafetyUnknown,
    expectedCompletedSlots:[...C3_CAPTURE_SLOTS],
    eligibleN:eligible.length,eligibleFormalReuseN:existingFormal.length,
    eligibleShadowOnlyN:shadowOnly.length,capturedShadowOnlyN:sampledShadow.length,
    shadowSamplingFraction:shadowOnly.length?sampledShadow.length/shadowOnly.length:null,
    extraCandleCallsPerSession:extraCalls,
    providerBudgetCallsPerSession:budget,
    providerBudgetStatus:budgetStatus,
    cohort,
    excludedShadowSymbols:shadowOnly.filter(x=>!shadowSet.has(x.symbol)).map(x=>x.symbol).sort(),
    noFormalTargetMutation:true,
    noSignalPath:true,noPushPath:true,noOrderPath:true,noCapitalPath:true,
    boundedSampleIsNotFullDenominator:true,
    c5MustUseFullC1C2Denominator:true,
    missingSafetyNeverUpgradedToPass:true,
    economicSuperiority:"UNKNOWN",
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,noPlanChanges:true,noTrade:true,noPush:true
  };
}
