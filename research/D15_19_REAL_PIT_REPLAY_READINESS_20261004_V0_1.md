# D15-19｜Real PIT Replay Readiness V0.1

Updated: 2026-10-04 Asia/Taipei
Status: REPLAY_HARNESS_READY / REAL_TAIWAN_RECEIPT_ABSENT
Formal Core impact: NONE

## Purpose
Turn the D15-19 L3 evidence gate into an executable receipt contract so that the first genuine D16-25 Taiwan PIT calibrated distribution can be replayed without redesigning the experiment.

## Required receipt identity
Each replay row must preserve decisionReceiptId, opportunitySetId, predictionId, generationId, symbol and decisionAt.

Target definition, outcome horizon and exit policy must be frozen at decision time. Prediction distribution and calibration provenance must pass the D15-19 eligibility validator.

## Outcome firewall
Outcome must be matured and first-known after the decision. Future labels cannot enter the decision receipt.

## Dual denominator
Every row preserves:
- frozenDecisionUniverseCount: operational universe at decision time;
- maturedEvaluationCount: labels currently mature enough for evaluation.

Later label maturation may increase the evaluation denominator. It must never rewrite the frozen decision universe.

This directly protects D15-19 from the selective-denominator failure reproduced by D16-25.

## Frozen Fractional Kelly challengers
The first genuine replay uses the preregistered lambda set:
1.00, 0.75, 0.50, 0.25, 0.00.

No evaluation-period search for a prettier lambda is allowed.

## Common support
Current sizing, equal-capital, risk-budget and Kelly challengers must ultimately be compared on the same eligible opportunity support. A method unavailable for a row must be marked unavailable rather than silently dropping the row from competitors.

## Current evidence state
Latest tracker read at 2026-10-04 morning still reports D16-25 L2/40 with genuine complete Taiwan PIT prediction/outcome/calibration receipts absent.

Therefore this harness is readiness evidence only. It cannot promote D15-19 to L3.

## Artifacts
- research/d15_kelly_common_support_replay_v0_1.mjs
- tests/test_d15_kelly_common_support_replay_v0_1.mjs

Official maturity remains L2/40.
No Formal Core change.
No FORMAL_OPTIMIZATION_CANDIDATE.
