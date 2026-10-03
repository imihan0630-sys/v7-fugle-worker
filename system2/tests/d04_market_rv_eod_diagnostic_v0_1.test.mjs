import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { sha256Hex } from "../runtime/decision_archive.mjs";
import {
  buildD04EodDiagnosticV0_1,
  parseFmtqikClosePayloadV0_1,
  requiredMonthAnchorsV0_1,
} from "../../research/d04_market_rv_eod_diagnostic_v0_1.mjs";

function payload(anchor, rows) {
  return {
    stat:"OK",
    date:anchor,
    fields:["日期","發行量加權股價指數"],
    data:rows.map(([date,close])=>[date,String(close)]),
  };
}
const sepRows=[
  ["115/09/02",100],["115/09/03",101],["115/09/04",100.5],["115/09/07",102],
  ["115/09/08",103],["115/09/09",102],["115/09/10",104],["115/09/11",103],
  ["115/09/14",105],["115/09/15",104],["115/09/16",106],["115/09/17",107],
  ["115/09/18",106],["115/09/21",108],["115/09/22",109],["115/09/23",110],
  ["115/09/24",109],["115/09/29",111],["115/09/30",112],
];
const octRows=[["115/10/01",113],["115/10/02",114]];
const sep=payload("20260901",sepRows),oct=payload("20261001",octRows);
const observedAt="2026-10-02T11:20:00.000Z";
async function receipt(anchor,p,fetchedAt=observedAt){
 return {anchor,payload:p,fetchedAt,rawPayloadHash:await sha256Hex(JSON.stringify(p))};
}
assert.deepEqual(requiredMonthAnchorsV0_1("2026-10-02",3),["20261001","20260901","20260801"]);
assert.equal(parseFmtqikClosePayloadV0_1(oct,"20261001").rows.at(-1).close,114);

{
 const x=await buildD04EodDiagnosticV0_1({
  marketDate:"2026-10-02",observedAt,
  payloadReceipts:[await receipt("20260901",sep),await receipt("20261001",oct)],
 });
 assert.equal(x.state,"SAME_DAY_EOD_DIAGNOSTIC_READY");
 assert.equal(x.historyWindow.length,21);
 assert.equal(x.historyWindow[0].date,"2026-09-02");
 assert.equal(x.historyWindow.at(-1).date,"2026-10-02");
 assert(x.diagnosticFactorObservations.every(v=>v.state==="KNOWN"));
 assert(x.factorObservations.every(v=>v.state==="UNKNOWN"));
 assert.equal(x.evidenceClass,"SAME_DAY_EOD_PROSPECTIVE_DIAGNOSTIC_ONLY");
 assert.equal(x.strategyDecisionClockAuthority,false);
 assert.equal(x.promotionGradeProspectiveDateCount,0);
 assert.equal(x.persistenceToSystem2D1,false);
 assert.equal(x.formalDecisionImpact,false);
 assert.equal(x.diagnosticHash,(await buildD04EodDiagnosticV0_1({
  marketDate:"2026-10-02",observedAt,
  payloadReceipts:[await receipt("20260901",sep),await receipt("20261001",oct)],
 })).diagnosticHash);
}
{
 const missingTarget=payload("20261001",[["115/10/01",113]]);
 const x=await buildD04EodDiagnosticV0_1({
  marketDate:"2026-10-02",observedAt,
  payloadReceipts:[await receipt("20260901",sep),await receipt("20261001",missingTarget)],
 });
 assert.equal(x.state,"NOT_READY");
 assert(x.blockerCodes.includes("TARGET_MARKET_DATE_NOT_IN_CURRENT_SOURCE"));
 assert.equal(x.diagnosticFactorObservations.length,0);
}
{
 const x=await buildD04EodDiagnosticV0_1({
  marketDate:"2026-10-02",observedAt,
  payloadReceipts:[await receipt("20261001",oct)],
 });
 assert.equal(x.state,"NOT_READY");
 assert(x.blockerCodes.includes("INSUFFICIENT_21_OFFICIAL_SESSIONS"));
}
{
 const late="2026-10-03T00:01:00.000Z";
 const x=await buildD04EodDiagnosticV0_1({
  marketDate:"2026-10-02",observedAt:late,
  payloadReceipts:[await receipt("20260901",sep,late),await receipt("20261001",oct,late)],
 });
 assert.equal(x.state,"NOT_READY");
 assert(x.blockerCodes.includes("OBSERVED_ON_DIFFERENT_TAIPEI_DATE"));
}
{
 const workflow=await readFile(new URL("../../.github/workflows/d04-market-rv-eod-diagnostic.yml",import.meta.url),"utf8");
 assert.match(workflow,/cron: "15 11 \* \* 1-5"/);
 assert.match(workflow,/permissions:\s*\n\s*contents: read/);
 assert.match(workflow,/run_d04_market_rv_eod_diagnostic_v0_1\.mjs/);
 assert.doesNotMatch(workflow,/secrets\./i);
 assert.doesNotMatch(workflow,/wrangler\s+(deploy|delete)|d1\s+(create|execute)/i);
 assert.doesNotMatch(workflow,/SYSTEM2_CAPTURE_ENABLED\s*=\s*true/i);
}
console.log("D04 EOD A2 diagnostic V0.1 tests: PASS");
