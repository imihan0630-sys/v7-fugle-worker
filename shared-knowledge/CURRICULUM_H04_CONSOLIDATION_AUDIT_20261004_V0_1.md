# H04 Consolidation Audit 2026-10-04 V0.1

Status: OWNER_APPROVAL_REQUIRED
Audit base main: `e602ced99219f2684fca342109d91b2267859e91`
Cluster: H04 — D12-14 vs D12-15
Formal Core impact: NONE

## Accepted specialist-equivalent evidence

Room09:
- `DERIVATIVES_VOLATILITY_RESEARCH.md`
- `DERIVATIVES_VOLATILITY_CHECKPOINT.md`
- `research/d12_13_16_greeks_vrp_surface_semantics_spec_v0_1.json`

This evidence satisfies the H04 acceptance contract without requiring a duplicate H04-specific narrative.

## Semantic decomposition

### D12-14 — measurement/proxy family
Owns operational observable constructions:
- IV minus trailing realized volatility/variance;
- implied variance minus a frozen past-only physical-variance forecast;
- ex-post implied minus future realized variance as an outcome/realization measure;
- horizon/unit/estimator alignment guards.

D12-14 does not define an independent economic premium beyond the structural VRP concept.

### D12-15 — economic target family
Owns:
- structural VRP = risk-neutral expected future variance minus physical expected future variance under the project sign convention;
- live forecast-based VRP proxies;
- ex-post realized premium measurement;
- economic interpretation, horizon sensitivity, model-free vs model-based measurement and falsification.

## Same-parent audit

PASS.

D12-14 and D12-15 consume the same underlying information family:
- option-implied variance / IV;
- physical-variance forecast or realized-variance estimator;
- horizon/DTE;
- quote/surface quality;
- rate/dividend/forward convention;
- estimator/model version.

The difference is measurement role, not a second primitive event.

## Divergent-state audit

The apparent divergent states remain representable as child metrics under D12-15:
- IV high vs trailing RV low;
- IV close to trailing RV while physical forecast differs;
- live forecast-based spread positive while later ex-post realization differs;
- structural VRP uncertain because physical expectation model is weak while descriptive IV-minus-trailing state is still observable.

These do not require a separate curriculum owner; they require explicit child labels and provenance.

## Anti-double-count

1. one implied-volatility parent receipt;
2. one physical-variance/realized-variance parent receipt per estimator/horizon;
3. D12-14 child metrics cannot vote independently from D12-15 VRP if derived from the same parents;
4. ex-post future realized variance is outcome, never live input;
5. variance and volatility units must never be mixed;
6. VIX/IV level and D04 realized-volatility state remain separate upstream comparators.

Result:
`PASS_PROXY_AS_CHILD_METRIC_NO_SECOND_VOTE`.

## Anti-orphan audit

PASS if D12-14 is retired only after all child capabilities are preserved under D12-15:
- trailing IV-RV state;
- forecast-based implied-minus-physical variance;
- ex-post realized premium;
- unit/horizon/estimator lineage;
- look-ahead firewall;
- simple proxy baseline used to falsify more complex VRP/surface claims.

No capability needs a standalone D12-14 ID.

## Proposed canonical survivor

Rename D12-15 to:

**Volatility Risk Premium／IV-RV Proxies 波動率風險溢酬與 IV-RV 代理**

Proposed child scopes:
- structural expected VRP;
- forecast-based live VRP proxy;
- trailing IV-RV descriptive state;
- ex-post realized premium outcome measure;
- horizon/unit/estimator/model-quality guards.

Retire D12-14 as a standalone module ID only after explicit owner approval.

## Maturity firewall

Current:
- D12-14 = L2/40%.
- D12-15 = L2/40%.

If approved:
- D12-15 expanded umbrella does **not** automatically inherit extra maturity from D12-14;
- both currently have the same L2/40 evidence tier, but merged maturity must remain L2/40 until Taiwan PIT/source evidence satisfies L3;
- aggregate maturity must be recomputed under the reduced denominator, with no claim that knowledge itself improved.

## Terminal governance recommendation

`MERGE_ELIGIBLE / D12_15_SURVIVOR / D12_14_CHILD_PROXY_FAMILY`

Current state:
`OWNER_APPROVAL_REQUIRED`.

Approval would authorize:
- retirement of D12-14 standalone ID;
- rename/expand D12-15;
- migrate D12-14 evidence/status/next-step text as child scope;
- update Tracker / Learning Map / Router / Shared Master / registries atomically;
- preserve Formal Core and runtime unchanged.
