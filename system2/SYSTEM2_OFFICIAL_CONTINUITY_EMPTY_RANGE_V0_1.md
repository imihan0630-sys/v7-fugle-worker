# System 2 Official Continuity Empty-Range Semantics V0.2

Status: RESEARCH_ONLY / ENDPOINT-SPECIFIC_CERTIFICATION_IMPLEMENTED / PHYSICAL_ACCEPTANCE_PENDING
Updated: 2026-10-03 Asia/Taipei
System 1 Formal Core: LOCKED

## Purpose

Freeze fail-closed endpoint-specific rules for deciding when an official TWSE / TPEx historical corporate-action result response can be treated as a verified empty range.

This solves only source-level empty-range semantics. It does not by itself authorize symbol-level NO_EVENT or technical continuity.

## Physical characterization already observed

PR #398 first characterization run:

- workflow run 37133146173;
- requested empty date: 2026-10-03;
- six official historical source lanes queried read-only;
- 4/6 returned zero rows while also echoing the exact requested date range;
- 2/6 TWSE lanes returned HTTP 200 with only the official no-data status text and omitted the requested range from the response body.

Direct exact-range zero signatures:

1. TWSE par-value-change reference:
   - stat=OK;
   - params.startDate/endDate match the exact request;
   - fields/data envelope present;
   - data is empty.

2. TPEx ex-right/ex-dividend actual;
3. TPEx capital-reduction reference;
4. TPEx par-value-change reference:
   - stat=ok;
   - date matches the exact requested interval;
   - tables envelope present;
   - returned rows are empty.

TWSE zero-row responses without body range identity:

1. TWSE ex-right/ex-dividend actual;
2. TWSE capital-reduction reference.

Both returned:

- HTTP 200;
- JSON object containing only stat;
- stat exactly: 很抱歉，沒有符合條件的資料!

## Controlled certification for the two TWSE no-range responses

Because those two empty responses do not echo the requested date, they are not certified from zero rows or message text alone.

V0.2 requires a same-endpoint positive control with the identical request shape:

- TWSE ex-right/ex-dividend actual positive control: 2026-04-08;
- TWSE capital-reduction reference positive control: 2026-06-29.

Those dates were taken from the previously physically parsed official event set.

Certification requires all of the following:

- target empty request returns HTTP 2xx;
- final response URL preserves the requested URL identity;
- target response has zero rows;
- target response has no range identity;
- target response top level is exactly the single stat field;
- stat matches the frozen official no-data text;
- positive control request to the same endpoint preserves URL identity;
- positive control response echoes its exact requested range;
- positive control returns at least one row.

If any condition changes, empty semantics fail closed.

## Direct certification for the other four sources

A direct source is certified empty only when:

- HTTP is successful;
- request/final URL identity is preserved;
- the response explicitly identifies the exact requested range;
- the source-specific official envelope is present;
- the official success status matches the frozen value;
- row count is zero.

## Authority firewall

Even if all six sources certify their empty response semantics:

- noEventMayBeClaimed=false;
- revisionCoverageComplete=false;
- suspensionCoverageComplete=false;
- symbolSessionCompletenessCertified=false;
- technicalContinuityCertified=false;
- historyMutationPerformed=false;
- strategyEvaluationPerformed=false;
- capacityRunProduced=false;
- selectionAuthority=false;
- finalSelectionEnabled=false;
- livePushEnabled=false;
- capitalImpact=false;
- orderImpact=false;
- system1RuntimeUsed=false.

## Why NO_EVENT is still locked

Corporate-action completeness still requires the independent gates already frozen in the archive core:

1. complete PIT universe coverage;
2. complete required source contracts for the requested interval;
3. parser completeness;
4. revision/correction coverage;
5. no missing source dates;
6. certified empty semantics where a source returns zero rows;
7. unambiguous event version reconciliation.

Symbol-session completeness additionally requires exchange-complete suspension/resumption evidence.

## Physical acceptance target

The PR workflow must now physically reproduce all six frozen signatures and both TWSE positive controls. Only then may this source-level gate be recorded as:

emptyRangeSemanticsCertified=true

That state still does not certify NO_EVENT or continuity.

## Next gate

After physical acceptance:

1. record the accepted response signatures in the System2 checkpoint/master/build map;
2. move to revision/correction coverage;
3. then add exchange-complete suspension/resumption coverage;
4. bind verified event/suspension evidence to expected symbol sessions and RAW A1 lineage without mutating RAW bars.

No assessor or selection authority is enabled.
