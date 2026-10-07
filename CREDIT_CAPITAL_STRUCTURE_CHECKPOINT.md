# Credit / Capital Structure Checkpoint

Updated: 2026-10-05 07:18 Asia/Taipei
Scope: D22｜信用市場／資本結構／融資壓力／股債傳導
Status: ACTIVE_RESEARCH / D22 51.7% / D22-05_STAGE_A_CHALLENGER_GATE_PASSED_BASELINE_BLOCKED / D22-04_06_FAIR_VALUE_LANE_PARTIAL_UNBLOCK_L2 / OUTCOMES_CLOSED / FORMAL_CORE_UNCHANGED

## Governance
- Canonical continuation checkpoint for D22.
- GitHub latest main + tracker + dedicated evidence files are authoritative.
- Formal Core remains LOCKED.
- Missing evidence remains UNKNOWN; never coerce missing bond/rating/covenant/facility/trade/source-time data to zero, bad or pass.
- No equity-outcome opening, threshold search, sign flipping, synthetic maturity-bucket splitting, historical Shadow fabrication or latest-restatement backfill.
- D07 accounting primitives, D13 risk-free rates, D22 maturity/coverage/net-debt/debt-cost transforms are dependency-linked and must not become duplicate votes.

## D22-01｜Debt Maturity Wall / Refinancing Schedule
Level: L3 / 60%.
Status: WAITING_MULTI_ISSUER_MULTI_DATE_PANEL / OUTCOMES_CLOSED.

Durable conclusion:
- Taiwan issuer/date contractual maturity evidence is PIT-replayable.
- Carrying current debt and contractual maturity cash flows are alternate representations, not additive.
- Entity scope and accounting basis must be tagged.
- Total contractual obligations are not the financing wall.
- A maturity wall is exposure, not default prediction.
- Equity outcomes remain closed because the independent-date panel is still too small for OOS/walk-forward/regime claims.

Durable files:
- `research/d22_01_maturity_replay_v0_1.json`
- `research/d22_01_incremental_value_prereg_v0_1.json`
- `research/d22_01_scope_and_double_count_audit_v0_1.json`
- `research/d22_01_d07_baseline_readiness_v0_1.json`
- `research/d22_01_d13_baseline_readiness_v0_1.json`
- `research/d22_01_pre_outcome_eligibility_v0_1.json`

## D22-02｜Interest Coverage / Debt Service
Level: L3 / 60%.
Status: CROSS_INDUSTRY_MULTI_DATE_TAIWAN_PIT_REPLAY_VALIDATED / OUTCOMES_CLOSED.

Durable conclusion:
- Universal ICR distress thresholds such as 1.5x/2x/3x are prohibited without Taiwan cross-sector PIT evidence.
- Numerator/denominator source taxonomy matters: debt interest, lease interest, other finance cost, total finance cost and cash interest are distinct.
- Negative/near-zero EBIT or near-zero interest denominator requires explicit distress/undefined handling.
- High ICR does not eliminate a near-term principal maturity wall.

New multi-date replay:
- UMC 2023 and Taiwan Cement 2023 remain semantic cross-industry examples.
- Chunghwa Telecom 2023 official 20-F accepted 2024-04-17T06:05:47Z: operating income NT$46,353m, accounting interest expense NT$319m, accounting coverage about 145.31x.
- Chunghwa Telecom 2024 official 20-F accepted 2025-04-16T06:02:44Z: operating income NT$46,873m, accounting interest expense NT$339m, accounting coverage about 138.27x.
- The same issuer retains very high accounting coverage while its <1y financing maturity wall grows materially, proving D22-02 does not subsume D22-01.

Durable files:
- `research/d22_02_interest_coverage_contract_v0_1.json`
- `research/d22_02_interest_coverage_replay_v0_1.json`

## D22-03｜Net Debt / Leverage Structure
Level: L3 / 60%.
Status: TAIWAN_PIT_COMPONENT_REPLAY_VALIDATED / VERSION_LINEAGE_FROZEN / OUTCOMES_CLOSED.

Boundary:
- D07-06 owns accounting balance-sheet/leverage primitives.
- D22-03 owns credit/funding structure after liquidity-quality classification.
- Gross debt + cash primitives are shared receipts; D22-03 cannot count the same ratio again as a new credit vote.
- Net debt is derived, never a source fact.
- Restricted/pledged/unavailable cash remains separate or UNKNOWN.
- Carrying debt and D22-01 contractual maturity cash flow are not additive.

Divergent-state falsification:
- Chunghwa Telecom 2023: cash NT$33,824m; gross interest-bearing debt excl. lease about NT$32,685m; derived net debt about -NT$1,139m; contractual <1y financing about NT$2,200m; wall/cash about 6.5%.
- Chunghwa Telecom 2024: cash NT$36,260m; gross interest-bearing debt excl. lease about NT$32,415m; derived net debt about -NT$3,845m; contractual <1y financing about NT$9,200m; wall/cash about 25.4%.
- Headline net cash improved while near-term contractual financing concentration rose sharply. Therefore negative net debt is not sufficient evidence of low near-term refinancing pressure.

Third exact-known issuer:
- ASE Technology Holding 2023 first-known consolidated full-year state was publicly filed on 2024-02-01.
- First-known values include cash NT$67,284m; short-term borrowings NT$53,042m; current portion of bonds/long-term borrowings NT$28,616m; non-current bonds NT$20,489m; non-current long-term borrowings NT$81,365m; derived gross interest-bearing debt NT$183,512m and derived net debt NT$116,228m.
- Reported net-debt/equity ratio was 0.38; unused credit lines were NT$373,763m, but commitment/drawability quality is not assumed.

Version-lineage falsification:
- A later comparative filing retrospectively adjusted ASE 2023 short-term borrowings to about NT$37,737m.
- Historical replay preserves the 2024-02-01 first-known state and appends later revisions; it never backfills later restated values into the earlier state.

Durable files:
- `research/d22_03_net_debt_leverage_structure_contract_v0_1.json`
- `research/d22_03_net_debt_component_replay_v0_1.json`
- `research/d22_03_version_lineage_v0_1.json`

## D22-04｜Cost of Debt / Refinancing Risk
Level: L2 / 40%.
Status: MECHANISM_AND_FALSIFICATION_DEFINED / TAIWAN_SOURCE_ROUTE_FEASIBLE / OUTCOMES_CLOSED.

Ownership boundary:
- D13-06 owns sovereign/risk-free yield-curve state.
- D22-04 owns issuer-specific debt cost, refinancing spread/premium and repricing interaction with actually exposed debt.
- D07-18 owns the enterprise WACC composite and must not count the same rate/debt-cost shock again.

Frozen semantics:
- Legacy coupon != current market yield != prospective refinancing cost.
- Accounting effective cost is backward-looking and can be distorted by mix/timing/capitalized interest/lease/fees/FX.
- Market yield can embed credit, liquidity, option and technical effects; stale/no-trade observations remain UNKNOWN.
- Issuer spread requires currency/duration-consistent benchmark matching.
- Prospective refinancing cost is contingent on actual refinancing; cash repayment, pre-funding or channel changes can remove assumed rollover.

Taiwan source route:
- TPEx supports corporate-bond trade/quote data, yield/price files, reference rates, fair values and yield-curve files.
- The source route is feasible, but issuer-security-date clean replay has not yet passed L3.

Chunghwa Telecom mechanism example:
- Existing bonds carried very low legacy coupons around 0.42%-0.69%, including an NT$8.8bn 0.50% tranche maturing in July 2025.
- Low legacy coupon can keep historical interest expense low while saying little about the future replacement rate.
- The actual future refinancing rate remains UNKNOWN until a replacement transaction or PIT market proxy is defined.

Durable file:
- `research/d22_04_cost_of_debt_refinancing_risk_contract_v0_1.json`

## System-use status
- No D22-01 through D22-04 finding is authorized for System 1 or System 2 Formal use.
- Current candidate state: FALSIFICATION_IN_PROGRESS.
- FORMAL_OPTIMIZATION_CANDIDATE threshold has NOT been reached.

## Exact next continuation
Primary active module: D22-04.
1. build Taiwan corporate-bond issuer-security-date PIT debt-cost receipts from TPEx, tagging actual trade / quote / reference / fair-value provenance;
2. match each issuer/security yield to a currency- and remaining-maturity-consistent sovereign benchmark;
3. preserve no-trade/stale states as UNKNOWN;
4. construct research-only refinance-gap challengers: matched market yield minus legacy coupon/effective cost, interacted with D22-01 actually repricing principal;
5. test divergent states: stable benchmark + wider issuer spread; rising benchmark + stable spread; high maturity wall + cash repayment/no refinancing;
6. keep equity outcomes CLOSED until cross-issuer/multi-date replay and D13/D22-01/D22-02/D22-03 redundancy controls are ready;
7. in parallel continue D22-01~03 multi-date/version-lineage panel expansion.

## 2026-10-04 08:50 continuation｜D22-05 through D22-12 mechanism/falsification phase complete

### Domain maturity
D22 = 45.0%.
- D22-01: L3 / 60%
- D22-02: L3 / 60%
- D22-03: L3 / 60%
- D22-04: L2 / 40%
- D22-05: L2 / 40%
- D22-06: L2 / 40%
- D22-07: L2 / 40%
- D22-08: L2 / 40%
- D22-09: L2 / 40%
- D22-10: L2 / 40%
- D22-11: L2 / 40%
- D22-12: L2 / 40%

This promotion is a completed mechanism-and-falsification stage, not a predictive-alpha claim. Equity outcomes remain CLOSED.

### D22-05｜Credit Rating / Rating Migration
- Freeze issuer rating, issue rating, outlook, watch/review, upgrade/downgrade and withdrawal as separate event types.
- A downgrade may be anticipated by equity/credit prices or prior watch/outlook. Downgrade is not automatically a new bearish signal.
- Rating-agency/event publication timestamp is the PIT clock; later rating-history tables cannot backfill earlier states.
- Durable file: `research/d22_05_credit_rating_migration_contract_v0_1.json`.

### D22-06｜Credit Spread / Bond Yield
- Corporate spread is not pure PD. It can contain expected loss, systematic risk premium, liquidity, option/technical/tax effects and noise.
- Actual trade, quote, reference rate and fair value are distinct provenance classes.
- No-trade/stale observations remain UNKNOWN; benchmark currency/duration mismatch blocks clean spread construction.
- TPEx provides a feasible Taiwan source route, but issuer-security-date replay is still pending.
- Durable file: `research/d22_06_credit_spread_bond_yield_contract_v0_1.json`.

### D22-07｜Liquidity / Covenant / Default Risk
- Cash availability, committed facility drawability, covenant type/cushion, breach, waiver and cross-default are separate states.
- Covenant breach is not equivalent to default; waiver/renegotiation is a competing path.
- If ICR is itself a covenant metric, D22-02 owns the primitive ratio and D22-07 owns only the contractual trigger/cushion transformation.
- Durable file: `research/d22_07_liquidity_covenant_default_contract_v0_1.json`.

### D22-08｜Fixed / Floating Rate Exposure
- Floating debt transmits benchmark changes faster; fixed debt delays current cash-flow pass-through but can create a rollover cliff.
- Reset index/frequency, floor/cap, maturity and hedge notional/maturity are required; fixed/floating share alone is insufficient.
- D13 owns the rate move, D22-08 owns exposure/transmission, D22-04 owns replacement cost, D22-01 owns maturity amount/timing.
- Durable file: `research/d22_08_fixed_floating_rate_exposure_contract_v0_1.json`.

### D22-09｜Equity-Credit Divergence
- No default assumption that credit leads equity. Literature supports equity-leading, credit-leading and bidirectional states depending on liquidity/information regime.
- Divergence requires session-aligned fresh equity and credit observations; a stale bond mark cannot be compared naively with a live equity close.
- Lead/lag windows must be preregistered before outcomes are opened.
- Durable file: `research/d22_09_equity_credit_divergence_contract_v0_1.json`.

### D22-10｜Capital Structure / Funding Mix
- Trade-off, pecking-order, market-timing and agency/debt-overhang mechanisms can coexist; no single theory gets default authority.
- Funding mix is a vector: internal cash, bank debt, bonds, private debt, convertibles, equity, seniority/security, currency, maturity and rate type.
- More debt is not automatically worse; more equity is not automatically safer.
- D07 owns accounting leverage; D11 owns financing event identity; D22-10 owns financing-structure transformation/sequencing.
- Durable file: `research/d22_10_capital_structure_funding_mix_contract_v0_1.json`.

### D22-11｜Credit Cycle / Bank Lending Conditions
- Loan growth alone cannot identify credit supply because demand and supply are confounded.
- Bank standards/pricing/terms and bank-to-bond substitution are candidate supply-state evidence.
- D13 owns policy/risk-free rates; D22-11 owns incremental bank-credit availability/terms.
- Aggregate credit state only maps to issuer risk when pre-known bank dependence/funding mix is evidenced.
- Durable file: `research/d22_11_credit_cycle_bank_lending_contract_v0_1.json`.

### D22-12｜Distress / Recovery / Equity Tail Risk
- PD, LGD/recovery, distress state and equity tail risk are distinct objects.
- Merton/distance-to-default is a structural model-dependent proxy, not true observed PD.
- Recovery is state/seniority/collateral dependent; one universal recovery percentage is prohibited.
- Distress does not guarantee future stock underperformance; literature is mixed and primitive-input/issuance redundancy must be tested.
- Inputs shared with D07/D22-02/03/06 are one primitive family, not multiple independent votes.
- Durable file: `research/d22_12_distress_recovery_tail_risk_contract_v0_1.json`.

### Second-stage blocker and continuation
D22-04 is deliberately held at L2 because a clean Taiwan issuer-security-date historical market-yield replay has not yet been validated. The dynamic TPEx query route was unavailable in this run, so no synthetic market-yield history was fabricated.

Exact continuation:
1. D22-04 + D22-06: security-level TPEx multi-date replay with actual-trade/quote/reference/fair-value provenance and benchmark matching.
2. D22-05: rating-event PIT replay with prior watch/outlook and market-anticipation controls.
3. D22-07 + D22-08: covenant/facility and fixed-floating/reset/hedge PIT issuer panels.
4. D22-09~12: move to L3 only after their required upstream data families become independently replayable.
5. Equity outcomes stay CLOSED; Formal Core stays LOCKED.

## 2026-10-04 13:45 continuation｜D22 reaches 50% via three new L3 PIT replay validations

### Domain maturity
D22 = 50.0%.

L3 / 60%:
- D22-01 Debt Maturity Wall / Refinancing Schedule
- D22-02 Interest Coverage / Debt Service
- D22-03 Net Debt / Leverage Structure
- D22-05 Credit Rating / Rating Migration
- D22-08 Fixed / Floating Rate Exposure
- D22-10 Capital Structure / Funding Mix

L2 / 40%:
- D22-04 Cost of Debt / Refinancing Risk
- D22-06 Credit Spread / Bond Yield
- D22-07 Liquidity / Covenant / Default Risk
- D22-09 Equity-Credit Divergence
- D22-11 Credit Cycle / Bank Lending Conditions
- D22-12 Distress / Recovery / Equity Tail Risk

Equity outcomes remain CLOSED. Formal Core remains unchanged.

### D22-05｜rating-event PIT replay validated
Durable file:
- `research/d22_05_rating_event_replay_v0_1.json`

Evidence family:
- Formosa Chemicals & Fibre: 2023 outlook Stable→Negative, then 2025 formal downgrade twAA→twAA-.
- Wan Hai: 2020 Negative outlook, 2021 Stable, 2021 Positive, then 2022 formal upgrade.
- TCC: 2022 Stable→Negative outlook and 2024 Negative→Stable with the same issuer rating.

Key falsification:
- Outlook/watch/formal downgrade within one deterioration episode cannot be counted as independent repeated negative votes without anticipation/event-clustering controls.
- A rating action is not a stock-direction signal by itself.
- Issuer and issue ratings remain separate evidence classes.

Status:
L3 / TAIWAN_PIT_RATING_EVENT_REPLAY_VALIDATED / ANTICIPATION_CONTROL_REQUIRED / OUTCOMES_CLOSED.

### D22-08｜fixed/floating/repricing PIT replay validated
Durable file:
- `research/d22_08_rate_exposure_replay_v0_1.json`

Evidence family:
- TSMC official quarterly filings: all short-term debt floating at one historical state; majority of long-term debt fixed; later filing independently confirms majority fixed-rate debt.
- UMC 2023 first unsecured straight corporate bond: NT$10bn, five-year, fixed 1.62%, no collateral/put/call.
- Chunghwa Telecom 2023/2024 filings: non-fixed loan exposure sensitivity to +/-25 bp changes and no interest-rate derivatives; two independently timestamped annual states.

Key falsification:
- Fixed/floating share alone does not determine risk. Reset timing, maturity, floors/caps, hedges and principal actually exposed to repricing matter.
- Benchmark rate movement belongs to D13; D22-08 owns exposure/transmission only.
- Missing principal/reset/hedge details remain UNKNOWN.

Status:
L3 / TAIWAN_PIT_RATE_EXPOSURE_REPLAY_VALIDATED / OUTCOMES_CLOSED.

### D22-10｜funding-mix event PIT replay validated
Durable file:
- `research/d22_10_funding_mix_event_replay_v0_1.json`

Evidence family:
- TSMC multiple 2023 domestic unsecured bond issuances with tranche amount, tenor, coupon and use-of-proceeds states.
- UMC 2023 NT$10bn five-year 1.62% unsecured green bond state.
- Chunghwa Telecom 2022 board-approval→pricing lineage and later 2025 sustainability-bond pricing, preserving separate approval/pricing states.

Key falsification:
- Financing event identity belongs to D11; D22-10 owns funding-source/tenor/seniority/cost/use-of-proceeds transformation.
- Debt issuance is not automatically bad; equity issuance is not automatically safe.
- Approval, pricing and issuance are separate PIT states; later terms cannot backfill earlier approval states.

Status:
L3 / TAIWAN_PIT_FUNDING_EVENT_REPLAY_VALIDATED / D11_EVENT_IDENTITY_LINKED / OUTCOMES_CLOSED.

### D22-04 + D22-06｜held at L2 by design
Durable blocker file:
- `research/d22_04_06_tpex_market_data_access_audit_v0_1.json`

TPEx source route is validated for trade/quote/rate/fair-value/curve data, but a clean cross-issuer multi-date security-level historical replay was not independently extracted in this round.

Therefore:
- D22-04 stays L2.
- D22-06 stays L2.
- No synthetic yield/spread history.
- No stale-price forward fill.
- No fair value treated as an actual transaction.
- No duration/currency-mismatched spread promoted as clean credit spread.

### Exact next continuation
1. Break D22-04/D22-06 source blocker by acquiring/querying historical TPEx issuer-security-date observations with actual-trade/quote/reference/fair-value provenance.
2. Match corporate observations to currency- and duration-consistent sovereign benchmarks; keep no-trade/stale states UNKNOWN.
3. In parallel build D22-07 covenant/facility PIT replay, preserving maintenance/incurrence/cushion/breach/waiver/cross-default semantics.
4. D22-05/D22-08/D22-10 are now L3; expand their independent-date panels but do not open equity outcomes.
5. D22-09 remains downstream of D22-06; D22-11/D22-12 remain L2 until their own Taiwan PIT replay gates are satisfied.



## 00 control-plane receipt — H13 closure

00｜研究總控室 closed H13 as:
KEEP_SEPARATE / ACCOUNTING_PRIMITIVE_VS_CREDIT_FUNDING_TRANSFORM / SINGLE_BALANCE_SHEET_RECEIPT.

Canonical boundary:
- D07-06 = accounting balance-sheet/leverage primitive owner.
- D22-03 = credit/funding transform owner after liquidity-quality classification.
- net debt is derived, not source fact.
- contractual maturity wall is linked but not additive to carrying debt.
- later statement revisions append new vintages and never backfill earlier known states.

D22-03 remains L3/60%. No maturity, count or Formal change.

Audit:
shared-knowledge/CURRICULUM_H13_DEPENDENCY_ANTI_ORPHAN_AUDIT_20261004_V0_1.md

## 2026-10-04 15:12 continuation｜D22-07 L3 + D22-11/D22-12 falsification holds + L4 Stage-A prereg

### Domain maturity
D22 = 51.7%.

L3 / 60%:
- D22-01 Debt Maturity Wall / Refinancing Schedule
- D22-02 Interest Coverage / Debt Service
- D22-03 Net Debt / Leverage Structure
- D22-05 Credit Rating / Rating Migration
- D22-07 Liquidity / Covenant / Default Risk
- D22-08 Fixed / Floating Rate Exposure
- D22-10 Capital Structure / Funding Mix

L2 / 40%:
- D22-04 Cost of Debt / Refinancing Risk — historical TPEx security-level source blocked
- D22-06 Credit Spread / Bond Yield — historical TPEx security-level source blocked
- D22-09 Equity-Credit Divergence — downstream dependency on D22-06
- D22-11 Credit Cycle / Bank Lending Conditions — supply/demand identification blocked
- D22-12 Distress / Recovery / Equity Tail Risk — issuer-level default/recovery panel incomplete

Equity outcomes remain CLOSED. Formal Core remains LOCKED.

### D22-07｜Liquidity / Covenant / Default Risk — promoted to L3
Durable files:
- `research/d22_07_liquidity_covenant_default_contract_v0_1.json`
- `research/d22_07_liquidity_covenant_replay_v0_1.json`

PIT replay now spans:
- Chunghwa Telecom 2023 and 2024 unused secured/unsecured bank-line states;
- ASE 2024 cash/current-financial-assets/unused-credit-line state plus restrictive-covenant and cross-default semantics;
- UMC revolving-credit headroom plus a guarantee exposure that remained positive in Sep. 2025 and fell to zero after USC Xiamen prepaid the syndicated loan in Oct. 2025.

Falsification:
- Facility headline size is not cash and is not assumed committed/drawable without contract evidence.
- Covenant presence is not breach; breach is not default.
- Guarantee/covenant exposure can resolve through repayment or renegotiation.
- Later resolution must not backfill the earlier historical exposure state.
- Missing covenant threshold/cushion remains UNKNOWN.

### D22-11｜Credit Cycle / Bank Lending Conditions — HOLD L2
Durable file:
- `research/d22_11_credit_cycle_replay_readiness_v0_1.json`

Validated:
- CBC release-vintage five-major-bank new-loan pricing is PIT replayable across years;
- CBC private-enterprise funding surveys are release-vintage aggregate/industry context;
- issuer bank-dependence exposure can be replayed from first-known funding statements.

Not validated:
- a clean modern public Taiwan lending-standard / approval / collateral / quantity-supply shock series;
- separation of bank credit supply from borrower credit demand.

Therefore:
- loan growth alone cannot be called a supply shock;
- aggregate new-loan rates cannot be called issuer-specific credit spread;
- CBC context remains CONTEXT_ONLY unless interacted with independently known issuer exposure;
- D22-11 remains L2.

### D22-12｜Distress / Recovery / Equity Tail Risk — HOLD L2
Durable file:
- `research/d22_12_distress_recovery_replay_readiness_v0_1.json`

Validated:
- Taiwan Ratings publishes annual Taiwan corporate default/transition studies with long historical series;
- Taiwan default events are rare within the rated universe and many annual observations contain zero corporate defaults;
- TPEx exposes a public default-notice route from 2019-02;
- TWSE rules provide formal bankruptcy/restructuring delisting semantics.

Not validated:
- a reproducible issuer-level Taiwan default/restructuring/recovery panel with security seniority/collateral and dated recoveries;
- a complete historical universe including defaulted, delisted and unrated firms.

Therefore:
- default-event rarity and class imbalance are explicit;
- rated/surviving firms cannot define the whole sample;
- TPEx market-default notices cannot be mechanically relabeled issuer credit defaults;
- distance-to-default remains a model output, not observed PD;
- D22-12 remains L2.

### D22-04 / D22-06 source block
Official TPEx archive/data product schemas support the required transaction/rate/fair-value/curve fields, but the needed historical security-level dataset is a separate acquisition path. This room did not purchase or fabricate that history. D22-04 and D22-06 remain L2 and D22-09 remains downstream-blocked.

### L4 Stage-A preregistration
Durable file:
- `research/d22_l4_stage_a_incremental_value_prereg_v0_1.json`

Eligible L3 lanes:
D22-01 / 02 / 03 / 05 / 07 / 08 / 10.

Frozen rules before outcomes:
- exact common-support issuer-date comparison;
- one deterioration/refinancing episode cannot become multiple votes;
- fewer than 20 mature independent paired dates = ACCUMULATING only;
- frozen primary horizons D+5 / D+10 / D+20, later D+40 / D+60 after sufficient elapsed time;
- MFE / MAE path outcomes;
- one-time historical outcome opening after the population is frozen;
- leave-one-date-out / walk-forward, independent later dates or Prospective Shadow;
- UNKNOWN remains missing;
- every new threshold/window/classification is a new experiment;
- redundancy testing versus D07, D13, D11 and upstream D22 primitives;
- no Formal optimization from L4 evidence alone.

## Exact next continuation
1. Build an outcome-blind frozen common-support inventory for D22-01/02/03/05/07/08/10.
2. Count independent issuer-date/episode clusters; <20 remains ACCUMULATING.
3. Expand independent-date PIT receipts without opening equity returns.
4. Once a lane satisfies the pre-outcome gate, freeze the population/hash and open the preregistered outcomes once.
5. D22-04/06 remain source-blocked; D22-09 remains dependent on D22-06; D22-11/12 remain L2 until their identification/sample gates close.



## 00 routed H17 exact remaining D22-04 delta — 2026-10-04

H17 cost-of-capital chain is PARTIAL_EVIDENCE_RECEIVED.

Accepted boundary:
- D13-06 = risk-free/sovereign yield curve.
- D22-04 = issuer debt-cost/refinancing spread.
- D07-18 = enterprise WACC composite.

Room15 remaining D22-04 gate:
- issuer-security-date historical replay;
- actual trade / quote / reference / fair-value provenance class;
- currency- and remaining-maturity-consistent sovereign benchmark matching;
- stale/no-trade remains UNKNOWN;
- separate legacy coupon, accounting effective cost, current market yield and prospective refinancing cost;
- interact only with actually repricing/refinancing principal, not all debt mechanically;
- provide divergent states such as stable risk-free + widening issuer spread and rising risk-free + stable issuer spread.

No WACC/COE ownership transfers to D22-04. No Formal change.


## 00 routed COV-12 exact remaining delta — 2026-10-04

COV-12 has advanced from generic PENDING to:
`PARTIAL_EVIDENCE_RECEIVED / INSTRUMENT_LEVEL_SENIORITY_COLLATERAL_RECOVERY_WATERFALL_REPLAY_PENDING`.

Do not repeat D22-07 covenant/default or D22-12 generic distress/recovery theory.

Accepted:
- covenant/default/liquidity state-machine ownership under D22-07;
- PD / LGD-recovery / distress / equity-tail-risk separation under D22-12;
- Taiwan default/delisting source routes;
- rare-event, survivorship and recovery-missingness safeguards.

Exact remaining specialist delta:
1. freeze secured / unsecured / subordinated claim ranking;
2. freeze collateral package, guarantees and structural subordination;
3. define recovery waterfall as post-default claim allocation, separate from D22-07 default trigger;
4. produce at least one Taiwan issuer/security historical document-vintage replay with knownAt;
5. attach claim priority/collateral/guarantee to an actual default/restructuring/recovery lineage;
6. preserve private bank-loan ranking/collateral as UNKNOWN when undisclosed;
7. compare D22-12 vs D22-07 absorption boundary;
8. freeze anti-double-count versus D07 leverage and D21 pledging/control;
9. choose exactly one terminal recommendation;
10. commit `research/COV12_D22_SPECIALIST_RETURN_V0_1.md`.

No maturity or Formal change is authorized by this routing.

## 2026-10-04 21:09 continuation｜L4 Stage-A common-support inventory + D22-05 challenger gate

### D22 Stage-A inventory
Durable file:
- `research/d22_l4_stage_a_common_support_inventory_v0_1.json`

Current outcome-blind inventory:
- 58 raw L3 replay receipts;
- 52 receipts with exact challenger knownAt;
- 44 global unique issuer-date clusters after cross-module same-date dedup;
- 0 mature paired dates because exact B0/B1 baselines are not yet frozen on the same issuer-date population.

This zero is intentional. Challenger dates from different modules cannot be pooled to satisfy the >=20 rule, and global unique dates are descriptive only.

### D22-05 rating-event expansion
Durable files:
- `research/d22_05_rating_event_replay_v0_1.json`
- `research/d22_05_rating_episode_cluster_v0_1.json`
- `research/d22_05_stage_a_pairing_manifest_v0_1.json`

The rating-event replay now contains 29 exact directional events across 10 Taiwan non-financial issuers. The frozen outcome-blind episode rule clusters consecutive same-direction outlook/watch/notch events within an issuer until sign reversal.

After clustering:
- 29 directional event receipts;
- 22 independent directional episodes;
- challenger-side >=20 count gate = PASSED;
- baseline-frozen anchors = 0;
- mature paired anchors = 0;
- outcomes remain CLOSED.

The Stage-A manifest uses the first directional event of each episode as the only independent anchor. Later same-direction agency actions update the episode state but do not create extra samples.

### D22-04 / D22-06 source blocker refined
Durable audit:
- `research/d22_04_06_tpex_market_data_access_audit_v0_1.json`

New verified boundary:
- TPEx offers a free daily security-level corporate-bond fair-value/reference report;
- the official report exposes bond code, maturity, coupon, reference curve, fair value and yield;
- this provenance is MODEL/REFERENCE, not an actual trade;
- full historical after-market bulk files remain a separate acquisition/product path.

Therefore D22-04 and D22-06 remain L2. The blocker is narrower, not removed:
- free fair-value/reference lane is source-validated;
- reproducible multi-date security-level replay is still pending;
- actual trade/quote replay remains unavailable in the current research packet;
- fair value may never be relabeled as transaction evidence.

### Exact next continuation
1. D22-05: materialize exact B0/B1 PIT baselines for the 22 frozen episode anchors; current mature paired anchors remain 0.
2. Keep all equity return/MFE/MAE outcomes closed until >=20 anchors remain mature after exact baseline pairing.
3. D22-04/D22-06: materialize multiple independent-date TPEx free fair-value/reference reports through a reproducible transport path; keep provenance separate from trade/quote.
4. Continue common-support inventory expansion for D22-01/02/03/07/08/10.
5. No L4 or Formal promotion from challenger count alone.

## 2026-10-05 07:18 continuation｜Stage-A challenger gate passed; baseline blocker isolated

### D22-05｜Credit Rating / Rating Migration
Current level: L3 / 60%.
Stage-A challenger-side event pool:
- raw exact rating events: 29;
- frozen independent directional episodes: 22;
- issuer count: 10;
- challenger-side minimum 20: PASSED;
- baseline-frozen anchors: 0;
- mature paired anchors: 0;
- equity outcomes: CLOSED.

Durable files:
- `research/d22_05_rating_event_replay_v0_1.json`
- `research/d22_05_rating_episode_cluster_v0_1.json`
- `research/d22_05_stage_a_pairing_manifest_v0_1.json`
- `research/d22_05_stage_a_baseline_gap_audit_v0_1.json`
- `research/d22_l4_stage_a_common_support_inventory_v0_1.json`

Frozen episode rule:
- within one issuer, consecutive same-direction outlook/watch/notch changes remain one deterioration or recovery episode until direction reverses;
- only the first directional event date is the independent Stage-A anchor;
- later same-direction agency actions update the state but do not create additional independent samples;
- no return data were used to cluster events.

Baseline blocker:
- the repository does not yet contain one canonical exact-common-support B0/B1 baseline table covering the 22 frozen D22-05 anchors;
- D07 pre-event PIT fundamentals, D13 pre-event rate/macro context, size/liquidity and D11 event clocks must be frozen on the exact same issuer-anchorDate population;
- prior rating/outlook/watch states are ready;
- D22-06 market-credit baseline remains unavailable and is included only when available under the preregistration;
- existing D22-01-specific D07/D13 baseline receipts demonstrate architecture only and cannot be generalized/backfilled to the D22-05 event population.

Decision:
- HOLD L3;
- mature paired dates remain 0;
- do not open returns/MFE/MAE;
- do not call 22 challenger episodes 22 mature pairs.

### D22-04 / D22-06｜TPEx source blocker narrowed
TPEx official public evidence verifies a free security-level corporate-bond fair-value/reference report lane. A 2022-12-30 official report exposes bond code, maturity, coupon, reference curve, clean fair value and yield for multiple corporate bonds.

However:
- fair value/reference is model/reference evidence, not an actual transaction;
- reproducible multi-date public transport was not completed;
- historical actual trade/quote data remain unavailable in the current research packet;
- direct guessed URLs for additional dates could not be verified and are not treated as evidence of absence;
- no stale-price forward fill;
- no duration/currency/optionality-mismatched issuer spread.

Therefore D22-04 and D22-06 remain L2 / 40%.

### Exact next continuation
1. Build the D22-05 22-anchor exact B0/B1 baseline table without outcome labels.
2. Treat D07 general-industry PIT fundamentals as a live dependency; missing exact historical first-known values remain UNKNOWN and block the affected anchor.
3. Freeze D13 rate/macro, industry, size/liquidity and D11 event-clock controls on the exact same population.
4. Only if >=20 anchors remain mature after baseline pairing may the historical outcome join open once under the frozen Stage-A preregistration.
5. While D07 baseline dependency is blocked, continue the nonconflicting D22-04/D22-06 public TPEx fair-value multi-date transport search; never substitute fair value for actual trade.



## 2026-10-08 04:10 continuation｜D22-04/06 historical fair-value transport falsification

### Canonical state refresh
- Latest tracker: aggregate 22 domains / 356 modules / 47.4%; D22 remains 51.7%.
- D22-05 remains L3 / 60%; durable 22-anchor baseline receipt ledger exists with baselineFrozenAnchors=0, maturePairedAnchors=0, unknownBlockedAnchors=22. Do not rebuild the ledger and do not open outcomes.
- D22-04 and D22-06 remain L2 / 40%.

### New source falsification
- TPEx first-party materials confirm its own corporate-bond/financial-debenture fair-value series has been supplied daily since 2022-01-03 and is downloadable free of charge.
- The historical 2022-12-30 security-level fair-value PDF remains directly discoverable and includes bond code, maturity, coupon, reference curve, fair value and yield.
- Direct retrieval attempts for adjacent guessed archive names 2022-12-29, 2023-01-03 and 2023-01-04 were not accessible in this execution environment. Therefore the evidence supports historical-file existence but does NOT yet prove a deterministic filename/date transport rule or multi-date replayability.
- Fair value/reference yield remains model/reference evidence, never actual transaction evidence. Missing actual trade/quote history remains UNKNOWN.

### Hypothesis / counterevidence / failure conditions
- Support: a first-party daily fair-value program plus at least one old security-level archive means historical reference-price replay is plausible and the blocker is narrower than “no history exists”.
- Counterevidence: one archived date plus inaccessible adjacent guessed dates can arise from indexing/transport limitations, archive renaming, or access controls; it does not establish a stable public historical endpoint.
- Alternative explanation: search-engine discovery may expose isolated indexed files without exposing a complete archive denominator.
- Failure condition: if a reproducible multi-date issuer-security panel cannot be obtained with date provenance and staleness/optionality controls, D22-04/06 stay L2 and no issuer spread/refinance-gap candidate is promoted.

### Exact next continuation
1. Discover the TPEx report/API/download request used by the fair-value page rather than guessing archive filenames.
2. Replay at least three non-adjacent historical dates and preserve request URL/parameters, observedAt, report date and file hash.
3. Join repeated bond codes across dates; keep actual trade, quote, reference and fair value as separate provenance classes.
4. Only after stable multi-date replay, match currency/remnant-maturity sovereign benchmarks and test staleness/optionality; keep outcomes CLOSED.
5. In parallel, D22-05 should fill the existing 22-anchor baseline ledger from exact pre-event D07/D13/size-liquidity/D11 receipts; missing evidence stays UNKNOWN.

Formal Core remains LOCKED. No FORMAL_OPTIMIZATION_CANDIDATE is created.
