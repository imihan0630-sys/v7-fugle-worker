// D01 DL-101~102 parameter stability and cross-module redundancy oracle v0.1
const FIRST_WAVE=new Set(["D01-02","D01-03","D01-07","D01-09"]);

function setRelation(a=[],b=[]){
  const A=new Set(a),B=new Set(b);
  let inter=0;for(const x of A)if(B.has(x))inter++;
  const aInB=A.size>0&&[...A].every(x=>B.has(x));
  const bInA=B.size>0&&[...B].every(x=>A.has(x));
  return {inter,aInB,bInA,same:A.size===B.size&&aInB&&bInA};
}

export function validateParameterVariant(v={}){
  if(!FIRST_WAVE.has(v.moduleId))return {status:"MODULE_OUTSIDE_FIRST_WAVE"};
  if(!v.parameterFamilyId||!v.variantId)return {status:"PARAMETER_IDENTITY_INCOMPLETE"};
  if(v.selectedAfterOutcome===true)return {status:"OUTCOME_SELECTED_PARAMETER_PROHIBITED"};
  if(v.preregistered!==true)return {status:"PARAMETER_VARIANT_NOT_PREREGISTERED"};
  return {status:"PARAMETER_VARIANT_VALID"};
}

export function classifyRepresentationStability(a={},b={}){
  if(a.dataReady!==true||b.dataReady!==true)return {status:"DATA_BLOCKED"};
  if(a.symbol!==b.symbol||a.predictorFreezeAt!==b.predictorFreezeAt||a.informationRoot!==b.informationRoot)return {status:"IDENTITY_DRIFT"};
  if(a.sourceHistoryHash&&b.sourceHistoryHash&&a.sourceHistoryHash!==b.sourceHistoryHash)return {status:"IDENTITY_DRIFT"};
  if(a.baseEpisodeId&&b.baseEpisodeId&&a.baseEpisodeId!==b.baseEpisodeId)return {status:"IDENTITY_DRIFT"};
  const rel=setRelation(a.sourceBarIds||[],b.sourceBarIds||[]);
  if(rel.inter===0)return {status:"IDENTITY_DRIFT"};
  if(a.structurePresent===b.structurePresent&&a.structurePresent===true)return {status:"STABLE_REPRESENTATION"};
  if(a.structurePresent!==b.structurePresent)return {status:"CONFIG_SENSITIVE_REPRESENTATION"};
  return {status:"UNKNOWN"};
}

export function validateGapThresholdRole({primaryParentUsesContinuousGap,namedChildThresholdPreregistered,thresholdSelectedAfterOutcome}={}){
  if(primaryParentUsesContinuousGap!==true)return {status:"PRIMARY_GAP_PARENT_WRONGLY_THRESHOLD_DEPENDENT"};
  if(thresholdSelectedAfterOutcome===true)return {status:"OUTCOME_SELECTED_GAP_THRESHOLD_PROHIBITED"};
  return {status:namedChildThresholdPreregistered===true?"GAP_THRESHOLD_CHILD_VALID":"GAP_THRESHOLD_CHILD_NOT_PREREGISTERED"};
}

export function classifyRedundancyEdge(a={},b={}){
  if(a.informationRoot&&b.informationRoot&&a.informationRoot!==b.informationRoot)return {status:"DISTINCT_ROOT_CANDIDATE"};
  if(a.baseEpisodeId&&b.baseEpisodeId&&a.baseEpisodeId===b.baseEpisodeId)return {status:"SAME_EPISODE_DIFFERENT_LABEL"};
  if(a.gapRootId&&b.gapRootId&&a.gapRootId===b.gapRootId)return {status:"SAME_EPISODE_DIFFERENT_LABEL"};
  const rel=setRelation(a.sourceBarIds||[],b.sourceBarIds||[]);
  if(rel.same&&rel.inter>0)return {status:"EXACT_REPRESENTATION_DUPLICATE"};
  if(rel.inter>0&&(rel.aInB||rel.bInA))return {status:"NESTED_SHARED_ROOT"};
  if(rel.inter>0)return {status:"OVERLAPPING_SHARED_ROOT"};
  if(a.mechanicalContextId&&b.mechanicalContextId&&a.mechanicalContextId===b.mechanicalContextId)return {status:"SHARED_MECHANICAL_CONTEXT"};
  return {status:"DISTINCT_ROOT_CANDIDATE"};
}

export function buildDependencyClusters(nodes=[]){
  const parent=new Map(nodes.map(n=>[n.opportunityId,n.opportunityId]));
  const find=x=>{let y=x;while(parent.get(y)!==y)y=parent.get(y);return y;};
  const union=(a,b)=>{const ra=find(a),rb=find(b);if(ra!==rb)parent.set(rb,ra);};
  for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){
    const edge=classifyRedundancyEdge(nodes[i],nodes[j]).status;
    if(["EXACT_REPRESENTATION_DUPLICATE","NESTED_SHARED_ROOT","OVERLAPPING_SHARED_ROOT","SAME_EPISODE_DIFFERENT_LABEL","SHARED_MECHANICAL_CONTEXT"].includes(edge))
      union(nodes[i].opportunityId,nodes[j].opportunityId);
  }
  const roots=new Set(nodes.map(n=>find(n.opportunityId)));
  return {status:"DEPENDENCY_GRAPH_BUILT",nodeCount:nodes.length,dependencyClusterCount:roots.size,independentVoteCount:null};
}
