'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth, ROLE_LABELS, ROLE_COLORS } from '@/lib/auth';

const ALL_NAV = [
  { section: 'Overview',    href: '/dashboard',              icon: '⬡',  label: 'National Dashboard' },
  { section: 'Overview',    href: '/dashboard/analytics',    icon: '📊', label: 'Revenue Analytics' },
  { section: 'Regulation',  href: '/dashboard/policy',       icon: '⚖️', label: 'Policy Management' },
  { section: 'Regulation',  href: '/dashboard/tier-caps',    icon: '🏷️', label: 'Tier Price Caps' },
  { section: 'Regulation',  href: '/dashboard/zones',        icon: '🗺️', label: 'Zone Management' },
  { section: 'Assets',      href: '/dashboard/properties',   icon: '🏠', label: 'Properties' },
  { section: 'Assets',      href: '/dashboard/audits',       icon: '🔍', label: 'Field Audits' },
  { section: 'Assets',      href: '/dashboard/vaps',         icon: '⭐', label: 'VAPS Registry' },
  { section: 'Finance',     href: '/dashboard/transactions', icon: '💸', label: 'Transactions' },
  { section: 'Finance',     href: '/dashboard/ledger',       icon: '📒', label: 'Append-Only Ledger' },
  { section: 'Finance',     href: '/dashboard/settlements',  icon: '🏦', label: 'Disbursements' },
  { section: 'People',      href: '/dashboard/tenants',      icon: '👤', label: 'Tenants' },
  { section: 'People',      href: '/dashboard/landlords',    icon: '🏛️', label: 'Landlords' },
  { section: 'People',      href: '/dashboard/evaluators',   icon: '🧑‍💼', label: 'Youth Evaluators' },
  { section: 'People',      href: '/dashboard/trust',        icon: '🛡️', label: 'Trust Scores' },
  { section: 'Access',      href: '/dashboard/government',   icon: '🏛️', label: 'Govt Officials' },
  { section: 'Access',      href: '/dashboard/rbac',         icon: '🔑', label: 'RBAC Matrix' },
  { section: 'Access',      href: '/dashboard/audit-trail',  icon: '🔐', label: 'Audit Trail (NAO)' },
  { section: 'Admin',       href: '/dashboard/admin',        icon: '⚙️', label: 'User Management' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, canAccess } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const visibleNav = ALL_NAV.filter(item => canAccess(item.href));

  // Group by section
  const sections = Array.from(new Set(visibleNav.map(i => i.section)));

  function handleLogout() {
    logout();
    router.push('/login');
  }

  const roleColor = user ? ROLE_COLORS[user.role] : '#1a56db';

  return (
    <aside style={{
      width: collapsed ? 64 : 256,
      minHeight: '100vh',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex', flexDirection: 'column',
      transition: 'width 0.3s ease', flexShrink: 0,
      position: 'sticky', top: 0, overflowY: 'auto', overflowX: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: 'linear-gradient(135deg,#1a56db,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900 }}>U</div>
        {!collapsed && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, fontFamily: 'Space Grotesk,sans-serif', lineHeight: 1 }}>URIP</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>Botswana · RERRA v3.0</div>
          </div>
        )}
        <button onClick={() => setCollapsed(c => !c)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14, flexShrink: 0 }}>
          {collapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* User info */}
      {user && !collapsed && (
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', background: `${roleColor}10` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${roleColor}30`, border: `1px solid ${roleColor}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{user.avatar}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
              <div style={{ fontSize: 10, color: roleColor, fontWeight: 600 }}>{ROLE_LABELS[user.role]}</div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {sections.map(section => (
          <div key={section}>
            {!collapsed && (
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '8px 8px 4px' }}>
                {section}
              </div>
            )}
            {visibleNav.filter(i => i.section === section).map(item => {
              const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href}
                  className={`nav-item ${active ? 'active' : ''}`}
                  title={collapsed ? item.label : undefined}
                  style={{ justifyContent: collapsed ? 'center' : undefined }}
                >
                  <span style={{ fontSize: 15, flexShrink: 0 }}>{item.icon}</span>
                  {!collapsed && <span style={{ fontSize: 13 }}>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border-subtle)' }}>
        <button onClick={handleLogout}
          className="nav-item"
          style={{ width: '100%', justifyContent: collapsed ? 'center' : undefined, color: '#f87171', border: 'none', background: 'none', cursor: 'pointer' }}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <span style={{ fontSize: 15 }}>🚪</span>
          {!collapsed && <span style={{ fontSize: 13 }}>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
