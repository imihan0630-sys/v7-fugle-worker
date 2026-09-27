# System 2 Strategy Identity Cards

Updated: 2026-09-27 Asia/Taipei
Status: DRAFT V0.1 / OWNER REVIEW IN PROGRESS / THRESHOLDS NOT FROZEN

## Purpose

Convert the System 2 strategy discussions into a consistent, executable research contract.

Each strategy card states:
- profit mechanism / thesis;
- intended horizon;
- regime fit;
- PRIMARY（主要） evidence families;
- REQUIRED（必要） evidence floors;
- SUPPORTIVE（加強） evidence;
- CONTEXT_ONLY（僅脈絡） evidence;
- HARD_INVALIDATION（硬失效） conditions;
- setup / entry archetypes;
- add / reduce / exit families;
- intraday role;
- main traps / falsification;
- current evidence and source-readiness state.

No numeric weight/threshold is frozen in V0.1. Missing data remains UNKNOWN（未知）.

## Common evidence-role vocabulary

- PRIMARY（主要）: defines the strategy thesis.
- REQUIRED（必要）: must meet a minimum qualitative floor for the setup to be eligible.
- SUPPORTIVE（加強）: can increase confidence/readiness but cannot create the thesis alone.
- CONTEXT_ONLY（僅脈絡）: descriptive/risk information; not a direct positive score.
- HARD_INVALIDATION（硬失效）: thesis-breaking state that cannot be rescued by auxiliary indicators.
- WARNING（警告）: lowers readiness or desired exposure but does not automatically invalidate.

---

## S2-SM — SHORT_MOMENTUM（短線動能）

Status: DESIGN DISCUSSED / OWNER REVIEW PENDING / PREREGISTERED SHADOW HYPOTHESIS EXISTS.

### Profit mechanism
Capture short-horizon continuation or reacceleration when market/sector participation, technical structure and price-volume acceptance align before the move becomes late-stage.

### Horizon
Approximately 1–10 trading sessions, potentially somewhat longer in exceptional continuation; long-horizon narratives cannot excuse failed short-term price action.

### Regime fit
Prefer RISK_ON（風險偏好）, TREND（趨勢）, improving breadth and active sector rotation.
Risk-off/panic/high-disorder regimes may reduce priority or raise confirmation requirements.

### Evidence roles
PRIMARY:
- TECHNICAL_STRUCTURE（技術結構）
- PRICE_VOLUME（價量）
- MARKET_REGIME / CAPITAL_FLOW（市場環境／資金流）

REQUIRED candidates:
- tradable/liquid enough for simulated execution;
- structure not already clearly failed;
- current reward/risk not structurally poor;
- setup-specific price-volume confirmation when the setup requires it.

SUPPORTIVE:
- sector/industry participation;
- institutional/chip confirmation;
- fresh event/catalyst where relevant.

CONTEXT_ONLY:
- fundamentals/valuation unless extreme risk or directly relevant catalyst.

HARD_INVALIDATION:
- failed breakout / broken structural support for the active setup;
- unresolved material adverse event that breaks the short-horizon thesis;
- severe illiquidity / abnormal trading;
- execution state where practical reward/risk has collapsed.

### Setup archetypes
- BREAKOUT_CONTINUATION（突破延續）
- PULLBACK_REACCELERATION（回檔後再加速）
- early-strength / pre-breakout watch state.

### Position actions
- ADD_ON_STRENGTH（轉強加碼）
- ADD_ON_PULLBACK（回檔加碼）
- REDUCE（減碼） on climax/extension/quality deterioration
- EXIT（退出） on structure/thesis/time failure
- trailing / profit-protect logic may be researched.

### Intraday role
High. 15-minute structure is likely the main confirmation layer; 5-minute may support execution detail. No System 1 15-minute semantics are automatically inherited.

### Main traps
Late-stage blow-off, false breakout, isolated stock strength, climax volume, chasing extension, and redundant technical indicators.

---

## S2-SG — SWING_GROWTH（波段成長）

Status: DESIGN DISCUSSED / OWNER REVIEW PENDING / PREREGISTERED SHADOW HYPOTHESIS EXISTS.

### Profit mechanism
Capture market repricing of an improving future earnings path before or while expectations are revised upward.

### Horizon
Weeks to months.

### Regime fit
Works best when industry/company improvement can be rewarded by the market; broad risk-off can compress valuation and delay repricing.

### Evidence roles
PRIMARY:
- INDUSTRY_THESIS（產業投資邏輯）
- FUNDAMENTAL_QUALITY / GROWTH（基本面品質／成長）
- EVENT_CATALYST / EXPECTATION（事件催化／預期變化）

REQUIRED candidates:
- identifiable improving future earnings mechanism;
- PIT-valid evidence that the improvement was knowable at the decision time;
- no structural thesis break;
- valuation/reward-risk not clearly prohibitive.

SUPPORTIVE:
- CHIP_OWNERSHIP / CAPITAL_FLOW（籌碼／資金流）
- TECHNICAL_STRUCTURE / PRICE_VOLUME（技術／價量） for timing
- market regime.

CONTEXT_ONLY:
- short-term oscillator extremes unless timing is directly affected.

HARD_INVALIDATION:
- catalyst failure;
- growth path materially deteriorates;
- cycle thesis reverses;
- major customer/product thesis fails;
- valuation/reward-risk becomes structurally unattractive with no compensating revision.

### Setup archetypes
- GROWTH_BREAKOUT（成長突破）
- GROWTH_PULLBACK（成長股回檔）
- EARLY_GROWTH_INFLECTION（成長轉折早期）

### Position actions
- ADD_ON_NEW_INFORMATION（新資訊確認後加碼）
- ADD_ON_PULLBACK（回檔加碼）
- ADD_ON_STRENGTH（轉強加碼）
- reduce on deceleration / margin deterioration / valuation overrun / institutional reversal.

### Intraday role
Medium. Daily/weekly thesis dominates; intraday is execution/timing quality.

### Main traps
Low-base growth, cyclical peak disguised as growth, good story/bad cash flow, fully priced growth, hindsight-biased forward data.

---

## S2-IA — INSTITUTIONAL_ACCUMULATION（法人累積／法人布局）

Status: DESIGN DISCUSSED / OWNER REVIEW PENDING / PREREGISTERED SHADOW HYPOTHESIS EXISTS.

### Profit mechanism
Detect structural transfer of holdings toward professional/large capital before price fully reflects the positioning.

### Horizon
Several sessions to several weeks; potentially longer if accumulation transitions into a broader trend thesis.

### Evidence roles
PRIMARY:
- CHIP_OWNERSHIP（籌碼／持股結構）
- institutional CAPITAL_FLOW（法人資金流）

REQUIRED candidates:
- persistence/quality of accumulation, not one-day buying alone;
- normalized flow relative to trading activity;
- no decisive ownership/price-response contradiction that breaks the thesis.

SUPPORTIVE:
- PRICE_VOLUME response/absorption context;
- industry/fundamental support;
- market regime;
- TDCC concentration trend where timing is valid.

CONTEXT_ONLY:
- technical oscillators except for entry timing.

HARD_INVALIDATION:
- sustained chip reversal;
- large-holder concentration reversal when relevant/valid;
- institutional buying with persistent adverse price acceptance and no credible absorption explanation;
- material industry/fundamental thesis deterioration.

### Lifecycle
EARLY_ACCUMULATION（早期吸籌）
-> ACCUMULATION_CONFIRMED（吸籌確認）
-> PRICE_ACCEPTANCE（價格接受）
-> NEAR_ENTRY（接近進場）
-> ACTIVE_ENTRY_MONITOR（盤中進場監控）

### Position actions
- ADD_ON_STRENGTH
- ADD_ON_PULLBACK
- ADD_ON_NEW_INFORMATION
- reduce when chip/price/industry confirmation reverses.

### Main traps
Passive/index flow, late-stage fund buying, one large seller overwhelming institutions, TDCC lag, and duplicated institution+holder factors.

---

## S2-BH — BLACK_HORSE_ACCUMULATION（黑馬潛伏）

Status: RESEARCH LANE / DISTINCTNESS FROM INSTITUTIONAL_ACCUMULATION NOT PROVEN.

### Profit mechanism hypothesis
Identify pre-institutional, under-recognized accumulation through ownership concentration, early fundamental/industry inflection and controlled price-volume behavior before obvious institutional confirmation.

### Horizon
Potentially weeks to months; discovery lead time is a key research outcome.

### Evidence roles
PRIMARY hypothesis:
- CHIP_OWNERSHIP early concentration;
- EARLY_FUNDAMENTAL_INFLECTION（基本面早期轉折） or company-specific edge;
- controlled PRICE_VOLUME / higher-low structure.

REQUIRED candidates:
- evidence of improving ownership/operating structure beyond mere illiquidity;
- no fabricated "smart money" attribution from OHLCV alone;
- sufficient liquidity to make the candidate meaningful.

SUPPORTIVE:
- early industry improvement;
- contract-liability trend where economically applicable;
- first emerging institutional confirmation.

CONTEXT_ONLY:
- absence of institutional buying by itself is NOT positive evidence.

HARD_INVALIDATION:
- concentration deteriorates;
- early fundamental thesis fails;
- industry/company edge disappears;
- structure breaks with no alternative valid strategy thesis.

### Lifecycle
STEALTH_ACCUMULATION（潛伏吸籌）
-> OWNERSHIP_CONCENTRATION（持股集中）
-> INSTITUTIONAL_CONFIRMATION（法人確認）
-> possible overlap with INSTITUTIONAL_ACCUMULATION.

### Promotion test
Must demonstrate incremental value and DISCOVERY_LEAD_TIME（提前發現時間） beyond IA without unacceptable false-positive cost.
If not, merge useful factors into INSTITUTIONAL_ACCUMULATION.

---

## S2-IT — INDUSTRY_TREND（產業趨勢）

Status: CORE LOGIC OWNER-APPROVED / THRESHOLDS NOT FROZEN.

### Profit mechanism
Capture company earnings transmission from a persistent industry cycle/structural supply-demand trend before the trend is fully priced.

### Horizon
Weeks to months, potentially longer where the cycle remains intact.

### Evidence roles
PRIMARY:
- INDUSTRY_THESIS: demand/supply/inventory/capacity/pricing/cycle stage.

REQUIRED candidates:
- explicit cycle stage;
- company-level transmission path;
- beneficiary/victim classification;
- sufficient earnings sensitivity or strategic exposure;
- no cycle-thesis invalidation.

SUPPORTIVE:
- company fundamentals;
- leader vs high-beta beneficiary comparison;
- capital flow/chips;
- valuation;
- technical/PV timing.

CONTEXT_ONLY:
- named chart patterns cannot replace the industry thesis.

HARD_INVALIDATION:
- supply/demand thesis reverses;
- expansion/capacity destroys scarcity thesis;
- inventory rebuild + pricing deterioration + earnings revisions turn down;
- company fails to capture the industry benefit.

### Setup archetypes
- EARLY_CYCLE_ENTRY（產業循環早期進場）
- TREND_PULLBACK_ENTRY（趨勢回檔進場）
- SECOND_LEG_BREAKOUT（第二段趨勢突破）

### Position actions
ADD_ON_NEW_INFORMATION is especially important.
Use CYCLE_PEAK_WARNING（循環高峰警示） and INDUSTRY_THESIS_INVALIDATED（產業投資邏輯失效）.

### Main traps
News heat mistaken for structural trend, temporary shortage, ignored capacity additions, cost inflation offsetting product-price gains, fully priced industry optimism.

---

## S2-FG — FUNDAMENTAL_GROWTH（基本面成長）

Status: DESIGN DISCUSSED / OWNER REVIEW PENDING.
CONTRACT_LIABILITY（合約負債） is an owner-requested approved research dimension.

### Profit mechanism
Capture persistent high-quality business growth that compounds earnings/cash flow/capital returns, with valuation and timing controls.

### Horizon
Months and potentially multiple quarters.

### Evidence roles
PRIMARY:
- FUNDAMENTAL_QUALITY（基本面品質）
- growth persistence / acceleration;
- earnings/cash-flow quality.

REQUIRED candidates:
- recurring operating improvement rather than one-off accounting gains;
- acceptable balance-sheet fragility;
- growth source reasonably sustainable;
- no fundamental thesis break.

SUPPORTIVE:
- industry tailwind;
- valuation;
- contract-liability trend where economically meaningful;
- chips/capital flow;
- technical/PV timing.

CONTEXT_ONLY:
- short-term oscillator state unless used for execution timing.

HARD_INVALIDATION:
- persistent growth/margin/cash-flow deterioration;
- loss of competitive edge / key customer;
- leverage or capital-allocation deterioration;
- apparent growth driven mainly by low base/one-offs/cycle peak.

### Setup archetypes
- QUALITY_PULLBACK（高品質成長股回檔）
- FUNDAMENTAL_BREAKOUT（基本面確認後突破）
- VALUATION_RESET_ENTRY（估值消化後重新進場）

### Position actions
ADD_ON_NEW_INFORMATION / ADD_ON_PULLBACK / ADD_ON_STRENGTH.
THESIS_WEAKENING（投資邏輯轉弱） is distinct from full invalidation.

---

## S2-ED — EVENT_DRIVEN（事件驅動）

Status: CORE LOGIC OWNER-APPROVED / THRESHOLDS NOT FROZEN.

### Profit mechanism
Capture under- or mis-priced consequences of a discrete information event after mapping mechanism, transmission, company exposure, persistence and current price-in level.

### Horizon
Event-dependent: intraday/very short through weeks/months. Structural persistence can transition into INDUSTRY_TREND or SWING_GROWTH.

### Evidence roles
PRIMARY:
- EVENT_CATALYST（事件／催化劑）
- mechanism/transmission/materiality/company exposure.

REQUIRED candidates:
- verified source/provenance;
- firstKnownAt / availableAt;
- explicit beneficiary/victim path;
- time horizon / half-life / expiry;
- invalidation conditions.

SUPPORTIVE:
- PRICE_VOLUME for price discovery/acceptance;
- technical structure;
- industry/fundamental context;
- chips/capital flow.

CONTEXT_ONLY:
- headline intensity itself.

HARD_INVALIDATION:
- source/event disproven;
- transmission mechanism fails;
- company exposure materially lower than assumed;
- event expires/normalizes;
- counter-event reverses the mechanism.

### Lifecycle
DETECTED（偵測）
-> VERIFIED（驗證）
-> TRANSMISSION_MAPPED（傳導完成）
-> ACTIVE_EVENT_THESIS（事件邏輯有效）
-> DECAYING（衰退）
-> EXPIRED（到期） / INVALIDATED（失效）

### Entry archetypes
- immediate reaction only when information timing/tradability are valid;
- EVENT_PULLBACK（事件後回檔）
- SECOND_WAVE_ENTRY（第二波進場）
- delayed fundamental transmission.

---

## S2-VR — VALUE_REVERSION（價值回歸）

Status: CORE LOGIC OWNER-APPROVED AS RESEARCH-ONLY / PROMOTION NOT YET JUSTIFIED.

### Profit mechanism
Capture valuation re-rating when market pessimism exceeds genuine structural deterioration and a credible repair path emerges.

### Horizon
Weeks to months; potentially longer depending on repair speed.

### Evidence roles
PRIMARY:
- VALUATION（估值）
- FUNDAMENTAL_DURABILITY（基本面耐久性）
- repair catalyst.

REQUIRED candidates:
- explicit discount reason;
- distinction between mispricing and structural deterioration;
- reasonable company-history/peer valuation context;
- credible repair/catalyst path;
- no permanent-thesis break.

SUPPORTIVE:
- industry-cycle bottoming;
- TECHNICAL_STRUCTURE reversal confirmation;
- PRICE_VOLUME selling-exhaustion / acceptance;
- chips/ownership stabilization.

CONTEXT_ONLY:
- "price fell a lot" or low PE/PB alone.

HARD_INVALIDATION:
- temporary problem proves structural;
- business model/technology/customer position permanently deteriorates;
- cash flow/leverage fragility worsens materially;
- repair catalyst fails.

### Setup archetypes
- CAPITULATION_RECOVERY（恐慌後修復）
- FUNDAMENTAL_BOTTOMING（基本面築底）
- VALUATION_RESET（估值重置）

### Position actions
No unconditional averaging down.
ADD_ON_NEW_INFORMATION and ADD_ON_STRENGTH only after repair/structure confirmation.

### Promotion test
Must beat simple low-valuation and technical-rebound baselines after PIT/OOS/cost/regime controls; otherwise remain auxiliary/research only.

---

## Cross-strategy identity controls

1. Same stock may qualify for multiple strategies; attribution stays separate.
2. MULTI_STRATEGY_CONFLUENCE（多策略共振） cannot double-count shared underlying evidence.
3. Strategy-specific intraday confirmation remains independent; no universal 15-minute gate.
4. Candidate/watch pool remains max 12 unique symbols; each strategy max 3 ACTIVE_INTRADAY_MONITOR（盤中主動監控） symbols.
5. Actual holdings remain in POSITION_MONITOR（持股監控） outside candidate/entry-monitor caps.
6. Every strategy must freeze decision timestamp, version, factor states, reasons, warnings, entry/stop/target plan and invalidation.
7. Any result-changing change to factor formula, threshold, interaction, gate, setup or exit semantics requires a new strategy version.

## Next design work

1. Owner-review the identity cards and resolve statuses of SHORT_MOMENTUM, SWING_GROWTH, INSTITUTIONAL_ACCUMULATION and FUNDAMENTAL_GROWTH.
2. Decide whether BLACK_HORSE remains a research lane or earns a separate preregistration after evidence.
3. Convert each approved card into machine-readable StrategyContract（策略契約） fields.
4. Map every REQUIRED/PRIMARY family to current source readiness: READY / DERIVABLE / PIT_AUDIT / SOURCE_REQUIRED / NOT_APPLICABLE.
5. Only then freeze first System 2 Shadow scoring/eligibility versions.
