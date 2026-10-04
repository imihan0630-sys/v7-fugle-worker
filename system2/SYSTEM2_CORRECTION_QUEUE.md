# System 2 Correction Queue

Updated: 2026-10-04 Asia/Taipei
Status: ACTIVE
Governance: `system2/SYSTEM2_CORRECTION_GOVERNANCE_V0_1.md`
Machine-readable companion: `system2/SYSTEM2_CORRECTION_QUEUE.json`

## Queue rules

- GitHub main is canonical.
- Every directive uses an immutable `S2-CORR-YYYYMMDD-NNN` ID.
- CRITICAL/HIGH items are not self-closed by the implementation role.
- `FIX_IMPLEMENTED` is not equivalent to `VERIFIED_CLOSED`.
- Original evidence is never deleted when status changes.
- Protected Class B/Class C or Formal-Core decisions require owner approval.

## Open directives

None at activation.

## Closed directives

None at activation.

## Next action

When the independent correction auditor identifies a material issue, append the directive here and update the JSON companion in the same change.
