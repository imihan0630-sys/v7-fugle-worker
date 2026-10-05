import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

export const MOPS_MATERIAL_DETAIL_SOURCE_CAPABILITY_VERSION = "0.1-RESEARCH";
const DEFAULT_HOST = "https://mopsov.twse.com.tw";

function requiredText(value, field){
  if(typeof value!=="string"||!value.trim()) throw new Error(field+" is required");
  return value.trim();
}

function numericText(value, field, minLength, maxLength){
  const text=requiredText(String(value??""),field);
  if(!new RegExp("^\\d{"+minLength+","+maxLength+"}$").test(text)) throw new Error(field+" must be numeric");
  return text;
}

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

function toIsoDate(year,month,day){
  const y=Number(year),m=Number(month),d=Number(day);
  if(!Number.isInteger(y)||!Number.isInteger(m)||!Number.isInteger(d)) return null;
  const iso=String(y).padStart(4,"0")+"-"+String(m).padStart(2,"0")+"-"+String(d).padStart(2,"0");
  const dt=new Date(iso+"T00:00:00.000Z");
  return Number.isFinite(dt.getTime())&&dt.toISOString().slice(0,10)===iso?iso:null;
}

export function extractMopsMaterialDetailDateTokensV0_1(value){
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
  return Object.freeze([...out].sort());
}

function rocDisplayDate(spokeDateRaw){
  const raw=numericText(spokeDateRaw,"spokeDateRaw",8,8);
  const year=Number(raw.slice(0,4))-1911;
  if(year<1) throw new Error("spokeDateRaw must be a Taiwan-market Gregorian date");
  return String(year).padStart(3,"0")+"/"+raw.slice(4,6)+"/"+raw.slice(6,8);
}

function displayTime(spokeTimeRaw){
  const raw=numericText(spokeTimeRaw,"spokeTimeRaw",6,6);
  return raw.slice(0,2)+":"+raw.slice(2,4)+":"+raw.slice(4,6);
}

export function buildMopsMaterialDetailRequestV0_1({
  stockCode,
  spokeDateRaw,
  spokeTimeRaw,
  seqNo,
  typek="all",
  host=DEFAULT_HOST,
} = {}){
  const code=numericText(stockCode,"stockCode",4,6);
  const date=numericText(spokeDateRaw,"spokeDateRaw",8,8);
  const time=numericText(spokeTimeRaw,"spokeTimeRaw",6,6);
  const seq=numericText(seqNo,"seqNo",1,8);
  const type=requiredText(typek||"all","typek");
  const base=new URL(requiredText(host,"host"));
  if(base.protocol!=="https:"||!["mopsov.twse.com.tw","mops.twse.com.tw"].includes(base.hostname)){
    throw new Error("host not allowed");
  }
  const rocYear=String(Number(date.slice(0,4))-1911);
  const url=new URL("/mops/web/t05st01",base);
  url.search=new URLSearchParams({
    encodeURIComponent:"1",
    firstin:"true",
    TYPEK:type,
    step:"2",
    off:"1",
    co_id:code,
    spoke_date:date,
    spoke_time:time,
    seq_no:seq,
    year:rocYear,
  }).toString();
  return deepFreeze({
    url:url.toString(),
    identity:deepFreeze({
      stockCode:code,
      spokeDateRaw:date,
      spokeTimeRaw:time,
      seqNo:seq,
      typek:type,
      rocYear,
    }),
  });
}

export async function parseMopsMaterialDetailHtmlV0_1({
  html,
  stockCode,
  spokeDateRaw,
  spokeTimeRaw,
  seqNo,
} = {}){
  const source=requiredText(html,"html");
  const code=numericText(stockCode,"stockCode",4,6);
  const date=numericText(spokeDateRaw,"spokeDateRaw",8,8);
  const time=numericText(spokeTimeRaw,"spokeTimeRaw",6,6);
  const seq=numericText(seqNo,"seqNo",1,8);
  const text=stripHtml(source);
  const subjectIndex=text.indexOf("主旨");
  const explanationIndex=subjectIndex>=0 ? text.indexOf("說明",subjectIndex+2) : -1;
  let bodyText=explanationIndex>=0 ? text.slice(explanationIndex+2) : "";
  const disclaimerIndex=bodyText.indexOf("以上資料均由");
  if(disclaimerIndex>=0) bodyText=bodyText.slice(0,disclaimerIndex);
  bodyText=bodyText.trim();

  const dateDisplay=rocDisplayDate(date);
  const timeDisplay=displayTime(time);
  const identityObserved=
    text.includes(code) &&
    text.includes("序號 "+seq) &&
    text.includes("發言日期 "+dateDisplay) &&
    text.includes("發言時間 "+timeDisplay) &&
    subjectIndex>=0 &&
    explanationIndex>subjectIndex;

  const detailTextHash=await sha256Hex(text);
  const bodyTextHash=await sha256Hex(bodyText);
  const bodyDateTokens=extractMopsMaterialDetailDateTokensV0_1(bodyText);

  return deepFreeze({
    schemaVersion:"S2_MOPS_MATERIAL_DETAIL_PARSE_V0_1",
    version:MOPS_MATERIAL_DETAIL_SOURCE_CAPABILITY_VERSION,
    stockCode:code,
    spokeDateRaw:date,
    spokeTimeRaw:time,
    seqNo:seq,
    identityObserved,
    subjectObserved:subjectIndex>=0,
    explanationObserved:explanationIndex>subjectIndex,
    detailTextHash,
    bodyTextHash,
    bodyDateTokens,
    detailText:text,
    bodyText,
  });
}
