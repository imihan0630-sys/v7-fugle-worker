# System Alpha Lineage and Double-Count Guard V0.1

Updated: 2026-10-05
Status: CANONICAL_ENGINEERING_GUARD
Scope: System 1 + System 2 research/shadow engineering
Formal Core impact: NONE until explicit owner approval

## Purpose

Prevent the system from mistaking multiple representations of the same underlying information for multiple independent pieces of stock-selection evidence.

The immediate high-risk family is D01 + D02 + D03:

- D01 K-line / pattern / price structure is primarily derived from PRICE_OHLC.
- D03 trend / momentum / reversal / technical indicators is also primarily derived from PRICE_OHLC.
- D02 price-volume contains PRICE_OHLC plus VOLUME / turnover / participation information, so part of D02 can still overlap D01/D03 mechanically.

A stock must not receive multiple independent Alpha votes merely because the same price path is expressed as pattern, breakout, EMA, MACD, ROC, momentum, higher-low, or another deterministic / near-deterministic transform.

## Mandatory lineage fields

Every research/shadow factor, condition, or vote that can affect selection diagnostics MUST expose enough lineage to identify its information ancestry.

Minimum fields:

- factorId
- factorVersion
- domainId
- sourceFamily
- informationRoot
- representationFamily
- featureLineageId
- parentFeatureIds
- redundancyGroupId
- independenceStatus
- decisionClock / firstObservableAt
- provenance / source version

Recommended controlled values for independenceStatus:

- UNKNOWN
- SAME_ROOT_REDUNDANT
- PARTIAL_OVERLAP
- RESIDUAL_CANDIDATE
- RESIDUAL_INCREMENTAL_PROVEN
- INDEPENDENT_SOURCE_PROVEN

Missing lineage MUST fail closed to UNKNOWN and MUST NOT be counted as an independent vote.

## Initial information-root map

At minimum, engineering must recognize these roots:

- PRICE_OHLC
- VOLUME_TURNOVER
- INSTITUTIONAL_FLOW_OWNERSHIP
- INDUSTRY_BREADTH_ROTATION
- FUNDAMENTAL_ACCOUNTING
- EVENT_DISCLOSURE
- VOLATILITY_STATE
- DERIVATIVES
- MACRO_CROSS_MARKET
- MICROSTRUCTURE_LIQUIDITY
- CREDIT_CAPITAL_STRUCTURE

A feature may have multiple roots. Multi-root does not automatically mean independence.

## D01 / D02 / D03 anti-self-deception rule

The following are NOT automatically independent votes:

- breakout + moving-average trend + momentum when all are functions of the same price path;
- ROC + same-horizon return + Momentum index + log return;
- EMA-family + MACD-family confirmations without residual evidence;
- named K-line / chart pattern + trend state when both encode the same local price geometry;
- price-volume conditions whose apparent edge disappears after controlling for price state.

D01/D03 signals from the same PRICE_OHLC root begin as within-family confirmation, not cross-family confirmation.

D02 may contribute an additional vote only to the extent that the volume/participation component adds residual information beyond price-only controls.

## Aggregation requirement

Do not implement naive additive scoring where every factor contributes an independent +1.

The research/shadow layer MUST produce both:

1. raw signal count;
2. de-duplicated evidence-family count.

It should also expose:

- effectiveIndependentEvidenceCount
- overlappingSignalIds
- redundancyGroup contributions
- dominant information roots
- rawScore
- dedupedShadowScore

Until explicit Class C approval, dedupedShadowScore is diagnostic only and MUST NOT replace the Formal Core score/ranking.

Preferred future production architecture, if owner-approved after evidence:

raw features
-> lineage/redundancy grouping
-> within-family aggregation
-> cross-family aggregation
-> ranking

not:

raw features
-> independent additive votes
-> ranking

## Incrementality gate

A signal may graduate from SAME_ROOT_REDUNDANT / PARTIAL_OVERLAP to RESIDUAL_INCREMENTAL_PROVEN only when it has evidence that survives, where applicable:

- direct price-return / trend / structure controls;
- same-horizon alias controls;
- volume / turnover controls;
- industry / market / regime controls;
- PIT / no-look-ahead rules;
- common-support comparison;
- prospective Shadow / OOS or justified purged holdout;
- date-cluster / dependence-aware inference;
- transaction-cost / turnover impact;
- multiple-testing / Factor-Zoo controls.

Simple correlation < 1 is NOT proof of independence.

Different formulas are NOT proof of independence.

Different domain ownership is NOT proof of independence.

## Required diagnostics

System 1 and System 2 research/shadow outputs should make double counting observable.

Minimum diagnostics:

- same-root overlap matrix;
- factor-to-root lineage table;
- raw-vote vs deduped-family-vote comparison;
- selection/rank changes caused by de-duplication;
- Top6 overlap before/after de-duplication;
- effective independent evidence count per selected stock;
- cases where 3+ apparent confirmations collapse to 1 effective family;
- residual incremental-value report for any factor requesting independent-vote status.

## Required test cases

At minimum add deterministic tests for:

1. same-horizon return / ROC / Momentum-index aliases do not create multiple independent votes;
2. EMA / MACD / trend confirmations sharing PRICE_OHLC are grouped unless residual proof exists;
3. D01 breakout + D03 trend from the same price history do not double count;
4. D02 volume confirmation can remain a separate residual candidate only when volume adds information not contained in the price-only control;
5. missing lineage fails closed and cannot inflate evidence count;
6. adding a cosmetic or monotonic transform cannot change effectiveIndependentEvidenceCount;
7. duplicated factor registration cannot inflate dedupedShadowScore;
8. historical replay preserves the same lineage and grouping under identical frozen inputs.

## System 2 resonance note

EMA16, EMA64, Impulse MACD, and similar price-derived resonance components are not automatically three independent conditions.

System 2 may continue to display three visual/semantic conditions, but research evaluation must also report their shared PRICE_OHLC ancestry and effective independent evidence count. Promotion-grade claims require incremental/residual proof rather than counting visual agreement as three independent families.

## Engineering classification

- Adding lineage metadata, diagnostics, overlap matrices, shadow deduped scores, and tests without changing formal selection is Class A and may be implemented autonomously.
- Shared runtime/schema changes with indirect production risk are Class B and require owner review before merge/deploy.
- Any change to formal A/B eligibility, ranking, weight, score, threshold, Top6 composition, or trading behavior is Class C and requires explicit owner approval.

## Acceptance condition for build rooms

A System 1 / System 2 build task touching stock-selection scoring, confluence, resonance, ranking, or factor integration is incomplete unless it answers:

1. What is the information root of each contributing signal?
2. Which signals share a root or deterministic ancestry?
3. What prevents duplicate votes?
4. What evidence justifies any claimed independent contribution?
5. What is the raw-vs-deduped diagnostic result?
6. Did protected Formal outputs remain unchanged unless explicitly approved?

## Current owner intent

Priority is to accelerate a launch-ready stock-selection system without manufacturing confidence from duplicated D01/D02/D03 information.

The target is not to maximize the number of confirming indicators. The target is to maximize validated incremental information available at the decision timestamp.
