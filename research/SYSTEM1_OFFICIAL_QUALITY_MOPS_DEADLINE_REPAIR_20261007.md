# System1｜Official-quality MOPS deadline repair — 2026-10-07

Status: MERGED / EXACT_HEAD_CI_PASS / QUALITY_LIVE_READBACK_PASS /
GENUINE_FORMAL_C1_READBACK_PENDING

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
a Node parallel probe took about 29s and 31s. This justified a bounded
90-second candidate, but the post-merge live run `37563414217` disproved
deadline-only repair: both market requests exhausted all three 90-second
attempts.

The read-only diagnostic run `37563928898` then showed that ordinary official
sources were healthy while even the small MOPSOV form page timed out through
Node `fetch`. Moving the same diagnostic to a macOS runner (`37564354685`) did
not change that result, so the defect was not Ubuntu-specific. A route probe
in `37564746245` reached the official `163.29.17.81` address by curl with HTTP
200 and 50,742 bytes in 8.96 seconds. Finally, `37565002528` fetched the same
official page with Node standard `https` in 7.411 seconds and received the
same HTTP 200 / 50,742-byte body. The remaining incompatibility is therefore
the Node 22 `fetch`/undici transport path to `mopsov.twse.com.tw`, not the
official host, body size, runner OS or Formal→C1 contract.

## Minimal repair

- keep the default official-source timeout at 45 seconds;
- keep the existing maximum of three attempts;
- keep 401/403 immediate fail-closed behavior;
- apply a targeted 90-second body deadline only to
  `mops/web/ajax_t163sb04`, the large full-market financial source;
- use Node standard HTTPS only for the existing official
  `mopsov.twse.com.tw` acquisition URLs; all other official sources retain
  `fetch`, and no alternate source, proxy or mirror is introduced;
- emit bounded retry metadata containing only path, attempt, timeout and a
  transport label plus a truncated error message;
- add deterministic regression coverage proving the timeout and native HTTPS
  transport are targeted and the global defaults remain unchanged.

No quality threshold, official-source identity, parser, Formal rule, ranking,
quota, capital, 15-minute confirmation, lifecycle, push or order behavior is
changed.

## Evidence boundary

The 2026-10-06 date remains ineligible and must not be reconstructed as a
genuine prospective Formal↔C1 sample. The repair can only be accepted
operationally after a future ordinary scheduled session completes official
quality, Formal publication, exact immutable C1 generation creation and V8.20
binding readback.

## Accepted implementation and quality-only live readback

PR #770 was validated at exact head
`9a00f072064110d256537ee7cf322f34aae0abcf`. All three applicable,
path-filtered checks passed:

- V8 Repair CI `37565552370`;
- System1 C1 C2 isolated offline repair review `37565552380`;
- V8 Regression Tests `37565552413`.

The PR merged to `main` as
`52c6ea8a8900869504482fc6133f4bf88a2e19ec`. Quality-only live run
`37565793586`, attempt 3, then completed successfully. The immutable final
gate reported:

- `FINANCIAL ready=true`, count `1881`, as-of `2026-10-06`;
- `QUARTER_EPS ready=true`, count `0`, as-of `2026-10-06`;
- `noSelection=true`, `noPlanChanges=true`, `noTrade=true`, `noPush=true`.

The zero EPS count is an accepted ready dataset receipt, not a zero-pick or
Formal result. This run repaired and verified official-quality availability
only. It did not create, reconstruct or backfill a historical Formal decision,
C1 generation or Formal↔C1 binding for `2026-10-06`.

The transport repair is therefore operationally verified. The separate
genuine binding acceptance remains pending the next ordinary scheduled
session and must be proven from its actual Formal parent, immutable C1
generation and binding-ledger readback.
