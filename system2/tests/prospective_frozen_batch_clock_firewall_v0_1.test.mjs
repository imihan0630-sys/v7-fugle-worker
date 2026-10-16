import test from 'node:test';
import assert from 'node:assert/strict';
import {sha256Hex} from '../runtime/decision_archive.mjs';
import {buildSystem2PersistenceBatch, rebuildAndVerifySystem2PersistenceBatch}
 from '../runtime/persistence_batch.mjs';
import {executeSystem2PersistenceBatch} from '../runtime/persistence_executor.mjs';

const T='2026-10-16',D='2026-10-16T07:30:00Z',OTHER='2026-10-15',
 OTHER_CLOCK='2026-10-16T08:00:00Z';
const DECISION_ROWS=[
 ['s2_source_session_receipts','receipt_id'],
 ['s2_market_regime_snapshots','regime_snapshot_id'],
 ['s2_industry_snapshots','industry_snapshot_id'],
 ['s2_symbol_factor_snapshots','snapshot_id'],
 ['s2_decisions','decision_id'],
 ['s2_shadow_runs','run_id'],
 ['s2_strategy_ordering_receipts','ordering_receipt_id'],
 ['s2_capacity_runs','capacity_run_id'],
 ['s2_shadow_run_fingerprints','fingerprint_id'],
];
const params=(table,row)=>({
 batchId:'PIT-PREFLIGHT-'+table,marketDate:T,decisionTimestamp:D,
 createdAt:'2026-10-16T07:33:00Z',records:[{table,row}]
});
test('all nine prospective source→regime→factor→Frozen→shadow fingerprint families accept SAME run clock only',async()=>{
 for(const [table,id] of DECISION_ROWS){
  const row={[id]:'ID-'+id,market_date:T,decision_timestamp:D};
  const ok=await buildSystem2PersistenceBatch(params(table,row));
  assert.equal(ok.operations.length,1,table);
  assert.equal(ok.operations[0].sql.insertSql.startsWith('INSERT INTO '+table),true);
  assert.equal((await rebuildAndVerifySystem2PersistenceBatch(ok)).batchHash,ok.batchHash);
  await assert.rejects(()=>buildSystem2PersistenceBatch(
    params(table,{...row,market_date:OTHER})
  ),/PROSPECTIVE_RUN_CLOCK_CONFLICT/,table+' old trading day');
  await assert.rejects(()=>buildSystem2PersistenceBatch(
    params(table,{...row,decision_timestamp:OTHER_CLOCK})
  ),/PROSPECTIVE_RUN_CLOCK_CONFLICT/,table+' false intra-day clock');
  await assert.rejects(()=>buildSystem2PersistenceBatch(
    params(table,{[id]:row[id],market_date:T})
  ),/PROSPECTIVE_RUN_CLOCK_CONFLICT/,table+' absent point in time');
 }
});
test('malicious re-signed original batch wrapper with wrong session fails before DB.prepare or D1 write',async()=>{
 const base=await buildSystem2PersistenceBatch(params('s2_decisions',{
  decision_id:'FROZEN-FALSE-T',market_date:T,decision_timestamp:D,
  symbol:'2330',candidate_state:'INCOMPLETE'
 }));
 const tampered=JSON.parse(JSON.stringify(base));
 tampered.marketDate=OTHER;
 const {batchHash:old,...rest}=tampered;
 tampered.batchHash=await sha256Hex(rest);
 const tally={prepare:0,batch:0},db={
  prepare(){tally.prepare++;throw Error('DB_PREPARE_WOULD_HAVE_BEEN_CALLED')},
  batch(){tally.batch++;throw Error('DB_BATCH_WOULD_HAVE_BEEN_CALLED')}
 };
 await assert.rejects(()=>executeSystem2PersistenceBatch({db,batch:tampered}),
  /PROSPECTIVE_RUN_CLOCK_CONFLICT/);
 assert.equal(tally.prepare,0);
 assert.equal(tally.batch,0);
});
test('history importer still may span old market dates, never mistaken as current Frozen',async()=>{
 const row={bar_id:'HISTORY-DIFFERENT-T',market_date:'2017-01-03',batch_id:'INGEST-1'};
 const batch=await buildSystem2PersistenceBatch({
  ...params('s2_historical_a1_bars',row),batchId:'HISTORICAL-MULTIDAY',
 });
 assert.equal(batch.operations.length,1);
 assert.equal(batch.operations[0].row.market_date,'2017-01-03');
});
test('immutable correction is a separate later event, not falsely rewritten into original decision time',async()=>{
 const row={correction_id:'C1',original_decision_id:'D1',
  correction_timestamp:'2026-10-17T02:00:00Z',
  reason:'PIT_RETRACTION_AFTER_ORIGINAL_FREEZE'};
 const batch=await buildSystem2PersistenceBatch({
  ...params('s2_decision_corrections',row),batchId:'APPEND-ONLY-CORRECTION'
 });
 assert.equal(batch.operations[0].table,'s2_decision_corrections');
 assert.equal(batch.operations[0].row.correction_timestamp,row.correction_timestamp);
});
test('same market day but different precise UTC as-of is blocked; T+1 as-of for prior T remains supported',async()=>{
 const tPlus1='2026-10-16T16:15:00Z',Tdate='2026-10-16';
 const good=await buildSystem2PersistenceBatch({
  ...params('s2_source_session_receipts',{
   receipt_id:'RECOVERY-SOURCE',market_date:Tdate,decision_timestamp:tPlus1}),
  decisionTimestamp:tPlus1
 });
 assert.equal(good.marketDate,Tdate);
 await assert.rejects(()=>buildSystem2PersistenceBatch({
  ...params('s2_source_session_receipts',{
    receipt_id:'RECOVERY-SOURCE',market_date:Tdate,decision_timestamp:tPlus1}),
  decisionTimestamp:'2026-10-16T16:14:00Z'
 }),/PROSPECTIVE_RUN_CLOCK_CONFLICT/);
});
test('no cross-system namespace or mutation is introduced',async()=>{
 await assert.rejects(()=>buildSystem2PersistenceBatch(params('v7_formal_orders',{
  order_id:'UNAUTHORIZED',market_date:T,decision_timestamp:D
 })),/namespace/);
});
