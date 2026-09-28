// Research-only causal breakout / false-break lifecycle.
// No outcomes, no tuned N-bar acceptance rule, no production dependency.

function reqText(value, field) {
  const s=String(value??"").trim();
  if (!s) throw new Error("MISSING_"+field);
  return s;
}
function num(value, field) {
  const n=Number(value);
  if (!Number.isFinite(n)) throw new Error("INVALID_"+field);
  return n;
}
function normalizeBoundary(boundary) {
  const lower=num(boundary?.lower,"boundary.lower");
  const upper=num(boundary?.upper,"boundary.upper");
  if (upper<lower) throw new Error("BOUNDARY_ORDER_INVALID");
  return Object.freeze({
    boundaryId:reqText(boundary?.boundaryId,"boundaryId"),
    lower,upper,
    version:reqText(boundary?.version,"boundary.version"),
  });
}
function normalizeBars(bars) {
  if (!Array.isArray(bars)) throw new Error("BARS_ARRAY_REQUIRED");
  let prev=null;
  return bars.map((b,i)=>{
    const date=reqText(b?.date,"date@"+i);
    if (prev && date<=prev) throw new Error("BARS_NOT_STRICTLY_ASCENDING");
    prev=date;
    const high=num(b?.high,"high@"+i);
    const low=num(b?.low,"low@"+i);
    const close=num(b?.close,"close@"+i);
    if (high<low || close>high || close<low) throw new Error("OHLC_INVALID@"+date);
    return Object.freeze({
      date,high,low,close,
      priceLimitConstrained:b?.priceLimitConstrained===true,
      eligibleSymbolSession:b?.eligibleSymbolSession!==false,
    });
  });
}
function inZone(close,b){return close>=b.lower && close<=b.upper;}

export function analyzeBreakoutLifecycle({
  direction,
  boundary,
  bars,
}) {
  const dir=reqText(direction,"direction");
  if (!["UP","DOWN"].includes(dir)) throw new Error("INVALID_DIRECTION");
  const zone=normalizeBoundary(boundary);
  const rows=normalizeBars(bars);

  let firstPierceAt=null;
  let firstConfirmedBreakAt=null;
  let firstObservableAfterConstrainedBreakAt=null;
  let firstReentryAt=null;
  let firstFailureAt=null;
  let firstReclaimAt=null;
  let latestState=dir==="UP"?"BELOW_OR_INSIDE":"ABOVE_OR_INSIDE";
  let acceptanceState="OBSERVABLE";
  let constrainedBreakPending=false;
  let hadConfirmedBreak=false;
  let hadReentryOrFailure=false;
  let breakIndex=null;
  let reentryIndex=null;
  let maxExtension=0;

  const events=[];

  for (let i=0;i<rows.length;i+=1) {
    const b=rows[i];
    if (!b.eligibleSymbolSession) continue;

    const pierce=dir==="UP" ? b.high>zone.upper : b.low<zone.lower;
    const closeBreak=dir==="UP" ? b.close>zone.upper : b.close<zone.lower;
    const rejectedPierce=pierce && !closeBreak;

    if (rejectedPierce && !hadConfirmedBreak) {
      if (!firstPierceAt) firstPierceAt=b.date;
      events.push(Object.freeze({
        date:b.date,
        type:dir==="UP"?"UPPER_PIERCE_REJECTED":"LOWER_PIERCE_REJECTED",
        constrained:b.priceLimitConstrained,
      }));
      latestState=dir==="UP"?"REJECTED_UPPER_PIERCE":"REJECTED_LOWER_PIERCE";
    }

    if (!hadConfirmedBreak && closeBreak) {
      hadConfirmedBreak=true;
      firstConfirmedBreakAt=b.date;
      breakIndex=i;
      constrainedBreakPending=b.priceLimitConstrained;
      acceptanceState=b.priceLimitConstrained?"UNRESOLVED":"OBSERVABLE";
      latestState=b.priceLimitConstrained
        ? "BREAK_OBSERVED_CONSTRAINED"
        : (dir==="UP"?"CLOSE_BREAK_ABOVE":"CLOSE_BREAK_BELOW");
      events.push(Object.freeze({
        date:b.date,
        type:latestState,
        constrained:b.priceLimitConstrained,
      }));
      continue;
    }

    if (!hadConfirmedBreak) continue;

    if (constrainedBreakPending) {
      if (b.priceLimitConstrained) {
        latestState="BREAK_OBSERVED_CONSTRAINED";
        acceptanceState="UNRESOLVED";
        continue;
      }
      constrainedBreakPending=false;
      firstObservableAfterConstrainedBreakAt=b.date;
      acceptanceState="OBSERVABLE";
    }

    const extension=dir==="UP"
      ? Math.max(0,b.high-zone.upper)
      : Math.max(0,zone.lower-b.low);
    if (extension>maxExtension) maxExtension=extension;

    const beyond=dir==="UP" ? b.close>zone.upper : b.close<zone.lower;
    const inside=inZone(b.close,zone);
    const failed=dir==="UP" ? b.close<zone.lower : b.close>zone.upper;
    const retest=dir==="UP"
      ? (b.low<=zone.upper && b.close>zone.upper)
      : (b.high>=zone.lower && b.close<zone.lower);

    if (hadReentryOrFailure && beyond) {
      if (!firstReclaimAt) firstReclaimAt=b.date;
      latestState=dir==="UP"?"RECLAIMED_ABOVE":"RECLAIMED_BELOW";
      events.push(Object.freeze({date:b.date,type:latestState,constrained:false}));
      hadReentryOrFailure=false;
      continue;
    }

    if (failed) {
      if (!firstFailureAt) firstFailureAt=b.date;
      if (!firstReentryAt) firstReentryAt=b.date;
      if (reentryIndex===null) reentryIndex=i;
      hadReentryOrFailure=true;
      latestState=dir==="UP"?"FAILED_BELOW_ZONE":"FAILED_ABOVE_ZONE";
      events.push(Object.freeze({date:b.date,type:latestState,constrained:false}));
      continue;
    }

    if (inside) {
      if (!firstReentryAt) firstReentryAt=b.date;
      if (reentryIndex===null) reentryIndex=i;
      hadReentryOrFailure=true;
      latestState="REENTERED_ZONE";
      events.push(Object.freeze({date:b.date,type:latestState,constrained:false}));
      continue;
    }

    if (retest) {
      latestState=dir==="UP"?"RETESTING_FROM_ABOVE":"RETESTING_FROM_BELOW";
    } else if (beyond) {
      latestState=dir==="UP"?"HOLDING_ABOVE":"HOLDING_BELOW";
    }
  }

  const barsToReentry=(breakIndex!==null && reentryIndex!==null)?reentryIndex-breakIndex:null;
  const falseBreakoutState=
    latestState==="BREAK_OBSERVED_CONSTRAINED" ? "UNRESOLVED_CONSTRAINED" :
    firstFailureAt ? (firstReclaimAt?"FAILED_THEN_RECLAIMED":"FAILURE_CONFIRMED") :
    firstReentryAt ? (firstReclaimAt?"REENTERED_THEN_RECLAIMED":"REENTRY_OBSERVED") :
    firstConfirmedBreakAt ? "CONFIRMED_BREAK_NOT_FAILED" :
    firstPierceAt ? "REJECTED_PIERCE_ONLY" :
    "NO_BREAK_EVENT";

  return Object.freeze({
    direction:dir,
    boundary:zone,
    firstPierceAt,
    firstConfirmedBreakAt,
    firstObservableAfterConstrainedBreakAt,
    firstReentryAt,
    firstFailureAt,
    firstReclaimAt,
    barsToReentry,
    maxObservedExtension:maxExtension,
    latestState,
    acceptanceState,
    falseBreakoutState,
    events:Object.freeze(events),
  });
}
