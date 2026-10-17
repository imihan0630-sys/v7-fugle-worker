# Room08 D11/D17 — official disclosure schema drift and semantic delimiter falsification (2026-10-17)

Status: RESEARCH_ONLY / NO_MATURITY_PROMOTION / NO_FORMAL_CHANGE
Main observed before write: 24cfc23e9effa51f77138935fac980c2f98d8ad3
Source observer blob: 050df69d175a7990303628c66bf1662d099b435e
Checkpoint before write blob: af587a97b9bd2d5deca6c7a2a59757207a701429

## New finding 1 — exact source header is a hidden identity dependency
The TWSE observer reads subject from the exact key `主旨 ` (including a trailing ASCII space); TPEX reads `主旨`. The observer normalizes VALUES but does not validate required SOURCE KEYS. A TWSE response with `主旨` instead of `主旨 ` silently becomes subject="", with different derived identity, content and semantic hashes for an otherwise identical synthetic announcement. Missing company code, date or time likewise creates hashes rather than a schema failure. This is a deterministic schema-drift failure mode, NOT evidence that the live TWSE schema actually changed. The external official API was inaccessible in this run, so live schema drift and prevalence remain UNKNOWN.

Support: inspected main observer implementation and reproduced exact field-order/normalization/hash semantics in a Python mirror. Falsification: source may guarantee stable header spelling, or an upstream validator may reject malformed rows. Alternative: source format version or proxy transformation. Invalidates as an active production defect if source contract and all effective ingestion paths enforce required-key/schema checks and fail closed.

## New finding 2 — delimiter ambiguity in semantic candidate hash
The semantic candidate material is constructed as [symbol, clause, factDate, subject, description].join("|") with no field escaping or length framing. Two distinct synthetic inputs: subject="甲|乙", description="丙" versus subject="甲", description="乙|丙" yield the same pre-hash material and hence identical semanticCandidateSha256, while source content and derived identity differ. This is an input-encoding ambiguity, NOT a cryptographic SHA-256 collision, and does not establish an actual event merge in Production. Do not use semanticCandidateSha256 alone as an event-root uniqueness proof. A versioned canonical structured serialization/length-prefixed fields is a candidate research fix; retain legacy hash and append a new research-only identifier to avoid rewriting historical lineage.

Support: deterministic synthetic mirror. Falsification: official subject/description may never contain vertical bars or downstream logic may not use this candidate as a uniqueness key. Alternative: re-publication versus genuinely independent announcements. Failure condition for the proposed risk is a documented source constraint excluding delimiters plus a validated independent native ID chain.

## D11/D17 implication and quality gates
D11-08 and D17-02: missing source keys cannot establish first-known or announcement version; preserve actual observedAt only and UNKNOWN source clock. D11-13: a successful fetch with malformed/missing keys does not prove NO_EVENT or complete coverage. D17-09/10: semantic equality is a *candidate*, not proof of a shared economic event; retain raw bytes, schema version, source, row index, normalized fields and independent native correction lineage.

PIT, firstKnownAt, knownAt, correction versions, news dedup, OOS, walk-forward, selection bias, look-ahead, data mining, multiplicity, overfit, factor redundancy, date/event clustering, costs and regime dependence: all remain gated. No real prospective arrival or return cohort, no historical Shadow, no alpha or Formal Optimization Candidate. Synthetic tests are not independent market events. Formal Core LOCKED.

## Validation and continuation
20/20 deterministic Python mirror checks pass; these are NOT a direct import/run of the actual .mjs module and not production E2E. Local artifact: room08_20261017_1831/d17_schema_contract_falsification.py and validation.json. Live TWSE/TPEX APIs were inaccessible; Firecrawl quota unavailable. Exact next: obtain one immutable raw official response for each source with full key-set/hash/observedAt; verify key schema in actual official source; build direct Node observer regression for missing-key and delimiter cases; preserve native correction identity; only then assess read-only prospective quality gate, without modifying Formal/production.
