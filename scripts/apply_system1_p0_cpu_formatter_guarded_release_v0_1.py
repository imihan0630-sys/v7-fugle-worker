#!/usr/bin/env python3
"""System 1 P0 V8.20.2 CPU cache guarded release candidate.

Default is OFFLINE DRY RUN to artifacts/reviewonly/. No production Worker
modification. Only explicit --activate AND environment owner gate can modify
the transient canonical rebuilt Worker.js inside an independently reviewed
code-only deploy workflow. Does NOT deploy by itself.
"""
from __future__ import annotations
import argparse,hashlib,importlib.util,json,os,subprocess
from pathlib import Path

SOURCE=Path("Worker.js")
OUT=Path("artifacts/reviewonly/system1-p0-v8-20-2-cpu-guarded.mjs")
VERSION='const VERSION = "8.20.2-idempotent-d1-snapshots";'
SAFE_RUNTIME=[
    "const LIVE_STALE_SECONDS = 90;",
    "const need10 = minutesSinceOpen >= 11 && (minutesSinceOpen - 1) % 10 === 0;",
    "const need15 = minutesSinceOpen >= 16 && (minutesSinceOpen - 1) % 15 === 0;",
    "UPDATE v7_signal_delivery_state SET lease_token=NULL",
    "await acquireSignalStateLease(env,key)",
]
def digest(blob:str)->str:return hashlib.sha256(blob.encode("utf-8")).hexdigest()

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--activate",action="store_true",help="Requires explicit owner-gated release workflow")
    args=ap.parse_args()
    root=Path.cwd().resolve()
    if SOURCE.resolve()!=root/"Worker.js":raise SystemExit("P0_CANONICAL_WORKER_PATH_REQUIRED")
    source=SOURCE.read_text(encoding="utf-8")
    if source.count(VERSION)!=1:raise SystemExit("P0_CANONICAL_V8_20_2_VERSION_DRIFT")
    if any(x not in source for x in SAFE_RUNTIME):raise SystemExit("P0_PROTECTED_RUNTIME_CONTRACT_DRIFT")
    script=root/"scripts/apply_system1_p0_taipei_formatter_cpu_cache_reviewonly.py"
    spec=importlib.util.spec_from_file_location("s1_cache_review",script)
    if spec is None or spec.loader is None:raise SystemExit("P0_REVIEW_PATCH_NOT_AVAILABLE")
    mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod)
    candidate=mod.patch(source)
    if candidate.replace(mod.CLOCK_NEW,mod.CLOCK_OLD,1).replace(
            mod.DATE_NEW,mod.DATE_OLD,1)!=source:
        raise SystemExit("P0_CPU_PATCH_DIFFERENTIAL_WIDER_THAN_2_FORMATTERS")
    if candidate.count("S1_P0_TAIPEI_CLOCK_FORMATTER")!=2 or candidate.count(
            "S1_P0_TAIPEI_DATE_FORMATTER")!=2:
        raise SystemExit("P0_CPU_PATCH_INSERTIONS_NOT_EXACT")
    OUT.parent.mkdir(parents=True,exist_ok=True)
    OUT.write_text(candidate,encoding="utf-8")
    subprocess.run(["node","--check",str(OUT)],check=True)
    if SOURCE.read_text(encoding="utf-8")!=source:
        raise SystemExit("P0_WORKER_WAS_MUTATED_DURING_DRY_RUN")
    activated=False
    if args.activate:
        # Env gate must be supplied by a separately owner-reviewed workflow.
        if os.environ.get("SYSTEM1_P0_CPU_CODE_ONLY_ACTIVATION")!="EXPLICITLY_APPROVED":
            raise SystemExit("P0_PRODUCTION_ACTIVATION_OWNER_GATE_CLOSED")
        SOURCE.write_text(candidate,encoding="utf-8")
        activated=True
    proof={"schema":"SYSTEM1_P0_CPU_CACHE_GUARDED_RELEASE_V0_1",
       "candidate":"V8_20_2_TAIPEI_FORMATTER_CACHE_ONLY",
       "originalSha256":digest(source),"candidateSha256":digest(candidate),
       "twoExactFormatterReplacements":True,"fallbackWorkerByteIdentity":True,
       "v8VersionUnchanged":True,"formalABScoringUnchanged":True,
       "signalLeaseAnd15MinContractUnchanged":True,
       "quotes90sUnchanged":True,"originalFourCronsUnchanged":True,
       "noTradingSignalChanges":True,"cpuCostImprovementOnCloudflareNotYetVerified":True,
       "canonicalWorkerModified":activated,
       "cloudflareDeploymentPerformed":False}
    print("SYSTEM1_P0_CPU_CACHE_GUARDED_RELEASE="+json.dumps(proof,ensure_ascii=False))
if __name__=="__main__":main()
