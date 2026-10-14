#!/usr/bin/env python3
"""M07 offline source R2 unmatched HASHED identities only; no network.
Owns no public key paths. Protected original G3 SQL + original private R2 inventory.
"""
import hashlib,json,os,sqlite3,sys,tempfile
from pathlib import Path
from issue1236_m07_full_original_r2_list_d1_manifest_join_v0_1 import (
  SOURCE_SQL_SHA,TABLES,load_original_list,match_original_source_manifest,sha,fail)
EXTRAS=498
OUT="/tmp/s2-m07-g3-unmatched-498"
def extract_unmatched(db,inventory,receipt):
    pre=match_original_source_manifest(db,inventory,receipt)
    if pre["sourceD1ManifestRowsScanned"]!=25823 or (
      pre["sourceD1ManifestPresenceAndSizeMatchingRows"]!=25823 or
      pre["sourceD1ManifestNotFoundInSourceR2List"]!=0 or
      pre["sourceD1ManifestFoundWithSizeMismatch"]!=0 or
      pre["sourceR2ListedObjectsWithNoSourceD1PackOrSegmentManifest"]!=EXTRAS):
        fail("EXTRA_BASELINE_OR_PARITY_NOT_CERTIFIED")
    manifest_ids=set()
    for table in TABLES:
        for (key,) in db.execute(f'SELECT object_key FROM "{table}"'):
            if not isinstance(key,str) or not key:fail("SOURCE_KEY_INVALID")
            manifest_ids.add(sha(key.encode("utf8")))
    if len(manifest_ids)!=25823:fail("MANIFEST_KEY_UNIQUENESS")
    items=sorted([[k,v] for k,v in inventory.items() if k not in manifest_ids])
    if len(items)!=EXTRAS:fail("EXTRA_TOTAL_DRIFT")
    extra_bytes=sum(i[1] for i in items)
    if not (0<=extra_bytes<=receipt["listedBytesObserved"]):fail("EXTRA_BYTES_OVER_TOTAL")
    return pre,items,extra_bytes

def run(sql_path,inv_file,summary_file):
    sql=Path(sql_path)
    if not sql.is_file() or sql.is_symlink() or sql.stat().st_size!=316938975:
        fail("ORIGINAL_SOURCE_SQL_SIZE")
    h=hashlib.sha256()
    with sql.open("rb") as stream:
        for block in iter(lambda:stream.read(1<<20),b""):h.update(block)
    if h.hexdigest()!=SOURCE_SQL_SHA:fail("ORIGINAL_SOURCE_SQL_SHA")
    inv,receipt=load_original_list(inv_file,summary_file)
    with tempfile.TemporaryDirectory(prefix="s2-m07-498-") as tmp:
        os.chmod(tmp,0o700)
        db=sqlite3.connect(os.path.join(tmp,"original.sqlite"))
        try:
            db.executescript(sql.read_text(encoding="utf8"))
            if db.execute("PRAGMA integrity_check").fetchone()[0]!="ok":
                fail("SOURCE_SQLITE_RESTORE_INTEGRITY")
            pre,extras,extra_bytes=extract_unmatched(db,inv,receipt)
        finally:db.close()
    os.makedirs(OUT,mode=0o700,exist_ok=True)
    raw=b"".join((json.dumps(item,separators=(",",":"))+"\n").encode("utf8") for item in extras)
    with open(OUT+"/private-unmatched-r2-hashes.jsonl","xb") as f:
        os.chmod(f.fileno(),0o600)
        f.write(raw)
    return {
      "schemaVersion":"S2_M07_PROTECTED_G3_SOURCE_498_R2_UNMATCHED_HASH_KEYS_V0_1",
      "status":"SOURCE_R2_498_UNMATCHED_PRIVATE_KEYHASHES_ANCHORED_TO_G3__OWNERSHIP_UNKNOWN",
      "sourceOriginalSQLSha256":SOURCE_SQL_SHA,
      "sourceR2OriginalPrivateInventoryKeys":len(inv),
      "sourceR2OriginalPrivateInventoryBytes":receipt["listedBytesObserved"],
      "originalSourceD1AnnualAndSegmentManifests":25823,
      "originalManifestIdentityAndSizeMatched":pre["sourceD1ManifestPresenceAndSizeMatchingRows"],
      "originalMissingAndWrongSize":pre["sourceD1ManifestNotFoundInSourceR2List"]+pre["sourceD1ManifestFoundWithSizeMismatch"],
      "extraKeyHashCount":len(extras),
      "extraListedBytes":extra_bytes,
      "extraPrivateKeyHashListSHA256":sha(raw),
      "extraPrivateKeyHashListBytes":len(raw),
      "extraPrivateListContainsRawObjectKeys":False,
      "extraKeyOwnershipCertified":False,
      "extraObjectsCanBeDeleted":False,
      "sourceR2ListNonAtomic":True,
      "originalSourceR2BodyShaVerifiedByThisRun":0,
      "sourceR2NetworkCalls":0,"sourceD1NetworkCalls":0,"destinationD1Writes":0,
      "newSecretsOrPaidResources":False,"independentAuditAccepted":False
    }
if __name__=="__main__":
    try:
        if len(sys.argv)!=4:fail("EXPECTED_SQL_LIST_SUMMARY")
        r=run(*sys.argv[1:])
        Path(OUT+"/sanitized-unmatched-summary.json").write_text(
            json.dumps(r,sort_keys=True,indent=2)+"\n",encoding="utf8")
        print(json.dumps({"status":r["status"],"extras":r["extraKeyHashCount"],
            "extraListedBytes":r["extraListedBytes"],
            "hashListSha256":r["extraPrivateKeyHashListSHA256"],
            "originalMatched":r["originalManifestIdentityAndSizeMatched"],
            "cloudflareCalls":0,"writes":0},separators=(",",":")))
    except Exception as e:
        msg=str(e)
        print(msg if msg.startswith("M07_FULL_LIST_JOIN_") else
          "M07_EXTRA_UNKNOWN_FAIL_CLOSED",file=sys.stderr)
        sys.exit(2)
