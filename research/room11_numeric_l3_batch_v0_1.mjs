import crypto from "node:crypto";
import { writeFile } from "node:fs/promises";
import { createRemoteD1RestAdapter } from "../system2/deploy/remote_d1_rest_adapter.mjs";
import { createRemoteR2S3Adapter } from "../system2/deploy/remote_r2_s3_adapter.mjs";
import { loadHistoricalBarsFromColdPacksV0_1 } from "../system2/runtime/historical_cold_pack_store_v0_1.mjs";
import { fetchHistoricalTwseCalendarV0_1 } from "../system2/runtime/historical_twse_calendar_v0_1.mjs";

const VERSION="ROOM11_NUMERIC_L3_BATCH_V0_1";
function stable(v){if(Array.isArray(v))return v.map(stable);if(v&&typeof v==="object")return Object.fromEntries(Object.keys(v).sort().map(k=>[k,stable(v[k])]));return v;}
const stableJson=v=>JSON.stringify(stable(v));
const sha256=v=>crypto.createHash("sha256").update(typeof v==="string"?v:stableJson(v)).digest("hex");
function must(c,m){if(!c)throw new Error(m);}
function mean(a){return a.reduce((x,y)=>x+y,0)/a.length;}
function mse(a,b){return mean(a.map((x,i)=>(x-b[i])**2));}
function mae(a,b){return mean(a.map((x,i)=>Math.abs(x-b[i])));}
function quantile(xs,q){const a=[...xs].sort((x,y)=>x-y);if(!a.length)return null;const p=(a.length-1)*q,l=Math.floor(p),h=Math.ceil(p);return l===h?a[l]:a[l]+(a[h]-a[l])*(p-l);}
function sigmoid(x){if(x>=0){const z=Math.exp(-x);return 1/(1+z);}const z=Math.exp(x);return z/(1+z);}
function dateDecisionTs(d){return d+"T06:00:00.000Z";}

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
  const trainSet=new Set(dates.slice(0,a)),valSet=new Set(dates.slice(a,b)),testSet=new Set(dates.slice(b));
  const split=r=>trainSet.has(r.decisionDate)?"TRAIN":valSet.has(r.decisionDate)?"VALIDATION":"TEST";
  return {dates,trainDates:[...trainSet],validationDates:[...valSet],testDates:[...testSet],split};
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
  const rawDb=await createRemoteD1RestAdapter({accountId,apiToken,databaseName:"system2-research"});
  const db=guardedDb(rawDb);
  const objectStore=createRemoteR2S3Adapter({accountId,accessKeyId,secretAccessKey,bucketName});
  const calendar=await fetchHistoricalTwseCalendarV0_1({year:2025});
  must(calendar?.tradingDatesExact===true && calendar.tradingDates.length>=200,"TWSE_OFFICIAL_CALENDAR_NOT_EXACT");
  const manifests=await db.rawQuery(`SELECT symbol,object_key,object_sha256,payload_hash,bar_count
    FROM s2_historical_a1_pack_manifests
    WHERE market='TWSE' AND year=2025 AND price_space='RAW'
    ORDER BY symbol ASC LIMIT 24`);
  must(manifests.length>=12,"INSUFFICIENT_2025_TWSE_MANIFESTS");
  const symbolBars=[];
  const packEvidence=[];
  for(const m of manifests){
    const loaded=await loadHistoricalBarsFromColdPacksV0_1({db,objectStore,market:"TWSE",symbol:m.symbol,fromDate:"2025-01-01",toDate:"2025-12-31",priceSpace:"RAW"});
    const valid=loaded.rows.filter(r=>r.pitReplayEligible&&Number.isFinite(r.tradeValue)&&r.tradeValue>0&&Number.isFinite(r.transactions)&&Number.isFinite(r.volumeShares));
    if(valid.length>=180){
      symbolBars.push([m.symbol,loaded.rows]);
      packEvidence.push({symbol:m.symbol,manifestObjectSha256:m.object_sha256,manifestPayloadHash:m.payload_hash,loadedRowCount:loaded.rowCount,packRefs:loaded.packRefs});
    }
    if(symbolBars.length>=12)break;
  }
  must(symbolBars.length>=8,"INSUFFICIENT_PHYSICAL_SYMBOL_COHORT");
  const rows0=buildRows(symbolBars,calendar.tradingDates);
  const sp=splitDates(rows0);
  const rows=rows0.map(r=>({...r,partition:sp.split(r)}));
  const panel={
    market:"TWSE",year:2025,target:"NEXT_OFFICIAL_SESSION_LOG_TRADE_VALUE",
    rowCount:rows.length,issuerCount:new Set(rows.map(r=>r.symbol)).size,independentDateCount:sp.dates.length,
    trainDateN:sp.trainDates.length,validationDateN:sp.validationDates.length,testDateN:sp.testDates.length,
    priceReturnFeatureEnabled:false,rawPriceReturnUsed:false,
    continuityStates:[...new Set(rows.flatMap(r=>[r.currentContinuityState,r.nextContinuityState]))].sort(),
    membershipScope:"BOUNDED_OBSERVED_OFFICIAL_QUOTE_COHORT_NOT_FULL_MARKET_UNIVERSE",
    rowIdentityHash:sha256(rows.map(r=>[r.decisionDate,r.symbol,r.sourceRowHash,r.nextSourceRowHash])),
    dateClusterUnit:"DECISION_DATE",issuerClusterUnit:"SYMBOL",
  };
  const timeSeries=fitAr1(rows);
  const featureSelection=nestedFeatureSelection(rows);
  const cal=calibration(rows);
  const monteCarlo=blockBootstrap(rows);
  must(rawDb.metrics.rowsWritten===0,"D1_ROWS_WRITTEN_NONZERO");
  const base={
    schemaVersion:VERSION,
    observedAt:new Date().toISOString(),
    physicalSource:{market:"TWSE",year:2025,officialCalendarSource:calendar.source,officialTradingDateCount:calendar.tradingDates.length,storage:"SYSTEM2_RESEARCH_D1_MANIFEST_PLUS_R2_COLD_OBJECT",symbolCohort:symbolBars.map(x=>x[0]),packEvidence},
    panel,timeSeries,featureSelection,calibration:cal,monteCarlo,
    d1Metrics:rawDb.metrics,
    rowsWrittenZero:rawDb.metrics.rowsWritten===0,
    formalCoreChanged:false,system1RuntimeUsed:false,system2StrategyAuthorityChanged:false,
    alphaClaimMade:false,priceReturnClaimMade:false,
  };
  return {...base,receiptHash:sha256(base)};
}

if(import.meta.url===`file://${process.argv[1]}`){
  const out=await runPhysicalBatch();
  const json=JSON.stringify(out,null,2);
  if(process.env.ROOM11_NUMERIC_L3_OUTPUT)await writeFile(process.env.ROOM11_NUMERIC_L3_OUTPUT,json+"\n","utf8");
  console.log(json);
}
