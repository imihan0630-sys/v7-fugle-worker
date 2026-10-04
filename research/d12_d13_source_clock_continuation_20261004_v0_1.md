# Room 09 D12/D13 source-clock continuation — 2026-10-04

Status: RESEARCH_ONLY / SOURCE_QA / OUTCOMES_CLOSED / NO_PROMOTION
Observed main before durable write: bc06f4ea7e1cf1eecf8b816d3695e4b581c24832
Room: 09｜衍生品與國際總經研究室
Domains: D12, D13

## Purpose

Continue from DR-069 and MC-172 without repeating completed work. This note records only new source/schema/clock evidence and explicit unresolved gates. It does not change Formal Core, runtime, ranking, signals, capital, holdings, monitoring, or push behavior.

## D12 — TAIFEX option-chain historical source/schema audit

### DR-070 — official daily option table schema is materially sufficient for replay QA

TAIFEX official option daily market data exposes series-level fields including:
- contract;
- expiry month/week;
- contract expiration date for the post-2025-12-08 schema;
- strike;
- Call/Put;
- open/high/low/last;
- settlement;
- after-hours, regular-session and total volume;
- open interest;
- last best bid / last best ask;
- historical high / historical low.

This is enough to freeze a parser and perform outcome-blind same-parent surface/parity/data-quality replay QA.

Official source:
- https://www.taifex.com.tw/cht/3/optDailyMarketReport
- https://www.taifex.com.tw/cht/3/dlOptDataDown

### DR-071 — history and schema clocks require versioned parsing

TAIFEX states that:
- historical daily data can be downloaded in bounded ranges and annual ZIP archives are available;
- historical coverage extends back to product launch;
- after-hours trades are attributed to the following regular-session trading date;
- price-change fields were added historically on 2022-03-04;
- contract-expiration-date was added for regular-session data from 2025-12-08.

Therefore a valid historical parser must be schema-versioned by date. Absence of a post-2025 field in older rows is not a bad record and must remain structurally expected/UNKNOWN as applicable.

### DR-072 — historical daily rows cannot reconstruct an 18:10 first-known option state

The official daily fields are post-session historical observations. “Last best bid/ask” are end-state quote fields, not an intraday quote path or depth book. Settlement is also not an 18:10 contemporaneous market-state value. Historical downloadable rows therefore support parser/schema/roll/session replay QA but cannot be backdated into a historical 18:10 first-known receipt.

This preserves the PIT firewall for D12-05/06/07/11/13/14/15/16/17. Intraday surface, quote-depth microstructure, and exact 18:10 state remain UNKNOWN without contemporaneous authorized raw receipts.

### DR-073 — same-parent identity rule

Simple skew/term structure, Surface Method V0.1, parity diagnostics, and own-computed Greeks must consume the identical parent rows/session/date/version when compared outcome-blind. Official TAIFEX Delta remains a separate publication/effective-date object and must not be merged silently into current-session market state.

Maturity impact: none. D12 remains L2 aggregate / 40.0%. No L3 promotion. Outcomes remain CLOSED.

## D13 — BIS legal-state clock and CBC revision-lineage audit

### MC-173 — current BIS codified pages preserve the one-year stay

Current BIS EAR pages retain explicit Effective Date Notes stating that the November 2025 action stayed the relevant Affiliates Rule changes through 2026-11-09. The underlying rule text may still appear on the codified page while its application is stayed. Text presence is therefore not equivalent to current legal effect.

Official sources:
- https://www.bis.gov/regulations/ear/744
- https://www.bis.gov/regulations/ear/748
- https://www.govinfo.gov/content/pkg/FR-2025-11-12/pdf/2025-19846.pdf

Current-state interpretation as observed 2026-10-04:
- stay: active through 2026-11-09 under the current codified note;
- reimposition: scheduled for 2026-11-10 absent further agency action;
- future scheduled phase: not a realized state and remains subject to extension/amendment.

A targeted official-source search found no later superseding action, but search absence is not exhaustive legal proof. The current codified BIS note is the stronger current-state witness.

### MC-174 — Federal Register public-inspection filing clock timezone is Eastern Time

The National Archives Federal Register Public Inspection documentation states that regular-filing documents are placed on public inspection at 8:45 a.m. Eastern Time. This resolves the timezone ambiguity in the 2025-19846 footer “Filed 11/10/2025 at 8:45 am” for the regular-filing lane.

Preserve distinct clocks:
- agency announcement time, if independently evidenced;
- public-inspection availability;
- Federal Register publication date;
- legal effective date;
- transition/stay expiry;
- local research observedAt.

Do not substitute one clock for another.

Official source:
- https://www.federalregister.gov/public-inspection
- https://www.govinfo.gov/content/pkg/FR-2025-11-12/pdf/2025-19846.pdf

### MC-175 — scheduled 2026-11-10 phase remains future

The 2025-19846 rule describes a phase in which the stayed changes would be reimposed beginning 2026-11-10 absent further agency action. At the 2026-10-04 research date this is future state, not current state. Any Taiwan event study must label it SCHEDULED_SUBJECT_TO_AMENDMENT and must re-read the authoritative legal state on/after the relevant date.

No company exposure, price direction, or trading signal is inferred from this legal-state evidence.

### MC-176 — CBC 2025Q2 revision first-public date remains unresolved

Known endpoints remain:
- 2025-08-20 original Q2 release/native evidence: current-account surplus approximately 362.29 (headline 362.3) USD100m;
- by the 2026-08-20 later native annex, the same 2025Q2 value is revised to 372.01 USD100m.

The first public revision date is not yet proven. The intermediate official releases that must be inspected natively are:
- 2025-11-20 Q3 release;
- 2026-02-26 Q4 release;
- 2026-05-20 Q1 release.

The 2025-11-20 official page and attachment route were identified, but the native XLSX bytes could not be retrieved in this execution environment. This is ACCESS/TOOLING_UNRESOLVED, not source absence. Do not assign a revision knownAt from quarter-end, a later database value, or the 2026-08-20 endpoint.

Official release page:
- https://www.cbc.gov.tw/tw/cp-302-189034-c02fd-1.html

Maturity impact: none. D13 remains 41.1%; D13-17 stays L2. Strict clean prospective dates added: 0. Outcomes remain CLOSED.

## Falsification / redundancy / quality

- D12: daily historical quote endpoints are a replay-quality source, not proof of intraday first-known availability. Any result relying on reconstructed 18:10 state from end-of-session values is LOOK_AHEAD / INVALID.
- D13 BIS: legal-rule text presence and legal effectiveness are distinct. A rule can remain textually present while stayed.
- D13 CBC: revision composition may matter, but revised history must never be backfilled into a historical decision date before its actual publication.
- No realized return/outcome data were inspected.
- No alpha, OOS, Shadow performance, stock eligibility, trading recommendation, or optimization claim is made.
- Missing/blocked evidence remains UNKNOWN.
- FORMAL_OPTIMIZATION_CANDIDATE = NONE.
- Formal Core remains LOCKED.

## Exact next continuation

1. D12: acquire one permitted raw TAIFEX option-chain parent and preserve exact source identity/hash for parser/schema replay QA; parse identical parent rows into skew/term, surface and parity diagnostics. Keep this separate from prospective 18:10 first-known receipts.
2. D12: pursue authorized prospective 18:10 source-attested receipts; no L3 until independent PIT-clean dates and replay verification exist.
3. D13: inspect the native CBC 2025-11-20, 2026-02-26 and 2026-05-20 annexes in chronological order to bound the first-public 2025Q2 revision date. If any file is inaccessible, record ACCESS/TOOLING_UNRESOLVED rather than infer continuity.
4. D13: re-check authoritative BIS/Federal Register state on/after 2026-11-10 before labeling the scheduled phase realized.
5. Continue H.4.1/CBC/TWSE source-attested prospective dates only under the existing PIT/source-clock contract. No outcome join or promotion before applicable gates pass.
