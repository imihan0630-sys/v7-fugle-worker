// D01 DL-103~105 detector-version invariance / episode migration oracle v0.1

const MIGRATION_CLASSES=new Set([
  "UNCHANGED_EPISODE",
  "SAME_EPISODE_REPRESENTATION_CHANGED",
  "EPISODE_SPLIT",
  "EPISODE_MERGE",
  "NEW_EPISODE_IN_NEW_VERSION",
  "DROPPED_EPISODE_IN_NEW_VERSION",
  "CLOCK_DRIFT",
  "PROVENANCE_DRIFT",
  "IDENTITY_UNRESOLVED"
]);

export function validateVersionMetadata(v={}){
  const required=[
    "detectorFamilyId","detectorVersion","specificationHash","codeHash",
    "detectorSpecFrozenAt","experimentFamilyId","parameterFamilyId"
  ];
  const missing=required.filter(k=>!v[k]);
  return {status:missing.length?"DETECTOR_VERSION_METADATA_INCOMPLETE":"DETECTOR_VERSION_METADATA_VALID",missing};
}

export function validateHistoricalReplayEligibility({
  marketFirstObservableAt,predictorFreezeAt,detectorSpecFrozenAt,experimentOutcomeUnlockAt,
  outcomeUnblindedAt=null,prefixSafe
}={}){
  if(!marketFirstObservableAt||!predictorFreezeAt||!detectorSpecFrozenAt||!experimentOutcomeUnlockAt)
    return {status:"REPLAY_CLOCK_INCOMPLETE"};
  if(marketFirstObservableAt>predictorFreezeAt)return {status:"MARKET_LOOKAHEAD"};
  if(prefixSafe!==true)return {status:"PREFIX_SAFETY_NOT_PROVEN"};
  if(detectorSpecFrozenAt>experimentOutcomeUnlockAt)return {status:"DETECTOR_FROZEN_AFTER_OUTCOME_UNLOCK"};
  if(outcomeUnblindedAt&&outcomeUnblindedAt<=detectorSpecFrozenAt)return {status:"DETECTOR_SPEC_AFTER_OUTCOME_ACCESS"};
  return {status:"HISTORICAL_REPLAY_ELIGIBLE"};
}

export function classifyVersionRepresentation(oldR={},newR={}){
  const sourceFields=["market","symbol","targetDate","exactSessionHash","sourceHistoryHash","informationRoot"];
  if(sourceFields.some(k=>(oldR[k]??null)!==(newR[k]??null)))return {status:"PROVENANCE_DRIFT"};
  const oldAnchors=JSON.stringify(oldR.anchorIds||oldR.requiredSourceBarIds||[]);
  const newAnchors=JSON.stringify(newR.anchorIds||newR.requiredSourceBarIds||[]);
  if((oldR.episodeId??null)!==(newR.episodeId??null)||oldAnchors!==newAnchors)return {status:"EPISODE_IDENTITY_DRIFT"};
  if((oldR.firstObservableAt??null)!==(newR.firstObservableAt??null)||(oldR.confirmedAt??null)!==(newR.confirmedAt??null))
    return {status:"CLOCK_DRIFT"};
  const samePayload=(oldR.canonicalPayloadHash??null)===(newR.canonicalPayloadHash??null);
  const sameState=(oldR.featureState??null)===(newR.featureState??null);
  return {status:samePayload&&sameState?"EXACT_REPLAY_EQUIVALENT":"SAME_CAUSAL_EPISODE_REPRESENTATION_DRIFT"};
}

export function classifyEpisodeMigration({oldEpisodes=[],newEpisodes=[],sameRootMap={},outcomeUsedToChooseMapping=false}={}){
  if(outcomeUsedToChooseMapping===true)return {status:"OUTCOME_SELECTED_MIGRATION_PROHIBITED"};
  const oldIds=new Set(oldEpisodes.map(x=>x.id));
  const newIds=new Set(newEpisodes.map(x=>x.id));
  if(!oldIds.size&&!newIds.size)return {status:"IDENTITY_UNRESOLVED"};
  const oldToNew=new Map();
  const newToOld=new Map();
  for(const [o,arr] of Object.entries(sameRootMap||{})){
    if(!oldIds.has(o))return {status:"IDENTITY_UNRESOLVED"};
    const xs=Array.isArray(arr)?arr:[arr];
    oldToNew.set(o,xs);
    for(const n of xs){
      if(!newIds.has(n))return {status:"IDENTITY_UNRESOLVED"};
      if(!newToOld.has(n))newToOld.set(n,[]);
      newToOld.get(n).push(o);
    }
  }
  if([...oldToNew.values()].some(xs=>xs.length>1))return {status:"EPISODE_SPLIT"};
  if([...newToOld.values()].some(xs=>xs.length>1))return {status:"EPISODE_MERGE"};
  if(oldIds.size===1&&newIds.size===1&&oldToNew.size===1)return {status:"UNCHANGED_EPISODE"};
  if([...newIds].some(n=>!newToOld.has(n)))return {status:"NEW_EPISODE_IN_NEW_VERSION"};
  if([...oldIds].some(o=>!oldToNew.has(o)))return {status:"DROPPED_EPISODE_IN_NEW_VERSION"};
  return {status:"IDENTITY_UNRESOLVED"};
}

export function validateMigrationLedger(row={}){
  if(!MIGRATION_CLASSES.has(row.migrationClass))return {status:"MIGRATION_CLASS_INVALID"};
  if(!row.fromDetectorVersion||!row.toDetectorVersion||!row.searchRegistryEntryId)return {status:"MIGRATION_LEDGER_INCOMPLETE"};
  if(!["CLOSED","PARTIALLY_OPENED","OPENED"].includes(row.outcomeAccessStateAtMigration))
    return {status:"OUTCOME_ACCESS_STATE_INVALID"};
  if(["PARTIALLY_OPENED","OPENED"].includes(row.outcomeAccessStateAtMigration)){
    if(row.newVersionCountedInSearchFamily!==true)return {status:"POST_OUTCOME_VERSION_NOT_COUNTED"};
    if(row.finalHoldoutPrivilegeReused===true)return {status:"FINAL_HOLDOUT_REUSE_PROHIBITED"};
    return {status:"POST_OUTCOME_MIGRATION_SEARCH_ACCOUNTED"};
  }
  return {status:"MIGRATION_LEDGER_VALID"};
}

export function validateExactEquivalence(oldR={},newR={}){
  const fields=[
    "canonicalPayloadHash","firstObservableAt","confirmedAt","featureState",
    "sourceHistoryHash","exactSessionHash","denominatorState"
  ];
  const drift=fields.filter(k=>(oldR[k]??null)!==(newR[k]??null));
  return {status:drift.length?"NEW_RESEARCH_VERSION_REQUIRED":"IMPLEMENTATION_EQUIVALENT",drift};
}

export function validatePrefixInvariance(prefixR={},fullAsOfR={}){
  const fields=[
    "featureState","firstObservableAt","confirmedAt","informationRoot","redundancyGroup",
    "episodeId","lifecycleState","canonicalPayloadHash"
  ];
  const drift=fields.filter(k=>(prefixR[k]??null)!==(fullAsOfR[k]??null));
  const barsA=JSON.stringify(prefixR.requiredSourceBarIds||[]);
  const barsB=JSON.stringify(fullAsOfR.requiredSourceBarIds||[]);
  if(barsA!==barsB)drift.push("requiredSourceBarIds");
  return {status:drift.length?"PREFIX_INVARIANCE_VIOLATION":"PREFIX_INVARIANCE_PASS",drift};
}

export function validateOldReceiptImmutability({oldReceiptHashBefore,oldReceiptHashAfter,newReceiptAppended}={}){
  if(!oldReceiptHashBefore||!oldReceiptHashAfter)return {status:"OLD_RECEIPT_HASH_UNKNOWN"};
  if(oldReceiptHashBefore!==oldReceiptHashAfter)return {status:"OLD_RECEIPT_MUTATED"};
  return {status:newReceiptAppended===true?"APPEND_ONLY_MIGRATION_VALID":"NEW_RECEIPT_NOT_APPENDED"};
}

export function validateNegativeCaseRetention({before={},after={}}={}){
  const states=["NO_STRUCTURE","DATA_BLOCKED","FAILED","EXPIRED","INVALIDATED","UNRESOLVED"];
  const dropped=states.filter(k=>Number(after[k]||0)<Number(before[k]||0));
  return {status:dropped.length?"NEGATIVE_CASE_DROPPED":"NEGATIVE_CASES_RETAINED",dropped};
}
