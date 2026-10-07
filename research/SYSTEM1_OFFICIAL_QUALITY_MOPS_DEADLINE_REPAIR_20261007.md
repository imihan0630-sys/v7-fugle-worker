# System1｜Official-quality MOPS deadline repair — 2026-10-07

Status: IMPLEMENTED_CANDIDATE / EXACT_HEAD_CI_PENDING / LIVE_READBACK_PENDING

Formal Core: LOCKED / impact NONE

System2 impact: NONE

## Incident and causal chain

The first post-V8.20 scheduled evidence attempt for scanDate `2026-10-06`
failed closed with `FORMAL_SCAN_NOT_CONFIRMED / C1_GENERATION_NOT_FOUND`.
The preserved readiness receipt showed:

- `formalScanDate=2026-09-29`;
- `institutionReady=true`;
- `qualityReady=false`;
- missing `FINANCIAL` and `QUARTER_EPS`.

The two scheduled official-market-data runs (`37489328230` and
`37492017324`) both reached the MOPS full-market financial acquisition after
successfully completing the exchange cache, institution, INDEX, TDCC,
VALUATION and ANNOUNCEMENTS work. They then stopped on the MOPS financial body
timeout, so Formal never had a complete quality parent and correctly did not
publish a C1 generation.

This is an upstream official-quality acquisition failure. It is not a
Formal→C1 binding-selection defect, and V8.20 must not infer or backfill a
parent when no C1 generation exists.

## Post-retry evidence

Main already contained full-body bounded retry. The quality-only verification
run `37556241467` built the effective production Worker and passed the offline
retry contract, then spent 2m40s in the recovery step and still failed with:

`Public source /mops/web/ajax_t163sb04: The operation was aborted due to timeout`

Therefore the remaining defect was not headers-only retry coverage. All three
attempts still shared the generic 45-second deadline for a materially larger
full-market response.

Bounded direct probes on 2026-10-07 observed approximately 1.63 MB (TWSE) and
1.33 MB (TPEx) response bodies. Sequential completion took about 19s and 26s;
a Node parallel probe took about 29s and 31s. The generic 45-second bound left
insufficient transport margin for a slower GitHub runner.

## Minimal repair

- keep the default official-source timeout at 45 seconds;
- keep the existing maximum of three attempts;
- keep 401/403 immediate fail-closed behavior;
- apply a targeted 90-second body deadline only to
  `mops/web/ajax_t163sb04`, the large full-market financial source;
- emit bounded retry metadata containing only path, attempt, timeout and a
  truncated error message;
- add deterministic regression coverage proving the timeout is targeted and
  the global default remains unchanged.

No quality threshold, official-source identity, parser, Formal rule, ranking,
quota, capital, 15-minute confirmation, lifecycle, push or order behavior is
changed.

## Evidence boundary

The 2026-10-06 date remains ineligible and must not be reconstructed as a
genuine prospective Formal↔C1 sample. The repair can only be accepted
operationally after a future ordinary scheduled session completes official
quality, Formal publication, exact immutable C1 generation creation and V8.20
binding readback.
