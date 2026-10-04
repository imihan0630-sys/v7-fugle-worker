# Credit / Capital Structure Research

Updated: 2026-10-04 21:09 Asia/Taipei
Scope: D22
Status: ACTIVE_RESEARCH / D22_01_02_03_05_07_08_10_L3 / D22_04_06_SOURCE_BLOCKED_L2 / D22_09_DEPENDENCY_BLOCKED_L2 / D22_11_12_HOLD_L2 / OUTCOMES_CLOSED / FORMAL_CORE_UNCHANGED

## D22-01｜Debt Maturity Wall / Refinancing Schedule

### Current maturity
L3 — Taiwan PIT data feasibility validated.

This means issuer/date contractual maturity evidence can be obtained, timestamped and replayed. It does not imply predictive alpha or Formal eligibility.

### Durable mechanism
Refinancing pressure is not accounting leverage. It depends on financing maturity timing/concentration, liquidity quality, refinancing channels, funding-cost/rate exposure, and contingent liquidity drains.

### 2026-10-03 scope / timing / double-count falsification
The replay seed exposed three data hazards before outcomes were opened:
1. Entity-scope contamination: the earlier Taiwan Cement receipt was parent-only while TSMC and UMC were consolidated. The primary cross-issuer replay now requires consolidated-group scope.
2. Double counting: balance-sheet current financing and contractual <1y financing cash flow are alternate representations. Never add them.
3. Same-calendar-date macro look-ahead: a U.S. Treasury yield observed after Taiwan information time cannot be used merely because the calendar date matches. D13 uses the latest completed U.S. session known before the Taiwan decision point.

### Revalidated replay state
- TSMC 2023: consolidated, IFRS-as-issued Form 20-F. Contractual <1y financing cash flow NT$54,552m; carrying current financing NT$36,583m. Source timing 2024-04-18.
- UMC 2023: consolidated, Taiwan-FSC-endorsed IFRS. Contractual <1y financing cash flow NT$31,450,552k; carrying current financing NT$29,536,797k. Official SEC-source availability verified no later than 2024-03-25; earlier public release remains UNKNOWN.
- Taiwan Cement 2023: consolidated scope repaired. Contractual <1y financing cash flow NT$36,718,292k; carrying current financing NT$36,895,130k. Undrawn financing facilities NT$185,440,051k; facility commitment/drawability quality is not assumed. Public first-known timestamp remains UNKNOWN.

### Baseline readiness
D07 descriptive baselines are now frozen on compatible accounting bases for TSMC, UMC and Taiwan Cement.
D13 rate baseline timing is frozen for currently timing-eligible rows:
- UMC: latest completed U.S. Treasury session before Taiwan decision point = 2024-03-22, 10Y 4.22%; 20 U.S.-session change = -4 bp; CBC discount rate = 2.0%.
- TSMC: latest completed U.S. Treasury session before the filing timestamp = 2024-04-17, 10Y 4.59%; 20 U.S.-session change = +29 bp; CBC discount rate = 2.0%.

### Outcome gate
Equity outcomes remain CLOSED.
TSMC and UMC pass the currently defined scope/basis/double-count/D07/D13 timing gates, but two issuer/date observations from the same reporting year cannot support OOS, walk-forward, independent-date, industry or regime claims.
Taiwan Cement remains timing-blocked until a public knownAt is proven.
The correct next move is panel expansion, not opening returns early.

### Durable files
- `research/d22_01_maturity_replay_v0_1.json`
- `research/d22_01_incremental_value_prereg_v0_1.json`
- `research/d22_01_scope_and_double_count_audit_v0_1.json`
- `research/d22_01_d07_baseline_readiness_v0_1.json`
- `research/d22_01_d13_baseline_readiness_v0_1.json`
- `research/d22_01_pre_outcome_eligibility_v0_1.json`

### Current status
L3 / WAITING_MULTI_ISSUER_MULTI_DATE_PANEL / OUTCOMES_CLOSED / FALSIFICATION_IN_PROGRESS.

No System 1 or System 2 Formal change is authorized.

## D22-02｜Interest Coverage / Debt Service

### Current maturity
L2 — mechanism and falsification contract defined.

### Mechanism
Interest coverage measures earnings capacity relative to financing cost. It complements D22-01 rather than replacing it: D22-01 asks when principal/financing cash flows mature; D22-02 asks whether earnings or cash generation can absorb financing cost. Fixed-rate debt can delay rate pass-through, while floating-rate or near-refinancing debt can transmit higher market rates faster.

### Counterevidence / threshold firewall
A single universal threshold is forbidden. External firm-level evidence shows the same ICR can map to different default rates across industries, firms and time. Therefore 1.5x/2x/3x cannot become a Taiwan hard gate without PIT cross-sector validation.

### Taiwan semantic evidence
UMC 2023:
- operating income NT$57,890,661k;
- debt + lease interest NT$1,473,729k;
- total finance costs NT$1,570,374k;
- operating-income / debt+lease-interest = 39.28x;
- operating-income / total-finance-costs = 36.86x.

Taiwan Cement 2023 consolidated:
- operating income NT$10,030,160k;
- bank borrowing interest NT$1,764,108k;
- corporate bond interest NT$1,459,152k;
- lease interest NT$125,315k;
- other finance costs NT$194,109k;
- total finance costs NT$3,542,684k;
- capitalized interest NT$32,190k;
- operating-income / debt+lease-interest = 3.00x;
- operating-income / total-finance-costs = 2.83x.

The examples establish that numerator/denominator taxonomy can materially alter the ratio. "Finance costs" cannot be treated as a universal plug-in denominator without source-line provenance.

### Falsification rules
- Negative/near-zero EBIT and near-zero interest expense require explicit handling; naive ranking is forbidden.
- Capitalized borrowing cost is recorded separately; do not mechanically add it back without a preregistered construct.
- Interest income is not netted against debt interest unless a separate net-interest construct is explicitly tested.
- A high ICR can coexist with a large principal maturity wall; a low ICR can be temporary or buffered, subject to evidence.
- Entity scope and accounting basis must match the D22-01 firewall.
- If D22-02 adds no information after D07 operating cash flow/leverage and D22-01 maturity timing, classify it REJECTED_OR_REDUNDANT.

### Durable file
- `research/d22_02_interest_coverage_contract_v0_1.json`

### Exact next continuation
1. Build issuer/date PIT interest-coverage replay receipts for at least one additional non-financial industry and multiple dates.
2. Freeze treatment of negative EBIT, near-zero denominators, lease interest, other finance costs and capitalized interest.
3. Compare accounting ICR, cash-interest coverage and D22-01 principal-inclusive debt-service coverage while equity outcomes remain closed.
4. Promote D22-02 to L3 only after Taiwan cross-industry PIT replayability is demonstrated.
5. In parallel, expand D22-01 to multiple issuer/date states; do not open outcomes until a defensible independent-date panel exists.


## 2026-10-04 continuation｜D22-03 Net Debt / Leverage Structure

### Current maturity
L2 / 40% — mechanism and falsification defined; Taiwan PIT replay not yet validated.

### Mechanism boundary
D22-03 is not a duplicate of D07 accounting leverage. Its research object is financing structure after liquidity-quality classification: gross interest-bearing debt, cash-like offsets, restricted/pledged cash, lease liabilities, supplier-finance-like obligations when separately evidenced, and the maturity/rate/currency composition that determines whether a nominal net-debt number actually reduces refinancing stress.

A single net-debt scalar is therefore insufficient. The primary research representation is a vector with explicit provenance: gross debt; unrestricted cash/cash equivalents; restricted or pledged liquidity; lease liabilities; separately identified financing-like obligations; and scope/basis/knownAt metadata. Net debt is a derived view, never a source fact.

### Support and counterevidence
- Support: structural credit evidence identifies leverage, recovery assumptions and the risk-free rate as material default-risk inputs; firm-exit evidence also finds short-term debt and weak earnings-to-interest capacity jointly important. This supports studying leverage structure together with D22-01/D22-02 rather than as a standalone ratio.
- Counterevidence: high cash does not automatically neutralize solvency or refinancing risk; liquidity can be trapped, pledged, operationally necessary, foreign-subsidiary constrained, or simply small relative to a near-term maturity wall. Conversely, gross leverage can overstate pressure when unrestricted liquidity and committed refinancing capacity are genuinely available.
- Alternative explanation: apparent predictive power can be inherited from D07 leverage/profitability, D22-01 maturity concentration, D22-02 interest coverage, D13 rates, industry capital intensity, or distress-induced cash hoarding. Incremental tests must control these before D22-03 can claim unique value.
- Failure condition: if the structured representation adds no incremental information after D07 + D22-01 + D22-02 + D13, classify REJECTED_OR_REDUNDANT rather than adding another vote.

### PIT / data contract frozen at mechanism stage
1. Every issuer/date observation must preserve statement scope, accounting basis, fiscal period, publication/filing knownAt, and source version.
2. Cash offset must distinguish unrestricted cash/cash equivalents from restricted/pledged balances when evidence permits; missing restriction evidence is UNKNOWN, never assumed unrestricted.
3. Lease liabilities and other financing-like obligations must remain separate components until a preregistered construct defines inclusion. No silent denominator or debt-definition switching.
4. Negative net debt is not automatically LOW_RISK; it may coexist with weak operations, covenant risk, maturity concentration or inaccessible cash.
5. Restatements/reclassifications append a new version. Historical replay uses the first-known eligible version, not the latest revised statement.
6. Corporate actions and major financing transactions require event-time lineage; period-end statements cannot be backfilled with later issuance/repayment knowledge.
7. Financial firms are excluded from the initial comparability lane because deposits/regulatory capital make industrial net-debt semantics non-comparable.

### Validation gates before L3+
- L3: multiple Taiwan non-financial issuers across industries and dates with source-attested knownAt and component replay.
- L4: preregistered OOS or prospective Shadow evidence, with walk-forward splits and no historical Shadow fabrication.
- L5: multi-regime robustness, costs, missingness/coverage, industry/date clustering, multiple-testing/data-mining controls, factor redundancy and stability of component definitions.

### Outcome gate
OUTCOMES_CLOSED. No equity return join, threshold search, sign optimization or ranking experiment was opened in this continuation.

### System-use status
Candidate state remains FALSIFICATION_IN_PROGRESS. Formal Core remains LOCKED. No FORMAL_OPTIMIZATION_CANDIDATE is created at L2.

### Exact next continuation
1. Build D22-03 Taiwan PIT component contract and bounded replay receipts for at least three non-financial issuers spanning at least two industries and more than one reporting date.
2. Explicitly test unrestricted-cash vs total-cash offset, lease-liability inclusion, and gross-debt vs net-debt views without outcomes.
3. Continue D22-02 cross-industry interest-coverage replay and D22-01 multi-date maturity panel in parallel; do not open stock outcomes.

## 2026-10-04 07:22 continuation｜D22-02 / D22-03 promotion + D22-04 launch

### D22-02 current maturity
L3 / 60% — cross-industry, multi-date Taiwan PIT replay validated; outcomes remain CLOSED.

New durable replay:
- `research/d22_02_interest_coverage_replay_v0_1.json`
- Chunghwa Telecom adds telecom-sector evidence and two independently timestamped annual states (2023 and 2024).
- 2023 accounting coverage: operating income NT$46,353m / interest expense NT$319m ≈ 145.31x.
- 2024 accounting coverage: operating income NT$46,873m / interest expense NT$339m ≈ 138.27x.
- Very high coverage coexists with a larger <1y maturity wall in 2024, so interest coverage and maturity timing remain distinct evidence families.

### D22-03 current maturity
L3 / 60% — Taiwan PIT component replay validated; outcomes remain CLOSED.

New durable files:
- `research/d22_03_net_debt_component_replay_v0_1.json`
- `research/d22_03_version_lineage_v0_1.json`

Key falsification:
Chunghwa Telecom 2023→2024 improved from derived net debt about -NT$1.139bn to -NT$3.845bn, while contractual <1y financing rose from about NT$2.2bn to NT$9.2bn and <1y wall/cash from about 6.5% to 25.4%. Negative net debt therefore cannot be used as sufficient evidence of low near-term refinancing pressure.

ASE Technology Holding supplies a third exact-known issuer state:
- 2024-02-01 first-known consolidated FY2023 release;
- cash NT$67,284m;
- short-term borrowings NT$53,042m;
- current portion bonds/long-term borrowings NT$28,616m;
- non-current bonds NT$20,489m;
- non-current long-term borrowings NT$81,365m;
- derived gross interest-bearing debt NT$183,512m;
- derived net debt NT$116,228m;
- reported net-debt/equity ratio 0.38;
- unused credit lines NT$373,763m, with commitment/drawability quality left UNKNOWN.

Version-lineage firewall:
A later filing retrospectively adjusted ASE's 2023 short-term borrowings to about NT$37,737m. Historical replay preserves the 2024-02-01 first-known value and appends the later revision. Latest-restated history must never overwrite first-known PIT state.

### D22-04 current maturity
L2 / 40% — debt-cost / refinancing-risk mechanism, anti-double-count boundary, Taiwan source route and falsification contract defined; issuer-specific market-yield replay still pending.

Durable file:
- `research/d22_04_cost_of_debt_refinancing_risk_contract_v0_1.json`

Ownership:
- D13-06 owns sovereign/risk-free curve;
- D22-04 owns issuer-specific debt-cost / refinancing spread / repricing interaction with exposed debt;
- D07-18 owns enterprise WACC composite.

Key semantic firewall:
legacy coupon != accounting effective cost != current market yield != issuer spread != prospective refinancing cost.

Taiwan source feasibility:
TPEx offers bond trade/quote files, yield-price files, fair values and daily corporate-bond reference/yield-curve data. No-trade or stale observations remain UNKNOWN.

Mechanism example:
Chunghwa Telecom's existing bonds carry legacy coupons around 0.42%-0.69%, including an NT$8.8bn 0.50% tranche maturing July 2025. That legacy coupon is not a forward refinancing quote. Replacement cost remains UNKNOWN until an actual funding transaction or valid PIT market proxy is observed.

### Combined research status
D22-01 L3 / D22-02 L3 / D22-03 L3 / D22-04 L2.
Equity outcomes remain CLOSED.
Formal Core remains LOCKED.
No FORMAL_OPTIMIZATION_CANDIDATE exists yet.

### Exact next continuation
1. Build D22-04 issuer-security-date TPEx debt-cost receipts with actual trade / quote / reference / fair-value provenance.
2. Match duration and currency to the sovereign benchmark; no simple maturity-mismatched subtraction.
3. Construct research-only refinancing-gap challengers and interact only with D22-01 principal actually exposed to repricing.
4. Test benchmark-vs-spread divergent states and no-refinancing/cash-repayment counterfactuals.
5. Continue D22-01~03 multi-date/version-lineage panel expansion while outcomes stay closed.

## 2026-10-04 08:51 continuation｜Full D22 mechanism/falsification map through D22-12

This continuation completed the first full mechanism/falsification pass for every canonical D22 module. The resulting domain maturity is 45.0%, with D22-01~03 at L3 and D22-04~12 at L2. The advance reflects research evidence and frozen failure conditions, not implementation work or outcome mining.

### Cross-module architecture

The D22 credit stack is now decomposed into non-additive layers:

1. D22-01: when financing cash flows mature.
2. D22-02: whether earnings/cash generation can service financing cost.
3. D22-03: how gross debt and accessible liquidity form funding structure.
4. D22-04: what exposed financing may cost when repriced/refinanced.
5. D22-05: what rating agencies publicly change and when.
6. D22-06: what market credit prices/spreads imply, including non-default components.
7. D22-07: what contractual liquidity/covenant triggers can change lender rights or funding access.
8. D22-08: how quickly benchmark-rate changes transmit through fixed/floating/reset/hedged debt.
9. D22-09: whether equity and credit markets disagree and which market actually leads in a given state.
10. D22-10: how financing sources, seniority and sequencing form capital structure.
11. D22-11: whether bank-credit supply/terms tighten beyond pure policy-rate moves.
12. D22-12: how distress probability, recovery severity and equity-tail risk differ.

The same primitive cannot create multiple votes across these layers.

### D22-05 research finding
Rating events have multiple clocks and meanings. Issue rating, issuer rating, outlook, watch/review and formal notch changes are separate. Evidence supports negative responses to some downgrades, but anticipation matters: equity, CDS/bond prices and short positioning can move before formal action. Therefore the research design must compare a rating action against pre-event market/fundamental information. A downgrade is neither automatically new information nor automatically a future bearish equity signal.

### D22-06 research finding
Observed corporate spread is not identical to expected default loss. Research shows meaningful non-default/liquidity components in investment-grade spreads and systematic risk-premium variation. Taiwan TPEx trade/quote/reference/fair-value series must therefore carry provenance labels. A stale or model-based mark cannot be silently treated as a fresh transaction. Credit-curve slope is a candidate only after security/maturity matching and liquidity controls.

### D22-07 research finding
Contractual rights create nonlinear states that accounting ratios alone cannot capture. Maintenance covenants, incurrence covenants, cross-default clauses, facility commitment and waiver/renegotiation are distinct. A breach can lead to renegotiation rather than default; facility headline size can overstate usable liquidity. D22-07 therefore owns contractual trigger/cushion semantics, not another copy of D22-02 ICR or D22-03 cash.

### D22-08 research finding
Rate exposure is a transmission problem, not simply a debt label. Floating-rate bank debt can pass benchmark changes into cash interest rapidly, while fixed-rate bonds delay pass-through until refinancing. Floors, caps, reset dates and hedges change effective exposure. This separates D13 rate state, D22-08 repricing exposure, D22-04 replacement cost and D22-01 maturity timing.

### D22-09 research finding
The intuitive claim "credit leads equity" is explicitly rejected as a universal rule. Literature includes strong equity-to-bond/CDS information flow as well as credit-to-equity or bidirectional cases. Any Taiwan divergence signal must therefore preregister timing, freshness and direction hypotheses, and must survive shared macro/liquidity controls.

### D22-10 research finding
Capital structure cannot be reduced to "high leverage bad." Trade-off, pecking-order, market-timing and agency/debt-overhang explanations can coexist. A useful D22 representation is a PIT funding vector plus financing-event sequence, while D07 remains owner of accounting leverage and D11 owner of financing-event identity. Convertibles/hybrids require contract-specific treatment.

### D22-11 research finding
Loan quantity is not a clean credit-supply signal. Weak loan growth can reflect weak demand; higher loan rates can reflect risk-free policy transmission. Credit-supply identification therefore needs standards/pricing/terms or substitution evidence and issuer-level bank dependence. Macro bank-credit conditions are context until a reproducible issuer exposure map exists.

### D22-12 research finding
Distress, PD, LGD/recovery and equity tail risk are separate. Structural/Merton distance-to-default relies on market equity value/volatility, liabilities, rate and horizon/barrier assumptions. Reduced-form hazard models impose different semantics. Recovery is conditional, state- and seniority-dependent. Distress-return evidence is mixed, so a distress score cannot be promoted merely because it predicts creditor risk.

### Promotion implications
- D22-05~12: L2 / 40% each.
- No D22-05~12 module qualifies for L3 yet because Taiwan first-known replay has not been independently validated at the required module-specific level.
- D22-04 remains L2 because the dynamic historical TPEx security-level replay could not be completed; no synthetic or incompatible proxy was used.
- D22-01~03 remain L3 and outcomes CLOSED.
- No System 1/System 2 Formal rule changed.
- No FORMAL_OPTIMIZATION_CANDIDATE was created.

### Durable contracts
- `research/d22_05_credit_rating_migration_contract_v0_1.json`
- `research/d22_06_credit_spread_bond_yield_contract_v0_1.json`
- `research/d22_07_liquidity_covenant_default_contract_v0_1.json`
- `research/d22_08_fixed_floating_rate_exposure_contract_v0_1.json`
- `research/d22_09_equity_credit_divergence_contract_v0_1.json`
- `research/d22_10_capital_structure_funding_mix_contract_v0_1.json`
- `research/d22_11_credit_cycle_bank_lending_contract_v0_1.json`
- `research/d22_12_distress_recovery_tail_risk_contract_v0_1.json`

### Exact next continuation
Prioritize D22-04/D22-06 TPEx market-credit replay, then D22-05 rating-event replay, then D22-07/D22-08 contractual/repricing panels. These upstream data families are prerequisites for defensible D22-09~12 PIT replay and later L4 incremental-value tests.

## 2026-10-04 13:45 continuation｜Second-stage PIT validation: D22-05 / D22-08 / D22-10 promoted to L3

This continuation moved D22 from 45.0% to 50.0% through three module-specific Taiwan PIT replay validations. No equity outcomes were opened and no module was promoted on source-route feasibility alone.

### D22-05｜Credit Rating / Rating Migration
L3 / 60%.

Taiwan Ratings historical issuer records provide exact-dated rating and outlook states across multiple non-financial industries and dates. The replay demonstrates:
- outlook deterioration can precede a later formal downgrade;
- outlook can normalize without a notch change;
- positive outlook can precede a later upgrade;
- issuer-rating, issue-rating, outlook and watch/review must remain separate event classes.

The durable replay explicitly forbids double-counting multiple agency events from one deterioration episode and requires anticipation controls before any equity outcome test.

Files:
- `research/d22_05_credit_rating_migration_contract_v0_1.json`
- `research/d22_05_rating_event_replay_v0_1.json`

### D22-08｜Fixed / Floating Rate Exposure
L3 / 60%.

Official issuer filings now support cross-issuer and multi-date replay of rate-exposure states:
- TSMC: floating short-term versus majority fixed long-term debt semantics in historical quarterly filings;
- UMC: exact fixed-rate bond issuance terms in a timestamped event;
- Chunghwa Telecom: two annual states with benchmark-linked non-fixed exposure sensitivity and no interest-rate derivatives.

The data-feasibility conclusion is limited: exact floating principal, reset dates, floors/caps and hedge notionals remain UNKNOWN unless source-attested. A sensitivity table is not permission to reverse-engineer missing debt principal.

Files:
- `research/d22_08_fixed_floating_rate_exposure_contract_v0_1.json`
- `research/d22_08_rate_exposure_replay_v0_1.json`

### D22-10｜Capital Structure / Funding Mix
L3 / 60%.

First-known financing-event replay now covers multiple issuers, industries and dates:
- TSMC domestic unsecured bond tranches across multiple 2023 issuances;
- UMC 2023 five-year fixed-rate unsecured green bond;
- Chunghwa Telecom approval→pricing lineage in 2022 and later 2025 sustainability-bond pricing.

The replay preserves approval, pricing and issuance as separate states and keeps event identity with D11. D22-10 only owns the funding-structure transformation: source, tenor, coupon, security, use of proceeds and sequencing.

Files:
- `research/d22_10_capital_structure_funding_mix_contract_v0_1.json`
- `research/d22_10_funding_mix_event_replay_v0_1.json`

### D22-04 / D22-06 blocker remains valid
The official TPEx route is known and supports the required data families, but clean historical issuer-security-date replay was not independently completed. Therefore both modules stay L2. The blocker is recorded in:
- `research/d22_04_06_tpex_market_data_access_audit_v0_1.json`

No proxy substitution was used. Fair value is not silently treated as a transaction, stale observations are not forward-filled, and a duration/currency-mismatched subtraction is not promoted as issuer spread.

### Domain state after this continuation
- L3: D22-01, D22-02, D22-03, D22-05, D22-08, D22-10.
- L2: D22-04, D22-06, D22-07, D22-09, D22-11, D22-12.
- D22 maturity: 50.0%.
- Equity outcomes: CLOSED.
- Formal Core: LOCKED.
- Candidate state: FALSIFICATION_IN_PROGRESS.
- No FORMAL_OPTIMIZATION_CANDIDATE.

### Exact next continuation
The next highest-value path is no longer another theory pass. It is:
1. historical TPEx security-level replay for D22-04/D22-06;
2. D22-07 covenant/facility PIT receipts;
3. independent-date expansion for D22-05/D22-08/D22-10;
4. then downstream D22-09 divergence replay after D22-06 becomes usable.

## 2026-10-04 15:12 continuation｜Contractual liquidity validated; supply/recovery shortcuts rejected; L4 Stage-A frozen

### D22-07 advanced to L3 / 60%
The module now has Taiwan PIT replay across telecom, semiconductor packaging and semiconductor issuers:
- multi-date unused credit-line states;
- restrictive-covenant / cross-default semantics;
- revolving-credit headroom;
- guarantee exposure and a later early-repayment resolution event.

The main learning is nonlinear: covenant or guarantee exposure can exist without default, and later repayment can extinguish exposure. The correct research state is therefore a dated contract/liquidity state machine, not a permanent BAD flag.

Durable replay:
- `research/d22_07_liquidity_covenant_replay_v0_1.json`

### D22-11 stays L2 / 40%
Official CBC data make aggregate bank-pricing and enterprise-funding context replayable, and issuer bank-dependence can be mapped from first-known financing structures. However, public modern Taiwan data in this pass do not cleanly identify credit supply separately from borrower demand.

This is a substantive negative result:
- loan-volume contraction is not automatically supply tightening;
- a higher new-loan rate is not an issuer credit spread;
- common aggregate context must not be assigned uniformly across issuers;
- creditSupplyShock remains UNKNOWN until lending standards/approval/collateral/term or an equivalent identifying design is available.

Durable readiness audit:
- `research/d22_11_credit_cycle_replay_readiness_v0_1.json`

### D22-12 stays L2 / 40%
Taiwan Ratings historical studies show rare corporate defaults in the rated universe, including many zero-default years. This creates a severe class-imbalance and coverage problem. TPEx/TWSE source routes exist for default notices and bankruptcy/restructuring delisting semantics, but these are not yet a classified issuer-level recovery dataset.

Required protections:
- include defaulted/delisted/unrated cases rather than rated survivors only;
- distinguish bankruptcy, restructuring, bond-payment default, covenant breach, market/trading default and non-credit delisting;
- recovery must be tied to security seniority/collateral and recovery date;
- distance-to-default is a model estimate, not observed PD.

Durable readiness audit:
- `research/d22_12_distress_recovery_replay_readiness_v0_1.json`

### D22-04 / D22-06 source state
Official TPEx market-data schema supports the necessary security-level trade/yield/fair-value/curve fields, but the historical archive required for a clean issuer-security-date replay is a separate paid/acquisition route. No purchase was made and no proxy substitution was used.

These modules remain L2 and D22-09 remains downstream-blocked.

### L4 Stage-A incremental-value preregistration
Durable preregistration:
- `research/d22_l4_stage_a_incremental_value_prereg_v0_1.json`

Seven L3 modules are now governed by one outcome-blind framework:
D22-01, D22-02, D22-03, D22-05, D22-07, D22-08 and D22-10.

Frozen design:
- exact common support;
- independent issuer-date/episode clustering;
- <20 mature paired dates remains ACCUMULATING;
- D+5 / D+10 / D+20 primary outcome family; D+40 / D+60 only after elapsed maturity;
- MFE / MAE path outcomes;
- no best-horizon search;
- one historical outcome opening after population freeze;
- leave-one-date-out / walk-forward plus later independent dates or Prospective Shadow;
- multiple-testing accounting;
- baseline/redundancy controls against D07, D13, D11 and upstream D22 primitives;
- UNKNOWN remains missing;
- Formal Core stays LOCKED.

### Current D22 maturity
51.7%.

### Exact next continuation
Build the frozen common-support inventory for the seven L3 lanes without opening equity outcomes. Expand independent issuer-date receipts until the first lane genuinely satisfies the pre-outcome panel gate. Maintain source/dependency/identification blockers for D22-04/06/09/11/12 rather than weakening their contracts.

## 2026-10-04 21:09 continuation｜Outcome-blind Stage-A sample architecture

### Why raw receipt count is not the L4 sample
The seven L3 D22 lanes currently contain 58 durable replay receipts, of which 52 have exact challenger timestamps. Cross-module same-issuer same-date dedup leaves 44 global issuer-date clusters. None of these counts is allowed to masquerade as the >=20 mature-paired-date threshold.

A mature pair requires the exact same issuer-decisionDate population for challenger + frozen B0/B1 controls. Current mature paired dates remain zero.

### D22-05 reaches the challenger-side count gate
The issuer-rating panel was expanded from 8 to 29 exact directional events using additional Taiwan Ratings histories across industrial materials, real-estate services, electrical machinery, steel, cement, electronics manufacturing and server electronics.

A frozen outcome-blind clustering rule now prevents repeated agency actions within one same-direction episode from becoming multiple votes:
- consecutive OUTLOOK_DOWN / DOWNGRADE / WATCH_NEG = one negative episode until sign reversal;
- consecutive OUTLOOK_UP / UPGRADE / WATCH_POS = one positive episode until sign reversal;
- returns are not consulted.

Result:
- 29 directional events;
- 22 independent directional episodes;
- challenger-side count gate passed;
- mature paired dates still zero because B0/B1 pairing is not frozen.

The first directional event date is the only Stage-A anchor for each episode. Later same-direction events are state updates, not additional samples.

### D22-04 / D22-06 data-access refinement
The prior statement "historical TPEx security-level data are blocked" is now refined.

Verified public path:
- TPEx free daily corporate-bond fair-value/reference report;
- security-level fields include bond code, maturity, coupon, reference curve, fair value and yield;
- TPEx methodology uses issuer/MOPS bond information and corporate-bond reference yield curves subject to eligibility rules.

Still blocked:
- reproducible multi-date public transport has not yet been materialized;
- actual transaction/quote history is not in the current packet;
- fair value/reference is not a trade and must remain a separate provenance lane;
- clean issuer spread still requires currency/maturity/optionality-consistent benchmarking.

Therefore D22-04/D22-06 stay L2.

### Research implication
The first D22 lane close to the historical-outcome gate is now D22-05, but it is not ready to open outcomes. The next hard work is baseline reconstruction, not additional rating-event harvesting.

Exact next:
1. Freeze B0/B1 PIT controls for all 22 D22-05 episode anchors.
2. Drop/UNKNOWN any anchor that cannot be reconstructed exactly rather than backfilling later data.
3. Recount mature paired anchors after baseline pairing.
4. Only if >=20 remain may the preregistered historical outcomes be opened once.
5. Continue free fair-value multi-date transport research for D22-04/D22-06 without conflating reference values with transactions.

