import assert from "node:assert/strict";
import {
  D04_A2_EOD_EVIDENCE_EPOCH,
  buildD04A2EodDiagnostic,
  collectD04A2EodDiagnostic,
  monthAnchorsThrough,
  parseFmtqikRawPayload,
} from "../../research/runtime/d04_a2_eod_diagnostic_v0_1.mjs";

function rocDate(date){
  const [y,m,d]=date.split("-").map(Number);
  return `${y-1911}/${String(m).padStart(2,"0")}/${String(d).padStart(2,"0")}`;
}
function rawMonth(anchor, rows){
  return JSON.stringify({
    stat:"OK",
    date:anchor,
    fields:["日期","發行量加權股價指數"],
    data:rows.map(([date,close])=>[rocDate(date),String(close)])
  });
}
function makeRows(startDate,count,start=40000){
  const out=[];
  let d=new Date(startDate+"T12:00:00Z"),i=0;
  while(out.length<count){
    const day=d.getUTCDay();
    if(day!==0&&day!==6) out.push([d.toISOString().slice(0,10),start+i++*10]);
    d=new Date(d.getTime()+86400000);
  }
  return out;
}

assert.deepEqual(monthAnchorsThrough("2026-10-02",3),["20261001","20260901","20260801"]);

const augRows=makeRows("2026-08-03",20,38000);
const sepRows=makeRows("2026-09-01",22,40000).filter(([d])=>d.startsWith("2026-09"));
const octRows=[["2026-10-01",43000],["2026-10-02",43100]];
const aug=parseFmtqikRawPayload(rawMonth("20260801",augRows),"20260801");
const sep=parseFmtqikRawPayload(rawMonth("20260901",sepRows),"20260901");
const oct=parseFmtqikRawPayload(rawMonth("20261001",octRows),"20261001");
assert.match(aug.rawPayloadSha256,/^[a-f0-9]{64}$/);
assert.equal(oct.rows.at(-1).date,"2026-10-02");

const ready=buildD04A2EodDiagnostic({
  marketDate:"2026-10-02",
  observedAt:"2026-10-02T08:31:00Z",
  monthlyPayloads:[oct,sep,aug],
});
assert.equal(ready.state,"EOD_DIAGNOSTIC_READY");
assert.equal(ready.evidenceEpoch,D04_A2_EOD_EVIDENCE_EPOCH);
assert.equal(ready.officialSessionWindow.length,21);
assert.equal(ready.officialSessionWindow.at(-1).date,"2026-10-02");
assert.equal(ready.pointInTimeDecisionEligible,false);
assert.equal(ready.promotionGradeProspectiveDateCount,0);
assert.equal(ready.formalDecisionImpact,false);
assert(Number.isFinite(ready.metrics.dispersion5));
assert(Number.isFinite(ready.metrics.dispersion20));

const notReady=buildD04A2EodDiagnostic({
  marketDate:"2026-10-05",
  observedAt:"2026-10-05T08:31:00Z",
  monthlyPayloads:[oct,sep,aug],
});
assert.equal(notReady.state,"TARGET_DATE_NOT_READY");
assert.equal(notReady.promotionGradeProspectiveDateCount,0);

assert.throws(()=>buildD04A2EodDiagnostic({
  marketDate:"2026-10-02",
  observedAt:"2026-10-03T08:31:00Z",
  monthlyPayloads:[oct,sep,aug],
}),/same Taipei date/);

assert.throws(()=>parseFmtqikRawPayload(JSON.stringify({
  stat:"OK",fields:["日期","發行量加權股價指數"],
  data:[["115/09/30","bad"]]
}),"20260901"),/date\/close invalid/);

{
  const calls=[];
  const raws={
    "20261001":rawMonth("20261001",octRows),
    "20260901":rawMonth("20260901",sepRows),
    "20260801":rawMonth("20260801",augRows),
  };
  const times=[
    "2026-10-02T08:30:00Z",
    "2026-10-02T08:30:01Z","2026-10-02T08:30:02Z",
    "2026-10-02T08:30:03Z","2026-10-02T08:30:04Z",
    "2026-10-02T08:30:05Z","2026-10-02T08:30:06Z",
    "2026-10-02T08:30:07Z",
  ];
  let ti=0;
  const report=await collectD04A2EodDiagnostic({
    marketDate:"2026-10-02",
    now:()=>new Date(times[Math.min(ti++,times.length-1)]),
    fetchImpl:async(url,options)=>{
      calls.push({url,options});
      const anchor=new URL(url).searchParams.get("date");
      return {ok:true,status:200,async text(){return raws[anchor];}};
    }
  });
  assert.equal(calls.length,3);
  assert(calls.every(x=>x.options.method==="GET"));
  assert.equal(report.diagnostic.state,"EOD_DIAGNOSTIC_READY");
  assert.equal(report.rawFiles.length,3);
  assert(report.rawFiles.every(x=>/^[a-f0-9]{64}$/.test(x.rawPayloadSha256)));
  assert.deepEqual(report.safety,{
    httpMethods:["GET"],d1Written:false,workerMutated:false,cloudflareCronChanged:false,
    system1RuntimeUsed:false,existingDecisionClockCollectorChanged:false,formalCoreChanged:false,
  });
}

console.log("D04 A2 EOD diagnostic collector tests passed");
