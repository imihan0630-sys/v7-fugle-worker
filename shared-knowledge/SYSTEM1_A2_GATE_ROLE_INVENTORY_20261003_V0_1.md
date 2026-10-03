# System1 A2 Gate Role Inventory 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: A2_GATE_ROLE_AUDIT_COMPLETE / RESEARCH_CLASSIFICATION_ONLY / FORMAL_CORE_LOCKED
Scope: current System1 Formal admission gates, Hybrid role eligibility, and ranking-policy cross-check

## Audited authority

Repository: `imihan0630-sys/v7-fugle-worker`

Pre-audit latest main:
`18aedb1d13757bdefb43f2f0817b0185b3e88fa3`

Raw Worker source SHA:
`24fd61d7b8dfd5610c40cc67a2b6807dd622bd73`

Important effective-runtime note:
- raw `Worker.js` still contains the pre-V7.5.30 RR-first rank expression;
- the guarded deployment patch chain `scripts/apply_v7_5_30.py` replaces it;
- V8.13 regression explicitly locks the effective comparator as:
  **PriorityScore -> RR -> Market Consensus -> Setup Quality -> Sector Flow -> Relative Strength**;
- therefore this audit treats the patch-chain comparator as the effective Formal ranking authority.

Current constants:
- price floor = NT$10;
- RR floor = 2.0;
- signal grade B floor = 65;
- signal grade A = 80;
- general / thousand pools = max 3 each;
- thousand threshold = NT$1,000;
- max single-name allocation = 35%.

## Core finding

Current `scoreCandidate()` contains **21 fail-fast rejection branches**.

That does **not** mean System1 has 21 true `HARD_INVALIDATION` conditions.

The role audit finds four materially different types currently collapsed into one fail-fast path:

1. genuine hard safety / owner-policy constraints;
2. missing-data / confidence states;
3. strategy-specific PRIMARY_ALPHA requirements;
4. supportive/context variables that are currently hardened into admission rejects.

This semantic collapse is a plausible structural contributor to low BUY / low candidate incidence, but **this audit does not prove that softening any gate improves returns**.

## Current Formal gate role inventory

| Gate | Current rejection | Current behavior | SHORT role | SWING role | Audit | Rationale |
|---|---|---|---|---|---|---|
| PRICE_FLOOR | 股價 < 10 | FAIL_FAST_REJECT | HARD_INVALIDATION | HARD_INVALIDATION | ALIGNED_OWNER_UNIVERSE_POLICY | Owner-fixed tradable-universe rule; not Alpha. |
| HISTORY_60D | historyDays < 60 | FAIL_FAST_REJECT | CONFIDENCE_UNCERTAINTY | CONFIDENCE_UNCERTAINTY | ROLE_HARDENED_LOW_PRIORITY | Insufficient lookback means current feature contract cannot be evaluated; it is not negative Alpha by itself. |
| RS_CONTEXT | marketReturn20 / sectorReturn20 missing | FAIL_FAST_REJECT | CONFIDENCE_UNCERTAINTY | CONFIDENCE_UNCERTAINTY | ROLE_MAP_DEFECT | Current gate checks availability only. Relative-strength value itself appears later in ranking; do not label the availability check PRIMARY_ALPHA. |
| MARKET_CAP_FLOOR | marketCap missing or < 10億 | FAIL_FAST_REJECT | CONTEXT_ONLY | PRIMARY_ALPHA | OVERHARD_P1 | Split missing-data state from economic size threshold. Missing is UNCERTAINTY; size is context for SHORT and may be primary for SWING. |
| DAILY_ABNORMALITY | abs(changePercent) >= 9.8% | FAIL_FAST_REJECT | CONTEXT_ONLY | CONTEXT_ONLY | OVERHARD_P2 | A near-limit move is not factual non-executability by itself. Hard status requires actual orderability/price-limit/event evidence. |
| LIQUIDITY | 20日均量 < 1000張 / 千金 < 300張 unless exception | FAIL_FAST_REJECT | CONFIDENCE_UNCERTAINTY | CONFIDENCE_UNCERTAINTY | OVERHARD_P2 | Average-volume/depth/spread thresholds are execution proxies. HARD is reserved for factual non-executability; preserve owner liquidity policy in Formal until prospective counterfactual evidence. |
| SMALL_CAP_SPECIAL | 10–30億需 1.5x volume + institutionalScore>=70 | FAIL_FAST_REJECT | CONTEXT_ONLY | PRIMARY_ALPHA | OVERHARD_P1 | Composite size/liquidity/institutional condition is strategy context/evidence, not safety invalidation. |
| MID_CAP_LIQUIDITY | <100億需 1.2x volume or liquidity exception | FAIL_FAST_REJECT | CONTEXT_ONLY | PRIMARY_ALPHA | OVERHARD_P1 | Size-conditioned liquidity proxy; not factual non-executability. |
| CHIP_CONCENTRATION_PRESENT | chipConcentration missing | FAIL_FAST_REJECT | CONFIDENCE_UNCERTAINTY | CONFIDENCE_UNCERTAINTY | ROLE_MAP_DEFECT_OVERHARD_P1 | The gate tests presence, not whether concentration is good/bad. Concentration value separately feeds institutionalScore. |
| FINANCIAL_SOURCE_COMPLETENESS | quarter/valuation/announcement source bundle incomplete | FAIL_FAST_REJECT | CONFIDENCE_UNCERTAINTY | CONFIDENCE_UNCERTAINTY | OVERHARD_P1_SHORT | Source completeness is confidence. SWING may require it as an input contract, but missing data is not negative Alpha. |
| ANNOUNCEMENT_RISK | 停止交易/重大損失/重整/退票/財報不實 | FAIL_FAST_REJECT | HARD_INVALIDATION | HARD_INVALIDATION | ALIGNED_HARD | Concrete severe official event risk is eligible for hard invalidation, subject to verified first-known/PIT semantics. |
| VALUATION_RELATIVE_RISK | PE > 2.5x sector median without >25% growth exception | FAIL_FAST_REJECT | CONTEXT_ONLY | PRIMARY_ALPHA | OVERHARD_P1 | Valuation is horizon/strategy dependent; current short-horizon use is context, not generic hard invalidation. |
| SECTOR_GATE | breadth<40 OR avgChange<-1 OR amountVs20d<0.5 | FAIL_FAST_REJECT | CONTEXT_ONLY | CONTEXT_ONLY | OVERHARD_P2 | Industry state is context by default. May become strategy-specific primary evidence only after incremental validation; never generic hard by existence alone. |
| AB_SETUP | neither A pullback nor B post-breakout | FAIL_FAST_REJECT | PRIMARY_ALPHA | PRIMARY_ALPHA | CORE_STRATEGY_ROLE_ALIGNED | This is the current A/B strategy identity. Failure means not a current A/B setup, not that the stock is globally invalid. |
| FUNDAMENTAL_COMPONENT_COUNT | financialDataCount < 3 | FAIL_FAST_REJECT | CONFIDENCE_UNCERTAINTY | CONFIDENCE_UNCERTAINTY | ROLE_MAP_DEFECT_OVERHARD_P1 | Count measures evidence completeness, not economic quality. |
| FUNDAMENTAL_QUALITY | fundamentalScore < 25 with count>=3 | FAIL_FAST_REJECT | SUPPORTIVE | PRIMARY_ALPHA | OVERHARD_P1_SHORT | Short-horizon strategy should test it as supportive; swing may validate it as primary. Not a universal hard gate. |
| ATR_QUALITY | ATR% <1 or >10 | FAIL_FAST_REJECT | CONTEXT_ONLY | CONTEXT_ONLY | OVERHARD_P2 | Volatility state is context/risk by default; strategy-specific primary role requires evidence. |
| TARGET_AVAILABLE | nearest verifiable resistance == null | FAIL_FAST_REJECT | CONFIDENCE_UNCERTAINTY | CONFIDENCE_UNCERTAINTY | HIGH_PRIORITY_SEMANTIC_REVIEW | This is risk-geometry availability, not negative Alpha. No nearby resistance may not mean the trade is bad; current algorithm instead rejects because RR cannot be computed. |
| REWARD_RISK | RR < 2 | FAIL_FAST_REJECT | PRIMARY_ALPHA | PRIMARY_ALPHA | PRIMARY_ROLE_HARDENED | Legitimate strategy-specific payoff filter, but semantically PRIMARY_ALPHA/risk geometry rather than safety hard invalidation. |
| FINAL_SIGNAL_GRADE | setupQuality < 65 (B) | FAIL_FAST_REJECT | PRIMARY_ALPHA | PRIMARY_ALPHA | CORE_PRIMARY_ROLE | Strategy quality threshold; not safety hard invalidation. |

## Outer safety layer

These are not ordinary stock-alpha votes and should remain separate from economic evidence:

| Safety state | Role | Rule |
|---|---|---|
| SOURCE_AUTHENTICITY | HARD_INVALIDATION | Verified source/PIT/replay failure may block. |
| SESSION_CONTINUITY | HARD_INVALIDATION | Session identity/continuity failure may block. |
| CORPORATE_ACTION_CONTINUITY | HARD_INVALIDATION | Unresolved corporate-action/reference continuity may block. |
| EXECUTION_FEASIBILITY | HARD_INVALIDATION | Only factual non-executability/orderability state is hard. |
| ACCOUNT_RISK | HARD_INVALIDATION | Explicit account/portfolio risk-authority breach may block. |

## Component ownership — do not double count

| Component | Current condition | Role | Rule |
|---|---|---|---|
| SECTOR_BREADTH | sector breadth >=40 | CONTEXT_ONLY | Component of SECTOR_GATE; not a separate vote. |
| SECTOR_RETURN | sector avgChange >=-1 | CONTEXT_ONLY | Component of SECTOR_GATE; not a separate vote. |
| SECTOR_AMOUNT | sector amountVs20d >=0.5 | CONTEXT_ONLY | Component of SECTOR_GATE; not a separate vote. |
| SETUP_A | A pullback checks | PRIMARY_ALPHA | Child of AB_SETUP; same setup family. |
| SETUP_B | B breakout/retest checks | PRIMARY_ALPHA | Child of AB_SETUP; same setup family. |

## A2 discrepancies versus the existing C5 Shadow role map

The existing Class-A C5 Shadow map is directionally useful but now has several role-definition defects when compared with the actual Worker semantics and the newer Hybrid Role Eligibility audit.

### D1 — RS_CONTEXT
C5 currently labels `RS_CONTEXT` as PRIMARY_ALPHA.

Actual Formal gate:
it only checks whether `marketReturn20` and `sectorReturn20` exist.

Therefore:
- **RS_CONTEXT gate = CONFIDENCE / UNCERTAINTY**;
- **derived RS value = candidate Alpha/ranking evidence**.

Availability and economic strength must not share one role.

### D2 — CHIP_CONCENTRATION_PRESENT
C5 currently maps it to SUPPORTIVE for SHORT and PRIMARY_ALPHA for SWING.

Actual gate:
it only checks that `chipConcentration` is not missing.

Therefore:
- presence gate = CONFIDENCE / UNCERTAINTY;
- concentration value may be SUPPORTIVE / PRIMARY_ALPHA after validation.

### D3 — FUNDAMENTAL_COMPONENT_COUNT
C5 maps the count as SUPPORTIVE/PRIMARY.

Actual gate:
`financialDataCount < 3` measures whether enough components exist.

Therefore:
- component count = CONFIDENCE / UNCERTAINTY;
- `FUNDAMENTAL_QUALITY` is the economic evidence family.

### D4 — DAILY_ABNORMALITY
C5 places this in COMMON_HARD.

Hybrid Role Eligibility now requires HARD execution states to be factual.

`abs(changePercent)>=9.8%` by itself does not prove:
- non-executability;
- limit lock;
- unresolved corporate action;
- account/risk-authority violation.

Therefore it should remain **research-review pending**, not be assumed a permanent Hard Invalidation solely because the current Formal path rejects it.

### D5 — LIQUIDITY
C5 places the current 20-day volume rule in COMMON_HARD.

The newer role governance says:
- execution/liquidity evidence = execution confidence/context;
- HARD only when the position is factually not executable under the frozen strategy contract.

The current average-volume threshold plus exception is a **proxy**, not direct proof of non-executability.

Do not change it yet; move it into matched Shadow counterfactual validation.

### D6 — SECTOR_GATE
C5 labels sector state PRIMARY_ALPHA.

The curriculum role overlay says D09 sector/rotation evidence may be Primary or Context depending on strategy, with no automatic Hard role.

Until incremental evidence is demonstrated, A2 freezes the conservative role as **CONTEXT_ONLY**, with a future strategy-specific PRIMARY_ALPHA path allowed.

### D7 — TARGET_AVAILABLE
Current C5 treats target availability with the primary setup family.

Actual semantics are mixed:
- a missing/unverified target is an uncertainty problem;
- a genuinely absent nearby resistance is not obviously negative evidence;
- current Formal rejects both because its RR contract cannot proceed.

This is a high-priority semantic/falsification target.

## Priority-A2 review order

### P1 — first overfilter Shadow candidates
These are the cleanest mismatch between current fail-fast behavior and the Hybrid role model:

1. `MARKET_CAP_FLOOR` economic threshold;
2. `SMALL_CAP_SPECIAL`;
3. `MID_CAP_LIQUIDITY`;
4. `CHIP_CONCENTRATION_PRESENT`;
5. `FINANCIAL_SOURCE_COMPLETENESS`;
6. `VALUATION_RELATIVE_RISK`;
7. `FUNDAMENTAL_COMPONENT_COUNT`;
8. `FUNDAMENTAL_QUALITY`.

This is consistent with the already frozen `C2_SHORT_ADMISSION_V0_1` direction:
slow fundamental / valuation / ownership evidence should not automatically reject a valid short-horizon technical thesis.

### P2 — second-stage role/threshold challenges
Do not alter these yet; collect complete matched-date denominators first:

1. `DAILY_ABNORMALITY`;
2. `LIQUIDITY`;
3. `SECTOR_GATE`;
4. `ATR_QUALITY`;
5. `TARGET_AVAILABLE`;
6. `REWARD_RISK`;
7. `FINAL_SIGNAL_GRADE`.

These may remain important strategy requirements, but they are not automatically true Hard Invalidation states.

### P3 — preserve strategy identity first
`AB_SETUP`, `SETUP_A`, `SETUP_B` remain PRIMARY_ALPHA definitions for the current A/B Formal baseline.

A stock failing A/B may still be:
- THESIS_VALID;
- WATCH_EARLY;
- suitable for a separately preregistered entry challenger.

But it is not a current Formal A/B candidate.

## Missing-data firewall

The following failures must not be interpreted as bearish/low-quality evidence:

- missing RS benchmark;
- missing market cap;
- missing chip concentration;
- incomplete financial / valuation / announcement provenance;
- insufficient fundamental component count;
- missing target / target-evaluation provenance.

Their semantic state is `UNKNOWN` / `CONFIDENCE_UNCERTAINTY`.

A strategy may require specific inputs before acting, but `UNKNOWN != FAIL` and `UNKNOWN != 0`.

## Ranking is not admission

Effective Formal comparator after the guarded patch chain:

1. `priorityScore`;
2. `rewardPerRisk`;
3. `marketConsensusScore`;
4. `setupQuality`;
5. `sectorFlow`;
6. `relativeStrength`.

`marketConsensus` is applied **only after a candidate already passes admission** and adds 0–7 points to `priorityScore`; it cannot rescue a rejected stock. Its role is SUPPORTIVE ranking evidence, not a gate.

## Duplicate influence found after admission

Several evidence families affect System1 more than once:

- **Setup**: AB admission + B-grade minimum + 28% PriorityScore + setupQuality tie-break.
- **Sector**: sector hard rejection + 14% PriorityScore + sectorFlow tie-break.
- **Fundamental**: completeness/count gates + quality gate + 14% PriorityScore.
- **RR**: RR>=2 admission + 14% PriorityScore + RR comparator.
- **Institutional/chip**: small-cap special condition + institutionalScore 16%; chip concentration also enters institutionalScore.
- **RS**: source-availability admission + 14% PriorityScore + relativeStrength tie-break.

This does not prove the weights are wrong.
It does mean C4 ranking/redundancy work must measure the **combined marginal influence**, not treat each appearance as independent evidence.

## 3+3 / Top6 classification

The two independent pools and max 3 per pool are **selection/quota policy**, not an Alpha evidence family and not a gate-role vote.

Current policy:
- general pool: 0–3;
- thousand-dollar pool: 0–3;
- no cross-pool slot transfer;
- total 0–6;
- empty slots are valid.

This audit does not propose changing 3+3/Top6.

## What this means for the low-BUY problem

The audit identifies a plausible structural mechanism:

**System1 currently serializes data completeness + slow factors + context + primary strategy evidence into one fail-fast chain before ranking.**

So a valid A/B price thesis can be eliminated before:
- its setup quality;
- RR;
- consensus;
- ranking;
- entry timing

ever get a chance to compete.

The strongest current hypothesis is therefore not "loosen everything".
It is:

**keep true safety/owner-policy constraints hard, preserve A/B as strategy identity, and prospectively test whether slow/context/confidence gates suppress valid SHORT opportunities without compensating downside benefit.**

## Formal boundary

This file is an A2 governance inventory only.

It does not:
- change any Worker gate;
- alter A/B definitions;
- change price/liquidity/sector/fundamental/RR thresholds;
- change PriorityScore;
- change 3+3/Top6;
- change allocation;
- change BUY/ADD/REDUCE/SELL;
- authorize C2_SHORT_ADMISSION;
- create a FORMAL_OPTIMIZATION_CANDIDATE.

Formal Core remains LOCKED.

## Exact next A2 continuation

1. Update the **research-only C5 role map** to separate data-presence gates from economic evidence roles; no Formal behavior change.
2. Use the first genuine complete C1/C2 prospective population to compute:
   - PASS/FAIL/UNKNOWN by gate;
   - failure overlap;
   - optional-only rejection count;
   - P1 slow-gate counterfactual eligibility;
   - false-acceptance and opportunity-cost outcomes once mature.
3. Do not use firstFailure counts as causal attribution.
4. Keep P1 and P2 experiments separate.
5. Only after prospective/OOS evidence may any reclassification become a Class-C Formal proposal.
