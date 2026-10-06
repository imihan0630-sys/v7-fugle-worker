# System1 Official Quality Transport Repair Checkpoint — 2026-10-07

Status: IMPLEMENTED / FINAL EXACT-HEAD CI PENDING
Formal Core: LOCKED
System2 impact: NONE

Observed 2026-10-06 failures:
- run 37447083905: MOPS t187ap14_L.csv fetch failure;
- run 37489328230: official-quality body stream timeout after MOPS market-option discovery;
- run 37492017324: same body stream timeout pattern during scheduled recovery.

Repair:
- full response body is consumed inside the bounded retry boundary;
- transient fetch/body timeout/abort failures can retry;
- 401/403 remain permanent fail-closed;
- 23:45 fallback uses QUALITY_RECOVERY_ONLY=1 and reuses already verified quality families;
- workflow_dispatch quality_only=true prevents any after-market /api/scan recovery;
- 2026-10-06 remains research-ineligible and is not converted into genuine prospective evidence.

Final latest-main lease base:
`681c67cf2173db507ee9231c57f83b174a89bf65`.

Next:
- exact-head Regression + Repair CI;
- merge PR #739 if green;
- perform quality-only 2026-10-06 transport verification;
- preserve result as DATA_QA transport evidence only.
