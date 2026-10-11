#!/usr/bin/env python3
"""Room 08 research-only raw TWSE field-delta falsification. No price/outcome data."""
import argparse
import hashlib
import io
import json
import zipfile
from pathlib import Path

CLOCK_FIELDS = {"出表日期", "發言日期", "發言時間"}
SOURCES = ("room08_official_capture_11301419229.zip", "room08_official_capture_11318460615.zip")

def read_rows(bundle, filename):
    with zipfile.ZipFile(io.BytesIO(bundle.read(filename))) as nested:
        return json.loads(nested.read("twse1.json"))

def run(bundle_path):
    with zipfile.ZipFile(bundle_path) as bundle:
        old, new = [read_rows(bundle, fn) for fn in SOURCES]
    result = []
    for symbol in ("2072", "6949"):
        a = next(r for r in old if r["公司代號"] == symbol)
        b = next(r for r in new if r["公司代號"] == symbol)
        keys = set(a) | set(b)
        changed = {key for key in keys if a.get(key) != b.get(key)}
        assert changed == CLOCK_FIELDS, (symbol, changed)
        for field in ("主旨 ", "說明", "事實發生日"):
            mutated = dict(b)
            mutated[field] = str(mutated[field]) + "__RESEARCH_TEST__"
            assert any(a.get(k) != mutated.get(k) for k in keys - CLOCK_FIELDS)
        result.append({"symbol": symbol, "totalFields": len(keys),
                       "changedClockFields": sorted(changed),
                       "otherFieldsIdentical": len(keys) - len(changed),
                       "materialMutationGuardsPassed": 3})
    return {"bundleSha256": hashlib.sha256(Path(bundle_path).read_bytes()).hexdigest(),
            "researchOnly": True, "cases": result, "publisherFirstAvailableAt": "UNKNOWN",
            "nativeCorrectionLinkage": "UNKNOWN", "outcomeJoin": False}

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--bundle", required=True, help="Original evidence rescue ZIP path")
    args = parser.parse_args()
    print(json.dumps(run(args.bundle), ensure_ascii=False, indent=2))
