import assert from "node:assert/strict";
import { readFile, rm } from "node:fs/promises";
import { runRequiredDependencyReadOnlyMeasurement } from "../scripts/measure_required_dependencies_readonly.mjs";

const output = "system2/artifacts/test-required-dependency.json";
const fixture = {
  reportVersion: "S2_REQUIRED_DEPENDENCY_OBSERVER_REPORT_V0_1",
  marketDate: "2026-09-28",
  prospectiveEvidenceEligible: false,
  safety: {
    httpMethods: ["GET"],
    externalMutationPerformed: false,
  },
};

const report = await runRequiredDependencyReadOnlyMeasurement({
  marketDate: "2026-09-28",
  outputPath: output,
  probe: async () => fixture,
});
assert.equal(report, fixture);
const disk = JSON.parse(await readFile(output, "utf8"));
assert.equal(disk.reportVersion, fixture.reportVersion);
await rm(output, { force: true });

await assert.rejects(
  () => runRequiredDependencyReadOnlyMeasurement({
    marketDate: "bad-date",
    probe: async () => fixture,
  }),
  /YYYY-MM-DD/,
);

console.log("System2 required dependency measurement tests passed");
