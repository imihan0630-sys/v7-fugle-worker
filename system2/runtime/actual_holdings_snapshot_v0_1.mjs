import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import {
  ACTUAL_HOLDINGS_SOURCE_TYPE_V0_1,
  normalizeConfirmedHoldingRowV0_1,
} from "./actual_holdings_validation_v0_1.mjs";
import { reconcileActualHoldingsSnapshotsV0_1 } from "./actual_holdings_reconciliation_v0_1.mjs";

export const ACTUAL_HOLDINGS_SNAPSHOT_VERSION_V0_1 = "0.1-RESEARCH";

const text=(v)=>v==null?"":String(v).trim();
const uniqueSorted=(xs)=>[...new Set(xs)].sort();

function iso(value,field){
  const s=text(value);
  if(!s||!Number.isFinite(Date.parse(s))) throw new Error(field+" must be ISO timestamp");
  return new Date(s).toISOString();
}

function canonicalRows(rows){
  const normalized=rows.map(normalizeConfirmedHoldingRowV0_1)
    .sort((a,b)=>a.symbol.localeCompare(b.symbol));
  const seen=new Set();
  for(const row of normalized){
    if(seen.has(row.symbol)) throw new Error("confirmed holdings must contain at most one row per symbol");
    seen.add(row.symbol);
  }
  return normalized;
}

export async function buildActualHoldingsSnapshotV0_1({
  validation,
  confirmation,
  previousSnapshot=null,
}={}) {
  if(!validation||typeof validation!=="object") throw new Error("validation receipt is required");
  if(validation.sourceType!==ACTUAL_HOLDINGS_SOURCE_TYPE_V0_1) throw new Error("actual holdings source is not authorized");
  if(validation.validationState==="REJECTED") throw new Error("rejected extraction cannot become actual holdings");
  if(!confirmation||confirmation.reviewState!=="CONFIRMED") throw new Error("explicit confirmed reviewState is required");

  const reviewedAt=iso(confirmation.reviewedAt,"confirmation.reviewedAt");
  const effectiveAsOf=iso(
    confirmation.effectiveAsOf||validation.screenshotCapturedAt,
    "confirmation.effectiveAsOf",
  );
  const reviewedBy=text(confirmation.reviewedBy);
  if(!reviewedBy) throw new Error("confirmation.reviewedBy is required");

  const allReviewCodes=uniqueSorted([
    ...(validation.blockingIssueCodes||[]),
    ...(validation.reviewIssueCodes||[]),
  ]);
  const resolved=uniqueSorted(Array.isArray(confirmation.resolvedIssueCodes)?confirmation.resolvedIssueCodes.map(text).filter(Boolean):[]);
  const unresolved=allReviewCodes.filter(code=>!resolved.includes(code));
  if(unresolved.length){
    throw new Error("unresolved validation issues: "+unresolved.join(","));
  }

  const rows=canonicalRows(
    Array.isArray(confirmation.confirmedRows)&&confirmation.confirmedRows.length
      ? confirmation.confirmedRows
      : validation.normalizedRows,
  );
  if(!rows.length) throw new Error("confirmed holdings cannot be empty");

  const sourceImageSha256=text(validation?.sourceImage?.sha256).toLowerCase();
  if(!/^[0-9a-f]{64}$/.test(sourceImageSha256)) throw new Error("source image SHA-256 provenance is required");

  const rowsHash=await sha256Hex(rows);
  const sourceProvenance={
    sourceType:ACTUAL_HOLDINGS_SOURCE_TYPE_V0_1,
    sourceImageSha256,
    sourceImageReferenceId:validation?.sourceImage?.referenceId||null,
    sourceImageName:validation?.sourceImage?.fileName||null,
    brokerName:validation.brokerName||null,
    accountAlias:validation.accountAlias||null,
    screenshotCapturedAt:validation.screenshotCapturedAt||null,
    receivedAt:validation.receivedAt,
    extractionVersion:validation.extractionVersion,
    extractionConfidence:validation.extractionConfidence,
    validationVersion:validation.validationVersion,
    validationState:validation.validationState,
    reviewState:"CONFIRMED",
    reviewedAt,
    reviewedBy,
  };
  const sourceProvenanceHash=await sha256Hex(sourceProvenance);
  const idempotencyIdentity={
    sourceType:ACTUAL_HOLDINGS_SOURCE_TYPE_V0_1,
    sourceImageSha256,
    accountAlias:validation.accountAlias||null,
    effectiveAsOf,
    rowsHash,
  };
  const idempotencyKey="S2-AH-IDEMP:"+await sha256Hex(idempotencyIdentity);
  const importIdentity={
    sourceProvenanceHash,
    rowsHash,
    idempotencyKey,
    rawExtraction:validation.rawExtraction,
    normalizedRows:validation.normalizedRows,
  };
  const importHash=await sha256Hex(importIdentity);
  const importId="S2-AH-IMPORT:"+importHash;

  const provisional={
    schemaVersion:"S2_ACTUAL_HOLDINGS_SNAPSHOT_V0_1",
    version:ACTUAL_HOLDINGS_SNAPSHOT_VERSION_V0_1,
    snapshotId:null,
    snapshotHash:null,
    importId,
    importHash,
    idempotencyKey,
    previousSnapshotId:previousSnapshot?.snapshotId||null,
    sourceType:ACTUAL_HOLDINGS_SOURCE_TYPE_V0_1,
    sourceImageSha256,
    brokerName:validation.brokerName||null,
    accountAlias:validation.accountAlias||null,
    receivedAt:validation.receivedAt,
    effectiveAsOf,
    extractionVersion:validation.extractionVersion,
    validationVersion:validation.validationVersion,
    reviewState:"CONFIRMED",
    snapshotState:"CONFIRMED_ACTUAL_HOLDINGS",
    rowsHash,
    sourceProvenance,
    sourceProvenanceHash,
    rawExtraction:validation.rawExtraction,
    normalizedExtractionRows:validation.normalizedRows,
    holdings:rows,
    rowCount:rows.length,
    validation:{
      validationState:validation.validationState,
      issues:validation.issues,
      resolvedIssueCodes:resolved,
      unresolvedIssueCodes:[],
      unknownPreserved:validation.unknownPreserved===true,
    },
    immutable:true,
    brokerApiUsed:false,
    brokerApiAuthorized:false,
    realOrdersEnabled:false,
    liveCapitalAuthority:false,
    orderRoutingAuthorized:false,
  };

  const snapshotIdentity={
    importId,
    previousSnapshotId:provisional.previousSnapshotId,
    sourceType:provisional.sourceType,
    sourceImageSha256,
    effectiveAsOf,
    rowsHash,
    sourceProvenanceHash,
  };
  const snapshotHash=await sha256Hex(snapshotIdentity);
  const snapshotId="S2-AH-SNAPSHOT:"+snapshotHash;
  const withId={...provisional,snapshotId,snapshotHash};
  const reconciliation=await reconcileActualHoldingsSnapshotsV0_1({
    previousSnapshot,
    currentSnapshot:withId,
  });

  return deepFreeze({
    ...withId,
    reconciliation,
    actualHoldingsWriteEligible:true,
    actualPositionMonitorInputEligible:true,
    decisionOutputsOnly:true,
    directBrokerAction:false,
  });
}
