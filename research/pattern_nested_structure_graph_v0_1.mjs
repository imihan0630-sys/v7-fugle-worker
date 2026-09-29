// Research-only causal multi-scale Pattern graph.
// Synthetic/offline QA only: no outcomes, scores, runtime wiring or Formal dependency.

const SCALE_RANK=Object.freeze({LOCAL:1,DAILY:2,WEEKLY:3,MONTHLY:4});

function text(value,field){
  const out=String(value??"").trim();
  if(!out) throw new Error(`MISSING_${field}`);
  return out;
}

function date(value,field){
  const out=text(value,field);
  if(!/^\d{4}-\d{2}-\d{2}$/.test(out)) throw new Error(`INVALID_${field}`);
  return out;
}

function uniq(values){
  return [...new Set((values||[]).map(v=>String(v).trim()).filter(Boolean))].sort();
}

function normalizeBoundary(raw,objectId){
  if(raw==null) return null;
  const lower=Number(raw.lower), upper=Number(raw.upper);
  if(!Number.isFinite(lower)||!Number.isFinite(upper)||upper<lower){
    throw new Error(`INVALID_BOUNDARY@${objectId}`);
  }
  return Object.freeze({
    boundaryId:text(raw.boundaryId,`boundaryId@${objectId}`),
    version:text(raw.version,`boundaryVersion@${objectId}`),
    lower,
    upper,
    direction:raw.direction==null?null:text(raw.direction,`direction@${objectId}`),
    firstBreakAt:raw.firstBreakAt==null?null:date(raw.firstBreakAt,`firstBreakAt@${objectId}`),
  });
}

function normalizeObject(raw,index){
  const objectId=text(raw?.objectId,`objectId@${index}`);
  const scale=text(raw?.scale,`scale@${objectId}`);
  if(!(scale in SCALE_RANK)) throw new Error(`INVALID_SCALE@${objectId}`);
  const intervalStart=date(raw?.intervalStart,`intervalStart@${objectId}`);
  const intervalEnd=date(raw?.intervalEnd,`intervalEnd@${objectId}`);
  if(intervalEnd<intervalStart) throw new Error(`INVALID_INTERVAL@${objectId}`);
  const completeness=text(raw?.completeness??"COMPLETE",`completeness@${objectId}`);
  if(!["COMPLETE","PARTIAL"].includes(completeness)) throw new Error(`INVALID_COMPLETENESS@${objectId}`);
  const sourceBars=(raw?.sourceBars||[]).map((bar,j)=>Object.freeze({
    barId:text(bar?.barId,`sourceBarId@${objectId}:${j}`),
    date:date(bar?.date,`sourceBarDate@${objectId}:${j}`),
    verified:bar?.verified===true,
    eligibleSymbolSession:bar?.eligibleSymbolSession===true,
    availableAt:date(bar?.availableAt??bar?.date,`sourceBarAvailableAt@${objectId}:${j}`),
  }));
  return Object.freeze({
    objectId,
    symbol:text(raw?.symbol,`symbol@${objectId}`),
    family:text(raw?.family,`family@${objectId}`),
    layer:text(raw?.layer,`layer@${objectId}`),
    scale,
    semanticSpaceVersion:text(raw?.semanticSpaceVersion,`semanticSpaceVersion@${objectId}`),
    intervalStart,
    intervalEnd,
    confirmedAt:date(raw?.confirmedAt,`confirmedAt@${objectId}`),
    completeness,
    anchorIds:Object.freeze(uniq(raw?.anchorIds)),
    rootProvenance:Object.freeze(uniq(raw?.rootProvenance)),
    sourceBars:Object.freeze(sourceBars),
    refinesObjectIds:Object.freeze(uniq(raw?.refinesObjectIds)),
    contradictsObjectIds:Object.freeze(uniq(raw?.contradictsObjectIds)),
    boundary:normalizeBoundary(raw?.boundary,objectId),
  });
}

function jaccard(left,right){
  const a=new Set(left), b=new Set(right);
  if(!a.size&&!b.size) return null;
  let n=0;
  for(const value of a) if(b.has(value)) n+=1;
  return n/new Set([...a,...b]).size;
}

function pairKey(a,b,type){
  return `${type}|${a.objectId}|${b.objectId}`;
}

function boundaryConflict(a,b){
  if(!a.boundary||!b.boundary) return null;
  const A=a.boundary,B=b.boundary;
  if(A.boundaryId!==B.boundaryId||A.version!==B.version) return null;
  if(A.lower===B.lower&&A.upper===B.upper) return null;
  return Object.freeze({
    type:"BOUNDARY_PROVENANCE_CONFLICT",
    leftObjectId:a.objectId,
    rightObjectId:b.objectId,
    boundaryId:A.boundaryId,
    version:A.version,
  });
}

export function buildNestedStructureGraph({objects,asOfDate}){
  if(!Array.isArray(objects)) throw new Error("OBJECTS_ARRAY_REQUIRED");
  const asOf=date(asOfDate,"asOfDate");
  const seen=new Set();
  const normalized=objects.map(normalizeObject);
  for(const row of normalized){
    if(seen.has(row.objectId)) throw new Error(`DUPLICATE_OBJECT_ID:${row.objectId}`);
    seen.add(row.objectId);
  }

  const blocked=[];
  const nodes=[];
  for(const row of normalized){
    if(row.confirmedAt>asOf) continue;
    const invalidBars=row.sourceBars.filter(bar=>
      !bar.verified||!bar.eligibleSymbolSession||bar.availableAt>asOf||bar.date>asOf
    );
    if(invalidBars.length){
      blocked.push(Object.freeze({
        objectId:row.objectId,
        reason:"SOURCE_BAR_PROVENANCE_BLOCKED",
        barIds:Object.freeze(invalidBars.map(x=>x.barId).sort()),
      }));
      continue;
    }
    nodes.push(row);
  }

  nodes.sort((a,b)=>a.objectId.localeCompare(b.objectId));
  const edges=[];
  const conflicts=[];
  const edgeKeys=new Set();
  const add=(type,from,to,extra={})=>{
    const key=pairKey(from,to,type);
    if(edgeKeys.has(key)) return;
    edgeKeys.add(key);
    edges.push(Object.freeze({type,from:from.objectId,to:to.objectId,...extra}));
  };

  for(let i=0;i<nodes.length;i+=1){
    for(let j=i+1;j<nodes.length;j+=1){
      const left=nodes[i],right=nodes[j];
      if(left.symbol!==right.symbol) continue;
      if(left.semanticSpaceVersion!==right.semanticSpaceVersion){
        conflicts.push(Object.freeze({
          type:"SEMANTIC_SPACE_CONFLICT",
          leftObjectId:left.objectId,
          rightObjectId:right.objectId,
        }));
        continue;
      }
      const bc=boundaryConflict(left,right);
      if(bc){
        conflicts.push(bc);
        continue;
      }

      for(const [parent,child] of [[left,right],[right,left]]){
        if(
          SCALE_RANK[parent.scale]>SCALE_RANK[child.scale]&&
          parent.completeness==="COMPLETE"&&
          parent.intervalStart<=child.intervalStart&&
          parent.intervalEnd>=child.intervalEnd
        ) add("CONTAINS",parent,child,{causalAt:parent.confirmedAt});
      }

      const overlap=jaccard(left.anchorIds,right.anchorIds);
      if(overlap!==null&&overlap>0){
        add("SHARES_ANCHORS",left,right,{jaccard:overlap});
      }

      const A=left.boundary,B=right.boundary;
      if(
        A&&B&&A.boundaryId===B.boundaryId&&A.version===B.version&&
        A.direction===B.direction&&A.firstBreakAt&&A.firstBreakAt===B.firstBreakAt
      ) add("SHARES_TRIGGER",left,right,{boundaryId:A.boundaryId,boundaryVersion:A.version});

      if(left.refinesObjectIds.includes(right.objectId)) add("REFINES",left,right,{explicitMapping:true});
      if(right.refinesObjectIds.includes(left.objectId)) add("REFINES",right,left,{explicitMapping:true});
      if(left.contradictsObjectIds.includes(right.objectId)||right.contradictsObjectIds.includes(left.objectId)){
        add("CONTRADICTS",left,right,{explicitChronology:true});
      }
    }
  }

  edges.sort((a,b)=>`${a.type}|${a.from}|${a.to}`.localeCompare(`${b.type}|${b.from}|${b.to}`));
  conflicts.sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
  blocked.sort((a,b)=>a.objectId.localeCompare(b.objectId));

  return Object.freeze({
    asOfDate:asOf,
    nodes:Object.freeze(nodes),
    edges:Object.freeze(edges),
    conflicts:Object.freeze(conflicts),
    blocked:Object.freeze(blocked),
    transitiveClosureApplied:false,
    scoringVoteCount:null,
    directionalEffect:"UNKNOWN",
  });
}
