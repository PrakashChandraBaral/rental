'use client';
import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(7,11,20,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: 64,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: 'linear-gradient(135deg,#1a56db,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 17 }}>U</div>
          <div>
            <span style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 800, fontSize: 16 }}>URIP</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>Botswana · RERRA v3.0</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="#features" style={{ color: 'var(--text-secondary)', fontSize: 13, textDecoration: 'none', padding: '6px 12px' }}>Features</Link>
          <Link href="#stakeholders" style={{ color: 'var(--text-secondary)', fontSize: 13, textDecoration: 'none', padding: '6px 12px' }}>Stakeholders</Link>
          <Link href="#stats" style={{ color: 'var(--text-secondary)', fontSize: 13, textDecoration: 'none', padding: '6px 12px' }}>Impact</Link>
          <Link href="/login" className="btn btn-primary btn-sm">Sign In →</Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', padding: '100px 40px 80px', textAlign: 'center', overflow: 'hidden' }}>
        {/* Grid bg */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(26,86,219,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,219,0.05) 1px,transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
        {/* Radial glow */}
        <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, background: 'radial-gradient(circle,rgba(26,86,219,0.14) 0%,transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: '10%', width: 300, height: 300, background: 'radial-gradient(circle,rgba(6,182,212,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(26,86,219,0.12)', border: '1px solid rgba(26,86,219,0.3)', borderRadius: 999, padding: '6px 16px', fontSize: 12, fontWeight: 600, color: '#60a5fa', marginBottom: 28 }}>
            🇧🇼 &nbsp; Republic of Botswana · Powered by RERRA Act Compliance
          </div>

          <h1 style={{ fontSize: 'clamp(38px,6vw,76px)', fontWeight: 900, lineHeight: 1.08, marginBottom: 22, letterSpacing: '-1px' }}>
            The National&nbsp;
            <span style={{ background: 'linear-gradient(135deg,#1a56db 30%,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
              Rental Truth
            </span>
            <br />Engine for Botswana
          </h1>

          <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 620, margin: '0 auto 36px', lineHeight: 1.75 }}>
            URIP digitizes and enforces Botswana's rental market — eliminating exploitation through
            hard-coded price caps, GPS-locked audits, and automated levy collection at the source.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/login" className="btn btn-primary btn-lg" style={{ fontSize: 16, padding: '14px 32px', boxShadow: '0 8px 30px rgba(26,86,219,0.45)' }}>
              Access Portal →
            </Link>
            <a href="#features" className="btn btn-outline btn-lg" style={{ fontSize: 16, padding: '14px 32px' }}>
              How It Works
            </a>
          </div>

          {/* Live badge */}
          <div style={{ marginTop: 32, display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-muted)' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }} className="animate-pulse" />
            System Live · 14,823 properties · 99.99% uptime
          </div>
        </div>
      </section>

      {/* ── Stats Bar ───────────────────────────────────────────────── */}
      <section id="stats" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', padding: '36px 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '5%', flexWrap: 'wrap', maxWidth: 1100, margin: '0 auto' }}>
          {[
            { value: '14,823', label: 'Registered Properties',    icon: '🏠' },
            { value: '11,204', label: 'Active Leases',             icon: '📋' },
            { value: '500',    label: 'Youth Evaluators',          icon: '🧑‍💼' },
            { value: '95.2%',  label: 'Market Compliance',         icon: '✅' },
            { value: 'BWP 2.84M', label: 'Monthly Levy Captured', icon: '🏛️' },
            { value: '4 Zones', label: 'Geographic Coverage',     icon: '🗺️' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '8px 0' }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 26, fontWeight: 900, fontFamily: 'Space Grotesk,sans-serif', background: 'linear-gradient(135deg,#60a5fa,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3 Pillars ───────────────────────────────────────────────── */}
      <section id="features" style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="badge badge-blue" style={{ marginBottom: 12, fontSize: 12 }}>Core Architecture</div>
          <h2 style={{ fontSize: 'clamp(26px,4vw,40px)', fontWeight: 800, marginBottom: 12 }}>Three Pillars of Digital Truth</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 520, margin: '0 auto' }}>
            Built to solve the "Black Box" problem of Botswana's informal rental market.
          </p>
        </div>

        <div className="grid-3" style={{ gap: 24 }}>
          {[
            {
              icon: '🔒', color: '#1a56db', accentColor: 'rgba(26,86,219,0.12)',
              title: 'Digital Truth Engine',
              badge: 'FR-1 · FR-4',
              desc: 'Hard-coded price caps per Zone × Tier eliminate arbitrary rent inflation. Every landlord competes on verified quality via the VAPS system — not speculation.',
              points: ['Government-mandated Tier Price Caps', 'VAPS: +BWP 250/verified amenity point', 'Four-Eyes policy approval (RSA-4096)'],
            },
            {
              icon: '⚡', color: '#10b981', accentColor: 'rgba(16,185,129,0.12)',
              title: 'Source-Split Automation',
              badge: 'FR-2 · FR-6',
              desc: 'ACID atomic splits execute at the moment of payment. No manual reporting — the levy is captured before the landlord receives a single Pula.',
              points: ['1.0% → National Treasury (auto)', '1.5% → Collins Coy Operations', '96.9% → Landlord (T+1 payout)'],
            },
            {
              icon: '📡', color: '#f59e0b', accentColor: 'rgba(245,158,11,0.12)',
              title: 'GPS-Locked Field Audits',
              badge: 'FR-3 · FR-5',
              desc: '500 Youth Evaluators conduct GPS-verified on-site inspections. The "Submit" button is physically disabled unless the evaluator is within 50m of the plot.',
              points: ['Haversine distance check (≤50m)', '15-minute minimum dwell enforced', 'Device fingerprint anti-spoofing'],
            },
          ].map(p => (
            <div key={p.title} className="pillar-card" style={{
              background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)', padding: '28px 24px',
              transition: 'var(--transition)', display: 'flex', flexDirection: 'column', gap: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: p.accentColor, border: `1px solid ${p.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{p.icon}</div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: p.color, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{p.badge}</div>
                  <div style={{ fontWeight: 700, fontSize: 17, lineHeight: 1.3 }}>{p.title}</div>
                </div>
              </div>
              <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 7, margin: 0, padding: 0 }}>
                {p.points.map(pt => (
                  <li key={pt} style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: p.color, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>{pt}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stakeholders ─────────────────────────────────────────────── */}
      <section id="stakeholders" style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', padding: '80px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="badge badge-green" style={{ marginBottom: 12 }}>Stakeholder Ecosystem</div>
            <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, marginBottom: 10 }}>Everyone Benefits</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>
              URIP creates a symbiotic market where fair pricing and transparency benefit all actors.
            </p>
          </div>
          <div className="grid-4" style={{ gap: 20 }}>
            {[
              { icon: '👤', role: 'Tenants', color: '#60a5fa', benefits: ['Price Protection via Tier Caps', 'Verified property audit history', 'Zero-Deposit for score ≥ 850'] },
              { icon: '🏠', role: 'Landlords', color: '#34d399', benefits: ['Automated T+1 rent settlement', 'BURS-ready P&L reporting', 'VAPS upgrades boost ceiling'] },
              { icon: '🏛️', role: 'Government', color: '#fbbf24', benefits: ['Real-time levy capture (1.0%)', 'Macroeconomic dashboard', 'Four-Eyes policy control'] },
              { icon: '🧑‍💼', role: 'Youth (500)', color: '#a78bfa', benefits: ['Certified Evaluator roles', 'GPS-verified field work', 'Financial sector inclusion'] },
            ].map(s => (
              <div key={s.role} style={{
                background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '22px 20px',
                border: `1px solid ${s.color}20`, display: 'flex', flexDirection: 'column', gap: 14,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{s.icon}</div>
                  <span style={{ fontWeight: 700, fontSize: 16, color: s.color }}>{s.role}</span>
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {s.benefits.map(b => (
                    <li key={b} style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ color: s.color, flexShrink: 0 }}>→</span>{b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Audit-to-Payment Cycle ───────────────────────────────────── */}
      <section style={{ padding: '80px 40px', maxWidth: 960, margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="badge badge-purple" style={{ marginBottom: 12 }}>Operational Workflow</div>
          <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, marginBottom: 10 }}>The Audit-to-Payment Cycle</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>A continuous feedback loop that maintains market integrity.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, position: 'relative', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { n: '1', icon: '📝', label: 'Registration', desc: 'Landlord registers plot via Deeds Registry sync' },
            { n: '2', icon: '📡', label: 'GPS Audit', desc: 'Youth Evaluator verifies quality on-site' },
            { n: '3', icon: '🏷️', label: 'Tier Assigned', desc: 'System sets Tier & VAPS-adjusted price cap' },
            { n: '4', icon: '💳', label: 'Tenant Pays', desc: 'One-tap rent via Orange Money / MyZaka' },
            { n: '5', icon: '⚡', label: 'Auto Split', desc: 'Levy deducted, all parties credited instantly' },
          ].map((s, i) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'flex-start', gap: 0 }}>
              <div style={{ textAlign: 'center', width: 160, padding: '0 8px' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#1a56db,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto 12px', boxShadow: '0 0 20px rgba(26,86,219,0.4)' }}>{s.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{s.n}. {s.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.desc}</div>
              </div>
              {i < 4 && (
                <div style={{ paddingTop: 26, color: 'var(--text-muted)', fontSize: 20, flexShrink: 0 }}>→</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section style={{ padding: '60px 40px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(26,86,219,0.12), rgba(6,182,212,0.08))', borderTop: '1px solid var(--border-subtle)' }}>
        <h2 style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, marginBottom: 12 }}>
          Ready to Access the Portal?
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginBottom: 28, maxWidth: 400, margin: '0 auto 28px' }}>
          Sign in with your URIP credentials to access your role-specific dashboard.
        </p>
        <Link href="/login" className="btn btn-primary btn-lg" style={{ fontSize: 16, padding: '15px 36px', boxShadow: '0 8px 32px rgba(26,86,219,0.5)' }}>
          🔐 Sign In to URIP
        </Link>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer style={{ padding: '24px 40px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          © 2026 Collins Coy (Pty) Ltd · URIP v3.0 · Built for the Government of Botswana under RERRA Act
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['AES-256 Encrypted', 'ACID Transactions', 'ISO 27001'].map(b => (
            <span key={b} style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: '#34d399' }}>✓</span> {b}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
