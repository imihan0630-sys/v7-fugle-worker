# BUILD｜PIT-A 未來每日選股 × PIT-B 歷史回測 — 接入與驗收差異（2026-10-16）

Status: IMPLEMENTED ON CLASS-A BUILD BRANCH / physical PIT-A admission NOT CLAIMED

## Formal authority

Owner-approved split: `system2/migration/PIT_A_DAILY_SELECTION_PIT_B_HISTORICAL_BACKTEST_PRIORITY_V0_1.md` (DATA-owned governance, PR #1409). The fixed DATA/BUILD/AUDIT lane boundary in `system2/SYSTEM2_PIT_DATA_BUILD_OWNERSHIP_AND_HANDOFF_V0_1.md` remains unchanged. PIT criteria (original 61 sessions, effective CFI, CA corrections/suspensions/retractions/no-event, timing, independent audit) are **not relaxed**.

## BUILD-owned impact

- **PIT-A P0:** consume independently published DATA + AUDIT original per-symbol evidence of a **genuine prospective daily as-of**, including existing 61-session true issuer versions. A single fully attested symbol may enter the existing SHORT_MOMENTUM Stage1 **research-only** assessor without waiting for unrelated historical years/physical D1 migration/entire market denominator to finish.
- **PIT-B P1:** research/backtest/revision/provenance continues separately. Historical replay PASS must NEVER be substituted for prospective daily authority. PIT-B historical status is independent of PIT-A.
- Explicit strict receipt route on `system2/runtime/pit_first_symbol_microbatch_preflight_v0_1.mjs`: DATA and AUDIT both must present `pitTrack=PIT_A`, `evidenceUse=PROSPECTIVE_DAILY_SELECTION`, `decisionCutMode=ACTUAL_FUTURE_OBSERVATION`, signed provenance tied to the original cut and explicit `pitB...Substituted=false`. Missing flags, forged rerouting of PIT-B signed reports or mismatch between DATA and auditor are rejected. **These labels are not PIT source proof**, as the independent original bytes/historical CFI/CA verification and source-by-cut clocks are still mandatory.
- Output reports `pitTrack=PIT_A` and `pitBHistoricalReplayCertified=false`. Even with one accepted symbol, `selectedCount=null`, `zeroPickDay=null`, no all-market rank, no qualified Shadow, no Frozen physical write; remaining source population stays UNKNOWN.
- `system2/tests/pit_first_symbol_microbatch_preflight_v0_1.test.mjs` adds direct current-CFI evidence as insufficient and multiple re-signed PIT-B substitutions/dual-audit mismatches as negatives. Earlier synthetic one-symbol positive remains **synthetic, never physical PIT**.
- No changes to factor weights, scoring, strategy policies, System 1 V8 Formal, D1/R2, Worker/Cron, credentials, production, live push, order or capital.

## Physically verified baseline at this read

The DATA main receipt `system2/migration/evidence/S2_DATA_ISSUE1068_PIT_SOURCE_HANDOFF_20261016_V0_1.json` is an original SOURCE-only observation for historical T=2026-10-15, with original source 122/122, 118,035 bars, 1,935 security observations, **PIT-A independently eligible 0 / 1,935 UNKNOWN 1,935**. An official four-control native CFI observation on 2026-10-16 recorded 2330/TWSE and 3287/TPEX as current ordinary Stocks (2/4) but historical 61-session CFI PIT 0; negative controls are 9103/TDR and 0050/ETF. Independent full 61-session PIT class/CA/AUDIT acceptance **not yet demonstrated**. Thus no PIT-A Stage1 candidate, no legitimate zero-pick and Frozen 0.

## Exact next handoff

**DATA #1068** acquires the *first genuine future* per-symbol, per-date, archive-by-cut historical A1+CFI effective windows+six CA version/authoritative NO_EVENT evidence (2330 first if physically possible), delivers original evidence hash; **AUDIT** independently checks and publishes exact acceptance hash; **BUILD #1132/#1234** then maps original data shapes to this Class-A read-only gate and existing Stage1 assessor. PIT-B storage/backtest completion proceeds in parallel and cannot block an independently valid PIT-A stock. No GitHub comment automatically launches another room.

The new receipt route fields are a consumer-side proposed interface; DATA source owner is not forced to change its own source original schema. If DATA's future accepted evidence uses an existing but differently shaped native contract, BUILD must adapt **without** re-fetching sources or weakening either lane's formal evidence semantics.
