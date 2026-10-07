# SC-075 — D10-13 First Post-SC047 Policy Null Observation V0.1

Status: RESEARCH_ONLY / PROSPECTIVE_POLICY_NULL_DENOMINATOR / NO_NEW_POST_FREEZE_BIS_VINTAGE / OUTCOMES_CLOSED / FORMAL_CORE_UNCHANGED
Owner: 07｜產業與供應鏈研究室
Domain: D10-13
Date: 2026-10-07 Asia/Taipei
CapturedAt: 2026-10-07T22:12:00+08:00
Parent:
- research/sc047_bis_policy_vintage_append_20261004_v0_1.json
Observed main before write: `a0cd579dc43d36006a4619cc4528a150d3e245e6`

## Purpose

Preserve the first explicit prospective denominator after SC-047.

SC-047 was captured on 2026-10-04 and explicitly required the next BIS rule/list/license vintage to be collected prospectively.

A research process that stores only dates with new rules can create event-selection bias. Therefore the absence of a new qualifying BIS vintage through the current capture must also be preserved.

## Current official policy frontier

The current BIS Federal Register notices page observed at this capture shows the latest listed BIS notice before the SC-047 capture boundary as:

- publication date: 2026-09-24;
- rule: Measures To Restrict Stockpiling of Polysilicon and Polysilicon Derivatives Under Proclamation 11052.

Official source:
https://www.bis.gov/regulations/federal-register-notices

SC-047 was captured on:
`2026-10-04T09:54:00+08:00`.

Therefore the 2026-09-24 rule predates the prospective freeze and cannot qualify as the next prospective policy vintage.

## Frozen null receipt

```json
{
  "receiptId": "SC075_D10_13_POLICY_NULL_20261007_V0_1",
  "parentFreezeAt": "2026-10-04T09:54:00+08:00",
  "capturedAt": "2026-10-07T22:12:00+08:00",
  "latestVisibleBisNoticeDate": "2026-09-24",
  "qualifyingPostFreezeRuleObserved": false,
  "state": "NO_NEW_POST_SC047_BIS_RULE_LIST_LICENSE_VINTAGE_OBSERVED",
  "historicalLatestNoticeCanQualifyProspectively": false,
  "issuerExposureJoinOpened": false,
  "stockOutcomesOpened": false,
  "formalCoreChanged": false
}
```

## Permanent timing firewall

`NEW_TO_RESEARCH != NEW_AFTER_FREEZE`.

A rule can be newly discovered today and still be historically ineligible as a prospective receipt.

Also:

`NO_NEW_POLICY_VINTAGE_DATE_IS_DATA`.

But:

`BOUNDED_NO_NEW_VINTAGE_OBSERVATION != PROOF_NO_POLICY_CHANGE_EXISTED_IN_ALL_AUTHORITIES`.

This receipt covers the bounded BIS Federal Register lane only.

## Issuer mapping

No issuer-native customer/destination denominator is opened from this null receipt.

No Taiwan issuer exposure is inferred from the 2026-09-24 polysilicon rule merely because the material may be economically relevant to semiconductor or solar supply chains.

Policy relevance and issuer exposure remain distinct.

## D10-13 maturity

D10-13 remains L3 / 60%.

The prospective denominator is now cleaner, but no new policy vintage or prospective issuer outcome exists.

No Formal optimization candidate.
Formal Core unchanged.

## Exact next

SC-076:
capture the first BIS rule/list/license vintage whose official publication/effective clock is strictly after the SC-047 freeze.

On that future event:
1. preserve publication/effective/expiry clocks;
2. classify tightening/easing/clarification/authorization separately;
3. do not infer issuer exposure without compatible issuer-native customer/destination/product evidence;
4. keep stock/revenue/margin outcomes closed until preregistered.
