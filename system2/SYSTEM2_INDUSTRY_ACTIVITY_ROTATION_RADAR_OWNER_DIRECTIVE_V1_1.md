# System 2｜每日主產業與細產業資金流向、輪動雷達整合建置指令 V1.1

- **Owner-approved:** 2026-10-17 Asia/Taipei (owner message). Additive to **全市場產業分層與供應鏈關聯整合建置 V1.0**; V1.0 remains in effect.
- **Authority:** Class A research + read-only models, evidence-safe analyses, reports, offline implementation/tests/CI, optional nonblocking research enrichment. Formal strategy ranks/weights/selection, System1 V8 Formal Core, production Worker/Cron, Cloudflare D1/R2 writes, secrets, paid services, Frozen/Shadow promotion and trades require separate Class B/C owner approval.
- **Owners:** BUILD #1132/#1234 engine/research/report, DATA #1068 original A1/B5/issuer-vintage/institution data, AUDIT #1127 independent original-source+computation acceptance. Existing cross-lane one-conflict-unit/one-writer governance unchanged; GitHub comment does not auto-execute another room.
- **First priority:** true next-T NON_PIT_PREVIEW Scheme C delivery with genuine audit and signed Artifact; industry radar absent/not-ready must never zero, suppress or delay otherwise valid PV candidate research.

## Research semantics (strictly separated)

A. **Activity (gross turnover, not net investment funds).** TWSE/TPEx same-T official per-security trade value/volume/price, industry daily amount, verified share of *correct* market eligible denominator, verified histories 1/5/20/60 and relative change, rising/declining participation, Top1/3 turnover concentration, EW/turnover-weighted return with valid return denominator. Missing member or amount -> UNKNOWN or clearly scoped partial, not zero.

B. **Observable net buying.** Foreign/investment trust/dealer separate signed native official sales-minus-purchases data with **explicit currency, amount vs shares vs lots, adjustment, unit and transaction clock**. Never sum mismatched units. If native data only gives net shares, any price proxy MUST say `ESTIMATED_NET_VALUE` and cannot be reported as observed actual net funds; passive ETF/hedge/rebalance alternatives remain as negative controls.

C. **Inferred rotation.** `ROTATION_INFERENCE` from same-member-window relative market return, 1/5/20/60 market-trade-activity share changes, breadth, concentration, institution persistence and Regime; always research inference, NEVER verified "capital transferred from sector A to B". Output `INSUFFICIENT_EVIDENCE` / UNKNOWN unless inputs pass. Research-only states to calibrate later: NEW_ATTENTION, BROAD_STRENGTH, LEADER_ONLY, INSTITUTIONAL_ACCUMULATION, WEAKENING, SELLING_PRESSURE, MIXED, UNKNOWN. No unvalidated hard thresholds or scoring.

## Universe, membership and time

- **Official main industries** group strictly mutually exclusive ordinary-share members as-of T; 4-digit codes ALONE **never** prove ordinary common shares, and a current native company profile cannot be retroactively backfilled into earlier T. Count/explain excluded/UNKNOWN/conflict by TWSE/TPEX separately, then combine only with verified equivalent native classification schemes.
- **Subindustries and themes** are genuinely many-to-many; each company can appear in several labeled cohorts with identity/time/source confidence. Report overlap and unique members; never add multiple overlapping themes and call the sum unique whole-market funds. If no audited revenue exposure, keep weights UNKNOWN; do not invent a revenue allocation. Product ability and news alone do not prove material recognized revenue.
- Preserve per-source `firstKnownAt`, `availableAt`, `observedAt`, effective windows, raw row/provider hash, native version/revision, original market T and clock. Late source after T reference cut is descriptive only and cannot become on-time/forward PIT.
- Factor/regime/CA return basis and unit conversion must be explicit. Regime and cross-asset causality are not ordinary additive factor shortcuts.

## Implementation phases and acceptance

1. **P0:** preserve real daily Scheme C market T independent original audit -> natural child/manual-labeled fallback -> named research Summary and signed 30d Artifact; source not ready is not 0 picks.
2. **P1:** original same-T A1+B5 all-members read-only main-industry activity data adapter and per-market amount/participation/concentration; independent original B5/native ordinary class and member denominator required to publish official full-market money shares. Interim source-only diagnostics may run explicitly labelled with official coverage UNKNOWN.
3. **P2:** date-effective audited subindustry/supply-chain/thematic many-to-many cohorts, member overlap and missing exposure; aggregate each cohort separately.
4. **P3:** actual official institutional source, unit-aware net positions, historical 1/5/20/60 calendar/venue segmentation, relative strength/regime and preregistered robust turnover/participation/institution interaction; invalidate unsupported observations.
5. **P4:** attach optional radar A/B/C/D markdown, audit time, generation time, status and signed source hashes to existing Scheme C Summary/Artifact, without interfering with P0; independent AUDIT physically check real same-T report in its exact action run/artifact, distinguish natural/manual/PR/historical.
6. **P5:** PIT/OOS, factor redundancy, cost, forward/Shadow and regime robustness in separate research studies; owner approval before any protected scoring/strategy/Frozen/trade mutation.

At every work round report actual latest main SHA, trading day and exact TWSE/TPEx numerator/denominator/exclusions, mapped vs UNKNOWN/conflict, audited main/subindustry count, institutional native units/verified coverage, session histories 1/5/20/60, audit Run/Artifact/SHA, CI, blockers and owner. Do not infer successful real deployment from synthetic tests.

## Existing code reuse / first stage actual engineering

- BR-043 sector dispersion; BR-072 turnover and Top1/3 concentration; D09 breadth/rotation, D10 supply-chain, D06 institution microstructure, D16 PIT/overfitting, D18 regime, existing `b2_industry_snapshot_observer.mjs` / `d18_sector_rotation_context_v0_1.mjs`, and `MARKET_BREADTH_ROTATION_RESEARCH.md`; not another crawler/research-room fork.
- Previous V1.0 `industry_research_enrichment_v0_1.mjs` is bounded historical label overlay, six issuer seeds only. Previous native `industry_b5_data_scope_bridge_v0_1.mjs` uses DATA original profile source scope, **not** independently certified actual B5.
- [PR #1487](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1487) merged Class A offline `industry_activity_rotation_radar_v0_1.mjs`, source-only actual T 4-digit evidence-footprint groups, missing data safety and gross activity vs actual institutional money flow firewall; local create-once CLI + ten adversarial tests, **NOT** physical real daily provider access or official full-market report. Need new-T DATA/AUDIT proof before optional Scheme C integration.
