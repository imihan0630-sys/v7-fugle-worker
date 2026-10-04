import assert from "node:assert/strict";
import {
  parseOfficialHistoricalA6ValuationPayloadV0_1,
  buildOfficialHistoricalA6ValuationUrlV0_1,
} from "../runtime/official_historical_a6_valuation_v0_1.mjs";
import { d08TwseTableObjectsV0_1,parseD08TwseDateV0_1,buildD08SemanticUniverseIdentityV0_1 } from "../runtime/d08_twse_historical_universe_source_v0_1.mjs";

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

const legacy2017=parseOfficialHistoricalA6ValuationPayloadV0_1({
  marketDate:"2017-01-03",observedAt:"2026-10-04T00:00:00Z",
  payload:{
    stat:"OK",date:"20170103",
    fields:["證券代號","證券名稱","本益比","殖利率(%)","股價淨值比"],
    data:[
      ["1101","台泥","20.56","3.78","1.23"],
      ["1102","亞泥","31.93","4.15","0.73"],
    ],
  },
});
assert.equal(legacy2017.state,"READY");
assert.equal(legacy2017.rows[0].close,null);
assert.equal(legacy2017.rows[0].fiscalReportPeriod,null);
assert.equal(legacy2017.rows[0].pe,20.56);
assert.equal(legacy2017.rows[0].pb,1.23);
assert.equal(legacy2017.schemaCapabilities.close,false);
assert.equal(legacy2017.schemaCapabilities.fiscalReportPeriod,false);
assert.equal(legacy2017.schemaCapabilities.fiscalDenominatorTransitionDirectlyObservable,false);

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
