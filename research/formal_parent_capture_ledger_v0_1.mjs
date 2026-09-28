// Research-only capture-ledger prototype.
// Consumes already-computed Formal results and already-observed ranking order.
// It never calls scoreCandidate and never re-ranks with a comparator.

function text(value, field) {
  const s=String(value??"").trim();
  if (!s) throw new Error("MISSING_" + field);
  return s;
}

function stable(value) {
  if (value===null || typeof value==="string" || typeof value==="boolean") return value;
  if (typeof value==="number") {
    if (!Number.isFinite(value)) throw new Error("NON_FINITE_NUMBER");
    return value;
  }
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value==="object") {
    const out={};
    for (const key of Object.keys(value).sort()) {
      if (value[key]===undefined) continue;
      out[key]=stable(value[key]);
    }
    return out;
  }
  throw new Error("UNSUPPORTED_STABLE_TYPE");
}

function stableJson(value) {
  return JSON.stringify(stable(value));
}

function mapUnique(rows, label) {
  const map=new Map();
  for (let i=0;i<(Array.isArray(rows)?rows:[]).length;i+=1) {
    const row=rows[i]||{};
    const symbol=text(row.symbol,label+"_symbol@"+i);
    if (map.has(symbol)) throw new Error("DUPLICATE_"+label+"_SYMBOL:"+symbol);
    map.set(symbol,{...row,symbol});
  }
  return map;
}

function normalizedDecisionResult(row) {
  if (!row) return null;
  const copy={...row};
  delete copy.evaluationOrdinal;
  delete copy.symbol;
  return stable(copy);
}

function exactSymbolList(list,label) {
  if (!Array.isArray(list)) throw new Error(label+"_ARRAY_REQUIRED");
  const out=list.map((s,i)=>text(s,label+"@"+i));
  if (new Set(out).size!==out.length) throw new Error("DUPLICATE_"+label);
  return out;
}

function sameSet(a,b) {
  if (a.length!==b.length) return false;
  const aa=[...a].sort(),bb=[...b].sort();
  return aa.every((x,i)=>x===bb[i]);
}

export function buildFormalParentCaptureLedger({
  featureRows,
  primaryEvaluations,
  thousandEvaluations,
  poolBySymbol,
  rankedGeneralSymbols,
  rankedThousandSymbols,
  selectedSymbols,
  quotaPerFormalPool=3,
}) {
  const features=mapUnique(featureRows,"FEATURE");
  const primary=mapUnique(primaryEvaluations,"PRIMARY_EVALUATION");
  const thousand=mapUnique(thousandEvaluations,"THOUSAND_EVALUATION");

  if (primary.size!==features.size || !sameSet([...primary.keys()],[...features.keys()])) {
    throw new Error("PRIMARY_EVALUATION_KEYSET_MISMATCH");
  }

  const pools=new Map();
  for (const symbol of features.keys()) {
    const pool=text(poolBySymbol?.[symbol],"POOL_"+symbol);
    if (!["FORMAL_GENERAL","FORMAL_THOUSAND"].includes(pool)) {
      throw new Error("INVALID_FORMAL_POOL:"+symbol+":"+pool);
    }
    pools.set(symbol,pool);
  }

  const expectedThousand=[...pools.entries()].filter(([,p])=>p==="FORMAL_THOUSAND").map(([s])=>s);
  if (!sameSet(expectedThousand,[...thousand.keys()])) {
    throw new Error("THOUSAND_EVALUATION_KEYSET_MISMATCH");
  }

  const divergence=[];
  for (const symbol of expectedThousand) {
    const a=normalizedDecisionResult(primary.get(symbol)?.result);
    const b=normalizedDecisionResult(thousand.get(symbol)?.result);
    if (stableJson(a)!==stableJson(b)) divergence.push(symbol);
  }

  const authoritative=new Map();
  for (const symbol of features.keys()) {
    const pool=pools.get(symbol);
    const source=pool==="FORMAL_THOUSAND"?"THOUSAND_DEDICATED":"PRIMARY";
    const evaluation=source==="THOUSAND_DEDICATED"?thousand.get(symbol):primary.get(symbol);
    if (!evaluation || !evaluation.result) throw new Error("AUTHORITATIVE_EVALUATION_MISSING:"+symbol);
    authoritative.set(symbol,{
      symbol,
      pool,
      authoritativeEvaluationSource:source,
      result:evaluation.result,
      evaluationOrdinal:Number(evaluation.evaluationOrdinal),
    });
  }

  const generalQualified=[...authoritative.values()]
    .filter(x=>x.pool==="FORMAL_GENERAL" && x.result?.ok===true)
    .map(x=>x.symbol);
  const thousandQualified=[...authoritative.values()]
    .filter(x=>x.pool==="FORMAL_THOUSAND" && x.result?.ok===true)
    .map(x=>x.symbol);

  const rankedGeneral=exactSymbolList(rankedGeneralSymbols,"RANKED_GENERAL");
  const rankedThousand=exactSymbolList(rankedThousandSymbols,"RANKED_THOUSAND");
  const selected=exactSymbolList(selectedSymbols,"SELECTED");

  if (!sameSet(generalQualified,rankedGeneral)) throw new Error("GENERAL_RANKED_KEYSET_MISMATCH");
  if (!sameSet(thousandQualified,rankedThousand)) throw new Error("THOUSAND_RANKED_KEYSET_MISMATCH");

  const expectedSelected=[
    ...rankedGeneral.slice(0,quotaPerFormalPool),
    ...rankedThousand.slice(0,quotaPerFormalPool),
  ];
  if (!sameSet(expectedSelected,selected)) throw new Error("SELECTED_SET_MISMATCH");

  const rankGeneral=new Map(rankedGeneral.map((s,i)=>[s,i+1]));
  const rankThousand=new Map(rankedThousand.map((s,i)=>[s,i+1]));
  const selectedSet=new Set(selected);

  const qualifiedPreSortOrdinal=new Map();
  for (const pool of ["FORMAL_GENERAL","FORMAL_THOUSAND"]) {
    const ordered=[...authoritative.values()]
      .filter(x=>x.pool===pool && x.result?.ok===true)
      .sort((a,b)=>a.evaluationOrdinal-b.evaluationOrdinal);
    ordered.forEach((x,i)=>qualifiedPreSortOrdinal.set(x.symbol,i));
  }

  const rows=[...authoritative.values()].map(x=>{
    const rank=x.pool==="FORMAL_GENERAL"?rankGeneral.get(x.symbol):rankThousand.get(x.symbol);
    const qualified=x.result?.ok===true;
    return Object.freeze({
      symbol:x.symbol,
      pool:x.pool,
      authoritativeEvaluationSource:x.authoritativeEvaluationSource,
      dualEvaluationEquivalent:x.pool==="FORMAL_THOUSAND"? !divergence.includes(x.symbol) : null,
      evaluationOrdinal:x.evaluationOrdinal,
      qualified,
      qualifiedPreSortOrdinal:qualified?qualifiedPreSortOrdinal.get(x.symbol):null,
      observedPoolRank:qualified?rank:null,
      selectedFlag:selectedSet.has(x.symbol),
      cutlineRelation:qualified
        ? (rank<=quotaPerFormalPool?"ABOVE_OR_AT_CUTLINE":"BELOW_CUTLINE")
        : null,
      actualResult:x.result,
    });
  }).sort((a,b)=>a.symbol.localeCompare(b.symbol));

  return Object.freeze({
    valid:divergence.length===0,
    status:divergence.length===0?"CAPTURE_LEDGER_READY":"QA_FAIL",
    dualEvaluationDivergenceSymbols:Object.freeze(divergence.sort()),
    parentCount:rows.length,
    generalQualifiedCount:rankedGeneral.length,
    thousandQualifiedCount:rankedThousand.length,
    selectedCount:selected.length,
    rows:Object.freeze(rows),
    noRescore:true,
    noRerank:true,
  });
}
