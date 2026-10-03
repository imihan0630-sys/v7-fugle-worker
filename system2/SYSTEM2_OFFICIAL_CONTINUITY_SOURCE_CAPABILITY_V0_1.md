# System 2 Official Continuity Source Capability V0.1

Status: RESEARCH_ONLY / READ_ONLY_CAPABILITY_PROBE
Updated: 2026-10-03 Asia/Taipei
System 1 Formal Core: LOCKED

## Purpose

Provide a keyless, read-only physical capability probe for official TWSE / TPEx corporate-action sources after the authenticated Fugle corporate-action endpoints returned HTTP 403 under the current plan.

This module does **not** certify technical price continuity and does not transform historical prices.

## Candidate source lanes

1. TWSE ex-right / ex-dividend / rights forecast
   - `https://openapi.twse.com.tw/v1/exchangeReport/TWT48U_ALL`
   - prospective/current snapshot only.

2. TWSE capital-reduction reference history
   - `https://www.twse.com.tw/rwd/zh/reducation/TWTAUU?startDate=YYYYMMDD&endDate=YYYYMMDD&response=json`
   - bounded historical reference-price candidate.

3. TPEx ex-right / ex-dividend forecast
   - `https://www.tpex.org.tw/web/stock/exright/preAnnounce/prepost_result.php?l=zh-tw&o=data`
   - prospective/current candidate pending GitHub-runner physical verification.

4. TPEx capital-reduction reference history
   - `https://www.tpex.org.tw/web/stock/exright/revivt/revivt_result.php?...&o=csv`
   - bounded historical candidate pending GitHub-runner physical verification.

The probe records transport status, content type, payload hash, parser class, row count, a bounded field sample and ordinary four-digit-equity count when the source exposes a recognizable symbol column.

## Authority firewall

Regardless of HTTP or parser success, V0.1 keeps:

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

A source returning zero rows is not a NO_EVENT proof.

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

Physical acceptance records which official source candidates are actually reachable and structurally readable from a GitHub runner. Any blocked or structurally unexpected source remains an explicit capability gap.

## Next gate

Only after the official source lanes are physically characterized may a separate continuity archive / completeness design decide:

- which action families are covered prospectively;
- which historical ranges are complete;
- how revisions / cancellations / first-known timestamps are preserved;
- how suspensions and resumptions alter expected symbol sessions;
- how RAW versus adjusted/continuity lineage is represented.

No continuity transform or assessor wiring is authorized by this capability probe.
