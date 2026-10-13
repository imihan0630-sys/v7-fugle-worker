#!/usr/bin/env python3
"""Isolated fixture-only tests for Issue #1068 offline SQLite integrity tool."""
from pathlib import Path
import importlib.util
import sqlite3
import tempfile
import unittest

SPEC = importlib.util.spec_from_file_location(
    "issue1068_sqlite_offline_integrity_v0_1",
    Path(__file__).with_name("issue1068_sqlite_offline_integrity_v0_1.py"),
)
mod = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(mod)


def make_db(path, order=(1, 2), add_index=False, foreign_key=False):
    with sqlite3.connect(path) as db:
        db.execute("CREATE TABLE s2_schema_meta (schema_key TEXT, schema_value TEXT)")
        db.execute("INSERT INTO s2_schema_meta VALUES ('schema_version','1.1')")
        db.execute("CREATE TABLE s2_decisions (decision_id INTEGER, "
                   "text_value TEXT, original_value BLOB, value REAL)")
        for n in order:
            db.execute("INSERT INTO s2_decisions VALUES (?,?,?,?)",
                       (n, "snapshot-%s" % n, bytes([n, 0]), n + 0.25))
        if add_index:
            db.execute("CREATE INDEX idx_decision_id ON s2_decisions(decision_id)")
        if foreign_key:
            db.execute("CREATE TABLE s2_fk_parent (id INTEGER PRIMARY KEY)")
            db.execute("CREATE TABLE s2_fk_child (parent_id INTEGER REFERENCES s2_fk_parent(id))")
            db.execute("INSERT INTO s2_fk_child VALUES (999)")


class DigestTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)

    def path(self, name):
        return self.root / name

    def test_same_logical_rows_different_insertion_order(self):
        a, b = self.path("a.sqlite"), self.path("b.sqlite")
        make_db(a, (1, 2))
        make_db(b, (2, 1))
        ra, rb = mod.verify_isolated_sqlite(a), mod.verify_isolated_sqlite(b)
        self.assertEqual(ra["allTableContentSha256"], rb["allTableContentSha256"])
        self.assertEqual(ra["schemaSha256"], rb["schemaSha256"])
        self.assertEqual(ra["tableCount"], 2)
        self.assertEqual(ra["totalRows"], 3)
        self.assertFalse(ra["permissionToImport"])
        self.assertFalse(ra["shadowAuthorized"])
        self.assertFalse(ra["sourceD1BackupPhysicallyAccepted"])

    def test_one_original_byte_change_is_detected(self):
        a, b = self.path("a.sqlite"), self.path("b.sqlite")
        make_db(a)
        make_db(b)
        with sqlite3.connect(b) as db:
            db.execute("UPDATE s2_decisions SET original_value=? WHERE decision_id=1",
                       (b"\x01\x01",))
        self.assertNotEqual(mod.verify_isolated_sqlite(a)["allTableContentSha256"],
                            mod.verify_isolated_sqlite(b)["allTableContentSha256"])

    def test_duplicate_row_changes_multiset_digest(self):
        a, b = self.path("a.sqlite"), self.path("b.sqlite")
        make_db(a)
        make_db(b)
        with sqlite3.connect(b) as db:
            db.execute("INSERT INTO s2_decisions SELECT * FROM s2_decisions WHERE decision_id=1")
        self.assertNotEqual(mod.verify_isolated_sqlite(a)["allTableContentSha256"],
                            mod.verify_isolated_sqlite(b)["allTableContentSha256"])

    def test_index_schema_change_is_detected(self):
        a, b = self.path("a.sqlite"), self.path("b.sqlite")
        make_db(a)
        make_db(b, add_index=True)
        ra, rb = mod.verify_isolated_sqlite(a), mod.verify_isolated_sqlite(b)
        self.assertNotEqual(ra["schemaSha256"], rb["schemaSha256"])
        self.assertNotEqual(ra["allTableContentSha256"], rb["allTableContentSha256"])

    def test_null_text_blob_integer_float_have_distinct_frames(self):
        vals = [None, "", b"", 1, 1.0, b"1", "1"]
        self.assertEqual(len(set(mod.enc(x) for x in vals)), len(vals))

    def test_wal_sidecar_is_hard_block(self):
        p = self.path("backup.sqlite")
        make_db(p)
        Path(str(p) + "-wal").write_bytes(b"unverified wal")
        with self.assertRaisesRegex(ValueError, "SIDECAR"):
            mod.verify_isolated_sqlite(p)

    def test_symlink_is_hard_block(self):
        p = self.path("backup.sqlite")
        make_db(p)
        link = self.path("link.sqlite")
        link.symlink_to(p)
        with self.assertRaisesRegex(ValueError, "SYMLINK"):
            mod.verify_isolated_sqlite(link)

    def test_foreign_key_inconsistency_is_hard_block(self):
        p = self.path("backup.sqlite")
        make_db(p, foreign_key=True)
        with self.assertRaisesRegex(ValueError, "FOREIGN_KEY"):
            mod.verify_isolated_sqlite(p)

    def test_missing_system2_required_table_is_hard_block(self):
        p = self.path("backup.sqlite")
        with sqlite3.connect(p) as db:
            db.execute("CREATE TABLE s2_schema_meta (v INTEGER)")
        with self.assertRaisesRegex(ValueError, "REQUIRED_SOURCE"):
            mod.verify_isolated_sqlite(p)

    def test_garbage_bytes_are_not_a_sqlite_backup(self):
        p = self.path("garbage.sqlite")
        p.write_bytes(b"not a database")
        with self.assertRaises(sqlite3.DatabaseError):
            mod.verify_isolated_sqlite(p)

    def test_no_file_is_never_treated_as_empty_success(self):
        with self.assertRaisesRegex(ValueError, "MISSING"):
            mod.verify_isolated_sqlite(self.path("missing.sqlite"))


if __name__ == "__main__":
    unittest.main(verbosity=2)
