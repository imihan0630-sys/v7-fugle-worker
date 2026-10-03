# System1 Zero-Pick Counterfactual Data Gap 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: ZERO_PICK_COMPARATOR_NOT_RECONSTRUCTABLE / DATA_GAP_FROZEN
Scope: System1 P1-A zero-pick dates
Formal Core impact: NONE

## Question

When current Formal selects zero names but P1-A Shadow contains F9_RANKABLE rows, can research reconstruct the exact current Formal 3+3 / Top6 counterfactual portfolio using already-captured evidence?

## Answer

**NO — not from the current live C1/C2 evidence contract.**

The current evidence is sufficient to say a rejected row has reached `F9_RANKABLE` under the P1-A semantic Shadow.

It is **not** sufficient to say which F9 rows would have occupied the current Formal pool slots.

## Effective Formal comparator

Current effective comparator lineage:
`PRIORITY_RR_CONSENSUS_SETUP_SECTOR_RS_7_5_30`

Ordered fields:
1. `postConsensusPriorityScore`
2. `rewardPerRisk`
3. `marketConsensusScore`
4. `setupQuality`
5. `sectorFlow`
6. `relativeStrength`

Pool policy:
- GENERAL max 3;
- THOUSAND max 3;
- no cross-pool slot transfer;
- total 0–6;
- empty slots are valid.

## What C1/C2 currently preserve

C1 V8.15.4 added:
- `priorityScore`;
- `priorityScoreProvenance = FORMAL_RUNTIME_RESULT_AT_C1_DECISION`.

C2 selectionContext carries:
- priorityScore + provenance;
- close / pool identity;
- depth/spread context;
- lateStage;
- ret20 / MA distance;
- channel;
- entry geometry.

This is useful evidence but **not the full Formal comparator tuple**.

## Missing zero-pick ranking fields

For formally rejected P1-A rows the live C1/C2 lineage does not preserve an authenticated same-decision tuple containing all of:

- `rewardPerRisk`;
- `marketConsensusScore`;
- `setupQuality`;
- `sectorFlow`;
- `relativeStrength`;
- `preSortOrdinal` or an equivalent final-tie lineage;
- explicit `rankComparatorVersion`;
- complete tuple provenance/fingerprint.

Some values may exist elsewhere in source features or be mathematically recomputable.

That is **not enough**.

Research is prohibited from rebuilding an old Formal-like rank using:
- today's comparator code;
- later source values;
- derived approximations;
- current market-consensus data;
- a partial tuple.

## Why the immutable parent does not solve this

The immutable decision-state parent contract correctly requires the complete six-field ranking tuple for **qualified** rows.

Its pure constructor deliberately returns no ranking tuple when `formalOk !== true`.

That is correct for preservation of actual Formal state.

But P1-A zero-pick challengers are precisely rows that were **not qualified under actual Formal**.

Therefore the existing qualified-row parent ranking cannot be repurposed as a counterfactual ranking for rejected challengers.

## Forbidden shortcuts

Until the data gap is closed, do not:

1. rank P1-A F9 rows by priorityScore alone;
2. average all P1-A F9 outcomes and compare them with cash 0%;
3. transfer unused GENERAL slots to THOUSAND or vice versa;
4. pretend all F9 rows would have been selected;
5. use selected-count expansion as economic evidence;
6. apply today's comparator to an older capture generation;
7. infer missing consensus / sector / RS tie-break fields from later data;
8. create a pseudo-portfolio with arbitrary equal weighting and call it a Formal challenger.

## Correct zero-pick state

A zero-pick date with P1-A F9 rows remains:

`FORMAL_COMPARATOR_EMPTY_ZERO_PICK_CONTRACT_REQUIRED`

and, at the control plane:

`ZERO_PICK_COMPARATOR_NOT_RECONSTRUCTABLE`.

Such a date:
- is retained in the denominator;
- is not treated as a negative day;
- is not excluded from coverage accounting;
- blocks positive P1-A economic readiness until a preregistered zero-pick comparator is available.

## Minimum future evidence needed

For every F9 row on the same decision clock, a future prospective capture must preserve:

- symbol;
- pool;
- captureGeneration;
- decisionAt;
- rankComparatorVersion;
- postConsensusPriorityScore;
- rewardPerRisk;
- marketConsensusScore;
- setupQuality;
- sectorFlow;
- relativeStrength;
- preSortOrdinal or deterministic final tie identity;
- tuple fingerprint;
- field-level source/provenance known no later than decisionAt.

The receipt must explicitly state:
`COUNTERFACTUAL_RANK_INPUT / RESEARCH_ONLY / NO_FORMAL_DECISION_IMPACT`.

It must not pretend that the rejected row had an actual Formal rank.

## Future zero-pick comparator

Once the complete tuple exists prospectively, the research comparator must:

1. use exactly the frozen comparator version attached to that receipt;
2. rank only P1-A F9 rows from that capture generation;
3. partition GENERAL and THOUSAND independently;
4. take max 3 per pool;
5. never cross-fill empty slots;
6. preserve deterministic tie semantics;
7. apply the same frozen allocation-policy family only after challenger selection is frozen;
8. compare the resulting quota-limited challenger portfolio with the preregistered zero-pick benchmark;
9. include costs / fill feasibility before economic promotion.

## Cash benchmark warning

Formal zero-pick implies undeployed capital under the Formal selection lane, but a challenger-vs-cash comparison is only meaningful **after the challenger portfolio itself has been reconstructed correctly**.

The correct order is:

`FULL_TUPLE -> 3+3_SELECTION -> ALLOCATION -> EXECUTION/COST -> OUTCOME`

not:

`ALL_F9_ROWS -> AVERAGE_RETURN -> CASH`.

## Implementation class

- Pure comparator prototype with synthetic complete tuples: **Class A allowed**.
- Extending live Worker/C1 capture or D1 persistence with new ranking fields: **Class B proposal-first**.
- Changing Formal admission/ranking/selection behavior: **Class C owner approval**.

## Current decision

- Zero-pick economic inference: BLOCKED.
- Existing P1-A outcome evaluator remains valid for dates with non-empty Formal admitted comparator cohorts.
- Zero-pick rows remain retained and fail closed.
- Formal Optimization Candidate: NONE.
- Formal Core remains LOCKED.
