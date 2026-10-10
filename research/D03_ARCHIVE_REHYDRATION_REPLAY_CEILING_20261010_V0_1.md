# D03 Archive Rehydration Replay Ceiling

Status: RESEARCH_ONLY / FALSIFICATION_FIRST / NO_MATURITY_PROMOTION
Date: 2026-10-10 Asia/Taipei
Domain: D03 trend / momentum / reversal / technical indicators
Formal Core impact: NONE / LOCKED

## New evidence consumed

Main commit `5cb4aa8503adbf30fb9f18a37af492e562e9b030` adds a real GitHub Actions rehydration of the already-existing 11,843-key official-source archive:

- Run 38004261921 / Job 114069302287 succeeded from main SHA `9bb42ec5d405dce34fe8844a479d2574d103da4a`.
- Original archive 11623192826 was checked by ZIP SHA-256 `7fe94b715cf265880163fb986d46ab95ff4b6620a9ed23d8363a4bc3e873934f` and inner JSON SHA-256 `fa38cbc9bbda4f99ca5a8bbc5e83ee5c324847c15fc599c8dd5412ccf14ef4c6`.
- The independent validator reconciled 12/12 market-date receipts and 11,843 unique stock-date keys: TWSE 6,518 and TPEx 5,325, with zero source-key duplicates.
- Identity digest `67ea4601ab7ea6300ab1cf0a54ba4eafb7d834c03ac83413536273c7dbabe654` and value digest `2f6c4d8362168cad11c4c230fd26fa06aa189fe87567314aa7a4f8798b006139` matched.
- All 11,843 records remain retrospective and unqualified for original first-known/available-at time. Hot D1 physical Scout remains 0/36; physical census remains 0/11,843.

## H1 — Exact rehydration improves replay reproducibility

Support: immutable ZIP, inner JSON, per-date identities, per-date values, global identity and global value digests make later replay input byte-addressable and tamper-evident. An independent validator and 22 adversarial cases reduce implementation error risk.

Counterevidence: the validator rechecks the same original archive. It is an independent validation path, not an independent market observation or independent semantic source. Both layers share one observation root.

Alternative explanation: matching hashes can arise because the archived bytes are faithfully copied, even if the original observation occurred after the historical decision cutoff.

Failure conditions: ZIP or JSON digest mismatch, missing/duplicate/out-of-order keys, per-date/global hash mismatch, invented D1 I/O, forged first-known time, or relabeling retrospective records as historical PIT.

## H2 — Six completed dates impose a hard indicator-history ceiling

The archive spans six official market dates across 2026-10-01 through 2026-10-08. Independent rehydration verifies those source keys; it does not create earlier history.

Consequences:

- ret5 needs six exact contiguous eligible closes. It is arithmetically possible only after symbol-session continuity, corporate-action and causal-clock gates pass. Those gates are still false.
- ret20 and ret60 cannot be computed from six dates.
- SMA5 can be mechanically computed on a complete five-session suffix, but MA10/20/60/120 cannot.
- KD9, RSI14, MACD12/26/9, ADX14/Wilder replay and Bollinger20 lack their minimum history or warm-up ancestry.
- divergence confirmation lacks sufficient confirmed pivot history and first-observable/confirmed clocks.
- multi-timeframe conflict cannot be evaluated because the archive contains no intraday completed-bar lineage and does not certify a completed weekly frame.

Counterevidence: a future longer archive with exact eligible-session identities may remove the length blocker. It still would not, by length alone, prove historical availability.

Failure condition: padding missing antecedents, substituting older non-eligible sessions, initializing recursive indicators from arbitrary constants, or treating cross-sectional stock count as time-series depth.

## H3 — Reproducibility is not OOS, walk-forward, or independent attestation

Support: two validation layers demonstrate deterministic reconstruction of the same frozen source cut.

Counterevidence: no new market date, no new economic outcome, no new source authority, no Hot D1 observation, and no decision-time capture were added. Therefore this is not OOS, walk-forward, a second source, or an outcome join.

Selection-bias warning: the six adjacent sessions are date-clustered and were selected because the archive already existed. They cannot estimate indicator efficacy.

## D03 acceptance matrix

| Module | Six-date mechanical depth | Current admissible use | Promotion blocker |
| --- | --- | --- | --- |
| D03-01 MA/trend | SMA5 only in principle | parser/formula check after exact-session continuity | longer windows and PIT lineage |
| D03-02 ret5/20/60 | ret5 only in principle | outcome-blind arithmetic diagnostic | ret20/60 depth, continuity and causal clocks |
| D03-06 KD9 | insufficient | none beyond input-schema checks | at least nine eligible sessions plus initialization |
| D03-07 RSI14 | insufficient | none beyond input-schema checks | Wilder ancestry and causal history |
| D03-08 MACD | insufficient | none beyond input-schema checks | EMA warm-up and state lineage |
| D03-09 ADX | insufficient | none beyond input-schema checks | full replay or certified trusted state |
| D03-10 Bollinger20 | insufficient | none beyond input-schema checks | exact 20 eligible parent sessions |
| D03-12 divergence | insufficient/clockless | none beyond schema checks | confirmed pivots and observation clocks |
| D03-13 multi-timeframe | unavailable | none | intraday/weekly finality and coverage |

## Bias, cost, and market-state audit

- PIT/look-ahead: all 11,843 records have zero qualified original first-known/available-at evidence.
- OOS/walk-forward: absent; revalidation of one archive is not a new sample.
- Multiple testing/overfitting: no indicator parameter is searched; minimum-history requirements are fixed ex ante.
- Factor redundancy: no new information root is created.
- Date clustering: six adjacent sessions only.
- Costs/fillability/limits/halts/ex-rights: performance effects remain UNKNOWN; action/halt lineage remains an input-validity prerequisite.
- Market state: no efficacy claim.

## Current verdict

- archive reproducibility: PASS for the frozen source archive
- semantic independence: SAME_OBSERVATION_ROOT
- original PIT: false
- physical Hot D1 Scout/census: 0/36 and 0/11,843
- indicator time-series sufficiency: false for all promotion-target indicators; ret5/SMA5 are only arithmetically possible after unresolved lineage gates
- D03 maturity: 56.7%, unchanged
- outcome join: closed
- Formal Core: locked

## Exact next continuation point

Do not repeat archive rehydration. Await the independently accepted real 36-key Hot D1 Scout under a qualified read budget. Separately, acquire a causal, exact eligible-session history long enough for the target indicator: first priority is 20 clean parent sessions for D03-10 Bollinger with reset/continuity lineage; D03-09 ADX remains full-replay or certified-state only. The six-date archive may support byte-integrity and input-schema diagnostics, not promotion, PIT, OOS, alpha or outcome claims.
