# V7 Fugle Worker Auto Deploy

Repository:
https://github.com/imihan0630-sys/v7-fugle-worker

Cloudflare Worker:
https://fugle-test.imihan0630.workers.dev

Current Worker version:
`7.5.3-phase4.5-slack-test-fix`

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

The response should show:

`7.5.3-phase4.5-slack-test-fix`

Keep `TEST_MODE=true` until the real Worker → Slack delivery test succeeds.
