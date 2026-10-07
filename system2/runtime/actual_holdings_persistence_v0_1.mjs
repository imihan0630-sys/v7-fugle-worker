import { sha256Hex } from "./decision_archive.mjs";

export const ACTUAL_HOLDINGS_PERSISTENCE_VERSION_V0_1 = "0.1-RESEARCH";

function assertDb(db){
  if(!db||typeof db.prepare!=="function") throw new Error("SYSTEM2_DB binding is required");
  return db;
}
function json(v){return JSON.stringify(v??null);}

export async function persistActualHoldingsSnapshotV0_1({db,snapshot}={}){
  assertDb(db);
  if(!snapshot||snapshot.snapshotState!=="CONFIRMED_ACTUAL_HOLDINGS"||snapshot.actualHoldingsWriteEligible!==true){
    throw new Error("only confirmed actual-holdings snapshots may be persisted");
  }
  if(snapshot.sourceType!=="USER_UPLOADED_BROKER_SCREENSHOT") throw new Error("unauthorized actual-holdings source");
  if(snapshot.brokerApiUsed!==false||snapshot.realOrdersEnabled!==false||snapshot.orderRoutingAuthorized!==false){
    throw new Error("broker/order authority boundary violated");
  }

  const existing=await db.prepare(
    "SELECT snapshot_id, snapshot_hash FROM s2_actual_holdings_snapshots WHERE idempotency_key = ? LIMIT 1",
  ).bind(snapshot.idempotencyKey).first();
  if(existing){
    if(existing.snapshot_hash!==snapshot.snapshotHash) throw new Error("idempotency key collision with different snapshot hash");
    return Object.freeze({
      state:"IDEMPOTENT_EXISTING",
      snapshotId:existing.snapshot_id,
      snapshotHash:existing.snapshot_hash,
      persisted:false,
      readbackVerified:true,
      orderImpact:false,
      brokerApiUsed:false,
    });
  }

  const statements=[];
  statements.push(db.prepare(
    `INSERT INTO s2_actual_holdings_imports (
      import_id, source_type, source_image_sha256, source_image_ref, source_image_name,
      broker_name, account_alias, screenshot_captured_at, received_at,
      extraction_version, extraction_confidence, validation_version, validation_state,
      review_state, raw_extraction_json, normalized_extraction_json, validation_json,
      idempotency_key, import_hash, schema_version
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(
    snapshot.importId,
    snapshot.sourceType,
    snapshot.sourceImageSha256,
    snapshot.sourceProvenance?.sourceImageReferenceId||null,
    snapshot.sourceProvenance?.sourceImageName||null,
    snapshot.brokerName,
    snapshot.accountAlias,
    snapshot.sourceProvenance?.screenshotCapturedAt||null,
    snapshot.receivedAt,
    snapshot.extractionVersion,
    snapshot.sourceProvenance?.extractionConfidence??null,
    snapshot.validationVersion,
    snapshot.validation?.validationState||"UNKNOWN",
    snapshot.reviewState,
    json(snapshot.rawExtraction),
    json(snapshot.normalizedExtractionRows),
    json(snapshot.validation),
    snapshot.idempotencyKey,
    snapshot.importHash,
    "S2_ACTUAL_HOLDINGS_IMPORT_V0_1",
  ));

  statements.push(db.prepare(
    `INSERT INTO s2_actual_holdings_snapshots (
      snapshot_id, import_id, previous_snapshot_id, source_type, source_image_sha256,
      broker_name, account_alias, received_at, effective_as_of, extraction_version,
      validation_version, review_state, snapshot_state, row_count, rows_hash,
      source_provenance_json, raw_extraction_json, confirmed_holdings_json,
      reconciliation_json, idempotency_key, snapshot_hash, immutable, schema_version
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(
    snapshot.snapshotId,
    snapshot.importId,
    snapshot.previousSnapshotId,
    snapshot.sourceType,
    snapshot.sourceImageSha256,
    snapshot.brokerName,
    snapshot.accountAlias,
    snapshot.receivedAt,
    snapshot.effectiveAsOf,
    snapshot.extractionVersion,
    snapshot.validationVersion,
    snapshot.reviewState,
    snapshot.snapshotState,
    snapshot.rowCount,
    snapshot.rowsHash,
    json(snapshot.sourceProvenance),
    json(snapshot.rawExtraction),
    json(snapshot.holdings),
    json(snapshot.reconciliation),
    snapshot.idempotencyKey,
    snapshot.snapshotHash,
    1,
    "S2_ACTUAL_HOLDINGS_SNAPSHOT_V0_1",
  ));

  for(const row of snapshot.holdings){
    const rowHash=await sha256Hex({snapshotId:snapshot.snapshotId,row});
    statements.push(db.prepare(
      `INSERT INTO s2_actual_holdings_rows (
        snapshot_id, symbol, company_name, quantity, average_cost, market_price,
        market_value, unrealized_pnl, unrealized_pnl_percent, currency,
        row_confidence, validation_state, row_json, row_hash, schema_version
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      snapshot.snapshotId,row.symbol,row.companyName,row.quantity,row.averageCost,
      row.marketPrice,row.marketValue,row.unrealizedPnL,row.unrealizedPnLPercent,
      row.currency,row.rowConfidence,row.validationState,json(row),rowHash,
      "S2_ACTUAL_HOLDINGS_ROW_V0_1",
    ));
  }

  for(const event of snapshot.reconciliation?.events||[]){
    statements.push(db.prepare(
      `INSERT INTO s2_actual_holdings_reconciliation_events (
        event_id, snapshot_id, previous_snapshot_id, symbol, event_types_json,
        prior_row_json, current_row_json, explanation_json, trade_inference,
        review_required, event_hash, schema_version
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      event.eventId,snapshot.snapshotId,snapshot.previousSnapshotId,event.symbol,
      json(event.eventTypes),json(event.priorRow),json(event.currentRow),json(event.explanation),
      event.tradeInference,event.reviewRequired?1:0,event.eventHash,
      "S2_ACTUAL_HOLDINGS_RECONCILIATION_EVENT_V0_1",
    ));
  }

  if(typeof db.batch==="function") await db.batch(statements);
  else for(const statement of statements) await statement.run();

  const stored=await db.prepare(
    "SELECT snapshot_id, snapshot_hash, row_count FROM s2_actual_holdings_snapshots WHERE snapshot_id = ? LIMIT 1",
  ).bind(snapshot.snapshotId).first();
  if(!stored||stored.snapshot_hash!==snapshot.snapshotHash||Number(stored.row_count)!==snapshot.rowCount){
    throw new Error("actual holdings snapshot persistence readback mismatch");
  }
  const rowsResult=await db.prepare(
    "SELECT symbol FROM s2_actual_holdings_rows WHERE snapshot_id = ? ORDER BY symbol",
  ).bind(snapshot.snapshotId).all();
  const storedRows=Array.isArray(rowsResult?.results)?rowsResult.results:[];
  if(storedRows.length!==snapshot.rowCount) throw new Error("actual holdings row-count readback mismatch");

  return Object.freeze({
    state:"PERSISTED_AND_READBACK_VERIFIED",
    snapshotId:snapshot.snapshotId,
    snapshotHash:snapshot.snapshotHash,
    rowCount:snapshot.rowCount,
    persisted:true,
    readbackVerified:true,
    historyMutationPerformed:false,
    brokerApiUsed:false,
    realOrdersEnabled:false,
    orderImpact:false,
    liveCapitalAuthority:false,
  });
}

export async function readLatestActualHoldingsSnapshotV0_1(db,{accountAlias=null}={}){
  assertDb(db);
  const row=accountAlias
    ?await db.prepare(
      `SELECT * FROM s2_actual_holdings_snapshots
        WHERE account_alias = ? AND snapshot_state = 'CONFIRMED_ACTUAL_HOLDINGS'
        ORDER BY effective_as_of DESC, received_at DESC LIMIT 1`,
    ).bind(accountAlias).first()
    :await db.prepare(
      `SELECT * FROM s2_actual_holdings_snapshots
        WHERE snapshot_state = 'CONFIRMED_ACTUAL_HOLDINGS'
        ORDER BY effective_as_of DESC, received_at DESC LIMIT 1`,
    ).first();
  if(!row) return null;
  const result=await db.prepare(
    "SELECT row_json FROM s2_actual_holdings_rows WHERE snapshot_id = ? ORDER BY symbol",
  ).bind(row.snapshot_id).all();
  const holdings=(Array.isArray(result?.results)?result.results:[]).map(x=>JSON.parse(x.row_json));
  return Object.freeze({
    snapshotId:row.snapshot_id,
    snapshotHash:row.snapshot_hash,
    previousSnapshotId:row.previous_snapshot_id,
    sourceType:row.source_type,
    sourceImageSha256:row.source_image_sha256,
    brokerName:row.broker_name,
    accountAlias:row.account_alias,
    receivedAt:row.received_at,
    effectiveAsOf:row.effective_as_of,
    extractionVersion:row.extraction_version,
    validationVersion:row.validation_version,
    reviewState:row.review_state,
    snapshotState:row.snapshot_state,
    rowCount:Number(row.row_count),
    rowsHash:row.rows_hash,
    sourceProvenance:JSON.parse(row.source_provenance_json),
    holdings:Object.freeze(holdings),
    reconciliation:JSON.parse(row.reconciliation_json),
    immutable:Number(row.immutable)===1,
  });
}
