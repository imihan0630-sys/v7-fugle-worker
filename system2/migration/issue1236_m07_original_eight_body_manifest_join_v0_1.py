#!/usr/bin/env python3
"""M07 original archived 25,823 SOURCE D1 manifest rows vs eight real R2 body receipts.
Run strictly inside protected GitHub runner: never disclose raw keys, SQL, data.
"""
import hashlib, json, os, sqlite3, sys, tempfile
from pathlib import Path

ARCHIVED_SOURCE_SHA="56cd6ebc449949d67a7123da2a2300d685f3d5a2412383a3afc217001c4e5f12"
EIGHT_SOURCE_RECEIPT_SHA="d0db75e84922f2fe87758309fc125d374aee5abd194835e828da7e42a71a31c2"
BUCKET="system2-historical-research"
TABLES={"s2_historical_a1_pack_manifests":16100,"s2_historical_a1_segment_manifests":9723}
def sha(data): return hashlib.sha256(data).hexdigest()
def die(err): raise ValueError("M07_BATCH_JOIN_"+err)
def read_eight_original(raw):
    if sha(raw)!=EIGHT_SOURCE_RECEIPT_SHA:die("ORIGINAL_RECEIPT_SHA_DRIFT")
    try: d=json.loads(raw)
    except ValueError:die("INVALID_RECEIPT_JSON")
    if d.get("schemaVersion")!="S2_M07_SOURCE_R2_EIGHT_OBJECT_BOUND_BYTE_SHA_V0_1" or (
        d.get("status")!="SOURCE_R2_EIGHT_OBJECTS_SELF_SHA_MATCHED__MANIFEST_JOIN_PENDING" or
        d.get("sourceObjectBytesVerified")!=8 or
        d.get("sourceR2ListCalls")!=1 or d.get("sourceR2HeadCalls")!=8 or
        d.get("sourceR2GetObjectCalls")!=8 or
        d.get("originalSourceD1ManifestJoinVerified") is not False or
        d.get("sourceBucket")!=BUCKET or
        d.get("perItemByteCap")!=65536 or d.get("totalBodyByteCap")!=524288):
        die("SAMPLE_SCOPE_OR_QUOTA_DRIFT")
    rows=d.get("originalByteSelfShaVerifiedItems")
    if not isinstance(rows,list) or len(rows)!=8:die("SAMPLE_LIST_NOT_EIGHT")
    out={}; total=0
    for row in rows:
        key=row.get("privateObjectKeySha256")
        body=row.get("originalBodySha256")
        proof=row.get("originalHeadMetadataSha256")
        length=row.get("objectBytes")
        if not isinstance(key,str) or not isinstance(body,str) or not isinstance(proof,str) or (
            len(key)!=64 or len(body)!=64 or len(proof)!=64 or
            any(c not in "0123456789abcdef" for c in key+body+proof) or
            not isinstance(length,int) or isinstance(length,bool) or
            length<1 or length>65536 or body!=proof or
            row.get("sourceD1ManifestJoinVerified") is not False or key in out):
            die("SAMPLE_ITEM_INVALID_OR_DUPLICATE")
        out[key]={"body":body,"bytes":length}
        total+=length
    if total!=d.get("originalSourceBytesDownloaded") or total!=106698 or total>524288:
        die("SAMPLE_BODY_BYTES_OR_COUNT_DRIFT")
    return out

def match_batch_original_manifests(db, samples):
    if len(samples)!=8:die("INVALID_SAMPLE_COUNT")
    hits={key:[] for key in samples}
    total=0; counters={}
    for name, expected in TABLES.items():
        real=db.execute(f'SELECT COUNT(*) FROM "{name}"').fetchone()[0]
        if real!=expected:die("ORIGINAL_MANIFEST_COUNT_DRIFT")
        counters[name]=real
        for key, digest, length, bucket in db.execute(
            f'SELECT object_key, object_sha256, gzip_bytes, object_bucket FROM "{name}"'):
            total+=1
            if not isinstance(key,str) or not key:die("BAD_ORIGINAL_KEY")
            fingerprint=sha(key.encode("utf-8"))
            if fingerprint in hits:
                hits[fingerprint].append((name,digest,length,bucket))
    if total!=25823:die("MANIFEST_SCOPE_NOT_25823")
    match_count=0; matched_packs=0; matched_segments=0; absent=0
    for key, sample in samples.items():
        found=hits[key]
        if len(found)>1:die("ORIGINAL_D1_DUPLICATE_OBJECT_KEY")
        if not found:
            absent+=1;continue
        name, digest,length,bucket=found[0]
        if (not isinstance(digest,str) or digest.lower()!=sample["body"] or
            length!=sample["bytes"] or bucket!=BUCKET):
            die("ORIGINAL_R2_BODY_VS_D1_SHA_SIZE_BUCKET_MISMATCH")
        match_count+=1
        if name=="s2_historical_a1_pack_manifests":matched_packs+=1
        else:matched_segments+=1
    return {
        "schemaVersion":"S2_M07_EIGHT_ORIGINAL_R2_BODIES_VS_G3_D1_MANIFESTS_V0_1",
        "status":("EIGHT_SOURCE_R2_BYTES_MATCH_EIGHT_ORIGINAL_D1_MANIFESTS__AUDIT_PENDING"
            if match_count==8 else
            "PARTIAL_ORIGINAL_D1_MANIFEST_MATCH__UNMATCHED_NOT_CERTIFIED"),
        "restoredOriginalSourceSQLSha256":ARCHIVED_SOURCE_SHA,
        "originalSourceManifestsScanned":total,
        "sourcePackManifestRows":counters["s2_historical_a1_pack_manifests"],
        "sourceSegmentManifestRows":counters["s2_historical_a1_segment_manifests"],
        "originalR2BodiesPhysicallyVerifiedInSourceRun":8,
        "r2BodiesActuallyRedownloadedInThisOfflineRun":0,
        "r2BodiesMatchedArchivedD1":match_count,
        "matchingPackObjects":matched_packs,
        "matchingSegmentObjects":matched_segments,
        "noManifestKeyMatched":absent,
        "objectCountTotalUnknown":True,
        "fullR2BucketInventory":False,
        "historicalPITCertified":False,
        "frozenDecisionsCertified":False,
        "independentAuditorAccepted":False,
        "sourceD1RemoteQueries":0,
        "destinationD1RemoteQueries":0,
        "destinationD1Writes":0,
        "sourceR2CallsInCrosswalk":0,
        "newSecretsOrBilling":False,
    }

def audit_archive(sqlpath,receiptpath):
    path=Path(sqlpath)
    if path.is_symlink() or not path.is_file() or path.stat().st_size!=316938975:
        die("ORIGINAL_SOURCE_SQL_BYTES")
    h=hashlib.sha256()
    with path.open("rb") as f:
        for part in iter(lambda:f.read(1048576),b""):h.update(part)
    if h.hexdigest()!=ARCHIVED_SOURCE_SHA:die("ORIGINAL_SOURCE_SQL_SHA_DRIFT")
    samples=read_eight_original(Path(receiptpath).read_bytes())
    with tempfile.TemporaryDirectory(prefix="s2-m07-eight-join-") as temp:
        os.chmod(temp,0o700)
        db=sqlite3.connect(os.path.join(temp,"original.sqlite"))
        try:
            db.executescript(path.read_text(encoding="utf8"))
            if db.execute("PRAGMA integrity_check").fetchone()[0]!="ok":
                die("RESTORED_SQLITE_INTEGRITY")
            return match_batch_original_manifests(db,samples)
        finally:db.close()

if __name__=="__main__":
    try:
        if len(sys.argv)!=3:die("EXPECTED_SQL_AND_RECEIPT")
        print(json.dumps(audit_archive(sys.argv[1],sys.argv[2]),sort_keys=True,separators=(",",":")))
    except Exception as err:
        message=str(err)
        print(message if message.startswith("M07_BATCH_JOIN_") else "M07_BATCH_JOIN_UNEXPECTED_FAIL_CLOSED",file=sys.stderr)
        sys.exit(2)
