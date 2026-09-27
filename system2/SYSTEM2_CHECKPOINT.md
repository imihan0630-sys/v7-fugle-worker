# System 2 Checkpoint

Updated: 2026-09-26 Asia/Taipei
Status: P1_DATA_AND_SHADOW_DESIGN_IN_PROGRESS

## Completed

- System 2 mission defined.
- Shared knowledge governance defined.
- Shared research master map defined.
- System 1 <-> System 2 bridge defined.
- Initial architecture, factor inventory, strategy catalog and performance spec defined.
- V8 Formal Core remains untouched.
- System 1 centralized Shared Knowledge read routing is active on main.
- Initial System 2 data-source feasibility matrix completed.
- Research-only storage schema designed with isolated `s2_` namespace.
- First three Shadow strategy hypotheses preregistered before outcome tuning.
- ChatGPT Project created, instructions saved, and this design chat moved into the new Project; migration status recorded in `system2/CHATGPT_PROJECT_MIGRATION.md`.

## Current design decisions

- Research-only storage design now includes `s2_strategy_ordering_receipts` and `s2_capacity_runs`; serializers and incremental SQLite syntax checks passed. No production database/runtime deployment occurred.

- Ranking research plan V0.1 preregistered: strategy-local baseline -> entry-readiness increment -> confluence increment -> regime priority -> incumbent replacement -> multi-strategy overlap -> concentration. CAPACITY_OVERFLOW names are mandatory control cohorts.

- Strategy-local ordering receipt implemented so upstream ordering must carry strategy/policy/version/decision provenance. Cross-strategy ranks are not assumed numerically comparable.

- Candidate-capacity allocator verification PASS: overlap dedupe, per-strategy slot accounting, no-forced-fill behavior, capacity-overflow preservation and retained-pool invariant fail-closed all passed.

- Candidate capacity contract V0.1 implemented from owner-approved invariants: global max 12 unique symbols, per-strategy max 3 ACTIVE_INTRADAY_MONITOR, no forced filling, overlap counts once globally and once in each actively monitored strategy. Capacity layer does not compute a universal score.

- Research-only storage schema V0.3 now includes `s2_shadow_runs`; incremental SQLite syntax validation for the new run table and extended decision columns passed. Schema remains NOT DEPLOYED.

- Shadow storage row serializers implemented and verified for `s2_decisions` and `s2_shadow_runs`; null rank/score and explicit strategy-validity/entry-readiness/source-readiness metadata are preserved.

- PIT-safe family-assessment receipt implemented and verified: missing, stale, invalid or PIT-ineligible REQUIRED factor inputs prevent a family from being KNOWN and force thesisState to INDETERMINATE.

- Full-universe Shadow run receipt implemented and verified: base universe must partition into excluded + eligible; every eligible symbol must receive an accounting state or the run is INCOMPLETE. This prevents selected-only/survivorship capture.

- Pre-ranking semantic correction completed: BUY_ELIGIBLE（符合進場條件） in Limited Shadow maps to QUALIFIED_NOT_SELECTED（符合策略但尚未完成最終選擇）, not SELECTED, until a separate ranking/capacity layer enforces global max-12 and per-strategy max-3. Verification PASS.

- Always-on Shadow accumulation remains NOT ACTIVE. Physical blocker remains isolated System 2 persistence + scheduled capture; do not attach to V8 production D1/runtime without Class B review.

- Storage design advanced to V0.3 (still research-only / not deployed) to persist strategy_validity, entry_readiness, source_readiness, shadow_spec_id and evaluation_mode without collapsing non-selected states.

- Limited Shadow decision builder implemented and verification passed: VALID+BUY_ELIGIBLE => SELECTED; missing REQUIRED evidence => INCOMPLETE+BLOCKED and still archived; VALID+TOO_EXTENDED => WATCH; source-blocked strategy cannot create a Limited Shadow decision. This verifies state semantics, not alpha.

- First two Limited Shadow（有限影子模擬） specs preregistered before outcome tuning: S2-SM-LS-001 and S2-SG-LS-001. V0.1 freezes no numeric rank/score/weight/threshold; rank and totalScore remain NULL.

- Machine-readable strategy source-readiness receipts implemented and verified. Current receipt states: SHORT_MOMENTUM=SOURCE_LIMITED, SWING_GROWTH=SOURCE_LIMITED, INDUSTRY_TREND=SOURCE_BLOCKED, EVENT_DRIVEN=SOURCE_BLOCKED, VALUE_REVERSION=SOURCE_LIMITED. These states describe source feasibility only and do not authorize weights/thresholds or live behavior.

- Research suggestion handling is now persisted in `system2/CHATGPT_PROJECT_INSTRUCTIONS.md`: every newly proposed factor/rule is a hypothesis and must pass mechanism, counterexample/failure-mode, redundancy, PIT/quantifiability and incremental-value checks; unsupported ideas are rejected or omitted.

- Contract/evaluator verification passed in-tool: five contract registry entries validated, immutable contracts confirmed, numeric-scoring guard passed, REQUIRED-UNKNOWN fail-closed passed, hard-invalidation precedence passed, and conflict downgrade passed.

- Generic StrategyValidity（策略有效性） / EntryReadiness（進場準備度） evaluator implemented research-only. REQUIRED evidence missing => INCOMPLETE + BLOCKED; hard invalidation => INVALIDATED + BLOCKED; adverse PRIMARY evidence can yield WEAKENING; valid contradictory evidence can downgrade BUY_ELIGIBLE to CONFLICT instead of forcing a directional decision.

- Strategy source-readiness map V0.1 added. SHORT_MOMENTUM is limited-Shadow eligible with explicit gaps; SWING_GROWTH is limited prospective-Shadow eligible after source freeze; INDUSTRY_TREND and full EVENT_DRIVEN are source-blocked for full Shadow; VALUE_REVERSION remains limited research-only Shadow.

- Machine-readable StrategyContract（策略契約） registry V0.1 implemented for the five currently owner-approved strategy identities: SHORT_MOMENTUM, SWING_GROWTH, INDUSTRY_TREND, EVENT_DRIVEN and research-only VALUE_REVERSION. No numeric weights, floors, caps or thresholds are frozen.

- StrategyContract（策略契約）machine-readable design phase started: `system2/SYSTEM2_STRATEGY_CONTRACT_V0.md` plus new research-only TypeScript interfaces separate evidence-family roles, data readiness, strategy validity and entry readiness. Only owner-approved strategy identities may be marked approved; IA/FG remain review-pending and Black Horse remains a research lane. No numeric weights/thresholds or System 1 behavior changed.

- ROA（資產報酬率）review completed: retain as FUNDAMENTAL_GROWTH（基本面成長） research candidate in SUPPORTIVE（加強） / QUALITY_CHECK（品質檢查） role, not a required hard gate. Test level/trend/peer/self-history context and redundancy versus ROE/ROIC, gross-profitability-to-assets and asset turnover before any score. Industry capital intensity/accounting asset structure are mandatory controls.

- Discussion proposals are hypotheses, not conclusions: every suggested factor/rule must be independently checked for counterevidence, failure modes, redundancy and incremental value. Ideas that add no value should be rejected or omitted rather than justified into the system.

- Owner explicitly requires an anti-agreement rule: do not accept a proposed factor/idea just because the owner suggested it. Every suggestion must receive mechanism + counterevidence + redundancy/incremental-value review, and may be rejected, downgraded to research-only/context-only, or accepted only when evidence justifies it. Do not manufacture reasons to keep weak ideas.

- FUNDAMENTAL_GROWTH（基本面成長）identity review advanced: quality-growth dimensions now explicitly include growth persistence/acceleration, margin quality, cash conversion/FCF, working-capital quality, ROE/ROIC where reliable, balance-sheet fragility, growth durability/customer concentration and capital allocation. Contract liabilities remain context-specific. Status remains OWNER REVIEW PENDING until explicit approval.

- Owner-observed STATE_OWNED_BANK_FLOW（公股行庫資金流） hypothesis accepted for research as AUXILIARY_CONTEXT_ONLY（輔助脈絡） / WARNING_MODIFIER（警告修正）, not as a buy/sell factor. Research focus: countercyclical support during market stress and later normalization selling after rebounds. Public-bank broker flow is not assumed identical to government/National Financial Stabilization Fund activity or informed conviction; current System 2 has no canonical source contract, so source/member-code/PIT validation is required before scoring.

- SWING_GROWTH（波段成長）strategy identity core logic owner-approved: focus on earnings repricing/acceleration, earnings quality, PIT-valid catalysts and industry/company transmission; technical/K-line evidence is timing support rather than proof of growth; THESIS_WEAKENING（投資邏輯轉弱） is distinct from THESIS_INVALIDATED（投資邏輯失效）. Exact thresholds/weights remain unfrozen.

- Technical-pattern intent firewall added: OHLCV can describe pattern/price behavior but cannot prove whether a large participant intentionally created or manipulated the pattern. Strategic trading/manipulation is treated as a possible mechanism/counterexample, not an inferred fact.

- SHORT_MOMENTUM（短線動能）strategy identity core logic owner-approved. Technical/K-line/chart patterns are explicitly non-unique evidence and never sole entry/exit authority; valid action requires cross-checks with price-volume acceptance, market/sector context, risk/reward and other available evidence families.

- Strategy-identity phase started. `system2/SYSTEM2_STRATEGY_IDENTITY_CARDS.md` Draft V0.1 created with unified PRIMARY / REQUIRED / SUPPORTIVE / CONTEXT_ONLY / HARD_INVALIDATION roles, setup/entry/add/reduce/exit semantics, intraday roles and falsification notes for all eight strategy families. Owner-approved statuses are preserved; previously discussed-but-not-explicitly-approved strategies remain OWNER REVIEW PENDING.

- CONFLUENCE_ENGINE（共振引擎）core logic owner-approved: aggregate within evidence families before cross-family confluence; prohibit majority voting and duplicate-counting; preserve hard invalidation/conflict states; separate FACTOR_CONFLUENCE（因子共振） from MULTI_STRATEGY_CONFLUENCE（多策略共振）. Numeric weights/floors/caps/interactions remain unfrozen.

- SYSTEM2_CONFLUENCE_ENGINE.md Design Draft V0.1 created for owner review: factor-family aggregation before cross-family confluence, no indicator majority voting, explicit redundancy controls, preregistered interaction terms, and separation of FACTOR_CONFLUENCE（因子共振） from MULTI_STRATEGY_CONFLUENCE（多策略共振）.

- Volume-baseline research direction owner-approved: retain relativeVolume5/20/60（日級5/20/60日相對量）, prev5IntradayBarRatio（前5根盤中K棒量比）, sameSlotRVOL（同時段相對量） and cumulativeVolumePace（累積成交量進度） as separate research comparators. No comparator is assumed superior before common-support redundancy/Shadow/OOS validation.

- PRICE_VOLUME_ENGINE（價量引擎）core architecture owner-approved: independent from TECHNICAL_STRUCTURE_ENGINE（技術結構引擎）, no majority-vote logic, data validity and hard invalidation outrank auxiliary indicators, and conflicts may resolve to WAIT / LOWER_READINESS rather than forced bullish/bearish scoring.

- SYSTEM2_PRICE_VOLUME_ENGINE.md Design Draft V0.1 created (owner review pending): keeps PRICE_VOLUME_ENGINE（價量引擎） independent from TECHNICAL_STRUCTURE_ENGINE（技術結構引擎）, defines participation/response/acceptance/persistence layers, and establishes conflict handling: no majority vote, data validity first, strategy hard invalidation outranks auxiliary indicators, technical structure and price-volume remain orthogonal, and contradictions become CONFLICT/WAIT/LOWER_READINESS instead of forced bullish/bearish scoring.

- SYSTEM2_TECHNICAL_STRUCTURE_ENGINE.md design draft V0.1 created: separates trend/levels/pattern topology/lifecycle/candlesticks/technical indicators/volatility/multi-timeframe/failure states; KD（KD隨機指標）, MACD（指數平滑異同移動平均線）, RSI（相對強弱指標）, ATR（平均真實波幅）, MA/EMA（移動平均線／指數移動平均線）, DMI/ADX（趨向指標／平均趨向指數）, Bollinger Bands（布林通道）, ROC/Momentum（變動率／動能） are auxiliary signals subject to redundancy checks. Engine describes structure and does not emit BUY/SELL.

- TECHNICAL_INDICATOR_AUXILIARY_LAYER（技術指標輔助層） explicitly added under the System 2 technical engine. Core support includes KD（KD隨機指標）, MACD（指數平滑異同移動平均線）, RSI（相對強弱指標）, ATR（平均真實波幅）, MA/EMA（移動平均線／指數移動平均線）, DMI/ADX（趨向指標／平均趨向指數）, Bollinger Bands（布林通道） and ROC/Momentum（變動率／動能指標）. These are auxiliary/context signals, not standalone BUY/SELL rules, and must pass redundancy/PIT/Shadow/OOS checks.

- Design gap explicitly opened: System 2 has referenced TECHNICAL / KLINE_PATTERN（技術面／K線型態） across strategies, and Shared Knowledge already contains active K-line/pattern research, but a dedicated System 2 TECHNICAL_STRUCTURE_ENGINE（技術結構引擎） has not yet been fully specified. Before freezing strategy identity cards, define candlestick signals, chart-pattern topology, support/resistance, trend/volatility structure, Fibonacci confluence, pattern lifecycle/confirmation/failure, and strategy-specific consumption rules. This is a shared module, not automatically a standalone strategy.

- VALUE_REVERSION（價值回歸策略）core logic owner-approved as research-only: distinguish mispricing from structural deterioration, require discount reason + catalyst/repair path + valuation context + reversal confirmation, prohibit blind averaging down, and retain VALUE_THESIS_INVALIDATED（價值投資邏輯失效）. Promotion remains blocked pending PIT/Shadow/OOS evidence versus simple low-valuation/rebound baselines.

- EVENT_DRIVEN（事件驅動策略）core logic owner-approved: verified source/timing, event-to-industry/company transmission, company exposure, surprise/price-in assessment, half-life/expiry/invalidation, event-to-structural-trend transition, and direct integration with POSITION_MONITOR（持股監控）. Exact scoring/thresholds remain unfrozen.

- Owner added CONTRACT_LIABILITY（合約負債） as a required fundamental research dimension. System 2 will study QoQ/YoY trend, acceleration and normalized ratios, with industry-applicability, margin/cash-flow/contract-quality guards and PIT timing. Rising contract liabilities are NOT automatically bullish. Current repository audit found no normalized contract-liability field, so source extension + PIT validation is required before scoring.

- INDUSTRY_TREND（產業趨勢策略）core logic owner-approved: cycle-stage first, company-level earnings transmission, leader-vs-high-beta-beneficiary comparison, technical timing rather than thesis substitution, cycle-peak warning, and explicit industry-thesis invalidation. Exact thresholds remain unfrozen.

- Owner-facing terminology rule: whenever English professional/financial/system terms are used, append the Traditional Chinese meaning on first use; avoid unexplained English jargon/acronyms.

- New owner-suggested hypothesis recorded: when a sector/industry thesis is bullish, test whether sector leaders deserve first-pass selection priority because of stronger fundamentals/industry position and potential institutional preference. This is NOT yet a rule; leader definition and leader-vs-follower performance must be falsified with PIT/Shadow/OOS evidence, including overvaluation/crowding/early-cycle follower counterexamples.

- Owner approval confirmed for the full symmetric position-management architecture, including ADD_ON_STRENGTH, ADD_ON_PULLBACK, RE_ADD_AFTER_REDUCE, ADD_ON_NEW_INFORMATION, dedicated POSITION_MONITOR, recovery conditions after every reduction, and anti-whipsaw hysteresis. Exact thresholds remain unfrozen pending Shadow validation.

- Exact re-add/sizing thresholds are not frozen and require prospective Shadow/falsification/cost validation.

- Re-add is evaluated from current recovery evidence, thesis and reward/risk; prior reduce price or average cost cannot by itself label a valid restoration as chasing.

- Exposure control must be symmetric: actual exposure is compared with desired exposure, supporting HOLD / REDUCE / EXIT as well as ADD / RE-ADD / RESTORE.

- Position-management architecture approved: actual holdings are always monitored outside candidate/active-entry caps.

- Candidate lifecycle approved: the 12-symbol pool persists across days; every post-close run revalidates each existing name, retains it while at least one strategy thesis still has observation value, removes it when the surviving thesis is invalidated/turns materially bearish, and fills vacancies with newly qualified names. State-change reasons must be frozen.

- Capacity rule approved: global System 2 candidate/watch pool max 12 unique symbols; each strategy max 3 ACTIVE_INTRADAY_MONITOR symbols; no forced filling; multi-strategy overlap counts once globally but remains strategy-specific for monitoring/performance.

- Same overall website/platform can host multiple isolated engines.
- System 2 is a multi-strategy discovery/selection platform, not a relaxed clone of V8.
- Market/global regime is an upper-layer context.
- Strategy weights/floors are context-specific and not fixed yet.
- Daily outputs must be frozen and performance-tracked.
- Shared knowledge is reusable; system-specific decision logic remains isolated.
- System 2 decision authority is fully independent: System 1/V8 cannot approve, reject or gate System 2 selection, entry, exit, monitoring or notifications.

## Next tasks

1. ✅ Inventory existing research into shared domain tags without relocating history — completed in `shared-knowledge/SHARED_RESEARCH_INVENTORY.md`.
2. ✅ Audit Tier A/B source fields for exact machine-readable contracts and historical PIT availability — `system2/SYSTEM2_SOURCE_CONTRACT_AUDIT.md`.
3. ✅ Define factor-engine TypeScript interfaces and normalization/UNKNOWN contracts — `system2/SYSTEM2_FACTOR_ENGINE_CONTRACT.md` + `system2/src/contracts.ts`.
4. ✅ Define market-regime V0 inputs using Tier A / prospectively derivable fields only — `system2/SYSTEM2_MARKET_REGIME_V0.md`.
5. ✅ Define execution simulator assumptions for Taiwan fees/tax/slippage/gaps/limits — `system2/SYSTEM2_EXECUTION_SIMULATOR_SPEC.md`.
6. ✅ Implement first research-only factor snapshot + frozen decision archive + isolated `s2_` schema prototype. Node/SQLite verification recorded in `system2/SYSTEM2_P1_IMPLEMENTATION_VERIFICATION.md`.
7. ⏳ Start prospective Shadow accumulation after an isolated physical System 2 persistence/capture path is provisioned; do not attach the prototype schema to V8 production D1 by default.

## Current boundary

Research/design/code prototype is not blocked. Prospective always-on Shadow accumulation now requires an isolated physical persistence + scheduled capture path. Preferred architecture is a separate System 2 D1/database binding. No production-shared storage change is authorized or needed for the completed P1 prototype.
