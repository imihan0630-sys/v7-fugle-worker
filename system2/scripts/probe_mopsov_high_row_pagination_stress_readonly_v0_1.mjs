import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { parseMopsHistoricalMaterialInformationHtmlV0_1 } from "../runtime/mops_revision_source_capability_v0_1.mjs";

const URL="https://mopsov.twse.com.tw/mops/web/ajax_t05st01";
const ROC_YEAR=115;
const MONTHS=[1,2,3,4,5,6,7,8,9];
const CUTOFF="2026-09-30";

// Frozen before physical run. Includes the prior 2330 high-row control plus
// other large / frequently disclosing ordinary equities across industries.
const CANDIDATES=["2330","2317","2303","2454","2382","3711","2881","2882","2891","3231","3008"];
const TOP_N=3;
const HIGH_ROW_THRESHOLD=150;

function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
function sha256(text){return createHash("sha256").update(text).digest("hex");}
function setDiff(a,b){const bs=new Set(b);return a.filter(x=>!bs.has(x));}

function curlHistory(stockCode,month){
  const args=[
    "--fail","--silent","--show-error","--location","--max-time","30",
    "--request","POST",
    "--header","Content-Type: application/x-www-form-urlencoded",
    "--header","Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
    "--header","User-Agent: System2-MOPSOV-High-Row-Stress/0.1",
    "--data-urlencode","firstin=1",
    "--data-urlencode","step=1",
    "--data-urlencode","TYPEK=all",
    "--data-urlencode","co_id="+stockCode,
    "--data-urlencode","year="+ROC_YEAR,
    "--data-urlencode","month="+month,
    "--data-urlencode","b_date=",
    "--data-urlencode","e_date=",
    URL,
  ];
  const p=spawnSync("curl",args,{encoding:"utf8",maxBuffer:48*1024*1024});
  if(p.error) throw p.error;
  if(p.status!==0) throw new Error("curl exit "+p.status+" for "+stockCode+"/"+month+": "+String(p.stderr||"").slice(0,500));
  const html=p.stdout;
  const parsed=parseMopsHistoricalMaterialInformationHtmlV0_1({
    html,stockCode,expectedDate:null,baseSubject:null,
  });
  const rows=parsed.rows.filter(x=>x.date && x.time && x.seqNo);
  return {
    stockCode,
    month:String(month),
    bytes:Buffer.byteLength(html),
    payloadSha256:sha256(html),
    rowCount:rows.length,
    rows,
    keys:rows.map(x=>[x.date,x.time,x.seqNo].join("|")).sort(),
    paginationHints:{
      nextPage:/下一頁|下頁|next\s*page/i.test(html),
      pageNo:/pageNo|pageno|currPage|totalPage|total_page|pageIndex/i.test(html),
      step3:/step\s*=\s*["']?3|step=3/i.test(html),
    },
  };
}

const discovery=[];
for(let i=0;i<CANDIDATES.length;i+=1){
  const all=curlHistory(CANDIDATES[i],"all");
  const prefixRows=all.rows.filter(x=>x.date<=CUTOFF);
  discovery.push({
    stockCode:CANDIDATES[i],
    bytes:all.bytes,
    payloadSha256:all.payloadSha256,
    totalRowCount:all.rowCount,
    prefixRowCount:prefixRows.length,
    paginationHints:all.paginationHints,
    all,
  });
  if(i<CANDIDATES.length-1) await sleep(600);
}

const ranked=[...discovery].sort((a,b)=>
  b.prefixRowCount-a.prefixRowCount || a.stockCode.localeCompare(b.stockCode)
);
const selected=ranked.slice(0,TOP_N);
const stressResults=[];

for(let s=0;s<selected.length;s+=1){
  const item=selected[s];
  const monthly=[];
  for(let i=0;i<MONTHS.length;i+=1){
    monthly.push(curlHistory(item.stockCode,MONTHS[i]));
    await sleep(600);
  }
  const allPrefixRows=item.all.rows.filter(x=>x.date<=CUTOFF);
  const allPrefixKeys=allPrefixRows.map(x=>[x.date,x.time,x.seqNo].join("|")).sort();
  const monthUnion=[...new Set(monthly.flatMap(x=>x.keys))].sort();
  const flat=monthly.flatMap(x=>x.keys);
  const duplicates=[...new Set(flat.filter((x,i,a)=>a.indexOf(x)!==i))].sort();
  const onlyAll=setDiff(allPrefixKeys,monthUnion);
  const onlyMonths=setDiff(monthUnion,allPrefixKeys);
  stressResults.push({
    stockCode:item.stockCode,
    allPrefixRowCount:allPrefixKeys.length,
    monthlyUnionCount:monthUnion.length,
    onlyAllCount:onlyAll.length,
    onlyMonthShardCount:onlyMonths.length,
    duplicateMonthKeyCount:duplicates.length,
    onlyAll,
    onlyMonths,
    duplicateMonthKeys:duplicates,
    allPaginationHints:item.paginationHints,
    monthPaginationHints:monthly.map(x=>({month:Number(x.month),rowCount:x.rowCount,paginationHints:x.paginationHints})),
    exactKeysetReconciliation:
      onlyAll.length===0 &&
      onlyMonths.length===0 &&
      duplicates.length===0,
  });
}

const result={
  schemaVersion:"S2_MOPSOV_HIGH_ROW_PAGINATION_STRESS_V0_1",
  sourceHost:"mopsov.twse.com.tw",
  rocYear:ROC_YEAR,
  cutoff:CUTOFF,
  frozenCandidates:CANDIDATES,
  discovery:ranked.map(x=>({
    stockCode:x.stockCode,
    totalRowCount:x.totalRowCount,
    prefixRowCount:x.prefixRowCount,
    bytes:x.bytes,
    paginationHints:x.paginationHints,
  })),
  selectedTopN:TOP_N,
  selectedSymbols:selected.map(x=>x.stockCode),
  maxPrefixRowCount:selected[0]?.prefixRowCount||0,
  highRowThreshold:HIGH_ROW_THRESHOLD,
  highRowStressObserved:(selected[0]?.prefixRowCount||0)>=HIGH_ROW_THRESHOLD,
  stressResults,
  passCount:stressResults.filter(x=>x.exactKeysetReconciliation).length,
  exactKeysetReconciliation:stressResults.length===TOP_N && stressResults.every(x=>x.exactKeysetReconciliation),
  anyPaginationHint:[
    ...discovery.flatMap(x=>Object.values(x.paginationHints)),
    ...stressResults.flatMap(x=>x.monthPaginationHints.flatMap(m=>Object.values(m.paginationHints))),
  ].some(Boolean),

  boundedIntervalCoverageComplete:false,
  knownAtVersionClockCertified:false,
  revisionCoverageComplete:false,
  noEventMayBeClaimed:false,
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

assert.equal(result.highRowStressObserved,true);
assert.equal(result.passCount,TOP_N);
assert.equal(result.exactKeysetReconciliation,true);
for(const row of result.stressResults){
  assert.equal(row.onlyAllCount,0);
  assert.equal(row.onlyMonthShardCount,0);
  assert.equal(row.duplicateMonthKeyCount,0);
}
assert.equal(result.revisionCoverageComplete,false);
assert.equal(result.technicalContinuityCertified,false);
assert.equal(result.selectionAuthority,false);
assert.equal(result.system1RuntimeUsed,false);

console.log(JSON.stringify(result,null,2));
