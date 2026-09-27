import {
  resolveSystem2CaptureArm,
  buildSystem2HealthPayload,
} from "./worker_core.mjs";

async function readSchemaVersion(db) {
  if (!db || typeof db.prepare !== "function") return "BINDING_MISSING";
  const row = await db
    .prepare(
      "SELECT schema_value FROM s2_schema_meta WHERE schema_key = 'schema_version' LIMIT 1",
    )
    .first();
  return row?.schema_value || "UNKNOWN";
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method !== "GET" || url.pathname !== "/health") {
      return new Response("Not found", { status: 404 });
    }

    const schemaVersion = await readSchemaVersion(env.SYSTEM2_DB);
    const payload = buildSystem2HealthPayload({ schemaVersion, env });

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  },

  async scheduled(_controller, env, _ctx) {
    const arm = resolveSystem2CaptureArm(env);

    if (!arm.enabled) {
      console.log(JSON.stringify({
        service: "system2-shadow-research",
        event: "scheduled",
        state: "CAPTURE_DISABLED",
      }));
      return;
    }

    // V0.1 intentionally fails closed until source adapters and exact decision
    // clock semantics are prospectively verified. A deployed skeleton cannot
    // silently begin trading-research capture just because a Cron exists.
    throw new Error("CAPTURE_SOURCE_ADAPTERS_NOT_CONFIGURED");
  },
};
