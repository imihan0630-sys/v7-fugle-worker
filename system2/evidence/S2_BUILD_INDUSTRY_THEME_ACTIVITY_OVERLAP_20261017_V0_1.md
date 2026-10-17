# System 2 BUILD｜V1.1 細產業與跨題材多對多成交活躍度：來源綁定研究樣本第一階段

Date: 2026-10-17 Asia/Taipei. Owner V1.0+V1.1 Class A additive mandate. BUILD #1132/#1234; DATA #1068 native originals; AUDIT #1127 independent scope/time/overlap verification.

## Existing components reused, not rebuilt

- `system2/runtime/industry_activity_rotation_radar_v0_1.mjs`: signed single-T SOURCE-ONLY typed TWD amount and main industry / breadth / concentration, not actual net money flow or independently certified current B5 full market.
- `system2/runtime/industry_b5_data_scope_bridge_v0_1.mjs`: exact DATA per-market source-only native B5 join, no native independent original/PIT claim.
- `system2/data/industry_prior_research_reuse_seeds_v0_1.json`: the **existing six bounded historical research examples**, BR-046 8046/3189 ABF, BR-047 2382/2308 AI/server power+cooling, BR-083 1595/3131 TPEx reclass dates. Six are source examples, **not** official current full-market thematic coverage, ordinary share status or verified revenue fractions.
- Shared D09 BR-043 sector dispersion and BR-072 per-member Top1/Top3 concentration, D10 supply transmission, D18 market regime; no new source crawler, Cron, or research room.

## New Class A implementation

- `system2/runtime/industry_theme_activity_overlap_v0_1.mjs`:
  - Requires correct SHA-signed upstream radar receipt, **recomputes same radar** from exact original input and requires the same signed digest; additional per-stock A1 universe `sourceRowHash` exact equality with that stock's daily price/turnover row (SOURCE-ONLY provenance, NOT independent native readback).
  - Requires conservative old-source industry research seed schema, null official native industry code, all exposure magnitudes UNKNOWN, unique market+symbol identities, existing `research/` source references, historically captured `knownAtUtc`. No current-T backfill: if research first known after min(T23:45, original market observation), exclude it; reclassified effective date does not override first known.
  - Builds `SUBINDUSTRY|code` and `THEME|code` multi-to-many member cohorts **from evidence edges, never from whole main industry**. If one issuer has two products/roles in same theme, its full stock turnover is counted **ONCE PER THEME**; if it is in two different themes, each theme may report its own descriptive membership, but separate overlap journal tracks unique symbols and duplicated gross turnover.
  - Per cohort: only bounded research-member amount TWD, up/down/flat valid denominator, equal-weight return, Top1/Top3 and missing member counts; null for incomplete source. Full cohort membership, verified market trade share, company revenue weighting, institutional net buying, 5/20/60 and rotation inference remain UNKNOWN/INSUFFICIENT_EVIDENCE. A stock's market value traded **is not its thematic sales exposure**; avoid weighted allocation to unrelated segments.
  - Separate `summedThemeMemberGrossTradeValueTwd`, `uniqueObservedThemeMemberGrossTradeValueTwd`, `duplicatedActivityFromCrossThemeMembersTwd` only if corresponding bars are complete; NEVER a "net money inflow" or sum of non-overlapping full market flows. No industry score/order/Shadow/Frozen/System1 impact.
- `system2/scripts/run_industry_theme_activity_overlap_readonly_v0_1.mjs`: read-only CLI, only reads existing source report, its source input bundle and existing research file; emits create-only JSON + section-B Markdown offline, no source GET or D1/R2.
- `system2/tests/industry_theme_activity_overlap_v0_1.test.mjs`: 10 directed synthetic tests including ABF two official main industries, power/cooling one AI member, new second theme cross-membership and exact double-count amount, historical vintage exclusion, missing row UNKNOWN, forged row hash, duplicate/invented exposure evidence, forged authority, recomputation after altered bars, and no formal effect.

## Real-source gates and next safe step

- **The generated values in synthetic tests are not live market data.** As of Saturday 2026-10-17, the next expected 2026-10-19 actual A1/B5 original same-T source + independent rehash/audit do not yet exist. No new-T real theme radar, certified ordinary-share denominator, official full-scope classification, 1/5/20/60 history, institutional verified purchase-value or cross-theme risk-adjusted score claim.
- DATA #1068 must produce source-preserving original full A1 **per-stock sourceRowHash matching dated T price/turnover row**, exact T B5 effective/current issuer source and independent auditable provenance. AUDIT #1127 independent original readback and complete membership/overlap and class/exclusion denominator acceptance. BUILD then can safely generate **optional** fresh real-T sector radar sidecar for same verified sources without gating NON_PIT_PREVIEW; must distinguish research-seed members from genuinely full-market independent sector members.
- Main P0 continues existing daily named Scheme C preliminary PV candidate workflow; optional sector module failure must show SOURCE_NOT_READY/UNKNOWN and never suppress original candidates, invent zero picks or change seven-factor Stage1, Frozen, Shadow, System1, trades, Cron, Secrets or production.
