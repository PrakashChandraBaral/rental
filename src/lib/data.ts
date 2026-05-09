// ─── URIP MOCK DATA STORE ───────────────────────────────────────────────────

export const GLOBAL_POLICY = {
  policy_id: "POL-2026-V3",
  levy_rate: 0.01,        // 1.0% Government
  coy_fee_rate: 0.015,    // 1.5% Collins Coy
  tech_fee_rate: 0.006,   // 0.6% Tech
  landlord_rate: 0.969,   // 96.9% Landlord
  vaps_multiplier: 250,   // BWP per VAPS point
  last_updated: "2026-05-01",
  updated_by: "Dir. Khumo Setlhare",
};

export const TIER_CAPS: Record<string, Record<string, number>> = {
  "A+": { "1": 12000, "2": 10000, "3": 8500, "4": 7000, "5": 5500 },
  "A":  { "1": 9500,  "2": 8000,  "3": 6500,  "4": 5500, "5": 4500 },
  "B":  { "1": 7000,  "2": 5500,  "3": 4500,  "4": 3500, "5": 2800 },
  "C":  { "1": 5000,  "2": 4000,  "3": 3200,  "4": 2500, "5": 2000 },
};

export const VAPS_REGISTRY = [
  { id: "SOLAR", label: "Solar Backup",     points: 2.0, icon: "☀️" },
  { id: "CCTV",  label: "CCTV / Security",  points: 1.5, icon: "📷" },
  { id: "FENCE", label: "Electric Fence",   points: 1.0, icon: "⚡" },
  { id: "BORE",  label: "Borehole Water",   points: 1.5, icon: "💧" },
  { id: "PAVE",  label: "Paved Driveway",   points: 0.5, icon: "🛣️" },
  { id: "FIBER", label: "Fibre Internet",   points: 1.0, icon: "🌐" },
];

export const PROPERTIES = [
  { plot_id: "PLOT-001-GAB", address: "Plot 1234, Block 5, Gaborone", owner: "Tebogo Modise", owner_uuid: "USR-001", zone: "A+", base_tier: 2, vaps_points: 3.5, status: "ACTIVE", tenants: 1, monthly_rent: 10875 },
  { plot_id: "PLOT-002-GAB", address: "Plot 5678, Extension 9, Gaborone", owner: "Realco (Pty) Ltd", owner_uuid: "CORP-001", zone: "A",  base_tier: 1, vaps_points: 2.0, status: "ACTIVE", tenants: 1, monthly_rent: 10000 },
  { plot_id: "PLOT-003-FRA", address: "Plot 890, Segment 4, Francistown", owner: "Kefilwe Pheto", owner_uuid: "USR-003", zone: "B",  base_tier: 3, vaps_points: 1.0, status: "PENDING_AUDIT", tenants: 0, monthly_rent: 0 },
  { plot_id: "PLOT-004-MAH", address: "Plot 112, Mahalapye Central", owner: "Olebile Taunyane", owner_uuid: "USR-004", zone: "C",  base_tier: 2, vaps_points: 0,   status: "ACTIVE", tenants: 1, monthly_rent: 4000 },
  { plot_id: "PLOT-005-GAB", address: "Plot 3300, Phakalane Estate, Gaborone", owner: "Realco (Pty) Ltd", owner_uuid: "CORP-001", zone: "A+", base_tier: 1, vaps_points: 5.5, status: "ACTIVE", tenants: 1, monthly_rent: 13375 },
  { plot_id: "PLOT-006-SER", address: "Plot 44, Serowe North", owner: "Boineelo Moseki", owner_uuid: "USR-006", zone: "C",  base_tier: 4, vaps_points: 0,   status: "ACTIVE", tenants: 1, monthly_rent: 2500 },
];

export const TENANTS = [
  { id: "TEN-001", name: "Mpho Gabaraane", omang: "***456789", trust_score: 870, lease_id: "LSE-001", plot_id: "PLOT-001-GAB", monthly_rent: 10875, status: "ACTIVE", paid_months: 8, late_payments: 0 },
  { id: "TEN-002", name: "Lesego Kgosi", omang: "***112233", trust_score: 620, lease_id: "LSE-002", plot_id: "PLOT-002-GAB", monthly_rent: 10000, status: "ACTIVE", paid_months: 3, late_payments: 1 },
  { id: "TEN-003", name: "Naledi Ditheko", omang: "***998877", trust_score: 940, lease_id: "LSE-003", plot_id: "PLOT-004-MAH", monthly_rent: 4000, status: "ACTIVE", paid_months: 14, late_payments: 0 },
  { id: "TEN-004", name: "Gofaone Molefe", omang: "***334455", trust_score: 480, lease_id: "LSE-004", plot_id: "PLOT-005-GAB", monthly_rent: 13375, status: "OVERDUE", paid_months: 2, late_payments: 2 },
  { id: "TEN-005", name: "Thato Sebina", omang: "***667788", trust_score: 730, lease_id: "LSE-005", plot_id: "PLOT-006-SER", monthly_rent: 2500, status: "ACTIVE", paid_months: 6, late_payments: 1 },
];

export const TRANSACTIONS = [
  { txn_id: "TXN-8821", lease_id: "LSE-001", tenant: "Mpho Gabaraane", plot_id: "PLOT-001-GAB", gross: 10875, govt_levy: 108.75, coy_fee: 163.13, tech_fee: 65.25, landlord_net: 10537.87, status: "SETTLED", date: "2026-05-01", provider: "Orange Money", ref: "OM-99821" },
  { txn_id: "TXN-8822", lease_id: "LSE-002", tenant: "Lesego Kgosi",   plot_id: "PLOT-002-GAB", gross: 10000, govt_levy: 100.00, coy_fee: 150.00, tech_fee: 60.00, landlord_net: 9690.00, status: "SETTLED", date: "2026-05-02", provider: "MyZaka", ref: "MZ-45123" },
  { txn_id: "TXN-8823", lease_id: "LSE-003", tenant: "Naledi Ditheko", plot_id: "PLOT-004-MAH", gross: 4000,  govt_levy: 40.00,  coy_fee: 60.00,  tech_fee: 24.00, landlord_net: 3876.00,  status: "SETTLED", date: "2026-05-01", provider: "BTC Smega", ref: "SM-11234" },
  { txn_id: "TXN-8824", lease_id: "LSE-004", tenant: "Gofaone Molefe", plot_id: "PLOT-005-GAB", gross: 13375, govt_levy: 133.75, coy_fee: 200.63, tech_fee: 80.25, landlord_net: 12960.37, status: "PENDING",  date: "2026-05-06", provider: "Orange Money", ref: "OM-88762" },
  { txn_id: "TXN-8825", lease_id: "LSE-005", tenant: "Thato Sebina",   plot_id: "PLOT-006-SER", gross: 2500,  govt_levy: 25.00,  coy_fee: 37.50,  tech_fee: 15.00, landlord_net: 2422.50,  status: "SETTLED", date: "2026-05-03", provider: "MyZaka", ref: "MZ-55678" },
  { txn_id: "TXN-8801", lease_id: "LSE-001", tenant: "Mpho Gabaraane", plot_id: "PLOT-001-GAB", gross: 10875, govt_levy: 108.75, coy_fee: 163.13, tech_fee: 65.25, landlord_net: 10537.87, status: "SETTLED", date: "2026-04-01", provider: "Orange Money", ref: "OM-88901" },
];

export const AUDITS = [
  { audit_id: "AUD-001", plot_id: "PLOT-001-GAB", evaluator: "Onkabetse Keeme", evaluator_id: "EVAL-005", date: "2026-04-15", gps_verified: true, dwell_mins: 22, vaps_verified: ["SOLAR","CCTV","FIBER"], status: "APPROVED", score: 8.5 },
  { audit_id: "AUD-002", plot_id: "PLOT-002-GAB", evaluator: "Phenyo Tau",     evaluator_id: "EVAL-012", date: "2026-04-18", gps_verified: true, dwell_mins: 18, vaps_verified: ["SOLAR"], status: "APPROVED", score: 7.2 },
  { audit_id: "AUD-003", plot_id: "PLOT-003-FRA", evaluator: "Tsholofelo Odi", evaluator_id: "EVAL-033", date: "2026-05-07", gps_verified: false, dwell_mins: 4,  vaps_verified: [], status: "REJECTED", score: 0 },
  { audit_id: "AUD-004", plot_id: "PLOT-005-GAB", evaluator: "Obakeng Makwela", evaluator_id: "EVAL-007", date: "2026-04-20", gps_verified: true, dwell_mins: 35, vaps_verified: ["SOLAR","CCTV","BORE","PAVE","FIBER"], status: "APPROVED", score: 9.8 },
];

export const EVALUATORS = [
  { id: "EVAL-005", name: "Onkabetse Keeme", zone: "Gaborone A+",   audits_done: 42, audits_target: 50, trust_score: 890, status: "ACTIVE" },
  { id: "EVAL-012", name: "Phenyo Tau",      zone: "Gaborone A",    audits_done: 38, audits_target: 50, trust_score: 820, status: "ACTIVE" },
  { id: "EVAL-033", name: "Tsholofelo Odi",  zone: "Francistown B", audits_done: 15, audits_target: 50, trust_score: 540, status: "WARNING" },
  { id: "EVAL-007", name: "Obakeng Makwela", zone: "Gaborone A+",   audits_done: 49, audits_target: 50, trust_score: 960, status: "ACTIVE" },
  { id: "EVAL-019", name: "Goitseone Nkwe",  zone: "Mahalapye C",   audits_done: 28, audits_target: 50, trust_score: 710, status: "ACTIVE" },
];

export const GOVT_ADMINS = [
  { id: "GOV-001", name: "Min. Dithapelo Keoagile", role: "Level 1 – Minister",        dept: "Ministry of Housing", clearance: 1 },
  { id: "GOV-002", name: "PS. Keabetswe Molosiwa",   role: "Level 1 – Perm. Secretary", dept: "Ministry of Housing", clearance: 1 },
  { id: "GOV-003", name: "Dr. Omphile Ntshimogang",   role: "Level 2 – Chief Economist", dept: "RERRA Compliance",    clearance: 2 },
  { id: "GOV-004", name: "Keitumetse Raditedu",        role: "Level 2 – Urban Planner",   dept: "RERRA Compliance",    clearance: 2 },
];

export const POLICY_PROPOSALS = [
  { id: "PROP-001", proposed_by: "Dr. Omphile Ntshimogang", variable: "TIER_CAP A+/T1", current: 12000, proposed: 12500, simulation_impact: "+BWP 2.1M annual levy", status: "PENDING_L1", created_at: "2026-05-06" },
  { id: "PROP-002", proposed_by: "Keitumetse Raditedu",      variable: "GOVT_LEVY_RATE", current: "1.0%", proposed: "1.1%", simulation_impact: "+BWP 890K annual levy", status: "APPROVED",  created_at: "2026-04-22" },
];

export const NATIONAL_STATS = {
  total_properties: 14823,
  active_leases: 11204,
  total_tenants: 11204,
  total_landlords: 8932,
  evaluators_deployed: 500,
  monthly_levy_collected: 2841320,
  monthly_gross_transactions: 284132000,
  avg_trust_score_tenant: 694,
  avg_trust_score_landlord: 748,
  properties_by_zone: { "A+": 2104, "A": 4211, "B": 5632, "C": 2876 },
  monthly_revenue: [
    { month: "Dec", levy: 2100000, gross: 210000000 },
    { month: "Jan", levy: 2250000, gross: 225000000 },
    { month: "Feb", levy: 2400000, gross: 240000000 },
    { month: "Mar", levy: 2550000, gross: 255000000 },
    { month: "Apr", levy: 2700000, gross: 270000000 },
    { month: "May", levy: 2841320, gross: 284132000 },
  ],
  zone_performance: [
    { zone: "A+", properties: 2104, avg_rent: 10250, compliance: 98.2 },
    { zone: "A",  properties: 4211, avg_rent: 7800,  compliance: 96.5 },
    { zone: "B",  properties: 5632, avg_rent: 5100,  compliance: 94.1 },
    { zone: "C",  properties: 2876, avg_rent: 3200,  compliance: 91.8 },
  ],
};

export function formatPula(amount: number) {
  return `BWP ${amount.toLocaleString("en-BW", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function getTrustBadge(score: number) {
  if (score >= 800) return { label: "Excellent", color: "badge-green" };
  if (score >= 600) return { label: "Good",      color: "badge-blue"  };
  if (score >= 400) return { label: "Fair",      color: "badge-gold"  };
  return                    { label: "At Risk",  color: "badge-red"   };
}

export function getStatusBadge(status: string) {
  const map: Record<string, string> = {
    ACTIVE: "badge-green", PENDING: "badge-gold", PENDING_AUDIT: "badge-gold",
    SETTLED: "badge-green", OVERDUE: "badge-red", FAILED: "badge-red",
    REJECTED: "badge-red", APPROVED: "badge-green", WARNING: "badge-gold",
    PENDING_L1: "badge-purple",
  };
  return map[status] ?? "badge-blue";
}
