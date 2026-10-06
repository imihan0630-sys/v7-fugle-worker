# S2-07 Technical Continuity Bridge V1.1 — Physical Evidence

Date: 2026-10-07 Asia/Taipei  
Scope: 4806 / TPEX / CAPITAL_REDUCTION only  
Status: PHYSICAL_PASS / BOUNDED_CONTINUITY_BRIDGE_READY_PIT_BLOCKED  
Formal Core: LOCKED  
Trading authority: NONE

## Authoritative execution

- merge: `2250ba518e4e6b0e64d2df31406ffe51a9b752df` (PR #724)
- workflow: `System2 S2-07 Technical Continuity Bridge V1.1 Readonly`
- merged-main run: `37534597007`
- job: `112512227519`
- result: PASS
- merged-main System2 Research CI: `37534597078` PASS
- PR System2 Research CI: `37534398950` PASS
- PR V8 Regression: `37534399074` PASS

## Physical result

The single eligible V1.0 lineage case, 4806, produced:

- official pre-action close = 10.4
- official resume reference price = 14.87
- official reference-price ratio = 1.4298076923076921
- RAW pre-suspension close = 10.4
- transformed pre-suspension close in reference-price space = 14.87
- RAW resume open = 13.7
- RAW resume close = 13.4
- residual open gap vs official reference = -7.86819098856758%
- residual close move vs official reference = -9.885675857431064%

The mechanical reset bridge reconciles exactly at the bounded event boundary. The observed resume-session price move is therefore separable from the corporate-action mechanical reset for research description.

## PIT firewall

The official TPEx reference event remains:

- `knowledgeTimeMode=HISTORICAL_UNKNOWN`
- `firstKnownAt=null`
- `availableAt=null`
- `pitEventReplayEligible=false`

Therefore the correct state is:

`BOUNDED_CONTINUITY_BRIDGE_READY_PIT_BLOCKED`

with:

`pitReplayBlocker=OFFICIAL_EVENT_KNOWLEDGE_CLOCK_HISTORICAL_UNKNOWN`

This is not a failure of price geometry. It is a historical availability/version-clock provenance blocker.

## Read-only / authority evidence

- D1 requestCount = 3
- D1 rowsRead = 9
- D1 rowsWritten = 0
- RAW history mutated = false
- adjusted history persisted = false
- continuity transform performed = false
- technicalContinuityCertified = false
- allHistoryContinuityCertified = false
- selection/final-selection/push/capital/order authority = false
- System1 runtime used = false

5381 / 6241 / 3086 remain blocked on canonical DATA_LANE RAW A1 coverage and do not inherit 4806's positive result.

## Next BUILD_LANE gate

Investigate only the official reference event's historical availability/version-clock provenance. Do not backdate the current official retrieval, infer firstKnownAt, or promote the bridge into PIT replay until independent evidence supports the historical clock.
