# Curriculum Coverage Pending Evidence Deficit Matrix 2026-10-03 V0.1

Updated: 2026-10-03 22:51 Asia/Taipei
Status: PENDING_EVIDENCE_DEFICITS_FROZEN
Scope: Remaining COV candidates without accepted pre-intake partial evidence.
Canonical curriculum impact: NONE.
Formal Core impact: NONE.
System1 impact: NONE.

## Purpose

This matrix does not perform specialist research.
It freezes the exact evidence deficit that still prevents four COV candidates from advancing beyond `PENDING_SPECIALIST_RETURN`.

The four candidates are:
- COV-03 / D06 — Retail / Individual Investor Flow
- COV-04 / D07 — Dividend / Payout Policy & Sustainability
- COV-05 / D08 — Sales-based / Enterprise Multiples
- COV-12 / D22 — Debt Seniority / Collateral / Recovery Waterfall

A specialist room may use existing research, new evidence or both, but the return must satisfy the fixed 10-field contract and the minimum delta below.

---

## COV-03 — D06 — Retail / Individual Investor Flow

Room: 05｜法人與籌碼研究室
Current state: `PENDING_SPECIALIST_RETURN`
Current class: `TRUE_GAP_CANDIDATE`

### Existing nearby evidence

The repository contains:
- institutional flow / foreign / dealer / investment-trust research;
- margin-financing and margin-short vintage contracts;
- securities-lending / SBL source and borrow-economics research;
- passive ETF / index-flow research;
- crowding / herding separation;
- historical Taiwan literature referring to individual-investor behavior.

### Why this is still insufficient

None of the current artifacts establish a durable, replayable Taiwan market data contract that directly identifies retail / natural-person directional flow at the required stock/date decision granularity.

Historical papers that had investor-account classifications are mechanism evidence, not a current reusable production/replay source.

Residual arithmetic such as:
`total market activity - institutional activity`
must not be relabeled as retail identity or intent.

### Minimum missing evidence

1. **Observable definition**
   - exact field/entity that identifies natural-person / retail activity;
   - distinguish ownership share, account class, order class, trade class and inferred residual.

2. **Taiwan source contract**
   - authoritative source;
   - market coverage;
   - stock-level versus market-level granularity;
   - history start;
   - access mode;
   - revision/finality semantics;
   - first-known/capturedAt semantics.

3. **PIT / replay**
   - prove the historical observation can be reconstructed without current-state backfill;
   - preserve UNKNOWN when identity is unavailable.

4. **Direction semantics**
   - retail participation is not retail net buying;
   - retail net buying is not retail crowding;
   - retail crowding is not behavioral motive.

5. **Overlap firewall**
   - D06 institutional flow;
   - leverage/margin;
   - SBL/shorting;
   - ETF/passive flow;
   - D20 behavioral interpretation.

### Evidence threshold for Partial

COV-03 may become `PARTIAL_EVIDENCE_RECEIVED` only when at least one Taiwan source/data contract identifies a retail/natural-person observable more directly than a residual-from-total proxy.

Without that, retain `PENDING_SPECIALIST_RETURN`.

---

## COV-04 — D07 — Dividend / Payout Policy & Sustainability

Room: 06｜基本面與估值研究室
Current state: `PENDING_SPECIALIST_RETURN`
Current class: `TRUE_GAP_CANDIDATE`

### Existing nearby evidence

The repository already contains:
- earnings/cash-flow quality;
- CFO / FCF semantic research;
- profitability/margin quality;
- balance-sheet and capital-allocation context;
- dividend events as multi-news/event-timing context;
- corporate-action handling in other domains.

### Why this is still insufficient

Existing dividend references are primarily:
- event mechanics;
- corporate-action adjustments;
- simultaneous-news controls;
- generic capital-allocation context.

They do not yet constitute a D07 owner contract for:
- payout ratio;
- dividend coverage;
- FCF coverage;
- retention/reinvestment;
- payout stability;
- sustainability through cycles.

### Minimum missing evidence

1. **Knowledge definition**
   - cash payout ratio;
   - total payout ratio where applicable;
   - dividend coverage;
   - FCF dividend coverage;
   - retention ratio;
   - payout stability / growth;
   - sustainability state.

2. **Accounting denominator rules**
   - negative earnings;
   - near-zero earnings;
   - extraordinary gains;
   - financial versus industrial firms;
   - consolidated versus parent basis;
   - cash versus stock dividends.

3. **PIT source contract**
   - declaration/approval/ex-date/payment clocks;
   - financial statement vintage;
   - first-known payout denominator.

4. **Boundary rules**
   - D11 owns dividend-event mechanics;
   - D21 owns governance/capital-allocation process;
   - D07 owns earnings/cash-flow coverage and sustainability.

5. **Countermechanisms**
   - high payout can reflect maturity or underinvestment;
   - low payout can reflect growth investment or distress;
   - one-off special dividends must not imply durable policy;
   - cyclicals require normalized earnings/cash-flow context.

### Evidence threshold for Partial

COV-04 may become `PARTIAL_EVIDENCE_RECEIVED` only when a D07 artifact explicitly freezes payout/coverage/sustainability semantics beyond event handling.

---

## COV-05 — D08 — Sales-based / Enterprise Multiples

Room: 06｜基本面與估值研究室
Current state: `PENDING_SPECIALIST_RETURN`
Current class: `SCOPE_EXTENSION_CANDIDATE`

### Existing nearby evidence

D08 already has strong research on:
- PE/PB;
- historical valuation percentiles;
- EV/EBITDA;
- FCF Yield;
- denominator transitions;
- peer/sector comparison;
- historical TWSE PIT valuation replay.

D19 also references sales-to-price in prior literature.

### Why this is still insufficient

The current D08 artifacts do not yet freeze P/S or EV/Sales as a first-class valuation contract.

A passing mention of sales-to-price in asset-pricing literature is not sufficient for D08 scope ownership.

### Minimum missing evidence

1. **Exact formulas**
   - P/S;
   - EV/Sales;
   - trailing versus forward sales;
   - market-cap / enterprise-value timestamp alignment.

2. **Enterprise-value contract**
   - equity market value;
   - debt;
   - cash;
   - preferred / non-common claims where relevant;
   - lease treatment if used;
   - point-in-time statement vintage.

3. **Sales denominator contract**
   - consolidated revenue;
   - TTM construction;
   - monthly-versus-quarterly reconciliation;
   - restatement;
   - acquisition/disposal breaks;
   - first-known period availability.

4. **Sector / business-model guards**
   - banks/insurers;
   - low-margin distributors;
   - negative-margin firms;
   - cyclical sales peaks/troughs;
   - gross-margin differences;
   - acquisition-heavy issuers.

5. **Anti-double-count**
   - P/S and EV/Sales are correlated views of the same denominator family;
   - multiple variants must not become multiple independent votes.

### Evidence threshold for Partial

COV-05 may become `PARTIAL_EVIDENCE_RECEIVED` when D08 explicitly freezes either P/S or EV/Sales with numerator/denominator/PIT semantics and a clean owner relation to D08-02/D08-06.

Until then, retain `PENDING_SPECIALIST_RETURN`.

---

## COV-12 — D22 — Debt Seniority / Collateral / Recovery Waterfall

Room: 15｜信用市場與資本結構研究室
Current state: `PENDING_SPECIALIST_RETURN`
Current class: `SCOPE_EXTENSION_CANDIDATE`

### Existing nearby evidence

D22 already has:
- debt maturity wall / refinancing schedule;
- interest coverage / debt-service capacity;
- covenant/default ownership in the curriculum;
- distress/recovery ownership in the curriculum;
- D07/D13 timing and double-count firewalls.

### Why this is still insufficient

Existing active D22 research does not yet freeze instrument-level claim priority.

The repository currently lacks an executable contract for:
- secured versus unsecured claims;
- senior versus subordinated claims;
- structural subordination;
- collateral package;
- guarantees;
- recovery waterfall / claim ordering.

Default probability and recovery priority are different questions.

### Minimum missing evidence

1. **Claim taxonomy**
   - senior secured;
   - senior unsecured;
   - subordinated;
   - lease/other claims if included;
   - guarantee;
   - structural subordination.

2. **Collateral semantics**
   - collateral type;
   - lien/priority;
   - coverage amount;
   - valuation date;
   - shared collateral / pari passu conditions.

3. **Entity hierarchy**
   - issuer versus parent/subsidiary;
   - operating-company versus holding-company debt;
   - guarantor structure;
   - intercompany claims.

4. **Recovery waterfall**
   - legal/contractual claim order;
   - restructuring versus liquidation distinction;
   - secured recovery versus unsecured residual;
   - court/insolvency process where applicable.

5. **Taiwan data feasibility**
   - public bond prospectus / offering documents;
   - bank-loan/private-facility visibility limits;
   - guarantee disclosures;
   - rating/restructuring/court documents;
   - first-known document vintage.

6. **Overlap firewall**
   - D22-07 covenant/default trigger;
   - D22-12 distress/recovery;
   - D11 financing/restructuring event mechanics;
   - D07 balance-sheet leverage.

### Evidence threshold for Partial

COV-12 may become `PARTIAL_EVIDENCE_RECEIVED` when D22 freezes an instrument-level seniority/collateral/priority taxonomy plus at least one Taiwan PIT-feasible document path.

---

## Dispatch delta

The next specialist action is not generic “continue researching.”

Each room should close the smallest missing delta:

- 05｜法人與籌碼研究室 → COV-03: prove a direct retail/natural-person observable and PIT source contract.
- 06｜基本面與估值研究室 → COV-04: freeze payout/coverage/sustainability semantics; COV-05: freeze P/S or EV/Sales PIT contract.
- 15｜信用市場與資本結構研究室 → COV-12: freeze instrument priority/collateral/recovery taxonomy and Taiwan document feasibility.

## Intake rule

A partial-evidence promotion remains non-terminal.
A formal specialist return still requires the fixed 10-field return contract and exactly one terminal recommendation:
- `ADD_MODULE`
- `EXTEND_EXISTING_SCOPE`
- `MERGE_INTO_EXISTING`
- `NOT_A_GAP`
- `EVIDENCE_INSUFFICIENT`

## Canonical invariants

- Domains: 22
- Active modules: 354
- Maturity baseline: 36.3%
- Accepted specialist returns: 0 / 12
- No 23rd domain authorized
- Formal Core: LOCKED
- System1 impact: NONE
