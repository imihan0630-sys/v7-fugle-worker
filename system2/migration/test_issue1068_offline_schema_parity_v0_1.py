#!/usr/bin/env python3
"""DATA_LANE isolated SQLite schema parity tests: no source/dest Cloudflare I/O."""
import sqlite3
import tempfile
import unittest
from pathlib import Path
from issue1068_offline_schema_parity_v0_1 import assess_local_parity


def fixture(path, *, extra_table=False, missing_table=False, different_type=False,
            stronger_unique=False, renamed_index=False, extra_column=False,
            foreign_key=False, unexpected_non_s2=False):
    with sqlite3.connect(path) as con:
        con.execute("CREATE TABLE s2_schema_meta (schema_key TEXT PRIMARY KEY, schema_value TEXT NOT NULL)")
        con.execute("INSERT INTO s2_schema_meta VALUES('schema_version','1.1')")
        if not missing_table:
            ty = "INTEGER" if different_type else "TEXT"
            col = ", note TEXT" if extra_column else ""
            con.execute("CREATE TABLE s2_decisions (decision_id " + ty +
                        ", payload TEXT NOT NULL" + col + ")")
            con.execute("CREATE " + ("UNIQUE " if stronger_unique else "") +
                        "INDEX " + ("other_index_name" if renamed_index else "s2_id_ix") +
                        " ON s2_decisions(decision_id)")
        if extra_table:
            con.execute("CREATE TABLE s2_unshared_extra (value INTEGER)")
        if foreign_key:
            con.execute("CREATE TABLE s2_parent (id INTEGER PRIMARY KEY)")
            con.execute("CREATE TABLE s2_child (parent_id INTEGER REFERENCES s2_parent(id))")
        if unexpected_non_s2:
            con.execute("CREATE TABLE v7_business_table (v TEXT)")


class ParityTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.src = self.root / "source.sqlite"
        self.dst = self.root / "dest.sqlite"

    def make(self, **options):
        src_opt = options.pop("source", {})
        dst_opt = options.pop("dest", {})
        fixture(self.src, **src_opt)
        fixture(self.dst, **dst_opt)
        return assess_local_parity(self.src, self.dst)

    def test_identical_schema_is_local_only(self):
        x = self.make()
        self.assertEqual(x["status"], "OFFLINE_SCHEMA_SHAPE_MATCH_ONLY")
        self.assertEqual(x["sameShapeTableCount"], 2)
        self.assertEqual(x["blockers"], [])
        self.assertFalse(x["permissionToImport"])
        self.assertFalse(x["physicalSourceExportAuthenticated"])
        self.assertFalse(x["shadowAuthorized"])

    def test_extra_target_s2_table_does_not_falsify_matching_prefix(self):
        x = self.make(dest={"extra_table": True})
        self.assertEqual(x["destinationExtraTablesNotInSource"], ["s2_unshared_extra"])
        self.assertEqual(x["status"], "OFFLINE_SCHEMA_SHAPE_MATCH_ONLY")
        self.assertFalse(x["permissionToImport"])

    def test_missing_source_table_on_target_blocks(self):
        x = self.make(source={"extra_table": True})
        self.assertIn("SOURCE_TABLES_ABSENT_FROM_EXISTING_TARGET_SCHEMA", x["blockers"])
        self.assertEqual(x["sourceTablesAbsentInDestination"], ["s2_unshared_extra"])

    def test_missing_frozen_table_blocks(self):
        x = self.make(source={"missing_table": True})
        self.assertIn("FROZEN_DECISION_TABLE_MISSING", x["blockers"])

    def test_declared_type_mismatch_blocks(self):
        x = self.make(dest={"different_type": True})
        self.assertIn("s2_decisions", x["incompatibleSourceTableNames"])

    def test_stronger_target_unique_index_blocks(self):
        x = self.make(dest={"stronger_unique": True})
        self.assertIn("SOURCE_DESTINATION_TABLE_COLUMN_INDEX_OR_FK_MISMATCH", x["blockers"])

    def test_secondary_index_name_does_not_affect_structure(self):
        x = self.make(dest={"renamed_index": True})
        self.assertEqual(x["status"], "OFFLINE_SCHEMA_SHAPE_MATCH_ONLY")

    def test_target_extra_column_blocks(self):
        x = self.make(dest={"extra_column": True})
        self.assertIn("s2_decisions", x["incompatibleSourceTableNames"])

    def test_source_non_s2_app_table_blocks(self):
        x = self.make(source={"unexpected_non_s2": True})
        self.assertIn("SOURCE_NON_S2_APPLICATION_TABLE_PRESENT", x["blockers"])

    def test_source_and_destination_must_not_be_same_file(self):
        fixture(self.src)
        with self.assertRaisesRegex(ValueError, "SEPARATE"):
            assess_local_parity(self.src, self.src)

    def test_corrupt_target_file_denied(self):
        fixture(self.src)
        self.dst.write_bytes(b"not SQLite")
        with self.assertRaises(sqlite3.DatabaseError):
            assess_local_parity(self.src, self.dst)

    def test_symlink_target_denied(self):
        fixture(self.src)
        self.dst.symlink_to(self.src)
        with self.assertRaisesRegex(ValueError, "SYMLINK"):
            assess_local_parity(self.src, self.dst)


if __name__ == "__main__":
    unittest.main(verbosity=2)
