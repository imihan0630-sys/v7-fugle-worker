# Corporate Action / History Semantics — Evidence-Gated Owner Decision Memo

Updated: 2026-09-25 Asia/Taipei
Status: RESEARCH DECISION MEMO / NO MERGE / NO DEPLOY
Formal Core: LOCKED / unchanged by this memo

## 1. Decision boundary

This memo does not authorize a merge, deploy, Formal A/B change, ranking change, capital change, monitor change or push change.

It summarizes the evidence now available after CA-091 through CA-099 so that a later owner decision can distinguish:
- data-integrity prerequisites;
- research-only semantic transforms;
- unresolved production dependencies.

## 2. What is now empirically supported

### A. Market-session-only freshness is insufficient
Verified capital-action suspensions can create legitimate symbol-specific no-bar dates while the exchange remains open.

Supported witnesses:
- TWSE 8422;
- TWSE 3593;
- TWSE 8103;
- TPEx 5314.

Safe contract:
`EXPECTED_SYMBOL_SESSIONS = OFFICIAL_EXCHANGE_SESSIONS - VERIFIED_SYMBOL_SUSPENSION_SESSIONS`.

Unknown suspension provenance fails closed.
B-130 stale history remains rejected when no verified suspension explains missing bars.

### B. Corporate-action price continuity matters beyond event day
Real 8454 full-window evidence shows the 2025-08-21 ex-right reset had aged out of 20-session price features by 2025-10-09 but still changed 60-session features:
- raw ret60: about -0.77%;
- technical-continuity ret60: about +4.19%;
- raw MA60: about 259.62;
- technical-continuity MA60: about 253.99;
- raw priorHigh60: 287;
- technical-continuity priorHigh60: about 273.33.

This witness does not flip the full A/B setup on 2025-10-09. That negative result is retained.

### C. Ex-right price stage and later supply stage are different lifecycle events
8454:
- 2025-08-21 EX_RIGHT_PRICE_EVENT;
- 2025-10-09 NEW_SHARES_LISTED / SUPPLY_CHANGE.

The PR #101 real two-stage test confirms:
- price bridge only where the ex-right event requires it;
- no second price reset at listing;
- event-order invariance;
- no mechanical rescaling of old raw share-volume prints;
- normalized volume continuity must be treated separately at the supply stage.

### D. Raw share volume and turnover normalization are not the same semantic space
For pure SUPPLY_CHANGE:
- RAW_SHARE_VOLUME remains a factual executed-share count;
- ISSUED_SHARE_TURNOVER needs a point-in-time issued/listed-share denominator;
- FREE_FLOAT_TURNOVER is a separate denominator and research question.

8454 official company capital history proves exact denominator provenance matters:
- before increase: 252,357,405 shares;
- after registration: 264,975,275 shares;
- new shares: 12,617,870;
- nominal 5% backsolve is off by 5 shares.

Therefore exact denominators must come from direct official share counts, not nominal stock-dividend ratios.

## 3. Executable test evidence

PR #101 current research branch:
`research/class-b-corporate-action-history-semantics-20260925`
head:
`6729c56d045d993c58cd89290411d45a5b394142`

Latest trusted GitHub Actions:
- Research Corporate Action Prototype run `36141243309`: SUCCESS;
- V8 Regression Tests run `36141242876`: SUCCESS;
- V8 Repair CI run `36141243153`: SUCCESS.

Research run explicitly executed and passed:
1. corporate-action continuity prototype tests;
2. symbol-session calendar tests;
3. corporate-action integration falsification matrix.

The matrix includes:
- verified suspension;
- unknown suspension;
- ordinary stale cache;
- multiple corporate actions in one window;
- no-action identity.

Earlier failure run `36140962127` is retained as evidence:
the new TPEx fixture initially asserted a return field outside the validator contract.
The test was corrected without changing prototype behavior, then rerun successfully.

## 4. PR #100 / PR #101 integration implication

PR #100 remains draft and must not be promoted in its current market-session-only freshness form.

Safest dependency order:
1. official exchange calendar;
2. exchange-scoped verified symbol-suspension archive;
3. expected symbol-session derivation;
4. freshness validation;
5. corporate-action context/semantic spaces;
6. Pattern/K-line and other research consumers.

PR #101 is still research-only and contains no Worker.js wiring.

The evidence supports a future integration design.
It does not by itself authorize production wiring.

## 5. Remaining blockers before any owner promotion decision

### Required
- production-grade exchange-scoped suspension source capture with completeness receipts;
- point-in-time event/version archive with correction history;
- explicit raw-vs-normalized volume-space contract in any downstream consumer;
- production integration tests against preserved real historical caches;
- rollback and observability plan;
- owner approval for any Class B runtime change.

### Still UNKNOWN / partial
- exact machine-field contract for TWSE TWTAWU direct payload;
- stable public TPEx halt/resumption machine endpoint contract;
- all-market historical event denominator completeness from free official sources;
- blast radius of current production histories across all corporate-action windows.

## 6. Owner decision options for a future explicit decision

Option A — keep research isolated:
- leave PR #100 and #101 draft/unmerged;
- continue archive/source work and larger validation.

Option B — authorize a new integration branch:
- first implement symbol-session provenance as a prerequisite layer;
- then adapt freshness validation;
- then add corporate-action semantic spaces behind diagnostics/shadow mode;
- no trading-decision impact until separately accepted.

Option C — authorize production promotion later:
Only after B is fully tested and the remaining source/completeness blockers are closed.

This memo does not choose an option and does not execute one.

## 7. Formal boundary

Formal Core remains unchanged.
No merge.
No deploy.
No threshold optimization.
No alpha claim.
No automatic bullish/bearish interpretation of corporate actions.
