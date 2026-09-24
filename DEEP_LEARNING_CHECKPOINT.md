# Deep Learning Checkpoint

Updated: 2026-09-24 Asia/Taipei

> Canonical durable cursor for the scheduled 台股深度學習 workflow and any manual ChatGPT thread continuing that work.
> Do not restart from scratch. Read this file first, then continue from `Exact next continuation point`.

## Purpose
- Continuously learn external knowledge relevant to Taiwan stock selection and trading decisions.
- Search for new academic research, Taiwan-market evidence, market microstructure evidence, falsification, and genuinely independent variables.
- New knowledge is research-only first. It must not directly modify Formal Core（正式核心）.

## Continuity rules
- Every deep-learning run must begin by reading this file plus the latest `RESEARCH_CHECKPOINT.md`, `RESEARCH_WORKLIST.md`, and `RESEARCH_ENGINEERING_GOVERNANCE.md`.
- GitHub durable state overrides chat memory.
- Never repeat completed topics merely because the chat/thread changed.
- Before writing, re-read this file and confirm its latest blob SHA. If another run updated it, merge the newer progress rather than overwriting it.
- Every run with substantive progress must write back:
  1. topic/question studied,
  2. new evidence and source/provenance,
  3. supporting evidence,
  4. counter-evidence / alternative explanations,
  5. bias / overfit / redundancy checks,
  6. whether the finding is redundant, rejected, still uncertain, or worth Shadow Research（影子研究）,
  7. exact next continuation point.
- Missing evidence is UNKNOWN（未知）, never BAD（不佳） or zero.
- Do not fabricate historical Shadow（影子） samples.
- Do not alter Formal Core（正式核心）, live monitoring, capital, entry/exit, ranking, push rules, or production behavior without the owner-approved governance path.

## Learning lanes
1. Momentum persistence（動能持續性）
2. Successful vs false breakout（成功突破與假突破）
3. Selection Alpha（選股超額） vs Execution Alpha（執行超額）
4. Sector / supply-chain persistence（產業／供應鏈持續性）
5. Residual RS（殘差相對強弱）
6. Intraday vs overnight return（盤中與隔夜報酬）
7. Market regime transition（市場狀態轉換）
8. Quiet Strength（低關注強勢） vs Attention Strength（高關注強勢）
9. Revenue / fundamental persistence（營收／基本面持續性）
10. Institutional / short-flow evidence（法人／放空資金證據）
11. Overheat / remaining-upside control（過熱／剩餘空間控制）
12. New independent variables not already represented in the system（系統尚未涵蓋的獨立變數）

## Handoff rule
- If a finding becomes a credible optimization candidate, record it under `Candidate handoff` with:
  - mechanism,
  - current system weakness it may address,
  - expected benefit,
  - failure modes,
  - validation design,
  - engineering class,
  - relation/redundancy to existing factors.
- A candidate is not a production change. Formal promotion still requires the existing research governance and owner approval.

## Current retained state
- Existing Formal research remains governed by `RESEARCH_CHECKPOINT.md`; this file does not replace it.
- Current high-interest optimization directions already identified:
  - breakout quality / false-breakout filtering,
  - Residual RS（殘差相對強弱） + sector persistence（產業持續性）,
  - Quiet Accumulation（安靜吸籌） / Smart Money（聰明資金） forming consensus,
  - overheat penalty（過熱懲罰） + remaining upside（剩餘上漲空間）.
- Hybrid WATCH（混合觀察） already implements part of early-consensus logic; new learning must test incremental value rather than re-labeling the same information.

## DL-001 — Information Discreteness（資訊離散度）／Gradual Price Path（漸進價格路徑）
Run date: 2026-09-24 Asia/Taipei

### Question
Does the *path* by which a stock accumulates gains contain incremental selection value beyond total return, breakout quality, volume, overheat, and current Quiet/Attention research?

### Evidence
1. Lin, Ko, Chen & Chu, Pacific-Basin Finance Journal (2016), "Information discreteness, price limits and earnings momentum": direct Taiwan-market evidence from 1989-2014. Earnings momentum was stronger when information arrived more continuously and attracted less attention; price-limit events behaved as attention-grabbing discrete information.
2. Huang, Lee, Song & Xiang, Journal of Financial Economics (2022), "A frog in every pan": continuous information from economically linked lead firms produced stronger delayed response than discrete information, extending the mechanism to customer/supplier and other lead-lag settings.
3. Galvani, Finance Research Letters (2024), "Frog in the Pan and the market-state effect on momentum": counter-evidence/conditioning result. The information-discreteness relation appeared in UP markets, not DOWN markets.
4. Lin et al., Pacific-Basin Finance Journal (2016), "Market dynamics and momentum in the Taiwan stock market": Taiwan conventional momentum can disappear because of frequent market transitions; positive momentum was conditional on continuing market states.
5. Ho et al., Pacific-Basin Finance Journal (2023), "Momentum investing and a tale of intraday and overnight returns: Evidence from Taiwan": past intraday and overnight components contain different predictive information, supporting the broader idea that return path/composition matters, not only cumulative return.

### Comparison with current system
- Existing research already stores ret5/10/20/60, positiveDayRatio20, maxDrawdown20Pct, gapPct, breakoutDistancePct, dailyClosePosition, upper-shadow ratio, volume expansion/contraction, breakout-quality score, overheat penalty, Residual RS（殘差相對強弱）, and Quiet/Attention diagnostics.
- No durable explicit Information Discreteness（資訊離散度）, jump-concentration, or gradual-return-path feature was found in the current research layer.
- Therefore this is not obviously identical to an existing factor, but it may correlate with positiveDayRatio20, maxDrawdown20Pct, volatility, gap, and Quiet Strength（低關注強勢）. Incremental-value testing is mandatory.

### Positive mechanism
- A stock that reaches the same 20-day return through many small same-direction moves may reflect persistent underreaction and incomplete information absorption.
- This could help distinguish "early persistent strength" from one-day attention spikes, potentially improving early selection and reducing late chasing.

### Counter-evidence / failure modes
- The 2024 evidence indicates the effect may vanish in DOWN（下跌） market states.
- Taiwan momentum itself is regime-sensitive; frequent regime transitions can erase the premium.
- Price limits, large gaps, earnings announcements, or one-day large institutional flows may make a discrete jump informative rather than harmful.
- A gradual path may simply proxy low volatility, trend smoothness, low drawdown, or Quiet Strength（低關注強勢） already captured by current features.
- Adding a new score without incremental testing risks Factor Zoo（因子動物園） and Overfitting（過度擬合）.

### Candidate status
WORTH_SHADOW_RESEARCH（值得影子研究）, not eligible for Formal Core（正式核心） change.

### Candidate handoff
- Mechanism: measure whether past return accumulated gradually/continuously versus through a few large jumps.
- Current weakness addressed: current selection knows total return, breakout quality and overheat, but does not explicitly distinguish *how* the return path was formed.
- Expected benefit: earlier identification of persistent underreaction; possible reduction of attention-spike / late-chase candidates.
- Primary risk: redundancy with existing path-quality and low-volatility variables; regime dependence.
- Validation design: research-only feature(s), pre-registered before outcome inspection; compare D5/D10/D20, MFE/MAE, stop-first, coverage and zero-pick impact. Test within BULL_BROAD（廣泛多頭） / MIXED（混合） / BEAR_BROAD（廣泛空頭） separately. Require incremental partial-correlation / same-date comparisons against positiveDayRatio20, volatility20, maxDrawdown20Pct, breakoutQualityResearch and Quiet/Attention classification.
- Engineering class: Class A（A級，僅研究／影子） if stored only in research snapshot and diagnostics with decisionImpact=false. Any use in Formal ranking/threshold becomes Class C（C級，正式核心） and requires owner approval.

## Candidate handoff
- DL-001: Information Discreteness（資訊離散度）／Gradual Price Path（漸進價格路徑） — WORTH_SHADOW_RESEARCH（值得影子研究）; owner approval should be requested before turning it into an optimization experiment that could later influence selection.

## Exact next continuation point
1. Do not repeat the literature search above unless materially new evidence appears.
2. If owner approves DL-001 research-layer implementation, define the smallest pre-registered Information Discreteness（資訊離散度） / jump-concentration feature without tuning thresholds to outcomes; implement research-only, then test redundancy and regime interaction.
3. Independently continue the next highest-value external-learning question after DL-001, preferably one not already represented by Residual RS（殘差相對強弱）, Quiet/Attention, breakout quality, or overheat.
4. Keep Formal Core（正式核心） unchanged unless later mature evidence passes governance and owner explicitly approves.
