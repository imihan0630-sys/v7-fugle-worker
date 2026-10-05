# Stock Selection Audit Engineering Routing 2026-10-05 V0.1

Status: ACTIVE_ROUTING
Owner: 00｜研究總控室
Formal Core impact: NONE
Source queue: `shared-knowledge/STOCK_SELECTION_AUDIT_QUEUE.md`
Critical reconciliation: `shared-knowledge/STOCK_SELECTION_AUDIT_CRITICAL_RECONCILIATION_20261005_V0_1.md`

## Routing rule

This file routes only missing engineering deltas. It does not restart completed research and does not authorize production behavior changes.

Repository engineering mode recommendation:
- substantial implementation / tests / cross-file work: Codex, GPT-6 Astra, High;
- governance/readback/triage: Chat, GPT-5.6 Sol, High.

## System 1｜選股邏輯／正式系統

### S1-SDA-A — SDA-001 factor lineage / dedup Shadow diagnostics
Implement as isolated Class A where possible:
- factorId / factorVersion;
- informationRoot;
- representationFamily;
- featureLineageId;
- parentFeatureIds;
- redundancyGroupId;
- independenceStatus;
- effectiveIndependentEvidenceCount;
- rawScore vs dedupedShadowScore;
- raw Top6 vs dedup Shadow Top6 diagnostic.

Required invariants:
- Formal A/B eligibility unchanged;
- Formal ranking/Top6 unchanged;
- capital/entry/exit/notification unchanged;
- missing lineage => UNKNOWN, never independent by default.

Any use of dedupedShadowScore in Formal ranking is Class C and requires explicit owner approval.

### S1-SDA-B — SDA-004 machine alias / parameter-family guard
Implement research/shadow registry/tests:
- exact alias families such as same-horizon retN/ROC/Momentum-index/log-return;
- deterministic/monotonic representation aliases;
- parameterFamilyId / experimentVersion;
- duplicate factor registration cannot inflate effective evidence count;
- adding cosmetic transform cannot change de-duplicated evidence.

No Formal weighting change.

### S1-SDA-C — SDA-009 D09 self-contribution diagnostic
After Room07 freezes exact leave-one-out semantics:
- compute industry/sector strength with candidate included and excluded;
- preserve membershipVersion/universeVersion;
- report candidateSelfContribution;
- compare formal rank/Top6 to leave-one-out Shadow diagnostic only.

Do not replace the Formal sector measure without owner approval.

### S1-SDA-D — SDA-016 generic experiment holdout-use guard
Coordinate with D16 semantics:
- immutable experimentId/version;
- targetId/targetHash;
- benchmarkId/benchmarkHash;
- holdoutId;
- holdoutUseCount / firstInspectedAt;
- outcomeLock;
- consumedAsDevelopmentData when repeatedly inspected;
- reject silent target/benchmark mutation under same experiment version.

This is research infrastructure; do not alter Formal selection.

## System 2｜建置總控室

### S2-SDA-A — SDA-001 / SDA-004 resonance lineage
For EMA16 / EMA64 / Impulse MACD and other resonance components:
- preserve visual three-condition semantics;
- additionally expose shared PRICE_OHLC ancestry;
- report raw condition count vs effective independent evidence count;
- no claim that three visual conditions equal three independent Alpha families.

No strategy-weight/gate change without owner approval.

### S2-SDA-B — SDA-016 holdout / experiment-consumption guard
Reuse one canonical experiment/holdout contract with System 1 where practical rather than creating a second incompatible governance schema.

### S2-SDA-C — SDA-017 executable immutable Regime observer/builder
Respect existing System 2 lane governance and D18 preregistration:
- build only preregistered observable state semantics;
- decision-time/finalized immutable regimeState receipt;
- complete source/universe/history provenance;
- support/episode/UNKNOWN diagnostics;
- unsupported state => UNKNOWN/ABSTAIN in research policy evaluation;
- no retrospective historical regime stream inferred from specification alone;
- no automatic live strategy weighting/gating.

If shared runtime/schema risk is introduced, classify as Class B and stop before production merge/deploy pending owner approval.

## Learning-room dependencies before engineering completion

- 01/02/03: preserve/finalize D01-D03 representation-family and residual semantics for SDA-001.
- 03: owns D03 alias/parameter-family semantic contract for SDA-004.
- 07: must freeze the D09 leave-one-out/self-contribution semantic contract before S1-SDA-C can be considered semantically complete.
- 11: owns generic holdout consumption semantics for SDA-016 and exact Regime support/episode semantics for SDA-017.
- 00: independent closure readback for SDA-016 and SDA-017.

## Acceptance

A build room must return:
1. exact files changed;
2. classification A/B/C;
3. tests;
4. protected-output comparison;
5. queue ticket(s) addressed;
6. remaining blocker;
7. exact next action.

No ticket becomes CLOSED merely because code merged.


## Launch/safety HIGH engineering routing

Canonical reconciliation:
`shared-knowledge/STOCK_SELECTION_AUDIT_HIGH_RECONCILIATION_20261005_V0_1.md`.

### System 1 additions
- **SDA-003**: reuse D02 existing intent firewall; integrate D02 proxy/value lineage with SDA-001. Do not create a new intent score. Primary remaining debt is prospective residual validation, not more semantics.
- **SDA-007**: add shared institutional/passive primitive lineage and one-receipt-many-consumers diagnostics; preserve intent/motive as UNKNOWN unless independently identified. Do not let D06 flow + D11 rebalance event + D20 herding become three votes from one primitive.
- **SDA-005**: expose shared breakout episode / D04 volatility-context lineage in Shadow diagnostics. Existing H20 semantics are authoritative; do not reimplement separate breakout identity.
- **SDA-006**: execution/capacity surfaces must preserve ACTUAL vs MODELED, filled/unfilled/cancel/reject denominators, and UNKNOWN queue/own-impact. Quote/depth cannot become executable fill evidence.
- **SDA-011**: implement or converge on canonical eventId/newsClusterId/firstKnownAt/availableAt and cross-source duplicate-story diagnostics. Mechanical corporate-action adjustments must remain distinct from economic-event Alpha.
- **SDA-014**: preserve parent decision + intended quantity + child fill/cancel/reject lineage; prospective broker-confirmed receipts are the gate. Do not renormalize evaluation onto filled shares only.
- **SDA-015**: add immutable portfolioDecisionId/riskInputVersion/covarianceVersion where applicable to research/shadow sizing studies; preserve selection-vs-sizing attribution and actual-vs-planned lifecycle distinction.

### System 2 additions
- **SDA-003**: if D02 price-volume context is consumed by any strategy/resonance layer, preserve PROXY_ONLY / INTENT_UNIDENTIFIED and SDA-001 lineage.
- **SDA-007**: institutional/passive context must reuse canonical primitive receipts and not infer motive.
- **SDA-005**: volatility context must share canonical market-state/raw primitives and breakout episode lineage rather than becoming a second taxonomy/vote.
- **SDA-006**: capacity persistence must retain numerator/denominator provenance and partial/missing coverage semantics; displayed depth is not fillability.
- **SDA-011**: any news/event propagation consumer must use canonical event/story identity and first-known clocks once available.

### Engineering acceptance for these HIGH tickets
- semantic controls already credited in the HIGH reconciliation MUST NOT be rebuilt merely to claim progress;
- remaining work should be implemented as Class A Shadow/diagnostic where possible;
- shared schema/runtime changes remain Class B;
- any Formal scoring/ranking/Top6/sizing behavior change remains Class C and requires explicit owner approval.


## Remaining HIGH engineering routing

Reconciliation:
`shared-knowledge/STOCK_SELECTION_AUDIT_REMAINING_HIGH_RECONCILIATION_20261005_V0_1.md`.

### System 1
- **SDA-002**: reuse D01 causal root/episode semantics; ensure future-pivot/episode lineage and no later-outcome eligibility leakage in Shadow/replay consumers.
- **SDA-008**: converge financial/valuation consumers on sourceVintage/knownAt/universeVersion/denominator-eligibility; no current-universe historical backfill.
- **SDA-010**: do not implement canonical D10 graph scope beyond approved semantics before H10/COV-06 owner decisions. When approved, use versioned effective-dated exposureGraphId and shared producer/consumer receipts.
- **SDA-012**: derivatives consumers must preserve parentChainId/contractVersion/rollVersion and same-parent residual semantics; protected H04/H11/COV-07 gates remain untouched.
- **SDA-013**: macro consumers should converge on macroReceiptId/sourceVintage/releaseClock/exposure lineage; Regime consumes the same primitive instead of receiving another independent vote.
- **SDA-018**: D19 enters only as Challenger research; factor lineage, PIT universe, turnover/cost and baseline-spanning diagnostics required before any promotion review.
- **SDA-019**: no behavioral factor may receive an independent vote without behavior-specific observable lineage and residual evidence beyond D03/D06/D17.

### System 2
- **SDA-002**: any pattern/price-structure observer must respect D01 causal clocks and episode identity.
- **SDA-010**: event/strategy propagation consumers must use one versioned structural exposure primitive after protected owner gates are resolved.
- **SDA-012**: futures/options context must preserve contract/expiry/roll provenance and same-parent dedup.
- **SDA-013**: macro inputs to Regime require first-known release clocks/vintages and cannot become a second Regime vote.
- **SDA-019**: behavioral/social context remains UNIDENTIFIED unless a behavior-specific source/clock exists; shared PTT/social primitives may not multiply votes.

### Protected dependencies
The following are not implicitly approved by this routing:
- H04;
- H10;
- H11;
- COV-06;
- COV-07 canonical intake/new-module action.

Engineering must stop at the existing governance boundary whenever these owner decisions are required.


## 2026-10-06 accepted-remediation delta routing

Do not redo accepted work. Use these latest-main contracts as the producer authority for the next engineering delta.

### System 1
- SDA-001 / SDA-004: PR #608 core Class-A implementation is accepted. Only add the D03-reviewed diagnostic schema deltas: explicit `redundancyGroupContributions`, explicit `dominantInformationRoots`, and stable overlap identities using factorId + factorVersion. Preserve decisionImpact=false and Formal isolation. First genuine-session receipt remains required.
- SDA-009: consume `research/sda009_d09_leave_one_out_circularity_contract_v0_1.json`. Implement inclusive-vs-leave-one-out candidateSelfContribution, gateFlip, rankDelta, Top6 sensitivity, membershipVersion/classificationSchemeId and fail-closed UNKNOWN handling. Diagnostic only; no live sector gate/rank replacement.
- SDA-003: consume `research/D02_PVE245_SYSTEM1_RUNTIME_REMEDIATION_HANDOFF_20261005_V0_1.md`. Do not retroactively turn 2026-10-05 into clean evidence. Repair only the frozen runtime/evidence gaps under existing Class governance.
- SDA-007: consume `research/d06_sda007_flow_ownership_lineage_contract_20261005_v0_1.json`. Implement primitiveReceiptId / parentReceiptIds / informationRoot / motive-state lineage without creating new votes.
- SDA-016: existing System1 holdout guard is only partial pass. Do not call complete until shared cross-system authority satisfies Room11 V0.4 T01-T48, including footprint/release/missingness/multi-horizon lineage.

### System 2
- SDA-001 / SDA-004: corresponding signal/resonance consumers still need canonical lineage/dedup diagnostics; do not equate visual condition count with independent evidence.
- SDA-007: reuse the D06 primitive lineage contract; no passive/active/crowding duplicate vote from one primitive.
- SDA-016: converge on one shared physical holdout/consumption authority with System1 rather than forking a second ledger semantics.
- SDA-017: implement the Room11 V0.2 episode/support contract and pass T01-T40 before specialist revalidation. Preserve structuralEpisodeN, replicationEpisodeN and mechanicalFragmentN separately; learned/fitted Regime dimensions require fitReceipt knowledge cutoff <= decision clock.

### D16 / Room11
- Revalidate only new engineering deltas against frozen oracles.
- No self-closure of SDA-016 or SDA-017.
- D16 residual/OOS evidence remains required for SDA-001/004/009/007 where specified.

No routing in this section authorizes Formal A/B, ranking, Top6, weight, threshold, capital or trading changes.


## 2026-10-06 oracle supersession notice

The latest authoritative validation oracles supersede older test-count references:
- SDA-016: research/SDA016_VALIDATION_ORACLE_20261006_V0_4.json — 48 blocking tests.
- SDA-017: research/SDA017_VALIDATION_ORACLE_20261006_V0_3.json — 48 blocking tests.

Newly mandatory engineering concerns include:
- authoritative Formal-decision -> exact C1-generation binding;
- same-session generation-parent ambiguity and finalization;
- admission/maturity missingness, positivity, estimand identity and outcome-footprint accounting;
- replicationCluster vs structuralEpisode vs mechanicalFragment separation;
- learned/fitted Regime fit-clock provenance.

System1 PR #644 is accepted only as a useful provenance partial-pass candidate:
- OPEN / DRAFT / NOT_MERGED / NOT_DEPLOYED;
- it does not itself satisfy SDA-016 closure;
- merge/deploy remains separately owner-gated.

Engineering rooms must use latest oracle versions when validating new work. Passing an older 30-test/40-test contract is not sufficient.


## SDA-022 cross-system non-convergence routing

Canonical guard:
`shared-knowledge/SYSTEM1_SYSTEM2_NON_CONVERGENCE_GUARD_V0_1.md`.

### System 1
Expose a research-only decision-policy fingerprint sufficient to compare universe/gate identity, Formal policy/version, ranking-policy identity, information-root set, selected symbols, decision timestamp and generation.

Do not alter A/B, Top6/3+3, 15-minute confirmation, capital or lifecycle merely to create divergence.

### System 2
Expose strategy-specific policy fingerprints and prove at least one candidate-generation path remains executable without consuming System1 Top6/rank output. Preserve strategyId/strategyVersion, strategy-local evidence families, local ranking identity, global max-12/per-strategy max-3 capacity and independent lifecycle.

Do not copy System1 A/B/Top6/3+3/ranking as hidden prerequisites.

### D16 / Room11
Validate dependence/incrementality instead of assuming two systems are independent. Compare overlap subset, System1-only, System2-only, shared-information-root ratio, common-support rank correlation where meaningful, and prospective outcomes by source-system/disagreement reason.

No arbitrary overlap threshold is authorized yet.

### 00
Sole cross-system closure authority. High output overlap is not a failure by itself; hidden policy dependence is. Low overlap is not a success by itself; forced disagreement is prohibited.

No Formal behavior change is authorized by SDA-022.
