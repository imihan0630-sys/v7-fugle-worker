# D03 Technical Indicator — shared-parent feasibility and falsification v0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_BLIND / CLASS_B_DEPENDENCY_BLOCKED
Formal Core: LOCKED

## Scope and evidence
Continuation of TI-379..390. Reconciles `TECHNICAL_INDICATOR_CHECKPOINT.md`, `research/TECHNICAL_INDICATOR_CLASS_B_IMPACT_AUDIT_V0_1.md`, `SHADOW_COHORT_SEMANTICS_CLASS_B_PROPOSAL.md`, and `research/technical_indicator_snapshot_contract_v0_1.json`. No live D1 query, historical outcome join, external quote call, runtime mutation or cost measurement was made.

Cloudflare primary documentation checked on 2026-09-28:
- D1 limits: https://developers.cloudflare.com/d1/platform/limits/ — a D1 database processes queries serially; query duration affects throughput; Worker CPU/memory limits apply.
- D1 API: https://developers.cloudflare.com/d1/worker-api/d1-database/ — batch statements are sequential; failure rolls back the batch, but this does not prove a full multi-batch generation atomic.
- D1 pricing/metrics: https://developers.cloudflare.com/d1/platform/pricing/ and https://developers.cloudflare.com/d1/observability/metrics-analytics/ — `rows_read`, `rows_written`, duration and batch-time metrics can measure actual impact; index maintenance contributes writes. Documentation does not establish this project's plan, baseline usage, future cost, or real latency.

## TI-391 — Historical parent reference is not future parent scope
Current legacy sampled archive has a theoretical <=54 rows/date, but the proposed immutable decision-state receipt is created BEFORE sampling. If it preserves all source-valid per-symbol states, the attempt count could approach the full same-scan feature universe (~1,800+ in prior internal audit); the exact denominator is UNFROZEN and may be smaller or larger by source/date. Consequently 54 is not a capacity planning number.

A hypothetical 1,800 attempts/date means ~1,800 Technical child statuses/date plus one run receipt; 20 sessions would be ~36,000 attempts, before index write amplification. This is scenario arithmetic, NOT measured production usage, plan allowance, or expected bill.

The current legacy counterfactual reader LIMIT 5000 is already structurally incompatible with such full-parent research: 5,000/1,800 supports only two complete illustrative dates with a partial third. At <=54/date the same cap would cover at most 92 complete illustrative dates plus part of one. Different sort orders across parent and external evidence can split different symbol keysets. The future reader needs complete date/generation keyset paging and explicit truncation/expected-count proof, not a larger LIMIT.

## TI-392 — The parent keyset must not vary by indicator
Freeze one immutable decision-state keyset after Formal decision persistence, with captureGeneration, first-known timestamp, scanDate, symbol, full Formal state and versioned semantic fingerprint. Technical, Pattern, Target/RR and external evidence should reference that SAME keyset. One symbol may belong to multiple research cohorts, but its Technical child must not be duplicated because of cohort membership.

The earlier `technical_indicator_snapshot_contract_v0_1.json` says “reuse existing Shadow parent” using scanDate+symbol+parentSnapshotHash. That contract is a pre-immutable design artifact. It must not be read as authorization to attach promotion-grade Technical evidence to the mutable legacy `trade_research_shadow_candidates`. A successor contract will have to preserve its PIT/formula/quality guards and replace parent identity with a shared immutable decision receipt + generation. Do not rewrite the historical contract to imply the future parent already exists.

## TI-393 — Completeness is distinct from formula validity
Expected attempts = the frozen, enumerated parent keyset covered by the preregistered research population, not selected plans only, not observed child successes, and not the broad-control sample. For every expected parent, a child attempt/status must distinguish READY, WARMUP_INCOMPLETE, DATA_BLOCKED, VALID_BUT_CONSTRAINED, and UNKNOWN as applicable; no missing child can silently mean “indicator absent”.

A run receipt needs at least parentKeysetHash, expectedAttemptCount, persistedAttemptCount, counts by reason/status, formulaBundleVersion, source/continuity version, asOf/availableAt, run state COMPLETE/INCOMPLETE/QA_FAIL, and captureGeneration. Only COMPLETE with exact keyset reconciliation can enter descriptive coverage; outcome inference still needs PIT/replay/prefix and prospective OOS gates. Per-symbol duplicate or orphan child is a conflict. An interrupted batch must not erase an earlier complete generation; multi-batch partial rows remain INCOMPLETE and may not be joined as a complete day.

Falsification fixture A: 1,800 expected parents, 1,799 child attempts, all 1,799 valid => INCOMPLETE, not 99.94% promotion-ready.
Fixture B: 1,800 expected, 1,800 children of which 200 WARMUP/UNKNOWN => persistence COMPLETE but only 1,600 potentially interpretable; no coercion to bad signal.
Fixture C: identical symbol/date under two cohort memberships => one parent and one Technical child, two membership edges.
Fixture D: same date rerun with changed source/continuity fingerprint => new generation or provenance conflict, never silent overwrite.
Fixture E: request spans a partial third date at row cap => reader marks PARTIAL_DATE and blocks inference, even if returned rows all look valid.

## TI-394 — Source reuse and cost are conditional
One-time formula arithmetic can reuse same-scan loaded history only when its provenance and the production TECHNICAL_CONTINUITY receipt satisfy the formula contract. The raw ~65-bar cache does not certify recursive RSI/ADX state or corporate-action continuity; a deeper bootstrap/rebuild may require additional history or canonical state. `ZERO_EXTRA_PROVIDER_CALLS` is a conditional hypothesis, not a demonstrated production fact.

Future bounded measurement must separate (1) formula-only steady state, (2) first bootstrap/rebuild, (3) corporate-action/source correction rebuild, (4) D1 reads/writes including indexes, and (5) Worker wall/CPU/memory and Formal latency. A generic child row holding many indicators reduces parent duplication but not necessarily index writes or large payload/serialization. Cloudflare documents query metrics but the actual project budget and current D1 baseline are UNKNOWN.

Counterexample: use a cached recursive state that is O(1) per bar, then correct an older dividend event. Without invalidation/replay, fast results can be wrong; speed alone is not evidence quality.

## TI-395 — Experiment population is tied to the intended change
KD vs RSI and MACD vs direct trend may be descriptive among valid captured parents, but selected-plan-only coverage cannot establish incremental selection/ranking value for excluded or qualified-not-selected names. An admission-gate claim needs a gate-evaluable denominator; a ranking claim needs the full qualified pool and exact post-consensus comparator; an execution claim needs complete trigger/no-trigger provenance. No inherited “FULL_FORMAL_SCAN” label may stand in for full universe. Outcomes must join the same immutable parent generation after prospective coverage is complete.

Positive mechanism: a shared immutable keyset and explicit attempt receipts would permit controlled indicator-vs-price tests without survivorship from only successful formula rows.
Negative test: if residual KD/RSI or MACD trend value vanishes with direct-price controls, or only exists in a selected-only cohort, reject the additive indicator score rather than tune thresholds.
No directional profitability, coverage improvement, or Alpha is claimed from this design audit.

## Decision / exact next continuation
- Technical-specific D1 observer implementation remains CLASS_B_PROPOSAL_PREMATURE.
- First reconcile future full decision-state parent scope, generic evidence-child payload/keys and completeness reader with the shared cohort owners; do not invent a second D03 parent.
- Obtain actual same-scan parent counts and non-secret D1/Worker baseline metrics by a permitted read-only path before numeric latency/cost claims.
- Production continuity and symbol-session/price-limit provenance remain independent blockers.
- Then design outcome-blind, isolated synthetic keyset/retry/read fixtures for the above scenarios, with no Worker wiring.
- Preserve TI-005 KD-vs-RSI -> TI-006 MACD-vs-direct-trend as the empirical inference order once prospective evidence is ready.
- No historical Shadow reconstruction, threshold sweep, Formal optimization candidate, Formal change, merge or deploy.
