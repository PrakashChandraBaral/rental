'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'SUPER_ADMIN' | 'GOVT_L1' | 'GOVT_L2' | 'LANDLORD' | 'TENANT' | 'EVALUATOR' | 'CORP_REP' | 'NAO';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  password: string; // plain-text for demo
  role: UserRole;
  dept: string;
  trust_score: number;
  is_active: boolean;
  avatar: string;
  last_login?: string;
}

// ─── Mock User Database ──────────────────────────────────────────────────────
export const MOCK_USERS: AuthUser[] = [
  {
    id: 'USR-SADMIN',
    name: 'Super Administrator',
    email: 'superadmin@urip.gov.bw',
    password: 'Admin@2026',
    role: 'SUPER_ADMIN',
    dept: 'URIP System',
    trust_score: 1000,
    is_active: true,
    avatar: '⚙️',
  },
  {
    id: 'GOV-001',
    name: 'Min. Dithapelo Keoagile',
    email: 'minister@housing.gov.bw',
    password: 'GovL1@2026',
    role: 'GOVT_L1',
    dept: 'Ministry of Housing',
    trust_score: 980,
    is_active: true,
    avatar: '👑',
  },
  {
    id: 'GOV-002',
    name: 'PS. Keabetswe Molosiwa',
    email: 'ps@housing.gov.bw',
    password: 'GovL1B@2026',
    role: 'GOVT_L1',
    dept: 'Ministry of Housing',
    trust_score: 960,
    is_active: true,
    avatar: '👑',
  },
  {
    id: 'GOV-003',
    name: 'Dr. Omphile Ntshimogang',
    email: 'economist@rerra.gov.bw',
    password: 'GovL2@2026',
    role: 'GOVT_L2',
    dept: 'RERRA Compliance',
    trust_score: 920,
    is_active: true,
    avatar: '📊',
  },
  {
    id: 'GOV-004',
    name: 'Keitumetse Raditedu',
    email: 'planner@rerra.gov.bw',
    password: 'GovL2B@2026',
    role: 'GOVT_L2',
    dept: 'RERRA Compliance',
    trust_score: 900,
    is_active: true,
    avatar: '📊',
  },
  {
    id: 'USR-001',
    name: 'Tebogo Modise',
    email: 'tebogo@landlord.bw',
    password: 'Landlord@2026',
    role: 'LANDLORD',
    dept: 'Individual Landlord',
    trust_score: 810,
    is_active: true,
    avatar: '🏠',
  },
  {
    id: 'CORP-001',
    name: 'Realco (Pty) Ltd',
    email: 'admin@realco.bw',
    password: 'Realco@2026',
    role: 'CORP_REP',
    dept: 'Corporate Landlord',
    trust_score: 940,
    is_active: true,
    avatar: '🏢',
  },
  {
    id: 'TEN-001',
    name: 'Mpho Gabaraane',
    email: 'mpho@tenant.bw',
    password: 'Tenant@2026',
    role: 'TENANT',
    dept: 'Tenant',
    trust_score: 870,
    is_active: true,
    avatar: '👤',
  },
  {
    id: 'EVAL-005',
    name: 'Onkabetse Keeme',
    email: 'onkabetse@evaluator.bw',
    password: 'Eval@2026',
    role: 'EVALUATOR',
    dept: 'Field Evaluator — Zone A+',
    trust_score: 890,
    is_active: true,
    avatar: '🧑‍💼',
  },
  {
    id: 'NAO-001',
    name: 'NAO Auditor',
    email: 'auditor@nao.gov.bw',
    password: 'NAO@2026',
    role: 'NAO',
    dept: 'National Audit Office',
    trust_score: 950,
    is_active: true,
    avatar: '🔍',
  },
];

// ─── Role Permissions ─────────────────────────────────────────────────────────
export const ROLE_NAV_ACCESS: Record<UserRole, string[]> = {
  SUPER_ADMIN: ['*'], // all routes
  GOVT_L1: ['/dashboard', '/dashboard/analytics', '/dashboard/policy', '/dashboard/tier-caps', '/dashboard/zones', '/dashboard/properties', '/dashboard/transactions', '/dashboard/ledger', '/dashboard/government', '/dashboard/rbac', '/dashboard/audit-trail', '/dashboard/admin'],
  GOVT_L2: ['/dashboard', '/dashboard/analytics', '/dashboard/policy', '/dashboard/tier-caps', '/dashboard/zones', '/dashboard/properties', '/dashboard/transactions', '/dashboard/ledger', '/dashboard/government', '/dashboard/rbac', '/dashboard/audit-trail'],
  LANDLORD: ['/dashboard', '/dashboard/properties', '/dashboard/transactions', '/dashboard/settlements', '/dashboard/vaps', '/dashboard/trust'],
  CORP_REP: ['/dashboard', '/dashboard/properties', '/dashboard/transactions', '/dashboard/settlements', '/dashboard/vaps', '/dashboard/trust', '/dashboard/ledger'],
  TENANT: ['/dashboard', '/dashboard/trust', '/dashboard/transactions'],
  EVALUATOR: ['/dashboard', '/dashboard/audits', '/dashboard/vaps', '/dashboard/properties'],
  NAO: ['/dashboard', '/dashboard/analytics', '/dashboard/ledger', '/dashboard/transactions', '/dashboard/audit-trail'],
};

export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  GOVT_L1: 'Level 1 – Executive',
  GOVT_L2: 'Level 2 – Analyst',
  LANDLORD: 'Landlord',
  CORP_REP: 'Corporate Rep',
  TENANT: 'Tenant',
  EVALUATOR: 'Youth Evaluator',
  NAO: 'Nat. Audit Office',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  SUPER_ADMIN: '#ef4444',
  GOVT_L1: '#f59e0b',
  GOVT_L2: '#a78bfa',
  LANDLORD: '#34d399',
  CORP_REP: '#06b6d4',
  TENANT: '#60a5fa',
  EVALUATOR: '#fbbf24',
  NAO: '#f87171',
};

// ─── Auth Context ─────────────────────────────────────────────────────────────
interface AuthContextType {
  user: AuthUser | null;
  users: AuthUser[];
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateUser: (id: string, updates: Partial<AuthUser>) => void;
  addUser: (user: Omit<AuthUser, 'id'>) => void;
  canAccess: (path: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [users, setUsers] = useState<AuthUser[]>(MOCK_USERS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('urip_user');
      if (stored) setUser(JSON.parse(stored));
      const storedUsers = localStorage.getItem('urip_users');
      if (storedUsers) setUsers(JSON.parse(storedUsers));
    } catch {}
    setLoaded(true);
  }, []);

  function login(email: string, password: string) {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!found) return { success: false, error: 'Invalid email or password.' };
    if (!found.is_active) return { success: false, error: 'Account is deactivated. Contact the Super Admin.' };
    const updated = { ...found, last_login: new Date().toISOString() };
    setUser(updated);
    sessionStorage.setItem('urip_user', JSON.stringify(updated));
    return { success: true };
  }

  function logout() {
    setUser(null);
    sessionStorage.removeItem('urip_user');
  }

  function updateUser(id: string, updates: Partial<AuthUser>) {
    setUsers(prev => {
      const next = prev.map(u => u.id === id ? { ...u, ...updates } : u);
      localStorage.setItem('urip_users', JSON.stringify(next));
      // if updating the logged-in user, refresh session
      if (user?.id === id) {
        const updated = { ...user, ...updates };
        setUser(updated);
        sessionStorage.setItem('urip_user', JSON.stringify(updated));
      }
      return next;
    });
  }

  function addUser(newUser: Omit<AuthUser, 'id'>) {
    const u: AuthUser = { ...newUser, id: `USR-${Date.now()}` };
    setUsers(prev => {
      const next = [...prev, u];
      localStorage.setItem('urip_users', JSON.stringify(next));
      return next;
    });
  }

  function canAccess(path: string): boolean {
    if (!user) return false;
    const perms = ROLE_NAV_ACCESS[user.role];
    if (perms.includes('*')) return true;
    return perms.some(p => path === p || path.startsWith(p + '/'));
  }

  if (!loaded) return null;

  return (
    <AuthContext.Provider value={{ user, users, login, logout, updateUser, addUser, canAccess }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
