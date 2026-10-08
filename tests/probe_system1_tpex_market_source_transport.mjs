import https from "node:https";

const marketDate=String(process.env.TPEX_PROBE_DATE||"2026-10-08");
const slash=marketDate.replaceAll("-","/");
const dailyUrl=`https://www.tpex.org.tw/www/zh-tw/afterTrading/dailyQuotes?date=${encodeURIComponent(slash)}&id=&response=json`;
const openapiUrl="https://www.tpex.org.tw/openapi/v1/tpex_mainboard_daily_close_quotes";
const headers={
  "Accept":"application/json,text/plain,*/*",
  "User-Agent":"Mozilla/5.0 System1-Market-Source-Probe/0.1",
  "Referer":"https://www.tpex.org.tw/zh-tw/mainboard/trading/info/pricing.html",
  "Cache-Control":"no-cache"
};

function normalizeDate(v){
  const d=String(v||"").replace(/\D/g,"");
  if(d.length===7)return `${Number(d.slice(0,3))+1911}-${d.slice(3,5)}-${d.slice(5,7)}`;
  if(d.length===8)return `${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)}`;
  return null;
}
function ordinary(v){return /^[1-9][0-9]{3}$/.test(String(v||"").trim());}
function validate(kind,payload){
  if(kind==="OPENAPI"){
    if(!Array.isArray(payload))return {valid:false,reason:"NOT_ARRAY",count:0};
    const rows=payload.filter(r=>ordinary(r?.SecuritiesCompanyCode)&&normalizeDate(r?.Date)===marketDate);
    return {valid:rows.length>=450,count:rows.length,payloadDate:rows.length?marketDate:null,
      sample:rows.slice(0,2).map(r=>({symbol:r.SecuritiesCompanyCode,date:r.Date,close:r.Close}))};
  }
  const tables=Array.isArray(payload?.tables)?payload.tables:[];
  const table=tables.find(t=>Array.isArray(t?.fields)&&Array.isArray(t?.data)&&t.fields.includes("代號"));
  if(!table)return {valid:false,reason:"TABLE_MISSING",count:0,payloadDate:normalizeDate(payload?.date)};
  const si=table.fields.indexOf("代號");
  const count=table.data.filter(r=>ordinary(r?.[si])).length;
  const payloadDate=normalizeDate(payload?.date||table?.date);
  return {valid:count>=450&&payloadDate===marketDate,count,payloadDate,
    fields:table.fields.slice(0,12),sample:table.data.slice(0,2).map(r=>r.slice(0,6))};
}
async function byFetch(url,kind){
  try{
    const r=await fetch(url,{method:"GET",headers,redirect:"follow",signal:AbortSignal.timeout(45000)});
    const text=await r.text();
    let payload=null,parseError=null;try{payload=JSON.parse(text);}catch(e){parseError=String(e?.message||e);}
    return {transport:"FETCH",kind,status:r.status,ok:r.ok,contentType:r.headers.get("content-type"),
      bytes:Buffer.byteLength(text),parseError,validation:payload?validate(kind,payload):null,bodyPrefix:text.slice(0,120)};
  }catch(e){return {transport:"FETCH",kind,status:null,ok:false,error:String(e?.message||e),cause:String(e?.cause?.code||"")};}
}
function byHttps(url,kind){
  return new Promise(resolve=>{
    const req=https.get(url,{headers,timeout:45000},res=>{
      const chunks=[];res.on("data",c=>chunks.push(c));res.on("end",()=>{
        const text=Buffer.concat(chunks).toString("utf8");let payload=null,parseError=null;
        try{payload=JSON.parse(text);}catch(e){parseError=String(e?.message||e);}
        resolve({transport:"HTTPS",kind,status:res.statusCode,ok:res.statusCode>=200&&res.statusCode<300,
          contentType:res.headers["content-type"]||null,bytes:Buffer.byteLength(text),parseError,
          validation:payload?validate(kind,payload):null,bodyPrefix:text.slice(0,120)});
      });
    });
    req.on("timeout",()=>req.destroy(new Error("HTTPS_TIMEOUT")));
    req.on("error",e=>resolve({transport:"HTTPS",kind,status:null,ok:false,error:String(e?.message||e),cause:String(e?.code||"")}));
  });
}

const receipts=[];
for(const [url,kind] of [[dailyUrl,"DAILY_QUOTES"],[openapiUrl,"OPENAPI"]]){
  receipts.push(await byFetch(url,kind));
  receipts.push(await byHttps(url,kind));
}
const viable=receipts.filter(x=>x.ok&&x.validation?.valid===true);
console.log(JSON.stringify({
  result:viable.length?"PASS_AT_LEAST_ONE_CANONICAL_TPEX_TRANSPORT":"BLOCKED_NO_CANONICAL_TPEX_TRANSPORT",
  marketDate,dailyUrl,openapiUrl,receipts,
  viable:viable.map(x=>({transport:x.transport,kind:x.kind,status:x.status,count:x.validation.count})),
  d1Mutation:false,kvMutation:false,selection:false,trade:false,push:false
},null,2));
if(!viable.length)process.exitCode=1;
