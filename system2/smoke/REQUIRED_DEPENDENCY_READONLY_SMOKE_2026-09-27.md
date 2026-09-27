SYSTEM2_REQUIRED_DEPENDENCY_READONLY_SMOKE=REQUESTED

Purpose:
- exercise A5 filing-vintage observer against current official GET sources;
- exercise B2 derived industry-snapshot observer against current official GET sources;
- verify transport/schema behavior on a non-trading day;
- collect no latency/decision-clock evidence;
- perform no Worker/D1/Cron/System1 mutation.

Expected trading day: false.

RESULT=PASS
GITHUB_RUN=36323358775
GITHUB_JOB=108631337257
MARKET_DATE=2026-09-27
EXPECTED_TRADING_DAY=false
SAME_TAIPEI_DATE=true
ALL_TRANSPORT_OK=true
A5_STATE=OBSERVED_COVERAGE_PASS
B2_STATE=DERIVED_SNAPSHOT_INCOMPLETE
PROSPECTIVE_EVIDENCE_ELIGIBLE=false
NO_MUTATION_GUARD=PASS

Interpretation:
- A5 official market-wide quarterly-vintage observer is operational.
- B2 was expectedly incomplete because 2026-09-27 is a non-trading day and no same-date daily close exists.
- This run is an operational/schema smoke only and contributes zero decision-clock evidence.
- The temporary push trigger was disarmed after this run.
