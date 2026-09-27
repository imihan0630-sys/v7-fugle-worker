// Research-only capture-generation helper.
// Zero market calls. Zero D1 writes.

export const CAPTURE_GENERATION_CONTRACT_VERSION = "CAPTURE_GENERATION_V0_1";

export function normalizeGenerationUuid(uuid) {
  const text=String(uuid??"").trim().toLowerCase();
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(text)) {
    throw new Error("UUID_V4_REQUIRED");
  }
  return text;
}

export function createCaptureGenerationId(uuid) {
  return "G1_" + normalizeGenerationUuid(uuid);
}

export function buildCaptureGenerationSeed({
  scanDate,
  requestedDate,
  runMode,
  workerVersion,
  selectionRuleVersion,
  uuid,
  startedAt,
}) {
  const date=String(scanDate??"").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("INVALID_SCAN_DATE");
  const mode=String(runMode??"").trim().toUpperCase();
  if (!["LIVE","DRY_RUN"].includes(mode)) throw new Error("INVALID_RUN_MODE");
  const captureGeneration=createCaptureGenerationId(uuid);
  return Object.freeze({
    contractVersion:CAPTURE_GENERATION_CONTRACT_VERSION,
    captureGeneration,
    scanDate:date,
    requestedDate:String(requestedDate??date),
    runMode:mode,
    workerVersion:String(workerVersion??"").trim(),
    selectionRuleVersion:String(selectionRuleVersion??"").trim(),
    startedAt:String(startedAt??"").trim(),
    researchOnly:true,
    decisionImpact:false,
  });
}

export function sameCaptureGeneration(a,b) {
  return Boolean(a?.captureGeneration) &&
    a.captureGeneration===b?.captureGeneration &&
    a.scanDate===b?.scanDate &&
    a.runMode===b?.runMode;
}
