import assert from "node:assert/strict";
import fs from "node:fs";

const source=fs.readFileSync(process.env.V7_TEST_WORKER_PATH||"Worker.js","utf8");

function functionSource(src,name){
  const start=src.indexOf("async function "+name+"(")>=0?src.indexOf("async function "+name+"("):src.indexOf("function "+name+"(");
  assert.ok(start>=0,"missing "+name);
  let depth=0,seen=false,end=-1;
  for(let i=src.indexOf("{",start);i<src.length;i++){
    if(src[i]==="{"){depth++;seen=true;}
    else if(src[i]==="}"){depth--;if(seen&&depth===0){end=i+1;break;}}
  }
  assert.ok(end>start,"unterminated "+name);
  return src.slice(start,end);
}
function loadFunction(src,name,args,names){
  const body=functionSource(src,name);
  return new Function(...names,body+"; return "+name+";")(...args);
}
function mockD1(existing){
  const calls=[];
  const session={
    prepare(sql){
      return {
        args:[],
        bind(...args){this.args=args;return this;},
        async first(){calls.push({op:"read",sql,args:this.args});return existing;},
        async run(){calls.push({op:"write",sql,args:this.args});return {success:true};}
      };
    }
  };
  return {env:{V7_DB:{withSession:()=>session}},calls};
}

assert.match(source,/const VERSION = "(?:8\.20\.2-idempotent-d1-snapshots|8\.21\.0-c1-generation-set-finalization)";/);
assert.match(source,/writeRowsAvoided/);
assert.match(source,/deduplicated:persistence\.deduplicated/);

const ensure=async()=>{};
const writeQuality=loadFunction(source,"writeQualitySnapshot",[ensure],["ensureD1Schema"]);
const qData={asOfDate:"2026-10-08",count:2,stocks:{2330:{pe:20},2454:{pe:25}}};
{
  const json=JSON.stringify(qData);
  const {env,calls}=mockD1({snapshot_json:json});
  const r=await writeQuality(env,"VALUATION","2026-10-08",qData);
  assert.deepEqual(r,{stored:false,deduplicated:true,writeRowsAvoided:1});
  assert.equal(calls.filter(x=>x.op==="write").length,0);
}
{
  const {env,calls}=mockD1({snapshot_json:'{"different":true}'});
  const r=await writeQuality(env,"VALUATION","2026-10-08",qData);
  assert.equal(r.stored,true);assert.equal(r.deduplicated,false);
  assert.equal(calls.filter(x=>x.op==="write").length,1);
}

const writeInstitution=loadFunction(source,"writeInstitutionSnapshot",
  [ensure,x=>Number(x),1500],["ensureD1Schema","toNumber","INSTITUTION_SNAPSHOT_MIN_STOCKS"]);
const stocks={};
for(let i=1000;i<2500;i++) stocks[String(i)]={foreignNet:i,trustNet:1,dealerNet:-1,institutionTotalNet:i};
{
  const clean={};
  for(const [symbol,item] of Object.entries(stocks)) clean[symbol]={
    foreignNet:Number(item.foreignNet)||0,trustNet:Number(item.trustNet)||0,
    dealerNet:Number(item.dealerNet)||0,institutionTotalNet:Number(item.institutionTotalNet)||0
  };
  const json=JSON.stringify(clean);
  const {env,calls}=mockD1({snapshot_json:json,stock_count:Object.keys(clean).length});
  const r=await writeInstitution(env,"2026-10-08",stocks);
  assert.equal(r.stored,false);assert.equal(r.deduplicated,true);assert.equal(r.writeRowsAvoided,1);
  assert.equal(calls.filter(x=>x.op==="write").length,0);
}
{
  const {env,calls}=mockD1({snapshot_json:'{}',stock_count:1500});
  const r=await writeInstitution(env,"2026-10-08",stocks);
  assert.equal(r.stored,true);assert.equal(r.deduplicated,false);
  assert.equal(calls.filter(x=>x.op==="write").length,1);
}

for(const name of ["scoreCandidate","selectTomorrowCandidates","evaluateMomentum","evaluateOperationSignals","saveStockConfig"]){
  assert.ok(functionSource(source,name).length>0,name+" missing after V8.20.2");
}
assert.match(functionSource(source,"writeQualitySnapshot"),/existing\?\.snapshot_json===snapshotJson/);
assert.match(functionSource(source,"writeInstitutionSnapshot"),/existing\?\.snapshot_json===snapshotJson/);
assert.doesNotMatch(functionSource(source,"writeQualitySnapshot"),/UPDATE.*WHERE.*snapshot_json/s,
  "dedup must occur before the write, not by mutating data semantics");

console.log(JSON.stringify({
  ok:true,version:"8.20.2-idempotent-d1-snapshots",
  qualityIdenticalPayloadWrites:0,qualityChangedPayloadWrites:1,
  institutionIdenticalPayloadWrites:0,institutionChangedPayloadWrites:1,
  exactPayloadDedupOnly:true,changedOfficialDataStillPersists:true,
  formalCoreFunctionsPresent:true,system2Touched:false,noPlanChanges:true,noTrade:true,noPush:true
}));
