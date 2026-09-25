# Corporate-Action History Semantics — Class B Proposal

Updated: 2026-09-25 Asia/Taipei
Status: PROPOSAL_ONLY
Formal Core: LOCKED
Deployment: NOT AUTHORIZED

## Problem

Formal daily-history fetch currently does not pin the provider's adjusted-series semantics. Stored close/high/low values feed directly into ret20/ret60, MA, ATR, volatility, platform and A/B setup calculations.

A three-event validation sample found:
- cash-dividend events materially change support-distance/return features;
- a large ex-right event flips multiple A structure conditions;
- a par-value-change event flips the complete A technical setup from false to true under a target-date-known continuity bridge.

Using today's provider adjusted=true series is not a safe historical fix because historical target-day closes can be rewritten by later corporate actions.

## Objective

Make daily-history semantics explicit and auditable without changing the A/B formulas.

Desired research architecture:
1. preserve raw traded OHLC as immutable execution/event truth;
2. attach verified corporate-action reference events;
3. derive a target-date-bounded continuity series for technical-feature research;
4. keep the two series separate;
5. only propose Formal promotion after regression/evidence review.

## Non-goals

This proposal does NOT:
- change A/B thresholds;
- change ranking;
- change RR;
- change pool quotas/capital;
- change entry/add/reduce/sell/stop;
- use future return to choose adjustment methods;
- deploy anything.

## Candidate data contract

For each daily bar:
- date
- rawOpen/rawHigh/rawLow/rawClose
- rawVolumeShares/rawTurnover
- corporateActionPresent
- actionType
- actionReferencePrice
- actionPreviousClose
- actionFactor
- actionSource
- actionEffectiveDate
- actionObservedAt
- continuityOpen/High/Low/Close
- continuityVersion
- targetDateBounded=true/false
- unknownReasons

## Point-in-time rule

For a requested target market date T:
- only corporate actions whose effective date <= T may influence the continuity series;
- actions effective after T must not rewrite bars used in a T historical replay;
- source/vintage must be recorded.

## Volume rule

No price-only transformation is allowed to silently claim volume continuity.

Actions with share-unit changes require separate treatment:
- splits/par-value changes;
- stock dividends;
- capital reductions;
- new-share issuance.

Until a verified share-unit transformation exists:
- price continuity may be tested;
- volume-derived features around the action remain DATA_QUALITY_UNKNOWN or require an explicit guard.

Cash dividends normally do not change share units and can follow a different volume path.

## Benchmark rule

Formal RS currently uses a TWSE price-index benchmark.

Before any promotion, test whether continuity-stock return versus price-index return remains semantically comparable. If not, either:
- keep RS on a raw/reference-consistent return definition; or
- use an appropriately matched benchmark series.

No benchmark change is authorized by this proposal.

## Required offline validation set

At minimum:
1. pure cash dividend;
2. stock dividend;
3. cash capital increase/ex-right;
4. stock split/par-value change;
5. loss-offset capital reduction;
6. cash-refund capital reduction;
7. multiple actions inside 60 days;
8. no-action controls;
9. historical replay before a later action;
10. current-date scans.

## Required diagnostics

For each target date:
- raw vs continuity ret20/ret60;
- MA5/10/20/60;
- ATR/volatility;
- priorHigh20/priorLow20/priorHigh60;
- support/pullback;
- all A/B condition bits;
- selected/not-selected only as Shadow diagnostic;
- missing/unknown fields.

## Promotion gate

A production change can only be considered if:
- point-in-time replay is proven;
- no-action controls reproduce current outputs;
- corporate-action controls eliminate mechanical false discontinuities;
- volume/share-unit handling is explicit;
- RS benchmark semantics are coherent;
- tests cover interaction with PR #100 history-freshness guard;
- rollback is simple;
- owner explicitly approves merge/deployment.

## Current evidence

Three-event diagnostic:
- 2412 cash dividend: A nearSupport flips false -> true.
- 4554 ex-right: A nearSupport and structure flip false -> true.
- 8422 par-value change: complete A technical setup flips false -> true.

This is sufficient to justify engineering investigation, not sufficient to authorize a Formal fix.

No runtime code or deployment is included in this proposal.
