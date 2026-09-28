// Research-only continuous breakout path descriptors.
// Describes causal paths without a tuned N-bar success/failure rule.

function reqText(value,field){
  const out=String(value??"").trim();
  if(!out) throw new Error(`MISSING_${field}`);
  return out;
}

function finite(value,field){
  const out=Number(value);
  if(!Number.isFinite(out)) throw new Error(`INVALID_${field}`);
  return out;
}

function normalizeBoundary(raw){
  const lower=finite(raw?.lower,"boundary.lower");
  const upper=finite(raw?.upper,"boundary.upper");
  if(upper<lower) throw new Error("BOUNDARY_ORDER_INVALID");
  return Object.freeze({
    boundaryId:reqText(raw?.boundaryId,"boundaryId"),
    version:reqText(raw?.version,"boundary.version"),
    lower,
    upper,
  });
}

function normalizeBars(rawBars){
  if(!Array.isArray(rawBars)) throw new Error("BARS_ARRAY_REQUIRED");
  let previous=null;
  return rawBars.map((raw,index)=>{
    const date=reqText(raw?.date,`date@${index}`);
    if(previous&&date<=previous) throw new Error("BARS_NOT_STRICTLY_ASCENDING");
    previous=date;
    const sessionState=raw?.eligibleSymbolSession===false?"NON_SESSION":
      raw?.eligibleSymbolSession===true?"ELIGIBLE":"UNKNOWN";
    if(sessionState==="NON_SESSION") return Object.freeze({date,sessionState});
    const open=finite(raw?.open,`open@${index}`);
    const high=finite(raw?.high,`high@${index}`);
    const low=finite(raw?.low,`low@${index}`);
    const close=finite(raw?.close,`close@${index}`);
    if(high<low||open>high||open<low||close>high||close<low) throw new Error(`OHLC_INVALID@${date}`);
    return Object.freeze({
      date,open,high,low,close,sessionState,
      priceLimitConstrained:raw?.priceLimitConstrained===true,
      observationAvailable:raw?.observationAvailable!==false,
    });
  });
}

function signedCloseDistance(direction,row,boundary){
  return direction==="UP"?row.close-boundary.upper:boundary.lower-row.close;
}

function intradayFavorable(direction,row,boundary){
  return direction==="UP"?Math.max(0,row.high-boundary.upper):Math.max(0,boundary.lower-row.low);
}

function intradayAdverse(direction,row,boundary){
  return direction==="UP"?Math.max(0,boundary.upper-row.low):Math.max(0,row.high-boundary.lower);
}

function closeState(direction,row,boundary){
  if(direction==="UP"){
    if(row.close>boundary.upper) return "BEYOND_BREAK_BOUNDARY";
    if(row.close<boundary.lower) return "BEYOND_FAILURE_EDGE";
    return "INSIDE_ZONE";
  }
  if(row.close<boundary.lower) return "BEYOND_BREAK_BOUNDARY";
  if(row.close>boundary.upper) return "BEYOND_FAILURE_EDGE";
  return "INSIDE_ZONE";
}

export function describeBreakoutPath({
  direction,
  boundary,
  bars,
  asOfDate=null,
  atrAtBreak=null,
  atrPointInTimeVerified=false,
}){
  const dir=reqText(direction,"direction");
  if(!["UP","DOWN"].includes(dir)) throw new Error("INVALID_DIRECTION");
  const zone=normalizeBoundary(boundary);
  const cutoff=asOfDate==null?null:reqText(asOfDate,"asOfDate");
  const rows=normalizeBars(bars).filter(row=>cutoff==null||row.date<=cutoff);
  const unknownSessionRows=rows.filter(row=>row.sessionState==="UNKNOWN");
  if(unknownSessionRows.length){
    return Object.freeze({
      direction:dir,boundary:zone,asOfDate:cutoff,
      observationStatus:"DATA_BLOCKED",
      blockedReason:"SYMBOL_SESSION_PROVENANCE_UNKNOWN",
      blockedDates:Object.freeze(unknownSessionRows.map(x=>x.date)),
      directionalEffect:"UNKNOWN",
    });
  }
  const eligible=rows.filter(row=>row.sessionState==="ELIGIBLE");
  const breakIndex=eligible.findIndex(row=>dir==="UP"?row.close>zone.upper:row.close<zone.lower);
  if(breakIndex<0){
    return Object.freeze({
      direction:dir,boundary:zone,asOfDate:cutoff,
      dataThroughDate:eligible.length?eligible.at(-1).date:null,
      observationStatus:"NOT_BROKEN",
      firstConfirmedBreakAt:null,
      episodeId:null,
      directionalEffect:"UNKNOWN",
    });
  }

  const path=eligible.slice(breakIndex);
  const firstBreak=path[0];
  const episodeId=`${zone.boundaryId}:${zone.version}:${dir}:${firstBreak.date}`;
  let constrainedPending=firstBreak.priceLimitConstrained;
  let sawExcludedObservation=false;
  let eligibleOffset=-1;
  let observableOffset=-1;
  let above=0,inside=0,failure=0;
  let currentRun=0,longestRun=0;
  let maxInclusive=0,maxPostBreak=0,maxClose=0,maxAdverse=0,cumulativeSigned=0;
  let firstReentryOffset=null,firstFailureOffset=null,firstReclaimOffset=null;
  let reentryObserved=false;
  let observedInsideOrFailureBeforeReclaim=0;
  let timeInsideOrBelowBeforeReclaim=null;
  const dated=[];

  for(let i=0;i<path.length;i+=1){
    const row=path[i];
    eligibleOffset+=1;
    const favorable=intradayFavorable(dir,row,zone);
    maxInclusive=Math.max(maxInclusive,favorable);
    if(i>0) maxPostBreak=Math.max(maxPostBreak,favorable);

    const excluded=row.priceLimitConstrained||!row.observationAvailable;
    if(excluded){
      sawExcludedObservation=true;
      currentRun=0;
      dated.push(Object.freeze({
        date:row.date,eligibleSessionOffset:eligibleOffset,observableSessionOffset:null,
        state:row.priceLimitConstrained?"CONSTRAINED_UNOBSERVABLE":"OBSERVATION_UNAVAILABLE",
        signedCloseDistance:null,
      }));
      continue;
    }

    if(constrainedPending&&!row.priceLimitConstrained) constrainedPending=false;

    observableOffset+=1;
    const state=closeState(dir,row,zone);
    const signed=signedCloseDistance(dir,row,zone);
    const adverse=intradayAdverse(dir,row,zone);
    maxClose=Math.max(maxClose,Math.max(0,signed));
    maxAdverse=Math.max(maxAdverse,adverse);
    cumulativeSigned+=signed;

    if(state==="BEYOND_BREAK_BOUNDARY"){
      above+=1;
      currentRun+=1;
      longestRun=Math.max(longestRun,currentRun);
      if(reentryObserved&&firstReclaimOffset==null){
        firstReclaimOffset=eligibleOffset;
        timeInsideOrBelowBeforeReclaim=observedInsideOrFailureBeforeReclaim;
      }
    }else{
      currentRun=0;
      if(state==="INSIDE_ZONE"){
        inside+=1;
        if(firstReentryOffset==null) firstReentryOffset=eligibleOffset;
      }else{
        failure+=1;
        if(firstReentryOffset==null) firstReentryOffset=eligibleOffset;
        if(firstFailureOffset==null) firstFailureOffset=eligibleOffset;
      }
      reentryObserved=true;
      if(firstReclaimOffset==null) observedInsideOrFailureBeforeReclaim+=1;
    }
    dated.push(Object.freeze({
      date:row.date,eligibleSessionOffset:eligibleOffset,observableSessionOffset:observableOffset,
      state,signedCloseDistance:signed,
    }));
  }

  const observableBars=above+inside+failure;
  const status=constrainedPending&&observableBars===0?"CONSTRAINED_UNRESOLVED":
    sawExcludedObservation?"PARTIALLY_OBSERVED":"OBSERVABLE";
  const atr=atrAtBreak==null?null:Number(atrAtBreak);
  const atrReady=Number.isFinite(atr)&&atr>0&&atrPointInTimeVerified===true;

  return Object.freeze({
    direction:dir,
    boundary:zone,
    asOfDate:cutoff,
    dataThroughDate:eligible.length?eligible.at(-1).date:null,
    observationStatus:status,
    firstConfirmedBreakAt:firstBreak.date,
    episodeId,
    denominator:"OBSERVABLE_UNCONSTRAINED_ELIGIBLE_SYMBOL_SESSIONS_SINCE_BREAK",
    eligibleBarsSinceBreak:path.length,
    observableBarsSinceBreak:observableBars,
    eligibleBarsBeyondBreakBoundary:above,
    eligibleBarsInsideZone:inside,
    eligibleBarsBeyondFailureEdge:failure,
    fractionBeyondBreakBoundary:observableBars?above/observableBars:null,
    longestConsecutiveBeyondBoundaryRun:longestRun,
    currentConsecutiveBeyondBoundaryRun:currentRun,
    maxFavorableIntradayExtensionBreakInclusive:maxInclusive,
    maxFavorableIntradayExtensionPostBreak:maxPostBreak,
    maxFavorableClosingExtension:maxClose,
    maxAdverseIntradayDistanceFromBreakEdge:maxAdverse,
    maxFavorableIntradayExtensionAtr:atrReady?maxInclusive/atr:null,
    maxFavorableClosingExtensionAtr:atrReady?maxClose/atr:null,
    maxAdverseIntradayDistanceAtr:atrReady?maxAdverse/atr:null,
    atrReadiness:atrReady?"PIT_VERIFIED":"UNKNOWN_OR_UNVERIFIED",
    firstReentryEligibleSessionOffset:firstReentryOffset,
    firstFailureEligibleSessionOffset:firstFailureOffset,
    firstReclaimEligibleSessionOffset:firstReclaimOffset,
    observedInsideOrFailureBarsBeforeFirstReclaim:timeInsideOrBelowBeforeReclaim,
    cumulativeSignedCloseDistance:cumulativeSigned,
    datedClosePath:Object.freeze(dated),
    noFollowThroughDescriptor:Object.freeze({
      status:"DESCRIPTIVE_ONLY_NO_BOOLEAN_VERDICT",
      maxFavorableClosingExtension:maxClose,
      fractionBeyondBreakBoundary:observableBars?above/observableBars:null,
      currentConsecutiveBeyondBoundaryRun:currentRun,
      tunedNDayThreshold:null,
    }),
    directionalEffect:"UNKNOWN",
  });
}
