# D03 Momentum Continuation Construct / PIT Feasibility V0.1

Updated: 2026-10-03 Asia/Taipei  
Lane: D03-04｜動能延續  
Classification: Class A（研究專用）  
Formal Core（正式核心）impact: NONE / LOCKED

## Purpose（目的）

This tranche separates three concepts that are often collapsed into one word “momentum”:

1. **Momentum level（動能水準）** — current past-return magnitude / rank;
2. **Momentum persistence（動能持續性）** — stability/quality of the pre-decision path;
3. **Momentum continuation（動能延續）** — what happens **after** the frozen decision timestamp.

The central governance correction is:

> Continuation is primarily an outcome relationship, not a new contemporaneous price factor.

This prevents D03-04 from duplicating D03-02 direct returns or D03-03 persistence under a new label.

No outcome is inspected in this tranche.

---

## TI-504 — D03-04 owns a transition/outcome question, not another retN field

At parent decision time t:

### D03-02 owns
- ret5 / ret20 / ret60;
- same-horizon ROC aliases;
- current direct return level.

### D03-03 owns
- own-path trend-consistency / persistence;
- current persistenceScoreResearch;
- prospective rank-persistency as a separate construct.

### D03-04 owns

The conditional question:

> Given the momentum state known at t, does price continue in the same economic direction after t, and under which preregistered contexts does continuation fail or reverse?

Therefore D03-04 must not create:
- “momentum continuation score” from ret20 + ret60 + MA slope;
- another weighted sum of current price transforms;
- a duplicated rank field.

Primary state is predictor + future transition, not an extra vote.

---

## TI-505 — rolling-return sign retention is rejected as a primary continuation outcome

A tempting definition is:

`ret20(t) > 0 AND ret20(t+5) > 0 => continuation`.

This is invalid as a primary continuation test because `ret20(t+5)` reuses 15 of the 20 pre-decision intervals.

Synthetic counterexample:

- price at t-20 = 100;
- price at t = 120;
- ret20(t) = +20%;
- next 5 sessions fall to 115;
- true forward D5 return = 115/120 - 1 = **-4.1667%**;
- rolling ret20(t+5), comparing 115 with t-15 price 105, remains **+9.5238%**.

A rolling-sign rule would say “momentum stayed positive” despite an actual post-decision loss.

Frozen rejection:

`ROLLING_RETN_SIGN_RETENTION = MECHANICALLY_OVERLAPPED / NOT_PRIMARY_CONTINUATION_OUTCOME`.

It may be stored as descriptive state evolution only.

---

## TI-506 — primary continuation outcomes must be post-decision and non-overlapping with formation

For a decision at t, primary future outcomes are computed only from sessions after t:

- D5 forward close-to-close return;
- D10 forward close-to-close return;
- D20 forward close-to-close return;
- MFE（Maximum Favorable Excursion，最大有利變動）;
- MAE（Maximum Adverse Excursion，最大不利變動）.

For directional symmetry, an optional descriptive transform may be:

```
directionAlignedForwardReturn_h =
sign(frozenMomentumDirectionAtT) * forwardReturn_h
```

But:
- the raw forward return remains authoritative;
- no post-outcome direction reclassification is allowed;
- long-only strategy interpretation remains separate from symmetric research geometry.

Outcome sessions must be exact future symbol sessions, not “next available row” from an unverified cache.

---

## TI-507 — continuation predictor state is frozen before outcomes

Minimal V0.1 decision-time state:

- `ret20`;
- `ret60`;
- `momentumRankPct60` when a complete same-scan universe receipt exists;
- `persistenceScoreResearch`;
- `residualSectorRs20` where provenance is valid;
- `priceTier / relativeTickPct`;
- `liquidityState`;
- `volatilityState`;
- `marketRegimeState`;
- `marketRegimeTransitionState`;
- `constrainedSessionState`;
- `source/continuity lineage`.

No parameter sweep is authorized.

Current predictor state and future outcomes must remain in separate immutable objects.

---

## TI-508 — market-state continuation is a conditioning context, not D03-owned raw evidence

Taiwan evidence shows conventional momentum behavior is strongly conditional on market dynamics.

Lin, Ko, Feng & Yang (2016) reports:
- positive momentum during market-state continuation;
- reversal during market-state transition.

D03 interpretation:
- D03-04 consumes a causally defined Regime/transition state;
- D18 remains owner of market-Regime construction and validation;
- D03 may not create a second market-state engine.

The historical monthly effect size is not a threshold for the current daily system.

External source:
https://www.sciencedirect.com/science/article/pii/S0927538X16300397

---

## TI-509 — intraday and overnight origin can invert “momentum” interpretation

Taiwan evidence also reports different signs depending on whether past momentum originates from intraday versus overnight returns.

Ho, Hsiao, Lo & Yang (2023) reports:
- past intraday-return momentum associated with positive future returns;
- past overnight-return momentum associated with negative future returns in their design.

D03 interpretation:

A single current close-to-close retN can mix:
- overnight gap information;
- regular-session information.

Therefore an unconditional “strong ret20 => continuation” interpretation is too coarse.

D03-04 does not create a new intraday/overnight factor here.
It freezes the confound:

`RETURN_ORIGIN = POTENTIAL_EFFECT_MODIFIER / D03_CONSUMER_ONLY_UNLESS_SOURCE_PROVENANCE_READY`.

External source:
https://www.sciencedirect.com/science/article/abs/pii/S0927538X23002226

---

## TI-510 — persistence does not equal continuation

A high current persistence score is a pre-decision path description.

It does not logically imply positive forward return.

Likewise:
- low persistence can precede continuation;
- high persistence can precede reversal;
- current ret60 rank retention is not itself future profitability.

Future D03-04 testing must therefore estimate:

```
forwardOutcome
~ currentMomentumLevel
+ ownPathPersistence
+ rankPersistencyState
+ ResidualRS
+ Regime/transition
+ liquidity/tick
+ volatility
+ structure
```

The question is incremental conditional separation, not a majority vote.

---

## TI-511 — “winner remains winner” and “winner earns positive future return” are different outcomes

Cross-sectional rank retention asks:

> Does the stock remain in the winner group at the next clean ranking date?

Economic continuation asks:

> Does the stock earn favorable non-overlapping post-decision return/path outcomes?

A stock can:
- earn a negative forward return;
- yet remain high-ranked because peers fall more.

Or:
- earn a positive return;
- yet lose winner status because peers rise more.

Therefore:
- rank retention belongs to persistence/relative-state research;
- forward D5/D10/D20 return belongs to economic continuation research.

Do not substitute one for the other.

---

## TI-512 — overheat is a failure mode, not “stronger momentum”

Existing System 1/Research already has:
- ret20 limits;
- MA20-distance late-stage logic;
- overheatPenaltyResearch;
- ATR / gap context.

A new “extreme momentum continuation” factor would substantially duplicate those controls.

Taiwan momentum literature and the broader momentum literature both warn that momentum is state/horizon dependent and can coexist with shorter-term reversal.

Frozen rule:

`EXTREME_ABSOLUTE_STRENGTH_AS_NEW_CONTINUATION_FACTOR = REJECTED_OR_REDUNDANT`.

D03-04 tests continuation conditional on existing overheat/volatility controls rather than adding another strength score.

---

## TI-513 — Taiwan PIT outcome feasibility requires exact future symbol sessions

Existing research infrastructure already defines D5/D10/D20, MFE and MAE outcomes, but promotion-grade use requires stronger provenance than generic “next available bar” slicing.

Required outcome lineage:
- parentDecisionReceiptId / captureGeneration;
- parent decision timestamp;
- symbol;
- semantic price space;
- symbol-session calendar version;
- verified suspension states;
- corporate-action continuity version;
- exact D+N eligible symbol-session IDs;
- outcome source/version hashes;
- outcome completion timestamp;
- explicit CENSORED / BLOCKED / UNKNOWN states.

If a symbol is suspended:
- do not silently jump to a later bar and still call it D5;
- use the frozen symbol-session horizon contract.

If corporate-action continuity is unresolved:
- outcome remains blocked.

This is consistent with the repository R02 outcome-quality guard.

---

## TI-514 — predictor and outcome data families are already technically available

Decision-time predictors:
- D03 source audit has already validated Taiwan daily history sufficient for ret60 and persistence;
- same-scan ret60 rank construction is technically feasible when full-universe receipts exist;
- Residual RS and Regime are existing cross-lane states with their own provenance requirements.

Outcome side:
- repository research contracts already support D5/D10/D20, MFE, MAE;
- exact symbol-session/corporate-action guards are already defined;
- no new market-data family is required.

Therefore D03-04 can be replayed prospectively once clean parent and future-session receipts accumulate.

Historical outcome reconstruction that lacks the required provenance remains descriptive/non-promotion-grade.

---

## TI-515 — maturity decision

D03-04 advances:

- L2 / 40% / MECHANISM_AND_FALSIFICATION_DEFINED

to:

- **L3 / 60% / TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED**

because:
- D03-04 is now separated from D03-02 return level and D03-03 persistence;
- mechanically overlapped rolling-retention outcomes are explicitly rejected;
- non-overlapping future outcome semantics are frozen;
- Taiwan Regime and return-origin confounds are explicit;
- decision-time predictor fields and future D5/D10/D20/MFE/MAE source families are technically available;
- exact symbol-session/corporate-action outcome provenance requirements are defined;
- no new data family or current-price duplicate is needed.

This does NOT claim:
- continuation alpha;
- a profitable winner threshold;
- market-state effect transportability from monthly literature;
- OOS / Prospective Shadow evidence;
- Formal eligibility.

D03 active modules = 12.

Prior maturity:
- 640 / 1200 = 53.3%.

After D03-04 +20:
- 660 / 1200 = **55.0%**.

---

## Primary future estimand

Primary V0.1 question:

> On clean independent parent dates, conditional on frozen current momentum level and existing controls, is the average non-overlapping forward path materially more favorable in the preregistered continuation context than in the preregistered transition/conflict context?

Primary outcomes:
- D5 return;
- D5 MFE;
- D5 MAE.

Secondary:
- D10;
- D20.

Required controls:
- current ret20/ret60;
- current ret60 rank;
- persistenceScoreResearch;
- Residual RS;
- Regime/transition;
- price tier / zero-return / liquidity;
- volatility/ATR;
- overheat;
- Pattern/Price-Volume setup context.

Date-balanced inference remains mandatory.

No rolling retN sign-retention endpoint is primary.

---

## Deterministic fixture

File:
`research/test_d03_momentum_continuation_construct_v0_1.mjs`

Assertions:
1. current ret20 can be strongly positive while true forward D5 return is negative;
2. rolling ret20 at D+5 can remain positive due to pre-decision overlap;
3. therefore rolling sign retention cannot identify economic continuation;
4. forward D5 uses only post-parent price endpoints;
5. rank retention and forward return are represented as separate states/outcomes;
6. no future outcome is allowed into the parent fingerprint.

---

## Current status

`D03_04 = L3_TAIWAN_PIT_DATA_FEASIBILITY_VALIDATED`

`MOMENTUM_LEVEL = D03_02_OWNER`

`OWN_PATH_PERSISTENCE = D03_03_OWNER`

`MOMENTUM_CONTINUATION = POST_DECISION_TRANSITION_OUTCOME_RELATION`

`ROLLING_RETN_SIGN_RETENTION = REJECTED_AS_PRIMARY_OUTCOME`

`REGIME_STATE = D18_OWNED_CONTEXT`

`OUTCOME_INFERENCE = NO_GO`

`D03_MATURITY = 55.0_PERCENT`

`FORMAL_OPTIMIZATION_CANDIDATE = NONE`

Formal Core remains LOCKED.

---

## Exact next continuation point

1. Raw-byte prospective source gate remains 2/3 over the weekend; no continuation outcomes may bypass it.
2. Keep parent predictor state and future outcome receipts physically/logically separate.
3. Do not use rolling ret20/ret60 sign retention as primary continuation success.
4. Once efficacy inference opens, first preserve TI-005 KD-vs-RSI and TI-006 MACD-vs-direct-trend order; D03-04 continuation analysis remains a later conditional-state study.
5. Next outcome-blind D03 target: D03-05 Pullback（回檔）與短期反轉 — separate a setup-origin pullback from generic short-term reversal, control D01 Pattern and 15m confirmation ownership, and test Taiwan PIT feasibility without creating a duplicate reversal factor.
