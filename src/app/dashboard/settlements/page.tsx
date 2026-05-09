'use client';
import { TRANSACTIONS, formatPula } from '@/lib/data';

const DISBURSEMENTS = [
  { ref: 'DIS-001', landlord: 'Tebogo Modise', type: 'INDIVIDUAL', provider: 'Orange Money', amount: 10537.87, status: 'SETTLED', date: '2026-05-02', txn: 'TXN-8821' },
  { ref: 'DIS-002', landlord: 'Realco (Pty) Ltd', type: 'CORPORATE', provider: 'Bank EFT (ISO 20022)', amount: 22648.37, status: 'SETTLED', date: '2026-05-02', txn: 'TXN-8822' },
  { ref: 'DIS-003', landlord: 'Olebile Taunyane', type: 'INDIVIDUAL', provider: 'BTC Smega', amount: 3876.00, status: 'SETTLED', date: '2026-05-02', txn: 'TXN-8823' },
  { ref: 'DIS-004', landlord: 'Realco (Pty) Ltd', type: 'CORPORATE', provider: 'Bank EFT (ISO 20022)', amount: 12960.37, status: 'PENDING', date: '2026-05-06', txn: 'TXN-8824' },
  { ref: 'DIS-005', landlord: 'Boineelo Moseki', type: 'INDIVIDUAL', provider: 'MyZaka', amount: 2422.50, status: 'SETTLED', date: '2026-05-04', txn: 'TXN-8825' },
];

export default function SettlementsPage() {
  const totalSettled = DISBURSEMENTS.filter(d => d.status === 'SETTLED').reduce((a, d) => a + d.amount, 0);

  return (
    <div style={{ padding: '32px', maxWidth: 1300, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div className="badge badge-green" style={{ marginBottom: 8 }}>🏦 DISBURSEMENTS</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Landlord Settlements</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          T+1 disbursements: individuals via Mobile Money, corporate via ISO 20022 EFT. 96.9% net payout after source-split.
        </p>
      </div>

      <div className="grid-3" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Disbursed (May)', value: formatPula(totalSettled), color: '#34d399' },
          { label: 'Pending Settlement', value: formatPula(12960.37), color: '#fbbf24' },
          { label: 'Success Rate', value: '80%', color: '#60a5fa' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-value" style={{ fontSize: 22, color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr><th>Ref</th><th>Landlord</th><th>Type</th><th>Provider</th><th>Net Amount</th><th>Status</th><th>Date</th><th>Source Txn</th></tr>
            </thead>
            <tbody>
              {DISBURSEMENTS.map(d => (
                <tr key={d.ref}>
                  <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{d.ref}</td>
                  <td style={{ fontWeight: 600 }}>{d.landlord}</td>
                  <td><span className={`badge ${d.type === 'CORPORATE' ? 'badge-purple' : 'badge-blue'}`}>{d.type}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{d.provider}</td>
                  <td style={{ color: '#34d399', fontWeight: 700 }}>BWP {d.amount.toLocaleString()}</td>
                  <td><span className={`badge ${d.status === 'SETTLED' ? 'badge-green' : 'badge-gold'}`}>{d.status}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.date}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: 11, color: '#60a5fa' }}>{d.txn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="alert alert-info" style={{ marginTop: 16 }}>
        <span>ℹ️</span>
        <div>
          <strong>Corporate payout route:</strong> ISO 20022 / SWIFT bridge triggered for entities where <code>payout_config = 'ISO_20022'</code>.
          Foreign landlords follow SWIFT cross-border protocol after 1.0% Govt Levy is captured in Pula at source.
        </div>
      </div>
    </div>
  );
}
