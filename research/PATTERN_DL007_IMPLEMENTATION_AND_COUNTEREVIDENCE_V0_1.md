# D01 DL-007 — Implementation-level nested graph / breakout-path falsification

Updated: 2026-10-01 Asia/Taipei  
Status: CLASS_A_RESEARCH_ONLY / OUTCOME_BLIND / FORMAL_CORE_LOCKED

## Why this tranche exists

The main branch already contained contract fixtures and receipts for the DL-006 continuation:
- pattern_nested_graph_fixtures_v0_1.json + validation receipt: 10/10 contract cases PASS;
- pattern_breakout_path_fixtures_v0_1.json + validation receipt: 12/12 contract cases PASS.

Those receipts were contract-level checks. They did not prove that an executable implementation satisfies every invariant. This tranche closes part of that gap without wiring runtime, reading forward returns, fabricating Shadow rows, or changing Formal behavior.

## DL-007A — Nested graph implementation falsification

New v0.2 implementation and executable tests:
- research/pattern_nested_graph_v0_2.mjs
- research/test_pattern_nested_graph_v0_2.mjs

Executable results: 12/12 PASS.

Important implementation gaps found relative to the earlier v0.1 validator:
1. missing confirmedAt needed an explicit UNKNOWN state rather than silent omission;
2. semanticSpaceId as well as semanticSpaceVersion must participate in compatibility;
3. a partial weekly object must not become a confirmed higher-timeframe parent merely because its timestamp is visible;
4. same boundaryId + same boundaryVersion with mutated coordinates must be a provenance conflict;
5. different boundary versions must remain different trigger/lifecycle identities;
6. pairwise overlap must not create transitive equivalence;
7. future parent confirmation may append ancestry but must not mutate prior child pivotAt/confirmedAt.

Interpretation: this strengthens replay/provenance correctness only. It is not evidence that nested multi-timeframe agreement predicts returns.

## DL-007B — Continuous breakout-path executable descriptors

New pure research implementation and tests:
- research/pattern_breakout_path_v0_1.mjs
- research/test_pattern_breakout_path_v0_1.mjs

Executable results: 14/14 PASS.

The implementation preserves:
- eligible / observable / constrained clocks separately;
- break-bar-inclusive and post-break-only favorable extension separately;
- immutable firstReentryAt / firstFailureAt / firstReclaimAt;
- future unavailable states as null, never zero;
- boundary-version reset and same-version coordinate-mutation firewall;
- TECHNICAL_CONTINUITY and symbol-session provenance fail-closed;
- constrained-price-limit sessions as UNRESOLVED rather than ordinary acceptance/failure;
- no fixed 3D/5D false-break threshold;
- UP/DOWN mirror invariance.

### A useful failed test

The first normalization attempt used the upper boundary price as the UP denominator and the lower boundary price as the DOWN denominator. A mirrored synthetic path then failed exact UP/DOWN invariance because the denominators differed mechanically.

The implementation was corrected to use the boundary midpoint as the common scale denominator. The mirror test then passed.

Research implication: even apparently harmless normalization choices can create artificial directional asymmetry. Any future empirical Pattern feature should test sign/mirror invariance before outcomes are opened.

## DL-007C — New Taiwan evidence: positive mechanism and counterevidence

### 1. 2026 Taiwan head-and-shoulders evidence

Chen et al., Pacific-Basin Finance Journal, available online 2026-09-21, DOI 10.1016/j.pacfin.2026.103390.

Useful evidence:
- mechanically detected HS bottom patterns had stronger and more persistent directional information than HS tops;
- stricter Bry-Boschan turning-point alignment improved average event-level results;
- price extremeness mattered;
- the authors report multiple-testing diagnostics and transaction-cost sensitivity.

Critical caveats:
- their data run through 2018-03-02, before Taiwan's 2020 continuous-trading regime;
- results are asymmetric across top/bottom rather than a universal named-pattern sign;
- the authors explicitly frame results as event-level mechanism-consistent evidence, not a fully risk-adjusted calendar-time portfolio alpha claim;
- decision-rule choices materially affect performance.

D01 implication:
named labels remain metadata. Prior trend, price extremeness, turning-point confirmation and lifecycle definition are candidate controls; the paper does not justify an HS score or Formal rule.

### 2. 2025 Taiwan historical-high breakout evidence

Lee & Chou, Pacific-Basin Finance Journal 93, article 102853, DOI 10.1016/j.pacfin.2025.102853.

Useful evidence:
- crossing historical highs can move Taiwan stocks into a positive underreaction/momentum state rather than acting as a hard resistance veto;
- effect heterogeneity appears by size, turnover and seasonality.

Critical caveats:
- sample spans 1983-2022 and therefore mixes multiple market-structure regimes;
- historical-high breakout is not equivalent to every local neckline/platform breakout;
- size/turnover/seasonality heterogeneity warns against one unconditional sign.

D01 implication:
major resistance should be represented as lifecycle/context, not an automatic rejection rule.

### 3. Candlestick evidence remains mixed and regime-sensitive

Lu (2014), Pacific-Basin Finance Journal 26, DOI 10.1016/j.pacfin.2013.10.006, found only a subset of one-day candlestick patterns profitable in Taiwan after costs and robustness checks, using 1992-2009 data.

Counterevidence:
Chen, Huang & Lai (2009), Journal of Asian Economics 20(5), DOI 10.1016/j.asieco.2009.07.008, applied White Reality Check / Hansen SPA plus non-synchronous-trading and cost adjustments across eight Asian markets including Taiwan; their overall conclusion was that economic profits from the large technical-rule universe were extremely unlikely after these corrections.

D01 implication:
do not translate old candlestick names into unconditional bullish/bearish priors. Multiple-testing and transaction-cost controls remain mandatory.

## Redundancy / competing explanations

Future empirical work must test Pattern geometry incrementally against:
- momentum / prior return;
- close location;
- volatility / ATR / range compression;
- price-volume acceptance and persistence owned by D02;
- round-number/tick proximity;
- liquidity / microstructure constraints;
- current Formal priorHigh20/priorHigh60/MA60/lateStage/maxChase controls;
- market/sector regime.

Multi-timeframe agreement can still be duplicate information if weekly and daily objects are deterministic aggregations of the same PRICE_OHLC root. Cross-scale agreement is therefore a topology relation, not an automatic independent vote.

## Governance decision

D01 maturity remains 51.7%.
No forward Pattern outcomes were inspected.
No historical Pattern Shadow rows were fabricated.
Pattern runtime remains NO_GO.
FORMAL_OPTIMIZATION_CANDIDATE = NONE.
Formal Core remains LOCKED.

## Exact next continuation

1. Execute the v0.2 nested-graph and v0.1 breakout-path tests in repository CI or an equivalent reproducible Node environment and preserve the run receipt.
2. Add explicit boundary-mutation and clock-schema machine-readable receipts only if they remain outcome-blind and research-only.
3. Deepen D01-10 multi-scale falsification: compare topology information that is genuinely new across scales versus deterministic aggregation/redundancy.
4. Deepen D01-05 breakout context using the 2025 historical-high paper as a mechanism hypothesis, but pre-register local-vs-major breakout definitions before outcomes.
5. Treat the 2026 HS paper as a modern publication but pre-2020-data mechanism source; do not use its effect size as current-regime evidence.
6. Prospective outcome joins remain blocked until COMPLETE immutable Pattern parent/run receipts and runtime semantic readiness exist.
7. No R09 / no Formal optimization proposal before PIT, prospective/OOS, redundancy, regime, cost and multiple-testing gates pass.
