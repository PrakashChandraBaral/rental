'use client';
import { GOVT_ADMINS } from '@/lib/data';

export default function GovernmentPage() {
  return (
    <div style={{ padding: '32px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div className="badge badge-gold" style={{ marginBottom: 8 }}>🏛️ GOVERNMENT HIERARCHY</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Govt Officials & RBAC</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Four-Eyes principle: Level 2 Analysts propose, Level 1 Executives authorise with RSA-4096 hardware keys.
        </p>
      </div>

      {/* Level 1 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#fbbf24', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>👑</span> LEVEL 1 — EXECUTIVE COUNCIL (Policy Approvers)
        </div>
        <div className="grid-2">
          {GOVT_ADMINS.filter(g => g.clearance === 1).map(g => (
            <div key={g.id} className="card" style={{ borderColor: 'rgba(245,158,11,0.3)' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#f59e0b,#d97706)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>👑</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{g.name}</div>
                  <div style={{ fontSize: 12, color: '#fbbf24', marginTop: 2 }}>{g.role}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{g.dept}</div>
                  <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span className="badge badge-gold">RSA-4096 HSM Key</span>
                    <span className="badge badge-gold">FIPS 140-2 Level 3</span>
                    <span className="badge badge-green">MFA Active</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Level 2 */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#a78bfa', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>📊</span> LEVEL 2 — MACRO-ECONOMIC ANALYSTS (Policy Architects)
        </div>
        <div className="grid-2">
          {GOVT_ADMINS.filter(g => g.clearance === 2).map(g => (
            <div key={g.id} className="card" style={{ borderColor: 'rgba(139,92,246,0.3)' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>📊</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{g.name}</div>
                  <div style={{ fontSize: 12, color: '#a78bfa', marginTop: 2 }}>{g.role}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{g.dept}</div>
                  <div style={{ marginTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span className="badge badge-purple">Proposal Initiator</span>
                    <span className="badge badge-blue">Shadow Sim Access</span>
                    <span className="badge badge-green">TOTP MFA</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RBAC Matrix */}
      <div className="card">
        <div className="section-header"><div className="section-title">🔑 RBAC Access Matrix</div></div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Actor</th><th>Global Policy</th><th>Tier Caps</th><th>Financial Ledger</th><th>Identity Records</th><th>VAPS / Audit</th>
              </tr>
            </thead>
            <tbody>
              {[
                { actor: '👑 Level 1 (Executive)',  policy: 'Sign / Approve', tier: 'Sign / Approve', ledger: 'Read Only',       identity: 'Read Only',      vaps: 'Read Only' },
                { actor: '📊 Level 2 (Analyst)',    policy: 'Create Proposal',tier: 'Create / Edit',  ledger: 'Read Only',       identity: 'Read / Verify',  vaps: 'Read / Validate' },
                { actor: '🧑‍💼 Youth Evaluator',     policy: 'No Access',      tier: 'No Access',      ledger: 'No Access',       identity: 'No Access',      vaps: 'Create / Write' },
                { actor: '🏢 Corporate Manager',    policy: 'No Access',      tier: 'No Access',      ledger: 'Read (Company)',   identity: 'Read (Self)',     vaps: 'Create / Write' },
                { actor: '🔍 National Audit (NAO)', policy: 'Read Only',      tier: 'Read Only',      ledger: 'Full Audit Access',identity: 'Read Only',      vaps: 'Read Only' },
              ].map(r => (
                <tr key={r.actor}>
                  <td style={{ fontWeight: 600 }}>{r.actor}</td>
                  {[r.policy, r.tier, r.ledger, r.identity, r.vaps].map((v, i) => (
                    <td key={i} style={{
                      color: v === 'No Access' ? 'var(--text-muted)' :
                             v.includes('Full') || v.includes('Sign') ? '#34d399' :
                             v.includes('Create') ? '#60a5fa' : 'var(--text-secondary)',
                      fontSize: 12,
                    }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
