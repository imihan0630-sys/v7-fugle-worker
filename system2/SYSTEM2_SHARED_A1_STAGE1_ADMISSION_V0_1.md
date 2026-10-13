# System2 shared official A1 → Stage1 admission V0.1

Status: `BUILD_LANE_LOCAL_VERIFIED / PHYSICAL_SOURCE_AND_SELECTION_NOT_ACCEPTED`

This contract closes the code-level gap between the shared 61-session official
TWSE/TPEx A1 capture and the already-frozen SHORT_MOMENTUM Stage1 assessor. It is
an offline, read-only evidence admission layer. It does not create an independent
audit, decide final ranks, write a frozen decision, access D1/R2, or authorize a
selection, push, order, System1 Formal input, Worker or Cron cutover.

## Required evidence

Admission requires all of the following at the same evaluation clock:

1. A hash-valid shared manifest with exactly 122/122 market-date pairs, 61 sorted
   official trading dates and `COMPLETE_SOURCE_CAPTURE_PIT_UNAUDITED` state.
2. The hash-valid original source receipt with exact TWSE + TPEx coverage for
   every date, exact original-response lineage and complete per-symbol windows.
3. A separately produced, hash-valid independent readback audit receipt. It must
   attest 122 original files rehashed, decompressed and parsed, official calendar
   readback and source URL/provider-date verification. The audit is explicitly
   forbidden from claiming strategy PIT or selection authority.
4. A hash-valid current prospective A1 ledger for the same market date.
5. Per-symbol corporate-action continuity evidence already accepted as
   `CLEAR_NO_ACTION` or `ADJUSTED_CONTINUITY`. Unknown continuity stays
   `INCOMPLETE` for that symbol.

The adapter independently reconciles manifest ↔ source receipt ↔ original file
hash ↔ symbol history ↔ current ledger. Cross-market duplicate symbol identity,
future clocks, 121/122 capture, tampered hashes, or self-promoted audit authority
fail before Stage1 evaluation.

## Output boundary

The output can contain only Stage1 research observations such as
`QUALIFIED_NOT_SELECTED`, `WATCH`, `REJECTED`, or `INCOMPLETE`.
`selectedCount` and `zeroPickDay` remain null. Selection, rank/capacity, durable
create-only frozen persistence/readback, outcomes, performance and production
activation remain separate later gates.

## Current physical state at 2026-10-13

- Latest completed shared capture: 121/122 pairs, 61 dates, 1,068 complete
  per-symbol windows; missing TPEx 2026-07-15. This is not admissible.
- The next scheduled window should remove 2026-07-15 and request both 2026-10-13
  close files. A 122/122 result still needs the separate audit receipt and real
  continuity evidence before this bridge can evaluate the full universe.
- Shadow acceptance S0–S5 remains 0/6. This contract does not advance a physical
  acceptance count by itself.

## Verification

The focused matrix contains eight new admission cases and the related source,
archive, collector, and evaluator regressions. It verifies positive synthetic
assembly and fail-closed behavior for incomplete capture, source/audit/manifest
tampering, future clocks, cross-market duplicate symbols, and unknown corporate
action continuity. Synthetic PASS is not physical market acceptance.
