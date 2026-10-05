# Stock Selection Audit — Launch/Safety HIGH Reconciliation 2026-10-05 V0.1

Status: HIGH_TICKETS_RECONCILED / MISSING_DELTAS_FROZEN
Scope: SDA-003 / SDA-007 / SDA-005 / SDA-006 / SDA-011 / SDA-014 / SDA-015
Formal Core impact: NONE
Parent queue: `shared-knowledge/STOCK_SELECTION_AUDIT_QUEUE.md`

## Purpose

Credit latest-main controls already present and route only missing remediation. This pass must not restart completed room research.

## SDA-003 — D02 participation proxy overclaimed as investor intent

Existing controls accepted:
- D02-05 is frozen as `EXTREME_PARTICIPATION_STATE`, not distribution intent.
- DISTRIBUTION / ABSORPTION / SMART_MONEY remain latent/UNKNOWN without independent evidence.
- D02-08 provider pressure is explicitly `PROXY_ONLY / INTENT_UNIDENTIFIED`.
- executable D02 Wave-2 admission guard rejects forbidden intent labels including ACCUMULATION, DISTRIBUTION, SMART_MONEY, ABSORPTION, ICEBERG, SPOOFING and TRUE_OFI.
- D02 L4 admission requires common support and explicitly separates price-only controls from price+volume residual hypotheses.

Missing delta:
- clean prospective selection-date count remains zero at the reconciled checkpoint;
- residual price-only-vs-volume incrementality has not matured;
- system-wide lineage still needs SDA-001 engineering so a proxy cannot later re-enter as an independent duplicate vote through another feature family.

Decision:
`VALIDATION_PENDING / SEMANTIC_AND_ADMISSION_GUARD_COMPLETE / PROSPECTIVE_RESIDUAL_EVIDENCE_PENDING`.

Do not repeat the intent-firewall research.

## SDA-007 — D06 flow/ownership intent and passive-active double count

Existing controls accepted:
- D06 research explicitly marks passive/index rebalance contamination separately and allows UNKNOWN when contamination cannot be established.
- D06 ownership/flow/crowding layers are already semantically separated from D20 behavioral herding under prior hidden-overlap governance.
- D06 current checkpoint preserves revision/vintage distinctions including preliminary/revised/final states and separate passive-flow evidence.
- H14 already freezes index-adjustment event identity (D11) separately from passive flow/stock measurement (D06), so one rebalance is not two automatic directional votes.

Missing delta:
- no system-wide machine one-receipt-many-consumers enforcement was found for institutional/passive primitives;
- no generic machine field was found that makes `motive/intent eligibility=false/UNKNOWN` portable across all D06 consumers;
- prospective residual evidence separating active flow, passive rebalance, crowding and price/sector controls remains incomplete.

Decision:
`REMEDIATION_IN_PROGRESS / RESEARCH_SCOPE_SPLITS_EXIST / SHARED_RECEIPT_AND_RESIDUAL_GUARDS_PENDING`.

Route:
05｜法人與籌碼研究室 preserves exact observable-vs-intent and passive/active semantics; System 1/System 2 enforce shared receipt lineage; D16 validates residual incrementality.

## SDA-005 — D04 ex-post volatility state / breakout-family double count

Existing controls accepted:
- D04 L4 work is prospectively preregistered; historical backfill is forbidden.
- D04 uses frozen volatility-state primitives and aligns market-state primitives with System 2 rather than inventing separate taxonomies.
- H20 terminal governance already fixes one breakout primitive: D01 owns event identity, D02 volume transform and D04 volatility interaction/context; D02/D04 are not independent votes until residual value passes.
- current D04 exact next requires a coverage-only prospective parent audit before economic outcomes.

Missing delta:
- the prospective D04 L4 parent/economic evidence has not matured;
- System 1/System 2 still need machine-visible shared breakout episode identity / volatility lineage under SDA-001;
- no production-facing behavior change is authorized.

Decision:
`VALIDATION_PENDING / RESEARCH_ANTI_DOUBLE_COUNT_COMPLETE / PROSPECTIVE_INCREMENTAL_EVIDENCE_PENDING`.

Do not repeat H20 semantic work.

## SDA-006 — D05 quote/depth observability mistaken for executable liquidity

Existing controls accepted:
- D05 research explicitly states that dynamic replenishment/resiliency cannot be inferred from sparse snapshots and requires prospective high-frequency/event-driven data.
- execution-cost research separates filled and unfilled quantity, partial fills and cancel/non-fill exposure.
- current D05 checkpoint explicitly retains true OFI and own-order/fill/queue blockers rather than inferring them from quote/depth.
- D05 prospective capture / C3 parent eligibility is fail-closed when required parent generation is absent.

Missing delta:
- complete prospective own-order/fill/cancel/reject opportunity denominators are not yet available across the required dates/mechanisms;
- queue priority / own-impact remains unobserved or source-blocked where not directly captured;
- System 2 capacity provenance must retain partial/missing denominator semantics and must not convert observed depth into fillability.

Decision:
`REMEDIATION_IN_PROGRESS / OBSERVABILITY_FIREWALL_EXISTS / EXECUTION_CAPACITY_RECEIPTS_PENDING`.

Route:
04 room continues source/semantic boundaries; System 1 execution and System 2 capacity layers enforce ACTUAL-vs-MODELED provenance and missing denominator fail-closed behavior.

## SDA-011 — D11/D17 event first-known leakage and duplicate-story amplification

Existing controls accepted:
- D11 current tracker keeps D11-08/D11-13 at explicit first-known/completeness blockers rather than claiming completeness.
- D17-01/D17-02 exact next is prospective fixed-cadence capture of the first appearance of a truly new disclosure; general-news source coverage remains explicitly incomplete.
- D17 research keeps event/news propagation separate from D10 structural exposure and D20 narrative diffusion under prior overlap governance.
- outcomes remain closed where first-availability/source completeness is not established.

Missing delta:
- a canonical cross-source `eventId/newsClusterId` machine dedup contract was not found in current-main search;
- licensed/general-news coverage is incomplete, so duplicate-story and first-availability completeness cannot yet be globally certified;
- event importance/surprise must remain frozen independently of later price reaction.

Decision:
`REMEDIATION_IN_PROGRESS / FIRST_KNOWN_GOVERNANCE_EXISTS / CANONICAL_EVENT_STORY_DEDUP_AND_SOURCE_COVERAGE_PENDING`.

Route:
08｜事件與新聞研究室 freezes event/story semantic identity; System 1/System 2 news-event layers enforce immutable IDs/clocks and dedup.

## SDA-014 — D14 paper execution Alpha / filled-only bias

Existing controls accepted:
- D14 order-choice contract says a missing decisionAt mechanism/quote state blocks strict order-choice counterfactual claims.
- execution research freezes parent intendedQty/decisionTimestamp/decisionPrice/side/plan identity and child fillTimestamp/fillQty/fillPrice/mechanism/evidence-quality.
- filledQty and unfilledQty are kept separate; evaluation may not be renormalized onto completed shares only.
- implementation shortfall includes unfilled opportunity cost; using actual fill prices and subtracting a second generic slippage cost is explicitly forbidden.
- current exact next already asks for at least three independent prospective Taiwan dates with fills plus unfilled/cancel/reject opportunities and mechanism-specific separation.

Missing delta:
- required prospective real order-choice receipts have not yet accumulated;
- broker-confirmed fill/cancel/reject lineage remains the gating evidence for promotion-grade execution claims;
- actual opportunity-set denominators across regular-lot, odd-lot and auction mechanisms remain incomplete.

Decision:
`VALIDATION_PENDING / RESEARCH_EXECUTION_CONTRACT_STRONG / PROSPECTIVE_BROKER_RECEIPTS_PENDING`.

Do not redo the filled-only semantic firewall.

## SDA-015 — D15 ex-post portfolio optimization / utilization confounding

Existing controls accepted:
- D15 explicitly separates planned cash from actual broker cash and classifies zero-selection as NO_ELIGIBLE_OPPORTUNITY / designed reserve, not poor utilization.
- Portfolio Heat is separated from concentration and from expected-return/selection quality.
- a risk-geometry Pareto improvement is explicitly not an economic sizing recommendation because PriorityScore may contain Alpha.
- FIRST/ADD/FULL plan envelopes are separated from actual fill/holdings lifecycle.
- 3+3 pool split is explicitly a price-tier capacity rule, not proven diversification.
- current research preserves actual-live heat/cash and covariance/effective-bets claims as UNKNOWN when evidence is absent.

Missing delta:
- no generic immutable pre-trade portfolio-decision receipt with a validated covariance/risk-input version was found for all sizing experiments;
- prospective attribution separating stock-selection Alpha from sizing/allocation Alpha is still required;
- actual holdings/fills remain required for realized lifecycle/utilization claims;
- D15 must not tune sizing thresholds against already observed winner paths.

Decision:
`REMEDIATION_IN_PROGRESS / PLAN_TIME_SEMANTIC_FIREWALL_STRONG / PRETRADE_RISK_VERSION_AND_PROSPECTIVE_ATTRIBUTION_PENDING`.

Route:
10 room freezes selection-vs-sizing estimands and pre-trade inputs; System 1 persists immutable portfolio decision/risk versions; D16 validates incremental sizing value on common selected cohorts.

## Overall result

No HIGH ticket in this pass is CLOSED.

Tickets with strong semantic/machine admission controls and primarily prospective validation debt:
- SDA-003;
- SDA-005;
- SDA-014.

Tickets still requiring material engineering/source/remediation deltas:
- SDA-007;
- SDA-006;
- SDA-011;
- SDA-015.

Accepted controls listed here must not be re-researched merely to increase maturity percentage.

No Formal Core, A/B, ranking, Top6, weight, threshold, capital, entry/exit, signal or push behavior changed.
