import { readFile, writeFile } from "node:fs/promises";
import { buildHistoricalReplayInputGateV0_1 } from "../runtime/historical_replay_input_gate_v0_1.mjs";

const matrixPath=String(process.env.SYSTEM2_HISTORY_COVERAGE_MATRIX
  ||"system2/SYSTEM2_HISTORICAL_MARKET_YEAR_COVERAGE_MATRIX.json").trim();
const outputPath=String(process.env.SYSTEM2_HISTORY_REPLAY_GATE_OUTPUT||"").trim()||null;
const requirePresentReady=String(process.env.SYSTEM2_REQUIRE_PRESENT_REPLAY_READY||"false").toLowerCase()==="true";
const matrix=JSON.parse(await readFile(matrixPath,"utf8"));

const now=new Date();
const currentYear=Number(new Intl.DateTimeFormat("en-US",{
  timeZone:"Asia/Taipei",year:"numeric",
}).format(now));
const annualThroughYear=currentYear-1;

const currentYearSegmentStateByMarket={};
for(const market of ["TWSE","TPEX"]){
  const row=matrix.rows.find((x)=>x.market===market&&Number(x.year)===currentYear)||null;
  if(row?.segmentPhysicalState==="PHYSICAL_ACCEPTED"){
    currentYearSegmentStateByMarket[market]={
      state:"PHYSICAL_ACCEPTED",
      completedThroughMonth:Number(row.completedThroughMonth||0),
      evidencePath:row.evidencePath||null,
      githubRunId:row.githubRunId||null,
      replayReadinessState:row.replayReadinessState||"PARTIAL",
    };
  }
}

const gate=buildHistoricalReplayInputGateV0_1({
  coverageMatrix:matrix,
  annualStartYear:2017,
  annualThroughYear,
  currentYear,
  currentYearSegmentStateByMarket,
});
const output={
  observedAt:now.toISOString(),
  matrixPath,
  matrixSchemaVersion:matrix.schemaVersion||null,
  matrixUpdatedAt:matrix.updatedAt||null,
  ...gate,
};
const json=JSON.stringify(output,null,2);
if(outputPath) await writeFile(outputPath,json+"\n","utf8");
console.log(json);
if(requirePresentReady&&!gate.presentScopeReady){
  process.exitCode=2;
}
