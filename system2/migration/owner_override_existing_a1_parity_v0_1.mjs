// DATA_LANE Issue #1068: verify every previously imported raw A1 record against
// ORIGINAL encrypted-SQL-derived SOURCE, BEFORE retrying owner-authorized D1 inserts.
// This pure verifier is READ ONLY. No mutation, PIT promotion, network or secrets here.
import {createHash} from "node:crypto";

function stop(code){throw Error("S2_RAW_EXISTING_PARITY_"+code)}
const digest=x=>createHash("sha256").update(x).digest("hex");
const isText=x=>typeof x==="string"&&x.length>0;
const byteCmp=(a,b)=>Buffer.compare(Buffer.from(a,"utf8"),Buffer.from(b,"utf8"));
function columnsMap(columns){
  const names=["bar_id","bar_hash","source_row_hash","batch_id"];
  if(!Array.isArray(columns)||new Set(columns).size!==columns.length)stop("BAD_SOURCE_COLUMNS");
  const positions=names.map(x=>columns.indexOf(x));
  if(positions.some(x=>x<0))stop("MISSING_SOURCE_IDENTITY_COLUMN");
  return positions;
}
function readRow(r,pos){
  if(!Array.isArray(r)||r.length<=Math.max(...pos))stop("SOURCE_ROW_SHAPE");
  const values=pos.map(i=>r[i]);
  if(values.some(x=>!isText(x)))stop("SOURCE_IDENTITY_FIELD_NULL");
  return values;
}
export async function auditOriginalA1ImportedParity({
  sourceRows,sourceColumns,query,expectedTargetRows,expectedSourceRows=84688,pageSize=400
}={}){
  if(!Number.isSafeInteger(expectedSourceRows)||expectedSourceRows<1||
     !Number.isSafeInteger(expectedTargetRows)||expectedTargetRows<0||
     expectedTargetRows>expectedSourceRows||
     !Number.isSafeInteger(pageSize)||pageSize<1||pageSize>500||
     typeof query!=="function"||!sourceRows?.[Symbol.asyncIterator])
     stop("ARGS");
  const pos=columnsMap(sourceColumns);
  const src=new Map();
  let sourceCount=0;
  for await(const raw of sourceRows){
    const [barId,barHash,rowHash,batchId]=readRow(raw,pos);
    if(src.has(barId))stop("SOURCE_DUPLICATE_BAR_ID");
    src.set(barId,[barHash,rowHash,batchId]);
    sourceCount++;
    if(sourceCount>expectedSourceRows)stop("SOURCE_EXCESS_ROWS");
  }
  if(sourceCount!==expectedSourceRows)stop("SOURCE_ROW_COUNT_DRIFT");
  const whole=createHash("sha256");
  let cursor="",targetCount=0,pages=0,chargedReadRows=0;
  const maxPages=Math.ceil(expectedTargetRows/pageSize)+2;
  const sql="SELECT bar_id,bar_hash,source_row_hash,batch_id FROM s2_historical_a1_bars WHERE bar_id > ? ORDER BY bar_id LIMIT "+pageSize;
  while(true){
    if(pages++>maxPages)stop("TARGET_PAGINATION_UNBOUNDED");
    const receipt=await query(sql,[cursor]);
    if(!Array.isArray(receipt?.results)||receipt.results.length>pageSize||
       !Number.isSafeInteger(receipt.meta?.rows_written)||receipt.meta.rows_written!==0)
       stop("PROVIDER_READ_ONLY_RECEIPT_INVALID");
    if(Number.isSafeInteger(receipt.meta?.rows_read)&&receipt.meta.rows_read>=0)
      chargedReadRows+=receipt.meta.rows_read;
    if(receipt.results.length===0)break;
    for(const v of receipt.results){
      if(!isText(v?.bar_id)||!isText(v?.bar_hash)||!isText(v?.source_row_hash)||
         !isText(v?.batch_id))stop("TARGET_MISSING_IDENTITY_FIELDS");
      if(cursor!==""&&byteCmp(v.bar_id,cursor)<=0)stop("TARGET_ID_NOT_STRICTLY_ORDERED");
      const original=src.get(v.bar_id);
      if(!original)stop("TARGET_BAR_NOT_IN_ORIGINAL_ARCHIVE");
      if(original[0]!==v.bar_hash||original[1]!==v.source_row_hash||original[2]!==v.batch_id)
        stop("TARGET_SOURCE_BAR_HASH_OR_BATCH_DRIFT");
      cursor=v.bar_id;
      targetCount++;
      if(targetCount>expectedTargetRows)stop("TARGET_EXCESS_ROWS");
      const safe=[v.bar_id,v.bar_hash,v.source_row_hash,v.batch_id];
      for(const t of safe){const h=Buffer.from(t,"utf8");whole.update(Buffer.from(String(h.length)+":"));whole.update(h);}
    }
    if(receipt.results.length<pageSize)break;
  }
  if(targetCount!==expectedTargetRows)stop("TARGET_COUNT_DISAGREES_WITH_EARLY_READBACK");
  return {
    status:"EXISTING_DESTINATION_A1_EVERY_BAR_ID_AND_SOURCE_HASH_EXACTLY_MATCHES_ORIGINAL",
    sourceOriginalRows:sourceCount,alreadyImportedRowsVerified:targetCount,
    resultSHA256:whole.digest("hex"),boundedReadPages:pages,
    providerRowsReadReported:chargedReadRows,unqualifiedHistoricalPIT:true,
    permitHistoricalAsOfReplay:false,cloudflareWriteOperations:0
  };
}
export async function auditOriginalBatchMetadataParity({
  sourceRows,sourceColumns,query,expectedTargetRows,expectedSourceRows=129
}={}){
  if(!Array.isArray(sourceColumns)||typeof query!=="function"||
     !sourceRows?.[Symbol.asyncIterator]||!Number.isSafeInteger(expectedTargetRows)||
     expectedTargetRows<0||expectedTargetRows>expectedSourceRows)stop("BATCH_ARGS");
  const names=["batch_id","batch_hash","row_count"];
  const pos=names.map(n=>sourceColumns.indexOf(n));
  if(pos.some(i=>i<0))stop("BATCH_SOURCE_COLUMNS");
  const src=new Map();
  for await(const row of sourceRows){
    const [id,hash,count]=pos.map(i=>row[i]);
    if(!isText(id)||!isText(hash)||!Number.isSafeInteger(count)||count<0||src.has(id))
      stop("SOURCE_BATCH_METADATA_DRIFT");
    src.set(id,[hash,count]);
  }
  if(src.size!==expectedSourceRows)stop("SOURCE_BATCH_COUNT_DRIFT");
  const response=await query("SELECT batch_id,batch_hash,row_count FROM s2_historical_ingest_batches");
  if(!Array.isArray(response?.results)||!Number.isSafeInteger(response.meta?.rows_written)||
     response.meta.rows_written!==0||response.results.length!==expectedTargetRows)
     stop("TARGET_BATCH_READBACK");
  for(const row of response.results){
    const expected=src.get(row.batch_id);
    if(!expected||row.batch_hash!==expected[0]||row.row_count!==expected[1])
       stop("TARGET_BATCH_SOURCE_HASH_OR_COUNT_DRIFT");
  }
  return {status:"EXISTING_DESTINATION_BATCH_IDS_HASHES_COUNTS_EXACT",
    sourceOriginalBatchCount:src.size,alreadyImportedBatchRowsVerified:response.results.length,
    cloudflareWriteOperations:0,qualifiedPIT:false};
}
