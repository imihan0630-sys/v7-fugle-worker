# D02 owner-approved 15-item specialist return — D02-07 / D02-08 V0.1

Updated: 2026-10-03 Asia/Taipei
Status: SPECIALIST_RETURN_READY / RESEARCH_ONLY
Parent:
shared-knowledge/CURRICULUM_15_ITEM_DEPENDENCY_AUDIT_20261003_V0_1.md

## D02-07 OBV
Owner-approved governance:
OBSERVATION / RESEARCH_ONLY / MERGE_CANDIDATE / PRICE_VOLUME_COMPARATOR_ONLY.

### Current evidence
OBV is a deterministic transform of close-direction and volume.
Existing D02/PV and technical-indicator audits already show high overlap with:
- direct return direction;
- raw/relative volume;
- price-volume response;
- cumulative-volume information.

Therefore OBV has no right to an independent Alpha vote merely because its cumulative line diverges.

### Required residual test
On common PIT support compare:
A direct price/return state;
B + direct volume/RVOL/turnover;
C + PV response/persistence;
D + bounded/windowed OBV slope/divergence descriptor.

D is useful only if it adds stable OOS/prospective information after A/B/C with costs and Regime controls.

### Current classification
`OBSERVATION_ONLY / COMPARATOR_ONLY / MERGE_CANDIDATE_PENDING_INCREMENTAL_TEST`.

No maturity change: L2 / 40%.

If D adds no residual information:
recommend merge into the D02 price-volume family or UI/explanation only.
No standalone Hard Gate / PRIMARY_ALPHA.

## D02-08 accumulation/distribution proxy
Owner-approved governance:
OBSERVATION / RESEARCH_ONLY / STRONG_MERGE_CANDIDATE_IF_UNIDENTIFIABLE.

### Current identifiability evidence
OHLCV alone cannot identify hidden actor intent.
Opposite latent order-flow mechanisms can map to the same OHLCV path.

Current D02/PV recorder does not preserve the dynamic side-pressure/replenishment evidence required to resolve:
- accumulation vs distribution;
- passive absorption direction;
- queue replenishment/resiliency;
- true event-level OFI.

Upstream Fugle source capability is richer, but that evidence family belongs to the Microstructure dependency lane and is not currently a D02 production receipt.

### Alternative explanations that remain live
- ordinary liquidity/rebalancing;
- event/news flow;
- disagreement/high turnover;
- passive absorption;
- crowding/exhaustion;
- market/sector-wide activity.

### Current classification
`STRONG_MERGE_CANDIDATE_IF_STANDALONE_REMAINS_OHLCV_ONLY / HOLD_PENDING_INDEPENDENT_MICROSTRUCTURE_EVIDENCE`.

No maturity change: L2 / 40%.

If future microstructure evidence becomes available:
D02-08 may remain as a consumer/interpretation module only if it proves a distinct decision role beyond D02-05/06/09 and D05/D06-13 dependencies.

If no independent observable family survives:
recommend safe merge into effort-response/divergence context rather than retaining a narrative-intent module.

## Shared governance
- no duplicate Alpha vote;
- no “主力意圖” inference from OHLCV transforms;
- UNKNOWN remains UNKNOWN;
- no retirement/merge executed by this room;
- 00｜研究總控室 owns final anti-orphan and Dependency Audit.

Formal Core remains LOCKED.
