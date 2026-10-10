# Room09 D12/D13 — H.4.1 scheduled release overlaps Taiwan futures night session (2026-10-11)

Status: RESEARCH_ONLY / OUTCOMES_CLOSED / NO_HISTORICAL_SHADOW / FORMAL_CORE_LOCKED
Owner: 09｜衍生品與國際總經研究室 (D12 + D13)
Observed research clock: 2026-10-11 04:15 Asia/Taipei
Read main before research: 9ecd50f53c1fdab1ca99cf467bd30d09e6644530
Scope: D12-01/09/10/13 and D13-13/16; no Formal/production/score/ranking/capital/notification changes.

## 1. Native institutional source identities (later-observed; not release-time archive)

A. TAIFEX futures regular-session daily table:
https://www.taifex.com.tw/cht/3/futDailyMarketExcel?commodity_id=TX
- Displayed trading date: 2026-10-08; session 08:45–13:45 Asia/Taipei.
- TX 202610 last=49,349; settlement=49,357; OI=107,859.
- This is a **later observed page display**, not immutable 2026-10-08 18:10 capture.

B. TAIFEX futures after-hours table:
https://www.taifex.com.tw/cht/3/futDailyMarketReport
- Displayed attribution date: 2026-10-12; physical session: 2026-10-08 15:00 to 2026-10-09 05:00 Asia/Taipei.
- TX 202610 last=48,705; volume=39,441; settlement and OI shown as '-' (UNKNOWN).
- TX 202611 last=48,945; volume=535; settlement and OI shown as '-' (UNKNOWN).
- Later-observed full-session summary does not expose intraday event timestamps.
- The full-session last/volume/high/low must NOT be used as a 2026-10-08 18:10 feature.

C. TAIFEX option after-hours summary:
https://www.taifex.com.tw/cht/3/optDailyMarketSummary
- Displayed 2026-10-12 volume-attribution date for 2026-10-08 15:00–next-day 05:00 session.
- Weekly TXO 202610F2 expiry 2026-10-12. This page is a *summary of active series*, not a complete chain.

D. TAIFEX official closure announcement:
https://www.taifex.com.tw/cht/11/announcement
- 2026-10-06 announcement: Taiwan futures exchange closed 2026-10-09 for National Day observed holiday.

E. Federal Reserve H.4.1 release:
https://www.federalreserve.gov/releases/h41/20261008/
- Release date displayed 2026-10-08, week reference 2026-10-07.
- Prior immutable *schedule-only* receipt: research/d13_16_h41_schedule_receipt_20261004_2211.json
- Scheduled release: 2026-10-08 16:30 America/New_York = 2026-10-09 04:30 Asia/Taipei.
- **Actual first publication second, source-native raw bytes/hash and independent at-release capture: UNKNOWN.** A later-visible page does not prove availability at scheduled second.

## 2. New cross-domain clock intersection: 30-minute scheduled overlap

Physical TAIFEX night session = [2026-10-08 15:00, 2026-10-09 05:00] Asia/Taipei.
Scheduled H.4.1 release = 2026-10-09 04:30 Asia/Taipei.
Therefore the **scheduled** H.4.1 event falls inside the final 30 minutes of the displayed night-session window.

This is a deterministic calendar intersection, NOT proof that H.4.1 caused a price reaction, nor proof that the page existed precisely at 04:30.

Consequences:
- One daily after-hours OHLC/volume record may straddle a macro release and cannot serve as an unambiguous pre-event quote.
- The exchange attribution date 2026-10-12 is neither the physical execution timestamp nor the macro release date.
- The schedule receipt's `firstEligibleTaiwanDecision=2026-10-09T18:10:00+08:00` is **not an eligible normal cash-session decision** because 2026-10-09 is closed. The next ordinary 18:10 candidate is 2026-10-12, subject to actual runtime/source eligibility.
- Do not rewrite the original immutable 2026-10-04 schedule receipt. Append this correction with source and observedAt.

## 3. Same-source arithmetic QA; different statistic/clock identity

For TX 202610:
- Regular-session settlement 49,357 minus night last 48,705 = 652 points. This agrees with the after-hours page's displayed change of -652 points.
- Regular-session *last* 49,349 minus night last 48,705 = 644 points. These are **different baselines**.
- 202610 night last 48,705 minus 202611 night last 48,945 = -240 points. This is an end-of-session cross-contract *last-trade* comparison, NOT a synchronized executable calendar spread, NOT settlement-to-settlement carry, NOT a rolling-contract return.
- The after-hours OI/settlement '-' means UNKNOWN; never zero.
- These arithmetic identities establish page-level internal QA only, not pre/post H.4.1 market response or predictive alpha.

H.4.1 itself:
- Week-average reverse repos change +266 million USD while Wednesday stock change -28,144 million USD; statisticType and referenceDate must remain distinct.
- The H.4.1 week-average reserve change +81,569 million USD is not an independently identified monetary easing shock.
- H.4.1 balance-sheet components share accounting ancestry; no multiple independent votes.

## 4. Hypotheses and explicit falsifiers

H1: **Scheduled macro-release boundary can contaminate an overnight aggregate.**
- Support: 04:30 schedule intersects 15:00–05:00 session.
- Counterevidence: H.4.1 may be expected, release could be delayed, price may not react, and a source may already store timestamped trades.
- Alternatives: U.S. equities/futures, USD, rates, oil, other news, spread/roll and thin liquidity.
- Failure: no authorized tick/quote source or actual publication timestamp; then event attribution remains UNKNOWN. Do not infer an effect from one full-session bar.

H2: **A post-holiday futures summary can supply next-session risk context.**
- Support: full-session report is later observable before the 2026-10-12 Taiwan opening in this research turn.
- Counterevidence: it is not a 2026-10-08 18:10 feature and may be largely reflected in Taiwan open; 202610F2 expires 2026-10-12.
- Alternatives: overnight U.S. stock/futures, Japan holiday futures, Korea equity, USD/TWD, oil, broader macro/risk factors.
- Failure: after controlling contemporaneous Taiwan opening/sector state, incremental risk prediction is absent; or first-known/entitlement is not proven.

H3: **Apparent cross-expiry price differences imply a directional signal.**
- Counterexample: 48,705 vs 48,945 is not synchronized, and contracts have different DTE, funding/dividend carry and liquidity. Even a true spread is not a guaranteed return.
- Failure: without synchronized executable bid/ask, contract IDs, expiry and costs, only descriptive UNKNOWN executable state is allowed.

## 5. Frozen evidence and anti-self-deception gates

- Data event timestamp, exchange volume-attribution date, contract expiry date, source displayed publication timestamp, actual source availability, capturedAt, decision clock and source endpoint/version are separate fields.
- Strict PIT: an observation can be used no earlier than a verified observedAt, never backdated from a displayed date or scheduled release. Actual 2026-10-09 04:30 release second = UNKNOWN.
- The current 2026-10-11 research observation is not fabricated historical Shadow and cannot prove that any 2026-10-08 18:10 system captured the page.
- No OOS, walk-forward, returns, MAE/MFE, selection outcomes, historical Shadow or trading alpha inspected.
- Future design: preregister timestamped pre-event [04:00,04:30) vs post-event [04:30,05:00] windows **only after verifying actual release and licensed intraday observations**; windows are a design, not executed empirical evidence. Preserve date clusters and embargo overlapping horizons; multiple-test correction and provider choice must be fixed before outcomes.
- Controls: baseline Taiwan price/sector; then futures basis/OI/expiry; then USD, rates, VIX, U.S./Japan/Korea equity and oil, with factor-lineage deduplication. Market holiday/expiry/low-liquidity states separately stratified. Fees, spread, slippage, and availability costs required.
- UNKNOWN != BAD or 0. No causal or market-direction inference.
- D12 L2/40.0%, D13 L2 majority/41.1%, total aggregate from latest tracker 47.9% at observation; **no maturity promotion**.
- FORMAL_OPTIMIZATION_CANDIDATE=NONE. Formal Core permanently LOCKED.

## 6. Exact next continuation

1. Preserve this later-observed clock intersection and prior 2026-10-10 local-only handoff without promoting it to source-native first-known.
2. After 2026-10-12 *actual* morning Delta publication, align 2026-10-08 afternoon next-session Delta and 2026-10-12 morning Delta on the common series universe and effective date, with model-input quote/forward/rate/expiry clocks; never infer missing newly listed series as Delta=0.
3. For the H.4.1 2026-10-08 release, capture authorized source-native version/hash and actual publication/observedAt when possible; keep the schedule receipt immutable; do not infer pre/post market effects from the 14-hour bar.
4. Independently continue CBC FX, U.S./Japan/Korea market calendar, oil settlement-vs-intraday and BOP release-vintage lanes; blocked entitlement remains UNKNOWN, move to the next available module.
5. All research-only; no Formal Core, production, signals, weights, ranking, capital or push changes.
