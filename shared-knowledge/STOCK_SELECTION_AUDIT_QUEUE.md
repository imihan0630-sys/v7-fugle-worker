# Stock Selection Audit Queue V0.1

Updated: 2026-10-05 Asia/Taipei
Status: CANONICAL_ACTIVE_AUDIT_QUEUE
Owner: 00｜研究總控室
Scope: D01-D22 / System 1 / System 2
Formal Core impact: NONE
Source audit map: `shared-knowledge/STOCK_SELECTION_SELF_DECEPTION_AUDIT_V0_1.md`
Machine registry: `shared-knowledge/stock_selection_audit_queue_v0_1.json`

## Purpose

This queue converts the standing self-deception/blind-spot audit into trackable remediation work.

A finding is not closed because:
- it was mentioned in chat;
- a research note discussed it;
- a domain maturity percentage increased;
- a single test passed;
- a Shadow diagnostic exists without the required semantic / engineering / D16 / 00 readback chain.

## Lifecycle

Allowed status:

`OPEN -> ROUTED -> REMEDIATION_IN_PROGRESS -> FIX_IMPLEMENTED -> VALIDATION_PENDING -> VERIFIED -> CLOSED`

Other allowed fail-closed statuses:
- `BLOCKED_SOURCE`
- `BLOCKED_DEPENDENCY`
- `EVIDENCE_INSUFFICIENT`
- `REJECTED_NOT_A_REAL_RISK`

A ticket may skip a stage only when the closure evidence explicitly proves the skipped responsibility was not applicable.

## Severity

- CRITICAL: can materially manufacture selection confidence, contaminate OOS validity, or change Top6 interpretation across core Alpha families.
- HIGH: can materially bias selection evidence or execution realism, but is more localized.
- MEDIUM: meaningful blind spot, generally challenger/context/specialized.
- LOW: observability/hygiene issue with limited current selection effect.

## Closure gate

Every ticket declares which of these are required:
- learning-room semantic / falsification remediation;
- engineering guard / provenance / deterministic test;
- D16 common-support / incrementality / OOS validation;
- 00 cross-domain readback.

Formal behavior changes are never authorized by ticket closure itself.

---

## Active queue

### SDA-001 — Same-root PRICE_OHLC multi-vote across D01/D02/D03
- Severity: **CRITICAL**
- Status: **ROUTED**
- Domains: D01, D02, D03
- Learning owners:
  - 01｜K線與型態研究室
  - 02｜價量研究室
  - 03｜技術指標與趨勢動能研究室
- Engineering owners: System 1, System 2
- D16 validation: REQUIRED
- Risk:
  breakout, pattern, EMA, MACD, ROC, momentum, higher-low and the price component of price-volume logic can be multiple representations of the same price history while appearing to be independent confirmations.
- Research remediation:
  freeze representation families, exact price-only controls and conditions under which a residual contribution is genuinely distinct.
- Engineering remediation:
  implement factor lineage / informationRoot / redundancyGroup / effectiveIndependentEvidenceCount and raw-vs-dedup Shadow diagnostics per the canonical Alpha lineage guard.
- Closure evidence:
  deterministic alias/duplicate tests + common-parent residual comparison + D16 incrementality readback + 00 audit closure.

### SDA-002 — D01 pattern hindsight / future-pivot confirmation
- Severity: **HIGH**
- Status: **ROUTED**
- Domain: D01
- Learning owner: 01｜K線與型態研究室
- Engineering owners: System 1, System 2
- D16 validation: REQUIRED for promotion claims
- Risk:
  patterns can become obvious only after later bars; named labels can encode hindsight and successful-pattern survivorship.
- Research remediation:
  label-independent geometry, firstObservableAt/confirmedAt, failure lifecycle, negative/divergent cases.
- Engineering remediation:
  immutable episode identity and future-pivot/no-lookahead guard.
- Closure evidence:
  replay-safe pattern receipt + deterministic future-bar adversarial tests + 00 readback.

### SDA-003 — D02 participation proxy overclaimed as investor intent
- Severity: **HIGH**
- Status: **ROUTED**
- Domain: D02
- Learning owner: 02｜價量研究室
- Engineering owners: System 1, System 2
- D16 validation: REQUIRED
- Risk:
  high/low volume, signed pressure or price-volume response may be renamed accumulation, distribution or informed intent without identification.
- Research remediation:
  participation != motive firewall; direct-price and volume/turnover controls; UNKNOWN intent unless independently observed.
- Engineering remediation:
  preserve PRICE_OHLC vs VOLUME_TURNOVER lineage and proxy classification coverage.
- Closure evidence:
  residual volume test on common support + no-intent-overclaim checks + 00 readback.

### SDA-004 — D03 indicator zoo / alias stacking / parameter snooping
- Severity: **CRITICAL**
- Status: **ROUTED**
- Domain: D03
- Learning owner: 03｜技術指標與趨勢動能研究室
- Engineering owners: System 1, System 2
- D16 validation: REQUIRED
- Risk:
  many indicators are deterministic/monotonic transforms of the same returns; searching horizons/parameters after outcomes manufactures Alpha.
- Research remediation:
  freeze indicator families, horizons, parameter search family and simple-return/trend baselines before outcome inspection.
- Engineering remediation:
  alias registry, factorVersion, parameter-family ledger, duplicate registration guard.
- Closure evidence:
  deterministic alias tests + preregistered parameter family + D16 multiple-testing/incrementality receipt.

### SDA-005 — D04 ex-post volatility state / breakout-family double count
- Severity: **HIGH**
- Status: **ROUTED**
- Domain: D04
- Learning owner: 04｜波動與市場微結構研究室
- Engineering owners: System 1, System 2
- D16 validation: REQUIRED
- Risk:
  contraction/expansion can be defined with future realized volatility or counted independently from the same breakout/trend episode.
- Research remediation:
  ex-ante state definition and price/trend control.
- Engineering remediation:
  decision-time VOLATILITY_STATE snapshot; shared breakout episode identity.
- Closure evidence:
  cutoff-safe prospective state receipts + component incrementality audit.

### SDA-006 — D05 quote/depth observability mistaken for executable liquidity
- Severity: **HIGH**
- Status: **ROUTED**
- Domain: D05
- Learning owner: 04｜波動與市場微結構研究室
- Engineering owners: System 1, System 2 capacity layer
- D16 validation: REQUIRED where predictive claims are made
- Risk:
  visible spread/depth does not prove queue priority, own fill, impact or capacity; data-rich active stocks can dominate evidence.
- Research remediation:
  separate market observability, capacity and prediction; preserve queue/OFI/impact UNKNOWN.
- Engineering remediation:
  fill/unfilled/cancel/reject opportunity denominator and capacity provenance.
- Closure evidence:
  prospective execution/capacity receipt + missingness/coverage audit.

### SDA-007 — D06 flow/ownership intent and passive-active double count
- Severity: **HIGH**
- Status: **ROUTED**
- Domain: D06
- Learning owner: 05｜法人與籌碼研究室
- Engineering owners: System 1, System 2
- D16 validation: REQUIRED
- Risk:
  observed flow/holding changes can be interpreted as intent; passive rebalance, active positioning, leverage and crowding may reuse the same primitive.
- Research remediation:
  observed-flow vs motive split; effective/revision clocks; passive-flow identity and residual tests.
- Engineering remediation:
  INSTITUTIONAL_FLOW_OWNERSHIP lineage and one-receipt-many-consumers guard.
- Closure evidence:
  vintage-safe common-support evidence + passive/active anti-double-count test.

### SDA-008 — D07/D08 financial and valuation PIT-vintage / historical-universe leakage
- Severity: **HIGH**
- Status: **ROUTED**
- Domains: D07, D08
- Learning owner: 06｜基本面與估值研究室
- Engineering owner: System 1
- D16 validation: REQUIRED for Alpha promotion
- Risk:
  later revised statements, present-day comparable groups or current listed survivors can make historical fundamentals/valuation look cleaner than they were.
- Research remediation:
  filing-vintage replay, denominator/comparability rules, point-in-time peer universe.
- Engineering remediation:
  knownAt/sourceVintage/universeVersion enforcement and no current-universe historical backfill.
- Closure evidence:
  PIT replay with revision adversarial cases + universe-vintage tests.

### SDA-009 — D09 circular industry-strength reward
- Severity: **CRITICAL**
- Status: **ROUTED**
- Domain: D09
- Learning owner: 07｜產業與供應鏈研究室
- Engineering owner: System 1
- D16 validation: REQUIRED
- Risk:
  constituent returns can define a strong industry and then the same constituent can receive another reward for belonging to that strong industry.
- Research remediation:
  leave-one-out / excluding-self industry measure, effective-dated membership, industry-vs-stock residual test.
- Engineering remediation:
  membershipVersion and constituentContribution diagnostics; circular-reward flag.
- Closure evidence:
  leave-one-out replay + Top6/rank comparison before/after self-contribution removal + D16 readback.

### SDA-010 — D10/D17 exposure-graph hindsight and structural/event double count
- Severity: **HIGH**
- Status: **ROUTED**
- Domains: D10, D17
- Learning owners:
  - 07｜產業與供應鏈研究室
  - 08｜事件與新聞研究室
- Engineering owners: System 1, System 2 where event propagation is consumed
- D16 validation: REQUIRED for directional Alpha
- Risk:
  supply-chain links can be added after events and then structural exposure plus event beneficiary labels become duplicate votes.
- Research remediation:
  effective-dated structural graph, substitution/alternate-path falsifiers, event attribution consumes—not recreates—the graph.
- Engineering remediation:
  versioned exposureGraphId and shared primitive receipt.
- Closure evidence:
  pre-event graph replay + producer/consumer dedup test.

### SDA-011 — D11/D17 event first-known leakage and duplicate-story amplification
- Severity: **HIGH**
- Status: **ROUTED**
- Domains: D11, D17
- Learning owner: 08｜事件與新聞研究室
- Engineering owners: System 1, System 2 news/event layers
- D16 validation: REQUIRED
- Risk:
  repeated stories/disclosures may look like repeated confirmation; publication timestamp may differ from first machine-observable availability; event importance may be labeled from later price.
- Research remediation:
  freeze taxonomy/surprise before outcome, distinguish event identity from story instances and mechanical price adjustments.
- Engineering remediation:
  canonical eventId/newsClusterId/firstKnownAt/availableAt and duplicate-story guard.
- Closure evidence:
  duplicate-source adversarial replay + first-known clock receipt + D16 event-family evaluation.

### SDA-012 — D12 same-chain derivatives stacking / expiry-roll leakage
- Severity: **HIGH**
- Status: **ROUTED**
- Domain: D12
- Learning owner: 09｜衍生品與國際總經研究室
- Engineering owners: System 1, System 2
- D16 validation: REQUIRED
- Risk:
  skew, term structure, surface, IV-RV/VRP and futures-curve features can reuse the same parent chain; continuous-contract construction can leak across rolls.
- Research remediation:
  simple baseline first, same-parent residual tests, expiry/liquidity provenance, no retroactive back-adjustment.
- Engineering remediation:
  DERIVATIVES lineage, parentChainId/contractVersion/rollVersion.
- Closure evidence:
  same-parent residual receipt + roll-boundary adversarial tests.

### SDA-013 — D13 macro vintage/timezone hindsight and D18 input duplication
- Severity: **HIGH**
- Status: **ROUTED**
- Domains: D13, D18
- Learning owners:
  - 09｜衍生品與國際總經研究室
  - 11｜統計驗證與策略市場狀態研究室
- Engineering owners: System 1, System 2
- D16 validation: REQUIRED
- Risk:
  revised macro data or post-market labels can leak future information; macro inputs can be re-counted again through Regime state.
- Research remediation:
  first-release vintage, surprise-vs-expectation, heterogeneous exposure, producer/consumer split with D18.
- Engineering remediation:
  releaseClock/vintage/exposure lineage; Regime consumes macro primitive without an extra independent vote.
- Closure evidence:
  vintage replay + timezone edge tests + regime-input dedup.

### SDA-014 — D14 paper execution Alpha / filled-only bias
- Severity: **HIGH**
- Status: **ROUTED**
- Domain: D14
- Learning owner: 10｜投組風控與交易執行研究室
- Engineering owner: System 1
- D16 validation: REQUIRED where execution improvement is claimed
- Risk:
  evaluating only fills hides unfilled/rejected/cancelled opportunities; quote-based slippage is not realized execution.
- Research remediation:
  freeze opportunity set and comparator order; venue/session/odd-lot separation.
- Engineering remediation:
  broker-confirmed fill lineage + unfilled/cancel/reject denominator + decisionAt quote provenance.
- Closure evidence:
  prospective order-choice receipts and implementation-shortfall readback.

### SDA-015 — D15 ex-post portfolio optimization / utilization confounding
- Severity: **HIGH**
- Status: **ROUTED**
- Domain: D15
- Learning owner: 10｜投組風控與交易執行研究室
- Engineering owner: System 1
- D16 validation: REQUIRED
- Risk:
  future covariance, winner-tuned thresholds or high capital utilization can make sizing look like selection quality.
- Research remediation:
  freeze pre-trade risk inputs/constraints and separate selection vs sizing attribution.
- Engineering remediation:
  immutable portfolioDecisionReceipt and risk-input version.
- Closure evidence:
  frozen-input replay + attribution separating stock choice from sizing.

### SDA-016 — D16 validator self-confirmation / repeated OOS consumption
- Severity: **CRITICAL**
- Status: **ROUTED**
- Domain: D16
- Learning owner: 11｜統計驗證與策略市場狀態研究室
- Engineering owners: System 1, System 2 experiment infrastructure
- Independent audit owner: 00｜研究總控室
- Risk:
  repeatedly inspecting the same holdout, changing target/benchmark/horizon after outcomes, optional stopping or family expansion can turn OOS into disguised training data.
- Research remediation:
  preregister target/MDE/family/stop rule, sequential-testing policy and negative-result preservation.
- Engineering remediation:
  immutable experiment registry, holdout-use ledger, target/benchmark hash, outcome-lock and mutation rejection.
- Closure evidence:
  adversarial repeated-OOS tests + independent 00 readback. D16 cannot self-close this ticket.

### SDA-017 — D18 post-hoc Regime mining
- Severity: **CRITICAL**
- Status: **ROUTED**
- Domain: D18
- Learning owner: 11｜統計驗證與策略市場狀態研究室
- Engineering owners: System 1, System 2
- Independent audit owner: 00｜研究總控室
- Risk:
  market states can be defined after seeing when a strategy worked; excessive slicing creates tiny favorable regimes.
- Research remediation:
  ex-ante state definitions, minimum support, simple baseline regimes and preregistered interactions.
- Engineering remediation:
  frozen decision-time regimeState, input lineage, UNKNOWN/ABSTAIN for unsupported states.
- Closure evidence:
  prospective regime receipts + minimum-support tests + 00 audit readback.

### SDA-018 — D19 Factor Zoo / momentum overlap / survivorship
- Severity: **HIGH**
- Status: **ROUTED**
- Domain: D19
- Learning owner: 12｜資產定價與因子研究室
- Engineering owner: System 1 Challenger layer
- D16 validation: REQUIRED
- Risk:
  large factor search, D03 momentum duplication, current-universe survivorship and benchmark choice can manufacture factor Alpha.
- Research remediation:
  factor-family accounting, PIT universe, spanning/residual tests and net-of-cost evidence.
- Engineering remediation:
  Challenger-only admission, factor lineage, turnover/cost diagnostics.
- Closure evidence:
  independent-date/OOS incremental factor receipt beyond D03/D09 baselines.

### SDA-019 — D20 behavioral story without identifiable observables
- Severity: **HIGH**
- Status: **ROUTED**
- Domain: D20
- Learning owner: 13｜行為金融與市場心理研究室
- Coordination owners:
  - 05｜法人與籌碼研究室
  - 03｜技術指標與趨勢動能研究室
- Engineering owners: System 1, System 2 only where behavioral features are consumed
- D16 validation: REQUIRED
- Risk:
  crowding can be renamed herding and reversal can be renamed overreaction without behavior-specific evidence; social-data coverage is selective.
- Research remediation:
  behavior-specific observable and competing-mechanism falsification; UNIDENTIFIED is a valid state.
- Engineering remediation:
  no behavioral vote without observable lineage; social-source coverage/latency diagnostics.
- Closure evidence:
  residual behavioral evidence beyond D06/D03 primitives.

### SDA-020 — D21 governance/insider hindsight and motive inference
- Severity: **MEDIUM**
- Status: **ROUTED**
- Domain: D21
- Learning owner: 14｜公司治理與內部人研究室
- Engineering owner: System 1 if used in selection
- D16 validation: REQUIRED for Alpha promotion
- Risk:
  governance can be scored after scandals; insider transactions may have administrative/liquidity motives; filing lag and survivor bias distort history.
- Research remediation:
  authoritative known-at date; transaction != motive; controls for size/industry/fundamentals.
- Engineering remediation:
  governance/insider vintage and PIT issuer-universe lineage.
- Closure evidence:
  pre-event replay + motive-overclaim guard + common-support comparison.

### SDA-021 — D22 sparse-credit coverage / accounting duplication / fair-value-as-trade
- Severity: **MEDIUM**
- Status: **ROUTED**
- Domain: D22
- Learning owner: 15｜信用市場與資本結構研究室
- Coordination owner: 06｜基本面與估值研究室
- Engineering owner: System 1 if used in selection
- D16 validation: REQUIRED for Alpha promotion
- Risk:
  data-rich bond issuers can dominate samples; accounting leverage may be double-counted; evaluated fair value may be mistaken for executable market price.
- Research remediation:
  same-population D07 baseline, explicit coverage map, instrument seniority/collateral and fair-value-vs-trade separation.
- Engineering remediation:
  CREDIT_CAPITAL_STRUCTURE lineage and coverage eligibility.
- Closure evidence:
  common-population residual test + sparse-coverage bias report + trade/fair-value type guard.

---

## Initial routing summary

Launch-critical CRITICAL tickets:
- SDA-001 — D01/D02/D03 same-root multi-vote.
- SDA-004 — D03 indicator zoo/parameter snooping.
- SDA-009 — D09 circular industry reward.
- SDA-016 — D16 validator self-confirmation/repeated OOS.
- SDA-017 — D18 post-hoc Regime mining.

High-priority launch/safety tickets:
SDA-002, 003, 005, 006, 007, 008, 010, 011, 012, 013, 014, 015, 018, 019.

Challenger/context tickets:
SDA-020, SDA-021.

All are ROUTED through ROOM_BOOTSTRAP. No ticket closure or routing action changes Formal Core.


## Critical reconciliation — 2026-10-05

Canonical receipt:
`shared-knowledge/STOCK_SELECTION_AUDIT_CRITICAL_RECONCILIATION_20261005_V0_1.md`.

Current states:
- SDA-001: REMEDIATION_IN_PROGRESS — research same-root controls exist; machine lineage/dedup implementation + D16 residual readback remain.
- SDA-004: REMEDIATION_IN_PROGRESS — D03 redundancy/ROC consolidation exists; central machine alias/parameter guard remains.
- SDA-009: ROUTED — related D09 residual-sector research exists; exact leave-one-out/self-contribution circularity repair remains.
- SDA-016: REMEDIATION_IN_PROGRESS — preregistration is strong; generic holdout-use ledger/outcome-lock + independent 00 closure remain.
- SDA-017: REMEDIATION_IN_PROGRESS — ex-ante Regime governance is strong; executable immutable builder and prospective policy evidence remain.

Do not repeat accepted controls listed in the reconciliation receipt.


## HIGH reconciliation status — 2026-10-05

Launch/safety HIGH reconciliation:
`shared-knowledge/STOCK_SELECTION_AUDIT_HIGH_RECONCILIATION_20261005_V0_1.md`.

Remaining HIGH reconciliation:
`shared-knowledge/STOCK_SELECTION_AUDIT_REMAINING_HIGH_RECONCILIATION_20261005_V0_1.md`.

Current HIGH states:
- VALIDATION_PENDING: SDA-003, SDA-005, SDA-014, SDA-019.
- REMEDIATION_IN_PROGRESS: SDA-002, SDA-006, SDA-007, SDA-008, SDA-011, SDA-013, SDA-015, SDA-018.
- BLOCKED_DEPENDENCY: SDA-010, SDA-012.

Accepted controls in the reconciliation receipts must not be repeated merely to raise maturity.
Protected owner gates remain unchanged.

## System 1 Class A engineering return — SDA-001 / SDA-004 / SDA-016

Additive offline implementation and tests are recorded in
`research/SYSTEM1_SDA_SHADOW_REMEDIATION_CHECKPOINT_20261005.md`.
This supplements the earlier critical reconciliation: System 1 lineage/dedup
Shadow diagnostics, pinned alias/parameter registrations and generic immutable
experiment/holdout-use guard now have executable implementations.
Tickets remain REMEDIATION_IN_PROGRESS; no CLOSED/VERIFIED claim. D03 mapping
review, D16 generic consumption semantics/residual/OOS validation, System 2 lane
integration and independent 00 readback remain pending. Formal Core LOCKED;
no runtime, D1, provider call or Production deployment change.
