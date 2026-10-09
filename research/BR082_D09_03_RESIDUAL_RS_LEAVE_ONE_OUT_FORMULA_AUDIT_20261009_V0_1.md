# BR-082 — D09-03 Residual RS Leave-One-Out Formula Audit V0.1

Status: RESEARCH_ONLY / FORMULA_LINEAGE_VERIFIED / SELF_CONTRIBUTION_GUARD_PASS / PROSPECTIVE_COHORT_PENDING / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D09-03
Date: 2026-10-09 Asia/Taipei
Observed main before write: 02b968c6e37fd3496f7cb262b1a6a479233ceb69

## Canonical runtime lineage

Authoritative current runtime source: `Worker.js`.

For each stock with finite ret20, runtime groups peers by:
`industry + return20StartDate`.

For each candidate stock:
- group.sum contains all same-industry same-start-date ret20 values;
- peer count = group.count - 1;
- sectorReturn20 = (group.sum - own.ret20) / peerCount;
- value is emitted only when peerCount >= 2;
- otherwise sectorReturn20 remains UNKNOWN/null.

Research snapshot fallback then freezes:
`residualSectorRs20 = own.ret20 - sectorReturn20`.

## Key audit result

The current Residual RS primitive is explicitly leave-one-out.

Therefore:
`CANDIDATE_SELF_RETURN_NOT_INCLUDED_IN_PEER_BENCHMARK`.

This closes the simple self-contribution failure mode for the currently implemented residualSectorRs20 primitive.

## Additional comparability guard already present

The peer key includes return20StartDate as well as industry. This prevents a candidate with a different 20-session start boundary from being silently compared to peers on a different return window.

Frozen:
`SAME_INDUSTRY_ALONE_IS_NOT_ENOUGH; RETURN_WINDOW_START_MUST_MATCH`.

## Remaining risks

This audit does NOT prove L4 or predictive value. Remaining risks include:
- effective-dated industry classification / reclassification lineage;
- incomplete peer histories changing peerCount;
- small-industry instability even after leave-one-out;
- cross-date persistence and regime dependence;
- redundancy versus own ret20, Sector RS, K-line, Price-Volume and market regime;
- multiple-horizon / repeated-date dependence;
- stock-outcome access remains closed.

## Current 2026-10-08 cohort state

The first legal post-deploy System1 scheduled parent for scanDate 2026-10-08 was not created (`C1_GENERATION_NOT_FOUND`). Therefore Room07 cannot manufacture a promotion-grade 2026-10-08 full stock-level Residual RS cohort from a missing parent.

Formula audit and prospective cohort availability remain separate facts.

Permanent rules:
- `FORMULA_GUARD_PASS != LIVE_COHORT_EXISTS`;
- `LEAVE_ONE_OUT != PREDICTIVE_ALPHA`;
- `MISSING_PARENT != ZERO_RESIDUAL_RS`.

## Maturity

D09-03 remains L3 / 60%.

## Exact next

On the next genuine ordinary-session immutable stock parent, freeze the full Residual RS cross-section using the existing runtime definition; preserve industry vintage, return20StartDate, peerCount and UNKNOWN rows. Then request D16 redundancy/OOS validation versus own ret20, Sector RS, K-line, Price-Volume and regime before any L4 decision.

Formal Core unchanged.
