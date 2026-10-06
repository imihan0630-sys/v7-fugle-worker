# Room09 D12+D13 source endpoint divergence — 2026-10-06

Status: RESEARCH_ONLY / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED

## D12 — DR-108..DR-111

DR-108: At the same research continuation, the official TAIFEX interactive Delta page exposed publication timestamp 2026/10/06 06:45:18 while the official Excel-style endpoint still exposed 2026-10-05 14:30:17. Therefore "TAIFEX Delta available" is not a single immutable source state across presentation endpoints.

DR-109: Endpoint/presentation identity is part of PIT provenance. Future Delta receipts must bind endpoint identity, presentation type, page-displayed publication timestamp, observedAt, effectiveTradingDate and raw-source identity/hash when authorized. A scheduled update time or one endpoint's state cannot be imputed to another endpoint.

DR-110: The 2026/10/06 06:45:18 interactive-page observation is the first directly observed current-day version in this research chain. It may be used only as source/model-replay evidence after common-contract support and model-input clocks are aligned. It is not Alpha evidence and opens no outcome join.

DR-111: The stale Excel-style endpoint is counterevidence against assuming atomic publication. A source-lag/cache/presentation-layer difference must be separated from model error. If two official endpoints disagree on version identity, research must fail closed or select a preregistered canonical endpoint; it must not cherry-pick whichever version improves a result.

## D13 — MC-208..MC-211

MC-208: The D12 endpoint divergence generalizes the D13 source-clock firewall: institution identity is insufficient provenance. Macro receipts must bind the concrete publication endpoint/version, not merely "Treasury", "Fed", "CBC", "TWSE" or "TAIFEX".

MC-209: U.S. Treasury 2026-10-05 par-yield data are currently observable in the official annual table, but this later observation establishes only a conservative upper bound on availability. It does not reconstruct exact first-publication time and must not be backdated to Taiwan 2026-10-05 18:10.

MC-210: Federal Reserve October 2026 calendar schedules H.4.1 on Oct 8 at 16:30 ET and H.15 on Oct 6 at 16:15 ET. Schedule identity is not realization identity. Actual values remain UNKNOWN until the specific publication endpoint is observed after release.

MC-211: Cross-market join contract therefore requires source family + endpoint/version + reference date + scheduled release + actual publication/availability when observed + observedAt + firstEligibleTaiwanDecision. If exact publication is unavailable, firstEligibleTaiwanDecision must be no earlier than verified observedAt; do not infer it from source date.

## Falsification / anti-bias
- No Taiwan returns, selection outcomes, MAE/MFE or hit rate inspected.
- No threshold/window/provider selected from outcomes.
- Missing or endpoint-divergent evidence stays UNKNOWN.
- No same-institution endpoint states are treated as independent votes.
- No historical Shadow is fabricated.
- OOS/walk-forward remains closed until independent prospective clean dates accumulate.

## Maturity
D12 remains 40.0%; D13 remains 41.1%. Source provenance improved but L3 PIT feasibility is not yet validated across independent clean dates.
FORMAL_OPTIMIZATION_CANDIDATE=NONE.
Formal Core LOCKED.

## Exact next continuation
D12: preserve the 2026/10/06 06:45:18 interactive observation and stale 2026/10/05 14:30:17 Excel observation as an endpoint-divergence pair. Materialize common contract support and model-input clocks before any Delta residual attribution. Do not treat endpoint lag as model error.
D13: capture the actual H.15 Oct-6 and H.4.1 Oct-8 publication endpoints only after verified release, append observedAt and firstEligibleTaiwanDecision, and keep schedule receipts immutable.
