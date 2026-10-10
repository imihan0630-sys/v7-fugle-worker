// Produces a SAFE OFFLINE PROPOSAL only. Never executes wrangler or the Cloudflare API.
// Does not change production wrangler.toml or existing system2/deploy configs.
const UUID = /^[a-f0-9]{32}$/i;
export function buildD1OnlyDisabledStagingConfigV0_1({databaseId,workerName="system2-shadow-research-staging"}={}) {
  if(!UUID.test(databaseId||"")) throw new Error("DESTINATION_D1_ID_UNVERIFIED");
  if(workerName!=="system2-shadow-research-staging") throw new Error("STAGING_WORKER_NAME_LOCKED");
  const text = [
    "# SYSTEM2_D1_ONLY_DISABLED_STAGING_V0_1 / PROPOSAL / NOT DEPLOYED",
    "# Requires new Cloudflare account, owner-authorized D1 creation and review before any deploy.",
    'name = "system2-shadow-research-staging"',
    'main = "system2/deploy/worker.mjs"',
    'compatibility_date = "2026-09-01"',
    "workers_dev = false",
    "preview_urls = false",
    "",
    "[[d1_databases]]",
    'binding = "SYSTEM2_DB"',
    'database_name = "system2-research"',
    'database_id = "'+databaseId+'"',
    'migrations_dir = "system2/sql"',
    "",
    "[vars]",
    'SYSTEM2_CAPTURE_ENABLED = "false"',
    'SYSTEM2_CAPTURE_MODE = "LIMITED_PROSPECTIVE_SHADOW"',
    'SYSTEM2_CAPTURE_CONTRACT_VERSION = "0.1"',
    'SYSTEM2_RESONANCE_ENABLED = "false"',
    'SYSTEM2_RESONANCE_CONTRACT_VERSION = "0.1"',
    "",
    "# NO [[r2_buckets]], NO KV bindings, NO [triggers], NO cron",
    "# NO route or production workers.dev URL, NO real capital or user notifications",
  ].join("\n")+"\n";
  assertD1OnlyDisabledStagingConfigV0_1(text);
  return text;
}
export function assertD1OnlyDisabledStagingConfigV0_1(text) {
  if(typeof text!=="string" || !/^name = "system2-shadow-research-staging"$/m.test(text) ||
     !/^workers_dev = false$/m.test(text) ||
     !/^preview_urls = false$/m.test(text) ||
     !/^binding = "SYSTEM2_DB"$/m.test(text) ||
     !/^SYSTEM2_CAPTURE_ENABLED = "false"$/m.test(text) ||
     !/^SYSTEM2_RESONANCE_ENABLED = "false"$/m.test(text) ||
     !/^database_id = "[a-f0-9]{32}"$/im.test(text) ||
     /^\s*\[\[r2_buckets\]\]/m.test(text) ||
     /^\s*\[triggers\]/m.test(text) ||
     /^\s*crons\s*=/m.test(text) ||
     /^\s*routes?\s*=/m.test(text) ||
     /^\s*\[\[kv_namespaces\]\]/m.test(text) ||
     /^\s*workers_dev\s*=\s*true/m.test(text) ||
     /^\s*SYSTEM2_(?:CAPTURE|RESONANCE)_ENABLED\s*=\s*"true"/m.test(text) ||
     /\bV7_DB\b|\bSTOCKS_KV\b|\bPUSH_WEBHOOK_URL\b/.test(text)
   ) throw new Error("D1_ONLY_STAGING_CONFIG_PRODUCTION_ISOLATION_FAILURE");
  return true;
}
