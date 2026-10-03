const DATE=/^\d{4}-\d{2}-\d{2}$/;

export const ZERO_PICK_COMPARATOR_V0_1=Object.freeze({
  schemaVersion:"SYSTEM1_ZERO_PICK_COUNTERFACTUAL_SELECTION_V0_1",
  inputSchemaVersion:"SYSTEM1_ZERO_PICK_COUNTERFACTUAL_RANK_INPUT_V0_1",
  rankComparatorVersion:"PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30",
  orderedFields:Object.freeze([
    "postConsensusPriorityScore",
    "rewardPerRisk",
    "marketConsensusScore",
    "setupQuality",
    "sectorFlow",
    "relativeStrength",
  ]),
  finalTieField:"preSortOrdinal",
  generalMax:3,
  thousandMax:3,
  crossPoolTransfer:false,
  totalMax:6,
});

const finite=(v,field)=>{
  if(typeof v!=="number"||!Number.isFinite(v)) throw new Error("ZERO_PICK_INVALID_"+field);
  return v;
};
const text=(v,field)=>{
  const s=String(v??"").trim();
  if(!s) throw new Error("ZERO_PICK_MISSING_"+field);
  return s;
};
const instant=(v,field)=>{
  const s=text(v,field);
  const t=Date.parse(s);
  if(!Number.isFinite(t)) throw new Error("ZERO_PICK_INVALID_"+field);
  return {s,t};
};

function normalizeRow(row){
  if(row?.schemaVersion!==ZERO_PICK_COMPARATOR_V0_1.inputSchemaVersion)
    throw new Error("ZERO_PICK_INPUT_SCHEMA_MISMATCH");
  const scanDate=text(row.scanDate,"scanDate");
  if(!DATE.test(scanDate)) throw new Error("ZERO_PICK_INVALID_scanDate");
  const symbol=text(row.symbol,"symbol");
  const pool=text(row.pool,"pool");
  if(!["GENERAL","THOUSAND"].includes(pool)) throw new Error("ZERO_PICK_INVALID_pool");
  const captureGeneration=text(row.captureGeneration,"captureGeneration");
  const decision=instant(row.decisionAt,"decisionAt");
  const known=instant(row.rankingTupleKnownAt,"rankingTupleKnownAt");
  if(known.t>decision.t) throw new Error("ZERO_PICK_RANK_TUPLE_NOT_KNOWN_BY_DECISION");
  const rankComparatorVersion=text(row.rankComparatorVersion,"rankComparatorVersion");
  if(rankComparatorVersion!==ZERO_PICK_COMPARATOR_V0_1.rankComparatorVersion)
    throw new Error("ZERO_PICK_COMPARATOR_VERSION_MISMATCH");
  const rankingTupleProvenance=text(row.rankingTupleProvenance,"rankingTupleProvenance");
  const rankingTupleFingerprint=text(row.rankingTupleFingerprint,"rankingTupleFingerprint");
  const preSortOrdinal=Number(row.preSortOrdinal);
  if(!Number.isInteger(preSortOrdinal)||preSortOrdinal<0) throw new Error("ZERO_PICK_INVALID_preSortOrdinal");
  const ranking={};
  for(const field of ZERO_PICK_COMPARATOR_V0_1.orderedFields) ranking[field]=finite(row[field],field);
  return Object.freeze({
    schemaVersion:row.schemaVersion,scanDate,symbol,pool,captureGeneration,
    decisionAt:decision.s,rankingTupleKnownAt:known.s,rankComparatorVersion,
    rankingTupleProvenance,rankingTupleFingerprint,preSortOrdinal,...ranking,
  });
}

export function compareZeroPickRankRows(a,b){
  for(const field of ZERO_PICK_COMPARATOR_V0_1.orderedFields){
    const d=b[field]-a[field];
    if(d!==0) return d;
  }
  return a.preSortOrdinal-b.preSortOrdinal;
}

export function buildSystem1ZeroPickCounterfactualSelection({rows=[]}={}){
  if(!Array.isArray(rows)||rows.length===0) throw new Error("ZERO_PICK_RANK_INPUT_ROWS_REQUIRED");
  const normalized=rows.map(normalizeRow);
  const first=normalized[0];
  const symbols=new Set();
  const ordinals={GENERAL:new Set(),THOUSAND:new Set()};
  for(const row of normalized){
    if(row.scanDate!==first.scanDate||row.captureGeneration!==first.captureGeneration||row.decisionAt!==first.decisionAt)
      throw new Error("ZERO_PICK_MIXED_DECISION_GENERATION");
    if(symbols.has(row.symbol)) throw new Error("ZERO_PICK_DUPLICATE_SYMBOL");
    symbols.add(row.symbol);
    if(ordinals[row.pool].has(row.preSortOrdinal)) throw new Error("ZERO_PICK_DUPLICATE_PRESORT_ORDINAL_WITHIN_POOL");
    ordinals[row.pool].add(row.preSortOrdinal);
  }

  const ranked={};
  for(const pool of ["GENERAL","THOUSAND"]){
    ranked[pool]=normalized.filter(r=>r.pool===pool).sort(compareZeroPickRankRows);
  }
  const selectedGeneral=ranked.GENERAL.slice(0,ZERO_PICK_COMPARATOR_V0_1.generalMax);
  const selectedThousand=ranked.THOUSAND.slice(0,ZERO_PICK_COMPARATOR_V0_1.thousandMax);
  const selected=[...selectedGeneral,...selectedThousand].sort(compareZeroPickRankRows);
  const selectedSet=new Set(selected.map(r=>r.symbol));
  const unselected=normalized.filter(r=>!selectedSet.has(r.symbol));

  return Object.freeze({
    schemaVersion:ZERO_PICK_COMPARATOR_V0_1.schemaVersion,
    sourceContract:"SYSTEM1_ZERO_PICK_COUNTERFACTUAL_DATA_GAP_20261003_V0_1",
    scanDate:first.scanDate,captureGeneration:first.captureGeneration,decisionAt:first.decisionAt,
    rankComparatorVersion:first.rankComparatorVersion,
    comparator:Object.freeze({
      orderedFields:ZERO_PICK_COMPARATOR_V0_1.orderedFields,
      finalTieField:ZERO_PICK_COMPARATOR_V0_1.finalTieField,
      poolPolicy:Object.freeze({generalMax:3,thousandMax:3,crossPoolTransfer:false,totalMax:6}),
    }),
    inputN:normalized.length,
    poolCounts:Object.freeze({GENERAL:ranked.GENERAL.length,THOUSAND:ranked.THOUSAND.length}),
    selectedN:selected.length,
    selectedSymbols:Object.freeze(selected.map(r=>r.symbol)),
    selected:Object.freeze(selected.map((r,i)=>Object.freeze({
      ...r,counterfactualOverallOrdinal:i+1,
      poolRank:ranked[r.pool].findIndex(x=>x.symbol===r.symbol)+1,
    }))),
    unselectedSymbols:Object.freeze(unselected.map(r=>r.symbol)),
    status:"COUNTERFACTUAL_SELECTION_RESEARCH_ONLY",
    cashBenchmarkReady:false,
    allocationAuthorized:false,
    executionAuthorized:false,
    outcomeInferenceAuthorized:false,
    economicSuperiority:"UNKNOWN",
    formalOptimizationCandidate:"NONE",
    autoSwitchAuthorized:false,
    formalCoreLocked:true,
    researchOnly:true,
    decisionImpact:false,
    formalCoreImpact:false,
    noTrade:true,
    noPush:true,
  });
}
