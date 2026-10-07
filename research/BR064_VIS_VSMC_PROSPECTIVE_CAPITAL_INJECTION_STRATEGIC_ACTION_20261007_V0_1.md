# BR-064 — VIS/VSMC Prospective Capital-Injection Strategic Action V0.1

Status: RESEARCH_ONLY / TRUE_POST_FREEZE_STRATEGIC_ACTION / MOPS_TIMESTAMPED / OUTCOMES_CLOSED / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D09-14
Date: 2026-10-07 Asia/Taipei
Observed main before write: `2b5e412a2854866637cbf9d80e0529fadf9aa4b0`

## Objective

Add one issuer-diverse, genuinely post-freeze strategic action to the D09-14 cohort using an official Taiwan exchange timestamp.

The action must remain distinct from D10 capacity evidence to prevent double-counting.

## Parent strategic program

Vanguard International Semiconductor Corporation (VIS, 5347) and NXP announced VSMC in 2024:
- manufacturing joint venture: VisionPower Semiconductor Manufacturing Company Pte. Ltd.;
- planned 300mm fab in Singapore;
- original disclosed total investment approximately US$7.8 billion;
- initial production targeted for 2027.

Official partner source:
https://investors.nxp.com/news-releases/news-release-details/vis-and-nxp-establish-joint-venture-build-and-operate-300mm-fab/

The JV was formally established in September 2024 after regulatory approvals and capital injection.

Official partner source:
https://www.nxp.com/company/about-nxp/newsroom/NW-VSMC-V2

VSMC officially opened its first 300mm fab on 2026-09-28.

Official partner source:
https://investors.nxp.com/news-releases/news-release-details/vsmc-celebrates-grand-opening-its-first-300mm-fab-singapore

## New post-freeze action

Taiwan MOPS current material-information page shows two same-day VIS/VSMC announcements:

- 2026-10-07 17:18 Asia/Taipei:
  VSMC board resolved to conduct a cash capital increase;
- 2026-10-07 17:19 Asia/Taipei:
  VSMC announced the cash-capital-increase record date.

Official source surface:
https://mops.twse.com.tw/?lang=tw

The disclosed terms are:
- shares issued: 100,000,000;
- par / issue price: US$1 per share;
- total amount: US$100,000,000;
- all shares subscribed by existing shareholders;
- stated use of proceeds: company operating needs;
- capital-increase record date: 2026-10-07.

The current disclosure does not allocate the US$100 million by shareholder in the observed MOPS text.

Therefore:
`VIS_SPECIFIC_SUBSCRIPTION_AMOUNT = UNKNOWN`
unless a shareholder-level subscription disclosure is separately observed.

## Frozen action receipt

```json
{
  "cohortId": "BR064-VIS-VSMC-CAPITAL-INJECTION-20261007",
  "issuer": "Vanguard International Semiconductor Corporation",
  "symbol": "5347",
  "strategicVehicle": "VisionPower Semiconductor Manufacturing Company Pte. Ltd.",
  "actionType": "JOINT_VENTURE_CAPITAL_INJECTION",
  "decisionKnownAt": "2026-10-07T17:18:00+08:00",
  "recordDateKnownAt": "2026-10-07T17:19:00+08:00",
  "totalCapitalIncreaseUSD": 100000000,
  "subscriberClass": "EXISTING_SHAREHOLDERS",
  "issuerSpecificSubscriptionUSD": "UNKNOWN",
  "statedPurpose": "COMPANY_OPERATING_NEEDS",
  "parentProgram": "VSMC_300MM_SINGAPORE_FAB",
  "parentFabOpenedAt": "2026-09-28",
  "futureOutcomeState": "CLOSED",
  "formalCoreChanged": false
}
```

## Why this qualifies for D09-14

This is not a retrospective narrative.

The action is:
- after the prior BR-060 cohort freeze;
- timestamped on an official Taiwan exchange disclosure surface;
- economically binding as a capital action;
- issuer-diverse relative to the current UMC / Hon Hai / TSMC cohort;
- observable before future operational/financial outcomes from this capital injection are known.

It therefore expands the strategic-action cohort from 4 to 5 frozen actions and from 3 to 4 issuers.

## Critical D09/D10 deduplication

D09-14 may own:
- the decision to inject capital into the strategic JV;
- action timing;
- strategic vehicle;
- commitment amount at the JV level;
- implementation-state transition.

D10 owns:
- physical fab capacity;
- production ramp;
- qualification;
- utilization;
- realized supply availability.

Therefore:

`CAPITAL_INJECTION_ACTION != PHYSICAL_CAPACITY_VOTE`.

The US$100 million action must not be counted once as a D09 strategy vote and again as an independent D10 capacity vote.

A later physical milestone may be consumed by D09 only as implementation follow-up, with the same lineage preserved.

## Interpretation firewall

Do not infer:
- US$100 million creates a specific number of wafers/month;
- capital injection guarantees 2027 production;
- capital injection proves positive return on investment;
- parent shareholders subscribed in the historical 60/40 ownership ratio without a direct current subscription disclosure;
- fab opening equals high-volume production.

Permanent rules:
- `CAPITAL_INJECTION != CAPACITY_CREATED`;
- `FAB_OPENING != HVM`;
- `JV_TOTAL_CAPITAL != ISSUER_SPECIFIC_CAPITAL` without shareholder allocation evidence.

## D09-14 maturity

D09-14 remains L3 / 60%.

Reason:
the prospective action cohort becomes broader and cleaner, but L4 still requires preregistered common-support prospective/OOS economic evidence.

No stock outcome.
No Formal optimization candidate.
Formal Core unchanged.

## Exact next

BR-065:
continue milestone surveillance across all five frozen strategic actions.

For BR064 specifically, future admissible milestones include:
- shareholder-level subscription amount if officially disclosed;
- capital actually paid in;
- equipment/tool installation tied to the program;
- qualification;
- first production;
- customer qualification;
- HVM start.

Physical-capacity facts remain D10-owned and must preserve shared lineage.
