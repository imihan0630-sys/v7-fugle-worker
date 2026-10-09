import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { inspectS2F07OutcomeArchiveSchemaV0_1 as inspect } from "../runtime/f07_outcome_archive_readonly_schema_preflight_v0_1.mjs";

const ddl=readFileSync(new URL("../sql/0011_outcome_revision_archive_staged.sql",import.meta.url),"utf8");
function fixture(mode="correct") {
  const python=String.raw`
import sqlite3,sys,json
payload=json.loads(sys.stdin.read())
db=sqlite3.connect(":memory:")
db.row_factory=sqlite3.Row
schema=payload["schema"]
mode=payload["mode"]
if mode=="no_trigger":schema=schema.replace("CREATE TRIGGER IF NOT EXISTS s2_outcome_revision_block_update","--CREATE TRIGGER IF NOT EXISTS s2_outcome_revision_block_update").replace("BEFORE UPDATE ON s2_outcome_revision_archive","--BEFORE UPDATE ON s2_outcome_revision_archive").replace("  BEGIN SELECT RAISE(ABORT, 'S2_OUTCOME_REVISION_IMMUTABLE'); END;","--  BEGIN SELECT RAISE(ABORT, 'S2_OUTCOME_REVISION_IMMUTABLE'); END;",1)
if mode=="missing_index":schema=schema.replace("CREATE INDEX IF NOT EXISTS idx_s2_outcome_revision_regime","-- CREATE INDEX IF NOT EXISTS idx_s2_outcome_revision_regime").replace("  ON s2_outcome_revision_archive (regime_snapshot_id, regime_hash, observed_at);","--  ON s2_outcome_revision_archive (regime_snapshot_id, regime_hash, observed_at);")
if mode=="missing_schema":schema="CREATE TABLE other_table (id INTEGER PRIMARY KEY);"
db.executescript(schema)
if mode=="correct":
  fields=dict(revision_id="R1",revision_hash="f"*64,decision_id="D1",decision_hash="a"*64,
    strategy_id="SHORT_MOMENTUM",strategy_version="S",regime_snapshot_id="G",regime_hash="b"*64,
    lineage_hash="c"*64,revision_number=1,previous_revision_hash=None,execution_hash="d"*64,
    cost_model_hash="e"*64,cost_scenario_hash="e"*64,outcome_hash="e"*64,observed_at="2026-10-09T00:00:00Z",
    outcome_json="{}",receipt_json="{}",schema_version="S2_OUTCOME_REVISION_ARCHIVE_V0_1")
  fields.update(certified_performance=0,physical_pit_verified=0,final_selection_authorized=0)
  cols=list(fields)
  db.execute("INSERT INTO s2_outcome_revision_archive ("+",".join(cols)+") VALUES ("+",".join("?" for _ in cols)+")",list(fields.values()))
  blocked=0
  for sql in ["UPDATE s2_outcome_revision_archive SET observed_at='2026-10-10' WHERE revision_id='R1'",
    "DELETE FROM s2_outcome_revision_archive WHERE revision_id='R1'",
    "INSERT INTO s2_outcome_revision_archive ("+",".join(cols)+") VALUES ("+",".join("?" for _ in cols)+")"]:
    try: db.execute(sql,list(fields.values()) if sql.startswith("INSERT") else [])
    except sqlite3.IntegrityError:blocked+=1
    else:raise AssertionError("unexpected archive mutation")
  assert blocked==3
catalog=[dict(x) for x in db.execute("SELECT type, name, tbl_name, sql FROM sqlite_master WHERE tbl_name = ? AND type IN ('table','index','trigger')",["s2_outcome_revision_archive"])]
cols=[dict(x) for x in db.execute('SELECT name, type, "notnull", pk, dflt_value FROM pragma_table_info(?)',["s2_outcome_revision_archive"])]
print(json.dumps({"catalog":catalog,"columns":cols}))
`;
 const run=spawnSync("python3",["-c",python],{
  input:JSON.stringify({schema:ddl,mode}),encoding:"utf8",
 });
 assert.equal(run.status,0,run.stderr);
 return JSON.parse(run.stdout);
}
class DB {
 constructor(data){this.data=data;this.queries=[];this.writeAttempts=0;}
 prepare(sql){
  assert.match(sql,/^SELECT /);
  this.queries.push(sql);
  return {bind:(...p)=>({all:async()=>{
   assert.deepEqual(p,["s2_outcome_revision_archive"]);
   if(sql.includes("sqlite_master"))return {results:this.data.catalog};
   if(sql.includes("pragma_table_info"))return {results:this.data.columns};
   throw Error("UNEXPECTED_QUERY");
  }})};
 }
 batch(){this.writeAttempts++;throw Error("WRITES_FORBIDDEN");}
}
const data=fixture();
const db=new DB(data);
const ok=await inspect({db});
assert.equal(ok.state,"STRUCTURALLY_MATCHED_READONLY_UNCERTIFIED",ok.blockerCodes.join("|"));
assert.equal(ok.expectedColumnCount,22);
assert.equal(ok.inspectionQueryCount,2);
assert.equal(ok.d1WriteAuthorized,false);
assert.equal(ok.schemaAppliedByThisCode,false);
assert.equal(ok.physicalD1Authenticated,false);
assert.equal(ok.accountWideQuotaReserved,false);
assert.equal(db.queries.length,2);
assert.equal(db.writeAttempts,0);
assert.equal(Object.isFrozen(ok),true);
assert.equal((await inspect({db:new DB(data)})).schemaInspectionHash,ok.schemaInspectionHash);
await assert.rejects(()=>inspect({db,bindingName:"DB"}),/FORBIDDEN_D1_BINDING/);
await assert.rejects(()=>inspect({}),/READONLY_D1_REQUIRED/);
const corrupt=db instanceof DB?new DB({
 ...data,columns:data.columns.filter(c=>c.name!=="receipt_json"),
}):null;
const incomplete=await inspect({db:corrupt});
assert.equal(incomplete.state,"SCHEMA_MISSING_OR_INCONSISTENT");
assert.ok(incomplete.blockerCodes.includes("F07_COLUMNS_MISSING_OR_UNEXPECTED"));
const mutation=JSON.parse(JSON.stringify(data));
mutation.catalog.find(x=>x.name==="s2_outcome_revision_block_delete").sql=
 'CREATE TRIGGER s2_outcome_revision_block_delete AFTER DELETE ON s2_outcome_revision_archive BEGIN SELECT 1; END';
const noProtection=await inspect({db:new DB(mutation)});
assert.ok(noProtection.blockerCodes.includes("F07_ANTI_MUTATION_TRIGGER_MISSING:s2_outcome_revision_block_delete"));
const noIndex=await inspect({db:new DB(fixture("missing_index"))});
assert.ok(noIndex.blockerCodes.includes("F07_NAMED_INDEX_MISSING:idx_s2_outcome_revision_regime"));
const absent=await inspect({db:new DB(fixture("missing_schema"))});
assert.ok(absent.blockerCodes.includes("F07_ARCHIVE_TABLE_MISSING_OR_AMBIGUOUS"));
const lacksZero=JSON.parse(JSON.stringify(data));
lacksZero.catalog.find(x=>x.type==="table").sql=lacksZero.catalog.find(x=>x.type==="table").sql.replace("CHECK (certified_performance = 0)","CHECK (certified_performance IN (0,1))");
const blocked=await inspect({db:new DB(lacksZero)});
assert.ok(blocked.blockerCodes.includes("F07_ZERO_AUTHORITY_GUARD_MISSING:certified_performance"));
console.log("System2 F07 SQLite schema introspection + 3 mutation attempts + 5 adversarial catalog probes PASS (only 2 SELECTs; no physical D1)");
