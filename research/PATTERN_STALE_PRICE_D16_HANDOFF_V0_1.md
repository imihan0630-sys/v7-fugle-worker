# D01 DL-065 — D16 Stale / Non-Synchronous Price Handoff V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_JOIN_CLOSED

## Purpose

D01 freezes observation identity and structural-interaction eligibility.
D16 owns future residual inference.

The central distinction is between:
- actual contemporaneous trade interaction;
- auction interaction;
- isolated thin trade;
- quote-only contact;
- odd-lot-only contact;
- stale/carry price overlap;
- pseudo-bar overlap;
- unresolved observation identity.

## Timestamp alignment

Target and benchmark prices need explicit timestamps and last-trade age.

A fresh benchmark cannot be compared mechanically with a stale target and called simultaneous confirmation.

D01 defines no arbitrary seconds cutoff; owner/source contracts determine synchronous eligibility.

## Daily-bar limitation

Daily OHLC can support broad geometry when provenance is valid.

It does not prove exact intraday execution path when timestamps/trade identity are unavailable.

## Generic comparator

Compare the same staleness/liquidity state:
- away from a valid zone;
- at a valid zone.

If the residual disappears:
THIN_TRADING_MICROSTRUCTURE_SUFFICIENT.

## Future ladder

S0 raw zone touch;
S1 observation identity;
S2 pseudo/no-trade;
S3 first-trade delay;
S4 spread/depth/tick;
S5 trade-vs-quote;
S6 odd-lot/board-lot;
S7 target-benchmark timestamp alignment;
S8 generic staleness comparator;
S9 executed contemporaneous touch only;
S10 structural residual;
S11 prospective multi-liquidity replication.

## Promotion boundary

No runtime or Formal change is authorized.

Formal Core remains LOCKED.
