import { deepFreeze } from "./factor_snapshot.mjs";
import { CANONICAL_HISTORICAL_A1_VALUE_FIELDS } from "./historical_source_reconciliation_v0_1.mjs";

export const HISTORICAL_REVISION_LINEAGE_VERSION = "0.1-RESEARCH";

function text(value){
  return value==null?"":String(value).trim();
}
function timestamp(value,field){
  const out=text(value);
  if(!out||!Number.isFinite(Date.parse(out))) throw new Error(field+" must be an ISO timestamp");
  return out;
}
function value(row,camel,snake){
  return row?.[camel]!==undefined?row[camel]:row?.[snake];
}
function normalizedValue(input){
  return input===undefined?null:input;
}
function normalizeRow(row){
  if(!row||typeof row!=="object"||Array.isArray(row)) throw new Error("revision row must be an object");
  const market=text(value(row,"market","market")).toUpperCase();
  const marketDate=text(value(row,"marketDate","market_date"));
  const symbol=text(value(row,"symbol","symbol"));
  const priceSpace=text(value(row,"priceSpace","price_space")).toUpperCase();
  const canonicalKey=text(value(row,"canonicalKey","canonical_key"))
    || [market,symbol,marketDate,priceSpace].join("|");
  return {
    canonicalKey,marketDate,market,symbol,priceSpace,
    open:value(row,"open","open_price")??null,
    high:value(row,"high","high_price")??null,
    low:value(row,"low","low_price")??null,
    close:value(row,"close","close_price")??null,
    volumeShares:value(row,"volumeShares","volume_shares")??null,
    tradeValue:value(row,"tradeValue","trade_value")??null,
    transactions:value(row,"transactions","transactions")??null,
    change:value(row,"change","change_value")??null,
    sourceRowHash:text(value(row,"sourceRowHash","source_row_hash"))||null,
    availableAt:text(value(row,"availableAt","available_at"))||null,
    observedAt:text(value(row,"observedAt","observed_at"))||null,
    capturedAt:text(value(row,"capturedAt","captured_at"))||null,
    availabilityBasis:text(value(row,"availabilityBasis","availability_basis"))||null,
    pitReplayEligible:
      value(row,"pitReplayEligible","pit_replay_eligible")===true
      || value(row,"pitReplayEligible","pit_replay_eligible")===1
      || value(row,"pitReplayEligible","pit_replay_eligible")==="1",
    barHash:text(value(row,"barHash","bar_hash"))||null,
  };
}
function canonicalIdentity(row){
  const out={};
  for(const field of CANONICAL_HISTORICAL_A1_VALUE_FIELDS) out[field]=normalizedValue(row?.[field]);
  return out;
}
function sameCanonical(left,right){
  return CANONICAL_HISTORICAL_A1_VALUE_FIELDS.every(
    (field)=>Object.is(normalizedValue(left?.[field]),normalizedValue(right?.[field])),
  );
}
function buildUniqueMap(rows,label){
  const map=new Map();
  for(const raw of rows||[]){
    const row=normalizeRow(raw);
    if(!/^\d{4}-\d{2}-\d{2}\|[1-9][0-9]{3}$/.test(row.marketDate+"|"+row.symbol)){
      throw new Error(label+" row key invalid: "+row.marketDate+"|"+row.symbol);
    }
    const key=row.marketDate+"|"+row.symbol;
    if(map.has(key)) throw new Error("duplicate "+label+" row key: "+key);
    map.set(key,row);
  }
  return map;
}

export function selectHistoricalRevisionAsOfV0_1({
  rows=[],
  decisionTimestamp,
}={}){
  const clock=timestamp(decisionTimestamp,"decisionTimestamp");
  if(!Array.isArray(rows)) throw new Error("rows must be an array");
  const normalized=rows.map(normalizeRow);
  const eligible=normalized.filter((row)=>
    row.pitReplayEligible
    && row.availableAt
    && Number.isFinite(Date.parse(row.availableAt))
    && Date.parse(row.availableAt)<=Date.parse(clock)
  );
  if(!eligible.length) return null;
  const latestAvailableAt=eligible
    .map((row)=>row.availableAt)
    .sort((a,b)=>Date.parse(a)-Date.parse(b))
    .at(-1);
  const latest=eligible.filter((row)=>Date.parse(row.availableAt)===Date.parse(latestAvailableAt));
  const hashes=[...new Set(latest.map((row)=>row.barHash).filter(Boolean))];
  if(hashes.length>1){
    throw new Error("REVISION_AMBIGUITY_AT_SAME_AVAILABILITY: "+latest[0]?.canonicalKey);
  }
  latest.sort((a,b)=>
    String(a.observedAt||"").localeCompare(String(b.observedAt||""))
    || String(a.capturedAt||"").localeCompare(String(b.capturedAt||""))
    || String(a.barHash||"").localeCompare(String(b.barHash||""))
  );
  return deepFreeze({...latest.at(-1)});
}

export function evaluateHistoricalRevisionLineageV0_1({
  coldRows=[],
  freshOfficialRows=[],
  persistedRows=[],
  sampleLimit=100,
}={}){
  if(!Array.isArray(coldRows)||!Array.isArray(freshOfficialRows)||!Array.isArray(persistedRows)){
    throw new Error("coldRows, freshOfficialRows and persistedRows must be arrays");
  }
  if(!Number.isInteger(sampleLimit)||sampleLimit<1||sampleLimit>1000){
    throw new Error("sampleLimit must be an integer from 1 to 1000");
  }
  const cold=buildUniqueMap(coldRows,"cold");
  const fresh=buildUniqueMap(freshOfficialRows,"fresh");
  const persistedByKey=new Map();
  for(const raw of persistedRows){
    const row=normalizeRow(raw);
    const key=row.marketDate+"|"+row.symbol;
    if(!persistedByKey.has(key)) persistedByKey.set(key,[]);
    persistedByKey.get(key).push(row);
  }

  const changedKeys=[];
  for(const [key,freshRow] of fresh){
    const coldRow=cold.get(key);
    if(!coldRow) continue;
    if(!sameCanonical(coldRow,freshRow)||coldRow.sourceRowHash!==freshRow.sourceRowHash){
      changedKeys.push(key);
    }
  }

  const blockers=[];
  const cases=[];
  let canonicalChangeCount=0;
  let sourceRevisionOnlyCount=0;
  for(const key of changedKeys.sort()){
    const coldRow=cold.get(key);
    const freshRow=fresh.get(key);
    const canonicalChanged=!sameCanonical(coldRow,freshRow);
    if(canonicalChanged) canonicalChangeCount+=1;
    else sourceRevisionOnlyCount+=1;
    const versions=persistedByKey.get(key)||[];
    const baselineCandidates=versions.filter((row)=>
      row.sourceRowHash===coldRow.sourceRowHash
      && sameCanonical(row,coldRow)
      && row.pitReplayEligible
      && row.availableAt
      && row.availabilityBasis==="SESSION_CLOSE_FINALITY"
    );
    const revisedCandidates=versions.filter((row)=>
      row.sourceRowHash===freshRow.sourceRowHash
      && sameCanonical(row,freshRow)
      && row.pitReplayEligible
      && row.availableAt
      && row.observedAt
      && row.availabilityBasis==="PROSPECTIVE_OBSERVATION"
      && Date.parse(row.availableAt)===Date.parse(row.observedAt)
    );

    const caseBlockers=[];
    if(!baselineCandidates.length) caseBlockers.push("REVISION_BASELINE_VERSION_MISSING");
    if(!revisedCandidates.length) caseBlockers.push("REVISION_REVISED_VERSION_MISSING");

    baselineCandidates.sort((a,b)=>Date.parse(a.availableAt)-Date.parse(b.availableAt));
    revisedCandidates.sort((a,b)=>Date.parse(a.availableAt)-Date.parse(b.availableAt));
    const baseline=baselineCandidates[0]||null;
    const revised=revisedCandidates[0]||null;

    if(baseline&&revised){
      if(Date.parse(revised.availableAt)<=Date.parse(baseline.availableAt)){
        caseBlockers.push("REVISION_AVAILABLE_AT_NOT_AFTER_BASELINE");
      }else{
        const preClock=new Date(Date.parse(revised.availableAt)-1).toISOString();
        const postClock=revised.availableAt;
        let pre=null;
        let post=null;
        try{
          pre=selectHistoricalRevisionAsOfV0_1({rows:versions,decisionTimestamp:preClock});
          post=selectHistoricalRevisionAsOfV0_1({rows:versions,decisionTimestamp:postClock});
        }catch(error){
          caseBlockers.push(String(error?.message||error).split(":")[0]);
        }
        if(!pre||pre.sourceRowHash!==coldRow.sourceRowHash){
          caseBlockers.push("PRE_REVISION_ASOF_DOES_NOT_SELECT_BASELINE");
        }
        if(!post||post.sourceRowHash!==freshRow.sourceRowHash){
          caseBlockers.push("POST_REVISION_ASOF_DOES_NOT_SELECT_REVISED");
        }
      }
    }

    if(caseBlockers.length) blockers.push(...caseBlockers.map((code)=>key+"|"+code));
    cases.push(deepFreeze({
      key,
      canonicalChanged,
      coldSourceRowHash:coldRow.sourceRowHash,
      freshSourceRowHash:freshRow.sourceRowHash,
      baselineAvailableAt:baseline?.availableAt||null,
      revisedAvailableAt:revised?.availableAt||null,
      baselineBarHash:baseline?.barHash||null,
      revisedBarHash:revised?.barHash||null,
      blockers:Object.freeze([...new Set(caseBlockers)]),
      state:caseBlockers.length?"BLOCKED":"PIT_REVISION_LINEAGE_READY",
    }));
  }

  const uniqueBlockers=[...new Set(blockers)];
  const ready=changedKeys.length>0&&uniqueBlockers.length===0;
  return deepFreeze({
    state:ready?"PIT_REVISION_LINEAGE_READY":changedKeys.length?"PIT_REVISION_LINEAGE_BLOCKED":"NO_SOURCE_REVISION",
    changedKeyCount:changedKeys.length,
    canonicalA1ChangeCount:canonicalChangeCount,
    sourceRevisionOnlyCount,
    persistedRevisionRowCount:persistedRows.length,
    readyKeyCount:cases.filter((x)=>x.state==="PIT_REVISION_LINEAGE_READY").length,
    blockedKeyCount:cases.filter((x)=>x.state!=="PIT_REVISION_LINEAGE_READY").length,
    blockerCount:uniqueBlockers.length,
    blockerSample:Object.freeze(uniqueBlockers.slice(0,sampleLimit)),
    caseSample:Object.freeze(cases.slice(0,sampleLimit)),
    pitRevisionLineageReady:ready,
    coldHistoryMutated:false,
    revisedHistoryOverwroteBaseline:false,
    revisionSelectionPolicy:"LATEST_AVAILABLE_AT_FAIL_CLOSED_ON_SAME_AVAILABILITY_CONFLICT",
    schemaVersion:"S2_HISTORICAL_REVISION_LINEAGE_V0_1",
  });
}
