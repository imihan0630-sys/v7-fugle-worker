export function resolveSystem2CaptureArm(env = {}) {
  const enabled = String(env.SYSTEM2_CAPTURE_ENABLED || "false").toLowerCase() === "true";
  const mode = String(env.SYSTEM2_CAPTURE_MODE || "LIMITED_PROSPECTIVE_SHADOW");
  const contractVersion = String(env.SYSTEM2_CAPTURE_CONTRACT_VERSION || "0.1");

  if (mode !== "LIMITED_PROSPECTIVE_SHADOW") {
    throw new Error("unsupported SYSTEM2_CAPTURE_MODE");
  }
  if (contractVersion !== "0.1") {
    throw new Error("unsupported SYSTEM2_CAPTURE_CONTRACT_VERSION");
  }

  return Object.freeze({
    enabled,
    mode,
    contractVersion,
    scheduledCaptureAllowed: false,
    state: enabled
      ? "ARM_REQUESTED_BUT_SOURCE_ADAPTERS_NOT_CONFIGURED"
      : "CAPTURE_DISABLED",
  });
}

export function resolveSystem2ResonanceArm(env = {}) {
  const enabled = String(env.SYSTEM2_RESONANCE_ENABLED || "false").toLowerCase() === "true";
  const version = String(env.SYSTEM2_RESONANCE_CONTRACT_VERSION || "0.1");
  if (version !== "0.1") throw new Error("unsupported SYSTEM2_RESONANCE_CONTRACT_VERSION");
  return Object.freeze({
    enabled,
    version,
    maxUniqueSymbols: 9,
    mode: "BOUNDED_PRESELECTED_ONLY",
    fullMarketScan: false,
    notificationImpact: false,
    orderImpact: false,
    state: enabled ? "BOUNDED_RESONANCE_SCHEDULED" : "RESONANCE_DISABLED",
  });
}

export function buildSystem2HealthPayload({
  schemaVersion,
  env = {},
} = {}) {
  const arm = resolveSystem2CaptureArm(env);
  const resonance = resolveSystem2ResonanceArm(env);
  return Object.freeze({
    service: "system2-shadow-research",
    mode: "RESEARCH_ONLY",
    databaseBinding: "SYSTEM2_DB",
    schemaVersion: schemaVersion ?? "UNKNOWN",
    captureEnabledRequested: arm.enabled,
    scheduledCaptureAllowed: arm.scheduledCaptureAllowed,
    captureState: arm.state,
    captureContractVersion: arm.contractVersion,
    resonanceState: resonance.state,
    resonanceContractVersion: resonance.version,
    resonanceMaxUniqueSymbols: resonance.maxUniqueSymbols,
    resonanceFullMarketScan: resonance.fullMarketScan,
    fugleQuoteConfigured: Boolean(env.FUGLE_API_KEY),
    system1RuntimeUsed: false,
  });
}
