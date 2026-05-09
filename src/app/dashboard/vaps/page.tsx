'use client';
import { VAPS_REGISTRY, PROPERTIES } from '@/lib/data';

export default function VapsPage() {
  return (
    <div style={{ padding: '32px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div className="badge badge-gold" style={{ marginBottom: 8 }}>⭐ VAPS REGISTRY</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Value-Add Points System</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Landlords declare upgrades → Field Evaluator GPS-verifies → System adds BWP 250/point to rent ceiling.
        </p>
      </div>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        {VAPS_REGISTRY.map(v => (
          <div key={v.id} className="card" style={{ textAlign: 'center', borderTop: '2px solid #f59e0b' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{v.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{v.label}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#fbbf24', marginBottom: 4 }}>+{v.points.toFixed(1)} pts</div>
            <div style={{ fontSize: 14, color: '#34d399', fontWeight: 600 }}>+BWP {(v.points * 250).toFixed(0)}/mo ceiling</div>
            <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-muted)' }}>
              {PROPERTIES.filter(p => p.vaps_points > 0).length} properties with this amenity type
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="section-header">
          <div className="section-title">VAPS Audit Workflow</div>
        </div>
        <div style={{ display: 'flex', gap: 0, position: 'relative' }}>
          {[
            { step: '1', icon: '🏠', label: 'Landlord Declares', desc: 'Selects upgrade in portal (e.g., Solar Backup)' },
            { step: '2', icon: '📋', label: 'Audit Queued', desc: 'System assigns nearest available evaluator' },
            { step: '3', icon: '📡', label: 'GPS-Locked Visit', desc: 'Evaluator confirms ≤50m + 15-min dwell' },
            { step: '4', icon: '✅', label: 'Amenity Verified', desc: 'Evaluator confirms functionality on-site' },
            { step: '5', icon: '⬆️', label: 'Ceiling Updated', desc: 'base_tier_price + (VAPS × 250) applied' },
          ].map((s, i) => (
            <div key={s.step} style={{ flex: 1, textAlign: 'center', padding: '16px 8px', position: 'relative' }}>
              {i < 4 && <div style={{ position: 'absolute', top: 24, right: -8, color: 'var(--text-muted)', zIndex: 1, fontSize: 18 }}>→</div>}
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#1a56db,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, margin: '0 auto 10px' }}>{s.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: 20 }}>
        <div className="section-header"><div className="section-title">Properties by VAPS Score</div></div>
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Plot</th><th>Owner</th><th>Zone</th><th>VAPS Points</th><th>VAPS Premium</th><th>Effective Ceiling</th></tr></thead>
            <tbody>
              {PROPERTIES.sort((a,b) => b.vaps_points - a.vaps_points).map(p => (
                <tr key={p.plot_id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#60a5fa' }}>{p.plot_id}</td>
                  <td>{p.owner}</td>
                  <td><span className="badge badge-blue">Zone {p.zone}</span></td>
                  <td style={{ color: '#fbbf24', fontWeight: 700 }}>{p.vaps_points.toFixed(1)} pts</td>
                  <td style={{ color: '#34d399' }}>+BWP {(p.vaps_points * 250).toFixed(0)}</td>
                  <td style={{ fontWeight: 700 }}>BWP {(p.monthly_rent || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
