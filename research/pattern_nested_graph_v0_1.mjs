// D01 research-only synthetic nested-structure graph validator v0.1
export function validateNestedGraph(nodes, edges, asOf) {
  const byId=new Map(nodes.map(n=>[n.id,n]));
  const active=nodes.filter(n=>n.confirmedAt<=asOf);
  const activeIds=new Set(active.map(n=>n.id));
  const errors=[];
  for(const n of active){
    if(n.asOf && n.asOf>asOf) errors.push({code:"FUTURE_ASOF",id:n.id});
    if(n.scale==="WEEKLY" && n.completeness==="PARTIAL" && n.usedAsCompleted) errors.push({code:"PARTIAL_WEEK_AS_COMPLETE",id:n.id});
  }
  const out=[];
  for(const e of edges){
    const a=byId.get(e.from), b=byId.get(e.to);
    if(!a||!b){errors.push({code:"MISSING_NODE",edge:e});continue;}
    if(!activeIds.has(e.from)||!activeIds.has(e.to)) continue;
    if(a.symbol!==b.symbol){errors.push({code:"CROSS_SYMBOL_EDGE",edge:e});continue;}
    if(a.semanticSpaceVersion!==b.semanticSpaceVersion){errors.push({code:"SEMANTIC_SPACE_CONFLICT",edge:e});continue;}
    if(e.type==="CONTAINS" && !(a.firstSession<=b.firstSession && a.lastSession>=b.lastSession)) errors.push({code:"INVALID_CONTAINMENT",edge:e});
    if(e.type==="SHARES_TRIGGER" && (a.boundaryId!==b.boundaryId||a.boundaryVersion!==b.boundaryVersion||a.firstBreakAt!==b.firstBreakAt)) errors.push({code:"TRIGGER_IDENTITY_CONFLICT",edge:e});
    out.push(e);
  }
  return {activeNodeIds:[...activeIds].sort(),edges:out,errors};
}
export function prefixReplay(build, fixtures, prefixes){
  const snapshots=prefixes.map(asOf=>build(fixtures,asOf));
  return snapshots.map((x,i)=>({asOf:prefixes[i],snapshot:x}));
}
