#!/usr/bin/env python3
"""Build a REVIEW-ONLY V8 Worker CPU candidate. Never write production Worker.js."""
from __future__ import annotations
import argparse
from pathlib import Path
import hashlib
import json

CLOCK_OLD = '''function taiwanClock(value = Date.now()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Taipei", hour: "2-digit", minute: "2-digit", hour12: false
  }).formatToParts(new Date(value));'''
CLOCK_NEW = '''const S1_P0_TAIPEI_CLOCK_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Taipei", hour: "2-digit", minute: "2-digit", hour12: false
});
function taiwanClock(value = Date.now()) {
  const parts = S1_P0_TAIPEI_CLOCK_FORMATTER.formatToParts(new Date(value));'''
DATE_OLD = '''function taiwanDate(value = Date.now()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(new Date(value));'''
DATE_NEW = '''const S1_P0_TAIPEI_DATE_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Taipei", year: "numeric", month: "2-digit", day: "2-digit"
});
function taiwanDate(value = Date.now()) {
  const parts = S1_P0_TAIPEI_DATE_FORMATTER.formatToParts(new Date(value));'''

def patch(source: str) -> str:
    for old in (CLOCK_OLD, DATE_OLD):
        if source.count(old) != 1:
            raise ValueError("ORIGINAL_V8_DATE_FORMATTER_ANCHOR_DRIFT__REVIEW_REQUIRED")
    for unchanged in (
        "const LIVE_STALE_SECONDS = 90;",
        "const need10 = minutesSinceOpen >= 11 && (minutesSinceOpen - 1) % 10 === 0;",
        "const need15 = minutesSinceOpen >= 16 && (minutesSinceOpen - 1) % 15 === 0;",
        'if (!allowOutsideWindow && !isIntradayMonitorWindow(scheduledTime))',
    ):
        if unchanged not in source:
            raise ValueError("P0_PROTECTED_ORIGINAL_RUNTIME_GUARD_MISSING: "+unchanged)
    # Original Worker regression builder may add whitespace to this protected
    # state key. Require equivalent exact identifier/concat syntax AND both
    # authoritative D1 lease acquisition + release in the original runtime.
    import re
    if not re.search(r"const\s+key\s*=\s*SIGNAL_STATE_PREFIX\s*\+\s*result\.symbol\s*;",source):
        raise ValueError("P0_PROTECTED_SIGNAL_D1_STATE_KEY_MISSING")
    for guard in ('await acquireSignalStateLease(env,key)', "UPDATE v7_signal_delivery_state SET lease_token=NULL"):
        if guard not in source:
            raise ValueError("P0_PROTECTED_SIGNAL_LEASE_GUARD_MISSING: "+guard)
    modified = source.replace(CLOCK_OLD, CLOCK_NEW, 1).replace(DATE_OLD, DATE_NEW, 1)
    if (modified.count("S1_P0_TAIPEI_CLOCK_FORMATTER") != 2 or
            modified.count("S1_P0_TAIPEI_DATE_FORMATTER") != 2):
        raise ValueError("P0_FORMATTER_CACHE_INSTALL_COUNT_INVALID")
    if modified == source:
        raise ValueError("P0_CPU_PATCH_UNEXPECTED_NOOP")
    return modified

def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", default="Worker.js")
    ap.add_argument("--output", required=True)
    args = ap.parse_args()
    root = Path.cwd().resolve()
    source = Path(args.source).resolve()
    output = Path(args.output).resolve()
    if source != root / "Worker.js" or output == source or root not in output.parents:
        raise SystemExit("P0_REVIEW_ONLY_SOURCE_OR_OUTPUT_BOUNDARY_VIOLATION")
    original = source.read_text(encoding="utf-8")
    candidate = patch(original)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(candidate, encoding="utf-8")
    digest = lambda s: hashlib.sha256(s.encode("utf-8")).hexdigest()
    print("SYSTEM1_P0_CPU_FORMATTER_REVIEWONLY_CANDIDATE="+json.dumps({
        "original_sha256":digest(original),"candidate_sha256":digest(candidate),
        "original_bytes":len(original.encode("utf-8")),
        "candidate_bytes":len(candidate.encode("utf-8")),
        "replacement_count":2,"production_worker_unchanged":source.read_text(encoding="utf-8")==original,
        "live_stale_seconds_kept":90,"trading_strategy_changed":False,
        "signal_lease_changed":False,"push_changed":False,"cron_changed":False,
        "billing_changed":False,"deployment_performed":False,
        "candidate_path":str(output.relative_to(root))
    },ensure_ascii=False))
if __name__ == "__main__":
    main()
