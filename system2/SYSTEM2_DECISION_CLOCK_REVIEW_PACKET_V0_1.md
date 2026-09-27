# System 2 Decision Clock（決策時間點）Owner Review Packet（擁有者審查包）V0.1

Updated: 2026-09-27 Asia/Taipei
Status: PREREGISTERED REVIEW FORMAT / NO CLOCK AUTHORIZATION / NO CRON AUTHORIZATION

## Purpose

Freeze the exact evidence summary that will be shown to the owner only after prospective Decision Clock evidence reaches the preregistered freeze gate.

The review format is defined before observing the 20-date result so the final proposal cannot selectively omit inconvenient dates, gaps or imprecision.

## Review eligibility

A clock-freeze review packet becomes `OWNER_REVIEW_ELIGIBLE` only when all are true:

- artifact aggregation uses the promotion policy `EARLIEST_SCHEDULED_ARTIFACT_PER_MARKET_DATE`;
- scheduled-run coverage has been audited across the full preregistered prospective date window, not merely dates that happened to produce runs/artifacts;
- the first scheduled run, attempt 1 only, for each market date is the immutable coverage anchor;
- `promotionCoverageComplete=true`;
- no official trading-day artifact gap exists;
- Collector Provenance（擷取器來源證明）V0.3 is valid for every promotion-grade scheduled artifact;
- `collectorContractConsistent=true` and exactly one collector-contract fingerprint represents the selected promotion-grade sample;
- V0.2 readiness status is `FREEZE_ELIGIBLE`;
- at least 20 independent trading dates are included;
- all included dates are precision eligible.

Otherwise the packet remains `ACCUMULATING` or `BLOCKED`.

## Packet contents

The owner-facing review packet must include:
- evidence version;
- independent trading-date count;
- complete/precision-eligible counts;
- full included market-date list;
- worst observed required-source upper bound;
- safety buffer;
- candidate minutes after close;
- candidate Taipei time;
- scheduled trading-day artifact gaps;
- duplicate scheduled artifact count;
- manual diagnostic artifact count;
- artifact-selection policy;
- coverage-audit state;
- Coverage Integrity（證據覆蓋完整性）extension version;
- audited coverage start/through dates;
- failure-class counts;
- trading-day gap dates;
- explicit statement that later scheduled runs or rerun attempts cannot repair the immutable first-run/first-attempt anchor;
- collector-contract consistency version;
- complete collector-contract fingerprint list;
- `collectorContractConsistent` state;
- any `COLLECTOR_CONTRACT_DRIFT` blocker;
- explicit safety state.

No performance/outcome statistic belongs in this clock-selection packet. The clock is chosen from source availability and data completeness, not from which time produced better stock returns.

## Authorization boundary

Even `OWNER_REVIEW_ELIGIBLE` means only:

"Evidence is sufficient to ask the owner whether to freeze this exact Decision Clock."

It never means:
- exact clock automatically frozen;
- Worker capture enabled;
- Worker Cron（排程） enabled;
- System 1/V8 changed.

The review packet always keeps:
- `exactDecisionClockAuthorized=false`;
- `workerCronAuthorized=false`;
- `captureEnabled=false`.

## Anti-selection-bias rule

The candidate time is copied directly from the preregistered readiness calculation:

worst required-source upper bound
+ 15-minute safety buffer
+ round up to the next 5 minutes.

No manual "nicer" time may replace it after observing the sample.

The same anti-selection-bias rule applies to collector versions: if the prospective sample contains multiple collector fingerprints, the packet is blocked. It may not choose whichever collector version produces the earlier/later or otherwise more convenient candidate time. A new evidence epoch, if ever needed, must be preregistered separately before combining or restarting evidence.
