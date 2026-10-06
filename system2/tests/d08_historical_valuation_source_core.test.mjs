import assert from "node:assert/strict";
import {
  parseOfficialHistoricalA6ValuationPayloadV0_1,
  buildOfficialHistoricalA6ValuationUrlV0_1,
  buildOfficialHistoricalA6ValuationUrlsV0_1,
  fetchOfficialHistoricalA6ValuationDateV0_1,
} from "../runtime/official_historical_a6_valuation_v0_1.mjs";
import { d08TwseTableObjectsV0_1,parseD08TwseDateV0_1,buildD08SemanticUniverseIdentityV0_1,reconcileD08TwseCurrentListingStartsV0_1 } from "../runtime/d08_twse_historical_universe_source_v0_1.mjs";

const fields=["證券代號","證券名稱","收盤價","殖利率(%)","股利年度","本益比","股價淨值比","財報年/季"];
const p=parseOfficialHistoricalA6ValuationPayloadV0_1({
  marketDate:"2026-10-02",observedAt:"2026-10-04T00:00:00Z",
  payload:{stat:"OK",date:"20261002",fields,data:[
    ["1101","台泥","25.35","3.16",114,"-","0.82","115/2"],
    ["1102","亞泥","35.60","6.46",114,"9.83","0.68","115/2"],
  ]},
});
assert.equal(p.state,"READY");
assert.equal(p.rows.length,2);
assert.equal(p.rows[0].pe,null);
assert.equal(p.rows[0].pb,0.82);
assert.equal(p.rows[1].pe,9.83);
assert.equal(p.sourceDateEvidence,"2026-10-02");
assert.match(buildOfficialHistoricalA6ValuationUrlV0_1("2026-10-02"),/date=20261002/);

assert.throws(()=>parseOfficialHistoricalA6ValuationPayloadV0_1({
  marketDate:"2026-10-01",observedAt:"2026-10-04T00:00:00Z",
  payload:{stat:"OK",date:"20261002",fields,data:[]},
}),/SOURCE_DATE_MISMATCH/);

assert.throws(()=>parseOfficialHistoricalA6ValuationPayloadV0_1({
  marketDate:"2026-10-02",observedAt:"2026-10-04T00:00:00Z",
  payload:{stat:"OK",date:"20261002",fields:fields.filter(x=>x!=="股價淨值比"),data:[]},
}),/schema drift/);

assert.deepEqual(
  d08TwseTableObjectsV0_1({status:"ok",fields:["終止上市日期","公司名稱","上市編號"],data:[["115/09/01","三商壽","2867"]]}),
  [{"終止上市日期":"115/09/01","公司名稱":"三商壽","上市編號":"2867"}]
);
assert.deepEqual(
  d08TwseTableObjectsV0_1({stat:"OK",fields:["公司代號","股票上市買賣日期"],data:[["1101","51/02/09"]]}),
  [{"公司代號":"1101","股票上市買賣日期":"51/02/09"}]
);
assert.equal(parseD08TwseDateV0_1("115/09/01"),"2026-09-01");

const reconciledCurrent=reconcileD08TwseCurrentListingStartsV0_1([{
  market:"TWSE",symbol:"6873",companyName:"泓德能源",listingDate:"2024-09-26",
  memberState:"CURRENT",sourceRowHash:"CURRENT-6873",
}],[{
  symbol:"6873",companyName:"泓德能源-創",listingDate:"2023-03-06",
  raw:{公司代號:"6873",公司簡稱:"泓德能源-創",股票上市買賣日期:"112.03.06"},
}]);
assert.equal(reconciledCurrent.adjustedCount,1);
assert.deepEqual(reconciledCurrent.adjustedSymbols,["6873"]);
assert.equal(reconciledCurrent.rows[0].listingDate,"2023-03-06");
assert.equal(reconciledCurrent.rows[0].listingDateReconciledFrom,"2024-09-26");
assert.equal(reconciledCurrent.rows[0].listingDateEvidenceSource,"TWSE_NEWLISTING_EARLIEST_CONTINUOUS_LISTING");
assert.match(reconciledCurrent.rows[0].sourceId,/NEWLISTING_EARLIEST/);

const codeReuseGuard=reconcileD08TwseCurrentListingStartsV0_1([{
  market:"TWSE",symbol:"6873",companyName:"不同公司",listingDate:"2024-09-26",
  memberState:"CURRENT",sourceRowHash:"CURRENT-DIFFERENT",
}],[{
  symbol:"6873",companyName:"泓德能源-創",listingDate:"2023-03-06",
  raw:{公司代號:"6873",公司簡稱:"泓德能源-創",股票上市買賣日期:"112.03.06"},
}]);
assert.equal(codeReuseGuard.adjustedCount,0,"same symbol with different company identity must not be stitched");
assert.equal(codeReuseGuard.rows[0].listingDate,"2024-09-26");

console.log(JSON.stringify({ok:true,guard:"D08_A6_AND_UNIVERSE_SOURCE_CORE",formalCoreImpact:false}));


const semanticFixture={
  registryId:"D08-TEST",
  datasetStartDate:"2023-01-01",
  memberships:[{
    registryId:"D08-TEST",market:"TWSE",symbol:"2330",memberState:"CURRENT",
    datasetStartDate:"2023-01-01",listingDate:"1994-09-05",delistingDate:null,
    firstTradingDate:null,effectiveFrom:"2023-01-01",effectiveTo:null,
    startBasis:"DATASET_START_CLAMP",endBasis:"OPEN_ENDED_CURRENT",replayEligible:true,
    observedAt:"2026-10-04T01:00:00Z",membershipHash:"VOLATILE-A",membershipId:"A",
  }],
};
const semanticA=buildD08SemanticUniverseIdentityV0_1(semanticFixture);
const semanticB=buildD08SemanticUniverseIdentityV0_1({
  ...semanticFixture,
  memberships:[{...semanticFixture.memberships[0],observedAt:"2026-10-04T02:00:00Z",membershipHash:"VOLATILE-B",membershipId:"B"}],
});
assert.equal(semanticA.semanticRegistryHash,semanticB.semanticRegistryHash,
  "semantic universe hash must ignore capture clock and volatile generic membership hash");


const legacy=parseOfficialHistoricalA6ValuationPayloadV0_1({
  marketDate:"2005-09-02",observedAt:"2026-10-04T00:00:00Z",
  payload:{
    stat:"OK",date:"20050902",
    fields:["證券代號","證券名稱","本益比","殖利率(%)","股價淨值比"],
    data:[["1101","台泥","16.92","5.91","1.07"],["1103","嘉泥","-","0.00","0.99"]]
  },
});
assert.equal(legacy.sourceSchemaProfile,"LEGACY_RATIO_ONLY");
assert.equal(legacy.closeFieldProvided,false);
assert.equal(legacy.fiscalReportPeriodFieldProvided,false);
assert.equal(legacy.rows[0].close,null);
assert.equal(legacy.rows[0].closeState,"SOURCE_NOT_PROVIDED");
assert.equal(legacy.rows[0].fiscalReportPeriod,null);
assert.equal(legacy.rows[0].fiscalReportPeriodState,"SOURCE_NOT_PROVIDED");
assert.equal(legacy.rows[0].pe,16.92);
assert.equal(legacy.rows[1].pe,null);
assert.equal(legacy.rows[1].pb,0.99);


const routeUrls=buildOfficialHistoricalA6ValuationUrlsV0_1("2006-08-08");
assert.equal(routeUrls.length,2);
assert.match(routeUrls[0],/exchangeReport\/BWIBBU_d/);
assert.match(routeUrls[1],/rwd\/zh\/afterTrading\/BWIBBU_d/);

let fallbackCalls=0;
const fallbackPayload=JSON.stringify({
  stat:"OK",date:"20060808",
  fields:["證券代號","證券名稱","本益比","殖利率(%)","股價淨值比"],
  data:[["1101","台泥","12.04","5.01","1.23"]]
});
const fallbackFetch=async (url)=>{
  fallbackCalls++;
  if(String(url).includes("/exchangeReport/")) throw new TypeError("simulated primary transport failure");
  return new Response(fallbackPayload,{status:200,headers:{"content-type":"application/json"}});
};
const fallbackResult=await fetchOfficialHistoricalA6ValuationDateV0_1({
  marketDate:"2006-08-08",
  observedAt:"2026-10-05T02:00:00+08:00",
  fetchImpl:fallbackFetch,
  retryAttempts:2,
  retryDelayMs:0,
});
assert.equal(fallbackResult.state,"READY");
assert.equal(fallbackResult.marketDate,"2006-08-08");
assert.equal(fallbackResult.rows[0].pe,12.04);
assert.match(fallbackResult.sourceUrl,/rwd\/zh\/afterTrading\/BWIBBU_d/);
assert.equal(fallbackCalls,2,"fallback should use alternate route immediately before consuming another retry round");

let semanticCalls=0;
const wrongDateFetch=async ()=>{
  semanticCalls++;
  return new Response(JSON.stringify({
    stat:"OK",date:"20060809",
    fields:["證券代號","證券名稱","本益比","殖利率(%)","股價淨值比"],
    data:[["1101","台泥","12.04","5.01","1.23"]]
  }),{status:200,headers:{"content-type":"application/json"}});
};
await assert.rejects(
  fetchOfficialHistoricalA6ValuationDateV0_1({
    marketDate:"2006-08-08",fetchImpl:wrongDateFetch,retryAttempts:3,retryDelayMs:0
  }),
  /SOURCE_DATE_MISMATCH/
);
assert.equal(semanticCalls,1,"semantic/source-date failure must not fall through to alternate route");
