# System 2｜全市場產業分層與供應鏈關聯整合建置指令 V1.0

Owner authorization: 2026-10-17 Asia/Taipei. **Class A research and read-only engineering approved**. This records the owner's instruction as a durable governance entry and does not authorize Class B/C changes. Repository `imihan0630-sys/v7-fugle-worker`, canonical latest GitHub `main`.

## Mandate and sequence

Within the EXISTING System 2 daily selection pipeline build `official main industry → subindustry/products → supply-chain role → many-to-many cross-industry theme → time/vintage` capability for listed+OTC equities, reusing D09/D10 and BR-046/047/083; no new industry research room, new selection engine, duplicate market GET or duplicate trading-day scheduler.

**P0 first**: genuine source date, independent original A1 audit, Scheme C signed visible NON_PIT_PREVIEW and Artifact remain the priority. Industry enrichment is strictly **optional**; where subindustry or full official B5 coverage lacks independently valid evidence display `SUBINDUSTRY_UNKNOWN` / `OFFICIAL_INDUSTRY_UNKNOWN` without suppressing an independently qualified preview. Missing source cannot be misreported as zero selections.

**P1 official full-market main industry**: join the exact source-date/TWSE+TPEx signed/independently audited official B5/native issuer industry codes to the real source universe. Preserve full **four-digit instrument denominator != certified ordinary equity denominator**. Report per-exchange source denominator, mapped/unknown/conflicted counts and coverage; no fabricated rates or codes. The existing `system2/runtime/b2_industry_snapshot_observer.mjs` must be examined/reused rather than a duplicate crawler. DATA is the official original-source owner.

**P2 evidence-qualified subindustry, product, supply chain, many-to-many theme**: reuse existing issuer-native 8046/3189 ABF and 2382/2308 AI-data-center bridges and counterexamples; demonstrate that official sector != theme, same theme != same financial edge, one issuer may have multiple product roles. TPEx 2026-06-01 official reclassification via BR083 (incl 1595/3131) is an effective-date/known-date negative-control example. Do not infer revenue, orders, capacity share or affected firm just from product capability, label or media theme. When magnitude is not independently confirmed keep `UNKNOWN`.

**P3 daily industry research display**: industry main/sublabel and role/theme/exposure source, clock, confidence and ambiguity beside sourced daily candidates; display peer breadth/sector turnover/rotation only when session, label membership, ordinary-equity denominator and timestamp are complete. No use of today’s member map to backfill prior date.

**P4 study only**: regime/sector rotation, supply/demand propagation, within-industry peers, leave-one-out price ancestry, OOS, cost, multiple testing, signal interaction. Separate formal scoring/ranking/entry/exit/Shadow/Frozen policy upgrades require explicit further owner Class B/C approval.

## Field and source contract

For each `market|symbol`: security identity/name, official industry code+label+taxonomyVersion, subindustry, principal product, role, multiple themes/edges and their original independent sources; `firstKnownAt`, `availableAt`, `observedAt`, `effectiveFrom`, `effectiveTo`, `supersededBy`, historical revision, source bytes/receipt SHA, confidence, native provider and version, actual revenue/order/capacity magnitude or `UNKNOWN`, independent source/PIT verdict, `researchDisplayAllowed` and separate `strategyUseAuthorized`. Append-only changes; classification announcement ≠ effective day; source capture clock cannot be backdated. Fail closed for official code/period conflicts, not for price-only P0.

## Parallel lane authority

- **BUILD** #1132/#1234 owns taxonomy and relation model, read-only exact-receipt consumer, daily research report integration, tests and main checkpoint. It must not retrieve DATA native historical issuer records again nor self-certify independent PIT.
- **DATA** #1068 owns exact-date official TWSE/TPEx classification and B5 provenance, original issuer/product and historical CFI/CA/classification vintages, effective-date/capture clocks, source/revision/UNKNOWN receipts and handoff. No duplicate already verified A1 source fetch. DATA checkpoint remains `system2/SYSTEM2_HISTORICAL_DATA_CHECKPOINT.md`.
- **AUDIT** #1127 independently tests source bytes/hashes, native official code/market/date, effective membership, many-to-many edges, negative examples, source completeness and no retroactive strategy promotion. No self-acceptance by BUILD or DATA.
- **REMEDIATION** #1238 continues existing writer/interlock, not a P0 preview gate.

One active modification owner per file/workflow; read latest main before any PR. Source handoff and audit are evidence, not auto-execution of other chat rooms.

## Acceptance and protected boundaries

Quantify per T full-source count, official industry covered/unknown/conflict per TWSE+TPEx; independently evidenced subindustry count/denominator; source and clocks; 8046,3189,2382,2308 and at least one counterexample; TWSE and TPEx theme/vintage cases; historical category change boundaries; error paths; same-market-date Scheme C source-to-report unchanged; actual PR/CI/Audit/SHA. Explicit `PASS/FAIL/BLOCKED/UNKNOWN`; existing 6 bounded research records do not equal full-market industry coverage. All PIT-A/PIT-B, Shadow/Frozen and prospective performance remain distinct.

**Absolute prohibitions without further approval**: formal seven-factor SHORT_MOMENTUM Stage1, scores/ranks/thresholds, orders, capital, trade BUY/SHORT signals, formal Frozen or Shadow admission, Cloudflare production Worker/Cron, Secrets, new paid service, production D1/R2 mutations and System 1 V8 Formal/Core/monitoring/push. Safe Class A engineering may proceed diagnosis→implementation→tests→PR→native CI→merge main→checkpoint while P0 stays deliverable.

## First physically delivered Class A subset

Merged [PR #1479](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1479), squash SHA `36cec4dd17e89618808d6573d74c438ffa590e4a`. Six bounded existing research case records (4 TWSE, 2 TPEx), SHA-bound Scheme C optional read-only derived industry sidecar appended in same existing GitHub Actions 30-day Artifact; new eight-test adversarial suite and full PR-head Scheme C/System2/V8/Writer CI success. On **real Oct16 historical PR replay**, 30 visible candidates **0/30** overlap with six seeds; this is a truthful scoped negative and NOT zero market industry coverage or an Oct19 success. Official current B5 full-market code+denominator **UNKNOWN** until DATA originals. Evidence `system2/evidence/S2_BUILD_INDUSTRY_TAXONOMY_REUSE_READONLY_20261017_V0_1.md`.
