'use client';
import { TIER_CAPS, GLOBAL_POLICY } from '@/lib/data';
import { useState } from 'react';

export default function TierCapsPage() {
  const [editing, setEditing] = useState<{ zone: string; tier: number } | null>(null);
  const [caps, setCaps] = useState(TIER_CAPS);
  const [newVal, setNewVal] = useState('');

  function save() {
    if (!editing || !newVal) return;
    setCaps(prev => ({ ...prev, [editing.zone]: { ...prev[editing.zone], [editing.tier]: parseFloat(newVal) } }));
    setEditing(null); setNewVal('');
  }

  const ZONE_COLORS: Record<string,string> = { 'A+': '#1a56db', 'A': '#10b981', 'B': '#8b5cf6', 'C': '#f59e0b' };

  return (
    <div style={{ padding: '32px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div className="badge badge-gold" style={{ marginBottom: 8 }}>🏷️ TIER PRICE CAPS</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Government-Mandated Rent Ceilings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Click any cell to simulate a change. Changes go through Shadow Simulation → Level 1 approval → Policy commit.
        </p>
      </div>

      <div className="alert alert-info" style={{ marginBottom: 20 }}>
        <span>📋</span>
        <div>Active Policy: <strong>POL-2026-V3</strong> · VAPS Multiplier: <strong>BWP {GLOBAL_POLICY.vaps_multiplier}/point</strong> · Effective ceiling = Base Cap + (VAPS points × BWP 250)</div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Zone</th>
                <th>Classification</th>
                {[1,2,3,4,5].map(t => <th key={t} style={{ textAlign: 'center' }}>Tier {t}</th>)}
              </tr>
            </thead>
            <tbody>
              {Object.entries(caps).map(([zone, tiers]) => (
                <tr key={zone}>
                  <td style={{ fontWeight: 800, fontSize: 18, color: ZONE_COLORS[zone] }}>Zone {zone}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {zone === 'A+' ? 'Premium Metro' : zone === 'A' ? 'Urban' : zone === 'B' ? 'Peri-Urban' : 'Rural'}
                  </td>
                  {[1,2,3,4,5].map(t => (
                    <td key={t} style={{ textAlign: 'center' }}>
                      {editing?.zone === zone && editing?.tier === t ? (
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                          <input className="form-input" value={newVal} onChange={e => setNewVal(e.target.value)}
                            style={{ width: 90, padding: '4px 8px', fontSize: 12 }} autoFocus />
                          <button className="btn btn-success btn-sm" onClick={save}>✓</button>
                          <button className="btn btn-outline btn-sm" onClick={() => setEditing(null)}>✕</button>
                        </div>
                      ) : (
                        <div onClick={() => { setEditing({ zone, tier: t }); setNewVal(String(tiers[t])); }}
                          style={{ cursor: 'pointer', padding: '6px 10px', borderRadius: 6,
                            background: 'var(--bg-surface)', fontWeight: 700, color: ZONE_COLORS[zone],
                            border: '1px solid transparent', transition: 'var(--transition)' }}
                          onMouseEnter={e => (e.currentTarget.style.borderColor = ZONE_COLORS[zone])}
                          onMouseLeave={e => (e.currentTarget.style.borderColor = 'transparent')}>
                          BWP {tiers[t].toLocaleString()}
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="alert alert-warning" style={{ marginTop: 16 }}>
        <span>⚠️</span>
        <div>Edits here are <strong>proposals only</strong>. The live <code>tier_pricing</code> table is only updated after a Level 1 Executive digitally signs the commit. No landlord can charge above the cap — violations trigger a trust score penalty of −100 points.</div>
      </div>
    </div>
  );
}
