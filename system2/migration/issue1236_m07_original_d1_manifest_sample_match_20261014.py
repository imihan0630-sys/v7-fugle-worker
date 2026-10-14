#!/usr/bin/env python3
"""M07 #1236, original SOURCE SQL archive-only object-key hash and byte SHA join.
Protected ephemeral SQLite restore: never print object keys/rows/source SQL.
Does not call Cloudflare or require new permissions/paid R2.
"""
import hashlib
import json
import os
import sqlite3
import sys
import tempfile
from pathlib import Path

SQL_SHA = "56cd6ebc449949d67a7123da2a2300d685f3d5a2412383a3afc217001c4e5f12"
SAMPLE_RECEIPT_SHA = "d9c0a7ac091083511dfdd1d028ef191fd6f2f27f41377b139c461566e1aeaa82"
SAMPLE_KEY_SHA = "33a6b9d8196dcfb8261aaeb13eef95baed4603b6bc01af7516ab1ad30db0ee76"
SAMPLE_BODY_SHA = "356b6504a1b916c5b4975b29add4fe08f12d3eb94b93a13f33f6af12e9448c7a"
SAMPLE_BYTES = 14274
BUCKET = "system2-historical-research"
TABLES = {
    "s2_historical_a1_pack_manifests": 16100,
    "s2_historical_a1_segment_manifests": 9723,
}
def sha(blob):
    return hashlib.sha256(blob).hexdigest()
def die(reason):
    raise ValueError("M07_CROSSWALK_" + reason)
def read_sample(path):
    raw = Path(path).read_bytes()
    if sha(raw) != SAMPLE_RECEIPT_SHA:
        die("SAMPLE_ORIGINAL_JSON_SHA_MISMATCH")
    try:
        d = json.loads(raw)
    except (TypeError, ValueError):
        die("SAMPLE_JSON_INVALID")
    required = (
        d.get("schemaVersion") == "S2_M07_SINGLE_R2_OBJECT_RAW_BYTE_SELF_CONSISTENCY_V0_1"
        and d.get("status") == "SOURCE_R2_SINGLE_OBJECT_BODY_SHA_MATCHED_TO_SOURCE_OBJECT_METADATA_ONLY"
        and d.get("sourceObjectBytesShaVerified") == 1
        and d.get("privateObjectKeySha256") == SAMPLE_KEY_SHA
        and d.get("originalObjectSizeBytes") == SAMPLE_BYTES
        and d.get("originalObjectBodySha256") == SAMPLE_BODY_SHA
        and d.get("originalSourceHeadMetadataSha256") == SAMPLE_BODY_SHA
        and d.get("independentSourceD1ManifestMatch") is False
    )
    if not required:
        die("SAMPLE_SCOPE_OR_PROVENANCE_INVALID")
    return {
        "keySha256": d["privateObjectKeySha256"],
        "objectSha256": d["originalObjectBodySha256"],
        "bytes": d["originalObjectSizeBytes"],
    }

def match_sample_to_source_manifests(connection, sample):
    """Pure read-only manifest matcher, testable on an in-memory fixture."""
    matches = []
    totals = {}
    observed = 0
    key_sha = sample["keySha256"]
    for table, expected in TABLES.items():
        count = connection.execute(f'SELECT COUNT(*) FROM "{table}"').fetchone()[0]
        totals[table] = count
        if count != expected:
            die("SOURCE_TABLE_COUNT_DRIFT")
        for key, digest, length, bucket in connection.execute(
                f'SELECT object_key,object_sha256,gzip_bytes,object_bucket FROM "{table}"'):
            observed += 1
            if not isinstance(key, str) or not key:
                die("SOURCE_OBJECT_KEY_MISSING")
            if sha(key.encode("utf-8")) == key_sha:
                matches.append({
                    "sourceTable": table,
                    "sourceObjectSha256": digest,
                    "sourceObjectBytes": length,
                    "sourceBucket": bucket,
                })
    if observed != 25823:
        die("SOURCE_MANIFEST_SCOPE_DRIFT")
    result = {
        "sourceManifestRowsScanned": observed,
        "sourcePackManifests": totals["s2_historical_a1_pack_manifests"],
        "sourceSegmentManifests": totals["s2_historical_a1_segment_manifests"],
        "sampleObjectKeySha256": key_sha,
        "sampleObjectOriginalByteSha256": sample["objectSha256"],
        "sampleObjectOriginalBytes": sample["bytes"],
        "sampleObjectKeyMatchCount": len(matches),
        "originalSourceSqlExpectedSha256": SQL_SHA,
        "sourceD1QueriedLive": False,
        "sourceR2ObjectReDownloadedHere": False,
        "destinationD1Touched": False,
        "originalSourceR2BucketCompletelyInventoried": False,
        "pointInTimeOrFrozenCertified": False,
        "shadowOrTradingAuthorized": False,
        "independentAuditorApproved": False,
    }
    if not matches:
        return {**result,
            "status": "R2_SAMPLE_KEY_ABSENT_FROM_ORIGINAL_SOURCE_D1_MANIFEST__NO_JOIN",
            "originalSourceManifestCrosswalkAccepted": False}
    if len(matches) != 1:
        die("SOURCE_MANIFEST_KEY_DUPLICATE")
    row = matches[0]
    if row["sourceBucket"] != BUCKET or row["sourceObjectBytes"] != sample["bytes"] or (
            not isinstance(row["sourceObjectSha256"], str) or
            row["sourceObjectSha256"].lower() != sample["objectSha256"].lower()):
        die("ORIGINAL_D1_MANIFEST_SHA_SIZE_BUCKET_CONFLICT")
    return {**result,
        "status": "ONE_ORIGINAL_SOURCE_R2_OBJECT_D1_MANIFEST_SHA_AND_SIZE_MATCHED__AUDIT_PENDING",
        "originalSourceManifestCrosswalkAccepted": True,
        "matchSourceManifestType": (
            "PACK" if row["sourceTable"] == "s2_historical_a1_pack_manifests" else "SEGMENT"),
        "matchedOriginalManifestByteSha256": row["sourceObjectSha256"].lower(),
        "matchedOriginalManifestBytes": row["sourceObjectBytes"],
    }

def verify_archived_source(sql_path, sample_path):
    sql_path = Path(sql_path)
    if not sql_path.is_file() or sql_path.is_symlink() or sql_path.stat().st_size != 316938975:
        die("SOURCE_SQL_BYTES_INVALID")
    h = hashlib.sha256()
    with sql_path.open("rb") as f:
        for chunk in iter(lambda:f.read(1048576), b""):
            h.update(chunk)
    if h.hexdigest() != SQL_SHA:
        die("SOURCE_SQL_ORIGINAL_SHA_MISMATCH")
    sample = read_sample(sample_path)
    with tempfile.TemporaryDirectory(prefix="s2-m07-matcher-") as directory:
        os.chmod(directory, 0o700)
        db_path = os.path.join(directory, "source.sqlite3")
        db = sqlite3.connect(db_path)
        try:
            # Existing G3 already authenticated this original 317MB SQL; rebuild
            # only in ephemeral runner and inspect original two manifest tables.
            db.executescript(sql_path.read_text(encoding="utf8"))
            if db.execute("PRAGMA integrity_check").fetchone()[0] != "ok":
                die("RESTORED_SQLITE_INTEGRITY")
            return match_sample_to_source_manifests(db, sample)
        finally:
            db.close()

if __name__ == "__main__":
    try:
        if len(sys.argv) != 3:
            die("USAGE")
        print(json.dumps(verify_archived_source(sys.argv[1], sys.argv[2]),
              separators=(",", ":"), sort_keys=True))
    except Exception as exc:
        reason = str(exc)
        print(reason if reason.startswith("M07_CROSSWALK_") else "M07_CROSSWALK_UNKNOWN_FAIL_CLOSED",
              file=sys.stderr)
        sys.exit(2)
