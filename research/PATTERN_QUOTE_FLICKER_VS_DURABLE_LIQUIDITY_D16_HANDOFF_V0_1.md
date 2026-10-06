# D01 DL-054 — D16 Quote Flicker / Durable Liquidity Handoff V0.1

Updated: 2026-10-06 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## 1. Purpose

D01 freezes the structural-zone relation.
D05 owns event-level quote persistence / cancellation semantics.
D16 owns future inference.

Question:
Does a structural-zone response remain after transient displayed-liquidity / cancel-repost / quote-flicker explanations are separated?

## 2. Evidence grades

Keep separate:
- SNAPSHOT_ONLY_UNKNOWN_PERSISTENCE;
- PERSISTENT_UNTESTED_DISPLAY;
- PRESSURE_SURVIVING_LIQUIDITY_CANDIDATE;
- CANCEL_REPOST_CYCLING_CANDIDATE;
- FLEETING_DISPLAY_CANDIDATE;
- DEPLETION_REFILL_CANDIDATE;
- EVENT_CLOCK_NOT_EVALUABLE.

Do not collapse these into one liquidity-strength score.

## 3. Event-clock requirement

A quote-lifetime, cancellation or repost claim requires a D05-valid event stream / clock.

Sparse snapshots cannot identify individual quote survival or cancel/repost cycles.

## 4. Timing

Only displayed state known by predictorFreezeAt is baseline context.

Later:
- cancellation;
- repost;
- opposing pressure;
- survival assessment

are post-treatment mechanism states.

## 5. Generic comparator

G0:
matched persistence/cancellation profile at salient non-structural price locations.

G1:
matched profile at the frozen structural zone.

Zone localization alone is insufficient.

## 6. Pressure survival

Distinguish:
- depth visible but never challenged;
- depth that survives owner-certified opposing pressure;
- depth that disappears before pressure;
- depth that replenishes after depletion.

Economic durability is not equal to snapshot size.

## 7. Intent caution

Rapid cancellation does not identify spoofing or market-maker intent.

No behavioral/manipulative label may be inferred from public order-book patterns alone.

## 8. Future ladder

R0 raw zone response.
R1 DL-052 shock controls.
R2 DL-053 refill controls.
R3 snapshot size controls.
R4 quote persistence controls.
R5 cancel-repost controls.
R6 pressure survival controls.
R7 generic location comparator.
R8 structural rejection residual candidate.
R9 multi-date/tick-tier replication.

## 9. Common support

Match / report overlap in:
- session type;
- tick tier;
- spread;
- baseline depth;
- transaction intensity;
- volatility/liquidity regime;
- shock context;
- quote-event coverage quality.

## 10. Audit boundary

SDA-001 / SDA-002 remain open.

Multiple microstructure receipts on one structural opportunity do not multiply independent N.

## 11. Promotion boundary

No result changes Formal ranking, weights, Top6, capital, thresholds or runtime.

Formal Core remains LOCKED.
