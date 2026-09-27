import {
  A5_OFFICIAL_ENDPOINTS_V0_1,
  buildA5FilingVintageReceipt,
} from "./a5_filing_vintage_observer.mjs";
import {
  B2_OFFICIAL_ENDPOINTS_V0_1,
  buildB2IndustrySnapshotReceipt,
} from "./b2_industry_snapshot_observer.mjs";

const DEFAULT_TIMEOUT_MS = 30_000;
const USER_AGENT = "System2-ReadOnly-Dependency-Observer/0.1";

async function fetchJsonReadOnly(url, fetchImpl, timeoutMs) {
  const response = await fetchImpl(url, {
    method: "GET",
    redirect: "follow",
    headers: { accept: "application/json", "user-agent": USER_AGENT },
    signal: AbortSignal.timeout(timeoutMs),
  });
  const httpStatus = Number(response.status);
  if (!response.ok) {
    return {
      ok: false,
      httpStatus,
      payload: null,
      errorCode: `HTTP_${httpStatus}`,
    };
  }
  try {
    return {
      ok: true,
      httpStatus,
      payload: await response.json(),
      errorCode: null,
    };
  } catch {
    return {
      ok: false,
      httpStatus,
      payload: null,
      errorCode: "NON_JSON_RESPONSE",
    };
  }
}

async function fetchAll(endpointMap, fetchImpl, timeoutMs) {
  const entries = await Promise.all(
    Object.entries(endpointMap).map(async ([key, url]) => {
      try {
        const result = await fetchJsonReadOnly(url, fetchImpl, timeoutMs);
        return [key, { ...result, url }];
      } catch (error) {
        return [key, {
          ok: false,
          httpStatus: null,
          payload: null,
          errorCode: error?.name === "TimeoutError" ? "TIMEOUT" : "NETWORK_ERROR",
          url,
        }];
      }
    }),
  );
  return Object.fromEntries(entries);
}

function safeRows(result) {
  return result?.ok && Array.isArray(result.payload) ? result.payload : [];
}

function transportSummary(results) {
  return Object.fromEntries(
    Object.entries(results).map(([key, value]) => [key, {
      ok: value.ok,
      httpStatus: value.httpStatus,
      errorCode: value.errorCode,
    }]),
  );
}

function taipeiDate(timestamp) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(timestamp));
}

export async function probeRequiredDependencyObservers({
  marketDate,
  fetchImpl = fetch,
  now = () => new Date(),
  timeoutMs = DEFAULT_TIMEOUT_MS,
} = {}) {
  const startedAt = now().toISOString();
  const [a5Raw, b2Raw] = await Promise.all([
    fetchAll(A5_OFFICIAL_ENDPOINTS_V0_1, fetchImpl, timeoutMs),
    fetchAll(B2_OFFICIAL_ENDPOINTS_V0_1, fetchImpl, timeoutMs),
  ]);
  const observedAt = now().toISOString();

  const a5 = await buildA5FilingVintageReceipt({
    receiptId: `A5-${marketDate}-${observedAt.replace(/\D/g, "").slice(0, 14)}`,
    observedAt,
    twseEpsRows: safeRows(a5Raw.TWSE_EPS),
    tpexEpsRows: safeRows(a5Raw.TPEX_EPS),
    twseProfitRows: safeRows(a5Raw.TWSE_PROFIT),
    tpexProfitRows: safeRows(a5Raw.TPEX_PROFIT),
  });

  const b2 = await buildB2IndustrySnapshotReceipt({
    receiptId: `B2-${marketDate}-${observedAt.replace(/\D/g, "").slice(0, 14)}`,
    marketDate,
    observedAt,
    twseProfileRows: safeRows(b2Raw.TWSE_PROFILE),
    tpexProfileRows: safeRows(b2Raw.TPEX_PROFILE),
    twseDailyRows: safeRows(b2Raw.TWSE_DAILY),
    tpexDailyRows: safeRows(b2Raw.TPEX_DAILY),
  });

  const sameTaipeiDate = taipeiDate(observedAt) === marketDate;
  const transport = {
    A5: transportSummary(a5Raw),
    B2: transportSummary(b2Raw),
  };
  const allTransportOk = Object.values(transport)
    .flatMap((family) => Object.values(family))
    .every((x) => x.ok);

  return {
    reportVersion: "S2_REQUIRED_DEPENDENCY_OBSERVER_REPORT_V0_1",
    mode: "READ_ONLY_OFFICIAL_SOURCE_AND_DERIVED_OBSERVATION",
    marketDate,
    startedAt,
    observedAt,
    sameTaipeiDate,
    allTransportOk,
    transport,
    a5,
    b2,
    dependencyCoverage: {
      A5_QUARTERLY_FINANCIALS:
        sameTaipeiDate && allTransportOk && a5.dependencyCoverageEligible === true,
      B2_INDUSTRY_THESIS_PROSPECTIVE:
        sameTaipeiDate && allTransportOk && b2.dependencyCoverageEligible === true,
    },
    prospectiveEvidenceEligible:
      sameTaipeiDate
      && allTransportOk
      && a5.dependencyCoverageEligible === true
      && b2.dependencyCoverageEligible === true,
    safety: {
      httpMethods: ["GET"],
      system2D1Written: false,
      system2WorkerMutated: false,
      system1RuntimeUsed: false,
      captureArmRequested: false,
      cronMutationPerformed: false,
      externalMutationPerformed: false,
    },
  };
}
