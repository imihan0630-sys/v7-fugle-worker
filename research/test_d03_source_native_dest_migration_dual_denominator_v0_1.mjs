import assert from "node:assert/strict";

const S = {pairs:122, windows:1935, sessions:61, rows:118035, raw:true};
const D = {present:59311, remaining:25377, total:84688};

function decide(c) {
  if (c.kind === "SOURCE_NATIVE") {
    if (c.pairs !== S.pairs) return "SOURCE_PAIR_BLOCKED";
    if (c.windows !== S.windows || c.sessions !== S.sessions || c.rows !== S.rows) return "SOURCE_DENOMINATOR_BLOCKED";
    if (c.raw && c.cut) return "SOURCE_RAW_MECHANICS_ONLY";
  }
  if (c.kind === "DEST_MIGRATION") {
    if (c.present + c.remaining !== c.total || c.total !== D.total) return "DEST_COUNT_BLOCKED";
    if (!c.identity) return "DEST_IDENTITY_BLOCKED";
    if (c.sameDayWriter) return "SAME_DAY_WRITER_BLOCKED";
    if (c.frozen === 0 && c.selectionRan === false) return "FALSE_ZERO_PICK_BLOCKED";
    if (!c.rawPayloadParity) return c.partial ? "DEST_IDENTITY_PARTIAL_ONLY" : "DEST_PAYLOAD_BLOCKED";
    if (!c.exactSessions) return "DEST_SESSION_COVERAGE_BLOCKED";
    if (!c.continuity) return "DEST_CONTINUITY_BLOCKED";
    return "DEST_CURRENT_FORMULA_INPUT_ONLY";
  }
  if (c.kind === "CROSS_SCOPE") {
    if (!c.samePopulation && c.operation === "ratio") return "CROSS_SCOPE_ARITHMETIC_BLOCKED";
    if (!c.samePopulation && c.operation === "union") return "CROSS_SCOPE_JOIN_BLOCKED";
    if (!c.keyset) return "CROSS_SCOPE_KEYSET_BLOCKED";
    if (!c.rawPayloadParity) return "CROSS_SCOPE_PAYLOAD_BLOCKED";
    if (!c.historical) return "CURRENT_STORAGE_PARITY_ONLY";
    if (!c.frozen) return "HISTORICAL_INPUT_NO_FROZEN";
    if (!c.redundancyPass) return "REDUNDANCY_BLOCKED";
    return "RESEARCH_CANDIDATE_ONLY";
  }
  throw new Error("unclassified");
}

const cases = [
["TI-1993",{kind:"SOURCE_NATIVE",...S,cut:true},"SOURCE_RAW_MECHANICS_ONLY"],
["TI-1994",{kind:"SOURCE_NATIVE",...S,pairs:121,cut:true},"SOURCE_PAIR_BLOCKED"],
["TI-1995",{kind:"SOURCE_NATIVE",...S,rows:118034,cut:true},"SOURCE_DENOMINATOR_BLOCKED"],
["TI-1996",{kind:"DEST_MIGRATION",...D,identity:true,rawPayloadParity:false,partial:true},"DEST_IDENTITY_PARTIAL_ONLY"],
["TI-1997",{kind:"DEST_MIGRATION",present:59311,remaining:25376,total:84688,identity:true},"DEST_COUNT_BLOCKED"],
["TI-1998",{kind:"DEST_MIGRATION",...D,identity:false},"DEST_IDENTITY_BLOCKED"],
["TI-1999",{kind:"DEST_MIGRATION",...D,identity:true,rawPayloadParity:false,partial:false},"DEST_PAYLOAD_BLOCKED"],
["TI-2000",{kind:"DEST_MIGRATION",...D,identity:true,rawPayloadParity:true,exactSessions:false},"DEST_SESSION_COVERAGE_BLOCKED"],
["TI-2001",{kind:"DEST_MIGRATION",...D,identity:true,rawPayloadParity:true,exactSessions:true,continuity:false},"DEST_CONTINUITY_BLOCKED"],
["TI-2002",{kind:"DEST_MIGRATION",...D,identity:true,rawPayloadParity:true,exactSessions:true,continuity:true},"DEST_CURRENT_FORMULA_INPUT_ONLY"],
["TI-2003",{kind:"DEST_MIGRATION",...D,identity:true,rawPayloadParity:true,frozen:0,selectionRan:false},"FALSE_ZERO_PICK_BLOCKED"],
["TI-2004",{kind:"DEST_MIGRATION",...D,identity:true,sameDayWriter:true},"SAME_DAY_WRITER_BLOCKED"],
["TI-2005",{kind:"CROSS_SCOPE",samePopulation:false,operation:"ratio"},"CROSS_SCOPE_ARITHMETIC_BLOCKED"],
["TI-2006",{kind:"CROSS_SCOPE",samePopulation:false,operation:"union"},"CROSS_SCOPE_JOIN_BLOCKED"],
["TI-2007",{kind:"CROSS_SCOPE",samePopulation:true,keyset:false},"CROSS_SCOPE_KEYSET_BLOCKED"],
["TI-2008",{kind:"CROSS_SCOPE",samePopulation:true,keyset:true,rawPayloadParity:false},"CROSS_SCOPE_PAYLOAD_BLOCKED"],
["TI-2009",{kind:"CROSS_SCOPE",samePopulation:true,keyset:true,rawPayloadParity:true,historical:false},"CURRENT_STORAGE_PARITY_ONLY"],
["TI-2010",{kind:"CROSS_SCOPE",samePopulation:true,keyset:true,rawPayloadParity:true,historical:true,frozen:false},"HISTORICAL_INPUT_NO_FROZEN"],
["TI-2011",{kind:"CROSS_SCOPE",samePopulation:true,keyset:true,rawPayloadParity:true,historical:true,frozen:true,redundancyPass:false},"REDUNDANCY_BLOCKED"],
["TI-2012",{kind:"CROSS_SCOPE",samePopulation:true,keyset:true,rawPayloadParity:true,historical:true,frozen:true,redundancyPass:true},"RESEARCH_CANDIDATE_ONLY"]
];

for (const [id,input,expected] of cases) assert.equal(decide(input), expected, id);
console.log(JSON.stringify({passed:cases.length,total:cases.length,status:"PASS"}));
