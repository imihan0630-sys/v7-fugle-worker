// D01 DL-036 touch-history summarizer v0.1
// Research-only / outcome-blind.

function ordinal(date,sessions){return sessions.indexOf(date);}
function median(xs){
 const a=[...xs].sort((x,y)=>x-y);
 if(!a.length)return null;
 const m=Math.floor(a.length/2);
 return a.length%2?a[m]:(a[m-1]+a[m])/2;
}

export function summarizeTouchHistory({
 asOf,
 touchDates=[],
 eligibleSessionDates=[],
 zoneInteractionDates=[],
 observableExposureSessions=null
}={}){
 const sessions=[...eligibleSessionDates].filter(Boolean).sort();
 if(new Set(sessions).size!==sessions.length)
  return {status:"QA_FAIL",reason:"DUPLICATE_ELIGIBLE_SESSION_DATE"};
 const ai=ordinal(asOf,sessions);
 if(ai<0) return {status:"DATA_BLOCKED",reason:"ASOF_NOT_IN_CERTIFIED_SET"};

 const touches=[...touchDates].filter(Boolean).sort();
 if(touches.some(d=>d>asOf))
  return {status:"DATA_BLOCKED",reason:"FUTURE_TOUCH_IN_HISTORY"};
 if(touches.some(d=>ordinal(d,sessions)<0))
  return {status:"DATA_BLOCKED",reason:"TOUCH_OUTSIDE_CERTIFIED_SET"};

 const gaps=[];
 for(let i=1;i<touches.length;i++){
  gaps.push(ordinal(touches[i],sessions)-ordinal(touches[i-1],sessions));
 }

 const last=touches.length?touches.at(-1):null;
 const lastAge=last?ai-ordinal(last,sessions):null;
 const firstLast=touches.length>=2?ordinal(touches.at(-1),sessions)-ordinal(touches[0],sessions):0;

 const interactionSet=new Set((zoneInteractionDates||[]).filter(d=>d<=asOf));
 if([...interactionSet].some(d=>ordinal(d,sessions)<0))
  return {status:"DATA_BLOCKED",reason:"INTERACTION_DATE_OUTSIDE_CERTIFIED_SET"};

 const exposure=Number.isFinite(observableExposureSessions)?observableExposureSessions:null;

 return {
  status:"VALID",
  priorTouchCountThroughAsOf:touches.length,
  interTouchEligibleSessionGaps:gaps,
  firstToLastTouchSpanEligibleSessions:firstLast,
  lastTouchAtThroughAsOf:last,
  lastTouchAgeEligibleSessions:lastAge,
  observableZoneInteractionSessions:interactionSet.size,
  meanInterTouchGap:gaps.length?gaps.reduce((a,b)=>a+b,0)/gaps.length:null,
  medianInterTouchGap:median(gaps),
  touchRate:exposure&&exposure>0?touches.length/exposure:null,
  dwellRatio:exposure&&exposure>0?interactionSet.size/exposure:null,
  independentVoteEligible:false
 };
}
