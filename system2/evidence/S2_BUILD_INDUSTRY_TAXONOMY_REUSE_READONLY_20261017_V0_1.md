# System 2｜產業分層與跨產業供應鏈重用 Class A 第一階段（2026-10-17）

**Owner directive:** 「System 2｜全市場產業分層與供應鏈關聯整合建置指令 V1.0」；BUILD 主責 #1132/#1234、DATA #1068、AUDIT #1127。**PR not a claim of full-market industry coverage, PIT, or true next-market-day service.**

## Existing evidence reused, without duplicating provider fetches

- `system2/runtime/b2_industry_snapshot_observer.mjs`: existing B2 official TWSE/TPEx profile parser, dated daily market rows, industry coverage controls. It supports a different B2 snapshot receipt; **not yet an independently audited current-date B5 source join into the Scheme C signed daily handoff**. No new provider GET or duplicate daily crawler created.
- `research/br046_abf_industry_exposure_bridge_v0_1.json`: 8046 TWSE 電子零組件 and 3189 TWSE 半導體, each has issuer-source ABF/IC substrate product evidence across different formal industries; revenue/order magnitude UNKNOWN.
- `research/BR047_AI_DATA_CENTER_CROSS_INDUSTRY_THEME_BRIDGE_20261008_V0_1.md`: 2382 computer/peripherals AI/cloud server ODM vs 2308 electronic components data-center power, thermal management, 800 VDC. **Different economic roles; no equal revenue exposure inference.**
- `research/BR083_D09_01_TPEX_EFFECTIVE_DATED_RECLASSIFICATION_2026_V0_1.md`: official TPEx 2026-05-19 announcement, 13 reclassifications effective **2026-06-01**, incl 1595 and 3131. BR083 file's research capture is later, conservatively first-known 2026-10-09 for THIS adapter; it cannot invent an earlier native observation clock or retroactive PIT.
- `research/D01_DL144_146_PIT_INDUSTRY_VINTAGE_AND_RECLASSIFICATION_FIREWALL_20261010_V0_1.md` and `research/sc064_d10_01_versioned_graph_timing_contract_v0_1.json`: PIT/known-versus-effective, composition breaks and versioned supplier edges, no extra structural scoring.

## New engineering boundary

- `system2/data/industry_prior_research_reuse_seeds_v0_1.json`: **6** bounded source-identified issuer research cases (4 TWSE, 2 TPEx). Only existing research's conservative capture dates. Each product/supply edge has separate theme and role; revenue/order/capacity magnitude UNKNOWN. Current official B5 code is **null** (not guessed). **These six cannot be interpreted as a 6/market coverage rate.**
- `system2/runtime/industry_research_enrichment_v0_1.mjs`: verifies same signed Scheme C handoff and signed preview; exact symbol/market joins; rejects duplicate/invalid sources and fake PIT/Frozen; suppresses any evidence captured after market-day T23:45 or preview observation; separately preserves official-main-label old-research corroboration versus independently certified current B5. Unknowns stay `OFFICIAL_INDUSTRY_UNKNOWN`/`SUBINDUSTRY_UNKNOWN`. Explicit market and row counts, no fabricated full-market denominator. **Report order, prices, selection results unchanged**.
- `system2/scripts/run_industry_research_enrichment_readonly_v0_1.mjs`: only reads signed handoff plus repo-existing research seed, create-once local `daily-industry-research-context.{json,md}` into the **existing derived 30-day GitHub Actions Artifact**. No new Cron, source GET, D1/R2 or formal storage.
- Existing Scheme C workflow displays the optional enrichment appended after the authentic signed source-bound report, **without altering the signed original report hash**. Optional enrichment error is a warning, never a whole-preview P0 blocker. The preview does not become the formal seven-factor SHORT_MOMENTUM.
- `system2/tests/industry_research_enrichment_v0_1.test.mjs`: bounded cross-industry ABF and AI supplier contrasts; TPEx reclassification temporal firewall; non-theme negative; SOURCE_NOT_READY not zero; signature and duplicates; invented exposure and false PIT claim rejection.

## Quantified P0/P1 readout and ownership

| Metric | Evidence state |
|---|---|
| Existing bounded issuer research cases reused | **6** (4 TWSE, 2 TPEx); NOT full exchange coverage |
| Research examples with product/theme edges | **4** TWSE named research cases; no certified TPEx cross-theme edge yet |
| TPEx effective reclassification historical examples reused | **2** (1595, 3131) within BR083's documented 13 |
| Current-market official B5 full symbol denominator / accepted code mapping | **UNKNOWN** pending DATA source+native B5 receipts; **not zero** |
| True ordinary-share market denominator | **UNKNOWN** pending independent share class checks |
| Total all-market subindustry confidence-qualified coverage | **UNKNOWN**; seed is strictly bounded evidence, no inferred universe |
| Daily actual-new-T natural Scheme C acceptance | **not yet physically proven**; expected Oct19 subject official calendar |
| Strategy selected count, zero-pick-day | **null**, not 0 |
| Formal strategy scoring/weights/Shadow/Frozen/production changes | **NONE** |

**DATA #1068 next:** dated TWSE/TPEx official B5 source family, original code/name and instrument class, per-market T denominator, source clock, SHA, industry changes and PIT native effective periods; deliver signed provenance (no duplicated A1 fetch). **AUDIT #1127 next:** independently falsify source/path/label and temporal leakage, verify 8046/3189/2382/2308 and TPEx 1595/3131 controls, and seek original TWSE reclassification native case; no proxy praise without source identity.

**BUILD next:** consume DATA's truly independently audited B5 receipt to report actual market/day `covered/unknown/conflicts` per TWSE and TPEx; keep old research labels as optional side information, never promote to certified current B5 automatically. Develop full vintage append-only and sector rotation only after independent provenance and adequate market denominator. Preserve P0 daily source integrity priority throughout.
