# Canonical Receipt Hash Contract V0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / HASH_AND_SERIALIZATION_CONTRACT_FROZEN
Formal Core: LOCKED

## Purpose

Define one reproducible hashing contract for immutable research receipts.

The contract separates three jobs:

1. schema normalization;
2. canonical JSON serialization;
3. cryptographic hashing.

Do not mix them.

## TI-438 — Use a published canonicalization rule

Canonical JSON follows RFC 8785 JCS semantics where applicable:

- JSON object keys are sorted recursively;
- array element order is preserved;
- child objects inside arrays are canonicalized recursively;
- strings are preserved as-is;
- Unicode normalization is NOT performed;
- JSON numbers follow ECMAScript serialization;
- input must remain inside the I-JSON / IEEE-754-safe semantic contract.

This avoids inventing a project-specific arbitrary key-order algorithm.

## TI-439 — Unicode strings are not normalized

Do NOT apply NFC/NFD or other Unicode normalization inside the canonicalizer.

Example:
- composed "é";
- decomposed "e + combining acute".

They can look visually identical but remain different source strings and therefore have different canonical bytes/hashes.

Reason:
receipt hashing must preserve the exact semantic string supplied by the validated schema.

If a field requires normalization,
that normalization belongs to its schema contract before hashing.

## TI-440 — Supported canonical input types

Allowed:
- null;
- boolean;
- finite JavaScript Number;
- string;
- Array;
- plain Object.

Rejected:
- undefined;
- NaN;
- +Infinity / -Infinity;
- BigInt;
- function;
- symbol;
- Date object;
- Map/Set;
- custom class instances.

Reason:
hidden toJSON/custom serialization behavior weakens cross-runtime determinism.

Dates/times must already be validated strings.

## TI-441 — Number semantics

Numbers are captured as finite IEEE-754 doubles.

Rules:
- no post-hoc rounding inside the hasher;
- -0 canonicalizes as JSON number 0;
- NaN/Infinity are rejected instead of silently becoming null;
- exact identifiers/counters that may exceed safe integer range must be strings, not Number.

Any research formula that wants a rounded display value must separately preserve the unrounded provenance value or define the rounding upstream in its schema.

## TI-442 — Timestamp normalization happens before JCS

JCS intentionally preserves string bytes and does not know timestamp semantics.

Therefore timestamp equivalence is a schema-normalization problem.

For instant fields such as:
- decisionCutoffAt;
- availableAt;
- capturedAt;
- createdAt;

input must include an explicit Z or numeric UTC offset.

Canonical form:
UTC ISO-8601 with millisecond precision:
YYYY-MM-DDTHH:mm:ss.sssZ.

Thus:
2026-09-29T16:00:00+08:00
and
2026-09-29T08:00:00Z
normalize to the same canonical instant before hashing.

Timezone-less timestamps are rejected.

Date-only fields such as scanDate remain YYYY-MM-DD and are not converted through Date parsing.

## TI-443 — SHA-256 over UTF-8 canonical bytes

Production fingerprint primitive:

SHA-256(
  UTF8(
    domainPrefix + canonicalJcsJson
  )
)

Cloudflare Workers supports SHA-256 through Web Crypto crypto.subtle.digest.

Hex representation:
- lowercase;
- 64 hex characters.

The hasher does not use a project-written cryptographic algorithm.

## TI-444 — Domain separation is mandatory

The same canonical JSON may appear in different receipt roles.

Use distinct fixed prefixes:

Parent ID:
TWSTOCK_V7|PARENT_ID|V1|

Semantic fingerprint:
TWSTOCK_V7|SEMANTIC_FINGERPRINT|V1|

Generic source/evidence families must define their own versioned domain prefix.

This prevents one digest namespace from being accidentally reused as another semantic identifier.

## TI-445 — Parent identity application

parentDecisionReceiptId =
SHA256_JCS(
  domain=PARENT_ID,
  normalized identity tuple only
).

semanticFingerprint =
SHA256_JCS(
  domain=SEMANTIC_FINGERPRINT,
  normalized immutable decision payload only
).

Do not put semanticFingerprint into the parent ID input.

This preserves direct detection of:
same identity + different payload = PROVENANCE_CONFLICT.

## TI-446 — Canonicalization and schema normalization must be versioned separately

Required metadata:
- canonicalizationVersion;
- hashAlgorithmVersion;
- schemaNormalizationVersion.

Reason:
a future schema normalization change can alter semantic bytes without changing SHA-256 or JCS.

Never relabel old receipts into a new normalization contract.

## TI-447 — Deterministic reference vectors

Vector A:
canonical JSON:
{"a":1,"b":2}

Parent-ID domain digest:
2f76fdd83f0b4ae4bcd94c50aabd4a03466339eb0f3562cdf9f7f894cf3e54d9

Semantic-fingerprint domain digest:
3636cf7a54dd401e834b6bf06840b2db8fa182a39cc2b5206c6cabd054db3d74

Nested canonical vector:
{"a":[3,{"x":1,"y":2}],"z":0}

GENERIC_TEST domain digest:
9d5a9938d54eb0ee71085036fa2e419321c6e8dcd7d451d0c12ec3a8617526f3

Unicode non-normalization negative control:
composed "é" and decomposed "e\u0301"
must produce different hashes.

## TI-448 — Failure semantics

Any canonicalization/schema failure:
- returns/throws a hard QA error;
- never hashes a partially sanitized object;
- never coerces invalid values to null/0/empty string.

A receipt whose hash input cannot be canonically represented is:
QA_FAIL / BLOCKED,
not best-effort VALID.

## TI-449 — Runtime compatibility conclusion

Cloudflare Workers Web Crypto provides native SHA-256.

Therefore future runtime implementation does not need:
- Node crypto compatibility;
- external hashing package;
- handwritten SHA-256.

The canonicalizer remains a small deterministic project function.
The cryptographic digest uses the runtime primitive.

## Current status

CANONICAL_JSON_CONTRACT = RFC8785_COMPATIBLE_SUBSET_FROZEN_V0_1
HASH_ALGORITHM = SHA256_UTF8_FROZEN_V0_1
DOMAIN_SEPARATION = FROZEN
TIMESTAMP_NORMALIZATION = FROZEN_V0_1
PRODUCTION_HASH_IMPLEMENTATION = RESEARCH_PROTOTYPE_NEXT
FORMAL_OPTIMIZATION_CANDIDATE = NONE
Formal Core remains LOCKED.

## Official evidence anchors

- RFC 8785 JSON Canonicalization Scheme.
- Cloudflare Workers Web Crypto API: crypto.subtle.digest supports SHA-256.

## Exact next continuation

1. Implement pure canonicalizer + SHA-256 helper as research-only module.
2. Freeze deterministic vectors.
3. Update immutable parent prototype to normalize timestamp identity before hashing.
4. Test equivalent UTC offsets => identical parent ID.
5. Test Unicode composed/decomposed strings remain distinct.
6. Keep zero market calls / zero D1 writes.


## JCS Unicode hardening — TI-450

RFC 8785 explicitly requires invalid Unicode data such as lone surrogates to terminate canonicalization with an error.

The first prototype relied on JSON.stringify for string emission but did not yet reject lone surrogate code units.

This gap was found before runtime use.

V0.1 implementation is hardened to validate:
- every string value;
- every object property name.

Rejected:
- lone high surrogate;
- lone low surrogate.

Valid surrogate pairs such as emoji remain accepted.

RFC-compatible number serialization edge vectors were also added:
333333333.33333329 -> 333333333.3333333
1E30 -> 1e+30
4.50 -> 4.5
2e-3 -> 0.002
1e-27 -> 1e-27

This keeps the project canonicalizer aligned with ECMAScript/V8 number serialization required by JCS.
