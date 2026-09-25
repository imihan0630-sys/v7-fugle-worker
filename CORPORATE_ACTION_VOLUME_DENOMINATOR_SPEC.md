# Corporate Action Volume Denominator Semantics

Updated: 2026-09-25
Scope: Research/Shadow only.
Formal Core: LOCKED / unchanged.

## 1. Problem

The prior research prototype uses one broad field, `technicalVolumeReady` / `volumeContinuityComplete`, for several different questions.

That is too coarse.

A corporate action can affect volume semantics in at least two fundamentally different ways:

1. UNIT_SCALE — the share unit itself changes (for example par-value conversion or capital reduction).
2. SUPPLY_CHANGE — the share unit is unchanged, but the number of shares available/listed changes.

These cases must not share one transformation rule.

## 2. Volume semantic spaces

### RAW_SHARE_VOLUME

Definition:
actual executed share count printed by the market.

Properties:
- no denominator;
- preserves factual execution volume;
- remains dimensionally comparable across a pure SUPPLY_CHANGE because one share before and after the event is still one share;
- must NOT be mechanically multiplied/divided merely because new shares are listed;
- UNIT_SCALE events are different and may require an explicit unit conversion for cross-window continuity research.

Required readiness:
- raw bar provenance;
- stable/known volume unit;
- no unresolved unit conversion.

### ISSUED_SHARE_TURNOVER

Definition:
executed share volume / point-in-time issued or listed shares.

Purpose:
normalizes trading activity for a changing share base.

Minimum denominator contract:
- symbol;
- effective date/time;
- issued/listed shares valid for that market session;
- direct official share count; do not derive an exact denominator only from a nominal stock-dividend/rights ratio;
- firstKnownAt / source provenance;
- correction/supersession history.

TPEx public statistics explicitly state that turnover rate is calculated by issued shares.
This supports issued shares as a defensible minimum denominator for a supply-normalized turnover metric.

### FREE_FLOAT_TURNOVER

Definition:
executed share volume / point-in-time free-float shares.

Purpose:
measures trading intensity relative to investable float.

This is a different research question.
Free float is used by index methodologies, but it is NOT the minimum denominator required merely to normalize for a newly listed share supply.

Use only when:
- a point-in-time free-float definition is frozen;
- ownership/lock-up treatment is reproducible;
- source timing is available.

## 3. Required readiness split

Replace the overloaded interpretation with explicit research fields:

- `shareUnitComparable`;
- `rawShareVolumeReady`;
- `issuedShareTurnoverReady`;
- `freeFloatTurnoverReady`;
- `supplyBreakPresent`;
- `supplyBreakEffectiveDate`;
- `denominatorKnownAt`;
- `denominatorSource`;
- `unknownReasons`.

Do not interpret `issuedShareTurnoverReady=false` as meaning raw executed volume is invalid.

## 4. SUPPLY_CHANGE rule

For a pure supply change with no share-unit conversion:

RAW_SHARE_VOLUME:
- preserve every historical raw volume print;
- set `supplyBreakPresent=true`;
- no automatic volume rescaling.

ISSUED_SHARE_TURNOVER:
- require point-in-time issued/listed-share denominator on both sides of the break;
- if missing, remain UNKNOWN.

FREE_FLOAT_TURNOVER:
- require point-in-time free-float denominator;
- if missing, remain UNKNOWN.

## 5. UNIT_SCALE rule

For a share-unit conversion:
- raw execution prints remain factual in RAW_EXECUTION_SPACE;
- cross-event share-count continuity requires the verified share-unit factor;
- turnover normalization separately requires the applicable point-in-time denominator.

Do not reuse a SUPPLY_CHANGE rule for UNIT_SCALE or vice versa.

## 6. 8454 real-window evidence

Artifact:
`research/corporate_action_8454_full_window_v0_1.json`.

2025 stock-dividend lifecycle:
- ex-right price event: 2025-08-21;
- new shares listed: 2025-10-09;
- nominal stock distribution ratio: 5% / 50 new shares per 1,000 old shares;
- new shares actually issued: 12,617,870;
- official pre-increase issued shares: 252,357,405;
- official post-registration issued shares: 264,975,275;
- actual aggregate share-base increase: about 4.9999999009%.

The official counts are important: blindly back-solving 12,617,870 / 5% gives 252,357,400 old shares, five shares short of the company's official pre-increase count. Fractional-share handling/rounding makes the nominal distribution ratio unsuitable as an exact denominator source.

At 2025-10-09:
- raw `volumeTodayVsPrev5` = 0.825379;
- official-issued-share-turnover-normalized analogue = 0.786075;
- the roughly 5% share-base increase changes the ratio by about -4.76% relative to the raw ratio;
- this specific witness does NOT flip the A/B volume condition.

Counterexample / boundary sensitivity:
- if a raw ratio were 1.32, dividing by 1.05 gives about 1.257; a 1.30 breakout-volume threshold would flip;
- if a raw ratio were 1.08, dividing by 1.05 gives about 1.029; a 1.05 low-volume threshold could flip.

These boundary examples prove semantic sensitivity, not predictive value.

## 7. Formal implication

Current Formal A/B uses raw share-volume ratios such as:
- today volume vs prior 5-day average;
- prior-5 vs prior-20 volume.

Therefore a pure SUPPLY_CHANGE does not make those arithmetic quantities undefined.
It creates a semantic break that must be tagged, and any turnover-normalized interpretation requires a denominator.

No Formal behavior is changed here.
Before any future promotion, owner review must decide whether Formal intends:
A. raw executed share activity;
B. issued-share turnover;
C. free-float turnover;
or separate features for each.

Until then, the safest interpretation of the PR #101 field `volumeContinuityComplete=false` at SUPPLY_CHANGE is:
NORMALIZED_VOLUME_CONTINUITY_NOT_PROVEN,
not
RAW_EXECUTED_VOLUME_INVALID.

## 8. Governance

Research-only.
No Worker.js change.
No A/B threshold change.
No ranking/eligibility change.
No production merge/deploy authorization.
No alpha claim.
