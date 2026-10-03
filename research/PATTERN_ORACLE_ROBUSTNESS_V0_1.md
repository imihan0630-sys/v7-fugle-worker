# D01 DL-033 — Detector-Definition Uncertainty / Oracle Robustness V0.1

Updated: 2026-10-03 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / ROBUSTNESS_DESIGN / FORMAL_CORE_LOCKED

## 1. Purpose

A structural-zone claim should not silently depend on one arbitrary swing oracle.

The primary Pattern detector remains frozen:
confirmed lagged-ATR Directional-Change swings.

Already-preregistered alternative roles:
- PIP/rule-based swing oracle: secondary robustness;
- one-sided kernel swing oracle: secondary robustness;
- DTW: tertiary exploratory only.

DL-033 freezes comparison semantics.

It does NOT promote alternative oracles to strategy votes.

## 2. Same information root

All swing oracles consume the same underlying price history.

Therefore:

ORACLE_AGREEMENT_COUNT != INDEPENDENT_EVIDENCE_COUNT.

Two or three detectors identifying similar geometry may show representation robustness.
They do not create two or three independent confirmations.

## 3. Same-cutoff comparison

Any oracle comparison must use:
- same symbol;
- same asOf;
- same certified eligible-session prefix;
- same semantic space;
- same corporate-action/session lineage;
- no future pivot confirmation.

If an alternative oracle confirms later:
it is not allowed to backfill an earlier primary decision.

## 4. Zone-comparison descriptors

For two oracle zone objects preserve:
- oracle family/version;
- lower / upper / center;
- confirmedAt;
- scale / effective horizon;
- anchor IDs and anchor times where available;
- interval overlap width;
- interval union width;
- boundaryOverlapJaccard;
- centerDistanceAbs;
- centerDistancePct;
- centerDistanceATR;
- anchorTimeJaccard where meaningful.

No similarity cutoff is frozen.

## 5. No forced one-to-one identity

A primary zone may map to:
- zero alternative zones;
- one alternative zone;
- multiple alternative zones.

Do not force nearest-neighbor identity when geometry is ambiguous.

Status options:
- NO_ALTERNATIVE_OBJECT;
- UNIQUE_COMPARABLE_OBJECT;
- MULTI_OBJECT_AMBIGUOUS;
- DATA_BLOCKED;
- UNKNOWN.

D16 may later preregister a mapping/weighting method before outcomes.

## 6. Robustness interpretation

R0:
primary Directional-Change result only.

R1:
primary + PIP/rule representation sensitivity.

R2:
primary + one-sided-kernel representation sensitivity.

DTW:
exploratory stress test only; not promotion-grade in v0.1.

Possible future interpretation:

Primary effect disappears under reasonable alternative oracle:
DETECTOR_DEFINITION_FRAGILITY.

Primary effect persists under alternatives:
REPRESENTATION_ROBUSTNESS_CANDIDATE.

Alternative oracle stronger than primary:
do NOT switch primary based on outcome.
It becomes a new preregistered experiment if scientifically justified.

## 7. Multiple-testing family

Oracle family/version belongs to the Pattern multiple-testing registry.

Forbidden:
- try many PIP point counts and report best;
- tune kernel bandwidth from outcomes;
- choose detector after MFE/MAE;
- rename one detector result as a new factor family.

All failed/rejected variants remain in the audit record.

## 8. Alternative detector availability

DL-033 does not assume secondary oracle runtime availability.

Every oracle carries:
- specification status;
- implementation status;
- PIT/prefix validation status;
- compute feasibility status.

Missing alternative output:
NOT_AVAILABLE / UNKNOWN,
not "disagrees with primary."

## 9. Interaction with anchor ablation

Anchor ablation asks:
how sensitive is one detector's zone to one anchor?

Oracle robustness asks:
how sensitive is structural representation to a different legitimate extraction rule?

These are separate Layer-M diagnostics.

Both remain continuous/context diagnostics, not scores.

## 10. Current decision

PRIMARY_ORACLE = LAGGED_ATR_DIRECTIONAL_CHANGE.

PIP_RULE = SECONDARY_ROBUSTNESS_ONLY.

ONE_SIDED_KERNEL = SECONDARY_ROBUSTNESS_ONLY.

DTW = EXPLORATORY_ONLY.

ORACLE_CONFLUENCE_VOTING = REJECTED.

ORACLE_DISAGREEMENT = MECHANICAL_DEFINITION_DIAGNOSTIC.

OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## 11. Exact next continuation

1. Freeze machine-readable oracle registry / comparison contract.
2. Build pure interval-overlap / center-distance comparator.
3. Do not implement missing alternative detectors just to complete a catalog.
4. Hand detector-definition sensitivity to D16 as mandatory robustness if/when secondary PIT-safe outputs exist.
5. Next science: synthesize DL-027~033 into one structural-memory identification ladder so future evidence cannot skip weaker falsifiers.
6. No outcome join / no Formal change.
