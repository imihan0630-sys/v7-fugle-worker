# D03 Effective Worker Decision-Cutoff Source Audit V0.1

Updated: 2026-10-04 Asia/Taipei
Status: OUTCOME_BLIND / EFFECTIVE_BUILD_SOURCE_AUDIT / NO PRODUCTION CHANGE
Formal Core: LOCKED

## Purpose

Validate the owner-handoff insertion point against the effective V8.17 build, not the raw baseline Worker alone.

The deployment workflow applies the V8 patch chain before syntax/regression/deploy. Therefore a promotion-grade handoff should audit the generated effective Worker.

## Audit method

The read-only workflow:
1. runs tests/run_system1_c1_c2_repair_review.py;
2. this applies the same regression patch chain through V8.17 into an ephemeral Worker-review.mjs;
3. the D03 static audit inspects runAfterMarketScanCore, selectTomorrowCandidates, and buildC1PopulationReceipt.

No deploy, secret, D1 write, market-data call or Formal decision is performed.

## Acceptance

PASS requires:
- total-capital KV read occurs before selection;
- the effective patch chain's later Formal-affecting V7_MARKET_CONSENSUS KV read is present;
- after that market-consensus read, no await/fetch/KV/D1 read occurs before selector call;
- selector is synchronous;
- selector contains no await/fetch/KV/D1 read;
- C1 has a later decisionAt receipt stamp;
- C1 still lacks physical decisionCutoffAt;
- C1 build is downstream of Formal-result capture.

## Interpretation

Physical run 37196768178 PASS after the C1/C2 repair review reported 95/95 tests PASS.

The audit first falsified the earlier totalCapital boundary because an effective-build market-consensus read exists after totalCapital.

The corrected current effective-build candidate cutoff anchor is immediately after the V7_MARKET_CONSENSUS KV read and immediately before selectTomorrowCandidates(...).

Observed effective runtime source version: 8.17.0-shadow-cohort-membership.
Observed async/external reads after the final Formal input and before selector: 0.
Observed physical C1 decisionAt: present.
Observed physical C1 decisionCutoffAt: absent.

This is a source-audit fact only.

The shared-parent owner still decides/implements the additive provenance field under Class-B / Production governance.

No historical C1 generation may be backfilled.

## Maturity

No D03 maturity increase.

Even a source-audit PASS does not create a genuine cutoff-bearing parent generation.

D03 remains 56.7%.
