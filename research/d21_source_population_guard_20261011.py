"""D21 synthetic source-semantics checks only. No actual market or insider data."""
UNKNOWN = "UNKNOWN"
def kind(row):
    k = row.get("record_kind")
    if k == "pre_transfer": return "INTENT"
    if k == "untransferred": return "NONEXECUTION"
    if k == "month_end_balance": return "STOCK_ONLY"
    if k == "pledge_aggregate": return "AGGREGATE_ONLY"
    if k == "actual_market_trade" and row.get("original_receipt"): return "EXECUTION_MOTIVE_UNKNOWN"
    return UNKNOWN
def visible(row, t):
    return UNKNOWN if not row.get("first_public_date") else row["first_public_date"] <= t
def join(a,b):
    if not a.get("filing_id") or a.get("filing_id") != b.get("filing_id"): return UNKNOWN
    if not b.get("first_public_date"): return UNKNOWN
    return "LINKED_LATER_NONEXECUTION"
def cohort(row):
    if row.get("dataset") == "banking_over_50pct": return "FINANCIAL_THRESHOLD_ONLY"
    if row.get("dataset") == "company_pledge_aggregate": return "ISSUER_NOT_CONTROLLER"
    return UNKNOWN
tests = [
kind({"record_kind":"pre_transfer"})=="INTENT",
kind({"record_kind":"untransferred"})=="NONEXECUTION",
kind({"record_kind":"month_end_balance"})=="STOCK_ONLY",
kind({"record_kind":"pledge_aggregate"})=="AGGREGATE_ONLY",
kind({"record_kind":"actual_market_trade"})==UNKNOWN,
kind({"record_kind":"actual_market_trade","original_receipt":True})=="EXECUTION_MOTIVE_UNKNOWN",
visible({}, 10)==UNKNOWN,
visible({"first_public_date":12}, 10) is False,
cohort({"dataset":"banking_over_50pct"})=="FINANCIAL_THRESHOLD_ONLY",
cohort({"dataset":"company_pledge_aggregate"})=="ISSUER_NOT_CONTROLLER",
join({"filing_id":"A"},{"filing_id":"B","first_public_date":12})==UNKNOWN,
join({"filing_id":"A"},{"filing_id":"A","first_public_date":12})=="LINKED_LATER_NONEXECUTION",
join({"filing_id":"A"},{"filing_id":"A"})==UNKNOWN,
kind({"record_kind":"gift"})==UNKNOWN and kind({"record_kind":"trust"})==UNKNOWN,
]
assert len(tests)==14 and all(tests)
print("14/14 synthetic source-semantics tests PASS; historical PIT/OOS remain UNKNOWN")
