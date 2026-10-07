# D18-04 U2B CLEAR_NO_ACTION Minimal Feasibility Contract 2026-10-07 V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / MINIMAL_U2B_PATH_FROZEN / EXECUTABLE_BUILDER_PENDING
Owner room: 11｜統計驗證與策略市場狀態研究室
Formal Core impact: NONE

## Purpose

Define the smallest source-honest path that can prove Taiwan PIT feasibility for D18-04 U2B CONTINUITY_CERTIFIED_RETURN without waiting for a complete adjusted-return engine.

The first executable U2B path is deliberately narrow:

`CLEAR_NO_ACTION_ONLY`.

It does not adjust corporate-action days.
It does not infer a total-return series.
It does not create a second continuity authority.

## 1. Technical continuity is not automatically economic-return continuity

System2 NC-T01 needs a continuity state to decide whether technical/price-volume factors may consume a RAW replay window.

D18 U2B asks a different question:
is the close-to-close percentage change an economically interpretable, PIT-safe price return for the cross-sectional return distribution?

Therefore:

`NC_T01_CLEAR_NO_ACTION_ELIGIBLE != AUTOMATIC_U2B_READY`.

D18 may reuse the same evidence package and promotion certifier, but it must add U2B-specific checks:
- exact current and prior symbol-session identity;
- price-space semantic identity;
- complete required action-family coverage for the U2B price-return claim;
- no unresolved lifecycle/reference-price reset;
- exact pair/window hash binding;
- no post-cutoff evidence.

A technical continuity receipt is an input, not a blanket economic-return certificate.

## 2. Minimal V0.1 estimand

Primary V0.1 object:
`U2B_CLEAR_NO_ACTION_PRICE_RETURN`.

For symbol i and market date t:

`r_i,t = rawClose_i,t / rawClose_i,t-1 - 1`

only when all V0.1 gates pass.

Here t-1 means the immediately preceding eligible official symbol-session under the same PIT session/membership contract, not previous calendar day and not merely the previous stored row.

This V0.1 object is:
- close-to-close price return on a certified no-action interval;
- not total shareholder return;
- not an adjusted-return event path;
- not a transaction/fill return.

## 3. Required source/session gates

For every U2B-ready symbol/date:

1. current U0 market membership is PIT-proven;
2. current raw close is valid and source-bound;
3. previous eligible official symbol-session is exact and PIT-proven;
4. prior raw close is valid and source-bound;
5. no unresolved required session gap exists between the pair;
6. source/revision identities are immutable;
7. both rows are available no later than the research decision cutoff appropriate to the after-close D18 context;
8. pair identity is hash-bound.

If a stale older row replaces the required prior session:
`PRIOR_SESSION_SUBSTITUTED`
and U2B is blocked.

## 4. Required continuity gates

The shared continuity authority must produce a receipt for the exact pair/window.

Minimum V0.1 accepted disposition:
`CLEAR_NO_ACTION`.

Required:
- exact symbol/exchange/date range;
- PIT universe state IN_SCOPE;
- event coverage complete for the exact U2B-required corporate-action family set;
- revision coverage complete;
- event reconciliation ambiguityCount=0;
- suspension/lifecycle coverage complete;
- symbol/session completeness certified;
- no active relevant price-reset event in the pair/window;
- no unresolved resume/reference-price boundary;
- receipt generated/available within its allowed decision-time semantics;
- sourceHistoryHash / continuityReceiptId / receiptHash bound to the exact pair.

Any weaker state:
`U2B_CONTINUITY_UNKNOWN`.

## 5. Required-action-family adequacy firewall

Current System2 continuity infrastructure physically covers historical actual-result lanes for:
- EX_RIGHT_DIVIDEND;
- CAPITAL_REDUCTION;
- PAR_VALUE_CHANGE;
for TWSE and TPEx.

These are strong reusable inputs.

However D18 must not silently assert that the current family set exhausts every possible price-space reset relevant to the U2B price-return estimand.

Before a market/exchange receives `U2B_ACTION_FAMILY_SET_COMPLETE=true`, the shared continuity owner/audit must explicitly bind:
- actionFamilySetVersion;
- included family identities;
- excluded/non-applicable reset families with rationale;
- lifecycle/delisting/identifier-change treatment;
- interval/source coverage and revision semantics.

If family-set adequacy is not proven:
`ACTION_FAMILY_COVERAGE_SCOPE_UNPROVEN`
and the row cannot enter U2B even if NC-T01 technical continuity passed.

This prevents technical-continuity scope from being silently widened into economic-return scope.

## 6. No-action is not random missingness

V0.1 will exclude:
- action-event windows;
- unresolved continuity windows;
- new listings with no prior comparable session;
- suspension/resumption ambiguity;
- identifier/market-transfer ambiguity;
- source/revision failures.

Therefore U2B-ready rows may be a selected subset of U0.

Every date must preserve:
- U0 N;
- U1 direction-comparable N;
- U2A raw-return-known N;
- U2B clear-no-action ready N;
- U2B action-event blocked N;
- U2B continuity-unknown N;
- U2B prior-session missing N;
- U2B source/revision invalid N;
- U2B family-scope-unproven N.

No median/mean computed on U2B may be generalized to U0 without explicit coverage/missingness interpretation.

## 7. First descriptors

Once the first executable/physical U2B receipt exists, context-only descriptors may include:
- U2B N;
- U2B/U0 coverage;
- median price return;
- equal-weight mean price return;
- positive/negative/zero shares;
- robust dispersion;
- selected quantiles if support permits;
- TWSE/TPEx separate panels.

The combined panel is allowed only when both markets share compatible decision-time and continuity semantics.

No regime threshold is authorized.

## 8. U2A vs U2B falsification

For every date with adequate support compare:
- U2A raw-return distribution;
- U2B clear-no-action distribution;
- exclusion reason composition.

Required falsification questions:
1. Does the median materially change after continuity certification?
2. Are tails concentrated in action/continuity-unknown rows?
3. Does U2B coverage fall systematically in volatile/stress periods?
4. Does TWSE vs TPEx coverage differ materially?
5. Does a prospective policy conclusion appear only under U2A?

If an apparent market-state edge disappears after U2B certification, classify:
`PRICE_SPACE_CONTAMINATION_SUSPECTED`,
not Alpha.

## 9. Relation to CORR-004

CORR-004 exact expected-session logic is directly reusable.

For the prior-session pair:
- the immediately preceding eligible symbol-session must be exact;
- older-row substitution is forbidden;
- lifecycle exceptions require certified boundaries;
- open STOP without certified resume/active-through proof cannot remove expected sessions.

Therefore CORR-004 physical acceptance is a dependency of trustworthy U2B session identity.

But CORR-004 alone does not prove corporate-action family adequacy.

## 10. Required immutable receipt identity

A future U2B row/aggregate receipt must bind at least:
- marketDate;
- decisionTimestamp;
- symbol;
- exchange;
- currentSourceRowHash;
- priorSourceRowHash;
- currentSessionDate;
- priorEligibleSessionDate;
- sessionCalendarVersion;
- membershipReceipt/version;
- exactPairHash;
- continuityReceiptId;
- continuityReceiptHash;
- sourceHistoryHash;
- actionFamilySetVersion;
- priceSpaceVersion;
- returnDefinitionVersion;
- disposition;
- missingReason if not ready.

Aggregate date receipt additionally binds:
- U0/U1/U2A/U2B denominators;
- reason counts;
- ordered symbol-row hashes;
- aggregate hash.

## 11. Mandatory negative tests

- previous calendar day is a holiday -> use prior official eligible session;
- required prior session missing but older row exists -> block;
- new listing has current close but no comparable prior session -> block;
- STOP observed, RESUME boundary incomplete -> block;
- action event present -> V0.1 CLEAR_NO_ACTION path blocks;
- continuity receipt belongs to a different pair/window -> block;
- one sourceRowHash changes -> pair hash mismatch/block;
- post-cutoff continuity evidence -> block;
- technical continuity passes but U2B action-family adequacy unproven -> block;
- TPEx family adequacy may not be inherited from TWSE;
- zero volume/no usable close may not become zero return;
- U2B missing row may not be imputed as 0.

Positive control:
one exact two-session no-action pair with complete source/session/action-family/lifecycle/revision provenance returns a deterministic U2B price return.

## 12. Maturity implication

This contract alone does not promote D18-04.

D18-04 may approach L3 only after:
- executable tested U2B builder exists;
- at least one physical Taiwan pair passes;
- denominator/reason accounting is complete;
- deterministic replay/hash test passes;
- UNKNOWN fail-closed tests pass;
- no local second continuity truth is invented.

Prospective/OOS strategy evidence remains a later L4 question.

## Exact next

1. Reuse post-CORR004 exact-session infrastructure.
2. Reuse the shared continuity promotion certifier once executable.
3. Obtain explicit U2B action-family-set adequacy from the continuity owner/audit.
4. Build research-only CLEAR_NO_ACTION U2B row + aggregate receipt.
5. Test one no-action positive control and the mandatory negative suite.
6. Measure U2B coverage before any return-distribution regime threshold.
