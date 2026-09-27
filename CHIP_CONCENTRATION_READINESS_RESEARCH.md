# CHIP_CONCENTRATION_PRESENT — Readiness / PIT Scarcity Research

Updated: 2026-09-27 Asia/Taipei  
Status: STRUCTURAL_FALSIFICATION / CLASS-A OBSERVER / OUTCOMES CLOSED  
Formal Core: LOCKED

## Why this lane exists

The Formal gate is named here by its semantic role:

`CHIP_CONCENTRATION_PRESENT`.

It does **not** reject a stock because TDCC concentration is low.
It rejects only when `chipConcentration` is missing after earlier Formal admission gates are cleared.

That makes it a data-readiness scarcity gate, not an ownership-quality threshold.

## Current source contract

Worker validation accepts only the official TDCC open-data endpoint:

`https://opendata.tdcc.com.tw/getOD.ashx?id=1-5`.

Current `chipConcentration` is the sum of TDCC holding grades 12–15
(400 lots and above) and is explicitly labeled as ownership concentration,
not institutional identity.

The official TDCC explanation states that current dispersion data are
compiled from account balances after the last business day of each week.

Current Worker accepts one common `asOfDate` if it is:

- not after the Formal scan date;
- not older than 14 calendar days;
- internally consistent across rows;
- globally complete enough to yield at least 1,500 validated symbols.

## Structural scarcity split

There are three materially different cases today:

1. **No TDCC snapshot for marketDate**
   - the entire after-market scan aborts as `DATA_INCOMPLETE`;
   - this is not a stock-level chip-gate rejection.

2. **TDCC snapshot globally valid, but symbol absent/invalid**
   - scan continues;
   - if that symbol reaches the gate, `scoreCandidate` rejects it for missing chip concentration.

3. **Numeric chipConcentration exists**
   - presence gate passes even when value is exactly zero;
   - concentration then separately contributes to institutionalScore.

Global `count>=1500` therefore does not imply complete same-day Formal-symbol coverage.

## PIT availability gap

`chipAsOfDate` is an economic/data date, not a proof of publication time.

Current quality ingestion permits a marketDate within the most recent 14 days
and stores `v7_quality_snapshots` by `dataset_key + market_date` using UPSERT.
The stored JSON does not retain an immutable `firstKnownAt` / collection receipt,
and `readQualitySnapshot` does not return the table's mutable `updated_at`.

Therefore a historical row satisfying `chipAsOfDate <= scanDate` is still not,
by itself, proof that the weekly file was available before the original 18:10
decision cutoff.

This does not prove lookahead occurred in live scans.
It proves historical promotion-grade PIT availability is **UNKNOWN** without
a first-known receipt.

## New Class-A observer

`research/chip_concentration_readiness_observer_v0_1.mjs`

separates:

- dataset missing/invalid;
- 14-day freshness;
- first-known PIT availability;
- global minimum coverage;
- per-symbol COVERED / SYMBOL_ABSENT / VALUE_INVALID;
- pre-chip NOT_REACHED / parent UNKNOWN;
- GENERAL / THOUSAND Formal-reach coverage.

The observer makes no market call, writes no D1 row, uses no outcomes and changes no Formal rule.

## Required prospective evidence

Before testing whether this gate protects returns or merely creates avoidable scarcity:

- immutable parent scan generation;
- exact same-generation market symbol keyset;
- prior-gate reach state;
- TDCC asOfDate;
- firstKnownAt/collectedAt;
- decision cutoff;
- requested/validated global counts;
- per-symbol presence state;
- pool;
- parent hash/fingerprint.

No D1/D3/D5/D10/D20/MFE/MAE join is promotion-grade until those conditions are clean.

## Decision

`CHIP_GATE_IS_DATA_READINESS_GATE / GLOBAL_READY_NE_SYMBOL_COMPLETE / HISTORICAL_PIT_AVAILABILITY_UNKNOWN / PROSPECTIVE_CAPTURE_WARRANTED / FORMAL_UNCHANGED`.

No `FORMAL_OPTIMIZATION_CANDIDATE` exists yet.


## Raw-ingest omission provenance

A second structural gap is now frozen.

The TDCC validator can silently omit a symbol from the validated `stocks`
map when its source group is present but:

- the symbol does not have exactly 17 grades;
- grade 17 total ratio is not 100 within tolerance;
- grade 17 total shares is nonpositive.

Other malformed conditions throw the entire TDCC dataset instead.

After successful validation, only accepted `stocks` are persisted.
Therefore a later `chipConcentration=null` cannot tell whether:

- the symbol had no TDCC rows at all;
- the symbol had an incomplete grade set;
- the symbol had an invalid total row.

`classifyTdccRawSymbolCoverage()` now freezes those states in pure
Class-A research space before persistence loss.

A synthetic falsification also proves the global count guard is not
same-day symbol coverage: a 1,500-symbol validated snapshot can coexist
with an 1,800-symbol market keyset and leave 300 market symbols absent
while the dataset-level minimum still passes.

No claim is made that Production currently misses 300 symbols; this is a
legal structural counterexample showing why global readiness cannot be
used as the per-symbol coverage denominator.

## Engineering boundary

The smallest promotion-grade prospective repair would retain, additively:

- immutable `firstKnownAt` / collected-at evidence;
- TDCC source asOfDate and source identity/hash;
- raw source group count;
- validated stock count;
- dropped-symbol reason counts and symbol lists/hashes;
- same-generation market-keyset reconciliation at scan time;
- immutable parent generation/fingerprint.

Pure classification is Class A.
Shared quality-ingest / D1 persistence is Class B proposal-first.
No runtime wiring is authorized here.
