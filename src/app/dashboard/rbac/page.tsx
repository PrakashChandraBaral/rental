'use client';

const MATRIX = [
  { actor: '👑 Level 1 Executive',   policy: ['Sign','Approve'], tier: ['Sign','Approve'], ledger: ['Read'], identity: ['Read'], vaps: ['Read'], color: '#fbbf24' },
  { actor: '📊 Level 2 Analyst',     policy: ['Create','Edit'],  tier: ['Create','Edit'],  ledger: ['Read'], identity: ['Read','Verify'], vaps: ['Read','Validate'], color: '#a78bfa' },
  { actor: '🧑‍💼 Youth Evaluator',    policy: [],                 tier: [],                 ledger: [],       identity: [],      vaps: ['Create','Write'], color: '#fbbf24' },
  { actor: '🏢 Corporate Manager',   policy: [],                 tier: [],                 ledger: ['Read'], identity: ['Read'], vaps: ['Create','Write'], color: '#06b6d4' },
  { actor: '🔗 Leasing Agent',       policy: [],                 tier: [],                 ledger: [],       identity: ['Read'], vaps: [], color: '#60a5fa' },
  { actor: '🏠 Landlord (Individual)',policy: [],                 tier: [],                 ledger: ['Read'], identity: ['Read'], vaps: ['Declare'], color: '#34d399' },
  { actor: '👤 Tenant',              policy: [],                 tier: [],                 ledger: ['Read'], identity: ['Read'], vaps: ['Read'], color: '#34d399' },
  { actor: '🔍 NAO (Audit Office)',  policy: ['Read'],           tier: ['Read'],           ledger: ['Full Audit'], identity: ['Read'], vaps: ['Read'], color: '#f87171' },
];

const PERM_COLOR: Record<string,string> = {
  'Sign': '#fbbf24', 'Approve': '#fbbf24', 'Create': '#60a5fa', 'Edit': '#60a5fa',
  'Read': 'var(--text-secondary)', 'Verify': '#a78bfa', 'Validate': '#a78bfa',
  'Write': '#34d399', 'Declare': '#34d399', 'Full Audit': '#f87171',
};

export default function RBACPage() {
  return (
    <div style={{ padding: '32px', maxWidth: 1300, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div className="badge badge-purple" style={{ marginBottom: 8 }}>🔑 RBAC</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Role-Based Access Control</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Every API request re-validates the actor's <code>trust_score</code> and <code>is_active</code> status.
          Corporate revocations propagate within 60 seconds via Zero-Trust session invalidation.
        </p>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Actor</th>
                <th>Global Policy</th>
                <th>Tier Caps</th>
                <th>Financial Ledger</th>
                <th>Identity Records</th>
                <th>VAPS / Audit Data</th>
              </tr>
            </thead>
            <tbody>
              {MATRIX.map(r => (
                <tr key={r.actor}>
                  <td style={{ fontWeight: 700, color: r.color }}>{r.actor}</td>
                  {[r.policy, r.tier, r.ledger, r.identity, r.vaps].map((perms, i) => (
                    <td key={i}>
                      {perms.length === 0
                        ? <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>No Access</span>
                        : <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                            {perms.map(p => (
                              <span key={p} style={{ fontSize: 11, fontWeight: 600, color: PERM_COLOR[p] ?? 'var(--text-secondary)' }}>{p}</span>
                            ))}
                          </div>
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 20 }}>
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 12 }}>🔐 Authentication Requirements</div>
          {[
            { role: 'Level 1 Executive',   req: 'RSA-4096 HSM + FIPS 140-2 Level 3 hardware key' },
            { role: 'Level 2 Analyst',     req: 'TOTP or Biometric MFA' },
            { role: 'Youth Evaluator',     req: 'Mobile biometric + Device fingerprint lock' },
            { role: 'Corporate Director',  req: 'RSA-4096 private key (lease signing)' },
            { role: 'Tenant / Landlord',   req: 'Fingerprint / FaceID on mobile app' },
          ].map(a => (
            <div key={a.role} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: 13 }}>
              <div style={{ fontWeight: 600, minWidth: 160 }}>{a.role}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{a.req}</div>
            </div>
          ))}
        </div>
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 12 }}>⚡ Zero-Trust Session Rules</div>
          {[
            'Every API request re-validates trust_score + is_active',
            'Corporate staff revocation propagates in ≤60 seconds',
            'Evaluator app self-terminates if mock GPS detected',
            'Level 1 session requires hardware key re-auth per action',
            'NAO access requires per-session L1 digital signature',
          ].map((rule, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: 13 }}>
              <span style={{ color: '#34d399', flexShrink: 0 }}>✓</span>
              <span style={{ color: 'var(--text-secondary)' }}>{rule}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
