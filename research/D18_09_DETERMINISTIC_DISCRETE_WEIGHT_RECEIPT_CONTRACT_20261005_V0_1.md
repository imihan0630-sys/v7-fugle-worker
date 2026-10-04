# D18-09 Deterministic Discrete Weight Receipt Contract V0.1

Updated: 2026-10-05 Asia/Taipei
Status: RESEARCH_ONLY / L2_DEEPENED / L3_NOT_JUSTIFIED
Formal Core impact: NONE

## Research conclusion

D18-09 cannot inherit D18-08 L3. Binary activation and dynamic weighting have different estimands and degrees of freedom. Dynamic weighting must separately identify allocation effect, gross-exposure effect, turnover/cost effect, and missed-opportunity effect.

Reuse existing D18-01 observable-regime receipt identity, D18-08 preregistration/cost identity, D18-10 same-date common-support semantics, D18-13 outcome join, and D18-14 chronological maturity/purge semantics. Do not create a second regime clock or walk-forward splitter.

## First-generation contract

Use only one PIT-safe regime dimension, a frozen small strategy set, and a tiny preregistered finite set of weight vectors. No continuous optimization. UNKNOWN or incomplete common support remains DATA_UNKNOWN and is never converted to neutral or zero weight.

Before outcomes mature, the immutable decision receipt must bind market date, decision timestamp, next effective session, strategy ids/versions, upstream receipt hashes, regime vector hash, preregistered policy/version/parameter hash, previous/static/challenger weights, gross exposure, expected turnover, frozen cost hash, common-support state, createdAt and receipt hash. Mature outcomes must not be embedded in the decision receipt.

## Mandatory controls

Compare against a frozen static-weight baseline and a non-regime control with matched gross exposure. Add a turnover-matched non-regime control when feasible. All arms use identical strategy versions, candidate population, execution assumptions, capital convention and costs.

A drawdown reduction caused only by lower average exposure is not regime-allocation alpha.

## Fail-closed acceptance tests

Require deterministic replay; reject post-decision registration; preserve UNKNOWN; reject date/clock/hash/strategy-version mismatch; require previous-weight identity; require pre-decision identical cost contract; forbid matured outcome fields; fail closed on incomplete common support; forbid implicit renormalization of missing strategies unless separately preregistered.

Synthetic fixtures validate invariants only. L3 requires real Taiwan PIT upstream receipts and executable replay.

## Statistical falsification

Inference uses independent official decision dates and regime episodes, not stock rows. Report episode count, transitions, UNKNOWN dates, policy-active dates, turnover events and exposure occupancy.

Reject or weaken the policy claim if matched-exposure or cost controls remove the advantage, one episode dominates, nearby preregistered discrete weights reverse the result, common-support missingness is regime-dependent, static/equal weights win OOS, prospective Shadow diverges from replay, or the effect is redundant with existing trend/volatility/breadth/rotation/stock signals.

Historical replay is mechanism evidence only and is never Prospective Shadow.

## Decision

D18-09 remains L2/40. FORMAL_OPTIMIZATION_CANDIDATE: NONE.

Exact next continuation: build or verify a research-only deterministic discrete-weight receipt validator against current-main D18-01/D18-08/D18-10 identities and the fail-closed tests above. Do not search returns or optimal weights. If real Taiwan PIT upstream receipts are unavailable, record DATA_BLOCKED and move to the next executable D16/D18 module.
