# D01 DL-094 — 1101 / 2021-06-15 Witness Source-Availability Audit V0.1

Updated: 2026-10-07 Asia/Taipei
Status: OUTCOME_BLIND / EXACT_WINDOW_SOURCE_DELTA_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Audit which DL-093 R1-R6 receipt families already have enough owner/source infrastructure to support the frozen witness, and which still require a new exact-window physical receipt.

No future return, MFE, MAE, later Pattern success, or strategy outcome is inspected.

## R1 — membership

Year-level owner evidence:
- 2021 TWSE historical universe readiness = PASS_OFFICIAL_CURRENT_NEWLISTING_DELISTING_UNION.
- registryId = S2-DATA-TWSE-2021-OFFICIAL-UNION-V0.1.
- registryHash = 1ab8e6ae8b3d93624e1bb57f83c4acd8ebe931e5815b5db4e3430278168d0dad.
- membershipCount = 1,122.
- unknownStartCount = 0.
- survivorshipCompleteForDataCoverage = true.

Delta:
extract/bind 1101 exact membership boundaries and exact-window membership receipt.

State:
OWNER_INFRA_READY / EXACT_WITNESS_BINDING_PENDING.

## R2 — raw A1

Year-level owner evidence:
- 2021 TWSE dataCoverageState = PASS.
- official sessions = 244.
- raw rows = 232,956.
- source/storage reconciliation accepted.
- current replay debt is not raw-source row loss.

Delta:
extract exact 61-session ordered raw rows plus sourceRowHash/canonicalBarHash/availableAt/revision identity/sourceHistoryHash.

State:
OWNER_INFRA_READY / EXACT_WITNESS_BINDING_PENDING.

## R3 — lifecycle/session

Owner infrastructure now has:
- normalized listing/stop/resume/delisting/share-conversion/migration contract;
- exact expected-vs-observed session reconciliation;
- positive lifecycle interval handling;
- older-row substitution fail-closed;
- exact session hashes.

Current System2 physical evidence also proves a real 1101 TWSE exact-session history witness on current data, but continuity remains unresolved.

Delta for historical 2021 DL-093 witness:
run the same exact-window discipline over the frozen 2021 date set and bind lifecycle source evidence.

State:
MECHANISM_AND_RUNTIME_READY / HISTORICAL_EXACT_WITNESS_RECEIPT_PENDING.

## R4 — corporate-action continuity

Owner infrastructure has narrowed a first TWSE witness to only:
- TWSE ex-right/ex-dividend actual-result historical range;
- TWSE capital-reduction actual-result historical range;
- TWSE par-value-change actual-result historical range;
- TWSE suspension/session lifecycle;
- PIT universe membership.

Archive core can produce evidence-ready states only when:
- universe coverage is complete;
- exact-range source coverage is complete;
- revision coverage is complete;
- event reconciliation is unambiguous;
- required-exchange suspension coverage is complete.

Delta:
materialize this exact range for 1101 and the canonical 61-session window.
Do not infer NO_EVENT from zero rows unless empty-range semantics and source completeness pass.

State:
ARCHIVE_CORE_READY / EXACT_WINDOW_EVENT_COMPLETENESS_PENDING.

## R5 — price-limit/reference state

Strongest new evidence in this tranche.

The pre-existing D01 source contract already listed 2021-06-15 as a historical TWSE TWT84U witness date.

Official public historical retrieval for 1101 on 2021-06-15 observed:
- upper limit 56.50;
- opening-auction reference 51.40;
- lower limit 46.30;
- previous reference 51.50;
- previous close 51.40;
- most recent prior trade date 2021-06-11.

This proves the target date is a real official TWSE reference-price observation and materially de-risks R5 field availability.

However:
- the current research receipt does not carry an immutable raw-payload hash for this exact retrieval;
- firstObservableAt/knownAt is not bound in the exact witness;
- rule-version/exemption receipt is not yet joined.

State:
TARGET_DATE_FACTUAL_FIELDS_OBSERVED / PROVENANCE_AND_CLOCK_BINDING_PENDING.

R5 is therefore not yet PASS.

## R6 — disposition/matching regime

Owner evidence already establishes:
- official TWSE Disposition database provides historical date-range queries from January 2001;
- CSV export is available;
- records provide disposition period and measures;
- disposition can alter matching cadence and participant constraints;
- historical replay must respect after-market publication timing.

A current indexed official example confirms the machine-style range URL form includes startDate, endDate and stockNo, and disposition rows carry effective period/measures/cadence text.

Delta:
- execute/archive the exact 1101 query for the full canonical 61-session window;
- prove query completeness;
- resolve whether any disposition period overlaps any window date;
- separately resolve changed-trading-method state if required for CERTIFIED_NORMAL_MATCHING;
- bind source hash and knownAt.

State:
SOURCE_CONTRACT_READY / EXACT_WINDOW_NORMAL_OR_DISPOSITION_RECEIPT_PENDING.

No-match from an unarchived/unverified query is not credited.

## Combined readiness

R1 = PENDING exact witness binding.
R2 = PENDING exact witness binding.
R3 = PENDING exact historical lifecycle binding.
R4 = PENDING exact event-completeness receipt.
R5 = PARTIAL: target-date factual official fields observed; provenance/clock incomplete.
R6 = PENDING exact range receipt.
R7 = BLOCKED until R1-R6 pass.

No R1-R6 family is upgraded to PASS merely from source feasibility.

## Important research finding

The bottleneck has become narrower.

Before DL-093, D01 knew that price-limit and disposition context were generic source gaps.
After DL-094:
- R5 field availability is physically positive on the exact target date.
- R6 historical official source semantics and range capability are already established.
- R1-R4 all have reusable canonical owner infrastructure.

The remaining work is primarily exact-window materialization, provenance/hash binding, and completeness certification — not invention of new Pattern logic.

This materially increases execution readiness without increasing D01 maturity, because no OOS/prospective outcome evidence has been opened.

## Current decision

SOURCE_FAMILY_FEASIBILITY = STRONG.
EXACT_WINDOW_R1_R6_BUNDLE = NOT_YET_COMPLETE.
R5_TARGET_DATE_FIELD_AVAILABILITY = POSITIVE.
R6_EXACT_WINDOW_STATE = UNKNOWN_PENDING_ARCHIVE.
R7_GENERATION = BLOCKED.
OUTCOME_JOIN = CLOSED.
L4_PROMOTION = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. DL-095: freeze the owner-return acceptance schema for this exact witness, including exact date-set and source-history hashes.
2. Reuse the System2 exact-session and continuity identity fields instead of creating a D01-specific parallel provenance model.
3. Add deterministic acceptance tests for exact source-window, late evidence, zero-row source completeness, and changed-trading-method ambiguity.
4. Hand only the missing physical R1-R6 receipt work to the existing owners.
5. Do not open D1/D5/D20 outcomes.
