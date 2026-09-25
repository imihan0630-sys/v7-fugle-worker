// Research-only lifecycle state resolver. No production dependency.
// Purpose: executable CA-109 semantics for revision, cancellation, conflicts,
// same-session multi-stage ordering, duplicate idempotence and no-event coverage.

const STAGE_ORDER = new Map([
  ["PRICE_RESET", 10],
  ["UNIT_SCALE", 20],
  ["SUPPLY_CHANGE", 30],
  ["REGISTRATION", 40],
  ["OTHER", 90]
]);

function s(value) {
  return String(value || "");
}

function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s(value));
}

function stageRank(stage) {
  return STAGE_ORDER.get(s(stage)) ?? STAGE_ORDER.get("OTHER");
}

function semanticValueKey(event) {
  // Conflict detection must compare semantic payload, not record identity.
  return JSON.stringify({
    stage: event.stage,
    effectiveSession: event.effectiveSession,
    transformType: event.transformType || null,
    factor: event.factor ?? null,
    denominatorType: event.denominatorType || null,
    denominatorValue: event.denominatorValue ?? null,
    shareUnitFactor: event.shareUnitFactor ?? null
  });
}

function normalize(event) {
  if (!event || typeof event !== "object") return null;
  const actionFamilyId = s(event.actionFamilyId);
  const stage = s(event.stage || "OTHER");
  const eventVersion = s(event.eventVersion);
  const effectiveSession = s(event.effectiveSession);
  const knownAt = s(event.knownAt);
  if (!actionFamilyId || !eventVersion || !validDate(effectiveSession) || !knownAt) return null;
  return {
    ...event,
    actionFamilyId,
    stage,
    eventVersion,
    effectiveSession,
    knownAt,
    quality: s(event.quality || "UNKNOWN"),
    supersededAt: event.supersededAt ? s(event.supersededAt) : null,
    cancelledAt: event.cancelledAt ? s(event.cancelledAt) : null,
    sourceRecordId: event.sourceRecordId ? s(event.sourceRecordId) : null
  };
}

function versionIdentity(event) {
  return [
    event.actionFamilyId,
    event.stage,
    event.effectiveSession,
    event.eventVersion,
    event.sourceRecordId || ""
  ].join("|");
}

function semanticSlot(event) {
  return [
    event.actionFamilyId,
    event.stage,
    event.effectiveSession
  ].join("|");
}

export function resolvePointInTimeLifecycle({
  events = [],
  targetSession,
  replayAsOf,
  coverageComplete = false
}) {
  const target = s(targetSession);
  const asOf = s(replayAsOf || targetSession);

  if (!validDate(target) || !asOf) {
    return {
      ready: false,
      status: "UNKNOWN",
      reason: "INVALID_REPLAY_CLOCK",
      realizedEvents: []
    };
  }

  const normalized = (Array.isArray(events) ? events : [])
    .map(normalize)
    .filter(Boolean)
    .filter(event => event.quality === "VERIFIED")
    .filter(event => event.knownAt <= asOf);

  // Exact duplicates are ingestion noise, not multiple corporate-action stages.
  const byIdentity = new Map();
  for (const event of normalized) {
    const key = versionIdentity(event);
    if (!byIdentity.has(key)) byIdentity.set(key, event);
  }
  const deduped = [...byIdentity.values()];

  // Select versions that were still the point-in-time live record at replayAsOf.
  // A later correction must not leak into an earlier replay; an old version stops
  // being live only once its supersession is itself known.
  const liveVersions = deduped.filter(event =>
    (!event.supersededAt || event.supersededAt > asOf)
  );

  // Cancellation is a known event-state, not a realized supply/price transform.
  // If cancellation was known by replayAsOf before/on the planned effective
  // session, that planned version never becomes a realized event.
  const notCancelled = liveVersions.filter(event => {
    if (!event.cancelledAt || event.cancelledAt > asOf) return true;
    return event.cancelledAt > event.effectiveSession;
  });

  // Realized events are bounded by target session. Future stages remain planned.
  const realized = notCancelled.filter(event => event.effectiveSession <= target);

  // Within one semantic slot, two active primary semantic payloads are ambiguous
  // unless the revision chain has already superseded one of them.
  const slotMap = new Map();
  for (const event of realized) {
    const key = semanticSlot(event);
    if (!slotMap.has(key)) slotMap.set(key, []);
    slotMap.get(key).push(event);
  }

  for (const [slot, slotEvents] of slotMap.entries()) {
    const payloads = [...new Set(slotEvents.map(semanticValueKey))];
    if (payloads.length > 1) {
      return {
        ready: false,
        status: "UNKNOWN",
        reason: "EVENT_VERSION_CONFLICT",
        conflictSlot: slot,
        realizedEvents: []
      };
    }
  }

  // If multiple records in a semantic slot carry identical semantics, keep one.
  const slotDedup = [];
  for (const slotEvents of slotMap.values()) {
    slotDedup.push(slotEvents
      .slice()
      .sort((a, b) =>
        b.knownAt.localeCompare(a.knownAt) ||
        b.eventVersion.localeCompare(a.eventVersion)
      )[0]);
  }

  slotDedup.sort((a, b) =>
    a.effectiveSession.localeCompare(b.effectiveSession) ||
    stageRank(a.stage) - stageRank(b.stage) ||
    a.actionFamilyId.localeCompare(b.actionFamilyId) ||
    a.eventVersion.localeCompare(b.eventVersion)
  );

  if (!slotDedup.length) {
    if (!coverageComplete) {
      return {
        ready: false,
        status: "UNKNOWN",
        reason: "EVENT_COVERAGE_UNKNOWN",
        realizedEvents: []
      };
    }
    return {
      ready: true,
      status: "NO_EVENT",
      reason: null,
      realizedEvents: []
    };
  }

  return {
    ready: true,
    status: "READY",
    reason: null,
    realizedEvents: slotDedup,
    researchOnly: true,
    decisionImpact: false
  };
}
