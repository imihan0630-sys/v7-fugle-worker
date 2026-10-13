// Official MOPS per-symbol quarter-EPS extension. This returns an IN-MEMORY overlay only.
// It never PUTs V8 D1 / KV or changes deployed Worker/stock-selection code.
import {createHash} from 'node:crypto';
import {fetchBufferedOfficialSource} from '../tests/official_source_fetch_v0_1.mjs';
export async function verifiedOfficialQuarterEpsOverlay({parseAndValidate,marketDate,year,quarter,symbols}){
 if(!parseAndValidate||typeof parseAndValidate.validateOfficialQualityData!=="function")throw Error("ORIGINAL_V8_QUALITY_VALIDATOR_REQUIRED");
 if(!/^20\d\d-\d\d-\d\d$/.test(marketDate)||![1,2,3].includes(quarter)||
   !Number.isInteger(year)||!Array.isArray(symbols)||symbols.length<1||symbols.length>12||
   !symbols.every(s=>/^[1-9][0-9]{3}$/.test(s)))throw Error("MOPS_BOUNDED_REQUEST_INVALID");
 const url='https://mopsov.twse.com.tw/mops/web/ajax_t164sb04',receipts={},reports=[];
 const get=async(symbol,q)=>{
   const body=new URLSearchParams({encodeURIComponent:'1',step:'1',firstin:'1',off:'1',TYPEK:'all',isnew:'false',
      co_id:symbol,year:String(year-1911),season:String(q).padStart(2,'0')});
   const res=await fetchBufferedOfficialSource(url,{method:'POST',transport:'node-https',timeoutMs:65000,
     headers:{'content-type':'application/x-www-form-urlencoded'},body},{maxAttempts:2});
   const html=await res.text();
   if(html.length<150)throw Error("MOPS_PAYLOAD_INCOMPLETE_"+symbol);
   return {html,sha256:createHash('sha256').update(html).digest('hex')};
 };
 for(const symbol of symbols){
   const [q,prior]=await Promise.all([get(symbol,quarter),get(symbol,quarter-1)]);
   reports.push({sourceUrl:url,symbol,html:q.html,previousQuarterHtml:prior.html});
   receipts[symbol]={currentQuarterRawSha256:q.sha256,previousQuarterRawSha256:prior.sha256};
 }
 const verified=parseAndValidate.validateOfficialQualityData({kind:'QUARTER_EPS',year,quarter,reports},marketDate);
 for(const symbol of symbols)if(verified.stocks?.[symbol]?.quarterEpsVerified!==true||
     verified.stocks?.[symbol]?.previousQuarterEpsVerified!==true)throw Error("MOPS_ORIGINAL_PARSER_REJECTED_"+symbol);
 return {source:'MOPS_OFFICIAL_DIRECT_2026Q2_Q1',verifiedStocks:verified.stocks,receipts,
   count:verified.count,asOfDate:verified.asOfDate,year,quarter,zeroD1Writes:true};
}
