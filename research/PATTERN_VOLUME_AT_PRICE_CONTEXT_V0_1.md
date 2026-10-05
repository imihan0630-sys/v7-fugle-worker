# D01 DL-046 — Structural Memory vs Volume-at-Price / Historical Traded-Volume Concentration V0.1

Updated: 2026-10-06 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / PROSPECTIVE_PROFILE_ONLY / SDA_001_SDA_002_REMEDIATION / FORMAL_CORE_LOCKED

## 1. Purpose

DL-045 separated structural price memory from round-number and tick-grid salience.

DL-046 freezes another commonly asserted explanation:

> A price level may appear to act as support/resistance because a large amount of historical trading occurred near that price.

This hypothesis is plausible but must be separated from:
- structural turning-point memory;
- round-number / tick-grid salience;
- prior-close / auction-reference anchoring;
- generic time-at-price;
- D02 abnormal-volume / participation effects;
- D05 current order-book liquidity.

No economic outcome is opened in this tranche.

## 2. Evidence boundary

Direct academic evidence that conventional volume-profile nodes deliver stable independent support/resistance alpha is limited relative to:
- general support/resistance evidence;
- order-price clustering evidence;
- market-microstructure evidence.

Emerging work studies volume-weighted support/resistance construction and volume-at-price structure, but this does not authorize treating a high-volume node as a proven predictive barrier.

Therefore D01 classifies volume-at-price concentration as:

HISTORICAL_TRADING_DENSITY_CONTEXT

not:
PROVEN_STRUCTURAL_MEMORY;
CURRENT_LIQUIDITY;
INDEPENDENT_ALPHA.

## 3. Canonical owner boundary

D02-12 owns PRICE_BY_VOLUME_PROFILE semantics.

D01 consumes a D02-owned receipt and does not reconstruct an independent profile engine.

The current canonical D02 constraint is critical:
- current-day / prospective volume-at-price capture is feasible;
- historical OOS price-by-volume replay is not established by the current source;
- historical volume-at-price may not be synthesized from OHLCV candles.

Therefore:

HISTORICAL_PROFILE_BACKFILL_FROM_OHLCV =
PROHIBITED.

Prospective capture is allowed only with complete source/time provenance.

## 4. Information lineage

A price-by-volume profile is not pure price information and not pure volume information.

Frozen roots:
- PRICE_OHLC;
- TRADED_VOLUME.

Representation family:
D02_PRICE_BY_VOLUME_PROFILE_CONTEXT.

For D01/D02 confluence:
- rawRepresentationCount may increase;
- independentVoteAllowed = false by default;
- residualIncrementalityStatus = NOT_VALIDATED;
- D16 must test incremental contribution beyond price structure and beyond simpler D02 volume controls.

The presence of an extra raw data root does not automatically imply independent alpha.

## 5. Executed volume is not standing liquidity

Historical traded volume at a price means transactions occurred there.

It does NOT establish:
- current displayed bid depth;
- current displayed ask depth;
- hidden liquidity;
- queue priority;
- resting institutional inventory;
- current willingness to defend the level.

Those require D05 order-book / microstructure evidence.

Therefore:
HIGH_TRADED_VOLUME_NODE != CURRENT_LIQUIDITY_WALL.

## 6. Executed volume is not investor inventory

The same shares can trade multiple times.
Historical executed volume can exceed free float.
Ownership changes after the trade.

Therefore volume-at-price cannot be interpreted directly as:
- number of trapped holders;
- remaining cost-basis inventory;
- unrealized P/L inventory;
- institutional ownership at that level.

Such behavioral/inventory interpretation is UNIDENTIFIED without separate observables.

D20 owns behavioral mechanism interpretation.

## 7. Prospective receipt

Every usable profile snapshot must contain:
- symbol;
- marketDate;
- profileAsOf;
- sourceFetchedAt;
- sourceId;
- sourceVersion;
- sessionPhase;
- marketType;
- profileWindowStart;
- profileWindowEnd;
- priceBins;
- binConstructionRuleId;
- priceUnit / tick provenance;
- totalExecutedVolume;
- profileCoverageState;
- providerClassificationCaveats;
- manifest hash.

Hard rule:
sourceFetchedAt <= predictorFreezeAt.

A profile captured after the decision time cannot enter that decision.

## 8. Bin-construction firewall

Volume-by-price concentration depends on bin definitions.

D01 does not allow outcome-tuned:
- bin width;
- price rounding;
- tick grouping;
- kernel bandwidth;
- node-merging threshold;
- number of bins.

Bin construction must come from:
- exact exchange price levels when the source already provides them; or
- a preregistered D02/D05-approved deterministic grouping rule.

If the grouping rule changes:
new profile-family version.

No best binning after outcomes.

## 9. Point-in-time tick semantics

Price bins must use point-in-time legal tick semantics.

DL-045 / D04-D05 tick receipts remain authoritative.

Current tick size may not be backfilled into historical formation.

If tick provenance is missing:
PROFILE_TICK_CONTEXT_UNKNOWN.

## 10. Core continuous descriptors

D01 freezes descriptors but no bullish/bearish score.

Given frozen structural zone [lower, upper] and a causally valid profile:

- zoneExecutedVolume;
- zoneVolumeShare = zoneExecutedVolume / totalExecutedVolume;
- maxVolumePrice;
- maxNodeVolumeShare;
- structuralCenterDistanceToMaxNodePrice;
- structuralCenterDistanceToMaxNodeTicks;
- structuralCenterDistanceToMaxNodeAtr where legal;
- structuralZoneContainsMaxNode boolean;
- distinctPriceLevelCount;
- profileCoveredVolumeShare where source semantics support it.

Optional bid/ask-classified fields are OUT_OF_SCOPE for V0.1 directional inference.

## 11. No arbitrary high-volume-node threshold

D01 does not define:
- top 10% volume node;
- 70% value area;
- volume > 2x average;
- one universal high-volume threshold.

Those are implementation choices / parameter families and require preregistration before outcome access.

V0.1 uses continuous descriptors.

## 12. Time-at-price confound

Large traded volume at a price can arise because the market simply spent more time there.

Therefore future analysis must distinguish:
- traded-volume concentration;
- time-at-price / dwell time;
- trading intensity conditional on dwell time.

If time-at-price data are unavailable:
VOLUME_DENSITY_MECHANISM_PARTIALLY_IDENTIFIED.

Do not attribute all concentration to demand/supply conviction.

## 13. Round / reference-price confound

A high-volume node may coincide with:
- round number;
- tick-band transition;
- prior close;
- opening auction reference;
- structural boundary.

DL-044/DL-045 contexts remain mandatory.

Co-location does not create multiple independent confirmations.

Default:
redundancyGroup = D01_D02_PRICE_VOLUME_LEVEL_CONTEXT;
independentVoteAllowed = false.

## 14. Structure-vs-volume comparator family

Future D16 comparison classes:

V0 STRUCTURAL_ONLY
- certified structural zone;
- no coincident major volume node under preregistered descriptor rule.

V1 VOLUME_NODE_NONSTRUCTURAL
- salient traded-volume concentration;
- no certified structural root.

V2 STRUCTURE_VOLUME_COINCIDENT
- certified structural zone overlaps / contains volume concentration.

V3 ROUND_REFERENCE_VOLUME_NODE
- volume concentration is also round/reference-price salient.

V4 PROFILE_NOT_EVALUABLE
- missing / late / incomplete / unsupported profile.

No class is alpha by itself.

## 15. Incrementality questions

Q1:
Does structural history add representation beyond volume-at-price concentration?

Q2:
Does volume-at-price concentration add representation beyond structural history?

Q3:
Does V2 outperform V0/V1 after D02 participation/turnover and DL-044/DL-045 reference controls?

Q4:
Does any V2 advantage disappear after time-at-price / liquidity / event-flow controls?

Q5:
Does prospective performance survive de-duplication against simpler D02 volume variables?

Q6:
Does a volume-profile descriptor add residual information beyond the canonical root without becoming a second vote?

## 16. Prospective-only evidence lane

Because historical price-by-volume replay is not established:

- historical backtest using reconstructed volume profiles is prohibited;
- V0.1 can define semantics and prospective collection;
- future evidence must use profiles captured prospectively with sourceFetchedAt;
- missing historical profile = UNKNOWN, not zero;
- no retrospective synthetic Shadow.

This is a direct SDA-002 no-lookahead requirement.

## 17. Coverage accounting

Future profile evidence must report:
- profileEligibleCount;
- profileCapturedCount;
- lateProfileCount;
- dataBlockedCount;
- sessionUnsupportedCount;
- profileIncompleteCount;
- noStructureCount;
- structuralOnlyCount;
- volumeOnlyCount;
- coincidentCount.

A successful-case-only denominator is prohibited.

## 18. D02 owner constraints

D01 consumes but does not duplicate:
- D02-12 PRICE_BY_VOLUME_PROFILE;
- D02 turnover / liquidity;
- D02 abnormal-volume context;
- D02 time-of-day participation.

D02's official caveat remains:
current source bid/ask classified volume may not sum to total volume because opening first trade is excluded from inside/outside classification.

DL-046 V0.1 therefore uses total executed volume by price for core descriptors and does not infer directional buy/sell pressure from incomplete classification.

## 19. D05 owner constraints

D05 remains authoritative for:
- spread;
- depth;
- queue;
- displayed liquidity;
- execution mechanics.

A historical high-volume node must not be labeled CURRENT_ORDER_BOOK_SUPPORT without a separate D05 receipt.

## 20. SDA-001 firewall

A structural zone plus volume node may look like "price + volume confirmation."

That label is not an independent vote by default.

Required lineage:
- informationRoots = [PRICE_OHLC, TRADED_VOLUME];
- shared price ancestry is explicit;
- D02 volume controls are explicit;
- effectiveIndependentEvidenceCount remains 1 until D16 validates residual incrementality.

A future validated residual may justify an incremental representation.
It still does not automatically justify a second score vote.

## 21. SDA-002 firewall

A profile snapshot is only usable for a decision if:
- sourceFetchedAt <= predictorFreezeAt;
- profileAsOf <= predictorFreezeAt;
- session coverage is known;
- no future trade is included;
- replaySafe = true.

Current-day prospective capture is not historical replay.

A later downloaded profile cannot be relabeled as what was known earlier.

## 22. Current decision

VOLUME_NODE_EQUALS_STRUCTURAL_MEMORY =
FALSE.

HISTORICAL_PROFILE_FROM_OHLCV =
PROHIBITED.

HIGH_TRADED_VOLUME_NODE_EQUALS_CURRENT_LIQUIDITY =
FALSE.

HIGH_TRADED_VOLUME_NODE_EQUALS_REMAINING_INVESTOR_COST_BASIS =
FALSE.

VOLUME_PROFILE_CREATES_INDEPENDENT_VOTE =
FALSE.

D02_PRICE_BY_VOLUME_PROFILE_OWNER =
TRUE.

CORE_DIRECTIONAL_BID_ASK_PROFILE_USE =
DEFERRED.

PROSPECTIVE_CAPTURE_REQUIRED =
TRUE.

RESIDUAL_INCREMENTALITY_STATUS =
NOT_VALIDATED.

SDA_001_STATUS =
REMEDIATION_IN_PROGRESS.

SDA_002_STATUS =
REMEDIATION_IN_PROGRESS.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 23. Exact next continuation

1. Build deterministic prospective profile-receipt validator, zone-volume descriptors and owner-lineage diagnostics.
2. Add adversarial tests for OHLCV synthetic backfill, late profile fetch, future trades, outcome-tuned bins, executed-volume/current-liquidity conflation and double-vote confluence.
3. Hand V0-V4 and Q1-Q6 common-support / residual inference to D16.
4. Keep historical price-by-volume outcome inference CLOSED until D02 provides prospective or genuinely replayable profile evidence.
5. Preserve SDA-001/SDA-002 as REMEDIATION_IN_PROGRESS until canonical closure evidence exists.
6. Next D01 science: separate volume-at-price concentration from anchored VWAP / volume-weighted cost-reference effects and from actual live order-book liquidity.
7. No runtime wiring / no Formal change.
