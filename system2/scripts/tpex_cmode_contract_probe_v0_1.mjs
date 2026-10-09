import { createHash } from "node:crypto";
import { writeFile } from "node:fs/promises";

const outputPath=String(process.env.SYSTEM2_TPEX_CMODE_PROBE_OUTPUT||"").trim();
const endpoint="https://www.tpex.org.tw/web/stock/aftertrading/cmode/chtm_result.php";
const targets=[
  {marketDate:"2023-04-10",rocDate:"112/04/10",symbol:"4806",expectedPhase:"STOPPED"},
  {marketDate:"2023-10-12",rocDate:"112/10/12",symbol:"4806",expectedPhase:"RESUMED"},
];

function sha256(text){return createHash("sha256").update(String(text)).digest("hex");}
function clean(value){return String(value??"").replace(/<[^>]*>/g," ").replace(/&nbsp;|&#160;/gi," ").replace(/\s+/g," ").trim();}

const receipts=[];
for(const target of targets){
  const url=new URL(endpoint);
  url.searchParams.set("l","zh-tw");
  url.searchParams.set("o","json");
  url.searchParams.set("d",target.rocDate);

  const response=await fetch(url,{
    redirect:"follow",
    headers:{
      accept:"application/json,text/plain,*/*",
      referer:"https://www.tpex.org.tw/zh-tw/mainboard/trading/info/altered.html",
      "user-agent":"System2-DATA-LANE-tpex-cmode-contract-probe/0.2",
    },
    signal:AbortSignal.timeout(30000),
  });
  const rawText=await response.text();
  let payload=null;
  let parseError=null;
  try{payload=JSON.parse(rawText);}catch(error){parseError=String(error?.message||error);}
  const primaryTable=Array.isArray(payload?.tables)&&payload.tables.length?payload.tables[0]:null;
  const tableFields=Array.isArray(primaryTable?.fields)?primaryTable.fields.map(clean):[];
  const tableData=Array.isArray(primaryTable?.data)?primaryTable.data:[];
  const aaData=Array.isArray(payload?.aaData)?payload.aaData:[];
  const rows=tableData.length?tableData:aaData;
  const symbolIndex=tableFields.length
    ? tableFields.findIndex((field)=>field.includes("證券代號")||field==="代號")
    : 0;
  const stopIndex=tableFields.length
    ? tableFields.findIndex((field)=>field.includes("停止交易"))
    : 6;
  const targetRows=rows.filter((row)=>Array.isArray(row)&&symbolIndex>=0&&clean(row[symbolIndex])===target.symbol);
  const targetStopMarkers=targetRows.map((row)=>stopIndex>=0?clean(row[stopIndex]):null);
  receipts.push({
    market:"TPEX",
    ...target,
    requestUrl:url.toString(),
    httpStatus:response.status,
    httpOk:response.ok,
    payloadHash:sha256(rawText),
    rawByteLength:Buffer.byteLength(rawText),
    parseError,
    topLevelKeys:payload&&typeof payload==="object"?Object.keys(payload).sort():[],
    topLevelScalarFields:payload&&typeof payload==="object"
      ?Object.fromEntries(Object.entries(payload).filter(([,v])=>["string","number","boolean"].includes(typeof v)).slice(0,50))
      :{},
    tableTitle:clean(primaryTable?.title),
    tableDate:clean(primaryTable?.date),
    tableTotalCount:Number(primaryTable?.totalCount??tableData.length),
    tableFields,
    tableDataCount:tableData.length,
    aaDataCount:aaData.length,
    selectedRowSource:tableData.length?"tables[0].data":"aaData",
    firstRowLength:Array.isArray(rows[0])?rows[0].length:null,
    symbolIndex,
    stopIndex,
    targetRowCount:targetRows.length,
    targetStopMarkers,
    targetRows:targetRows.slice(0,5).map((row)=>row.map(clean)),
    responseHead:rawText.slice(0,500),
  });
}
const out={
  schemaVersion:"S2_TPEX_CMODE_CONTRACT_PROBE_V0_2",
  observedAt:new Date().toISOString(),
  sourceAuthority:"TPEx",
  endpoint,
  receipts,
  system1RuntimeChanged:false,
  d1Mutation:false,
  r2Mutation:false,
};
const json=JSON.stringify(out,null,2);
if(outputPath)await writeFile(outputPath,json+"\n","utf8");
console.log(json);
