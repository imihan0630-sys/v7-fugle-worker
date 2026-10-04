import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { parseMopsHistoricalMaterialInformationHtmlV0_1 } from "../runtime/mops_revision_source_capability_v0_1.mjs";

const HOST = "mopsov.twse.com.tw";
const URL = "https://mopsov.twse.com.tw/mops/web/ajax_t05st01";
const STOCK = "2330";
const ROC_YEAR = 115;
const MONTHS = [1,2,3,4,5,6,7,8,9];

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
function sha256(text){ return createHash("sha256").update(text).digest("hex"); }

function curlHistory(month){
  const args=[
    "--fail","--silent","--show-error","--location","--max-time","30",
    "--request","POST",
    "--header","Content-Type: application/x-www-form-urlencoded",
    "--header","Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
    "--header","User-Agent: System2-MOPSOV-Month-Shard-Reconciliation/0.1",
    "--data-urlencode","firstin=1",
    "--data-urlencode","step=1",
    "--data-urlencode","TYPEK=all",
    "--data-urlencode","co_id="+STOCK,
    "--data-urlencode","year="+ROC_YEAR,
    "--data-urlencode","month="+month,
    "--data-urlencode","b_date=",
    "--data-urlencode","e_date=",
    URL,
  ];
  const p=spawnSync("curl",args,{encoding:"utf8",maxBuffer:32*1024*1024});
  if(p.error) throw p.error;
  if(p.status!==0) throw new Error("curl exit "+p.status+": "+String(p.stderr||"").slice(0,500));
  const html=p.stdout;
  const parsed=parseMopsHistoricalMaterialInformationHtmlV0_1({
    html,stockCode:STOCK,expectedDate:null,baseSubject:null,
  });
  const rows=parsed.rows.filter(x=>x.date && x.seqNo && x.time);
  return {
    month:String(month),
    bytes:Buffer.byteLength(html),
    payloadSha256:sha256(html),
    rowCount:rows.length,
    keys:rows.map(x=>[x.date,x.time,x.seqNo].join("|")).sort(),
    rows,
    paginationHints:{
      nextPage:/下一頁|下頁|next\s*page/i.test(html),
      pageNo:/pageNo|pageno|currPage|totalPage|total_page|pageIndex/i.test(html),
      step3:/step\s*=\s*["']?3|step=3/i.test(html),
    },
  };
}

function setDiff(a,b){
  const bs=new Set(b);
  return a.filter(x=>!bs.has(x));
}

const all = curlHistory("all");
await sleep(750);
const monthly=[];
for(const m of MONTHS){
  monthly.push(curlHistory(m));
  await sleep(750);
}

const cutoff="2026-09-30";
const allPrefixRows=all.rows.filter(x=>x.date<=cutoff);
const allPrefixKeys=allPrefixRows.map(x=>[x.date,x.time,x.seqNo].join("|")).sort();
const monthUnion=[...new Set(monthly.flatMap(x=>x.keys))].sort();

const onlyAll=setDiff(allPrefixKeys,monthUnion);
const onlyMonths=setDiff(monthUnion,allPrefixKeys);
const duplicateMonthKeys=monthly.flatMap(x=>x.keys).filter((x,i,a)=>a.indexOf(x)!==i);

const result={
  schemaVersion:"S2_MOPSOV_MONTH_SHARD_RECONCILIATION_V0_1",
  sourceHost:HOST,
  stockCode:STOCK,
  rocYear:ROC_YEAR,
  months:MONTHS,
  cutoff,
  allQuery:{
    bytes:all.bytes,
    payloadSha256:all.payloadSha256,
    totalRowCount:all.rowCount,
    prefixRowCount:allPrefixKeys.length,
    paginationHints:all.paginationHints,
  },
  monthly:monthly.map(x=>({
    month:Number(x.month),
    bytes:x.bytes,
    payloadSha256:x.payloadSha256,
    rowCount:x.rowCount,
    paginationHints:x.paginationHints,
  })),
  monthlyUnionCount:monthUnion.length,
  onlyAllCount:onlyAll.length,
  onlyMonthShardCount:onlyMonths.length,
  duplicateMonthKeyCount:duplicateMonthKeys.length,
  onlyAll,
  onlyMonths,
  exactKeysetReconciliation:
    onlyAll.length===0 &&
    onlyMonths.length===0 &&
    duplicateMonthKeys.length===0,
  boundedIntervalCoverageComplete:false,
  revisionCoverageComplete:false,
  knownAtVersionClockCertified:false,
  technicalContinuityCertified:false,
  historyMutationPerformed:false,
  selectionAuthority:false,
  system1RuntimeUsed:false,
};

assert.equal(result.exactKeysetReconciliation,true);
assert.equal(result.onlyAllCount,0);
assert.equal(result.onlyMonthShardCount,0);
assert.equal(result.duplicateMonthKeyCount,0);
assert.equal(result.boundedIntervalCoverageComplete,false);
assert.equal(result.technicalContinuityCertified,false);
assert.equal(result.selectionAuthority,false);

console.log(JSON.stringify(result,null,2));
