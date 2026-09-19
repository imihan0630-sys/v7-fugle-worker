# V7 Fugle Worker Auto Deploy

Repository:
https://github.com/imihan0630-sys/v7-fugle-worker

Cloudflare Worker:
https://fugle-test.imihan0630.workers.dev

Current production Worker version:\n`7.5.33-dynamic-watchlist-12`

## What this package does

When `Worker.js` on the `main` branch changes, GitHub Actions automatically deploys it to the existing Cloudflare Worker `fugle-test`.

The workflow is intentionally scoped to Worker code deployment. It does not intentionally change:

- D1 `v7-live`
- `V7_DB` binding
- `STOCKS_KV`
- Runtime variables
- Cloudflare secrets
- Cron Triggers

## One-time GitHub setup

Upload all files in this package into the root of:

https://github.com/imihan0630-sys/v7-fugle-worker

Then open:

https://github.com/imihan0630-sys/v7-fugle-worker/settings/secrets/actions

Create these two Repository secrets:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`

Do not paste either secret into ChatGPT.

## Cloudflare API token

Create/manage API tokens here:

https://dash.cloudflare.com/profile/api-tokens

The token must have permission to edit/deploy Workers Scripts for the Cloudflare account that owns `fugle-test`.

## First deployment

After the two GitHub secrets are configured, open:

https://github.com/imihan0630-sys/v7-fugle-worker/actions

Choose `V7 Cloudflare Deploy` and click `Run workflow`.

## Verification

After deployment, open:

https://fugle-test.imihan0630.workers.dev/api/recommendations

The response should show the current production version, presently:\n\n`7.5.33-dynamic-watchlist-12`

Keep `TEST_MODE=true` until the real Worker → Slack delivery test succeeds.


## Project continuity

For cross-chat / cross-device continuity, read these files before changing V7:

1. `AGENTS.md` — safety and latest continuity rules
2. `REQUIREMENTS_30.md` — authoritative specification and acceptance gaps
3. `PROJECT_HISTORY.md` — chronological history consolidated from prior project chats and verified repo/runtime milestones

GitHub is the project source of truth. Do not infer the current production state from an old chat thread alone.
