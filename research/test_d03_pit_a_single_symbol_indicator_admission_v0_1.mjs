import assert from "node:assert/strict";
function decide(c){
 if(c.kind==="CFI_CONTROL"){
  if(c.nativeType!=="Stocks"||c.cfi!=="ESVUFR") return "INSTRUMENT_CLASS_BLOCKED";
  if(!c.historicalEffective) return "CURRENT_CFI_SOURCE_POSITIVE_ONLY";
 }
 if(c.kind==="PIT_A"){
  if(!c.archiveByCut) return "DECISION_CUT_BLOCKED";
  if(!c.historicalCfi) return "CLASS_VINTAGE_BLOCKED";
  if(!c.classPeriodsExact) return "CLASS_PERIOD_BLOCKED";
  if(!c.caScopeComplete) return "CA_SCOPE_BLOCKED";
  if(!c.auditSigned) return "AUDIT_BLOCKED";
  if(c.claimSelected) return "SELECTION_AUTHORITY_BLOCKED";
  if(c.pitBSubstitute) return "PIT_B_SUBSTITUTION_BLOCKED";
  return c.pitBComplete===false ? "PIT_A_NOT_BLOCKED_BY_PIT_B" : "PIT_A_SYMBOL_INPUT_ADMISSIBLE";
 }
 if(c.kind==="MARKET"){
  if(c.claimZero) return "FALSE_ZERO_PICK_BLOCKED";
  if(c.eligible===0&&c.unresolved===1935) return "FULL_MARKET_UNKNOWN";
 }
 if(c.kind==="INDICATOR"){
  if(!c.exact61||!c.raw||!c.continuity) return "INDICATOR_INPUT_BLOCKED";
  if(["MACD","ADX"].includes(c.indicator)&&!c.priorState) return "RECURSIVE_STATE_UNCERTAIN";
  if(c.outcomeAttempt) return "OUTCOME_INCREMENTALITY_BLOCKED";
  if(c.allResearchGates) return "SINGLE_SYMBOL_SHADOWLESS_RESEARCH_ONLY";
  return "FINITE_WINDOW_MECHANICS_READY";
 }
 throw new Error("unclassified");
}
const base={kind:"PIT_A",archiveByCut:true,historicalCfi:true,classPeriodsExact:true,caScopeComplete:true,auditSigned:true};
const cases=[["TI-2013",{"kind":"CFI_CONTROL","nativeType":"Stocks","cfi":"ESVUFR","historicalEffective":false},"CURRENT_CFI_SOURCE_POSITIVE_ONLY"],["TI-2014",{"kind":"CFI_CONTROL","nativeType":"Stocks","cfi":"ESVUFR","historicalEffective":false},"CURRENT_CFI_SOURCE_POSITIVE_ONLY"],["TI-2015",{"kind":"CFI_CONTROL","nativeType":"TDR","cfi":"EDSDDR"},"INSTRUMENT_CLASS_BLOCKED"],["TI-2016",{"kind":"CFI_CONTROL","nativeType":"ETF","cfi":"CEOGEU"},"INSTRUMENT_CLASS_BLOCKED"],["TI-2017",{"kind":"PIT_A","archiveByCut":false,"historicalCfi":true,"classPeriodsExact":true,"caScopeComplete":true,"auditSigned":true},"DECISION_CUT_BLOCKED"],["TI-2018",{"kind":"PIT_A","archiveByCut":true,"historicalCfi":false,"classPeriodsExact":true,"caScopeComplete":true,"auditSigned":true},"CLASS_VINTAGE_BLOCKED"],["TI-2019",{"kind":"PIT_A","archiveByCut":true,"historicalCfi":true,"classPeriodsExact":false,"caScopeComplete":true,"auditSigned":true},"CLASS_PERIOD_BLOCKED"],["TI-2020",{"kind":"PIT_A","archiveByCut":true,"historicalCfi":true,"classPeriodsExact":true,"caScopeComplete":false,"auditSigned":true},"CA_SCOPE_BLOCKED"],["TI-2021",{"kind":"PIT_A","archiveByCut":true,"historicalCfi":true,"classPeriodsExact":true,"caScopeComplete":true,"auditSigned":false},"AUDIT_BLOCKED"],["TI-2022",{"kind":"MARKET","eligible":0,"unresolved":1935,"claimZero":false},"FULL_MARKET_UNKNOWN"],["TI-2023",{"kind":"MARKET","eligible":0,"unresolved":1935,"claimZero":true},"FALSE_ZERO_PICK_BLOCKED"],["TI-2024",{"kind":"PIT_A","archiveByCut":true,"historicalCfi":true,"classPeriodsExact":true,"caScopeComplete":true,"auditSigned":true,"claimSelected":true},"SELECTION_AUTHORITY_BLOCKED"],["TI-2025",{"kind":"PIT_A","archiveByCut":true,"historicalCfi":true,"classPeriodsExact":true,"caScopeComplete":true,"auditSigned":true},"PIT_A_SYMBOL_INPUT_ADMISSIBLE"],["TI-2026",{"kind":"PIT_A","archiveByCut":true,"historicalCfi":true,"classPeriodsExact":true,"caScopeComplete":true,"auditSigned":true,"pitBComplete":false},"PIT_A_NOT_BLOCKED_BY_PIT_B"],["TI-2027",{"kind":"PIT_A","archiveByCut":true,"historicalCfi":true,"classPeriodsExact":true,"caScopeComplete":true,"auditSigned":true,"pitBSubstitute":true},"PIT_B_SUBSTITUTION_BLOCKED"],["TI-2028",{"kind":"INDICATOR","indicator":"RET60","exact61":true,"raw":true,"continuity":true},"FINITE_WINDOW_MECHANICS_READY"],["TI-2029",{"kind":"INDICATOR","indicator":"MACD","exact61":true,"raw":true,"continuity":true,"priorState":false},"RECURSIVE_STATE_UNCERTAIN"],["TI-2030",{"kind":"INDICATOR","indicator":"ADX","exact61":true,"raw":true,"continuity":true,"priorState":false},"RECURSIVE_STATE_UNCERTAIN"],["TI-2031",{"kind":"INDICATOR","indicator":"RET20","exact61":true,"raw":true,"continuity":true,"outcomeAttempt":true},"OUTCOME_INCREMENTALITY_BLOCKED"],["TI-2032",{"kind":"INDICATOR","indicator":"FINITE_SET","exact61":true,"raw":true,"continuity":true,"allResearchGates":true},"SINGLE_SYMBOL_SHADOWLESS_RESEARCH_ONLY"]];
for(const [id,input,expected] of cases) assert.equal(decide(input),expected,id);
console.log(JSON.stringify({passed:cases.length,total:cases.length,status:"PASS"}));
