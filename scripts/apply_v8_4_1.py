from pathlib import Path

path=Path("Worker.js")
text=path.read_text(encoding="utf-8")

def replace_once(old,new,label):
    global text
    count=text.count(old)
    if count!=1:
        raise SystemExit(f"{label}: expected 1 match, found {count}")
    text=text.replace(old,new,1)

replace_once(
    'const VERSION = "8.4.0-github-encrypted-mirror";',
    'const VERSION = "8.4.1-provider-neutral-evidence";',
    "runtime version"
)

replace_once(
    '26:"3Min完整POST＋readback",27:"每日結果／0檔回報",',
    '26:"完整計畫外部鏡像＋readback",27:"每日結果／0檔回報",',
    "requirement 26 provider-neutral label"
)

replace_once(
'''    const baseEvidence=rule===11 ? "V8.0.1官方財報/Q4單季EPS公式與正式驗收"
      : rule===26 && !incompleteRules.includes(26) ? "本期V7_PLAN_2真實POST＋3Min精確readback"
      : null;''',
'''    const requirement26Proof=latest?.diagnostics?.requirements30?.requirement26?.proof ||
      (latest?.planBridge?.provider===GITHUB_MIRROR_PROVIDER
        ? "D1主封存＋GitHub AES-256-GCM加密鏡像精確readback"
        : latest?.pipeline?.firebaseVerified===true
          ? "D1主封存＋Firestore外部鏡像精確readback"
          : latest?.pipeline?.threeMinVerified===true
            ? "既有3Min完整payload精確readback"
            : null);
    const baseEvidence=rule===11 ? "V8.0.1官方財報/Q4單季EPS公式與正式驗收"
      : rule===26 && !incompleteRules.includes(26) ? requirement26Proof
      : null;''',
    "requirement 26 provider-neutral evidence"
)

path.write_text(text,encoding="utf-8")
print("Applied V8.4.1 provider-neutral requirement evidence")
