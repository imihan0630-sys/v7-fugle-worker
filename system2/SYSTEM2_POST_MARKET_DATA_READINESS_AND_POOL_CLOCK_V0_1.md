# System 2 — Post-market Source Readiness and Next-session Pool Clock V0.1

Updated: 2026-10-09 Asia/Taipei
Status: OWNER_APPROVED_POLICY / ENGINEERING_NOT_DEPLOYED
Owner decision: use 19:00 as preliminary review, 23:45 as the preferred final-freeze **attempt**, and 00:15 as conditional same-trading-date source recovery.
Scope: SYSTEM2_ONLY; S2-02, S2-07, S2-08, S2-09, S2-10 and bounded S2-11 monitor integration.
System 1 / V8 Formal Core and production runtime impact: NONE.
Live strategy selection / capture / notification / capital / order authority: NOT GRANTED.

## 1. Decision and distinction from existing deployment

The owner accepts a two-stage after-market data-readiness design to avoid finalizing System 2's next-session candidates against an incomplete 19:00 source set.

**This is an approved future-facing contract, NOT evidence that the current Worker schedule has been changed.** The existing System 2 Worker currently performs its bounded read of already-frozen `s2_capacity_runs` at 19:00. The current `SYSTEM2_CAPTURE_ENABLED=false` and existing absence-of-capacity fail-closed behavior remain unchanged until a separate implementation/deployment, regression and physical-readback acceptance.

No change to System 1's 23:35/23:55 formal schedule, any V8 A/B/Top6/3+3 logic, its Formal Core, monitoring, pushes, capital, or live Worker is permitted.

## 2. Target clock (all Asia/Taipei, session date T)

| Clock | Target role | Authority |
| --- | --- | --- |
| 19:00 on trading date T | PRELIMINARY_SOURCE_REVIEW: inspect sources already known by 19:00; optionally compute preliminary research diagnostics | No final pool/capacity issuance or newly-authorized push; missing late inputs stay UNKNOWN |
| 23:45 on T | FINAL_FREEZE_ATTEMPT: re-fetch/reconcile mandatory source families per preregistered strategy and propose a frozen capacity receipt only if complete and PIT-qualified | Final candidate/next-session monitor eligibility only after independent source/strategy/capacity/immutability gates |
| 00:15 on calendar date T+1 | CONDITIONAL_RECOVERY_CHECK for still-incomplete date T; explicitly pass T instead of recomputing "today" | Cannot invent earlier availability or retroactively mutate/relabel an earlier frozen decision; eligible only under the same authoritative gates |

These clocks are operating targets, **not verified API availability guarantees**, and do not authorize blind scheduled rewrites. The 00:15 recovery is conditional; weekends/holidays and cross-midnight spans must retain the same explicit target trading date T and resolve the *next official eligible session* from the validated trading calendar. Delayed scheduler invocation is not proof that a cutoff was met.

## 3. Source-specific timing and access

- Fugle historical OHLCV has documented after-market availability around/before 16:30 for its documented product family. This neither certifies TWSE/TPEx current OpenAPI response freshness nor proves all auxiliary data is complete at 16:30.
- Daily third-party/institutional/margin/SBL/borrow/short-sale, issuer events, sector/fundamental and optional global/Regime inputs have distinct source clocks, source dates and entitlements. Some official product metadata refers to approximately 19:40 / 21:00 / 22:00 / 23:30 production windows. A produced file time is not proof that an available free API returned that exact vintage before 23:45.
- Existing physical observations prove that a current TWSE/TPEx HTTP-200 response can still be **stale**, and the exact-date historical official endpoints can have a different freshness path. 19:00 and 23:45 must validate actual payloads, not rely on clock or HTTP status alone.
- **No subscription/purchase, credential, paid source or increased Cloudflare plan is authorized by this policy.** A product not available on an authorized source remains UNKNOWN; never silently use a paid-only product, treat a nearby proxy as identical, or impose the missing optional source as a universal requirement.
- Data readiness is strategy-stage and preregistered: REQUIRED inputs must be present, timely and qualified for that strategy; OPTIONAL evidence stays UNKNOWN when missing and cannot be a manufactured zero, PASS or up/down signal. A strategy legitimately requiring an unavailable input is blocked; unrelated strategies with complete required sources may remain independently eligible.
- Future external confirmation of exact publication/available times must be preserved as first-observed evidence, never inferred from a documentation clock. Maintain positive and negative observations.

## 4. Mandatory final-freeze gate

Before a trading-date-T FINAL_FROZEN capacity can be built, record and independently validate:

1. Official TWSE/TPEx trading-date T and next eligible trading session; no calendar-date shortcut, wrong-date roll, stale current API, or previous-session substitution.
2. For each contributing source: source/product/endpoint identifier, provider-reported market date, actual response-completed/captured timestamp, source availability provenance or observed upper bound, original hash/etag/last-modified where available, source vintage and retrievability status.
3. PIT consistency at the actual prospective decision clock: no source dated after T or actually first observed after the declared freeze time may be backdated into it; `capturedAt` is not magically `availableAt`.
4. TWSE and TPEx source completeness, listing/trading/universe and sample coverage per the preregistered strategy-source contract; HTTP 200 or nonempty rows alone do not constitute complete denominator coverage.
5. Continuity, corporate actions/adjustment-space, valid bars, Regime PIT, factor readiness and authorized strategy assessor/version. Unknown corporate-action or missing requisite history is not equivalent to verified continuity.
6. Ranking, overlaps, capacity limits and contributing Shadow-run/hash/denominator provenance verified; no forced pick, fabricated zero-pick, stale capacity recycling or cross-strategy denominator laundering.
7. An immutable receipt with `targetMarketDate`, `candidateForSessionDate`, `observationClock`, `freezeTimestamp`, `phase`, `status`, strategy/source versions, original-source hashes, rejected-source reasons, source readiness ledger, and full `s2_capacity_runs` lineage, with exact D1 readback and idempotent duplicate behavior.

The 19:00 preliminary output and 23:45 final attempt are different **versioned observations**. An earlier PRELIMINARY record must never be silently overwritten or relabeled as FINAL_FROZEN. Any later 00:15 accepted recovery produces an appropriately timestamped/append-only later observation or new immutable generation, preserving all earlier facts and determining next-session eligibility from actual first-known time; no history rewrite or retroactive promotion. Conflicting repeats fail closed.

If any REQUIRED source, PIT contract, capacity lineage or physical-readback gate fails, persist `BLOCKED_REQUIRED_SOURCE` / `NOT_READY` with exact blocker list and continue diagnostics only. Never publish an invented final candidate pool or reinterpret incomplete data as zero selected. A truly legitimate zero-pick is possible only after a fully qualified, actually executed preregistered assessor/capacity pipeline.

## 5. Release and schedule change boundary

Implementation owner: BUILD_LANE for isolated System 2 selection/orchestration, capacity, Worker and read APIs. Source coverage and PIT receipts are DATA_LANE-owned; cross-writer D1 budget protection is REMEDIATION_LANE-owned; independent acceptance is AUDIT_LANE/00 as applicable.

Required separate engineering before moving `FINAL_FREEZE_ATTEMPT` into production:
- implement distinct preliminary/final/recovery clocks with the existing Free-plan single-Worker constraints assessed; do not invent new Cron slots;
- verify mandatory per-strategy provider-vintage and source-date receipts for 19:00, 23:45 and conditional 00:15 on real ordinary trading dates, including failure cases;
- add negative tests for stale HTTP-200, missing source, late post-freeze arrival, future-data leakage, non-trading day, midnight rollover, delayed scheduler, duplicate/conflicting frozen receipt, actual source-coverage gaps, paid/unavailable source, partial coverage and D1 quota exhaustion;
- CI: System2 Research + V8 regression + isolated production-integrity guard, then observed D1 write/readback, pool audit and next-session bounded monitoring under owner-authorized shadow authority;
- preserve System 1's four Crons, Formal Core/runtime, and all real capital/order/push gates; do not activate System 2 general capture or final selection through a docs-only change.

The clock policy may be reevaluated against first-observation receipts; moving target times or widening admissible sources later requires a versioned contract and evidence, not a silent change.

## 6. Current deployment truth and acceptance

- `19:00`: deployed bounded pool refresh reads already-frozen capacity; it is **not** proof of complete daily data and is **not** an authorized new final-pick pipeline.
- `23:45`: owner-approved **target**, not deployed as final capacity freeze.
- `00:15`: owner-approved conditional recovery **target**, not deployed.
- No eligible new System 2 final picks, live pushes, broker orders or System 1 changes are implied by policy approval.

Reference records:
- `system2/SYSTEM2_DAILY_RESONANCE_GLOBAL_INTEGRATION_V0_1.md`
- `system2/SYSTEM2_DAILY_SHADOW_DIAGNOSTIC_V0_1.md`
- `research/technical_indicator_fixed_cadence_observations_20260930.json`
- `research/d06_ic038_leverage_shorting_semantic_clock_matrix_v0_1.md`
- `system2/SYSTEM2_BUILD_PROGRESS_MAP.md`
