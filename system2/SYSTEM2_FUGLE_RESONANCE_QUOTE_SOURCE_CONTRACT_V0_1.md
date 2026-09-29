# System 2 Fugle Resonance Quote Source Contract V0.1

Updated: 2026-09-29 Asia/Taipei  
Status: IMPLEMENTATION / RESEARCH-SHADOW ONLY / NOT ARMED  
Governance: Class A isolated source normalization  
System 1 / V8 Formal Core impact: NONE

## Purpose

Freeze the first source-specific input contract for the bounded System 2 daily resonance monitor.

This contract converts an already-fetched Fugle MarketData v1 regular-stock Intraday Quote + Intraday Ticker payload into the provider-neutral normalized quote consumed by:

`system2/runtime/daily_resonance_live_adapter_v0_1.mjs`

The normalizer performs no HTTP call and contains no API key.

## Official Fugle contract used

Official documentation:
- Intraday Quote: https://developer.fugle.tw/docs/data/http-api/intraday/quote/
- Intraday Ticker: https://developer.fugle.tw/docs/data/http-api/intraday/ticker/
- Intraday Candles: https://developer.fugle.tw/docs/data/http-api/intraday/candles/
- Intraday Trades: https://developer.fugle.tw/docs/data/http-api/intraday/trades/

The Quote documentation explicitly defines:
- `openPrice`, `highPrice`, `lowPrice`;
- `closePrice` as the closing/latest actual trade price;
- `lastPrice` as the last price including trial matching;
- cumulative `total.tradeValue`, `total.tradeVolume`, `total.transaction`;
- `lastTrade.price/time`;
- `isTrial`, `isDelayedOpen`, `isDelayedClose`, `isClose`;
- `tradingHalt.isHalted`;
- price-limit / temporary matching-halt flags;
- `lastUpdated`.

The Ticker documentation supplies the security identity gate:
- `type=EQUITY`;
- `securityType=01` for ordinary stock;
- `securityStatus=NORMAL/SUSPENDED/TERMINATED`;
- `boardLot`;
- `tradingCurrency`.

V0.1 accepts only regular ordinary-stock requests. Odd-lot input is not silently mixed into this contract.

## Timestamp semantics

Fugle examples use Unix-microsecond numeric timestamps.

V0.1:
- accepts only integer-like values in a microsecond-scale range;
- converts by microseconds -> milliseconds -> ISO UTC;
- checks that provider timestamps map back to the requested market date in Asia/Taipei;
- keeps local fetch time (`fetchedAt`) separate from provider `lastUpdated` and actual `lastTrade.time`;
- blocks provider timestamps that occur after the local capture.

Provider timestamp is not relabeled as local first-known time.

## OHLC rule

The daily partial/final OHLC is built from:
- open = `openPrice`;
- high = `highPrice`;
- low = `lowPrice`;
- close = `closePrice`.

`lastPrice` is deliberately not used as the OHLC close because the official Quote contract says it may include trial matching.

If both `closePrice` and `lastTrade.price` exist and disagree, source semantics fail closed.

## Volume-unit firewall

The Quote page names `total.tradeVolume` as cumulative volume but does not independently spell out a share/lot unit in the field table.

Therefore V0.1 does not blindly multiply it.

For a regular ordinary equity:
1. read the official Ticker `boardLot`;
2. candidate shares = `total.tradeVolume * boardLot`;
3. implied average price = `total.tradeValue / candidate shares`;
4. compare with provider `avgPrice`;
5. only when the values are consistent within the frozen QA tolerance is cumulative volume promoted to `cumulativeVolumeShares`.

The official 2330 documentation example is a positive witness:
- tradeValue = 31,019,803,000;
- tradeVolume = 54,538;
- boardLot = 1,000;
- the implied price is approximately the documented avgPrice 568.77.

If the cross-check fails or required fields are absent after trading begins:
- volume unit state is not verified;
- normalized cumulative shares remain NULL;
- the full normalized semantic contract is not certified.

This is a source-integrity gate, not an alpha rule.

## Session/finality rules

The source normalizer maps:
- `isClose=true` and no delayed-close flag -> source finality candidate `FINAL`;
- otherwise -> `LIVE`.

That source flag alone does NOT confirm the System 2 daily bar.

The downstream live adapter still requires:
- independent `officialSessionCloseConfirmed=true`;
- observation at/after 13:30 Asia/Taipei;
- no source/continuity/session blockers.

Delayed close is blocked from ordinary 13:30 finalization.

Temporary price-limit matching interruption is preserved separately and blocked from an actionable monitor state.

## Fail-closed identity gates

The contract is not certified when any of the following applies:
- Quote/Ticker symbol or date mismatch;
- non-EQUITY type;
- non-ordinary `securityType`;
- security status not NORMAL;
- missing board lot / non-TWD currency;
- Quote/Ticker exchange or market mismatch;
- odd-lot/non-regular request;
- incomplete or inconsistent OHLC after trading begins;
- closePrice vs actual lastTrade mismatch;
- volume-unit cross-check failure;
- provider timestamp after local capture.

The raw reason list is preserved in `semanticBlockers[]`.

## Output boundary

File:
- `system2/runtime/fugle_resonance_quote_normalizer_v0_1.mjs`

Output contains:
- source tuple and identity metadata;
- source timestamps;
- volume-unit verification receipt;
- normalized provider-neutral quote;
- exact semantic certification state;
- session flags.

Safety flags remain:
- `decisionImpact=false`;
- `notificationImpact=false`;
- `orderImpact=false`;
- `fullMarketScan=false`.

## Not authorized by this contract

This implementation does not authorize:
- a live Fugle fetch loop;
- storing any API key;
- Worker Cron;
- push notifications;
- orders;
- full-market intraday scanning;
- System 1/V8 Formal changes.

The next step after CI validation is isolated research-only persistence/read API plumbing, followed by prospective bounded Shadow evidence.
