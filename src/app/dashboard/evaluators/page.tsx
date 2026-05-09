'use client';
import { EVALUATORS, getStatusBadge } from '@/lib/data';

export default function EvaluatorsPage() {
  const total = 500;
  const active = EVALUATORS.filter(e => e.status === 'ACTIVE').length;

  return (
    <div style={{ padding: '32px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div className="badge badge-gold" style={{ marginBottom: 8 }}>🧑‍💼 YOUTH EVALUATORS</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Field Evaluator Fleet</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          500 GPS-certified youth auditors deployed across all zones. Monthly audit target: 50 inspections per evaluator.
        </p>
      </div>

      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Deployed', value: '500', color: '#60a5fa' },
          { label: 'Active This Month', value: '487', color: '#34d399' },
          { label: 'Audits Completed (May)', value: '2,841', color: '#fbbf24' },
          { label: 'GPS Rejections', value: '23', color: '#f87171' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Fleet progress */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>National Fleet — May 2026 Progress</div>
        <div style={{ marginBottom: 6, display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
          <span style={{ color: 'var(--text-secondary)' }}>Audits completed vs target (500 evaluators × 50)</span>
          <span style={{ fontWeight: 700 }}>2,841 / 25,000</span>
        </div>
        <div className="progress-bar" style={{ height: 10 }}>
          <div className="progress-fill" style={{ width: `${(2841/25000)*100}%` }} />
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>11.4% of monthly target complete (early in cycle)</div>
      </div>

      <div className="grid-2">
        {EVALUATORS.map(e => (
          <div key={e.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{e.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{e.id} · {e.zone}</div>
              </div>
              <span className={`badge ${getStatusBadge(e.status)}`}>{e.status}</span>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Audits This Month</span>
                <span style={{ fontWeight: 700 }}>{e.audits_done} / {e.audits_target}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(e.audits_done/e.audits_target)*100}%`, background: e.audits_done >= e.audits_target ? '#10b981' : '#1a56db' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Trust Score</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: e.trust_score >= 800 ? '#34d399' : e.trust_score >= 600 ? '#60a5fa' : '#f87171' }}>
                  {e.trust_score}<span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 400 }}>/1000</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Completion</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#fbbf24' }}>{Math.round((e.audits_done/e.audits_target)*100)}%</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Zone</div>
                <span className="badge badge-blue" style={{ fontSize: 11 }}>{e.zone.split(' ')[1]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
