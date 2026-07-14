<div align="center">

# 🦅 SUPER ADMIN PLATFORM CONTROL CONSOLE
### *Ecosystem Governance • Tenant Onboarding • Platform Integrity*

---

[![Status](https://img.shields.io/badge/System-MASTER-EA4335?style=for-the-badge&logo=statuspage&logoColor=white)]()
[![Module](https://img.shields.io/badge/Module-SAAS_CONTROL-1A1A1A?style=for-the-badge&logo=expert-voice&logoColor=white)]()

---

</div>

## 🌀 MULTI-TENANT ECOSYSTEM TOPOLOGY

GymFlow operates on a shared-database, multi-tenant SaaS architecture. Super Admins manage the tenants (individual gyms/gym networks), pricing tiers, system configurations, and platform health.

```mermaid
graph TD
    SC((Super Admin Console)) --- T1[Tenant A: GymFlow Demo]
    SC --- T2[Tenant B: Elite Fitness]
    SC --- T3[Tenant C: Powerhouse Gym]
    
    T1 --- B1[Branch: Vadodara]
    T2 --- B2[Branch: Mumbai]
    T3 --- B3[Branch: Delhi]
    
    subgraph "SaaS Orchestration Core"
    DB[(Prisma PostgreSQL + Tenant-Isolation Filter)]
    Cron[Daily Expiry Daemon /api/cron]
    AL[Platform Audit Trail]
    end
    
    SC -.-> DB
    SC -.-> Cron
    SC -.-> AL
```

---

## 🚀 CORE PLATFORM MODULES

### 🏢 TENANT MANAGEMENT `(super-admin/tenants)`
- **SaaS Onboarding**: Complete dashboard showing active, inactive, and suspended gym tenants.
- **Tenant Actions**: Suspend or reactivate tenants dynamically, which triggers immediate NextAuth authentication blocks for all user accounts belonging to that tenant.
- **Gym Configuration Mapping**: Links gym tenants to their specific custom domains, subdomains, and SaaS subscription tiers.

### ⚙️ SYSTEM LOCALIZATION `(super-admin/system-config)`
- **Dynamic Currency Settings**: Configures the default platform currency (`INR`, `USD`, `EUR`, `GBP`) mapping to corresponding locale formats (`en-IN`, `en-US`, `de-DE`) stored in `localStorage` for responsive client-side rendering.
- **Localization Variables**: Configures default timezones (`UTC`, `IST`, `EST`, `PST`) and date formats (`DD/MM/YYYY`, `MM/DD/YYYY`).
- **Feature Access Flags**: Toggles email notifications, SMS alerts, WhatsApp message routing, and MFA checks globally.

### 🕒 SUBSCRIPTION EXPIRY CRON `(/api/cron)`
- **Automated Expiring Logic**: Secured by `CRON_SECRET` headers to run daily at midnight.
- **Dynamic State Management**: Detects expired subscriptions, transitions user roles, and suspends delinquent tenant accounts.

### 🔍 AUDIT SURVEILLANCE `(super-admin/audit-logs)`
- **Forensic Actions Tracker**: Records administrative actions (create branch, import members, update system settings) including origin IP address and browser User-Agent.
- **Backups Console (`super-admin/backups`)**: Handles manual and scheduled snapshots of multi-tenant database records.

---

## 📊 PLATFORM DATA COMPOSITION

```mermaid
pie title "Platform Storage Allocations"
    "Multi-Tenant Member Records" : 40
    "Subscription Billing Logs" : 30
    "Platform Audit Trails" : 20
    "System & Tenant Configs" : 10
```

---

<div align="center">
  <p><b>GOVERNANCE WITH INTEGRITY</b></p>
  <p>Authorized for Platform Administrators Only • GymFlow SaaS Core</p>
</div>
