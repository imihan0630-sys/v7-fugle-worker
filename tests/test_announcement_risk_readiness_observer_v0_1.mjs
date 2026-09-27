import assert from "node:assert/strict";
import fs from "node:fs";
import {
  FORMAL_ANNOUNCEMENT_RISK_RE,
  classifyFormalAnnouncementTitle,
  auditAnnouncementPayload
} from "../research/announcement_risk_readiness_observer_v0_1.mjs";

const worker=fs.readFileSync(new URL("../Worker.js",import.meta.url),"utf8");
const start=worker.indexOf('if(body.kind==="ANNOUNCEMENTS")');
assert.ok(start>=0,"ANNOUNCEMENTS validator missing");
const end=worker.indexOf('throw new Error("未知品質資料類型")',start);
const block=worker.slice(start,end>start?end:start+5000);
assert.match(block,/t187ap04_L/);
assert.match(block,/mopsfin_t187ap04_O/);
assert.match(block,/Array\.isArray\(body\.twsePayload\)/);
assert.match(block,/Array\.isArray\(body\.tpexPayload\)/);
assert.match(block,/shiftDateString\(date,-30\)/);
assert.match(block,/sourcesVerified:true/);
assert.doesNotMatch(block,/if\s*\(\s*count\s*</,"Announcement validator unexpectedly gained a minimum event-count guard; revisit research semantics");

assert.equal(FORMAL_ANNOUNCEMENT_RISK_RE.test("澄清：本公司並無重大損失"),true);
assert.equal(classifyFormalAnnouncementTitle("重整計畫執行完畢，恢復正常營運").matched,true);
assert.equal(classifyFormalAnnouncementTitle("本公司股票自明日起停止買賣").matched,false);
assert.equal(classifyFormalAnnouncementTitle("財務報告涉有不實").matched,false);

const empty=auditAnnouncementPayload({
  scanDate:"2026-09-25",
  twsePayload:[],
  tpexPayload:[],
  validatedSnapshot:{asOfDate:"2026-09-25",count:0,stocks:{},sourcesVerified:true}
});
assert.equal(empty.evidenceState,"VERIFIED_EMPTY_WITHOUT_PERSISTED_TRANSPORT_WITNESS");
assert.equal(empty.guards.zeroEventsIsNotAutomaticallySourceFailure,true);

const nonempty=auditAnnouncementPayload({
  scanDate:"2026-09-25",
  twsePayload:[{"公司代號":"1234","發言日期":"1150925","主旨 ":"重大損失說明"}],
  tpexPayload:[{SecuritiesCompanyCode:"5678","發言日期":"1150820","主旨":"舊公告"}],
  validatedSnapshot:{asOfDate:"2026-09-25",count:1,sourcesVerified:true},
  transportWitness:{twseHttpOk:true,tpexHttpOk:true}
});
assert.equal(nonempty.raw.recentRows,1);
assert.equal(nonempty.raw.olderRows,1);
assert.equal(nonempty.raw.riskTitleRows,1);
assert.equal(nonempty.evidenceState,"VERIFIED_NONEMPTY_PAYLOAD");

console.log(JSON.stringify({
  ok:true,
  emptyVerifiedStateRepresentable:true,
  lexicalFalsePositiveCounterexample:true,
  lexicalFalseNegativeCounterexample:true,
  formalCoreImpact:false
},null,2));
