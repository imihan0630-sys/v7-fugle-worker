# System 1 C3 live-depth normalization preregistry — 2026-10-03

Status: CLASS-A RESEARCH / PREREGISTERED / FORMAL CORE LOCKED

## Purpose

Freeze an outcome-blind normalization method for raw intraday top-five depth
before any mature C3/no-retest outcome is used to choose a mapping.

Parent:
- research/SYSTEM1_C3_DEPTH_SEMANTICS_CHECKPOINT_20261003.md

## Frozen V0.1 method

Schema:
SYSTEM1_C3_LIVE_DEPTH_PREREGISTRY_V0_1

Method:
SAME_SYMBOL_SAME_15M_SLOT_PRIOR_SESSION_ECDF_MIDRANK_V0_1

Inputs:
- bidDepth5
- askDepth5
- depthImbalance
- spreadPct
- symbol
- 15m slot
- tradeDate / quoteTimestamp

Baseline:
- same symbol only;
- same 15m slot only;
- strictly prior sessions only;
- latest 20 prior sessions maximum;
- minimum 10 prior sessions;
- duplicate session rows rejected;
- same-day or future rows rejected.

Outputs:
- totalDepthPercentile via empirical CDF midrank;
- spreadQualityPercentile via 100 - empirical CDF midrank;
- raw signed depthImbalance;
- bidSharePct.

## Explicit non-authorizations

V0.1 does NOT create:
- compositeDepthScore;
- live depth threshold;
- trigger eligibility;
- no-retest entry permission;
- BUY/WATCH/selection authority.

Every normalized vector has:
- compositeDepthScore = null
- triggerEligible = false
- outcomeLabelsUsed = false

Insufficient prior-session baseline remains:
UNKNOWN_INSUFFICIENT_BASELINE

No missing data is imputed.

## Why no composite score

The current C3 entry contract has historical thresholds on a selection-time
depthScore. Raw live order-book depth is a different semantic object.

A composite live score would require a separately frozen weighting/decision
contract. Choosing weights after observing outcomes would create post-hoc
selection risk.

Therefore V0.1 only preregisters normalized components.

## Formal boundary

No Worker/runtime/D1/provider-call/Cron/signal/push/order/allocation/System2
path changes.

No existing C3 trigger changes.
Economic superiority remains UNKNOWN.
Formal Core remains locked.
