# D15-23 — Derivative hedging / overlay / tail exposure research contract

Date: 2026-10-11 Asia/Taipei
Owner: 10 / D15-23
Classification: Class A RESEARCH_ONLY. Formal Core LOCKED.
This document durably reconciles prior local-only mechanism/falsification research; it is not a claim of a real hedge, fill, or historical Shadow outcome.

## Research question
Given a PIT portfolio snapshot, can a derivative overlay reduce defined market/tail exposure after basis, financing, margin, slippage and broker-execution constraints? It does not alter stock-selection or formal sizing.

## Frozen identity and stages
Each candidate freezes portfolioSnapshotId, account, instrument/contract/expiry/multiplier/currency, hedge objective, decisionAt, firstKnownAt for holdings and quotes, eligible trading session/mechanism, contract size, position and available margin source.
PLAN -> SIGNAL -> NOTIFICATION -> ORDER_SUBMITTED -> BROKER_EVENT_REPORTED -> BROKER_FILL_VERIFIED -> HEDGE_POSITION_RECONCILED -> REALIZED_PNL_RECONCILED.
A plan for two contracts or a submitted two-contract order is not two contracts filled. A complete broker terminal receipt can positively establish zero fill; absent events cannot. A partial fill, cancellation, amendment and late correction must preserve order/event IDs and dual clocks. A claim flag without an independently traceable broker receipt is not verified execution.

## Competing hypotheses and falsifications
H1: delta/beta overlay can reduce market-factor exposure.
- Support: PIT synchronized holdings and contract multipliers allow ex-ante hedge ratio and scenario exposure.
- Counter: beta instability, nonlinear exposure, hedge mismatch and changing weights can leave or increase risk.
- Alternative: a simpler stock reduction or cash allocation may achieve similar exposure with lower friction.
- Failure: missing PIT holdings, multiplier, quote or hedge ratio provenance => UNKNOWN.

H2: derivatives improve tail-risk control versus cash/reduction.
- Support: downside convexity or futures hedge may cushion specified scenarios.
- Counter: basis gaps, wrong contract, volatility/skew repricing, tail co-movement and liquidity stress can reverse benefit.
- Alternative: stress regime, sector concentration or position selection rather than hedge instrument drives result.
- Failure: no ex-ante scenario set, option surface/greeks when needed, or reliable tail observations => UNKNOWN.

H3: hedging is implementable at acceptable capital cost.
- Support: account-level margin, collateral, orderability and verified fills can establish actual overlay.
- Counter: slippage, tax/fees, spread, forced margin calls and expiry roll can dominate theoretical gain.
- Alternative: position sizing/holding cash; compare on common support with identical decision snapshots.
- Failure: broker event lineage, margin capacity or execution mechanism absent => theoretical only.

## PIT / OOS / cost firewall
Freeze decision-time instrument quotes, implied vol/greeks where relevant, contract specification, margin schedule, portfolio holdings and covariance/beta estimator versions. Future-close prices or ex-post best hedge ratios must not enter decision-time evaluation. Walk-forward refits use past sessions only; untouched OOS dates and stress regimes are held out. Report gross and net results separately; fees, tax, roll, funding, spread, market impact and slippage require provenance; unknown cost is UNKNOWN not zero. Preregister objectives and comparator set, cluster by independent sessions, count all tested ratios/horizons and control factor redundancy.

## Evidence, status and next
Synthetic event replay and PIT checks are structural evidence only; no verified Taiwan broker derivative fill, margin receipt, independent OOS performance or realized hedge P/L is established. This is L2 mechanism + falsification candidate; L3 blocked until genuine prospective synchronized portfolio/contract/broker evidence and feasible deterministic replay are obtained. No historic Shadow fabrication.
Status: D15_23_MECHANISM_FALSIFICATION_FROZEN / TAIWAN_PIT_BROKER_AND_PORTFOLIO_RECEIPTS_PENDING / FORMAL_CORE_UNCHANGED.
`FORMAL_OPTIMIZATION_CANDIDATE`: NONE.
