# System 2 BUILD｜2026-10-16 真實 A1 原始行情逐股價格有效分母核對（2026-10-18）

**Scope:** independent BUILD consumer-side physical readback of **DATA-produced original source-only ZIP**, not an independent native CFI/CA provider audit; **not a formal SHORT_MOMENTUM pick**. Owner highest priority: `system2/SYSTEM2_SELECTION_FIRST_OWNER_PRIORITY_20261017_V0_1.md`, workrooms BUILD #1132/#1234, DATA #1068, independent AUDIT #1127.

## Actual exact evidence and integrity

- DATA original full-market four-digit stock-source reconstruction: [Run #39044778550](https://github.com/imihan0630-sys/v7-fugle-worker/actions/runs/39044778550), Artifact ID `12105302588`, file `full-universe-a1-source-handoff.json`, schema `S2_A1_FOUR_DIGIT_UNIVERSE_HANDOFF_V0_1`. Artifact size **227,520 ZIP bytes**.
- Downloaded **the actual GitHub Artifact ZIP bytes** during BUILD readback; local `sha256sum` exactly matched GitHub Actions artifact digest `cbb9824d50948a805eab9db5faff32bf947f263685bbcd6a001ca21e858f2754` (sha256).
- Unzipped JSON, removed exactly `receiptHash`, serialized all remaining entries to recursive lexicographically sorted UTF-8 JSON (with preserved non-ASCII) using Python `json.dumps(data, sort_keys=True, ensure_ascii=False, separators=(',', ':'))`, and hashed those bytes. Result exactly matched embedded `receiptHash=e27e8e79959a7431e10dc5b0567827977c0339515a73c0a916c93379f8e11d6e`. This verifies the downloaded JSON receipt's internal consistency, not any additional external provider independence or PIT cut.
- Parent original source 2026-10-16 `122/122` TWSE/TPEx 61-session A1, original source receipt hash `fbe36631c4f83c1f86bcd4efa7bbe92516c8031971803fadd9368f3ad9b5381f`; separately audited source integrity receipt hash `e5c4a283ad25a9a5eea30ebcb0a8ffb0f9c94151c0f94602fe16447db117e84b` (original upstream independent audit Run #38934321405). Neither source-level receipt authorizes real strategy PIT or Frozen.
- Original T observation clock within source handoff: TWSE `2026-10-16T16:44:17.260Z`, TPEx `2026-10-16T16:44:22.393Z` = **2026-10-17 00:44 Taipei**, *after* 2026-10-16 23:45 reference deadline. JSON handoff assembled `2026-10-17T15:22:56.676Z`. Handoff says `historicalSourceReplayOnly=true`, `preMarketDecisionTimelinessAccepted=false`, never retroactively turns an unavailable T-cut source into on-time Frozen.

## Exact raw rows and price-input coverage (not ordinary-equity eligible)

| Input/venue | TWSE | TPEx | Total |
|---|---:|---:|---:|
| Source four-digit instrument rows | 1,086 | 886 | **1,972** |
| Current T positive raw close | 1,081 | 865 | **1,946** |
| Previous official session raw close known | 1,083 | 871 | **1,954** |
| Both T + T-1 raw closes known | 1,080 | 855 | **1,935** |
| T raw close absent | 5 | 21 | **26** |
| Previous raw close absent | 3 | 15 | **18** |
| Native TWD turnover field present | 1,086 | 886 | **1,972** |
| Turnover exactly zero | 2 | 9 | **11** |

- The **1,972** is a four-digit *source instrument identity scope*, **not** a certified ordinary-common-share universe. Current T raw close known for **1,946/1,972**; both T and previous session raw close known for **1,935/1,972**. The 26 missing current closes and 18 missing prior closes must not be defaulted to 0 nor treated as sell signals.
- Having both raw closes **does not** certify comparability across dividends, splits, rights, trading suspensions or other CA; 61-session exact PIT and all seven strategy inputs are still separate gates.
- Every one of the 1,972 rows explicitly has `instrumentClassPITStatus=ORDINARY_EQUITY_CLASS_NOT_INDEPENDENTLY_ATTESTED`, `caAdjustedPriceComparable=false`, `caRevisionAndNegativeScopeCertified=false`, `genuinePublicationFirstKnownAtUtc=null`, `genuinePublicationAvailableAtUtc=null`, `strategyUseAuthorized=false`. This is **0 positively certified ordinary-share/PIT inputs in this specific source-only artifact**, **not** evidence that the full market has no qualifying stocks. Actual Stage1 shortlisted/selected count and genuine zero-pick day remain `null/UNKNOWN`.
- Current independent physical original-native instrument/class/CA provider acceptance **not performed by BUILD**; DATA must supply genuine original native vintages and independent AUDIT must evaluate them. Real candidate 2330/TWSE, 3287/TPEx prior PIT-A positive controls accepted 0/2, not a full-market stock signal.

## Minimal independent reproduction (using the actual ZIP bytes)

```python
import hashlib, json, zipfile
with zipfile.ZipFile("a1-native-20261016.zip") as z:
    rows_receipt=json.loads(z.read("full-universe-a1-source-handoff.json"))
receipt_hash=rows_receipt.pop("receiptHash")
canonical=json.dumps(rows_receipt,sort_keys=True,ensure_ascii=False,separators=(",",":")).encode()
assert hashlib.sha256(canonical).hexdigest()==receipt_hash
rows=rows_receipt["rows"]
for m in ("TWSE","TPEX"):
    items=[r for r in rows if r["market"]==m]
    print(m,len(items),sum(r["close"] is not None for r in items),
          sum(r["previousSessionRawClose"] is not None for r in items),
          sum(r["close"] is not None and r["previousSessionRawClose"] is not None
              for r in items))
```

## Scope, correction and next actual selection gate

- The DATA checkpoint sentence that all **1,972** have non-null raw close conflates native original row coverage with valid price fields; actual current close is **1,946**. The DATA-supplied `marketSummaries.positiveRawCloseCount` already contains 1081 and 865, consistent with this BUILD readback. Do not edit DATA lane checkpoint without DATA ownership. Handoffs sent via GitHub issue comments BUILD #1132 `6237027488`, DATA #1068 `6237025823`, AUDIT #1127 `6237026738`. Issue comments **do not start other chat rooms**.
- BUILD owns **actual authorized** seven-factor Stage1 consumer; currently merged `m09_stage1_native_evidence_intake_v0_1.mjs` and `stage1_daily_symbol_accounting_v0_1.mjs` are already in main. Next genuinely observed trading day expected **2026-10-19**. Only data-native historical CFI effective 61-day classification and six CA families/revision/no-event/suspension price-space evidence + independent physical audit may unlock legitimate Stage1 qualifications. Formal strategy ranks, Shadow/Frozen, Cloudflare production writer still owner-protected; do not infer permission from research Class A.
