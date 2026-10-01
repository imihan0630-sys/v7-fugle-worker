# System 1 selection formal switch proposal V0.1

Prepared: 2026-10-01 Asia/Taipei.
Status: CLASS-C REVIEW PLAN / ENGINEERING PATH VALIDATED / EVIDENCE NOT MATURE / NO SWITCH AUTHORIZATION.
Formal Core: LOCKED.

## Proposed first formal candidate

The first possible switch is `C2_SHORT_ADMISSION_V0_1`. It changes only the
short-horizon admission contract after evidence matures: authenticated and
complete financial, valuation and ownership inputs remain required, but their
economic values become supportive/context fields unless the registered short
thesis explicitly needs them. Severe announcement risk remains a hard fail.
Swing eligibility keeps the existing stronger fundamental/valuation gates.

This first candidate does not change A/B definitions, sector thresholds,
price>=10, 1000/300-lot liquidity and its verified exception, history/RS,
abnormality, ATR, target, RR>=2, signal grade, ranking, 3+3 quotas, capital,
60/40 tranches, 15-minute confirmation, signal state, push or System2. The
controlled no-retest continuation, alternative pullback confirmation, ranking
and allocation are separate later experiments and cannot enter this switch.

## Evidence gate before owner decision

The candidate is eligible for a Class-C decision only after the frozen C1/C2
contract has at least 60 mature D5 rows, at least 30 complete prospective
snapshots, 15 independent completed scan dates, two calendar years and two
market regimes. Required readouts are same-date matched Formal versus Shadow
after-cost return with cash, drawdown/tail risk, trigger/fill/no-fill funnel,
MFE/MAE, stop-first and false-acceptance rates, turnover, concentration,
deployment and reserve reasons. Date-cluster leave-one-out direction agreement
must be at least 70%; source coverage, purged holdout, multiple-testing and
redundancy gates must pass. Missing broker fills/cash stay UNKNOWN.

Positive cases and failed additions are reported together. A higher candidate
count or a few missed winners cannot satisfy the gate. Any incomplete Formal
scan is DATA_QUALITY_BLOCKED and cannot count as a zero-pick or negative day.

## Exact switch mechanics after explicit approval

1. Freeze the eligible commit, source SHA, rule contract, evidence artifact
   digests and rollback commit. Rebuild from latest main and re-run all checks.
2. Add the new short-horizon admission as an explicit versioned branch beside
   the current Formal rule. Produce an exact frozen-input parity report showing
   every difference is explained by the approved gates only.
3. Run one completed session in dual-output observation. The current Formal
   plan remains the only plan, signal and push authority. Abort on source,
   latency, D1, memory, quota or provenance regression.
4. Present the dual-output receipt and final Class-C diff to the owner. Only a
   new explicit approval may make the candidate the Formal admission path.
5. On the first active session, preserve both outputs, verify 3+3 quotas,
   allocation, 15-minute signal behavior and phone delivery, and keep the old
   path available for immediate code rollback.

Rollback reverts the single Class-C activation commit and verifies the prior
runtime/configuration through the existing deployment workflow. It does not
delete plans, fills, receipts or research rows. If behavior differs outside
the approved admission gates, rollback is immediate and the evidence gate
returns to DATA_QUALITY_BLOCKED.

## Current decision

`FORMAL_OPTIMIZATION_CANDIDATE = NO`. V8.15 validates C1 evidence engineering,
not economic superiority. The switch plan is concrete and reviewable, but no
Class-C activation should be requested until the prospective gate above passes.
