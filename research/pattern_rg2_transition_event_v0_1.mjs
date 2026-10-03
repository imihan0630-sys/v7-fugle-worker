// PATTERN-RG2 first-transition event builder v0.1
// Class A research-only. Consumes canonical lifecycle clocks; does not re-detect price lifecycle.

const TYPES={
  localFirstBreakAt:"LOCAL_BREAK_CONFIRMED",
  firstParentZoneEntryAt:"FIRST_PARENT_ZONE_ENTRY_CLOSE",
  parentFirstBreakAt:"PARENT_BREAK_CONFIRMED",
  parentFirstOrdinaryObservableAt:"FIRST_ORDINARY_OBSERVABLE_AFTER_CONSTRAINED_BREAK",
  parentFirstPostBreakOutsideCloseAt:"FIRST_POST_BREAK_OUTSIDE_CLOSE",
  parentFirstReentryAt:"PARENT_REENTRY",
  parentFirstFailureAt:"PARENT_FAILURE",
  parentFirstReclaimAt:"PARENT_RECLAIM"
};
function txt(x){return typeof x==="string"?x.trim():"";}
function leq(a,b){return !!a&&!!b&&a<=b;}
function eventKey(relationEpisodeKey,eventType){
  return ["RG2_EVENT_V0_1",relationEpisodeKey,eventType,"1"].map(encodeURIComponent).join("|");
}
function sourceGroup(relationEpisodeKey,occurredAt){
  return ["RG2_SOURCE_EVENT",relationEpisodeKey,"PRICE_OHLC_CLOSE",occurredAt].map(encodeURIComponent).join("|");
}
function conflict(reason,extra={}){
  return {status:"DATA_BLOCKED",reason,events:[],...extra};
}

export function buildRg2FirstTransitionEvents(input={}){
  const relationEpisodeKey=txt(input.relationEpisodeKey);
  const structuralIdentityFingerprint=txt(input.structuralIdentityFingerprint);
  const asOf=txt(input.asOf);
  const decisionCutoffAt=txt(input.decisionCutoffAt);
  const pathState=txt(input.lifecyclePathCompletenessState);
  if(!relationEpisodeKey||!structuralIdentityFingerprint||!asOf||!decisionCutoffAt)
    return conflict("IDENTITY_OR_CLOCK_CONTEXT_INCOMPLETE");
  if(input.localSemanticSpaceId!==input.parentSemanticSpaceId)
    return conflict("SEMANTIC_SPACE_CONFLICT");
  if(pathState!=="COMPLETE_THROUGH_ASOF")
    return {
      status:"CLOCK_UNCERTIFIED",
      reason:pathState||"PATH_COMPLETENESS_UNKNOWN",
      events:[],
      promotionEventStudyEligible:false
    };

  const c=input.clocks||{};
  const b=input.availableAtByClock||{};

  const localBreak=txt(c.localFirstBreakAt);
  const entry=txt(c.firstParentZoneEntryAt);
  const pbreak=txt(c.parentFirstBreakAt);
  const ordinary=txt(c.parentFirstOrdinaryObservableAt);
  const hold=txt(c.parentFirstPostBreakOutsideCloseAt);
  const reentry=txt(c.parentFirstReentryAt);
  const failure=txt(c.parentFirstFailureAt);
  const reclaim=txt(c.parentFirstReclaimAt);

  if(entry && (!localBreak || entry<localBreak)) return conflict("PARENT_ZONE_ENTRY_PRECEDES_LOCAL_BREAK");
  if(hold && (!pbreak || hold<=pbreak)) return conflict("POST_BREAK_HOLD_NOT_STRICTLY_AFTER_BREAK");
  if(reentry && (!pbreak || reentry<=pbreak)) return conflict("REENTRY_NOT_AFTER_PARENT_BREAK");
  if(failure && (!reentry || failure<reentry)) return conflict("FAILURE_PRECEDES_REENTRY");
  if(reclaim && (!(reentry||failure) || reclaim<=(failure||reentry))) return conflict("RECLAIM_NOT_AFTER_RETURN_EVENT");
  if(ordinary && pbreak && ordinary<pbreak) return conflict("ORDINARY_OBSERVABILITY_PRECEDES_BREAK");

  const events=[];
  for(const [clockField,eventType] of Object.entries(TYPES)){
    const occurredAt=txt(c[clockField]);
    if(!occurredAt || occurredAt>asOf) continue;
    const availableAt=txt(b[clockField]);
    if(!availableAt) return conflict("EVENT_AVAILABLE_AT_MISSING",{clockField});
    if(availableAt>decisionCutoffAt) continue;
    events.push({
      transitionEventKey:eventKey(relationEpisodeKey,eventType),
      relationEpisodeKey,
      transitionContractVersion:"RG2_TRANSITION_V0_1",
      eventType,
      eventOrdinal:1,
      eventOccurredAt:occurredAt,
      eventAvailableAt:availableAt,
      sourceEventGroupKey:sourceGroup(relationEpisodeKey,occurredAt),
      structuralIdentityFingerprint,
      clockCertification:"CERTIFIED_FIRST_CLOCK",
      independentEventVoteEligible:false,
      formalCoreImpact:"NONE"
    });
  }
  events.sort((a,b)=>a.eventOccurredAt.localeCompare(b.eventOccurredAt)||a.eventType.localeCompare(b.eventType));
  return {status:"VALID",events,promotionEventStudyEligible:true};
}

export function compareRg2TransitionEvent(existing,next){
  if(existing?.transitionEventKey!==next?.transitionEventKey)
    return {status:"DIFFERENT_EVENT_IDENTITY"};
  const immutable=["eventOccurredAt","eventAvailableAt","sourceEventGroupKey","structuralIdentityFingerprint"];
  const changed=immutable.filter(k=>JSON.stringify(existing?.[k]??null)!==JSON.stringify(next?.[k]??null));
  return changed.length?{status:"PROVENANCE_CONFLICT",changedFields:changed}:{status:"SAME_EVENT_EXACT"};
}
