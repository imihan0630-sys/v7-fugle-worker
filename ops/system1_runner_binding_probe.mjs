import assert from "node:assert/strict";

const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
const apiToken=process.env.CLOUDFLARE_API_TOKEN;
assert.ok(accountId&&apiToken,"Cloudflare secrets required");
const url=`https://api.cloudflare.com/client/v4/accounts/${accountId}/workers/scripts/fugle-test/settings`;
const res=await fetch(url,{headers:{authorization:`Bearer ${apiToken}`,accept:"application/json"},signal:AbortSignal.timeout(30000)});
const text=await res.text();
let data;try{data=JSON.parse(text)}catch{throw new Error("settings non-json "+res.status)}
assert.equal(res.ok,true,"settings HTTP "+res.status);
assert.equal(data?.success,true,"settings success != true");
const bindings=Array.isArray(data?.result?.bindings)?data.result.bindings:[];
const d1=bindings.find(x=>x?.name==="V7_DB");
const kv=bindings.find(x=>x?.name==="STOCKS_KV");
const d1Id=d1?.id||d1?.database_id||null;
const kvId=kv?.namespace_id||kv?.id||null;
assert.ok(d1Id,"V7_DB id unavailable");
assert.ok(kvId,"STOCKS_KV namespace id unavailable");
console.log(JSON.stringify({
  ok:true,
  worker:"fugle-test",
  d1Binding:{name:d1?.name,type:d1?.type,idAvailable:!!d1Id},
  kvBinding:{name:kv?.name,type:kv?.type,namespaceIdAvailable:!!kvId},
  bindingNames:bindings.map(x=>({name:x?.name,type:x?.type})).filter(x=>["V7_DB","STOCKS_KV"].includes(x.name)),
  noValuesPrinted:true,
  readOnly:true,
  system2Touched:false
}));
