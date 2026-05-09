'use client';
import { PROPERTIES, TRANSACTIONS, formatPula, getStatusBadge } from '@/lib/data';

const LANDLORDS = [
  { id: 'USR-001', name: 'Tebogo Modise', type: 'INDIVIDUAL', trust_score: 810, properties: 1, total_gross: 10875, net_payout: 10537.87, status: 'ACTIVE', zone: 'A+', badge: 'Preferred Provider' },
  { id: 'CORP-001', name: 'Realco (Pty) Ltd', type: 'CORPORATE', trust_score: 940, properties: 2, total_gross: 23375, net_payout: 22648.37, status: 'ACTIVE', zone: 'A+/A', badge: 'Preferred Provider' },
  { id: 'USR-003', name: 'Kefilwe Pheto', type: 'INDIVIDUAL', trust_score: 620, properties: 1, total_gross: 0, net_payout: 0, status: 'PENDING_AUDIT', zone: 'B', badge: null },
  { id: 'USR-004', name: 'Olebile Taunyane', type: 'INDIVIDUAL', trust_score: 750, properties: 1, total_gross: 4000, net_payout: 3876, status: 'ACTIVE', zone: 'C', badge: null },
  { id: 'USR-006', name: 'Boineelo Moseki', type: 'INDIVIDUAL', trust_score: 680, properties: 1, total_gross: 2500, net_payout: 2422.50, status: 'ACTIVE', zone: 'C', badge: null },
];

export default function LandlordsPage() {
  return (
    <div style={{ padding: '32px', maxWidth: 1300, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div className="badge badge-cyan" style={{ marginBottom: 8 }}>🏛️ LANDLORD REGISTRY</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Landlords</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Individual and Corporate asset owners verified via Omang OIV-API, CIPA, and Deeds Registry.
        </p>
      </div>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Landlords', value: LANDLORDS.length, color: '#60a5fa' },
          { label: 'Corporate Entities', value: LANDLORDS.filter(l => l.type === 'CORPORATE').length, color: '#a78bfa' },
          { label: 'Preferred Providers', value: LANDLORDS.filter(l => l.badge).length, color: '#34d399' },
          { label: 'Pending Audit', value: LANDLORDS.filter(l => l.status === 'PENDING_AUDIT').length, color: '#fbbf24' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {LANDLORDS.map(l => {
          const pct = (l.trust_score / 1000) * 100;
          const color = l.trust_score >= 900 ? '#34d399' : l.trust_score >= 700 ? '#60a5fa' : '#fbbf24';
          return (
            <div key={l.id} className="card" style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Trust ring */}
              <div style={{ width: 64, height: 64, borderRadius: '50%', flexShrink: 0, position: 'relative',
                background: `conic-gradient(${color} ${pct}%, var(--bg-surface) 0%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ position: 'absolute', width: 46, height: 46, borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, lineHeight: 1, color }}>{l.trust_score}</span>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 160 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{l.name}</span>
                  {l.badge && <span className="badge badge-green">⭐ {l.badge}</span>}
                  <span className={`badge ${l.type === 'CORPORATE' ? 'badge-purple' : 'badge-blue'}`}>{l.type}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{l.id} · Zone {l.zone}</div>
              </div>

              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{l.properties}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Properties</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#60a5fa' }}>BWP {l.total_gross.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Monthly Gross</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#34d399' }}>BWP {l.net_payout.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Net Payout (96.9%)</div>
                </div>
              </div>

              <span className={`badge ${getStatusBadge(l.status)}`}>{l.status.replace('_', ' ')}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
