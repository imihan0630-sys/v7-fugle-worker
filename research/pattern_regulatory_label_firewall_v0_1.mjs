// D01 DL-069 regulatory label-effect firewall v0.1
export function classifyLabelClock({publiclyObservableAt,effectiveStartAt,predictorFreezeAt,replaySafe}={}){
  if(!publiclyObservableAt||!predictorFreezeAt)return {status:"REGULATORY_LABEL_CLOCK_UNKNOWN"};
  if(replaySafe!==true)return {status:"DATA_BLOCKED"};
  if(publiclyObservableAt>predictorFreezeAt)return {status:"LABEL_NOT_KNOWN_AT_FREEZE"};
  return {status:"LABEL_KNOWN_AT_FREEZE",mechanismKnownAndEffective:!!effectiveStartAt&&effectiveStartAt<=predictorFreezeAt};
}
export function classifyRegulatoryEpisode({regulatoryRootId,regulatoryEpisodeId,extensionOrdinal=0}={}){
  if(!regulatoryRootId||!regulatoryEpisodeId)return {status:"UNKNOWN"};
  return {status:"EPISODE_IDENTIFIED",regulatoryRootId,regulatoryEpisodeId,extensionOrdinal,
    repeatedNoticeCreatesIndependentEpisode:false};
}
export function classifyWindow({labelKnown,mechanismEffective}={}){
  if(labelKnown!==true)return {status:"PRE_LABEL"};
  if(mechanismEffective!==true)return {status:"LABEL_ONLY_WINDOW"};
  return {status:"LABEL_PLUS_MECHANISM_WINDOW"};
}
export function classifyTriggerConfounding({priorAbnormalPathMatched,triggerFamilyMatched}={}){
  return {status:priorAbnormalPathMatched===true&&triggerFamilyMatched===true?"TRIGGER_PATH_CONTROLLED":"TRIGGER_CONFOUNDING_UNRESOLVED"};
}
export function classifyLabelComparator({atStructuralZone,labelClockVerified}={}){
  if(labelClockVerified!==true)return {status:"UNKNOWN"};
  return {status:atStructuralZone===true?"C1_LABEL_EVENT_AT_STRUCTURAL_ZONE":"C0_LABEL_EVENT_AWAY_FROM_STRUCTURAL_ZONE"};
}
export function buildLabelLineage({patternPresent,labelWindowPriceMovePresent,breakoutPresent}={}){
  const n=[patternPresent,labelWindowPriceMovePresent,breakoutPresent].filter(Boolean).length;
  return {informationRoot:"PRICE_OHLC",rawRepresentationCount:n,effectiveIndependentEvidenceCount:n?1:0};
}
