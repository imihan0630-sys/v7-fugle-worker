/**
 * GET-only Cloudflare service-specific API diagnostic.
 * This output is safe to publish to CI logs: no IDs, token values, paths, request bodies,
 * token verification payloads, source resource names, or Cloudflare error messages.
 * HTTP 403 without a trustworthy numeric error code is UNKNOWN, never "R2 not enabled".
 */
const ROLES = new Set(["SOURCE","DESTINATION"]);
const HEX_ID = /^[0-9a-f]{32}$/i;
const CF_API = "https://api.cloudflare.com/client/v4";
const SERVICES = Object.freeze([
  ["D1", "/d1/database?page=1&per_page=1"],
  ["WORKERS", "/workers/scripts"],
  ["KV", "/storage/kv/namespaces?page=1&per_page=1"],
  ["R2", "/r2/buckets?per_page=1"],
]);

function classify(service, status, code, success) {
  if (status === 200 && success) return "READ_GRANTED";
  if (service === "R2" && status === 403 && code === 10042) return "R2_ACCOUNT_NOT_ENTITLED";
  if (service === "R2" && status === 403 && code === 10003) return "R2_READ_PERMISSION_DENIED";
  if (service === "R2" && status === 403) return "R2_403_REASON_NOT_VERIFIED";
  if (status === 401 || status === 403) return "READ_PERMISSION_OR_ACCOUNT_DENIED";
  if (status === 429) return "RATE_LIMITED";
  if (status === 200 && !success) return "CLOUDFLARE_RESPONSE_UNVERIFIED";
  return "SERVICE_UNVERIFIED";
}

async function probe({service, path, accountId, apiToken, fetchImpl}) {
  try {
    const response = await fetchImpl(CF_API+"/accounts/"+accountId+path, {
      method:"GET",
      headers:{Authorization:"Bearer "+apiToken,Accept:"application/json"},
      signal:AbortSignal.timeout(20000),
    });
    const httpStatus = Number.isInteger(response.status) && response.status >= 100 && response.status <= 599
      ? response.status : null;
    let success = false;
    let errorCode = null;
    try {
      const obj = await response.json();
      success = obj?.success === true && response.ok === true;
      const candidate = obj?.errors?.[0]?.code;
      if (Number.isSafeInteger(candidate) && candidate >= 0 && candidate <= 999999)
        errorCode = candidate;
    } catch { /* Never surface raw API error response or parse exceptions */ }
    return Object.freeze({service,httpStatus,errorCode,classification:classify(service,httpStatus,errorCode,success)});
  } catch {
    return Object.freeze({service,httpStatus:null,errorCode:null,classification:"TRANSPORT_OR_RESPONSE_UNVERIFIED"});
  }
}

export async function diagnoseCloudflareServicesReadOnly({role,accountId,apiToken,fetchImpl=globalThis.fetch}={}) {
  if (!ROLES.has(role)) throw new Error("SERVICE_DIAG_ROLE_INVALID");
  if (typeof fetchImpl !== "function") throw new Error("SERVICE_DIAG_FETCH_UNAVAILABLE");
  if (!HEX_ID.test(accountId || "") || typeof apiToken !== "string" || !apiToken.trim()) {
    return Object.freeze({role,status:"INPUT_INVALID",services:[]});
  }
  // The four services are independently probed; one denied endpoint does not hide the rest.
  const services = await Promise.all(SERVICES.map(([service,path]) =>
    probe({service,path,accountId,apiToken,fetchImpl})));
  return Object.freeze({role,status:services.every(s=>s.classification==="READ_GRANTED")?
    "ALL_SERVICE_READS_GRANTED":"INCOMPLETE_SERVICE_READS",services});
}

export function assessTwoAccountServiceReads({source,destination,accountCollision=false}={}) {
  if (accountCollision) return "BLOCKED_ACCOUNT_ID_COLLISION";
  if (source?.role!=="SOURCE" || destination?.role!=="DESTINATION")
    return "BLOCKED_SERVICE_DIAGNOSTIC_INVALID";
  return source.status==="ALL_SERVICE_READS_GRANTED" &&
    destination.status==="ALL_SERVICE_READS_GRANTED" ?
      "SERVICES_READ_PREFLIGHT_PASS":"BLOCKED_SERVICE_READS";
}
