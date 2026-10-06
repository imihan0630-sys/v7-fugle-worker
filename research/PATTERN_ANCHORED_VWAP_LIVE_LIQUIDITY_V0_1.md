# D01 DL-047 — Anchored VWAP vs Structural Memory vs Live Liquidity V0.1

Updated: 2026-10-06 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / FORMAL_CORE_LOCKED

## Research question
Separate three different objects:
1. historical executed-volume concentration by price;
2. VWAP / anchored-VWAP transaction-weighted reference prices;
3. current displayed order-book liquidity.

They have different owners and clocks and must not be treated as interchangeable support/resistance evidence.

## Owner boundaries
- D02 owns session average/VWAP-style context and PRICE_BY_VOLUME_PROFILE.
- D05 owns live spread/depth/order-book context.
- D01 consumes owner receipts and studies incrementality versus frozen structural geometry.

## Semantic firewall
- provider avgPrice is a provider average-price proxy unless exact VWAP construction is independently verified.
- VWAP is not remaining-holder cost basis.
- volume profile is a price distribution of executed volume; VWAP is a transaction-weighted mean.
- historical traded volume is not current standing liquidity.
- displayed best-five depth is not committed future support/resistance.

## Anchored-VWAP lineage
Allowed anchor classes:
- SESSION_MECHANIC_ANCHOR
- EXTERNAL_EVENT_ANCHOR
- D01_STRUCTURAL_EVENT_ANCHOR
- MANUAL_PREDECLARED_ANCHOR

OUTCOME_SELECTED_ANCHOR is prohibited.

A VWAP anchored to a D01 event inherits PRICE_OHLC timing from that event and TRADED_VOLUME from subsequent flow. It is not an independent D01 confirmation by default.

## Historical replay
Exact historical anchored VWAP requires complete causal trade/value coverage from anchor through predictor freeze.

Prohibited:
- exact AVWAP reconstructed from OHLCV typical price;
- close*volume treated as exact transaction value;
- later aggregate flow backfilled as PIT;
- anchor chosen from a swing confirmed only later.

If exact flow is unavailable:
ANCHORED_VWAP_HISTORY_DATA_BLOCKED.

Prospective capture remains allowed with immutable source/time receipts.

## Live-book clock
Book receipts must carry snapshotAt, sourceFetchedAt, predictorFreezeAt, session mechanism, freshness state and market/lot identity.

snapshotAt > predictorFreezeAt => POST_HOC_NOT_ELIGIBLE.
stale snapshot => BOOK_CONTEXT_STALE.
Auction and continuous states remain separate.

## Context classes
- C0 STRUCTURAL_ONLY
- C1 VWAP_REFERENCE_NONSTRUCTURAL
- C2 STRUCTURE_VWAP_COINCIDENT
- C3 STRUCTURE_PROFILE_VWAP_COINCIDENT
- C4 STRUCTURE_BOOK_COINCIDENT
- C5 STRUCTURE_VWAP_BOOK_COINCIDENT
- C6 CONTEXT_NOT_EVALUABLE

These are context states, not votes.

## Information lineage
Possible raw roots:
PRICE_OHLC, TRADED_VOLUME, LIVE_ORDER_BOOK, EVENT_CLOCK.

Default:
independentVoteAllowed=false;
effectiveIndependentEvidenceCount=1;
residualIncrementalityStatus=NOT_VALIDATED.

Multiple raw roots do not automatically imply independent alpha.

## Future D16 questions
Q1 structural history beyond VWAP reference.
Q2 VWAP beyond structure and simpler D02 volume variables.
Q3 volume-profile concentration beyond VWAP first moment.
Q4 fresh live-book context beyond historical flow context.
Q5 whether any cost-basis story survives when reduced to observable fields only.
Q6 structurally anchored VWAP versus non-D01/external anchors.
Q7 multi-context coincidence after raw-vs-dedup lineage accounting.

## Current decision
VWAP_EQUALS_HOLDER_COST_BASIS=FALSE.
ANCHORED_VWAP_EQUALS_STRUCTURAL_MEMORY=FALSE.
VOLUME_PROFILE_EQUALS_VWAP=FALSE.
HISTORICAL_TRADED_VOLUME_EQUALS_LIVE_LIQUIDITY=FALSE.
DISPLAYED_DEPTH_EQUALS_COMMITTED_SUPPORT=FALSE.
STRUCTURAL_ANCHOR_VWAP_IS_INDEPENDENT_CONFIRMATION=FALSE.
PROVIDER_AVERAGE_EQUALS_EXACT_EXCHANGE_VWAP=FALSE_UNLESS_VERIFIED.
OHLCV_SYNTHETIC_ANCHORED_VWAP=PROHIBITED.
OUTCOME_SELECTED_ANCHOR=PROHIBITED.
DEFAULT_EFFECTIVE_INDEPENDENT_EVIDENCE_COUNT=1.
SDA_001_STATUS=REMEDIATION_IN_PROGRESS.
SDA_002_STATUS=REMEDIATION_IN_PROGRESS.
OUTCOME_JOIN=CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE=NONE.

## Exact next continuation
1. Build deterministic anchor-lineage, VWAP-eligibility and book-freshness helper/tests.
2. Preserve trade-flow, anchor and book clocks separately.
3. Hand residual/common-support semantics to D16.
4. Keep negative/stale/blocked/non-coincident states.
5. Next D01 science: separate transaction-weighted references from time-at-price/dwell-time references and participant-inventory data.
6. No runtime wiring / no Formal change.
