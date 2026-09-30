// D01 research-only synthetic nested-structure graph validator v0.2
// Outcome-blind / no runtime wiring / Formal Core impact = NONE.
function isoLeq(a,b){ return typeof a==='string' && typeof b==='string' && a <= b; }
function coords(n){ return [n.boundaryLower ?? null,n.boundaryUpper ?? null]; }
function sameCoords(a,b){ const [al,au]=coords(a),[bl,bu]=coords(b); return al===bl && au===bu; }
function semKey(n){ return `${n.semanticSpaceId ?? 'UNKNOWN'}::${n.semanticSpaceVersion ?? 'UNKNOWN'}`; }

export function validateNestedGraph(nodes, edges, asOf) {
  const byId = new Map(nodes.map(n => [n.id,n]));
  const errors = [];
  const unknowns = [];
  const activeIds = new Set();

  for (const n of nodes) {
    if (!n.confirmedAt) {
      unknowns.push({code:'MISSING_CONFIRMATION_CLOCK',id:n.id});
      continue;
    }
    if (!isoLeq(n.confirmedAt, asOf)) continue;
    if (n.asOf && !isoLeq(n.asOf, asOf)) {
      errors.push({code:'FUTURE_ASOF',id:n.id});
      continue;
    }
    activeIds.add(n.id);
    if (n.scale==='WEEKLY' && n.completeness==='PARTIAL' && n.usedAsCompleted) {
      errors.push({code:'PARTIAL_WEEK_AS_COMPLETE',id:n.id});
    }
  }

  const out=[];
  for (const e of edges) {
    const a=byId.get(e.from), b=byId.get(e.to);
    if (!a || !b) { errors.push({code:'MISSING_NODE',edge:e}); continue; }
    if (!activeIds.has(e.from) || !activeIds.has(e.to)) continue;
    if (a.symbol !== b.symbol) { errors.push({code:'CROSS_SYMBOL_EDGE',edge:e}); continue; }
    if (semKey(a) !== semKey(b)) { errors.push({code:'SEMANTIC_SPACE_CONFLICT',edge:e}); continue; }

    if (e.type==='CONTAINS') {
      if (a.scale==='WEEKLY' && a.completeness==='PARTIAL') {
        errors.push({code:'PARTIAL_HIGHER_TIMEFRAME_PARENT',edge:e});
        continue;
      }
      if (!(a.firstSession <= b.firstSession && a.lastSession >= b.lastSession)) {
        errors.push({code:'INVALID_CONTAINMENT',edge:e});
        continue;
      }
    }

    if (e.type==='SHARES_TRIGGER') {
      if (a.boundaryId !== b.boundaryId || a.firstBreakAt !== b.firstBreakAt) {
        errors.push({code:'TRIGGER_IDENTITY_CONFLICT',edge:e});
        continue;
      }
      if (a.boundaryVersion !== b.boundaryVersion) {
        errors.push({code:'BOUNDARY_VERSION_CONFLICT',edge:e});
        continue;
      }
      if (!sameCoords(a,b)) {
        errors.push({code:'PROVENANCE_CONFLICT_SAME_VERSION_MUTATED',edge:e});
        continue;
      }
    }
    out.push(e);
  }

  return {
    activeNodeIds:[...activeIds].sort(),
    edges:out,
    errors,
    unknowns,
    status: errors.length ? 'INVALID' : (unknowns.length ? 'VALID_WITH_UNKNOWN' : 'VALID')
  };
}

export function canonicalGraphSnapshot(result){
  return JSON.stringify({
    activeNodeIds:[...(result.activeNodeIds||[])].sort(),
    edges:[...(result.edges||[])].map(e=>({...e})).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))),
    errors:[...(result.errors||[])].map(e=>({...e})).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))),
    unknowns:[...(result.unknowns||[])].map(e=>({...e})).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)))
  });
}

export function prefixReplay(build, fixtures, prefixes) {
  return prefixes.map(asOf => ({asOf,snapshot:build(fixtures,asOf)}));
}
