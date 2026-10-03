# System 2 Official Continuity Source Capability V0.2

Status: RESEARCH_ONLY / READ_ONLY_CAPABILITY_PROBE
Updated: 2026-10-03 Asia/Taipei
System 1 Formal Core: LOCKED

## Purpose

Provide a keyless, read-only physical capability probe for official TWSE / TPEx corporate-action sources after the authenticated Fugle corporate-action endpoints returned HTTP 403 under the current plan.

This module does **not** certify technical price continuity and does not transform historical prices.

## Why V0.2 exists

V0.1 physically proved three useful official lanes, but the legacy TPEx capital-reduction transport was unstable from GitHub runners:

- physical run 37119266581: HTTP 200 with a legacy HTML envelope;
- physical run 37119564829: HTTP 520 from the same historical transport.

That legacy route is therefore retired from the active source set. V0.2 does not add more retry layers or alternate legacy PHP mirrors.

Repository/external contract discovery identified the current TPEx `/www/zh-tw/bulletin/*` JSON range family. V0.2 preregisters those routes for System2-specific physical verification.

## Active source lanes

### Current / prospective discovery snapshots

1. TWSE ex-right / ex-dividend / rights forecast
   - `https://openapi.twse.com.tw/v1/exchangeReport/TWT48U_ALL`
   - current snapshot only.

2. TPEx ex-right / ex-dividend forecast
   - `https://www.tpex.org.tw/web/stock/exright/preAnnounce/prepost_result.php?l=zh-tw&o=data`
   - current snapshot only.

These snapshots can help prospective discovery but cannot prove historical NO_EVENT.

### Historical actual-result range candidates

TWSE:

1. Ex-right / ex-dividend actual results
   - `/rwd/zh/exRight/TWT49U?startDate=YYYYMMDD&endDate=YYYYMMDD&response=json`

2. Capital-reduction resumption reference
   - `/rwd/zh/reducation/TWTAUU?startDate=YYYYMMDD&endDate=YYYYMMDD&response=json`

3. Par-value-change resumption reference
   - `/rwd/zh/change/TWTB8U?startDate=YYYYMMDD&endDate=YYYYMMDD&response=json`

TPEx modern range family:

1. Ex-right / ex-dividend actual results
   - `/www/zh-tw/bulletin/exDailyQ?startDate=YYYY%2FMM%2FDD&endDate=YYYY%2FMM%2FDD&response=json`

2. Capital-reduction resumption reference
   - `/www/zh-tw/bulletin/revivt?startDate=YYYY%2FMM%2FDD&endDate=YYYY%2FMM%2FDD&response=json`

3. Par-value-change resumption reference
   - `/www/zh-tw/bulletin/pvChgRslt?startDate=YYYY%2FMM%2FDD&endDate=YYYY%2FMM%2FDD&response=json`

## Range-identity gate

A historical actual-result source is not STRUCTURE_READY merely because it returns HTTP 200 and parseable JSON.

V0.2 also requires the response itself to identify the requested start/end range:

- TWSE: `strDate/endDate` or the source-specific `params.startDate/endDate`;
- TPEx: `date=start~end`.

ROC-year and Gregorian date tokens are normalized before comparison.

Mismatch or missing range identity returns:

`STRUCTURE_RANGE_UNVERIFIED / RESPONSE_RANGE_NOT_VERIFIED`

and remains a blocker.

## TPEx JSON-table gate

Modern TPEx range responses are accepted structurally only when a returned `tables[]` member exposes:

- `fields[]`;
- `data[]`;
- a recognizable company/security symbol column.

An arbitrary JSON object is not enough.

Zero rows do **not** authorize NO_EVENT in this capability stage.

## Legacy TPEx capital-reduction route retirement

Retired active route:

`/web/stock/exright/revivt/revivt_result.php`

Reason:

`PHYSICAL_HTTP_200_HTML_THEN_HTTP_520_UNSTABLE`

The HTML-envelope parser remains defensive repository code for evidence interpretation, but the unstable route is no longer fetched by the active source set.

## Authority firewall

Regardless of HTTP, parser, row-count, or range-identity success, V0.2 keeps:

- `sourceCoverageComplete=false`
- `noEventMayBeClaimed=false`
- `symbolSessionCompletenessCertified=false`
- `technicalContinuityCertified=false`
- `continuityTransformPerformed=false`
- `historyMutationPerformed=false`
- `strategyEvaluationPerformed=false`
- `capacityRunProduced=false`
- `zeroPickClaimed=false`
- `selectionAuthority=false`
- `finalSelectionEnabled=false`
- `livePushEnabled=false`
- `capitalImpact=false`
- `orderImpact=false`
- `system1RuntimeUsed=false`

## Why this is separate from Fugle history

The physically verified Fugle raw daily-history bootstrap is a RAW price-history source and leaves `continuity_state=UNVERIFIED`.

Corporate-action continuity is a separate evidence problem. A complete 60-session raw history cannot promote continuity by itself.

## Physical acceptance plan

The main-branch read-only workflow:

`.github/workflows/system2-official-continuity-source-capability-readonly.yml`

must run without:

- API secrets;
- Cloudflare credentials;
- D1 bindings or writes;
- Worker deployment;
- schedules;
- System 1 file changes.

The physical receipt must expose, per source:

- HTTP status and content type;
- payload hash;
- parser family;
- row count;
- bounded field sample;
- ordinary four-digit-equity count where possible;
- historical response-range identity and verification state.

## Next gate after physical characterization

Only after the modern source lanes are physically characterized may a separate continuity archive / completeness design decide:

- supported history start by market and action family;
- whether a verified-empty result can prove NO_EVENT for an exact requested range;
- revisions / cancellations / first-known timestamps;
- immutable prospective archival;
- suspension / resumption effects on expected symbol sessions;
- RAW versus adjusted/continuity lineage.

No continuity transform or assessor wiring is authorized by this capability probe.
