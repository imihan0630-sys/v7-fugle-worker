import { createHash } from "node:crypto";
import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import { materializeHistoricalA1PackRowsV0_1 } from "./historical_pack_store_v0_1.mjs";
import {
  assertHistoricalColdObjectStoreV0_1,
  historicalPackObjectKeyV0_1,
} from "./historical_cold_object_store_v0_1.mjs";

export const HISTORICAL_COLD_PACK_STORE_VERSION = "0.1-RESEARCH";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function nonNegativeInteger(value, field) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0) throw new Error(field + " must be a non-negative integer");
  return number;
}

function split(values, size) {
  const out = [];
  for (let index = 0; index < values.length; index += size) out.push(values.slice(index, index + size));
  return out;
}

function logicalKey(row) {
  return [row.market, row.symbol, Number(row.year), row.price_space].join("|");
}

function bytesSha256(bytes) {
  return createHash("sha256").update(Buffer.from(bytes)).digest("hex");
}

function packBytes(pack) {
  const bytes = Buffer.from(requiredText(pack.gzipBase64, "pack.gzipBase64"), "base64");
  if (bytes.byteLength !== Number(pack.gzipBytes)) throw new Error("historical cold pack gzip size mismatch");
  const objectSha256 = pack.objectSha256 || bytesSha256(bytes);
  if (bytesSha256(bytes) !== objectSha256) throw new Error("historical cold pack object hash mismatch");
  return { bytes, objectSha256 };
}

function manifestCore(pack, objectStore, objectKey, objectSha256) {
  return {
    pack_id: requiredText(pack.packId, "pack.packId"),
    market: requiredText(pack.market, "pack.market"),
    symbol: requiredText(pack.symbol, "pack.symbol"),
    year: Number(pack.year),
    price_space: requiredText(pack.priceSpace, "pack.priceSpace"),
    first_market_date: requiredText(pack.firstMarketDate, "pack.firstMarketDate"),
    last_market_date: requiredText(pack.lastMarketDate, "pack.lastMarketDate"),
    bar_count: nonNegativeInteger(pack.barCount, "pack.barCount"),
    source_id: pack.sourceId || null,
    source_name: pack.sourceName || null,
    availability_policy: "SESSION_CLOSE_FINALITY_PER_MARKET_DATE",
    payload_hash: requiredText(pack.payloadHash, "pack.payloadHash"),
    object_sha256: requiredText(objectSha256, "objectSha256"),
    payload_json_bytes: nonNegativeInteger(pack.payloadJsonBytes, "pack.payloadJsonBytes"),
    gzip_bytes: nonNegativeInteger(pack.gzipBytes, "pack.gzipBytes"),
    object_backend: requiredText(objectStore.backend, "objectStore.backend"),
    object_bucket: requiredText(objectStore.bucketName, "objectStore.bucketName"),
    object_key: requiredText(objectKey, "objectKey"),
    captured_at: requiredText(pack.capturedAt, "pack.capturedAt"),
    pack_schema_version: requiredText(pack.schemaVersion, "pack.schemaVersion"),
    schema_version: "S2_HISTORICAL_A1_COLD_MANIFEST_V0_1",
  };
}

const IMMUTABLE_MANIFEST_FIELDS = [
  "pack_id","market","symbol","year","price_space","first_market_date","last_market_date",
  "bar_count","source_id","source_name","availability_policy","payload_hash","object_sha256",
  "payload_json_bytes","gzip_bytes","object_backend","object_bucket","object_key",
  "pack_schema_version","schema_version",
];

function equalManifest(existing, expected) {
  return IMMUTABLE_MANIFEST_FIELDS.every((field) =>
    String(existing?.[field] ?? "") === String(expected?.[field] ?? ""));
}

function assertObjectMatchesPack(object, core) {
  if (!object) throw new Error("COLD_OBJECT_MISSING: " + core.object_key);
  if (Number(object.size) !== Number(core.gzip_bytes)) {
    throw new Error("IMMUTABLE_CONFLICT cold object size: " + core.object_key);
  }
  const metadata = object.customMetadata || {};
  if (metadata["payload-hash"] && metadata["payload-hash"] !== core.payload_hash) {
    throw new Error("IMMUTABLE_CONFLICT cold object payload hash: " + core.object_key);
  }
  if (metadata["object-sha256"] && metadata["object-sha256"] !== core.object_sha256) {
    throw new Error("IMMUTABLE_CONFLICT cold object sha256: " + core.object_key);
  }
}

async function ensureColdObject({ objectStore, pack, core, bytes }) {
  let object = await objectStore.head(core.object_key);
  if (object) {
    assertObjectMatchesPack(object, core);
    return { object, state: "IDENTICAL_OBJECT" };
  }
  object = await objectStore.putIfAbsent(core.object_key, bytes, {
    contentType: "application/json",
    contentEncoding: "gzip",
    sha256: core.object_sha256,
    storageClass: "Standard",
    customMetadata: {
      "payload-hash": core.payload_hash,
      "object-sha256": core.object_sha256,
      "pack-schema": core.pack_schema_version,
    },
  });
  if (!object) object = await objectStore.head(core.object_key);
  assertObjectMatchesPack(object, core);
  return { object, state: "INSERTED_OBJECT" };
}

function manifestRow(core, object) {
  return {
    ...core,
    object_etag: object.etag || null,
    object_version: object.version || null,
    storage_class: object.storageClass || null,
    object_uploaded_at: object.uploadedAt || null,
  };
}

function insertManifestStatement(db, row) {
  return db.prepare(`INSERT INTO s2_historical_a1_pack_manifests (
    pack_id,market,symbol,year,price_space,first_market_date,last_market_date,bar_count,
    source_id,source_name,availability_policy,payload_hash,object_sha256,payload_json_bytes,
    gzip_bytes,object_backend,object_bucket,object_key,object_etag,object_version,storage_class,
    object_uploaded_at,captured_at,pack_schema_version,schema_version
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(
    row.pack_id,row.market,row.symbol,row.year,row.price_space,row.first_market_date,row.last_market_date,
    row.bar_count,row.source_id,row.source_name,row.availability_policy,row.payload_hash,row.object_sha256,
    row.payload_json_bytes,row.gzip_bytes,row.object_backend,row.object_bucket,row.object_key,row.object_etag,
    row.object_version,row.storage_class,row.object_uploaded_at,row.captured_at,row.pack_schema_version,row.schema_version,
  );
}

async function loadManifestMap(db, rows) {
  const out = new Map();
  const groups = new Map();
  for (const row of rows) {
    const key = [row.market, row.year, row.price_space].join("|");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  for (const [key, members] of groups) {
    const [market, year, priceSpace] = key.split("|");
    for (const part of split(members, 80)) {
      const symbols = part.map((row) => row.symbol);
      const result = await db.prepare(
        "SELECT * FROM s2_historical_a1_pack_manifests WHERE market=? AND year=? AND price_space=? AND symbol IN (" +
        symbols.map(() => "?").join(",") + ")",
      ).bind(market, Number(year), priceSpace, ...symbols).all();
      for (const row of result?.results || []) out.set(logicalKey(row), row);
    }
  }
  return out;
}

async function writeCheckpoint(db, row) {
  await db.prepare(`INSERT INTO s2_historical_cold_backfill_checkpoints (
    checkpoint_id,batch_id,market,year,expected_pack_count,expected_bar_count,
    object_ready_count,manifest_committed_count,next_pack_index,rolling_hash,state,updated_at,schema_version
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
  ON CONFLICT(batch_id) DO UPDATE SET
    object_ready_count=excluded.object_ready_count,
    manifest_committed_count=excluded.manifest_committed_count,
    next_pack_index=excluded.next_pack_index,
    rolling_hash=excluded.rolling_hash,
    state=excluded.state,
    updated_at=excluded.updated_at,
    schema_version=excluded.schema_version`).bind(
    row.checkpoint_id,row.batch_id,row.market,row.year,row.expected_pack_count,row.expected_bar_count,
    row.object_ready_count,row.manifest_committed_count,row.next_pack_index,row.rolling_hash,row.state,
    row.updated_at,row.schema_version,
  ).run();
}

function receiptMatches(receipt, expected) {
  const fields = [
    "batch_id","market","year","pack_count","bar_count","payload_json_bytes","gzip_bytes",
    "first_market_date","last_market_date","manifest_rolling_hash","state","schema_version",
  ];
  return fields.every((field) => String(receipt?.[field] ?? "") === String(expected?.[field] ?? ""));
}

function checkpointMatches(checkpoint, expected) {
  const fields = [
    "batch_id","market","year","expected_pack_count","expected_bar_count",
    "rolling_hash","schema_version",
  ];
  return fields.every((field) => String(checkpoint?.[field] ?? "") === String(expected?.[field] ?? ""));
}

export async function readHistoricalColdReceiptV0_1({ db, batchId } = {}) {
  if (!db || typeof db.prepare !== "function") throw new Error("isolated System2 database adapter is required");
  return await db.prepare(
    "SELECT * FROM s2_historical_cold_ingest_receipts WHERE batch_id=? LIMIT 1",
  ).bind(requiredText(batchId, "batchId")).first();
}

export async function verifyHistoricalColdReceiptV0_1({ db, objectStore, receipt } = {}) {
  if (!db || typeof db.prepare !== "function") throw new Error("isolated System2 database adapter is required");
  const store = assertHistoricalColdObjectStoreV0_1(objectStore);
  if (!receipt || receipt.state !== "COMPLETE") throw new Error("complete historical cold receipt is required");
  const result = await db.prepare(`SELECT * FROM s2_historical_a1_pack_manifests
    WHERE market=? AND year=? AND price_space='RAW' ORDER BY symbol ASC`
  ).bind(receipt.market,Number(receipt.year)).all();
  const manifests = result?.results || [];
  const barCount = manifests.reduce((sum,row) => sum + Number(row.bar_count), 0);
  const payloadJsonBytes = manifests.reduce((sum,row) => sum + Number(row.payload_json_bytes), 0);
  const gzipBytes = manifests.reduce((sum,row) => sum + Number(row.gzip_bytes), 0);
  if (manifests.length !== Number(receipt.pack_count)
    || barCount !== Number(receipt.bar_count)
    || payloadJsonBytes !== Number(receipt.payload_json_bytes)
    || gzipBytes !== Number(receipt.gzip_bytes)) {
    throw new Error("IMMUTABLE_CONFLICT completed historical cold receipt aggregate: " + receipt.batch_id);
  }
  const rollingHash = await sha256Hex({
    batchId:receipt.batch_id,
    manifests:manifests.map((row) => ({
      packId:row.pack_id,payloadHash:row.payload_hash,
      objectSha256:row.object_sha256,objectKey:row.object_key,
    })),
  });
  if (rollingHash !== receipt.manifest_rolling_hash) {
    throw new Error("IMMUTABLE_CONFLICT completed historical cold receipt rolling hash: " + receipt.batch_id);
  }
  for (const part of split(manifests, 25)) {
    await Promise.all(part.map(async (manifest) => {
      assertObjectMatchesPack(await store.head(manifest.object_key), manifest);
    }));
  }
  return deepFreeze({
    batchId:receipt.batch_id,market:receipt.market,year:Number(receipt.year),
    packCount:manifests.length,barCount,payloadJsonBytes,gzipBytes,
    objectCountVerified:manifests.length,state:"VERIFIED",
    schemaVersion:"S2_HISTORICAL_COLD_RECEIPT_VERIFICATION_V0_1",
  });
}

export async function executeHistoricalColdPackSetV0_1({
  db,
  objectStore,
  packSet,
  batchId,
  capturedAt,
  chunkSize = 25,
} = {}) {
  if (!db || typeof db.prepare !== "function" || typeof db.batch !== "function") {
    throw new Error("isolated System2 database adapter with batch() is required");
  }
  const store = assertHistoricalColdObjectStoreV0_1(objectStore);
  if (!packSet || packSet.schemaVersion !== "S2_HISTORICAL_A1_PACK_SET_RESEARCH_V0_1") {
    throw new Error("valid historical pack set is required");
  }
  if (!Number.isInteger(chunkSize) || chunkSize < 1 || chunkSize > 100) {
    throw new Error("chunkSize must be 1..100");
  }
  const id = requiredText(batchId, "batchId");
  const completedAt = requiredText(capturedAt, "capturedAt");
  if (!packSet.packs.length) throw new Error("historical cold pack set cannot be empty");
  const markets = [...new Set(packSet.packs.map((pack) => pack.market))];
  const years = [...new Set(packSet.packs.map((pack) => Number(pack.year)))];
  const priceSpaces = [...new Set(packSet.packs.map((pack) => pack.priceSpace))];
  if (markets.length !== 1 || years.length !== 1 || priceSpaces.length !== 1 || priceSpaces[0] !== "RAW") {
    throw new Error("historical cold batch must contain exactly one market/year in RAW price space");
  }
  const market = markets[0];
  const year = years[0];
  const prepared = packSet.packs.map((pack) => {
    const objectKey = historicalPackObjectKeyV0_1(pack);
    const decoded = packBytes(pack);
    return { pack, objectKey, bytes: decoded.bytes, core: manifestCore(pack, store, objectKey, decoded.objectSha256) };
  });
  const rollingHash = await sha256Hex({
    batchId: id,
    manifests: prepared.map(({ core }) => ({
      packId: core.pack_id,
      payloadHash: core.payload_hash,
      objectSha256: core.object_sha256,
      objectKey: core.object_key,
    })),
  });
  const firstMarketDate = prepared.map(({ core }) => core.first_market_date).sort()[0];
  const lastMarketDate = prepared.map(({ core }) => core.last_market_date).sort().at(-1);
  const expectedReceipt = {
    batch_id:id,market,year,pack_count:packSet.packCount,bar_count:packSet.barCount,
    payload_json_bytes:packSet.payloadJsonBytes,gzip_bytes:packSet.gzipBytes,
    first_market_date:firstMarketDate,last_market_date:lastMarketDate,
    manifest_rolling_hash:rollingHash,state:"COMPLETE",
    schema_version:"S2_HISTORICAL_COLD_INGEST_RECEIPT_V0_1",
  };
  const expectedCheckpoint = {
    batch_id:id,market,year,expected_pack_count:packSet.packCount,expected_bar_count:packSet.barCount,
    rolling_hash:rollingHash,schema_version:"S2_HISTORICAL_COLD_BACKFILL_CHECKPOINT_V0_1",
  };
  const priorCheckpoint = await db.prepare(
    "SELECT * FROM s2_historical_cold_backfill_checkpoints WHERE batch_id=? LIMIT 1",
  ).bind(id).first();
  if (priorCheckpoint && !checkpointMatches(priorCheckpoint, expectedCheckpoint)) {
    throw new Error("IMMUTABLE_CONFLICT historical cold checkpoint: " + id);
  }
  const priorReceipt = await readHistoricalColdReceiptV0_1({ db, batchId:id });
  if (priorReceipt) {
    if (!receiptMatches(priorReceipt, expectedReceipt)) {
      throw new Error("IMMUTABLE_CONFLICT historical cold receipt: " + id);
    }
    await verifyHistoricalColdReceiptV0_1({ db, objectStore:store, receipt:priorReceipt });
    return deepFreeze({
      batchId:id,market,year,packCount:packSet.packCount,barCount:packSet.barCount,
      insertedObjectCount:0,identicalObjectCount:packSet.packCount,
      insertedManifestCount:0,identicalManifestCount:packSet.packCount,
      rollingHash,state:"ALREADY_COMPLETE",receiptId:priorReceipt.receipt_id,
      schemaVersion:"S2_HISTORICAL_COLD_PACK_STORE_RESULT_V0_1",
    });
  }

  let insertedObjectCount = 0;
  let identicalObjectCount = 0;
  let insertedManifestCount = 0;
  let identicalManifestCount = 0;
  let processed = 0;
  for (const part of split(prepared, chunkSize)) {
    const existing = await loadManifestMap(db, part.map(({ core }) => core));
    const inserts = [];
    for (const item of part) {
      const prior = existing.get(logicalKey(item.core));
      if (prior) {
        if (!equalManifest(prior, item.core)) {
          throw new Error("IMMUTABLE_CONFLICT historical cold manifest: " + logicalKey(item.core));
        }
        const object = await store.head(item.core.object_key);
        assertObjectMatchesPack(object, item.core);
        identicalObjectCount += 1;
        identicalManifestCount += 1;
        continue;
      }
      const ensured = await ensureColdObject({
        objectStore:store,pack:item.pack,core:item.core,bytes:item.bytes,
      });
      if (ensured.state === "INSERTED_OBJECT") insertedObjectCount += 1;
      else identicalObjectCount += 1;
      inserts.push(insertManifestStatement(db, manifestRow(item.core, ensured.object)));
    }
    if (inserts.length) {
      const results = await db.batch(inserts);
      if (!Array.isArray(results) || results.length !== inserts.length || results.some((x) => x?.success === false)) {
        throw new Error("historical cold manifest batch insert failed");
      }
      insertedManifestCount += inserts.length;
    }
    processed += part.length;
    await writeCheckpoint(db, {
      checkpoint_id:"S2HCP-" + (await sha256Hex({ batchId:id, market, year })),
      batch_id:id,market,year,expected_pack_count:packSet.packCount,expected_bar_count:packSet.barCount,
      object_ready_count:insertedObjectCount + identicalObjectCount,
      manifest_committed_count:insertedManifestCount + identicalManifestCount,
      next_pack_index:processed,rolling_hash:rollingHash,
      state:processed === prepared.length ? "OBJECTS_AND_MANIFESTS_READY" : "IN_PROGRESS",
      updated_at:completedAt,schema_version:"S2_HISTORICAL_COLD_BACKFILL_CHECKPOINT_V0_1",
    });
  }

  if (insertedManifestCount + identicalManifestCount !== packSet.packCount) {
    throw new Error("historical cold manifest accounting mismatch");
  }
  const receiptId = "S2HCR-" + rollingHash;
  await db.prepare(`INSERT INTO s2_historical_cold_ingest_receipts (
    receipt_id,batch_id,market,year,pack_count,bar_count,payload_json_bytes,gzip_bytes,
    first_market_date,last_market_date,manifest_rolling_hash,completed_at,state,schema_version
  ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).bind(
    receiptId,id,market,year,packSet.packCount,packSet.barCount,packSet.payloadJsonBytes,packSet.gzipBytes,
    firstMarketDate,lastMarketDate,rollingHash,completedAt,"COMPLETE","S2_HISTORICAL_COLD_INGEST_RECEIPT_V0_1",
  ).run();
  await writeCheckpoint(db, {
    checkpoint_id:"S2HCP-" + (await sha256Hex({ batchId:id, market, year })),
    batch_id:id,market,year,expected_pack_count:packSet.packCount,expected_bar_count:packSet.barCount,
    object_ready_count:packSet.packCount,manifest_committed_count:packSet.packCount,
    next_pack_index:packSet.packCount,rolling_hash:rollingHash,state:"COMPLETE",
    updated_at:completedAt,schema_version:"S2_HISTORICAL_COLD_BACKFILL_CHECKPOINT_V0_1",
  });
  return deepFreeze({
    batchId:id,market,year,packCount:packSet.packCount,barCount:packSet.barCount,
    insertedObjectCount,identicalObjectCount,insertedManifestCount,identicalManifestCount,
    rollingHash,state:"COMPLETE",receiptId,
    schemaVersion:"S2_HISTORICAL_COLD_PACK_STORE_RESULT_V0_1",
  });
}

export async function loadHistoricalBarsFromColdPacksV0_1({
  db,objectStore,market,symbol,fromDate,toDate,priceSpace="RAW",
} = {}) {
  if (!db || typeof db.prepare !== "function") throw new Error("isolated System2 database adapter is required");
  const store = assertHistoricalColdObjectStoreV0_1(objectStore);
  const mkt = requiredText(market, "market");
  const code = requiredText(symbol, "symbol");
  const from = requiredText(fromDate, "fromDate");
  const to = requiredText(toDate, "toDate");
  if (to < from) throw new Error("toDate cannot be earlier than fromDate");
  const result = await db.prepare(`SELECT * FROM s2_historical_a1_pack_manifests
    WHERE market=? AND symbol=? AND price_space=? AND year BETWEEN ? AND ? ORDER BY year ASC`
  ).bind(mkt,code,priceSpace,Number(from.slice(0,4)),Number(to.slice(0,4))).all();
  const rows = [];
  const packRefs = [];
  for (const manifest of result?.results || []) {
    const object = await store.get(manifest.object_key);
    if (!object) throw new Error("COLD_OBJECT_MISSING: " + manifest.object_key);
    if (bytesSha256(object.bytes) !== manifest.object_sha256) {
      throw new Error("historical cold object sha256 mismatch: " + manifest.object_key);
    }
    const pack = {
      packId:manifest.pack_id,market:manifest.market,symbol:manifest.symbol,year:manifest.year,
      priceSpace:manifest.price_space,firstMarketDate:manifest.first_market_date,lastMarketDate:manifest.last_market_date,
      barCount:manifest.bar_count,payloadHash:manifest.payload_hash,gzipBase64:Buffer.from(object.bytes).toString("base64"),
      capturedAt:manifest.captured_at,schemaVersion:manifest.pack_schema_version,
    };
    const materialized = await materializeHistoricalA1PackRowsV0_1({ pack });
    for (const row of materialized.rows) {
      if (row.marketDate >= from && row.marketDate <= to) rows.push(row);
    }
    packRefs.push(deepFreeze({
      packId:manifest.pack_id,payloadHash:manifest.payload_hash,objectSha256:manifest.object_sha256,
      objectKey:manifest.object_key,year:Number(manifest.year),
    }));
  }
  rows.sort((a,b) => a.marketDate.localeCompare(b.marketDate));
  return deepFreeze({
    market:mkt,symbol:code,fromDate:from,toDate:to,priceSpace,rowCount:rows.length,
    rows:Object.freeze(rows),packRefs:Object.freeze(packRefs),sourceMode:"R2_COLD_OBJECT_WITH_D1_MANIFEST",
    pointInTimePolicy:"SESSION_CLOSE_FINALITY_PER_MARKET_DATE",
    schemaVersion:"S2_HISTORICAL_COLD_PACK_QUERY_RESULT_V0_1",
  });
}

function backtestFromDate(marketDate, lookbackSessions) {
  const targetYear = Number(marketDate.slice(0,4));
  const priorYears = Math.max(1, Math.ceil(Number(lookbackSessions) / 180));
  return `${Math.max(2017, targetYear - priorYears)}-01-01`;
}

export function createHistoricalColdBacktestLoadersV0_1({ db, objectStore, registryId } = {}) {
  if (!db || typeof db.prepare !== "function") throw new Error("isolated System2 database adapter is required");
  const store = assertHistoricalColdObjectStoreV0_1(objectStore);
  const registry = requiredText(registryId, "registryId");
  return deepFreeze({
    async loadUniverse({ marketDate }) {
      const result = await db.prepare(`SELECT market,symbol,company_name,industry,membership_id,membership_hash
        FROM s2_historical_universe_memberships
        WHERE registry_id=? AND replay_eligible=1 AND effective_from<=?
          AND (effective_to IS NULL OR effective_to>=?)
        ORDER BY market,symbol`).bind(registry,marketDate,marketDate).all();
      const seen = new Set();
      return Object.freeze((result?.results || []).map((row) => {
        const key = row.market + "|" + row.symbol;
        if (seen.has(key)) throw new Error("overlapping active historical membership: " + key + " on " + marketDate);
        seen.add(key);
        return deepFreeze({
          market:row.market,symbol:row.symbol,companyName:row.company_name || null,
          industry:row.industry || null,excluded:false,exclusionReasons:[],
          membershipId:row.membership_id,membershipHash:row.membership_hash,
        });
      }));
    },
    async loadHistoricalBars({ market,symbol,marketDate,lookbackSessions,priceSpace="RAW" }) {
      const loaded = await loadHistoricalBarsFromColdPacksV0_1({
        db,objectStore:store,market,symbol,fromDate:backtestFromDate(marketDate,lookbackSessions),
        toDate:marketDate,priceSpace,
      });
      return loaded.rows;
    },
  });
}

export { backtestFromDate };
