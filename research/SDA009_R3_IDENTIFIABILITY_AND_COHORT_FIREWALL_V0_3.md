# SDA-009 R3 Identifiability and Cohort Firewall V0.3

Status: RESEARCH_SEMANTICS_FROZEN / IDENTIFIABILITY_TIERS_FROZEN / SYSTEM1_MINIMAL_ATOMIC_DELTA_FROZEN / FORMAL_CORE_UNCHANGED

Owner room: 07｜產業與供應鏈研究室
Audit ticket: `SDA-009`
Observed main before write: `1beeedded38ba39a951277069c09c45654304657`
Date: 2026-10-06 Asia/Taipei

## 1. Why this addendum is required

The V0.2 contract correctly expanded SDA-009 from a simple score-circularity concern into:
- sector hard-gate circularity;
- conditional rank/seat circularity;
- capital-allocation spillover;
- bidirectional self-promotion / self-suppression;
- local contribution vs max-normalizer externality.

However a new failure mode appears if engineering measures only:
- Formal selected names;
- Formal qualified names;
- current sector-gate passers;
- bounded rejected samples;
- `basePassed=true` rows.

Those populations are not valid denominators for SDA-009 incidence.

The diagnostic population must be frozen before observing the self-effect outcome.

## 2. Required population layers

### Population P0 — immutable same-generation market population

Use the complete same-generation C1 parent population when available.

Purpose:
- preserve all normalized ordinary-stock rows in the same decision generation;
- retain history/source blocked rows as explicit UNKNOWN rather than silently dropping them;
- preserve exact symbol, pool and Formal state.

P0 is the denominator parent. It is not itself the SDA-009 causal cohort.

### Population P1 — SECTOR_GATE_REACHED

A row belongs to P1 only if the actual Formal fail-fast execution reached the sector gate.

Do NOT define P1 as:
- selected;
- qualified;
- basePassed;
- sector-gate PASS;
- sampled rejected-after-base.

Current production order places several `basePassed=true` failures before the sector gate, including financial/announcement/valuation failures. Therefore `basePassed=true` is not equivalent to "sector gate reached".

Frozen P1 rule:
- first failure is the sector gate itself; OR
- first failure is a later gate; OR
- row is Formal qualified/selected.

Rows whose first failure is earlier than sector gate are not decision-relevant to the current Formal sector gate, although their independent sector observer state may still be retained descriptively.

This reachability mapping must be versioned by `selectionRuleVersion`.

### Population P2 — LOO_MECHANICALLY_IDENTIFIABLE

Subset of P1 with enough same-generation atomic data and membership lineage to recompute the candidate-specific leave-one-out state.

Missing atoms remain BLOCKED/UNKNOWN; they never disappear.

### Population P3 — DECISION_RELEVANT_EX_SECTOR

Subset of P2 whose independent non-sector downstream gates are all observed PASS under the frozen same-generation observer.

Purpose:
distinguish a mechanical sector-gate flip from a flip that could actually change qualification if sector treatment alone changed.

A mechanical gate flip is not automatically a Formal opportunity-cost event.

### Population P4 — RANK_IDENTIFIABLE

Subset of P3 where the exact counterfactual ranking tuple can be reproduced under the same comparator version.

A gate flip without a reproducible counterfactual ranking tuple cannot be promoted to a rank or pool-seat flip.

### Population P5 — ALLOCATION_IDENTIFIABLE

Subset with an identifiable counterfactual selected union and exact allocation-policy version.

A score change alone is insufficient to claim capital impact when selection composition is unknown.

## 3. Existing C1 strengths

Current durable C1 design provides important building blocks:
- full immutable same-generation population;
- row industry label;
- price pool;
- projected feature changePercent and avgAmount20 when a feature row exists;
- inclusive sector breadth / avgChange / amountVs20DayAverage;
- actual Formal first-failure state;
- selected/qualified state;
- generationId;
- source-main/runtime lineage;
- full independent gate-overlap observer;
- existing sector-component audit over the complete C1 denominator.

This is enough to avoid selected-only denominator bias.

It is NOT enough for a full exact SDA-009 leave-one-out replay.

## 4. Exact current C1 atomic gap

Current C1 projection does not durably preserve, for every normalized market row:
- raw same-session `changePercent`;
- raw same-session `tradeValue`.

For feature-admitted rows, projected `feature.changePercent` exists.
For rows without a feature object, C1 keeps close/history state but not the raw changePercent used by the Formal sector denominator.

Current C1 sector projection stores only:
- breadth;
- avgChange;
- amountVs20DayAverage.

It does not store:
- stockCount;
- positiveCount;
- avgChange observed count;
- total sector amount;
- history-ready covered amount;
- summed 20-day average amount;
- max sector amount;
- sector score.

Therefore full LOO values must not be reverse-engineered from the current aggregate ratios.

## 5. Minimum safe C1 atomic extension

The shortest research-only delta is to preserve two already-in-memory current-session atoms on every C1 row:

- `currentChangePercent`;
- `currentTradeValue`.

No new market call is required.

Existing row fields already preserve:
- symbol;
- industry;
- pool.

Existing feature projection preserves, when available:
- historyDays;
- avgAmount20.

With the two added atoms, a same-generation research analyzer can reconstruct the current Formal sector aggregate from the full C1 parent:

For each industry:
- stockCount = all C1 rows in the industry;
- positiveCount = rows with currentChangePercent > 0 under current Formal semantics;
- breadth = positiveCount / stockCount;
- avgChange = mean finite currentChangePercent;
- totalAmount = sum currentTradeValue;
- history-ready set = rows with feature.historyDays >= 20;
- readyAvgAmount20 = sum feature.avgAmount20 over history-ready rows;
- coveredAmount = sum currentTradeValue over history-ready rows;
- amountVs20DayAverage = coveredAmount / readyAvgAmount20 when denominator > 0;
- maxAmount = max totalAmount across industries;
- sectorScore = current frozen formula.

Then candidate-specific LOO can be computed without changing Formal behavior.

## 6. Membership lineage minimum

Current row industry labels are sufficient to reproduce the runtime grouping only if the exact same-generation mapping is frozen.

Required generation-level lineage:
- `classificationSchemeId`;
- `membershipVersion`;
- `membershipDigest`.

Recommended minimal semantics:

`classificationSchemeId = SYSTEM1_RUNTIME_INDUSTRY_LABEL_V1`

`membershipDigest = SHA256(sorted(symbol + "|" + industry))`

`membershipVersion` may equal or reference that digest plus the decision date/generation.

This does not claim the labels are an official exchange taxonomy.
It only proves the exact grouping used by the runtime on that generation.

If source-level effective dates become available, preserve them as additional provenance. Do not fabricate historical effective dates from current labels.

## 7. Exact reconstruction parity gate

Before any candidate-level LOO is interpreted, the research analyzer must first reconstruct the inclusive production sector state from P0 atoms and compare it to the C1 stored inclusive sector state.

Required parity:
- breadth;
- avgChange;
- amountVs20DayAverage;
- sector score if captured or independently recomputable;
- hard-gate component states.

If reconstructed inclusive state does not match the frozen production-inclusive state within exact frozen rounding/tolerance semantics:
`REPLAY_TRUST = BLOCKED_PARITY_MISMATCH`.

No LOO result from that generation may be used.

This is essential because otherwise an analyzer bug can masquerade as self-contribution.

## 8. Counterfactual rank comparability firewall

Candidate-specific LOO recomputation may change the cross-sector max-amount normalizer.

That is correct for measuring the candidate's own full counterfactual.

However candidate A and candidate B can then be evaluated under different candidate-specific normalizers.

Therefore distinguish:

### Causal self-effect view
Each candidate uses its own fully recomputed LOO normalizer.
Permitted for:
- gate effect;
- sector-score delta;
- self-contribution attribution;
- allocation sensitivity when the exact challenger policy is frozen.

### Cross-candidate ranking view
Do not assume candidate-specific LOO scores are automatically on a common comparable scale.

A rank/seat challenger must explicitly freeze one of:
- a candidate-specific-debiased ranking policy with proven comparator semantics; or
- a common normalization reference independent of candidate identity.

Until that policy is frozen and machine-tested:
`RANK_IDENTIFIABILITY = UNKNOWN`
for cases where cross-candidate comparability depends on candidate-specific normalization.

This does not block gate-flip analysis.

## 9. Exact rounding and stable-order firewall

Formal ordering uses frozen runtime values after runtime rounding/provenance.

Research must not rank on higher-precision shadow values if Formal ranks on rounded values.

Required:
- exact comparatorVersion;
- exact rounded priorityScore used by Formal;
- exact rounded sectorFlow if that is the compared field;
- actual pre-sort ordinal / stable-order index;
- explicit tie state.

If every explicit comparator key ties, JavaScript stable sort can preserve prior insertion order.

Do not invent a symbol-code tie-breaker in research unless Formal used one.

A rank flip caused only by research precision or a new tie-breaker is invalid.

## 10. Gate-flip decision relevance

A candidate can mechanically flip the sector gate but still fail another independent downstream gate.

Required separate fields:
- `mechanicalGateFlip`;
- `sectorGateDirection`;
- `downstreamNonSectorState = PASS | FAIL | UNKNOWN`;
- `decisionRelevantGateFlip`.

Definition:
`decisionRelevantGateFlip=true`
only when the sector gate changes the candidate's eligibility and all required non-sector downstream gates are independently PASS under the same frozen generation.

If downstream state is UNKNOWN:
decision relevance is UNKNOWN.

## 11. Pool-seat counterfactual asymmetry

### Self-promotion case
Candidate passes inclusive sector gate but fails LOO sector gate.

If the candidate was Formal qualified:
- removal from its own pool is mechanically identifiable;
- lower-ranked qualified names can shift upward under the same frozen ranking facts if their own scores are unchanged.

### Self-suppression case
Candidate fails inclusive sector gate but passes LOO sector gate.

The candidate lacks an observed Formal qualified ranking tuple because production stopped at the sector gate.

Therefore its exact counterfactual pool rank may require additional research-only ranking primitives.

Do not assign it a rank by interpolation or by reusing a current selected-only tuple.

Until exact counterfactual ranking inputs exist:
- gate self-suppression may be proven;
- decision relevance may be proven if downstream non-sector gates pass;
- exact pool-seat gain remains UNKNOWN.

This asymmetry must stay visible in the receipt.

## 12. Allocation decomposition

If the counterfactual selected union is known, allocation effects must be decomposed into:

1. `PURE_SCORE_WEIGHT_EFFECT`
   - same selected set;
   - same deployRatio;
   - only priority weights change.

2. `SELECTION_COMPOSITION_EFFECT`
   - candidate enters/leaves or pool seat composition changes.

3. `DEPLOY_RATIO_REGIME_EFFECT`
   - total selected count crosses 0/1/2/3+ and deployRatio changes.

4. `POSITION_CAP_EFFECT`
   - 35% cap binds.

5. `NTD_FLOORING_EFFECT`
   - allocation is floored to NT$1,000 units.

One headline "allocation delta" without this decomposition can materially overstate the direct sector-score effect.

## 13. Missingness and common support

D16 common-support readback must report:
- P0 count;
- P1 sector-gate-reached count;
- P2 mechanically identifiable count;
- P3 decision-relevant-ex-sector count;
- P4 rank-identifiable count;
- P5 allocation-identifiable count;
- BLOCKED/UNKNOWN count by industry size;
- BLOCKED/UNKNOWN count by pool;
- BLOCKED/UNKNOWN count by self-promotion/self-suppression candidate direction where direction is knowable.

Complete-case results without these denominators are not accepted.

Missingness can be related to:
- small industries;
- history readiness;
- classification quality;
- source gaps.

Therefore dropping blocked rows can bias the measured circularity rate.

## 14. Current engineering consequence

The safest shortest System1 implementation is now:

1. reuse existing complete C1 same-generation parent;
2. extend the C1 research projection with only raw currentChangePercent and currentTradeValue;
3. freeze runtime membership digest/scheme identity;
4. implement SDA-009 as a pure research analyzer beside the existing C1 sector-component audit;
5. make zero new provider calls;
6. make zero Formal decision/rank/allocation mutations;
7. emit machine receipt into the existing daily C1 evidence artifact if storage budget permits.

Do not first modify the Formal selector to compute LOO inside the decision path unless the pure-C1 approach is proven insufficient.

## 15. Maturity decision

No D09 maturity promotion.

This addendum materially reduces implementation risk and closes a denominator/identifiability blind spot, but:
- System1 implementation is still pending;
- first genuine candidate-level SDA-009 receipt count is still 0;
- D16 economic evidence is absent.

## Exact next

`SDA-009-R3A1`: System1 verifies whether the two-atom C1 extension plus membership digest is sufficient to reconstruct inclusive sector state with exact parity.

`SDA-009-R3A2`: if parity passes, implement pure Class-A C1-side LOO analyzer and deterministic tests.

`SDA-009-R3B`: first genuine same-generation receipt is evaluated with:
- P0-P5 denominators;
- self-promotion/self-suppression;
- parity trust state;
- mechanical vs decision-relevant gate flips;
- pool-seat identifiability;
- allocation decomposition;
- blocked/UNKNOWN retention.

Then D16 performs common-support economic validation.
