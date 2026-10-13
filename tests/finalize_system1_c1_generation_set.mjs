const origin="https://fugle-test.imihan0630.workers.dev";
const token=String(process.env.V7_ADMIN_TOKEN||"").trim();
if(!token) throw new Error("V7_ADMIN_TOKEN required");
const headers={"x-admin-token":token,"accept":"application/json","content-type":"application/json","cache-control":"no-cache"};
const taiwanDate=()=>new Intl.DateTimeFormat("en-CA",{timeZone:"Asia/Taipei",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
const shift=(date,days)=>new Date(Date.parse(date+"T00:00:00Z")+days*86400000).toISOString().slice(0,10);
async function call(path,options={}){
  const response=await fetch(origin+path,{...options,headers,signal:AbortSignal.timeout(45000)});
  if([401,403].includes(response.status)) throw new Error("FINALIZATION_AUTHORIZATION_REJECTED");
  const body=await response.json().catch(()=>null);
  if(!response.ok) throw new Error("FINALIZATION_HTTP_"+response.status+":"+String(body?.status||body?.error||"unknown"));
  return body;
}
const today=taiwanDate(),target=shift(today,-1);
const scan=await call("/api/scan/status");
if(scan?.scanDate!==target){
  console.log(JSON.stringify({ok:true,skipped:true,reason:"NO_PREVIOUS_CALENDAR_DATE_FORMAL_SCAN",today,target,formalScanDate:scan?.scanDate||null,
    historicalBackfillPerformed:false,noSelection:true,noPlanChanges:true,noTrade:true,noPush:true}));
  process.exit(0);
}
const result=await call("/api/research/c1-generation-finalize",{method:"POST",body:JSON.stringify({scanDate:target})});
if(result.status!=="FINALIZED_VERIFIED") throw new Error("FINALIZATION_NOT_VERIFIED:"+String(result.status));
const readback=await call("/api/research/c1-generation-finalization?scanDate="+encodeURIComponent(target));
if(readback.status!=="FINALIZED_VERIFIED"||readback.receipt?.receiptDigest!==result.receipt?.receiptDigest)
  throw new Error("FINALIZATION_READBACK_MISMATCH");
console.log(JSON.stringify({ok:true,scanDate:target,status:readback.status,
  finalizationReceiptId:readback.receipt.finalizationReceiptId,generationCount:readback.receipt.generationCount,
  generationSetDigest:readback.receipt.generationSetDigest,producerRegistryVersion:readback.receipt.producerRegistryVersion,
  postFinalizationViolationCount:readback.postFinalizationViolationCount,historicalBackfillPerformed:false,
  noSelection:true,noPlanChanges:true,noTrade:true,noPush:true}));
