# D09-10 partial amount coverage falsification

Status: RESEARCH_ONLY / UNKNOWN_NOT_ZERO / KEEP_L3 / FORMAL_CORE_LOCKED
Owner: 07｜產業與供應鏈研究室
Parent: research/BR072_D09_10_SHARED_A1_CONCENTRATION_READINESS_20261008_V0_1.md

## Outcome-blind deterministic counterexample

A three-member industry has known member trade amounts 90 and 10, and one UNKNOWN third amount x >= 0. A complete comparison industry has 70, 20, 10.

The known-only HHI is 0.82. This is NOT the full-industry HHI.
The full-industry function is H(x)=(8200+x*x)/(100+x)^2.
Its minimum is at x=82, where H=41/91 (about 0.450549).
At x=0, H=0.82. At x=1000, H is about 0.833223.
The complete comparison industry HHI is 0.54.

The relative concentration ordering reverses: at x=0 A is more concentrated than B; at x=82 A is less concentrated than B. Stock-count normalization does not cure unknown trade amount.

## Falsification and boundary

Missing trade value is UNKNOWN, never zero. Full-member HHI is not point identified from known-only rows. A single observed sector concentration ranking is therefore inadmissible unless exact membership, trade amounts, and common-clock coverage are verified. This mathematical example is not a Taiwan prospective observation or stock-return evidence.

Existing BR043/BR072 DATA_LANE export remains the one shared immutable A1+B5 parent for D09-09 and D09-10; no duplicate source or capture. Maintain L3/60. L4 requires genuine independent dates and D16 dependence/cost/redundancy review. No Formal Core change.

Exact next: consume the first shared complete A1+B5 row export and compute coverage-aware sector HHI, leader-removal, dispersion and rank with a common digest. Keep incomplete rows UNKNOWN and do not promote maturity from this synthetic proof.
