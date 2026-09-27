# TPEx Institutional Source Schema Witness / Semantic Fingerprint

Updated: 2026-09-28 Asia/Taipei  
Status: CLASS-A SOURCE-CONTRACT FALSIFICATION  
Formal Core: LOCKED

## Finding 1 — current official JSON is healthy on the witness

A live official TPEx dailyTrade JSON payload for 2026-09-24 was captured and hashed.

- table rows: 896;
- fields: 24;
- all seven buy/sell/net triplets satisfy net = buy - sell;
- foreign aggregate equals foreign-main + foreign-dealer;
- dealer aggregate equals proprietary + hedge;
- official total relation passes;
- no current misparse is demonstrated.

## Finding 2 — exact 24-field strings are not enough

The JSON fields array is:

- code;
- name;
- seven repetitions of buy / sell / net;
- total.

The group headers visible in the official HTML table are not encoded in the fields vector.

Therefore a whole triplet can move while the exact fields string array remains unchanged.

The old v0.1 proposal's idea that exact 24 field strings alone can certify semantic order is falsified.

## Finding 3 — arithmetic is the stronger schema fingerprint

Research-only semantic validation uses:
- every triplet's net identity;
- foreign aggregate = foreign-main + foreign-dealer;
- dealer aggregate = proprietary + hedge;
- official total = foreign-main + trust + dealer aggregate;
- plus source/date/status/shape and exact generic field-vector checks.

Synthetic triplet swaps that preserve all field strings are detected by these cross-column relations.

## Finding 4 — current parser has a dormant foreign-dealer compatibility boundary

Current TPEx parser uses row[10] as foreignNet.

The official total relation uses row[4] (foreign main excluding foreign dealer) + row[13] + row[22].

Across 16 comparable official dates from 2018 through 2026, 12,823 rows were sampled and foreign-dealer values were all zero. Therefore row[4] and row[10] coincide in this sample and current validation passes.

This is counterevidence against claiming a current production defect.

A synthetic semantically valid row with nonzero foreign-dealer data shows the current parser's total invariant would fail closed rather than silently accept the row. That is a dormant compatibility risk if TPEx ever emits nonzero foreign-dealer values.

## Governance

The new validator is research-only.

Production parser/validation hardening remains Class B proposal-first because it can fail a Formal scan when upstream schema changes.

No `FORMAL_OPTIMIZATION_CANDIDATE` exists.
