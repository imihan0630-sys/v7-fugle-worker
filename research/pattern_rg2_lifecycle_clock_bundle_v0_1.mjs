// PATTERN-RG2 canonical lifecycle clock bundle v0.1
// Research-only adapter. Reuses the shared breakout lifecycle engine.
import {createHash} from "node:crypto";
import {analyzeBreakoutLifecycle} from "./pattern_breakout_lifecycle_v0_1.mjs";

function text(x){return typeof x==="string"?x.trim():"";}
function hashDates(xs){
  return createHash("sha256").update(JSON.stringify([...xs].sort())).digest("hex");
}
function uniqSorted(xs){
  const out=[...xs].sort();
  if(new Set(out).size!==out.length) throw new Error("DUPLICATE_SESSION_DATE");
  return out;
}
function blocked(reason,extra={}){
  return {status:"DATA_BLOCKED",reason,lifecyclePathCompletenessState:"BLOCKED",...extra};
}

export function buildRg2LifecycleClockBundle(input={}){
  const asOf=text(input.asOf);
  const relationEpisodeKey=text(input.relationEpisodeKey);
  const localFirstBreakAt=text(input.localFirstBreakAt);
  const continuityReceiptId=text(input.continuityReceiptId);
  const expected=uniqSorted((input.expectedEligibleSessionDates||[]).filter(d=>d<=asOf));
  const bars=[...(input.bars||[])].filter(b=>text(b.date)<=asOf).sort((a,b)=>String(a.date).localeCompare(String(b.date)));
  if(!asOf||!relationEpisodeKey||!localFirstBreakAt||!continuityReceiptId)
    return blocked("CLOCK_CONTEXT_INCOMPLETE");
  if(input.semanticSpaceId!=="TECHNICAL_CONTINUITY")
    return blocked("WRONG_SEMANTIC_SPACE");
  if(Number(input.unresolvedMissingSessions)!==0)
    return blocked("UNRESOLVED_MISSING_SESSIONS");

  const eligibleBars=bars.filter(b=>b.eligibleSymbolSession===true);
  const actual=uniqSorted(eligibleBars.map(b=>text(b.date)));
  const expectedHash=hashDates(expected), actualHash=hashDates(actual);
  if(expectedHash!==actualHash)
    return blocked("ELIGIBLE_DATE_SET_MISMATCH",{expectedEligibleSessionDateSetHash:expectedHash,continuityBarDateSetHash:actualHash});

  for(const b of eligibleBars){
    if(b.symbolSessionVerified!==true) return blocked("SYMBOL_SESSION_UNKNOWN",{blockedAt:b.date});
    if(b.technicalContinuityVerified!==true || b.corporateActionContinuityResolved!==true)
      return blocked("TECHNICAL_CONTINUITY_UNKNOWN",{blockedAt:b.date});
  }
  if(!expected.includes(localFirstBreakAt))
    return blocked("LOCAL_BREAK_NOT_IN_CERTIFIED_ELIGIBLE_SET");

  const boundary=input.parentBoundary||{};
  const lifecycle=analyzeBreakoutLifecycle({
    direction:"UP",
    boundary:{boundaryId:boundary.zoneId,version:String(boundary.zoneVersion),lower:boundary.lower,upper:boundary.upper},
    bars:bars.map(b=>({
      date:b.date,high:b.high,low:b.low,close:b.close,
      eligibleSymbolSession:b.eligibleSymbolSession===true,
      priceLimitConstrained:b.priceLimitConstrained===true
    })),
    asOfDate:asOf
  });

  const pbreak=lifecycle.firstConfirmedBreakAt;
  let entry=null;
  for(const b of eligibleBars){
    if(b.date<localFirstBreakAt) continue;
    if(b.close>=boundary.lower && b.close<=boundary.upper){entry=b.date;break;}
  }

  let ordinary=null;
  if(pbreak){
    const breakBar=eligibleBars.find(b=>b.date===pbreak);
    if(!breakBar) return blocked("PARENT_BREAK_BAR_NOT_IN_CERTIFIED_SET");
    ordinary=breakBar.priceLimitConstrained===true
      ? lifecycle.firstObservableAfterConstrainedBreakAt
      : pbreak;
  }

  let postBreakOutside=null;
  if(pbreak){
    for(const b of eligibleBars){
      if(b.date<=pbreak) continue;
      if(lifecycle.firstReentryAt && b.date>=lifecycle.firstReentryAt) break;
      if(b.priceLimitConstrained===true) continue;
      if(b.close>boundary.upper){postBreakOutside=b.date;break;}
    }
  }

  return {
    status:"VALID",
    lifecycleClockContractVersion:"PATTERN_RG2_CLOCK_BUNDLE_V0_1",
    relationEpisodeKey,
    asOf,
    sourceBarsThrough:bars.length?bars.at(-1).date:null,
    expectedEligibleSessionDateSetHash:expectedHash,
    continuityBarDateSetHash:actualHash,
    localFirstBreakAt,
    firstParentZoneEntryAt:entry,
    parentFirstBreakAt:pbreak,
    parentFirstOrdinaryObservableAt:ordinary,
    parentFirstPostBreakOutsideCloseAt:postBreakOutside,
    parentFirstReentryAt:lifecycle.firstReentryAt,
    parentFirstFailureAt:lifecycle.firstFailureAt,
    parentFirstReclaimAt:lifecycle.firstReclaimAt,
    lifecyclePathCompletenessState:"COMPLETE_THROUGH_ASOF",
    continuityReceiptId,
    sessionCalendarVersion:text(input.sessionCalendarVersion),
    symbolSessionContractVersion:text(input.symbolSessionContractVersion),
    continuityEngineVersion:text(input.continuityEngineVersion),
    productionDateSetHashAlgorithmFrozen:false,
    formalCoreImpact:"NONE"
  };
}
