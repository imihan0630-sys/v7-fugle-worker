# Curriculum Retirement and Capability Ledger V0.1

Updated: 2026-10-03 09:22 Asia/Taipei
Status: OWNER_APPROVED / EXECUTED / CAPABILITY_PRESERVATION_REQUIRED
Scope: Seven-item curriculum audit from the 366-module map
Formal Core impact: NONE

## Governing rule

Removing a module from the learning curriculum does **not** authorize removal of production/research capabilities, source adapters, historical evidence, runtime logic, tests, schemas, APIs, workflows, schedules, provenance records or explanatory aliases.

Before any curriculum retirement:
1. identify knowledge/function dependencies;
2. identify the surviving owner;
3. preserve historical research evidence;
4. preserve runtime/engineering capability when still required;
5. verify no Formal Core behavior changed.

## Executed decisions

### D01-12 — 酒田戰法與傳統K線語意反證
Decision: **OBSERVATION / MERGE_CANDIDATE / RESEARCH_ONLY**
- Remains in curriculum.
- Preserve Sakata/candlestick taxonomy and falsification knowledge.
- Reject a universal Sakata score or independent named-pattern vote by default.
- Future merge candidate: D01-02 / D01-03 / D01-05 / D01-09 after incremental-value and redundancy testing.
- Existing System 2 candlestick/Sakata explanatory capability remains intact.

### D02-07 — OBV能量潮
Decision: **OBSERVATION / MERGE_CANDIDATE / PRICE_VOLUME_COMPARATOR_ONLY**
- Remains in curriculum.
- OBV may be studied as price-volume comparator/context.
- It must not double-count direct volume, turnover, RVOL or price-volume evidence.
- If residual incremental information is absent, downgrade to explanation/UI or merge into the price-volume family.
- Existing research/System 2 OBV capability remains intact.

### D03-11 — ROC變動率
Decision: **CURRICULUM_RETIRED / EXACT_REDUNDANCY**
- Removed as a standalone curriculum module.
- Standard same-horizon percent ROC is an exact scalar alias of simple retN.
- Formula/name compatibility and anti-double-count responsibility transfer to D03-02.
- ROC slope/delta/acceleration remain residual hypotheses inside the existing momentum family only after redundancy control.
- Historical D03-11 research files are preserved.

### D10-11 — 官方資料自動化擷取
Decision: **CURRICULUM_RETIRED / ENGINEERING_CAPABILITY_PRESERVED**
- Removed from the stock-knowledge curriculum because it is data/research engineering, not an independent stock-selection knowledge module.
- Automated official-data ingestion capability is permanently preserved under Research Engineering / Data Source governance.
- This retirement does NOT authorize deletion/disabling of TWSE/TPEx/MOPS/MOEA/TAIFEX or other approved official-source adapters, source probes, source matrices, PIT clocks, scheduled incremental collectors, retry/fallback logic, health checks, storage, provenance, APIs, workflows or UNKNOWN semantics.
- Runtime/schedule/source changes remain subject to the existing Class A/B/C engineering governance.

### D10-12 — Industry-specific Transmission Model／Issuer Exposure Mapping產業專屬傳導模型與公司曝險映射
Decision: **KEEP**
- Retained in curriculum and renamed from 「產業別專用傳導模板」.
- It has matured beyond a generic template into a PIT-aware industry/product -> issuer exposure bridge.
- It is required to prevent narrative/theme spillover from being treated as issuer-specific benefit without evidence.
- It remains research evidence, not an automatic stock gate.

### D14-13 — Broker Fee Schedule完整費率語意
Decision: **CURRICULUM_RETIRED / MERGED_INTO_D14-01**
- Removed as a standalone module.
- Full broker-fee schedule semantics permanently transfer to D14-01.
- Preserve negotiated rates, discounts, minimum fees, odd-lot/round-lot or channel differences, promotions/exceptions, rounding, schedule version and ACTUAL/MODELED/UNKNOWN provenance.
- Existing commission evidence classifier and after-cost evaluation capability must remain intact.
- UNKNOWN commission != 0.

### D21-08 — Governance／ESG Score Provenance治理評鑑與來源語意
Decision: **CURRICULUM_RETIRED / SPLIT_OWNERSHIP**
- Removed as a standalone module.
- Data/source/version/provider/coverage/missingness provenance transfers to D16-11.
- Financially material governance/ESG/climate/social risk transfers to D21-13.
- Generic ESG/governance scores do not become stock-selection Alpha merely because a provider publishes them.
- Historical research evidence remains preserved.

## Current curriculum after execution

- Domains: 22
- Modules: 354
- Formal Core: unchanged
- Retired standalone module IDs: D03-11, D10-11, D14-13, D21-08
- Observation/merge candidates retained: D01-12, D02-07
- Explicitly retained/renamed: D10-12

## Anti-orphan rule

A retired module may not leave behind an orphaned capability or responsibility.
If a future audit finds that a retired module's required capability no longer has a clear owner, the owner mapping must be repaired before any related code/data/workflow can be removed or disabled.


## Observation-module merge execution — 2026-10-03

Owner instructed that safely mergeable observation items be merged first. Each merge below passed a dependency audit: the knowledge/function survives under an explicit owner, historical research files remain preserved, and no Formal Core behavior is changed.

### D01-12 → D01-02 / D01-03 / D01-05 / D01-09
Decision: **MERGED / STANDALONE MODULE RETIRED**
- Traditional candlestick / Sakata taxonomy is split into single-bar, multi-bar, lifecycle and gap/limit-price owners.
- System 2 candlestick/Sakata explanatory capability remains intact.
- No independent Sakata score or duplicate vote is allowed.

### D06-17 → D06-16
Decision: **MERGED / STANDALONE MODULE RETIRED**
- D06-16 is renamed to an integrated ETF mechanics module covering creation/redemption, AP, NAV premium-discount, tracking difference and underlying liquidity.
- D06-11 remains owner of passive-flow / index-rebalance effects.
- No ETF mechanics capability is removed.

### D12-18 → D12-17
Decision: **MERGED / STANDALONE MODULE RETIRED**
- D12-17 now owns option payoff structures, put-call parity, synthetic positions and common option strategies.
- D15-23 remains owner of portfolio-level derivative hedging / overlay application.
- Strategy names do not become stock-selection gates.

### D15-17 + D15-18 → D15-16
Decision: **MERGED / STANDALONE MODULES RETIRED**
- Mean-Variance, Efficient Frontier, Risk Budgeting / Risk Parity and Black-Litterman are retained as one Portfolio Optimization method family.
- Methods are compared under one estimation-error, cost and constraint framework rather than counted as separate selection evidence.

### D15-20 → D15-21
Decision: **MERGED / STANDALONE MODULE RETIRED**
- Tracking Error and Active Share are merged with Allocation / Selection / Timing performance attribution as one Active Portfolio Diagnostics family.
- These diagnostics explain portfolio behavior; they do not independently reject stocks.

### D19-14 → D19-13
Decision: **MERGED / STANDALONE MODULE RETIRED**
- Pairs Trading, Cointegration, Residual Mean Reversion and Cross-sectional Relative Value are retained as one Relative Value strategy family.
- Common risk neutralization, structural-break, cost and multiple-testing controls are shared.

### D21-06 → D21-07
Decision: **MERGED / STANDALONE MODULE RETIRED**
- Compensation / Incentive Alignment is merged into Management Incentives / Capital Allocation Quality.
- Incentives are studied through observable decision and capital-allocation outcomes.
- D21-12 remains independent owner of management-guidance credibility.

### Not merged yet: D02-07 OBV
Decision: **OBSERVATION / MERGE_CANDIDATE remains**
- Existing research says redundancy is high but independent residual information is not yet fully falsified.
- Keep as Price-Volume comparator until incremental-value testing is completed.
- It must not double-count RVOL, turnover, direct volume or price-volume evidence.

After this execution the canonical curriculum is **22 domains / 354 modules**.

## Owner-approved 15-item Dependency Audit classification — 2026-10-03

Canonical audit:
`shared-knowledge/CURRICULUM_15_ITEM_DEPENDENCY_AUDIT_20261003_V0_1.md`

The owner approved the remaining 15-item classification after Dependency Audit.

No standalone module is retired in this batch.

Classification:
- **CURRICULUM_KEEP:** D05-13, D19-13.
- **KEEP_ROLE_LIMITED / CONTEXT_OR_CAPABILITY:** D06-15, D14-16, D14-19, D21-02.
- **OBSERVATION / RESEARCH_ONLY:** D02-07, D02-08, D12-08, D19-08, D19-12, D19-16, D20-03, D20-05.
- **VALIDATION_THEN_STRONG_MERGE_CANDIDATE:** D15-19.
- **IMMEDIATE_RETIREMENT:** NONE.

Anti-orphan decisions:
- D05-13 keeps queue/order-priority mechanics as an execution capability.
- D14-16 keeps VWAP/TWAP/participation execution methods.
- D14-19 remains separate from D06-18 and D20-13 so securities-lending economics, limits-to-arbitrage theory and actual short execution remain distinct owners.
- D12-08 keeps its dealer-position identifiability firewall and remains separate from contract Greeks / expiry effects.
- D19-13 remains the owner of the already-merged D19-14 residual-mean-reversion knowledge.
- D21-02 retains board/independent-director context required by D21-01 control-structure research.
- D15-19 may later retire as a standalone ID only if calibrated probabilistic sizing ownership fully absorbs its theory/evidence without loss.

Curriculum remains 22 domains / 354 modules. No maturity promotion and no Formal Core change are authorized by this batch.

