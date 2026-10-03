import {
  OFFICIAL_SUSPENSION_DISCOVERY_SURFACES_V0_1,
  summarizeTwseSuspensionOpenApiV0_1,
  extractScriptUrlsV0_1,
  discoverSuspensionMachineHintsV0_1,
} from "../runtime/official_suspension_source_discovery_v0_1.mjs";

async function fetchText(url, timeoutMs = 30_000) {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        accept: "application/json,text/html,text/javascript,*/*",
        "user-agent": "System2-Official-Suspension-Source-Discovery/0.1",
      },
      signal: AbortSignal.timeout(timeoutMs),
    });
    const body = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      contentType: response.headers.get("content-type"),
      body,
      error: null,
    };
  } catch (error) {
    return {
      ok: false,
      status: null,
      contentType: null,
      body: "",
      error: String(error?.message || error),
    };
  }
}

async function scanPage(pageUrl) {
  const page = await fetchText(pageUrl);
  const scripts = page.ok ? extractScriptUrlsV0_1(page.body, pageUrl) : [];
  const sameOriginScripts = scripts
    .filter((url) => {
      try {
        return new URL(url).origin === new URL(pageUrl).origin && /\.js(?:[?#]|$)/i.test(url);
      } catch {
        return false;
      }
    })
    .slice(0, 24);

  const scriptBodies = [];
  for (const url of sameOriginScripts) {
    const fetched = await fetchText(url, 20_000);
    if (!fetched.ok) continue;
    scriptBodies.push({ url, body: fetched.body });
  }

  const hints = discoverSuspensionMachineHintsV0_1({
    pageUrl,
    pageHtml: page.body,
    scriptBodies,
  });

  return {
    pageUrl,
    httpOk: page.ok,
    httpStatus: page.status,
    contentType: page.contentType,
    fetchError: page.error,
    scriptUrlCount: scripts.length,
    sameOriginScriptScannedCount: scriptBodies.length,
    scriptUrls: sameOriginScripts,
    hintCount: hints.hintCount,
    hints: hints.hints,
    exactMachineEndpointFrozen: false,
  };
}

const twseOpenApiFetch = await fetchText(
  OFFICIAL_SUSPENSION_DISCOVERY_SURFACES_V0_1.TWSE_CURRENT_OPENAPI,
);
const twseOpenApiSummary = await summarizeTwseSuspensionOpenApiV0_1(twseOpenApiFetch.body);

const twsePage = await scanPage(
  OFFICIAL_SUSPENSION_DISCOVERY_SURFACES_V0_1.TWSE_HISTORICAL_PAGE,
);
const tpexPage = await scanPage(
  OFFICIAL_SUSPENSION_DISCOVERY_SURFACES_V0_1.TPEX_HISTORICAL_PAGE,
);

console.log(JSON.stringify({
  result: "OBSERVED",
  schemaVersion: "S2_OFFICIAL_SUSPENSION_SOURCE_DISCOVERY_PHYSICAL_V0_1",
  fetchedAt: new Date().toISOString(),
  twseCurrentOpenApi: {
    url: OFFICIAL_SUSPENSION_DISCOVERY_SURFACES_V0_1.TWSE_CURRENT_OPENAPI,
    httpOk: twseOpenApiFetch.ok,
    httpStatus: twseOpenApiFetch.status,
    contentType: twseOpenApiFetch.contentType,
    transportError: twseOpenApiFetch.error,
    ...twseOpenApiSummary,
  },
  twseHistoricalPageDiscovery: twsePage,
  tpexHistoricalPageDiscovery: tpexPage,

  // Discovery only; no historical completeness is claimed here.
  twseHistoricalMachineEndpointFrozen: false,
  tpexHistoricalMachineEndpointFrozen: false,
  suspensionCoverageByExchange: {
    TWSE: "INCOMPLETE",
    TPEX: "INCOMPLETE",
  },
  noSuspensionMayBeClaimed: false,
  symbolSessionCompletenessCertified: false,
  technicalContinuityCertified: false,
  historyMutationPerformed: false,
  strategyEvaluationPerformed: false,
  capacityRunProduced: false,
  selectionAuthority: false,
  finalSelectionEnabled: false,
  livePushEnabled: false,
  capitalImpact: false,
  orderImpact: false,
  system1RuntimeUsed: false,
}, null, 2));
