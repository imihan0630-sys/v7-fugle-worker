# System 2 Limited Shadow Preregistry V0.1

Updated: 2026-09-27 Asia/Taipei
Status: PREREGISTERED / RESEARCH-ONLY / NOT SCHEDULED / NOT DEPLOYED

## Purpose

Freeze the first source-honest Limited Shadow（有限影子模擬） execution contracts before outcome data is used.

This file does not replace the original strategy hypotheses in `SYSTEM2_STRATEGY_PREREGISTRY.md`.
It narrows them to what current source contracts can support without inventing missing evidence.

No System 1/V8 behavior changes.

## Common rules

1. No numeric strategy weights, floors, caps or optimized thresholds are frozen in this version.
2. StrategyValidity（策略有效性） and EntryReadiness（進場準備度） are separate.
3. Missing REQUIRED（必要） evidence => INCOMPLETE（資料不足） + BLOCKED（阻擋）.
4. HARD_INVALIDATION（硬失效） => INVALIDATED（策略失效） + BLOCKED.
5. Valid thesis + TOO_EXTENDED（過度延伸） remains WATCH（觀察）, not REJECTED.
6. Valid contradictory evidence may become CONFLICT（證據衝突） rather than forced BUY/SELL.
7. Rank and totalScore remain NULL in V0.1.
8. INCOMPLETE / WATCH / REJECTED records must be frozen, not only SELECTED records.
9. No historical backfill from current snapshots.
10. Outcomes never rewrite the frozen decision.

---

## S2-SM-LS-001 — SHORT_MOMENTUM Limited Shadow

Parent hypothesis:
`S2-SM-001 — SHORT_MOMENTUM_V0`

Contract:
`SHORT_MOMENTUM V0.1-CONTRACT`

Mode:
`LIMITED_PROSPECTIVE_SHADOW（有限前瞻影子模擬）`

### Required source families for a non-INCOMPLETE evaluation

- TECHNICAL_STRUCTURE（技術結構）:
  basic daily trend/levels/extension from current-safe OHLCV-derived fields.
- PRICE_VOLUME（價量）:
  current daily relative-volume / response / pullback-breakout context.
- RISK_FRICTION（風險／交易摩擦）:
  liquidity, extension and reward/risk inputs available under the frozen setup.

### Explicitly incomplete / non-imputed context

- TPEx / small-cap regime where unavailable;
- prospective breadth and sector-rotation gaps;
- sameSlotRVOL（同時段相對量） and cumulativeVolumePace（累積成交量進度） until clean baselines exist;
- advanced named-pattern lifecycle where corporate-action / pivot semantics are not ready;
- global/macro context without canonical source.

These remain UNKNOWN and cannot be replaced with a convenient proxy.

### Primary outcome horizons

D+1 / D+3 / D+5 / D+10;
MFE（最大有利幅度） / MAE（最大不利幅度）;
selected -> triggered conversion;
zero-pick / incomplete-day rate;
source-gap rate.

### Falsification

Downgrade/reshape if:
- opportunity quality is not better than simple relative-strength + volume baselines;
- apparent benefit is date/sector/regime clustered;
- richer technical indicators add no incremental value;
- costs/slippage remove the edge;
- incomplete/source-gap handling materially changes conclusions.

---

## S2-SG-LS-001 — SWING_GROWTH Limited Shadow

Parent hypothesis:
`S2-SG-001 — SWING_GROWTH_V0`

Contract:
`SWING_GROWTH V0.1-CONTRACT`

Mode:
`LIMITED_PROSPECTIVE_SHADOW（有限前瞻影子模擬）`

### Required source families for a non-INCOMPLETE evaluation

- FUNDAMENTAL_QUALITY（基本面品質）:
  only data actually published and captured by the decision timestamp.
- INDUSTRY_THESIS（產業投資邏輯）:
  only a prospectively frozen industry/company-transmission assessment with explicit provenance.

If either required family cannot honestly be marked KNOWN, the evaluation remains INCOMPLETE.

### Supportive fields may remain UNKNOWN

- analyst expectations / earnings revisions;
- forward PE / PEG;
- precise event surprise;
- richer historical valuation percentiles;
- historical TDCC trends without frozen vintages.

Unknown supportive evidence does not become a zero score.

### Primary outcome horizons

D+5 / D+10 / D+20;
later D+40 / D+60 after sufficient elapsed time;
MFE / MAE;
thesis-valid -> entry-triggered conversion;
incomplete/source-gap rate;
industry/date concentration.

### Falsification

Downgrade/reshape if:
- results reduce to generic momentum;
- growth acceleration adds no value after valuation/industry controls;
- outcome depends on hindsight-biased financial availability;
- cycle peaks dominate apparent growth winners;
- source gaps select only easy-to-measure industries.

---

## Not activated in Limited Shadow V0.1

### INDUSTRY_TREND（產業趨勢）
Not activated because full core identity requires industry-specific supply/demand/inventory/capacity/pricing and company transmission that are not yet canonically source-ready.

### EVENT_DRIVEN（事件驅動）
Not activated because full strategy requires reliable firstKnownAt / availableAt and event-transmission semantics.

### VALUE_REVERSION（價值回歸）
Research-only source-limited contract exists, but it is not included in the first two-strategy Limited Shadow launch. Historical valuation/repair-catalyst gaps remain material.

### INSTITUTIONAL_ACCUMULATION（法人累積）
Basic source feasibility is good, but identity remains OWNER REVIEW PENDING; do not activate before owner approval.

### FUNDAMENTAL_GROWTH（基本面成長）
Identity remains OWNER REVIEW PENDING; do not activate before owner approval.

### BLACK_HORSE_ACCUMULATION（黑馬潛伏）
Distinctness from Institutional Accumulation is not proven.

## Capture boundary

The code contract and tests may be completed research-only now.

Always-on prospective accumulation is NOT active until an isolated System 2 persistence + scheduled capture path exists.
Preferred architecture remains a separate System 2 D1/database binding.

Do not attach this Shadow recorder to V8 production storage/runtime without Class B review.

## Promotion rule

Limited Shadow evidence can falsify or refine these versions.
It cannot automatically promote a strategy to live recommendations.

Any new numeric eligibility threshold, weight, floor, cap, ranking formula or live-notification behavior creates a new version and requires the applicable owner/governance approval.
