# COV-08 Intake + Dependency Audit 2026-10-04 V0.1

Status: OWNER_APPROVAL_REQUIRED
Audit base main: `767c83775661cf41f66f0a122d234dd24f236cd0`
Candidate: COV-08 — Dependence-aware Resampling / Block Bootstrap
Specialist return: `research/COV08_D16_SPECIALIST_RETURN_V0_1.md`
Terminal specialist recommendation: `EXTEND_EXISTING_SCOPE`
Formal Core impact: NONE

## Intake result

PASS.

The return closes the exact method-selection delta:
- cluster-robust inference;
- HAC;
- temporal block bootstrap;
- small/unbalanced cluster diagnostics;
- nonstationarity fail-closed behavior;
- effective-cluster/effective-date/block-support reporting;
- sensitivity/falsification gates;
- no-promotion statement.

The return is methodological and does not fabricate market evidence.

## Dependency / overlap audit

### D16-06 — canonical owner
D16-06 already owns:
- independent-date inference;
- date clustering;
- dependence-aware uncertainty;
- promotion-evidence governance.

The COV-08 family is therefore an extension of the same inferential responsibility, not a new market object.

### Other D16 modules
Model fitting, calibration, OOS design, regime models and multiple-testing controls may consume D16-06 inference receipts but do not own the dependence-correction method hierarchy.

### Portfolio/path consumers
Path-dependent drawdown/churn/hysteresis research may require block-bootstrap inference, but that requirement does not transfer ownership out of D16-06.

Result:
`PASS_D16_06_DEPENDENCE_INFERENCE_OWNER`.

## Anti-double-count

1. cluster-robust, HAC and block bootstrap are alternative/co-primary uncertainty estimators, not multiple evidence votes;
2. bootstrap replications are not independent market observations;
3. stock rows from the same date are not independent experiments;
4. regime episodes remain distinct from raw date counts;
5. resampling may not cross data/strategy/source-version boundaries without frozen justification;
6. dependence correction cannot substitute for missing prospective/OOS evidence.

Result:
`PASS_ONE_ESTIMAND_ONE_INFERENCE_FAMILY`.

## Anti-orphan

Extending D16-06 preserves:
- independent-date inference;
- cluster/HAC analytic inference;
- path-preserving resampling;
- effective-sample reporting;
- small-cluster diagnostics;
- nonstationarity fail-closed behavior.

Creating a separate module would split one inferential responsibility and create overlap.

Result:
`PASS_NO_ORPHAN`.

## Maturity firewall

- D16-06 remains L4/80%.
- D16 domain maturity remains 60% from this governance action.
- No market/OOS/Shadow evidence is created.
- No module-count or aggregate-maturity change.

## Recommended canonical action

`EXTEND_EXISTING_SCOPE → D16-06`

Add explicit dependence-aware method hierarchy and reporting contract:
cluster-robust / HAC / temporal block bootstrap / effective support / sensitivity / nonstationarity firewall.

No rename required.
No new module.
No maturity promotion.

Current state:
`OWNER_APPROVAL_REQUIRED`.
