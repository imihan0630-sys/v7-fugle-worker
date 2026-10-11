#!/usr/bin/env python3
"""DATA_LANE #1068: OFFLINE-only source restore vs target schema replica pre-import review.
Accepts two *local* SQLite files; performs NO Cloudflare query, D1 write or R2 action.
A source/target-looking local fixture is NEVER a real Cloudflare physical acceptance.
"""
import argparse
from contextlib import closing
import hashlib
import json
from pathlib import Path
import sqlite3
from urllib.parse import quote
from issue1068_sqlite_offline_integrity_v0_1 import safe_local_file

VERSION = "S2_ISSUE1068_LOCAL_SCHEMA_PARITY_V0_1"
IGNORE = {"_cf_KV", "sqlite_sequence"}


def quoted(name):
    return '"' + name.replace('"', '""') + '"'


def open_local(path):
    p = safe_local_file(path)
    uri = "file:" + quote(str(p), safe="/") + "?mode=ro"
    conn = sqlite3.connect(uri, uri=True, timeout=0)
    conn.execute("PRAGMA query_only=ON")
    conn.execute("PRAGMA trusted_schema=OFF")
    conn.execute("PRAGMA busy_timeout=0")
    conn.execute("BEGIN")
    return conn


def table_fingerprint(conn, name):
    columns = conn.execute("PRAGMA table_xinfo(" + quoted(name) + ")").fetchall()
    if not columns:
        raise ValueError("SCHEMA_COLUMNS_NOT_READABLE")
    # Indexes encode UNIQUE and column order; index names are not decisive.
    # Expression / partial indexes have SQL that must be reconciled literally.
    indexes = []
    for _, index_name, unique, origin, partial in conn.execute(
        "PRAGMA index_list(" + quoted(name) + ")"
    ).fetchall():
        index_cols = conn.execute("PRAGMA index_xinfo(" + quoted(index_name) + ")").fetchall()
        sql = conn.execute("SELECT sql FROM sqlite_master WHERE type='index' AND name=?", (index_name,)).fetchone()
        # cid=-1 is ordinary rowid tail; only cid=-2 means an expression.
        indexes.append({
            "unique": bool(unique), "origin": origin, "partial": bool(partial),
            "columns": [(row[1], row[2], row[3], row[4], row[5]) for row in index_cols],
            "expressionDdl": sql[0] if sql and (partial or any(row[1] == -2 for row in index_cols)) else None,
        })
    indexes.sort(key=lambda x: json.dumps(x, sort_keys=True))
    fks = conn.execute("PRAGMA foreign_key_list(" + quoted(name) + ")").fetchall()
    ddl = conn.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name=?", (name,)).fetchone()
    ddl_text = ddl[0] if ddl else None
    if not ddl_text or "CREATE VIRTUAL TABLE" in ddl_text.upper():
        raise ValueError("VIRTUAL_OR_UNKNOWN_SQLITE_TABLE_NOT_ADMISSIBLE")
    return {
        "columns": [
            # cid, name, declared-type, NOT NULL, default, PK-order, hidden/generated
            (r[0], r[1], (r[2] or "").strip().upper(), r[3], r[4], r[5], r[6])
            for r in columns
        ],
        "indexes": indexes,
        "foreignKeys": fks,
        "withoutRowid": "WITHOUT ROWID" in ddl_text.upper(),
        "strict": ddl_text.rstrip().upper().endswith(" STRICT"),
    }


def assess_local_parity(source_path, destination_path):
    s_path, d_path = safe_local_file(source_path), safe_local_file(destination_path)
    if s_path == d_path:
        raise ValueError("SOURCE_AND_TARGET_MUST_BE_SEPARATE_OFFLINE_COPIES")
    blockers = []
    with closing(open_local(s_path)) as src, closing(open_local(d_path)) as dst:
        for role, con in (("SOURCE", src), ("DESTINATION", dst)):
            if con.execute("PRAGMA integrity_check").fetchall() != [("ok",)]:
                raise ValueError(role + "_LOCAL_SQLITE_CORRUPT")
        def tables(con):
            return {
                name for (name,) in con.execute(
                    "SELECT name FROM sqlite_master WHERE type='table'"
                ).fetchall()
            }
        source_all, target_all = tables(src), tables(dst)
        source = sorted(n for n in source_all if n.startswith("s2_"))
        target = sorted(n for n in target_all if n.startswith("s2_"))
        extra_non_s2 = sorted(n for n in source_all if not n.startswith("s2_") and n not in IGNORE and not n.startswith("sqlite_"))
        if extra_non_s2:
            blockers.append("SOURCE_NON_S2_APPLICATION_TABLE_PRESENT")
        if "s2_decisions" not in source or "s2_decisions" not in target:
            blockers.append("FROZEN_DECISION_TABLE_MISSING")
        missing_in_target = sorted(set(source) - set(target))
        extra_in_target = sorted(set(target) - set(source))
        if missing_in_target:
            blockers.append("SOURCE_TABLES_ABSENT_FROM_EXISTING_TARGET_SCHEMA")
        incompatible = []
        compatible = 0
        fingerprint_digests = []
        for name in source:
            if name not in target:
                continue
            sf, df = table_fingerprint(src, name), table_fingerprint(dst, name)
            # Exact unique/PK/default/FK/column semantics required; even a
            # stronger target constraint can reject otherwise valid source rows.
            if sf != df:
                incompatible.append(name)
            else:
                compatible += 1
            fingerprint_digests.append(
                hashlib.sha256(
                    json.dumps([name, sf, df], sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode()
                ).hexdigest()
            )
        if incompatible:
            blockers.append("SOURCE_DESTINATION_TABLE_COLUMN_INDEX_OR_FK_MISMATCH")
        if not source or not target:
            blockers.append("SOURCE_OR_TARGET_SCHEMA_EMPTY")
    return {
        "schemaVersion": VERSION,
        "status": "LOCAL_SCHEMA_DIFFERENCE_BLOCKED" if blockers else "OFFLINE_SCHEMA_SHAPE_MATCH_ONLY",
        "blockers": sorted(set(blockers)),
        "sourceS2TableCount": len(source),
        "destinationS2TableCount": len(target),
        "sameShapeTableCount": compatible,
        "sourceTablesAbsentInDestination": missing_in_target,
        "destinationExtraTablesNotInSource": extra_in_target,
        "incompatibleSourceTableNames": incompatible,
        "sourceNonS2ApplicationTableCount": len(extra_non_s2),
        "localShapePairSha256": hashlib.sha256(
            json.dumps(sorted(fingerprint_digests), separators=(",", ":")).encode()
        ).hexdigest(),
        "physicalSourceExportAuthenticated": False,
        "realDestinationSchemaReadbackAuthenticatedByThisTool": False,
        "sourcePITAndFrozenAuditAccepted": False,
        "permissionToImport": False,
        "shadowAuthorized": False,
        "cloudflareApiCallsExecuted": 0,
        "cloudflareD1StatementsExecuted": 0,
        "independentAuditRequired": True,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-db", required=True, help="isolated locally restored SOURCE SQL")
    parser.add_argument("--target-db", required=True, help="isolated local TARGET schema-only replica")
    args = parser.parse_args()
    try:
        out = assess_local_parity(args.source_db, args.target_db)
        print(json.dumps(out, sort_keys=True, indent=2, ensure_ascii=False))
        if out["blockers"]:
            raise SystemExit(2)
    except (ValueError, sqlite3.Error, OSError) as exc:
        # No paths/raw rows/tokens/credential strings in error receipts.
        code = str(exc) if isinstance(exc, ValueError) else "OFFLINE_LOCAL_SCHEMA_INPUT_ERROR"
        print(json.dumps({"schemaVersion": VERSION, "status": "OFFLINE_SCHEMA_DEFER",
                          "blocker": code, "permissionToImport": False,
                          "shadowAuthorized": False}))
        raise SystemExit(2)


if __name__ == "__main__":
    main()
