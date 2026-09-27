import assert from "node:assert/strict";
import { probeRequiredDependencyObservers } from "../runtime/required_dependency_probes.mjs";

function makeResponse(payload, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() { return payload; },
  };
}

const twseA5 = Array.from({ length: 620 }, (_, i) => ({
  出表日期: "1150928",
  年度: "115",
  季別: "2",
  公司代號: String(1101 + i).padStart(4, "0"),
  產業別: i % 2 ? "電子工業" : "食品工業",
}));
const tpexA5 = Array.from({ length: 470 }, (_, i) => ({
  Date: "1150928",
  Year: "115",
  Quarter: "2",
  SecuritiesCompanyCode: String(3001 + i).padStart(4, "0"),
  SecuritiesIndustryCode: i % 2 ? "電子" : "其他",
}));
const twseProfiles = twseA5.map((x) => ({
  公司代號: x.公司代號,
  產業別: x.產業別,
  出表日期: "1150928",
}));
const tpexProfiles = tpexA5.map((x) => ({
  SecuritiesCompanyCode: x.SecuritiesCompanyCode,
  SecuritiesIndustryCode: x.SecuritiesIndustryCode,
  Date: "1150928",
}));
const twseDaily = twseA5.map((x, i) => ({
  Code: x.公司代號,
  Date: "20260928",
  ClosingPrice: "100",
  Change: i % 2 ? "1" : "-1",
}));
const tpexDaily = tpexA5.map((x, i) => ({
  SecuritiesCompanyCode: x.SecuritiesCompanyCode,
  Date: "1150928",
  Close: "50",
  ChangeAmount: i % 2 ? "0.5" : "-0.5",
}));

const payloadBySuffix = new Map([
  ["t187ap14_L", twseA5],
  ["mopsfin_t187ap14_O", tpexA5],
  ["t187ap17_L", twseA5],
  ["mopsfin_187ap17_O", tpexA5],
  ["t187ap03_L", twseProfiles],
  ["mopsfin_t187ap03_O", tpexProfiles],
  ["STOCK_DAY_ALL", twseDaily],
  ["tpex_mainboard_daily_close_quotes", tpexDaily],
]);

const fetchImpl = async (url, options) => {
  assert.equal(options.method, "GET");
  for (const [suffix, payload] of payloadBySuffix) {
    if (url.includes(suffix)) return makeResponse(payload);
  }
  throw new Error(`unexpected URL: ${url}`);
};

let call = 0;
const now = () => new Date(
  call++ === 0
    ? "2026-09-28T06:10:00Z"
    : "2026-09-28T06:10:05Z",
);

const report = await probeRequiredDependencyObservers({
  marketDate: "2026-09-28",
  fetchImpl,
  now,
});
assert.equal(report.allTransportOk, true);
assert.equal(report.sameTaipeiDate, true);
assert.equal(report.a5.state, "OBSERVED_COVERAGE_PASS");
assert.equal(report.b2.state, "DERIVED_SNAPSHOT_OBSERVED");
assert.equal(report.dependencyCoverage.A5_QUARTERLY_FINANCIALS, true);
assert.equal(report.dependencyCoverage.B2_INDUSTRY_THESIS_PROSPECTIVE, true);
assert.equal(report.prospectiveEvidenceEligible, true);
assert.equal(report.safety.externalMutationPerformed, false);

const historicalNow = () => new Date("2026-09-29T06:10:00Z");
const historical = await probeRequiredDependencyObservers({
  marketDate: "2026-09-28",
  fetchImpl,
  now: historicalNow,
});
assert.equal(historical.sameTaipeiDate, false);
assert.equal(historical.prospectiveEvidenceEligible, false);
assert.equal(historical.dependencyCoverage.A5_QUARTERLY_FINANCIALS, false);
assert.equal(historical.dependencyCoverage.B2_INDUSTRY_THESIS_PROSPECTIVE, false);

console.log("System2 required dependency probes tests passed");
