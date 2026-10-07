import { deepFreeze } from "./factor_snapshot.mjs";

export const HISTORICAL_SOURCE_RECONCILIATION_VERSION = "0.1-RESEARCH";
export const CANONICAL_HISTORICAL_A1_VALUE_FIELDS = Object.freeze([
  "market","marketDate","symbol","priceSpace",
  "open","high","low","close",
  "volumeShares","tradeValue","transactions","change",
]);

function rowKey(row){
  return String(row?.marketDate||"")+"|"+String(row?.symbol||"");
}
function normalizedValue(value){
  return value === undefined ? null : value;
}
function canonicalIdentity(row){
  const out={};
  for(const field of CANONICAL_HISTORICAL_A1_VALUE_FIELDS){
    out[field]=normalizedValue(row?.[field]);
  }
  return out;
}
function differingCanonicalFields(left,right){
  const fields=[];
  for(const field of CANONICAL_HISTORICAL_A1_VALUE_FIELDS){
    if(!Object.is(normalizedValue(left?.[field]),normalizedValue(right?.[field]))) fields.push(field);
  }
  return fields;
}
function buildUniqueMap(rows,label){
  if(!Array.isArray(rows)) throw new Error(label+" rows must be an array");
  const map=new Map();
  for(const row of rows){
    const key=rowKey(row);
    if(!/^\d{4}-\d{2}-\d{2}\|[1-9][0-9]{3}$/.test(key)){
      throw new Error(label+" row key invalid: "+key);
    }
    if(map.has(key)) throw new Error("duplicate "+label+" row key: "+key);
    map.set(key,row);
  }
  return map;
}

export function reconcileHistoricalSourceRowsV0_1({
  coldRows=[],
  freshOfficialRows=[],
  sampleLimit=100,
}={}){
  if(!Number.isInteger(sampleLimit)||sampleLimit<1||sampleLimit>1000){
    throw new Error("sampleLimit must be an integer from 1 to 1000");
  }
  const coldByKey=buildUniqueMap(coldRows,"cold");
  const freshByKey=buildUniqueMap(freshOfficialRows,"fresh official");

  const missingFromCold=[];
  const absentFromFreshOfficial=[];
  const sourceRowHashMismatches=[];
  const canonicalA1ValueMismatches=[];
  const sourceRevisionOnly=[];
  const sourceRevisionByDate=new Map();

  for(const [key,fresh] of freshByKey){
    const cold=coldByKey.get(key);
    if(!cold){
      missingFromCold.push(key);
      continue;
    }
    const differingFields=differingCanonicalFields(cold,fresh);
    if(differingFields.length){
      canonicalA1ValueMismatches.push({
        key,
        differingFields,
        cold:canonicalIdentity(cold),
        fresh:canonicalIdentity(fresh),
        coldSourceRowHash:cold.sourceRowHash||null,
        freshSourceRowHash:fresh.sourceRowHash||null,
      });
    }
    const sourceHashChanged=String(cold.sourceRowHash||"")!==String(fresh.sourceRowHash||"");
    if(sourceHashChanged){
      sourceRowHashMismatches.push(key);
      const date=String(fresh.marketDate);
      sourceRevisionByDate.set(date,(sourceRevisionByDate.get(date)||0)+1);
      if(differingFields.length===0){
        sourceRevisionOnly.push({
          key,
          marketDate:fresh.marketDate,
          symbol:fresh.symbol,
          coldSourceRowHash:cold.sourceRowHash||null,
          freshSourceRowHash:fresh.sourceRowHash||null,
          canonicalA1Stable:true,
        });
      }
    }
  }
  for(const key of coldByKey.keys()){
    if(!freshByKey.has(key)) absentFromFreshOfficial.push(key);
  }

  const dataIntegrityState =
    missingFromCold.length===0
    && absentFromFreshOfficial.length===0
    && canonicalA1ValueMismatches.length===0
      ? "PASS"
      : "BLOCKED";
  const sourceVersionState =
    sourceRowHashMismatches.length===0
      ? "STABLE"
      : canonicalA1ValueMismatches.length===0
        ? "SOURCE_REVISION_OBSERVED_CANONICAL_A1_STABLE"
        : "SOURCE_REVISION_WITH_CANONICAL_A1_CHANGE";
  const canonicalRevisionLineageRequired=canonicalA1ValueMismatches.length>0;
  const state=dataIntegrityState==="BLOCKED"
    ? "BLOCKED"
    : sourceRowHashMismatches.length>0
      ? "PASS_SOURCE_REVISION_OBSERVED"
      : "PASS";

  return deepFreeze({
    state,
    dataIntegrityState,
    sourceVersionState,
    canonicalRevisionLineageRequired,
    coldRowCount:coldRows.length,
    freshOfficialRowCount:freshOfficialRows.length,
    missingFromColdCount:missingFromCold.length,
    absentFromFreshOfficialCount:absentFromFreshOfficial.length,
    sourceRowHashMismatchCount:sourceRowHashMismatches.length,
    canonicalA1ValueMismatchCount:canonicalA1ValueMismatches.length,
    sourceRevisionOnlyCount:sourceRevisionOnly.length,
    sourceRevisionDateCount:sourceRevisionByDate.size,
    sourceRevisionByDate:Object.freeze(
      [...sourceRevisionByDate.entries()]
        .sort(([a],[b])=>a.localeCompare(b))
        .map(([marketDate,count])=>deepFreeze({marketDate,count}))
    ),
    missingFromColdSample:Object.freeze(missingFromCold.slice(0,sampleLimit)),
    absentFromFreshOfficialSample:Object.freeze(absentFromFreshOfficial.slice(0,sampleLimit)),
    sourceRowHashMismatchSample:Object.freeze(sourceRowHashMismatches.slice(0,sampleLimit)),
    canonicalA1ValueMismatchSample:Object.freeze(canonicalA1ValueMismatches.slice(0,sampleLimit).map(deepFreeze)),
    sourceRevisionOnlySample:Object.freeze(sourceRevisionOnly.slice(0,sampleLimit).map(deepFreeze)),
    canonicalA1ValueFields:CANONICAL_HISTORICAL_A1_VALUE_FIELDS,
    semantics:deepFreeze({
      sourceRowHashMismatch:"The official full source row changed between captures; this is preserved as source revision evidence.",
      canonicalA1ValueMismatch:"At least one canonical A1 value used by System2 changed; this reconciliation remains blocked unless a separate physically verified PIT revision-lineage contract proves immutable baseline preservation and deterministic as-of revision selection.",
      sourceRevisionOnly:"The official full source row changed while canonical A1 values remained identical; data coverage may pass but source-version lineage remains explicit.",
      canonicalRevisionLineageRequired:"Persisted PIT canonical revision rows are required only when canonical A1 values changed; source-row provenance-only changes must not trigger or manufacture a canonical overlay.",
    }),
    schemaVersion:"S2_HISTORICAL_SOURCE_RECONCILIATION_V0_1",
  });
}
