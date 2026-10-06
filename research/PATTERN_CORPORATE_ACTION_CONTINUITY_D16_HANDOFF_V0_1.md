# D01 DL-065 — D16 Corporate-Action Continuity Attribution Handoff V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## 1. Purpose

D01 freezes Pattern/K-line usage of corporate-action semantic spaces.
Corporate Actions lane owns transformation semantics.
D16 owns future residual inference.

Question:
Does structural response survive after verified corporate-action mechanical price resets and semantic-space contamination are removed?

## 2. Canonical spaces

Preserve separately:
- RAW_EXECUTION;
- TECHNICAL_CONTINUITY;
- PRICE_INDEX_COMPARABLE;
- TOTAL_RETURN_COMPARABLE.

Do not pool them or count them as independent confirmations.

## 3. Required corporate-action receipt

At minimum:
- action family/stage/type;
- effective date;
- event version;
- firstKnownAt;
- finalScheduleKnownAt;
- factor version;
- technicalPriceFactor;
- source/version/hash;
- replaySafe.

Historical replay selects only a version known by predictor freeze.

## 4. Primary semantic falsifier

Always report:
- RAW breakout / CONTINUITY no-breakout;
- RAW gap / CONTINUITY mechanical reset;
- RAW support break / CONTINUITY preserved;
- RAW and CONTINUITY agree.

These are semantic-mechanics findings, not alpha.

## 5. Comparator

G0 CORPORATE_ACTION_EVENT_AWAY_FROM_STRUCTURAL_ZONE
G1 CORPORATE_ACTION_EVENT_AT_STRUCTURAL_ZONE

Common support:
- action family;
- adjustment magnitude;
- liquidity;
- volatility/regime;
- structural age/history;
- suspension/resumption;
- opening auction;
- event/news context.

## 6. Volume semantics

Price factor does not imply volume factor.

Consume Corporate Actions lane volume mode:
NONE / UNIT_SCALE / SUPPLY_CHANGE / UNKNOWN.

Unknown or unresolved supply semantics remain blocked for questions requiring comparable volume.

## 7. Provider-history caution

Provider-adjusted history without point-in-time adjustment-vintage evidence is not admissible for historical replay.

Do not use later-adjusted bars as if they were visible at the original decision date.

## 8. Future ladder

C0 RAW_PRICE_ZONE_RESPONSE
C1 CORPORATE_ACTION_EVENT_IDENTIFIED
C2 POINT_IN_TIME_EVENT_VERSION_CONTROLLED
C3 TECHNICAL_CONTINUITY_FACTOR_VERIFIED
C4 RAW_VS_CONTINUITY_GEOMETRY_SEPARATED
C5 SYMBOL_SESSION_SUSPENSION_CONTROLLED
C6 VOLUME_SEMANTICS_CONTROLLED
C7 REFERENCE_CONFLICTS_EXCLUDED_OR_STRATIFIED
C8 GENERIC_CORPORATE_ACTION_COMPARATOR_CONTROLLED
C9 PROVIDER_ADJUSTMENT_VINTAGE_CONTROLLED
C10 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE
C11 MULTI_ACTION_MULTI_DATE_MULTI_SYMBOL_REPLICATION

## 9. Interpretation

If RAW effect disappears in TECHNICAL_CONTINUITY:
MECHANICAL_REFERENCE_RESET_EXPLANATION.

If residual depends on unsafe adjusted history:
PROVIDER_ADJUSTMENT_LOOKAHEAD_EXPLANATION.

If continuity-space response survives all layers:
STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE.

Still not causal proof or alpha.

## 10. SDA / promotion boundary

All price semantic views retain PRICE_OHLC ancestry.
Default effectiveIndependentEvidenceCount = 1.

SDA-001/SDA-002 remain open.

No ranking, gating, Top6, weights, capital, threshold or runtime change is authorized.

Formal Core remains LOCKED.
