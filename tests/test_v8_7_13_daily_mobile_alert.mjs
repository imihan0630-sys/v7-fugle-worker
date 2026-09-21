import fs from "node:fs";
import assert from "node:assert/strict";

const source = fs.readFileSync("Worker.js", "utf8");

assert.match(source, /const VERSION = "8\.7\.13-daily-mobile-alert";/);
assert.ok(
  source.includes('`<!channel>\\n📋 *${payload.title}*`, payload.instruction,'),
  "DAILY_SELECTION Slack message must contain an explicit <!channel> mention"
);
assert.ok(
  source.includes('payload?.signalType === "DAILY_SELECTION" ? { link_names: 1 } : {}'),
  "Slack incoming webhook must request mention parsing for DAILY_SELECTION"
);

// Do not broaden mobile mentions to intraday signals or system alerts.
const mentionCount = (source.match(/<!channel>/g) || []).length;
assert.equal(mentionCount, 1, "channel mention must be limited to the formal daily result");

console.log("V8.7.13 daily mobile alert regression passed");
