# D02 PVE-244 — Live 15m prospective receipt audit

Updated: 2026-10-05 Asia/Taipei
Status: LIVE_15M_CAPTURE_PROVEN / H001_FAIL_CLOSED / CANONICAL_SOURCE_BINDING_INCOMPLETE / SESSION_CAPTURE_PARTIAL / NO_MATURITY_CHANGE / FORMAL_UNCHANGED

## Purpose

Test the exact PVE-244 continuation point:
obtain the first decision-time-valid 15m canonical receipt for Wave-1 H001 at slot >=10:15 with all frozen baseline/history/current-slot/common-support gates.

No promotion-grade future outcome was opened.

## Production runtime proof

Current public runtime readback:
- version = 8.18.0-valuation-source-vintage;
- D1 binding present.

Current deployment build/readback preserves:
- PV_SHADOW_V0_1;
- v7_pv_shadow_snapshots;
- v7_pv_intraday_baselines;
- INTRADAY_15M capture code.

Current Worker setting read by the isolated audit:
- PV_SHADOW_ENABLED=true.

## Safe physical D1 readback

A dedicated repository workflow was added:
.github/workflows/d02-pve244-d1-readonly.yml

Successful physical run:
- run id 37334245340;
- head SHA 517b5d95352cd63d328f68e858c0c6d4d3381050;
- readOnly=true;
- mutationCount=0;
- temporary diagnostic workers.dev subdomain disabled after read;
- temporary diagnostic Worker deleted after read.

The workflow hard-rejects mutating SQL and queries production D1 through a short-lived isolated Worker binding.

## 2026-10-05 intraday physical result

D1 contains exactly:
- observation_type = INTRADAY_15M;
- row_count = 8;
- symbol_count = 1;
- symbol = 2454;
- first slot = 09:00;
- last slot = 10:45;
- all 8 rows decision_impact = 0.

This proves actual prospective live 15m capture occurred.
PVE-244 therefore does NOT have a LIVE_OBSERVABILITY_UNKNOWN blocker.

## H001 readback

Rows at or after the frozen 10:15 minimum slot:

10:15:
- formalLocalVolumeRatio = 0.36;
- pvSlotRvol20 = null;
- slotHistoryCount = 1;
- pvGuardState = DATA_INSUFFICIENT;
- pvInterpretability = INVALID;
- sourceFetchedAt = 10:31:47 Asia/Taipei.

10:30:
- formalLocalVolumeRatio = 0.73;
- pvSlotRvol20 = null;
- slotHistoryCount = 1;
- pvGuardState = DATA_INSUFFICIENT;
- pvInterpretability = INVALID;
- sourceFetchedAt = 10:46:47 Asia/Taipei.

10:45:
- formalLocalVolumeRatio = 1.22;
- pvSlotRvol20 = null;
- slotHistoryCount = 1;
- pvGuardState = DATA_INSUFFICIENT;
- pvInterpretability = INVALID;
- sourceFetchedAt = 11:01:47 Asia/Taipei.

The H001 lane therefore fails closed:
- H001_SLOT_HISTORY_LT_20;
- H001_SLOT_RVOL_INVALID;
- same-slot clean baseline/current-slot coverage cannot be certified from these rows.

No H001 clean event is created.

## Historical 15m baseline counter-evidence

Physical baseline rows:
- 2006: valid_sessions=2, last_market_date=2026-09-30;
- 2454: valid_sessions=1, last_market_date=2026-10-02;
- 4977: valid_sessions=2, last_market_date=2026-09-30.

This is not merely a requirement to wait 20 future sessions.

The frozen implementation explicitly does the following for a monitored symbol with <20 valid sessions:
- calls the Fugle historical 15m endpoint from marketDate-180 days through marketDate-1 day;
- normalizes historical sessions;
- merges them into the baseline;
- writes valid_sessions;
- skips bootstrap only when validSessions>=20.

Therefore the 1-2 session physical baselines are evidence that the intended >=20-session historical bootstrap has not reached readiness.
The reason is not certified by PVE-244 and must remain UNKNOWN until separately audited.

## Canonical receipt provenance gap

Each physical 15m row contains:
- sourceFamily = FUGLE_INTRADAY_15M_LOTS;
- barStart;
- barEnd;
- sourceFetchedAt;
- completedBar=true;
- semanticFingerprint.

But the frozen PVE-241 canonical receipt also requires raw source identity.

Physical rows currently have:
- rawPayloadHash = null;
- endpoint = null;
- provider = null.

semanticFingerprint hashes the normalized snapshot semantics.
It is NOT relabeled as rawPayloadHash.

Therefore a PVE-241 canonical receipt cannot be manufactured from these rows after the fact.

## Session-capture continuity counter-evidence

The same D1 readback shows successful INTRADAY_MONITOR cron rows through approximately 11:08 Asia/Taipei on 2026-10-05, then no observed intraday monitor run before later history warmup.

This explains why the last completed 15m snapshot is 10:45:
the next 11:00 slot would not become completed until 11:15, after the observed monitor stream had already stopped.

Formal source comments/spec still define:
- 09:00-12:59 each minute;
- 13:00-13:24 each minute.

The current deployment at 2026-10-05 14:53 Asia/Taipei read back these cron triggers:
- 0-24 5 * * MON-FRI;
- * 1-4 * * MON-FRI;
- 35,55 15 * * mon-fri;
- * 9 * * MON-FRI.

PVE-244 does not infer that this post-market deployment configuration proves the entire earlier session configuration.
It records only the physical fact:
2026-10-05 D1 intraday cron evidence is truncated around 11:08.

## After-market semantic mismatch observation

The D1 readback also contains a scheduled row at 2026-10-05 23:35 Asia/Taipei recorded as:
- job_type = INTRADAY_MONITOR;
- status = SKIPPED.

The frozen source implementation classifies Taiwan hour >=18 as after-market.

This is an observed runtime/readback mismatch.
PVE-244 does NOT assign a root cause without direct proof.

## Falsification conclusion

Three independent blockers prevent H001 admission:

1. baseline blocker:
   slotHistoryCount=1 and pvSlotRvol20=null;

2. canonical provenance blocker:
   rawPayloadHash/provider/endpoint are not persisted in the physical 15m receipt;

3. runtime continuity blocker:
   2026-10-05 intraday monitor evidence truncates around 11:08 and the 23:35 job-type readback conflicts with expected after-market semantics.

Even if one blocker is fixed, the other blockers still keep the row out.
This is intentional fail-closed behavior.

## Maturity consequence

Live 15m prospective observability is now physically proven.

However:
- no H001 canonical receipt exists;
- no clean prospective selection date is added;
- no economic outcome is opened;
- no numerical target is invented;
- no D16 model method is selected;
- no Formal Core change is authorized.

D02 remains 60.0%.
Gate 7 remains CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE remains NONE.

## Exact next continuation point

PVE-245 — freeze and route a System1 runtime remediation handoff for:
1. prospective source provenance persistence: provider + endpoint + rawPayloadHash at capture time;
2. historical 15m baseline bootstrap readiness and explicit failure reason when <20 valid sessions remain after bootstrap;
3. full intraday cron continuity through 13:24 plus reconciliation of the 23:35 job-type mismatch.

Do not backfill 2026-10-05 as clean prospective evidence after remediation.
The first H001 clean date must be a future date captured under the corrected frozen path.
