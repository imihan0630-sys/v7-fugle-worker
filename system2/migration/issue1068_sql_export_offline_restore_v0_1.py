#!/usr/bin/env python3
"""DATA_LANE #1068: safely replay locally exported D1 SQL into an isolated SQLite fixture.
No Cloudflare API, live D1, destination, R2, secrets, import permission or Shadow.
The resulting receipt is UNTRUSTED_OFFLINE_RESTORE_ONLY, never source physical acceptance.
"""
import argparse
import hashlib
import json
import re
import sqlite3
import stat
import tempfile
from pathlib import Path
from issue1068_sqlite_offline_integrity_v0_1 import verify_isolated_sqlite, digest_file

VERSION = "S2_ISSUE1068_D1_SQL_OFFLINE_RESTORE_V0_1"
ALLOWED = re.compile(
    r"^(?:CREATE\s+TABLE\b|CREATE\s+(?:UNIQUE\s+)?INDEX\b|"
    r"INSERT\s+INTO\b|BEGIN(?:\s+TRANSACTION)?\s*;|COMMIT\s*;|"
    r"PRAGMA\s+foreign_keys\s*=\s*OFF\s*;)",
    re.IGNORECASE | re.DOTALL,
)
MAX_STATEMENT_CHARS = 20_000_000
# Only expected SQL dump capabilities; all other SQLite authorizer opcodes fail.
CAPABILITIES = {
    sqlite3.SQLITE_CREATE_TABLE, sqlite3.SQLITE_CREATE_INDEX,
    sqlite3.SQLITE_INSERT, sqlite3.SQLITE_READ, sqlite3.SQLITE_SELECT,
    sqlite3.SQLITE_TRANSACTION,
}
if hasattr(sqlite3, "SQLITE_RECURSIVE"):
    CAPABILITIES.add(sqlite3.SQLITE_RECURSIVE)


def sqlite_authorizer(op, a, b, database_name, trigger_name):
    if database_name not in (None, "main"):
        return sqlite3.SQLITE_DENY
    if trigger_name is not None:
        return sqlite3.SQLITE_DENY
    if op == sqlite3.SQLITE_PRAGMA:
        return (sqlite3.SQLITE_OK if a == "foreign_keys" and b == "OFF"
                else sqlite3.SQLITE_DENY)
    # SQLite internally updates sqlite_master during CREATE TABLE / CREATE INDEX;
    # prohibit all user-table UPDATE. Top-level SQL lexical guard denies UPDATE.
    if op == sqlite3.SQLITE_UPDATE and a == "sqlite_master" and database_name == "main":
        return sqlite3.SQLITE_OK
    # SQLite internally runs REINDEX while creating an index. Top-level REINDEX
    # remains blocked by the explicit SQL statement allow-list.
    if op == sqlite3.SQLITE_REINDEX and database_name == "main":
        return sqlite3.SQLITE_OK
    return sqlite3.SQLITE_OK if op in CAPABILITIES else sqlite3.SQLITE_DENY


def isolate_source_sql(path):
    p = Path(path)
    if p.is_symlink() or not p.exists():
        raise ValueError("ORIGINAL_EXPORT_SQL_MISSING_OR_SYMLINK")
    s = p.stat()
    if not stat.S_ISREG(s.st_mode) or s.st_size == 0:
        raise ValueError("ORIGINAL_EXPORT_NOT_NONEMPTY_REGULAR_FILE")
    return p.resolve(strict=True)


def replay_offline_sql(path):
    src = isolate_source_sql(path)
    before = (src.stat().st_size, src.stat().st_mtime_ns, digest_file(src))
    statements = 0
    with tempfile.TemporaryDirectory(prefix="issue1068-offline-sql-restore-") as td:
        target = Path(td) / "isolated.sqlite"
        con = sqlite3.connect(str(target))
        try:
            con.enable_load_extension(False)
            con.set_authorizer(sqlite_authorizer)
            with src.open("r", encoding="utf-8-sig", newline="") as stream:
                buffer = ""
                for line in stream:
                    # Only full-line SQL export comments are allowed.
                    if not buffer and (not line.strip() or line.lstrip().startswith("--")):
                        continue
                    buffer += line
                    if len(buffer) > MAX_STATEMENT_CHARS:
                        raise ValueError("EXPORT_SQL_STATEMENT_TOO_LARGE_FOR_SAFE_REPLAY")
                    if not sqlite3.complete_statement(buffer):
                        continue
                    statement = buffer.strip()
                    buffer = ""
                    if not ALLOWED.match(statement):
                        raise ValueError("EXPORT_SQL_UNSAFE_STATEMENT_TYPE")
                    if ("CREATE VIRTUAL TABLE" in statement.upper()
                            or "LOAD_EXTENSION" in statement.upper()):
                        raise ValueError("EXPORT_SQL_UNSUPPORTED_VIRTUAL_OR_EXTENSION")
                    try:
                        con.execute(statement)
                    except sqlite3.Error as e:
                        raise ValueError("EXPORT_SQL_LOCAL_SQLITE_REPLAY_FAILED") from e
                    statements += 1
                if buffer.strip():
                    raise ValueError("EXPORT_SQL_INCOMPLETE_TRAILING_STATEMENT")
            if con.in_transaction:
                con.commit()
            if statements == 0:
                raise ValueError("EXPORT_SQL_NO_REPLAYABLE_STATEMENTS")
            con.set_authorizer(None)
            con.close()
            con = None
            after = (src.stat().st_size, src.stat().st_mtime_ns, digest_file(src))
            if before != after:
                raise ValueError("ORIGINAL_EXPORT_SQL_CHANGED_DURING_RESTORE")
            # Never upload raw SQL or restored SQLite to GitHub artifacts.
            result = verify_isolated_sqlite(target)
            return {
                "schemaVersion": VERSION,
                "state": "OFFLINE_SQL_RESTORED_LOGICAL_CONSISTENCY_ONLY",
                "originalSqlFileSizeBytes": before[0],
                "originalSqlSha256": before[2],
                "replayedStatementCount": statements,
                "localRestore": result,
                "actualSourceD1SqlReads": 0,
                "actualDestinationD1RowsCopied": 0,
                "originalCloudflareExportReceiptAuthenticated": False,
                "actualSourceD1PhysicalBackupAccepted": False,
                "pitPhysicallyAccepted": False,
                "frozenPhysicallyAccepted": False,
                "permissionToImport": False,
                "shadowAuthorized": False,
                "independentAuditRequired": True,
            }
        finally:
            if con is not None:
                con.close()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sql", required=True, help="existing local Cloudflare D1 SQL export file")
    args = parser.parse_args()
    try:
        print(json.dumps(replay_offline_sql(args.sql), sort_keys=True, indent=2))
    except (ValueError, sqlite3.Error, OSError, UnicodeError) as e:
        # Do not echo paths, raw contents, tokens, signed export URL or private data.
        msg = str(e) if isinstance(e, ValueError) else "OFFLINE_RESTORE_INPUT_OR_SQLITE_ERROR"
        print(json.dumps({"schemaVersion": VERSION, "state": "OFFLINE_RESTORE_DEFER",
                          "blocker": msg, "permissionToImport": False,
                          "shadowAuthorized": False}))
        raise SystemExit(2)


if __name__ == "__main__":
    main()
