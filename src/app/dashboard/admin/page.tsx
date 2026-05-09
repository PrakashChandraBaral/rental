'use client';
import { useState } from 'react';
import { useAuth, ROLE_LABELS, ROLE_COLORS, AuthUser, UserRole, MOCK_USERS } from '@/lib/auth';
import { useRouter } from 'next/navigation';

const ALL_ROLES: UserRole[] = ['SUPER_ADMIN','GOVT_L1','GOVT_L2','LANDLORD','CORP_REP','TENANT','EVALUATOR','NAO'];

const BLANK_USER: Omit<AuthUser, 'id'> = {
  name: '', email: '', password: '', role: 'TENANT',
  dept: '', trust_score: 500, is_active: true, avatar: '👤',
};

const ROLE_AVATARS: Record<UserRole, string> = {
  SUPER_ADMIN: '⚙️', GOVT_L1: '👑', GOVT_L2: '📊',
  LANDLORD: '🏠', CORP_REP: '🏢', TENANT: '👤', EVALUATOR: '🧑‍💼', NAO: '🔍',
};

export default function AdminPage() {
  const { user, users, updateUser, addUser } = useAuth();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [editing, setEditing] = useState<AuthUser | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState<Omit<AuthUser, 'id'>>(BLANK_USER);
  const [toast, setToast] = useState('');

  // Only SUPER_ADMIN can access this page
  if (user?.role !== 'SUPER_ADMIN') {
    return (
      <div style={{ padding: 32 }}>
        <div className="alert alert-error">
          <span>🚫</span><div><strong>Access Denied.</strong> This page is restricted to Super Administrators only.</div>
        </div>
      </div>
    );
  }

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  function saveEdit() {
    if (!editing) return;
    updateUser(editing.id, editing);
    setEditing(null);
    showToast('✅ User updated successfully.');
  }

  function handleAdd() {
    if (!newUser.name || !newUser.email || !newUser.password) return;
    addUser({ ...newUser, avatar: ROLE_AVATARS[newUser.role] });
    setNewUser(BLANK_USER);
    setShowAdd(false);
    showToast('✅ New user created successfully.');
  }

  function toggleActive(u: AuthUser) {
    updateUser(u.id, { is_active: !u.is_active });
    showToast(`${!u.is_active ? '✅ Activated' : '🔒 Deactivated'}: ${u.name}`);
  }

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    inactive: users.filter(u => !u.is_active).length,
    byRole: ALL_ROLES.map(r => ({ role: r, count: users.filter(u => u.role === r).length })).filter(r => r.count > 0),
  };

  return (
    <div style={{ padding: '32px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 1000, background: 'var(--bg-card)', border: '1px solid var(--border-glow)', borderRadius: 10, padding: '12px 20px', fontSize: 13, fontWeight: 600, boxShadow: '0 8px 30px rgba(0,0,0,0.4)', animation: 'fadeIn 0.3s ease' }}>
          {toast}
        </div>
      )}

      <div style={{ marginBottom: 28 }}>
        <div className="badge badge-red" style={{ marginBottom: 8 }}>⚙️ SUPER ADMIN</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>User Management</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Create, edit, activate, and deactivate user accounts. Assign roles to control portal access.
        </p>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="stat-card"><div className="stat-value">{stats.total}</div><div className="stat-label">Total Users</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: '#34d399' }}>{stats.active}</div><div className="stat-label">Active Accounts</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: '#f87171' }}>{stats.inactive}</div><div className="stat-label">Deactivated</div></div>
        <div className="stat-card"><div className="stat-value" style={{ color: '#a78bfa' }}>{ALL_ROLES.length}</div><div className="stat-label">Role Types</div></div>
      </div>

      {/* Role distribution */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>Users by Role:</span>
          {stats.byRole.map(r => (
            <button key={r.role} onClick={() => setRoleFilter(rf => rf === r.role ? 'ALL' : r.role)}
              className={`badge ${roleFilter === r.role ? '' : ''}`}
              style={{ background: roleFilter === r.role ? ROLE_COLORS[r.role] + '30' : 'var(--bg-surface)', color: ROLE_COLORS[r.role], border: `1px solid ${ROLE_COLORS[r.role]}40`, cursor: 'pointer', fontSize: 12 }}>
              {ROLE_AVATARS[r.role]} {ROLE_LABELS[r.role]} ({r.count})
            </button>
          ))}
          {roleFilter !== 'ALL' && <button className="btn btn-outline btn-sm" onClick={() => setRoleFilter('ALL')}>Clear ✕</button>}
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <input className="form-input" placeholder="🔍  Search name or email…" value={search}
          onChange={e => setSearch(e.target.value)} style={{ flex: 1, minWidth: 200 }} />
        <button className="btn btn-primary" onClick={() => setShowAdd(true)}>+ Add User</button>
      </div>

      {/* Add User Form */}
      {showAdd && (
        <div className="card" style={{ marginBottom: 20, borderColor: 'rgba(26,86,219,0.4)', boxShadow: '0 0 30px rgba(26,86,219,0.15)' }}>
          <h3 style={{ marginBottom: 16, fontSize: 16 }}>➕ Create New User</h3>
          <div className="grid-2" style={{ gap: 14, marginBottom: 14 }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" value={newUser.name} onChange={e => setNewUser(u => ({ ...u, name: e.target.value }))} placeholder="e.g. Kefilwe Sithole" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" value={newUser.email} onChange={e => setNewUser(u => ({ ...u, email: e.target.value }))} placeholder="user@urip.gov.bw" />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="text" value={newUser.password} onChange={e => setNewUser(u => ({ ...u, password: e.target.value }))} placeholder="Temporary password" />
            </div>
            <div className="form-group">
              <label className="form-label">Role</label>
              <select className="form-select" value={newUser.role} onChange={e => setNewUser(u => ({ ...u, role: e.target.value as UserRole }))}>
                {ALL_ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <input className="form-input" value={newUser.dept} onChange={e => setNewUser(u => ({ ...u, dept: e.target.value }))} placeholder="e.g. RERRA Compliance" />
            </div>
            <div className="form-group">
              <label className="form-label">Initial Trust Score</label>
              <input className="form-input" type="number" min={0} max={1000} value={newUser.trust_score} onChange={e => setNewUser(u => ({ ...u, trust_score: parseInt(e.target.value) }))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-primary" onClick={handleAdd}>Create User</button>
            <button className="btn btn-outline" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div className="card" style={{ width: '100%', maxWidth: 560, borderColor: 'var(--border-glow)', boxShadow: '0 0 50px rgba(26,86,219,0.3)' }}>
            <h3 style={{ marginBottom: 16, fontSize: 16 }}>✏️ Edit User — {editing.name}</h3>
            <div className="grid-2" style={{ gap: 12, marginBottom: 14 }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={editing.name} onChange={e => setEditing(u => u ? ({ ...u, name: e.target.value }) : u)} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" value={editing.email} onChange={e => setEditing(u => u ? ({ ...u, email: e.target.value }) : u)} />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select className="form-select" value={editing.role}
                  onChange={e => setEditing(u => u ? ({ ...u, role: e.target.value as UserRole }) : u)}
                  disabled={editing.role === 'SUPER_ADMIN'}>
                  {ALL_ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Department</label>
                <input className="form-input" value={editing.dept} onChange={e => setEditing(u => u ? ({ ...u, dept: e.target.value }) : u)} />
              </div>
              <div className="form-group">
                <label className="form-label">Trust Score (0–1000)</label>
                <input className="form-input" type="number" min={0} max={1000} value={editing.trust_score}
                  onChange={e => setEditing(u => u ? ({ ...u, trust_score: parseInt(e.target.value) }) : u)} />
              </div>
              <div className="form-group">
                <label className="form-label">New Password (leave blank to keep)</label>
                <input className="form-input" type="text" placeholder="New password…"
                  onChange={e => e.target.value && setEditing(u => u ? ({ ...u, password: e.target.value }) : u)} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-primary" onClick={saveEdit}>Save Changes</button>
              <button className="btn btn-outline" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User</th><th>Email</th><th>Role</th><th>Department</th>
                <th>Trust Score</th><th>Status</th><th>Last Login</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18 }}>{u.avatar}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{u.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{u.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{u.email}</td>
                  <td>
                    <span style={{ fontSize: 11, fontWeight: 700, color: ROLE_COLORS[u.role], background: ROLE_COLORS[u.role] + '18', padding: '3px 8px', borderRadius: 999, border: `1px solid ${ROLE_COLORS[u.role]}40` }}>
                      {ROLE_LABELS[u.role]}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{u.dept}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ flex: 1, maxWidth: 60 }}>
                        <div className="progress-bar" style={{ height: 4 }}>
                          <div className="progress-fill" style={{ width: `${(u.trust_score/1000)*100}%`, background: u.trust_score>=800?'#34d399':u.trust_score>=600?'#60a5fa':'#f87171' }} />
                        </div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: u.trust_score>=800?'#34d399':u.trust_score>=600?'#60a5fa':'#f87171' }}>{u.trust_score}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${u.is_active ? 'badge-green' : 'badge-red'}`}>
                      {u.is_active ? '● Active' : '○ Inactive'}
                    </span>
                  </td>
                  <td style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {u.last_login ? new Date(u.last_login).toLocaleString('en-BW', { dateStyle: 'short', timeStyle: 'short' }) : '—'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => setEditing({ ...u })} title="Edit">✏️</button>
                      {u.id !== 'USR-SADMIN' && (
                        <button
                          className={`btn btn-sm ${u.is_active ? 'btn-danger' : 'btn-success'}`}
                          onClick={() => toggleActive(u)}
                          title={u.is_active ? 'Deactivate' : 'Activate'}
                        >{u.is_active ? '🔒' : '🔓'}</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="alert alert-info" style={{ marginTop: 16 }}>
        <span>🔐</span>
        <div>
          <strong>Super Admin Note:</strong> Deactivating a user immediately invalidates their session token (Zero-Trust protocol). The Super Admin account cannot be deactivated. Role changes take effect on next login.
        </div>
      </div>
    </div>
  );
}
