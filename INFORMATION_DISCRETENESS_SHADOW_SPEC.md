# Information Discreteness / Taiwan Price-Limit Context — Research Spec

Updated: 2026-09-26 Asia/Taipei
Status: DL-001 FALSIFICATION_IN_PROGRESS / RESEARCH_ONLY
Formal Core: LOCKED

## Purpose

This spec narrows DL-001 after redundancy falsification. It does not add a Formal factor.
The standard 20-day Information Discreteness (ID/FIP) measure is mechanically determined by cumulative-return sign plus positive/negative-day proportions (plus zero-day handling), which substantially duplicates existing ret20 + positiveDayRatio20.

The only potentially incremental Taiwan-specific content in the modified non-limit-hit construction is the removal and characterization of official price-limit-hit sessions.

## Structural redundancy result

Let the valid formation window be partitioned into:
- positive non-hit days
- negative non-hit days
- positive limit-hit days
- negative limit-hit days
- zero-return days

Canonical directional imbalance uses the total positive/negative counts.
Any non-hit-only directional imbalance can be reconstructed from:
1. the canonical directional imbalance / positive-day information already represented by ret20 sign + positiveDayRatio20 (+ zero-day count where needed), and
2. limit-hit count + signed limit-hit balance, with denominator semantics recorded.

Therefore:
- plain canonical ID = REJECTED_OR_REDUNDANT as a new feature;
- ID_non_hit is also not an independent broad path factor once existing day-sign information is controlled;
- the incremental object worth testing is the sparse Taiwan price-limit context itself.

## Authoritative price-limit semantics

Primary research state per symbol-session:
- CLOSE_LIMIT_UP
- CLOSE_LIMIT_DOWN
- NON_HIT
- NO_PRICE_LIMIT
- UNKNOWN

Primary hit definition:
- use an official exchange close-at-limit marker when available, or exact close equality to the official exchange limit-up / limit-down price for that session;
- do not classify by an approximate +/-9.5% return threshold;
- intraday touch without close at the limit is a separate descriptive state and is not part of DL-001 v0.1.

Reasons:
- TWSE/TPEx daily limits are based on the session opening-auction reference price, not universally the prior close;
- ex-right/ex-dividend, resumption, no-prior-trade and initial-listing sessions can have different reference-price semantics;
- newly listed common stocks may have no daily price limit during the applicable first-five-session window.

NO_PRICE_LIMIT and UNKNOWN are not NON_HIT.

## Source contract

### TWSE
Preferred prospective exact source:
- official TWT84U / 上市個股股價升降幅度.
- Fields include symbol/name, today's limit-up price, today's opening-auction reference price, today's limit-down price, prior reference/close context.
- Public source is suitable for prospective same-day capture.
- Historical immutable archive/vintage is not assumed from the current daily endpoint. Historical research requiring exact delivered bytes must use an approved archive/product path or remain UNKNOWN.

Do not use current V8.7.1 researchLimitState() as authoritative. It is a heuristic based on OHLC versus prior close and approximate 8%/9.5% bands.

### TPEx
Official evidence:
- EDIS S38 / STKT2QUOTESN.TXT defines the daily change marker: '+' up, '^' limit-up, '-' down, 'v' limit-down, blank flat, 'X' non-comparable.
- S38 also carries next-day reference/limit prices.
- official public historical daily quote queries are available for reconciliation by date.
- historical public query does not by itself prove immutable first-known delivery bytes/vintage; prospective research should archive the raw receipt/hash when collected.

## Frozen primitive fields

Do not create a new additive score yet. Store primitives:
- validLimitStateDays20
- unknownLimitStateDays20
- noPriceLimitDays20
- zeroReturnDays20
- closeLimitUpCount20
- closeLimitDownCount20
- limitHitCount20 = up + down
- signedLimitHitBalance20 = up - down
- limitHitShare20 = limitHitCount20 / valid comparable sessions
- canonicalDirectionalImbalance20 (diagnostic only; expected redundant)
- nonHitDirectionalImbalance20 (diagnostic only)
- nonHitDeltaVsCanonical20 (diagnostic only)

No recency weighting, nonlinear transform, thresholds or score is allowed in v0.1.

## Key falsification gate

If limitHitCount20 == 0:
- the Taiwan non-hit construction contains no price-limit exclusion information;
- any ID_non_hit value is expected to collapse toward the already represented canonical day-sign path;
- such rows must not be counted as evidence that DL-001 adds a new independent factor.

Primary empirical question:
Among rows with authoritative coverage and at least one limit-hit session in the lookback, does price-limit context add incremental information after existing controls?

This is expected to be a sparse subgroup. Low coverage/frequency is a valid reason to reject the idea.

## Required controls

Same-date / date-clustered controls:
- ret20
- positiveDayRatio20
- volatility20
- maxDrawdown20Pct
- breakoutQualityResearch
- overheatPenaltyResearch
- Quiet/Attention state
- gap/corporate-action guards
- liquidity / price tier
- sector / Residual RS
- market regime

Mandatory regime analysis:
- BULL_BROAD
- MIXED
- BEAR_BROAD
or the current canonical equivalents.

## Outcomes

Research-only:
- D1 / D3 / D5 / D10 / D20
- MFE / MAE
- stop-first
- breakout failure / no-follow-through where available
- selection coverage and zero-pick impact only as counterfactual diagnostics

Do not infer investor attention causally from price-limit counts.

## Promotion logic

REJECT if:
- effect disappears after existing controls;
- limit-hit subgroup is too sparse for independent-date evidence;
- effect is one-regime / one-industry fragile without replication;
- source coverage is incomplete or UNKNOWN-heavy;
- transaction-cost / chase / failure risk offsets return benefit;
- result duplicates existing overheat/attention/breakout information.

Only after prospective/OOS, independent-date, regime, redundancy, cost and coverage gates pass may a Formal optimization candidate be surfaced for owner review.

## Engineering classification

- This document/spec: research only.
- Future isolated daily source capture / immutable research receipt with decisionImpact=false: Class A candidate.
- Any use in Formal eligibility/ranking/threshold/score: Class C and owner approval required.

## Exact next continuation

1. Validate a bounded prospective source receipt for TWSE TWT84U and TPEx official daily limit state.
2. Measure coverage and limitHitCount20 frequency before any outcome test.
3. Do not test return outcomes if the exact source/coverage gate is not complete.
4. If frequency is sufficient, test signed limit-hit context incrementally; do not resurrect canonical ID as a separate score.
