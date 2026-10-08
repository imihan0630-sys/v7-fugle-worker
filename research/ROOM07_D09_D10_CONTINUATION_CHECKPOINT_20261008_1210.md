# Room07 D09+D10 continuation checkpoint — 2026-10-08 12:10 Asia/Taipei

Status: RESEARCH_ONLY / TWO_RECEIPTS_DURABLE_ON_BRANCH / PR_REVIEW_PENDING / NO_MATURITY_CHANGE / FORMAL_CORE_LOCKED

Main base at branch creation: 08328c8cfd0b253f56009e4192474e31d7f6807e.
Branch: research/room07-d09-hhi-d10-inventory-identity-20261008-1210.

## Accepted D10-03 recovery and ticket identity repair

The earlier Room07 branch research/room07-sc089-inventory-mix-falsification-20261008-0805 preserved a correct synthetic inventory product-mix reversal, but labeled it SC-089. Latest main already uses SC-089 for GlobalWafers Novara D10-08. Two different modules cannot share one audit/research ticket ID. The recovered evidence is now carried as ROOM07_D10_03_INVENTORY_MIX_ID_RECONCILIATION_20261008_V0_1.json without claiming SC-089 ownership. The original SC-089 GlobalWafers main artifact is untouched.

Synthetic proof: product A burden 0.10->0.08, product B 1.00->0.90, aggregate 0.190->0.818. Fixed-base within effect -0.028, mix effect +0.656, net +0.628. No issuer-native or MOEA ratio equivalence is asserted. D10-03 remains L3/60. SC-083 is the exact prospective continuation.

## Accepted D09-10 missing-amount identifiability falsification

New research file: ROOM07_D09_10_PARTIAL_AMOUNT_COVERAGE_FALSIFICATION_20261008.md.
With two known member trade amounts 90 and 10, and one missing amount x, known-only HHI 0.82 is not a full-sector HHI. The full HHI reaches 41/91 at x=82, and a fully observed comparator sector with HHI 0.54 reverses the concentration ranking. Missing != zero, normalized HHI does not repair absent amounts. This is deterministic synthetic evidence only; D09-10 remains L3/60.

BR-043/BR-072 shared A1+B5 parent dependency remains unchanged. The same immutable full-market row export should feed D09-09 dispersion and D09-10 concentration, not two captures.

## Standing high-priority gates

- SDA-009: System1 R3A1 genuine same-generation receipt still required. Use existing V0.6 oracle; do not redesign semantics or fabricate historical Shadow.
- D09-05: genuine eligible C1 full-generation parent still required; missing C1 != zero-pick.
- D10-03: SC-083 first new eligible official monthly inventory row with source publication, capture, revision and same-scope clocks.
- D10-05: independent second industry/chain plus D16 method before outcomes.
- D10-10: SC-084 fourth physical exact-version capture via BUILD_LANE, not Room07 duplicate implementation.
- Formal Core permanently LOCKED. No formal optimization candidate from synthetic examples.

## Tracker and review

No Level, maturityPct, module status or aggregate change is justified by these two mathematical/governance receipts. Tracker remains untouched. This branch requires review/merge before the canonical main can treat these files as durable current-room receipts. Re-read latest main before merge and reconcile concurrent D09/D10 checkpoint updates.

Exact next: review and merge the two non-duplicating research receipts; after merge resume canonical priorities from latest tracker/checkpoint. Do not merge the old conflicting SC-089 label.

## 2026-10-08 20:11 Taipei — D09-10 sharp partial-identification continuation

Existing D09-10 synthetic counterexample was extended, not repeated, with a closed-form sharp identified set for m missing nonnegative trade amounts: for observed sum S>0 and sum of squares Q, HHI lies in [Q/(S^2+mQ),1) absent valid finite upper caps. The lower bound is attained by each missing amount Q/S. In the 90/10 + one missing example, the 0.54 comparator has two crossing amounts (~29.677213 and ~205.105396), proving the concentration rank is non-monotone in missing trade amount. Thus incomplete-sector ranks must remain UNKNOWN unless identified intervals separate. This is a deterministic proof, not a new Taiwan market date, new independent sample, or alpha evidence.

Prior two receipts passed independent arithmetic rechecks. The old conflicting SC-089 inventory-mix ticket remains excluded; canonical SC-089 GlobalWafers D10-08 is untouched. A research-only draft PR was opened for the three branch files; no formal selection or tracker maturity changes are justified. Exact next: verify PR merge/readback against latest main and preserve shared BR-043/BR-072 A1+B5 parent for first real D09-09/D09-10 calculation; continue SC-083 prospective inventory cohort and SDA-009 R3A1 receipt gate when upstream data become available.
