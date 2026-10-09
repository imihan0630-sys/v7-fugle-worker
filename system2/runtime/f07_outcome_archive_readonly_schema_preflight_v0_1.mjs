import { deepFreeze } from "./factor_snapshot.mjs";
import { sha256Hex } from "./decision_archive.mjs";

// F07 / CORR-012: inspect the ACTUAL isolated System2 D1 schema without
// running any migration or DML. This is not a physical acceptance receipt
// unless independently exercised against a real, identified D1 database.
export const S2_F07_SCHEMA_READBACK_VERSION = "S2_F07_OUTCOME_SCHEMA_READBACK_V0_1";
const TABLE = "s2_outcome_revision_archive";
const REQUIRED_COLUMNS = Object.freeze([
  "revision_id","revision_hash","decision_id","decision_hash","strategy_id",
  "strategy_version","regime_snapshot_id","regime_hash","lineage_hash",
  "revision_number","previous_revision_hash","execution_hash",
  "cost_model_hash","cost_scenario_hash","outcome_hash","observed_at",
  "outcome_json","receipt_json","certified_performance",
  "physical_pit_verified","final_selection_authorized","schema_version",
]);
const INDEXES = Object.freeze([
  ["idx_s2_outcome_revision_lineage",["decision_id","lineage_hash","revision_number"]],
  ["idx_s2_outcome_revision_strategy",["strategy_id","strategy_version","observed_at"]],
  ["idx_s2_outcome_revision_regime",["regime_snapshot_id","regime_hash","observed_at"]],
]);
const TRIGGERS = Object.freeze([
  ["s2_outcome_revision_block_update","UPDATE"],
  ["s2_outcome_revision_block_delete","DELETE"],
]);
const NORMALIZE = value => String(value||"").replace(/["'`\[\]]/g,"").replace(/\s+/g," ").trim().toUpperCase();
function readAll(db,sql,params) {
  const handle=db.prepare(sql);
  if(!handle || typeof handle.bind!=="function") throw Error("F07_READONLY_BIND_REQUIRED");
  const bound=handle.bind(...params);
  if(!bound || typeof bound.all!=="function") throw Error("F07_READONLY_ALL_REQUIRED");
  return bound.all().then(response=>{
    if(!response || !Array.isArray(response.results)) throw Error("F07_READBACK_RESULTS_REQUIRED");
    return response.results;
  });
}
function includesExpr(sql,text) { return NORMALIZE(sql).includes(NORMALIZE(text)); }
export async function inspectS2F07OutcomeArchiveSchemaV0_1({
  db,bindingName="SYSTEM2_DB",
}={}) {
  if(bindingName!=="SYSTEM2_DB") throw Error("F07_FORBIDDEN_D1_BINDING");
  if(!db||typeof db.prepare!=="function") throw Error("F07_ISOLATED_READONLY_D1_REQUIRED");
  const queries=[];
  const sqlObjects="SELECT type, name, tbl_name, sql FROM sqlite_master WHERE tbl_name = ? AND type IN ('table','index','trigger')";
  queries.push({sql:sqlObjects,parametersCount:1});
  const records=await readAll(db,sqlObjects,[TABLE]);
  const sqlColumns="SELECT name, type, \"notnull\", pk, dflt_value FROM pragma_table_info(?)";
  queries.push({sql:sqlColumns,parametersCount:1});
  const cols=await readAll(db,sqlColumns,[TABLE]);
  const errors=new Set();
  const find=(type,name)=>records.filter(x=>x.type===type && x.name===name);
  const tables=find("table",TABLE);
  if(tables.length!==1)add("F07_ARCHIVE_TABLE_MISSING_OR_AMBIGUOUS");
  const ddl=tables[0]?.sql||"";
  const columnNames=cols.map(x=>x.name);
  if(new Set(columnNames).size!==columnNames.length
     ||REQUIRED_COLUMNS.some(x=>!columnNames.includes(x))
     ||cols.length!==REQUIRED_COLUMNS.length) add("F07_COLUMNS_MISSING_OR_UNEXPECTED");
  for(const c of ["certified_performance","physical_pit_verified","final_selection_authorized"]) {
    const col=cols.find(x=>x.name===c);
    if(!col || String(col.dflt_value)!=="0" || Number(col.notnull)!==1
       ||!includesExpr(ddl,`CHECK (${c} = 0)`)) add("F07_ZERO_AUTHORITY_GUARD_MISSING:"+c);
  }
  if(!includesExpr(ddl,"UNIQUE (decision_id, lineage_hash, revision_number)")
      ||!includesExpr(ddl,"CHECK ((revision_number = 1 AND previous_revision_hash IS NULL)")
      ||!includesExpr(ddl,"OR (revision_number > 1 AND previous_revision_hash IS NOT NULL))"))
     add("F07_REVISION_CHAIN_SQL_CONSTRAINT_MISSING");
  const pk=cols.find(x=>x.name==="revision_id");
  if(!pk||Number(pk.pk)!==1) add("F07_IMMUTABLE_REVISION_KEY_MISSING");
  for(const [name,columns] of INDEXES) {
    const indexes=find("index",name);
    if(indexes.length!==1 || !indexes[0].sql
       ||!includesExpr(indexes[0].sql,`ON ${TABLE} (${columns.join(", ")})`))
      add("F07_NAMED_INDEX_MISSING:"+name);
  }
  for(const [name,action] of TRIGGERS) {
    const triggers=find("trigger",name);
    const ddlTrigger=NORMALIZE(triggers[0]?.sql);
    if(triggers.length!==1
       ||!ddlTrigger.includes(`BEFORE ${action} ON ${TABLE.toUpperCase()}`)
       ||!ddlTrigger.includes("RAISE(ABORT, S2_OUTCOME_REVISION_IMMUTABLE)"))
      add("F07_ANTI_MUTATION_TRIGGER_MISSING:"+name);
  }
  if(records.some(x=>!["table","index","trigger"].includes(x.type)
       ||x.tbl_name!==TABLE))add("F07_SCHEMA_CATALOG_INCONSISTENT");
  function add(code){errors.add(code);}
  const base={
    schemaVersion:S2_F07_SCHEMA_READBACK_VERSION,
    targetTable:TABLE,
    bindingName,
    expectedColumnCount:REQUIRED_COLUMNS.length,
    readColumnCount:cols.length,
    expectedIndexCount:INDEXES.length,
    expectedTriggerCount:TRIGGERS.length,
    inspectionQueryCount:queries.length,
    queriedSqlStatements:Object.freeze(queries),
    state:errors.size===0?"STRUCTURALLY_MATCHED_READONLY_UNCERTIFIED":"SCHEMA_MISSING_OR_INCONSISTENT",
    blockerCodes:Object.freeze([...errors].sort()),
    physicalD1Authenticated:false,
    accountWideQuotaReserved:false,
    schemaAppliedByThisCode:false,
    migrationAuthorized:false,
    d1WriteAuthorized:false,
    tradingAuthorized:false,
    system1FormalCoreImpact:false,
  };
  return deepFreeze({...base,schemaInspectionHash:await sha256Hex(base)});
}
