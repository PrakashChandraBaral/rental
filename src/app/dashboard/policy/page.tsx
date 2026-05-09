'use client';
import { useState } from 'react';
import { GLOBAL_POLICY, TIER_CAPS, POLICY_PROPOSALS, GOVT_ADMINS, formatPula } from '@/lib/data';

export default function PolicyPage() {
  const [proposals, setProposals] = useState(POLICY_PROPOSALS);
  const [showForm, setShowForm] = useState(false);
  const [simResult, setSimResult] = useState<string | null>(null);
  const [form, setForm] = useState({ variable: 'TIER_CAP A+/T1', current: '12000', proposed: '', reason: '' });

  function runSim() {
    const delta = parseFloat(form.proposed) - parseFloat(form.current);
    const impact = delta > 0
      ? `+BWP ${(delta * 11204 * 0.01).toLocaleString(undefined, { maximumFractionDigits: 0 })} projected annual levy increase`
      : `BWP ${Math.abs(delta * 11204 * 0.01).toLocaleString(undefined, { maximumFractionDigits: 0 })} projected annual levy decrease`;
    setSimResult(impact);
  }

  function submitProposal() {
    const p = {
      id: `PROP-${Date.now()}`,
      proposed_by: 'Dr. Omphile Ntshimogang',
      variable: form.variable,
      current: form.current,
      proposed: form.proposed,
      simulation_impact: simResult ?? 'Simulation pending',
      status: 'PENDING_L1',
      created_at: new Date().toISOString().split('T')[0],
    };
    setProposals(prev => [p, ...prev]);
    setShowForm(false);
    setSimResult(null);
    setForm({ variable: 'TIER_CAP A+/T1', current: '12000', proposed: '', reason: '' });
  }

  return (
    <div style={{ padding: '32px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div className="badge badge-purple" style={{ marginBottom: 8 }}>⚖️ REGULATORY CONTROL</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Policy Management</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Four-Eyes policy adjustment — Level 2 proposes, Level 1 authorises with RSA-4096 signature.
        </p>
      </div>

      {/* Active Policy Card */}
      <div className="card" style={{ marginBottom: 24, borderColor: 'var(--border-glow)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>ACTIVE POLICY · {GLOBAL_POLICY.policy_id}</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>Current Rate Configuration</h2>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {[
                { label: 'Govt Levy', value: `${(GLOBAL_POLICY.levy_rate * 100).toFixed(1)}%`, color: '#f59e0b' },
                { label: 'Collins Coy Fee', value: `${(GLOBAL_POLICY.coy_fee_rate * 100).toFixed(1)}%`, color: '#8b5cf6' },
                { label: 'Tech Fee', value: `${(GLOBAL_POLICY.tech_fee_rate * 100).toFixed(1)}%`, color: '#06b6d4' },
                { label: 'Landlord Net', value: `${((1 - GLOBAL_POLICY.levy_rate - GLOBAL_POLICY.coy_fee_rate - GLOBAL_POLICY.tech_fee_rate) * 100).toFixed(1)}%`, color: '#10b981' },
                { label: 'VAPS Multiplier', value: `BWP ${GLOBAL_POLICY.vaps_multiplier}/pt`, color: '#1a56db' },
              ].map(r => (
                <div key={r.label}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: r.color, fontFamily: 'Space Grotesk, sans-serif' }}>{r.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{r.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Last updated by</div>
            <div style={{ fontWeight: 600 }}>{GLOBAL_POLICY.updated_by}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{GLOBAL_POLICY.last_updated}</div>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => setShowForm(true)}>
              + Propose Change
            </button>
          </div>
        </div>
      </div>

      {/* Proposal Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: 24, borderColor: '#8b5cf6', boxShadow: '0 0 30px rgba(139,92,246,0.2)' }}>
          <h3 style={{ marginBottom: 16 }}>🧪 Shadow Simulation — Policy Proposal (Level 2)</h3>
          <div className="grid-2" style={{ gap: 16, marginBottom: 16 }}>
            <div className="form-group">
              <label className="form-label">Variable</label>
              <select className="form-select" value={form.variable} onChange={e => setForm(f => ({ ...f, variable: e.target.value }))}>
                <option>TIER_CAP A+/T1</option>
                <option>TIER_CAP A+/T2</option>
                <option>GOVT_LEVY_RATE</option>
                <option>COY_FEE_RATE</option>
                <option>VAPS_MULTIPLIER</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Current Value</label>
              <input className="form-input" value={form.current} onChange={e => setForm(f => ({ ...f, current: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Proposed Value</label>
              <input className="form-input" placeholder="Enter new value…" value={form.proposed} onChange={e => setForm(f => ({ ...f, proposed: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Justification</label>
              <input className="form-input" placeholder="Policy rationale…" value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} />
            </div>
          </div>
          {simResult && (
            <div className="alert alert-info" style={{ marginBottom: 16 }}>
              <span>📊</span>
              <div><strong>Shadow Simulation Result (12-month projection):</strong> {simResult} across {(11204).toLocaleString()} active leases.</div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-outline" onClick={runSim}>▶ Run Shadow Simulation</button>
            <button className="btn btn-primary" onClick={submitProposal} disabled={!simResult}>Send to Level 1 →</button>
            <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Proposals Table */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-header">
          <div className="section-title">Policy Proposals</div>
          <div className="badge badge-gold">Four-Eyes Protocol Active</div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>ID</th><th>Variable</th><th>Current</th><th>Proposed</th><th>Simulation Impact</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {proposals.map(p => (
                <tr key={p.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{p.id}</td>
                  <td style={{ fontWeight: 600 }}>{p.variable}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{p.current}</td>
                  <td style={{ color: '#10b981', fontWeight: 600 }}>{p.proposed}</td>
                  <td style={{ color: '#fbbf24', fontSize: 12 }}>{p.simulation_impact}</td>
                  <td>
                    <span className={`badge ${p.status === 'APPROVED' ? 'badge-green' : p.status === 'PENDING_L1' ? 'badge-purple' : 'badge-red'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{p.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tier Caps Grid */}
      <div className="card">
        <div className="section-header">
          <div className="section-title">🏷️ Tier Price Caps (BWP)</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Government-mandated rent ceilings per Zone × Tier</div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Zone</th>{[1,2,3,4,5].map(t => <th key={t}>Tier {t}</th>)}</tr>
            </thead>
            <tbody>
              {Object.entries(TIER_CAPS).map(([zone, tiers]) => (
                <tr key={zone}>
                  <td style={{ fontWeight: 700 }}>Zone {zone}</td>
                  {[1,2,3,4,5].map(t => (
                    <td key={t} style={{ color: '#60a5fa', fontWeight: 600 }}>
                      BWP {tiers[t].toLocaleString()}
                    </td>
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
