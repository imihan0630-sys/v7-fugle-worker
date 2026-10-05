# D02 PVE-246 — Premarket remediation readback and root-cause certification

Updated: 2026-10-06 Asia/Taipei
Status: PREMARKET_READBACK_COMPLETE / ROOT_CAUSE_CERTIFIED / REMEDIATION_NOT_YET_IMPLEMENTED / H001_FAIL_CLOSED / NO_MATURITY_CHANGE / FORMAL_UNCHANGED

## Purpose

Continue from PVE-245 without pretending that a System 1 repair already exists.

PVE-246 performs:
1. latest-main remediation readback;
2. read-only Production scan/Cron verification;
3. source-chain diagnosis for the three PVE-245 blockers;
4. exact remediation routing.

It does not modify Production, Formal selection, D1 business state, ranking, Top6, capital, signals or push behavior.

## System 1 remediation readback

Latest-main search and the 2026-10-06 HIGH audit intake contain the PVE-245 routing, but no FIX_IMPLEMENTED/PASS remediation receipt.

SDA-003 remains VALIDATION_PENDING.

Therefore PVE-246 does not claim the repair is complete.

## Read-only Production evidence

Dedicated workflow:
`.github/workflows/d02-pve246-premarket-readonly.yml`

Successful run:
- run id: `37378253538`
- head SHA: `56efe4cce4fdbf811f6c4b1597bd7bf260bd3591`
- read-only GET operations only.

Runtime:
- `8.18.0-valuation-source-vintage`
- TEST_MODE=false.

Latest stored scan:
- source version `8.14.3-closure-receipt-memo`;
- scanDate `2026-09-29`;
- generatedAt `2026/09/30 05:18:52`;
- selectedCount=2;
- pipeline.complete=false;
- pvShadow absent on that stored result.

This agrees with the public recommendation endpoint: the current public scan is historical rather than a current completed after-market scan.

## Root cause A — after-market Cron identity regression

Physical Cloudflare schedule:
- `35,55 15 * * mon-fri`

Runtime's own expected list:
- `35 15 * * MON-FRI`

Physical D1 Cron rows:
- 2026-10-05 23:35 Taipei -> cron `35,55 15 * * mon-fri` -> job_type `INTRADAY_MONITOR` -> `SKIPPED`;
- 2026-10-05 23:55 Taipei -> same cron -> job_type `INTRADAY_MONITOR` -> `SKIPPED`.

Both carry:
`非V7盤中監控時段，已跳過 Fugle 呼叫`.

The build-chain cause is explicit in:
`scripts/apply_v8_7_12.py`.

That patch:
1. changed the exact after-market identity from `10 10 * * mon-fri` to `35 15 * * mon-fri`;
2. removed the previous Taipei-hour >=18 fallback and replaced it with `return false`.

Therefore the actual combined Cloudflare expression `35,55 15 * * mon-fri` cannot equal the single exact expression `35 15 * * mon-fri`.
Both the primary and recovery events are misclassified.

Root cause status:
CERTIFIED.

## Root cause B — historical 15m baseline starvation

The PV Shadow bootstrap path is injected by:
`scripts/apply_v8_11_0.py`.

The intended bootstrap:
- when validSessions <20;
- calls Fugle historical 15m from marketDate-180 days to marketDate-1;
- normalizes sessions;
- merges/writes the baseline;
- skips only after validSessions>=20.

The official Fugle historical-candles contract supports 15-minute history, permits date windows below one year, exposes minute history from 2023-05-23, and documents regular-lot minute volume in lots.
The 180-day query shape is therefore supported by the documented endpoint contract.

However the bootstrap is invoked only after the Formal after-market scan reaches its post-Formal PV Shadow hook.
Because the current 23:35/23:55 events never enter the after-market scan path, that bootstrap is starved.

The only other baseline-growth path is:
`pvRollObservedSession`.

It writes a session only when the latest completed slot is exactly 13:00.
Otherwise it returns:
`SESSION_NOT_COMPLETE_IN_CURRENT_CRON`.

PVE-244 showed the 2026-10-05 monitor stream ending around 11:08, so that date could not be rolled into baseline.

This explains the physical state:
- 2006 -> 2 valid sessions;
- 2454 -> 1 valid session;
- 4977 -> 2 valid sessions.

Important boundary:
PVE-246 certifies the starvation mechanism.
It does NOT claim that the historical provider call itself has been physically exercised successfully under the repaired path yet.

## Root cause C — raw provenance is dropped before snapshot persistence

The current PV Shadow injection receives the raw 15-minute provider response in `analyzeStockSmart`.

For the 15-minute branch it calls:
`pvExtractCompletedSession15(raw,...)`

and retains only the normalized:
`pvShadow.session15`.

Later `pvBuildIntradaySnapshot` constructs its source object with:
- sourceBarTimestamp;
- barStart;
- barEnd;
- sourceFetchedAt;
- sourceFamily;
- slotKey;
- completedBar;
- baselineVersion.

It does not carry:
- provider;
- endpoint;
- rawPayloadHash.

Thus the PVE-244 null fields are not a D1 projection problem.
The raw-source identity is absent from the persisted snapshot path itself.

`semanticFingerprint` remains a normalized semantic receipt and must not be relabeled as the raw-payload hash.

Root cause status:
CERTIFIED.

## Remediation acceptance contract

System 1 should treat the repair as three bounded items.

### A. Schedule identity

Recognize the actually configured combined `35,55 15 * * mon-fri` schedule as the 23:35 primary + 23:55 recovery after-market family, while preserving existing lock/only-if-missing/idempotence behavior.

Do not create a second independent business scan.

Acceptance requires physical D1 readback showing the primary/recovery family is no longer logged as INTRADAY_MONITOR merely because the Cron string is combined.

### B. Baseline availability

Do not let D02 baseline readiness depend silently on a successful Formal re-selection path.

Either:
- provide a bounded research-only warmup path for currently monitored symbols; or
- prove another guaranteed path.

The receipt must expose:
- bootstrapAttemptAt;
- symbol;
- requested from/to;
- provider status;
- raw row count;
- normalized session count;
- rejected session count/reasons;
- final validSessions.

H001 remains fail-closed until same-slot valid prior sessions >=20.

### C. Fetch-boundary provenance

At the 15-minute fetch boundary, before normalization:
- bind provider;
- bind endpoint/source-contract identity;
- compute rawPayloadHash over the exact response or a frozen canonical raw representation;
- never persist API credentials;
- retain semanticFingerprint separately.

## Falsification result

PVE-246 materially narrows the blocker but creates no H001 evidence.

Still true:
- clean prospective dates = 0;
- no H001 canonical receipt;
- no outcome opening;
- no numerical target;
- no D16 model method;
- D02 maturity stays 60.0%;
- Gate 7 remains CLOSED;
- FORMAL_OPTIMIZATION_CANDIDATE remains NONE;
- Formal Core remains LOCKED.

2026-10-05 remains permanently excluded from retrospective clean-date relabeling.

## Exact next continuation point

PVE-247 — consume the System 1 implementation/readback for the now-certified three-part root cause. Only after schedule identity, baseline readiness and fetch-boundary provenance are physically verified may D02 capture the first future decision-time-valid 15m H001 canonical receipt. If any item remains incomplete, continue fail-closed and do not count a clean date.
