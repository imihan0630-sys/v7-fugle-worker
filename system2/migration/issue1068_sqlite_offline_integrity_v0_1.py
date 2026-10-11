#!/usr/bin/env python3
"""Issue #1068 DATA_LANE: local restored SQLite *offline* logical integrity receipt.

No Cloudflare API, network, source D1 read, R2 access, migration or credentials.
An apparently clean local SQLite fixture is NEVER physical-source acceptance.
"""
import argparse
import hashlib
import heapq
import json
from contextlib import ExitStack, closing
from pathlib import Path
import sqlite3
import stat
import struct
import tempfile
from urllib.parse import quote

VERSION = "S2_ISSUE1068_ISOLATED_SQLITE_DIGEST_V0_1"
MAX_JSON_SAFE = (1 << 53) - 1
CHUNK_ROWS = 20000
DOMAIN = b"S2-ISSUE1068-OFFLINE-TYPED-SQLITE-V0.1\0"


def enc(value):
    """Unambiguous type-tag + length-prefixed SQLite value serialization."""
    if value is None:
        return b"N"
    if isinstance(value, bool):
        raise ValueError("UNEXPECTED_BOOLEAN_SQLITE_VALUE")
    if isinstance(value, int):
        raw = str(value).encode("ascii")
        tag = b"I"
    elif isinstance(value, float):
        raw = struct.pack(">d", value)
        tag = b"F"
    elif isinstance(value, str):
        raw = value.encode("utf-8", "strict")
        tag = b"T"
    elif isinstance(value, bytes):
        raw = value
        tag = b"B"
    else:
        raise ValueError("UNSUPPORTED_SQLITE_VALUE_TYPE")
    return tag + struct.pack(">Q", len(raw)) + raw


def frame(values):
    return struct.pack(">Q", len(values)) + b"".join(enc(v) for v in values)


def digest_file(path):
    h = hashlib.sha256()
    with path.open("rb") as fd:
        while True:
            block = fd.read(1024 * 1024)
            if not block:
                return h.hexdigest()
            h.update(block)


def safe_local_file(path):
    p = Path(path)
    if p.is_symlink() or not p.exists():
        raise ValueError("OFFLINE_RESTORE_FILE_MISSING_OR_SYMLINK")
    s = p.stat()
    if not stat.S_ISREG(s.st_mode) or s.st_size == 0:
        raise ValueError("OFFLINE_RESTORE_NOT_NONEMPTY_REGULAR_FILE")
    # A base DB copied without its active WAL is not a consistent backup.
    for suffix in ("-wal", "-shm", "-journal"):
        if Path(str(p) + suffix).exists():
            raise ValueError("SQLITE_ACTIVE_OR_UNVERIFIED_SIDECAR_DETECTED")
    return p.resolve(strict=True)


def quote_name(name):
    return '"' + name.replace('"', '""') + '"'


def sorted_digest_stream(conn, table, schema_sha, scratch):
    """Sort fixed 32-byte row hashes in bounded chunks: order-independent multiset."""
    cursor = conn.execute("SELECT * FROM " + quote_name(table))
    if not cursor.description:
        raise ValueError("UNREADABLE_SQLITE_TABLE")
    files, rows, pending = [], 0, []

    def spill():
        nonlocal pending
        pending.sort()
        f = scratch / ("chunk-%06d.bin" % len(files))
        with f.open("wb") as out:
            for x in pending:
                out.write(x)
        files.append(f)
        pending = []

    for row in cursor:
        pending.append(hashlib.sha256(DOMAIN + b"ROW\0" + frame(row)).digest())
        rows += 1
        if rows > MAX_JSON_SAFE:
            raise ValueError("ROW_COUNT_EXCEEDS_SAFE_JSON_INTEGER")
        if len(pending) >= CHUNK_ROWS:
            spill()
    if pending:
        spill()

    h = hashlib.sha256()
    h.update(DOMAIN + b"TABLE\0")
    h.update(enc(table))
    h.update(bytes.fromhex(schema_sha))
    h.update(struct.pack(">Q", rows))
    with ExitStack() as stack:
        streams = [stack.enter_context(p.open("rb")) for p in files]
        chunks = [iter(lambda f=f: f.read(32), b"") for f in streams]
        for item in heapq.merge(*chunks):
            if len(item) != 32:
                raise ValueError("TRUNCATED_HASH_CHUNK")
            h.update(item)
    return rows, h.hexdigest()


def verify_isolated_sqlite(path):
    db = safe_local_file(path)
    # mode=ro ensures this program never modifies the original restored copy.
    # No immutable=1: it can ignore WAL content and falsely certify a snapshot.
    initial_fingerprint = digest_file(db)
    initial_stat = db.stat()
    uri = "file:" + quote(str(db), safe="/") + "?mode=ro"
    with closing(sqlite3.connect(uri, uri=True, timeout=0)) as conn:
        conn.execute("PRAGMA query_only=ON")
        conn.execute("PRAGMA trusted_schema=OFF")
        conn.execute("PRAGMA busy_timeout=0")
        conn.execute("BEGIN")  # repeatable local restored-file read snapshot
        check = conn.execute("PRAGMA integrity_check").fetchall()
        if check != [("ok",)]:
            raise ValueError("SQLITE_INTEGRITY_CHECK_FAILED")
        if conn.execute("PRAGMA foreign_key_check").fetchone() is not None:
            raise ValueError("SQLITE_FOREIGN_KEY_CHECK_FAILED")
        objects = conn.execute(
            "SELECT type,name,tbl_name,sql FROM sqlite_master "
            "WHERE type IN ('table','index','view','trigger') "
            "ORDER BY type,name,tbl_name,sql"
        ).fetchall()
        if not objects:
            raise ValueError("SQLITE_SCHEMA_EMPTY")
        if any("CREATE VIRTUAL TABLE" in (x[3] or "").upper() for x in objects):
            raise ValueError("VIRTUAL_TABLE_OFFLINE_DIGEST_UNSUPPORTED")
        tables = sorted(x[1] for x in objects if x[0] == "table")
        if not {"s2_schema_meta", "s2_decisions"}.issubset(tables):
            raise ValueError("REQUIRED_SOURCE_SYSTEM2_TABLES_ABSENT")
        # sqlite_sequence and other real tables are included: no partial inventory.
        all_schema_sha = hashlib.sha256(
            DOMAIN + b"SCHEMA\0" + frame([
                json.dumps(objects, ensure_ascii=False, separators=(",", ":"))
            ])
        ).hexdigest()
        results = []
        with tempfile.TemporaryDirectory(prefix="s2-issue1068-offline-digests-") as work:
            for table in tables:
                table_objects = sorted(
                    (x for x in objects if x[2] == table or (x[0] == "table" and x[1] == table)),
                    key=lambda a: (a[0], a[1], a[2], a[3] or "")
                )
                # Include explicit column metadata and index/trigger DDL. Never
                # confuse repository migration definitions with applied schema.
                column_metadata = conn.execute(
                    "PRAGMA table_xinfo(" + quote_name(table) + ")"
                ).fetchall()
                schema_sha = hashlib.sha256(
                    DOMAIN + b"TABLE_SCHEMA\0" +
                    frame([json.dumps(table_objects, separators=(",", ":")),
                           json.dumps(column_metadata, separators=(",", ":"))])
                ).hexdigest()
                rows, row_sha = sorted_digest_stream(
                    conn, table, schema_sha, Path(work)
                )
                # All scratch chunk files are hashes only; clean between tables.
                for chunk in Path(work).glob("chunk-*.bin"):
                    chunk.unlink()
                results.append({"name": table, "rows": rows,
                                "sha256": row_sha, "schemaSha256": schema_sha})
        total = sum(x["rows"] for x in results)
        if total > MAX_JSON_SAFE:
            raise ValueError("TOTAL_ROWS_EXCEED_SAFE_JSON_INTEGER")
        h = hashlib.sha256()
        h.update(DOMAIN + b"ALL_TABLES\0")
        for table in results:
            h.update(frame([table["name"], table["rows"], table["sha256"],
                            table["schemaSha256"]]))
        # Reject any local writer/sidecar interference during the attestation.
        for suffix in ("-wal", "-shm", "-journal"):
            if Path(str(db) + suffix).exists():
                raise ValueError("SQLITE_SIDECAR_APPEARED_DURING_ATTESTATION")
        after_stat = db.stat()
        final_fingerprint = digest_file(db)
        if (initial_fingerprint != final_fingerprint or
                (initial_stat.st_size, initial_stat.st_mtime_ns) !=
                (after_stat.st_size, after_stat.st_mtime_ns)):
            raise ValueError("OFFLINE_RESTORED_FILE_CHANGED_DURING_ATTESTATION")
        return {
            "schemaVersion": VERSION,
            "scope": "LOCAL_ISOLATED_SQLITE_RESTORED_COPY_ONLY",
            "status": "OFFLINE_LOGICAL_INTEGRITY_REVIEW_ONLY",
            "offlineRestoredFileSizeBytes": db.stat().st_size,
            "offlineRestoredFileSha256": final_fingerprint,
            "schemaSha256": all_schema_sha,
            "allTableContentSha256": h.hexdigest(),
            "tableCount": len(results),
            "totalRows": total,
            "tables": results,
            "integrityCheck": "ok",
            "foreignKeyCheck": "ok",
            "sourceD1PhysicalReadExecuted": False,
            "sourceD1BackupPhysicallyAccepted": False,
            "pitPhysicallyAccepted": False,
            "frozenPhysicallyAccepted": False,
            "r2ContentPhysicallyAccepted": False,
            "destinationReadbackAccepted": False,
            "permissionToImport": False,
            "shadowAuthorized": False,
            "independentAuditRequired": True,
        }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--db", required=True, help="local isolated SQLite copy")
    args = parser.parse_args()
    try:
        result = verify_isolated_sqlite(args.db)
        print(json.dumps(result, ensure_ascii=False, sort_keys=True, indent=2))
    except (OSError, ValueError, sqlite3.Error, UnicodeError) as exc:
        # Don't print raw SQL, database paths, bytes, or secrets.
        kind = str(exc) if isinstance(exc, ValueError) else "OFFLINE_SQLITE_READ_ERROR"
        print(json.dumps({"schemaVersion": VERSION,
                          "status": "OFFLINE_EVIDENCE_DEFER",
                          "blocker": kind,
                          "permissionToImport": False,
                          "shadowAuthorized": False}))
        raise SystemExit(2)


if __name__ == "__main__":
    main()
