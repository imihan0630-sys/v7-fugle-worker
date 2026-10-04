# D03 TWSE Official Document Machine Contract V0.1

Updated: 2026-10-04 Asia/Taipei
Lane: D03 / shared TECHNICAL_CONTINUITY / exchange-side corporate-action evidence
Status: RESEARCH_ONLY / BOUNDED_MACHINE_CONTRACT_PHYSICAL_PASS
Formal Core: LOCKED

## TI-580 — official list machine endpoint is physically reconstructed

The official TWSE public page:
`https://wwwc.twse.com.tw/zh/announcement/announcement/list.html`

physically exposes:
- form data-api = `/announcement/announcement`;
- fields `startDate`, `endDate`, `keyword`;
- result table `data-paging=15`;
- result table server-side paging flag;
- row detail tokens.

The production front-end configuration resolves:
- rwd API prefix = `/rwd`;
- language = `zh`.

Frozen list endpoint:

`https://wwwc.twse.com.tw/rwd/zh/announcement/announcement`

Query fields physically accepted:
- startDate;
- endDate;
- keyword;
- response=json;
- paging;
- offset.

## TI-581 — positive capital-reduction control PASS

Frozen query:
- interval 2026-07-01 through 2026-08-10;
- keyword = 減資.

Physical result:
- stat = ok;
- total = 3;
- fields = 項次 / 發文日期 / 發文字號 / 主旨 / id.

The result includes:
- 1459 聯發紡織纖維;
- 2026-07-02;
- ref `臺證上一字第1150012789號`;
- cash-capital-reduction exchange / book-closure / old-share suspension / new-share replacement/listing schedule.

Therefore the exchange-side list source is not merely a human-rendered page.

## TI-582 — server-side pagination contract PASS

Frozen interval:
2026-07-01 through 2026-08-10, keyword blank.

Physical result:
- total = 56;
- paging = 15;
- offsets = 0 / 15 / 30 / 45;
- returned rows = 15 + 15 + 15 + 11 = 56;
- unique ids = 56;
- duplicate ids = 0;
- each page has an immutable payload hash receipt.

The same frozen interval without paging also returns:
- total = 56;
- data count = 56;
- unique ids = 56;
- exact keyset equivalence to paged union.

State:
`SERVER_SIDE_PAGINATION_RECONCILIATION = PASS`
`UNPAGED_EQUIVALENCE = PASS`.

## TI-583 — exchange-side reversal chronology PASS

Frozen query:
- 2026-07-01 through 2026-08-10;
- keyword = 川飛能源.

Two independent exchange rows are physically returned:

STOP:
- 2026-07-31;
- `臺證上一字第1151803156號`;
- "申報減少資本銷除普通股案停止申報生效";
- id `0DE33D5F8CB111F19A80005056BE3760`.

RELEASE:
- 2026-08-06;
- `臺證上一字第1151803255號`;
- "申報減少資本銷除普通股案解除停止申報生效";
- id `B5A4A6C3917911F19A80005056BE3760`.

State:
`STOP_THEN_RELEASE_PAIR_OBSERVED`.

This proves that the exchange-side public machine source can preserve state reversal chronology rather than only a final merged state.

## TI-584 — detail API contract PASS

Detail page JavaScript physically maps the URL token into:
`{id: token}`.

Frozen detail endpoint:

`https://wwwc.twse.com.tw/rwd/zh/announcement/announcement_detail`

Correct parameter:
- `id=<token>`;
- `response=json`.

Physical detail fields:
- 發文機關;
- 發文日期;
- 發文字號;
- 主旨;
- 依據;
- 公告事項.

STOP and RELEASE detail controls both return stat=ok and reproduce the exact list reference number / subject.

Negative parameter controls:
- ID;
- uuid;
- keyword

return no data for the same token.

Therefore parameter identity is explicit and falsifiable.

## TI-585 — source-local empty semantics PASS

Frozen impossible keyword:
`D03__NO_SUCH_OFFICIAL_DOCUMENT__7F3A91B2`

on the same bounded interval returns:
- total = 0;
- data count = 0.

State:
`SOURCE_LOCAL_EMPTY_SEMANTICS_OBSERVED`.

This supports source-local empty-list interpretation for this exact machine contract.
It does not prove global archive completeness.

## TI-586 — frozen acceptance run PASS

Frozen executable:
`research/d03_twse_official_document_machine_contract_v0_1.mjs`

Workflow:
`D03 TWSE Official Document Contract Readonly`

Accepted physical run:
`37175322616`

Final state:
`D03_TWSE_OFFICIAL_DOCUMENT_MACHINE_CONTRACT_V0_1`
`BOUNDED_MACHINE_CONTRACT_PHYSICAL_PASS`.

Authority firewall remains:
- globalArchiveCompletenessCertified=false;
- crossExchangeCoverageComplete=false;
- knownAtVersionClockCertified=false;
- revisionCoverageComplete=false;
- technicalContinuityCertified=false;
- historyMutationPerformed=false;
- strategyEvaluationPerformed=false;
- selectionAuthority=false;
- finalSelectionEnabled=false;
- livePushEnabled=false;
- capitalImpact=false;
- orderImpact=false;
- system1RuntimeUsed=false.

## TI-587 — D03 implication

The prior state:
`EXCHANGE_OFFICIAL_DOCUMENT_MACHINE_CONTRACT = PARTIAL_UNKNOWN`

is superseded by:
`TWSE_OFFICIAL_DOCUMENT_MACHINE_CONTRACT = BOUNDED_PHYSICAL_PASS`.

This materially reduces TWSE-side corporate-action continuity uncertainty.

It does **not** certify:
- TPEx equivalent exchange-side coverage;
- all historical action families;
- public-availability latency / promotion-grade firstKnownAt;
- universal archive completeness;
- symbol-window TECHNICAL_CONTINUITY;
- genuine post-deploy immutable parent generation.

Therefore:
- D03-10 Bollinger remains L2/40;
- D03-09 ADX remains L2/40;
- D03 maturity remains 56.7%.

## Exact next continuation

1. Find and physically characterize the TPEx equivalent exchange-side official announcement machine source.
2. Preserve TWSE and TPEx as separate source families; do not infer TPEx coverage from TWSE PASS.
3. Continue prospective firstObservedAt capture for MOPS / exchange versions.
4. On next genuine Taiwan trading session, verify V8.17 immutable parent/cohort generation readback.
5. Only then attempt a symbol-window TECHNICAL_CONTINUITY receipt for Bollinger.
6. ADX follows only after recursive replay certification.

Formal Core remains LOCKED.
