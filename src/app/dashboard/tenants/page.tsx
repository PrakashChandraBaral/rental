'use client';
import { TENANTS, getTrustBadge, getStatusBadge } from '@/lib/data';

export default function TenantsPage() {
  return (
    <div style={{ padding: '32px', maxWidth: 1300, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div className="badge badge-blue" style={{ marginBottom: 8 }}>👤 TENANT REGISTRY</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Tenants</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Dynamic trust scores drive zero-deposit eligibility (score ≥ 850) and market incentives.
        </p>
      </div>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Tenants', value: TENANTS.length, color: '#60a5fa' },
          { label: 'Zero-Deposit Eligible (≥850)', value: TENANTS.filter(t => t.trust_score >= 850).length, color: '#34d399' },
          { label: 'At Risk (< 500)', value: TENANTS.filter(t => t.trust_score < 500).length, color: '#f87171' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {TENANTS.map(t => {
          const trust = getTrustBadge(t.trust_score);
          const pct = (t.trust_score / 1000) * 100;
          return (
            <div key={t.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.id} · Omang {t.omang}</div>
                </div>
                <span className={`badge ${trust.color}`}>{trust.label}</span>
              </div>

              {/* Trust Score Ring (CSS-based) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
                  background: `conic-gradient(${t.trust_score >= 800 ? '#10b981' : t.trust_score >= 600 ? '#1a56db' : t.trust_score >= 400 ? '#f59e0b' : '#ef4444'} ${pct}%, var(--bg-surface) 0%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'absolute' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, lineHeight: 1 }}>{t.trust_score}</div>
                    <div style={{ fontSize: 8, color: 'var(--text-muted)' }}>/1000</div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Lease</span>
                    <span style={{ fontFamily: 'monospace', fontSize: 11 }}>{t.lease_id}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Monthly Rent</span>
                    <span style={{ fontWeight: 600, color: '#60a5fa' }}>BWP {t.monthly_rent.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>On-time Months</span>
                    <span style={{ color: '#34d399', fontWeight: 600 }}>{t.paid_months}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Late Payments</span>
                    <span style={{ color: t.late_payments > 0 ? '#f87171' : '#34d399', fontWeight: 600 }}>{t.late_payments}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge ${getStatusBadge(t.status)}`}>{t.status}</span>
                {t.trust_score >= 850 && (
                  <span className="badge badge-green">🌟 Zero-Deposit Eligible</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
