# SDA-009 R3 Capture / Counterfactual Contract V0.5

Status: CAPTURE_PATH_MINIMIZED / COUNTERFACTUAL_TYPES_SEPARATED / UNCLASSIFIED_BUCKET_FIREWALL_FROZEN / FORMAL_CORE_UNCHANGED

Owner: 07｜產業與供應鏈研究室
Audit ticket: `SDA-009`
Date: 2026-10-07 Asia/Taipei

## 1. R3A1 implementation feasibility is now code-path verified

The current C1 builder receives:
- `featureRows`;
- full `todayRows`;
- `marketState`;
- already-computed production `sectorStats`;
- actual `formalResults`;
- actual selected set;
- scan date.

Inside the existing C1 row map, the exact normalized current-session `raw` row is still in scope.

Therefore the required row atoms:
- `currentChangePercent = raw.changePercent`;
- `currentTradeValue = raw.tradeValue`;

can be captured directly.

No new provider call is required.
No new production sector calculator is required.
No Formal gate/rank/allocation change is required.

Engineering principle:
`CAPTURE_DONT_RECOMPUTE_IN_FORMAL_PATH`.

## 2. Production sector state should be captured, not independently rebuilt in the decision path

The existing C1 builder already receives the exact `sectorStats` object that was consumed by `scoreCandidate`.

R3A1 should create a compact generation-level production projection directly from that object.

Frozen fields per industry:
- industry;
- stockCount;
- historicalCoverage;
- amount;
- breadth;
- avgChange;
- amountVs20DayAverage;
- score.

Persist:
- `sectorDecisionStateVersion`;
- `sectorDecisionStateProjection`;
- `sectorDecisionStateDigest`.

The projection is recommended in addition to the digest because it makes a parity mismatch diagnosable without reconstructing hidden production state.

The digest remains the immutable comparison key.

## 3. Membership identity refined

V0.3/V0.4 used symbol + industry as the conceptual mapping.

V0.5 refines the projection to:
- market;
- symbol;
- industry.

Reason:
a market migration or cross-market identity change should alter the runtime membership fingerprint even when the visible symbol and industry label remain unchanged.

Recommended:
- `classificationSchemeId = SYSTEM1_RUNTIME_INDUSTRY_LABEL_V1`;
- membership projection sorted by market, symbol, industry;
- `membershipDigest` over the canonical projection;
- `membershipVersion = SDA009_RUNTIME_INDUSTRY_MEMBERSHIP_V0_1:<digest>`.

This proves the exact runtime grouping only.
It does not claim official historical exchange taxonomy.

## 4. Unclassified pseudo-sector firewall

Production sector grouping falls back to `未分類` when the industry label is absent.

Multiple unrelated firms can therefore share the same pseudo-bucket.

For SDA-009:
- the mechanical self-contribution of this bucket may still be measured;
- the bucket must be labeled `UNCLASSIFIED_PSEUDO_BUCKET`;
- industry-economic interpretation is forbidden;
- D16 must not pool it with genuinely classified industries for alpha/incrementality claims;
- missing classification must remain visible in denominator accounting.

This is a research/evidence firewall only and does not alter Formal behavior.

## 5. V8.14 bounded sector-gate rejected sample is not the SDA-009 denominator

V8.14 contains a useful `SECTOR_GATE_REJECTED` Shadow sample.

It is intentionally bounded per pool and intended for diagnostics.

It must not be used to estimate:
- gate-flip incidence;
- self-promotion frequency;
- self-suppression frequency;
- rank/seat impact frequency.

SDA-009 denominator remains the full immutable same-generation C1 parent with P0-P5 accounting.

## 6. Two counterfactuals are now formally separated

### A. FOCAL_SELF_ATTRIBUTION

Policy id:
`SDA009_FOCAL_SELF_ATTRIBUTION_V0_1`.

Semantics:
- focal candidate uses its own LOO sector state;
- peer candidates retain their production values.

Question answered:
How much did the focal candidate's own contribution mechanically change its gate/score/rank position, holding peers fixed?

This is an attribution diagnostic.
It is not a complete de-circularized selection policy.

### B. FULL_SELF_EXCLUDED_POLICY

Policy id:
`SDA009_FULL_SELF_EXCLUDED_POLICY_V0_1`.

Semantics:
- every candidate receives its own candidate-specific LOO sector state;
- each candidate's cross-sector max-amount normalizer is recomputed under that candidate's own exclusion;
- the resulting candidate-specific scores are compared only because this candidate-specific normalization is explicitly part of the policy definition.

Question answered:
What would the 3+3 selection look like if industry state were systematically self-excluded for every candidate?

This is a policy-sensitivity counterfactual.
It must remain Shadow/research-only unless separately approved.

These two outputs must never share one unlabeled rankDelta or seatFlip field.

## 7. Self-suppression ranking still needs one small additional input

For currently qualified candidates, V8.17 C1 already captures the actual post-consensus ranking tuple.

For a candidate rejected at the sector gate, no actual post-consensus ranking tuple exists because `applyMarketConsensus` returns early for rejected results.

If LOO changes that candidate from sector FAIL to PASS, an exact counterfactual final priority score requires its market-consensus input.

Minimum R3A2 addition:
- `marketConsensusSources` OR exact `marketConsensusBonus` for every feature-admitted row.

The current selector already has the same-scan consensus reference in scope.
No new provider call is required.

Until that field exists:
- self-suppression gate recovery may be proven;
- downstream non-sector eligibility may be evaluated from frozen C1 derivations where complete;
- exact counterfactual pool rank/seat for resurrected candidates remains UNKNOWN.

## 8. Gate reachability classifier

`basePassed=true` remains forbidden as a substitute for sector-gate reach.

V0.5 freezes a versioned research classifier over actual first-failure semantics:
- pre-sector failure => NOT_REACHED;
- exact sector-gate failure => REACHED_AND_FAILED_SECTOR;
- later failure => REACHED_AND_FAILED_LATER;
- Formal success => REACHED_AND_PASSED;
- unknown new reason => UNKNOWN.

Unknown reasons fail closed and force classifier-version review.

Artifact:
`research/sda009_r3_capture_contract_v0_5.mjs`.

## 9. Deterministic validation

Artifact:
`research/test_sda009_r3_capture_contract_v0_5.mjs`.

Isolated local validation:
PASS / 12 assertions.

Coverage includes:
- sector reach success/failure/later/pre-gate/unknown;
- unclassified pseudo-bucket;
- membership digest order invariance;
- industry change alters membership digest;
- sector score change alters sector-state digest;
- focal-attribution and full-LOO policy identities remain distinct.

This is semantics/capture-contract evidence only.
It is not a genuine Taiwan SDA-009 receipt.

## 10. R3A1 minimum delta after V0.5

Per C1 row:
- `currentChangePercent`;
- `currentTradeValue`.

Per generation:
- `classificationSchemeId`;
- `membershipVersion`;
- `membershipDigest`;
- `sectorDecisionStateVersion`;
- `sectorDecisionStateProjection`;
- `sectorDecisionStateDigest`.

No new provider calls.

R3A2 additional rank-completion field:
- `marketConsensusSources` or exact `marketConsensusBonus` for all feature-admitted rows.

## 11. Acceptance order

1. verify C1 parent completeness / binding;
2. verify membership digest;
3. verify production sector-state digest/projection;
4. reconstruct inclusive gate values from C1 row atoms;
5. require gate parity PASS;
6. reconstruct inclusive sector scores;
7. require score parity PASS;
8. run candidate LOO;
9. produce focal-attribution output;
10. only when all ranking inputs exist, run full self-excluded 3+3 policy counterfactual;
11. only when selected union is identifiable, run allocation decomposition;
12. send genuine receipt to D16.

A failure at any layer blocks only the higher layers.
It does not erase valid lower-layer evidence.

## Maturity

D09 remains 57.1%.

Genuine candidate-level Taiwan receipt count remains zero.
No D16 economic evidence exists.
No Formal change is authorized.

## Exact next

`SDA-009-R3A1`:
System1 implements the six-field generation capture plus the two row atoms, with zero provider calls and protected-output parity.

`SDA-009-R3A1-PARITY`:
first built-runtime receipt must prove membership, sector-state, gate and score parity.

`SDA-009-R3A2`:
add same-generation consensus input for all feature-admitted rows, then emit focal-attribution and full-self-excluded-policy receipts without changing Formal.

`SDA-009-R3B`:
Room07 consumes the first genuine receipt and freezes P0-P5 common-support results before D16 validation.
