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

## Sharp partial-identification bound (2026-10-08 continuation)

This is a mathematical extension of the same frozen synthetic example, NOT an independent market receipt. Let k observed nonnegative trade amounts have S=sum(a_i)>0 and Q=sum(a_i^2), with m>=1 missing member amounts x_j>=0. The full-member concentration is

H(x) = (Q + sum_j x_j^2) / (S + sum_j x_j)^2.

Without a credible same-clock upper cap on missing amounts, the **sharp identified interval** is

H in [ Q / (S^2 + m*Q), 1 ).

Proof: for a fixed missing total T, sum_j x_j^2 >= T^2/m, with equality for equal missing amounts. Minimizing (Q+T^2/m)/(S+T)^2 over T>=0 gives T*=m*Q/S, i.e. every missing x_j=Q/S, and the lower endpoint Q/(S^2+mQ). Letting any one missing x_j grow without bound makes H approach 1, so 1 is a supremum rather than an attained value when observed S>0.

For known amounts (90,10), S=100, Q=8200, m=1: H_min=41/91=0.45054945 and H_sup=1. Against complete comparator H_B=0.54, the equality crossings are x≈29.677213 and x≈205.105396. Therefore A>B for 0<=x<29.677213 and x>205.105396; A<B between these roots. The ranking can reverse twice as the unknown trade amount increases. Treat the exact crossings as **synthetic arithmetic**, not trade-value forecasts or tuned cutoffs.

Operational interpretation (research-only): do not substitute a known-only HHI, zero fill, mean fill or sector-rank point estimate. When only intervals are identified, claim A>B only if A's valid lower bound exceeds B's valid upper bound; claim A<B only if A's upper bound is below B's lower bound. Otherwise mark ordering UNKNOWN. A credible finite upper cap can tighten the identified set only if its publication, population, unit and decision clocks are proven. Normalized HHI is a monotone transform for a fixed, correct member count, but does not recover missing amounts or cure unknown membership.

Failure conditions and controls: incomplete PIT industry membership, unresolved amount unit, exchange timing mismatch, duplicate securities, unknown halts vs observed zero trade, and non-comparable issuer classifications all invalidate a point ranking. D09-09 and D09-10 share the existing immutable A1+B5 parent and independent-date root; no duplicate captures or outcome peeking. No OOS, walk-forward, costs, factor-redundancy or market-regime claim is opened. D16 must preregister those before any economic inference. L3/60 unchanged; Formal Core LOCKED.
