import {createHash} from "node:crypto";

export const ZERO_PICK_COMPARATOR_VERSION_V0_1="PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30";
export const ZERO_PICK_INPUT_SCHEMA_V0_1="SYSTEM1_P1A_COUNTERFACTUAL_RANK_INPUT_V0_1";
export const ZERO_PICK_OUTPUT_SCHEMA_V0_1="SYSTEM1_P1A_ZERO_PICK_COUNTERFACTUAL_SELECTION_V0_1";

const ORDERED_FIELDS=Object.freeze([
  "postConsensusPriorityScore",
  "rewardPerRisk",
  "marketConsensusScore",
  "setupQuality",
  "sectorFlow",
  "relativeStrength"
]);
export const ZERO_PICK_ORDERED_FIELDS_V0_1=ORDERED_FIELDS;

const finite=x=>typeof x==="number"&&Number.isFinite(x);
const iso=x=>typeof x==="string"&&Number.isFinite(Date.parse(x));
const hex64=x=>typeof x==="string"&&/^[a-f0-9]{64}$/i.test(x);
const canonicalTuple=r=>[
  r.symbol,r.pool,r.captureGeneration,r.decisionAt,r.knownAt,r.rankComparatorVersion,
  ...ORDERED_FIELDS.map(k=>r[k]),r.preSortOrdinal
];
const tupleHash=r=>createHash("sha256").update(JSON.stringify(canonicalTuple(r))).digest("hex");

function validateOne(r,identity){
  if(r?.schemaVersion!==ZERO_PICK_INPUT_SCHEMA_V0_1) throw new Error("ZERO_PICK_INPUT_SCHEMA_INVALID");
  if(r?.researchOnly!==true||r?.decisionImpact!==false) throw new Error("ZERO_PICK_INPUT_AUTHORITY_INVALID");
  if(typeof r?.symbol!=="string"||!r.symbol) throw new Error("ZERO_PICK_SYMBOL_INVALID");
  if(!["GENERAL","THOUSAND"].includes(r?.pool)) throw new Error("ZERO_PICK_POOL_INVALID");
  if(typeof r?.captureGeneration!=="string"||!r.captureGeneration) throw new Error("ZERO_PICK_GENERATION_INVALID");
  if(!iso(r?.decisionAt)||!iso(r?.knownAt)) throw new Error("ZERO_PICK_CLOCK_INVALID");
  if(Date.parse(r.knownAt)>Date.parse(r.decisionAt)) throw new Error("ZERO_PICK_NON_PIT_TUPLE");
  if(r.rankComparatorVersion!==ZERO_PICK_COMPARATOR_VERSION_V0_1) throw new Error("ZERO_PICK_COMPARATOR_VERSION_MISMATCH");
  for(const k of ORDERED_FIELDS) if(!finite(r[k])) throw new Error("ZERO_PICK_TUPLE_INCOMPLETE_"+k);
  if(!Number.isInteger(r.preSortOrdinal)||r.preSortOrdinal<0) throw new Error("ZERO_PICK_PRE_SORT_ORDINAL_INVALID");
  if(!hex64(r.rankingTupleFingerprint)||r.rankingTupleFingerprint!==tupleHash(r))
    throw new Error("ZERO_PICK_TUPLE_FINGERPRINT_MISMATCH");
  if(r.provenanceComplete!==true) throw new Error("ZERO_PICK_PROVENANCE_INCOMPLETE");
  if(identity.captureGeneration!==null&&r.captureGeneration!==identity.captureGeneration)
    throw new Error("ZERO_PICK_MIXED_GENERATION");
  if(identity.decisionAt!==null&&r.decisionAt!==identity.decisionAt)
    throw new Error("ZERO_PICK_MIXED_DECISION_CLOCK");
  identity.captureGeneration??=r.captureGeneration;
  identity.decisionAt??=r.decisionAt;
  return Object.freeze({...r});
}

export function computeZeroPickTupleFingerprintV0_1(receipt){
  return tupleHash(receipt);
}

export function compareZeroPickRankTupleV0_1(a,b){
  for(const k of ORDERED_FIELDS){
    const delta=b[k]-a[k];
    if(delta!==0) return delta;
  }
  return a.preSortOrdinal-b.preSortOrdinal;
}

export function selectP1AZeroPickCounterfactualV0_1(receipts,{poolQuota=3}={}){
  if(!Array.isArray(receipts)) throw new Error("ZERO_PICK_RECEIPTS_ARRAY_REQUIRED");
  if(!Number.isInteger(poolQuota)||poolQuota<1) throw new Error("ZERO_PICK_POOL_QUOTA_INVALID");
  const identity={captureGeneration:null,decisionAt:null};
  const rows=receipts.map(r=>validateOne(r,identity));
  if(new Set(rows.map(r=>r.symbol)).size!==rows.length) throw new Error("ZERO_PICK_DUPLICATE_SYMBOL");
  if(new Set(rows.map(r=>r.preSortOrdinal)).size!==rows.length) throw new Error("ZERO_PICK_DUPLICATE_PRE_SORT_ORDINAL");

  const byPool={GENERAL:[],THOUSAND:[]};
  for(const r of rows) byPool[r.pool].push(r);
  for(const pool of Object.keys(byPool)) byPool[pool].sort(compareZeroPickRankTupleV0_1);

  const selectedByPool={
    GENERAL:byPool.GENERAL.slice(0,poolQuota),
    THOUSAND:byPool.THOUSAND.slice(0,poolQuota)
  };
  const selected=[...selectedByPool.GENERAL,...selectedByPool.THOUSAND];
  const rejectedByQuota={
    GENERAL:byPool.GENERAL.slice(poolQuota),
    THOUSAND:byPool.THOUSAND.slice(poolQuota)
  };
  const slotSummary={
    generalAvailable:byPool.GENERAL.length,
    thousandAvailable:byPool.THOUSAND.length,
    generalSelected:selectedByPool.GENERAL.length,
    thousandSelected:selectedByPool.THOUSAND.length,
    generalUnusedSlots:Math.max(0,poolQuota-selectedByPool.GENERAL.length),
    thousandUnusedSlots:Math.max(0,poolQuota-selectedByPool.THOUSAND.length),
    crossPoolTransfer:false
  };

  return {
    schemaVersion:ZERO_PICK_OUTPUT_SCHEMA_V0_1,
    sourceDataGapContract:"SYSTEM1_ZERO_PICK_COUNTERFACTUAL_DATA_GAP_V0_1",
    rankComparatorVersion:ZERO_PICK_COMPARATOR_VERSION_V0_1,
    captureGeneration:identity.captureGeneration,
    decisionAt:identity.decisionAt,
    poolQuota,
    orderedFields:[...ORDERED_FIELDS],
    inputN:rows.length,
    selectedN:selected.length,
    selectedSymbols:selected.map(r=>r.symbol),
    selectedByPool:{
      GENERAL:selectedByPool.GENERAL.map(r=>r.symbol),
      THOUSAND:selectedByPool.THOUSAND.map(r=>r.symbol)
    },
    rankedByPool:{
      GENERAL:byPool.GENERAL.map(r=>r.symbol),
      THOUSAND:byPool.THOUSAND.map(r=>r.symbol)
    },
    rejectedByQuota:{
      GENERAL:rejectedByQuota.GENERAL.map(r=>r.symbol),
      THOUSAND:rejectedByQuota.THOUSAND.map(r=>r.symbol)
    },
    slotSummary,
    allocationAuthorized:false,
    executionAuthorized:false,
    economicConclusion:"UNKNOWN",
    formalOptimizationCandidate:"NONE",
    autoSwitchAuthorized:false,
    formalCoreLocked:true,
    researchOnly:true,
    decisionImpact:false,
    formalCoreImpact:false,
    noTrade:true,
    noPush:true
  };
}
