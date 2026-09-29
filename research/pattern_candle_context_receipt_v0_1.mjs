// Research-only provenance firewall for candlestick context.
// Consumes an existing morphology observation; does not detect candlestick patterns or assign direction.

import {createHash} from "node:crypto";

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

function instant(value,field){
  const out=text(value,field);
  if(!/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(out)) throw new Error(`INVALID_${field}`);
  const millis=Date.parse(out);
  if(!Number.isFinite(millis)) throw new Error(`INVALID_${field}`);
  return Object.freeze({value:out,millis});
}

function finitePositive(value,field){
  const out=Number(value);
  if(!Number.isFinite(out)||out<=0) throw new Error(`INVALID_${field}`);
  return out;
}

function stable(value){
  if(Array.isArray(value)) return value.map(stable);
  if(value&&typeof value==="object"){
    return Object.fromEntries(Object.keys(value).sort().map(key=>[key,stable(value[key])]));
  }
  return value;
}

export function stableCommitment(value){
  return createHash("sha256").update(JSON.stringify(stable(value))).digest("hex");
}

function result(status,reasons,extra={}){
  return Object.freeze({
    schemaVersion:"PATTERN_CANDLE_CONTEXT_RECEIPT_V0_1",
    status,
    reasons:Object.freeze([...new Set(reasons)].sort()),
    directionalEffect:"UNKNOWN",
    labelVoteCount:null,
    outcomeFieldsPresent:false,
    researchOnly:true,
    formalCoreImpact:"NONE",
    ...extra,
  });
}

function contextClass(state){
  if(["DOWNTREND","DECLINE","BEARISH"].includes(state)) return "AFTER_DECLINE";
  if(["UPTREND","ADVANCE","BULLISH"].includes(state)) return "AFTER_ADVANCE";
  if(["SIDEWAYS","RANGE"].includes(state)) return "INSIDE_NON_TREND_CONTEXT";
  return "UNKNOWN";
}

export function bindCandleContextReceipt(input){
  const asOf=instant(input?.asOfTimestamp,"asOfTimestamp");
  const observation=input?.observation||{};
  const observationId=text(observation.observationId,"observation.observationId");
  const detectorVersion=text(observation.detectorVersion,"observation.detectorVersion");
  const previousDate=date(observation.previousDate,"observation.previousDate");
  const currentDate=date(observation.currentDate,"observation.currentDate");
  if(currentDate<=previousDate) throw new Error("OBSERVATION_DATES_NOT_ASCENDING");
  const sourceBarsHash=text(observation.sourceBarsHash,"observation.sourceBarsHash");
  const computedAt=instant(observation.computedAt,"observation.computedAt");
  const continuityVersion=text(observation.continuityVersion,"observation.continuityVersion");
  const high=finitePositive(observation?.referenceRange?.high,"observation.referenceRange.high");
  const low=finitePositive(observation?.referenceRange?.low,"observation.referenceRange.low");
  if(high<low) throw new Error("OBSERVATION_REFERENCE_RANGE_INVALID");
  const reasons=[];
  if(observation.semanticSpace!=="TECHNICAL_CONTINUITY") reasons.push("OBSERVATION_NOT_TECHNICAL_CONTINUITY");
  if(computedAt.millis>asOf.millis) reasons.push("OBSERVATION_NOT_AVAILABLE_AS_OF");
  if(observation.detectorExecuted!==true) reasons.push("MORPHOLOGY_OBSERVATION_NOT_EXECUTED");
  if(observation.outcomeFieldsPresent===true) reasons.push("OUTCOME_CONTAMINATED_OBSERVATION");
  const observationCommitment=stableCommitment(observation);
  if(input.expectedObservationCommitment&&input.expectedObservationCommitment!==observationCommitment){
    reasons.push("OBSERVATION_COMMITMENT_MISMATCH");
  }

  const continuity=input?.continuityReceipt||{};
  const continuityId=text(continuity.id,"continuityReceipt.id");
  const continuityKnown=instant(continuity.knownAt,"continuityReceipt.knownAt");
  const continuityThrough=date(continuity.sourceBarsThroughDate,"continuityReceipt.sourceBarsThroughDate");
  if(continuity.complete!==true) reasons.push("CONTINUITY_RECEIPT_INCOMPLETE");
  if(continuityKnown.millis>asOf.millis) reasons.push("CONTINUITY_RECEIPT_NOT_AVAILABLE_AS_OF");
  if(
    continuity.version!==continuityVersion||
    continuity.sourceBarsHash!==sourceBarsHash||
    continuity.semanticSpace!=="TECHNICAL_CONTINUITY"
  ) reasons.push("CONTINUITY_LINEAGE_MISMATCH");
  if(continuityThrough<currentDate) reasons.push("CONTINUITY_COVERAGE_INCOMPLETE");
  if(continuityThrough>currentDate) reasons.push("CONTINUITY_PARENT_CONTAINS_POST_OBSERVATION_BAR");
  if(continuity.corporateActionCoverageComplete!==true||Number(continuity.unresolvedRelevantEvents)!==0){
    reasons.push("CORPORATE_ACTION_CONTINUITY_UNRESOLVED");
  }

  const sessions=input?.symbolSessionReceipt||{};
  const sessionId=text(sessions.id,"symbolSessionReceipt.id");
  const sessionKnown=instant(sessions.knownAt,"symbolSessionReceipt.knownAt");
  if(sessions.complete!==true) reasons.push("SYMBOL_SESSION_RECEIPT_INCOMPLETE");
  if(sessionKnown.millis>asOf.millis) reasons.push("SYMBOL_SESSION_RECEIPT_NOT_AVAILABLE_AS_OF");
  const states=new Map((sessions.states||[]).map(row=>[row?.date,row?.state]));
  for(const d of [previousDate,currentDate]){
    if(states.get(d)!=="ELIGIBLE_TRADED_SYMBOL_SESSION") reasons.push(`SYMBOL_SESSION_NOT_VERIFIED@${d}`);
  }

  const trend=input?.trendContextReceipt||{};
  const trendId=text(trend.id,"trendContextReceipt.id");
  const trendVersion=text(trend.version,"trendContextReceipt.version");
  const trendState=text(trend.state,"trendContextReceipt.state").toUpperCase();
  const trendKnown=instant(trend.knownAt,"trendContextReceipt.knownAt");
  const trendBarsThrough=date(trend.barsThroughDate,"trendContextReceipt.barsThroughDate");
  if(trend.complete!==true) reasons.push("TREND_CONTEXT_RECEIPT_INCOMPLETE");
  if(trendKnown.millis>asOf.millis) reasons.push("TREND_CONTEXT_NOT_AVAILABLE_AS_OF");
  if(trendBarsThrough>=currentDate) reasons.push("TREND_CONTEXT_USES_PATTERN_OR_FUTURE_BAR");
  text(trend.methodId,"trendContextReceipt.methodId");
  text(trend.sourceHash,"trendContextReceipt.sourceHash");

  const location=input?.structuralLocationReceipt||{};
  const locationId=text(location.id,"structuralLocationReceipt.id");
  const locationVersion=text(location.version,"structuralLocationReceipt.version");
  const locationState=text(location.state,"structuralLocationReceipt.state").toUpperCase();
  const locationKnown=instant(location.knownAt,"structuralLocationReceipt.knownAt");
  const locationThrough=date(location.confirmedThroughDate,"structuralLocationReceipt.confirmedThroughDate");
  if(location.complete!==true) reasons.push("STRUCTURAL_LOCATION_RECEIPT_INCOMPLETE");
  if(locationKnown.millis>asOf.millis) reasons.push("STRUCTURAL_LOCATION_NOT_AVAILABLE_AS_OF");
  if(locationThrough>=currentDate) reasons.push("STRUCTURAL_LOCATION_USES_PATTERN_OR_FUTURE_BAR");
  text(location.sourceHash,"structuralLocationReceipt.sourceHash");

  if(reasons.length){
    const conflict=reasons.some(x=>x.includes("MISMATCH")||x.includes("OUTCOME_CONTAMINATED"));
    return result(conflict?"PROVENANCE_CONFLICT":"DATA_BLOCKED",reasons,{
      asOfTimestamp:asOf.value,observationId,observationCommitment,
    });
  }

  const trendClass=contextClass(trendState);
  const unknownContext=trendClass==="UNKNOWN"||locationState==="UNKNOWN";
  return result(unknownContext?"READY_WITH_UNKNOWN_CONTEXT":"READY",[],{
    asOfTimestamp:asOf.value,
    observationId,
    observationCommitment,
    detectorVersion,
    previousDate,
    currentDate,
    referenceRange:Object.freeze({high,low}),
    continuityRef:Object.freeze({id:continuityId,version:continuityVersion,sourceBarsThroughDate:continuityThrough}),
    symbolSessionRef:Object.freeze({id:sessionId}),
    trendContext:Object.freeze({id:trendId,version:trendVersion,state:trendState,contextClass:trendClass,barsThroughDate:trendBarsThrough}),
    structuralLocation:Object.freeze({id:locationId,version:locationVersion,state:locationState,confirmedThroughDate:locationThrough}),
    traditionalNameAssigned:false,
    traditionalName:null,
    confirmationIncluded:false,
  });
}

export function attachPostCandleConfirmation({contextReceipt,confirmationBar,asOfTimestamp}){
  const asOf=instant(asOfTimestamp,"asOfTimestamp");
  if(!String(contextReceipt?.status||"").startsWith("READY")){
    return result("DATA_BLOCKED",["BASE_CONTEXT_RECEIPT_NOT_READY"]);
  }
  const dateValue=date(confirmationBar?.date,"confirmationBar.date");
  const availableAt=instant(confirmationBar?.availableAt,"confirmationBar.availableAt");
  const confirmationContinuityId=text(confirmationBar?.continuityReceiptId,"confirmationBar.continuityReceiptId");
  const confirmationThrough=date(confirmationBar?.sourceBarsThroughDate,"confirmationBar.sourceBarsThroughDate");
  const close=finitePositive(confirmationBar?.close,"confirmationBar.close");
  const reasons=[];
  if(dateValue<=contextReceipt.currentDate) reasons.push("CONFIRMATION_NOT_AFTER_OBSERVATION");
  if(availableAt.millis>asOf.millis) reasons.push("CONFIRMATION_NOT_AVAILABLE_AS_OF");
  if(confirmationBar.semanticSpace!=="TECHNICAL_CONTINUITY") reasons.push("CONFIRMATION_NOT_TECHNICAL_CONTINUITY");
  if(confirmationBar.parentContinuityReceiptId!==contextReceipt.continuityRef.id||confirmationBar.continuityVersion!==contextReceipt.continuityRef.version){
    reasons.push("CONFIRMATION_CONTINUITY_LINEAGE_MISMATCH");
  }
  if(confirmationContinuityId===contextReceipt.continuityRef.id) reasons.push("CONFIRMATION_CONTINUITY_GENERATION_NOT_ADVANCED");
  if(confirmationThrough<dateValue) reasons.push("CONFIRMATION_CONTINUITY_COVERAGE_INCOMPLETE");
  if(confirmationBar.symbolSessionState!=="ELIGIBLE_TRADED_SYMBOL_SESSION") reasons.push("CONFIRMATION_SYMBOL_SESSION_NOT_VERIFIED");
  if(reasons.length){
    const conflict=reasons.some(x=>x.includes("MISMATCH"));
    return result(conflict?"PROVENANCE_CONFLICT":"DATA_BLOCKED",reasons,{
      parentObservationCommitment:contextReceipt.observationCommitment,
    });
  }
  const relation=close>contextReceipt.referenceRange.high?"CLOSE_ABOVE_OBSERVATION_HIGH":
    close<contextReceipt.referenceRange.low?"CLOSE_BELOW_OBSERVATION_LOW":"CLOSE_INSIDE_OBSERVATION_RANGE";
  return Object.freeze({
    schemaVersion:"PATTERN_CANDLE_POST_CONFIRMATION_V0_1",
    status:"READY",
    asOfTimestamp:asOf.value,
    parentObservationCommitment:contextReceipt.observationCommitment,
    parentContextReceiptCommitment:stableCommitment(contextReceipt),
    confirmationDate:dateValue,
    confirmationContinuityRef:Object.freeze({id:confirmationContinuityId,parentId:contextReceipt.continuityRef.id,version:confirmationBar.continuityVersion,sourceBarsThroughDate:confirmationThrough}),
    confirmationRelation:relation,
    directionalEffect:"UNKNOWN",
    outcomeFieldsPresent:false,
    researchOnly:true,
    formalCoreImpact:"NONE",
  });
}
