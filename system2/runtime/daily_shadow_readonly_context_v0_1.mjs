import { deepFreeze } from "./factor_snapshot.mjs";
import { fetchDailyShadowA1SnapshotV0_1 } from "./daily_shadow_a1_source_v0_1.mjs";
import { probePitHistoryCoverageV0_1 } from "./daily_shadow_history_reader_v0_1.mjs";
import { buildDailyShadowInputPreflightV0_1 } from "./daily_shadow_input_preflight_v0_1.mjs";
import { buildOfficialTradingDatesV0_1 } from "./official_historical_backfill_source_v0_1.mjs";
import { fetchTwseRegulatoryLifecycleForSymbolsV0_1 } from "./twse_regulatory_lifecycle_source_v0_1.mjs";

export const DAILY_SHADOW_READONLY_CONTEXT_VERSION = "0.1-RESEARCH";

function requiredText(value, field) {
  if (typeof value !== "string" || !value.trim()) throw new Error(field + " is required");
  return value.trim();
}

function isoDate(value) {
  const text=requiredText(value,"marketDate");
  if(!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new Error("marketDate must be YYYY-MM-DD");
  return text;
}

function assertDb(db) {
  if(!db||typeof db.prepare!=="function") throw new Error("SYSTEM2_DB read adapter is required");
  return db;
}

function lifecycleEmpty(state="NOT_EVALUATED") {
  return {
    state,
    queriedSymbolCount:0,
    intervalCount:0,
    eventCount:0,
    partialSymbolCount:0,
    candidateSymbols:[],
    certifiedNoTradingIntervals:[],
    conflicts:[],
    symbolReceipts:[],
    absenceCertifiesNoEvent:false,
    knownAtState:null,
  };
}

export async function buildDailyShadowReadonlyContextV0_1({
  db,
  marketDate,
  decisionTimestamp = null,
  fetchImpl = globalThis.fetch,
  now = () => new Date(),
  requiredPriorSessions = 60,
  sourceFetch = fetchDailyShadowA1SnapshotV0_1,
  historyProbe = probePitHistoryCoverageV0_1,
  tradingDateResolver = buildOfficialTradingDatesV0_1,
  lifecycleFetch = fetchTwseRegulatoryLifecycleForSymbolsV0_1,
} = {}) {
  assertDb(db);
  const date=isoDate(marketDate);
  if(typeof fetchImpl!=="function") throw new Error("fetchImpl is required");
  if(typeof now!=="function") throw new Error("now is required");
  if(!Number.isInteger(requiredPriorSessions)||requiredPriorSessions<1||requiredPriorSessions>250) {
    throw new Error("requiredPriorSessions must be an integer from 1 to 250");
  }

  const a1=await sourceFetch({
    marketDate:date,
    decisionTimestamp,
    fetchImpl,
    now,
  });

  let history;
  let listingAgeCalendar=null;
  let lifecycle=lifecycleEmpty();

  if(a1.snapshotBatch) {
    if(a1.listingMetadata?.state==="READY") {
      const from=new Date(date+"T00:00:00.000Z");
      from.setUTCDate(from.getUTCDate()-180);
      const to=new Date(date+"T00:00:00.000Z");
      to.setUTCDate(to.getUTCDate()-1);
      try {
        listingAgeCalendar=await tradingDateResolver({
          fromDate:from.toISOString().slice(0,10),
          toDate:to.toISOString().slice(0,10),
          fetchImpl,
        });
      } catch {
        listingAgeCalendar=null;
      }
    }

    history=await historyProbe({
      db,
      snapshotBatch:a1.snapshotBatch,
      decisionTimestamp:a1.decisionTimestamp,
      requiredPriorSessions,
      priceSpace:"RAW",
      listingMetadata:a1.listingMetadata||null,
      priorTradingDates:listingAgeCalendar?.tradingDates||null,
      certifiedNoTradingIntervals:[],
    });

    const lifecycleCandidates=listingAgeCalendar?.tradingDates?.length
      ? history.diagnostics
          .filter((row)=>
            row.market==="TWSE"
            && Number(row.selectedDateCount||0)>=Number(row.requiredPriorSessionsForSymbol||0)
            && Number(row.missingExpectedSessionCount||0)>0
            && row.sessionReconciliationState==="EXACT_EXPECTED_SESSION_SET_AVAILABLE"
          )
          .map((row)=>String(row.symbol))
          .sort()
      : [];

    if(lifecycleCandidates.length) {
      try {
        const evidence=await lifecycleFetch({
          symbols:lifecycleCandidates,
          fromDate:listingAgeCalendar.tradingDates[0],
          toDate:listingAgeCalendar.tradingDates.at(-1),
          observedAt:a1.observedAt,
          fetchImpl,
        });
        lifecycle={
          state:evidence.state,
          queriedSymbolCount:evidence.queriedSymbolCount,
          intervalCount:evidence.intervalCount,
          eventCount:evidence.eventCount,
          partialSymbolCount:evidence.partialSymbolCount,
          candidateSymbols:lifecycleCandidates,
          certifiedNoTradingIntervals:evidence.intervals||[],
          conflicts:evidence.conflicts||[],
          symbolReceipts:evidence.symbolReceipts||[],
          absenceCertifiesNoEvent:false,
          knownAtState:evidence.knownAtState||null,
        };
        if((evidence.intervals||[]).length) {
          history=await historyProbe({
            db,
            snapshotBatch:a1.snapshotBatch,
            decisionTimestamp:a1.decisionTimestamp,
            requiredPriorSessions,
            priceSpace:"RAW",
            listingMetadata:a1.listingMetadata||null,
            priorTradingDates:listingAgeCalendar.tradingDates,
            certifiedNoTradingIntervals:evidence.intervals,
          });
        }
      } catch(error) {
        lifecycle={
          ...lifecycleEmpty("TWSE_LIFECYCLE_SOURCE_PARTIAL"),
          queriedSymbolCount:lifecycleCandidates.length,
          partialSymbolCount:lifecycleCandidates.length,
          candidateSymbols:lifecycleCandidates,
          message:String(error?.message||error).slice(0,300),
        };
      }
    } else {
      lifecycle=lifecycleEmpty("NO_TWSE_EXACT_SESSION_MISMATCH_CANDIDATES");
    }
  } else {
    history={
      version:"0.1-RESEARCH",
      state:"NOT_EVALUATED_CURRENT_SOURCE_UNAVAILABLE",
      globalIntegrityState:"BLOCKED",
      globalBlockerCodes:["CURRENT_A1_SOURCE_UNAVAILABLE"],
      marketDate:date,
      decisionTimestamp:a1.decisionTimestamp,
      requiredPriorSessions,
      currentUniverseCount:0,
      accountedSymbolCount:0,
      accountingComplete:false,
      historyReadyCount:0,
      continuityReadyCount:0,
      symbolLocalIncompleteCount:0,
      ambiguousSymbolCount:0,
      historyCoverage:0,
      continuityCoverage:0,
      selectionDenominatorComplete:false,
      diagnostics:[],
      readOnly:true,
      externalMutationPerformed:false,
    };
  }

  const preflight=buildDailyShadowInputPreflightV0_1({
    marketDate:date,
    decisionTimestamp:a1.decisionTimestamp,
    a1Source:a1,
    historyCoverage:history,
  });

  return deepFreeze({
    schemaVersion:"S2_DAILY_SHADOW_READONLY_CONTEXT_V0_1",
    version:DAILY_SHADOW_READONLY_CONTEXT_VERSION,
    marketDate:date,
    decisionTimestamp:a1.decisionTimestamp,
    decisionClockMode:a1.decisionClockMode,
    observedAt:a1.observedAt,
    a1,
    historyCoverage:history,
    listingAgeCalendar,
    lifecycle,
    preflight,
    readOnly:true,
    externalMutationPerformed:false,
  });
}
