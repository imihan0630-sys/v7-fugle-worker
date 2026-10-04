# AOKD-05 Taiwan Corpus Feasibility Contract 2026-10-04 V0.1

Status: OUTCOME_BLIND_SOURCE_GATE
Owner room: 06｜基本面與估值研究室
Candidate: AOKD-05
Formal Core impact: NONE
Curriculum impact: NONE

## Purpose

Determine whether Taiwan listed/OTC issuer disclosure vintages can support a replayable longitudinal filing-delta research dataset **before** any stock-return outcome is opened.

This is a source/corpus gate, not an alpha test and not a Specialist Validation Packet.

## Minimum source receipt

For each sampled issuer-document vintage preserve, where available:

- issuerId / ticker / market;
- asOfEntityId and mapping source;
- documentType;
- fiscalYear / fiscalPeriod;
- sourceUrl or official retrieval key;
- sourceSystem;
- publicKnownAt: exact public timestamp only if independently proven;
- firstObservedAt: observer timestamp and explicit upper-bound semantics;
- captureAt;
- rawByteHash;
- rawByteSize;
- language;
- extractionMethod;
- ocrUsed;
- parser/model version if text extraction is used;
- templateVersion / section-map version where detectable;
- revisionOf / supersedes / correctedAt linkage;
- delistedOrInactiveAtAsOf flag;
- retrievalStatus and missingReason.

UNKNOWN must remain UNKNOWN. Do not coerce missing documents or unproven publication times to zero/none/on-time.

## Required probes

### P1 — historical raw-vintage retrievability
Can original historical annual-report / filing bytes be retrieved rather than only today's latest/corrected copy?

Pass requires at least two distinct historical vintages for the same issuer and document type with immutable hashes.

### P2 — public-clock semantics
Can a genuine public publication/upload timestamp be proven?

States:
- EXACT_PUBLIC_CLOCK;
- FIRST_OBSERVED_UPPER_BOUND;
- CLOCK_UNPROVEN.

A statutory deadline is never a public timestamp.

### P3 — revision-chain observability
Can corrected/replaced filings be linked without rewriting the original vintage?

Pass requires append-only original + revision identity where a real correction example exists. If no correction appears in the sample, report NOT_OBSERVED rather than PASS.

### P4 — cross-period section comparability
Can economically corresponding sections be aligned across years without relying on page number or raw token position?

Required controls:
- template/layout change;
- accounting-standard/regulatory template change;
- language change;
- OCR quality change;
- section split/merge.

### P5 — universe and missingness denominator
For a frozen issuer/date sample, report:
- expected documents;
- successfully captured;
- missing;
- delisted/inactive;
- retrieval failure;
- source-not-covered.

Coverage must not be reported only over successful captures.

### P6 — economic-content routing
For a small outcome-blind sample, route changed passages into existing owners:
- D07-12/13/15/16/17;
- D07-24/25;
- another existing D07 module;
- UNROUTABLE_EXISTING_SCOPE.

This probe tests curriculum scope, not predictive power.

### P7 — representation redundancy
For the same changed content, demonstrate that:
- raw text diff;
- semantic embedding distance;
- sentiment/tone shift;
- risk-term count;
- LLM classification

are stored as representations of one source event. They must not become independent confirmations by construction.

## Minimum acceptance

Corpus gate = FEASIBLE only if:
1. P1 passes;
2. P2 is EXACT_PUBLIC_CLOCK or conservatively replayable FIRST_OBSERVED_UPPER_BOUND;
3. version handling is append-only;
4. P4 produces a deterministic section-matching contract;
5. P5 has an explicit denominator;
6. P6 shows no unresolved dominant UNROUTABLE family;
7. raw hashes and replay metadata are immutable.

If historical raw vintages fail but prospective capture is possible:
- classify PROSPECTIVE_ONLY_FEASIBLE;
- begin new prospective raw-byte capture;
- historical periods remain unavailable for Shadow/OOS inference.

If original bytes or clocks cannot be established:
- classify DATA_BLOCKED;
- do not reconstruct pseudo-history from current PDFs.

## Explicitly closed items

This contract does not:
- test returns;
- choose a trading horizon;
- promote maturity;
- create a new D07 module;
- authorize System 1/System 2 scoring;
- authorize Formal Core changes.

## Return to 00｜研究總控室

Return one of:
- FEASIBLE;
- PROSPECTIVE_ONLY_FEASIBLE;
- DATA_BLOCKED;
- EVIDENCE_INSUFFICIENT.

Include:
- source list;
- sample issuer/date/document denominator;
- hashes/clock semantics;
- failed probes;
- owner-routing distribution;
- exact next action.

Only FEASIBLE or PROSPECTIVE_ONLY_FEASIBLE may proceed to outcome-blind preregistration design. Neither state alone proves alpha.
