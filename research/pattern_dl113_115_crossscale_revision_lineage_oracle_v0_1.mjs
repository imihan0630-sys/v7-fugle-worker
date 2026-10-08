// D01 DL-113~115 cross-scale source-revision lineage oracle v0.1

export function aggregateOHLC(rows=[]){
  if(!Array.isArray(rows)||!rows.length)return {status:"AGGREGATE_BLOCKED"};
  const xs=rows.map(x=>({open:Number(x.open),high:Number(x.high),low:Number(x.low),close:Number(x.close),id:String(x.id||"")}));
  if(xs.some(x=>![x.open,x.high,x.low,x.close].every(Number.isFinite)))return {status:"AGGREGATE_BLOCKED"};
  return {
    status:"AGGREGATE_READY",
    open:xs[0].open,
    high:Math.max(...xs.map(x=>x.high)),
    low:Math.min(...xs.map(x=>x.low)),
    close:xs[xs.length-1].close,
    constituentIds:xs.map(x=>x.id)
  };
}

export function classifyDerivedBarRevision({
  oldBar={},newBar={},
  sessionSetChanged=false,
  continuityTransformChanged=false,
  volumeOnlyChanged=false,
  aggregationDefinitionChanged=false
}={}){
  if(aggregationDefinitionChanged===true)return {status:"AGGREGATION_DEFINITION_CHANGED"};
  if(sessionSetChanged===true)return {status:"SESSION_SET_CHANGED_AGGREGATE_CHANGED"};
  if(continuityTransformChanged===true)return {status:"CONTINUITY_REVISION_PROPAGATED"};
  const fields=["open","high","low","close"];
  const changed=fields.some(k=>Number(oldBar[k])!==Number(newBar[k]));
  if(changed)return {status:"PRIMITIVE_CHANGED_DERIVED_CHANGED"};
  if(volumeOnlyChanged===true)return {status:"VOLUME_ONLY_PRICE_AGGREGATE_UNCHANGED"};
  return {status:"PRIMITIVE_CHANGED_DERIVED_UNCHANGED"};
}

export function rollingWindowsContainingIndex({length,index,windowSize}={}){
  if(!Number.isInteger(length)||!Number.isInteger(index)||!Number.isInteger(windowSize)||length<=0||windowSize<=0||index<0||index>=length)
    return [];
  const starts=[];
  for(let s=0;s+windowSize<=length;s++){
    if(index>=s&&index<s+windowSize)starts.push(s);
  }
  return starts;
}

function roots(row={}){
  return new Set((row.primitiveRevisionRootIds||[]).map(String));
}

export function classifyRevisionRootEdge(a={},b={}){
  const A=roots(a),B=roots(b);
  if(!A.size||!B.size)return {status:"REVISION_ROOT_UNKNOWN"};
  const inter=[...A].filter(x=>B.has(x));
  const aInB=[...A].every(x=>B.has(x));
  const bInA=[...B].every(x=>A.has(x));
  if(A.size===B.size&&aInB&&bInA)return {status:"EXACT_REVISION_DUPLICATE"};
  if(inter.length&&(aInB||bInA))return {status:"NESTED_REVISION_ROOT"};
  if(inter.length)return {status:"OVERLAPPING_REVISION_ROOT"};
  return {status:"DISJOINT_REVISION_ROOT_CANDIDATE"};
}

export function revisionRootAccounting(rows=[]){
  const union=new Set();
  for(const row of rows)for(const x of (row.primitiveRevisionRootIds||[]))union.add(String(x));
  return {
    status:"REVISION_ROOTS_ACCOUNTED",
    rawRevisionRepresentationCount:rows.length,
    primitiveRevisionRootCount:union.size,
    effectiveIndependentRevisionRootCount:union.size
  };
}

export function validateAggregationSpace({semanticSpace,constituentSemanticSpaces=[]}={}){
  const unique=new Set((constituentSemanticSpaces||[]).map(String));
  if(!["RAW_EXECUTION","TECHNICAL_CONTINUITY"].includes(semanticSpace))return {status:"AGGREGATION_SPACE_UNKNOWN"};
  if(unique.size!==1||!unique.has(semanticSpace))return {status:"MIXED_SEMANTIC_SPACE_PROHIBITED"};
  return {status:"AGGREGATION_SPACE_VALID"};
}

export function classifyCrossScaleSensitivity(rows=[]){
  if(!Array.isArray(rows)||!rows.length)return {status:"DATA_BLOCKED"};
  if(rows.some(r=>r.dataReady===false))return {status:"DATA_BLOCKED"};
  const changed=rows.filter(r=>r.derivedBarChanged===true||r.r7RepresentationChanged===true).length;
  const membership=rows.some(r=>r.windowMembershipChanged===true);
  const continuity=rows.some(r=>r.continuitySpaceRevisionChanged===true);
  if(membership)return {status:"WINDOW_MEMBERSHIP_CHANGED"};
  if(continuity)return {status:"CONTINUITY_SPACE_REVISION_CHANGED"};
  if(changed===0)return {status:"ALL_SCALES_UNCHANGED_AFTER_REBUILD"};
  if(changed===rows.length)return {status:"ALL_OBSERVED_SCALES_CHANGED"};
  return {status:"SOME_SCALES_CHANGED"};
}

export function validateCrossScaleReceipt(r={}){
  const req=["auditId","sourceVintageFrom","sourceVintageTo","symbol","predictorDate","semanticSpace"];
  const missing=req.filter(k=>!r[k]);
  if(missing.length)return {status:"CROSS_SCALE_RECEIPT_INCOMPLETE",missing};
  if(r.outcomeFieldsPresent===true)return {status:"OUTCOME_CONTAMINATION",missing:[]};
  if(!Array.isArray(r.primitiveRevisionRootIds)||!r.primitiveRevisionRootIds.length)
    return {status:"PRIMITIVE_REVISION_ROOTS_MISSING",missing:[]};
  const p=new Set(r.primitiveRevisionRootIds.map(String)).size;
  if(Number(r.primitiveRevisionRootCount)!==p)return {status:"PRIMITIVE_ROOT_COUNT_MISMATCH",missing:[]};
  if(Number(r.effectiveIndependentRevisionRootCount)>p)return {status:"REVISION_INDEPENDENCE_OVERCLAIM",missing:[]};
  if(Number(r.rawRevisionRepresentationCount)<Number(r.effectiveIndependentRevisionRootCount))
    return {status:"REVISION_COUNT_INCONSISTENT",missing:[]};
  return {status:"CROSS_SCALE_REVISION_RECEIPT_VALID",missing:[]};
}

export function validateOnePrimitiveManyScales(rows=[]){
  const accounting=revisionRootAccounting(rows);
  if(accounting.primitiveRevisionRootCount===1&&accounting.rawRevisionRepresentationCount>1){
    return {...accounting,status:"ONE_ROOT_MULTI_SCALE_FANOUT"};
  }
  return {...accounting,status:"GENERAL_REVISION_FANOUT"};
}
