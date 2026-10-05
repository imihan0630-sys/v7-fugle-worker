# D03 Interaction Estimability / Concentration Oracle V0.1

Updated: 2026-10-06 Asia/Taipei
Owner: 03｜技術指標與趨勢動能研究室
Parent contracts: TI-749~802
Status: RESEARCH_ONLY / OUTCOME_CLOSED / SUPPORT_ORACLE_FROZEN
Formal Core: LOCKED
Tickets: SDA-001 / SDA-004
D16 owner dependency: D16-06 dependence-aware inference + SDA-016 admission/consumption

## Purpose

Freeze a support/estimability oracle for future D03 interaction receipts.

A prospective/OOS interaction result is not promotion-grade merely because:
- raw row N is large;
- a coefficient is finite;
- a p-value is small;
- both marginal components individually have support;
- a weighting method produces a numerical estimate.

The oracle requires a multi-axis support vector and representation-specific diagnostics.

No single effective-N statistic is sufficient.

## TI-803 — support is a vector, not a magic N

Required axes:
1. raw/candidate coverage;
2. independent decision-date support;
3. representation-specific joint/design support;
4. dependence/cluster support;
5. concentration/influence support;
6. admission/weight support;
7. calendar/episode breadth;
8. outcome-footprint continuity;
9. consumer-scope compatibility.

Raw rows, dates, clusters, weighted ESS, episodes or cells may each be useful diagnostics, but none is allowed to substitute for all others.

## TI-804 — representation class must be frozen before outcome interpretation

Every interaction receipt must declare exactly one primary representation class:

- CATEGORICAL_JOINT_CELL
- CONTINUOUS_INTERACTION
- MIXED_THRESHOLD_CONTINUOUS
- PATH_OR_LIFECYCLE_INTERACTION

Changing representation class after inspecting the target outcome creates a new adaptive family and consumes the prior holdout under SDA-016.

A continuous interaction cannot be discretized after a weak result and presented as the same confirmatory hypothesis.
A sparse categorical interaction cannot be converted to a smoother continuous interaction after outcome inspection and inherit the old holdout.

## TI-805 — categorical joint-cell support

For CATEGORICAL_JOINT_CELL, machine output must include:
- complete preregistered cell universe;
- raw row N by cell;
- independent decision-date N by cell;
- unique symbol N by cell;
- admitted-date N by cell;
- weighted effective support by cell if weighted;
- zero-support cells;
- near-zero-support cells under a preregistered method-specific floor;
- cell occupancy share by date/sector/regime/episode.

All cells required by the estimand must exist in the ledger, including zero-count cells.

A zero-count estimand-critical cell means the full interaction contrast is not identified on that target population.

No empty cell may disappear from the report.

## TI-806 — no universal joint-cell N is invented

D03 does not declare a universal minimum date count for every interaction method.

The D16 method receipt must freeze before target outcome inspection:
- preregisteredMinJointCellIndependentDateN;
- why that floor is adequate for the chosen estimand/method;
- the consequence of falling below it.

If any estimand-critical cell falls below the frozen floor:
- terminal state may be POWER_INSUFFICIENT or JOINT_SUPPORT_INSUFFICIENT;
- it may not be repaired by deleting that cell after outcomes.

This prevents an arbitrary one-size-fits-all threshold while preventing post-result floor manipulation.

## TI-807 — continuous interaction support is not a cell-count problem

For CONTINUOUS_INTERACTION, required diagnostics include:
- component range/quantile coverage on common support;
- joint design coverage;
- extrapolation fraction / unsupported design-region indicator under the chosen method;
- component correlation;
- interaction-to-main-effect collinearity diagnostics;
- leverage / partial leverage;
- influence diagnostics;
- design-rank / numerical identifiability state;
- frozen marginal-control basis identity.

A continuous coefficient generated almost entirely by a few extreme observations is not rescued by a large row N.

A numerically estimable coefficient is not equivalent to economically supported interaction evidence.

## TI-808 — mixed threshold/continuous representation inherits both burdens

MIXED_THRESHOLD_CONTINUOUS must satisfy:
- threshold-side cell/support diagnostics;
- continuous-side leverage/design diagnostics;
- preregistered threshold identity;
- threshold search-family accounting.

It may not use the continuous component to claim broad support while its threshold-defined active side is supported by only a few dates.

## TI-809 — path/lifecycle interactions use episode/transition support

PATH_OR_LIFECYCLE_INTERACTION cannot use bar/row count as its primary replication count.

Required:
- decision-date support;
- structural episode count;
- conservative replication-cluster count;
- transition count;
- active/right-censored episode accounting;
- calendar span and separated-period diagnostics;
- outcome-footprint overlap;
- leave-one-replication-cluster-out stability when applicable.

Mechanical state fragmentation, UNKNOWN gaps and threshold chatter do not automatically create new replication credit.

## TI-810 — independent decision date is the first common inference axis

For Taiwan-stock cross-sectional interaction research:
- stock rows on one scan date share market shocks;
- many symbols on one day do not manufacture many independent experiments.

Every receipt reports:
- raw row N;
- raw decision-date N;
- admitted decision-date N;
- unique symbol N;
- date-level weighting identity.

Primary inference defaults to date-aware/paired decision support unless D16 preregisters a justified alternative.

## TI-811 — cluster reliability uses D16 effective-cluster diagnostics

Where clustered inference is used, report:
- raw cluster count G;
- effective cluster count G* where computable;
- cluster-size distribution;
- leverage / partial leverage;
- influence diagnostics;
- exact clustering dimensions.

D03 inherits the current D16 governance:
- G* < 20 => conventional first-order cluster inference is not standalone promotion evidence;
- G* >= 20 is only an eligibility floor, never an automatic pass;
- influence/imbalance warnings can override raw G.

If the chosen estimand cannot obtain credible cluster support:
terminal state may be DEPENDENCE_TOO_STRONG_FOR_CURRENT_SAMPLE.

## TI-812 — HAC / temporal-path support is method-specific

For date-level smooth estimands using HAC, preserve D16 diagnostics including:
- kernel/bandwidth identity;
- lag dependence;
- long-run variance inflation;
- effective-date diagnostic T_eff.

Current D16 governance:
- T_eff < 20 => no standalone asymptotic promotion;
- 20–39 => sensitivity/exploratory unless corroborated;
- >=40 => only eligible, subject to all other gates.

For temporal block bootstrap:
- block family/length/selector frozen pre-outcome;
- effective non-overlapping block count reported;
- current D16 governance: <10 insufficient, 10–19 exploratory, >=20 eligible subject to other gates.

These are governance floors, not mathematical discontinuities.

## TI-813 — concentration is separate from support count

The receipt must report concentration across:
- decision dates;
- replication clusters/episodes;
- symbols;
- sectors/industries;
- market regimes/states;
- interaction cells/design regions.

Required diagnostics include:
- maximum share;
- top-k share where meaningful;
- distribution/entropy or HHI-style concentration diagnostic;
- effect contribution / influence concentration when computable.

No universal concentration cutoff is created here.
The D16 receipt must preregister claim-specific warning/blocking thresholds where needed.

## TI-814 — leave-one-unit fragility is mandatory

At minimum, where support permits:
- leave-one-date-out;
- leave-one-replication-cluster-out for path/regime claims;
- leave-one-sector/industry-out for cross-industry claims;
- leave-one-regime/state-out for global claims spanning regimes.

Report:
- sign stability;
- effect-size range;
- rank/order stability where ranking is relevant;
- promotion-state stability;
- maximum absolute delta.

If removing one unit reverses the primary direction or promotion state:
`CONCENTRATION_FRAGILE`.

A fragile result can remain research evidence but cannot standalone justify a third interaction unit.

## TI-815 — claim scope contracts to the supported domain

If evidence is concentrated in one sector, one regime or one narrow calendar phase, the system must shrink the claim.

Examples:
- one-sector evidence -> SECTOR_CONDITIONAL_OBSERVATION;
- one-regime evidence -> REGIME_CONDITIONAL_OBSERVATION;
- one-phase evidence -> PHASE_CONDITIONAL_OBSERVATION.

The result may not be exported as a generic market-wide interaction.

A broader claim requires new prospective support across the broader claim domain.

## TI-816 — weighted support must expose effective support and concentration

When weighting is used, report:
- raw N;
- sum of weights;
- sum of squared weights;
- Kish-style weighted effective support or the method-specific equivalent;
- maximum weight;
- weight quantiles;
- weight concentration;
- zero/near-zero support strata;
- balance diagnostics.

A large raw N with a tiny weighted effective support remains thin evidence.

Trimming/truncation/overlap weighting changes support and may change the estimand; the new estimand/support hash must be explicit.

## TI-817 — outcome overlap reduces fresh information even with disjoint decision dates

Disjoint decision dates are insufficient if D5/D10/D20 outcome windows share primitive market sessions.

The interaction support receipt binds:
- outcome horizon;
- purge/embargo rule;
- overlapping outcome-session diagnostics;
- SDA-016 consumption state.

A large date N with highly overlapping outcome footprints cannot be treated as the same amount of fresh evidence as non-overlapping support.

## TI-818 — structural/version breaks cannot be pooled for N

Known changes in:
- source semantics;
- factor/interaction version;
- corporate-action continuity;
- session definition;
- System1/System2 consumer policy;
- data capture contract

cannot be silently pooled to raise support counts.

Either:
- segment under a frozen rule;
- use an explicitly valid method for the break;
- or fail closed.

No resampling across known semantic boundaries merely to enlarge N.

## TI-819 — power insufficiency is a valid scientific terminal state

Allowed support/inference terminal states include:
- SUPPORT_READY;
- POWER_INSUFFICIENT;
- JOINT_SUPPORT_INSUFFICIENT;
- DEPENDENCE_TOO_STRONG_FOR_CURRENT_SAMPLE;
- CONCENTRATION_FRAGILE;
- SELECTION_IDENTIFICATION_BLOCKED;
- VERSION_OR_CONTINUITY_INCOMPATIBLE;
- METHOD_INCOMPATIBLE;
- EVIDENCE_NOT_YET_AVAILABLE.

A valid terminal block is not an invitation to:
- change thresholds;
- change interaction representation;
- drop difficult cells/dates/sectors;
- change outcome horizon;
- widen/narrow the population after seeing outcomes.

Any such redesign is a new experiment family with holdout-consumption accounting.

## TI-820 — current D03 decision

Frozen:
`INTERACTION_SUPPORT = MULTI_AXIS_REPRESENTATION_SPECIFIC_FAIL_CLOSED`.

A future third interaction unit requires:
- TI-777~794 interaction proof;
- this TI-803~820 support oracle;
- TI-749~776 D16 method/selection rules;
- genuine OOS/prospective evidence;
- Room00 closure for cross-system promotion.

No current Bollinger, ADX, price-volume or other D03 interaction receives the third unit.

No promotion:
- D03 remains 56.7%;
- D03-09 remains L2/40;
- D03-10 remains L2/40;
- outcomes remain CLOSED;
- Formal Core remains LOCKED;
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.

## Exact next continuation point

1. Freeze the machine-readable support-vector receipt schema and deterministic adversarial fixture.
2. Ensure categorical, continuous, mixed and path-state interactions cannot escape support diagnostics by changing representation class.
3. Freeze search-genealogy / threshold-horizon-family accounting so sparse support cannot be "solved" by outcome-driven rebinning.
4. Keep all empirical outcomes closed until the upstream physical/data gates pass.
