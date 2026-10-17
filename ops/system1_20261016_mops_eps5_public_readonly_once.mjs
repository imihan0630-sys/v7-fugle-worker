// One-shot official MOPS five-symbol 2026Q2/Q1 source-read probe.
// HTTP POST only to public MOPS form endpoint (a READ operation).
// Never invoke/modify production Worker, D1, KV, Cron, GH issues, 3Min or trading.
// Report verified source-contract flags and hashes, never raw HTML or a trade plan.
import {readFile,mkdir,writeFile} from "node:fs/promises";
import {createHash} from "node:crypto";
import {fetchBufferedOfficialSource} from "../tests/official_source_fetch_v0_1.mjs";
const DATE="2026-10-16",YEAR=2026,QUARTER=2;
const SYMBOLS=["4167","3236","3147","5340","6122"];
const URL="https://mopsov.twse.com.tw/mops/web/ajax_t164sb04";
const OUT="artifacts/system1-20261016-public-mops-eps5-readonly.json";
export function checkContractMarkers(html,symbol,year,quarter){
 if(!/^[1-9][0-9]{3}$/.test(symbol)||year!==2026||![1,2].includes(quarter))
  throw Error("SCOPE_NOT_2026Q2_Q1");
 const markers={
  exactCompanyYearQuarterConsolidated:html.includes("CO_ID="+symbol+"&SYEAR="+year+"&SSEASON="+quarter+"&REPORT_ID=C"),
  consolidatedStatement:html.includes("合併綜合損益表"),
  thousandNtdUnit:html.includes("新台幣仟元")
 };
 const alternateOfficialBasis={
  reportIdA:html.includes("CO_ID="+symbol+"&SYEAR="+year+"&SSEASON="+quarter+"&REPORT_ID=A"),
  reportIdD:html.includes("CO_ID="+symbol+"&SYEAR="+year+"&SSEASON="+quarter+"&REPORT_ID=D"),
  reportIdC:html.includes("CO_ID="+symbol+"&SYEAR="+year+"&SSEASON="+quarter+"&REPORT_ID=C"),
  genericIncomeStatement:html.includes("綜合損益表"),
  individualIncomeStatement:html.includes("個體綜合損益表")||html.includes("個別綜合損益表"),
  rocYearReference:html.includes(String(year-1911)+"年第"+quarter+"季"),
  exactCompanyReference:html.includes("CO_ID="+symbol)
 };
 return {...markers,alternateOfficialBasis,
  allRequiredMarkersPresent:Object.values(markers).every(Boolean),
  byteLength:Buffer.byteLength(html,"utf8"),
  sourceSha256:createHash("sha256").update(html).digest("hex")};
}
export function exceptionClass(error){
 const e=String(error?.message||error||"");
 if(e.includes("公司、年度、季別或合併口徑不符"))return "OFFICIAL_MOPS_HEADER_CONTRACT_MISMATCH";
 if(e.includes("數值欄位或報表不唯一"))return "EPS_COLUMNS_AMBIGUOUS";
 if(e.includes("真正單季EPS"))return "EPS_PERIOD_NOT_VERIFIED";
 if(e.includes("Q1累計與單季"))return "EPS_Q1_CUMULATIVE_CONFLICT";
 if(e.includes("輸入無效"))return "SOURCE_INPUT_CONTRACT";
 return "OTHER_PARSER_OR_SOURCE_ERROR";
}
const ACTIVE_SYMBOLS=process.argv.includes("--only-5340")?["5340"]:SYMBOLS;
const output={schema:"S1_P0_PUBLIC_MOPS_20261016_EPS5_ORIGINAL_SOURCE_V0_1",
 targetDate:DATE,year:YEAR,quarter:QUARTER,symbols:ACTIVE_SYMBOLS,
 observedAt:new Date().toISOString(),sourceUrl:URL,sourceReadOnly:true,
 noCloudflareCall:true,noWorkerPOST:true,noD1Read:true,noD1Write:true,
 noKvRead:true,noKvWrite:true,noTrade:true,noPush:true,noDeploy:true,
 resultBySymbol:{},allVerified:false,anyTransportFailure:false,
 noSelectionAuthorization:true};
async function fetchOfficial(symbol,quarter){
 const body=new URLSearchParams({encodeURIComponent:"1",step:"1",firstin:"1",off:"1",
  TYPEK:"all",isnew:"false",co_id:symbol,year:"115",
  season:String(quarter).padStart(2,"0")});
 const response=await fetchBufferedOfficialSource(URL,{
  method:"POST",transport:"node-https",timeoutMs:55000,
  headers:{"content-type":"application/x-www-form-urlencoded"},body
 },{maxAttempts:2});
 const html=await response.text();
 if(html.length>300000)throw Error("MOPS_HTML_BOUND_EXCEEDED");
 return html;
}
if(process.argv.includes("--dry-run")){
 output.status="OFFLINE_DRY_RUN_NO_NETWORK";
}else{
 const source=await readFile("Worker.js","utf8");
 const api=await import("data:text/javascript;base64,"+
  Buffer.from(source+"\nexport {parseMopsQuarterEpsHtml,validateOfficialQualityData};").toString("base64"));
 for(const symbol of ACTIVE_SYMBOLS){
  const state={Q2:null,Q1:null,verified:false};
  output.resultBySymbol[symbol]=state;
  const bodies={};
  for(const quarter of [2,1]){
   const key=quarter===2?"Q2":"Q1";
   try{
    const html=await fetchOfficial(symbol,quarter);
    const flags=checkContractMarkers(html,symbol,YEAR,quarter);
    state[key]=flags;
    bodies[key]=html;
    if(!flags.allRequiredMarkersPresent){
     state[key].result="REJECTED_OFFICIAL_MARKER_INCOMPLETE";
    }else{
     try{
      const parsed=api.parseMopsQuarterEpsHtml(html,symbol,YEAR,quarter);
      state[key].result="ORIGINAL_PARSER_PASS";
      state[key].quarterEpsVerified=parsed.quarterEpsVerified===true;
     }catch(e){state[key].result="ORIGINAL_PARSER_REJECTED";
      state[key].reason=exceptionClass(e);}
    }
   }catch(e){
    output.anyTransportFailure=true;
    state[key]={result:"OFFICIAL_FETCH_FAILED",
      reason:/timeout|ETIMEDOUT/i.test(String(e))?"SOURCE_TIMEOUT":
      "SOURCE_FETCH_ERROR_NO_RAW_RESPONSE"};
   }
  }
  if(state.Q2?.result==="ORIGINAL_PARSER_PASS"&&state.Q1?.result==="ORIGINAL_PARSER_PASS"){
   try{
    const checked=api.validateOfficialQualityData({kind:"QUARTER_EPS",
     year:YEAR,quarter:QUARTER,reports:[{sourceUrl:URL,symbol,
      html:bodies.Q2,previousQuarterHtml:bodies.Q1}]},DATE);
    state.verified=checked.stocks?.[symbol]?.quarterEpsVerified===true&&
      checked.stocks?.[symbol]?.previousQuarterEpsVerified===true;
    state.validation=state.verified?"ORIGINAL_QUALITY_VALIDATED":"QUALITY_READBACK_NOT_VERIFIED";
   }catch(e){state.validation="ORIGINAL_QUALITY_VALIDATOR_REJECTED";
    state.reason=exceptionClass(e);}
  }
  // Do not claim this source-only probe yields a stock recommendation.
  console.log("SYSTEM1_PUBLIC_MOPS_SYMBOL_STATUS="+JSON.stringify({
   symbol,Q2:state.Q2?.result,Q1:state.Q1?.result,verified:state.verified}));
 }
 output.allVerified=ACTIVE_SYMBOLS.every(s=>output.resultBySymbol[s].verified===true);
 output.status=output.allVerified?"ALL_FIVE_OFFICIAL_EPS_VALIDATED_SOURCE_ONLY":
  output.anyTransportFailure?"OFFICIAL_TRANSPORT_INCOMPLETE_NO_SELECTION":
  "OFFICIAL_EPS_FORMAT_OR_COVERAGE_UNVERIFIED_NO_SELECTION";
}
await mkdir("artifacts",{recursive:true});
await writeFile(OUT,JSON.stringify(output,null,2)+"\n");
console.log("SYSTEM1_PUBLIC_MOPS_EPS5_RESULT="+JSON.stringify(output));
