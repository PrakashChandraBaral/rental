-- ============================================================
-- URIP — Unified Rental Infrastructure Portal
-- MySQL Schema v3.0  |  RERRA Botswana
-- ============================================================

CREATE DATABASE IF NOT EXISTS urip_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE urip_db;

-- ============================================================
-- CLUSTER 1: IDENTITY
-- ============================================================

CREATE TABLE identity_registry (
    identity_uuid       CHAR(36)      PRIMARY KEY DEFAULT (UUID()),
    document_type       ENUM('OMANG','PASSPORT','RESIDENCE_PERMIT') NOT NULL,
    document_number     VARCHAR(50)   UNIQUE NOT NULL,
    issuing_country     CHAR(3)       NOT NULL DEFAULT 'BWA',  -- ISO 3166-1 alpha-3
    full_name_hash      TEXT          NOT NULL COMMENT 'AES-256-GCM encrypted',
    biometric_signature_hash TEXT     COMMENT 'SHA-256 of biometric template',
    trust_score         SMALLINT      NOT NULL DEFAULT 500
                                      CHECK (trust_score BETWEEN 0 AND 1000),
    is_verified         BOOLEAN       NOT NULL DEFAULT FALSE,
    mfa_hardware_id     VARCHAR(128)  COMMENT 'FIDO2/HSM device fingerprint',
    created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
                                      ON UPDATE CURRENT_TIMESTAMP
) COMMENT 'Root identity table — all human actors';

CREATE TABLE per_users (
    user_id             CHAR(36)      PRIMARY KEY DEFAULT (UUID()),
    identity_uuid       CHAR(36)      NOT NULL,
    omang_hash          VARCHAR(128)  UNIQUE NOT NULL COMMENT 'Salted SHA-256 for fast lookup',
    role_type           ENUM('GOVT_L1','GOVT_L2','LANDLORD','TENANT','EVALUATOR','CORP_REP') NOT NULL,
    trust_score         SMALLINT      NOT NULL DEFAULT 500
                                      CHECK (trust_score BETWEEN 0 AND 1000),
    is_active           BOOLEAN       NOT NULL DEFAULT TRUE,
    last_login          DATETIME,
    created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_identity
        FOREIGN KEY (identity_uuid) REFERENCES identity_registry(identity_uuid)
) COMMENT 'Access & role table for all human actors';

CREATE INDEX idx_per_users_role   ON per_users(role_type);
CREATE INDEX idx_per_users_active ON per_users(is_active);

-- ============================================================
-- CLUSTER 2: CORPORATE
-- ============================================================

CREATE TABLE corporate_registry (
    company_uin         VARCHAR(20)   PRIMARY KEY COMMENT 'CIPA Unique Identification Number',
    company_name        VARCHAR(255)  NOT NULL,
    tax_id_burs         VARCHAR(20)   UNIQUE COMMENT 'BURS tax reference',
    bank_account_verified BOOLEAN     NOT NULL DEFAULT FALSE,
    kyc_status          BOOLEAN       NOT NULL DEFAULT FALSE COMMENT 'AML check passed',
    payout_config       ENUM('MOBILE_MONEY','BANK_EFT','ISO_20022') NOT NULL DEFAULT 'BANK_EFT',
    registered_office_address TEXT,
    cipa_status         ENUM('ACTIVE','DEREGISTERED','LIQUIDATED') NOT NULL DEFAULT 'ACTIVE',
    created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
) COMMENT 'Juridical persons verified via CIPA API';

CREATE TABLE staff_assignments (
    assignment_id       CHAR(36)      PRIMARY KEY DEFAULT (UUID()),
    company_uin         VARCHAR(20)   NOT NULL,
    employee_uuid       CHAR(36)      NOT NULL,
    role_profile        ENUM('DIRECTOR','MANAGER','AGENT','ACCOUNTANT') NOT NULL,
    signatory_power     BOOLEAN       NOT NULL DEFAULT FALSE,
    can_view_financials BOOLEAN       NOT NULL DEFAULT FALSE,
    can_change_bank     BOOLEAN       NOT NULL DEFAULT FALSE,
    is_active           BOOLEAN       NOT NULL DEFAULT TRUE,
    assigned_at         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked_at          DATETIME,
    CONSTRAINT fk_staff_corp     FOREIGN KEY (company_uin)    REFERENCES corporate_registry(company_uin),
    CONSTRAINT fk_staff_identity FOREIGN KEY (employee_uuid)  REFERENCES identity_registry(identity_uuid),
    CONSTRAINT uq_staff_corp_emp UNIQUE (company_uin, employee_uuid)
) COMMENT 'Maps human users to corporate entities with delegated permissions';

-- ============================================================
-- CLUSTER 3: POLICY (The Regulatory Hub)
-- ============================================================

CREATE TABLE global_policy (
    policy_id           CHAR(36)      PRIMARY KEY DEFAULT (UUID()),
    levy_rate           DECIMAL(6,5)  NOT NULL DEFAULT 0.01000 COMMENT '1.0% Govt levy',
    coy_fee_rate        DECIMAL(6,5)  NOT NULL DEFAULT 0.01500 COMMENT '1.5% Collins Coy',
    tech_fee_rate       DECIMAL(6,5)  NOT NULL DEFAULT 0.00600 COMMENT '0.6% Tech',
    vaps_multiplier     DECIMAL(8,2)  NOT NULL DEFAULT 250.00  COMMENT 'BWP per VAPS point',
    initiated_by        CHAR(36)      COMMENT 'Level 2 analyst user_id',
    authorized_by       CHAR(36)      COMMENT 'Level 1 executive user_id',
    rsa_signature_hash  TEXT          COMMENT 'RSA-4096 signature of the authorizer',
    shadow_sim_ref      CHAR(36)      COMMENT 'Reference to shadow simulation report',
    active_from         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active_to           DATETIME      COMMENT 'NULL means currently active',
    is_active           BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
) COMMENT 'Versioned policy table — append-only, Four-Eyes authorization';

CREATE TABLE tier_pricing (
    tier_id             INT           PRIMARY KEY AUTO_INCREMENT,
    zone_id             ENUM('A+','A','B','C') NOT NULL,
    tier_level          TINYINT       NOT NULL CHECK (tier_level BETWEEN 1 AND 5),
    max_rent            DECIMAL(12,2) NOT NULL COMMENT 'BWP price cap set by Govt',
    policy_id           CHAR(36)      NOT NULL COMMENT 'Policy version that set this cap',
    active_from         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tier_policy FOREIGN KEY (policy_id) REFERENCES global_policy(policy_id),
    CONSTRAINT uq_zone_tier   UNIQUE (zone_id, tier_level)
) COMMENT 'Government-mandated rent ceilings per zone and tier';

CREATE TABLE vaps_registry (
    vaps_id             VARCHAR(20)   PRIMARY KEY,
    label               VARCHAR(100)  NOT NULL,
    points              DECIMAL(4,2)  NOT NULL,
    description         TEXT,
    is_active           BOOLEAN       NOT NULL DEFAULT TRUE
) COMMENT 'Value-Add Points catalogue — Solar, CCTV, Borehole, etc.';

INSERT INTO vaps_registry (vaps_id, label, points) VALUES
    ('SOLAR',  'Solar Backup',      2.00),
    ('CCTV',   'CCTV / Security',   1.50),
    ('FENCE',  'Electric Fence',    1.00),
    ('BORE',   'Borehole Water',    1.50),
    ('PAVE',   'Paved Driveway',    0.50),
    ('FIBER',  'Fibre Internet',    1.00);

CREATE TABLE policy_proposals (
    proposal_id         CHAR(36)      PRIMARY KEY DEFAULT (UUID()),
    proposed_by         CHAR(36)      NOT NULL COMMENT 'Level 2 user_id',
    variable_name       VARCHAR(100)  NOT NULL,
    current_value       VARCHAR(50)   NOT NULL,
    proposed_value      VARCHAR(50)   NOT NULL,
    simulation_impact   TEXT          COMMENT 'Shadow simulation summary',
    sim_revenue_delta   DECIMAL(15,2),
    sim_affordability   TEXT,
    proposal_hash       VARCHAR(128)  COMMENT 'SHA-256 of proposal content',
    status              ENUM('DRAFT','PENDING_L1','APPROVED','REJECTED') NOT NULL DEFAULT 'DRAFT',
    l1_signature_hash   TEXT          COMMENT 'Level 1 RSA-4096 digital signature',
    signed_at           DATETIME,
    signed_by           CHAR(36)      COMMENT 'Level 1 user_id',
    created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
) COMMENT 'Four-Eyes policy change proposals with simulation results';

-- ============================================================
-- CLUSTER 4: ASSET (Properties & Audits)
-- ============================================================

CREATE TABLE properties (
    plot_id             VARCHAR(50)   PRIMARY KEY COMMENT 'Cadastral ID from Deeds Registry',
    owner_type          ENUM('INDIVIDUAL','CORPORATE') NOT NULL DEFAULT 'INDIVIDUAL',
    owner_identity_uuid CHAR(36)      COMMENT 'FK to identity_registry for individuals',
    owner_company_uin   VARCHAR(20)   COMMENT 'FK to corporate_registry for companies',
    gps_lat             DECIMAL(10,7) NOT NULL COMMENT 'WGS-84 latitude',
    gps_lng             DECIMAL(10,7) NOT NULL COMMENT 'WGS-84 longitude',
    zone_id             ENUM('A+','A','B','C') NOT NULL,
    base_tier           TINYINT       NOT NULL CHECK (base_tier BETWEEN 1 AND 5),
    vaps_total_points   DECIMAL(6,2)  NOT NULL DEFAULT 0.00,
    current_ceiling     DECIMAL(12,2) COMMENT 'Computed: base_tier_price + (vaps_total_points * 250)',
    status              ENUM('PENDING_AUDIT','ACTIVE','SUSPENDED','DEREGISTERED') NOT NULL DEFAULT 'PENDING_AUDIT',
    deeds_verified      BOOLEAN       NOT NULL DEFAULT FALSE,
    registered_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_audit_date     DATETIME,
    CONSTRAINT fk_prop_owner    FOREIGN KEY (owner_identity_uuid) REFERENCES identity_registry(identity_uuid),
    CONSTRAINT fk_prop_corp     FOREIGN KEY (owner_company_uin)   REFERENCES corporate_registry(company_uin),
    CONSTRAINT fk_prop_zone     FOREIGN KEY (zone_id, base_tier)  REFERENCES tier_pricing(zone_id, tier_level)
) COMMENT 'Digital twin of every registered rental plot in Botswana';

CREATE INDEX idx_prop_zone   ON properties(zone_id);
CREATE INDEX idx_prop_status ON properties(status);
CREATE INDEX idx_prop_owner  ON properties(owner_identity_uuid);

CREATE TABLE property_vaps (
    id                  INT           PRIMARY KEY AUTO_INCREMENT,
    plot_id             VARCHAR(50)   NOT NULL,
    vaps_id             VARCHAR(20)   NOT NULL,
    declared_at         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verified_at         DATETIME      COMMENT 'NULL until evaluator confirms',
    audit_id            CHAR(36)      COMMENT 'FK to audit that verified this amenity',
    is_verified         BOOLEAN       NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_pvaps_prop  FOREIGN KEY (plot_id)  REFERENCES properties(plot_id),
    CONSTRAINT fk_pvaps_vaps  FOREIGN KEY (vaps_id)  REFERENCES vaps_registry(vaps_id),
    CONSTRAINT uq_plot_vaps   UNIQUE (plot_id, vaps_id)
) COMMENT 'Junction: which amenities each property has declared and verified';

CREATE TABLE rerra_audits (
    audit_id            CHAR(36)      PRIMARY KEY DEFAULT (UUID()),
    plot_id             VARCHAR(50)   NOT NULL,
    evaluator_id        CHAR(36)      NOT NULL COMMENT 'FK to per_users',
    device_fingerprint  VARCHAR(255)  COMMENT 'Hardware ID of evaluator device',
    entry_timestamp     DATETIME      NOT NULL,
    exit_timestamp      DATETIME,
    dwell_seconds       INT           AS (TIMESTAMPDIFF(SECOND, entry_timestamp, exit_timestamp)) STORED,
    evaluator_lat       DECIMAL(10,7) NOT NULL,
    evaluator_lng       DECIMAL(10,7) NOT NULL,
    distance_to_plot_m  DECIMAL(8,2)  NOT NULL,
    gps_verified        BOOLEAN       NOT NULL DEFAULT FALSE COMMENT 'TRUE if distance_to_plot_m <= 50',
    min_dwell_met       BOOLEAN       NOT NULL DEFAULT FALSE COMMENT 'TRUE if dwell >= 900s (15 min)',
    photo_frontage_url  TEXT,
    photo_kitchen_url   TEXT,
    photo_bedroom_url   TEXT,
    photo_bathroom_url  TEXT,
    vaps_verified       JSON          COMMENT 'Array of verified vaps_ids e.g. ["SOLAR","CCTV"]',
    audit_score         DECIMAL(4,2)  CHECK (audit_score BETWEEN 0 AND 10),
    status              ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
    rejection_reason    TEXT,
    submitted_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_prop  FOREIGN KEY (plot_id)       REFERENCES properties(plot_id),
    CONSTRAINT fk_audit_eval  FOREIGN KEY (evaluator_id)  REFERENCES per_users(user_id)
) COMMENT 'GPS-locked field audit records — minimum 15-min dwell + 50m geofence';

-- ============================================================
-- CLUSTER 5: LEASE & TRANSACTION (Financial Ledger)
-- ============================================================

CREATE TABLE leases (
    lease_id            CHAR(36)      PRIMARY KEY DEFAULT (UUID()),
    plot_id             VARCHAR(50)   NOT NULL,
    tenant_identity_uuid CHAR(36)     NOT NULL,
    landlord_identity_uuid CHAR(36)   COMMENT 'NULL if corporate owner',
    landlord_company_uin VARCHAR(20)  COMMENT 'NULL if individual owner',
    monthly_rent        DECIMAL(12,2) NOT NULL,
    policy_id_at_sign   CHAR(36)      NOT NULL COMMENT 'Policy version active at signing',
    lease_start         DATE          NOT NULL,
    lease_end           DATE,
    digital_sig_tenant  TEXT          COMMENT 'RSA-4096 signature hash',
    digital_sig_landlord TEXT         COMMENT 'RSA-4096 signature hash',
    signed_by_staff_uuid CHAR(36)     COMMENT 'Corporate rep who signed on behalf',
    status              ENUM('DRAFT','ACTIVE','EXPIRED','TERMINATED') NOT NULL DEFAULT 'DRAFT',
    qr_pair_code        VARCHAR(64)   UNIQUE COMMENT 'QR code for tenant-landlord pairing',
    created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lease_plot     FOREIGN KEY (plot_id)               REFERENCES properties(plot_id),
    CONSTRAINT fk_lease_tenant   FOREIGN KEY (tenant_identity_uuid)  REFERENCES identity_registry(identity_uuid),
    CONSTRAINT fk_lease_policy   FOREIGN KEY (policy_id_at_sign)     REFERENCES global_policy(policy_id)
) COMMENT 'RERRA-compliant digital lease agreements';

CREATE TABLE rerra_financial_logs (
    txn_id              CHAR(36)      PRIMARY KEY DEFAULT (UUID()),
    lease_id            CHAR(36)      NOT NULL,
    policy_id           CHAR(36)      NOT NULL COMMENT 'Rates active at time of transaction',
    invoice_ref         VARCHAR(50)   UNIQUE NOT NULL COMMENT 'Monthly invoice reference',
    provider_txn_ref    VARCHAR(100)  UNIQUE COMMENT 'Idempotency key from Orange Money/MyZaka/Bank',
    payment_provider    ENUM('ORANGE_MONEY','MYZAKA','BTC_SMEGA','BANK_EFT','ISO_20022','SWIFT') NOT NULL,
    total_gross         DECIMAL(12,2) NOT NULL,
    govt_levy_amt       DECIMAL(12,2) NOT NULL COMMENT '1.0% → Treasury',
    coy_fee_amt         DECIMAL(12,2) NOT NULL COMMENT '1.5% → Collins Coy',
    tech_fee_amt        DECIMAL(12,2) NOT NULL COMMENT '0.6% → Tech Maintenance',
    landlord_net_amt    DECIMAL(12,2) NOT NULL COMMENT '96.9% → Landlord',
    settlement_status   ENUM('PENDING','SETTLED','REVERSED','EXCEPTION') NOT NULL DEFAULT 'PENDING',
    exception_reason    TEXT          COMMENT 'Populated on EXCEPTION status',
    late_fee_applied    BOOLEAN       NOT NULL DEFAULT FALSE,
    is_reversal         BOOLEAN       NOT NULL DEFAULT FALSE COMMENT 'TRUE for correction entries',
    reversal_of_txn_id  CHAR(36)      COMMENT 'FK to original TXN if this is a reversal',
    created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    settled_at          DATETIME,
    CONSTRAINT fk_log_lease  FOREIGN KEY (lease_id)  REFERENCES leases(lease_id),
    CONSTRAINT fk_log_policy FOREIGN KEY (policy_id) REFERENCES global_policy(policy_id)
) COMMENT 'APPEND-ONLY immutable financial ledger — no UPDATEs allowed';

-- Prevent updates on financial logs (enforced at application level + DB trigger)
CREATE TRIGGER trg_no_update_financial_logs
    BEFORE UPDATE ON rerra_financial_logs
    FOR EACH ROW
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'URIP: rerra_financial_logs is append-only. Issue a REVERSAL entry instead.';

CREATE INDEX idx_txn_lease    ON rerra_financial_logs(lease_id);
CREATE INDEX idx_txn_status   ON rerra_financial_logs(settlement_status);
CREATE INDEX idx_txn_date     ON rerra_financial_logs(created_at);
CREATE INDEX idx_txn_idem     ON rerra_financial_logs(provider_txn_ref);

CREATE TABLE invoices (
    invoice_id          CHAR(36)      PRIMARY KEY DEFAULT (UUID()),
    lease_id            CHAR(36)      NOT NULL,
    billing_period      DATE          NOT NULL COMMENT 'First day of billing month',
    base_rent           DECIMAL(12,2) NOT NULL,
    vaps_premium        DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    govt_levy_line      DECIMAL(12,2) NOT NULL,
    coy_fee_line        DECIMAL(12,2) NOT NULL,
    tech_fee_line       DECIMAL(12,2) NOT NULL,
    total_due           DECIMAL(12,2) NOT NULL,
    due_date            DATE          NOT NULL COMMENT 'Grace period ends 5th of month',
    status              ENUM('GENERATED','SENT','PAID','OVERDUE','PARTIAL') NOT NULL DEFAULT 'GENERATED',
    txn_id              CHAR(36)      COMMENT 'FK to rerra_financial_logs once paid',
    late_fee_pct        DECIMAL(5,4)  NOT NULL DEFAULT 0.00,
    generated_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inv_lease FOREIGN KEY (lease_id) REFERENCES leases(lease_id)
) COMMENT 'Monthly invoices generated on the 25th by the BillingEngine';

-- ============================================================
-- CLUSTER 6: TRUST SCORE EVENTS
-- ============================================================

CREATE TABLE trust_score_events (
    event_id            CHAR(36)      PRIMARY KEY DEFAULT (UUID()),
    actor_uuid          CHAR(36)      NOT NULL COMMENT 'FK to identity_registry',
    actor_type          ENUM('TENANT','LANDLORD','EVALUATOR') NOT NULL,
    event_type          VARCHAR(60)   NOT NULL COMMENT 'e.g. ON_TIME_PAYMENT, LATE_PAYMENT, RENT_CAP_BREACH',
    delta               SMALLINT      NOT NULL COMMENT 'Positive or negative score change',
    score_before        SMALLINT      NOT NULL,
    score_after         SMALLINT      NOT NULL,
    reference_id        CHAR(36)      COMMENT 'lease_id, txn_id, or audit_id that triggered event',
    notes               TEXT,
    created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tse_actor FOREIGN KEY (actor_uuid) REFERENCES identity_registry(identity_uuid)
) COMMENT 'Immutable event log driving dynamic trust scores';

-- ============================================================
-- CLUSTER 7: AUDIT TRAIL (NAO access)
-- ============================================================

CREATE TABLE system_audit_trail (
    log_id              CHAR(36)      PRIMARY KEY DEFAULT (UUID()),
    actor_uuid          CHAR(36)      COMMENT 'Who performed the action',
    actor_role          VARCHAR(50),
    action              VARCHAR(100)  NOT NULL COMMENT 'e.g. POLICY_CHANGE, AUDIT_SUBMIT, LEASE_SIGN',
    entity_type         VARCHAR(50)   NOT NULL COMMENT 'Table/entity affected',
    entity_id           VARCHAR(100)  NOT NULL,
    payload_hash        VARCHAR(128)  COMMENT 'SHA-256 of the full action payload',
    ip_address          VARCHAR(45),
    device_fingerprint  VARCHAR(255),
    previous_hash       VARCHAR(128)  COMMENT 'Merkle-chain: hash of previous log entry',
    created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
) COMMENT 'Tamper-evident audit log (Merkle-chained) for NAO oversight';

-- ============================================================
-- SEED DATA
-- ============================================================

-- Insert default active policy
INSERT INTO global_policy (
    policy_id, levy_rate, coy_fee_rate, tech_fee_rate, vaps_multiplier,
    is_active, active_from
) VALUES (
    UUID(), 0.01000, 0.01500, 0.00600, 250.00, TRUE, '2026-01-01 00:00:00'
);

-- Tier pricing (Zone A+ baseline)
INSERT INTO tier_pricing (zone_id, tier_level, max_rent, policy_id)
SELECT 'A+', t.lvl, t.price, p.policy_id
FROM (
    SELECT 1 AS lvl, 12000.00 AS price UNION ALL
    SELECT 2, 10000.00 UNION ALL
    SELECT 3, 8500.00  UNION ALL
    SELECT 4, 7000.00  UNION ALL
    SELECT 5, 5500.00
) t
CROSS JOIN (SELECT policy_id FROM global_policy WHERE is_active = TRUE LIMIT 1) p;

INSERT INTO tier_pricing (zone_id, tier_level, max_rent, policy_id)
SELECT 'A', t.lvl, t.price, p.policy_id
FROM (
    SELECT 1 AS lvl, 9500.00 AS price UNION ALL
    SELECT 2, 8000.00 UNION ALL
    SELECT 3, 6500.00 UNION ALL
    SELECT 4, 5500.00 UNION ALL
    SELECT 5, 4500.00
) t
CROSS JOIN (SELECT policy_id FROM global_policy WHERE is_active = TRUE LIMIT 1) p;

INSERT INTO tier_pricing (zone_id, tier_level, max_rent, policy_id)
SELECT 'B', t.lvl, t.price, p.policy_id
FROM (
    SELECT 1 AS lvl, 7000.00 AS price UNION ALL
    SELECT 2, 5500.00 UNION ALL
    SELECT 3, 4500.00 UNION ALL
    SELECT 4, 3500.00 UNION ALL
    SELECT 5, 2800.00
) t
CROSS JOIN (SELECT policy_id FROM global_policy WHERE is_active = TRUE LIMIT 1) p;

INSERT INTO tier_pricing (zone_id, tier_level, max_rent, policy_id)
SELECT 'C', t.lvl, t.price, p.policy_id
FROM (
    SELECT 1 AS lvl, 5000.00 AS price UNION ALL
    SELECT 2, 4000.00 UNION ALL
    SELECT 3, 3200.00 UNION ALL
    SELECT 4, 2500.00 UNION ALL
    SELECT 5, 2000.00
) t
CROSS JOIN (SELECT policy_id FROM global_policy WHERE is_active = TRUE LIMIT 1) p;
