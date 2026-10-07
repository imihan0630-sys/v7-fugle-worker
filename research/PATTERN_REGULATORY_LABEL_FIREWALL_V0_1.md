# D01 DL-069 — Attention/Disposition Announcement Label-Effect Firewall V0.1

Updated: 2026-10-07 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / REGULATORY_LABEL_FIREWALL / FORMAL_CORE_LOCKED

## Purpose

Separate price-structure response from the informational and behavioral effect of being publicly labeled as an attention or disposition security.

The regulatory label is endogenous to prior abnormal trading and may itself alter salience, beliefs, media attention, broker behavior, financing constraints and order submission. D01 must not attribute post-label geometry solely to pre-existing support/resistance.

## Three causal objects

Keep separate:

1. PRE_LABEL_ABNORMAL_PATH
   - the price/volume path that triggered surveillance criteria.

2. PUBLIC_LABEL_EVENT
   - attention/disposition publication and the time it becomes observable.

3. TRADING_MECHANISM_INTERVENTION
   - periodic matching, prepayment, margin restrictions, order caps or suspension.

A label can exist before or without every downstream mechanism taking effect.
Do not collapse these clocks.

## Point-in-time event receipt

Required:
- regulatoryEventId
- labelType
- triggerFamily
- triggerWindowStart
- triggerWindowEnd
- announcedAt
- publiclyObservableAt
- effectiveStartAt
- effectiveEndAt
- measureSet
- revisionOrExtensionState
- source/version/hash
- predictorFreezeAt
- replaySafe

If publiclyObservableAt is unknown:
REGULATORY_LABEL_CLOCK_UNKNOWN.

## Endogeneity firewall

ATTENTION/DISPOSITION is not a random treatment.

The same prior price/volume extremes that create a pattern candidate can trigger the label.

Therefore:
POST_LABEL_BREAKOUT_OR_REVERSAL
does not identify
LABEL_CAUSED_RESPONSE
and does not identify
STRUCTURAL_LEVEL_CAUSED_RESPONSE.

The prior trigger path must be modeled explicitly.

## Salience and behavior channel

The public label can plausibly alter:
- investor attention
- risk perception
- broker warnings
- media/social discussion
- willingness to use leverage
- day-trading participation
- short-sale participation
- liquidity provision

D01 does not infer motive.
D13/D20/D05/D15 own respective macro/behavior/flow/execution context.

No REGULATORY_SENTIMENT_SCORE is defined.

## Announcement-return contamination

A structural level near the publication time is vulnerable to event contamination.

Separate:
- PRE_ANNOUNCEMENT_STRUCTURE
- ANNOUNCEMENT_WINDOW_PRICE_MOVE
- MECHANISM_EFFECTIVE_WINDOW
- POST_MECHANISM_STRUCTURE

A move that begins only after label publication is not historical evidence that the pre-label pattern had independent predictive value.

## Revision/extension path

Repeated attention/disposition events and extensions are not independent episodes if they descend from one surveillance chain.

Freeze:
regulatoryRootId
regulatoryEpisodeId
eventVersion
extensionOrdinal

Repeated notices do not multiply N unless a new independent episode is established.

## Negative controls

Useful falsifiers:
- abnormal securities that trigger attention but do not progress to disposition;
- similar abnormal-path securities just below trigger thresholds where support is adequate;
- label events far from structural zones;
- structural-zone events without regulatory labels.

Threshold-near comparisons are diagnostic only unless institutional rules and support permit a credible design.

## Comparator families

A: label increment
A0 MATCHED_ABNORMAL_PATH_WITHOUT_LABEL_OR_BEFORE_PUBLICATION
A1 MATCHED_ABNORMAL_PATH_AFTER_PUBLIC_LABEL

B: mechanism increment
B0 LABELED_SECURITY_BEFORE_MECHANISM_EFFECTIVE
B1 LABELED_SECURITY_AFTER_MECHANISM_EFFECTIVE

C: structure increment
C0 LABEL_EVENT_AWAY_FROM_STRUCTURAL_ZONE
C1 LABEL_EVENT_AT_STRUCTURAL_ZONE

Do not pool A/B/C into one effect.

## D16 ladder

L0 RAW_POST_LABEL_STRUCTURE_RESPONSE
L1 TRIGGER_PATH_RECONSTRUCTED
L2 LABEL_PUBLICATION_CLOCK_CONTROLLED
L3 REGULATORY_ROOT_EPISODE_DEDUPED
L4 PRE_LABEL_ABNORMALITY_CONTROLLED
L5 LABEL_ONLY_VS_MECHANISM_WINDOW_SEPARATED
L6 MARKET_SECTOR_EVENT_CONTEXT_CONTROLLED
L7 LIQUIDITY_LEVERAGE_PARTICIPATION_CONTROLLED
L8 MATCHED_ABNORMAL_NO_LABEL_OR_PRE_LABEL_COMPARATOR
L9 AWAY_FROM_ZONE_LABEL_COMPARATOR
L10 MECHANISM_EFFECTIVE_STATE_CONTROLLED
L11 STRUCTURAL_RESPONSE_RESIDUAL_CANDIDATE
L12 MULTI_TRIGGER_MULTI_EVENT_MULTI_REGIME_REPLICATION

## Interpretation states

Q0 PRE_LABEL_ABNORMAL_PATH_EXPLANATION
Q1 PUBLIC_SALIENCE_LABEL_EXPLANATION
Q2 BROKER_OR_PARTICIPANT_BEHAVIOR_EXPLANATION
Q3 MECHANISM_INTERVENTION_EXPLANATION
Q4 EVENT_NEWS_COUPLING_EXPLANATION
Q5 STRUCTURAL_RESPONSE_RESIDUAL
Q6 LABEL_CLOCK_UNKNOWN
Q7 NOT_EVALUABLE

## SDA

SDA-001 remains open: post-label breakout/reversal and price pattern share PRICE_OHLC ancestry.

SDA-002 remains open: label and mechanism clocks must be first-known/replay-safe; later classification may not backfill an earlier predictor.

## Current decision

REGULATORY_LABEL_EQUALS_DIRECTIONAL_SIGNAL = FALSE.
LABEL_EFFECT_EQUALS_MECHANISM_EFFECT = FALSE.
PRE_LABEL_ABNORMALITY_EQUALS_PATTERN_ALPHA = FALSE.
REPEATED_NOTICES_EQUAL_INDEPENDENT_EPISODES = FALSE.
OUTCOME_JOIN = CLOSED.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Build regulatory-root and label-vs-mechanism clock classifier.
2. Add adversarial tests for post-label hindsight, repeated-notice N inflation, label/mechanism clock collapse and abnormal-trigger confounding.
3. Hand L0-L12/Q0-Q7 to D16.
4. Continue DL-070: sparse-liquidity/stale-print/price-clustering false support-resistance.
