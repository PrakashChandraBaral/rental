'use client';
import { AUDITS, EVALUATORS, getStatusBadge } from '@/lib/data';
import { useState } from 'react';

export default function AuditsPage() {
  const [activeTab, setActiveTab] = useState<'audits'|'evaluators'>('audits');
  const [showSim, setShowSim] = useState(false);
  const [simCoords, setSimCoords] = useState({ lat: '-24.628', lng: '25.923' });
  const [simResult, setSimResult] = useState<null | { dist: number; pass: boolean }>(null);

  function runGeofence() {
    // Haversine vs plot PLOT-001-GAB at -24.630, 25.925
    const R = 6371000;
    const φ1 = -24.630 * Math.PI/180, φ2 = parseFloat(simCoords.lat) * Math.PI/180;
    const Δφ = (parseFloat(simCoords.lat) + 24.630) * Math.PI/180;
    const Δλ = (parseFloat(simCoords.lng) - 25.925) * Math.PI/180;
    const a = Math.sin(Δφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2)**2;
    const dist = 2*R*Math.asin(Math.sqrt(a));
    setSimResult({ dist: Math.round(dist), pass: dist <= 50 });
  }

  return (
    <div style={{ padding: '32px', maxWidth: 1300, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div className="badge badge-gold" style={{ marginBottom: 8 }}>🔍 GPS-LOCKED FIELD AUDITS</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Field Audit Management</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Youth Evaluators must be within 50m of the plot and dwell ≥15 minutes before submission is enabled.
        </p>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {[
          { label: 'Total Audits', value: AUDITS.length, color: '#60a5fa' },
          { label: 'GPS Verified', value: AUDITS.filter(a => a.gps_verified).length, color: '#34d399' },
          { label: 'Rejected (Out of range)', value: AUDITS.filter(a => !a.gps_verified).length, color: '#f87171' },
          { label: 'Evaluators Active', value: EVALUATORS.filter(e => e.status === 'ACTIVE').length, color: '#fbbf24' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Geofence Simulator */}
      <div className="card" style={{ marginBottom: 24, borderColor: 'rgba(245,158,11,0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700 }}>📡 Geofence Simulator (Haversine)</h3>
          <button className="btn btn-outline btn-sm" onClick={() => setShowSim(!showSim)}>
            {showSim ? 'Hide' : 'Open Simulator'}
          </button>
        </div>
        {showSim && (
          <div>
            <div className="alert alert-info" style={{ marginBottom: 12 }}>
              Reference plot: <strong>PLOT-001-GAB</strong> · GPS: −24.630, 25.925 · Radius: 50m
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: 1, minWidth: 120 }}>
                <label className="form-label">Evaluator Lat</label>
                <input className="form-input" value={simCoords.lat} onChange={e => setSimCoords(c => ({ ...c, lat: e.target.value }))} />
              </div>
              <div className="form-group" style={{ flex: 1, minWidth: 120 }}>
                <label className="form-label">Evaluator Lng</label>
                <input className="form-input" value={simCoords.lng} onChange={e => setSimCoords(c => ({ ...c, lng: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button className="btn btn-primary" onClick={runGeofence}>Check Geofence</button>
              </div>
            </div>
            {simResult && (
              <div className={`alert ${simResult.pass ? 'alert-success' : 'alert-error'}`}>
                <span>{simResult.pass ? '✅' : '🚫'}</span>
                <div>
                  Distance to plot: <strong>{simResult.dist}m</strong> ·{' '}
                  {simResult.pass
                    ? 'Within 50m — Audit submission ENABLED'
                    : `Out of range by ${simResult.dist - 50}m — Submission BLOCKED (403 Forbidden)`}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tab switch */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {(['audits','evaluators'] as const).map(tab => (
          <button key={tab} className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setActiveTab(tab)} style={{ textTransform: 'capitalize' }}>
            {tab === 'audits' ? '🔍 Audit Records' : '🧑‍💼 Youth Evaluators'}
          </button>
        ))}
      </div>

      {activeTab === 'audits' && (
        <div className="card" style={{ padding: 0 }}>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Audit ID</th><th>Plot</th><th>Evaluator</th><th>Date</th><th>GPS ✓</th><th>Dwell</th><th>VAPS Verified</th><th>Score</th><th>Status</th></tr>
              </thead>
              <tbody>
                {AUDITS.map(a => (
                  <tr key={a.audit_id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{a.audit_id}</td>
                    <td style={{ color: '#60a5fa', fontFamily: 'monospace', fontSize: 12 }}>{a.plot_id}</td>
                    <td>{a.evaluator}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{a.date}</td>
                    <td style={{ textAlign: 'center' }}>{a.gps_verified ? '✅' : '❌'}</td>
                    <td style={{ color: a.dwell_mins >= 15 ? '#34d399' : '#f87171' }}>
                      {a.dwell_mins}min {a.dwell_mins < 15 && '(< min)'}
                    </td>
                    <td style={{ fontSize: 12 }}>{a.vaps_verified.join(', ') || '—'}</td>
                    <td style={{ fontWeight: 700, color: a.score >= 7 ? '#34d399' : '#fbbf24' }}>
                      {a.score}/10
                    </td>
                    <td><span className={`badge ${getStatusBadge(a.status)}`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'evaluators' && (
        <div className="grid-2">
          {EVALUATORS.map(e => (
            <div key={e.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{e.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{e.id} · {e.zone}</div>
                </div>
                <span className={`badge ${getStatusBadge(e.status)}`}>{e.status}</span>
              </div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Audits Progress</span>
                  <span>{e.audits_done} / {e.audits_target}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(e.audits_done / e.audits_target) * 100}%` }} />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Trust Score</span>
                <span style={{ fontWeight: 700, color: e.trust_score >= 800 ? '#34d399' : e.trust_score >= 600 ? '#60a5fa' : '#f87171' }}>
                  {e.trust_score} / 1000
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
