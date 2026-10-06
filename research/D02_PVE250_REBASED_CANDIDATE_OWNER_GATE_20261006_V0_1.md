# D02 PVE-250 — Latest-main rebased Class-B candidate owner gate

Updated: 2026-10-06 Asia/Taipei
Status: LATEST_MAIN_REBASED_CANDIDATE_ALL_CHECKS_PASS / DRAFT_PR_668 / OWNER_APPROVAL_REQUIRED / UNMERGED / NOT_DEPLOYED / H001_FAIL_CLOSED / NO_MATURITY_CHANGE / FORMAL_UNCHANGED

## Latest candidate

Active draft PR:
- #668
- https://github.com/imihan0630-sys/v7-fugle-worker/pull/668
- branch: `research/d02-pve250-rebased-candidate-20261006`
- base main at branch creation: `05cfe0f0fc4b857dc089355f6fccd7a8ec8100f0`
- head: `5877f82db1579a02091c7011e1525ea3f4490bad`
- mergeable=true
- merged=false
- deployed=false

PR #651 is superseded and closed.
It was never merged or deployed.

## Rebase reason

The previous technically green PR #651 had diverged from the later main by 77 commits.
Rather than rely on stale-base green checks or force-update the old branch, PVE-250 rebuilt the candidate from then-current latest main and reapplied only the bounded candidate delta.

The rebased PR contains only five candidate/review files:
- candidate CI workflow;
- regression wiring;
- repair-CI wiring;
- candidate patch;
- candidate runtime guard.

The prior zero-pick fixture repair is already on main and is not duplicated in PR #668.

## Latest-main checks

All applicable checks on head `5877f82db1579a02091c7011e1525ea3f4490bad` pass:
- Candidate push CI `37403479188` SUCCESS;
- Candidate PR CI `37403498580` SUCCESS;
- Repair CI `37403498568` SUCCESS;
- Regression `37403498495` regression job SUCCESS.

## Production boundary

The candidate is not wired into `.github/workflows/v7-cloudflare.yml`.
Therefore the candidate is not deployed by current Production build/deploy flow.

No merge or deployment has occurred.

## Candidate scope

Candidate remains limited to:
1. combined 23:35/23:55 after-market identity recognition;
2. existing only-if-missing / D1 lease idempotence preservation;
3. recovery/skip reason observability;
4. fail-open PV baseline warmup sidecar;
5. bootstrap readiness/provenance receipt persistence;
6. exact 15m HTTP response hashing before JSON parsing and provider/endpoint/rawPayloadHash persistence.

No intended change to Formal A/B, ranking, Top6/3+3, thresholds/weights, capital, trade lifecycle, Formal 15m semantics, monitoring eligibility or push semantics.

## Research boundary

PVE-247 oracle remains authoritative.

Green engineering checks do NOT mean:
- remediationReady=true in Production;
- H001 receipt eligible;
- clean date increment;
- outcome opening;
- maturity promotion;
- Formal optimization authorization.

2026-10-05 remains permanently excluded from retrospective clean prospective H001 counting.

## Owner gate

The next action is not autonomous.

Explicit owner approval is required to:
1. integrate the validated candidate into the Production build/deploy chain;
2. rerun checks under that exact integration;
3. merge/deploy under the same approval;
4. physically read back combined after-market identity/idempotence, baseline/bootstrap receipt and fetch-boundary provenance;
5. rerun PVE-247 oracle on physical Production evidence.

Without explicit approval:
- remain draft;
- remain unmerged;
- remain undeployed;
- D02 stays 60.0%;
- clean prospective dates remain 0;
- Gate 7 remains CLOSED;
- Formal Core remains LOCKED.
