# D01 DL-047 — Structural Boundary vs VWAP / Anchored-VWAP / Cost-Reference / Live-Liquidity Objects V0.1

Updated: 2026-10-06 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / REFERENCE_OBJECT_FIREWALL / SDA_001_SDA_002_REMEDIATION / FORMAL_CORE_LOCKED

## 1. Purpose

DL-046 separated structural memory from historical volume-at-price concentration.

DL-047 freezes four reference objects that are frequently conflated in practitioner language:

1. SESSION_AVERAGE_PRICE_REFERENCE
2. EVENT_ANCHORED_VOLUME_WEIGHTED_REFERENCE
3. AGGREGATE_COST_REFERENCE_PROXY
4. LIVE_ORDER_BOOK_LIQUIDITY

They are not interchangeable.

A line computed from traded prices and volume is not automatically:
- investor cost basis;
- institutional cost;
- current liquidity support;
- behavioral anchoring;
- independent structural evidence.

No economic outcome is opened in this tranche.

## 2. Evidence context

VWAP is a standard execution benchmark and a volume-weighted average of traded prices over a specified interval.

Direct academic evidence for "anchored VWAP as support/resistance alpha" is sparse relative to practitioner usage.

Reference-dependent / disposition-effect literature provides a stronger separate mechanism family:
- Odean documents disposition behavior using brokerage-account data;
- Grinblatt and Han estimate an aggregate reference-price / cost-basis proxy from historical prices and turnover;
- related work finds aggregate reference prices can affect trading activity.

Critical distinction:
an estimated reference price is a proxy for aggregate cost basis, not direct observation of all investors' actual remaining purchase prices.

## 3. Canonical owner boundaries

### D02 owner
D02 owns price-volume participation / acceptance and session-average-price / VWAP-style diagnostics.

Existing repository semantics explicitly treat current provider average-price / VWAP-style position as an acceptance diagnostic, not proven standalone alpha.

### D20 owner
D20 owns behavioral reference dependence / cost-basis proxies.

D01 may consume a D20 reference-price receipt.
D01 may not invent a new behavioral cost-basis model and call it psychology.

### D05 owner
D05 owns current spread, depth, queue and order-book liquidity.

D01 may consume D05 live-liquidity receipts.
D01 may not infer current depth from VWAP or historical executed volume.

## 4. Four reference objects

### R0 — SESSION_AVERAGE_PRICE_REFERENCE

A cumulative average traded-price reference for the current session.

Current repository caution:
provider avgPrice / sessionVwapProxy is a provider average-price proxy.
It is not automatically a reconstructed exchange-truth VWAP unless source semantics certify the exact formula.

Use:
SESSION_AVERAGE_PRICE_PROXY unless exact VWAP construction is certified.

### R1 — EVENT_ANCHORED_VOLUME_WEIGHTED_REFERENCE

A volume-weighted average price computed from a causally declared anchor time through asOf.

Examples of legal anchor classes:
- session open;
- canonical breakoutConfirmedAt;
- first-known external event timestamp from the event owner;
- owner-approved structural event.

The anchor rule must be frozen before outcome inspection.

The anchor cannot be chosen because a later AVWAP line happened to fit support/resistance.

### R2 — AGGREGATE_COST_REFERENCE_PROXY

A D20-owned reference-price proxy intended to approximate aggregate investor cost basis or gain/loss state.

Examples:
- turnover-weighted historical reference-price models;
- validated short-side reference-price receipts.

This is a proxy.
It is not:
- actual all-account purchase price;
- remaining shareholder inventory;
- institutional average cost;
- exact breakeven inventory.

### R3 — LIVE_ORDER_BOOK_LIQUIDITY

D05-owned current market-state data:
- displayed bid/ask depth;
- spread;
- queue / level shape when supported;
- current execution state.

This is contemporaneous order-book state, not a historical volume-weighted price reference.

## 5. Session average is not anchored VWAP

SESSION_AVERAGE_PRICE_REFERENCE starts from the session's source-defined start.

EVENT_ANCHORED_VOLUME_WEIGHTED_REFERENCE starts from a preregistered causal anchor.

If the anchor is later than session start, the two references answer different questions.

Numerical proximity does not make them one causal object.

## 6. Anchored-reference causal clock

Every anchored reference must record:
- anchorClass;
- anchorRuleId;
- anchorRuleFrozenAt;
- anchorAt;
- anchorKnownAt;
- anchorSource;
- anchorVersion;
- priceVolumeWindowStart;
- priceVolumeWindowEnd;
- referenceAsOf;
- predictorFreezeAt;
- sourceFetchedAt;
- replaySafe.

Hard rules:
- anchorRuleFrozenAt must predate outcome inspection;
- anchorKnownAt <= predictorFreezeAt;
- anchorAt <= predictorFreezeAt;
- priceVolumeWindowEnd <= predictorFreezeAt;
- referenceAsOf <= predictorFreezeAt;
- sourceFetchedAt <= predictorFreezeAt;
- futureBarRequired = false.

Violation => POST_HOC_NOT_ELIGIBLE or DATA_BLOCKED.

## 7. No best-anchor search

Prohibited after outcome inspection:
- choosing breakout anchor vs earnings anchor vs swing-low anchor because one "worked";
- shifting the anchor by N bars;
- using the eventual lowest low / highest high as the anchor;
- selecting a visible event from the chart after the response;
- changing the anchor rule to improve returns.

Multiple anchor classes form one preregistered search family.

No best-anchor reporting without familywise accounting.

## 8. Retest bar cannot create its own anchor

If an AVWAP anchor depends on:
- the tested retest bar;
- a pivot confirmed after the test;
- a future local high/low;
- later event classification;

then it cannot be used as a predictor for that same test.

This extends SDA-002.

## 9. Session reference receipt

Every session-average receipt must preserve:
- sourceId;
- sourceVersion;
- sourceFieldName;
- formulaCertified boolean;
- sessionStart;
- asOf;
- sourceFetchedAt;
- predictorFreezeAt;
- market/session type;
- coverage state;
- replaySafe.

If formulaCertified != true:
label = SESSION_AVERAGE_PRICE_PROXY.

Do not rename it "exchange VWAP".

## 10. Aggregate cost-reference receipt

D01 may only consume a D20-owned cost/reference receipt that includes:
- referencePrice;
- referenceMethod;
- asOf;
- source lineage;
- rule vintage;
- proxyType;
- coverage state;
- replaySafe.

Required semantic label:
AGGREGATE_COST_REFERENCE_PROXY.

Forbidden labels without direct holdings/account evidence:
- TRUE_INVESTOR_COST_BASIS;
- INSTITUTIONAL_COST;
- MARKET_AVERAGE_ENTRY_PRICE;
- TRAPPED_HOLDER_PRICE.

## 11. Grinblatt-Han style reference caution

A turnover-weighted historical price reference is useful as a behavioral proxy because turnover can approximate how the holder population is refreshed.

But:
- turnover is not account-level ownership;
- high turnover does not reveal who sold to whom;
- the model embeds assumptions about holding decay;
- corporate actions / listing changes / missing turnover must be handled causally.

D01 does not implement this model independently.
D20 owns the behavioral contract.

## 12. Live liquidity is a separate mechanism

A session VWAP / anchored VWAP / cost-reference line may coincide with strong current bid depth.

That coincidence is not identity.

D05 live depth can change immediately while historical references remain fixed.

Therefore:
VWAP_REFERENCE != LIVE_LIQUIDITY;
COST_REFERENCE_PROXY != LIVE_LIQUIDITY.

If no D05 receipt exists:
CURRENT_LIQUIDITY_MECHANISM = UNKNOWN.

## 13. Structural-distance descriptors

For frozen structural zone [lower, upper] and each valid reference price P:

- referenceInsideZone;
- referenceDistancePrice;
- referenceDistanceTicks;
- referenceDistanceAtr;
- zoneCenterDistancePrice;
- sideRelativeToZone.

Store separately for:
- sessionAverageReference;
- anchoredVolumeWeightedReference;
- aggregateCostReferenceProxy.

No automatic bullish/bearish interpretation.

## 14. Reference-object coincidence classes

### C0 — STRUCTURAL_ONLY
Certified structural zone without coincident valid reference.

### C1 — SESSION_REFERENCE_COINCIDENT
Structural zone coincides with session average reference.

### C2 — ANCHORED_REFERENCE_COINCIDENT
Structural zone coincides with preregistered anchored volume-weighted reference.

### C3 — COST_PROXY_COINCIDENT
Structural zone coincides with D20 aggregate cost-reference proxy.

### C4 — LIVE_LIQUIDITY_COINCIDENT
Structural zone coincides with D05 current liquidity concentration / depth state.

### C5 — MULTI_REFERENCE_COINCIDENT
Several reference objects coincide.

### C6 — REFERENCE_NOT_EVALUABLE
One or more required receipts are missing / late / unsupported.

These are context classes, not vote counts.

## 15. Multi-reference coincidence does not multiply votes

A structural zone can coincide with:
- round number;
- prior close;
- auction reference;
- volume profile node;
- session average;
- anchored VWAP;
- cost-reference proxy;
- live depth.

This does not create eight independent confirmations.

Required lineage:
- PRICE_OHLC;
- TRADED_VOLUME;
- MARKET_MECHANICS_CONTEXT;
- optional BEHAVIORAL_REFERENCE_RECEIPT;
- optional LIVE_ORDER_BOOK_RECEIPT.

Default:
effectiveIndependentEvidenceCount = 1 for D01 selection interpretation;
independentVoteAllowed = false;
residualIncrementalityStatus = NOT_VALIDATED.

D16 decides whether an out-of-family residual exists.

## 16. Behavioral inference firewall

Price near AVWAP or a cost-reference proxy does not by itself prove:
- anchoring;
- disposition effect;
- trapped traders;
- breakeven selling;
- institutional defense.

Behavioral claims require D20-specific observables / validated proxies and appropriate falsification.

D01 only records reference coincidence.

## 17. Execution-benchmark firewall

VWAP is widely used as an execution benchmark.

A price being above/below VWAP can reflect:
- intraday trend;
- execution schedule;
- volume seasonality;
- event response;
- liquidity;
- broad market movement.

It is not intrinsically support/resistance.

Future inference must control generic price/volume and trend context.

## 18. Anchored-reference search family

Allowed anchor families must be preregistered.

For each family record:
- anchorFamilyId;
- allowedAnchorClasses;
- registryFrozenAt;
- variant count;
- anchor-rule hashes;
- postHocCount;
- noReferenceCount;
- dataBlockedCount.

A family consensus does not create multiple evidence votes.

## 19. Future comparison ladder

Future D16 analysis:

A0 RAW_STRUCTURAL
- structural zone only.

A1 SESSION_REFERENCE_CONTROLLED
- control session-average-price proximity.

A2 ANCHORED_REFERENCE_CONTROLLED
- control preregistered anchored-VWAP proximity.

A3 COST_REFERENCE_CONTROLLED
- add D20 cost-reference proxy where valid.

A4 VOLUME_PROFILE_CONTROLLED
- add DL-046 price-by-volume context.

A5 LIVE_LIQUIDITY_CONTROLLED
- add D05 current spread/depth context.

A6 MULTI_REFERENCE_DEDUP
- all co-located reference objects under lineage de-duplication.

A7 STRUCTURAL_RESIDUAL_REPLICATION
- structural effect survives on common support after reference controls.

## 20. Future interpretation labels

I0_SESSION_AVERAGE_EXPLANATION
I1_ANCHORED_REFERENCE_EXPLANATION
I2_COST_REFERENCE_PROXY_EXPLANATION
I3_LIVE_LIQUIDITY_EXPLANATION
I4_MULTI_REFERENCE_COMPOSITE
I5_STRUCTURAL_RESIDUAL_AFTER_REFERENCES
I6_REFERENCE_OBJECT_INCREMENTAL_CANDIDATE
I7_NOT_EVALUABLE

None authorizes Formal alpha.

## 21. Data-quality distinctions

Missing one reference does not zero-fill it.

Examples:
- session average unavailable -> UNKNOWN;
- D20 long-side cost reference unavailable -> UNKNOWN;
- D05 live depth unavailable -> UNKNOWN;
- anchored VWAP unavailable because historical intraday trades are unavailable -> UNKNOWN.

UNKNOWN != no coincidence.

## 22. SDA-001 firewall

All co-located reference descriptions must be tied to one parent decision.

rawRepresentationCount may exceed 1.

effectiveIndependentEvidenceCount remains 1 until residual incrementality is proven.

A D20 or D05 receipt may introduce a different primitive root, but even then it is a context input, not an automatic extra vote.

## 23. SDA-002 firewall

Every anchor / reference must be as-of safe.

No future pivot.
No outcome-selected anchor.
No later downloaded profile.
No later holdings estimate relabeled as prior knowledge.
No anchor created by the tested interaction itself.

## 24. Current decision

SESSION_AVERAGE_EQUALS_ANCHORED_VWAP =
FALSE.

VWAP_EQUALS_INVESTOR_COST_BASIS =
FALSE.

ANCHORED_VWAP_EQUALS_INSTITUTIONAL_COST =
FALSE.

COST_REFERENCE_PROXY_EQUALS_TRUE_HOLDINGS_COST =
FALSE.

VWAP_EQUALS_CURRENT_LIQUIDITY =
FALSE.

MULTI_REFERENCE_COINCIDENCE_EQUALS_MULTI_VOTE =
FALSE.

BEST_ANCHOR_AFTER_OUTCOMES =
PROHIBITED.

D02_SESSION_REFERENCE_OWNER =
TRUE.

D20_COST_REFERENCE_OWNER =
TRUE.

D05_LIVE_LIQUIDITY_OWNER =
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

## 25. Exact next continuation

1. Build deterministic session-reference / anchored-reference / cost-proxy / live-liquidity receipt validators and structural-distance descriptors.
2. Add adversarial tests for outcome-selected anchors, future pivots, provider-average mislabeled exchange VWAP, AVWAP mislabeled institutional cost, cost proxy mislabeled actual holdings, and multi-reference vote multiplication.
3. Hand A0-A7 / I0-I7 common-support and residual inference to D16.
4. Keep long-side aggregate cost-basis claims UNKNOWN unless D20 supplies a valid owner receipt.
5. Keep live-liquidity mechanism UNKNOWN without D05 receipt.
6. Preserve SDA-001/SDA-002 as REMEDIATION_IN_PROGRESS.
7. Next D01 science: separate historical cost/reference-price effects from actual holder turnover / ownership persistence so stale reference proxies are not treated as live inventory memory.
8. No runtime wiring / no Formal change.
