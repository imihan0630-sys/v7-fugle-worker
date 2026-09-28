import assert from "node:assert/strict";
import {
  compareOfficialDisclosureSnapshots,
  normalizeOfficialDisclosureSnapshot,
  normalizeRocTimestamp,
} from "../research/d17_disclosure_snapshot_observer_v0_1.mjs";

assert.equal(normalizeRocTimestamp("1150927", "70004"), "2026-09-27T07:00:04+08:00");
assert.equal(normalizeRocTimestamp("1150230", "120000"), null);
assert.equal(normalizeRocTimestamp("1150927", "246000"), null);

const twseRow = {
  "出表日期": "1150928",
  "發言日期": "1150927",
  "發言時間": "70004",
  "公司代號": "6949",
  "公司名稱": "測試公司",
  "主旨 ": "公告期間內重複揭露",
  "符合條款": "第51款",
  "事實發生日": "1150713",
  "說明": "同一經濟事件可能每日重刊，不等於每日新事件。",
};

const first = normalizeOfficialDisclosureSnapshot("TWSE", [twseRow], "2026-09-28T13:34:02Z");
const repeated = normalizeOfficialDisclosureSnapshot("TWSE", [twseRow], "2026-09-28T13:34:57Z");
assert.equal(first.items[0].publishedAtSource, "2026-09-27T07:00:04+08:00");
assert.equal(first.items[0].firstKnownAtConservative, "2026-09-28T13:34:02.000Z");
assert.equal(first.items[0].providerItemId, null);
assert.equal(first.items[0].revisionLinkQuality, "NO_NATIVE_PROVIDER_ITEM_OR_SUPERSESSION_ID");
assert.equal(first.items[0].derivedIdentitySha256, repeated.items[0].derivedIdentitySha256);
assert.equal(first.items[0].contentSha256, repeated.items[0].contentSha256, "capture time must not masquerade as a source-content change");
assert.notEqual(first.items[0].recordVersionSha256, repeated.items[0].recordVersionSha256, "each append-only capture record remains distinct");

const stableDiff = compareOfficialDisclosureSnapshots(first, repeated);
assert.equal(stableDiff.unchangedCount, 1);
assert.deepEqual(stableDiff.addedDerivedIdentities, []);
assert.deepEqual(stableDiff.removedDerivedIdentities, []);
assert.equal(stableDiff.contentChangedDerivedIdentities.length, 0);
assert.equal(stableDiff.revisionIncidenceState, "NO_CHANGE_OBSERVED_IN_BOUNDED_INTERVAL");
assert.equal(stableDiff.correctionChainProvable, false);

const updated = normalizeOfficialDisclosureSnapshot(
  "TWSE",
  [{ ...twseRow, "說明": "新增數字，但來源沒有修正鏈 ID。" }],
  "2026-09-28T13:35:57Z",
);
const updateDiff = compareOfficialDisclosureSnapshots(repeated, updated);
assert.equal(updateDiff.contentChangedDerivedIdentities.length, 1);
assert.equal(updateDiff.revisionIncidenceState, "CHANGE_OBSERVED_REVISION_CAUSE_UNPROVEN");

const tpex = normalizeOfficialDisclosureSnapshot(
  "TPEX",
  [{
    Date: "1150928",
    "發言日期": "1150927",
    "發言時間": "165242",
    SecuritiesCompanyCode: "8472",
    CompanyName: "測試上櫃公司",
    "主旨": "重大訊息",
    "符合條款": "第53款",
    "事實發生日": "1150926",
    "說明": "來源欄位映射測試",
  }],
  "2026-09-28T13:36:57Z",
);
assert.equal(tpex.items[0].symbol, "8472");
assert.equal(tpex.items[0].publishedAtSource, "2026-09-27T16:52:42+08:00");

console.log("D17 disclosure snapshot observer tests passed");
