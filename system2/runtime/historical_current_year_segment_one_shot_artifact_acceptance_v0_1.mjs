// Class A / DATA_LANE: validate a bounded, immutable workflow artifact only.
// This is not independent Cloudflare R2/D1 readback or a PIT replay certification.
const RUN_ID=37871005381;
const HEAD_SHA="687432470b8ec81126356edb03d993d8d69df82a";
const DIGEST=/^[a-f0-9]{64}$/;
const RECEIPT=/^S2HSR-[a-f0-9]{64}$/;
const EXACT_MONTHS=Array.from({length:9},(_,i)=>i+1);

const isObject=v=>v!==null && typeof v==="object" && !Array.isArray(v);
const isPositiveInt=v=>Number.isSafeInteger(v)&&v>0;
const dateIn2026=(m,last)=>"2026-"+String(m).padStart(2,"0")+"-"+(last?new Date(Date.UTC(2026,m,0)).toISOString().slice(8,10):"01");
const knownHash=v=>typeof v==="string"&&DIGEST.test(v);

export function auditTwse2026Oct09OneShotArtifactV0_1({run,payload,baseline}={}){
  const errors=[];
  const fail=(code)=>{if(!errors.includes(code))errors.push(code);};
  if(!isObject(run)||run.id!==RUN_ID||run.head_sha!==HEAD_SHA||run.head_branch!=="main"||
    run.event!=="push"||run.run_attempt!==1||run.status!=="completed"||run.conclusion!=="success"){
    fail("ORIGINAL_RUN_NOT_SUCCESSFUL_FIRST_ATTEMPT");
  }
  if(!isObject(baseline)||baseline.market!=="TWSE"||baseline.year!==2026||
    baseline.disposition!=="PASS_D1_RECEIPT_AND_R2_HEAD_BYTE_SHA256_WITH_PIT_REPLAY_PARTIAL"||
    !Array.isArray(baseline.months)||baseline.months.length!==6){
    fail("FROZEN_JAN_JUN_BASELINE_INVALID");
  }
  if(!isObject(payload)||payload.result!=="PASS_CURRENT_YEAR_COMPLETED_MONTH_SEGMENTS"||
    payload.schemaVersion!=="S2_HISTORICAL_CURRENT_YEAR_SEGMENT_BACKFILL_V0_1"||
    payload.market!=="TWSE"||payload.year!==2026||
    payload.currentTaipeiMonth!==10||payload.throughMonth!==9||
    payload.completedMonthCount!==9||payload.system1RuntimeChanged!==false||
    !isObject(payload.policy)||payload.policy.onlyCompletedCalendarMonths!==true||
    payload.policy.currentIncompleteMonthWritten!==false||
    payload.policy.annualPackMutated!==false){
    fail("ONE_SHOT_OUTPUT_CONTRACT_INVALID");
  }
  if(!Array.isArray(payload?.months)||payload.months.length!==9){
    fail("EXPECTED_NINE_MONTHS_NOT_PRESENT");
  }
  if(!Number.isSafeInteger(payload?.insertedMonthCount)||!Number.isSafeInteger(payload?.existingMonthCount)||
    payload.insertedMonthCount+payload.existingMonthCount!==9){
    fail("MONTH_ACCOUNTING_INVALID");
  }
  const frozen=new Map();
  if(Array.isArray(baseline?.months)){
    for(const row of baseline.months){
      if(!isObject(row)||!Number.isInteger(row.month)||row.month<1||row.month>6||frozen.has(row.month))
        fail("JAN_JUN_BASELINE_DUPLICATE_OR_INVALID");
      else frozen.set(row.month,row);
    }
  }
  if(frozen.size!==6)fail("JAN_JUN_BASELINE_INCOMPLETE");
  const rows=Array.isArray(payload?.months)?payload.months:[];
  let inserted=0,existing=0;
  for(const [i,month] of EXACT_MONTHS.entries()){
    const row=rows[i];
    if(!isObject(row)||row.month!==month){
      fail("MONTH_SEQUENCE_MISSING_DUPLICATED_OR_REORDERED");
      continue;
    }
    const expectedBatchId="S2-HIST-SEGMENT-MONTH|TWSE|2026|"+String(month).padStart(2,"0");
    if(row.batchId!==expectedBatchId||row.fromDate!==dateIn2026(month,false)||row.toDate!==dateIn2026(month,true)||
      !RECEIPT.test(row.receiptId)||!knownHash(row.manifestRollingHash)){
      fail("MONTH_IDENTITY_OR_RECEIPT_INVALID");
    }
    if(!isPositiveInt(row.packCount)||!isPositiveInt(row.barCount))
      fail("MONTH_NONPOSITIVE_COUNTS");
    if(month<=6){
      const old=frozen.get(month);
      if(!old||row.state!=="ALREADY_RECEIPTED"||!((row.checkpointRepairPerformed===false&&row.repairVerification===null)||(row.checkpointRepairPerformed===true&&row.repairVerification==="VERIFIED"))||
        row.receiptId!==old.receiptId||row.manifestRollingHash!==old.manifestRollingHash||
        row.packCount!==old.packCount||row.barCount!==old.barCount)
        fail("JAN_JUN_FROZEN_MONTH_RECEIPT_DRIFT");
      existing++;
    }else{
      if(row.state!=="COMPLETE"||!isPositiveInt(row.tradingDateCount)||row.tradingDateCount<5||
        !isPositiveInt(row.officialRowCount)||row.officialRowCount!==row.barCount||
        !isPositiveInt(row.headObjectCountVerified)||row.headObjectCountVerified!==row.packCount||
        !isPositiveInt(row.byteGetObjectCountVerified)||row.byteGetObjectCountVerified!==row.packCount||
        !Number.isSafeInteger(row.insertedObjectCount)||row.insertedObjectCount<0||
        !Number.isSafeInteger(row.identicalObjectCount)||row.identicalObjectCount<0||
        row.insertedObjectCount+row.identicalObjectCount!==row.packCount||
        !Number.isSafeInteger(row.insertedManifestCount)||row.insertedManifestCount<0||
        !Number.isSafeInteger(row.identicalManifestCount)||row.identicalManifestCount<0||
        row.insertedManifestCount+row.identicalManifestCount!==row.packCount){
        fail("JUL_SEP_INTERNAL_PHYSICAL_COUNTS_UNVERIFIED");
      }
      inserted++;
    }
  }
  if(payload?.insertedMonthCount!==inserted||payload?.existingMonthCount!==existing)
    fail("INSERTED_EXISTING_MONTH_COUNT_MISMATCH");
  return {
    schemaVersion:"S2_TWSE2026_OCT09_ONE_SHOT_ARTIFACT_READONLY_AUDIT_V0_1",
    result:errors.length===0?"PASS_ARTIFACT_INTERNAL_RECEIPTS_ONLY":"BLOCKED_FAIL_CLOSED",
    errors,
    checkedOriginalRunId:RUN_ID,
    checkedOriginalHeadSha:HEAD_SHA,
    monthCoverage:errors.length===0?"JAN_TO_SEP_ARTIFACT_CONTRACT_VERIFIED":"UNVERIFIED",
    originalPITFirstKnownAtCertified:false,
    independentR2D1ReadbackCertified:false,
    noEventCertified:false,
    technicalContinuityCertified:false,
    ncT01PromotionAuthorized:false,
    strategyReplayAuthorized:false,
    productionSelectionAuthorized:false,
    cloudflareReadsPerformed:0,
    cloudflareWritesPerformed:0,
    system1FormalCoreTouched:false,
  };
}
