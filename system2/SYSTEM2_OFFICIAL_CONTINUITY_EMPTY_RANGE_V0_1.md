# System 2 Official Continuity Empty-Range Semantics V0.2

Status: RESEARCH_ONLY / ENDPOINT_SPECIFIC_CERTIFICATION_IMPLEMENTED / PHYSICAL_ACCEPTANCE_PENDING
Updated: 2026-10-03 Asia/Taipei
System 1 Formal Core: LOCKED

## Purpose

Freeze endpoint-specific rules for when a zero-event response from the six official TWSE / TPEx historical corporate-action result lanes may be treated as source-level verified empty-range evidence.

This is narrower than NO_EVENT. It only answers whether a specific official source response can prove that the requested interval contained no rows in that source.

## Physical characterization inherited from V0.1

The 2026-10-03 Saturday probe established two response families.

### Exact-range zero-row responses

Four sources returned an explicit requested range plus an empty row container:

- TWSE par-value-change reference;
- TPEx ex-right/ex-dividend actual;
- TPEx capital-reduction reference;
- TPEx par-value-change reference.

These can be certified only when the exact range identity, expected official status, expected parser envelope and zero row count all match.

### TWSE no-data status without response range

Two TWSE sources returned HTTP 200 with a JSON object containing only the official no-data stat field:

很抱歉，沒有符合條件的資料!

They did not echo the requested range:

- TWSE ex-right/ex-dividend actual;
- TWSE capital-reduction reference.

A no-data message alone is insufficient. V0.2 therefore requires a positive control from the same endpoint and the same request shape.

Frozen positive-control dates are taken from the physically parsed official event set:

- TWSE ex-right/ex-dividend actual: 2026-04-08;
- TWSE capital-reduction reference: 2026-06-29.

The positive control must return a non-empty response whose embedded range exactly matches the requested control date.

## Certification rules

### Direct exact-range sources

Certification requires all of:

- HTTP success;
- parseable JSON;
- state = EXACT_RANGE_ZERO_ROWS_OBSERVED;
- exact response-range identity;
- explicit zero rows;
- frozen official success status;
- frozen parser envelope.

### Controlled TWSE no-data sources

Certification requires all of:

- HTTP success;
- parseable JSON;
- target state = EMPTY_OR_NO_DATA_RANGE_UNVERIFIED;
- no response-range identity in the target no-data payload;
- no row container in the target no-data payload;
- parser shape = JSON_NO_ROW_CONTAINER;
- exact frozen official no-data status;
- same-source positive control on the frozen date;
- positive-control state = NON_EMPTY_RANGE;
- positive-control range identity verified;
- positive-control row count > 0.

Any signature drift fails closed.

## Authority firewall

Even when all six source-level empty semantics certify:

- sourceCoverageComplete=false;
- revisionCoverageComplete=false;
- noEventMayBeClaimed=false;
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

## Why NO_EVENT remains locked

The immutable corporate-action completeness receipt still requires:

1. PIT universe coverage;
2. complete required source contracts for the full requested interval;
3. parser completeness;
4. revision/correction coverage;
5. no missing source dates;
6. certified empty-range semantics for zero-row sources;
7. unambiguous event-version reconciliation.

Symbol-session completeness additionally needs exchange-complete suspension/resumption evidence.

## Physical acceptance

Workflow:

.github/workflows/system2-official-continuity-empty-range-readonly.yml

The V0.2 physical run must certify all six sources. It remains read-only and uses:

- no secrets;
- no D1 write;
- no Worker deploy;
- no Cron;
- no System1 runtime.

## Next gate after acceptance

1. write the physical acceptance receipt to System2 checkpoint/master/build map;
2. establish revision/correction coverage;
3. establish exchange-complete suspension/resumption coverage;
4. bind verified corporate-action evidence to expected symbol sessions and RAW A1 lineage without mutating RAW bars.

No assessor or selection authority is enabled by this module.
