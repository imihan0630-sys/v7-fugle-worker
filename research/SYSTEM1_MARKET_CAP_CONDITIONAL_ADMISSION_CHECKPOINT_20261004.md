# System 1 market-cap conditional admission audit V0.1

Date: 2026-10-04 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY_IMPLEMENTED / DAILY_COLLECTOR_WIRED / CI_GREEN_MERGED / FORMAL_CORE_LOCKED

## Purpose

Measure the structural incidence created by System 1's market-cap-conditioned liquidity/institutional admission rules without changing those rules.

Current Formal uses three distinct admission layers before later Alpha/ranking logic:
- baseline LIQUIDITY;
- SMALL_CAP_SPECIAL for 10 <= marketCapYi < 30;
- MID_CAP_LIQUIDITY for marketCapYi < 100.

These are not equivalent to factual non-executability and were classified by the A2 gate-role audit as over-hardened/context-sensitive research targets. This audit measures their prospective incidence only.

## Frozen Formal mechanics

Price-pool base liquidity:
- GENERAL close < 1000: minLots = 1000;
- THOUSAND close >= 1000: minLots = 300.

Low-volume exception requires:
- avgAmount20 >= NTD 50m;
- spreadPercent <= 0.5%;
- orderBookDepthGood=true OR depthScore>=80.

SMALL_CAP_SPECIAL:
- applies for 10 <= marketCapYi < 30;
- requires avgVolume20Lots >= 1.5 * pool minLots;
- and institutionalScore >= 70;
- marketCapYi >= 30 is PASS / not applicable.

MID_CAP_LIQUIDITY:
- applies below 100bn after the earlier size/liquidity context;
- requires avgVolume20Lots >= 1.2 * pool minLots;
- or the frozen low-volume liquidity exception;
- marketCapYi >= 100 is PASS / not applicable.

No threshold or formula is altered.

## Implementation

Pure Class-A analyzer:
`research/system1_market_cap_conditional_admission_v0_1.mjs`.

Inputs:
- immutable adapted C1 rows;
- same-generation gate-overlap diagnosis;
- existing `formal_gate_replay_v0_1.mjs` for one-gate structural replay.

No Formal gate is recomputed as a new authority. Gate PASS/FAIL/UNKNOWN comes from the existing observer. Raw same-request fields are used only to decompose the observed fail into frozen subconditions.

## Outputs

Per market-cap band:
- BELOW_10;
- 10-30;
- 30-100;
- 100+;
- UNKNOWN.

Per price pool:
- GENERAL;
- THOUSAND;
- UNKNOWN;
- BELOW_PRICE_FLOOR.

Each reports:
- LIQUIDITY PASS/FAIL/UNKNOWN;
- SMALL_CAP_SPECIAL PASS/FAIL/UNKNOWN;
- MID_CAP_LIQUIDITY PASS/FAIL/UNKNOWN;
- evaluable fail rates.

SMALL_CAP_SPECIAL fail decomposition:
- volume-only fail;
- institutional-only fail;
- volume + institutional fail;
- unknown component;
- inconsistent fail guard.

MID_CAP_LIQUIDITY reports:
- observed fail count;
- rows below 1.2x pool-min volume;
- exception-fail / exception-unknown counts.

## Single-gate replay

The existing one-gate replay is run for:
- SMALL_CAP_SPECIAL;
- MID_CAP_LIQUIDITY.

Outputs preserve:
- earlier observed fail;
- later observed fail;
- unresolved UNKNOWN / not-evaluable;
- all-other-observed-gates-clear.

`ALL_OTHER_OBSERVED_GATES_CLEAR` is **not** a recovered Formal candidate, selected stock, rank or trade.

Ranking, pool quotas, changed downstream geometry, transaction costs and outcomes are not replayed.

## Boundary windows

Two preregistered structural windows are frozen for incidence reporting only:

30bn boundary:
- lower: [24,30);
- upper: [30,36).

100bn boundary:
- lower: [80,100);
- upper: [100,120).

These are fixed +/-20% windows around the current thresholds.

They are not threshold sweeps and are not used to optimize 30/100.

Purpose:
observe whether gate incidence changes mechanically at the current applicability boundary.

A boundary jump is a structural fact, not proof of economic harm.

## Daily collection

The existing C1 evidence collector now appends:
`marketCapConditionalAdmission`.

No:
- new endpoint;
- new provider call;
- new scheduler;
- D1 schema;
- Worker runtime hook;
- Production deployment

is introduced.

## Interpretation guardrails

This audit does NOT prove:
- small/mid-cap gates should be removed;
- institutionalScore>=70 is too high;
- 1.5x or 1.2x volume is too strict;
- a stock failing these gates would otherwise be selected;
- more small-cap candidates are better;
- crossing 30bn/100bn creates economic mispricing.

Permitted prospective questions:
- how often each conditional gate actually blocks an evaluable row;
- which small-cap subcondition dominates observed failures;
- which later blockers remain after one gate is structurally cleared;
- whether gate burden is concentrated by cap band and price pool;
- whether future rejected cohorts show superior opportunity paths after execution/liquidity controls.

## Existing parents

- `shared-knowledge/SYSTEM1_A2_GATE_ROLE_INVENTORY_20261003_V0_1.md`
- `LIQUIDITY_ADMISSION_RESEARCH.md`
- `research/liquidity_gate_rejected_control_spec_v0_1.json`
- `research/formal_gate_evidence_persistence_feasibility_v0_1.json`
- `research/SYSTEM1_SHADOW_COHORT_MEMBERSHIP_IMPLEMENTATION_20261004.md`

## Formal boundary

No Formal market-cap threshold, liquidity threshold, exception, institutional threshold, A/B, RR, grade, score, comparator, quota, capital, BUY/ADD/REDUCE/SELL/STOP, 15m, push, order, Worker, D1, Production or System2 behavior changes.

`economicSuperiority=UNKNOWN`
`formalOptimizationCandidate=NONE`
Formal Core: LOCKED

## Exact next continuation

1. Merge only after exact-head Regression, Repair CI and isolated review are green.
2. Let the existing daily C1 evidence workflow emit the first genuine V8.17+ market-cap conditional-admission receipt.
3. Accumulate independent dates before claiming practical gate burden.
4. Join matched Shadow outcomes and execution-liquidity evidence only after sufficient prospective observations exist.
5. Only then may a threshold reformulation become a Class-C proposal requiring explicit owner approval.

## Merge acceptance

- PR #490 merged at `bc06f4ea7e1cf1eecf8b816d3695e4b581c24832`.
- Exact head `d7c402b7d7a5119b63cbefa8ac395ce25e2a4304`:
  - V8 Regression Tests run `37181306065` PASS;
  - V8 Repair CI run `37181306087` PASS;
  - System1 C1 C2 isolated offline repair review run `37181306189` PASS.
- No Worker/runtime/D1/Production/Formal/System2 behavior change or Cloudflare deployment was introduced.
- The next required evidence is prospective and will be emitted by the existing daily C1 evidence workflow on genuine trading sessions.
