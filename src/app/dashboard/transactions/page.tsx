'use client';
import { TRANSACTIONS, GLOBAL_POLICY, formatPula, getStatusBadge } from '@/lib/data';
import { useState } from 'react';

export default function TransactionsPage() {
  const [txns] = useState(TRANSACTIONS);
  const [filter, setFilter] = useState('ALL');

  const filtered = filter === 'ALL' ? txns : txns.filter(t => t.status === filter);

  const totals = txns.reduce((acc, t) => ({
    gross: acc.gross + t.gross,
    levy: acc.levy + t.govt_levy,
    coy: acc.coy + t.coy_fee,
    net: acc.net + t.landlord_net,
  }), { gross: 0, levy: 0, coy: 0, net: 0 });

  return (
    <div style={{ padding: '32px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div className="badge badge-cyan" style={{ marginBottom: 8 }}>💸 TRANSACTION CLUSTER</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Atomic Revenue Splitter</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          ACID-compliant append-only ledger. Every split captures policy version at execution time.
        </p>
      </div>

      {/* Split Summary */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Gross', value: formatPula(totals.gross), color: '#f0f4ff', icon: '💰' },
          { label: `Govt Levy (${(GLOBAL_POLICY.levy_rate*100).toFixed(1)}%)`, value: formatPula(totals.levy), color: '#fbbf24', icon: '🏛️' },
          { label: `Collins Coy (${(GLOBAL_POLICY.coy_fee_rate*100).toFixed(1)}%)`, value: formatPula(totals.coy), color: '#a78bfa', icon: '🏢' },
          { label: 'Landlord Net (96.9%)', value: formatPula(totals.net), color: '#34d399', icon: '🏠' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div style={{ fontSize: 20 }}>{s.icon}</div>
            <div className="stat-value" style={{ fontSize: 22, color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Split ratio visual */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ marginBottom: 10, fontSize: 13, fontWeight: 600 }}>Revenue Split Breakdown</div>
        <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', gap: 1 }}>
          <div style={{ flex: 1,   background: '#fbbf24' }} title="Govt 1.0%" />
          <div style={{ flex: 1.5, background: '#a78bfa' }} title="Collins Coy 1.5%" />
          <div style={{ flex: 0.6, background: '#06b6d4' }} title="Tech 0.6%" />
          <div style={{ flex: 96.9,background: '#10b981' }} title="Landlord 96.9%" />
        </div>
        <div style={{ display: 'flex', gap: 20, marginTop: 10, flexWrap: 'wrap' }}>
          {[
            { color: '#fbbf24', label: 'Govt Levy', pct: '1.0%' },
            { color: '#a78bfa', label: 'Collins Coy', pct: '1.5%' },
            { color: '#06b6d4', label: 'Tech Fee', pct: '0.6%' },
            { color: '#10b981', label: 'Landlord', pct: '96.9%' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} />
              <span style={{ color: 'var(--text-secondary)' }}>{l.label}</span>
              <span style={{ fontWeight: 700 }}>{l.pct}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter + Table */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        {['ALL','SETTLED','PENDING','REVERSED'].map(s => (
          <button key={s} className={`btn ${filter === s ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setFilter(s)}>{s}</button>
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Txn ID</th><th>Tenant</th><th>Plot</th><th>Gross</th>
                <th>Govt (1%)</th><th>Coy (1.5%)</th><th>Tech (0.6%)</th><th>Landlord</th>
                <th>Provider</th><th>Status</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.txn_id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 11, color: '#60a5fa' }}>{t.txn_id}</td>
                  <td style={{ fontWeight: 500 }}>{t.tenant}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{t.plot_id}</td>
                  <td style={{ fontWeight: 700 }}>BWP {t.gross.toLocaleString()}</td>
                  <td style={{ color: '#fbbf24' }}>BWP {t.govt_levy.toFixed(2)}</td>
                  <td style={{ color: '#a78bfa' }}>BWP {t.coy_fee.toFixed(2)}</td>
                  <td style={{ color: '#06b6d4' }}>BWP {t.tech_fee.toFixed(2)}</td>
                  <td style={{ color: '#34d399', fontWeight: 600 }}>BWP {t.landlord_net.toFixed(2)}</td>
                  <td style={{ fontSize: 12 }}>{t.provider}</td>
                  <td><span className={`badge ${getStatusBadge(t.status)}`}>{t.status}</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="alert alert-info" style={{ marginTop: 16 }}>
        <span>🔐</span>
        <div><strong>Append-Only Ledger:</strong> Updates to transaction amounts are blocked by DB trigger. All corrections must be issued as REVERSAL entries. Every row stores the <code>policy_id</code> active at execution time for NAO audit.</div>
      </div>
    </div>
  );
}
