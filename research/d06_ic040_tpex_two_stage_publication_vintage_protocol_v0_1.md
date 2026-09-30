# D06 IC-040 — TPEx two-stage publication vintage protocol

Updated: 2026-09-30 Asia/Taipei
Status: OUTCOME-BLIND / PIT CONTRACT ADVANCED / FORMAL CORE LOCKED

Official TPEx evidence materially resolves the public-table clock question left UNKNOWN in IC-039.

- The official English TPEx Short sale Balance of Margin Trading and SBL page states that, following the TWSE daily work schedule, the information is updated at 20:30 and 22:30.
- The public table exposes margin-short and SBL-short prior balance, daily sell/return/adjustment, current balance and next-business-day SBL-short limit.
- The separate TPEx E-Data Shop S47 Margin_SBL.csv remains a paid daily product with a 22:00 production contract. No purchase is authorized.

## Falsification and PIT consequence

A same-date public value is not a timeless finalized fact. The official two-update schedule creates at least two public vintages. Historical downloads cannot reveal which vintage was known at an earlier decision time.

Therefore:
1. a 20:30 capture must not be silently replaced by a 22:30 value in PIT replay;
2. a 22:00 paid-product clock does not prove the public table first-known time beyond the explicit public 20:30/22:30 update schedule;
3. content differences between the two public vintages are revision evidence, not duplicate observations;
4. missing early capture remains UNKNOWN;
5. the 2025-05-26 change to next-day SBL short-sale limits (30% of prior 30-session average volume) is a rule-vintage boundary and must be stored explicitly.

## Prospective revision audit frozen before outcomes

For each future trading date, capture the public table shortly after the 20:30 and 22:30 scheduled updates and preserve:
sourceDate, requestedAt, capturedAt, firstSuccessfulCaptureAt, contentHash, schemaHash, rowCount, parseStatus, source identity and ruleVintage.

Compare by security code and field:
margin-short prior/sell/buy/stock-return/current/limit; SBL-short prior/sell/return/adjustment/current; next-day SBL-short limit; note.

Report hash changes, changed symbols/cells, field-level revision counts and revision magnitude. Do not inspect forward returns while this receipt/revision lane is being established.

## Readiness gate

At least 10 independent trading dates are required before making a stability claim about the 20:30 versus 22:30 public vintages. At least 20 independent dates plus common-support and source-quality checks are required before any outcome join. Stable hashes can support prospective snapshot stability only; they cannot manufacture historical firstKnownAt.

No scalar crowding score, threshold tuning or Formal change is allowed.

Exact next continuation: IC-041 accumulate prospective two-vintage receipts; separately continue PF-039 and institutional D5+ maturity. If automated public capture is unavailable, preserve UNKNOWN rather than substituting paid data.

FORMAL_OPTIMIZATION_CANDIDATE: NONE.
