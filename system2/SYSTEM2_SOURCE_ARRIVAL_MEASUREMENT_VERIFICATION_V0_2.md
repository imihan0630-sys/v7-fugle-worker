# System 2 Source Arrival Measurement Verification V0.2

Updated: 2026-09-27 Asia/Taipei
Status: IMPLEMENTATION VERIFIED / PROSPECTIVE TRADING-DATE EVIDENCE PENDING
System 1 / V8 impact: NONE

## V0.2 implemented

A5_QUARTERLY_FINANCIALS（季度財務）:
- `runtime/a5_filing_vintage_observer.mjs`;
- official TWSE/TPEx EPS and profitability datasets;
- market-wide quarterly-vintage consistency;
- explicit first-observed semantics;
- no false claim of exact filing/publication time.

B2_INDUSTRY_THESIS_PROSPECTIVE（前瞻產業狀態）:
- `runtime/b2_industry_snapshot_observer.mjs`;
- official current industry profiles;
- same-date official TWSE/TPEx close data;
- deterministic descriptive industry breadth/participation;
- B2 contract V0.2 requires 13:30 Asia/Taipei close finality before READY;
- undated daily rows cannot be assigned to the target market date;
- both daily coverage and classified-join coverage must meet the existing TWSE/TPEx market minimums;
- no thesis direction and no strategy score.

Decision-clock evidence:
- `runtime/decision_clock_dependency_ledger.mjs`;
- `runtime/decision_clock_daily_evidence.mjs`;
- `runtime/decision_clock_readiness_v0_2.mjs`;
- `scripts/build_decision_clock_daily_bundle.mjs`;
- daily evidence semantics V0.2.1 requires A5 to be prospectively READY no later than the computed same-session candidate boundary; A5 remains periodic and does not itself set the same-session latency maximum;
- `runtime/decision_clock_collector_contract_v0_3.mjs` for Collector Provenance（擷取器來源證明）and stable collector-contract fingerprinting.

Measurement controls:
- `runtime/twse_trading_calendar_readonly.mjs`;
- `scripts/check_twse_trading_day_readonly.mjs`;
- source-arrival polling can stop after both A1 required daily gates become READY;
- A5/B2 bounded polling series stops after same-date dependency evidence becomes eligible.

## V0.2 research schedule

Workflow:
`.github/workflows/system2-prospective-clock-evidence-readonly.yml`

Schedule:
- intended start: 05:25 UTC Monday-Friday / 13:25 Asia/Taipei;
- official TWSE calendar decides whether the date is a trading session;
- GitHub scheduler delay is allowed but never interpreted as source publication time;
- actual probe timestamps are authoritative.

On trading dates:
- A1 daily source-arrival polling and A5/B2 dependency polling run in parallel;
- interval = 5 minutes;
- bounded attempts = 30 per lane;
- immutable artifacts are retained for 90 days;
- the readiness evidence object remains `S2_DECISION_CLOCK_DAILY_EVIDENCE_V0_2`;
- the immutable scheduled artifact envelope is now `S2_DECISION_CLOCK_DAILY_BUNDLE_V0_3`, built only when both lanes succeed;
- V0.3 binds GitHub run ID/attempt/SHA plus a deterministic fingerprint of the exact collector contract files;
- scheduled artifacts with provenance mismatch or mixed collector fingerprints are not promotion-grade.

## Precision falsification

A date is NOT precision-eligible merely because all sources are READY.

For every same-session clock constraint (A1 TWSE, A1 TPEx, B2):
- prior explicit NOT_READY observation required;
- later READY required;
- interval <=5 minutes;
- SOURCE_ERROR / INVALID_PAYLOAD / NOT_APPLICABLE cannot substitute for NOT_READY.

If the first observation is already READY, availability is proven only by that observation time and precision remains false.

## Non-trading operational smoke

Read-only A5/B2 observer smoke:
- run `36323358775`;
- job `108631337257`;
- market date 2026-09-27;
- expected trading day = false;
- all transport OK = true;
- A5 = `OBSERVED_COVERAGE_PASS`;
- B2 = `DERIVED_SNAPSHOT_INCOMPLETE`;
- prospective evidence eligible = false;
- no-mutation guard = PASS.

Interpretation:
A5 machinery is operational. B2 correctly refused to become complete without a same-date trading close.

## CI verification

System2 Research CI:
- run `36324105323`;
- job `108633421570`;
- conclusion: PASS after the scheduled-workflow static guard was corrected.

V8 repository regression for the workflow-only change:
- run `36324056669`;
- job `108633282565`;
- conclusion: PASS.

A prior CI run failed because the first static guard test read a workflow that still contained a self-referential prohibited-token grep string. The workflow was corrected to call the static test directly; no source/PIT/safety rule was weakened.

## Current evidence count

Independent prospective trading dates with promotion-grade V0.2 readiness evidence inside a V0.3 provenance bundle:
`0`

Reason:
- 2026-09-27 is weekend;
- 2026-09-28 is an official TWSE holiday;
- earliest ordinary prospective session is 2026-09-29.

## Current safety state

- System 2 Worker capture = false.
- System 2 Worker Cron = 0.
- workers.dev = false.
- Preview/Version URLs = false.
- No D1 write from measurement workflows.
- No Cloudflare secret used by measurement schedule.
- No System 1/V8 runtime call.
- Exact Decision Clock（決策時間點） remains unfrozen.
- Cron authorization remains false.

Engineering verification is not evidence of strategy alpha and is not evidence of source arrival time on a real trading date.
