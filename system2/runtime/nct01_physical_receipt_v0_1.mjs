import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";
import { ncT01HiddenFallbackAuditReceiptViewV0_1 } from "./nct01_hidden_fallback_audit_v0_1.mjs";

export const NCT01_PHYSICAL_RECEIPT_VERSION_V0_1 = "0.1-RESEARCH";

const HASH64 = /^[a-f0-9]{64}$/;
const SOURCE_REF = /^([A-Z0-9_]+):([a-f0-9]{64})$/;

const REQUIRED_PASS_REF_TYPES = Object.freeze([
  "SYSTEM2_POLICY_FINGERPRINT_SHA256",
  "A1_BATCH_SHA256",
  "PIT_REPLAY_SHA256",
  "SOURCE_HISTORY_SHA256",
  "CONTINUITY_RECEIPT_SHA256",
  "CONTINUITY_TRANSFORM_SHA256",
  "FACTOR_SNAPSHOT_SHA256",
  "PERSISTENCE_BATCH_SHA256",
  "ORCHESTRATION_SHA256",
  "SHADOW_ACCOUNTING_SHA256",
  "HIDDEN_FALLBACK_AUDIT_SHA256",
]);

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function timestamp(value, field) {
  const text = requiredText(value, field);
  if (!Number.isFinite(Date.parse(text))) throw new Error(field + " must be an ISO timestamp");
  return new Date(text).toISOString();
}

function uniqueTexts(values, field, { allowEmpty = true } = {}) {
  if (!Array.isArray(values)) throw new Error(field + " must be an array");
  const out = values.map((value, index) => requiredText(String(value), field + "[" + index + "]"));
  if (!allowEmpty && !out.length) throw new Error(field + " must not be empty");
  if (new Set(out).size !== out.length) throw new Error(field + " contains duplicates");
  return Object.freeze(out);
}

function normalizeSourceGenerationRefs(values) {
  const refs = uniqueTexts(values, "sourceGenerationRefs", { allowEmpty: false });
  const parsed = refs.map((ref) => {
    const match = SOURCE_REF.exec(ref);
    if (!match) {
      throw new Error(
        "sourceGenerationRefs must use TYPE:sha256 typed digest format: " + ref,
      );
    }
    return { ref, type: match[1], digest: match[2] };
  });
  return {
    refs,
    parsed: Object.freeze(parsed.map((row) => deepFreeze(row))),
  };
}

function requiredPassRefGaps(parsed) {
  const observed = new Set(parsed.map((x) => x.type));
  return REQUIRED_PASS_REF_TYPES.filter((type) => !observed.has(type));
}

function deriveOutcome({
  system1Top6InputAvailable,
  system1RankInputAvailable,
  auditView,
  requiredInputsState,
  executionState,
  candidateGenerationExecutable,
  generatedCandidates,
  passRefGaps,
}) {
  const hidden =
    system1Top6InputAvailable === true ||
    system1RankInputAvailable === true ||
    auditView.hiddenDependencyPresent === true;

  if (hidden) {
    return {
      zeroPickDisposition: "DEPENDENCY_BLOCKED",
      resultClassification: "HIDDEN_SYSTEM1_DEPENDENCY",
    };
  }

  if (executionState === "RUNTIME_FAILURE") {
    return {
      zeroPickDisposition: "RUNTIME_FAILURE",
      resultClassification: "EVIDENCE_INCOMPLETE",
    };
  }
  if (executionState === "GLOBAL_PRIORITY_UNRESOLVED") {
    return {
      zeroPickDisposition: "CAPACITY_UNRESOLVED",
      resultClassification: "EVIDENCE_INCOMPLETE",
    };
  }
  if (
    auditView.auditState !== "CLEAN_PROVEN_ABSENT" ||
    auditView.staticComplete !== true ||
    auditView.runtimeComplete !== true ||
    !auditView.auditDigest
  ) {
    return {
      zeroPickDisposition: "DEPENDENCY_BLOCKED",
      resultClassification: "EVIDENCE_INCOMPLETE",
    };
  }
  if (requiredInputsState !== "READY") {
    return {
      zeroPickDisposition: "INPUT_INCOMPLETE",
      resultClassification: "EVIDENCE_INCOMPLETE",
    };
  }
  if (executionState !== "EXECUTED" || candidateGenerationExecutable !== true) {
    return {
      zeroPickDisposition: "DEPENDENCY_BLOCKED",
      resultClassification: "EVIDENCE_INCOMPLETE",
    };
  }
  if (passRefGaps.length) {
    return {
      zeroPickDisposition: generatedCandidates.length ? "NOT_ZERO_PICK" : "INPUT_INCOMPLETE",
      resultClassification: "EVIDENCE_INCOMPLETE",
    };
  }

  return {
    zeroPickDisposition: generatedCandidates.length
      ? "NOT_ZERO_PICK"
      : "LEGITIMATE_ZERO_PICK",
    resultClassification: "PHYSICALLY_INDEPENDENT_PATH_OBSERVED",
  };
}

export async function buildNcT01PhysicalIndependenceReceiptV0_1({
  receiptId,
  decisionAt,
  strategyId,
  strategyVersion,
  system1Top6InputAvailable = false,
  system1RankInputAvailable = false,
  hiddenFallbackAuditEvidence = null,
  sharedRawSourceRefs = [],
  candidateUniverseProvenance = [],
  requiredInputsState = "UNKNOWN",
  executionState = "BLOCKED_INPUTS",
  candidateGenerationExecutable = false,
  generatedCandidates = [],
  sourceGenerationRefs = [],
  generatedAt,
  notes = [],
} = {}) {
  const id = requiredText(receiptId, "receiptId");
  const decision = timestamp(decisionAt, "decisionAt");
  const generated = timestamp(generatedAt, "generatedAt");
  const strategy = requiredText(strategyId, "strategyId");
  const version = requiredText(strategyVersion, "strategyVersion");

  if (!["READY", "INCOMPLETE", "UNKNOWN"].includes(requiredInputsState)) {
    throw new Error("unsupported requiredInputsState");
  }
  if (!["EXECUTED", "BLOCKED_INPUTS", "RUNTIME_FAILURE", "GLOBAL_PRIORITY_UNRESOLVED"].includes(executionState)) {
    throw new Error("unsupported executionState");
  }

  const auditView = ncT01HiddenFallbackAuditReceiptViewV0_1(hiddenFallbackAuditEvidence);
  const rawRefs = uniqueTexts(sharedRawSourceRefs, "sharedRawSourceRefs");
  const universeRefs = uniqueTexts(
    candidateUniverseProvenance,
    "candidateUniverseProvenance",
    { allowEmpty: false },
  );
  const candidates = uniqueTexts(generatedCandidates, "generatedCandidates");
  const generation = normalizeSourceGenerationRefs(sourceGenerationRefs);
  const noteRows = uniqueTexts(notes, "notes");

  const passRefGaps = requiredPassRefGaps(generation.parsed);
  const outcome = deriveOutcome({
    system1Top6InputAvailable,
    system1RankInputAvailable,
    auditView,
    requiredInputsState,
    executionState,
    candidateGenerationExecutable,
    generatedCandidates: candidates,
    passRefGaps,
  });

  const base = {
    schemaVersion: "SDA022_NC_T01_RECEIPT_V0_1",
    receiptId: id,
    decisionAt: decision,
    strategyId: strategy,
    strategyVersion: version,
    system1Top6InputAvailable: system1Top6InputAvailable === true,
    system1RankInputAvailable: system1RankInputAvailable === true,
    hiddenFallbackAudit: auditView.hiddenFallbackAudit,
    sharedRawSourceRefs: rawRefs,
    candidateUniverseProvenance: universeRefs,
    requiredInputsState,
    executionState,
    candidateGenerationExecutable: candidateGenerationExecutable === true,
    zeroPickDisposition: outcome.zeroPickDisposition,
    generatedCandidates: candidates,
    sourceGenerationRefs: generation.refs,
    resultClassification: outcome.resultClassification,
    formalMutation: false,
    generatedAt: generated,
    notes: Object.freeze([
      ...noteRows,
      ...(passRefGaps.length
        ? ["MISSING_REQUIRED_TYPED_DIGESTS:" + passRefGaps.join(",")]
        : []),
    ]),
  };

  const receiptHash = await sha256Hex(base);
  return deepFreeze({
    ...base,
    receiptHash,
  });
}

function typedRef(type, digest) {
  const normalizedType = requiredText(type, "refType").toUpperCase();
  const normalizedDigest = requiredText(digest, "digest").toLowerCase();
  if (!/^[A-Z0-9_]+$/.test(normalizedType)) throw new Error("invalid ref type: " + normalizedType);
  if (!HASH64.test(normalizedDigest)) throw new Error("invalid sha256 digest for " + normalizedType);
  return normalizedType + ":" + normalizedDigest;
}

function factorHashForSymbol(orchestration, symbol) {
  const row = orchestration?.bundle?.factorRows?.find((x) => x.symbol === symbol);
  return row?.snapshot_hash || null;
}

export async function buildNcT01ReceiptFromOrchestrationV0_1({
  receiptId,
  orchestration,
  policyFingerprintReceipt,
  sharedRawSourceRefs = [],
  hiddenFallbackAuditEvidence = null,
  generatedAt,
  notes = [],
} = {}) {
  if (!orchestration || typeof orchestration !== "object") {
    throw new Error("orchestration is required");
  }
  if (!policyFingerprintReceipt || typeof policyFingerprintReceipt !== "object") {
    throw new Error("policyFingerprintReceipt is required");
  }
  const strategyId = requiredText(orchestration.strategyId, "orchestration.strategyId");
  const strategyVersion = requiredText(orchestration.strategyVersion, "orchestration.strategyVersion");
  if (policyFingerprintReceipt.strategyId !== strategyId) {
    throw new Error("policy fingerprint strategy mismatch");
  }
  if (policyFingerprintReceipt.strategyVersion !== strategyVersion) {
    throw new Error("policy fingerprint strategy version mismatch");
  }

  const diagnostics = Array.isArray(orchestration.perSymbolDiagnostics)
    ? orchestration.perSymbolDiagnostics
    : [];
  const terminalValidity = new Set(["VALID", "WEAKENING", "INVALIDATED"]);

  const continuityReadyWitnesses = diagnostics.filter((row) =>
    row?.state === "ACCOUNTED" &&
    row?.replayState === "READY" &&
    row?.continuityBindingState === "READY" &&
    Array.isArray(row?.continuityBlockerCodes) &&
    row.continuityBlockerCodes.length === 0,
  );
  const requiredEvidenceCompleteWitnesses = continuityReadyWitnesses.filter((row) =>
    row?.requiredEvidenceComplete === true &&
    Number(row?.missingRequiredEvidenceCount || 0) === 0,
  );
  const executableWitnesses = requiredEvidenceCompleteWitnesses.filter((row) =>
    terminalValidity.has(row?.strategyValidity) &&
    typeof row?.assessmentHash === "string" &&
    /^[a-f0-9]{64}$/.test(row.assessmentHash),
  );

  const continuityReadySymbols = continuityReadyWitnesses.map((x) => String(x.symbol)).sort();
  const requiredEvidenceCompleteSymbols = requiredEvidenceCompleteWitnesses.map((x) => String(x.symbol)).sort();
  const executableWitnessSymbols = executableWitnesses.map((x) => String(x.symbol)).sort();
  const executableWitnessSet = new Set(executableWitnessSymbols);

  const decisions = Array.isArray(orchestration.bundle?.decisionSnapshots)
    ? orchestration.bundle.decisionSnapshots
    : [];
  const generatedCandidates = decisions
    .filter((x) =>
      x?.evaluation?.state === "QUALIFIED_NOT_SELECTED" &&
      executableWitnessSet.has(String(x.evaluation.symbol))
    )
    .map((x) => String(x.evaluation.symbol))
    .sort();

  const runComplete = orchestration.bundle?.runReceipt?.runState === "COMPLETE";
  const accountingHash = orchestration.bundle?.fingerprint?.shadowAccountingHash || null;
  const persistenceBatchHash = orchestration.bundle?.persistenceBatch?.batchHash || null;

  const sourceGenerationRefs = [];
  const add = (type, digest) => {
    if (digest) sourceGenerationRefs.push(typedRef(type, digest));
  };
  const auditView = ncT01HiddenFallbackAuditReceiptViewV0_1(hiddenFallbackAuditEvidence);
  add("SYSTEM2_POLICY_FINGERPRINT_SHA256", policyFingerprintReceipt.fingerprintHash);
  add("A1_BATCH_SHA256", orchestration.a1BatchHash);
  add("HIDDEN_FALLBACK_AUDIT_SHA256", auditView.auditDigest);
  for (const witness of executableWitnesses) {
    add("PIT_REPLAY_SHA256", witness.replayHash);
    add("SOURCE_HISTORY_SHA256", witness.sourceHistoryHash);
    add("CONTINUITY_RECEIPT_SHA256", witness.continuityReceiptHash);
    add("CONTINUITY_TRANSFORM_SHA256", witness.continuityTransformHash);
    add("FACTOR_SNAPSHOT_SHA256", factorHashForSymbol(orchestration, witness.symbol));
    add("ASSESSMENT_SHA256", witness.assessmentHash);
  }
  add("PERSISTENCE_BATCH_SHA256", persistenceBatchHash);
  add("ORCHESTRATION_SHA256", orchestration.orchestrationHash);
  add("SHADOW_ACCOUNTING_SHA256", accountingHash);

  const uniqueGenerationRefs = [...new Set(sourceGenerationRefs)];
  const baseUniverseCount = Number(orchestration.baseUniverseCount || 0);
  const accountedCount = Number(orchestration.accountedCount || 0);
  const incompleteCount = diagnostics.filter((row) =>
    row?.state === "ACCOUNTED" && row?.strategyValidity === "INCOMPLETE"
  ).length;

  const validityCounts = Object.fromEntries(
    ["VALID", "WEAKENING", "INVALIDATED"].map((state) => [
      state,
      executableWitnesses.filter((row) => row.strategyValidity === state).length,
    ]),
  );

  const candidateUniverseProvenance = [
    "UNIVERSE_VERSION:" + requiredText(
      orchestration.bundle?.runReceipt?.universeVersion,
      "orchestration.bundle.runReceipt.universeVersion",
    ),
    "BASE_UNIVERSE_COUNT:" + baseUniverseCount,
    "ACCOUNTED_COUNT:" + accountedCount,
    "CONTINUITY_READY_WITNESS_COUNT:" + continuityReadySymbols.length,
    "REQUIRED_EVIDENCE_COMPLETE_WITNESS_COUNT:" + requiredEvidenceCompleteSymbols.length,
    "STRATEGY_EXECUTABLE_WITNESS_COUNT:" + executableWitnessSymbols.length,
    "STRATEGY_EXECUTABLE_VALID_COUNT:" + validityCounts.VALID,
    "STRATEGY_EXECUTABLE_WEAKENING_COUNT:" + validityCounts.WEAKENING,
    "STRATEGY_EXECUTABLE_INVALIDATED_COUNT:" + validityCounts.INVALIDATED,
    "SYMBOL_LOCAL_INCOMPLETE_COUNT:" + incompleteCount,
    "W0_CONTINUITY_READY_SYMBOLS:" + (continuityReadySymbols.join(",") || "NONE"),
    "W1_STRATEGY_EXECUTABLE_SYMBOLS:" + (executableWitnessSymbols.join(",") || "NONE"),
    typedRef("A1_BATCH_SHA256", orchestration.a1BatchHash),
    typedRef("SHADOW_ACCOUNTING_SHA256", accountingHash),
    ...(auditView.auditDigest
      ? [typedRef("HIDDEN_FALLBACK_AUDIT_SHA256", auditView.auditDigest)]
      : []),
  ];

  const requiredInputsState =
    runComplete &&
    baseUniverseCount > 0 &&
    accountedCount === Number(orchestration.eligibleCount || 0) &&
    executableWitnessSymbols.length > 0
      ? "READY"
      : "INCOMPLETE";
  const executionState =
    runComplete && executableWitnessSymbols.length > 0
      ? "EXECUTED"
      : "BLOCKED_INPUTS";

  return buildNcT01PhysicalIndependenceReceiptV0_1({
    receiptId,
    decisionAt: orchestration.decisionTimestamp,
    strategyId,
    strategyVersion,
    system1Top6InputAvailable: false,
    system1RankInputAvailable: false,
    hiddenFallbackAuditEvidence,
    sharedRawSourceRefs,
    candidateUniverseProvenance,
    requiredInputsState,
    executionState,
    candidateGenerationExecutable: executionState === "EXECUTED",
    generatedCandidates,
    sourceGenerationRefs: uniqueGenerationRefs,
    generatedAt,
    notes: [
      ...notes,
      "FINAL_SELECTION_DISABLED",
      "LIVE_PUSH_DISABLED",
      "CAPITAL_AND_ORDER_AUTHORITY_DISABLED",
      "UNCERTIFIED_SYMBOLS_REMAIN_DENOMINATOR_ACCOUNTED",
    ],
  });
}

export function nct01RequiredPassRefTypesV0_1() {
  return REQUIRED_PASS_REF_TYPES;
}
