# BUILD_LANE｜PIT 0 → 1：第一檔逐股解鎖接入紀錄

Date: 2026-10-16 Asia/Taipei
Class: A / offline, read-only, strategy authority unchanged
Owner: BUILD_LANE
Upstream: DATA_LANE #1068 / independent AUDIT_LANE
Downstream: #1132 / #1234

## Real accepted scope, NOT a simulated result

- Latest upstream source-only DATA receipt (marketDate 2026-10-15): `eca5b8e491f865a2f94f16e9efcaa30c8d7bf21528747634c3131aafd57b32e5`.
- A1 native original pairs 122/122; 61 official sessions; 118,035 source quote bars; **1,935 source-security observations** only, not independently certified ordinary-equity.
- **Actual historical decision-cut independent PIT accepted = 0/1,935**; PIT-UNKNOWN = 1,935. Original-source 10/16 05:45 Taipei readback missed the earlier 10/15 23:45 Taipei decision cut; NEVER retroactively cure that original cut.
- Strategy actual full-day assessed count **not independently accepted / null**, selectedCount **null**, zeroPickDay **null**, Frozen D1 physical rows **0**, Shadow S0–S5 **0/6**. Do not call this a zero-pick day.

## Fastest legitimate path to one eligible symbol

Instead of blocking Stage1 on all 1,935 symbols simultaneously, DATA should send the smallest **one-stock, one-target-marketDate, full-61-session** batch with:

1. Exact official 61-session identity, symbol+TWSE/TPEx, A1 61 bar original version/hash/firstKnownAt/availableAt and the **original archive physically witnessed by that decision cut**.
2. Original historical ordinary-common-share CFI effective periods covering EACH official session (a 2026-10-14 current CFI alone is insufficient), original native hashes and independently verified availability.
3. Six original CA family versions and effective scope, all relevant corrections/cancellations, halt/resume and authoritative NO_EVENT negative scope, verified for that single symbol across 61 sessions.
4. Independent AUDIT_LANE exact symbol+date+decision cut hash, a published independent auditor receipt physically verifying original provider bytes, archived-by-cut clock, class window and CA negative-event scope. Hash must be independently pinned from trusted main/Artifact readback, not copied from DATA self-report.
5. Only after **actual** DATA original plus independent AUDIT original proof merged to main should BUILD feed `preflightFirstPitSymbolV0_1` the respective receipts and externally pinned audit digest. A positive preflight authorizes only subsequent **existing SHORT_MOMENTUM Stage1 offline assessor** for that stock; it never constitutes selection/ranking/Shadow/Frozen authority. Keep all remaining source symbols PIT UNKNOWN and count the full source universe denominator.

First candidate to **attempt** is 2330/TWSE because an older native current-type 2026-10-14 independently rehashed control includes Stocks/CFI ESVUFR. This is NOT evidence of 61 historical class PIT. If insufficient, DATA can substitute any one symbol with truly complete native originals.

## Isolation & readiness interface

- `system2/runtime/pit_first_symbol_microbatch_preflight_v0_1.mjs` is future incremental DATA/AUDIT interface proposal, **not a new DATA certificate**.
- `system2/tests/pit_first_symbol_microbatch_preflight_v0_1.test.mjs` exercises synthetic positive plus missing/late/forged original cuts, CFI gaps, CA families, audit binding and D1 authority negatives; synthetic 1/1935 **MUST NEVER** be counted as physical PIT progress.
- Existing 2026-10-15 historical gate `pit_data_build_handoff_readiness_v0_1.mjs` is unchanged and remains 0 eligible.
- No new original source GET, Cloudflare D1/R2 reads/writes, production Worker/Cron, V8 Formal, trade order, push or Frozen physical mutation.

## Acceptance definition

**Real PIT progress becomes 1 only when** the actual source original receipt plus separately published independent audit receipt are both externally available, physically clock-verified to a legitimate original decision cut, source hash lineage reconciles and the full 61-session/CFI/CA per-symbol conditions pass. CI passing a synthetic 1/1935 fixture is an engineering test, **never** the 0→1 achievement.
