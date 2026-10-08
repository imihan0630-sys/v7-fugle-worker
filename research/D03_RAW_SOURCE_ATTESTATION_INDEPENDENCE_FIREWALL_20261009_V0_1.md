# D03 raw-source attestation independence firewall

## Scope

The physical third completed-session gate is closed. The next question is whether repeated or cross-endpoint observations are genuinely independent evidence.

## Four evidence levels

1. L1 repeat-capture stability: the same endpoint is captured again and its bytes remain unchanged.
2. L2 same-authority representation parity: different endpoints or formats under the same authority/producer agree.
3. L3 independent integrity/timestamp witness: an independent service proves identity or timing but not the market-data semantics.
4. L4 independent semantic source attestation: distinct authority/producer/parser roots independently cover the same market, trade date, bounded scope and symbol-session semantics before the decision cutoff.

Only L4 may satisfy the independent-source-attestation component. Full D03 continuity admission still separately requires certified symbol sessions, corporate-action ancestry and binding into the continuity receipt hash.

## Current physical classification

The 2026-10-08 third-session run captured each official endpoint twice. Sixteen of sixteen repeated comparisons were byte-identical.

This is valuable L1 stability evidence only. The repeat uses the same endpoint, authority, producer family and parser path. It does not create an independent lineage root.

TWSE current versus TWSE historical also cannot receive representation-parity credit for 2026-10-08 because their observed trade dates differ. TPEx current versus historical exact-row equality is useful same-authority representation evidence, but still not independent semantic attestation.

Therefore:

- completed-session count: closed;
- finite repeat stability: physically supported;
- revision incidence: UNKNOWN;
- independent source attestation: UNKNOWN.

## Counterexamples

The executable oracle rejects independence credit when:

- only the network client, capture time or URL changes;
- two endpoints share the same authority, producer or known backend;
- the same parser is the sole semantic transform;
- market, trade date or bounded scope differs;
- either response is partial;
- lineage roots are unknown;
- normalized symbol-session hashes disagree;
- the attestation arrives after the decision cutoff.

A disagreement is CONFLICT, not permission to prefer the primary source silently.

## Scientific limits

This contract does not invent a second official source. It does not promote D03-09 or D03-10, open outcomes or claim predictive value. OOS, walk-forward, multiple testing, redundancy, cost, fillability, market-state and alpha remain UNKNOWN.

Formal Core remains LOCKED. FORMAL_OPTIMIZATION_CANDIDATE is NONE.
