# Shadow Semantic Membership Repair Spec v0.1

Updated: 2026-09-27 Asia/Taipei
Status: RESEARCH_ONLY / FORMAL_CORE_LOCKED / NO_RUNTIME_CHANGE

## SR-001 — objective
Repair research estimands before interpreting Selection Alpha or gate opportunity cost. Sampling must never determine semantic membership.

## SR-002 — immutable semantic classification layer
For every PIT feature row in a scan, derive membership before bounded sampling: FORMAL_SELECTED, FORMAL_QUALIFIED_NOT_SELECTED, DOWNSTREAM_FIRST_FAILURE, BASE_FIRST_FAILURE, CHANNEL_NEAR_MISS, DATA_READINESS_FAILURE, UNIVERSE_POLICY_EXCLUDED, BROAD_MARKET_FRAME_ELIGIBLE, UNKNOWN_SEMANTIC_STATE.

Membership is multi-label where estimands require overlap. A single primary cohort string is not sufficient evidence.

## SR-003 — two control estimands must remain separate
A. BROAD_MARKET_CONTROL: deterministic sample from a frozen broad frame, independent of focal cohort caps; overlap with focal semantic membership is allowed and explicitly recorded.

B. RESIDUAL_CONTROL: deterministic sample only after complete semantic classification; excludes every focal semantic population, not merely sampled rows.

Never publish a hybrid as either estimand.

## SR-004 — denominators before samples
Per scanDate/pool persist semanticPopulationCount by membership, broadFrameCount, residualFrameCount, unknownSemanticCount, sampledCount by cohort, sampleCap and deterministic sampling rule/version.

If full semantic classification is incomplete, denominator state is UNKNOWN and opportunity-cost inference is blocked.

## SR-005 — first-failure is not marginal contribution
Fail-fast exclusion reason is preserved as firstFailureUnderFormalOrder. It must never be renamed as unique cause or gate contribution.

Future marginal-gate research requires frozen same-scan inputs and explicit one-gate-at-a-time counterfactual replay. Removing a gate may expose later failures; therefore accepted-set delta and next-failure transition must both be recorded.

## SR-006 — NEAR_MISS repair
Do not use missingCount alone as distance. Future semantic receipt should preserve failed A/B check IDs, continuous distance to each threshold where defined, channel eligibility context and pre-truncation pool counts.

The current global top-12 truncation cannot certify channel/pool prevalence.

## SR-007 — price-pool quota linkage
For 3+3 quota research, the relevant population is the complete Formal-qualified list within each price pool before the 3-seat cut. A bounded QUALIFIED_NOT_SELECTED sample is insufficient for complete rank denominators.

The same semantic repair should therefore support a pool-integrity receipt: qualifiedCount, selectedCount, complete observed pool ranks, comparatorVersion, selectedFlag and exact tie lineage/preSortOrdinal.

## SR-008 — promotion firewall
Until a versioned repaired receipt accumulates: Selected vs BROAD_CONTROL = DESCRIPTIVE_ONLY; Near-miss vs BROAD_CONTROL = DESCRIPTIVE_ONLY; rejected-gate opportunity cost = DESCRIPTIVE_ONLY unless reason denominator is certified; 3+3 displacement = BOUNDED_CUTLINE_ONLY unless complete pool integrity is certified.

No Formal optimization may be promoted from contaminated/ambiguous cohorts.

## SR-009 — engineering classification
A pure post-feature, pre-outcome classifier that reuses in-memory feature/result objects, makes zero new market calls, writes only additive research storage and has no Formal read dependency can qualify as Class A.

If implementation requires changing shared scan control flow, replacing current persistence semantics, or adding a Formal/runtime dependency, classify Class B proposal-first.

No implementation is authorized by this spec.
