import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { parseMopsHistoricalMaterialInformationHtmlV0_1 } from "../runtime/mops_revision_source_capability_v0_1.mjs";
import { MOPS_REVISION_CONTROLS_V0_2 } from "../runtime/mops_revision_control_matrix_v0_2.mjs";

const HOST = "mopsov.twse.com.tw";
const URL = "https://mopsov.twse.com.tw/mops/web/ajax_t05st01";
const MONTHS = [1,2,3,4,5,6,7,8,9];
const CUTOFF = "2026-09-30";

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
function sha256(text){ return createHash("sha256").update(text).digest("hex"); }

function curlHistory(stockCode, rocYear, month){
  const args=[
    "--fail","--silent","--show-error","--location","--max-time","30",
    "--request","POST",
    "--header","Content-Type: application/x-www-form-urlencoded",
    "--header","Referer: https://mopsov.twse.com.tw/mops/web/t05st01",
    "--header","User-Agent: System2-MOPSOV-Multi-Control-Reconciliation/0.1",
    "--data-urlencode","firstin=1",
    "--data-urlencode","step=1",
    "--data-urlencode","TYPEK=all",
    "--data-urlencode","co_id="+stockCode,
    "--data-urlencode","year="+rocYear,
    "--data-urlencode","month="+month,
    "--data-urlencode","b_date=",
    "--data-urlencode","e_date=",
    URL,
  ];
  const p=spawnSync("curl",args,{encoding:"utf8",maxBuffer:32*1024*1024});
  if(p.error) throw p.error;
  if(p.status!==0) throw new Error("curl exit "+p.status+" for "+stockCode+"/"+month+": "+String(p.stderr||"").slice(0,500));
  const html=p.stdout;
  const parsed=parseMopsHistoricalMaterialInformationHtmlV0_1({
    html,stockCode,expectedDate:null,baseSubject:null,
  });
  const rows=parsed.rows.filter(x=>x.date && x.seqNo && x.time);
  return {
    stockCode:String(stockCode),
    rocYear:Number(rocYear),
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

const controlGroups=new Map();
for(const control of MOPS_REVISION_CONTROLS_V0_2){
  const key=[control.stockCode,control.rocYear].join("|");
  if(!controlGroups.has(key)){
    controlGroups.set(key,{
      stockCode:String(control.stockCode),
      rocYear:Number(control.rocYear),
      controlIds:[],
      actionFamilies:new Set(),
    });
  }
  const group=controlGroups.get(key);
  group.controlIds.push(control.id);
  group.actionFamilies.add(control.actionFamily);
}

const companies=[];
for(const group of controlGroups.values()){
  const all=curlHistory(group.stockCode,group.rocYear,"all");
  await sleep(750);
  const monthly=[];
  for(const month of MONTHS){
    monthly.push(curlHistory(group.stockCode,group.rocYear,month));
    await sleep(750);
  }

  const allPrefixRows=all.rows.filter(x=>x.date<=CUTOFF);
  const allPrefixKeys=allPrefixRows.map(x=>[x.date,x.time,x.seqNo].join("|")).sort();
  const monthUnion=[...new Set(monthly.flatMap(x=>x.keys))].sort();
  const onlyAll=setDiff(allPrefixKeys,monthUnion);
  const onlyMonths=setDiff(monthUnion,allPrefixKeys);
  const flattened=monthly.flatMap(x=>x.keys);
  const duplicateMonthKeys=[...new Set(flattened.filter((x,i,a)=>a.indexOf(x)!==i))].sort();

  companies.push({
    stockCode:group.stockCode,
    rocYear:group.rocYear,
    controlIds:[...group.controlIds].sort(),
    actionFamilies:[...group.actionFamilies].sort(),
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
    duplicateMonthKeys,
    exactKeysetReconciliation:
      onlyAll.length===0 &&
      onlyMonths.length===0 &&
      duplicateMonthKeys.length===0,
  });
}

const allPass=companies.every(x=>x.exactKeysetReconciliation);
const controlIdsCovered=[...new Set(companies.flatMap(x=>x.controlIds))].sort();
const expectedControlIds=MOPS_REVISION_CONTROLS_V0_2.map(x=>x.id).sort();

const result={
  schemaVersion:"S2_MOPSOV_MULTI_CONTROL_MONTH_SHARD_RECONCILIATION_V0_1",
  sourceHost:HOST,
  months:MONTHS,
  cutoff:CUTOFF,
  companyCount:companies.length,
  controlCount:expectedControlIds.length,
  controlIdsCovered,
  expectedControlIds,
  allControlsCovered:
    controlIdsCovered.length===expectedControlIds.length &&
    controlIdsCovered.every((x,i)=>x===expectedControlIds[i]),
  companies,
  passCompanyCount:companies.filter(x=>x.exactKeysetReconciliation).length,
  exactKeysetReconciliation:allPass,
  boundedIntervalCoverageComplete:false,
  actionFamilyCoverageComplete:false,
  cancellationHistoryComplete:false,
  knownAtVersionClockCertified:false,
  revisionCoverageComplete:false,
  noEventMayBeClaimed:false,
  technicalContinuityCertified:false,
  historyMutationPerformed:false,
  strategyEvaluationPerformed:false,
  capacityRunProduced:false,
  selectionAuthority:false,
  finalSelectionEnabled:false,
  livePushEnabled:false,
  capitalImpact:false,
  orderImpact:false,
  system1RuntimeUsed:false,
};

assert.equal(result.companyCount,4);
assert.equal(result.controlCount,5);
assert.equal(result.allControlsCovered,true);
assert.equal(result.passCompanyCount,4);
assert.equal(result.exactKeysetReconciliation,true);
for(const company of result.companies){
  assert.equal(company.onlyAllCount,0);
  assert.equal(company.onlyMonthShardCount,0);
  assert.equal(company.duplicateMonthKeyCount,0);
}
assert.equal(result.boundedIntervalCoverageComplete,false);
assert.equal(result.knownAtVersionClockCertified,false);
assert.equal(result.revisionCoverageComplete,false);
assert.equal(result.technicalContinuityCertified,false);
assert.equal(result.selectionAuthority,false);
assert.equal(result.system1RuntimeUsed,false);

console.log(JSON.stringify(result,null,2));
