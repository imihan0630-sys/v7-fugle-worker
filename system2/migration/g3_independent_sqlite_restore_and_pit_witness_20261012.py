#!/usr/bin/env python3
"""Independent G3 auditor-side restored SQLite witness from an authenticated, original-SHA SQL.
Runs only on protected ephemeral GitHub runner. Emits aggregate counts/digests, NEVER rows/keys.
No Cloudflare API, source export, destination import, Shadow or public SQL output.
"""
import datetime
import hashlib
import json
import os
import sqlite3
import sys
import tempfile
from collections import Counter

SOURCE_SQL_SHA="56cd6ebc449949d67a7123da2a2300d685f3d5a2412383a3afc217001c4e5f12"
def die(reason): raise ValueError("G3_INDEPENDENT_"+reason)
def sha(b): return hashlib.sha256(b).hexdigest()
def canonical(v):
    if isinstance(v, bytes): return {"blob_sha256":sha(v),"bytes":len(v)}
    if isinstance(v, (str,int,float,type(None))): return v
    die("UNKNOWN_SQL_VALUE_TYPE")
def ts(s):
    if not isinstance(s,str) or not s: return None
    try:
        obj=datetime.datetime.fromisoformat(s.replace("Z","+00:00"))
        return obj.astimezone(datetime.timezone.utc) if obj.tzinfo else None
    except (ValueError,TypeError,OverflowError): return None
def run(sqlpath):
    if not os.path.isfile(sqlpath) or os.path.islink(sqlpath): die("SQL_NOT_PRESENT")
    size=os.stat(sqlpath).st_size
    if size != 316938975: die("SQL_BYTES_DRIFT")
    h=hashlib.sha256()
    with open(sqlpath,"rb") as f:
        for chunk in iter(lambda:f.read(1024*1024),b""): h.update(chunk)
    if h.hexdigest()!=SOURCE_SQL_SHA: die("ORIGINAL_SQL_SHA_MISMATCH")
    with tempfile.TemporaryDirectory(prefix="g3-independent-restore-") as temp:
        os.chmod(temp,0o700)
        path=os.path.join(temp,"audit.sqlite3")
        c=sqlite3.connect(path)
        # A different code path from producer's inline Python. Create a fresh SQLite DB
        # from the exact authenticated ORIGINAL SQL, not producer's earlier restored DB.
        with open(sqlpath,"r",encoding="utf-8") as f: c.executescript(f.read())
        if c.execute("PRAGMA quick_check").fetchone()[0] != "ok": die("SQLITE_QUICK_CHECK_FAILED")
        integrity=c.execute("PRAGMA integrity_check").fetchone()[0]
        if integrity!="ok": die("SQLITE_FULL_INTEGRITY_CHECK_FAILED")
        tables=sorted(x[0] for x in c.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 's2_%'"))
        indexes=sorted(x[0] for x in c.execute(
            "SELECT name FROM sqlite_master WHERE type='index' AND name LIKE 'idx_s2_%'"))
        if len(tables)!=55 or len(indexes)!=63: die("SCHEMA_DRIFT")
        content={};counts={};frozen={}
        for table in tables:
            if not table.replace("_","").isalnum(): die("UNSAFE_TABLE_NAME")
            columns=[r[1] for r in c.execute('PRAGMA table_info("'+table+'")')]
            col_digest=hashlib.sha256(json.dumps(columns,separators=(",",":"),ensure_ascii=False).encode()).hexdigest()
            h=hashlib.sha256();h.update(("S2_G3_TABLE_V1:"+table+":"+col_digest+"\\n").encode())
            # sqlite rowid is original insertion-order independent of query planner.
            # This root is a *replay-content witness*, not a remote account proof.
            n=0
            for row in c.execute('SELECT * FROM "'+table+'" ORDER BY rowid'):
                payload=json.dumps([canonical(x) for x in row],ensure_ascii=False,separators=(",",":"),allow_nan=False).encode()
                h.update(len(payload).to_bytes(8,"big"));h.update(payload);n+=1
            counts[table]=n;content[table]={"rows":n,"columnSha256":col_digest,"contentSha256":h.hexdigest()}
        if sum(counts.values()) != 113222 or counts["s2_historical_a1_bars"]!=84688:
            die("FULL_ROW_SUM_DRIFT")
        if counts["s2_historical_ingest_batches"]!=129 or counts["s2_decisions"]!=0:
            die("BATCH_OR_FROZEN_DRIFT")
        globalRoot=sha(json.dumps(content,sort_keys=True,separators=(",",":")).encode())
        possible=[x for x in tables if any(k in x for k in ("decision","frozen","snapshot","archive","shadow","outcome","revision","resonance"))]
        frozen={x:counts[x] for x in possible}
        barsCols=[r[1] for r in c.execute('PRAGMA table_info(s2_historical_a1_bars)')]
        manifest={r[0]:{"rows":r[1],"pit":r[2],"unknown":r[3]} for r in c.execute(
            "SELECT batch_id,row_count,pit_eligible_count,unknown_availability_count FROM s2_historical_ingest_batches")}
        if len(manifest)!=129: die("DUPLICATE_BATCH_MANIFEST")
        grouped={}
        c2=c.execute("""SELECT batch_id,market_date,source_id,source_url,
          observed_at,available_at,captured_at,availability_basis,pit_availability_class,
          pit_replay_eligible,source_row_hash,bar_hash FROM s2_historical_a1_bars""")
        indices={name:i for i,name in enumerate([d[0] for d in c2.description])}
        sourceClass=Counter();availabilityBasis=Counter();pitClass=Counter()
        invalidTimestamps=0;missingAvailableAt=0;futureAvailability=0;noHashes=0
        for row in c2:
            x=dict(zip(indices,row));key=x["batch_id"]
            d=grouped.setdefault(key,{"n":0,"pit":0,"min_date":x["market_date"],"max_date":x["market_date"],
                                      "strictClockParsed":0,"bad":0})
            d["n"]+=1
            d["min_date"]=min(d["min_date"],x["market_date"]);d["max_date"]=max(d["max_date"],x["market_date"])
            a=ts(x["available_at"]);o=ts(x["observed_at"]);cap=ts(x["captured_at"])
            if a is None or o is None or cap is None:
                invalidTimestamps+=1;d["bad"]+=1
            else:
                d["strictClockParsed"]+=1
                if a>o:
                    futureAvailability+=1;d["bad"]+=1
            if not x["available_at"]:missingAvailableAt+=1;d["bad"]+=1
            if not x["source_row_hash"] or not x["bar_hash"]:noHashes+=1;d["bad"]+=1
            if x["pit_replay_eligible"]==1:d["pit"]+=1
            else:d["bad"]+=1
            sourceClass[sha(str(x["source_id"]).encode())[:16]]+=1
            availabilityBasis[str(x["availability_basis"])[:48]]+=1
            pitClass[str(x["pit_availability_class"])[:48]]+=1
        if sum(v["n"] for v in grouped.values())!=84688:die("BARS_COUNT_DRIFT")
        batches=[]
        for key,x in grouped.items():
            m=manifest.get(key)
            if not m:die("ORPHAN_BATCH")
            aligned=x["n"]==m["rows"] and x["pit"]==m["pit"] and m["unknown"]==0
            passed=aligned and x["bad"]==0 and x["pit"]==x["n"]
            batches.append({"fingerprint":sha(key.encode()),"rows":x["n"],"earliestMarketDate":x["min_date"],
                            "latestMarketDate":x["max_date"],"archivedManifestMatches":aligned,
                            "selfReportedFieldsPass":passed})
        batches.sort(key=lambda x:(x["earliestMarketDate"],x["fingerprint"]))
        selected=[];total=0
        for x in batches:
            if x["selfReportedFieldsPass"] and total+x["rows"]<=12000:
                selected.append(x["fingerprint"]);total+=x["rows"]
        # These are PIT source self-reports. Independent original provider publication
        # timestamp is not stored as a separate firstKnownAt column in A1 schema.
        # No candidate can be promoted to first-known-at-certified from this SQL.
        result={
          "schemaVersion":"S2_G3_INDEPENDENT_PROTECTED_ORIGINAL_SQL_SQLITE_RESTORE_20261012_V0_1",
          "input":"EXISTING_AES_RSA_WRAPPED_ORIGINAL_SOURCE_BACKUP_UNMODIFIED",
          "sourceSqlSHA256":SOURCE_SQL_SHA,"sourceSqlBytes":size,
          "sqliteQuickCheck":"ok","sqliteIntegrityCheck":"ok",
          "tableCount":len(tables),"indexCount":len(indexes),"sourceTotalRows":sum(counts.values()),
          "populatedTables":sum(n>0 for n in counts.values()),
          "sourceTableCounts":counts,"sourcePerTableContentWitness":content,
          "wholeDatabaseContentRootSHA256":globalRoot,
          "decisionsTableRows":counts["s2_decisions"],"possibleDecisionAndSnapshotTables":frozen,
          "externalR2FrozenRootsScanned":False,"historicalRemoteFrozenAbsenceProven":False,
          "historicalRemoteR2ObjectBytesRead":False,
          "a1SourceRows":84688,"batchManifestRows":129,"populatedBarBatches":len(batches),
          "batchManifestAligned":sum(x["archivedManifestMatches"] for x in batches),
          "selfReportedFieldsPassingBatches":sum(x["selfReportedFieldsPass"] for x in batches),
          "invalidTimestampRows":invalidTimestamps,"missingAvailableAtRows":missingAvailableAt,
          "availableAfterObservedRows":futureAvailability,"missingBarSourceHashes":noHashes,
          "firstKnownAtFieldExistsOnA1":"first_known_at" in barsCols or "firstKnownAt" in barsCols,
          "providerPublicationClockExternallyVerified":False,
          "sourceIdHashedDistribution":dict(sourceClass),
          "availableBasisDistribution":dict(availabilityBasis),
          "pitAvailabilityClassDistribution":dict(pitClass),
          "provisionalBatchFingerprints":selected,"provisionalSelectedBatchCount":len(selected),
          "provisionalSelectedBarRows":total,
          "independentlyQualifiedPITBarRows":0,
          "independentlyQualifiedPITBatchCount":0,
          "provisionalBarsQuarantinedFromPITPromotion":total,
          "actualDestinationD1RowsImported":0,
          "newSecretOrPermissions":0,"CloudflareCalls":0,
          "permissionToImport":False,"G3FullGatePassed":False,
          "status":"INDEPENDENT_SQLITE_RESTORE_AND_CONTENT_ROOT_PASS__EXTERNAL_FIRSTKNOWNAT_AND_FROZEN_PROVENANCE_PENDING"
        }
        c.close()
        return result
if __name__=="__main__":
    try:
        if len(sys.argv)!=2:die("USAGE")
        result=run(sys.argv[1])
        print(json.dumps(result,sort_keys=True,separators=(",",":"),ensure_ascii=False))
    except Exception as e:
        msg=str(e)
        print(msg if msg.startswith("G3_INDEPENDENT_") else "G3_INDEPENDENT_FAIL_CLOSED",file=sys.stderr)
        sys.exit(2)
