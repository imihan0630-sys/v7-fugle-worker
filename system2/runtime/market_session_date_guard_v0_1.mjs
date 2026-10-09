// Research-only fail-closed date validator. Weekday adjacency is a sanity gate,
// NOT a TWSE/TPEx official session-calendar or historical PIT receipt.
const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;
export function assertCanonicalMarketDateV0_1(value, field = "marketDate") {
  if (typeof value !== "string") throw new Error(field + ": canonical YYYY-MM-DD required");
  const match = DATE_RE.exec(value);
  if (!match) throw new Error(field + ": canonical YYYY-MM-DD required");
  const year = Number(match[1]), month = Number(match[2]), day = Number(match[3]);
  const millis = Date.UTC(year, month - 1, day);
  const time = new Date(millis);
  if (time.getUTCFullYear() !== year || time.getUTCMonth() + 1 !== month || time.getUTCDate() !== day) {
    throw new Error(field + ": nonexistent Gregorian market date");
  }
  const weekday = time.getUTCDay();
  if (weekday === 0 || weekday === 6) {
    throw new Error(field + ": weekend date without verified exchange session proof");
  }
  return value;
}
export function assertObservedSessionSequenceV0_1(previousDate, nextDate, field = "session.marketDate") {
  assertCanonicalMarketDateV0_1(nextDate, field);
  if (previousDate === null || previousDate === undefined) return;
  assertCanonicalMarketDateV0_1(previousDate, "previous.marketDate");
  if (nextDate <= previousDate) throw new Error(field + ": duplicate or reversed market dates");
  const delta = (Date.parse(nextDate + "T00:00:00Z") - Date.parse(previousDate + "T00:00:00Z")) / 86400000;
  // Long gaps are NEVER silently treated as sequential observed sessions.
  // <= 3 days still needs independent source/calendar proof before final no-fill credit.
  if (!Number.isInteger(delta) || delta > 3) {
    throw new Error(field + ": OFFICIAL_SESSION_GAP_UNPROVEN");
  }
}
