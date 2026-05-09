'use client';
import { NATIONAL_STATS, TRANSACTIONS, AUDITS, PROPERTIES, formatPula, getStatusBadge } from '@/lib/data';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const ZONE_COLORS = ['#1a56db','#06b6d4','#8b5cf6','#f59e0b'];

export default function DashboardPage() {
  const stats = NATIONAL_STATS;
  const recentTxns = TRANSACTIONS.slice(0, 5);

  return (
    <div style={{ padding: '32px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div className="badge badge-green">● LIVE</div>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Botswana National Rental Ledger · RERRA v3.0</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>National Command Centre</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Real-time macroeconomic view of Botswana's regulated rental market.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        {[
          { label: 'Total Properties', value: stats.total_properties.toLocaleString(), change: '+142 this month', up: true, icon: '🏠', color: '#1a56db' },
          { label: 'Active Leases',    value: stats.active_leases.toLocaleString(),    change: '+89 this month',  up: true, icon: '📋', color: '#10b981' },
          { label: 'Monthly Levy Collected', value: formatPula(stats.monthly_levy_collected), change: '+5.2% vs last month', up: true, icon: '🏛️', color: '#f59e0b' },
          { label: 'Evaluators Deployed', value: stats.evaluators_deployed.toString(), change: '500 / 500 active', up: true, icon: '🧑‍💼', color: '#8b5cf6' },
        ].map(s => (
          <div key={s.label} className="stat-card" style={{ ['--accent' as string]: s.color }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontSize: 28 }}>{s.icon}</div>
              <div className={`stat-change ${s.up ? 'up' : 'down'}`}>
                {s.up ? '↑' : '↓'} {s.change}
              </div>
            </div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid-2" style={{ marginBottom: 28 }}>
        {/* Levy Revenue Chart */}
        <div className="card">
          <div className="section-header">
            <div>
              <div className="section-title">Monthly Levy Collection</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>6-month trend · BWP</div>
            </div>
            <div className="badge badge-green">↑ 35.3% YoY</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={stats.monthly_revenue}>
              <defs>
                <linearGradient id="levyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1a56db" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1a56db" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 8, color: 'var(--text-primary)' }}
                formatter={(v: number) => [formatPula(v), 'Levy']} />
              <Area type="monotone" dataKey="levy" stroke="#1a56db" fill="url(#levyGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Zone Distribution */}
        <div className="card">
          <div className="section-header">
            <div>
              <div className="section-title">Properties by Zone</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>National distribution</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={Object.entries(stats.properties_by_zone).map(([z,v]) => ({ name: z, value: v }))}
                  cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" strokeWidth={0}>
                  {Object.keys(stats.properties_by_zone).map((_, i) => (
                    <Cell key={i} fill={ZONE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {stats.zone_performance.map((z, i) => (
                <div key={z.zone}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Zone {z.zone}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{z.properties.toLocaleString()} props</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${z.compliance}%`, background: ZONE_COLORS[i] }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{z.compliance}% compliance</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alert banner */}
      <div className="alert alert-warning" style={{ marginBottom: 24 }}>
        <span style={{ fontSize: 18 }}>⚠️</span>
        <div>
          <strong>Rent Rush Window Active</strong> — Period: 25 Apr – 5 May 2026.
          Transaction Engine auto-scaling engaged. 1 invoice flagged as OVERDUE (TEN-004).
          <span style={{ color: 'var(--text-accent)', marginLeft: 8, cursor: 'pointer', textDecoration: 'underline' }}>View exceptions →</span>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid-2">
        {/* Recent Transactions */}
        <div className="card">
          <div className="section-header">
            <div className="section-title">Recent Transactions</div>
            <a href="/dashboard/transactions" className="btn btn-outline btn-sm">View all</a>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Ref</th><th>Tenant</th><th>Gross</th><th>Levy</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTxns.map(t => (
                  <tr key={t.txn_id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{t.txn_id}</td>
                    <td>{t.tenant}</td>
                    <td style={{ fontWeight: 600 }}>BWP {t.gross.toLocaleString()}</td>
                    <td style={{ color: '#fbbf24' }}>BWP {t.govt_levy.toFixed(2)}</td>
                    <td><span className={`badge ${getStatusBadge(t.status)}`}>{t.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Audits */}
        <div className="card">
          <div className="section-header">
            <div className="section-title">Field Audit Activity</div>
            <a href="/dashboard/audits" className="btn btn-outline btn-sm">View all</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {AUDITS.map(a => (
              <div key={a.audit_id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: a.gps_verified ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>{a.gps_verified ? '✅' : '❌'}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.plot_id}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{a.evaluator} · {a.dwell_mins}min dwell</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span className={`badge ${getStatusBadge(a.status)}`}>{a.status}</span>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{a.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
