# 01｜D01 L3-to-L5 physical witness: actual timezone-string lookahead defect remediated (2026-10-11)

Status: RESEARCH_ONLY / CLASS_A / PIT_CAUSAL_BUG_REPRODUCED_AND_REPAIRED / OUTCOME_CLOSED / NO_PROMOTION
Authority: latest main prior to branch 4b4b7f3e73117ff1584e0ae270694f672855ec80; issue #1114 for 11-module L3→L5 owner evidence.
Targets: canonical research helpers only:
- research/pattern_dl095_owner_return_acceptance_oracle_v0_1.mjs
- research/pattern_first_wave_receipt_bundle_oracle_v0_1.mjs

## Reproduced source-level defect (genuine bug, not a hypothetical design)

Both validators previously compared the first-known timestamp and predictor cutoff as lexicographic text instead of absolute instants:

1. DL-095 validateEvidenceClock compared firstObservableAt <= interfaceCutoffAt using JS string ordering;
2. DL-091 validateTemporalReceipt compared firstObservableAt <= predictorFreezeAt using JS string ordering.

Concrete observable counterexample:
- fixed frozen historical D01 predictor cutoff: 2021-06-15T23:59:59+08:00 (= 2021-06-15T15:59:59Z);
- receipt first observable at 2021-06-15T16:00:00Z, which is ONE SECOND AFTER cutoff;
- original DL-095 returned EVIDENCE_CLOCK_VALID (incorrect);
- original DL-091 returned RECEIPT_PIT_VALID (incorrect);
- physical instant comparison returns LATE_EVIDENCE_NOT_PIT_ELIGIBLE / RECEIPT_LOOKAHEAD respectively.

Opposite case: 2021-06-16T00:30:00+10:00 is 2021-06-15T14:30:00Z (BEFORE cutoff), yet lexical date comparison would place it after 2021-06-15. Both bug directions are tested. This is a D01 first-observable causal replay / historical lookahead problem, not trading strategy performance.

## Repair (Class A research-only)

New source: research/d01_pit_instant_clock_v0_1.mjs
- Parses strict explicit UTC-zone or numeric signed-offset ISO8601 timestamps; uses Date.parse to compare actual UTC millisecond instants.
- Validates calendar day, leap-year date, HH/MM/SS ranges, timezone offsets (<=14 hours) and fail-closes unknown timestamps.
- Only up to 3 fractional digits accepted: JS Date.parse loses sub-millisecond precision, and rounding it into the same cutoff could silently admit future submillisecond data. >3 decimals are UNKNOWN_BLOCKED, not silently rounded.
- No zone-less local timestamps can pass the clock gate.
- Existing statuses preserved for caller compatibility: EVIDENCE_CLOCK_VALID, LATE_EVIDENCE_NOT_PIT_ELIGIBLE, EVIDENCE_CLOCK_UNKNOWN, RECEIPT_PIT_VALID, RECEIPT_LOOKAHEAD, RECEIPT_CLOCK_UNKNOWN.
- No acceptance on mere receipt existence, still requires actual source proof/replaySafe and full R1-R6 owner receipts; timestamp parser itself is not authenticity certification.
- No source-specific clock guessed or backdated; actual first-known timestamps must come from independently archived physical owner evidence.

## Test evidence

New 25 synthetic adversarial fixture tests:
research/test_d01_pit_instant_clock_v0_1.mjs
- bug positive + reverse, equal-cutoff instant and 1ms future, timezone offset variants;
- mandatory timezone, invalid leap/non-leap calendar date, hours, minutes, offset limits;
- source replaySafe=false and invalid predictor cutoff blocked;
- explicit sub-millisecond rejection and year-boundary equivalence.

Existing regression suite exact GitHub branch content:
- test_pattern_dl095_owner_return_acceptance_oracle_v0_1.mjs: 18/18 PASS
- test_pattern_first_wave_receipt_bundle_oracle_v0_1.mjs: 15/15 PASS
- new time-offset oracle: 25/25 PASS
- total: **58/58 isolated V8 execution**, exit=0 for all three suites; no native Node or GitHub CI run claimed.
- Post-patch source blob identifiers (for later native execution):
  - research/d01_pit_instant_clock_v0_1.mjs: 96711597e4a3627e16dfb203afefcae6fc9dd00c
  - research/pattern_dl095_owner_return_acceptance_oracle_v0_1.mjs: 8217bc578d19bb9dd1b1ae28caab5674de0acf7c
  - research/pattern_first_wave_receipt_bundle_oracle_v0_1.mjs: 93a4e70236ee6a4998f50b2b4f1cd851540c7708
  - research/test_d01_pit_instant_clock_v0_1.mjs: cdf79b6f2da729267786249078979e04ab0d05b4
- No real historical price changes, no R1-R6 owner completeness, no OOS/prospective performance, no investment Alpha inference.

## Physical-source status readback

Current owner artifact research/d01_dl094_witness_source_availability_v0_1.json:
R1 annual membership infrastructure ready, exact 61-date binding pending;
R2 2021 TWSE 244 trading sessions / 232,956 raw bars in annual A1 source, exact canonical 1101 61-source-row receipt pending;
R3 exact lifecycle receipt pending;
R4 full-event and continuity completeness pending;
R5 official 1101/2021-06-15 56.50 / 51.40 / 46.30 values observed but no verified source hash or firstObservableAt;
R6 disposition source historically queryable but exact range/full absence-or-match receipt pending.
Thus NO R1–R6 certified full bundle. The representative year-level evidence cannot be substituted for exact physical source receipts.

## Immediate owner routing

- System2 DATA_LANE / universe: return same symbol/window R1-R3, actual ordered eligible 61 sessions and SHA-bound market-source receipts; not synthetic.
- Corporate Actions: independently certify R4 event/non-event complete source range/version.
- D05 market microstructure: R5/R6 exact official source hash and properly normalized knownAt; no backdating of contemporary page snapshots.
- Room01: apply timezone-aware clock gate to returned receipts, all R1-R6 PASS before R7; do not infer normality from missing rows.
- Room11/D16: audit actual post-repair physical receipt chain and frozen 2018-2024 first-wave evidence before opening outcomes. Room00 independently approves any maturity change.
- Native Node/CI parity for these 58 cases remains a separate verification task.

This repair improves PIT governance but does NOT satisfy L4/L5 economic evidence. D01 remains 11 canonical L3 modules (60.0%), Formal Core LOCKED, SDA-001/002 OPEN. Mainline DL-148 and Sara 金包銀 lanes remain distinct.
