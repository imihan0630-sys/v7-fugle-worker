// D01 research-only continuous breakout-path descriptor v0.1
// Outcome-blind / no runtime wiring / Formal Core impact = NONE.
function leq(a,b){ return typeof a==='string' && typeof b==='string' && a<=b; }
function boundaryRef(boundary){ return (boundary.lower + boundary.upper) / 2; }
function signedCloseDistancePct(close,boundary){
  const ref=boundaryRef(boundary); if (!(ref>0)) return null;
  return boundary.direction==='UP' ? (close-boundary.upper)/ref : (boundary.lower-close)/ref;
}
function favorableIntrabarPct(bar,boundary){
  const ref=boundaryRef(boundary); if (!(ref>0)) return null;
  return boundary.direction==='UP' ? (bar.high-boundary.upper)/ref : (boundary.lower-bar.low)/ref;
}
function adverseIntrabarPct(bar,boundary){
  const ref=boundaryRef(boundary); if (!(ref>0)) return null;
  return boundary.direction==='UP' ? (bar.low-boundary.upper)/ref : (boundary.lower-bar.high)/ref;
}
function classifyClose(close,b){
  if (b.direction==='UP') {
    if (close > b.upper) return 'OUTSIDE_FAVORABLE';
    if (close < b.lower) return 'FAILED';
    return 'REENTERED_ZONE';
  }
  if (close < b.lower) return 'OUTSIDE_FAVORABLE';
  if (close > b.upper) return 'FAILED';
  return 'REENTERED_ZONE';
}
function mismatch(ep,b){
  if (ep.semanticSpaceId!==b.semanticSpaceId) return 'SEMANTIC_SPACE_CONFLICT';
  if (ep.boundaryId!==b.boundaryId) return 'NEW_BOUNDARY_OBJECT';
  if (ep.boundaryVersion!==b.boundaryVersion) return 'RESET_REQUIRED_NEW_BOUNDARY_VERSION';
  if (ep.lower!==b.lower || ep.upper!==b.upper) return 'PROVENANCE_CONFLICT_SAME_VERSION_MUTATED';
  if (ep.direction!==b.direction) return 'DIRECTION_CONFLICT';
  return null;
}

export function calculateBreakoutPath({episode,boundary,bars,asOf}){
  const mm=mismatch(episode,boundary);
  if (mm) return blocked(mm,episode,boundary);
  if (!episode.firstConfirmedBreakAt) return blocked('MISSING_BREAK_CLOCK',episode,boundary);
  const usable=bars.filter(b=>leq(b.date,asOf) && b.date>=episode.firstConfirmedBreakAt).sort((a,b)=>a.date.localeCompare(b.date));
  const breakBar=usable.find(b=>b.date===episode.firstConfirmedBreakAt);
  if (!breakBar) return blocked('BREAK_BAR_MISSING',episode,boundary);

  let eligible=0, observable=0, constrained=0;
  let maxFavAll=null,maxFavPost=null,maxAdv=null,cum=0;
  let firstReentryAt=null,firstFailureAt=null,firstReclaimAt=null;
  let reenteredOrFailed=false;
  let lifecycleState='CLOSE_BREAK';
  let anyObservable=false;

  for (const bar of usable){
    if (bar.symbolSessionVerified!==true) return blocked('SYMBOL_SESSION_UNKNOWN',episode,boundary,{blockedAt:bar.date});
    if (bar.eligibleSymbolSession!==true) continue;
    if (bar.technicalContinuityVerified!==true) return blocked('TECHNICAL_CONTINUITY_UNKNOWN',episode,boundary,{blockedAt:bar.date});
    eligible++;
    if (bar.priceLimitConstrained===true){ constrained++; continue; }
    observable++; anyObservable=true;

    const fav=favorableIntrabarPct(bar,boundary);
    const adv=adverseIntrabarPct(bar,boundary);
    const sd=signedCloseDistancePct(bar.close,boundary);
    if (fav!==null) maxFavAll=maxFavAll===null?fav:Math.max(maxFavAll,fav);
    if (bar.date!==episode.firstConfirmedBreakAt && fav!==null) maxFavPost=maxFavPost===null?fav:Math.max(maxFavPost,fav);
    if (adv!==null) maxAdv=maxAdv===null?adv:Math.min(maxAdv,adv);
    if (sd!==null) cum+=sd;

    const c=classifyClose(bar.close,boundary);
    if (c==='REENTERED_ZONE' && !firstReentryAt){
      firstReentryAt=bar.date; reenteredOrFailed=true; lifecycleState='REENTERED_ZONE';
    } else if (c==='FAILED'){
      if (!firstReentryAt) firstReentryAt=bar.date;
      if (!firstFailureAt) firstFailureAt=bar.date;
      reenteredOrFailed=true; lifecycleState='FAILED';
    } else if (c==='OUTSIDE_FAVORABLE'){
      if (reenteredOrFailed && !firstReclaimAt){ firstReclaimAt=bar.date; lifecycleState='RECLAIMED'; }
      else if (!reenteredOrFailed) lifecycleState='HOLDING_OUTSIDE';
    }
  }

  return {
    status:'VALID',
    lifecycleState,
    observationStatus:anyObservable?'OBSERVABLE':(constrained>0?'UNRESOLVED_CONSTRAINED':'UNOBSERVED'),
    eligibleBarsSinceBreak:eligible,
    observableBarsSinceBreak:observable,
    constrainedBarsSinceBreak:constrained,
    maxFavorableExtensionBreakBarInclusive:maxFavAll,
    maxFavorableExtensionPostBreak:maxFavPost,
    maxAdverseExcursion:maxAdv,
    firstReentryAt,firstFailureAt,firstReclaimAt,
    cumulativeSignedDistanceFromBoundary:anyObservable?cum:null,
    firstConfirmedBreakAt:episode.firstConfirmedBreakAt,
    asOf,
    units:'fraction_of_boundary_midpoint',
    formalCoreImpact:'NONE'
  };
}

function blocked(reason,episode,boundary,extra={}){
  return {
    status:'DATA_BLOCKED',reason,lifecycleState:null,observationStatus:'UNKNOWN',
    eligibleBarsSinceBreak:null,observableBarsSinceBreak:null,constrainedBarsSinceBreak:null,
    maxFavorableExtensionBreakBarInclusive:null,maxFavorableExtensionPostBreak:null,maxAdverseExcursion:null,
    firstReentryAt:null,firstFailureAt:null,firstReclaimAt:null,cumulativeSignedDistanceFromBoundary:null,
    firstConfirmedBreakAt:episode?.firstConfirmedBreakAt??null,
    boundaryIdentity: boundary?`${boundary.semanticSpaceId}:${boundary.boundaryId}:v${boundary.boundaryVersion}`:null,
    formalCoreImpact:'NONE',...extra
  };
}
