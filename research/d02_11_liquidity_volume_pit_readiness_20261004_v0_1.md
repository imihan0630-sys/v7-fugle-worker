# D02-11 Liquidity Volume Thresholds / Exceptions PIT Readiness V0.1

Updated: 2026-10-04 Asia/Taipei
Status: PRE_PVE_240 / OUTCOME_BLIND / PIT_READINESS_PASS
Module: D02-11 流動性量能門檻與例外
Formal Core: LOCKED / unchanged
Evidence cursor: PVE-239

## Scope

D02-11 studies whether a volume/liquidity state is interpretable and executable.
It does not optimize the current Formal threshold.

Separate:
A. LONG_HORIZON_VOLUME_CAPACITY
B. CURRENT_EXECUTION_LIQUIDITY_CONTEXT
C. FORMAL_ADMISSION_RULE_REFERENCE

Do not collapse them into one liquidity boolean.

## A. Long-horizon volume capacity

Current source-readiness audit confirms PIT-feasible fields:
- close;
- avgVolume20Lots derived from admitted daily history;
- avgAmount20 derived from admitted daily value history;
- deterministic price-tier minLots.

Current Formal reference thresholds are recorded for falsification only:
- close < NT$1,000 -> minLots 1,000;
- close >= NT$1,000 -> minLots 300.

No alternative threshold is searched in this L3 work.

## B. Current execution-liquidity context

Research can prospectively observe:
- bid/ask prices;
- spread;
- top-five displayed depth;
- quote timestamp / sourceFetchedAt.

These are current-state execution-context fields, not substitutes for 20-day volume capacity.

Missing spread/depth input => UNKNOWN, not good liquidity.

## C. Formal admission rule reference

Existing Formal low-volume exception additionally references:
- avgAmount20;
- spreadPercent;
- orderBookDepthGood or depthScore.

Repository audit does not prove complete production assignment/coverage for those exact Formal field names.

Therefore:
- D02 research must NOT treat exact Formal exception coverage as proven;
- research-specific quote/depth fields must not be mislabeled as exact Formal parity;
- exact Formal exception state is UNKNOWN when its own evidence is absent.

The current PV helper `pvIlliquidityWarning` is explicitly rejected as research truth because:
- it uses reversed thousand/general volume thresholds relative to Formal;
- it expects liquidityException as Boolean although Formal semantics are not that contract;
- missing avgVolume20Lots returns false rather than UNKNOWN.

D02-11 must consume the canonical liquidity field-readiness contract instead.

## PIT clock

Long-horizon capacity:
known after the last required eligible daily history inputs are available for the selection timestamp.

Current quote/depth:
known no earlier than quoteUpdatedAt/sourceFetchedAt.

A combined liquidity observation firstKnownAt is the maximum of all required component clocks.

## Falsification boundaries

1. Low average volume is not automatically untradeable if amount/spread/depth are acceptable.
2. High average volume is not automatically cheap to execute; spread/depth can still be poor.
3. A one-time deep book does not prove stable depth or replenishment.
4. Missing depth is UNKNOWN, not bad or good.
5. Threshold effectiveness cannot be inferred from admitted names only because primary low-volume rejects have a known Shadow selection hole.
6. Future threshold evaluation must use reason-stratified rejected controls and costs; no 800/700/500-lot sweep after outcomes.
7. A liquidity gate can protect execution even if rejected stocks later outperform before costs; alpha and executability are separate questions.

## Maturity decision

L3 criterion is Taiwan PIT data and time-semantic feasibility.

D02-11 now has:
- source-ready 20-day volume/amount capacity fields;
- deterministic threshold-reference semantics;
- prospective current spread/depth source path;
- explicit knownAt and missingness rules;
- a firewall against the known PV illiquidity-helper defect;
- fixed no-threshold-sweep falsification design.

Decision:
D02-11 L2/40 -> L3/60.

Not implied:
- current Formal threshold is optimal;
- exception production coverage is complete;
- rejected-control outcome evidence exists;
- L4/L5 is reached.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
