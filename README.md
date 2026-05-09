# URIP — Unified Rental Infrastructure Portal

The national regulatory-fintech engine for Botswana's housing market.

## How to Run the App

1. Ensure you have **Node.js** installed on your machine.
2. Open your terminal and navigate to the `urip` directory:
   ```bash
   cd /Users/prakashbaral/rental/urip
   ```
3. Install the project dependencies:
   ```bash
   npm install
   ```
4. Start the Next.js development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to:
   **[http://localhost:3000](http://localhost:3000)**

## Database Schema

The comprehensive MySQL database schema designed for this app is located at:
`database/urip_schema.sql`

To initialize the database locally:
```bash
mysql -u root -p < database/urip_schema.sql
```

## Demo Login Credentials

The application uses a secure Role-Based Access Control (RBAC) system. You can test the different portals using the following demo accounts on the login page:

- **Super Admin:** `superadmin@urip.gov.bw` / `Admin@2026`
- **Govt Level 1:** `minister@housing.gov.bw` / `GovL1@2026`
- **Govt Level 2:** `economist@rerra.gov.bw` / `GovL2@2026`
- **Landlord:** `tebogo@landlord.bw` / `Landlord@2026`
- **Tenant:** `mpho@tenant.bw` / `Tenant@2026`
- **Field Evaluator:** `onkabetse@evaluator.bw` / `Eval@2026`
- **NAO Auditor:** `auditor@nao.gov.bw` / `NAO@2026`
