# D01 DL-031 — Synthetic Anchor/Zone Translation Control Falsification V0.1

Updated: 2026-10-03 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / NEGATIVE_CONTROL_REJECTION / FORMAL_CORE_LOCKED

## 1. Candidate idea

A tempting mechanism control is:
take a true structural zone and shift it vertically by a fixed amount
(e.g. ±1 ATR or ±1 zone width),
then compare future behavior around the shifted level.

DL-031 evaluates whether this is a valid primary negative control.

Decision:
REJECT as primary empirical mechanism control.

## 2. Shift zone only

If the observed price path is unchanged but the zone is translated:

the control changes simultaneously:
- pre-confirmation touch count;
- prior bounce/rejection history;
- time spent near level;
- current/local distance;
- price-level extremeness;
- round-number proximity;
- legal tick relation;
- simple-high distance;
- historical volume/participation around level.

Therefore the shifted level is not "the same structure without memory."

It changes many salience/opportunity dimensions at once.

## 3. Shift zone and historical path together

If both price history and zone are translated by the same amount:

relative chart geometry can be preserved,
but the synthetic path is not the observed market history.

Problems:
- no actual order flow exists at the translated prices;
- tick-grid legality can change;
- round-price salience changes;
- price-limit / nominal-price-tier mechanics can change;
- future realized outcomes at translated prices do not exist.

This can be a detector-invariance fixture.
It is not an empirical market mechanism control.

## 4. Multiplicative rescaling has the same boundary

Multiplying price/zone by a scale factor is useful for:
- price-scale invariance QA;
- normalized detector correctness.

It is not evidence that the market would behave identically at the counterfactual nominal level.

Taiwan tick schedules and price clustering make exact nominal level economically/mechanically relevant.

## 5. Arbitrary offset family creates hidden search

Testing:
±0.5 ATR, ±1 ATR, ±2 ATR,
±1 zone width, ±2 zone widths,
or many percentage shifts

creates another technical-rule grid.

Choosing the "best placebo" after outcomes is data snooping.

D01 does not freeze an arbitrary translation grid because no strong causal basis selects one.

## 6. Correct role of translation fixtures

Allowed:
DETECTOR_INVARIANCE_QA.

Questions:
- does normalized geometry survive pure mathematical rescaling where expected?
- does semantic-space/tick-aware code correctly flag cases where invariance should NOT be assumed?
- does boundary versioning remain stable under fixture transformations?

Not allowed:
- infer structural-memory alpha;
- estimate a market counterfactual;
- use translated future returns.

## 7. Preferred real-history controls

Mechanism inference should instead use:
1. DL-027 parent-specific real-history non-anchor pseudo-zone pool;
2. DL-028/029 O/M/S salience matching and common support;
3. DL-030 BASE-confirmed / MAJOR-rejected detector-frontier controls;
4. simple260High and existing long-horizon redundancy controls.

These preserve actual historical prices.

## 8. Current decision

SYNTHETIC_ZONE_TRANSLATION_AS_MARKET_NEGATIVE_CONTROL =
REJECTED.

SYNTHETIC_TRANSLATION_AS_DETECTOR_QA =
ALLOWED.

ARBITRARY_OFFSET_GRID =
REJECTED.

REAL_HISTORY_CONTROL_PRIORITY =
REQUIRED.

OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## 9. Exact next continuation

1. Do not add translation candidates to DL-027 salience manifests.
2. Preserve any future translation fixtures under detector QA only.
3. Next science: anchor-ablation robustness of confirmed structural zones.
4. No outcome join / no Formal change.
