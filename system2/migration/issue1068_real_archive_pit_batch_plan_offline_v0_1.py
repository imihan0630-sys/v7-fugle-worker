#!/usr/bin/env python3
"""Read-only sanitized PIT/batch migration planning from AUTHENTIC restored SOURCE SQL.

The caller is a temporary protected GitHub runner only. This produces an aggregate
witness, NOT an import permit, positive PIT proof, or actual D1 mutation.
Never publish plaintext source SQL, rows, batch identifiers, tokens or object keys.
"""
import hashlib
import json
import os
import sqlite3
import sys
from collections import defaultdict

SOURCE_ROWS = 113222
SOURCE_BARS = 84688
SOURCE_BATCHES = 129
SOURCE_TABLES = 55
SOURCE_INDEXES = 63
ESTIMATED_BILLED_WRITES_PER_BAR_WITH_PK_AND_UNIQUE = 6
DAY80_WRITE_BUDGET = 80000
HOT_BAR_WRITE_BUDGET_FOR_PLAN = 72000

def fail(code):
    raise ValueError("SOURCE_ARCHIVE_PIT_BATCH_PLAN_" + code)

def main(path):
    if not os.path.isfile(path) or os.path.islink(path):
        fail("ISOLATED_SQLITE_SOURCE_FILE_INVALID")
    conn = sqlite3.connect("file:" + path + "?mode=ro", uri=True)
    conn.execute("PRAGMA query_only=ON")
    if conn.execute("PRAGMA quick_check").fetchone()[0] != "ok":
        fail("ORIGINAL_SQLITE_INTEGRITY_FAILED")
    tables = [row[0] for row in conn.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 's2_%'")]
    indices = [row[0] for row in conn.execute(
        "SELECT name FROM sqlite_master WHERE type='index' AND name LIKE 'idx_s2_%'")]
    if len(tables) != SOURCE_TABLES or len(indices) != SOURCE_INDEXES:
        fail("SOURCE_SCHEMA_SHAPE_DRIFT")
    counts = {table:conn.execute('SELECT COUNT(*) FROM "' + table + '"').fetchone()[0] for table in tables}
    if sum(counts.values()) != SOURCE_ROWS or counts.get("s2_historical_a1_bars") != SOURCE_BARS        or counts.get("s2_historical_ingest_batches") != SOURCE_BATCHES or counts.get("s2_decisions") != 0:
        fail("ORIGINAL_SOURCE_ROW_COUNT_DRIFT")
    manifest = {}
    for row in conn.execute("""
        SELECT batch_id, row_count, pit_eligible_count, unknown_availability_count,
               first_market_date, last_market_date, dataset_lane
        FROM s2_historical_ingest_batches
    """):
        key,n,eligible,unknown,start,end,lane = row
        if not isinstance(key,str) or not key:
            fail("INVALID_ARCHIVED_BATCH_ID")
        if key in manifest:
            fail("DUPLICATE_BATCH_ID")
        manifest[key] = {"declaredRows":n,"declaredEligible":eligible,
                         "declaredUnknown":unknown,"from":start,"to":end,
                         "laneHash":hashlib.sha256(str(lane).encode()).hexdigest()[:16]}
    summary = {}
    for row in conn.execute("""
        SELECT batch_id, COUNT(*) AS n,
               SUM(CASE WHEN pit_replay_eligible=1 AND available_at IS NOT NULL
                            AND TRIM(available_at)<>'' THEN 1 ELSE 0 END) AS taggedEligible,
               SUM(CASE WHEN available_at IS NULL OR TRIM(available_at)='' THEN 1 ELSE 0 END) AS unavailable,
               SUM(CASE WHEN available_at IS NOT NULL AND observed_at IS NOT NULL
                            AND available_at > observed_at THEN 1 ELSE 0 END) AS futureAvailability,
               SUM(CASE WHEN source_row_hash IS NULL OR TRIM(source_row_hash)='' OR
                          bar_hash IS NULL OR TRIM(bar_hash)='' THEN 1 ELSE 0 END) AS missingHashes,
               MIN(market_date), MAX(market_date)
        FROM s2_historical_a1_bars
        GROUP BY batch_id
    """):
        key,n,eligible,unknown,future,bad,first,last = row
        if not isinstance(key,str) or not key:
            fail("MISSING_BAR_BATCH_LINK")
        summary[key] = {"rows":n,"taggedEligible":eligible,"unknownAvailability":unknown,
                        "futureAvailability":future,"missingHashes":bad,
                        "firstDate":first,"lastDate":last}
    if sum(x["rows"] for x in summary.values()) != SOURCE_BARS:
        fail("SOURCE_BAR_GROUP_TOTAL_MISMATCH")
    joined = []
    for key,bar in summary.items():
        declared=manifest.get(key)
        if declared is None:
            fail("ORPHANED_SOURCE_BAR_BATCH")
        aligned = bar["rows"] == declared["declaredRows"]
        proposed = aligned and bar["taggedEligible"] == bar["rows"] and                    bar["unknownAvailability"] == 0 and bar["futureAvailability"] == 0 and                    bar["missingHashes"] == 0 and declared["declaredEligible"] == bar["rows"] and                    declared["declaredUnknown"] == 0
        joined.append({"batchFingerprint":hashlib.sha256(key.encode()).hexdigest(),
                       "rows":bar["rows"],"taggedEligible":bar["taggedEligible"],
                       "unknownAvailability":bar["unknownAvailability"],
                       "futureAvailability":bar["futureAvailability"],
                       "missingHashes":bar["missingHashes"],"manifestRowCountMatches":aligned,
                       "firstMarketDate":bar["firstDate"],"lastMarketDate":bar["lastDate"],
                       "metadataCandidateOnly":proposed})
    joined.sort(key=lambda z:(z["firstMarketDate"] or "",z["batchFingerprint"]))
    aggregate = {
        "sourceBatchRecords":len(manifest),
        "sourceBatchesWithBars":len(joined),
        "sourceBatchesWithNoBars":len(manifest)-len(joined),
        "totalBarRows":sum(x["rows"] for x in joined),
        "selfReportedPitEligibleRows":sum(x["taggedEligible"] for x in joined),
        "noAvailableAtRows":sum(x["unknownAvailability"] for x in joined),
        "availableAtAfterObservedAtRows":sum(x["futureAvailability"] for x in joined),
        "missingHashesRows":sum(x["missingHashes"] for x in joined),
        "declaredRowCountMismatchBatches":sum(not x["manifestRowCountMatches"] for x in joined),
        "metadataCandidateCompleteBatches":sum(x["metadataCandidateOnly"] for x in joined)
    }
    selected=[];total=0
    for x in joined:
        if not x["metadataCandidateOnly"]: continue
        if total+x["rows"] > HOT_BAR_WRITE_BUDGET_FOR_PLAN // ESTIMATED_BILLED_WRITES_PER_BAR_WITH_PK_AND_UNIQUE:
            continue
        selected.append(x["batchFingerprint"])
        total+=x["rows"]
    out = {
      "schemaVersion":"S2_G3_REAL_SOURCE_ARCHIVE_PIT_BATCH_OFFLINE_SCAN_20261012_V0_1",
      "originalBackupRun":38150147134,
      "originSqlSHA256":"56cd6ebc449949d67a7123da2a2300d685f3d5a2412383a3afc217001c4e5f12",
      "sourceRows":SOURCE_ROWS,"sourceBars":SOURCE_BARS,
      "sourcePopulatedTables":sum(bool(n) for n in counts.values()),
      "sourceDecisionsRows":counts["s2_decisions"],
      "batchSummary":aggregate,
      "batchMetadata":joined,
      "provisionalCompleteBatchCandidateSHA256s":selected,
      "provisionalBarRows":total,
      "provisionalIndexedWritesEstimate":total*ESTIMATED_BILLED_WRITES_PER_BAR_WITH_PK_AND_UNIQUE,
      "operationalBudgetBilledWrites":DAY80_WRITE_BUDGET,
      "sourcePITFirstKnownAtIndependentlyProven":False,
      "sourcePITAvailableAtIndependentlyProven":False,
      "immutablePriorFrozenDecisionAnchorAccepted":False,
      "independentAuditAccepted":False,
      "actualDestinationQuotaGrant":False,
      "permissionToImport":False,
      "cloudflareWrites":0,
      "shadowAuthorized":False,
      "safeInterpretation":"REAL_SOURCE_OFFLINE_ROWS_AND_SELF_REPORTED_PIT_TAGS_ONLY_NOT_A_PIT_PROOF_OR_D1_IMPORT_PERMIT"
    }
    conn.close()
    print(json.dumps(out,sort_keys=True,separators=(",",":")))

if __name__ == "__main__":
    try:
        main(sys.argv[1] if len(sys.argv)==2 else "")
    except Exception as ex:
        print("SOURCE_ARCHIVE_PIT_BATCH_PLAN_FAIL_CLOSED:"+str(ex)[:160],file=sys.stderr)
        sys.exit(2)
