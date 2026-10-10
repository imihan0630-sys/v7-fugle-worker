// Read-only Cloudflare authorization diagnostic, intentionally not an authorization grant.
// Never print account IDs, token material, headers, URLs containing IDs, API error text or token IDs.
const ID = /^[0-9a-f]{32}$/i;
const API = "https://api.cloudflare.com/client/v4";
const safeRole = new Set(["SOURCE", "DESTINATION"]);

async function probe({url, token, fetchImpl}) {
  try {
    const response = await fetchImpl(url, {
      method: "GET",
      headers: {Authorization: "Bearer " + token, Accept: "application/json"},
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) return {httpStatus: response.status, success: false, active: false};
    // Do not retain or log the response content, except the strictly needed booleans.
    const data = await response.json();
    return {httpStatus: response.status, success: data?.success === true,
      active: data?.result?.status === "active"};
  } catch {
    // Intentionally suppress thrown URLs, API payloads or credential strings.
    return {httpStatus: null, success: false, active: false};
  }
}

export async function diagnoseCloudflareReadAccess({
  role, accountId, apiToken, fetchImpl = globalThis.fetch,
} = {}) {
  if (!safeRole.has(role)) throw new Error("ROLE_NOT_ALLOWED");
  if (typeof fetchImpl !== "function") throw new Error("FETCH_UNAVAILABLE");
  if (!ID.test(accountId || "")) return Object.freeze({role, status:"ACCOUNT_ID_INVALID", tokenVerifyHttp:null, d1Http:null});
  if (typeof apiToken !== "string" || !apiToken.trim()) return Object.freeze({role, status:"TOKEN_SECRET_EMPTY", tokenVerifyHttp:null, d1Http:null});
  // Probe both endpoints independently, even if the token test failed. This avoids serial blind spots.
  const [token, d1] = await Promise.all([
    probe({url:API + "/user/tokens/verify",token:apiToken,fetchImpl}),
    probe({url:API + "/accounts/" + accountId + "/d1/database?page=1&per_page=10",token:apiToken,fetchImpl}),
  ]);
  const verifyActive = token.httpStatus === 200 && token.success && token.active;
  const d1Granted = d1.httpStatus === 200 && d1.success;
  let status;
  if (d1Granted && verifyActive) status = "D1_READ_GRANTED";
  else if (d1Granted) status = "D1_READ_GRANTED_TOKEN_VERIFY_UNCONFIRMED";
  else if (token.httpStatus === 200 && token.success && !token.active) status = "TOKEN_INACTIVE";
  else if (verifyActive && (d1.httpStatus === 401 || d1.httpStatus === 403)) status = "TOKEN_ACTIVE_D1_ACCOUNT_SCOPE_OR_PERMISSION_DENIED";
  else if (d1.httpStatus === 401 || d1.httpStatus === 403) status = "D1_AUTH_DENIED_TOKEN_OR_ACCOUNT_NOT_CONFIRMED";
  else if (d1.httpStatus === 429) status = "D1_RATE_LIMITED";
  else status = "READ_ACCESS_UNVERIFIED";
  return Object.freeze({role,status,tokenVerifyHttp:token.httpStatus,d1Http:d1.httpStatus,tokenActive:verifyActive});
}

export function confirmTwoAccountAuthDiagnostic({source,destination} = {}) {
  if (source?.role !== "SOURCE" || destination?.role !== "DESTINATION") return "BLOCKED_INVALID_REPORT";
  return source.status === "D1_READ_GRANTED" && destination.status === "D1_READ_GRANTED"
    ? "D1_READ_PREFLIGHT_PASS"
    : "BLOCKED_READ_ACCOUNT_AUTH";
}
