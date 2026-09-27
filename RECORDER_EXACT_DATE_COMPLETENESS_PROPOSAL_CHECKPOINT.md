# Recorder Exact-Date Completeness Proposal Checkpoint

This branch materializes the previously frozen B-145 Class-B proposal. It does **not** implement or authorize any Production runtime/API/storage change.

## Why v0.2 refines v0.1
Current execution recorder uses `INSERT OR IGNORE`, and milestone event windows span more than one scheduled minute. A repeated invocation may legitimately attempt an event key that already exists.

Therefore `attemptedCount > newlyStoredCount` is not, by itself, evidence of a recorder gap.

v0.2 requires:
- exact-date complete row set with explicit pagination/truncation;
- unique event-key reconciliation;
- all 265 scheduled monitor runs (09:00–13:24 inclusive) positively receipted for a trading day;
- every plan symbol explicitly represented per run;
- `result.ok=false`, fail-open/error, missing receipt, or generic skip => incomplete/UNKNOWN;
- idempotent duplicate is allowed only as `alreadyPresentVerifiedCount` and only when the exact event key is present;
- expected BUY signal or positive BUY journal row always blocks NO-BUY classification.

## Decision boundary
Only a future owner-approved Class-B runtime implementation could produce the needed exact-date rows/run receipts.

This branch is proposal/tests only. Do not merge/deploy a runtime implementation without explicit owner approval.

Formal Core unchanged.
