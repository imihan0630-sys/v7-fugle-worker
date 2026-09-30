import assert from "node:assert/strict";
import { advanceDailyResonanceEpisodeV0_1 } from "../runtime/daily_resonance_episode_v0_1.mjs";

const symbol = "3443";
const marketDate = "2026-09-29";
const at1 = "2026-09-29T02:00:00.000Z";
const at2 = "2026-09-29T02:15:00.000Z";
const at3 = "2026-09-29T05:35:00.000Z";
const at4 = "2026-09-29T05:40:00.000Z";

const snap = (displaySignal, signalConfirmationState) => ({
  symbol,
  marketDate,
  displaySignal,
  signalConfirmationState,
});

{
  const first = advanceDailyResonanceEpisodeV0_1({
    symbol,
    marketDate,
    asOf: at1,
    snapshot: snap("BUY_RESONANCE", "PROVISIONAL"),
  });
  assert.equal(first.episode.state, "PROVISIONAL_ACTIVE");
  assert.equal(first.episode.sequence, 1);
  assert.equal(first.events.length, 1);
  assert.equal(first.events[0].type, "OPEN_PROVISIONAL");
  assert.equal(first.shouldNotify, false);

  const repeat = advanceDailyResonanceEpisodeV0_1({
    symbol,
    marketDate,
    asOf: at2,
    snapshot: snap("BUY_RESONANCE", "PROVISIONAL"),
    previousEpisode: first.episode,
    priorSequence: first.nextSequence,
  });
  assert.equal(repeat.episode.episodeId, first.episode.episodeId);
  assert.equal(repeat.events.length, 0);

  const confirmed = advanceDailyResonanceEpisodeV0_1({
    symbol,
    marketDate,
    asOf: at3,
    snapshot: snap("BUY_RESONANCE", "CONFIRMED"),
    previousEpisode: repeat.episode,
    priorSequence: repeat.nextSequence,
  });
  assert.equal(confirmed.episode.state, "CONFIRMED_ACTIVE");
  assert.equal(confirmed.episode.episodeId, first.episode.episodeId);
  assert.equal(confirmed.events.length, 1);
  assert.equal(confirmed.events[0].type, "CONFIRM");

  const released = advanceDailyResonanceEpisodeV0_1({
    symbol,
    marketDate,
    asOf: at4,
    snapshot: snap(null, "NONE"),
    previousEpisode: confirmed.episode,
    priorSequence: confirmed.nextSequence,
  });
  assert.equal(released.episode.state, "RELEASED");
  assert.equal(released.events.length, 1);
  assert.equal(released.events[0].type, "RELEASE");
}

{
  const first = advanceDailyResonanceEpisodeV0_1({
    symbol,
    marketDate,
    asOf: at1,
    snapshot: snap("BUY_RESONANCE", "PROVISIONAL"),
  });
  const retracted = advanceDailyResonanceEpisodeV0_1({
    symbol,
    marketDate,
    asOf: at2,
    snapshot: snap(null, "NONE"),
    previousEpisode: first.episode,
    priorSequence: first.nextSequence,
  });
  assert.equal(retracted.episode.state, "RETRACTED");
  assert.equal(retracted.events[0].type, "RETRACT");

  const reopened = advanceDailyResonanceEpisodeV0_1({
    symbol,
    marketDate,
    asOf: at3,
    snapshot: snap("BUY_RESONANCE", "CONFIRMED"),
    previousEpisode: retracted.episode,
    priorSequence: retracted.nextSequence,
  });
  assert.equal(reopened.episode.state, "CONFIRMED_ACTIVE");
  assert.equal(reopened.episode.sequence, 2);
  assert.equal(reopened.events[0].type, "OPEN_CONFIRMED");
}

{
  const entry = advanceDailyResonanceEpisodeV0_1({
    symbol,
    marketDate,
    asOf: at1,
    snapshot: snap("BUY_RESONANCE", "CONFIRMED"),
  });
  const opposite = advanceDailyResonanceEpisodeV0_1({
    symbol,
    marketDate,
    asOf: at2,
    snapshot: snap("EXIT_RESONANCE", "PROVISIONAL"),
    previousEpisode: entry.episode,
    priorSequence: entry.nextSequence,
  });
  assert.equal(opposite.events.length, 2);
  assert.equal(opposite.events[0].type, "RELEASE");
  assert.equal(opposite.events[1].type, "OPEN_PROVISIONAL");
  assert.equal(opposite.episode.side, "EXIT");
  assert.equal(opposite.episode.sequence, 2);
}

console.log("System2 daily resonance episode V0.1 tests passed");
