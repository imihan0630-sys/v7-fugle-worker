import assert from "node:assert/strict";
import {
  assessOfficialContinuityRevisionSourceV0_1,
  buildOfficialContinuityRevisionCoverageReceiptV0_1,
  officialContinuityRevisionRequiredLanesV0_1,
} from "../runtime/official_continuity_revision_coverage_v0_1.mjs";

const startDate = "2026-04-05";
const endDate = "2026-10-02";
const generatedAt = "2026-10-03T16:00:00.000Z";
const lanes = officialContinuityRevisionRequiredLanesV0_1();

const assessments = Object.keys(lanes).map((sourceId) =>
  assessOfficialContinuityRevisionSourceV0_1({
    sourceId,
    parserComplete: true,
    responseRangeVerified: true,
    fieldNames: ["日期", "股票代號", "更正日期"],
    eventCount: 2,
    historicalFirstKnownUnknownCount: 2,
  })
);

assert.equal(assessments.length, 6);
assert.equal(assessments[0].finalResultRangeReady, true);
assert.equal(assessments[0].revisionHintFieldObserved, true);
assert.equal(assessments[0].historicalVersionArchiveComplete, false);
assert.equal(assessments[0].revisionCoverageComplete, false);

const finalOnly = buildOfficialContinuityRevisionCoverageReceiptV0_1({
  startDate,
  endDate,
  sourceAssessments: assessments,
  supplementalChannels: [],
  generatedAt,
});
assert.equal(finalOnly.requiredLaneCount, 6);
assert.equal(finalOnly.finalResultReadyCount, 6);
assert.equal(finalOnly.supplementalRevisionReadyCount, 0);
assert.equal(finalOnly.revisionCoverageComplete, false);
assert.equal(finalOnly.noEventMayBeClaimed, false);
assert.equal(finalOnly.technicalContinuityCertified, false);
assert.ok(
  finalOnly.laneResults.every((x) =>
    x.blockers.includes("SUPPLEMENTAL_REVISION_HISTORY_CHANNEL_INCOMPLETE")
  )
);

const completeChannels = Object.entries(lanes).map(([sourceId, lane]) => ({
  channelId: "fixture-" + sourceId,
  exchange: lane.exchange,
  actionFamilyId: lane.actionFamilyId,
  channelType: "REVISION_CORRECTION_CANCELLATION_HISTORY",
  coverageState: "COMPLETE",
  requestedStartDate: startDate,
  requestedEndDate: endDate,
  responseRangeVerified: true,
  parserComplete: true,
  immutableVersionsPreserved: true,
  knownAtVersionClockCovered: true,
  correctionHistoryComplete: true,
  cancellationHistoryComplete: true,
  missingSourceDates: [],
}));

const complete = buildOfficialContinuityRevisionCoverageReceiptV0_1({
  startDate,
  endDate,
  sourceAssessments: assessments,
  supplementalChannels: completeChannels,
  generatedAt,
});
assert.equal(complete.supplementalRevisionReadyCount, 6);
assert.equal(complete.revisionCoverageComplete, true);
assert.equal(complete.noEventMayBeClaimed, false);
assert.equal(complete.selectionAuthority, false);

const broken = completeChannels.map((x) => ({ ...x }));
broken[0] = { ...broken[0], cancellationHistoryComplete: false };
const incomplete = buildOfficialContinuityRevisionCoverageReceiptV0_1({
  startDate,
  endDate,
  sourceAssessments: assessments,
  supplementalChannels: broken,
  generatedAt,
});
assert.equal(incomplete.revisionCoverageComplete, false);
assert.equal(incomplete.supplementalRevisionReadyCount, 5);

const badRange = completeChannels.map((x) => ({ ...x }));
badRange[2] = { ...badRange[2], requestedStartDate: "2026-04-06" };
const rangeIncomplete = buildOfficialContinuityRevisionCoverageReceiptV0_1({
  startDate,
  endDate,
  sourceAssessments: assessments,
  supplementalChannels: badRange,
  generatedAt,
});
assert.equal(rangeIncomplete.revisionCoverageComplete, false);

await assert.rejects(
  async () => assessOfficialContinuityRevisionSourceV0_1({
    sourceId: "UNSUPPORTED",
    parserComplete: true,
    responseRangeVerified: true,
  }),
  /unsupported historical sourceId/,
);

console.log("System2 official continuity revision coverage tests passed");
