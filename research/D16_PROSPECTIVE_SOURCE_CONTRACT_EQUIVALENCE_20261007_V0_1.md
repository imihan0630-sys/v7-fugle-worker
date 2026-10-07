# D16 Prospective Source-Contract Equivalence Firewall 2026-10-07 V0.1

Updated: 2026-10-07 Asia/Taipei
Status: RESEARCH_ONLY / SOURCE_SUBSTITUTION_FIREWALL_FROZEN
Owner room: 11｜統計驗證與策略市場狀態研究室
Modules: D16-11 / D16-14
Formal Core impact: NONE
Production/runtime impact: NONE

## Purpose

Freeze when one official data endpoint may replace another in prospective research.

2026-10-07 supplied a concrete counterexample:
- one TWSE latest-data endpoint still exposed 2026-10-06 at 18:43 Taipei;
- another official TWSE requested-date daily-close route already exposed 2026-10-07;
- TPEx current-date daily-close data was also observable on official source families.

Therefore provider identity, dataset semantics and transport endpoint identity must remain separate.

## Core rule

"Official" does not mean two endpoints are automatically interchangeable.

A prospective source change requires a new versioned source-contract receipt.

Minimum equivalence dimensions:
1. target/session identity;
2. field semantics and units;
3. population/security-class coverage;
4. same-date common-support value reconciliation;
5. prospective clock semantics;
6. revision behavior;
7. failure-state semantics;
8. raw provenance and parser version.

## Clock firewall

A source first observed READY at time T proves readiness no earlier than T.

Historical requested-date retrieval proves that historical content is retrievable now.
It does not prove the historical first-known/publication time.

No backdating from later discovery.

## Adaptive-source-selection firewall

Unsafe:
- try one endpoint;
- when stale, search alternatives;
- choose whichever is READY;
- reinterpret that result as the original decision clock.

Safe:
- preregistered source order;
- frozen semantic-equivalence class;
- record every attempt;
- first qualifying source determines the prospective receipt;
- later observations do not rewrite the earlier receipt.

## Readiness states

Keep separate:
- DATE_READY;
- BODY_COMPLETE;
- PARSE_VALID;
- POPULATION_COMPLETE;
- SEMANTIC_EQUIVALENT;
- PROVENANCE_COMPLETE;
- RESEARCH_ADMISSIBLE.

Transport success alone is insufficient.

## Parallel prospective validation

Before promoting an alternative endpoint:
- observe old and candidate sources in parallel on future sessions;
- compare field/population identity on common support;
- measure endpoint-specific first READY time;
- preserve stale/transport/body failures;
- freeze source-routing policy before strategy outcomes are opened.

Do not choose the source because one historical or current day happened to produce a favorable research sample.

## Missingness implication

Endpoint availability can be state-dependent.
A source-selection rule can therefore select the research dates.

Report per endpoint:
- attempts;
- target-date READY;
- stale-date;
- transport/body failure;
- semantic mismatch;
- accepted;
- observed time-to-ready.

Accepted-only outcome analysis is not promotion-grade without coverage diagnostics.

## 2026-10-07 interpretation

TWSE:
the evidence supports "chosen prospective endpoint lag" rather than "official current-day close data absent".

TPEx:
the evidence supports "current-day official data observable" while acquisition/body integrity and exact routing still require validation.

Neither result authorizes an immediate unversioned source swap.

## Module consequences

D16-11:
bind provider + dataset contract + endpoint + observed clock separately.

D16-14:
generation alignment must bind source-contract version, not provider name alone.

D16-09:
attribute coverage loss by source/endpoint reason before zero-pick interpretation.

D18:
preserve source-contract lineage when comparing Regime occupancy across dates.

SDA-016:
changing source after outcome inspection expands the experiment family and consumes prior outer evidence.

## Maturity decision

No maturity change.

The methodology gap is closed, but source-routing implementation and multi-date prospective equivalence receipts remain absent.

## Exact next continuation

1. Version any candidate A1 source change.
2. Dual-observe old and candidate endpoints prospectively.
3. Freeze common-support equivalence and routing order before outcome opening.
4. Store exact endpoint-specific attempt/readiness lineage.
5. Preserve 2026-10-07 stale-endpoint evidence after any future repair.
