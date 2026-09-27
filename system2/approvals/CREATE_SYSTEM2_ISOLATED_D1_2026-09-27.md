APPROVAL=CREATE_SYSTEM2_ISOLATED_D1

Owner authorization recorded in chat on 2026-09-27 Asia/Taipei.

Authorized scope:
- create or reuse only the isolated Cloudflare D1 database named `system2-research`;
- apply only System 2 research schema V0.5 from `system2/sql/0001_research_core.sql`;
- verify required `s2_` tables;
- perform isolated write/read infrastructure sentinel checks.

Explicitly not authorized by this record:
- modifying the System 1/V8 production D1;
- changing `Worker.js` production behavior;
- changing root `wrangler.toml` production bindings/routes/Cron;
- deploying a public System 2 Worker;
- enabling scheduled Shadow capture.

This file is a one-shot audit marker for the guarded provisioning workflow.

REPLAY_VERIFICATION=REQUESTED
