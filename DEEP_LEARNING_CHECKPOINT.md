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

## Candidate handoff
- None newly promoted by this checkpoint initialization.

## Exact next continuation point
1. Read the latest Formal research checkpoint and avoid duplicating any completed R01-R08 / I01-I07 work.
2. Start with the highest-value unresolved external-learning question that has potential incremental information beyond current factors.
3. Prefer evidence directly applicable to Taiwan equities; if using foreign-market evidence, explicitly test transferability limits.
4. For every positive hypothesis, actively search for counter-evidence and failure regimes.
5. Write the durable result and exact next point back here before the run ends.
