'use client';
import { TRANSACTIONS } from '@/lib/data';

const TRAIL = [
  { id: 'SAT-001', actor: 'Min. Dithapelo Keoagile', role: 'GOVT_L1', action: 'POLICY_APPROVED', entity: 'global_policy', entity_id: 'POL-2026-V3', hash: 'a3f8c2...d9e1', ts: '2026-05-01 09:14:32' },
  { id: 'SAT-002', actor: 'Dr. Omphile Ntshimogang',  role: 'GOVT_L2', action: 'POLICY_PROPOSED', entity: 'policy_proposals', entity_id: 'PROP-001', hash: 'b7d2a1...3f8c', ts: '2026-05-06 11:22:10' },
  { id: 'SAT-003', actor: 'Onkabetse Keeme', role: 'EVALUATOR', action: 'AUDIT_SUBMITTED',  entity: 'rerra_audits', entity_id: 'AUD-001', hash: 'c1e4b2...9a7f', ts: '2026-04-15 14:05:00' },
  { id: 'SAT-004', actor: 'Mpho Gabaraane',  role: 'TENANT',    action: 'RENT_PAYMENT',     entity: 'rerra_financial_logs', entity_id: 'TXN-8821', hash: 'd9f3a8...1c2b', ts: '2026-05-01 08:30:00' },
  { id: 'SAT-005', actor: 'Tebogo Modise',   role: 'LANDLORD',  action: 'PROPERTY_REGISTERED', entity: 'properties', entity_id: 'PLOT-001-GAB', hash: 'e2c7d4...5a3f', ts: '2026-01-10 10:00:00' },
  { id: 'SAT-006', actor: 'Tsholofelo Odi',  role: 'EVALUATOR', action: 'AUDIT_REJECTED',   entity: 'rerra_audits', entity_id: 'AUD-003', hash: 'f8a1b3...2d9c', ts: '2026-05-07 16:45:00' },
];

const ACTION_COLORS: Record<string, string> = {
  POLICY_APPROVED: '#34d399', POLICY_PROPOSED: '#a78bfa',
  AUDIT_SUBMITTED: '#60a5fa', AUDIT_REJECTED: '#f87171',
  RENT_PAYMENT: '#fbbf24',   PROPERTY_REGISTERED: '#06b6d4',
};

export default function AuditTrailPage() {
  return (
    <div style={{ padding: '32px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div className="badge badge-red" style={{ marginBottom: 8 }}>🔐 NAO — NATIONAL AUDIT OFFICE</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Audit Trail (Merkle-Chained)</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Tamper-evident, SHA-256 chained log. Any modification breaks the hash chain and triggers an alert.
          Read-only access for the National Audit Office.
        </p>
      </div>

      <div className="alert alert-success" style={{ marginBottom: 20 }}>
        <span>✅</span>
        <div><strong>Chain Integrity: VALID</strong> — All {TRAIL.length} log entries verified. Merkle root: <code style={{ fontSize: 11 }}>8fa3c2d9...b1e4f7</code></div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>#</th><th>Timestamp</th><th>Actor</th><th>Role</th><th>Action</th><th>Entity</th><th>Entity ID</th><th>SHA-256</th></tr>
            </thead>
            <tbody>
              {TRAIL.map((l, i) => (
                <tr key={l.id}>
                  <td style={{ color: 'var(--text-muted)', fontFamily: 'monospace', fontSize: 11 }}>{l.id}</td>
                  <td style={{ color: 'var(--text-secondary)', fontSize: 11, fontFamily: 'monospace' }}>{l.ts}</td>
                  <td style={{ fontWeight: 500 }}>{l.actor}</td>
                  <td><span className="badge badge-blue" style={{ fontSize: 10 }}>{l.role}</span></td>
                  <td>
                    <span style={{ color: ACTION_COLORS[l.action] ?? 'var(--text-primary)', fontWeight: 600, fontSize: 12 }}>
                      {l.action}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-secondary)' }}>{l.entity}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 11, color: '#60a5fa' }}>{l.entity_id}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>{l.hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="alert alert-warning" style={{ marginTop: 16 }}>
        <span>⚠️</span>
        <div>This ledger is <strong>append-only</strong>. UPDATE permission is revoked for all roles including Level 1. Access requires a Level 1 Government digital signature per session.</div>
      </div>
    </div>
  );
}
