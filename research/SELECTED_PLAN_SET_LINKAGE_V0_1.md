# Selected Plan Set Linkage Contract V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / PLAN_LINKAGE_FROZEN / NO_RUNTIME_CHANGE
Formal Core: LOCKED

## Purpose

Bind the final Selected parent set to the actual Formal plans produced by the same scan invocation.

A parent can correctly say SELECTED while a downstream plan/journal persistence bug still:
- omits a symbol;
- substitutes a symbol;
- mutates plan geometry;
- loses strategy-pool identity.

selectedPlanSetHash detects this class of mismatch.

## TI-513 — Future selected plan semantic payload

Minimum semantic fields:

- symbol;
- planDate;
- strategy;
- strategyPool;
- signalLevel;
- formalClose;
- buyLow;
- buyHigh;
- breakout;
- maxChase;
- stop;
- sellBelow;
- reduceAt;
- profitCheck;
- priorityScore;
- rewardRisk;
- allocationRatio;
- totalAllocation;
- firstShares;
- secondShares;
- totalShares;
- selectedReason.

Display name is not required in the semantic hash.

## TI-514 — strategyPool is required

Current Formal selected plans use strategyPool values FORMAL_GENERAL / FORMAL_THOUSAND under the separate 3+3 pool logic.

Current production plan construction explicitly writes strategyPool="FORMAL_GENERAL" or "FORMAL_THOUSAND". Legacy v8_trade_journal_plans still does not expose strategyPool as a dedicated top-level column; it may only survive inside plan_json after later versions.

Therefore future immutable selected-plan evidence must preserve strategyPool explicitly.

Do not infer it later from price or current rules.

## TI-515 — Per-plan fingerprint and plan-set hash

For each normalized selected plan:
planFingerprint = SHA-256 canonical hash in SELECTED_PLAN domain.

selectedPlanSetHash:
canonical sorted array of:
- symbol;
- planFingerprint

hashed in SELECTED_PLAN_SET domain.

Properties:
- input list order does not matter;
- plan semantic change changes set hash;
- substituted selected symbol changes set hash;
- duplicate selected symbol is invalid.

## TI-516 — Selected parents and selected plans must match exactly

Selected parent symbol set
must equal
selected plan symbol set.

Count equality alone is insufficient.

Mismatch:
generation cannot claim selected-plan linkage certification.

## TI-517 — Current Production is only a partial witness

Current recordTradeJournalDay:
- writes one same-invocation recorded_at timestamp;
- writes selected plan rows;
- verifies selected_count equals plan row count.

But it also:
- DELETEs/reinserts plan rows by scan_date;
- has no captureGeneration;
- has no immutable selectedPlanSetHash;
- does not expose strategyPool as a dedicated plan column.

Therefore current journal cannot be upgraded retroactively into immutable generation-linked plan evidence.

It remains useful operational evidence only.

## TI-518 — Future implementation order

In one live Formal invocation:

1. actual selected plans exist in memory;
2. normalize/fingerprint them before mutable journal translation;
3. compute selectedPlanSetHash;
4. freeze parent selected set;
5. require exact selected-parent/plan symbol match;
6. persist immutable plan evidence or generation-linked durable plan reference;
7. generation receipt may include selectedPlanSetHash.

Research observers remain downstream and cannot change the plan set.

## Current status

SELECTED_PLAN_HASH_SEMANTICS = FROZEN_V0_1
SELECTED_PARENT_PLAN_EXACT_LINK = REQUIRED
CURRENT_JOURNAL_IMMUTABILITY = INSUFFICIENT
RUNTIME_GENERATION_PLAN_LINK = NOT_IMPLEMENTED
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.


## Strategy-pool literal correction — TI-520

Repository revalidation found the exact deployed selected-plan literals are:

- FORMAL_GENERAL;
- FORMAL_THOUSAND.

The earlier research draft used shorthand GENERAL / THOUSAND.

That shorthand is rejected for selected-plan semantic hashing.

Reason:
semantic hashes must preserve the exact production meaning, not a research nickname.

The parent price-pool concept may still use its own separately versioned vocabulary.
Do not silently equate a parent pool label with the selected-plan strategyPool field.

This correction occurred before any runtime persistence implementation.
