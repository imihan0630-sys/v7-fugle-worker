# SDA-009 D09 Leave-One-Out Circularity Contract V0.1

Status: **RESEARCH_SEMANTICS_FROZEN / ENGINEERING_DIAGNOSTIC_PENDING / D16_VALIDATION_PENDING**

Owner room: 07｜產業與供應鏈研究室  
Audit ticket: `SDA-009`  
Captured: 2026-10-05T08:36:00+08:00  
Observed main before write: `b1876e86fa29df89ff880bf31c7857a57f4950fe`

## Finding

Current production logic has three distinct self-influence channels:

1. **Sector hard gate** — the candidate contributes to the same-day sector breadth, average change and amount-vs-20-day-average used to decide whether its sector passes.
2. **Sector ranking term** — the candidate contributes to `sector.score`, and `sector.score` contributes 14% of `priorityScore`.
3. **History warmup priority** — the same `sector.score` contributes to `coarseWarmupScore`, so self-influence can affect which symbols obtain history coverage sooner.

A positive control already exists: 20-day sector peer return used by candidate Sector RS subtracts the candidate before computing peer return. The remediation should extend this excluding-self principle rather than redesign the whole D09 stack.

## Frozen unit

`candidate × scanDate × classificationVintage`

For every candidate, retain both:

- **inclusive state**: current production-equivalent sector state containing the candidate;
- **leave-one-out state**: the same state recomputed after removing that candidate from the decision-time sector membership.

Membership must preserve `classificationSchemeId`, `membershipVersion`, effective dates and first-known/decision clocks. Later classifications cannot be backfilled.

## Required leave-one-out metrics

- peer count;
- sector trade amount;
- breadth;
- average change;
- history coverage;
- amount vs 20-day average;
- volume vs 20-day average;
- sector score;
- sector hard-gate pass/fail.

For candidate-specific sector score, the cross-sector maximum-amount normalizer must also be recomputed after candidate removal. Keeping the old maximum can preserve part of the candidate's contribution in the denominator.

## UNKNOWN / support rules

- zero peers => leave-one-out sector state is `UNKNOWN`, never zero;
- zero history-ready peers => 20-day activity ratio is `UNKNOWN`;
- one-peer arithmetic may be reported, but mark `SMALL_N_SENSITIVE`; it is not automatically suitable for Formal use;
- missing or ambiguous membership vintage fails closed.

## Mandatory diagnostics

- candidate self amount share;
- inclusive-minus-leave-one-out breadth delta;
- average-change delta;
- activity delta;
- sector-score delta;
- sector component contribution to priority-score delta;
- hard-gate flip;
- rank delta;
- Top6 membership delta;
- warmup-priority delta.

## Deterministic adversarial counterexample

Candidate:
- daily change +10%;
- trade value 90;
- 20-day average amount 100.

One peer:
- daily change -2%;
- trade value 10;
- 20-day average amount 100.

Assume another sector keeps the global maximum sector amount at 100 after candidate removal.

Inclusive state:
- breadth 50%;
- average change +4%;
- activity ratio 0.5;
- current hard gate passes;
- sector score = 85.

Excluding-self state:
- breadth 0%;
- average change -2%;
- activity ratio 0.1;
- hard gate fails;
- sector score = 9.5;
- support = `SMALL_N_SENSITIVE`.

The sector-score term alone changes candidate priority score by approximately **10.57 points** before any clamp interaction. In this example the candidate both makes its own sector eligible and gives itself a large ranking benefit.

This is a proof of possible circularity, not an estimate of how often it happens in live Taiwan data.

## Engineering boundary

System 1 should implement this first as **diagnostic-only** output.

Required machine-visible fields include membership/classification version, inclusive state, leave-one-out state, self-contribution deltas, hard-gate flip, raw vs leave-one-out diagnostic rank/Top6, and warmup-priority delta.

Required deterministic tests:
- candidate removal can flip each of the three current sector hard-gate components;
- candidate-specific maximum-amount normalization is recomputed;
- zero-peer / zero-history-ready cases preserve `UNKNOWN`;
- existing 20-day excluding-self sector return remains unchanged;
- diagnostic mode cannot mutate live A/B, sector gate, ranking, Top6, allocation or trading behavior.

Any replacement of current production sector inputs remains a Formal mutation and requires owner approval.

## D16 / closure boundary

This research contract does **not** close `SDA-009`.

Closure still requires:
1. System 1 machine diagnostic implementation;
2. common-support raw-vs-leave-one-out rank and Top6 receipts;
3. D16 residual/incrementality validation;
4. independent 00 readback.

## Research maturity

No D09 module is promoted by this contract. It is anti-self-deception remediation, not Alpha evidence.

## Exact next

- route this contract to System 1 for diagnostic implementation only;
- 07 resumes `BR-059` issuer-native PCB/ABF numerator research;
- after machine receipts exist, D16 compares inclusive versus excluding-self rank/Top6 effects on identical candidate support.

Formal Core unchanged.
