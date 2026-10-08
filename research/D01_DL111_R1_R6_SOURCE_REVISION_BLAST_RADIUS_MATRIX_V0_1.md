# D01 DL-111 — R1-R6 Source-Revision Blast-Radius Matrix V0.1

Updated: 2026-10-08 Asia/Taipei
Status: OUTCOME_BLIND / REVISION_BLAST_RADIUS_FROZEN / FORMAL_CORE_LOCKED

## Purpose

Freeze how revisions in each upstream receipt family propagate into D01 R7 without treating every data correction as either harmless or globally fatal.

Three evidence roles remain separate:

PREDICTOR_INFORMATION
- information legally available to the historical predictor.

DATASET_VALIDATION_EVIDENCE
- later evidence used to prove whether the historical dataset was complete/correct.

CURRENT_BEST_KNOWN_TRUTH
- today's best archive after later corrections/revisions.

Only PREDICTOR_INFORMATION enters the historical predictor.

## R1 — PIT membership / security identity revisions

Examples:
- corrected listing date;
- corrected delisting/migration date;
- security-code identity correction;
- share-conversion boundary correction.

Blast radius:
- if exact historical membership/session eligibility changes, the expected window itself changes;
- exactSessionHash and potentially all R2-R7 identities change;
- affected opportunity requires a new replay;
- old receipt remains immutable.

If correction was first knowable only later:
historical market membership view still follows what the legal market state actually was, but the research dataset must classify whether the old membership registry was a pipeline error versus a later administrative annotation.

R1_WINDOW_IDENTITY_IMPACT = GLOBAL_FOR_AFFECTED_WITNESS.

## R2 — RAW A1 / OHLC revision

Examples:
- corrected OHLC value;
- missing bar added;
- duplicate bar removed;
- volume-only correction.

Price-field change:
- sourceHistoryHash changes;
- all price-derived first-wave R7 modules using that bar must replay;
- common parents must replay on identical revised support.

Volume-only change:
- D01 price-only R7 does not change by default;
- D02-owned context may change;
- D01 must not absorb the volume change as a price-pattern revision.

R2_PRICE_REVISION_IMPACT = ALL_D01_PRICE_MODULES_CONSUMING_BAR.
R2_VOLUME_ONLY_REVISION_IMPACT = D02_CONTEXT_ONLY_BY_DEFAULT.

## R3 — symbol-session lifecycle revision

Examples:
- suspension interval corrected;
- trade-eligibility session added/removed;
- listing/resumption boundary corrected.

Blast radius:
- expected eligible date set changes;
- exactSessionHash changes;
- lookback session counts and lifecycle durations may change;
- all affected D01 modules replay.

R3_SESSION_SET_IMPACT = GLOBAL_FOR_AFFECTED_WINDOW.

## R4 — corporate-action continuity revision

Examples:
- missed ex-right/dividend event;
- capital reduction correction;
- par-value change correction;
- cancellation/supersession.

Blast radius depends on causal classification:
- preexisting public information backfill => pipeline-error corrected replay;
- late correction => PIT view unchanged;
- continuity factor/effective-date change that was knowable then => TECHNICAL_CONTINUITY replay for every downstream module using affected bars.

R4_CONTINUITY_IMPACT = ALL_MODULES_USING_AFFECTED_CONTINUITY_BARS.

## R5 — legal reference / price-limit revision

Examples:
- corrected opening-auction reference;
- upper/lower limit;
- exemption/no-limit state;
- rule-version mapping.

Primary blast radius:
- D01-09 gap/price-limit interpretation;
- any other D01 module only if it explicitly consumed R5 context in its frozen payload/eligibility.

A changed legal reference does not automatically alter raw OHLC geometry.

R5_PRIMARY_IMPACT = D01_09.
R5_RAW_OHLC_REWRITE = FALSE.

## R6 — disposition / matching-regime revision

Examples:
- newly identified disposition period;
- corrected matching cadence;
- changed trading-method flag.

Primary effect:
- market-mechanism/context interpretation;
- module replay required only where frozen R7 context or eligibility depends on R6.

Raw OHLC bars remain execution facts unless separately revised.

R6_CONTEXT_IMPACT = CONTEXT_DEPENDENT.
R6_RAW_OHLC_REWRITE = FALSE.

## Revision impact classes

WINDOW_IDENTITY_CHANGED
RAW_PRICE_HISTORY_CHANGED
CONTINUITY_HISTORY_CHANGED
LEGAL_REFERENCE_CONTEXT_CHANGED
MATCHING_CONTEXT_CHANGED
NON_D01_FIELD_CHANGED
VALIDATION_CONFIDENCE_ONLY
NO_MATERIAL_D01_CHANGE
UNKNOWN_BLOCKED

## Transitive invalidation rule

If an upstream revision changes:
- expected date set;
- sourceHistoryHash;
- continuityTransformHash;

every downstream R7 receipt that binds the old commitment is immutable but no longer the replay result for the new vintage.

It must be linked through migration, not overwritten.

## Parent / child rule

Whenever a revision changes the common support:
- named child and common parent replay together;
- no mixing of old parent and revised child;
- no favorable-row-only repair.

## Current decision

ALL_REVISIONS_GLOBAL = FALSE.
WINDOW_OR_PRICE_OR_CONTINUITY_IDENTITY_CHANGE_REQUIRES_DOWNSTREAM_REPLAY = TRUE.
R5_R6_CONTEXT_CHANGES_DO_NOT_REWRITE_RAW_OHLC = TRUE.
VOLUME_ONLY_R2_CHANGE_DOES_NOT_CREATE_D01_PRICE_REVISION = TRUE.
OUTCOME_JOIN = CLOSED.
Formal Core remains LOCKED.
