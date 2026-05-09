'use client';
import { TENANTS, EVALUATORS } from '@/lib/data';

const EVENTS = [
  { actor: 'Mpho Gabaraane', type: 'TENANT', event: 'ON_TIME_PAYMENT', delta: +10, before: 860, after: 870, ref: 'TXN-8821', date: '2026-05-01' },
  { actor: 'Naledi Ditheko',  type: 'TENANT', event: 'ON_TIME_PAYMENT', delta: +10, before: 930, after: 940, ref: 'TXN-8823', date: '2026-05-01' },
  { actor: 'Lesego Kgosi',    type: 'TENANT', event: 'LATE_PAYMENT',    delta: -15, before: 635, after: 620, ref: 'TXN-8822', date: '2026-05-07' },
  { actor: 'Gofaone Molefe',  type: 'TENANT', event: 'LATE_PAYMENT',    delta: -15, before: 495, after: 480, ref: 'TXN-8824', date: '2026-05-06' },
  { actor: 'Tebogo Modise',   type: 'LANDLORD', event: 'REPAIR_TURNAROUND_24H', delta: +20, before: 790, after: 810, ref: 'MNT-001', date: '2026-04-28' },
  { actor: 'Onkabetse Keeme', type: 'EVALUATOR', event: 'AUDIT_APPROVED', delta: +5, before: 885, after: 890, ref: 'AUD-001', date: '2026-04-15' },
];

export default function TrustPage() {
  const allActors = [
    ...TENANTS.map(t => ({ name: t.name, type: 'TENANT', score: t.trust_score, id: t.id })),
    { name: 'Tebogo Modise', type: 'LANDLORD', score: 810, id: 'USR-001' },
    { name: 'Realco (Pty) Ltd', type: 'LANDLORD', score: 940, id: 'CORP-001' },
    ...EVALUATORS.map(e => ({ name: e.name, type: 'EVALUATOR', score: e.trust_score, id: e.id })),
  ].sort((a,b) => b.score - a.score);

  const TYPE_COLOR: Record<string,string> = { TENANT: '#60a5fa', LANDLORD: '#34d399', EVALUATOR: '#fbbf24' };

  return (
    <div style={{ padding: '32px', maxWidth: 1300, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div className="badge badge-purple" style={{ marginBottom: 8 }}>🛡️ DYNAMIC TRUST ENGINE</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Trust Score Leaderboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Real-time scores (0–1000) drive zero-deposit leases (≥850), preferred provider badges (≥900), and legal notices.
        </p>
      </div>

      {/* Incentive thresholds */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        {[
          { threshold: '≥ 900', benefit: 'Preferred Provider Badge', who: 'Landlords', color: '#34d399', count: allActors.filter(a=>a.type==='LANDLORD'&&a.score>=900).length },
          { threshold: '≥ 850', benefit: 'Zero-Deposit Lease Eligible', who: 'Tenants', color: '#60a5fa', count: allActors.filter(a=>a.type==='TENANT'&&a.score>=850).length },
          { threshold: '< 400', benefit: 'Auto Legal Notice Generated', who: 'All Actors', color: '#f87171', count: allActors.filter(a=>a.score<400).length },
        ].map(s => (
          <div key={s.benefit} className="card" style={{ borderLeft: `3px solid ${s.color}` }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>{s.threshold}</div>
            <div style={{ fontWeight: 600, marginTop: 4 }}>{s.benefit}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{s.who} · {s.count} currently qualify</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Leaderboard */}
        <div className="card">
          <div className="section-header"><div className="section-title">All Actors Ranked</div></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {allActors.map((a, i) => {
              const color = a.score>=800?'#34d399':a.score>=600?'#60a5fa':a.score>=400?'#fbbf24':'#f87171';
              return (
                <div key={a.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'8px 10px', background:'var(--bg-surface)', borderRadius:'var(--radius-sm)' }}>
                  <div style={{ width:24, fontSize:13, fontWeight:700, color:'var(--text-muted)', textAlign:'right' }}>#{i+1}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600 }}>{a.name}</div>
                    <span style={{ fontSize:10, color: TYPE_COLOR[a.type] }}>{a.type}</span>
                  </div>
                  <div style={{ width:120 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, marginBottom:2 }}>
                      <span style={{ color: 'var(--text-muted)' }}>Score</span>
                      <span style={{ fontWeight:700, color }}>{a.score}</span>
                    </div>
                    <div className="progress-bar" style={{ height:4 }}>
                      <div className="progress-fill" style={{ width:`${(a.score/1000)*100}%`, background:color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Events */}
        <div className="card">
          <div className="section-header"><div className="section-title">Recent Score Events</div></div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {EVENTS.map((e,i) => (
              <div key={i} style={{ padding:'10px 12px', background:'var(--bg-surface)', borderRadius:'var(--radius-sm)', borderLeft:`3px solid ${e.delta>0?'#34d399':'#f87171'}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ fontWeight:600, fontSize:13 }}>{e.actor}</span>
                  <span style={{ fontWeight:800, fontSize:14, color:e.delta>0?'#34d399':'#f87171' }}>
                    {e.delta>0?'+':''}{e.delta} pts
                  </span>
                </div>
                <div style={{ fontSize:11, color:'var(--text-secondary)' }}>
                  {e.event.replace(/_/g,' ')} · {e.before} → <strong style={{color:'var(--text-primary)'}}>{e.after}</strong>
                </div>
                <div style={{ fontSize:10, color:'var(--text-muted)', marginTop:2 }}>{e.ref} · {e.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
