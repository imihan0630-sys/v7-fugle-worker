# Room10 research reconciliation

Date: 2026-10-14 Asia/Taipei
Scope: D14 and D15 research-only.

D14-16, D14-17, and D14-18 have durable mechanism and falsification contracts in main; central tracker still records L0. D14-19, D15-23, and D15-24 contracts exist only on an earlier isolated branch and must not be called merged.

Next: reconcile checkpoint first, then tracker, using current file SHA. Do not infer broker fills, realized P/L, or historic Shadow from synthetic tests. Formal Core remains locked.
