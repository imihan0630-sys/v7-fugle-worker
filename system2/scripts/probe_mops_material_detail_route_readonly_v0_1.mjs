import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";

const HOST="https://mopsov.twse.com.tw";
const LIST=HOST+"/mops/web/ajax_t05st01";
const DETAIL=HOST+"/mops/web/ajax_t05sr01_1";
const PAGE_DETAIL=HOST+"/mops/web/t05st01";
const CONTROL=Object.freeze({
  symbol:"2380",
  rocYear:"115",
  effectiveDate:"2026-06-29",
  actionRegex:/減資/,
});

function sha256(value){return createHash("sha256").update(String(value)).digest("hex");}
function stripHtml(value){
  return String(value||"")
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi," ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi," ")
    .replace(/<[^>]+>/g," ")
    .replace(/&nbsp;|&#160;/gi," ")
    .replace(/&amp;/gi,"&").replace(/&lt;/gi,"<").replace(/&gt;/gi,">")
    .replace(/&quot;/gi,'"').replace(/&#39;|&apos;/gi,"'")
    .replace(/\s+/g," ").trim();
}
function runCurl(args){
  const p=spawnSync("curl",[
    "--silent","--show-error","--location","--http1.1","--compressed",
    "--connect-timeout","10","--max-time","30",
    "--retry","2","--retry-delay","1","--retry-all-errors",
    ...args,
    "--write-out","\n__HTTP_STATUS__:%{http_code}\n",
  ],{encoding:"utf8",maxBuffer:32*1024*1024});
  if(p.error) throw p.error;
  const stdout=String(p.stdout||"");
  const marker="\n__HTTP_STATUS__:";
  const pos=stdout.lastIndexOf(marker);
  return {
    body:pos>=0?stdout.slice(0,pos):stdout,
    status:pos>=0?Number(stdout.slice(pos+marker.length).trim()):null,
    transportExit:Number.isInteger(p.status)?p.status:null,
    transportError:p.status===0?null:String(p.stderr||"").slice(0,1000),
  };
}
function postForm(url,fields){
  const args=[
    "--request","POST",
    "--header","Content-Type: application/x-www-form-urlencoded",
    "--header","Origin: "+HOST,
    "--header","Referer: "+HOST+"/mops/web/t05st01",
    "--header","User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
    "--header","Accept: text/html,application/xhtml+xml,*/*;q=0.8",
    "--header","Accept-Language: zh-TW,zh;q=0.9,en;q=0.6",
  ];
  for(const [k,v] of Object.entries(fields)) args.push("--data-urlencode",k+"="+v);
  args.push(url);
  return runCurl(args);
}
function field(raw,name){
  const esc=String(name).replace(/[.*+?^$()|[\]{}\\]/g,"\\$&");
  const patterns=[
    new RegExp(esc+"\\.value\\s*=\\s*['\"]([^'\"]*)['\"]","i"),
    new RegExp("name\\s*=\\s*['\"]"+esc+"['\"][^>]*value\\s*=\\s*['\"]([^'\"]*)['\"]","i"),
  ];
  for(const p of patterns){
    const m=String(raw||"").match(p);
    if(m) return m[1];
  }
  return null;
}
function toIsoDate(year,month,day){
  const y=Number(year),m=Number(month),d=Number(day);
  if(!Number.isInteger(y)||!Number.isInteger(m)||!Number.isInteger(d)) return null;
  const iso=String(y).padStart(4,"0")+"-"+String(m).padStart(2,"0")+"-"+String(d).padStart(2,"0");
  const dt=new Date(iso+"T00:00:00.000Z");
  return Number.isFinite(dt.getTime())&&dt.toISOString().slice(0,10)===iso?iso:null;
}
function dateTokens(value){
  const text=String(value||"");
  const out=new Set();
  for(const m of text.matchAll(/(?<!\d)(\d{3})(?!\d)\s*[年\/.-]\s*(\d{1,2})\s*[月\/.-]\s*(\d{1,2})\s*日?/g)){
    const iso=toIsoDate(Number(m[1])+1911,m[2],m[3]);
    if(iso) out.add(iso);
  }
  for(const m of text.matchAll(/(?<!\d)(\d{4})(?!\d)\s*[年\/.-]\s*(\d{1,2})\s*[月\/.-]\s*(\d{1,2})\s*日?/g)){
    const iso=toIsoDate(m[1],m[2],m[3]);
    if(iso) out.add(iso);
  }
  return [...out].sort();
}

const list=postForm(LIST,{
  firstin:"1",step:"1",TYPEK:"all",co_id:CONTROL.symbol,
  year:CONTROL.rocYear,month:"all",b_date:"",e_date:"",type:"",
});
assert.equal(list.status,200,"list HTTP");
assert.equal(list.transportExit,0,"list transport");

const rowBlocks=[...list.body.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)]
  .map((m)=>m[1])
  .filter((raw)=>{
    const text=stripHtml(raw);
    return text.includes(CONTROL.symbol)&&CONTROL.actionRegex.test(text);
  });

const rows=[];
for(const raw of rowBlocks){
  const text=stripHtml(raw);
  const keys={
    SEQ_NO:field(raw,"SEQ_NO")||field(raw,"seq_no"),
    SPOKE_TIME:field(raw,"SPOKE_TIME")||field(raw,"spoke_time"),
    SPOKE_DATE:field(raw,"SPOKE_DATE")||field(raw,"spoke_date"),
    COMPANY_ID:field(raw,"COMPANY_ID")||field(raw,"company_id")||CONTROL.symbol,
    explicitSkey:field(raw,"skey")||field(raw,"SKEY"),
    TYPEK:field(raw,"TYPEK")||"all",
  };
  const keyReady=Boolean(keys.SEQ_NO&&keys.SPOKE_TIME&&keys.SPOKE_DATE&&keys.COMPANY_ID);
  const derivedSkey=keyReady ? keys.COMPANY_ID+keys.SPOKE_DATE+keys.SEQ_NO : null;
  const detailAttempts=[];

  function inspectDetail(id,detail){
    const detailText=stripHtml(detail.body);
    const tokens=dateTokens(detailText);
    return {
      id,
      httpStatus:detail.status,
      transportExit:detail.transportExit,
      transportError:detail.transportError,
      payloadBytes:Buffer.byteLength(detail.body),
      payloadSha256:sha256(detail.body),
      securityBlocked:/安全性考量|FOR SECURITY REASONS|PAGE CAN NOT BE ACCESSED/.test(detailText),
      dateTokens:tokens,
      effectiveDateObserved:tokens.includes(CONTROL.effectiveDate),
      normalizedTextPrefix:detailText.slice(0,1000),
    };
  }

  if(keyReady){
    const pageParams=new URLSearchParams({
      encodeURIComponent:"1",
      firstin:"true",
      TYPEK:keys.TYPEK||"all",
      step:"2",
      off:"1",
      co_id:keys.COMPANY_ID,
      spoke_date:keys.SPOKE_DATE,
      spoke_time:keys.SPOKE_TIME,
      seq_no:keys.SEQ_NO,
      year:CONTROL.rocYear,
    });
    const pageDetail=runCurl([
      "--header","User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
      "--header","Accept: text/html,application/xhtml+xml,*/*;q=0.8",
      "--header","Accept-Language: zh-TW,zh;q=0.9,en;q=0.6",
      PAGE_DETAIL+"?"+pageParams.toString(),
    ]);
    detailAttempts.push(inspectDetail("T05ST01_STEP2_GET",pageDetail));

    const srDetail=postForm(DETAIL,{
      encodeURIComponent:"1",
      TYPEK:keys.TYPEK||"all",
      step:"1",
      skey:keys.explicitSkey||derivedSkey,
      hhc_co_name:"",
      firstin:"true",
      COMPANY_ID:keys.COMPANY_ID,
      COMPANY_NAME:"",
      SPOKE_DATE:keys.SPOKE_DATE,
      SPOKE_TIME:keys.SPOKE_TIME,
      SEQ_NO:keys.SEQ_NO,
    });
    detailAttempts.push(inspectDetail(
      keys.explicitSkey ? "T05SR01_EXPLICIT_SKEY_POST" : "T05SR01_DERIVED_SKEY_POST",
      srDetail
    ));
  }

  rows.push({
    listSubjectHash:sha256(text),
    listTextPrefix:text.slice(0,500),
    keys,
    derivedSkeyHash:derivedSkey?sha256(derivedSkey):null,
    keyReady,
    detailAttempts,
  });
}

const readyRows=rows.filter((x)=>x.keyReady);
const readableRows=readyRows.filter((x)=>x.detailAttempts.some((d)=>
  d.httpStatus===200&&d.transportExit===0&&!d.securityBlocked&&d.payloadBytes>1000
));
const successfulDetails=readyRows.flatMap((x)=>x.detailAttempts).filter((d)=>
  d.httpStatus===200&&d.transportExit===0&&!d.securityBlocked&&d.payloadBytes>1000
);
const effectiveMatches=successfulDetails.filter((x)=>x.effectiveDateObserved);

console.log(JSON.stringify({
  result:effectiveMatches.length>0
    ?"MOPS_MATERIAL_DETAIL_EFFECTIVE_DATE_CONTROL_OBSERVED"
    :readableRows.length>0
      ?"MOPS_MATERIAL_DETAIL_READABLE_CONTROL_DATE_NOT_OBSERVED"
      :"MOPS_MATERIAL_DETAIL_NOT_READABLE",
  control:CONTROL,
  list:{
    httpStatus:list.status,
    transportExit:list.transportExit,
    payloadBytes:Buffer.byteLength(list.body),
    payloadSha256:sha256(list.body),
  },
  familyRowCount:rows.length,
  keyReadyRowCount:readyRows.length,
  readableRowCount:readableRows.length,
  successfulDetailAttemptCount:successfulDetails.length,
  effectiveDateMatchCount:effectiveMatches.length,
  rows,
  historyMutationPerformed:false,
  strategyEvaluationPerformed:false,
  selectionAuthority:false,
  finalSelectionEnabled:false,
  livePushEnabled:false,
  capitalImpact:false,
  orderImpact:false,
  system1RuntimeUsed:false,
},null,2));

assert.ok(rows.length>0,"expected at least one 2380 reduction-family row");
assert.equal(rows.length,readyRows.length,"every control row should expose the current four detail keys");
assert.equal(readableRows.length,readyRows.length,"every control row should have at least one readable detail route");
assert.equal(effectiveMatches.length>0,true,"at least one detail should mention frozen effective date");
