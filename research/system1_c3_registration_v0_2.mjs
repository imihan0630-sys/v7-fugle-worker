import {buildC3ResearchCaptureContractV02} from "./system1_c3_capture_contract_v0_2.mjs";
const HEX64=/^[0-9a-f]{64}$/i;
function c1(c1){
  const r=c1?.receipt;
  if(c1?.schemaVersion!=="SYSTEM1_C1_EVIDENCE_ARTIFACT_V0_1"||c1?.summary?.coverageComplete!==true||
     c1?.safety?.researchOnly!==true||!r?.generationId||!r?.sessionDate||
     !HEX64.test(String(r.contentDigest||""))||!HEX64.test(String(r.universeDigest||"")))
    throw new Error("C3_V02_VERIFIED_C1_ARTIFACT_REQUIRED");
  return r;
}
function c2(c2,r){
  if(c2?.schemaVersion!=="SYSTEM1_C2_PAIRED_LEDGER_V0_1"||c2?.completeMatchedCohort!==true||
     c2?.researchOnly!==true||c2?.formalCoreLocked!==true||!HEX64.test(String(c2?.fingerprint||""))||
     c2.generationId!==r.generationId||c2.sessionDate!==r.sessionDate||
     !Array.isArray(c2.pairs)||c2.pairs.length!==c2?.tally?.populationN) throw new Error("C3_V02_MATCHED_C2_ARTIFACT_REQUIRED");
  return c2;
}
export function formalSymbolsV02(config){
  const symbols=(Array.isArray(config?.stocks)?config.stocks:[]).map(x=>String(x?.symbol||"").trim()).filter(Boolean);
  if(new Set(symbols).size!==symbols.length) throw new Error("C3_V02_DUPLICATE_FORMAL_SYMBOL");
  return symbols;
}
export function buildC3RegistrationV02(c1Artifact,c2Artifact,config,{
  maxShadowSymbols=3,providerBudgetCallsPerSession=102,includeConditionalSafetyUnknown=true,
  sampleSeed="SYSTEM1_C3_CAPTURE_V0_2"
}={}){
  const receipt=c1(c1Artifact),paired=c2(c2Artifact,receipt),formalSymbols=formalSymbolsV02(config);
  const contract=buildC3ResearchCaptureContractV02(paired,{formalSymbols,maxShadowSymbols,providerBudgetCallsPerSession,
    includeConditionalSafetyUnknown,sampleSeed});
  if(contract.providerBudgetStatus!=="PASS") throw new Error("C3_V02_PROVIDER_BUDGET_NOT_PASS");
  const extra=contract.cohort.filter(x=>x.captureSource==="EXTRA_RESEARCH_CANDLE_QUOTE_CAPTURE");
  const base={
    schemaVersion:"SYSTEM1_C3_REGISTRATION_V0_2",generationId:receipt.generationId,sessionDate:receipt.sessionDate,
    sourceC1ContentDigest:receipt.contentDigest,sourceC1UniverseDigest:receipt.universeDigest,sourceC2Fingerprint:paired.fingerprint,
    formalSymbolsN:formalSymbols.length,eligibleN:contract.eligibleN,eligibleFormalReuseN:contract.eligibleFormalReuseN,
    eligibleShadowOnlyN:contract.eligibleShadowOnlyN,extraShadowN:extra.length,excludedShadowN:contract.excludedShadowSymbols.length,
    maxShadowSymbols,providerBudgetCallsPerSession,requiredExtraCandleCalls:contract.extraCandleCallsPerSession,
    requiredExtraQuoteCalls:contract.extraQuoteCallsPerSession,requiredExtraProviderCalls:contract.extraProviderCallsPerSession,
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,noFormalTargetMutation:true,noSignalPath:true,noPushPath:true,
    noOrderPath:true,noCapitalPath:true,noPlanChanges:true,noTrade:true,noPush:true
  };
  if(!extra.length) return {...base,status:"NO_SHADOW_ONLY_COHORT",postRequired:false,payload:null};
  return {...base,status:"READY_TO_REGISTER",postRequired:true,payload:{
    schemaVersion:"SYSTEM1_C3_RESEARCH_CAPTURE_CONTRACT_V0_2",generationId:receipt.generationId,sessionDate:receipt.sessionDate,
    sourceC1ContentDigest:receipt.contentDigest,sourceC1UniverseDigest:receipt.universeDigest,sourceC2Fingerprint:paired.fingerprint,
    maxShadowSymbols,providerBudgetCallsPerSession,
    symbols:extra.map(x=>({symbol:x.symbol,pool:x.pool,classification:x.classification})),
    researchOnly:true,noFormalTargetMutation:true,noSignalPath:true,noPushPath:true,noOrderPath:true,noCapitalPath:true
  }};
}
