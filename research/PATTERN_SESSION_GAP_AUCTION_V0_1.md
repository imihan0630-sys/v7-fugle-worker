# D01 DL-043 — Overnight Gap / Opening Auction / Continuous-Session Separation V0.1

Updated: 2026-10-05 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / SESSION_MECHANISM_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-042 separated event-family clustering from generic Pattern evidence.

DL-043 adds the next mechanism split:

> A daily Pattern response may be generated mainly by close-to-open overnight information, the opening call auction, immediate post-open price discovery, or the later continuous session. Those mechanisms cannot be pooled and then described as one continuous-session Pattern effect.

This is especially important in Taiwan because the opening price is formed by a call auction while the regular session then switches to continuous trading.

No economic outcome is opened in this tranche.

## 2. External evidence / official mechanism

Current TWSE public material states that:
- market open uses a call auction;
- regular trading then proceeds continuously;
- market close again uses a call auction.

Taiwan research on intraday versus overnight return components reports that those components can have distinct and even opposing predictability / momentum behavior.

Therefore D01 must treat:
- PRIOR_CLOSE_TO_OPEN;
- OPEN_CALL_AUCTION;
- IMMEDIATE_POST_OPEN;
- CONTINUOUS_SESSION

as distinct causal/session mechanisms.

D01 consumes D04/D05 session-mechanism semantics and D08/D13 event context.
It does not redefine exchange microstructure.

## 3. Four frozen return / path components

For ordinary adjacent eligible sessions and valid continuity-space prices:

### G0 — OVERNIGHT_GAP_COMPONENT

overnightReturn =
open_t / close_{t-1} - 1

This captures the non-trading interval plus the opening-price discovery outcome.

It is not executable continuously between the two prices.

### G1 — OPEN_AUCTION_COMPONENT

The opening print is produced by the exchange opening call-auction mechanism.

It must retain:
- auction session state;
- opening-price timestamp;
- pre-open / indicative receipt if owner-supported;
- gap / price-limit / corporate-action constraints.

A daily open is not assumed to be an ordinary continuous-trade print.

### G2 — IMMEDIATE_POST_OPEN_COMPONENT

A preregistered early continuous window beginning after the opening auction.

Window definition belongs to the canonical owner / preregistered protocol.
D01 does not choose 1m / 5m / 15m after outcomes.

### G3 — LATER_CONTINUOUS_COMPONENT

Continuous-session path after the immediate opening segment.

This is the primary place to test whether the structural effect persists beyond opening mechanics.

## 4. Daily candle decomposition

A daily candle may combine:
- overnight jump;
- opening-auction clearing;
- early price discovery / reversal;
- later continuous-session acceptance or rejection.

Therefore a daily OHLC pattern is insufficient by itself to identify which mechanism produced the response.

Future Pattern evidence must be decomposable into session components when the research question concerns continuous price structure.

## 5. Three distinct gap notions remain separate

Reuse DL-006C:

- OVERNIGHT_OPEN_GAP:
  open_t vs close_{t-1}.

- NON_OVERLAP_RANGE_GAP:
  low_t > high_{t-1} or high_t < low_{t-1}.

- TECHNICAL_CONTINUITY_GAP:
  gap measured in the verified continuity-adjusted semantic price space.

These are not aliases.

Corporate-action raw gaps must never be treated as ordinary overnight information gaps.

## 6. Session-mechanism owner boundary

D04/D05 canonical session states remain authoritative:

- OPEN_CALL_AUCTION;
- IMMEDIATE_POST_OPEN;
- CONTINUOUS;
- VOLATILITY_INTERRUPTION_OR_TRIAL;
- PRE_CLOSE_CALL_AUCTION;
- CLOSE_CALL_AUCTION;
- UNKNOWN.

D01 consumes those states.

D01 does not create a second opening-auction taxonomy.

UNKNOWN session mechanism never defaults to CONTINUOUS.

## 7. Opening-driven Pattern state

For one Pattern opportunity / structural root, freeze descriptive components:

- priorClose;
- currentOpen;
- overnightGapPrice;
- overnightGapPct;
- overnightGapAtr;
- openLocationRelativeToFrozenBoundary;
- immediatePostOpenMaxFavorableExtension;
- immediatePostOpenMaxAdverseExtension;
- immediatePostOpenCloseLocation;
- laterContinuousMaxFavorableExtension;
- laterContinuousMaxAdverseExtension;
- laterContinuousCloseLocation;
- closeLocationRelativeToFrozenBoundary.

No directional score is defined.

## 8. Mechanism classes

Future descriptive classification may use:

### S0 — GAP_DOMINATED_CANDIDATE

Most observed displacement occurred prior to / at open.

This is a descriptive candidate state only.
No threshold is frozen in D01.

### S1 — OPENING_REVERSAL_CANDIDATE

Gap / opening displacement is materially reversed in the immediate post-open window.

No percentage threshold is frozen.

### S2 — OPENING_CONTINUATION_CANDIDATE

Opening displacement continues through early continuous trading.

### S3 — CONTINUOUS_SESSION_PERSISTENCE_CANDIDATE

Structural response remains observable after the immediate opening segment.

### S4 — SESSION_MECHANISM_NOT_EVALUABLE

Missing open, uncertain auction state, gap continuity uncertainty or incomplete intraday coverage.

These classes are not alpha.

## 9. No outcome-tuned opening window

Prohibited:
- choose first 5m because it looks best;
- then switch to first 15m if 5m fails;
- exclude the opening interval only after seeing reversal;
- define "later continuous" using the best-performing start time.

The session segmentation must be preregistered.

If multiple windows are studied, they form one multiple-testing family under D16.

## 10. Opening auction is not executable path continuity

A close at 100 and next open at 106 does not mean price traded through 101, 102, 103, 104 and 105 in a continuously executable path.

Therefore:
- gap-through-boundary;
- gap-through-stop;
- gap-through-support/resistance

must be distinguished from:
- continuously traded boundary crossing.

A structural boundary skipped by the opening auction may require a different retest / acceptance interpretation from an intraday traded-through crossing.

## 11. Boundary crossing states

For frozen boundary B:

### C0 — CONTINUOUS_CROSS

Verified continuous trading crossed the boundary.

### C1 — OPENING_GAP_CROSS

Prior close and current open are on opposite sides of the boundary with no verified continuous path through B.

### C2 — AUCTION_AT_BOUNDARY

Opening-auction price clears at / within the zone.

### C3 — CONSTRAINED_OPENING_CROSS

Gap / auction crossing occurs under price-limit, halt/resumption or other owner-certified constraint.

### C4 — CROSSING_UNKNOWN

Open / prior close / continuity / session state incomplete.

These states must not be pooled.

## 12. Event interaction

DL-042 event state remains separate from session mechanism.

An event may:
- occur overnight and produce a gap;
- be scheduled but not yet released;
- arrive pre-open;
- arrive during continuous trading.

D01 therefore stores both:
- event state / event clock;
- session mechanism.

Event instance != opening auction mechanism.

## 13. Overnight information vs Pattern memory

If apparent Pattern performance is concentrated in overnight return:

possible explanations include:
- overnight news;
- foreign-market lead-lag;
- opening-auction price discovery;
- overnight risk premium;
- event clustering;
- market/sector gap.

This weakens a claim that the Pattern works through continuous technical support/resistance memory.

It does not prove Pattern is false.

## 14. Immediate-post-open reversal vs continuous persistence

A key future falsifier:

If the gap/opening response disappears or reverses shortly after continuous trading begins, the economic story is opening-mechanism-sensitive.

If the structural response persists well beyond the opening window on independent dates, continuous-session structure becomes more plausible.

Still:
persistent continuation may be momentum / market / sector / event driven.
DL-040..DL-042 controls remain required.

## 15. Session-specific denominator

Future reports must preserve:

- targetOpportunityN;
- overnightGapEvaluableN;
- openAuctionEvaluableN;
- immediatePostOpenEvaluableN;
- laterContinuousEvaluableN;
- fullSessionEvaluableN;
- openingGapCrossN;
- continuousCrossN;
- constrainedOpeningN;
- unknownSessionMechanismN;
- missingOpenN;
- continuityBlockedN.

A study using only full-session-evaluable rows must disclose attrition.

## 16. Common support

Future comparison requires common support in:
- gap magnitude;
- volatility;
- liquidity;
- relative tick;
- price tier;
- event state;
- market/sector gap;
- beta/regime;
- structural age / path state;
- price-limit / halt constraints.

Failure:
SESSION_MECHANISM_EXTRAPOLATION_PROHIBITED.

## 17. Future D16 comparison ladder

T0 RAW_DAILY_PATTERN

T1 OVERNIGHT_INTRADAY_DECOMPOSED

T2 OPEN_AUCTION_SEPARATED

T3 IMMEDIATE_POST_OPEN_SEPARATED

T4 LATER_CONTINUOUS_ONLY

T5 NON_GAP_CONTINUOUS_CROSS_ONLY

T6 SESSION_ROBUST_REPLICATION

Future interpretation:

M0 OVERNIGHT_GAP_EXPLANATION

M1 OPEN_AUCTION_EXPLANATION

M2 IMMEDIATE_POST_OPEN_EXPLANATION

M3 CONTINUOUS_SESSION_RESIDUAL

M4 GAP_CROSS_ONLY

M5 NON_GAP_CONTINUOUS_PATTERN_CANDIDATE

M6 SESSION_ROBUST_PATTERN_CANDIDATE

M7 NOT_EVALUABLE

None proves alpha.

## 18. SDA-001 / information-root boundary

All price-derived session components remain PRICE_OHLC / intraday-price descendants unless direct auction-book / order-book data provide a distinct owner-certified primitive.

Therefore:
- overnight gap;
- opening print;
- early return;
- later continuous return

do not become four independent confirmations.

They are decomposition views of one price path.

effectiveIndependentEvidenceCount remains one by default.

## 19. SDA-002 / no-lookahead boundary

Session decomposition must use data actually available by the predictor freeze.

If the predictor is formed pre-open:
- current opening price is future and unavailable.

If formed at open:
- immediate-post-open and later continuous paths are future.

If formed after first 15m:
- later continuous path remains future.

A later session component may only be an outcome / mediator / subsequent state, not a predictor for an earlier freeze.

## 20. Required manifest fields

Per parent / opportunity:
- parentDecisionId;
- symbol;
- semanticSpace;
- structuralRootId;
- structuralVersionId;
- opportunityAt;
- predictorFreezeAt;
- priorClose;
- currentOpen;
- openKnownAt;
- sessionStateAtFreeze;
- overnightGapPrice;
- overnightGapPct;
- overnightGapAtr;
- overnightGapType;
- frozenBoundaryLower;
- frozenBoundaryUpper;
- boundaryCrossingState;
- immediatePostOpenWindowId;
- immediatePostOpenReceipt;
- laterContinuousWindowId;
- laterContinuousReceipt;
- eventStateReceipt;
- marketGapReceipt;
- sectorGapReceipt;
- volatilityLiquidityReceipt;
- gapLimitConstraintReceipt;
- continuityReceipt;
- evaluabilityState;
- informationRoot;
- effectiveIndependentEvidenceCount;
- manifestVersion/hash.

No future response field belongs in predictor snapshots.

## 21. Current decision

OVERNIGHT_RETURN_EQUALS_INTRADAY_RETURN =
FALSE.

OPENING_AUCTION_PRINT_EQUALS_CONTINUOUS_PRINT =
FALSE.

OPENING_GAP_CROSS_EQUALS_CONTINUOUS_CROSS =
FALSE.

DAILY_PATTERN_EFFECT_EQUALS_CONTINUOUS_SESSION_EFFECT =
FALSE.

OUTCOME_TUNED_OPENING_WINDOW =
PROHIBITED.

SESSION_UNKNOWN_DEFAULTS_TO_CONTINUOUS =
FALSE.

PRICE_PATH_COMPONENTS_CREATE_MULTIPLE_VOTES =
FALSE.

DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT =
1.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 22. Exact next continuation

1. Build deterministic session-decomposition and boundary-crossing helper with adversarial tests.
2. Preserve overnight / opening-auction / immediate-post-open / later-continuous components separately.
3. Consume D04/D05 session receipts, D08/D13 event receipts and existing gap/continuity semantics.
4. Hand T0-T6 / M0-M7 session-mechanism inference to D16.
5. Keep same PRICE_OHLC information-root dedup semantics.
6. Next D01 science: separate opening-gap mechanics from prior-close / reference-price anchoring so apparent support/resistance around prior close is not confused with overnight reversal mechanics.
7. No outcome join / no runtime wiring / no Formal change.
