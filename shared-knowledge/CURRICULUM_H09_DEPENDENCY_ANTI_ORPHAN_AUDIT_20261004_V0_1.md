# H09 Dependency + Scope De-dup Audit 2026-10-04 V0.1

Status: OWNER_APPROVAL_REQUIRED
Scope: 00｜研究總控室 third-round hidden-overlap governance
Audit base main: `22ec18c06bd0926c2e174a6fc5700f995d3cd13c`
Formal Core impact: NONE

## Cluster

H09 — D16-19 vs D16-25

- D16-19 Machine Learning／Calibration — L2 / 40%.
- D16-25 Probabilistic Decision／Bayesian Updating／Uncertainty-aware Selection — L2 / 40%.

Frozen class:
`SCOPE_DEDUP`.

## Equivalent specialist evidence accepted

Room11 evidence:
- `research/D16_16_19_MODEL_VALIDATION_CLUSTER_20261004_V0_1.md`;
- `research/D16_D18_VALIDATION_CHECKPOINT.md`;
- `research/D16_25_D15_19_MERGE_DECISION_INPUT_V0_1.md`;
- existing D16-19 / D16-25 tracker evidence.

This evidence satisfies the H09 packet requirements:
- producer/consumer interface;
- calibration-method vs decision-policy matrix;
- shared vs owned metrics;
- immutable CalibrationReceipt ownership;
- model/calibration drift vs decision drift;
- divergent-state logic;
- duplicate-calibration firewall;
- terminal research classification = SCOPE_DEDUP_ONLY.

No extra specialist narrative is invented by 00-room.

## Canonical ownership audit

### D16-19 — model estimation and calibration producer

D16-19 owns:
- model fitting / estimation / comparison;
- train/validation/calibration partitioning;
- calibration method implementation and selection;
- identity/no-recalibration baseline;
- Platt/sigmoid, Beta, Isotonic or other calibrator challengers;
- Brier score / log loss / reliability / calibration-in-the-large / calibration slope-intercept as model-quality diagnostics;
- model/calibration drift;
- refit eligibility at the model/calibration layer;
- simple-baseline comparison;
- immutable `CalibrationReceipt`.

### D16-25 — decision consumer

D16-25 owns:
- target / horizon / decision population;
- base rate / prior at the decision layer;
- Bayesian evidence update;
- calibrated-belief consumption;
- uncertainty response / penalty;
- expected value / utility;
- ACCEPT / ABSTAIN / DATA_BLOCKED;
- risk-coverage;
- decision-level consequences of calibration quality;
- decision drift and selection-policy evaluation.

D16-25 may require minimum calibration quality but may not fit a second calibrator or create a second probability authority.

## Divergent-state audit

PASS.

Required examples:

1. Well-calibrated model / ABSTAIN:
   D16-19 can emit a valid CalibrationReceipt while D16-25 abstains because expected after-cost utility is insufficient, uncertainty is high, or action support is poor.

2. Calibration warning / decision semantics unchanged:
   D16-19 can enter WATCH/DEGRADED while D16-25 still owns the same decision-policy semantics; decision output may become ABSTAIN, but calibration implementation ownership does not migrate.

3. Decision drift without model-calibration drift:
   cost/capacity/decision-utility regime can change while probability calibration remains acceptable.

4. Calibration improvement without directional Alpha:
   lower Brier/log loss does not itself imply a buy/sell decision or profitable utility.

## Dependency Audit

Producer:
`D16-19 CalibrationReceipt`.

Consumer:
`D16-25 PredictiveDecisionReceipt / decision policy`.

Downstream:
- D15 sizing/allocation may consume D16-25 validated decision distributions;
- System1/System2 research may consume decision receipts only after separate OOS/Shadow governance.

Result:
`PASS_PRODUCER_CONSUMER_INTERFACE`.

## Anti-double-count audit

Canonical firewall:
1. one calibrated probability/distribution authority per model/version/target/horizon/population;
2. Brier/log loss/reliability are D16-19 model-quality diagnostics;
3. D16-25 may gate/abstain based on calibration quality but cannot score that same calibration as a second independent positive vote;
4. ranking discrimination, calibration quality and trading utility remain separate estimands;
5. calibrator/model selection belongs to the fitting family and must stay inside training/validation boundaries;
6. D15 Kelly/sizing cannot invent its own probability authority downstream.

Result:
`PASS_SINGLE_CALIBRATION_AUTHORITY`.

## Anti-orphan audit

KEEP_SEPARATE preserves both distinct capabilities:
- merging D16-25 into D16-19 would orphan utility/ABSTAIN/risk-coverage/decision-policy semantics;
- merging D16-19 into D16-25 would blur fitting/calibration methodology with decision policy and invite outer-OOS leakage or double scoring.

Result:
`PASS_NO_ORPHAN`.

## Maturity firewall

No maturity transfer:
- D16-19 remains L2 / 40%;
- D16-25 remains L2 / 40%;
- H09 governance adds no Taiwan PIT calibration series, no OOS and no Shadow evidence.

## Proposed canonical cleanup

No rename and no module-count change.

Proposed scope cleanup:

### D16-19
Make calibration implementation/diagnostics explicitly canonical:
- model/calibrator fitting;
- probability-quality metrics;
- calibration/model drift;
- CalibrationReceipt production.

### D16-25
Narrow calibration wording to:
- **consume calibrated probabilities/distributions and calibration-quality metadata**;
- own prior/Bayesian decision update, uncertainty, utility, risk-coverage and ABSTAIN;
- no second calibrator, no second probability authority.

This is a curriculum scope wording/routing mutation, so explicit owner approval is required before canonical tracker/router updates.

## Terminal governance recommendation

`KEEP_SEPARATE / SCOPE_DEDUP_ONLY`

Current state:
`OWNER_APPROVAL_REQUIRED`.

If approved:
- update D16-19 and D16-25 learningScope/status wording only;
- preserve names;
- preserve both at L2 / 40%;
- preserve module count and aggregate maturity;
- update Router / Shared Master / H09 registries;
- create canonical receipt;
- no System1/System2 Formal or runtime change.

Formal Core remains LOCKED.
