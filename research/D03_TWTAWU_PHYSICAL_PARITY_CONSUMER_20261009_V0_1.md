# D03 TWTAWU physical parity consumer

## Accepted physical increment

GitHub Actions run 37868573025 / job 113621076062 physically observed the exact 2026-08-13 through 2026-08-14 all-listed TWSE TWTAWU query in JSON and CSV representations. Both returned HTTP 200, one normalized row and the known 1218 suspension/resumption event. Raw source bytes were hashed before decoding. The CSV source declared MS950 and was decoded through strict Big5 handling. The normalized row sets were equal.

This closes one narrow falsification prerequisite: the candidate CSV transport can physically reproduce a known positive row under the frozen query. It also preserves the earlier failed UTF-8 decoding run as negative engineering evidence rather than rewriting it.

## D03 evidence classification

The two representations share the TWSE authority, producer family and domain. Therefore the physical increment is L2 same-authority representation parity, not L4 independent semantic source attestation.

The run does not prove:

- independent backend ancestry;
- source-backed range exhaustiveness;
- absence of pagination or truncation;
- revision/cancellation completeness;
- negative no-suspension completeness;
- original 2026-08 decision-time availability;
- symbol-session certification;
- corporate-action ancestry;
- technical continuity or W0 readiness.

The physical receipt itself explicitly leaves all of those fields false. D03 must consume those false values rather than infer promotion from the successful positive row match.

## Executable counterfactual gate

The 18-case oracle distinguishes three stages:

1. Positive parity: requires successful bounded transports, original-byte hashes, exact query identity, matching nonempty row sets and the known positive row.
2. Negative completeness: additionally requires independently pinned export contract, range exhaustiveness, no truncation/pagination, revision/cancellation coverage, complete source coverage and causal observation by the decision cutoff.
3. W0 readiness: additionally requires certified symbol sessions, corporate-action ancestry, identity-transition disposition and continuity-receipt hash binding.

Empty JSON plus empty CSV is explicitly rejected when any completeness or timing gate is absent. A same-authority pair remains L2 even if backend independence is separately proven; authority/producer independence is still absent.

## Scientific disposition

Current result: positive representation parity PASS at L2; negative completeness false; W0 readiness false.

No outcome join, alpha claim, OOS, walk-forward, multiple-testing conclusion, transaction-cost claim, fillability claim or market-state robustness claim is created. D03 remains 56.7%, D03-09 and D03-10 remain L2/40, and Formal Core remains LOCKED.
