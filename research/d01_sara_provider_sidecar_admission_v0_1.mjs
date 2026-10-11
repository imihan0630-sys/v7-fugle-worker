// D01 Sara 60-minute research data admission. No fetch, credentials, outcomes or Formal decision.
const blocked=(reason,details={})=>({state:"SOURCE_BLOCKED",reason,...details});
// Local change detector only, NOT a cryptographic provider authenticity proof.
const rowFingerprint=rows=>{let h=2166136261;const s=JSON.stringify(rows);for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619)>>>0;return h.toString(16)};
const stamp=s=>typeof s==="string"&&/[T ][0-9]{2}:[0-9]{2}/.test(s)&&/(Z|[+-][0-9]{2}:[0-9]{2})$/.test(s)&&Number.isFinite(Date.parse(s));
export function admitSnapshot(raw,query,receipt){
 if(!raw||!Array.isArray(raw.data))return blocked("NO_PHYSICAL_ROWS");
 if(!query||query.timeframe!=="60"||query.adjusted!==undefined)return blocked("INVALID_60M_QUERY");
 if(raw.symbol!==query.symbol||raw.timeframe!=="60"||!["TWSE","TPEX"].includes(raw.exchange))
   return blocked("SYMBOL_EXCHANGE_TIMEFRAME_MISMATCH");
 if(raw.adjusted!==undefined)return blocked("INTRADAY_ADJUSTED_SEMANTICS_UNSUPPORTED");
 if(raw.data.length===0)return blocked("EMPTY_NOT_COVERAGE_PROOF");
 if(!receipt?.payloadSha256||!receipt?.requestReceiptId||!stamp(receipt?.capturedAt))
   return blocked("CAPTURE_RECEIPT_MISSING");
 if(receipt.symbol!==raw.symbol||receipt.timeframe!=="60"||receipt.exchange!==raw.exchange)
   return blocked("CAPTURE_BINDING_MISMATCH");
 if(receipt.sourceKind!=="PROVIDER_HTTP_RESPONSE")
   return blocked("NOT_A_PHYSICAL_PROVIDER_RESPONSE");
 let prev=-Infinity;
 for(const row of raw.data){
   if(!stamp(row?.date)||Date.parse(row.date)<=prev)return blocked("TIMESTAMP_MISSING_OR_UNSORTED");
   if(!["open","high","low","close"].every(k=>Number.isFinite(row[k])&&row[k]>0)||
      row.high<Math.max(row.open,row.close)||row.low>Math.min(row.open,row.close))
     return blocked("INVALID_OHLC");
   if(!Number.isFinite(row.volume)||row.volume<0)return blocked("INVALID_VOLUME");
   prev=Date.parse(row.date);
 }
 return {state:"RAW_SNAPSHOT_ACCEPTED_REPLAY_BLOCKED",rawCount:raw.data.length,rowFingerprint:rowFingerprint(raw.data),
  payloadSha256:receipt.payloadSha256,requestReceiptId:receipt.requestReceiptId,
  snapshotCapturedAt:receipt.capturedAt,barTimestampSemantics:"UNKNOWN",
  replaySafe:false,sourceRoot:"PRICE_OHLC",volumeUnit:raw.type==="EQUITY"?"LOTS":"UNVERIFIED"};
}
export function attachBucketAndVintage(snapshot,raw,certificate,decisionAt){
 if(snapshot?.state!=="RAW_SNAPSHOT_ACCEPTED_REPLAY_BLOCKED")
   return blocked("RAW_SNAPSHOT_NOT_ACCEPTED");
 if(!stamp(decisionAt))return blocked("PREDICTOR_CUTOFF_UNKNOWN");
 if(!Array.isArray(raw?.data)||raw.data.length!==snapshot.rawCount||rowFingerprint(raw.data)!==snapshot.rowFingerprint)
   return blocked("RAW_PAYLOAD_CHANGED_RECAPTURE_REQUIRED");
 if(!certificate?.sourceSha256||certificate.sourceSha256!==snapshot.payloadSha256)
   return blocked("SIDECAR_HASH_MISMATCH");
 if(certificate.bucketTimestampMeaning!=="OPEN"&&certificate.bucketTimestampMeaning!=="END")
   return blocked("BUCKET_TIMESTAMP_MEANING_UNKNOWN");
 if(certificate.sessionBucketCalendarCertified!==true||certificate.corporateActionContinuityCertified!==true)
   return blocked("SESSION_OR_PRICE_CONTINUITY_NOT_CERTIFIED");
 if(!Array.isArray(certificate.rowReceipts)||certificate.rowReceipts.length!==raw.data.length)
   return blocked("PER_BAR_VINTAGE_RECEIPT_MISSING");
 const cutoff=Date.parse(decisionAt),accepted=[];
 for(let i=0;i<raw.data.length;i++){
   const row=raw.data[i],proof=certificate.rowReceipts[i];
   if(proof.date!==row.date||!stamp(proof.completedAt)||!stamp(proof.observedAt)||
      Date.parse(proof.completedAt)>Date.parse(proof.observedAt))
     return blocked("BAR_RECEIPT_CLOCK_OR_ROW_MISMATCH");
   if(Date.parse(proof.observedAt)<Date.parse(snapshot.snapshotCapturedAt))
     return blocked("EARLIER_OBSERVATION_UNPROVEN");
   if(!proof.revisionId||!proof.sessionBucketReceiptId)return blocked("BAR_REVISION_OR_BUCKET_MISSING");
   // A captured retrospective snapshot is never backdated into intraday availability.
   if(Date.parse(proof.completedAt)<=cutoff&&Date.parse(proof.observedAt)>cutoff)
     return blocked("RETROSPECTIVE_BAR_NOT_AVAILABLE_AT_CUTOFF");
   if(Date.parse(proof.completedAt)<=cutoff&&Date.parse(proof.observedAt)<=cutoff)
     accepted.push({date:row.date,completeAt:proof.completedAt,knownAt:proof.observedAt,
       revisionId:proof.revisionId,receiptId:proof.sessionBucketReceiptId});
 }
 return {state:"PIT_PREFIX_CERTIFIED",verifiedBarCount:accepted.length,
   warmupReady:accepted.length>=245,receiptIds:accepted.map(r=>r.receiptId),
   snapshotSha256:snapshot.payloadSha256,asOf:decisionAt};
}
