# System 2 Stage-1 Assessor Policy Freeze V0.1

Updated: 2026-10-07 Asia/Taipei  
Status: OWNER-DIRECTIVE P0 / LAUNCH POLICY FROZEN / SHADOW EVALUATION ONLY  
System 1 Formal Core: LOCKED

## Authority

This policy implements P0-A of:

`shared-knowledge/SYSTEM2_GO_LIVE_PRIORITY_DIRECTIVE_20261007_V0_1.md`.

It does not replace the existing strategy identities:
- SHORT_MOMENTUM / V0.1-CONTRACT;
- SWING_GROWTH / V0.1-CONTRACT.

Instead, it adds a separately versioned assessor-policy layer that maps already-authorized evidence families into family states and EntryReadiness.

## Non-negotiable boundary

The launch policy does not:
- create a universal cross-strategy score;
- introduce fitted weights;
- use outcome-tuned thresholds;
- copy System1 A/B, Top6, rank or candidate source;
- impute missing industry or fundamental evidence;
- enable final selection, live push, capital or orders.

UNKNOWN required evidence remains UNKNOWN and blocks that strategy evaluation.

## SHORT_MOMENTUM

Policy:
- `S2-ASSESSOR-SM-LAUNCH-001 / 0.1-LAUNCH`.

Launch evidence:
- TECHNICAL_STRUCTURE;
- PRICE_VOLUME;
- RISK_FRICTION.

Only natural relational references are used:
- moving-average ordering and slope sign;
- return sign around zero;
- price relative to prior 20-session high/low and MA20;
- relative volume versus its own 20-session average, where 1.0 means equal to that baseline;
- positive/non-positive source liquidity base.

No optimized extension cutoff is introduced.

Initial launch mapping:
- supportive technical structure requires positive short-horizon trend relationships;
- breakout price-volume support requires acceptance at/above the prior 20-session high, current volume at/above its own prior 20-session average, and positive 20-session return;
- failed-breakout / broken-active-structure / severe-illiquidity conditions remain hard invalidations where source-honest evidence exists;
- BUY_ELIGIBLE requires all launch-required families KNOWN, technical and price-volume support, non-adverse risk friction, and no hard invalidation;
- technical support without source-honest breakout acceptance is ACTIVE_ENTRY_MONITOR;
- otherwise WATCH.

This first launch assessor operationalizes the BREAKOUT_CONTINUATION path. It does not pretend the full pullback/reacceleration setup is already source-complete.

## SWING_GROWTH

Policy:
- `S2-ASSESSOR-SG-LAUNCH-001 / 0.1-LAUNCH`.

Required thesis families remain:
- INDUSTRY_THESIS;
- FUNDAMENTAL_QUALITY.

These must arrive as PIT-valid upstream family assessments. Daily A1 technical or price-volume evidence may time an already-known growth thesis, but may never manufacture the growth thesis.

Therefore:
- missing industry or fundamental assessment => INCOMPLETE / BLOCKED through the generic strategy evaluator;
- both required families supportive + source-honest A1 technical/price-volume timing may reach BUY_ELIGIBLE;
- A1 timing alone cannot make SWING_GROWTH valid.

## Versioning

The assessor policy has its own identity because changing raw-to-family or family-to-readiness semantics changes decisions even when the parent strategy contract is unchanged.

Any future change to:
- required family mapping;
- relational rule;
- hard invalidation;
- readiness mapping;
- numeric threshold;
- System1 dependency;
- scoring or weighting;

requires a new assessor-policy version and a new System2 policy fingerprint.

## Authority after freeze

This policy authorizes only genuine System2 Shadow strategy evaluation.

It does not by itself authorize:
- Candidate Board final cohort;
- `s2_capacity_runs` persistence unless the existing source/history/denominator/capacity gates are also satisfied;
- final selection;
- live notifications;
- capital or orders.

## Exact next

1. verify policy and preflight regressions;
2. generate per-strategy System2 policy fingerprints for SDA-022 S22-T06~T10;
3. run NC-T01 without System1 Top6/rank;
4. wire genuine daily strategy evaluation into the existing ranking/capacity path;
5. produce the first physical immutable `s2_capacity_runs` receipt only when data/denominator gates truthfully permit it.
