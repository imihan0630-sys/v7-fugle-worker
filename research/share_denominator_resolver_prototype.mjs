function iso(s) { return String(s || ""); }

function activeOnSession(version, targetSession) {
  if (iso(version.effectiveFromSession) > iso(targetSession)) return false;
  if (version.effectiveToSession && iso(targetSession) > iso(version.effectiveToSession)) return false;
  return true;
}

export function resolvePointInTimeDenominator({
  versions,
  breaks = [],
  denominatorType,
  targetSession,
  replayAsOf
}) {
  const target = iso(targetSession);
  const asOf = iso(replayAsOf || targetSession);
  const sameType = (Array.isArray(versions) ? versions : [])
    .filter(v => v && v.denominatorType === denominatorType);

  const known = sameType
    .filter(v => v.quality === "VERIFIED")
    .filter(v => iso(v.knownAt) <= asOf)
    .filter(v => activeOnSession(v, target))
    .sort((a,b) =>
      iso(b.effectiveFromSession).localeCompare(iso(a.effectiveFromSession)) ||
      iso(b.knownAt).localeCompare(iso(a.knownAt))
    );

  if (!known.length) {
    return { ready:false, valueShares:null, reason:"DENOMINATOR_UNKNOWN_AT_REPLAY_ASOF" };
  }

  const selected = known[0];
  const sameEffective = known.filter(v => iso(v.effectiveFromSession) === iso(selected.effectiveFromSession));
  const distinct = [...new Set(sameEffective.map(v => Number(v.valueShares)))];
  if (distinct.length > 1) {
    return { ready:false, valueShares:null, reason:"DENOMINATOR_CONFLICT" };
  }

  const relevantBreaks = (Array.isArray(breaks) ? breaks : [])
    .filter(b => b && b.denominatorType === denominatorType)
    .filter(b => b.quality === "VERIFIED")
    .filter(b => iso(b.knownAt) <= asOf)
    .filter(b => iso(b.effectiveFromSession) <= target)
    .filter(b => iso(b.effectiveFromSession) > iso(selected.effectiveFromSession))
    .sort((a,b) => iso(b.effectiveFromSession).localeCompare(iso(a.effectiveFromSession)));

  if (relevantBreaks.length) {
    return {
      ready:false,
      valueShares:null,
      reason:"DENOMINATOR_STALE_ACROSS_VERIFIED_BREAK",
      blockingBreak:relevantBreaks[0]
    };
  }

  return {
    ready:true,
    valueShares:Number(selected.valueShares),
    denominatorType,
    effectiveFromSession:selected.effectiveFromSession,
    knownAt:selected.knownAt,
    sourceRecordId:selected.sourceRecordId || null
  };
}
