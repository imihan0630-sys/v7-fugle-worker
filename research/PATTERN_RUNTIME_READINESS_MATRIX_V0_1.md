# Pattern Runtime Readiness Matrix v0.1

Updated: 2026-09-26 Asia/Taipei
Status: RESEARCH_ONLY / NO_GO_RUNTIME / GO_ISOLATED_QA
Formal Core: LOCKED

## Purpose
Prevent detector progress from being mistaken for production-readiness.

A Pattern detector can be scientifically correct while the data/provenance/runtime path is still unsafe.

## Gate matrix

| Gate | Status | Evidence / blocker |
|---|---|---|
| C1-C8 deterministic adversarial fixtures | PASS | executable isolated tests |
| Prefix invariance | PASS in isolated fixtures | future suffix cannot alter confirmed as-of state |
| Replay exactness | PASS in isolated fixtures | same as-of inputs reproduce snapshot |
| ATR-frozen MICRO/BASE/MAJOR swing chronology | PASS | threshold frozen from prior completed data |
| W lifecycle | PASS isolated | true neckline / undercut / breakout / retest chronology |
| VCP range+volume context | PASS isolated | topology separated from volume/range/prior-trend context |
| Platform lifecycle | PASS isolated | repeated confirmed upper/lower touches required |
| Major-zone lifecycle | PASS isolated | approach / first break / holding / reentry / failure, no hard veto |
| Shadow parent identity/hash | PASS isolated | same natural key + changed hash => provenance conflict |
| Observer episode de-dup | PASS isolated | same structural anchors => same episode |
| 100% attempt-accounting run receipt | PASS isolated | VALID or explicit BLOCKED required for every expected parent |
| Raw traded OHLC research source | MATERIAL_PASS | FCNT000002 preserves raw OHLC on 8454/5314/2412 |
| Raw provider change/refPrice semantics | GUARDED | change/change_rate not raw close-to-close on CA sessions; refPrice not universal |
| TECHNICAL_CONTINUITY research semantics | SPEC/PROTOTYPE READY | Corporate Actions lane defines semantic spaces |
| TECHNICAL_CONTINUITY production/runtime availability | BLOCKED | Corporate Actions continuity engine remains research-side; no approved shared-runtime path |
| Symbol-session suspension provenance | PARTIAL | verified witnesses exist; full prospective runtime completeness not yet established |
| Volume comparability across unit/supply changes | PARTIAL/BLOCKED | raw lots are factual, but denominator spaces and supply-stage handling remain CA-dependent |
| Existing Shadow archive parent completeness | PARTIAL | archive exists; durable research notes known missing/enforcement-date gaps |
| Pattern observer D1 schema/API | DESIGN_READY / NOT_WIRED | persistence contract frozen; shared runtime would be Class B |
| Outcome join completeness | NOT_READY | prospective Pattern rows do not yet exist; execution coverage has independent gaps |
| Pattern alpha / incremental value | UNKNOWN | no Pattern forward outcomes inspected |

## Current decision

### Allowed now
- isolated detector research;
- synthetic/adversarial fixtures;
- offline real-witness QA;
- source-semantic audits;
- documentation and pure research helpers;
- external evidence / falsification work.

### Not allowed now
- Worker.js Pattern persistence wiring;
- new D1 production migration;
- production scheduled Pattern fetch;
- full-universe Pattern scan;
- Pattern score / veto / ranking / BUY / maxChase change;
- outcome inference from fabricated historical Pattern rows.

## Why runtime is NO_GO today

The limiting gate is no longer detector mechanics.

The limiting gate is the production-grade semantic data path:
1. raw OHLC is research-feasible through FCNT000002, but that content path is not yet an approved Worker runtime dependency;
2. TECHNICAL_CONTINUITY / corporate-action adjustment semantics remain research-side;
3. symbol-session and volume-comparability provenance are not yet complete enough for a fail-closed production research collector;
4. prospective Pattern rows therefore cannot be captured safely without a Class-B shared-runtime proposal plus resolved cross-lane dependencies.

## Promotion trigger for a Class-B proposal

Do not ask for runtime approval merely because detector CI is green.

A Pattern observer runtime proposal becomes decision-ready only when:
- an approved point-in-time RAW_EXECUTION source is available to the runtime;
- an approved point-in-time TECHNICAL_CONTINUITY source/transform contract is available to the runtime;
- verified suspension/session completeness is operational;
- unit/supply-change volume semantics can fail closed;
- parent Shadow archive coverage is observable;
- the proposed hook remains after Formal persistence/push and fail-open;
- protected Formal output regression is frozen.

Until then, continue offline research and cross-lane source validation.

## Formal boundary
No Pattern finding or engineering in this matrix changes A/B, ranking, 3+3+3, capital, monitoring, push, entry/add/reduce/sell/stop or Formal Core.


## Update — 2026-09-26 extended Pattern QA

Additional isolated gates now pass on Draft PR #103:
- two-day candlestick relational morphology with OPEN-required / TECHNICAL_CONTINUITY guard;
- confirmed boundary latent geometry for triangle/platform/flag families;
- explicit confirmed-anchor cup/bowl geometry;
- explicit impulse/consolidation geometry;
- continuous repeated-resistance progression;
- cross-family shared-anchor overlap diagnostics.

Latest validated branch head for this update:
`493b2627cbbfcade830ccc097b7d7e46d4e0be8a`

CI:
- V8 Repair run `36205621116`: SUCCESS
- V8 Regression run `36205621129`: SUCCESS

### OPEN readiness clarification

The original live Formal history cache still discards historical OPEN and is therefore insufficient for historical candlestick research.

However, the connected FCNT000002 research source does expose raw OPEN/HIGH/LOW/CLOSE over its supported horizon. Therefore:

- historical OPEN — research source availability: MATERIAL_PASS;
- historical OPEN — current Formal/live cache availability: FAIL/NOT_PRESENT;
- candlestick research — isolated/offline feasibility: PASS with semantic guards;
- candlestick production observer wiring: still NO_GO until runtime source/continuity/session semantics are approved.

Do not solve the cache deficiency by synthesizing OPEN from close or another field.


## Update — 2026-09-26 raw runtime path audit

A direct audit of current `Worker.js` materially narrows the RAW/OPEN/volume blocker.

### What the current Worker already requests
`fetchHistoricalDaily()` calls Fugle:
`/marketdata/v1.0/stock/historical/candles/{symbol}`
with:
- timeframe=D;
- fields=open,high,low,close,volume,turnover,change;
- no `adjusted=true` parameter.

Fugle's current Historical Candles contract states:
- `adjusted=true` is the explicit switch for adjusted price history;
- daily stock `volume` is in SHARES, whereas intraday candle volume for regular-lot stocks is in LOTS;
- corporate-action-day `change` can use an adjusted prior-close basis even when OHLC is raw.

Therefore the direct historical endpoint already has the ingredients for:
- RAW traded daily OPEN/HIGH/LOW/CLOSE;
- exact daily executed-share volume;
- without asking for provider back-adjusted prices.

### Current code loss
The current mapper intentionally returns only:
- date;
- close;
- high;
- low;
- volumeShares;
- tradeValue.

It requests `open` but drops it before writing the history cache.

This means the historical-OPEN blocker is no longer a source-availability problem.
It is a shared-runtime field-retention issue.

That issue does NOT affect the current Formal logic materially because Formal history was not designed around historical OPEN, but it blocks candlestick/overnight Pattern research if Pattern tries to reuse the cache.

### Volume clarification
The existing D1 history path names daily historical `volume` as `volumeShares`, consistent with Fugle's official daily-volume unit contract.

This is stronger than the FCNT000002 research surface, where volume is exposed in lots and loses sub-lot residuals.

However:
- UNIT_SCALE corporate actions still break cross-window raw-share comparability;
- supply changes still require explicit denominator semantics if turnover-normalized interpretation is wanted;
- raw executed-share volume and normalized turnover remain different spaces.

### Price-limit / reference-price clarification
Pattern's isolated C4 helper now fails closed unless:
- the ordinary standard stock limit is known to apply;
- the reference price is unit-comparable to the traded quote scale.

This is necessary because 5314 2025-03-31 proves a provider reference field can remain on a pre-conversion unit scale while raw traded prices resume on the new unit scale.

### Readiness impact
Update the effective interpretation of the gates:

- RAW daily OHLC runtime source: SOURCE_READY / CURRENT_CACHE_LOSSES_OPEN.
- Daily exact share volume source: SOURCE_READY / CA_COMPARABILITY_GUARDS_STILL_REQUIRED.
- Historical OPEN cache: ENGINEERING_BLOCKED, not provider blocked.
- TECHNICAL_CONTINUITY runtime path: still BLOCKED.
- Symbol-session completeness: still PARTIAL.
- Production Pattern observer: still NO_GO.

This does not authorize changing the shared Worker mapper. Retaining OPEN in production history is Class B because it changes shared runtime/storage and must be proposed only when the remaining cross-lane gates are decision-ready.
