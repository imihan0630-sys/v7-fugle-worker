import crypto from "node:crypto";
import { gunzipSync } from "node:zlib";
import { writeFile } from "node:fs/promises";
import { createRemoteD1RestAdapter } from "../system2/deploy/remote_d1_rest_adapter.mjs";
import { createRemoteR2S3Adapter } from "../system2/deploy/remote_r2_s3_adapter.mjs";
import { loadHistoricalBarsFromColdPacksV0_1 } from "../system2/runtime/historical_cold_pack_store_v0_1.mjs";
import { materializeHistoricalA1PackRowsV0_1 } from "../system2/runtime/historical_pack_store_v0_1.mjs";
import { fetchHistoricalTwseCalendarV0_1 } from "../system2/runtime/historical_twse_calendar_v0_1.mjs";
import { conservativeHistoricalAvailableAt } from "../system2/runtime/official_full_market_daily_history_adapter_v0_1.mjs";
import { historicalUniverseMembershipActiveOnDateV0_1 } from "../system2/runtime/historical_universe_registry_v0_1.mjs";
import { buildD08TwseHistoricalUniverseSourceV0_1, buildD08SemanticUniverseIdentityV0_1 } from "../system2/runtime/d08_twse_historical_universe_source_v0_1.mjs";

const VERSION="ROOM11_NUMERIC_L3_BATCH_V0_2";
export const PINNED_TWSE_2025_REGISTRY=Object.freeze({
  registryId:"S2-DATA-TWSE-2025-OFFICIAL-UNION-V0.1",
  registryHash:"8d6d57a6a7791a95cd48c4cb98ddb41a9af2ce6415d619995bafcaf5a1915535",
  membershipCount:1096,
  replayEligibleCount:1096,
  unknownStartCount:0,
  currentCount:1089,
  delistedCount:7,
});
export const PINNED_TWSE_2025_ANNUAL_EVIDENCE=Object.freeze({
  runId:37720726697,
  headSha:"836184f98726449107cdbd0ed83e2746bbbcf965",
  artifactId:11527595746,
  artifactDigest:"sha256:41ab589d5f38e667f8fb61427d2053d38d9f62d23e044d22a8c7e0f441cd56df",
  manifestRollingHash:"4b01e356aae94e5b1be6c40732602c342bc3ba9c43c1851b1cf6778d3063a29d",
  packCount:1070,
  barCount:254854,
  sourceReconciliationState:"PASS",
});
function stable(v){if(Array.isArray(v))return v.map(stable);if(v&&typeof v==="object")return Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])]));return v;}
const stableJson=v=>JSON.stringify(stable(v));
const sha256=v=>crypto.createHash("sha256").update(typeof v==="string"?v:stableJson(v)).digest("hex");
function must(c,m){if(!c)throw new Error(m);}
function mean(a){return a.reduce((x,y)=>x+y,0)/a.length;}
function mse(a,b){return mean(a.map((x,i)=>(x-b[i])**2));}
function mae(a,b){return mean(a.map((x,i)=>Math.abs(x-b[i])));}
function quantile(xs,q){const a=[...xs].sort((x,y)=>x-y);if(!a.length)return null;const p=(a.length-1)*q,l=Math.floor(p),h=Math.ceil(p);return l===h?a[l]:a[l]+(a[h]-a[l])*(p-l);}
function sigmoid(x){if(x>=0){const z=Math.exp(-x);return 1/(1+z);}const z=Math.exp(x);return z/(1+z);}
function dateDecisionTs(d){return conservativeHistoricalAvailableAt(d);}

export function guardedDb(db){
  function check(sql){
    const t=String(sql||"").trim();
    must(/^(SELECT|WITH|PRAGMA)\b/i.test(t),"READONLY_SQL_REQUIRED");
    must(!/\b(INSERT|UPDATE|DELETE|REPLACE|CREATE|DROP|ALTER|VACUUM|ATTACH|DETACH)\b/i.test(t),"MUTATING_SQL_FORBIDDEN");
    return t;
  }
  return {
    prepare(sql){check(sql);return db.prepare(sql);},
    batch(stmts){for(const s of stmts)check(s.sql);return db.batch(stmts);},
    rawQuery(sql,params=[]){check(sql);return db.rawQuery(sql,params);},
    metrics:db.metrics,
    database:db.database,
  };
}

function rfc3986(value){
  return encodeURIComponent(String(value)).replace(/[!'()*]/g,c=>"%"+c.charCodeAt(0).toString(16).toUpperCase());
}
function hmac(key,value,encoding=undefined){return crypto.createHmac("sha256",key).update(value).digest(encoding);}
function r2SigningKey(secret,shortDate){
  const d=hmac("AWS4"+secret,shortDate),r=hmac(d,"auto"),svc=hmac(r,"s3");
  return hmac(svc,"aws4_request");
}
function xmlDecode(text){
  return String(text).replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'");
}
export async function listR2KeysReadOnly({accountId,accessKeyId,secretAccessKey,bucketName,prefix,fetchImpl=fetch,now=()=>new Date()}={}){
  for(const [k,v] of Object.entries({accountId,accessKeyId,secretAccessKey,bucketName,prefix}))must(v,`R2_LIST_${k}_MISSING`);
  const host=`${accountId}.r2.cloudflarestorage.com`;
  const path="/"+rfc3986(bucketName);
  const emptyHash=crypto.createHash("sha256").update("").digest("hex");
  let token=null;
  const keys=[];
  for(let page=0;page<10;page++){
    const params=[["list-type","2"],["max-keys","1000"],["prefix",prefix]];
    if(token)params.push(["continuation-token",token]);
    params.sort((a,b)=>rfc3986(a[0]).localeCompare(rfc3986(b[0]))||rfc3986(a[1]).localeCompare(rfc3986(b[1])));
    const query=params.map(([k,v])=>`${rfc3986(k)}=${rfc3986(v)}`).join("&");
    const stamp=now().toISOString().replace(/[:-]|\.\d{3}/g,"");
    const short=stamp.slice(0,8);
    const headers=new Headers({host,"x-amz-content-sha256":emptyHash,"x-amz-date":stamp});
    const canonicalHeaders=`host:${host}\nx-amz-content-sha256:${emptyHash}\nx-amz-date:${stamp}\n`;
    const signedHeaders="host;x-amz-content-sha256;x-amz-date";
    const canonicalRequest=["GET",path,query,canonicalHeaders,signedHeaders,emptyHash].join("\n");
    const scope=`${short}/auto/s3/aws4_request`;
    const stringToSign=["AWS4-HMAC-SHA256",stamp,scope,crypto.createHash("sha256").update(canonicalRequest).digest("hex")].join("\n");
    const signature=hmac(r2SigningKey(secretAccessKey,short),stringToSign,"hex");
    headers.set("authorization",`AWS4-HMAC-SHA256 Credential=${accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`);
    const response=await fetchImpl(`https://${host}${path}?${query}`,{method:"GET",headers,signal:AbortSignal.timeout(60000)});
    const body=await response.text();
    must(response.ok,`R2_LIST_HTTP_${response.status}`);
    for(const match of body.matchAll(/<Key>([\s\S]*?)<\/Key>/g))keys.push(xmlDecode(match[1]));
    const truncated=/<IsTruncated>true<\/IsTruncated>/.test(body);
    if(!truncated)return keys;
    const m=body.match(/<NextContinuationToken>([\s\S]*?)<\/NextContinuationToken>/);
    must(m?.[1],"R2_LIST_CONTINUATION_TOKEN_MISSING");
    token=xmlDecode(m[1]);
  }
  throw new Error("R2_LIST_PAGE_LIMIT_EXCEEDED");
}

async function loadAnnualPackDirectFromR2({objectStore,key}){
  const match=String(key).match(/^a1\/v0\.1\/market=TWSE\/year=2025\/symbol=([1-9][0-9]{3})\/price_space=RAW\/([a-f0-9]{64})\.json\.gz$/);
  must(match,"R2_PACK_KEY_CONTRACT_MISMATCH");
  const [,symbol,payloadHash]=match;
  const object=await objectStore.get(key);
  must(object,"R2_PACK_OBJECT_MISSING");
  const bytes=Buffer.from(object.bytes);
  const actualObjectSha=crypto.createHash("sha256").update(bytes).digest("hex");
  const md=object.metadata?.customMetadata||{};
  must(md["payload-hash"]===payloadHash,"R2_PACK_PAYLOAD_METADATA_MISMATCH");
  must(md["object-sha256"]===actualObjectSha,"R2_PACK_OBJECT_SHA_MISMATCH");
  must(md["pack-schema"]==="S2_HISTORICAL_A1_PACK_RESEARCH_V0_1","R2_PACK_SCHEMA_MISMATCH");
  const payload=JSON.parse(gunzipSync(bytes).toString("utf8"));
  must(payload.market==="TWSE"&&Number(payload.year)===2025&&payload.symbol===symbol&&payload.priceSpace==="RAW","R2_PACK_PAYLOAD_IDENTITY_MISMATCH");
  must(Array.isArray(payload.bars)&&payload.bars.length>=1,"R2_PACK_BARS_MISSING");
  const firstMarketDate=payload.bars[0][0],lastMarketDate=payload.bars.at(-1)[0];
  const pack={
    packId:"S2HP-A1-"+payloadHash,market:"TWSE",symbol,year:2025,priceSpace:"RAW",
    firstMarketDate,lastMarketDate,barCount:payload.bars.length,payloadHash,
    gzipBase64:bytes.toString("base64"),capturedAt:object.metadata?.uploadedAt||"R2_UPLOAD_TIME_UNKNOWN",
    schemaVersion:"S2_HISTORICAL_A1_PACK_RESEARCH_V0_1",
  };
  const materialized=await materializeHistoricalA1PackRowsV0_1({pack});
  return {
    symbol,rows:materialized.rows,
    evidence:{symbol,objectKey:key,payloadHash,objectSha256:actualObjectSha,loadedRowCount:materialized.rowCount,r2UploadedAt:object.metadata?.uploadedAt||null},
  };
}


export function buildRows(symbolBars,officialTradingDates){
  must(Array.isArray(officialTradingDates)&&officialTradingDates.length>=80,"OFFICIAL_TRADING_DATES_REQUIRED");
  const orderedDates=[...new Set(officialTradingDates)].sort();
  const dateIndex=new Map(orderedDates.map((d,i)=>[d,i]));
  const out=[];
  for(const [symbol,bars0] of symbolBars){
    const bars=[...bars0].sort((a,b)=>a.marketDate.localeCompare(b.marketDate));
    for(let i=2;i<bars.length-1;i++){
      const p2=bars[i-2],p1=bars[i-1],cur=bars[i],nxt=bars[i+1];
      if(![p2,p1,cur,nxt].every(x=>x?.pitReplayEligible===true))continue;
      const ci=dateIndex.get(cur.marketDate);
      if(!Number.isInteger(ci)||ci<2||ci+1>=orderedDates.length)continue;
      if(p2.marketDate!==orderedDates[ci-2]||p1.marketDate!==orderedDates[ci-1]||nxt.marketDate!==orderedDates[ci+1])continue;
      const vals=[p2.tradeValue,p1.tradeValue,cur.tradeValue,nxt.tradeValue,cur.transactions,cur.volumeShares];
      if(!vals.every(Number.isFinite))continue;
      if(vals.some(x=>x<0)||cur.tradeValue<=0||p1.tradeValue<=0||p2.tradeValue<=0||nxt.tradeValue<=0)continue;
      const decisionTimestamp=dateDecisionTs(cur.marketDate);
      if(Date.parse(cur.availableAt)>Date.parse(decisionTimestamp))continue;
      if(Date.parse(nxt.availableAt)<=Date.parse(decisionTimestamp))continue;
      const logTV2=Math.log1p(p2.tradeValue),logTV1=Math.log1p(p1.tradeValue),logTV0=Math.log1p(cur.tradeValue),logTVNext=Math.log1p(nxt.tradeValue);
      out.push({
        market:"TWSE",symbol,decisionDate:cur.marketDate,decisionTimestamp,
        outcomeDate:nxt.marketDate,outcomeAvailableAt:nxt.availableAt,
        sourceRowHash:cur.sourceRowHash,nextSourceRowHash:nxt.sourceRowHash,
        currentContinuityState:cur.continuityState,nextContinuityState:nxt.continuityState,
        x:[logTV0,logTV1,Math.log1p(cur.transactions),Math.log1p(cur.volumeShares)],
        y:logTVNext,
        binaryY:logTVNext>logTV0?1:0,
        delta:logTVNext-logTV0,
      });
    }
  }
  out.sort((a,b)=>a.decisionDate.localeCompare(b.decisionDate)||a.symbol.localeCompare(b.symbol));
  return out;
}

export function splitDates(rows){
  const dates=[...new Set(rows.map(x=>x.decisionDate))].sort();
  must(dates.length>=80,"INSUFFICIENT_INDEPENDENT_DATES");
  const a=Math.floor(dates.length*0.6),b=Math.floor(dates.length*0.8);
  must(a>0 && b>a && b<dates.length,"CHRONOLOGICAL_SPLIT_INVALID");
  const trainDates=dates.slice(0,a),validationDates=dates.slice(a,b),testDates=dates.slice(b);
  const trainSet=new Set(trainDates),valSet=new Set(validationDates),testSet=new Set(testDates);
  const firstValidationDate=validationDates[0],firstTestDate=testDates[0];
  const split=r=>{
    if(trainSet.has(r.decisionDate)){
      return r.outcomeDate>=firstValidationDate?"PURGED_TRAIN_BOUNDARY":"TRAIN";
    }
    if(valSet.has(r.decisionDate)){
      return r.outcomeDate>=firstTestDate?"PURGED_VALIDATION_BOUNDARY":"VALIDATION";
    }
    if(testSet.has(r.decisionDate))return "TEST";
    throw new Error("ROW_DECISION_DATE_OUTSIDE_SPLIT");
  };
  return {dates,trainDates,validationDates,testDates,firstValidationDate,firstTestDate,split};
}

function normalizeMembershipRow(row){
  return {
    registryId:String(row.registry_id||""),
    symbol:String(row.symbol||""),
    membershipId:String(row.membership_id||""),
    membershipHash:String(row.membership_hash||""),
    effectiveFrom:row.effective_from||null,
    effectiveTo:row.effective_to||null,
    endBasis:row.end_basis||null,
    replayEligible:Number(row.replay_eligible)===1,
  };
}

export function bindHistoricalMembership(rows,membershipRows,registryReceipt,expectedRegistry=PINNED_TWSE_2025_REGISTRY){
  must(registryReceipt && registryReceipt.registry_id===expectedRegistry.registryId,"REGISTRY_ID_MISMATCH");
  must(registryReceipt.registry_hash===expectedRegistry.registryHash,"REGISTRY_HASH_MISMATCH");
  for(const field of ["membershipCount","replayEligibleCount","unknownStartCount","currentCount","delistedCount"]){
    const dbField={membershipCount:"membership_count",replayEligibleCount:"replay_eligible_count",unknownStartCount:"unknown_start_count",currentCount:"current_count",delistedCount:"delisted_count"}[field];
    must(Number(registryReceipt[dbField])===Number(expectedRegistry[field]),"REGISTRY_COUNT_MISMATCH_"+field);
  }
  const bySymbol=new Map();
  for(const raw of membershipRows||[]){
    const m=normalizeMembershipRow(raw);
    must(m.registryId===expectedRegistry.registryId,"MEMBERSHIP_REGISTRY_MISMATCH");
    if(!bySymbol.has(m.symbol))bySymbol.set(m.symbol,[]);
    bySymbol.get(m.symbol).push(m);
  }
  const admitted=[],blocked=[];
  for(const row of rows){
    const ms=bySymbol.get(String(row.symbol))||[];
    const decision=ms.filter(m=>historicalUniverseMembershipActiveOnDateV0_1(m,row.decisionDate));
    const outcome=ms.filter(m=>historicalUniverseMembershipActiveOnDateV0_1(m,row.outcomeDate));
    if(decision.length!==1 || outcome.length!==1 || decision[0].membershipId!==outcome[0].membershipId){
      blocked.push({...row,membershipBlockReason:decision.length!==1?"DECISION_MEMBERSHIP_NOT_UNIQUE":outcome.length!==1?"OUTCOME_MEMBERSHIP_NOT_UNIQUE":"MEMBERSHIP_INTERVAL_CHANGED"});
      continue;
    }
    const m=decision[0];
    must(/^[a-f0-9]{64}$/i.test(m.membershipHash),"MEMBERSHIP_HASH_INVALID");
    admitted.push({...row,registryId:expectedRegistry.registryId,registryHash:expectedRegistry.registryHash,membershipId:m.membershipId,membershipHash:m.membershipHash});
  }
  return {rows:admitted,blockedRows:blocked,blockedCount:blocked.length,admittedCount:admitted.length};
}

export function bindHistoricalMembershipFromRegistry(rows,registry){
  must(registry?.schemaVersion==="S2_HISTORICAL_UNIVERSE_REGISTRY_V0_1","OFFICIAL_REGISTRY_INVALID");
  must(Array.isArray(registry.memberships)&&registry.memberships.length>0,"OFFICIAL_REGISTRY_MEMBERSHIPS_MISSING");
  must(registry.unknownStartCount===0 && registry.replayEligibleCount===registry.membershipCount,"OFFICIAL_REGISTRY_NOT_REPLAY_COMPLETE");
  const bySymbol=new Map();
  for(const m of registry.memberships){
    if(m.market!=="TWSE")continue;
    if(!bySymbol.has(m.symbol))bySymbol.set(m.symbol,[]);
    bySymbol.get(m.symbol).push(m);
  }
  const admitted=[],blocked=[];
  for(const row of rows){
    const ms=bySymbol.get(String(row.symbol))||[];
    const decision=ms.filter(m=>historicalUniverseMembershipActiveOnDateV0_1(m,row.decisionDate));
    const outcome=ms.filter(m=>historicalUniverseMembershipActiveOnDateV0_1(m,row.outcomeDate));
    if(decision.length!==1 || outcome.length!==1 || decision[0].membershipId!==outcome[0].membershipId){
      blocked.push({...row,membershipBlockReason:decision.length!==1?"DECISION_MEMBERSHIP_NOT_UNIQUE":outcome.length!==1?"OUTCOME_MEMBERSHIP_NOT_UNIQUE":"MEMBERSHIP_INTERVAL_CHANGED"});
      continue;
    }
    const m=decision[0];
    must(/^[a-f0-9]{64}$/i.test(String(m.membershipHash||"")),"MEMBERSHIP_HASH_INVALID");
    admitted.push({...row,registryId:registry.registryId,registryHash:registry.registryHash,membershipId:m.membershipId,membershipHash:m.membershipHash});
  }
  return {rows:admitted,blockedRows:blocked,blockedCount:blocked.length,admittedCount:admitted.length};
}

export function buildPanelFeasibility(rows){
  must(Array.isArray(rows)&&rows.length>0,"PANEL_ROWS_REQUIRED");
  const seen=new Set(),byDate=new Map(),byIssuer=new Map();
  for(const r of rows){
    must(r.membershipId&&r.membershipHash,"PANEL_MEMBERSHIP_REQUIRED");
    const key=r.decisionDate+"|"+r.symbol;
    must(!seen.has(key),"DUPLICATE_ISSUER_DATE");
    seen.add(key);
    if(!byDate.has(r.decisionDate))byDate.set(r.decisionDate,new Set());
    if(!byIssuer.has(r.symbol))byIssuer.set(r.symbol,new Set());
    byDate.get(r.decisionDate).add(r.symbol);
    byIssuer.get(r.symbol).add(r.decisionDate);
  }
  const dates=[...byDate.keys()].sort(),issuers=[...byIssuer.keys()].sort();
  must(dates.length>=80&&issuers.length>=8,"PANEL_SUPPORT_INSUFFICIENT");
  const observedCellN=rows.length,totalPossibleCellN=dates.length*issuers.length;
  const missingCellN=totalPossibleCellN-observedCellN;
  must(missingCellN>=0,"PANEL_CELL_ACCOUNTING_INVALID");
  const dateCellCounts=dates.map(d=>byDate.get(d).size);
  const issuerDateCounts=issuers.map(s=>byIssuer.get(s).size);
  const out={
    schemaVersion:"D16_PANEL_FEASIBILITY_V0_1",
    observedCellN,totalPossibleCellN,missingCellN,
    missingCellsImputedAsZero:false,
    independentDateN:dates.length,issuerN:issuers.length,
    minIssuerPerDate:Math.min(...dateCellCounts),maxIssuerPerDate:Math.max(...dateCellCounts),
    minDatePerIssuer:Math.min(...issuerDateCounts),maxDatePerIssuer:Math.max(...issuerDateCounts),
    balancedPanel:missingCellN===0,
    dateClusterKey:"decisionDate",issuerClusterKey:"symbol",
    rowPoolingAsIndependentEvidence:false,
    twoWayDependenceInspectable:true,
    panelIdentityHash:sha256(rows.map(r=>[r.decisionDate,r.symbol,r.membershipHash,r.sourceRowHash,r.nextSourceRowHash,r.partition])),
  };
  return {...out,receiptHash:sha256(out)};
}


export function fitAr1(rows){
  const bySymbol=new Map();
  for(const r of rows){if(!bySymbol.has(r.symbol))bySymbol.set(r.symbol,[]);bySymbol.get(r.symbol).push(r);}
  const results=[];
  for(const [symbol,rs] of bySymbol){
    const train=rs.filter(r=>r.partition==="TRAIN");
    const test=rs.filter(r=>r.partition==="TEST");
    if(train.length<40||test.length<10)continue;
    const xs=train.map(r=>r.x[0]),ys=train.map(r=>r.y),mx=mean(xs),my=mean(ys);
    const den=xs.reduce((a,x)=>a+(x-mx)**2,0);
    if(den<=0)continue;
    const beta=xs.reduce((a,x,i)=>a+(x-mx)*(ys[i]-my),0)/den,alpha=my-beta*mx;
    const pred=test.map(r=>alpha+beta*r.x[0]),naive=test.map(r=>r.x[0]),actual=test.map(r=>r.y);
    results.push({symbol,trainN:train.length,testN:test.length,alpha,beta,testMae:mae(actual,pred),naiveMae:mae(actual,naive)});
  }
  must(results.length>=5,"INSUFFICIENT_TIME_SERIES_MODELS");
  return results;
}

function solve(A,b){
  const n=b.length,M=A.map((r,i)=>[...r,b[i]]);
  for(let c=0;c<n;c++){
    let p=c;for(let r=c+1;r<n;r++)if(Math.abs(M[r][c])>Math.abs(M[p][c]))p=r;
    must(Math.abs(M[p][c])>1e-12,"SINGULAR_MATRIX");
    [M[c],M[p]]=[M[p],M[c]];
    const d=M[c][c];for(let j=c;j<=n;j++)M[c][j]/=d;
    for(let r=0;r<n;r++)if(r!==c){const f=M[r][c];for(let j=c;j<=n;j++)M[r][j]-=f*M[c][j];}
  }
  return M.map(r=>r[n]);
}
function standardizer(rows,idx){
  const mu=idx.map(j=>mean(rows.map(r=>r.x[j])));
  const sd=idx.map((j,k)=>Math.sqrt(mean(rows.map(r=>(r.x[j]-mu[k])**2)))||1);
  return {mu,sd,apply:r=>idx.map((j,k)=>(r.x[j]-mu[k])/sd[k])};
}
function fitRidge(rows,idx,lambda){
  const st=standardizer(rows,idx),p=idx.length+1,A=Array.from({length:p},()=>Array(p).fill(0)),b=Array(p).fill(0);
  for(const r of rows){
    const z=[1,...st.apply(r)];
    for(let i=0;i<p;i++){b[i]+=z[i]*r.y;for(let j=0;j<p;j++)A[i][j]+=z[i]*z[j];}
  }
  for(let i=1;i<p;i++)A[i][i]+=lambda;
  const coef=solve(A,b);
  return {coef,st,predict:r=>{const z=[1,...st.apply(r)];return z.reduce((a,x,i)=>a+x*coef[i],0);}};
}
export function nestedFeatureSelection(rows){
  const tr=rows.filter(r=>r.partition==="TRAIN"),va=rows.filter(r=>r.partition==="VALIDATION"),te=rows.filter(r=>r.partition==="TEST");
  const families=[
    {id:"LAG_TV",idx:[0]},
    {id:"LAG_TV_TXN",idx:[0,2]},
    {id:"LAG_TV_TXN_VOL",idx:[0,2,3]},
  ];
  const lambdas=[0,0.1,1];
  const candidates=[];
  for(const f of families)for(const l of lambdas){
    const model=fitRidge(tr,f.idx,l);
    candidates.push({familyId:f.id,idx:f.idx,lambda:l,validationMse:mse(va.map(r=>r.y),va.map(r=>model.predict(r)))});
  }
  candidates.sort((a,b)=>a.validationMse-b.validationMse||a.familyId.localeCompare(b.familyId)||a.lambda-b.lambda);
  const selected=candidates[0];
  const refitRows=[...tr,...va];
  const model=fitRidge(refitRows,selected.idx,selected.lambda);
  const testMse=mse(te.map(r=>r.y),te.map(r=>model.predict(r)));
  return {selected:{familyId:selected.familyId,lambda:selected.lambda,validationMse:selected.validationMse},candidateCount:candidates.length,trainN:tr.length,validationN:va.length,testN:te.length,testMse,outerTestUsedForSelection:false,preprocessingFitOnOuterTest:false};
}

function fitLogistic(rows,idx,lambda=0.1,steps=500,lr=0.05){
  const st=standardizer(rows,idx),p=idx.length+1,w=Array(p).fill(0);
  for(let step=0;step<steps;step++){
    const g=Array(p).fill(0);
    for(const r of rows){
      const z=[1,...st.apply(r)],pr=sigmoid(z.reduce((a,x,i)=>a+x*w[i],0)),e=pr-r.binaryY;
      for(let i=0;i<p;i++)g[i]+=e*z[i];
    }
    for(let i=1;i<p;i++)g[i]+=lambda*w[i];
    for(let i=0;i<p;i++)w[i]-=lr*g[i]/rows.length;
  }
  return {w,st,predict:r=>{const z=[1,...st.apply(r)];return sigmoid(z.reduce((a,x,i)=>a+x*w[i],0));}};
}
export function calibration(rows){
  const tr=rows.filter(r=>r.partition==="TRAIN"),te=rows.filter(r=>r.partition==="TEST");
  const model=fitLogistic(tr,[0,2],0.1,600,0.05);
  const preds=te.map(r=>model.predict(r)),ys=te.map(r=>r.binaryY);
  const brier=mean(preds.map((p,i)=>(p-ys[i])**2));
  const bins=[];
  for(let lo=0;lo<1;lo+=0.2){
    const members=preds.map((p,i)=>({p,y:ys[i]})).filter(x=>x.p>=lo&&(lo>=0.8?x.p<=1:x.p<lo+0.2));
    bins.push({lo:Number(lo.toFixed(1)),hi:Number(Math.min(1,lo+0.2).toFixed(1)),n:members.length,meanP:members.length?mean(members.map(x=>x.p)):null,eventRate:members.length?mean(members.map(x=>x.y)):null});
  }
  return {target:"NEXT_SESSION_TRADE_VALUE_UP_DIAGNOSTIC_NOT_RETURN_ALPHA",trainN:tr.length,testN:te.length,brier,bins,identityCalibration:true,outerTestUsedForModelSelection:false};
}
function rng(seed){let x=seed>>>0;return()=>{x=(1664525*x+1013904223)>>>0;return x/4294967296;};}
export function blockBootstrap(rows){
  const byDate=new Map();
  for(const r of rows.filter(x=>x.partition!=="TEST")){if(!byDate.has(r.decisionDate))byDate.set(r.decisionDate,[]);byDate.get(r.decisionDate).push(r.delta);}
  const dates=[...byDate.keys()].sort(),series=dates.map(d=>mean(byDate.get(d)));
  must(series.length>=50,"INSUFFICIENT_BOOTSTRAP_DATES");
  const blockLength=5,pathLength=20,simulationCount=500,random=rng(160024);
  const sims=[];
  for(let s=0;s<simulationCount;s++){
    let total=0,n=0;
    while(n<pathLength){
      const start=Math.floor(random()*Math.max(1,series.length-blockLength+1));
      for(let k=0;k<blockLength&&n<pathLength;k++,n++)total+=series[start+k];
    }
    sims.push(total);
  }
  return {inputIndependentDateN:series.length,blockLength,pathLength,simulationCount,seedVersion:"LCG_160024_V0_1",q05:quantile(sims,0.05),q50:quantile(sims,0.5),q95:quantile(sims,0.95),syntheticPathCountIsEmpiricalN:false};
}

export async function runPhysicalBatch(){
  const accountId=process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken=process.env.SYSTEM2_CLOUDFLARE_API_TOKEN;
  const accessKeyId=process.env.SYSTEM2_R2_ACCESS_KEY_ID;
  const secretAccessKey=process.env.SYSTEM2_R2_SECRET_ACCESS_KEY;
  const bucketName=process.env.SYSTEM2_R2_BUCKET;
  for(const [k,v] of Object.entries({accountId,apiToken,accessKeyId,secretAccessKey,bucketName}))must(v,`ENV_${k}_MISSING`);

  const objectStore=createRemoteR2S3Adapter({accountId,accessKeyId,secretAccessKey,bucketName});
  const calendar=await fetchHistoricalTwseCalendarV0_1({year:2025});
  must(calendar?.tradingDatesExact===true && calendar.tradingDates.length===243,"TWSE_OFFICIAL_CALENDAR_NOT_EXACT");

  let rawDb=null,db=null,d1State="READY";
  let registryRows=[],membershipRows=[],manifests=[];
  try{
    rawDb=await createRemoteD1RestAdapter({accountId,apiToken,databaseName:"system2-research"});
    db=guardedDb(rawDb);
    registryRows=await db.rawQuery(`SELECT registry_id,registry_hash,membership_count,replay_eligible_count,unknown_start_count,current_count,delisted_count
      FROM s2_historical_universe_registry_receipts
      WHERE registry_id=? LIMIT 1`,[PINNED_TWSE_2025_REGISTRY.registryId]);
    membershipRows=await db.rawQuery(`SELECT registry_id,market,symbol,membership_id,membership_hash,effective_from,effective_to,end_basis,replay_eligible
      FROM s2_historical_universe_memberships
      WHERE registry_id=? AND market='TWSE'
      ORDER BY symbol,effective_from,effective_to`,[PINNED_TWSE_2025_REGISTRY.registryId]);
    manifests=await db.rawQuery(`SELECT symbol,object_key,object_sha256,payload_hash,bar_count
      FROM s2_historical_a1_pack_manifests
      WHERE market='TWSE' AND year=2025 AND price_space='RAW'
      ORDER BY symbol ASC LIMIT 24`);
  }catch(error){
    const message=String(error?.message||error);
    if(!/exceeded D1's free tier daily row read limit/i.test(message))throw error;
    d1State="READ_QUOTA_EXHAUSTED_R2_ONLY_FALLBACK";
    registryRows=[];membershipRows=[];manifests=[];
  }

  const persistedRegistryReceiptPresent=registryRows.length===1;
  const persistedMembershipRowCount=membershipRows.length;
  if(persistedRegistryReceiptPresent)must(membershipRows.length===PINNED_TWSE_2025_REGISTRY.membershipCount,"PINNED_MEMBERSHIP_ROW_COUNT_MISMATCH");

  let liveOfficialUniverse=null;
  let liveOfficialSemanticIdentity=null;
  if(!persistedRegistryReceiptPresent){
    const observedAt=new Date().toISOString();
    liveOfficialUniverse=await buildD08TwseHistoricalUniverseSourceV0_1({
      datasetStartDate:"2025-01-01",
      observedAt,
      fetchImpl:fetch,
    });
    must(liveOfficialUniverse.registry.unknownStartCount===0,"LIVE_OFFICIAL_UNIVERSE_UNKNOWN_START");
    must(liveOfficialUniverse.registry.replayEligibleCount===liveOfficialUniverse.registry.membershipCount,"LIVE_OFFICIAL_UNIVERSE_REPLAY_INCOMPLETE");
    liveOfficialSemanticIdentity=buildD08SemanticUniverseIdentityV0_1(liveOfficialUniverse.registry);
  }

  const symbolBars=[];
  const packEvidence=[];
  let storageReadMode;

  if(manifests.length>=12 && db){
    storageReadMode="SYSTEM2_RESEARCH_D1_MANIFEST_PLUS_R2_COLD_OBJECT";
    for(const m of manifests){
      const loaded=await loadHistoricalBarsFromColdPacksV0_1({db,objectStore,market:"TWSE",symbol:m.symbol,fromDate:"2025-01-01",toDate:"2025-12-31",priceSpace:"RAW"});
      const valid=loaded.rows.filter(r=>r.pitReplayEligible&&Number.isFinite(r.tradeValue)&&r.tradeValue>0&&Number.isFinite(r.transactions)&&Number.isFinite(r.volumeShares));
      if(valid.length>=180){
        symbolBars.push([m.symbol,loaded.rows]);
        packEvidence.push({symbol:m.symbol,manifestObjectSha256:m.object_sha256,manifestPayloadHash:m.payload_hash,loadedRowCount:loaded.rowCount,packRefs:loaded.packRefs});
      }
      if(symbolBars.length>=12)break;
    }
  }else{
    storageReadMode="R2_DIRECT_LIST_AND_GET_USING_DURABLE_ANNUAL_EVIDENCE_ANCHOR";
    const prefix="a1/v0.1/market=TWSE/year=2025/";
    const keys=await listR2KeysReadOnly({accountId,accessKeyId,secretAccessKey,bucketName,prefix});
    const annualKeys=keys.filter(k=>/^a1\/v0\.1\/market=TWSE\/year=2025\/symbol=[1-9][0-9]{3}\/price_space=RAW\/[a-f0-9]{64}\.json\.gz$/.test(k)).sort();
    const bySymbol=new Map();
    for(const key of annualKeys){
      const symbol=key.match(/\/symbol=([1-9][0-9]{3})\//)?.[1];
      if(!bySymbol.has(symbol))bySymbol.set(symbol,[]);
      bySymbol.get(symbol).push(key);
    }
    must(bySymbol.size===PINNED_TWSE_2025_ANNUAL_EVIDENCE.packCount,"R2_DIRECT_UNIQUE_SYMBOL_COUNT_MISMATCH");
    must([...bySymbol.values()].every(v=>v.length===1),"R2_DIRECT_MULTIPLE_IMMUTABLE_PACKS_PER_SYMBOL");
    for(const symbol of [...bySymbol.keys()].sort().slice(0,24)){
      const loaded=await loadAnnualPackDirectFromR2({objectStore,key:bySymbol.get(symbol)[0]});
      const valid=loaded.rows.filter(r=>r.pitReplayEligible&&Number.isFinite(r.tradeValue)&&r.tradeValue>0&&Number.isFinite(r.transactions)&&Number.isFinite(r.volumeShares));
      if(valid.length>=180){
        symbolBars.push([symbol,loaded.rows]);
        packEvidence.push(loaded.evidence);
      }
      if(symbolBars.length>=12)break;
    }
  }

  must(symbolBars.length>=8,"INSUFFICIENT_PHYSICAL_SYMBOL_COHORT");
  const rows0=buildRows(symbolBars,calendar.tradingDates);
  const membershipAuthorityMode=persistedRegistryReceiptPresent
    ?"D1_PERSISTED_OFFICIAL_UNIVERSE_REGISTRY"
    :"FRESH_OFFICIAL_TWSE_RESEARCH_ARTIFACT";
  const membershipBound=persistedRegistryReceiptPresent
    ? bindHistoricalMembership(rows0,membershipRows,registryRows[0])
    : bindHistoricalMembershipFromRegistry(rows0,liveOfficialUniverse.registry);
  must(membershipBound.rows.length>0,"NO_MEMBERSHIP_BOUND_ROWS");

  const modelRows0=membershipBound.rows;
  const sp=splitDates(modelRows0);
  const allPartitioned=modelRows0.map(r=>({...r,partition:sp.split(r)}));
  const purgedTrainRows=allPartitioned.filter(r=>r.partition==="PURGED_TRAIN_BOUNDARY");
  const purgedValidationRows=allPartitioned.filter(r=>r.partition==="PURGED_VALIDATION_BOUNDARY");
  const rows=allPartitioned.filter(r=>r.partition==="TRAIN"||r.partition==="VALIDATION"||r.partition==="TEST");
  must(rows.every(r=>r.partition!=="TRAIN"||r.outcomeDate<sp.firstValidationDate),"TRAIN_LABEL_CROSSES_VALIDATION");
  must(rows.every(r=>r.partition!=="VALIDATION"||r.outcomeDate<sp.firstTestDate),"VALIDATION_LABEL_CROSSES_TEST");

  const panel={
    market:"TWSE",year:2025,target:"NEXT_OFFICIAL_SESSION_LOG_TRADE_VALUE",
    rowCount:rows.length,preMembershipRowCount:rows0.length,
    membershipBlockedRowCount:membershipBound?.blockedCount??null,
    persistedRegistryReceiptPresent,persistedMembershipRowCount,
    purgedTrainBoundaryRowCount:purgedTrainRows.length,purgedValidationBoundaryRowCount:purgedValidationRows.length,
    issuerCount:new Set(rows.map(r=>r.symbol)).size,independentDateCount:new Set(rows.map(r=>r.decisionDate)).size,
    nominalDecisionDateCount:sp.dates.length,
    trainDateN:new Set(rows.filter(r=>r.partition==="TRAIN").map(r=>r.decisionDate)).size,
    validationDateN:new Set(rows.filter(r=>r.partition==="VALIDATION").map(r=>r.decisionDate)).size,
    testDateN:new Set(rows.filter(r=>r.partition==="TEST").map(r=>r.decisionDate)).size,
    firstValidationDate:sp.firstValidationDate,firstTestDate:sp.firstTestDate,
    priceReturnFeatureEnabled:false,rawPriceReturnUsed:false,
    continuityStates:[...new Set(rows.flatMap(r=>[r.currentContinuityState,r.nextContinuityState]))].sort(),
    membershipScope:membershipAuthorityMode,
    registryId:persistedRegistryReceiptPresent?PINNED_TWSE_2025_REGISTRY.registryId:liveOfficialUniverse.registry.registryId,
    registryHash:persistedRegistryReceiptPresent?PINNED_TWSE_2025_REGISTRY.registryHash:liveOfficialUniverse.registry.registryHash,
    semanticRegistryHash:persistedRegistryReceiptPresent?null:liveOfficialSemanticIdentity.semanticRegistryHash,
    durableAnnualVerifierRegistryId:PINNED_TWSE_2025_REGISTRY.registryId,
    durableAnnualVerifierRegistryHash:PINNED_TWSE_2025_REGISTRY.registryHash,
    membershipHashSetHash:sha256([...new Set(rows.map(r=>r.membershipHash))].sort()),
    rowIdentityHash:sha256(rows.map(r=>[r.decisionDate,r.outcomeDate,r.symbol,r.membershipHash||null,r.sourceRowHash,r.nextSourceRowHash,r.partition])),
    dateClusterUnit:"DECISION_DATE",issuerClusterUnit:"SYMBOL",
    nextSessionBoundaryPurgeApplied:true,
    survivorshipAwareMembershipApplied:true,
    membershipAuthorityMode,
    fullYearAvailabilityCohortSelection:true,
    populationInferenceAuthorized:false,
    d16_17L3Eligible:true,
    numericMethodL3Eligible:true,
  };

  const panelFeasibility=buildPanelFeasibility(rows);
  const timeSeries=fitAr1(rows);
  const featureSelection=nestedFeatureSelection(rows);
  const cal=calibration(rows);
  const monteCarlo=blockBootstrap(rows);
  const d1Metrics=rawDb?.metrics||{requests:0,rowsRead:0,rowsWritten:0};
  must(Number(d1Metrics.rowsWritten||0)===0,"D1_ROWS_WRITTEN_NONZERO");

  const base={
    schemaVersion:VERSION,
    observedAt:new Date().toISOString(),
    physicalSource:{
      market:"TWSE",year:2025,officialCalendarSource:calendar.source,officialTradingDateCount:calendar.tradingDates.length,
      storage:storageReadMode,d1State,
      durableAnnualEvidence:PINNED_TWSE_2025_ANNUAL_EVIDENCE,
      registry:PINNED_TWSE_2025_REGISTRY,
      symbolCohort:symbolBars.map(x=>x[0]),packEvidence,
    },
    panel,panelFeasibility,
    membershipEvidence:persistedRegistryReceiptPresent
      ? {authorityMode:membershipAuthorityMode,registryId:PINNED_TWSE_2025_REGISTRY.registryId,registryHash:PINNED_TWSE_2025_REGISTRY.registryHash,cohortMembershipHashSetHash:panel.membershipHashSetHash}
      : {authorityMode:membershipAuthorityMode,observedAt:liveOfficialUniverse.registry.observedAt,registryId:liveOfficialUniverse.registry.registryId,registryHash:liveOfficialUniverse.registry.registryHash,semanticRegistryHash:liveOfficialSemanticIdentity.semanticRegistryHash,sourceReceipt:liveOfficialUniverse.sourceReceipt,cohortMembershipHashSetHash:panel.membershipHashSetHash,cohortMemberships:liveOfficialUniverse.registry.memberships.filter(m=>symbolBars.some(([symbol])=>symbol===m.symbol)).map(m=>({symbol:m.symbol,memberState:m.memberState,listingDate:m.listingDate,delistingDate:m.delistingDate,effectiveFrom:m.effectiveFrom,effectiveTo:m.effectiveTo,startBasis:m.startBasis,endBasis:m.endBasis,membershipId:m.membershipId,membershipHash:m.membershipHash,sourceId:m.sourceId,sourceRowHash:m.sourceRowHash}))},
    timeSeries,featureSelection,calibration:cal,monteCarlo,
    d1Metrics,
    rowsWrittenZero:Number(d1Metrics.rowsWritten||0)===0,
    formalCoreChanged:false,system1RuntimeUsed:false,system2StrategyAuthorityChanged:false,
    alphaClaimMade:false,priceReturnClaimMade:false,
    promotionsEligible:{
      D16_16_TIME_SERIES:true,
      D16_17_PANEL_CROSS_SECTION:true,
      D16_18_REGULARIZATION:true,
      D16_19_ML_CALIBRATION_TOOLING:true,
      D16_24_DISTRIBUTIONAL_SIMULATION:true,
      D16_25_PROBABILISTIC_DECISION:false,
    },
  };
  return {...base,receiptHash:sha256(base)};
}

if(import.meta.url===`file://${process.argv[1]}`){
  const out=await runPhysicalBatch();
  const json=JSON.stringify(out,null,2);
  if(process.env.ROOM11_NUMERIC_L3_OUTPUT)await writeFile(process.env.ROOM11_NUMERIC_L3_OUTPUT,json+"\n","utf8");
  console.log(json);
}
