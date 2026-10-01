# D11-06 Taiwan M&A / Disposal / Material Transaction PIT Contract V0.1

Updated: 2026-10-01 Asia/Taipei
Owner: 08｜事件與新聞研究室
Status: TAIWAN_PIT_SOURCE_FEASIBLE / L3_RESEARCH_EVIDENCE / OUTCOMES_CLOSED
Formal Core impact: NONE

## Scope
This research-only contract covers D11-06 併購／處分／重大交易. It does not create a trading score, direction label, live filter, alert or Formal-Core change.

## Taiwan official source findings
1. TWSE material-information clause 11 explicitly covers board resolutions for merger, demerger, acquisition, share exchange/conversion/acquisition and material changes, failed shareholder meetings/vetoes, and cancellation of a merger during implementation.
2. The FSC/TWSE acquisition-disposal framework defines the fact date using the earliest applicable transaction-signing, payment, order/trade, transfer, board-resolution or other date sufficient to determine counterparty and amount; regulator approval does not automatically become the first fact date when an earlier qualifying date exists.
3. TWSE guidance requires renewed disclosure when the original transaction contract is changed/terminated/rescinded, a merger/demerger/acquisition/share transfer misses its contractual timetable, or previously disclosed content changes.
4. Therefore a material transaction is a versioned lifecycle, not a single binary event.

## Frozen PIT clocks
Keep these fields separate when available:
- factDate / factAt
- agreementAt
- boardResolutionAt
- shareholderResolutionAt
- regulatorApprovalAt
- sourcePublishedAt
- capturedAt
- effectiveAt / closingAt / terminationAt

Replay rule: capturedAt is the conservative knownAt upper bound unless provider availability is independently authenticated. Later completion, amendment, approval or termination evidence must never be backfilled into an earlier decision state.

## Event identity vs disclosure identity
Maintain two independent identities:
- transactionSemanticId candidate: parties + transaction type + underlying asset/equity object + original fact context.
- disclosureVersionId candidate: source + source sequence/native ID if available + sourcePublishedAt + capturedAt + payload hash.

A changed disclosure can belong to the same economic transaction. A later completion/approval/amendment/cancellation is not automatically a new independent bullish/bearish event.

## Positive mechanism hypotheses
Potential mechanisms for later testing only:
- control-rights transfer, synergy/cost structure, asset reallocation, financing/liquidity change, ownership concentration and supply/demand effects.
- announcement-to-closing state transitions may change uncertainty and probability-weighted value.

## Falsification / failure conditions
- ANNOUNCED != COMPLETED.
- LARGE_NOTIONAL != POSITIVE or NEGATIVE alpha.
- ACQUIRER and TARGET cannot inherit the same sign.
- ASSET_DISPOSAL is not inherently bullish or bearish.
- Missing completion evidence is UNKNOWN unless source completeness is proven; it is not FAILED/CANCELLED.
- Amendments, regulatory approval, closing and termination are lifecycle states and must not be double-counted as independent event votes.
- Related-party, financing, accounting/goodwill, consideration mix and strategic rationale can confound direction.
- Do not inspect post-event returns before cohort membership, clocks, controls and missingness policy are frozen.

## Bias controls
PIT/first-known, replayability, source reliability, correction/version lineage, duplicate clustering, selection bias, look-ahead, data snooping, multiple testing/Factor Zoo, date/event clustering, costs and redundancy remain mandatory. UNKNOWN is never zero/BAD.

## Maturity decision
D11-06 qualifies for L3 only as Taiwan PIT/source feasibility: official Taiwan source semantics, fact-date rules and versioned amendment/cancellation lifecycle are sufficient to define a replayable prospective data contract. This is NOT alpha evidence and does not qualify for L4.

## Prospective/OOS preregistration gate before any outcome join
Freeze an outcome-blind cohort with:
- transactionSemanticId
- transactionType
- acquirer/target/asset parties
- consideration type and amount when known
- related-party flag
- fact/source/capture/effective/closing clocks
- lifecycle state: ANNOUNCED / APPROVED / AMENDED / CLOSED / TERMINATED / UNKNOWN
- immutable raw/payload hash lineage
- controls for market, sector, momentum/liquidity and concurrent material information/corporate actions
- explicit auction/slippage/cost treatment where relevant

Negative controls must include amended/terminated deals, delayed deals, disposals without core-business exit, and records whose final state remains UNKNOWN.

## Exact next continuation point
D11-06-02: append the first independent-date immutable Taiwan material-transaction receipts without stock outcomes; then repeat on later independent dates, reconcile amendments/completions/terminations to the frozen transactionSemanticId, and preregister event-time-zero/horizons/control cohorts before any L4/OOS claim.

FORMAL_OPTIMIZATION_CANDIDATE = NO
OUTCOME_JOIN = CLOSED
FORMAL_CORE = LOCKED
