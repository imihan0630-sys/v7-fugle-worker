import { deepFreeze } from "./factor_snapshot.mjs";

export const BOUNDED_REVISION_QUERY_INTEGRITY_VERSION="0.4-RESEARCH";

function key(r){return [r?.date||"",r?.time||"",r?.seqNo||""].join("|");}
function uniqSorted(rows=[]){return [...new Set(rows.map(key))].sort();}
function same(a,b){return a.length===b.length&&a.every((x,i)=>x===b[i]);}

export function diagnoseBoundedRevisionQueryIntegrityV0_4({
  allSnapshots=[],
  monthRows=[],
  transportReady=true,
  noPaginationHint=true,
}={}){
  if(!Array.isArray(allSnapshots)||allSnapshots.length<2) throw new Error("at least two allSnapshots are required");
  const sets=allSnapshots.map(uniqSorted);
  const month=uniqSorted(monthRows);
  const stableAllSnapshots=sets.slice(1).every(x=>same(sets[0],x));
  const a=new Set(sets[0]),m=new Set(month);
  const onlyAll=sets[0].filter(x=>!m.has(x));
  const onlyMonth=month.filter(x=>!a.has(x));
  let state;
  if(transportReady!==true) state="TRANSPORT_NOT_READY";
  else if(noPaginationHint!==true) state="PAGINATION_HINT_OBSERVED";
  else if(!stableAllSnapshots) state="ALL_QUERY_NONDETERMINISTIC";
  else if(onlyAll.length===0&&onlyMonth.length===0) state="EXACT_KEYSET_RECONCILIATION";
  else if(onlyAll.length>0&&onlyMonth.length===0) state="ALL_QUERY_SUPERSET";
  else if(onlyAll.length===0&&onlyMonth.length>0) state="MONTH_SHARD_SUPERSET";
  else state="BIDIRECTIONAL_KEYSET_MISMATCH";
  return deepFreeze({
    schemaVersion:"S2_BOUNDED_REVISION_QUERY_INTEGRITY_V0_4",
    version:BOUNDED_REVISION_QUERY_INTEGRITY_VERSION,
    state,
    allSnapshotCounts:Object.freeze(sets.map(x=>x.length)),
    monthUnionCount:month.length,
    stableAllSnapshots,
    onlyAll:Object.freeze(onlyAll),
    onlyMonth:Object.freeze(onlyMonth),
    exactKeysetReconciliation:state==="EXACT_KEYSET_RECONCILIATION",
    queryIntegrityCertified:state==="EXACT_KEYSET_RECONCILIATION",
    revisionCoverageComplete:false,
    knownAtVersionClockCertified:false,
    technicalContinuityCertified:false,
    tradingAuthority:false,
  });
}
