import { appendFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { probeTwseTradingDate } from "../runtime/twse_trading_calendar_readonly.mjs";

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) throw new Error(`unexpected argument: ${token}`);
    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new Error(`missing value for ${token}`);
    }
    out[token.slice(2)] = value;
    i += 1;
  }
  return out;
}

export async function runTradingDayReadOnlyCheck({
  marketDate,
  outputFile = null,
  probe = probeTwseTradingDate,
} = {}) {
  const result = await probe({ marketDate });
  if (result.state !== "READY" || typeof result.expectedTradingDay !== "boolean") {
    throw new Error(`official trading-calendar gate unavailable: ${result.state}`);
  }

  if (outputFile) {
    await appendFile(
      outputFile,
      `market_date=${result.marketDate}\nexpected_trading_day=${result.expectedTradingDay}\n`,
      "utf8",
    );
  }

  return result;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = await runTradingDayReadOnlyCheck({
    marketDate: args["market-date"],
    outputFile: args["github-output"] || process.env.GITHUB_OUTPUT || null,
  });
  console.log(JSON.stringify({
    result: "PASS",
    marketDate: result.marketDate,
    expectedTradingDay: result.expectedTradingDay,
    source: result.source,
    externalMutationPerformed: false,
  }, null, 2));
}

const isMain = process.argv[1]
  && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isMain) {
  main().catch((error) => {
    console.error(error?.stack || String(error));
    process.exitCode = 1;
  });
}
