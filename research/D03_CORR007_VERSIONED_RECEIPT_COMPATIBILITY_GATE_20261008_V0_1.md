# D03 CORR-007 versioned receipt compatibility gate

## Scope

This research-only gate extends the existing D03 suspension-provenance firewall after the canonical handoff made evidence-bound completeness machine-distinct from legacy status-only completeness.

It does not implement System2 runtime code and does not authorize Formal Core changes.

## Hypothesis and counterhypothesis

Hypothesis: an evidence-bound suspension-completeness receipt can support D03 W0 continuity only when its schema identity, source contract version, exact interval, immutable digest, matching source reference and causal timing are jointly valid.

Counterhypothesis: legacy V0.1 status-only receipts, relabelled legacy payloads, or cross-version mixtures could accidentally pass by carrying a plausible digest or COMPLETE string.

The executable cases reject the counterhypothesis mechanically: schema identity is not inferred from payload shape, a digest cannot upgrade V0.1, source contract V0.1 cannot be mixed into a V0.2 completeness receipt, and historical V0.1 receipts are never rewritten.

## Falsification coverage

- valid V0.2 positive control;
- legacy V0.1 fail-closed, including V0.1 plus a syntactically valid digest;
- V0.2 wrapper with V0.1 source semantics;
- missing family/version, invalid digest, interval mismatch;
- source identity/digest mismatch;
- prospective and verified-source timing violations;
- replacement of the three corporate-action references;
- partial source, unresolved conflict and exact-session failure;
- hash sensitivity when only the bounded suspension digest changes.

## Interpretation limits

Passing proves only the version-compatibility contract and anti-stale-receipt behavior. It does not prove merged-main CORR-007 implementation, a real bounded TWTAWU receipt, W0 continuity, a genuine V8.20 parent, predictive alpha, OOS, walk-forward, multiple-testing control, transaction costs, fillability or market-state robustness. All remain UNKNOWN where physical evidence is absent.

Formal Core remains LOCKED. FORMAL_OPTIMIZATION_CANDIDATE is NONE.
