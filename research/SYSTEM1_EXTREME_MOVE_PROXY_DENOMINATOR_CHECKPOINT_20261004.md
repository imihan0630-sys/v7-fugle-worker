# System 1 extreme-move proxy denominator audit V0.1

Date: 2026-10-04 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY_IMPLEMENTED / DAILY_COLLECTOR_WIRED / CI_GREEN_MERGED / FORMAL_CORE_LOCKED

## Purpose

Implement the already-frozen prospective denominator contract for the current Formal early admission rule:

`abs(changePercent || 0) >= 9.8`

without treating that proxy as an official Taiwan price-limit classifier.

The audit separates:
- EXTREME_RETURN_PROXY_UP_REJECTED: changePercent >= +9.8;
- EXTREME_RETURN_PROXY_DOWN_REJECTED: changePercent <= -9.8;
- NUMERIC_PROXY_PASS: finite changePercent inside (-9.8,+9.8);
- MISSING_CHANGE_PERCENT: research UNKNOWN even though production's `||0` expression does not reject at this gate.

Positive and negative extreme moves are never pooled for inference.

## Existing authority reused

- `research/extreme_daily_move_gate_falsification_v0_1.json`
- `research/extreme_move_proxy_prospective_denominator_v0_1.json`
- `INFORMATION_DISCRETENESS_SHADOW_SPEC.md`
- `research/formal_gate_overlap_observer_v0_1.mjs`
- `research/SYSTEM1_FIRST_FAILURE_MASKING_CHECKPOINT_20261004.md`
- immutable V8.17+ C1 parent.

The structural mismatch between the 9.8% proxy and exact legal limit state is already frozen. This implementation does not revisit or threshold-sweep that conclusion.

## Formal-reach denominator

A row is in the DAILY_ABNORMALITY strategy-incidence denominator only when all earlier observed gates are PASS in the same immutable C1 generation:

- PRICE_FLOOR;
- HISTORY_60D;
- RS_CONTEXT;
- MARKET_CAP_FLOOR.

Rows with an earlier FAIL are UPSTREAM_FAIL.
Rows with an earlier UNKNOWN/NOT_EVALUABLE are UPSTREAM_UNKNOWN.

The primary incidence denominator is therefore the positively reached population, not all feature rows and not production firstFailure counts.

## Observer parity

The research observer remains the gate-state authority:

- missing changePercent -> UNKNOWN;
- finite abs(changePercent) < 9.8 -> PASS;
- finite changePercent >= +9.8 or <= -9.8 -> FAIL.

The analyzer independently classifies the immutable raw feature and checks exact parity with DAILY_ABNORMALITY.

Any mismatch increments:
`observerParityMismatchN`

and sets:
`evidenceTrust = DATA_QUALITY_BLOCKED`.

## Missing-input semantics

Production uses:
`Math.abs(changePercent || 0)`

so null/missing changePercent does not reject at this specific gate.

Research semantics must not relabel missing as a genuine 0% daily return or an observed PASS.

The audit therefore reports:
- missingChangeN;
- missingButFormalContinuesByProxyCoercionN.

This is a semantic observation only; it does not prove the row survives later Formal gates.

## Directional outputs

Within the positively upstream-reached population:

- finiteChangeN;
- missingChangeN;
- UP proxy-reject count/rate;
- DOWN proxy-reject count/rate;
- any-proxy-reject rate;
- NUMERIC_PROXY_PASS count;
- separate GENERAL / THOUSAND / UNKNOWN pool summaries.

It also cross-checks exact production firstFailure reason:
`單日走勢過度異常`

for UP and DOWN proxy rejects.

## Official limit-state firewall

This Class-A tranche deliberately does not manufacture:

- OFFICIAL_CLOSE_LIMIT_UP;
- OFFICIAL_CLOSE_LIMIT_DOWN;
- OFFICIAL_NON_HIT;
- NO_PRICE_LIMIT;
- NON_COMPARABLE_X.

The daily artifact marks:
`officialLimitStateLayer.status = NOT_JOINED`.

All rows remain:
`OFFICIAL_LIMIT_UNKNOWN_NOT_JOINED`

until an approved exact exchange-date source receipt is joined prospectively.

A return threshold must never be used to fabricate legal limit-state evidence.

## firstFailure masking

When same-date firstFailure masking evidence is available, the audit reports:

- DAILY_ABNORMALITY firstFailure count;
- full observed DAILY_ABNORMALITY fail count;
- fails hidden behind earlier firstFailure reasons.

This separates execution-path reason attribution from full same-session gate-overlap incidence.

## Daily collection

The existing verified C1/C2 evidence path now appends:

`extremeMoveProxyDenominator`.

No new:
- endpoint;
- HTTP/provider call;
- scheduler;
- D1 schema;
- Worker runtime hook;
- Production deployment

is introduced.

## Interpretation guardrails

This audit does not prove:
- 9.8% is too strict;
- positive extreme moves should pass;
- negative extreme moves should pass;
- exact limit state would be economically superior;
- a proxy reject would otherwise become a selected stock;
- missing changePercent should be treated as safe.

Forbidden:
- pooling UP and DOWN outcomes;
- converting missing to zero;
- converting OFFICIAL_LIMIT_UNKNOWN to NON_HIT;
- threshold-sweeping 9.8 after outcomes;
- using candidate-count lift as success.

## Formal boundary

No Formal DAILY_ABNORMALITY threshold, price-limit rule, A/B, liquidity, ATR, RR, grade, score, comparator, quota, capital, BUY/ADD/REDUCE/SELL/STOP, 15m, push, order, Worker, D1, Production or System2 behavior changes.

`economicSuperiority=UNKNOWN`
`formalOptimizationCandidate=NONE`
Formal Core: LOCKED

## Exact next continuation

1. Merge only after exact-head Regression, Repair CI and isolated review are green.
2. Let the existing daily C1 workflow emit the first genuine V8.17+ formal-reach denominator receipt.
3. Keep UP/DOWN/missing separate while independent dates accumulate.
4. Do not join return outcomes until exact official limit-state coverage is separately proven complete where that estimand requires it.
5. Any reformulation of the 9.8% Formal gate is Class-C and requires explicit owner approval plus mature prospective/OOS execution/downside evidence.

## Merge acceptance

- PR #559 merged at `639efbe9d6c24dc5d193f96ce0cdf4277e626c98`.
- Exact head `3e836f65210f50e1dda706ae3ff137515fb71b8b`:
  - V8 Regression Tests run `37203823571` PASS;
  - V8 Repair CI run `37203823669` PASS;
  - System1 C1 C2 isolated offline repair review run `37203823520` PASS.
- No Worker/runtime/D1/Production/Formal/System2 behavior change or Cloudflare deployment was introduced.
- The next required evidence is prospective and will be emitted by the existing daily C1 evidence workflow on genuine trading sessions.
