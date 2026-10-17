// One-shot, original TWSE electronic report book source evidence for 5340 2026Q2.
// Direct official host only, never trading or changing Cloudflare/D1/KV/config.
// No API secret. No dynamic untrusted URLs. PDF stays runner-local; artifact is digest+flags.
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {execFileSync} from "node:child_process";
import {mkdir,writeFile} from "node:fs/promises";
import {pathToFileURL} from "node:url";

export const SOURCE="https://doc.twse.com.tw";
export const INDEX_PATH="/server-java/t57sb01?co_id=5340&colorchg=1&mtype=A&step=1&year=115";
export const ORIGINAL_FILENAME="202602_5340_AI2.pdf";
export const EXPECTED_UPLOAD="115/08/06 16:36:32";
export const TARGET="2026Q2";
const UA="Mozilla/5.0 (compatible; S1-S2-PIT-Original-Source-ReadOnly/1.0)";
const MAXPDF=2*1024*1024;

export function verifyOfficialIndex(html){
 assert.equal(typeof html,"string");
 if(!html.includes(ORIGINAL_FILENAME))throw Error("OFFICIAL_PDF_INDEX_FILE_MISSING");
 // This document's original registration; never substitute a third-party search date.
 const dateAroundFile=html.indexOf(ORIGINAL_FILENAME);
 const vicinity=html.slice(Math.max(0,dateAroundFile-500),dateAroundFile+800).replace(/<[^>]+>/g," ").replace(/\s+/g," ");
 if(!vicinity.includes(EXPECTED_UPLOAD))throw Error("OFFICIAL_Q2_UPLOAD_TIMESTAMP_UNVERIFIED");
 const compact=vicinity.replace(/\s+/g,"").replace(/&nbsp;/gi,"");
 const indexBasisTextVerified=compact.includes("IFRSs個別財報");
 if(!vicinity.includes("5340"))throw Error("OFFICIAL_Q2_ISSUER_NOT_IN_INDEX");
 // Official e-book may encode Chinese as HTML entities; actual PDF is authoritative.
 return {file:ORIGINAL_FILENAME,uploadRocTaipei:EXPECTED_UPLOAD,
   basis:indexBasisTextVerified?"INDIVIDUAL":"RAW_HTML_BASIS_UNVERIFIED",
   indexBasisTextVerified,firstKnownAtCertified:false,issuerPublicationTimeCertified:false};
}

export function pickDirectTwsePdfPath(html){
 assert.equal(typeof html,"string");
 // The official form's step 9 answer links /pdf/*.pdf, no third-party or script links.
 const names=[...html.matchAll(/(?:href\s*=\s*["']|window\.location(?:\.href)?\s*=\s*["'])\s*(\/pdf\/[^"'<>?#\s]+\.pdf)/gi)]
  .map(x=>x[1].replaceAll("&amp;","&"));
 const unique=[...new Set(names)];
 if(unique.length!==1)throw Error("OFFICIAL_PDF_DOWNLOAD_LINK_NOT_UNIQUE");
 const p=unique[0];
 if(!p.includes("202602_5340_AI2")||p.includes("..")||p.includes("%")||
    !/^\/pdf\/[a-zA-Z0-9_./-]+\.pdf$/.test(p))
   throw Error("OFFICIAL_PDF_DOWNLOAD_LINK_REJECTED");
 return p;
}

export function describeExtractedPdf(rawText){
 if(typeof rawText!=="string"||rawText.length<2000)
  return {state:"ORIGINAL_PDF_TEXT_UNAVAILABLE",textLength:rawText?.length||0};
 const t=rawText.replace(/\r/g,"");
 const keywords=["建榮","個別財務","個體財務","合併財務","子公司","無子公司",
  "編製基礎","財務報告編製","會計師核閱","基本每股盈餘","稀釋每股盈餘",
  "民國115","民國一一五"];
 const found=Object.fromEntries(keywords.map(k=>[k,t.includes(k)]));
 const lines=t.split("\n");
 const excerpts=[];
 for(let i=0;i<lines.length;i++){
  if(/編製基礎|無子公司|子公司|個別財務|個體財務|基本每股盈餘|核閱報告/.test(lines[i])&&lines[i].trim()){
   // Clips are hints only, never a parser acceptance; bound to avoid raw financial document leakage.
   const v=lines[i].replace(/\s+/g," ").trim().slice(0,190);
   if(!excerpts.includes(v))excerpts.push(v);
  }
  if(excerpts.length>=18)break;
 }
 const epsIndex=lines.findIndex(x=>/9750\s*基本每股盈餘/.test(x));
 const epsContext=epsIndex>=0 ? lines.slice(Math.max(0,epsIndex-32),epsIndex+3)
   .map(x=>x.replace(/\s+/g," ").trim()).filter(Boolean).join(" | ").slice(0,3700):null;
 const targets=["財務報告編製準則","財務報告之編製基礎","公司沿革","無子公司","子公司","個別財務","個體財務","合併財務"];
 const basisEvidence=targets.map(k=>{
   const idx=t.indexOf(k);
   return idx<0?null:{term:k,snippet:t.slice(Math.max(0,idx-260),idx+400)
     .replace(/\s+/g," ").slice(0,570)};
 }).filter(Boolean);
 const epsRaw=epsIndex>=0?lines[epsIndex].replace(/\s+/g," ").trim():null;
 return {state:found["建榮"]&&(found["個別財務"]||found["個體財務"])?
    "ORIGINAL_PDF_TEXT_BASIS_OBSERVED_NOT_LEGALLY_ADMITTED":
    "ORIGINAL_PDF_TEXT_REQUIRES_MANUAL_BASIS_REVIEW",
  flags:found,textLength:t.length,selectedLines:excerpts,epsRaw,epsContext,basisEvidence,
  // Form index timestamp is exact recorded upload, not necessarily earliest market visibility.
  asOfFirstPublicationCertified:false,formalEligible:false,system2PitCertified:false};
}

async function get(url,options={}){
 const u=new URL(url);
 if(u.origin!==SOURCE)throw Error("OFFICIAL_HOST_SCOPE_REJECTED");
 const response=await fetch(u,{redirect:"manual",headers:{"user-agent":UA,"accept":"text/html,application/pdf,*/*",...(options.headers||{})},
  method:options.method||"GET",...(options.body?{body:options.body}:{}),signal:AbortSignal.timeout(35000)});
 if(!response.ok||response.status>=300)throw Error("OFFICIAL_HTTP_"+response.status);
 return response;
}

export async function main(){
 const result={schema:"S1_5340_2026Q2_TWSE_EBOOK_ORIGINAL_SOURCE_RECEIPT_V0_1",
  stock:"5340",period:TARGET,observedAt:new Date().toISOString(),officialIndexUrl:SOURCE+INDEX_PATH,
  filename:ORIGINAL_FILENAME,expectedUploadTaipei:EXPECTED_UPLOAD,
  readOnly:true,noWorkerTraffic:true,noCloudflare:true,noD1Kv:true,noTrade:true,
  noSelection:true,noAutomatedPITPromotion:true,state:"INIT"};
 try{
  const index=await(await get(SOURCE+INDEX_PATH)).text();
  result.index=verifyOfficialIndex(index);
  const form=new URLSearchParams({step:"9",kind:"A",co_id:"5340",filename:ORIGINAL_FILENAME});
  const intermediate=await get(SOURCE+"/server-java/t57sb01",{
   method:"POST",headers:{"content-type":"application/x-www-form-urlencoded",
     "referer":SOURCE+INDEX_PATH},body:form});
  const html=await intermediate.text();
  const directPath=pickDirectTwsePdfPath(html);
  result.originalDownloadPath=directPath; // official relative-only path
  const pdfResponse=await get(SOURCE+directPath,{headers:{"referer":SOURCE+"/server-java/t57sb01"}});
  const pdf=Buffer.from(await pdfResponse.arrayBuffer());
  if(pdf.length<30000||pdf.length>MAXPDF||pdf.subarray(0,5).toString()!=="%PDF-")
    throw Error("OFFICIAL_PDF_BODY_INVALID");
  result.pdfBytes=pdf.length;
  result.pdfSha256=createHash("sha256").update(pdf).digest("hex");
  await mkdir("artifacts",{recursive:true});
  await writeFile("artifacts/_s1_5340_2026q2_official_original_temporary.pdf",pdf);
  try{
   const t=execFileSync("pdftotext",["-layout","artifacts/_s1_5340_2026q2_official_original_temporary.pdf","-"],{encoding:"utf8",maxBuffer:4*1024*1024,timeout:18000});
   result.pdfText=describeExtractedPdf(t);
  }catch(e){result.pdfText={state:"PDF_TEXT_TOOL_UNAVAILABLE_OR_ENCRYPTED",
    errorType:e.name||"Error",code:e.code||null,status:e.status??null,
    errorMessage:String(e.message||"").slice(0,220),
    stderr:String(e.stderr||"").slice(0,220)};}
  result.state="OFFICIAL_ORIGINAL_PDF_DOWNLOADED_SOURCE_ONLY";
 }catch(e){
  result.state="OFFICIAL_ORIGINAL_PDF_NOT_VERIFIED";
  result.errorCode=String(e?.message||e).slice(0,160).replace(/https?:\/\/[^\s]+/g,"OFFICIAL_URL");
 }
 await mkdir("artifacts",{recursive:true});
 await writeFile("artifacts/system1-5340-2026q2-official-ebook-original-receipt.json",JSON.stringify(result,null,2)+"\n");
 console.log("TWSE_5340_ORIGINAL_RECEIPT="+JSON.stringify(result));
 if(result.state!=="OFFICIAL_ORIGINAL_PDF_DOWNLOADED_SOURCE_ONLY")process.exitCode=2;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)await main();
