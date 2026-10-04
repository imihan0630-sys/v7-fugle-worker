# System 2 Strict TPEx Ex-Right/Dividend Revision Discovery V0.4

Updated: 2026-10-04 Asia/Taipei
Status: RESEARCH_ONLY / STRICT DIRECT-OPERATIONAL DISCOVERY
System 1 Formal Core: LOCKED

## Why V0.4 exists

V0.3 found 2947 振宇五金 as a broad dividend-allocation revision candidate.

That candidate is not promoted because the corrected row is a generic dividend-distribution disclosure, while the exchange-side operational evidence is an ex-right/dividend event. Same-symbol coincidence is not enough for a representative authority control.

V0.4 therefore tightens the discovery predicate.

## Strict issuer-side requirement

The correction/cancellation row itself must directly contain at least one of:
- 除權;
- 除息;
- 除權息;
- 基準日.

The earlier original row must:
- also have direct operational semantics;
- precede the revision in source-reported version order;
- share an exact normalized subject stem or conservative >=72% containment.

Rows referring to subsidiaries are excluded because the exchange event is for the listed issuer's own security.

Capital-reduction, share-exchange and par-value-change wording remains excluded.

## Candidate window

Uses the same deterministic 2026 TPEx official ex-right/dividend candidate ordering and exclusions as V0.2/V0.3.

- start offset: 24;
- maximum additional candidates: 160;
- stop after first strict positive.

Re-querying the first four V0.3 continuation candidates is intentional because the acceptance predicate is stricter.

## Promotion boundary

A strict positive is still discovery-only.

Promotion additionally requires:
- exact issuer revision chain frozen;
- exact TPEx operational event for the same symbol;
- authority-role join physically verified;
- versioned MOPS/authority/receipt artifacts;
- all broad completeness and knownAt blockers retained.

## Fail-closed semantics

If no strict positive is found:
- do not fall back to the 2947 broad dividend-allocation chain;
- preserve the negative candidate interval;
- continue with another bounded candidate interval or alternate official evidence source.
