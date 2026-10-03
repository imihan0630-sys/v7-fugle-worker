import {canonicalJcsJson} from "./canonical_receipt_hash_v0_1.mjs";

const DATE=/^\d{4}-\d{2}-\d{2}$/;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const round=(x,d=1)=>Math.round(x*10**d)/10**d;

export const ZERO_PICK_RANK_OBSERVER_V0_1=Object.freeze({
  sourceSchemaVersion:"SYSTEM1_ZERO_PICK_RANK_OBSERVER_SOURCE_V0_1",
  observationSchemaVersion:"SYSTEM1_ZERO_PICK_RANK_OBSERVATION_V0_1",
  rankInputSchemaVersion:"SYSTEM1_ZERO_PICK_COUNTERFACTUAL_RANK_INPUT_V0_1",
  rankComparatorVersion:"PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30",
  priorityScoreDefinitionVersion:"FORMAL_PRIORITY_SCORE_BASE_V1_PLUS_MARKET_CONSENSUS_7_5_30",
  counterfactualFormulaVersion:"SYSTEM1_ZERO_PICK_COUNTERFACTUAL_PRIORITY_FORMULA_V0_1",
  rankingTupleProvenance:"COUNTERFACTUAL_SAME_SCAN_FORMULA_NOT_ACTUAL_FORMAL_RANK",
});

function reqText(v,field){
  const s=String(v??"").trim();
  if(!s) throw new Error("ZERO_PICK_OBSERVER_MISSING_"+field);
  return s;
}
function finite(v){return typeof v==="number"&&Number.isFinite(v)?v:null;}
function parseInstant(v,field){
  const s=reqText(v,field),t=Date.parse(s);
  if(!Number.isFinite(t)) throw new Error("ZERO_PICK_OBSERVER_INVALID_"+field);
  return {s,t};
}
function maxInstant(items){
  return items.reduce((a,b)=>b.t>a.t?b:a).s;
}
function deepFreeze(v){
  if(!v||typeof v!=="object"||Object.isFrozen(v)) return v;
  for(const x of Object.values(v)) deepFreeze(x);
  return Object.freeze(v);
}

export function buildSystem1ZeroPickRankObservation(input,hashFn){
  const cfg=ZERO_PICK_RANK_OBSERVER_V0_1;
  if(input?.schemaVersion!==cfg.sourceSchemaVersion) throw new Error("ZERO_PICK_OBSERVER_SOURCE_SCHEMA_MISMATCH");
  const scanDate=reqText(input.scanDate,"scanDate");
  if(!DATE.test(scanDate)) throw new Error("ZERO_PICK_OBSERVER_INVALID_scanDate");
  const symbol=reqText(input.symbol,"symbol");
  const pool=reqText(input.pool,"pool");
  if(!["GENERAL","THOUSAND"].includes(pool)) throw new Error("ZERO_PICK_OBSERVER_INVALID_pool");
  const captureGeneration=reqText(input.captureGeneration,"captureGeneration");
  const decision=parseInstant(input.decisionAt,"decisionAt");

  const sourceKnownAt=input.sourceKnownAt||{};
  const sourceTimes={};
  const missing=[];
  for(const k of ["feature","sector","consensus"]){
    const raw=sourceKnownAt[k];
    if(raw===null||raw===undefined||String(raw).trim()===""){missing.push("sourceKnownAt."+k);continue;}
    const p=parseInstant(raw,"sourceKnownAt."+k);
    if(p.t>decision.t) throw new Error("ZERO_PICK_OBSERVER_NON_PIT_SOURCE_"+k);
    sourceTimes[k]=p;
  }

  const observed=input.observed||{};
  const requiredNumeric=[
    "rewardPerRisk","setupQuality","sectorFlow","ret20","marketReturn20",
    "institutionalScore","fundamentalScore","marketConsensusSourceCount"
  ];
  const values={};
  for(const k of requiredNumeric){
    values[k]=finite(observed[k]);
    if(values[k]===null) missing.push(k);
  }

  const preSortOrdinal=Number(input.preSortOrdinal);
  if(!Number.isInteger(preSortOrdinal)||preSortOrdinal<0) missing.push("preSortOrdinal");

  const consensusState=reqText(input.marketConsensusState,"marketConsensusState");
  if(!["EXACT_DATE_REFERENCE","ABSENT_OR_WRONG_DATE_AT_DECISION"].includes(consensusState))
    throw new Error("ZERO_PICK_OBSERVER_INVALID_marketConsensusState");
  const consensusReferenceDate=input.marketConsensusReferenceDate===null||input.marketConsensusReferenceDate===undefined
    ? null:String(input.marketConsensusReferenceDate);
  if(consensusState==="EXACT_DATE_REFERENCE"&&consensusReferenceDate!==scanDate)
    throw new Error("ZERO_PICK_OBSERVER_CONSENSUS_DATE_MISMATCH");
  if(consensusState==="ABSENT_OR_WRONG_DATE_AT_DECISION"&&values.marketConsensusSourceCount!==null&&values.marketConsensusSourceCount!==0)
    throw new Error("ZERO_PICK_OBSERVER_ABSENT_CONSENSUS_REQUIRES_ZERO_SOURCES");
  if(values.marketConsensusSourceCount!==null&&
     (!Number.isInteger(values.marketConsensusSourceCount)||values.marketConsensusSourceCount<0))
    missing.push("marketConsensusSourceCount");

  const uniqueMissing=[...new Set(missing)].sort();
  const base={
    schemaVersion:cfg.observationSchemaVersion,scanDate,symbol,pool,captureGeneration,
    decisionAt:decision.s,rankInputStatus:uniqueMissing.length?"INCOMPLETE":"COMPLETE",
    missingFields:uniqueMissing,
    researchOnly:true,decisionImpact:false,formalCoreImpact:false,noTrade:true,noPush:true,
    actualFormalRank:false,economicSuperiority:"UNKNOWN",formalOptimizationCandidate:"NONE"
  };
  if(uniqueMissing.length) return deepFreeze({...base,rankInput:null});

  if(typeof hashFn!=="function") throw new Error("ZERO_PICK_OBSERVER_HASH_FUNCTION_REQUIRED");
  const sourceCount=values.marketConsensusSourceCount;
  const relativeStrength=values.ret20-values.marketReturn20;
  const rsComponent=clamp(50+relativeStrength*2,0,100);
  const rrComponent=clamp(values.rewardPerRisk*20,0,100);
  const preConsensusPriorityScore=round(clamp(
    values.setupQuality*.28+values.sectorFlow*.14+values.institutionalScore*.16+
    values.fundamentalScore*.14+rsComponent*.14+rrComponent*.14,0,100
  ),1);
  const marketConsensusScore=sourceCount<2?0:Math.min(100,20+sourceCount*15);
  const marketConsensusBonus=sourceCount<2?0:Math.min(7,(sourceCount-1)*2);
  const postConsensusPriorityScore=round(clamp(preConsensusPriorityScore+marketConsensusBonus,0,100),1);
  const rankingTupleKnownAt=maxInstant(Object.values(sourceTimes));

  const fingerprintPayload={
    schemaVersion:cfg.rankInputSchemaVersion,scanDate,symbol,pool,captureGeneration,
    decisionAt:decision.s,rankingTupleKnownAt,
    rankComparatorVersion:cfg.rankComparatorVersion,
    priorityScoreDefinitionVersion:cfg.priorityScoreDefinitionVersion,
    counterfactualFormulaVersion:cfg.counterfactualFormulaVersion,
    rankingTupleProvenance:cfg.rankingTupleProvenance,
    preSortOrdinal,
    postConsensusPriorityScore,
    rewardPerRisk:values.rewardPerRisk,
    marketConsensusScore,
    setupQuality:values.setupQuality,
    sectorFlow:values.sectorFlow,
    relativeStrength,
    decomposition:{
      preConsensusPriorityScore,marketConsensusSources:sourceCount,marketConsensusBonus,
      institutionalScore:values.institutionalScore,fundamentalScore:values.fundamentalScore,
      rsComponent,rrComponent,marketConsensusState:consensusState,
      marketConsensusReferenceDate:consensusReferenceDate
    }
  };
  const rankingTupleFingerprint=hashFn(canonicalJcsJson(fingerprintPayload));
  const rankInput={
    ...fingerprintPayload,
    rankingTupleFingerprint,
  };
  return deepFreeze({...base,rankInput});
}
