import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

const fixturePath = new URL("../../research/SYSTEM1_ISSUE1024_NATIVE_RECHECK_20261011_V0_1.json", import.meta.url);
const correctionPath = new URL("../../research/SYSTEM1_ISSUE1024_12_TIMESTAMP_CORRECTIONS_20261011_V0_1.json", import.meta.url);
const original = JSON.parse(readFileSync(fixturePath, "utf8"));
const receipt = JSON.parse(readFileSync(correctionPath, "utf8"));

test("Issue1024 preserves exactly twelve original run timestamp records and append-only corrections", () => {
  assert.equal(original.originalNativeMetadata.length, 12);
  assert.equal(receipt.correctedCount, 12);
  assert.equal(receipt.corrections.length, 12);
  assert.equal(new Set(receipt.corrections.map(x => x.runId)).size, 12);
  assert.equal(receipt.rawSourceMutated, false);
  assert.equal(receipt.productionChanges, false);
  assert.equal(receipt.physicalD1QueriesOrWrites, 0);
  assert.equal(receipt.perRunCostsQualified, false);
  assert.equal(receipt.readReserveAuthorized, false);
  assert.equal(receipt.writeReserveAuthorized, false);
  assert.equal(receipt.physicalP04Accepted, false);
});

test("all twelve corrected Taiwan timestamps preserve UTC instant, not UTC wall-clock", () => {
  const originalByRun = new Map(original.originalNativeMetadata.map(x => [x.runId, x]));
  for (const corrected of receipt.corrections) {
    const source = originalByRun.get(corrected.runId);
    assert.ok(source, "unknown run " + corrected.runId);
    assert.equal(corrected.sourceUtc, source.createdAtUtc);
    assert.equal(corrected.incorrectTaipei, source.createdAtTaipei);
    assert.equal(corrected.sourceField, "created_at");
    assert.equal(corrected.sourceHeadSha, source.headSha);
    assert.match(corrected.correctedTaipei, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+08:00$/);
    assert.equal(Date.parse(corrected.correctedTaipei), Date.parse(source.createdAtUtc));
    assert.equal(Date.parse(source.createdAtUtc) - Date.parse(source.createdAtTaipei), 8 * 3600 * 1000);
    assert.notEqual(corrected.correctedTaipei, source.createdAtTaipei);
    assert.equal(corrected.originalRunSnapshotPath, "research/issue1024-native-recheck-20261011/" + corrected.runId + "-run.json");
    const rawFile = new URL("../../" + corrected.originalRunSnapshotPath, import.meta.url);
    const bytes = readFileSync(rawFile);
    const sha = createHash("sha256").update(bytes).digest("hex");
    assert.equal(sha, corrected.originalRunSnapshotSha256, "raw Run JSON byte SHA256 mismatch " + corrected.runId);
    const actualRun = JSON.parse(bytes.toString("utf8"));
    assert.equal(actualRun.id, corrected.runId);
    assert.equal(actualRun.created_at, corrected.sourceUtc);
    assert.equal(actualRun.head_sha, corrected.sourceHeadSha);
    assert.equal(corrected.instantUnchanged, true);
  }
});

test("GitHub run creation instant is never substituted for job/artifact/market business clock", () => {
  assert.match(receipt.meaning, /not Job\.started_at/);
  assert.match(receipt.meaning, /not .*D1 Cron timestamp/);
  assert.match(receipt.meaning, /not .*trading date/);
  assert.equal(receipt.changeType, "APPEND_ONLY_ATTESTED_CORRECTION");
  assert.equal(receipt.algorithm.includes("Date.parse(correctedTaipei) === Date.parse(sourceUtc)"), true);
});
