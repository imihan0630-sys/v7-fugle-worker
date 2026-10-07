import { createHash } from "node:crypto";
import { deepFreeze } from "./factor_snapshot.mjs";

export const TWSE_REGULATORY_LIFECYCLE_SOURCE_VERSION="0.1-RESEARCH";
const LIST_BASE="https://www.twse.com.tw/rwd/zh/announcement/announcement";
const DETAIL_BASE="https://www.twse.com.tw/rwd/zh/announcement/announcement_detail";

function sha256(value){
  return createHash("sha256").update(String(value)).digest("hex");
}
function requiredDate(value,field){
  const text=String(value||"").trim();
  if(!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error(field+" must be YYYY-MM-DD");
  return text;
}
function requiredSymbol(value){
  const symbol=String(value||"").trim();
  if(!/^[1-9][0-9]{3}$/.test(symbol)) throw new Error("symbol must be an ordinary four-digit equity code");
  return symbol;
}
function normalizeField(value){
  return String(value??"").replace(/<[^>]*>/g,"").replace(/\s+/g,"").trim();
}
function parseRocDate(value){
  const text=String(value??"").trim();
  if(!text)return null;
  let m=text.match(/(?:中華民國|民國)?\s*(\d{2,4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
  if(m){
    let y=Number(m[1]);
    if(y<1911)y+=1911;
    return `${String(y).padStart(4,"0")}-${String(Number(m[2])).padStart(2,"0")}-${String(Number(m[3])).padStart(2,"0")}`;
  }
  const digits=text.replace(/\D/g,"");
  if(digits.length===8)return `${digits.slice(0,4)}-${digits.slice(4,6)}-${digits.slice(6,8)}`;
  if(digits.length===7){
    const y=Number(digits.slice(0,3))+1911;
    return `${y}-${digits.slice(3,5)}-${digits.slice(5,7)}`;
  }
  return null;
}
function dateShift(iso,days){
  const d=new Date(iso+"T00:00:00Z");
  d.setUTCDate(d.getUTCDate()+days);
  return d.toISOString().slice(0,10);
}
function rowObject(fields,row){
  const out={};
  for(let i=0;i<fields.length;i+=1) out[fields[i]]=row?.[i]??null;
  return out;
}
function firstDateFromSegments(text,matcher){
  const normalized=String(text??"").replace(/<br\s*\/?\s*>/gi,"\n");
  const segments=normalized.split(/[\n。；;]/).map((x)=>x.trim()).filter(Boolean);
  for(const segment of segments){
    const matched=typeof matcher==="function" ? matcher(segment) : matcher.test(segment);
    if(!matched) continue;
    const date=parseRocDate(segment);
    if(date)return date;
  }
  return null;
}
function isLifecycleSubject(subject,symbol){
  const text=String(subject??"");
  return text.includes(symbol)
    && /(停止.*買賣|恢復.*買賣|恢復.*交易|終止上市)/.test(text);
}
function canonicalEventBase({
  symbol,eventType,effectiveFrom,membershipAction,tradingAction,
  sourceId,sourceUrl,sourceRowHash,sourcePayloadHash,observedAt,sourceReportedDate,
}){
  return {
    market:"TWSE",
    symbol,
    eventType,
    effectiveFrom,
    effectiveToExclusive:null,
    membershipAction,
    tradingAction,
    sourceId,
    sourceUrl,
    sourceRowHash,
    sourcePayloadHash,
    observedAt,
    sourceReportedAt:null,
    sourceReportedDate:sourceReportedDate||null,
    knownAtState:"HISTORICAL_SOURCE_DATE_ONLY_LAYER_C_NOT_PROVEN",
  };
}
function withIdentity(base){
  const identityCore={
    market:base.market,
    symbol:base.symbol,
    eventType:base.eventType,
    effectiveFrom:base.effectiveFrom,
    effectiveToExclusive:base.effectiveToExclusive,
    membershipAction:base.membershipAction,
    tradingAction:base.tradingAction,
    sourceId:base.sourceId,
    sourceUrl:base.sourceUrl,
    sourceRowHash:base.sourceRowHash,
    sourcePayloadHash:base.sourcePayloadHash,
  };
  return deepFreeze({...base,eventIdentityHash:sha256(JSON.stringify(identityCore))});
}

export function parseTwseRegulatoryAnnouncementDetailV0_1({
  symbol,
  payload,
  sourceUrl,
  sourcePayloadHash,
  observedAt,
}={}){
  const code=requiredSymbol(symbol);
  if(!payload||typeof payload!=="object") throw new Error("payload is required");
  const fields=Array.isArray(payload.fields)?payload.fields.map(normalizeField):[];
  const data=Array.isArray(payload.data)?payload.data:[];
  if(String(payload.stat||"").toLowerCase()!=="ok"||!fields.length||data.length!==1){
    return deepFreeze({state:"DETAIL_NOT_ACCEPTED",symbol:code,events:Object.freeze([])});
  }
  const obj=rowObject(fields,data[0]);
  const subject=String(obj["主旨"]??"");
  const body=String(obj["公告事項"]??"");
  const reportDate=parseRocDate(obj["發文日期"]);
  const joined=subject+"\n"+body;
  if(!joined.includes(code)){
    return deepFreeze({state:"DETAIL_SYMBOL_MISMATCH",symbol:code,events:Object.freeze([])});
  }

  const events=[];
  const common={
    symbol:code,
    sourceId:"TWSE_OFFICIAL_ANNOUNCEMENT_DETAIL",
    sourceUrl:String(sourceUrl||""),
    sourceRowHash:sha256(JSON.stringify({fields,row:data[0]})),
    sourcePayloadHash:String(sourcePayloadHash||sha256(JSON.stringify(payload))),
    observedAt:String(observedAt||""),
    sourceReportedDate:reportDate,
  };

  const stopDate=firstDateFromSegments(body,(segment)=>
    /(停止.*(?:上市有價證券)?.*買賣|上市有價證券.*停止買賣)/.test(segment)
    && !/停止融資融券/.test(segment));
  if(stopDate){
    const shareConversion=/(企業併購法|股份轉換|轉換為|投資控股|換股)/.test(joined);
    events.push(withIdentity(canonicalEventBase({
      ...common,
      eventType:shareConversion?"SHARE_CONVERSION_STOP":"REGULATORY_STOP",
      effectiveFrom:stopDate,
      membershipAction:"KEEP",
      tradingAction:"STOP",
    })));
  }

  const resumeDate=firstDateFromSegments(body,(segment)=>
    /(恢復.*買賣|恢復.*交易)/.test(segment)
    && !/恢復融資融券/.test(segment));
  if(resumeDate){
    events.push(withIdentity(canonicalEventBase({
      ...common,
      eventType:"REGULATORY_RESUME",
      effectiveFrom:resumeDate,
      membershipAction:"KEEP",
      tradingAction:"RESUME",
    })));
  }

  const delistDate=firstDateFromSegments(body,(segment)=>/終止上市/.test(segment));
  if(delistDate){
    events.push(withIdentity(canonicalEventBase({
      ...common,
      eventType:"DELISTING_EFFECTIVE",
      effectiveFrom:delistDate,
      membershipAction:"TERMINATE",
      tradingAction:"STOP",
    })));
  }

  return deepFreeze({
    state:events.length?"POSITIVE_LIFECYCLE_EVENTS":"NO_ACCEPTED_LIFECYCLE_EVENT",
    symbol:code,
    subject,
    reportDate,
    events:Object.freeze(events),
    schemaVersion:"S2_TWSE_REGULATORY_ANNOUNCEMENT_DETAIL_PARSE_V0_1",
  });
}

export function buildTwseRegulatoryNoTradingIntervalsV0_1({
  events=[],
  coverageTo,
}={}){
  const to=requiredDate(coverageTo,"coverageTo");
  if(!Array.isArray(events)) throw new Error("events must be an array");
  const bySymbol=new Map();
  for(const event of events){
    if(!event||event.market!=="TWSE")continue;
    const symbol=requiredSymbol(event.symbol);
    if(!bySymbol.has(symbol))bySymbol.set(symbol,[]);
    bySymbol.get(symbol).push(event);
  }

  const intervals=[];
  const conflicts=[];
  const rank={REGULATORY_STOP:1,SHARE_CONVERSION_STOP:1,REGULATORY_RESUME:2,DELISTING_EFFECTIVE:3};
  for(const [symbol,rows] of bySymbol.entries()){
    rows.sort((a,b)=>
      String(a.effectiveFrom).localeCompare(String(b.effectiveFrom))
      || (rank[a.eventType]||9)-(rank[b.eventType]||9)
      || String(a.eventIdentityHash||"").localeCompare(String(b.eventIdentityHash||"")));
    let open=null;
    for(const event of rows){
      const date=requiredDate(event.effectiveFrom,"event.effectiveFrom");
      if(event.eventType==="REGULATORY_STOP"||event.eventType==="SHARE_CONVERSION_STOP"){
        if(!open) open={start:date,eventType:event.eventType,sourceEvents:[event]};
        else open.sourceEvents.push(event);
        continue;
      }
      if(event.eventType==="REGULATORY_RESUME"||event.eventType==="DELISTING_EFFECTIVE"){
        if(!open) continue;
        if(date<open.start){
          conflicts.push({symbol,reason:"CLOSE_BEFORE_OPEN",openDate:open.start,closeDate:date});
          continue;
        }
        if(date>open.start){
          const sourceRowHash=sha256(JSON.stringify(open.sourceEvents.map((x)=>x.eventIdentityHash).sort()));
          intervals.push(deepFreeze({
            market:"TWSE",symbol,suspendedFrom:open.start,resumedOn:date,coverageTo:to,
            sourceRowHash,lifecycleSource:"TWSE_OFFICIAL_ANNOUNCEMENT_UNION",
            sourceEventCount:open.sourceEvents.length+1,
          }));
        }
        open=null;
      }
    }
    if(open&&open.start<=to){
      const sourceRowHash=sha256(JSON.stringify(open.sourceEvents.map((x)=>x.eventIdentityHash).sort()));
      intervals.push(deepFreeze({
        market:"TWSE",symbol,suspendedFrom:open.start,resumedOn:null,coverageTo:to,
        sourceRowHash,lifecycleSource:"TWSE_OFFICIAL_ANNOUNCEMENT_UNION",
        sourceEventCount:open.sourceEvents.length,
      }));
    }
  }

  return deepFreeze({
    intervals:Object.freeze(intervals.sort((a,b)=>
      a.symbol.localeCompare(b.symbol)||a.suspendedFrom.localeCompare(b.suspendedFrom))),
    conflicts:Object.freeze(conflicts),
    state:conflicts.length?"PARTIAL_EVENT_BOUNDARY_CONFLICT":"PASS_POSITIVE_INTERVAL_NORMALIZATION",
    absenceCertifiesNoEvent:false,
    schemaVersion:"S2_TWSE_REGULATORY_NO_TRADING_INTERVALS_V0_1",
  });
}

async function getJsonText(url,fetchImpl){
  const response=await fetchImpl(url,{
    headers:{accept:"application/json,text/plain,*/*","user-agent":"System2-DATA-LANE-lifecycle-source/0.1"},
    signal:AbortSignal.timeout(60000),
  });
  const rawText=await response.text();
  if(!response.ok) throw new Error("TWSE announcement HTTP "+response.status);
  return {payload:JSON.parse(rawText),rawText};
}

export async function fetchTwseRegulatoryLifecycleForSymbolsV0_1({
  symbols=[],
  fromDate,
  toDate,
  observedAt,
  fetchImpl=globalThis.fetch,
  lookbackDays=370,
}={}){
  if(typeof fetchImpl!=="function")throw new Error("fetchImpl is required");
  const from=requiredDate(fromDate,"fromDate");
  const to=requiredDate(toDate,"toDate");
  if(to<from)throw new Error("toDate cannot be earlier than fromDate");
  if(!Number.isInteger(lookbackDays)||lookbackDays<0||lookbackDays>3660)throw new Error("lookbackDays must be 0..3660");
  const unique=[...new Set(symbols.map(requiredSymbol))].sort();
  const queryFrom=dateShift(from,-lookbackDays);
  const events=[];
  const symbolReceipts=[];
  let candidateAnnouncementCount=0;
  let detailFetchCount=0;
  let partialSymbolCount=0;

  for(const symbol of unique){
    const listUrl=LIST_BASE
      +`?startDate=${queryFrom.replaceAll("-","")}&endDate=${to.replaceAll("-","")}`
      +`&keyword=${encodeURIComponent(symbol)}&response=json`;
    try{
      const {payload,rawText}=await getJsonText(listUrl,fetchImpl);
      const fields=Array.isArray(payload?.fields)?payload.fields.map(normalizeField):[];
      const data=Array.isArray(payload?.data)?payload.data:[];
      const total=Number(payload?.total??data.length);
      const listComplete=Number.isInteger(total)&&total===data.length;
      if(String(payload?.stat||"").toLowerCase()!=="ok"||!fields.length){
        partialSymbolCount+=1;
        symbolReceipts.push({symbol,state:"LIST_SCHEMA_UNAVAILABLE",listUrl,listHash:sha256(rawText)});
        continue;
      }
      if(!listComplete) partialSymbolCount+=1;
      const objects=data.map((row)=>rowObject(fields,row));
      const candidates=objects.filter((row)=>
        isLifecycleSubject(row["主旨"],symbol)
        && String(row["id"]??"").trim());
      candidateAnnouncementCount+=candidates.length;
      let acceptedForSymbol=0;
      for(const candidate of candidates){
        const id=String(candidate["id"]).trim();
        const detailUrl=DETAIL_BASE+`?id=${encodeURIComponent(id)}&response=json`;
        try{
          const detail=await getJsonText(detailUrl,fetchImpl);
          detailFetchCount+=1;
          const parsed=parseTwseRegulatoryAnnouncementDetailV0_1({
            symbol,payload:detail.payload,sourceUrl:detailUrl,
            sourcePayloadHash:sha256(detail.rawText),observedAt,
          });
          events.push(...parsed.events);
          acceptedForSymbol+=parsed.events.length;
        }catch(error){
          partialSymbolCount+=1;
          symbolReceipts.push({
            symbol,state:"DETAIL_TRANSPORT_OR_PARSE_PARTIAL",listUrl,detailUrl,
            message:String(error?.message||error).slice(0,300),
          });
        }
      }
      symbolReceipts.push({
        symbol,
        state:listComplete?"LIST_COMPLETE_POSITIVE_ONLY":"LIST_RESULTSET_PARTIAL_POSITIVE_ONLY",
        listUrl,
        listHash:sha256(rawText),
        total,
        returned:data.length,
        candidateAnnouncementCount:candidates.length,
        acceptedEventCount:acceptedForSymbol,
        absenceCertifiesNoEvent:false,
      });
    }catch(error){
      partialSymbolCount+=1;
      symbolReceipts.push({
        symbol,state:"LIST_TRANSPORT_OR_PARSE_PARTIAL",listUrl,
        message:String(error?.message||error).slice(0,300),
        absenceCertifiesNoEvent:false,
      });
    }
  }

  const normalized=buildTwseRegulatoryNoTradingIntervalsV0_1({events,coverageTo:to});
  return deepFreeze({
    state:partialSymbolCount||normalized.conflicts.length
      ?"PARTIAL_POSITIVE_EVENTS_ONLY"
      :"OBSERVED_POSITIVE_EVENTS_UNCERTIFIED_ABSENCE",
    market:"TWSE",
    queryFrom,
    fromDate:from,
    toDate:to,
    queriedSymbolCount:unique.length,
    candidateAnnouncementCount,
    detailFetchCount,
    eventCount:events.length,
    intervalCount:normalized.intervals.length,
    partialSymbolCount,
    events:Object.freeze(events),
    intervals:normalized.intervals,
    conflicts:normalized.conflicts,
    symbolReceipts:Object.freeze(symbolReceipts),
    absenceCertifiesNoEvent:false,
    knownAtState:"HISTORICAL_SOURCE_DATE_ONLY_LAYER_C_NOT_PROVEN",
    schemaVersion:"S2_TWSE_REGULATORY_LIFECYCLE_SOURCE_V0_1",
  });
}
