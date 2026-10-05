# Room11｜System1 V8.19 C1 Scan-Origin / Generation Inventory research validation

更新：2026-10-06 Asia/Taipei  
対象：PR #644, exact head `e925a04bc630816a1dd174f4e6675798ebe1937b`  
狀態：RESEARCH_OWNER_PARTIAL_PASS / PR_OPEN_DRAFT / NOT_MERGED / NOT_DEPLOYED  
Formal Core：LOCKED

## Readback

PR title:
`feat: V8.19.0 C1 scan-origin and generation inventory`.

PR explicitly remains:
- mergeAuthorized=false；
- productionDeployAuthorized=false；
- no auto-merge；
- first genuine V8.19 readback pending deployment + genuine session。

Exact-head CI:
- V8 Regression Tests `37377008932`: PASS；
- System1 C1 C2 isolated offline repair review `37377009056`: PASS；
- V8 Repair CI `37377008883`: PASS。

Dedicated V8.19 test contract contains 12 cases and reports `SUMMARY 12/12 PASS`.

## Accepted research deltas

1. V8.19+ generation gets explicit immutable `scanOrigin` before persistence.
2. Same generation cannot be relabeled to another origin.
3. normal after-market path does not invent Cron/manual transport when not observed.
4. stage-selection path is explicitly distinguishable.
5. direct-safe caller remains explicit.
6. pre-V8.19 history is not backfilled.
7. modern missing/mismatched origin fails closed.
8. generation inventory uses existing canonical C1 table rather than a duplicate truth source.
9. total generation count is separate from returned-row limit/truncation.
10. corrupt modern rows remain visible as blocked.
11. inventory explicitly says it is mutable until session completion.
12. Formal score/gate/rank functions remain protected; provider-call delta remains zero.

## Existing collector interaction

Current `collectVerifiedC1C2` already:
- pins one generation once first page is read；
- rejects page-to-page generation drift；
- requires current Formal pipeline complete/config verified；
- requires `scan.researchC1Population.generationId` == read generation；
- requires save/readback/count/digest consistency；
- otherwise returns `FORMAL_C1_GENERATION_UNLINKED`.

This is a meaningful existing PASS and should remain.

## Residual D16 / SDA-016 gap

PR #644 improves observability but does not create a durable historical authoritative Formal-decision↔C1-generation ledger.

Current scan-status proof is carried by latest scan state. It is useful current-session evidence but is not sufficient by itself for long-horizon OOS governance when:
- same date has multiple immutable generations；
- latest pointer may later update or expire；
- inventory order can differ from authoritative Formal parent；
- multiple same-origin generations can exist；
- research must recover parent identity months later.

Therefore Room11 disposition:

`PROVENANCE_INFRASTRUCTURE_ACCEPT / AUTHORITATIVE_PARENT_BINDING_PENDING / NO_SDA016_CLOSURE`.

No maturity change.
No merge/deploy request.
