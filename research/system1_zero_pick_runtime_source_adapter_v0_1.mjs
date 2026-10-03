const DATE=/^\d{4}-\d{2}-\d{2}$/;

export const ZERO_PICK_RUNTIME_SOURCE_ADAPTER_V0_1=Object.freeze({
  schemaVersion:"SYSTEM1_ZERO_PICK_RUNTIME_SOURCE_ADAPTER_V0_1",
  outputSchemaVersion:"SYSTEM1_ZERO_PICK_RANK_OBSERVER_SOURCE_V0_1",
  knownAtSemantics:"REQUEST_LOCAL_KNOWN_BY_DECISION_AT_UPPER_BOUND",
  consensusPolicy:"EXACT_SCAN_DATE_ONLY",
  newProviderCalls:0,
});

const reqText=(v,field)=>{
  const s=String(v??"").trim();
  if(!s) throw new Error("ZERO_PICK_RUNTIME_SOURCE_MISSING_"+field);
  return s;
};
const instant=(v,field)=>{
  const s=reqText(v,field);
  const t=Date.parse(s);
  if(!Number.isFinite(t)) throw new Error("ZERO_PICK_RUNTIME_SOURCE_INVALID_"+field);
  return {s,t};
};
const finite=v=>typeof v==="number"&&Number.isFinite(v)?v:null;
const freeze=v=>{
  if(!v||typeof v!=="object"||Object.isFrozen(v)) return v;
  for(const x of Object.values(v)) freeze(x);
  return Object.freeze(v);
};

export function buildSystem1ZeroPickObserverSourceFromRuntime({
  scanDate,
  symbol,
  pool,
  captureGeneration,
  decisionAt,
  preSortOrdinal,
  feature,
  sector,
  derived,
  consensusReference,
}={}){
  const date=reqText(scanDate,"scanDate");
  if(!DATE.test(date)) throw new Error("ZERO_PICK_RUNTIME_SOURCE_INVALID_scanDate");
  const sym=reqText(symbol,"symbol");
  const p=reqText(pool,"pool");
  if(!["GENERAL","THOUSAND"].includes(p)) throw new Error("ZERO_PICK_RUNTIME_SOURCE_INVALID_pool");
  const generation=reqText(captureGeneration,"captureGeneration");
  const decision=instant(decisionAt,"decisionAt");
  if(!feature||typeof feature!=="object") throw new Error("ZERO_PICK_RUNTIME_SOURCE_FEATURE_ROW_REQUIRED");
  if(!sector||typeof sector!=="object") throw new Error("ZERO_PICK_RUNTIME_SOURCE_SECTOR_STATE_REQUIRED");
  if(!derived||typeof derived!=="object") throw new Error("ZERO_PICK_RUNTIME_SOURCE_DERIVED_STATE_REQUIRED");

  const observedConsensusDate=consensusReference?.marketDate==null?null:String(consensusReference.marketDate);
  const exactConsensus=observedConsensusDate===date;
  let consensusUpdatedAt=null;
  if(exactConsensus&&consensusReference?.updatedAt!=null&&String(consensusReference.updatedAt).trim()!==""){
    const parsed=instant(consensusReference.updatedAt,"consensusReference.updatedAt");
    if(parsed.t>decision.t) throw new Error("ZERO_PICK_RUNTIME_SOURCE_CONSENSUS_UPDATED_AFTER_DECISION");
    consensusUpdatedAt=parsed.s;
  }

  let sourceCount=0;
  if(exactConsensus){
    const raw=consensusReference?.bySymbol?.[sym]?.sourceCount;
    if(raw!==null&&raw!==undefined&&raw!==""){
      const n=Number(raw);
      sourceCount=Number.isInteger(n)&&n>=0?n:null;
    }
  }

  const output={
    schemaVersion:ZERO_PICK_RUNTIME_SOURCE_ADAPTER_V0_1.outputSchemaVersion,
    scanDate:date,
    symbol:sym,
    pool:p,
    captureGeneration:generation,
    decisionAt:decision.s,
    preSortOrdinal,
    sourceKnownAt:{
      feature:decision.s,
      sector:decision.s,
      consensus:decision.s,
    },
    sourceKnownAtProvenance:{
      feature:"REQUEST_LOCAL_FEATURE_PRESENT_BEFORE_C1_DECISION_STAMP",
      sector:"REQUEST_LOCAL_SECTOR_STATE_PRESENT_BEFORE_C1_DECISION_STAMP",
      consensus:exactConsensus
        ?"REQUEST_LOCAL_EXACT_DATE_CONSENSUS_PRESENT_BEFORE_C1_DECISION_STAMP"
        :"REQUEST_LOCAL_NO_EXACT_DATE_CONSENSUS_AT_DECISION",
      semantics:ZERO_PICK_RUNTIME_SOURCE_ADAPTER_V0_1.knownAtSemantics,
      notSourceEventTime:true,
    },
    sourceEventAt:{
      consensusReferenceUpdatedAt:consensusUpdatedAt,
      featureSourceEventAt:null,
      sectorSourceEventAt:null,
    },
    marketConsensusState:exactConsensus?"EXACT_DATE_REFERENCE":"ABSENT_OR_WRONG_DATE_AT_DECISION",
    marketConsensusReferenceDate:exactConsensus?date:null,
    consensusObservedReferenceDate:observedConsensusDate,
    observed:{
      rewardPerRisk:finite(derived.rewardPerRisk),
      setupQuality:finite(derived.setupQuality),
      sectorFlow:finite(sector.score),
      ret20:finite(feature.ret20),
      marketReturn20:finite(feature.marketReturn20),
      institutionalScore:finite(derived.institutionalScore),
      fundamentalScore:finite(derived.fundamentalScore),
      marketConsensusSourceCount:sourceCount,
    },
    runtimeProvenance:{
      sameSelectorRequest:true,
      sameScanOnly:true,
      laterRepairAllowed:false,
      historicalBackfillAllowed:false,
      actualFormalRank:false,
      researchOnly:true,
      decisionImpact:false,
      formalCoreImpact:false,
      newProviderCalls:0,
    }
  };
  return freeze(output);
}
