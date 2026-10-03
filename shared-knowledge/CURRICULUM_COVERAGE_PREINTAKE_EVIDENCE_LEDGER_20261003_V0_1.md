# Curriculum Coverage Pre-Intake Evidence Ledger 2026-10-03 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: PARTIAL_EVIDENCE_HARVESTED / NO_SPECIALIST_RETURN_ACCEPTED
Scope: Curriculum Coverage COV pre-intake evidence only.
Formal Core impact: NONE.
Canonical curriculum impact: NONE.
Maturity impact: NONE.

## Governance rule

This ledger records pre-existing specialist evidence that partially overlaps a COV validation packet.

It does **not** convert an artifact into a specialist return.
It does **not** authorize `ADD_MODULE`, `EXTEND_EXISTING_SCOPE`, `MERGE_INTO_EXISTING`, or any canonical curriculum change.

A candidate becomes `RETURN_ACCEPTED_FOR_INTAKE` only after its specialist room submits a return satisfying the fixed 10-field contract.

---

## COV-02 — D05 — Closing Auction / Auction Imbalance

Room: 04｜波動與市場微結構研究室
Current pre-intake state: `PARTIAL_EVIDENCE_RECEIVED`

### Evidence found

1. `MICROSTRUCTURE_RESEARCH.md`
   - establishes Taiwan opening/closing call auctions as regimes distinct from continuous trading;
   - requires opening/closing auction separation in any future microstructure test;
   - identifies price limits, tick size, volatility interruption and odd-lot mechanics as Taiwan-specific controls.

2. `MICROSTRUCTURE_CHECKPOINT.md`
   - records current TWSE opening/closing/VI call auctions as separate regimes;
   - keeps Formal Core locked and the lane research-only.

### Contract coverage assessment

- Exact Knowledge Definition: PARTIAL
  - closing auction regime is distinguished, but closing-auction imbalance itself is not yet fully defined.
- Existing-module Overlap Matrix: PARTIAL
  - overlap with continuous-session microstructure is recognized; D05-06 ownership comparison is not yet complete.
- Why Current Scope Is Insufficient: PARTIAL
  - auction regime separation is justified; missing explicit owner-gap proof.
- Taiwan Data Feasibility: MISSING
  - no verified closing-auction imbalance observable/history contract.
- PIT / Replay Implication: PARTIAL
  - session-state separation exists; first-known/replay contract for closing imbalance remains absent.
- Decision Role: PARTIAL
  - microstructure/execution role is supported; exact role of closing imbalance not frozen.
- Anti-double-count Rule: PARTIAL
  - session separation is explicit; duplicate-vote prevention is not yet packet-complete.
- Proposed Owner: MISSING
- Maturity Starting Point: N/A until structural recommendation
- Terminal Recommendation: MISSING

### Required specialist delta

The specialist return must still establish:
- what exact imbalance observable exists at TWSE/TPEx closing call auction;
- whether history is reproducible and PIT-safe;
- whether D05-06 can absorb the capability;
- anti-double-count rules versus continuous-session OFI/depth/liquidity;
- exactly one terminal recommendation.

No structural decision is permitted yet.

---

## COV-07 — D12 — Futures Term Structure / Calendar Spread / Roll Yield

Room: 09｜衍生品與國際總經研究室
Current pre-intake state: `PARTIAL_EVIDENCE_RECEIVED`

### Evidence found

1. `MACRO_CROSS_MARKET_RESEARCH.md`
   - freezes front-month roll/curve semantics for oil futures;
   - requires contractMonth, daysToExpiry, rollFlag, frontPrice, nextPrice, frontNextSpread and source timestamp/timezone;
   - defines calendar spread, spread change and curve state;
   - prohibits splicing different contracts and mislabeling roll jumps as market shocks.

2. `MACRO_CROSS_MARKET_CHECKPOINT.md`
   - maintains source-clock and replay governance for cross-market inputs.

### Contract coverage assessment

- Exact Knowledge Definition: PARTIAL
  - curve/calendar-spread semantics exist, but COV-07 requires a general D12/Taiwan-futures definition.
- Existing-module Overlap Matrix: PARTIAL
  - distinction from spot/market context exists; overlap with D12 basis/OI/expiry owners is not packet-complete.
- Why Current Scope Is Insufficient: PARTIAL
  - roll contamination is established; owner-gap proof remains incomplete.
- Taiwan Data Feasibility: MISSING
  - TAIFEX contract-level historical price/OI/volume/expiry feasibility has not yet been demonstrated.
- PIT / Replay Implication: PARTIAL
  - contract and timestamp metadata are specified; Taiwan replay/source lineage remains missing.
- Decision Role: PARTIAL
  - cross-market context role exists; D12 strategy/validation role not frozen.
- Anti-double-count Rule: PARTIAL
  - roll-jump contamination firewall exists; relation to basis/OI/expiry votes remains incomplete.
- Proposed Owner: MISSING
- Maturity Starting Point: N/A until structural recommendation
- Terminal Recommendation: MISSING

### Required specialist delta

The specialist return must still establish:
- TAIFEX contract-level historical source feasibility;
- point-in-time contract availability and expiry calendars;
- continuous-contract/back-adjust leakage rules;
- overlap with basis/OI/expiry modules;
- whether the capability deserves a distinct D12 owner;
- exactly one terminal recommendation.

No structural decision is permitted yet.

---

## COV-08 — D16 — Dependence-aware Resampling / Block Bootstrap

Room: 11｜統計驗證與策略市場狀態研究室
Current pre-intake state: `PARTIAL_EVIDENCE_RECEIVED`

### Evidence found

1. `research/D16_D18_PROMOTION_GATE_V0_1.md`
   - explicitly rejects naive iid standard errors / iid bootstrap as primary inference for serially dependent daily policy differentials;
   - identifies persistent regime states, overlapping holding horizons, position carry, volatility clustering and common shocks as dependence mechanisms;
   - names stationary bootstrap, moving/block bootstrap and HAC-style inference as candidate methods;
   - requires block-length/bandwidth documentation and sensitivity analysis;
   - prohibits choosing block length to maximize significance.

2. `research/D16_D18_VALIDATION_CHECKPOINT.md`
   - already uses temporal dependence and block/date permutation concepts in validation governance.

### Contract coverage assessment

- Exact Knowledge Definition: STRONG_PARTIAL
  - dependence-aware bootstrap motivation and candidate tools are explicit.
- Existing-module Overlap Matrix: PARTIAL
  - broader D16 validation ownership is clear; explicit D16-06 merge matrix remains missing.
- Why Current Scope Is Insufficient: PARTIAL
  - iid failure is documented; gap-versus-existing-owner proof remains incomplete.
- Taiwan Data Feasibility: PARTIAL
  - method is market-agnostic and executable in principle; Taiwan sample/replay demonstration is not yet a COV-specific artifact.
- PIT / Replay Implication: PARTIAL
  - chronological validation/purging rules exist; COV-specific replay contract remains incomplete.
- Decision Role: STRONG_PARTIAL
  - validation/inference role is explicit and not an alpha vote.
- Anti-double-count Rule: STRONG_PARTIAL
  - multiple inference variants are treated as diagnostics, not independent strategy evidence; packet-specific wording is still needed.
- Proposed Owner: PARTIAL
  - D16 is clearly the owner domain; D16-06 absorption decision remains open.
- Maturity Starting Point: N/A until structural recommendation
- Terminal Recommendation: MISSING

### Required specialist delta

The specialist return must still:
- compare directly against D16-06 Independent-Date / Date-cluster Inference;
- freeze when cluster-robust inference is enough versus block bootstrap;
- define minimum sample / block-length / sensitivity reporting;
- state the owner at module granularity;
- provide exactly one terminal recommendation.

Current governance prior remains: prefer `EXTEND_EXISTING_SCOPE` or `MERGE_INTO_EXISTING` unless a distinct durable capability is demonstrated.

---

## Candidates still with no pre-intake evidence accepted

`COV-01`, `COV-03`, `COV-04`, `COV-05`, `COV-06`, `COV-09`, `COV-10`, `COV-11`, `COV-12`

State remains `PENDING_SPECIALIST_RETURN`.

Note:
Recent D08 valuation research is useful background for COV-05, but the current material does not yet define P/S or EV/Sales deeply enough to count as COV-05 partial evidence.
Likewise, generic topic references without a reproducible contract are not promoted to partial evidence.

## Canonical invariants

- Domains: 22
- Active modules: 354
- No 23rd domain authorized
- No maturity promotion from this ledger
- Formal Core: LOCKED
- System1 impact: NONE


---

## Second pre-intake harvest — COV-01 / COV-09 / COV-10

### COV-01 — D01 — Continuation / Base Pattern Family

Room: 01｜K線與型態研究室  
Current pre-intake state: `PARTIAL_EVIDENCE_RECEIVED`

Evidence found in `KLINE_PATTERN_CHECKPOINT.md`:
- Platform / Bull Flag / Triangle specification exists.
- Pennant / triangle subclasses / wedges are explicitly covered.
- High Tight Flag, VCP, Cup-with-Handle and cross-pattern de-duplication are already researched.
- Latent geometry, confirmation timing, corporate-action handling and replay constraints are frozen.
- Named patterns are explicitly treated as interpretation labels rather than independent votes.

Contract assessment:
- Exact Knowledge Definition: STRONG_PARTIAL
- Existing-module Overlap Matrix: PARTIAL
- Why Current Scope Is Insufficient: STRONG_PARTIAL
- Taiwan Data Feasibility: STRONG_PARTIAL
- PIT / Replay Implication: STRONG_PARTIAL
- Decision Role: STRONG_PARTIAL
- Anti-double-count Rule: STRONG_PARTIAL
- Proposed Owner: PARTIAL
- Maturity Starting Point: N/A until structural recommendation
- Terminal Recommendation: MISSING

Required specialist delta:
- compare umbrella ownership explicitly against D01-05 / D01-07;
- state whether this is an active-owner gap or an existing-scope extension;
- give exactly one terminal recommendation.

No structural curriculum change is permitted yet.

### COV-09 — D19 — Multi-factor Benchmark Models

Room: 12｜資產定價與因子研究室  
Current pre-intake state: `PARTIAL_EVIDENCE_RECEIVED`

Evidence found in `ASSET_PRICING_FACTOR_RESEARCH.md`:
- benchmark-relative alpha and residual semantics are explicitly defined;
- benchmark choice is recognized as model-relative;
- Fama-French, profitability/investment and q-factor evidence is discussed;
- factor redundancy, PIT universe construction, corporate actions, delistings, costs and multiple-testing controls are already part of the D19 contract;
- Taiwan evidence is treated as heterogeneous rather than automatically imported from U.S. studies.

Contract assessment:
- Exact Knowledge Definition: STRONG_PARTIAL
- Existing-module Overlap Matrix: PARTIAL
- Why Current Scope Is Insufficient: PARTIAL
- Taiwan Data Feasibility: PARTIAL
- PIT / Replay Implication: STRONG_PARTIAL
- Decision Role: STRONG_PARTIAL
- Anti-double-count Rule: STRONG_PARTIAL
- Proposed Owner: PARTIAL
- Maturity Starting Point: N/A until structural recommendation
- Terminal Recommendation: MISSING

Required specialist delta:
- compare directly with D19-01 and D19-10;
- distinguish a benchmark-model construction capability from ordinary factor research;
- specify whether Taiwan-reconstructed benchmark portfolios are required;
- provide exactly one terminal recommendation.

No structural curriculum change is permitted yet.

### COV-10 — D20 — Confirmation Bias / Belief Perseverance / Conservatism

Room: 13｜行為金融與市場心理研究室  
Current pre-intake state: `PARTIAL_EVIDENCE_RECEIVED`

Evidence found in `BEHAVIORAL_FINANCE_RESEARCH.md`:
- conservatism and representativeness are explicitly linked to underreaction/overreaction mechanisms;
- generic momentum/reversal is explicitly rejected as proof of a behavioral mechanism;
- Taiwan evidence and structural counterfactuals are already part of the research design;
- overlap with anchoring, attention, price momentum and crowding is recognized;
- behavior-specific evidence is required before assigning motive.

Contract assessment:
- Exact Knowledge Definition: STRONG_PARTIAL
- Existing-module Overlap Matrix: PARTIAL
- Why Current Scope Is Insufficient: PARTIAL
- Taiwan Data Feasibility: PARTIAL
- PIT / Replay Implication: PARTIAL
- Decision Role: STRONG_PARTIAL
- Anti-double-count Rule: STRONG_PARTIAL
- Proposed Owner: PARTIAL
- Maturity Starting Point: N/A until structural recommendation
- Terminal Recommendation: MISSING

Required specialist delta:
- explicitly compare confirmation bias, belief perseverance and conservatism against existing D20 owners;
- decide whether one belief-updating-bias umbrella is the clean owner;
- freeze observable proxies and UNKNOWN semantics;
- provide exactly one terminal recommendation.

No structural curriculum change is permitted yet.

## Updated pre-intake state after second harvest

`PARTIAL_EVIDENCE_RECEIVED`:
`COV-01`, `COV-02`, `COV-07`, `COV-08`, `COV-09`, `COV-10`.

Still `PENDING_SPECIALIST_RETURN`:
`COV-03`, `COV-04`, `COV-05`, `COV-06`, `COV-11`, `COV-12`.

Accepted specialist returns remain: 0 / 12.
Canonical curriculum remains: 22 domains / 354 active modules.
Formal Core remains LOCKED.


---

## Third pre-intake harvest — COV-11

### COV-11 — D21 — Shareholder Rights / Stewardship / Activism / Voting

Room: 14｜公司治理與內部人研究室  
Current pre-intake state: `PARTIAL_EVIDENCE_RECEIVED`

Evidence found in `CORPORATE_GOVERNANCE_INSIDER_RESEARCH.md`:
- ultimate voting rights are explicitly separated from cash-flow rights and board/management control;
- control-right measurement alternatives and falsification cases are frozen;
- MOPS annual reports and shareholder-meeting documents are already identified as primary Taiwan sources;
- historical regulation versions and first-known/PIT concerns are already part of the D21 governance contract;
- minority-shareholder conflict, control-cashflow wedge and ownership complexity are treated as research mechanisms rather than one-direction scores.

Contract assessment:
- Exact Knowledge Definition: PARTIAL
- Existing-module Overlap Matrix: PARTIAL
- Why Current Scope Is Insufficient: PARTIAL
- Taiwan Data Feasibility: STRONG_PARTIAL
- PIT / Replay Implication: PARTIAL
- Decision Role: STRONG_PARTIAL
- Anti-double-count Rule: STRONG_PARTIAL
- Proposed Owner: PARTIAL
- Maturity Starting Point: N/A until structural recommendation
- Terminal Recommendation: MISSING

Required specialist delta:
- define shareholder-rights, stewardship, activism and formal voting as one coherent family or explicitly split responsibilities;
- distinguish recurring governance state from D11 event mechanics;
- verify Taiwan historical stewardship/voting/proposal observability and first-known clocks;
- define anti-double-count boundaries against D21 ownership/control modules;
- provide exactly one terminal recommendation.

No structural curriculum change is permitted yet.

## Updated pre-intake state after third harvest

`PARTIAL_EVIDENCE_RECEIVED`:
`COV-01`, `COV-02`, `COV-07`, `COV-08`, `COV-09`, `COV-10`, `COV-11`.

Still `PENDING_SPECIALIST_RETURN`:
`COV-03`, `COV-04`, `COV-05`, `COV-06`, `COV-12`.

Accepted specialist returns remain: 0 / 12.
Canonical curriculum remains: 22 domains / 354 active modules.
Formal Core remains LOCKED.
