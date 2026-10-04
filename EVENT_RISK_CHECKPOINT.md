# Event Risk, Gap Risk & Overnight Information Checkpoint

Updated: 2026-09-25 Asia/Taipei
Current cursor: ER-001 through ER-028 complete.
Next: evidence collection / governance decision before implementation.
Status: CONCEPT_COMPLETE / EVIDENCE_PENDING.

## Durable conclusions
- Daily return must be decomposed into overnight and intraday regimes with corporate-action/reference-price guards.
- Taiwan-specific literature supports treating overnight and daytime as distinct regimes, not a simple directional rule.
- MOPS material-information timing creates genuine after-close/pre-open event exposure.
- Scheduled-known and unscheduled events are separate states; NO_KNOWN_EVENT never means no event can occur.
- Stop prices are decision boundaries, not maximum-loss guarantees across gaps.
- Taiwan ±10% price limits can create multi-day constrained-exit/price-discovery risk; historical evidence is mechanism support, not a 2026 directional forecast.
- Limit price state and actual fillability are separate.
- Weekend/holiday duration is exposure time, not direction.
- Event category does not imply bullish/bearish sign.
- Fundamental surprise and price gap are separate layers; no double counting.
- Common-event exposure can create portfolio gap clustering beyond ordinary correlation.
- FIRST/ADD/FULL stages create different event exposure.
- Gap continuation/fill/reversal are outcomes to test, not rules.
- Start with simple market/sector-relative gap decomposition before complex factor models.
- Point-in-time event disclosure/vintage is mandatory.
- Formal Core remains LOCKED.

## Exact next continuation
ER-016 scheduled-event exposure calendar.
ER-017 Taiwan monthly revenue / earnings / investor-conference window semantics.
ER-018 gap-through-stop and limit-down stress.
ER-019 overseas-market lead/lag context.
ER-020 opening-auction / first-15m stabilization.
ER-021 common-event portfolio clustering.
ER-022 event-aware projected heat.
ER-023 falsification/negative controls.
ER-024 prospective Shadow protocol.
ER-025 convergence/readiness.


## ER-016 through ER-025 durable update
- Event-calendar certainty levels distinguish exact known schedules, date-only knowledge, deadline windows, unscheduled disclosures and UNKNOWN.
- Monthly revenue regulatory deadline is not an exact ex-ante publication date. Store regulatoryDeadline, scheduledEventAt, actualPublishedAt and firstKnownScheduledAt separately.
- Gap-through-stop risk is calibrated separately from planned stop risk, with empirical/scenario labels.
- Overseas-market and Taiwan-futures context are explanatory controls for overnight gaps, not duplicate macro scores.
- Opening auction is separated from post-open 5m/15m/30m path.
- Event-specific exposure graphs are preferred over narrative theme clustering.
- Event-aware portfolio heat uses alternative scenario paths rather than double-counting normal stop risk plus gap risk.
- Negative controls require same-stock non-event nights, same-date peers, market/sector residuals and corporate-action guards.
- Prospective ER-024 protocol captures all monitored symbols/dates, not only large gaps.
- No automatic pre-event avoidance, de-risking, gap chase or gap sell rule is approved.
- Formal Core unchanged.

## Exact next continuation
ER-026 audit current repository/runtime source for point-in-time event timestamps, opening/reference-price data and corporate-action guards.
ER-027 determine whether existing recorder can support prospective ER-024 with zero/shared-code changes.
ER-028 prepare research-only event-vintage capture proposal only if needed.


## ER-026 through ER-028 durable update
- Current official ANNOUNCEMENTS quality sync uses official TWSE/TPEx sources but normalized storage keeps announcement date + title, not intraday first-known/disclosure time. It is date-level context, not intraday point-in-time truth.
- Current V8.8.1 execution snapshot passes previousClose/openPrice but does not persist Fugle quote referencePrice/openTime. Corporate-action-adjusted gap classification is therefore incomplete.
- Existing recorder milestone cadence is not an exhaustive all-symbol opening panel.
- Full ER-024 cannot be answered faithfully with current stored fields alone. A smaller existing-data descriptive pilot must be labeled separately.
- `EVENT_RISK_CAPTURE_PROPOSAL.md` now freezes a point-in-time event/opening capture design with expected-vs-observed coverage, corporate-action firewall, UNKNOWN semantics, research-only/fail-open architecture and governance boundaries.
- No implementation/deploy occurred. Formal Core unchanged.


## D11-14 / ER cross-link — index-review event clocks
- Index review events are now modeled as scheduled-event families with separate `reviewDataCutoff`, `announcementKnownAt`, `effectiveFromSession` and execution-window clocks.
- This reinforces ER-016/017: a methodology-defined review window is not the same as an exact publication timestamp, and an effective date is not the same as first-known time.
- Passive rebalance pressure is an event-risk/liquidity mechanism candidate, not a directional alpha rule.
- Future event-risk studies must separate announcement reaction, pre-effective anticipation, effective-session auction pressure and post-effective continuation/reversal.
- D11-14 source/PIT feasibility is L3; Event Risk outcome evidence remains pending.


## D11-06 / D11-09 / D17-13 Taiwan event-clock deepening — 2026-10-02
- New anchor: `EVENT_TRANSACTION_AND_DISCLOSURE_CLOCK_RESEARCH.md`; machine contract: `research/d11_d17_event_clock_contract_v0_1.json`.
- D11-06 advances L2 -> L3 for Taiwan PIT source feasibility. FSC rules separate M&A/asset lifecycle clocks: fact occurrence, board/shareholder decisions, contract, regulatory approval, completion, revision/termination/delay. Announcement is explicitly not completion.
- D11-09 advances L2 -> L3 for Taiwan PIT source feasibility. TWSE rules expose recurring financial-report, monthly-revenue and investor-conference timing. Monthly revenue due-by-10th is frozen as DEADLINE_ONLY unless actual publication is observed.
- D17-13 advances L2 -> L3 for Taiwan PIT source feasibility. Taxonomy frozen: SCHEDULED_EXACT / SCHEDULED_WINDOW / DEADLINE_ONLY / UNSCHEDULED / UNKNOWN.
- Conservative replay rule unchanged: capturedAt controls availability until source-native availability is independently authenticated; deadline or displayed publication time cannot backdate knowledge.
- No return, gap, continuation, reversal, cost or directional alpha was inspected. FORMAL_OPTIMIZATION_CANDIDATE = NO. Formal Core unchanged.
- Exact next: immutable prospective event-state and publication receipts across independent dates; keep D11-13 negative-evidence completeness at L2 until expected/observed source coverage can prove absence.

## Room 08 special-situations / policy-event long-block — 2026-10-03

- Cross-link added for the newly approved D11-15..19 and D17-14 curriculum.
- Unified research anchor: `SPECIAL_SITUATIONS_POLICY_EVENT_RESEARCH.md`; machine contract: `research/d11_d17_special_situations_event_clock_contract_v0_1.json`.
- Special situations reinforce the existing ER conclusion that announcement, effective/tradable state and realized outcome are different clocks.
- IPO failure/withdrawal, lock-up release without sale, private-placement restricted tradability, tender failure/extension, merger deal-break and policy draft/final/effective stages are now explicit negative/failure states.
- D17-14 surprise requires a preserved ex-ante expectation; absent expectation => UNKNOWN, never inferred from price reaction.
- Existing ER-024 prospective Shadow remains blocked by its original point-in-time/opening-data conditions; this research does not fabricate that evidence.
- D11-15..19 and D17-14 advance only L0 -> L2. No L3/L4 outcome claim.
- Formal Core unchanged; no event penalty or avoidance rule approved.

Exact next:
Build immutable prospective/historical source-version receipts for the six new modules while continuing ER event-vintage coverage. Keep outcome joins closed until source completeness and preregistered cohort gates pass.

## Room 08 continuation — D11-15 L3 IPO PIT + D17-14 clock-lane evidence — 2026-10-03

- D17-14 policy-clock source lane is now bounded Taiwan PIT-feasible at date level via official FSC draft and final-law histories.
- New receipt: `research/d17_14_policy_clock_receipt_v0_1.json`.
- Three independent policy histories prove publication/effective semantics can differ: effective-on-publication, legally retroactive, and mixed provision-level effective dates.
- Retroactive legal effect never backdates first-known or decision observability.
- The full D17-14 module stays **L2** because Surprise（預期差）still lacks a validated ex-ante expectation source lane. Missing expectation = UNKNOWN; market reaction cannot substitute.
- Existing ER-024 prospective Shadow/opening-data blockers remain unchanged.
- No event-direction score, risk penalty, return outcome or Formal change.

Exact next:
Validate ex-ante expectation archives for independent Taiwan policy decisions and prospectively preserve raw draft/final/effective versions with capturedAt; continue D17-01/02/09 source-version coverage.

## Room 08 continuation — D17-14 ex-ante expectation lane reaches L3 — 2026-10-04

- New receipt: `research/d17_14_expectation_source_receipt_v0_1.json`.
- Two independent CBC decisions have pre-decision Reuters forecast distributions and compatible official CBC realizations: 2026-06-15 -> 2026-06-18 and 2026-09-14 -> 2026-09-17.
- D17-14 advances L2 -> L3 for Taiwan PIT/source feasibility. This closes the prior missing-expectation-source blocker, not the outcome-evidence gate.
- Preserve full forecast distributions. Mean/median/mode or any surprise functional must be preregistered before equity returns are inspected; market reaction cannot infer missing expectations.
- Both historical witnesses matched the modal expectation. No unexpected-policy return effect has been demonstrated.
- D13 remains owner of macro-policy state/controls; D17 owns event identity, first-known expectation/surprise clock and transmission. No double factor voting.
- Existing ER-024 prospective Shadow/opening-data blockers remain unchanged.
- No event-direction score, risk penalty, return outcome or Formal Core change.

Exact next:
Prospectively capture future independent Taiwan policy expectation distributions with capturedAt/version evidence, including non-modal realization if naturally observed; preregister the surprise functional, event-zero and outcome horizons before any L4 test. Continue D17-01/02/09 multi-day source/version coverage.

## Room 08 continuation — D11-10/11 and D17-09 L3 feasibility — 2026-10-04

New D11 receipt: `research/d11_10_11_event_gap_exit_pit_audit_20261004_v0_1.json`.
New D17 receipt: `research/d17_official_disclosure_crossday_receipt_20261004_v0_1.json`.

D11-10 event-linked overnight gap risk advances L2 -> L3 for Taiwan PIT/source feasibility. It consumes the already validated official daily OHLC gap primitive, PIT-valid event clocks and the D11-12 corporate-action firewall. Mechanical reference-price resets, unresolved corporate actions, missing/synthetic open and unresolved suspension provenance fail closed. D04-09 remains owner of tail/gap volatility state; D17-12 remains owner of post-gap continuation/reversal. The opening gap is one primitive observation, never three votes.

D11-11 multi-day price-limit exit risk advances L2 -> L3 with a prospective-only executability qualifier. Existing official price-limit rule/version evidence plus timestamped best bid/ask, top-five depth, limit/halt/trial/delayed states make bounded prospective exit-constraint observation feasible. A lower-limit close does not prove a sell order was impossible to execute. Actual fill requires order/fill evidence, and historical OHLC cannot reconstruct historical queue/fill state. D05-02 remains owner of price-limit mechanics; D04-10 owns volatility contamination.

D17-09 duplicate/same-event clustering advances L2 -> L3 after cross-day official capture physically observed 2072, 6949, 4530 and 4747 recurring on later daily source dates with the same historical fact dates and explicit multi-month announcement periods. New daily row does not equal new economic primitive. Old-only rows remain UNKNOWN rather than cancellation evidence.

D11-16 remains L2. D17-01/02 and D11-08 remain L2. No outcome join, alpha claim, risk penalty, Formal selection/ranking change or production behavior change.

Exact next:
- D11-10: build prospective event-to-next-open receipts and preregister gap-through-stop outcomes.
- D11-11: collect actual consecutive constrained-session quote/depth states and join real order/fill receipts only when available.
- D17-01/02/09: obtain a third independent official capture plus after-hours coverage and continue version/correction semantics.
- D11-16: complete one issuer-level custody-release-to-transfer-to-realized-holdings chain.


## 00 control-plane receipt — H15 / H16 terminal closures

H15 is CLOSED_NO_STRUCTURAL_CHANGE:
- D11-10 = event-linked overnight-gap risk.
- D04-09 = tail/gap volatility state.
- D17-12 = post-gap continuation/fill/reversal only after the opening observation.
- one opening gap cannot become three time-zero votes.

H16 is CLOSED_NO_STRUCTURAL_CHANGE:
- D05-02 = price-limit mechanics.
- D11-11 = exit/orderability transformation.
- D01-09 = chart/pattern semantics.
- D04-10 = volatility-estimator contamination.
- one limit event cannot become four independent signals.

No maturity or Formal/runtime change from either closure.

Audits:
- shared-knowledge/CURRICULUM_H15_DEPENDENCY_ANTI_ORPHAN_AUDIT_20261004_V0_1.md
- shared-knowledge/CURRICULUM_H16_DEPENDENCY_ANTI_ORPHAN_AUDIT_20261004_V0_1.md


## 00 control-plane receipt — H08 closure / H10 owner gate

H08 closed:
KEEP_SEPARATE / MEMBERSHIP_VS_EVENT_PROPAGATION_VS_NARRATIVE_DIFFUSION.
D17-11 remains event/news propagation owner and stays L2/40%; D09/D20 maturity does not transfer into it.

H10 reached owner gate:
KEEP_SEPARATE / SCOPE_DEDUP_ONLY.
Proposed canonical boundary:
- D10-12 owns persistent structural issuer/supply-chain exposure.
- D17-04 consumes D10 exposure and owns event-specific direct attribution.
- D17-05 consumes D10 graph edges and owns event-specific second-order transmission.
- D17 may not reconstruct a second supply-chain graph from headlines.

D17-04 and D17-05 remain L2/40%. No canonical wording mutation before owner approval.

## Evening source-lineage continuation — 2026-10-04

D17 weekend/non-trading source coverage completed in workflow run `37197636375` with expected/observed poll accounting. This deepens source completeness discipline but does not promote D17-01, D17-02, D11-08 or D11-13.

D17-10 advances L2 -> L3. The 2537 construction-fire case physically separates independent event-occurrence corroboration from issuer-only materiality/insurance statements that later media merely redistribute. The 7827 HCB303 example separately demonstrates that copied MOPS disclosures across websites remain one primary lineage.

The cross-validation unit is field + evidence lineage, not URL count. Conflicts retain both values/timestamps/lineages; missing independent confirmation remains UNKNOWN. Retrospective publication clocks cannot be backdated into strategy firstKnownAt.

Evidence receipts:
`research/d17_after_hours_coverage_receipt_20261004_v0_1.json`
`research/d17_10_cross_source_lineage_receipt_20261004_v0_1.json`

Formal Core unchanged. Outcome joins remain closed.
