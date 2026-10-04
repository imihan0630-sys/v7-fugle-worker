# System 1 C4 saturation carryover audit V0.1

Date: 2026-10-04 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY_IMPLEMENTED / DAILY_COLLECTOR_WIRED / CI_GREEN_MERGED / FORMAL_CORE_LOCKED

## Purpose

Measure whether a factor regains ranking influence through the deployed lexicographic comparator after its contribution inside PriorityScore has already saturated.

This is narrower than generic factor redundancy. It asks whether "score saturation" actually ends that factor's decision influence.

## Frozen structural cases

### Reward/Risk

Current mechanics:
- hard gate: RR >= 2;
- PriorityScore component: clamp(RR * 20, 0, 100) * 14%;
- additive component saturates at RR >= 5;
- raw rewardPerRisk remains the second deployed comparator.

Carryover definition:
two same-pool Formal-qualified rows have the same deployed PriorityScore, both RR components are already saturated at 100, and raw rewardPerRisk differs.

In that case the additive score can no longer distinguish them but the raw RR comparator can.

### Market-relative RS

Current mechanics:
- PriorityScore component: clamp(50 + RS * 2, 0, 100) * 14%;
- additive component saturates at RS >= +25% and <= -25%;
- raw relativeStrength remains the last deployed comparator.

Carryover definition:
two same-pool Formal-qualified rows share all earlier deployed comparator fields, are on the same RS saturation side, and their deployed raw relativeStrength values differ.

### Market Consensus

Current mechanics:
- additive bonus = min(7,(sourceCount-1)*2) for sourceCount >= 2;
- bonus saturates at +7 from sourceCount >= 5;
- consensusScore is 95 at sourceCount=5 and 100 at sourceCount>=6;
- marketConsensusScore remains the third deployed comparator.

Carryover definition:
two same-pool Formal-qualified rows share PriorityScore and raw RR, both have saturated +7 bonus, but consensusScore differs.

## Implementation

Pure analyzer:
`research/system1_c4_saturation_carryover_v0_1.mjs`.

The analyzer reuses the already validated C4 ranking-redundancy receipt contract and verifies:
- RR score-component mapping;
- RS score-component mapping;
- consensus sourceCount -> bonus mapping;
- consensus sourceCount -> consensusScore mapping;
- deployed one-decimal RS rounding.

It never reconstructs missing data or repairs old generations.

## Outputs

RR:
- saturated row count;
- selected saturated row count;
- same-pool / same-PriorityScore saturated pair count;
- raw-RR differentiated pair count.

RS:
- high/low saturated row counts;
- selected saturated row count;
- pairs tied through every earlier comparator;
- raw-RS differentiated pair count.

Consensus:
- saturated row count;
- sourceCount=5 versus sourceCount>=6 counts;
- pairs tied on PriorityScore + RR;
- consensusScore differentiated pair count;
- post-consensus PriorityScore=100 count;
- count where consensus bonus itself caused the 100-point cap.

For GENERAL and THOUSAND cutlines, the audit explicitly marks whether the actual Top3 boundary was decided by:
- RR saturation carryover;
- RS saturation carryover;
- consensus saturation carryover.

## Daily collection

The existing:
`research/system1_c4_ranking_collection_v0_1.mjs`

now appends:
`saturationCarryover`

to the same verified C4 evidence object.

No new endpoint, provider request, scheduler, D1 table, Worker hook or Production deployment is added.

## Interpretation guardrails

This audit does NOT prove:
- a saturated factor should be removed;
- a later comparator is harmful;
- the saturation threshold is economically optimal;
- a zero carryover count means the factor has no alpha.

Permitted interpretation:
- non-zero carryover proves that score saturation does not fully end decision influence;
- repeated prospective carryover quantifies practical materiality;
- near-zero carryover across independent dates can support a claim of practical comparator immateriality, but not economic inferiority.

Outcome superiority remains UNKNOWN until independent prospective dates, costs, path risk, regime controls, date clustering and purged/OOS evidence mature.

## Existing structural parents

- `research/rr_priority_structural_falsification_v0_1.json`
- `research/sector_rs_priority_structural_falsification_v0_1.json`
- `research/market_consensus_priority_structural_falsification_v0_1.json`
- `research/SYSTEM1_C4_RANKING_REDUNDANCY_CHECKPOINT_20261004.md`

## Formal boundary

No Formal gate, A/B definition, threshold, PriorityScore weight, comparator order, 3+3/Top6, capital, BUY/ADD/REDUCE/SELL/STOP, 15m, push, order, Worker, D1, Production or System2 behavior changes.

`economicSuperiority=UNKNOWN`
`formalOptimizationCandidate=NONE`
Formal Core: LOCKED

## Exact next continuation

1. Merge only after exact-head Regression, Repair CI and isolated review are green.
2. Let the existing daily C1 evidence path emit the first genuine V8.17+ saturation carryover receipt.
3. Accumulate independent dates before making practical-materiality claims.
4. Join forward outcomes only after sufficient prospective observations exist.
5. Any proposal to remove a tie-break, change saturation, change score weights or change comparator order is Class-C and requires explicit owner approval.

## Merge acceptance

- PR #479 merged at `20caae8df3348914ecd03bc3f90ab763b44dcf10`.
- Exact head `1a692d52035fa71caf35edb49d00608f02c8e603`:
  - V8 Regression Tests run `37180318539` PASS;
  - V8 Repair CI run `37180318493` PASS;
  - System1 C1 C2 isolated offline repair review run `37180318470` PASS.
- No Worker/runtime/D1/Production/Formal/System2 behavior change or Cloudflare deployment was introduced.
- The next required evidence is prospective: let the existing daily C1/C4 workflow collect genuine trading-session observations before any Class-C proposal.
