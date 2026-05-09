'use client';
import { PROPERTIES, VAPS_REGISTRY, getStatusBadge, formatPula } from '@/lib/data';
import { useState } from 'react';

export default function PropertiesPage() {
  const [search, setSearch] = useState('');
  const [zoneFilter, setZoneFilter] = useState('ALL');

  const filtered = PROPERTIES.filter(p => {
    const matchSearch = p.plot_id.toLowerCase().includes(search.toLowerCase()) ||
      p.address.toLowerCase().includes(search.toLowerCase()) ||
      p.owner.toLowerCase().includes(search.toLowerCase());
    const matchZone = zoneFilter === 'ALL' || p.zone === zoneFilter;
    return matchSearch && matchZone;
  });

  return (
    <div style={{ padding: '32px', maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div className="badge badge-blue" style={{ marginBottom: 8 }}>🏠 ASSET CLUSTER</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>Property Registry</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Digital twins of all registered plots, linked to Deeds Registry & GPS coordinates.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        {['A+', 'A', 'B', 'C'].map((zone, i) => {
          const count = PROPERTIES.filter(p => p.zone === zone).length;
          const colors = ['#1a56db','#10b981','#8b5cf6','#f59e0b'];
          return (
            <div key={zone} className="stat-card" onClick={() => setZoneFilter(zone)} style={{ cursor: 'pointer' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: colors[i] }}>Zone {zone}</div>
              <div className="stat-value">{count}</div>
              <div className="stat-label">Registered Properties</div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input className="form-input" placeholder="🔍  Search plot, address, owner…" value={search}
          onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
        {['ALL','A+','A','B','C'].map(z => (
          <button key={z} className={`btn ${zoneFilter === z ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setZoneFilter(z)}>Zone {z}</button>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Plot ID</th><th>Address</th><th>Owner</th><th>Zone</th>
                <th>Tier</th><th>VAPS Pts</th><th>Rent Ceiling</th><th>Status</th><th>Audit</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const ceiling = p.monthly_rent || (8000 + p.vaps_points * 250);
                return (
                  <tr key={p.plot_id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#60a5fa' }}>{p.plot_id}</td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.address}</td>
                    <td style={{ fontWeight: 500 }}>{p.owner}</td>
                    <td><span className="badge badge-blue">Zone {p.zone}</span></td>
                    <td style={{ textAlign: 'center' }}>{p.base_tier}</td>
                    <td style={{ color: '#fbbf24', fontWeight: 600 }}>{p.vaps_points.toFixed(1)} pts</td>
                    <td style={{ color: '#10b981', fontWeight: 600 }}>BWP {ceiling.toLocaleString()}</td>
                    <td><span className={`badge ${getStatusBadge(p.status)}`}>{p.status.replace('_',' ')}</span></td>
                    <td>
                      <button className="btn btn-outline btn-sm" style={{ fontSize: 11 }}>View Audit</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* VAPS Registry */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="section-header">
          <div className="section-title">⭐ VAPS Registry</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>BWP 250 per verified point added to rent ceiling</div>
        </div>
        <div className="grid-3">
          {VAPS_REGISTRY.map(v => (
            <div key={v.id} style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)', padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <span style={{ fontSize: 24 }}>{v.icon}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{v.label}</div>
                <div style={{ color: '#fbbf24', fontSize: 12, fontWeight: 700 }}>+{v.points.toFixed(1)} pts · +BWP {(v.points * 250).toFixed(0)}/mo</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
