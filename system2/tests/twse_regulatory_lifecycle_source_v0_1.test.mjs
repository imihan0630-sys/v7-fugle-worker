import assert from "node:assert/strict";
import {
  parseTwseRegulatoryAnnouncementDetailV0_1,
  buildTwseRegulatoryNoTradingIntervalsV0_1,
  fetchTwseRegulatoryLifecycleForSymbolsV0_1,
} from "../runtime/twse_regulatory_lifecycle_source_v0_1.mjs";

function detail({date,subject,body}){
  return {
    stat:"ok",
    fields:["發文機關","發文日期","發文字號","主旨","依據","公告事項"],
    data:[["臺灣證券交易所股份有限公司 公告",date,"字號",subject,"依據",body]],
  };
}

let p=parseTwseRegulatoryAnnouncementDetailV0_1({
  symbol:"2358",
  payload:detail({
    date:"中華民國113年04月02日",
    subject:"廷鑫興業股份有限公司（代號：2358）及昶虹國際股份有限公司（代號：2443）上市有價證券併案停止在本公司證券集中交易市場買賣。",
    body:"一、併案停止買賣日期：民國113年4月8日。\n二、證券代號及簡稱：(一)代號：2358；簡稱：廷鑫。",
  }),
  sourceUrl:"https://example/detail?id=stop",
  sourcePayloadHash:"a".repeat(64),
  observedAt:"2026-10-07T20:40:00+08:00",
});
assert.equal(p.state,"POSITIVE_LIFECYCLE_EVENTS");
assert.equal(p.events.length,1);
assert.equal(p.events[0].eventType,"REGULATORY_STOP");
assert.equal(p.events[0].effectiveFrom,"2024-04-08");
assert.equal(p.events[0].sourceReportedAt,null);
assert.equal(p.events[0].knownAtState,"HISTORICAL_SOURCE_DATE_ONLY_LAYER_C_NOT_PROVEN");

p=parseTwseRegulatoryAnnouncementDetailV0_1({
  symbol:"1701",
  payload:detail({
    date:"中華民國113年07月03日",
    subject:"中國化學製藥股份有限公司（公司代號：1701）因依據企業併購法規定轉換為中化投資控股股份有限公司，上市有價證券停止買賣暨終止上市日期。",
    body:"一、停止買賣日期：民國113年8月21日。\n二、終止上市日期：民國113年9月2日。",
  }),
  sourceUrl:"https://example/detail?id=conversion",
  sourcePayloadHash:"b".repeat(64),
  observedAt:"2026-10-07T20:40:00+08:00",
});
assert.deepEqual(p.events.map(x=>[x.eventType,x.effectiveFrom]),[
  ["SHARE_CONVERSION_STOP","2024-08-21"],
  ["DELISTING_EFFECTIVE","2024-09-02"],
]);

const normalized=buildTwseRegulatoryNoTradingIntervalsV0_1({
  coverageTo:"2024-12-31",
  events:[
    {
      market:"TWSE",symbol:"2358",eventType:"REGULATORY_STOP",effectiveFrom:"2024-04-08",
      eventIdentityHash:"s1",
    },
    {
      market:"TWSE",symbol:"2358",eventType:"DELISTING_EFFECTIVE",effectiveFrom:"2024-11-19",
      eventIdentityHash:"d1",
    },
    {
      market:"TWSE",symbol:"8101",eventType:"REGULATORY_STOP",effectiveFrom:"2024-08-22",
      eventIdentityHash:"s2",
    },
    {
      market:"TWSE",symbol:"8101",eventType:"REGULATORY_RESUME",effectiveFrom:"2024-11-19",
      eventIdentityHash:"r2",
    },
  ],
});
assert.equal(normalized.state,"PASS_POSITIVE_INTERVAL_NORMALIZATION");
assert.deepEqual(normalized.intervals.map(x=>[x.symbol,x.suspendedFrom,x.resumedOn]),[
  ["2358","2024-04-08","2024-11-19"],
  ["8101","2024-08-22","2024-11-19"],
]);

const payloads=new Map();
const listUrl2358="https://www.twse.com.tw/rwd/zh/announcement/announcement?startDate=20221227&endDate=20241231&keyword=2358&response=json";
payloads.set(listUrl2358,{
  stat:"ok",total:3,fields:["項次","發文日期","發文字號","主旨","id"],data:[
    [1,"中華民國113年10月09日","A","廷鑫興業股份有限公司（公司代號：2358）上市有價證券終止上市日期。","DEL"],
    [2,"中華民國113年04月02日","B","廷鑫興業股份有限公司（代號：2358）上市有價證券停止在本公司證券集中交易市場買賣。","STOP"],
    [3,"中華民國113年03月12日","C","公告廷鑫興業股份有限公司（證券代號：2358）自3月13日起暫停融資融券交易。","MARGIN"],
  ]
});
payloads.set("https://www.twse.com.tw/rwd/zh/announcement/announcement_detail?id=STOP&response=json",detail({
  date:"中華民國113年04月02日",
  subject:"廷鑫興業股份有限公司（代號：2358）上市有價證券停止在本公司證券集中交易市場買賣。",
  body:"一、停止買賣日期：民國113年4月8日。\n二、代號：2358。",
}));
payloads.set("https://www.twse.com.tw/rwd/zh/announcement/announcement_detail?id=DEL&response=json",detail({
  date:"中華民國113年10月09日",
  subject:"廷鑫興業股份有限公司（公司代號：2358）上市有價證券終止上市日期。",
  body:"一、終止上市日期：民國113年11月19日。\n二、公司代號：2358。",
}));

const fetchImpl=async(url)=>{
  const payload=payloads.get(String(url));
  if(!payload)return {ok:false,status:404,text:async()=>JSON.stringify({stat:"missing"})};
  return {ok:true,status:200,text:async()=>JSON.stringify(payload)};
};

const fetched=await fetchTwseRegulatoryLifecycleForSymbolsV0_1({
  symbols:["2358"],fromDate:"2024-01-01",toDate:"2024-12-31",
  observedAt:"2026-10-07T20:40:00+08:00",fetchImpl,lookbackDays:370,
});
assert.equal(fetched.queriedSymbolCount,1);
assert.equal(fetched.candidateAnnouncementCount,2);
assert.equal(fetched.detailFetchCount,2);
assert.equal(fetched.eventCount,2);
assert.equal(fetched.intervalCount,1);
assert.equal(fetched.intervals[0].suspendedFrom,"2024-04-08");
assert.equal(fetched.intervals[0].resumedOn,"2024-11-19");
assert.equal(fetched.absenceCertifiesNoEvent,false);
assert.equal(fetched.knownAtState,"HISTORICAL_SOURCE_DATE_ONLY_LAYER_C_NOT_PROVEN");

console.log("System2 TWSE regulatory lifecycle source v0.1 tests passed");
