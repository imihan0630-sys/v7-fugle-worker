# D05 C3 temporal aliasing boundary

2026-10-08. Research only.

The C3 source contract schedules 17 completed 15-minute slots and at most one quote per selected symbol/slot. This can describe the sampled quote at its own timestamp; it cannot reconstruct the within-slot quote path, 15-second order-book persistence, cancellation events, or actual fills. Higher-frequency hypotheses must remain UNKNOWN until separately captured with verifiable timestamps.

For D05-03/04/09 compare only exact observed symbol/slot/source timestamps, and separate missing, stale, reconnect and auction states. No historical interpolation, no L4 credit from source code alone.