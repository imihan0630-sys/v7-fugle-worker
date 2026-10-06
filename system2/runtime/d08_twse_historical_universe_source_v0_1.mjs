import { createHash } from "node:crypto";
import { deepFreeze } from "./factor_snapshot.mjs";
import { parseListingDateV0_1 } from "./current_listing_metadata_v0_1.mjs";
import { buildHistoricalUniverseRegistryV0_1 } from "./historical_universe_registry_v0_1.mjs";
import { buildOfficialTradingDatesV0_1 } from "./official_historical_backfill_source_v0_1.mjs";
import { fetchOfficialHistoricalA1DateV0_1 } from "./official_historical_a1_source_v0_1.mjs";

export const D08_TWSE_HISTORICAL_UNIVERSE_SOURCE_VERSION="0.1-RESEARCH";
const CURRENT_URL="https://openapi.twse.com.tw/v1/opendata/t187ap03_L";
const NEW_URL="https://www.twse.com.tw/rwd/zh/company/newlisting?response=json";
const DEL_URL="https://www.twse.com.tw/rwd/zh/company/suspendListing?response=json";

function sha(v){return createHash("sha256").update(typeof v==="string"?v:JSON.stringify(v)).digest("hex");}
function ordinary(v){return /^[1-9][0-9]{3}$/.test(String(v??"").trim());}
export function parseD08TwseDateV0_1(raw){
  let s=String(raw??"").trim();
  if(!s) return null;
  s=s.replace(/[年月]/g,"/").replace(/日/g,"").replaceAll(".","/");
  return parseListingDateV0_1(s);
}
export function d08TwseTableObjectsV0_1(payload){
  const ok=payload?.stat==="OK"||String(payload?.status??"").toLowerCase()==="ok";
  if(!ok) throw new Error("TWSE table success status invalid");
  if(!Array.isArray(payload.fields)||!Array.isArray(payload.data)) throw new Error("TWSE table fields/data invalid");
  return payload.data.map(row=>Object.fromEntries(payload.fields.map((h,i)=>[h,row[i]])));
}
function normalizedCompanyIdentityV0_1(value){
  return String(value??"").normalize("NFKC").replace(/\s+/g,"").replace(/[－–—]/g,"-").replace(/-創$/u,"");
}
export function reconcileD08TwseCurrentListingStartsV0_1(currentRows=[],newRows=[]){
  if(!Array.isArray(currentRows)||!Array.isArray(newRows)) throw new Error("currentRows/newRows must be arrays");
  const bySymbol=new Map();
  for(const row of newRows){
    if(!ordinary(row?.symbol)||!row?.listingDate) continue;
    if(!bySymbol.has(row.symbol)) bySymbol.set(row.symbol,[]);
    bySymbol.get(row.symbol).push(row);
  }
  for(const rows of bySymbol.values()) rows.sort((a,b)=>a.listingDate.localeCompare(b.listingDate));

  const adjustedSymbols=[];
  const rows=currentRows.map((row)=>{
    const currentName=normalizedCompanyIdentityV0_1(row?.companyName);
    const candidates=(bySymbol.get(row?.symbol)||[]).filter((candidate)=>{
      if(!candidate?.listingDate||!row?.listingDate||candidate.listingDate>row.listingDate) return false;
      const candidateName=normalizedCompanyIdentityV0_1(candidate.companyName);
      return currentName&&candidateName&&currentName===candidateName;
    });
    const earliest=candidates[0]||null;
    if(!earliest||earliest.listingDate>=row.listingDate) return row;
    adjustedSymbols.push(row.symbol);
    return {
      ...row,
      listingDate:earliest.listingDate,
      sourceId:"TWSE_OPENAPI_T187AP03_L_PLUS_NEWLISTING_EARLIEST",
      sourceName:"TWSE current listed-company basic data + official newlisting earliest continuous listing",
      sourceUrl:CURRENT_URL+" | "+NEW_URL,
      sourceRowHash:sha({
        currentSourceRowHash:row.sourceRowHash||null,
        newlisting:earliest.raw||{
          symbol:earliest.symbol,companyName:earliest.companyName,listingDate:earliest.listingDate,
        },
        reconciledListingDate:earliest.listingDate,
      }),
      listingDateReconciledFrom:row.listingDate,
      listingDateEvidenceSource:"TWSE_NEWLISTING_EARLIEST_CONTINUOUS_LISTING",
    };
  });
  return deepFreeze({
    rows:Object.freeze(rows),
    adjustedCount:adjustedSymbols.length,
    adjustedSymbols:Object.freeze([...new Set(adjustedSymbols)].sort()),
    schemaVersion:"D08_TWSE_CURRENT_LISTING_START_RECONCILIATION_V0_1",
  });
}
async function getJson(url,fetchImpl){
  const r=await fetchImpl(url,{
    headers:{accept:"application/json","user-agent":"System2-D08-Universe/0.1"},
    signal:AbortSignal.timeout(45000),
  });
  const text=await r.text();
  if(!r.ok) throw new Error("TWSE universe HTTP "+r.status+" "+url);
  return {url,text,payload:JSON.parse(text),hash:sha(text)};
}


export function d08SemanticMembershipCoreV0_1(m){
  if(!m||typeof m!=="object") throw new Error("membership is required");
  return deepFreeze({
    registryId:String(m.registryId),
    market:String(m.market),
    symbol:String(m.symbol),
    memberState:String(m.memberState),
    datasetStartDate:m.datasetStartDate||null,
    listingDate:m.listingDate||null,
    delistingDate:m.delistingDate||null,
    firstTradingDate:m.firstTradingDate||null,
    effectiveFrom:m.effectiveFrom||null,
    effectiveTo:m.effectiveTo||null,
    startBasis:m.startBasis||null,
    endBasis:m.endBasis||null,
    replayEligible:m.replayEligible===true,
    schemaVersion:"D08_TWSE_SEMANTIC_MEMBERSHIP_V0_1",
  });
}

export function buildD08SemanticUniverseIdentityV0_1(registry){
  if(!registry||!Array.isArray(registry.memberships)) throw new Error("registry.memberships is required");
  const memberships=registry.memberships.map(d08SemanticMembershipCoreV0_1).sort((a,b)=>
    a.market.localeCompare(b.market)||a.symbol.localeCompare(b.symbol)||
    String(a.effectiveFrom||"").localeCompare(String(b.effectiveFrom||""))||
    String(a.effectiveTo||"").localeCompare(String(b.effectiveTo||""))
  );
  const text=JSON.stringify({
    registryId:registry.registryId,
    datasetStartDate:registry.datasetStartDate,
    memberships,
    schemaVersion:"D08_TWSE_SEMANTIC_UNIVERSE_V0_1",
  });
  return deepFreeze({
    registryId:registry.registryId,
    datasetStartDate:registry.datasetStartDate,
    membershipCount:memberships.length,
    memberships:Object.freeze(memberships),
    semanticRegistryHash:sha(text),
    schemaVersion:"D08_TWSE_SEMANTIC_UNIVERSE_IDENTITY_V0_1",
  });
}

export async function buildD08TwseHistoricalUniverseSourceV0_1({
  datasetStartDate="2023-01-01",observedAt=new Date().toISOString(),fetchImpl=globalThis.fetch,
}={}){
  if(typeof fetchImpl!=="function") throw new Error("fetchImpl is required");
  const [currentRaw,newRaw,delRaw]=await Promise.all([
    getJson(CURRENT_URL,fetchImpl),getJson(NEW_URL,fetchImpl),getJson(DEL_URL,fetchImpl),
  ]);
  if(!Array.isArray(currentRaw.payload)||currentRaw.payload.length<500) throw new Error("TWSE current company payload invalid");
  for(const h of ["公司代號","公司名稱","上市日期"]){
    if(!Object.prototype.hasOwnProperty.call(currentRaw.payload[0],h)) throw new Error("TWSE current schema missing "+h);
  }
  const currentBase=currentRaw.payload.map(r=>({
    market:"TWSE",symbol:String(r["公司代號"]??"").trim(),
    companyName:String(r["公司名稱"]??"").trim()||null,
    industry:String(r["產業別"]??"").trim()||null,
    memberState:"CURRENT",listingDate:parseD08TwseDateV0_1(r["上市日期"]),
    delistingDate:null,sourceId:"TWSE_OPENAPI_T187AP03_L",
    sourceName:"TWSE current listed-company basic data",sourceUrl:CURRENT_URL,sourceRowHash:sha(r),
  })).filter(x=>ordinary(x.symbol)&&x.listingDate);

  const newRows=d08TwseTableObjectsV0_1(newRaw.payload).map(r=>({
    symbol:String(r["公司代號"]??"").trim(),
    companyName:String(r["公司簡稱"]??r["公司名稱"]??"").trim()||null,
    listingDate:parseD08TwseDateV0_1(r["股票上市買賣日期"]),raw:r,
  })).filter(x=>ordinary(x.symbol)&&x.listingDate);
  const currentReconciliation=reconcileD08TwseCurrentListingStartsV0_1(currentBase,newRows);
  const current=currentReconciliation.rows;

  const delRows=d08TwseTableObjectsV0_1(delRaw.payload).map(r=>({
    symbol:String(r["上市編號"]??r["公司代號"]??"").trim(),
    companyName:String(r["公司名稱"]??r["公司簡稱"]??"").trim()||null,
    delistingDate:parseD08TwseDateV0_1(r["終止上市日期"]),raw:r,
  })).filter(x=>ordinary(x.symbol)&&x.delistingDate&&x.delistingDate>=datasetStartDate);

  const bySymbol=new Map();
  for(const r of newRows){
    if(!bySymbol.has(r.symbol)) bySymbol.set(r.symbol,[]);
    bySymbol.get(r.symbol).push(r);
  }
  for(const xs of bySymbol.values()) xs.sort((a,b)=>a.listingDate.localeCompare(b.listingDate));

  const unresolved=[];
  const pairs=delRows.map(d=>{
    const candidates=(bySymbol.get(d.symbol)||[]).filter(x=>x.listingDate<=d.delistingDate);
    const listing=candidates.at(-1)||null;
    if(!listing) unresolved.push(d);
    return {d,listing};
  });

  const trading=await buildOfficialTradingDatesV0_1({
    fromDate:datasetStartDate,toDate:datasetStartDate.slice(0,8)+"07",fetchImpl,
  });
  if(!trading.tradingDates.length) throw new Error("dataset start trading date unresolved");
  const firstTradingDate=trading.tradingDates[0];
  const firstWitness=await fetchOfficialHistoricalA1DateV0_1({
    market:"TWSE",marketDate:firstTradingDate,observedAt,fetchImpl,
  });
  if(firstWitness.state!=="READY") throw new Error("dataset-start A1 witness not READY");
  const firstSymbols=new Set(firstWitness.rows.map(x=>x.symbol));
  const firstTradingDateByMarketSymbol={};
  for(const u of unresolved){
    if(!firstSymbols.has(u.symbol)) throw new Error("UNRESOLVED_OLD_DELISTED_START:"+u.symbol);
    firstTradingDateByMarketSymbol["TWSE|"+u.symbol]=firstTradingDate;
  }

  const delisted=pairs.map(({d,listing})=>({
    market:"TWSE",symbol:d.symbol,companyName:d.companyName||listing?.companyName||null,
    industry:null,memberState:"DELISTED",listingDate:listing?.listingDate||null,
    delistingDate:d.delistingDate,
    sourceId:listing?"TWSE_NEWLISTING_PLUS_DELISTING":"TWSE_DATASET_START_HISTORY_PLUS_DELISTING",
    sourceName:listing?"TWSE newlisting + suspendListing":"TWSE MI_INDEX dataset-start presence + suspendListing",
    sourceUrl:listing?NEW_URL+" | "+DEL_URL:firstWitness.sourceUrl+" | "+DEL_URL,
    sourceRowHash:sha({newlisting:listing?.raw||null,delisting:d.raw,firstTradingDate:listing?null:firstTradingDate}),
  }));

  const registry=await buildHistoricalUniverseRegistryV0_1({
    registryId:"D08-TWSE-2023-2026-OFFICIAL-UNION-V0.1",
    sourceRows:[...current,...delisted],
    datasetStartDate,observedAt,firstTradingDateByMarketSymbol,
  });
  if(registry.unknownStartCount!==0||registry.replayEligibleCount!==registry.membershipCount){
    throw new Error("D08 TWSE historical registry incomplete");
  }
  return deepFreeze({
    registry,
    sourceReceipt:deepFreeze({
      currentCount:current.length,newListingHistoryCount:newRows.length,
      currentListingStartReconciledCount:currentReconciliation.adjustedCount,
      currentListingStartReconciledSymbols:currentReconciliation.adjustedSymbols,
      delistedCount:delisted.length,datasetStartFallbackCount:unresolved.length,
      datasetStartFallbackSymbols:Object.freeze(unresolved.map(x=>x.symbol).sort()),
      datasetFirstTradingDate:firstTradingDate,
      currentSourceHash:currentRaw.hash,newListingSourceHash:newRaw.hash,delistingSourceHash:delRaw.hash,
      schemaVersion:"D08_TWSE_HISTORICAL_UNIVERSE_SOURCE_V0_1",
    }),
  });
}
