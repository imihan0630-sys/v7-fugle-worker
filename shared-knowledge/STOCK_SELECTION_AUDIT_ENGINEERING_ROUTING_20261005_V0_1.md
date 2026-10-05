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
