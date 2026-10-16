# BUILD_LANE PIT-A｜2330 真實 61/61 原始 A1 交接，來源驗證與選股資格分離

Date: 2026-10-16 Asia/Taipei
Status: BUILD CLASS-A read-only physical integration target; PIT-A strategy eligibility **NOT CERTIFIED**
Repository: imihan0630-sys/v7-fugle-worker
Upstream: DATA #1068; downstream BUILD #1132/#1234; independent historical PIT audit remains AUDIT_LANE.

## Canonical change and physical original anchor

Source producer first real 2330/TWSE 2026-10-16 native A1 GET was performed by [DATA Run #38908458028](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38908458028), artifact #12049690326, source original receipt hash `074c5e83afde3e4dd7dfb7295eb7483215848a84edb5b78493fd673592d9f18a`. Actual new-day first observation = **2026-10-16T13:31:18.152Z** (21:31:18 Taipei).

[DATA 2330 native 60+1 source readback Run #38909454291](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38909454291) Job #117001305714 SUCCESS, source-only artifact #12049697019. Its actual logged **receiptHash** is `27142487061ed2caad4a533298909daccbbe18d856e2863faa8e82c6a866af52`. Source interval 2026-07-21..2026-10-16, **61/61** original TWSE daily provider body and 2330 row digest matches (60 older originals, one same-day original). Actual verification at **2026-10-16 21:39 Taipei**, before the fixed 2026-10-16 **23:45 Taipei** research cut. This validates **source-original observation/archive clock** only. The individual historical issuer-original publication clocks are NOT independently certified.

Official 2026-10-16 **full-market ordinary-class universe denominator is NOT yet audited**, so it is **null**; 1935 source-security windows belong to the DIFFERENT historical 2026-10-15 source scope and must NOT be copied to the new date.

## BUILD Class A actual-artifact consumption

- `system2/runtime/pit_a_2330_real_a1_source_consumer_v0_1.mjs` requires exact original DATA run, artifact, independent source-audit SHA, current original receipt and immutable 61 original-body lineage with date/time, and exact producer receipt hash.
- `.github/workflows/system2-build-pita-2330-real-source-consumer.yml` downloads **that existing DATA source-only artifact** via GitHub Actions read scope, executes consumer and negative tests against **actual** artifact, and uploads BUILD-only diagnostic receipt for review. It has no official market GET, no Cloudflare or D1/R2 access, and cannot invoke strategy ranking/push/order/Frozen.
- `system2/tests/pit_a_2330_real_a1_source_consumer_v0_1.test.mjs` fails closed on missing or modified signed actual original payload, 61-bar gaps, wrong dates/cutoff, historical issuer-publication false evidence, CFI/CA or selection/Frozen false-positive promotion, and source-alias versus new-market-date denominator substitution.
- Result even when source readback succeeds: `a1OriginalTradingDaysAccepted=61`, `currentSymbolFullPITAcceptedCount=0`, `currentSymbolUnresolvedCount=1`, `fullUniverseOrdinaryShareCount=null`, `stage1ActuallyAssessedCount=null`, `selectedCount=null`, `zeroPickDay=null`, `frozenD1Written=false`, `shadowAuthorized=false`. The separate preceding 2026-10-15 historical source-matrix remains 0/1935 evidence-eligible and 1935 UNKNOWN.

## Unresolved physical acceptance dependencies

**DATA #1068:** 2330 original ordinary-share effective-dated native historical CFI 61-session coverage, full six-family CA corrections/cancellations/suspensions and authoritative bounded NO_EVENT; original firstKnownAt/availableAt. Current native CFI controls positive 2330 and 3287 are SOURCE-only as-of 2026-10-16, not a historical class vintage.

**AUDIT_LANE:** separate full PIT-A issuer class/CA/NO_EVENT original-body and cutoff historical publication validation with independent accepted per-symbol audit pin, not just source-day independent A1 source hash. No complete PIT-A admission permitted until that exists.

**BUILD:** next consume the true DATA+A1+CFI+CA+AUDIT original hash via the existing `pit_first_symbol_microbatch_preflight_v0_1.mjs` and existing Stage1 SHORT_MOMENTUM assessor. PIT-B historical replay and D1/R2 remains independent. A positive one-symbol PIT-A research preflight does not authorize all-market selection, Shadow or a Cloudflare physical Frozen writer.

No changes to System1 V8 Formal Core, strategy weights, Cloudflare Worker/Cron, portfolio, push, trading, secrets, D1/R2 or paid plan. This file documents a real source subgate, not a complete PIT-A success.
