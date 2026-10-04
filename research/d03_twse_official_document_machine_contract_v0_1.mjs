import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";

const VERSION="0.1-RESEARCH";
const LIST_URL="https://wwwc.twse.com.tw/rwd/zh/announcement/announcement";
const DETAIL_URL="https://wwwc.twse.com.tw/rwd/zh/announcement/announcement_detail";
const USER_AGENT="D03-TWSE-Official-Document-Acceptance/0.1";

function sha256(s){return createHash("sha256").update(s).digest("hex");}
function qs(args){return new URLSearchParams(args).toString();}
function curlJson(base,args){
  const url=base+"?"+qs(args);
  const p=spawnSync("curl",[
    "--fail","--silent","--show-error","--location","--max-time","30",
    "--header","User-Agent: "+USER_AGENT,url
  ],{encoding:"utf8",maxBuffer:32*1024*1024});
  if(p.error) throw p.error;
  if(p.status!==0) throw new Error("curl exit "+p.status+": "+String(p.stderr||"").slice(0,800));
  const raw=p.stdout;
  return {url,raw,hash:sha256(raw),json:JSON.parse(raw)};
}
function ok(obj){return String(obj?.stat||obj?.state||obj?.status||"").toLowerCase()==="ok";}
function rowId(row){return String(row?.[4]||"");}
function rowRef(row){return String(row?.[2]||"");}
function rowSubject(row){return String(row?.[3]||"");}

// A. Frozen positive list control.
const positive=curlJson(LIST_URL,{
  startDate:"20260701",endDate:"20260810",keyword:"減資",response:"json"
});
assert.equal(ok(positive.json),true);
assert.deepEqual(positive.json.fields,["項次","發文日期","發文字號","主旨","id"]);
assert.ok(Number(positive.json.total)>=3);
assert.ok((positive.json.data||[]).some(r=>rowSubject(r).includes("公司代號：1459")&&rowSubject(r).includes("現金減資換發股票")));

// B. Server-side pagination reconciliation over a >15-row bounded interval.
const common={startDate:"20260701",endDate:"20260810",keyword:"",response:"json"};
const first=curlJson(LIST_URL,{...common,paging:"15",offset:"0"});
assert.equal(ok(first.json),true);
const total=Number(first.json.total);
assert.ok(total>15);
const paged=[];
const pageReceipts=[];
for(let offset=0;offset<total;offset+=15){
  const page=curlJson(LIST_URL,{...common,paging:"15",offset:String(offset)});
  assert.equal(ok(page.json),true);
  assert.equal(Number(page.json.total),total);
  const rows=page.json.data||[];
  paged.push(...rows);
  pageReceipts.push({offset,count:rows.length,hash:page.hash});
}
const pagedIds=paged.map(rowId);
assert.equal(paged.length,total);
assert.equal(new Set(pagedIds).size,total);

const unpaged=curlJson(LIST_URL,common);
assert.equal(ok(unpaged.json),true);
assert.equal(Number(unpaged.json.total),total);
const unpagedIds=(unpaged.json.data||[]).map(rowId);
assert.equal(unpagedIds.length,total);
assert.deepEqual([...new Set(unpagedIds)].sort(),[...new Set(pagedIds)].sort());

// C. Exchange-side STOP -> RELEASE chronology control.
const reversal=curlJson(LIST_URL,{
  startDate:"20260701",endDate:"20260810",keyword:"川飛能源",response:"json"
});
assert.equal(ok(reversal.json),true);
const stop=(reversal.json.data||[]).find(r=>rowRef(r)==="臺證上一字第1151803156號");
const release=(reversal.json.data||[]).find(r=>rowRef(r)==="臺證上一字第1151803255號");
assert.ok(stop);
assert.ok(release);
assert.match(rowSubject(stop),/停止申報生效/);
assert.doesNotMatch(rowSubject(stop),/解除停止申報生效/);
assert.match(rowSubject(release),/解除停止申報生效/);

// D. Detail API contract for both sides of the reversal.
const expectedFields=["發文機關","發文日期","發文字號","主旨","依據","公告事項"];
const details=[];
for(const [role,row,phrase] of [
  ["STOP",stop,"停止申報生效"],
  ["RELEASE",release,"解除停止申報生效"],
]){
  const detail=curlJson(DETAIL_URL,{id:rowId(row),response:"json"});
  assert.equal(ok(detail.json),true);
  assert.deepEqual(detail.json.fields,expectedFields);
  assert.equal((detail.json.data||[]).length,1);
  assert.match(String(detail.json.data[0][3]||""),new RegExp(phrase));
  assert.equal(String(detail.json.data[0][2]||""),rowRef(row));
  details.push({role,id:rowId(row),referenceNo:rowRef(row),hash:detail.hash,subject:detail.json.data[0][3]});
}

// E. Frozen impossible-keyword empty control.
const empty=curlJson(LIST_URL,{
  startDate:"20260701",endDate:"20260810",
  keyword:"D03__NO_SUCH_OFFICIAL_DOCUMENT__7F3A91B2",
  response:"json"
});
const emptyRows=empty.json.data||[];
const emptyTotal=Number(empty.json.total||0);
const emptySemanticsObserved=
  (ok(empty.json)&&emptyTotal===0&&emptyRows.length===0) ||
  /查無資料|no data/i.test(String(empty.json.stat||empty.json.state||empty.json.status||""));
assert.equal(emptySemanticsObserved,true);

const result={
  schemaVersion:"D03_TWSE_OFFICIAL_DOCUMENT_MACHINE_CONTRACT_V0_1",
  version:VERSION,
  state:"BOUNDED_MACHINE_CONTRACT_PHYSICAL_PASS",
  listEndpoint:LIST_URL,
  detailEndpoint:DETAIL_URL,
  listFields:positive.json.fields,
  detailFields:expectedFields,
  positiveControl:{
    interval:["2026-07-01","2026-08-10"],
    keyword:"減資",
    total:Number(positive.json.total),
    payloadHash:positive.hash,
    lanFa1459Observed:true,
  },
  paginationControl:{
    interval:["2026-07-01","2026-08-10"],
    paging:15,
    total,
    fetched:paged.length,
    uniqueIds:new Set(pagedIds).size,
    duplicateIds:pagedIds.length-new Set(pagedIds).size,
    pageReceipts,
    unpagedKeysetEquivalent:true,
  },
  reversalControl:{
    keyword:"川飛能源",
    stopReferenceNo:rowRef(stop),
    releaseReferenceNo:rowRef(release),
    stopId:rowId(stop),
    releaseId:rowId(release),
    state:"STOP_THEN_RELEASE_PAIR_OBSERVED",
    details,
  },
  emptyControl:{
    state:"SOURCE_LOCAL_EMPTY_SEMANTICS_OBSERVED",
    total:emptyTotal,
    dataCount:emptyRows.length,
    payloadHash:empty.hash,
  },

  // Capability and bounded-query acceptance are not global archive completeness.
  exchangeOfficialDocumentMachineContract:"PHYSICAL_PASS",
  boundedQueryPaginationContract:"PHYSICAL_PASS",
  exchangeReversalChronologyCapability:"PHYSICAL_PASS",
  globalArchiveCompletenessCertified:false,
  crossExchangeCoverageComplete:false,
  knownAtVersionClockCertified:false,
  revisionCoverageComplete:false,
  technicalContinuityCertified:false,
  historyMutationPerformed:false,
  strategyEvaluationPerformed:false,
  selectionAuthority:false,
  finalSelectionEnabled:false,
  livePushEnabled:false,
  capitalImpact:false,
  orderImpact:false,
  system1RuntimeUsed:false,
};

console.log(JSON.stringify(result,null,2));
