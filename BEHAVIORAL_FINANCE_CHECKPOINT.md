# Behavioral Finance / Investor Attention Checkpoint

Updated: 2026-10-02 23:19 Asia/Taipei
Scope: D20｜行為金融／投資人注意力／市場心理
Status: FOUNDATION_CLUSTER_L2 / D20-01_02_04_07 / FORMAL_CORE_UNCHANGED

## Governance
- Canonical continuation checkpoint for D20.
- Behavioral labels are mechanisms/hypotheses, not licenses to infer unobservable investor intent from OHLCV.
- Require positive mechanism, counterevidence, PIT/replay, data-quality, redundancy, costs and incremental-value checks.
- Behavioral proxies derived from price/volume must not receive duplicate factor credit against D01/D02/D03/D04/D05.

## Durable progress｜2026-10-02
- D20-01 Prospect Theory / Loss Aversion: L0 -> L2.
  - Reference dependence and loss asymmetry are useful hypothesis structures.
  - Falsification established: prospect theory does not mechanically imply the disposition effect; predictions depend on reference-point/evaluation implementation, and universal loss-aversion claims are contested.
- D20-02 Disposition Effect: L0 -> L2.
  - U.S. and Taiwan account/trade evidence reviewed.
  - Taiwan evidence includes heterogeneous behavior by investor type; mutual funds/foreign investors are important counterexamples in complete-market evidence.
  - Structural alternatives and data requirements frozen.
- D20-04 Anchoring / Reference Dependence: L0 -> L2.
  - Taiwan 52-week-high/attention evidence reviewed.
  - Redundancy firewall established against momentum, breakout, MA-distance, volatility and price-position families.
- D20-07 Investor Attention / Salience: L0 -> L2.
  - General and Taiwan transaction evidence reviewed, including regime heterogeneity.
  - External attention proxies must be separated from endogenous price/volume proxies.
- D20 aggregate maturity: 13.3%.
- No L3 promotion: our own replayable Taiwan PIT data contracts are not yet validated.
- Formal Core unchanged.

## Exact next continuation
1. Start D20-03 Overconfidence from theory -> observable proxies -> competing structural explanations -> falsification.
2. In parallel, build Taiwan PIT/replay feasibility contracts for D20-01/02/04/07:
   - explicit reference-point definition and update rule;
   - holdings/cost-basis or defensible aggregate reference-price reconstruction;
   - investor-type segmentation where available;
   - first-known timestamps and replayability;
   - external attention proxies separated from endogenous return/volume proxies;
   - redundancy controls versus price, volume, momentum, volatility, microstructure and event/news families.
3. Do not promote to L3 until those data contracts are verifiably available and replayable.

## Canonical overlay 2026-10-03 21:40 Asia/Taipei
- Canonical tracker: all D20-01 through D20-13 are L2 / 40%.
- D20 aggregate maturity: 40.0%.
- Foundation phase complete: mechanism + falsification only.
- Next phase: L2 -> L3 Taiwan PIT/replay feasibility.
- Priority: D20-08 event drift, D20-06 herding identifiability, D20-10 investor sentiment, D20-13 arbitrage constraints, D20-11 narrative diffusion.
- Do not repeat L0/L1 foundation work.
- Formal Core unchanged.

## Canonical overlay 2026-10-04 03:05 Asia/Taipei
- D20-08 monthly-revenue event-clock validation advanced; maturity remains L2 / 40%.
- Official correction workflow supports a version chain: correction disclosure contains before/after values, followed by revenue re-announcement.
- TWSE company-information records show correction disclosures with publication timestamps to the second.
- correction_first_known is a viable clock candidate.
- original issuer_submission_first_known remains unresolved for large-scale replay and must not be inferred from filing deadlines or aggregate snapshot dates.
- Historical original and corrected values must remain separate vintages.
- Next: audit at least 30 correction events across market segments, years and publication times; trace each correction to its original revenue version and measure timestamp coverage.
- If the original clock remains unavailable, record the source blocker and rotate to D20-06 data feasibility.
- Formal Core remains locked; no optimization candidate.

## Canonical overlay 2026-10-04 03:05 Asia/Taipei — D20-06
- Taiwan herding evidence confirms that investor-type, direction and timing data materially improve behavioral identification.
- Public investor-category net flows are weak proxies because they cannot identify within-category imitation or leader/follower structure.
- Intraday transaction/order-book data with investor classification are strong candidates, but system-accessible PIT/replay availability is not yet proven.
- Social stance is also only a candidate unless first-known, edit/delete history, account deduplication and common-news controls are replayable.
- D20-06 remains L2 / 40%; no L3 promotion.
- Next: inventory actually accessible investor-type/high-frequency/social data. If no independent replayable source exists, retain UNKNOWN and do not create a duplicate crowding factor.
- Formal Core remains locked; no optimization candidate.

## Canonical overlay 2026-10-04 07:31 Asia/Taipei — D20 crossed 50%
- D20 aggregate maturity: 50.8%.
- L3 / 60%: D20-02, D20-04, D20-05, D20-07, D20-08, D20-10, D20-12.
- L2 / 40% retained: D20-01, D20-03, D20-06, D20-09, D20-11, D20-13.
- Promotion meaning is Taiwan PIT/replay data feasibility only; no alpha, OOS or Formal claim.
- D20-02 promotion is bounded to the TWSE short-side disposition sublane; direct long-account PGR/PLR remains UNKNOWN.
- D20-04/D20-05 use validated Taiwan daily history with corporate-action/session fail-closed guards.
- D20-07 uses official exchange attention designation as a salience-event source with endogeneity controls.
- D20-08 uses only valid D11-09/D17-13 event receipts; unresolved original monthly-revenue first-known rows stay UNKNOWN.
- D20-10 uses dated monthly Taiwan investor-survey releases; no daily interpolation.
- D20-12 freezes a common-cutoff falsification receipt linking behavioral proxy and structural counterfactuals without duplicate primitive votes.
- Formal Core remains locked; FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Exact next: accumulate outcome-blind replay/coverage receipts for the seven L3 lanes. Do not force the six remaining L2 modules upward unless their independent source/identifiability blockers are truly resolved.

## Canonical overlay 2026-10-04 08:52 Asia/Taipei — L4 prospective phase frozen
- D20 maturity remains 50.8%; no L4 promotion.
- Canonical L4 prerequisite: genuine post-preregistration Prospective Shadow or valid OOS evidence.
- New preregistration:
  - research/d20_l4_prospective_shadow_prereg_v0_1.json
  - research/D20_L4_PROSPECTIVE_SHADOW_PREREG_20261004_V0_1.md
- 2025-12 through 2026-09 Cathay monthly sentiment × adjusted-0050 pilot is permanently quarantined:
  DEVELOPMENT_ONLY_CONTAMINATED / NOT_PROMOTION_GRADE.
- Development pilot is useful only as falsification/design evidence: sentiment LEVEL and CHANGE are separated; no bullish sign is assumed; prior market return/volatility become mandatory controls.
- Promotion-grade parent collection starts only after the 2026-10-04 08:52 freeze.
- D20-10 minimum L4 gate: 6 independent post-freeze monthly releases and >=2 regimes.
- D20-07: >=20 independent dates and >=100 treated events with matched controls.
- D20-04/05: >=12 independent weekly dates; D20-05 must survive D20-04/D03 residual controls.
- D20-02: >=12 independent weekly TWSE short-side dates; TPEx/long-account gaps remain UNKNOWN.
- D20-08: >=12 independent event dates with valid first-known/capture clocks and frozen D1/D5/D20 windows.
- D20-12: >=20 prospective discriminating cases with common-cutoff structural counterfactuals.
- Exact next: collect immutable post-freeze parent receipts only. Do not open each parent’s outcome until the parent/specification fingerprint is frozen. No historical Shadow fabrication.
- Formal Core locked; FORMAL_OPTIMIZATION_CANDIDATE = NONE.

## Canonical overlay 2026-10-04 11:40 Asia/Taipei — D20 53.8%
- D20 aggregate maturity: 53.8%.
- L3 / 60%: D20-01, D20-02, D20-04, D20-05, D20-07, D20-08, D20-09, D20-10, D20-12.
- L2 / 40%: D20-03, D20-06, D20-11, D20-13.
- D20-01 promotion is bounded to TWSE short-side reference dependence using the exact D20-02 short-position/reference-price receipt. Pure loss aversion is NOT identified; no duplicate vote.
- D20-09 promotion is bounded to event-conditioned initial-response residuals using valid event clocks/surprise plus completed causal 15m bars. D03-05 still owns observable reversal; later reversal is forbidden from the parent.
- D20-13 is L3-ready but remains L2 until the first genuine trading-day TWSE rate/displayed-supply receipt validates the frozen source contract. True utilization remains UNKNOWN.
- D20-03 stays L2 because turnover/margin/volume cannot identify overconfidence.
- D20-06 stays L2; new D06-19 owns any future direct natural-person primitive, but stock×date natural-person directional flow is currently UNKNOWN.
- D20-11 stays L2 because no versioned replayable social-language narrative-diffusion stream is validated.
- L4 preregistration was extended at 2026-10-04 11:40 to cover D20-01 and D20-09 prospectively. No L4 promotion.
- Remaining blocker audit: research/d20_remaining_l2_blocker_audit_20261004_v0_1.json
- Exact next: on the next valid Taiwan trading day, first try to close D20-13 L3 with the frozen live TWSE borrow-rate/displayed-supply receipt. In parallel begin post-freeze parent capture for all nine L3 lanes. No historical Shadow fabrication.
- Formal Core locked; FORMAL_OPTIMIZATION_CANDIDATE = NONE.

## D20-13 first-live source capture freeze｜2026-10-04 11:40 Asia/Taipei
- Protocol: research/d20_13_first_live_twse_borrow_constraint_capture_v0_1.json
- TWSE SBL service hours verified as 09:00-15:30.
- First genuine post-freeze trading day target slots are fixed at 09:15, 12:00 and 15:20 Asia/Taipei, each with ±5-minute tolerance.
- Missing capture inside a slot stays MISSING/UNKNOWN; no later substitute snapshot.
- Purpose is source/PIT certification only. Outcomes remain locked.
- D20-13 remains L2 until at least one genuine slot receipt passes source/timestamp/schema/hash/UNKNOWN checks.



## 00 routed H06 counterpart delta — 2026-10-04

H06 control-plane status:
`PARTIAL_EVIDENCE_RECEIVED / ROOM05_COMPLETE / ROOM13_COUNTERPART_REQUIRED`.

Accepted Room05 packet:
`research/d06_h06_crowding_vs_herding_room05_packet_v0_1.md`.

Do not repeat D06 crowding research. Room13 only needs to close the behavioral-identifiability delta for D20-06:
- at least one independent behavior-specific observable or replayable residual-herding construct beyond holdings/flow/financing/ownership crowding primitives;
- PIT/first-known/replay semantics;
- common-information, market/sector/factor, passive-flow and liquidity controls;
- leader/follower or social/network evidence if used;
- a divergent case where D20-06 is active while D06-06 crowding is not simply high;
- confirmation that the same D06 primitive cannot become a second behavioral vote.

If no such independent PIT-capable source exists, return EVIDENCE_INSUFFICIENT / narrowing-or-merge-eligible. Do not invent behavioral intent.

This routed task does not override the room's active L4 prospective sequence; service it at the next safe governance/research slot.


## 00 routed H07 / H12 counterpart deltas — 2026-10-04

### H07 — D03-05 vs D20-09

Room03 side is accepted:
`research/D03_PULLBACK_REVERSAL_OBSERVABLE_PIT_V0_2.md`.

Do not repeat observable pullback/reversal geometry or PIT sequence.

Room13 remaining delta:
- prove D20-09 behavioral overreaction using independent behavioral/event-expectation evidence beyond the completed reversal path;
- falsify bid-ask bounce, liquidity provision, inventory, forced flow, event correction, volatility normalization and price-limit/microstructure alternatives;
- provide PIT sequence and divergent states;
- if D20-09 remains only “extreme return then reversal”, return narrowing/merge-eligible rather than a second behavioral vote.

### H12 — D06/D14/D20 shorting chain

Room05 side is accepted:
- D06-09 = observed borrowing/short quantities;
- D06-18 = borrow fee / supply-demand / availability / scarcity economics;
- one primitive receipt; no duplicate bearish vote;
- true utilization UNKNOWN without verified lendable inventory.

Room13 remaining delta:
- D20-13 must own limits-to-arbitrage / noise-trader-risk context only;
- show residual explanatory role after D06 borrow economics and D14 execution feasibility;
- no fourth directional vote from the same borrow scarcity/fee observation;
- provide divergent states and falsification.

These routed tasks do not override the room's active prospective L4 sequence; service at the next safe governance slot.

## Canonical overlay 2026-10-04 14:06 Asia/Taipei — D20 56.9%
- D20 aggregate maturity: 56.9%.
- L3 / 60%: D20-01, D20-02, D20-04, D20-05, D20-06, D20-07, D20-08, D20-09, D20-10, D20-11, D20-12.
- L2 / 40%: D20-03, D20-13.
- D20-06 L3 is bounded to aggregate public-forum social-herding / stance-convergence. PTT handles are not brokerage investor identities.
- D20-11 L3 is bounded to prospective PTT Stock narrative/topic/stance diffusion with append-only captured versions.
- Shared PTT primitive cannot create independent votes across D20-06 / D20-07 / D20-11.
- Derived social research is aggregate-only; no named-user psychology, persuasion or influence profile.
- D20-03 remains L2: public forecast error does not identify overconfidence without stated confidence/uncertainty or a near-direct proxy.
- D20-13 remains L3-ready / L2 pending first genuine TWSE borrow-rate/displayed-supply live receipt.
- D20-06/D20-11 L4 prospective extension frozen at 2026-10-04 14:06:56 Asia/Taipei; earlier inspected social pages are L3 source evidence only.
- Exact next: next valid Taiwan trading day first attempt D20-13 live receipt. In parallel collect only post-extension aggregate PTT parents for D20-06/D20-11 and post-freeze parents for all other L3 lanes. No historical Shadow fabrication.
- Formal Core locked; FORMAL_OPTIMIZATION_CANDIDATE = NONE.

## Canonical overlay 2026-10-04 14:12 Asia/Taipei — D20 58.5%
- D20 aggregate maturity: 58.5%.
- L3 / 60%: D20-01, D20-02, D20-03, D20-04, D20-05, D20-06, D20-07, D20-08, D20-09, D20-10, D20-11, D20-12.
- L2 / 40%: D20-13 only.
- D20-03 L3 is bounded to public explicit-confidence calibration in structured public forecasts. Psychological trait overconfidence and actual trading remain unproven.
- No named-user psychology/skill/influence profile is permitted; derived evidence is aggregate only.
- D20-03 L4 prospective extension frozen at 2026-10-04 14:12:14 Asia/Taipei.
- D20-06/D20-11 aggregate social L4 extension remains frozen at 2026-10-04 14:06:56 Asia/Taipei.
- Exact next: next valid Taiwan trading day execute D20-13 first-live TWSE borrow-rate/displayed-supply source capture under frozen 09:15 / 12:00 / 15:20 slots. If at least one slot receipt passes all source/PIT/schema/fingerprint/UNKNOWN gates, reassess bounded TWSE-only L3 promotion.
- Formal Core locked; FORMAL_OPTIMIZATION_CANDIDATE = NONE.



## 00 control-plane receipt — H06 / H07 closures

H06 is CLOSED_NO_STRUCTURAL_CHANGE:
- D06-06 owns observable crowding.
- D20-06 owns bounded PIT-capable public-forum social-herding only after common-news/topic/attention/market-sector controls.
- one PTT receipt cannot become independent D20-06/D20-11/D20-07 votes.
- D20-06 remains L3/60%.

H07 is CLOSED_NO_STRUCTURAL_CHANGE:
- D03-05 owns observable pullback/reversal path.
- D20-09 owns only event-conditioned candidate-overreaction parent before later reversal.
- reversal cannot be used inside the D20 decision-time parent.
- unresolved structural alternatives => behavioral cause UNKNOWN.
- D20-09 remains L3/60%.

Audits:
- shared-knowledge/CURRICULUM_H06_DEPENDENCY_ANTI_ORPHAN_AUDIT_20261004_V0_1.md
- shared-knowledge/CURRICULUM_H07_DEPENDENCY_ANTI_ORPHAN_AUDIT_20261004_V0_1.md

Do not repeat the ownership studies unless contradictory evidence appears.

## Canonical overlay 2026-10-04 16:35 Asia/Taipei — first genuine L4 prospective parents
- D20 maturity remains 58.5%; no L4 promotion.
- First genuine post-freeze social parent: `research/d20_social_prospective_parent_20261004_001.json`.
- Parent `D20SOC-20261004-001`: one participant, zero replies at capture; retained as a zero-herding / initial-narrative observation rather than selected away.
- D20-06 coverage: 1 / 50 aggregate parents, 1 / 20 independent dates, 0 multi-actor sequence parents.
- D20-11 coverage: 1 / 50 narrative parents, 1 / 20 independent dates.
- D20-03 coverage: 0 / 100 qualifying parents, 0 / 20 independent dates.
- First observed post exposed an unmodeled explicit-uncertainty state. It remains ineligible under the prior taxonomy. `research/d20_03_confidence_taxonomy_amendment_v0_2.json` adds explicit uncertainty prospectively only after 2026-10-04 16:34:04.
- Social topic/stance classifier frozen in `research/d20_social_topic_stance_classifier_v0_1.json`; no named-user psychology/influence profile.
- D20-13 weekend dry-run: official TWSE informational source accessible; generic dynamic MIS extraction returned no content; exact free live rate/depth machine route remains unresolved. Weekend evidence is not promotion-grade.
- Next: continue post-freeze parent collection; on the next genuine Taiwan trading day execute D20-13 official-source attempts at 09:15 / 12:00 / 15:20 ±5 minutes.
- Formal Core locked; FORMAL_OPTIMIZATION_CANDIDATE = NONE.

## Canonical overlay 2026-10-04 16:43 Asia/Taipei — first stable promotion-grade social parent
- D20 remains 58.5%; no L4 promotion.
- Parent `D20SOC-20261004-001` is preserved but invalidated for promotion because V0.1 source fingerprint included transport/tool-wrapper metadata.
- Stable fingerprint contract: `research/d20_social_content_fingerprint_contract_v0_2.json`.
- Promotion-grade replacement parent: `D20SOC-20261004-002` at 16:43:58.
- V0.2 canonical page-text SHA-256 immediate repeatability = PASS.
- Coverage: D20-06 = 1/50 parents, 1/20 dates, 0 multi-actor sequences; D20-11 = 1/50 parents, 1/20 dates; D20-03 = 0/100 parents, 0/20 dates.
- D20-13 weekend dry-run remains non-promotion-grade; live official rate/depth receipt = 0.
- Exact next: continue only new prospective social parents/outcomes; next genuine Taiwan trading day execute D20-13 frozen live-capture slots.
- Formal Core locked.

## Canonical overlay 2026-10-04 16:47 Asia/Taipei — deterministic primary social sampling
- D20 maturity remains 58.5%; no L4 promotion.
- Final selection-bias audit reclassifies `D20SOC-20261004-002` as SECONDARY_PROSPECTIVE_PROCESS_SAMPLE. Its source/hash validity remains PASS, but its ad hoc manual capture time is not a primary L4 sampling clock.
- Primary social sampling contract: `research/d20_social_sampling_coverage_contract_v0_1.json`.
- Primary eligibility begins only with an actually executed Room13 fixed :10 scheduled research-run snapshot after the 16:47 freeze.
- Central rotation-disabled/missed hours remain UNKNOWN; no backfill.
- Finite Atom-feed windows require adjacent article-ID overlap or another frozen continuity proof.
- Every newly first-observed entry from a valid primary snapshot is included regardless of topic/stance/engagement/outcome; zero-engagement observations stay in the cohort.
- Current PRIMARY coverage: D20-03 = 0; D20-06 = 0; D20-11 = 0.
- Current SECONDARY process coverage: D20-06 = 1; D20-11 = 1.
- D20-13 live source receipts = 0.
- Exact next: first actually executed Room13 :10 scheduled social snapshot becomes the first candidate primary capture; next genuine Taiwan trading day separately executes D20-13 09:15 / 12:00 / 15:20 ±5m official-source capture.
- Formal Core locked; FORMAL_OPTIMIZATION_CANDIDATE = NONE.
