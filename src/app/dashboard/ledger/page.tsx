'use client';
import { TRANSACTIONS, formatPula } from '@/lib/data';

export default function LedgerPage() {
  return (
    <div style={{ padding: '32px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div className="badge badge-red" style={{ marginBottom: 8 }}>📒 APPEND-ONLY LEDGER</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>RERRA Financial Logs</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Immutable transaction history. UPDATE is blocked by DB trigger — corrections require a REVERSAL entry.
          Every row records the <code>policy_id</code> active at execution for NAO audit.
        </p>
      </div>

      <div className="alert alert-warning" style={{ marginBottom: 24 }}>
        <span>🔒</span>
        <div>
          <strong>DB Integrity Rule Active:</strong> <code>BEFORE UPDATE ON rerra_financial_logs → SIGNAL SQLSTATE '45000'</code>.
          All financial corrections are issued as new rows with <code>is_reversal = TRUE</code>.
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>txn_id</th>
                <th>lease_id</th>
                <th>policy_id</th>
                <th>total_gross</th>
                <th>govt_levy_amt</th>
                <th>coy_fee_amt</th>
                <th>tech_fee_amt</th>
                <th>landlord_net_amt</th>
                <th>provider</th>
                <th>provider_txn_ref</th>
                <th>settlement_status</th>
                <th>created_at</th>
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map(t => (
                <tr key={t.txn_id}>
                  <td style={{ fontFamily: 'monospace', fontSize: 11, color: '#60a5fa' }}>{t.txn_id}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 11 }}>{t.lease_id}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 11, color: '#a78bfa' }}>POL-2026-V3</td>
                  <td style={{ fontWeight: 600 }}>BWP {t.gross.toLocaleString()}</td>
                  <td style={{ color: '#fbbf24' }}>BWP {t.govt_levy.toFixed(2)}</td>
                  <td style={{ color: '#a78bfa' }}>BWP {t.coy_fee.toFixed(2)}</td>
                  <td style={{ color: '#06b6d4' }}>BWP {t.tech_fee.toFixed(2)}</td>
                  <td style={{ color: '#34d399', fontWeight: 600 }}>BWP {t.landlord_net.toFixed(2)}</td>
                  <td style={{ fontSize: 12 }}>{t.provider}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--text-muted)' }}>{t.ref}</td>
                  <td>
                    <span className={`badge ${t.status === 'SETTLED' ? 'badge-green' : t.status === 'PENDING' ? 'badge-gold' : 'badge-red'}`}>
                      {t.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
        -- MySQL: No UPDATE allowed on this table<br/>
        SELECT SUM(govt_levy_amt) AS total_levy_collected, COUNT(*) AS total_txns FROM rerra_financial_logs WHERE settlement_status = 'SETTLED';<br/>
        -- Result: BWP {TRANSACTIONS.filter(t=>t.status==='SETTLED').reduce((a,t)=>a+t.govt_levy,0).toFixed(2)} · {TRANSACTIONS.filter(t=>t.status==='SETTLED').length} transactions
      </div>
    </div>
  );
}
