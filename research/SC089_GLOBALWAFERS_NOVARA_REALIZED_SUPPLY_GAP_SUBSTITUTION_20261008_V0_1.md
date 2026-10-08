# SC-089 — GlobalWafers Novara Realized Supply-Gap / Cross-Site Substitution Receipt V0.1

Status: RESEARCH_ONLY / POST_CONTRACT_EVENT_STATE_UPDATE / ISSUER_NATIVE_SUPPLY_GAP_MAPPING / SAME_EVENT_ROOT_NOT_NEW_INDEPENDENT_EVENT / OUTCOMES_CLOSED / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Primary domain: D10-08
Reference-only consumers: D10-01 / D10-04
Date captured: 2026-10-08 Asia/Taipei
Observed main before write: 28f61aaab8630bbd147668e39d56d65fed6cac36

## Purpose

Apply the frozen SC-042 shortage/supply-gap event contract to an issuer-native realized disruption and recovery path.

The underlying Novara fire occurred before SC-042 was frozen, so this receipt MUST NOT be counted as a new independent prospective disruption event.

The 2026-10-07 issuer update is, however, a post-contract source-state update and directly resolves the prior issuer-mapping gap for realized capacity constraint / substitution / qualification behavior.

## Official issuer sources

GlobalWafers 2026-10-07 September revenue report:
https://www.sas-globalwafers.com/en/gwc_news_en_20261007/

GlobalWafers 2026-09-14 Novara partial-resumption update:
https://www.sas-globalwafers.com/gwc_news_20260914/

GlobalWafers 2026Q2 results / original fire response:
https://www.sas-globalwafers.com/en/gwc_news_en_20260804/

## Event lineage

Root event:
- issuer = GlobalWafers / 6488;
- facility = Novara, Italy;
- affected scope = localized section of 8-inch production line;
- root incident date = 2026-07-20 local time;
- event class = FACILITY_FIRE / PARTIAL_PRODUCTION_DISRUPTION.

Recovery milestone:
- partial operations resumed on 2026-09-14;
- EPI process restarted before wafering lines;
- initial shipments resumed;
- some downstream processes remained under reconstruction.

Post-contract state update published 2026-10-07:
- customer-supply impact described as effectively contained;
- near-term revenue and capacity allocation still affected;
- support-site capacity already tight;
- some newly ordered equipment has long lead time;
- equipment still requires installation, validation and customer qualification;
- global capacity-allocation flexibility remains constrained;
- Novara production capacity/revenue contribution expected to recover gradually.

## SC-042 state vector

sourcePublishedAt = 2026-10-07
capturedAt = 2026-10-08 Asia/Taipei
firstEligibleDecision = first decision clock after capture; exact market-open use is not authorized retroactively
observationPeriod = post-fire recovery / 2026-09 to 2026-10 state
revisionVintage = POST_CONTRACT_STATE_UPDATE_20261007

demandState = STRONG_BROADENING_RECOVERY_CONTEXT
explicitShortageOrAllocationEvidence = YES_BOUNDED
capacityConstraintEvidence = YES
supplierDeliveryState = EQUIPMENT_LEAD_TIME_LONG
productionScheduleImpact = PARTIAL_RESUMPTION / GRADUAL_RECOVERY
inputPriceState = UNKNOWN
inventoryState = UNKNOWN
customerInventoryState = UNKNOWN
backlogState = UNKNOWN
passThroughState = UNKNOWN

classification = SUPPLY_GAP_CONFIRMED_SOURCE_STATE_WITH_REALIZED_SUBSTITUTION_CONSTRAINTS

## Realized substitution evidence

GlobalWafers used its global manufacturing network and cross-site support to reduce customer-supply impact.

Products already cross-site qualified could receive support from other sites.
For products not yet qualified, customer validation and capacity transfer had to be accelerated.

The supporting sites were already at tight/high utilization and therefore did not provide unlimited spare capacity.

Permanent rules:
- MULTI_SITE_NETWORK != INSTANT_SUBSTITUTION;
- QUALIFIED_ALTERNATE_PATH != UNLIMITED_ALTERNATE_CAPACITY;
- ALTERNATE_PATH_EXISTS != FULL_RECOVERY;
- EQUIPMENT_ORDERED != CAPACITY_AVAILABLE;
- INSTALLATION_COMPLETE != CUSTOMER_QUALIFICATION_COMPLETE;
- CUSTOMER_SUPPLY_IMPACT_CONTAINED != REVENUE_IMPACT_ZERO.

## Cross-domain de-duplication

Primary evidence root owner = D10-08 shortage/supply-gap event state.

D10-01 may consume this receipt only as a realized substitution/capacity-constraint falsifier.
It is NOT a second topology vote and it is NOT the post-SC062 topology-mutation receipt required for D10-01 L4 debt.

D10-04 may consume the disclosed tight support-site capacity / gradual recovery state only as a capacity-state reference.
It is NOT a second independent utilization measurement.

Permanent rule:
`ONE_DISRUPTION_ROOT / MULTIPLE_CONSUMERS / ONE_INDEPENDENT_EVENT_ROOT`.

## Maturity impact

D10-08 remains L3 / 60%.

Progress achieved:
- issuer-native realized supply-gap mapping now exists;
- explicit capacity constraint exists;
- realized cross-site substitution exists;
- qualification delay exists;
- operational consequence exists;
- negative-control / UNKNOWN discipline remains intact.

Remaining L4 debt:
- independent post-SC042 future disruption/allocation events;
- additional issuer/event roots;
- preregistered D16 event-level common-support / dependence / outcome method;
- no stock/economic inference until outcome access is explicitly authorized.

D10-01 remains L3 / 60%.
D10-04 remains L3 / 60%.

Formal Core unchanged.

## Exact next

SC-090:
freeze a D10-08 prospective event-cohort contract using SC-042 + SC-089 so the next genuinely new shortage/allocation event is admitted without redesign. Independent-unit = disruption-event root; state updates/milestones inherit the root and do not increase event N.
