# System 2 S2-07 Symbol-Session Integration V0.8

Updated: 2026-10-06 Asia/Taipei
Status: RESEARCH_ONLY / BUILD_LANE / PHYSICAL_EXECUTION_PENDING
Formal Core: LOCKED
Trading authority: NONE

## Purpose

Integrate bounded S2-07 event-linkage evidence with shared exchange suspension/resumption evidence and official market sessions without promoting either lane beyond what is actually certified.

This layer consumes:
- the V0.7 per-event promotion-evidence state;
- official market-wide trading dates;
- exchange-scoped symbol suspension/resumption intervals.

It does not create a new suspension source and does not infer NO_SUSPENSION from absence.

## Shared-source reuse

TWSE:
- historical suspended-securities lane / TWTAWU;
- bounded source contract: D03_TWSE_OFFICIAL_DOCUMENT_MACHINE_CONTRACT_V0_1.

TPEx:
- official Trading Halt / Resumption Trade machine endpoint;
- bounded source contract: D03_TPEX_HALT_RESUMPTION_MACHINE_CONTRACT_V0_2.

Market-wide sessions:
- existing System2 official TWSE trading-calendar resolver.

## Evidence rule

A bounded event may reach:
`BOUNDED_SYMBOL_SESSION_EVIDENCE_READY`

only when:
1. V0.7 event-linkage promotion evidence is ready;
2. exactly one authoritative suspension interval matches market + symbol + resumeTradingDate = event effectiveDate;
3. the resume/effective date is an official market-wide trading session;
4. suspension source row/artifact provenance is present.

The matched interval removes only verified suspended market sessions from the symbol's expected-session set.

## Fail-closed states

- event linkage not ready -> EVENT_LINKAGE_PROMOTION_NOT_READY
- no exact suspension/resumption match -> SUSPENSION_RESUMPTION_MATCH_NOT_OBSERVED
- multiple exact matches -> AMBIGUOUS_SUSPENSION_RESUME_MATCH
- resume date not an official market session -> RESUME_MARKET_SESSION_NOT_VERIFIED
- missing source hash/provenance -> SUSPENSION_SOURCE_PROVENANCE_MISSING

Absence outside the observed source lane remains:
`SUSPENSION_PROVENANCE_UNKNOWN`

and never becomes NO_SUSPENSION.

## Authority firewall

Even when boundedSymbolSessionEvidenceReady=true:
- suspensionCoverageComplete=false;
- symbolSessionCompletenessCertified=false;
- technicalContinuityCertified=false;
- continuityTransformPerformed=false;
- selectionAuthority=false;
- finalSelectionEnabled=false;
- livePushEnabled=false;
- capitalImpact=false;
- orderImpact=false.

This V0.8 grade means only that a bounded event has a physically matched, provenance-bearing halt/resume interval whose resume date is a verified market session.

## Physical execution

Readonly workflow:
`.github/workflows/system2-s2-07-symbol-session-integration-v0-8-readonly.yml`

It evaluates all 17 frozen V0.7 events against:
- the machine V0.7 physical receipt;
- current official TWSE bounded suspension query;
- current official TPEx 2026 mainboard halt/resumption machine population;
- official 2026 market trading dates.

No secrets, D1/R2 writes, Worker deploy, strategy evaluation, selection, push, capital/order or System1 runtime are permitted.

## Next gate

After physical V0.8:
1. inspect positive exact halt/resume matches and blocked cases;
2. do not certify exchange-wide absence from bounded source non-match;
3. bind only physically proven symbol-session windows into RAW A1 lineage;
4. technical continuity remains a later, separate promotion gate.
