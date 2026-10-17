# System 1 P0｜EPS 單股缺資料安全隔離 Shadow 實作與驗收 V0.1

時間：2026-10-17 Asia/Taipei。Owner decision: **已明確核准將「單一股票官方 EPS 未驗證先隔離、其他完整股票繼續選股」作為正式修復候選方案**。此授權包含隔離邏輯的 Shadow 研發、回歸與持股保護測試；**不授權 Worker 正式變更/部署、歷史交易日商業 scan replay、解除交易限制或任何實盤交易**。

## Original main authority and actual production incident
- Source: main head at branch creation b7274fe82a589bb0046ee298797c2d29aa45c04a；production version remains subject to latest real GET, earlier physical 8.20.2.
- Original protected 2026-10-16 Cron twice SKIPPED; original detail identifies EPS deficits 3236 / 5340 / 3147 / 4167 / 6122. [Run 39023480914](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/39023480914).
- D1 QUALITY summary reports QUARTER_EPS count=9. This does not establish five-symbol coverage, original filing basis, original byte hashes or PIT. Original source C parser independently passes 3236/3147/4167/6122, not necessarily persisted in 10/16 snapshot.
- 5340 official MOPS/PDF individual REPORT_ID=A is distinct from existing production C-only consolidated requirement. It stays **quarantined** absent independent legal and time verification. PDF EPS must never be labeled C.

## Shadow-only implementation in this PR
- Pure classifier: research/system1_p0_eps_candidate_quarantine_shadow_v0_1.mjs. Input is the **original V8 scoreCandidate successful cohort before per-pool top-3 quotas**. No new market candidates, no scoring changes, no arbitrary EPS values or neutral backfill.
- Independently hard-blocks date, official markets, >=60-day history, institution, financial, valuation, announcements, index, TDCC, and **global** QUARTER_EPS snapshot identity/date/count. Unknown or absent **whole dataset** may NOT be reclassified as a single-stock issue.
- Per-candidate fail-close EPS: official parser URL + original C consolidated text basis, exact current quarter and numeric/verified marker, Q2/Q3 real prior-quarter period and numeric verification. Negative and zero EPS remain valid numeric values, not fabricated growth %.
- Quarantine only deficient individual codes and reasons; rank surviving **originally pre-scored** cohort using unchanged V8 RR → priority → setup → sector → RS comparator. General <1000 and thousand >=1000 each get independently up to three, without cross-filling; same-pool runner-up may advance.
- All candidates quarantined or no preliminary qualifiers MUST NOT be claimed as a certified formal zero. The full Formal parent and same-date source lineage require independent verification.
- Protect actual holdings: candidate report never mutates prior positions, actual shares, stops, capital or staged fills. All returned candidates explicitly no Formal/BUY/trading, KV/D1 write or phone rights.
- **Not wired to Worker.js or any Formal Cron.** Uses synthetic or independently supplied original-equivalent cohorts for controlled comparison; research results are not actual trade instructions.

## Actual acceptance required
1. Offline unit tests: unchanged original rank + 3/3 when full EPS; 5340 missing/A-only quarantine; missing prior/current or incorrect period; global missing sources fail; all-quarantined is not real zero; existing FIRST holdings/stop protected; same-pool runner-up, no cross-pool filling; zero/negative EPS.
2. Exact-head CI: isolated Shadow test, V8 Regression, V8 Repair, System1 C1/C2 offline. CI cannot substitute genuine physical market acceptance.
3. DATA: original D1 9-symbol keys and four C records with real MOPS original SHA/source-version; see separate [PR #1489](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1489). Never overwrite nine with four new EPS rows.
4. AUDIT: verify reporting basis, legal A-only 5340 and PIT source timing; independent no-holding-loss and no-real-zero false positive review.
5. BUILD: after audited source + Shadow evidence, a separate protected review-only Worker patch applying exclusions between original scoreCandidate and pool quota. Original V8 75-step build, full-rank parity and resource/CPU backstop, then **separate** owner approval before any protected formal code deployment.
6. OPS: only next legitimate real trading day full Formal parent → D1 → KV → daily delivery → independently verified handset can close P0. CPU quota is separately tested; do not replay 10/16 Formal or orphan push.
7. Selection C2 short-admission economic validation and System2 PIT remain separate; no silent cross-system strategy convergence.

**Decision status:** OWNER_APPROVED_FOR_SHADOW_CANDIDATE / PRODUCTION_NOT_AUTHORIZED / NO_AUTO_TRADING.

**Next durable cursor:** Validate exact-head PR CI and independent review. If tests fail, repair this isolated branch. Do not promote the candidate or say production is restored because the Shadow is green.
