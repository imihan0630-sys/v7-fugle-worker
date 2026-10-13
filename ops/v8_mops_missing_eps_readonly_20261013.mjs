// Verify exact missing Q2/Q1 MOPS per-company EPS at source, no production writes.
import {readFile,mkdir,writeFile} from "node:fs/promises";
import {createHash} from "node:crypto";
import {fetchBufferedOfficialSource} from "../tests/official_source_fetch_v0_1.mjs";
const target="2026-10-12",symbols=["6226","2617"],year=2026,quarter=2;
const output={schema:"V8_ACTUAL_MISSING_EPS_MOPS_VERIFICATION_V0_1",observedAt:new Date().toISOString(),
 targetDate:target,year,quarter,readOnly:true,noD1Write:true,noKVWrite:true,noPlanChanges:true,results:{},complete:false};
const source=await readFile("Worker.js","utf8");
const validator=await import("data:text/javascript;base64,"+Buffer.from(source+"\nexport {parseMopsQuarterEpsHtml,validateOfficialQualityData};").toString("base64"));
const officialUrl="https://mopsov.twse.com.tw/mops/web/ajax_t164sb04";
async function get(symbol,q){
 const params=new URLSearchParams({encodeURIComponent:"1",step:"1",firstin:"1",off:"1",TYPEK:"all",isnew:"false",
   co_id:symbol,year:String(year-1911),season:String(q).padStart(2,"0")});
 const resp=await fetchBufferedOfficialSource(officialUrl,{method:"POST",headers:{"content-type":"application/x-www-form-urlencoded"},
   body:params,timeoutMs:65000,transport:"node-https"},{maxAttempts:2});
 const html=await resp.text();if(html.length<150)throw Error("MOPS_HTML_TOO_SMALL");
 return {html,sha256:createHash("sha256").update(html).digest("hex")};
}
try{
 const reports=[];
 for(const symbol of symbols){
   const current=await get(symbol,quarter);
   const previous=await get(symbol,quarter-1);
   const entry={sourceUrl:officialUrl,symbol,html:current.html,previousQuarterHtml:previous.html};
   reports.push(entry);
   const now=validator.parseMopsQuarterEpsHtml(current.html,symbol,year,quarter);
   const prior=validator.parseMopsQuarterEpsHtml(previous.html,symbol,year,quarter-1);
   output.results[symbol]={Q2EPS:now.quarterEPS,Q1EPS:prior.quarterEPS,reportedYoY:now.epsYoY,
      q2Verified:now.quarterEpsVerified===true,sourceSha256:{q2:current.sha256,q1:previous.sha256}};
 }
 const safe=validator.validateOfficialQualityData({kind:"QUARTER_EPS",year,quarter,reports},target);
 for(const symbol of symbols){
    output.results[symbol].validatedByProductionLogic=safe.stocks?.[symbol]?.quarterEpsVerified===true&&
      safe.stocks?.[symbol]?.previousQuarterEpsVerified===true;
 }
 output.complete=symbols.every(s=>output.results[s].validatedByProductionLogic);
 if(!output.complete)process.exitCode=2;
}catch(error){output.error=String(error?.message||error).slice(0,480);process.exitCode=2;}
finally{
 await mkdir("artifacts",{recursive:true});
 await writeFile("artifacts/v8-verified-mops-q2eps-missing-20261012.json",JSON.stringify(output,null,2)+"\n");
 console.log("V8_ORIGINAL_MOPS_EPS_MISSING_VERIFICATION="+JSON.stringify(output));
}
