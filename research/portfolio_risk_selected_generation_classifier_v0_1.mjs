export const REQUIRED_PRIORITY_PROVENANCE_FIELDS=[
  "priorityScoreDefinitionVersion",
  "rankingComparatorVersion",
  "postConsensusPriorityScore",
  "rewardPerRisk",
  "marketConsensusBonus"
];

function text(v){return String(v??"").trim();}
function get(obj,path){
  return String(path).split(".").reduce((v,k)=>v&&typeof v==="object"?v[k]:undefined,obj);
}
function first(snapshot,paths){
  for(const p of paths){const v=get(snapshot,p);if(v!==undefined&&v!==null&&String(v)!=="") return v;}
  return null;
}

export function classifySelectedGeneration(planRow,snapshotRow,dayRow={}){
  const reasons=[];
  const planDate=text(planRow?.scan_date);
  const snapDate=text(snapshotRow?.scan_date);
  const planSymbol=text(planRow?.symbol);
  const snapSymbol=text(snapshotRow?.symbol);
  const recordedAt=text(planRow?.recorded_at);
  const updatedAt=text(snapshotRow?.updated_at);
  const snapshot=snapshotRow?.snapshot && typeof snapshotRow.snapshot==="object"
    ? snapshotRow.snapshot
    : (()=>{try{return JSON.parse(snapshotRow?.snapshot_json||"{}")}catch{return {}}})();
  if(!planDate||planDate!==snapDate) reasons.push("SCAN_DATE_MISMATCH");
  if(!planSymbol||planSymbol!==snapSymbol) reasons.push("SYMBOL_MISMATCH");
  if(!recordedAt||!updatedAt||recordedAt!==updatedAt) reasons.push("WRITER_TIMESTAMP_MISMATCH");
  if(text(snapshot?.sourceCompleteness)!=="FULL_FORMAL_SCAN") reasons.push("NOT_FULL_FORMAL_SCAN");
  const aliases={
    priorityScoreDefinitionVersion:["ranking.priorityScoreDefinitionVersion","priorityScoreDefinitionVersion"],
    rankingComparatorVersion:["ranking.rankingComparatorVersion","rankingComparatorVersion"],
    postConsensusPriorityScore:["ranking.postConsensusPriorityScore","postConsensusPriorityScore","priorityScore"],
    rewardPerRisk:["ranking.rewardPerRisk","rewardPerRisk","rewardRisk"],
    marketConsensusBonus:["ranking.marketConsensusBonus","marketConsensusBonus"]
  };
  const provenance={};
  for(const field of REQUIRED_PRIORITY_PROVENANCE_FIELDS){
    provenance[field]=first(snapshot,aliases[field]);
    if(provenance[field]===null) reasons.push("MISSING_"+field.toUpperCase());
  }
  const selectedCount=Number(dayRow?.selected_count);
  const planCount=Number(dayRow?.plan_count??dayRow?.planCount);
  if(!Number.isFinite(selectedCount)||!Number.isFinite(planCount)||selectedCount!==planCount) reasons.push("JOURNAL_COMPLETENESS_UNVERIFIED");
  return {
    certified:reasons.length===0,
    status:reasons.length===0?"SAME_GENERATION_CERTIFIED":"FAIL_CLOSED",
    key:planDate&&planSymbol?planDate+"|"+planSymbol:null,
    recordedAt:recordedAt||null,
    snapshotUpdatedAt:updatedAt||null,
    provenance,
    reasons
  };
}
