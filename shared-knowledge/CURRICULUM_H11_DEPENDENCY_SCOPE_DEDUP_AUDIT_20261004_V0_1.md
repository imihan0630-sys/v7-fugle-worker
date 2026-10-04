# H11 Dependency + Scope De-dup Audit 2026-10-04 V0.1

Status: OWNER_APPROVAL_REQUIRED
Audit base main: `d94a75e990683c293246ed75be0e6da2368ae4ff`
Cluster: H11 — D12-07 vs D12-16
Formal Core impact: NONE

## Accepted specialist return

`research/d12_h11_common_parent_residual_return_20261004_v0_1.json`

Room:
09｜衍生品與國際總經研究室

Terminal specialist recommendation:
`SCOPE_DEDUP_ONLY`.

## Evidence quality

PASS.

The return uses one official TAIFEX option-chain parent and matching futures/rate parents with preserved source identities and hashes.

Common-support method:
- identical eligible monthly option rows;
- valid bid/ask;
- identical log-moneyness support;
- D12-07 simple linear skew / ATM / wing summaries;
- D12-16 quadratic residual-curvature candidate on the same rows;
- leave-one-strike-out RMSE as method diagnostic;
- no market-return outcome join.

Rate sensitivity:
- alternative CBC CD-rate anchors do not explain away the residual curvature advantage.

Historical limitation:
- later-retrieved official data validates replay/method structure;
- it does NOT prove 18:10 decision-time first-known availability;
- therefore both modules remain L2/40%.

## Canonical ownership

### D12-07 — simple skew / term-structure baseline owner

Owns:
- simple skew level/asymmetry;
- ATM / near-far term-structure summaries;
- interpretable baseline slope/wing summaries.

### D12-16 — residual surface owner

Owns only information beyond D12-07 simple baselines:
- residual curvature/smile;
- cross-expiry surface interactions;
- surface construction / fit / coverage quality;
- static-arbitrage / interpolation diagnostics;
- method sensitivity.

D12-16 may not count the same linear skew/ATM term primitive again as a second independent signal.

## Divergent-state audit

PASS.

Observed on the same source parent:
- downside-minus-upside skew stays in a narrow range across monthly tenors;
- curvature changes by more than an order of magnitude;
- quadratic common-support fit improves materially over the linear skew baseline.

This is sufficient to show:
`SIMPLE_SKEW_TERM != RESIDUAL_SURFACE_CURVATURE`.

## Dependency Audit

Shared parent:
one option/futures/rate source family and one option-surface support set.

Producer-consumer relation:
- D12-07 supplies simple baseline summaries;
- D12-16 tests residual structure after those baselines.

Result:
`PASS_SIMPLE_BASELINE_TO_RESIDUAL_SURFACE_GRAPH`.

## Anti-double-count

1. one option-chain parent;
2. one simple skew/term baseline;
3. D12-16 receives only residual curvature/surface information after D12-07;
4. surface-fit diagnostics are not directional votes;
5. multiple surface methods are robustness diagnostics, not multiple evidence votes;
6. D12-16 cannot re-label D12-07 skew as its own independent signal.

Result:
`PASS_ONE_PARENT_ONE_SIMPLE_BASELINE_RESIDUAL_ONLY`.

## Anti-orphan

KEEP_SEPARATE preserves:
- interpretable simple skew/term summaries;
- richer residual curvature/surface construction and quality diagnostics.

Merging would either lose simple interpretable baseline ownership or blur residual/model-risk semantics.

Result:
`PASS_NO_ORPHAN`.

## Proposed canonical cleanup

No rename.
No module-count change.
No maturity change.

Proposed scope wording cleanup only:

D12-07:
simple skew level/asymmetry + ATM/near-far term-structure baselines.

D12-16:
residual curvature/smile + cross-expiry surface interaction + construction/fit/coverage/static-arbitrage quality after D12-07 baselines.

Both remain:
- D12-07 L2/40%;
- D12-16 L2/40%.

## Owner decision required

Because this changes canonical learningScope/status wording, explicit owner approval is required.

Recommended decision:
`KEEP_SEPARATE / SCOPE_DEDUP_ONLY`.

Current state:
`OWNER_APPROVAL_REQUIRED`.

If approved:
- update D12-07/D12-16 learningScope/status wording only;
- preserve names, L2/40%, module count and aggregate maturity;
- update Router / Shared Master / H11 registries;
- create canonical receipt;
- no System1/System2 Formal or runtime change.

Formal Core remains LOCKED.
