import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {auditOriginalA1ImportedParity,auditOriginalBatchMetadataParity} from "../migration/owner_override_existing_a1_parity_v0_1.mjs";
const columns=["bar_id","bar_hash","source_row_hash","batch_id","price"];
const source=[
 ["a","hashA","rowA","batchA",10],
 ["b","hashB","rowB","batchA",11],
 ["c","hashC","rowC","batchB",12],
 ["d","hashD","rowD","batchB",13]
];
const target=source.slice(0,3).map(r=>({bar_id:r[0],bar_hash:r[1],source_row_hash:r[2],batch_id:r[3]}));
async function* linesFrom(rows){for(const x of rows)yield x}
function provider(rows=target,{billed=0,overwrite=null}={}){
  let reads=0;
  return Object.assign(async(sql,params)=>{
    assert.match(sql,/^SELECT bar_id,bar_hash,source_row_hash,batch_id FROM s2_historical_a1_bars WHERE bar_id > \? ORDER BY bar_id LIMIT \d+$/);
    reads++;
    const last=params[0],max=Number(sql.match(/LIMIT (\d+)$/)[1]);
    let result=rows.filter(x=>x.bar_id>last).slice(0,max).map(x=>({...x}));
    if(overwrite&&result.length)result[0]={...result[0],...overwrite};
    return {results:result,meta:{rows_written:billed,rows_read:result.length}};
  },{get reads(){return reads}});
}
const positive=await auditOriginalA1ImportedParity({
 sourceRows:linesFrom(source),sourceColumns:columns,query:provider(),
 expectedTargetRows:3,expectedSourceRows:4,pageSize:2
});
assert.equal(positive.alreadyImportedRowsVerified,3);
assert.equal(positive.sourceOriginalRows,4);
assert.equal(positive.cloudflareWriteOperations,0);
assert.match(positive.resultSHA256,/^[a-f0-9]{64}$/);
assert.equal(positive.permitHistoricalAsOfReplay,false);
const after=await auditOriginalA1ImportedParity({sourceRows:linesFrom(source),sourceColumns:columns,
 query:provider([...target,{bar_id:"d",bar_hash:"hashD",source_row_hash:"rowD",batch_id:"batchB"}]),
 expectedTargetRows:4,expectedSourceRows:4,pageSize:2});
assert.equal(after.alreadyImportedRowsVerified,4);
const empty=await auditOriginalA1ImportedParity({sourceRows:linesFrom(source),sourceColumns:columns,
 query:provider([]),expectedTargetRows:0,expectedSourceRows:4,pageSize:2});
assert.equal(empty.alreadyImportedRowsVerified,0);
async function rejectTarget(rows,regex,options={}){
 await assert.rejects(()=>auditOriginalA1ImportedParity({sourceRows:linesFrom(source),sourceColumns:columns,
  query:provider(rows,options),expectedTargetRows:3,expectedSourceRows:4,pageSize:2}),regex);
}
await rejectTarget([{...target[0],bar_hash:"wrong"},...target.slice(1)],/TARGET_SOURCE_BAR_HASH_OR_BATCH_DRIFT/);
await rejectTarget([{...target[0],source_row_hash:"wrong"},...target.slice(1)],/TARGET_SOURCE_BAR_HASH_OR_BATCH_DRIFT/);
await rejectTarget([{...target[0],batch_id:"other"},...target.slice(1)],/TARGET_SOURCE_BAR_HASH_OR_BATCH_DRIFT/);
await rejectTarget([{...target[0],bar_id:"AA"},...target.slice(1)],/TARGET_BAR_NOT_IN_ORIGINAL_ARCHIVE/);
await rejectTarget(target.slice(0,2),/TARGET_COUNT_DISAGREES_WITH_EARLY_READBACK/);
await rejectTarget(target,/PROVIDER_READ_ONLY_RECEIPT_INVALID/,{billed:1});
await assert.rejects(()=>auditOriginalA1ImportedParity({sourceRows:linesFrom([...source,source[0]]),
 sourceColumns:columns,query:provider(),expectedTargetRows:3,expectedSourceRows:5}),/SOURCE_DUPLICATE_BAR_ID/);
await assert.rejects(()=>auditOriginalA1ImportedParity({sourceRows:linesFrom(source),
 sourceColumns:["bar_id","batch_id"],query:provider(),expectedTargetRows:3,expectedSourceRows:4}),/MISSING_SOURCE_IDENTITY_COLUMN/);
const batches=[["batchA","baHash",2],["batchB","bbHash",2]];
const batchCols=["batch_id","batch_hash","row_count"];
function batchesProvider(rows=[{batch_id:"batchA",batch_hash:"baHash",row_count:2},{batch_id:"batchB",batch_hash:"bbHash",row_count:2}],meta=0){
 return async sql=>{
  assert.equal(sql,"SELECT batch_id,batch_hash,row_count FROM s2_historical_ingest_batches");
  return {results:rows,meta:{rows_written:meta}};
 }
}
const goodBatch=await auditOriginalBatchMetadataParity({
 sourceRows:linesFrom(batches),sourceColumns:batchCols,query:batchesProvider(),
 expectedTargetRows:2,expectedSourceRows:2});
assert.equal(goodBatch.alreadyImportedBatchRowsVerified,2);
await assert.rejects(()=>auditOriginalBatchMetadataParity({sourceRows:linesFrom(batches),
 sourceColumns:batchCols,query:batchesProvider([{batch_id:"batchA",batch_hash:"changed",row_count:2},
 {batch_id:"batchB",batch_hash:"bbHash",row_count:2}]),expectedTargetRows:2,expectedSourceRows:2}),
 /TARGET_BATCH_SOURCE_HASH_OR_COUNT_DRIFT/);
await assert.rejects(()=>auditOriginalBatchMetadataParity({sourceRows:linesFrom(batches),
 sourceColumns:batchCols,query:batchesProvider(undefined,1),expectedTargetRows:2,expectedSourceRows:2}),
 /TARGET_BATCH_READBACK/);
const live=readFileSync("system2/migration/owner_override_raw_d1_import_20261012.mjs","utf8");
assert(live.indexOf('report.phase="PRECOPY_REAL_DEST_ORIGINAL_SOURCE_EXACT_PARITY"') <
 live.indexOf('await insertRows("s2_historical_ingest_batches"'),'MUST verify before first insert');
assert(live.includes("POSTCOPY_REAL_DEST_ORIGINAL_SOURCE_EXACT_PARITY"));
assert(live.includes("report.afterA1SourceHashParity="));
assert(live.includes("report.afterIngestManifestParity="));
assert(live.includes("A1_RAW_HISTORY_PARTIAL__RESUME_NEXT_UTC_DAY"));
console.log("S2_RAW_SOURCE_TO_DEST_EXACT_BAR_HASH_AND_BATCH_PARITY_11_CASES_PASS");
