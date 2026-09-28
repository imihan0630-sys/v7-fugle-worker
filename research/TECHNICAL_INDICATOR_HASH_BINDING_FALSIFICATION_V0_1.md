# D03 source-hash binding falsification v0.1

Updated: 2026-09-28 Asia/Taipei
Status: RESEARCH_ONLY / OUTCOME_BLIND / FORMAL_LOCKED

## Question and positive case

Can the isolated Technical Indicator source guard prove that its asserted `sourceBarHash` identifies the actual high/low/close values it computes? A trustworthy, independently attested raw-source receipt could make a source revision or substitution detectable before the indicator observer runs. This would protect reproducibility and point-in-time interpretation; it would not itself prove a trading advantage.

## TI-409 — negative witness

The current guard requires a nonempty `sourceBarHash`, `observedRawBarIdentity` and `rawFieldProvenance`, but it does not recompute a canonical digest or verify a signed/immutable upstream receipt. `research/test_technical_indicator_hash_binding_falsification_v0_1.mjs` constructs 50 synthetic bars. It changes only the last bar's high from close+1 to close+21, leaving the asserted source hash, raw identity, provenance labels and all context receipts unchanged. Both sequences are geometrically valid and the guard labels both `VALID`; their KD outputs differ. The test passes because it asserts that this counterexample is presently accepted.

This is a semantic vulnerability in the isolated research boundary, not evidence that a deployed production source changed a bar. It is also not a cryptographic collision: the strings are never checked against the payload. A second risk is later provider revision under the same date and symbol. Without `firstKnownAt`, `capturedAt`, content digest and immutable version ancestry, a replay could silently consume a later revision as if it were known at the original decision time.

## Required upstream evidence contract

The shared source/continuity owner should define one canonical, versioned byte representation of the raw provider payload before any normalization or fallback. The immutable receipt must bind provider/source, market, symbol, trade date, source publication or first-known time, capture time, raw open/high/low/close field presence and values, per-field observed/synthesized status, provider revision identifier where available, and raw content digest. A separate continuity receipt must bind each transformed technical bar to the exact raw receipt plus corporate-action events, factor version, transformation code version and as-of decision time. Any changed raw payload under the same identity creates a new version or provenance conflict; it may not overwrite the old decision-time record.

The D03 observer may verify a supplied receipt against its exact window and formula inputs once this upstream contract exists. It cannot establish independent authenticity by hashing a row after the same untrusted adapter labels it `OBSERVED`. Signing is optional only if immutable storage and lineage verification provide equivalent independent attestation; a string called `hash` alone is insufficient.

## False-positive and scope controls

Strict rejection can bias the future research population. A real provider correction or a legitimate corporate-action transform can change derived OHLC while preserving the earlier raw record; these require versioned lineage, not automatic `BAD`. Log rejection counts by date, provider, market, symbol, action boundary and reason, retaining `UNKNOWN` when the upstream receipt is absent. Compare observed-bar coverage against official session and corporate-action truth only after those upstream sources are certified. Keep the proposed immutable parent denominator `FORMAL_HISTORY_ADMITTED_FEATURE_ROWS_V0_1` separate from indicator-observable children.

No outcome data were inspected. There is no OOS (樣本外), Walk-forward (滾動前推), selection-bias (選擇偏誤), cost or fill evidence, and no basis for TI-005/TI-006 incremental-value inference. Formal Core remains LOCKED. This adds no new indicator, parameter, score, threshold or trading rule.

## Verification and exact next continuation

- Run: `node research/test_technical_indicator_hash_binding_falsification_v0_1.mjs` — PASS, isolated synthetic counterexample.
- Continue by auditing the shared source/continuity owner's actual raw-field receipt and immutable digest contract. Obtain a real, permissioned, outcome-blind sample of provider OHLC availability and revisions before asserting runtime provenance.
- Bind raw and transformed receipts to the exact parent generation and complete child keyset, then test altered payload, legitimate correction, corporate-action transform and false rejection against certified sessions.
- Keep runtime wiring, outcome joins and Formal optimization blocked until the upstream handoff and prospective evidence gates pass.
