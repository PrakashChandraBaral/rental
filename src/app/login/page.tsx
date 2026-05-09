'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, MOCK_USERS, ROLE_LABELS, ROLE_COLORS } from '@/lib/auth';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // simulate network
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error ?? 'Login failed.');
    }
  }

  function quickLogin(userEmail: string, userPass: string) {
    setEmail(userEmail); setPassword(userPass);
  }

  const demoRoles = [
    { role: 'SUPER_ADMIN', email: 'superadmin@urip.gov.bw', pass: 'Admin@2026' },
    { role: 'GOVT_L1',     email: 'minister@housing.gov.bw', pass: 'GovL1@2026' },
    { role: 'GOVT_L2',     email: 'economist@rerra.gov.bw',  pass: 'GovL2@2026' },
    { role: 'LANDLORD',    email: 'tebogo@landlord.bw',      pass: 'Landlord@2026' },
    { role: 'TENANT',      email: 'mpho@tenant.bw',          pass: 'Tenant@2026' },
    { role: 'EVALUATOR',   email: 'onkabetse@evaluator.bw',  pass: 'Eval@2026' },
    { role: 'NAO',         email: 'auditor@nao.gov.bw',      pass: 'NAO@2026' },
  ] as const;

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-base)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', position: 'relative', overflow: 'hidden',
    }}>
      {/* Background grid */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(26,86,219,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(26,86,219,0.04) 1px,transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />
      {/* Glow */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 500, background: 'radial-gradient(circle,rgba(26,86,219,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', width: '100%', maxWidth: 960, display: 'flex', gap: 32, alignItems: 'flex-start', flexWrap: 'wrap' }}>

        {/* Left — Branding */}
        <div style={{ flex: 1, minWidth: 280, paddingTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#1a56db,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900 }}>U</div>
            <div>
              <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 800, fontSize: 18 }}>URIP</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Botswana · RERRA v3.0</div>
            </div>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, lineHeight: 1.2, marginBottom: 14 }}>
            Unified Rental<br />
            <span style={{ background: 'linear-gradient(135deg,#1a56db,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Infrastructure Portal
            </span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.7, marginBottom: 28 }}>
            National regulatory-fintech platform enforcing Botswana's rental market. Secure, role-based access for all stakeholders.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['🔒 AES-256 data encryption', '📡 GPS-locked field audits', '⚡ Atomic revenue splitting', '🔑 RSA-4096 digital signatures'].map(f => (
              <div key={f} style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Login + Demo */}
        <div style={{ flex: 1, minWidth: 300, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Login card */}
          <div className="card" style={{ borderColor: 'var(--border-glow)', boxShadow: '0 0 40px rgba(26,86,219,0.15)' }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Sign in</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>Use your URIP credentials to access the portal.</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input id="login-email" className="form-input" type="email" placeholder="you@urip.gov.bw"
                  value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input id="login-password" className="form-input" type={showPass ? 'text' : 'password'}
                    placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
                    required autoComplete="current-password" style={{ width: '100%', paddingRight: 44 }} />
                  <button type="button" onClick={() => setShowPass(s => !s)} style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16,
                  }}>{showPass ? '🙈' : '👁️'}</button>
                </div>
              </div>

              {error && (
                <div className="alert alert-error" style={{ padding: '10px 14px' }}>
                  <span>⚠️</span><span>{error}</span>
                </div>
              )}

              <button id="login-submit" type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: 15 }} disabled={loading}>
                {loading ? <span className="animate-spin" style={{ display: 'inline-block' }}>⟳</span> : '🔐'}&nbsp;
                {loading ? 'Authenticating…' : 'Sign In to URIP'}
              </button>
            </form>

            <div style={{ marginTop: 16, padding: '10px 0 0', borderTop: '1px solid var(--border-subtle)', fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
              Your session is protected by MFA & Zero-Trust architecture
            </div>
          </div>

          {/* Demo credentials */}
          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ⚡ Quick Demo Login
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {demoRoles.map(d => (
                <button key={d.role} onClick={() => quickLogin(d.email, d.pass)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px',
                    background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                    borderRadius: 6, cursor: 'pointer', transition: 'var(--transition)', textAlign: 'left',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = ROLE_COLORS[d.role]; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
                >
                  <span style={{ fontSize: 14, minWidth: 20, textAlign: 'center' }}>
                    {d.role === 'SUPER_ADMIN' ? '⚙️' : d.role === 'GOVT_L1' ? '👑' : d.role === 'GOVT_L2' ? '📊' : d.role === 'LANDLORD' ? '🏠' : d.role === 'TENANT' ? '👤' : d.role === 'EVALUATOR' ? '🧑‍💼' : '🔍'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: ROLE_COLORS[d.role] }}>{ROLE_LABELS[d.role]}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{d.email}</div>
                  </div>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>click to fill</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
