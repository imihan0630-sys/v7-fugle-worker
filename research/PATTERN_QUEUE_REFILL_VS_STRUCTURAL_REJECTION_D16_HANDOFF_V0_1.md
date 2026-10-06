# D01 DL-053 — D16 Queue Refill / Structural Rejection Handoff V0.1

Updated: 2026-10-06 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## 1. Purpose

D01 freezes structural-zone relation and opportunity semantics.
D05 owns microstructure primitives.
D16 owns future mechanism-separation inference.

Question:
Does structural rejection remain after generic post-shock liquidity replenishment / queue refill is controlled?

## 2. Never use refill as baseline when observed after the opportunity

Post-opportunity clocks:
- refillFirstObservedAt;
- refillConfirmedAt;
- depthRecoveryAt;
- priceRecoveryAt.

They are mechanism / mediator states and cannot enter the baseline predictor set.

## 3. Distinguish survival from refill

Report separately:
- PREEXISTING_DEPTH_SURVIVED;
- DEPTH_DEPLETED_THEN_REFILLED;
- DEPTH_DEPLETED_NO_REFILL;
- DEPTH_STATE_UNKNOWN;
- REFILL_IDENTIFIABILITY_BLOCKED.

Do not collapse survival and replenishment into one supportive-depth label.

## 4. D05 owner receipt is mandatory

A refill claim requires D05-valid event-clock / source semantics.

Sparse open/10m/15m/30m snapshots are insufficient for seconds-scale refill identification.

If the provider clock cannot certify queue events, use a weaker displayed-depth-change label or mark the mechanism blocked.

## 5. Generic refill comparator

G0:
generic post-shock refill under matched shock/liquidity/session context away from or unrelated to the structural zone.

G1:
zone-associated refill under comparable context.

Zone association alone does not prove structural memory.

## 6. Future ladder

R0 raw touch response.
R1 DL-052 shock snapback controlled.
R2 preexisting depth controlled.
R3 survival vs depletion separated.
R4 generic refill controlled.
R5 zone localization controlled.
R6 refill timing mediator separated.
R7 structural rejection residual candidate.
R8 independent replication.

## 7. Common support

Preserve overlap in:
- shock context;
- spread;
- preexisting depth;
- relative tick;
- price tier;
- liquidity regime;
- transaction intensity;
- session state;
- structural age;
- DL-052 snapback context.

## 8. Mechanism caution

Displayed depth is not committed demand.
Refill does not identify inventory motive.
Public book data do not identify hidden liquidity or market-maker intent.

## 9. Audit boundary

SDA-001 / SDA-002 remain open.
One structural opportunity remains one parent even when multiple mechanism receipts exist.

## 10. Promotion boundary

No result changes Formal ranking, Top6, weights, capital, thresholds or runtime.

Formal Core remains LOCKED.
