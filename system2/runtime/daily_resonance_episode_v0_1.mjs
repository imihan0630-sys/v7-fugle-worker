// System2 research-only resonance episode state machine.
// Tracks provisional/confirmed/released resonance episodes for replay and future dedup.
// No persistence, no push, no order side effects.

export const DAILY_RESONANCE_EPISODE_VERSION = "0.1-RESEARCH";

const ACTIVE_STATES = new Set(["PROVISIONAL_ACTIVE", "CONFIRMED_ACTIVE"]);
const TERMINAL_STATES = new Set(["RELEASED", "RETRACTED"]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function isoTimestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(field + " must be an ISO timestamp");
  return text;
}

function signalSide(snapshot) {
  if (snapshot?.displaySignal === "BUY_RESONANCE") return "ENTRY";
  if (snapshot?.displaySignal === "EXIT_RESONANCE") return "EXIT";
  return null;
}

function confirmation(snapshot) {
  return snapshot?.signalConfirmationState === "CONFIRMED"
    ? "CONFIRMED"
    : snapshot?.signalConfirmationState === "PROVISIONAL"
      ? "PROVISIONAL"
      : "NONE";
}

function episodeId(symbol, marketDate, side, sequence) {
  return [
    "S2_RESONANCE",
    String(symbol),
    String(marketDate),
    String(side),
    String(sequence).padStart(3, "0"),
  ].join(":");
}

function freezeEvent(event) {
  return Object.freeze({ ...event });
}

function closeEventFor(previous, at, reason) {
  if (!previous || !ACTIVE_STATES.has(previous.state)) return null;
  const isRetraction = previous.state === "PROVISIONAL_ACTIVE";
  return freezeEvent({
    type: isRetraction ? "RETRACT" : "RELEASE",
    episodeId: previous.episodeId,
    side: previous.side,
    at,
    reason,
  });
}

function closedEpisode(previous, at, reason) {
  const isRetraction = previous.state === "PROVISIONAL_ACTIVE";
  return Object.freeze({
    ...previous,
    state: isRetraction ? "RETRACTED" : "RELEASED",
    releasedAt: at,
    releaseReason: reason,
    updatedAt: at,
  });
}

function openEpisode({ symbol, marketDate, side, at, sequence, confirmationState }) {
  const confirmed = confirmationState === "CONFIRMED";
  return Object.freeze({
    schemaVersion: "SYSTEM2_DAILY_RESONANCE_EPISODE_V0_1",
    episodeVersion: DAILY_RESONANCE_EPISODE_VERSION,
    episodeId: episodeId(symbol, marketDate, side, sequence),
    symbol,
    marketDate,
    side,
    sequence,
    state: confirmed ? "CONFIRMED_ACTIVE" : "PROVISIONAL_ACTIVE",
    firstObservedAt: at,
    confirmedAt: confirmed ? at : null,
    releasedAt: null,
    releaseReason: null,
    updatedAt: at,
    decisionImpact: false,
    notificationImpact: false,
    orderImpact: false,
  });
}

export function advanceDailyResonanceEpisodeV0_1({
  symbol,
  marketDate,
  asOf,
  snapshot,
  previousEpisode = null,
  priorSequence = 0,
} = {}) {
  const code = requiredText(symbol, "symbol");
  const date = requiredText(marketDate, "marketDate");
  const at = isoTimestamp(asOf, "asOf");
  if (!snapshot || typeof snapshot !== "object") throw new Error("snapshot is required");
  if (snapshot.symbol && String(snapshot.symbol) !== code) throw new Error("snapshot symbol mismatch");
  if (snapshot.marketDate && String(snapshot.marketDate) !== date) throw new Error("snapshot marketDate mismatch");
  if (!Number.isInteger(priorSequence) || priorSequence < 0) throw new Error("priorSequence must be a non-negative integer");

  if (previousEpisode) {
    if (previousEpisode.symbol !== code) throw new Error("previousEpisode symbol mismatch");
    if (previousEpisode.marketDate !== date) throw new Error("previousEpisode marketDate mismatch");
    if (![...ACTIVE_STATES, ...TERMINAL_STATES].includes(previousEpisode.state)) {
      throw new Error("unsupported previousEpisode state");
    }
  }

  const side = signalSide(snapshot);
  const confirmationState = confirmation(snapshot);
  const events = [];
  let episode = previousEpisode ? Object.freeze({ ...previousEpisode }) : null;
  let sequence = Math.max(priorSequence, Number(previousEpisode?.sequence || 0));

  if (!side || confirmationState === "NONE") {
    const close = closeEventFor(episode, at, "RESONANCE_NOT_PRESENT");
    if (close) {
      events.push(close);
      episode = closedEpisode(episode, at, "RESONANCE_NOT_PRESENT");
    }
    return Object.freeze({
      schemaVersion: "SYSTEM2_DAILY_RESONANCE_EPISODE_UPDATE_V0_1",
      symbol: code,
      marketDate: date,
      asOf: at,
      activeSignalSide: null,
      episode,
      events: Object.freeze(events),
      nextSequence: sequence,
      shouldNotify: false,
      notificationImpact: false,
      orderImpact: false,
    });
  }

  if (episode && ACTIVE_STATES.has(episode.state) && episode.side !== side) {
    const close = closeEventFor(episode, at, "OPPOSITE_RESONANCE");
    if (close) events.push(close);
    episode = closedEpisode(episode, at, "OPPOSITE_RESONANCE");
  }

  if (!episode || TERMINAL_STATES.has(episode.state)) {
    sequence += 1;
    episode = openEpisode({
      symbol: code,
      marketDate: date,
      side,
      at,
      sequence,
      confirmationState,
    });
    events.push(freezeEvent({
      type: confirmationState === "CONFIRMED" ? "OPEN_CONFIRMED" : "OPEN_PROVISIONAL",
      episodeId: episode.episodeId,
      side,
      at,
    }));
  } else if (
    episode.side === side
    && episode.state === "PROVISIONAL_ACTIVE"
    && confirmationState === "CONFIRMED"
  ) {
    episode = Object.freeze({
      ...episode,
      state: "CONFIRMED_ACTIVE",
      confirmedAt: at,
      updatedAt: at,
    });
    events.push(freezeEvent({
      type: "CONFIRM",
      episodeId: episode.episodeId,
      side,
      at,
    }));
  } else if (episode.side === side && ACTIVE_STATES.has(episode.state)) {
    episode = Object.freeze({ ...episode, updatedAt: at });
  }

  return Object.freeze({
    schemaVersion: "SYSTEM2_DAILY_RESONANCE_EPISODE_UPDATE_V0_1",
    symbol: code,
    marketDate: date,
    asOf: at,
    activeSignalSide: side,
    episode,
    events: Object.freeze(events),
    nextSequence: sequence,
    shouldNotify: false,
    notificationImpact: false,
    orderImpact: false,
  });
}
