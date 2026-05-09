'use client';
import { NATIONAL_STATS, formatPula } from '@/lib/data';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line } from 'recharts';

const TOOLTIP_STYLE = { background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 8, color: 'var(--text-primary)' };

export default function AnalyticsPage() {
  const { monthly_revenue, zone_performance } = NATIONAL_STATS;

  const grossData = monthly_revenue.map(m => ({ ...m, grossM: m.gross / 1000000 }));

  return (
    <div style={{ padding: '32px', maxWidth: 1300, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div className="badge badge-purple" style={{ marginBottom: 8 }}>📊 FINANCIAL ANALYTICS</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Revenue Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Macroeconomic intelligence for the Ministry — real-time pulse on Botswana's rental sector.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        {[
          { label: 'Gross Rent (May)', value: formatPula(284132000), sub: '+5.2% MoM', color: '#60a5fa' },
          { label: 'Govt Levy (May)',  value: formatPula(2841320),   sub: '1.0% captured at source', color: '#fbbf24' },
          { label: 'Annual Run Rate',  value: 'BWP 34.1B',           sub: 'Projected FY2026', color: '#a78bfa' },
          { label: 'Avg Compliance',   value: '95.2%',               sub: 'All zones', color: '#34d399' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-value" style={{ fontSize: 20, color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Gross Transactions */}
        <div className="card">
          <div className="section-header">
            <div className="section-title">Gross Rent Volume (BWP M)</div>
            <div className="badge badge-blue">6-month</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={grossData}>
              <XAxis dataKey="month" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} tickFormatter={v => `${v}M`} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [`BWP ${v.toFixed(1)}M`, 'Gross']} />
              <Bar dataKey="grossM" fill="#1a56db" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Levy trend */}
        <div className="card">
          <div className="section-header">
            <div className="section-title">National Levy Collection</div>
            <div className="badge badge-gold">Treasury Inflow</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthly_revenue}>
              <defs>
                <linearGradient id="levyG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
              <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v: number) => [formatPula(v), 'Levy']} />
              <Area type="monotone" dataKey="levy" stroke="#f59e0b" fill="url(#levyG)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Zone performance table */}
      <div className="card">
        <div className="section-header">
          <div className="section-title">Zone Performance Heatmap</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Compliance rate · Avg rent · Property count</div>
        </div>
        <div className="grid-4">
          {zone_performance.map((z, i) => {
            const colors = ['#1a56db','#10b981','#8b5cf6','#f59e0b'];
            return (
              <div key={z.zone} style={{
                background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)',
                padding: 20, border: `1px solid ${colors[i]}40`,
                boxShadow: `0 0 20px ${colors[i]}10`,
              }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: colors[i], marginBottom: 4 }}>Zone {z.zone}</div>
                <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 8 }}>{z.compliance}%</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 12 }}>Compliance rate</div>
                <div className="progress-bar" style={{ marginBottom: 12 }}>
                  <div className="progress-fill" style={{ width: `${z.compliance}%`, background: colors[i] }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Avg Rent</span>
                  <span style={{ fontWeight: 600 }}>BWP {z.avg_rent.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 4 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Properties</span>
                  <span style={{ fontWeight: 600 }}>{z.properties.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
