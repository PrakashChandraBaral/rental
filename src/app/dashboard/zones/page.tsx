'use client';
import { TIER_CAPS } from '@/lib/data';

const ZONE_META = [
  { id: 'A+', label: 'Premium Metropolitan', desc: 'Gaborone CBD, Phakalane, SSKIA corridor', color: '#1a56db', props: 2104 },
  { id: 'A',  label: 'Urban Residential',    desc: 'Gaborone suburbs, Francistown centre',    color: '#10b981', props: 4211 },
  { id: 'B',  label: 'Peri-Urban',           desc: 'Outer Gaborone, secondary cities',        color: '#8b5cf6', props: 5632 },
  { id: 'C',  label: 'Rural / Remote',       desc: 'Villages, remote districts',              color: '#f59e0b', props: 2876 },
];

export default function ZonesPage() {
  return (
    <div style={{ padding: '32px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div className="badge badge-blue" style={{ marginBottom: 8 }}>🗺️ ZONE MANAGEMENT</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Geographic Zones</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Level 2 Analysts map Plot IDs to zones. Zone changes require Level 1 digital signature.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 28 }}>
        {ZONE_META.map(z => (
          <div key={z.id} className="card" style={{ borderLeft: `4px solid ${z.color}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              <div style={{ minWidth: 120 }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: z.color }}>Zone {z.id}</div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{z.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{z.props.toLocaleString()} properties</div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1 }}>{z.desc}</div>
              <div style={{ display: 'flex', gap: 16 }}>
                {[1,2,3,4,5].map(t => (
                  <div key={t} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>Tier {t}</div>
                    <div style={{ fontWeight: 700, color: z.color, fontSize: 13 }}>BWP {TIER_CAPS[z.id][t].toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="alert alert-info">
        <span>⚖️</span>
        <div>Zone reclassification (e.g., Zone B → Zone A+) requires a Level 2 proposal and Level 1 RSA-4096 signature commitment. All affected leases are notified 90 days in advance.</div>
      </div>
    </div>
  );
}
