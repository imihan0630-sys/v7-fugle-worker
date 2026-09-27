# System 2 Decision Clock（決策時間點）Collector Provenance（擷取器來源證明）V0.3

Updated: 2026-09-27 Asia/Taipei  
Status: PREREGISTERED BEFORE FIRST PROSPECTIVE TRADING-DATE EVIDENCE / RESEARCH-ONLY

## Purpose

Decision Clock evidence must not silently combine measurements produced by different collection semantics.

A Git commit SHA alone is too broad because unrelated repository research can change the SHA without changing the clock collector. Conversely, recording no code provenance would allow source parsers, polling logic, dependency observers or workflow timing to change during the 20-date evidence window without an auditable comparability break.

V0.3 therefore records both:

1. GitHub Actions run provenance; and
2. a deterministic fingerprint of the exact collector contract files.

## Daily bundle V0.3

Promotion-grade scheduled evidence must use:

`S2_DECISION_CLOCK_DAILY_BUNDLE_V0_3`

The underlying daily evidence contract remains:

`S2_DECISION_CLOCK_DAILY_EVIDENCE_V0_2`

The bundle adds `collectorProvenance` containing at least:

- provenance version;
- repository;
- GitHub workflow run ID;
- GitHub workflow run attempt;
- GitHub workflow commit SHA;
- workflow ref;
- collector contract version;
- collector contract fingerprint;
- fingerprint algorithm;
- per-file SHA-256 list.

Scheduled artifacts fail closed if the embedded run ID, run attempt or workflow SHA does not match the GitHub Actions metadata from which the artifact was downloaded.

Legacy V0.2 bundles may remain diagnostic only for non-scheduled/manual evidence. They are not promotion-grade scheduled evidence.

## Collector contract fingerprint

The fingerprint is independent of unrelated repository commits. It hashes the path and SHA-256 of the files that directly determine collection eligibility, source parsing, polling cadence/semantics, dependency observation, trading-calendar gating and daily bundle construction.

The preregistered V0.3 file set includes:

- `.github/workflows/system2-prospective-clock-evidence-readonly.yml`
- `system2/runtime/source_arrival_latency.mjs`
- `system2/runtime/official_source_probes.mjs`
- `system2/scripts/measure_source_arrival_readonly.mjs`
- `system2/runtime/required_dependency_probes.mjs`
- `system2/runtime/a5_filing_vintage_observer.mjs`
- `system2/runtime/b2_industry_snapshot_observer.mjs`
- `system2/scripts/measure_required_dependency_series_readonly.mjs`
- `system2/runtime/decision_clock_daily_evidence.mjs`
- `system2/scripts/build_decision_clock_daily_bundle.mjs`
- `system2/runtime/twse_trading_calendar_readonly.mjs`
- `system2/scripts/check_twse_trading_day_readonly.mjs`
- `system2/runtime/decision_clock_collector_contract_v0_3.mjs`

Changing any file in this set changes the collector fingerprint.

## Aggregation rule

Promotion-grade selected trading dates must have one collector contract fingerprint.

If more than one fingerprint appears:

`collectorContractConsistent=false`

and promotion is blocked as:

`COLLECTOR_CONTRACT_DRIFT`

Mixed collector contracts cannot be pooled to reach the 10-date or 20-date readiness gates.

This rule is independent of return/performance outcomes and therefore cannot be relaxed because a later collector version produces a nicer candidate time.

## Change boundary after evidence begins

Once the first promotion-grade date has been collected, any material collector change must be treated as an explicit evidence-contract change. The current V0.3 rule does not automatically choose a preferred fingerprint or silently reset the sample.

A future evidence epoch/version may be created only through a separately documented, preregistered change. Historical dates measured under another fingerprint remain auditable but cannot be mixed into the active freeze sample.

## Safety invariants

- no System 2 D1 write;
- no Worker mutation;
- no Worker Cron authorization;
- no capture enablement;
- no System 1/V8 runtime use;
- no historical substitution for prospective first-known evidence;
- no outcome data used to select collector fingerprint.

Even a fully consistent 20-date sample only makes the exact Decision Clock eligible for owner review. It never authorizes the clock or Worker Cron automatically.
