// BUILD00 #1132: Real DEST D1 market-date coverage; READ ONLY, no production actions.
// An archive bar without PIT/continuity is NOT a qualified prospective pick.
import {createHash} from 'node:crypto';
import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {resolveDailyShadowAccountRouteV0_1,assertDailyShadowDestinationDatabaseIdentityV0_1} from '../runtime/daily_shadow_destination_account_route_v0_1.mjs';
import {createRemoteD1RestAdapter} from '../deploy/remote_d1_rest_adapter.mjs';
const DAY=/^\d{4}-\d{2}-\d{2}$/;
const integer=n=>Number.isSafeInteger(n)&&n>=0;
const sha=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const SQL_GROUP="SELECT market_date,market,COUNT(*) AS physical_rows,COUNT(DISTINCT symbol) AS distinct_symbols,SUM(CASE WHEN pit_replay_eligible=1 AND available_at IS NOT NULL AND price_space='RAW' THEN 1 ELSE 0 END) AS flags_pit_eligible FROM s2_historical_a1_bars GROUP BY market_date,market ORDER BY market_date DESC,market DESC LIMIT 160";
const SQL_TOTAL="SELECT COUNT(*) AS physical_rows,MIN(market_date) AS first_market_date,MAX(market_date) AS last_market_date,COUNT(DISTINCT market_date) AS distinct_market_dates FROM s2_historical_a1_bars";
const SQL_FROZEN="SELECT COUNT(*) AS physical_decisions FROM s2_decisions";

export function createActualA1CoverageReceiptV0_1({
 marketDate,observedAtUtc,total,groups,frozen,accountFingerprint,dbFingerprint,providerReadCount,
}={}){
 if(!DAY.test(marketDate||'')||!Number.isFinite(Date.parse(observedAtUtc)))
  throw Error('S2_A1_DATE_OR_TIMESTAMP_INVALID');
 if(!Array.isArray(groups)||groups.length>160||
    ![total?.physical_rows,total?.distinct_market_dates,frozen?.physical_decisions,providerReadCount].every(integer))
  throw Error('S2_A1_REAL_GROUP_COUNTS_UNVERIFIED');
 if(total.physical_rows>0&&(!DAY.test(total.first_market_date||'')||!DAY.test(total.last_market_date||'')||
   total.first_market_date>total.last_market_date))
  throw Error('S2_A1_REAL_MARKET_DATE_RANGE_UNVERIFIED');
 let prev='9999-99-99|ZZZ';const ids=new Set();
 for(const row of groups){
  if(!DAY.test(row?.market_date||'')||!['TWSE','TPEX'].includes(row?.market)||
    ![row.physical_rows,row.distinct_symbols,row.flags_pit_eligible].every(integer)||
    row.distinct_symbols>row.physical_rows||row.flags_pit_eligible>row.physical_rows)
   throw Error('S2_A1_SOURCE_ROW_SHAPE_INVALID');
  const key=row.market_date+'|'+row.market;
  if(ids.has(key)||key>prev)throw Error('S2_A1_DUPLICATED_OR_UNSORTED');
  ids.add(key);prev=key;
 }
 const current=groups.filter(x=>x.market_date===marketDate);
 const twse=current.find(x=>x.market==='TWSE'),tpex=current.find(x=>x.market==='TPEX');
 const snapshot={
  schemaVersion:'S2_ACTUAL_DEST_A1_COVERAGE_READONLY_V0_1',
  marketDate,observedAtUtc,accountFingerprint,dbFingerprint,
  d1TotalPhysicalBars:total.physical_rows,
  d1DistinctMarketDates:total.distinct_market_dates,
  firstPhysicalMarketDate:total.first_market_date??null,
  lastPhysicalMarketDate:total.last_market_date??null,
  groupsReturned:groups.length,groupsTruncated:groups.length===160,
  tradingDayA1Rows:{twse:twse?.physical_rows??0,tpex:tpex?.physical_rows??0},
  tradingDayPITFlaggedRows:{twse:twse?.flags_pit_eligible??0,tpex:tpex?.flags_pit_eligible??0},
  latestMarketGroups:groups.slice(0,160),
  sourceCoverage:twse?.physical_rows>0&&tpex?.physical_rows>0?
   'BOTH_MARKETS_PHYSICAL_ROWS_PRESENT_PIT_STILL_UNVERIFIED':
   'ONE_OR_BOTH_MARKETS_CURRENT_DAY_D1_DATA_MISSING',
  realProviderD1BilledRowsRead:providerReadCount,
  realProviderD1BilledRowsWritten:0,
  realFrozenDecisionCount:frozen.physical_decisions,
  actual61SessionPITWindowIndependentlyVerified:false,
  currentOfficialProviderBytesIndependentlyVerifiedByThisProbe:false,
  actualSelectedCount:null,evidenceBasedZeroPickDay:null,
  strategyActuallyExecuted:false,newFrozenDecisionWritten:false,newFrozenReadback:false,
  sourceAccountTouched:false,system1FormalTouched:false,paidResourcesChanged:false,
 };
 return Object.freeze({...snapshot,sha256:sha(snapshot)});
}
export async function checkActualDestinationA1CoverageV0_1({
 accountId,apiToken,marketDate,fetchImpl=globalThis.fetch,now=()=>new Date().toISOString()
}={}){
 resolveDailyShadowAccountRouteV0_1({writerId:'DAILY_SHADOW_DIAGNOSTIC',
   role:'DESTINATION',githubEnvironment:'system2-schema-only',
   accountId,dbToken:apiToken,analyticsToken:'READONLY_NO_ANALYTICS_CALLED'});
 const db=await createRemoteD1RestAdapter({accountId,apiToken,databaseName:'system2-research',fetchImpl});
 const identity=assertDailyShadowDestinationDatabaseIdentityV0_1(db);
 const total=await db.prepare(SQL_TOTAL).first();
 const groups=await db.prepare(SQL_GROUP).all();
 const frozen=await db.prepare(SQL_FROZEN).first();
 if(db.metrics.rowsWritten!==0)throw Error('S2_A1_READONLY_D1_WRITES_UNEXPECTED');
 return createActualA1CoverageReceiptV0_1({
  marketDate,observedAtUtc:now(),total,groups:groups?.results||[],frozen,
  accountFingerprint:'27d2ebbc8cef6d3b2102bb57735ed0e014f6c667e5f2c12a5d6f5ba65014db55',
  dbFingerprint:identity.destinationDatabaseFingerprint,
  providerReadCount:db.metrics.rowsRead
 });
}
if(process.argv[1]&&resolve(process.argv[1])===resolve(fileURLToPath(import.meta.url))){
 try{
  const report=await checkActualDestinationA1CoverageV0_1({
   accountId:process.env.S2_SCHEMA_DEST_ACCOUNT_ID,
   apiToken:process.env.S2_SCHEMA_DEST_D1_WRITE_TOKEN,
   marketDate:process.env.S2_COVERAGE_MARKET_DATE,
  });
  await mkdir('/tmp/s2-dest-a1-coverage',{recursive:true,mode:0o700});
  await writeFile('/tmp/s2-dest-a1-coverage/original-real-readback.json',
   JSON.stringify(report,null,2)+'\n',{flag:'wx',mode:0o600});
  console.log(JSON.stringify({
   sourceCoverage:report.sourceCoverage,marketDate:report.marketDate,
   physicalBars:report.d1TotalPhysicalBars,
   distinctDates:report.d1DistinctMarketDates,
   lastDate:report.lastPhysicalMarketDate,
   twseToday:report.tradingDayA1Rows.twse,tpexToday:report.tradingDayA1Rows.tpex,
   frozenPhysicalRows:report.realFrozenDecisionCount,selectionPerformed:false,
   selectedCount:null,receiptSha256:report.sha256
  }));
 }catch{console.error('S2_DEST_A1_COVERAGE_REAL_SOURCE_OR_DB_UNVERIFIED');process.exitCode=2;}
}
