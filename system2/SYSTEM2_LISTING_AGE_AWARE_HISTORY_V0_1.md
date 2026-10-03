# System 2 Listing-Age-Aware PIT History V0.1

Updated: 2026-10-03 Asia/Taipei  
Status: REPOSITORY IMPLEMENTATION / PHYSICAL ACCEPTANCE PENDING  
Scope: S2-07 prospective daily history-readiness semantics  
System 1 / V8 impact: NONE

## Problem

The prior S2-07 history gate required every current ordinary equity to have 60 prior PIT-eligible daily bars. That is correct for mature listings but structurally impossible for a newly listed stock with fewer than 60 trading sessions.

Lowering the whole-market threshold (for example to 95%) is not acceptable because it would hide genuine missing history.

## Official listing metadata

Prospective daily diagnostics now observe current company-basic data from:
- TWSE/MOPS listed-company basic CSV: `t187ap03_L.csv`, using `上市日期`;
- MOPS/TPEx OTC-company basic CSV: `t187ap03_O.csv`, using `上櫃日期`.

Only ordinary four-digit symbols are retained. The metadata is observation-time research context and does not create a survivorship-safe historical replay universe.

## Per-symbol expected history

The default requirement remains 60 prior sessions.

Age adjustment is allowed only when:
1. current listing metadata is READY;
2. an official trading-date sequence covering at least 60 prior sessions is READY;
3. the symbol has an official listing date inside that sequence.

Then:
- a mature listing still requires 60;
- a newer listing requires every official prior trading session from listing date through the session before the current market date;
- a same-day new listing has zero prior sessions by definition, but its technical factors remain UNKNOWN until sufficient bars accumulate;
- unknown listing date remains strict-60;
- unavailable listing metadata or trading calendar remains strict-60.

For an age-limited symbol, count alone is insufficient: stored history must also match the expected first and last trading dates. Revision ambiguity still blocks.

## Continuity remains separate

This change does **not** promote `continuity_state`.

Even when age-aware raw-history coverage is complete:
- continuity may remain `UNVERIFIED`;
- the daily preflight remains blocked until every required session is continuity-certified under an independently validated corporate-action/adjustment contract;
- factor observations that lack sufficient lookback remain UNKNOWN.

## Authority boundaries

This V0.1:
- does not lower whole-market history quality;
- does not define strategy thresholds or weights;
- does not produce ranking, capacity, zero-pick or SELECTED decisions;
- does not enable capture, push, capital or orders;
- does not alter Daily Resonance Baseline/Challenger;
- does not modify System 1/V8.

Physical acceptance requires a real daily diagnostic to prove the official company-basic sources, current row counts, metadata hash and official trading-date context. Synthetic tests do not count as physical evidence.
