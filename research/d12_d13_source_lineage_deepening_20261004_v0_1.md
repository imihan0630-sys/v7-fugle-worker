# D12 + D13 source-lineage deepening — 2026-10-04

Status: RESEARCH_ONLY / LATER_OBSERVED_OFFICIAL_SOURCE_QA / OUTCOMES_CLOSED / FORMAL_CORE_LOCKED
Room: 09｜衍生品與國際總經研究室
Continuation: after MC-142..148; do not reinterpret this file as release-time capture.

## MC-149 — D12 TAIFEX Delta effective-date firewall
Official TAIFEX Daily Delta page states three daily updates around 06:45, 14:30 and 16:30. The 06:45 version covers the current business day's tradable series; 14:30/16:30 disclose next-business-day Delta and exclude next-day newly listed series. The page currently reports 2026-10-02 file generation at 14:22:49, before the room's 18:10 selector.
Inference: pre-18:10 visibility does not make the afternoon Delta a current-session market-state measurement. publication timestamp, publication version and effective trading date remain separate identities. Historical observation on 2026-10-04 is not source-attested proof of what was captured at 2026-10-02 18:10.

## MC-150 — D12 dealer-Gamma identifiability remains blocked
TAIFEX 2026-10-02 participant option tables expose Call/Put and participant-class buy/sell/open-interest aggregates. They do not cross-tab dealer inventory by strike, expiry and position side. Daily Delta is series-specific but participant OI is aggregate.
Therefore exact signed dealer GEX remains NOT_IDENTIFIED. Joining aggregate dealer Call/Put OI to strike-level Delta/Gamma would allocate inventory without evidence. Allowed objects remain unsigned strike/expiry concentration and previously frozen partial-identification bounds. No "gamma wall", "zero gamma" or dealer-hedging direction label is promoted.

## MC-151 — D12 historical chain source is replay QA, not first-known evidence
TAIFEX official option daily download supports bounded daily downloads and annual ZIP history. The official note preserves after-hours following-session attribution and, from 2025-12-08, includes scheduled contract expiry date.
This materially strengthens parser/contract/roll/session replay feasibility. It does not prove historical first-known 18:10 availability. Historical files remain replay-QA parents unless a raw authorized response was actually archived at the decision time.

## MC-152 — D13 CBC BOP frequency/clock separation
CBC Q2 2026 BOP was released 2026-08-20. It reports current-account surplus USD58.49bn, financial-account net asset increase USD53.79bn and reserve-asset increase USD0.79bn. The release explicitly schedules the next BOP release for 2026-11-20 16:20 Taipei.
BOP is therefore a quarterly structural-flow object. It must not be mechanically joined to daily TWSE foreign net buy/sell as if they were the same flow population or clock. Daily foreign trading, BOP portfolio flows, direct investment, other investment and reserve assets remain distinct.

## MC-153 — D13 CBC policy decision vs effective-date lineage
CBC Q3 policy release date is 2026-09-17. Policy rates were held unchanged. The same release adjusted selective mortgage credit controls, effective 2026-09-18.
Required event lineage: announcement/release timestamp; decision object; legal/regulatory change; effective date; affected channel. A single "CBC event date" is insufficient. Rate-hold and credit-control easing are different mechanisms and may have offsetting market implications.

## MC-154 — D13 H.4.1 stock/average/decomposition firewall strengthened
Fed H.4.1 release dated 2026-10-01 reports both week-average and Wednesday-level objects. Week-average reverse repos rose USD13.117bn versus prior week while deposits other than reserve balances fell USD42.806bn; the table separately reports balance-sheet stocks and Wednesday levels. Reserve balances cannot be inferred from asset size alone.
DDP provides explicit series identities for Wednesday level, week average and changes. Future receipts must preserve series ID + frequency/statistic + reference date + release date. Mixing week average with Wednesday stock is prohibited.

## MC-155 — D13 CBO projection-vintage identity
CBO's 2026-02-11 baseline reflects trade policy as of 2025-11-20, economic developments/laws as of 2025-12-03, and budget-law cutoffs through 2026-01-14. It projects real potential GDP growth averaging 2.1% in 2026-2030 and 1.8% in 2031-2036.
CBO attributes long-run potential growth to labor-force and productivity/capital forces; it also embeds policy assumptions including tariffs, immigration and AI diffusion. Therefore CBO potential growth is a dated assumption-dependent structural projection, not market consensus and not a next-session signal. Cross-vintage changes require cutoff/assumption lineage before interpretation.

## MC-156 — D13 TWSE foreign-flow semantic boundary
TWSE official 2026-10-02 institutional table reports foreign and mainland investors excluding foreign dealers net bought NT$2.622bn. The page states statistics include regular, odd-lot, after-hours fixed-price and block trades; exclude auction/tender; use original trades rather than later broker error/account corrections; foreign-currency value uses the exchange's 15:30 announced FX rate.
Therefore the daily foreign-flow object has a precise venue/accounting definition and is not equivalent to BOP portfolio flows or intraday foreign pressure. Later observation confirms source semantics/date availability but is not a strict 18:10 archived first-known receipt.

## Cross-family falsification and validation design
1. Never combine quarterly BOP, daily TWSE foreign flow, derivative participant positions and policy events into one scalar macro score.
2. Preserve source clock, reference/effective date, publication time, revision lineage and population identity.
3. D12 dealer Gamma must remain UNKNOWN when strike-expiry-position-side inventory is not identified.
4. D13 liquidity tests must compare component vectors against simpler UST/USD/volatility baselines; no net-liquidity heuristic.
5. CBO/SEP long-horizon projections are slow regime context. Any next-session use needs matched-horizon transmission evidence.
6. Policy studies separate announcement, decision and effective clocks and control simultaneous rate/credit/FX channels.
7. OOS/walk-forward/prospective Shadow remains closed until independent PIT-clean dates exist. Missing evidence stays UNKNOWN.
8. No Taiwan return, hit-rate, MAE/MFE or selection outcome was inspected in this research block.

## Maturity
No promotion. D12 remains 40.0%; D13 remains 41.1%. New evidence improves source semantics and replay design but does not satisfy L3 independent Taiwan PIT/source-attested evidence requirements.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core LOCKED.

## Exact next continuation
- D12: acquire permitted raw TAIFEX option-chain file and freeze header/schema parser receipt; keep historical replay separate from live first-known; pursue true source-attested 18:10 parent only through authorized path.
- D13: preserve CBC 2026-11-20 16:20 BOP prospectively if available; build append-only CBC policy announcement/effective lineage; archive future H.4.1 series-specific vintages; capture TWSE foreign-flow source response before/at the 18:10 research decision on an eligible future date.
- Accumulate independent clean dates before any L3/OOS/optimization claim.
