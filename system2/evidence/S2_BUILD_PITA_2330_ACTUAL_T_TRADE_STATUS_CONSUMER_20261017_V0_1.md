# BUILD PIT-A｜2330 實體 T 日成交原始狀態接入驗證｜2026-10-17

Scope: Class A read-only, **not** a strategy eligibility rule change. Repository main is authority.

## Real physical predecessor

DATA #1068 [PR #1423](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1423) merged original 2330/TWSE 2026-10-16 trading-status source. Real native GitHub [Run #38918007652](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/38918007652), Artifact #12052574204, signed source receipt SHA `a101da6e0fb3f32cff43dc2a52bbf25189d8a0c1b6f9ca66683898a4f3186025`. Original source observed before **2026-10-16 23:45 Asia/Taipei** fixed target cut.

- Exchange native T-day A1 source contained 2330 **43,046,982 shares**, **400,499 transactions**, positive turnover. Exact T native source body SHA `c00391008b8a292dcec991afe102a07ea3e3a49ec42950a90491f3f13fe1a6cf`.
- Positive control TWTAWU 1218 showed a genuine prior suspension/resumption native response. Same-day TWTAWU official query returned zero matching 2330 rows.
- This proves **ACTUALLY_TRADED_DURING_T_SESSION**, NOT that all issuer/market intraday halt notices, suspension classes, retractions or next-session tradeability have been covered. A 0-row query **does not authorize NO_SUSPENSION**.
- This DATA source evidence is **NOT** independent AUDIT_LANE acceptance. The T-day current original observed/captured timestamp is not retroactive proof for 2026-10-15 PIT-B.
- Existing 2330 A1 61/61 original, current CFI positive, six official native CA source bodies + known 2026-09-16 ex-dividend remain separate. The independently attested full-61 price continuity/adjustment, current CFI as-of scope, full T-cut status and actual used factors remain pending.

## New BUILD exact consumer (no fake green)

- `system2/runtime/pita_2330_real_t_status_consumer_v0_1.mjs` pins actual DATA Run/Artifact, real signed receipt and body SHA, recorded 2330 trades and both native status-source digests/clocks. The producer self-signature is not independent status-source completeness.
- `system2/tests/pita_2330_real_t_status_consumer_v0_1.test.mjs` tests real saved artifact and rejects signed producer alterations, target date mismatch, post-cut original capture, fabricated no-suspension, fake PIT and Frozen/zero-pick.
- `.github/workflows/system2-build-pita-2330-real-t-status-intake.yml` fetches exact existing DATA artifact in GitHub Actions and **only reads source receipts**, emits separate BUILD read-only receipt. **No new TWSE GET** or Cloudflare D1/R2/production/Cron activity.
- Success is **2 original status source bodies + 1 positive 1218 control + T-day actually traded**, while `trueAsOfTradingStatusIndependentlyAudited=false`, `noSuspensionOrHaltInferredFromEmptyNativeResponse=false`, `local2330FullPitaEligible=0`, market-wide denominator `null`, Stage1 assessed `null`, `selectedCount=null`, `zeroPickDay=null`, Frozen false.
- Neither 2026-10-15 historic source count 1,935 nor its PIT-B archive coverage can be used for 2026-10-16 complete universe.

## Next actual evidence handoff

**DATA** gathers bounded, cut-safe issuer/exchange status completeness and current class source, relevant known CA amendment/price-space lineage, without replaying full unrelated PIT-B archives. **AUDIT** independently witnesses exact native bytes, source availability clocks, actual used factor source hashes, tradeability and event-sensitive 61-day price transform. **BUILD** existing [#1422 actual seven-factor manifest](https://github.com/imihan0630-sys/v7-fugle-worker/pull/1422) remains research-only: a future revision of legacy CFI/CA Stage1 admission needs **explicit Class B/C owner authorization**. Until then, no Stage1 formal PIT pass, full-market ranking, Shadow or Frozen.

This is a physical source intake engineering result, not a certified PIT-A 0→1 or a financial recommendation.
