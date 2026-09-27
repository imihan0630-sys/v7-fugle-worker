# System 2 Candidate Lifecycle Contract V0.1

Updated: 2026-09-27 Asia/Taipei
Status: OWNER-APPROVED CORE / RESEARCH-ONLY / TRANSITION THRESHOLDS NOT FROZEN

## Purpose

Make the owner-approved persistent candidate/watch lifecycle auditable without inventing new strategy thresholds.

The global pool persists across trading days.
A candidate is not recreated from zero every evening.

## Core states

- DISCOVERED（發現）
- WATCH（觀察）
- CANDIDATE（候選）
- ACTIVE_INTRADAY_MONITOR（盤中主動監控）
- ENTRY_ZONE（進場區）
- TRIGGER_READY（觸發準備）
- SIM_FILLED（模擬成交）
- POSITION_MONITOR（持股監控）
- THESIS_WEAKENING（投資邏輯轉弱）
- INVALIDATED（失效）
- EXPIRED（到期）
- REMOVED（移出候選池）

POSITION_MONITOR is outside candidate/entry-monitor capacity.

## Daily revalidation rules

1. Every existing pool member is revalidated after market close.
2. Strategy memberships are revalidated separately.
3. Remove only the failed strategy membership if another strategy membership remains valid.
4. Retain the symbol globally while at least one membership still has meaningful observation value.
5. TOO_EXTENDED（過度延伸） is not itself bearish and must not automatically remove a valid thesis.
6. WAIT（等待） is not itself invalidation.
7. UNKNOWN（未知） is not bearish; source failure must not become a fake thesis failure.
8. A material validated negative event can invalidate a membership intraday.
9. Every removal/retention/transition freezes reason codes and evidence references.
10. A filled simulated position moves to POSITION_MONITOR and no longer consumes candidate/active-entry capacity.

## Candidate Episode（候選事件段）

Each continuous stay in the candidate/watch lifecycle has a unique candidateEpisodeId.

If a symbol is removed and later qualifies again:
- create a new candidateEpisodeId;
- do not reopen or overwrite the old episode;
- preserve the old removal reason and post-removal outcomes.

This prevents hindsight rewriting and allows measurement of re-entry quality.

## Membership-aware removal

A symbol can have memberships such as:
- SHORT_MOMENTUM valid;
- SWING_GROWTH weakening;
- EVENT_DRIVEN invalidated.

The symbol remains in the global pool if the surviving membership still has observation value.

Global removal occurs only when:
- no strategy membership survives;
- or the symbol becomes globally ineligible for a validated reason such as untradable/invalid universe state.

## Removal reason families

Examples only; exact thresholds remain strategy-specific:
- THESIS_INVALIDATED;
- MATERIAL_ADVERSE_EVENT;
- STRUCTURE_INVALIDATED;
- INDUSTRY_THESIS_INVALIDATED;
- FUNDAMENTAL_DETERIORATION;
- SOURCE_NOT_RELIABLY_EVALUABLE;
- GLOBAL_UNIVERSE_INELIGIBLE;
- STRATEGY_EXPIRED;
- MANUAL_DATA_CORRECTION.

SOURCE_NOT_RELIABLY_EVALUABLE should normally produce INCOMPLETE/WATCH handling before removal unless continued monitoring itself is no longer auditable.

## Re-entry

Re-entry after REMOVED / INVALIDATED / EXPIRED is allowed only through a new qualified decision and a new candidate episode.

Do not infer "same thesis restored" merely because price recovers.

## Churn control

V0.1 retention policy:
- a valid incumbent is not displaced solely because a new name has a superficially higher unvalidated rank;
- vacancies are filled first;
- replacement/displacement of still-valid incumbents remains a ranking research question.

This intentionally reduces rank-12/rank-13 churn until prospective evidence supports a better displacement rule.

## Post-removal outcomes

For every removed candidate episode, retain outcome tracking at least:
- D+1;
- D+3;
- D+5;
- D+10;
- MFE（最大有利幅度）;
- MAE（最大不利幅度）.

Purpose:
measure whether removals are too early, whether invalidations protect downside, and whether stale candidates occupy capacity too long.

## Transition validity

Allowed conceptual path:
DISCOVERED -> WATCH/CANDIDATE
-> ACTIVE_INTRADAY_MONITOR
-> ENTRY_ZONE / TRIGGER_READY
-> SIM_FILLED
-> POSITION_MONITOR

Any pre-fill state may transition to:
THESIS_WEAKENING -> WATCH / REMOVED / INVALIDATED
or directly INVALIDATED / EXPIRED / REMOVED when justified.

SIM_FILLED must not transition back into candidate capacity without closing/moving through position lifecycle semantics.

## Current decision

Lifecycle persistence / membership-aware retention / new episode on re-entry / position-monitor separation:
OWNER-APPROVED.

Exact factor thresholds that cause a strategy-specific transition:
NOT FROZEN / strategy-versioned research.
