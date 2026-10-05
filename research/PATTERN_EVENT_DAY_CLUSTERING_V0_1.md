# D01 DL-042 — Pattern Generalization vs Event-Day / Scheduled-Information Clustering V0.1

Updated: 2026-10-05 Asia/Taipei
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / EVENT_CLUSTER_FIREWALL / FORMAL_CORE_LOCKED

## 1. Purpose

DL-041 separated Pattern generalization from market-wide common shocks and beta exposure.

DL-042 freezes the next dependence layer:

> Several stocks, sectors or market dates can still be one information event or one event family.

Examples include:
- scheduled macro announcements;
- FOMC policy decisions;
- CPI / PPI / employment releases;
- major policy announcements;
- issuer earnings / revenue / investor-conference events;
- event clusters that affect many stocks simultaneously.

A Pattern result that concentrates around such events cannot be called generic Pattern evidence without event-aware falsification.

No future outcome is opened in D01.

## 2. Evidence context

External evidence shows scheduled information days can have return behavior that differs materially from ordinary days.

- Pre-FOMC research documents large market-wide equity returns around scheduled FOMC meetings, including effects across industries and international markets.
- Macroeconomic-announcement research finds a large share of the market equity premium can occur on a small number of scheduled announcement days and that beta-return relations can differ on such days.
- Earnings-announcement research documents a distinct announcement premium and volume concentration.
- Research on macro and firm-level news shows same-day macro information can alter how firm-specific earnings news is incorporated.

Therefore event-day concentration is a real alternative explanation for apparent Pattern replication.

## 3. Ownership boundary

D01 owns:
- Pattern structural / opportunity state;
- claim scope;
- event-cluster dependence firewall.

D08 event/news lane owns:
- scheduled vs unscheduled event-risk semantics;
- issuer-event category / disclosure timing where routed;
- common-event exposure concepts.

D13 macro/cross-market lane owns:
- macro schedule vintage;
- release clocks;
- initial release / consensus / surprise separation;
- firstEligibleTaiwanDecision.

D17 / disclosure-clock owners remain authoritative for issuer disclosure timestamps where applicable.

D16 owns economic inference.

D01 consumes owner receipts and does not rebuild event calendars or surprise models.

## 4. Four event clocks must remain separate

For any event:

A. SCHEDULE_CLOCK
- scheduledAt;
- firstKnownScheduledAt;
- scheduleVintageId;
- revision / cancellation state.

B. RELEASE_CLOCK
- releasedAt;
- firstObservedAt;
- initial-vintage receipt.

C. SURPRISE_CLOCK
- consensusKnownAt;
- initial release;
- surprise computable only after release and only when consensus vintage is valid.

D. MARKET_REACTION_CLOCK
- asset-price reaction after release.

No later clock may be backfilled into an earlier predictor snapshot.

## 5. Decision-relative event states

At predictorFreezeAt classify only information already known.

Allowed states:

E0 NO_KNOWN_EVENT
- no owner-certified event known by freeze.
- does NOT mean no event can occur.

E1 SCHEDULED_PENDING
- event schedule known;
- realized release / surprise still future.

E2 REALIZED_PRE_FREEZE
- initial release is already public before freeze.

E3 UNSCHEDULED_DISCLOSED_PRE_FREEZE
- unscheduled event becomes public before freeze.

E4 EVENT_AFTER_FREEZE_FUTURE
- release/event occurs after freeze and cannot enter predictor state.

E5 EVENT_CONTEXT_UNKNOWN
- schedule/disclosure vintage incomplete.

## 6. Event family, event instance and common-event cluster

Preserve three identities.

EVENT_FAMILY
Examples:
- FOMC;
- CPI;
- Employment Situation;
- issuer earnings;
- monthly revenue.

EVENT_INSTANCE
One specific dated event:
- 2026-09 FOMC meeting;
- one CPI release;
- one issuer's 2026Q3 earnings announcement.

COMMON_EVENT_CLUSTER
One information shock that can affect many stocks / sectors / dates.

A single event instance can map to many stock rows.

Several event instances can belong to one event family.

Do not collapse these levels.

## 7. Market date is not event independence

One event can influence:
- the pre-event Taiwan date;
- the overnight session;
- the post-event Taiwan open;
- the next full cash session.

Therefore:
marketDateClusterN may exceed eventInstanceClusterN.

Do not call those several independent replications if they belong to one event instance.

Likewise, many stocks on one event instance are one event-cluster dependence family.

## 8. Event-family replication is not event-instance replication

Eight FOMC meetings are:
- eight event instances;
- one event family.

A result that survives several FOMC instances can support FOMC-family replication.

It does not establish:
- CPI replication;
- earnings-event replication;
- generic non-event Pattern evidence.

Claim scope must remain explicit.

## 9. Scheduled event presence is not event direction

At SCHEDULED_PENDING:
- the existence and timing of the event may be known;
- the realized value / surprise / sign is unknown.

Prohibited:
- assigning positive/negative macro surprise before release;
- using final revised data;
- attaching post-release market reaction to the pre-release predictor;
- treating scheduled-event presence as bullish/bearish alpha.

## 10. Event-calendar vintage firewall

A current event calendar cannot reconstruct a historical schedule state unless archived/captured owner receipts prove it.

Required where applicable:
- firstObservedAt;
- capturedAt;
- sourceCalendarLastModifiedAt;
- priorScheduleReceiptId;
- revisionType;
- timezone;
- decisionWindowState.

Historical revisions / reschedules remain UNKNOWN without vintage receipts.

## 11. Earnings season is not one event by default

Do not label a broad date range "earnings season" and treat all issuer announcements as one common event without an owner-certified cluster relation.

Issuer earnings are distinct event instances.

A common market-wide earnings-season context may be studied only if preregistered and owner-defined.

No post-outcome season boundary.

## 12. Event-day premium confound

A Pattern cohort concentrated on announcement dates may inherit:
- macro announcement premium;
- pre-FOMC drift;
- earnings announcement premium;
- event-related volatility / attention;
- event-specific beta repricing.

This can survive ordinary market controls.

Therefore future D16 analysis must explicitly compare event and non-event states.

## 13. Event-cluster denominator

Future reports must preserve separately:

stockObservationN;
uniqueSymbolN;
structuralRootN;
marketDateClusterN;
eventInstanceClusterN;
eventFamilyN;
commonEventClusterN;
nonEventMarketDateN;
unknownEventContextN.

Many rows on one event instance do not increase eventInstanceClusterN.

## 14. No outcome-selected event exclusion

Prohibited:
- removing FOMC dates because Pattern performs poorly there;
- removing CPI dates because they dominate volatility;
- defining "extreme event" from observed Pattern returns;
- selecting only event families where Pattern works.

Allowed only under preregistration:
- full sample;
- event-stratified analysis;
- owner-defined event-family exclusion sensitivity;
- leave-one-event-instance-out;
- leave-one-event-family-out;
- non-event-date replication test.

## 15. Future comparison ladder

A0 RAW_MARKET_RESIDUAL_PATTERN
- after DL-041 market/beta controls.

A1 EVENT_STATE_STRATIFIED
- separate known non-event / scheduled pending / realized pre-freeze / unscheduled known / unknown.

A2 EVENT_INSTANCE_CLUSTERED
- account for event-instance dependence.

A3 EVENT_FAMILY_CLUSTERED
- account for repeated instances in the same family.

A4 NON_EVENT_DATE_RESIDUAL
- ask whether Pattern survives outside owner-defined event windows.

A5 CROSS_EVENT_FAMILY_REPLICATION
- ask whether residual representation survives multiple event families.

A6 EVENT_AND_NON_EVENT_REPLICATION
- strongest claim-scope candidate: survives both event and non-event conditions across independent clusters.

## 16. Future interpretation states

C0 ANNOUNCEMENT_DAY_EXPLANATION
- raw Pattern difference disappears after event-state control.

C1 PRE_EVENT_DRIFT_EXPLANATION
- effect concentrates before scheduled events.

C2 EVENT_FAMILY_SPECIFIC
- effect survives only within a preregistered event family.

C3 EVENT_INSTANCE_DEPENDENCE
- many rows collapse to few event instances.

C4 NON_EVENT_RESIDUAL_PATTERN
- Pattern remains on non-event dates.

C5 CROSS_EVENT_RESIDUAL_PATTERN
- Pattern remains across independent event families.

C6 EVENT_AND_NON_EVENT_PATTERN_CANDIDATE
- residual representation survives event and non-event conditions.

C7 NOT_EVALUABLE
- event calendar / release / vintage / common support inadequate.

None proves alpha.

## 17. Common support

Event vs non-event inference must preserve overlap in:
- DL-039 size/liquidity/listing age;
- DL-040 sector context;
- DL-041 beta / market regime;
- Pattern opportunity geometry;
- detector history;
- price/tick tier;
- pre-event volatility;
- tradability / constraint state.

If event and non-event samples occupy disjoint contexts:
EVENT_CONTEXT_EXTRAPOLATION_PROHIBITED.

## 18. Macro event and issuer event are different families

Market-wide macro:
- can affect many sectors simultaneously.

Issuer-specific:
- can affect one company and economically linked peers.

Do not pool them merely because both are "events."

Common-event cluster relation must come from owner evidence, not D01 narrative.

## 19. SDA / double-count relation

Event schedule/disclosure information can be a distinct information source from PRICE_OHLC.

However:
- event-driven price gap / volume / volatility responses are price-derived;
- Pattern plus event-price reaction cannot automatically become two independent confirmations.

Any independent incremental use requires D16 residual validation and lineage accounting.

No new vote is authorized here.

## 20. Required manifest fields

Per experiment:
- experimentId;
- eventPolicyId;
- eventFamilyPolicyId;
- eventClusterPolicyId;
- calendarVintagePolicyId;
- nonEventDefinitionPolicyId;
- marketControlPolicyId;
- outcomeJoinState;
- manifestVersion/hash.

Per parent/opportunity:
- parentDecisionId;
- predictorFreezeAt;
- marketDate;
- symbol;
- structuralRootId;
- eventState;
- eventFamilyId;
- eventInstanceId;
- commonEventClusterId;
- scheduledAt;
- firstKnownScheduledAt;
- scheduleVintageId;
- scheduleRevisionState;
- releasedAt;
- releaseFirstObservedAt;
- consensusKnownAt;
- surpriseEligibleAt;
- decisionWindowState;
- eventSource/provenance;
- DL-041 market/beta receipt;
- DL-040 sector receipt;
- DL-039 cross-sectional receipt.

No future return / response belongs in D01.

## 21. Current decision

MANY_STOCKS_ONE_EVENT_EQUALS_MANY_EVENT_REPLICATIONS =
FALSE.

MANY_MARKET_DATES_ONE_EVENT_EQUALS_MANY_EVENT_REPLICATIONS =
FALSE.

EVENT_FAMILY_EQUALS_EVENT_INSTANCE =
FALSE.

SCHEDULED_EVENT_PRESENCE_EQUALS_DIRECTION =
FALSE.

CURRENT_CALENDAR_CAN_BACKFILL_HISTORICAL_SCHEDULE =
FALSE.

POST_RELEASE_SURPRISE_CAN_ENTER_PRE_RELEASE_PREDICTOR =
FALSE.

EARNINGS_SEASON_ARBITRARY_CLUSTERING =
PROHIBITED.

OUTCOME_SELECTED_EVENT_EXCLUSION =
PROHIBITED.

ECONOMIC_VALIDATION_OWNER =
D16.

OUTCOME_JOIN =
CLOSED.

FORMAL_OPTIMIZATION_CANDIDATE =
NONE.

Formal Core remains LOCKED.

## 22. Exact next continuation

1. Build deterministic event-state / event-instance / event-family / common-cluster helpers and adversarial tests.
2. Preserve schedule, release, surprise and market-reaction clocks separately.
3. Consume D08/D13/D17 owner receipts without reconstructing event calendars in D01.
4. Hand A0-A6 / C0-C7 event-cluster dependence inference to D16.
5. Preserve event and non-event denominators, unknown event context and leave-one-event-cluster-out semantics.
6. Next D01 science: separate calendar/event clustering from overnight-gap/opening-auction mechanics so a Pattern result driven only by gap-to-open behavior is not mislabeled as continuous-session structure.
7. No outcome join / no runtime wiring / no Formal change.
