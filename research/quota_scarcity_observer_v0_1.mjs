import {classifyShadowSemanticPopulation} from "./shadow_semantic_classifier_v0_1.mjs";

const POOLS=["GENERAL","THOUSAND"];
const QUOTA=3;
const COMPARATOR_KEYS=["priorityScore","rewardPerRisk","marketConsensusScore","setupQuality","sectorFlow","relativeStrength"];

function tuple(row){
  return Object.fromEntries(COMPARATOR_KEYS.map(k=>[k,row?.ranking?.[k]??null]));
}

export function observeQuotaScarcity({
  scanDate,
  decisionStates=[],
  completeSameScanPopulation=false
}={}){
  if(completeSameScanPopulation!==true) return {
    schemaVersion:"quota-scarcity-observer-v0.1",
    scanDate:String(scanDate||""),
    state:"UNKNOWN_INCOMPLETE_PARENT",
    comparatorVersion:"PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30",
    pools:null,
    crossPoolStranding:null,
    researchOnly:true,formalCoreImpact:false
  };

  const population=classifyShadowSemanticPopulation({scanDate,decisionStates});
  const pools={};
  let invariantViolation=false;

  for(const pool of POOLS){
    const qualified=population.rows
      .filter(r=>r.pool===pool && r.formalOk===true)
      .sort((a,b)=>(a.formalPoolRank??Infinity)-(b.formalPoolRank??Infinity));
    const selected=qualified.filter(r=>r.selected===true);
    const expectedSelectedRanks=Array.from({length:Math.min(QUOTA,qualified.length)},(_,i)=>i+1);
    const observedSelectedRanks=selected.map(r=>r.formalPoolRank).sort((a,b)=>a-b);
    const selectedRanksMatch=JSON.stringify(expectedSelectedRanks)===JSON.stringify(observedSelectedRanks);
    if(!selectedRanksMatch) invariantViolation=true;

    const qualifiedCount=qualified.length;
    const selectedCount=selected.length;
    const quotaState=qualifiedCount<QUOTA?"GATE_LIMITED":qualifiedCount===QUOTA?"EXACTLY_FILLED":"QUOTA_BINDING";
    const rank4Plus=qualified.filter(r=>(r.formalPoolRank??0)>QUOTA).map(r=>({
      symbol:r.symbol,rank:r.formalPoolRank,selected:r.selected===true,comparatorTuple:tuple(r)
    }));

    pools[pool]={
      quota:QUOTA,
      qualifiedCount,
      selectedCount,
      unusedSlots:Math.max(0,QUOTA-selectedCount),
      quotaState,
      quotaBinding:qualifiedCount>QUOTA,
      selectedRanksMatchDeployedTopN:selectedRanksMatch,
      expectedSelectedRanks,
      observedSelectedRanks,
      cutlineSelected:qualifiedCount>=QUOTA?{
        symbol:qualified[QUOTA-1].symbol,
        rank:QUOTA,
        comparatorTuple:tuple(qualified[QUOTA-1])
      }:null,
      cutlineNext:qualifiedCount>QUOTA?{
        symbol:qualified[QUOTA].symbol,
        rank:QUOTA+1,
        comparatorTuple:tuple(qualified[QUOTA])
      }:null,
      rank4Plus
    };
  }

  const general=pools.GENERAL,thousand=pools.THOUSAND;
  const crossPoolStranding=
    (general.qualifiedCount<QUOTA && thousand.qualifiedCount>QUOTA) ||
    (thousand.qualifiedCount<QUOTA && general.qualifiedCount>QUOTA);

  return {
    schemaVersion:"quota-scarcity-observer-v0.1",
    scanDate:String(scanDate||""),
    state:invariantViolation?"INVARIANT_VIOLATION":"COMPLETE",
    comparatorVersion:population.comparatorVersion,
    pools,
    crossPoolStranding,
    invariantViolation,
    guards:{
      parentMustBeCompleteSameScan:true,
      rank4PlusAreQualifiedNotGateRejected:true,
      noCrossPoolBackfill:true,
      comparatorIsLexicographicNoScalarMarginInvented:true,
      noOutcomeUse:true,
      formalCoreImpact:false
    },
    researchOnly:true,formalCoreImpact:false
  };
}
