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
