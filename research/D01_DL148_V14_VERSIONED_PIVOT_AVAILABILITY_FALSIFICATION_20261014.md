# D01 DL-148 V14 — versioned pivot causal availability
2026-10-14 21:07 Asia/Taipei | Room 01 | Class A research-only | Formal Core LOCKED

## Exact continuation
Latest main was `15884e6b9b6aa199e9de1212ebb6a6d24cbe3265`. The canonical D01 checkpoint still records DL-147 as last mainline and DL-148 as next. Continued V13 local research without restarting earlier studies. The frozen 1101/2021-06-15 R1–R6 61-eligible-session physical chain remains NOT VERIFIED; physical R7 is BLOCKED.

## H14 — revised constituent bars can backdate a five-bar pivot
Mechanism: a two-left/two-right pivot is causally usable only after the fifth completed bar AND the exact content versions of all five constituent bars AND the certified eligible-session manifest AND relevant venue receipt were first available. Therefore earliestUsableAt is the maximum of these clocks; mechanical pivotSession/confirmedSession are distinct.

Reproduced V13 counterexample: synthetic bar version for a constituent first known 2026-05-25; fifth bar completed 2026-05-14; research decision cutoff 2026-06-02. V13 stamps confirmedAt 2026-05-14 and accepts the entire decision-time prefix. V14 preserves the geometric pivot but moves earliestUsableAt to 2026-05-25, preventing retrospective causal backdating.

Alternative explanations: legitimate official corrections, provider revision, archive capture delay, and suspended/holiday sessions. A missing eligible-session ordinal is not equivalent to a missing calendar day; owner-certified calendar provenance is required.

Failure conditions: missing exact OHLC version/content first-known clock, missing source identity/digest, mismatched trade date/completion, internal eligible-session gap, incomplete manifest, future version, or missing venue continuity. UNKNOWN, not zero or BAD. Local digests and synthetic ownerCertified flags do not authenticate physical official sources.

## Reproducible isolated evidence
- `research/d01_dl148_versioned_pivot_availability_guard_v0_14.mjs` — new V14 research-only oracle.
- `research/test_d01_dl148_versioned_pivot_availability_guard_v0_14.mjs` — 24 new adversarial fixtures.
- `D01_DL148_V14_NATIVE_RECEIPT_20261014.json` — local Node v22.16.0: 16 suites, 672/672 synthetic checks pass, zero process failures. Previous V13 18/18 included. GitHub CI NOT VERIFIED.
- Full 34-file source/test/receipt/manifest bundle separately preserved as local ZIP.

## Mandatory falsification and governance
PIT/look-ahead: reproduced and locally guarded; physical first-known proof UNKNOWN.
OOS, walk-forward, prospective Shadow: NOT RUN; physical source chain blocked; no fabricated historical Shadow.
Selection bias/data snooping/multiple testing/overfitting: V1–V14 form ONE dependent research family. 672 synthetic checks are not 672 market observations or independent successes.
Factor redundancy: D01/D02/D03 share price ancestry; sector index can contain the same stock; independentVoteCount=0.
Sample size/date clustering, costs, liquidity, market-regime dependence: UNKNOWN pending real independent cohorts and D16.
No trade recommendation, no new signal/score/veto/threshold, no runtime/Worker/Production mutation, no Formal optimization candidate.

## Exact next continuation
1. Safely persist V14 oracle/test and obtain real GitHub CI receipt; preserve source hashes and concurrent main updates.
2. Obtain certified 1101/2021-06-15 R1–R6 exact 61-session source/version/calendar chain, validate DL-095 and DL-108~147, then emit R7 only on physical pass.
3. If source blocked, proceed to new outcome-blind D01 daily/weekly partial-week confirmation and versioned aggregation-clock falsification, not another industry-vintage redesign.
4. SDA-001/SDA-002 remain open. D01 11/11 L3, maturity 60.0%; tracker aggregate 22 domains / 356 modules / 47.9%. No maturity promotion.
