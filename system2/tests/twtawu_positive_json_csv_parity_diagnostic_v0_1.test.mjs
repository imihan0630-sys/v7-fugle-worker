import assert from "node:assert/strict";
import {
  TWTAWU_PARITY_DIAGNOSTIC_VERSION,
  TWTAWU_POSITIVE_CONTROL,
  buildTwtaWuDiagnosticUrlV0_1,
  parseCsvRecordsStrictV0_1,
  parseTwtaWuJsonRowsV0_1,
  parseTwtaWuCsvRowsV0_1,
  decodeTwtaWuDateV0_1,
  probeTwtaWuPositiveJsonCsvParityV0_1,
} from "../runtime/twtawu_positive_json_csv_parity_diagnostic_v0_1.mjs";

const fields=[
  "編號","證券代號","證券名稱","暫停交易日期",
  "暫停交易時間","恢復交易日期","恢復交易時間",
];
const rows=[
  ["1","1218","泰山","115/08/13","8:00","115/08/14","8:00"],
  ["2","2330","台積電","115/08/13","13:30","115/08/17","8:00"],
];
const json=JSON.stringify({stat:"OK",fields,data:rows});
const csv=[
  "暫停交易證券",
  fields.join(","),
  '1,1218,"泰山",115/08/13,8:00,115/08/14,8:00',
  '2,2330,"台積電",115/08/13,13:30,115/08/17,8:00',
].join("\r\n");
assert.equal(TWTAWU_PARITY_DIAGNOSTIC_VERSION,"S2_TWTAWU_POSITIVE_JSON_CSV_DIAGNOSTIC_V0_1");
assert.match(buildTwtaWuDiagnosticUrlV0_1("json"),/startDate=20260813&endDate=20260814&querytype=3&response=json/);
assert.match(buildTwtaWuDiagnosticUrlV0_1("csv"),/response=csv$/);
assert.equal(decodeTwtaWuDateV0_1("115/08/13"),"2026-08-13");
assert.equal(decodeTwtaWuDateV0_1("2026-08-13"),"2026-08-13");
assert.throws(()=>decodeTwtaWuDateV0_1("115/02/31"),/invalid TWTAWU date/);
assert.deepEqual(parseCsvRecordsStrictV0_1('a,"b,b","c""d"\r\n'),[["a","b,b",'c"d']]);
assert.deepEqual(parseTwtaWuJsonRowsV0_1(json),parseTwtaWuCsvRowsV0_1(csv));
assert.throws(()=>parseTwtaWuJsonRowsV0_1('{"stat":"NO_DATA"}'),/official status/);
assert.throws(()=>parseTwtaWuCsvRowsV0_1("<html>Not CSV</html>"),/CSV official header/);
assert.throws(()=>parseCsvRecordsStrictV0_1('"bad csv'),/unclosed quote/);

function mockFetch({jsonBody=json,csvBody=csv,csvStatus=200}={}){
  const urls=[];
  const impl=async(url,options)=>{
    assert.equal(options.method,"GET");
    assert.ok(!String(url).includes("fugle-test"));
    urls.push(url);
    const isCsv=new URL(url).searchParams.get("response")==="csv";
    return {
      ok:isCsv?csvStatus===200:true,status:isCsv?csvStatus:200,
      headers:{get:()=>isCsv?"text/csv":"application/json"},
      async text(){return isCsv?csvBody:jsonBody;},
    };
  };
  return {impl,urls};
}
const safe=mockFetch();
let clockTicks=0;
const receipt=await probeTwtaWuPositiveJsonCsvParityV0_1({
  fetchImpl:safe.impl,
  observedAt:()=>new Date(Date.parse("2026-10-09T01:00:00Z")+clockTicks++*1000).toISOString(),
});
assert.equal(safe.urls.length,2);
assert.equal(receipt.result,"MATCHED_POSITIVE_PARITY_DIAGNOSTIC_ONLY");
assert.equal(receipt.jsonCsvRowSetParity,true);
assert.equal(receipt.observations.json.positiveControlPresent,true);
assert.equal(receipt.observations.csvCandidate.positiveControlPresent,true);
assert.equal(receipt.observations.json.normalizedRowCount,2);
assert.ok(receipt.observations.csvCandidate.observedAt>receipt.observations.json.observedAt);
assert.equal(receipt.sameScopeOfficialExportContractProven,false);
assert.equal(receipt.exactRangeCompletenessProven,false);
assert.equal(receipt.absenceCertifiesNoSuspension,false);
assert.equal(receipt.noEventMayBeClaimed,false);
assert.equal(receipt.technicalContinuityCertified,false);
assert.equal(receipt.ncT01PromotionAuthorized,false);
assert.equal(receipt.historicalPITPublicationProven,false);
assert.equal(receipt.d1RowsRead,0);
assert.equal(receipt.d1RowsWritten,0);
assert.equal(receipt.r2Writes,0);

for(const variant of [
  {csvBody:csv.replace("2330","2331")},
  {csvBody:"<html>WAF response</html>"},
  {csvStatus:520},
  {jsonBody:JSON.stringify({stat:"OK",fields,data:[]})},
  {jsonBody:JSON.stringify({stat:"NO_DATA",fields,data:rows})},
  {jsonBody:JSON.stringify({stat:"OK",fields,data:[...rows,rows[0]]})},
]){
  const source=mockFetch(variant);
  const diagnostic=await probeTwtaWuPositiveJsonCsvParityV0_1({
    fetchImpl:source.impl,observedAt:()=>new Date("2026-10-09T01:00:00Z").toISOString(),
  });
  assert.equal(diagnostic.result,"BLOCKED_POSITIVE_PARITY_UNVERIFIED");
  assert.equal(diagnostic.noEventMayBeClaimed,false);
  assert.equal(diagnostic.exactRangeCompletenessProven,false);
  assert.equal(diagnostic.jsonCsvRowSetParity,false);
  assert.ok(diagnostic.blockers.some(x=>x.startsWith("FAIL_CLOSED:")));
}
assert.equal(TWTAWU_POSITIVE_CONTROL.symbol,"1218");
assert.throws(()=>buildTwtaWuDiagnosticUrlV0_1("html"),/unsupported response/);
assert.throws(()=>buildTwtaWuDiagnosticUrlV0_1("json",{
  startDate:"2026-08-14",endDate:"2026-08-13",
}),/invalid bounded date/);
console.log("System2 TWTAWU positive JSON/CSV source parity fail-closed tests PASS");
