// D01 DL-074 RR uncertainty firewall v0.1
export function dedupeUncertainty({components=[]}={}){
  const roots=new Set(); const duplicates=[];
  for(const c of components){
    const root=String(c?.uncertaintyRootId??"");
    if(!root) continue;
    if(roots.has(root)) duplicates.push(root); else roots.add(root);
  }
  return {status:duplicates.length?"UNCERTAINTY_COMPONENT_DOUBLE_COUNT":"UNCERTAINTY_COMPONENTS_DEDUPED",uniqueRoots:roots.size,duplicates};
}
export function classifyRR({rewardDistance,riskDistance,executionCostKnown,roundTripCost=0}={}){
  if(!Number.isFinite(rewardDistance)||!Number.isFinite(riskDistance)||riskDistance<=0)return {status:"RR_INPUT_INVALID"};
  const grossRR=rewardDistance/riskDistance;
  if(executionCostKnown!==true)return {status:"EXECUTABLE_RR_DATA_BLOCKED",grossRR};
  if(!Number.isFinite(roundTripCost)||roundTripCost<0)return {status:"RR_INPUT_INVALID"};
  const executableReward=rewardDistance-roundTripCost;
  const executableRisk=riskDistance+roundTripCost;
  return {status:"RR_EVALUABLE",grossRR,executableRR:executableReward/executableRisk};
}
export function validateGeometryChoice({chosenAt,predictorFreezeAt,selectedAfterOutcome}={}){
  if(selectedAfterOutcome===true)return {status:"MODEL_SELECTION_LOOKAHEAD"};
  if(!chosenAt||!predictorFreezeAt||chosenAt>predictorFreezeAt)return {status:"GEOMETRY_NOT_KNOWN_AT_FREEZE"};
  return {status:"GEOMETRY_PREREGISTERED"};
}
export function classifyUncertaintyTypes({structural,execution,volatility,eventGap,modelSelection}={}){
  return {status:"UNCERTAINTY_TYPES_SEPARATED",structural:!!structural,execution:!!execution,volatility:!!volatility,eventGap:!!eventGap,modelSelection:!!modelSelection};
}
