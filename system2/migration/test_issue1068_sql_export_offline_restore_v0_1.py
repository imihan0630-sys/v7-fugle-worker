#!/usr/bin/env python3
"""Synthetic SQL-only rejection and replay tests; never calls Cloudflare."""
import tempfile
import unittest
from pathlib import Path
from issue1068_sql_export_offline_restore_v0_1 import replay_offline_sql

BASE = """PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE s2_schema_meta (schema_key TEXT, schema_value TEXT);
INSERT INTO s2_schema_meta VALUES ('schema_version', '1.1');
CREATE TABLE s2_decisions (id INTEGER, payload TEXT, raw BLOB);
INSERT INTO s2_decisions VALUES (1, 'good; valid', X'00FF');
INSERT INTO s2_decisions VALUES (2, NULL, X'');
CREATE INDEX s2_ix ON s2_decisions(id);
COMMIT;
"""


class SQLRestoreTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.dir = Path(self.temp.name)

    def write(self, source, filename="source.sql"):
        p = self.dir / filename
        p.write_text(source, encoding="utf-8")
        return p

    def test_realistic_source_sql_is_restored_locally_only(self):
        result = replay_offline_sql(self.write(BASE))
        self.assertEqual(result["state"], "OFFLINE_SQL_RESTORED_LOGICAL_CONSISTENCY_ONLY")
        self.assertEqual(result["localRestore"]["totalRows"], 4)
        self.assertEqual(result["localRestore"]["tableCount"], 2)
        self.assertEqual(result["replayedStatementCount"], 9)
        self.assertFalse(result["originalCloudflareExportReceiptAuthenticated"])
        self.assertFalse(result["actualSourceD1PhysicalBackupAccepted"])
        self.assertFalse(result["permissionToImport"])
        self.assertFalse(result["shadowAuthorized"])

    def test_comments_and_quoted_semicolon_are_safe(self):
        data = "-- Synthetic source\n\n" + BASE.replace("'good; valid'", "'text; with ''quotes'' and newlines'")
        self.assertEqual(replay_offline_sql(self.write(data))["localRestore"]["totalRows"], 4)

    def test_update_is_denied(self):
        with self.assertRaisesRegex(ValueError, "UNSAFE"):
            replay_offline_sql(self.write(BASE.replace("COMMIT;", "UPDATE s2_decisions SET payload='x';\nCOMMIT;")))

    def test_drop_is_denied(self):
        with self.assertRaisesRegex(ValueError, "UNSAFE"):
            replay_offline_sql(self.write(BASE.replace("COMMIT;", "DROP TABLE s2_decisions;\nCOMMIT;")))

    def test_attach_file_is_denied(self):
        with self.assertRaisesRegex(ValueError, "UNSAFE"):
            replay_offline_sql(self.write(BASE.replace("COMMIT;", "ATTACH DATABASE '/tmp/leak.sqlite' AS x;\nCOMMIT;")))

    def test_extra_pragma_is_denied(self):
        with self.assertRaisesRegex(ValueError, "UNSAFE"):
            replay_offline_sql(self.write(BASE.replace("COMMIT;", "PRAGMA writable_schema=ON;\nCOMMIT;")))

    def test_create_trigger_is_denied(self):
        with self.assertRaisesRegex(ValueError, "UNSAFE"):
            replay_offline_sql(self.write(BASE.replace("COMMIT;", "CREATE TRIGGER t AFTER INSERT ON s2_decisions BEGIN SELECT 1; END;\nCOMMIT;")))

    def test_vacuum_into_is_denied(self):
        with self.assertRaisesRegex(ValueError, "UNSAFE"):
            replay_offline_sql(self.write(BASE.replace("COMMIT;", "VACUUM INTO '/tmp/out.db';\nCOMMIT;")))

    def test_missing_mandatory_frozen_table_is_denied(self):
        data = BASE.replace("CREATE TABLE s2_decisions", "CREATE TABLE s2_misc").replace(
            "INSERT INTO s2_decisions", "INSERT INTO s2_misc").replace(
            "ON s2_decisions", "ON s2_misc")
        with self.assertRaisesRegex(ValueError, "REQUIRED_SOURCE"):
            replay_offline_sql(self.write(data))

    def test_symlink_source_is_denied(self):
        p = self.write(BASE)
        link = self.dir / "source_link.sql"
        link.symlink_to(p)
        with self.assertRaisesRegex(ValueError, "SYMLINK"):
            replay_offline_sql(link)

    def test_empty_source_is_denied(self):
        with self.assertRaisesRegex(ValueError, "NONEMPTY"):
            replay_offline_sql(self.write(""))

    def test_incomplete_source_is_denied(self):
        with self.assertRaisesRegex(ValueError, "INCOMPLETE"):
            replay_offline_sql(self.write("CREATE TABLE s2_decisions (id INTEGER"))

    def test_unexpected_single_line_multi_statement_fails_closed(self):
        with self.assertRaisesRegex(ValueError, "LOCAL_SQLITE_REPLAY_FAILED"):
            replay_offline_sql(self.write(BASE.replace(
                "CREATE INDEX s2_ix ON s2_decisions(id);\nCOMMIT;",
                "CREATE INDEX s2_ix ON s2_decisions(id); COMMIT;")))

    def test_unsupported_fts_virtual_table_is_denied(self):
        with self.assertRaisesRegex(ValueError, "UNSAFE"):
            replay_offline_sql(self.write(BASE.replace(
                "COMMIT;", "CREATE VIRTUAL TABLE s2_fts USING fts5(t);\nCOMMIT;")))


if __name__ == "__main__":
    unittest.main(verbosity=2)
