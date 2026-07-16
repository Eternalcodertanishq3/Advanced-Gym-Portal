<div align="center">

# 🦅 GymFlow SaaS (Advanced Multi-Tenant Gym Ecosystem)
### *Athletic Clarity • Strategic Control • Performance Integrity*

---

<p align="center">
  <img src="./public/animations/eagle-pulse.svg" width="120" height="120" alt="GymFlow Pulse" />
</p>

[![Status](https://img.shields.io/badge/System-ONLINE-00C786?style=for-the-badge&logo=statuspage&logoColor=white)]()
[![Version](https://img.shields.io/badge/Version-2.1.0_PRODUCTION-F26522?style=for-the-badge&logo=expert-voice&logoColor=white)]()
[![Engine](https://img.shields.io/badge/Engine-NEXT.JS_15-black?style=for-the-badge&logo=next.js&logoColor=white)]()

---

</div>

## 🌀 SYSTEM ARCHITECTURE (MULTI-TENANT REAL-TIME DATA FLOW)

GymFlow is a modern B2B SaaS gym portal supporting dynamic subdomains, strict database data isolation, global timezone resolution, and dynamic local multi-currency configuration.

```mermaid
graph TD
    subgraph "External Access"
    U((Athletes, Gym Owners & Staff))
    end
    
    subgraph "Security Layer"
    RL["Rate Limiter (Upstash Redis)"]
    AG[Auth Gateway & Session Check]
    end
    
    subgraph "Orchestration Layer"
    TenantRes{Tenant Resolver Middleware}
    RM{Role-Based Access Control}
    end
    
    subgraph "Dashboards"
    direction LR
    MC[Member Dashboard]
    TC[Trainer Dashboard]
    AO[Admin Dashboard]
    SC[Super Admin Console]
    end
    
    U --> RL
    RL --> AG
    AG --> TenantRes
    TenantRes --> RM
    RM --> MC
    RM --> TC
    RM --> AO
    RM --> SC
    
    style U fill:#F26522,stroke:#fff,stroke-width:2px,color:#fff
    style RL fill:#1A1A1A,stroke:#EA4335,stroke-width:2px,color:#EA4335
    style AG fill:#1A1A1A,stroke:#F26522,stroke-width:2px,color:#F26522
    style TenantRes fill:#1A1A1A,stroke:#00C786,stroke-width:2px,color:#00C786
    style RM fill:#1A1A1A,stroke:#F26522,stroke-width:2px,color:#F26522
```

---

## 🔒 SECURITY GATEWAYS & ARCHITECTURE

1. **Strict Server Actions Protection**: All server actions check the NextAuth session identity and verify role claims (e.g. `SUPER_ADMIN`, `ADMIN`, `RECEPTIONIST`, `TRAINER`, `MEMBER`) at the entry block.
2. **Dynamic Rate Limiting**: REST and server endpoints (/api/upload, /api/export, /api/import) are limited per minute based on IP using a sliding-window algorithm backed by Upstash Redis.
3. **Webhook Verification**: Razorpay and WhatsApp webhook routes perform timing-safe HMAC signature verification (`crypto.timingSafeEqual`) to prevent replay or spoofing attacks.
4. **Secure Dynamic Passwords**: Automatic member import/creation generates dynamic, cryptographically secure temporary passwords using alphanumeric sets.
5. **Path Traversal Protection**: File uploads restrict file directories to a whitelisted array of folders (`avatar`, `document`, `progress`, `general`) and sanitize filenames.

---

## 🏢 MULTI-TENANCY & GLOBAL LOCALIZATION

- **Dynamic Tenant Isolation**: Implemented using Prisma `$extends` query filters. All queries auto-inject `tenantId` parameters, enforcing logical data separation in shared-database environments.
- **Gym Configuration & Settings**: Gym owners can dynamically set the default timezone, date format, and currency (`INR`, `USD`, `EUR`, `GBP`) via the System Configuration Console.
- **Dynamic Formatting**: Prices, sales, and analytics automatically display using the corresponding locales (`en-IN`, `en-US`, `de-DE`) and currency symbols (`₹`, `$`, `€`, `£`) across both member and admin screens.

---

## ⚡ RAPID DEPLOYMENT

```bash
# 1. Clone the Ecosystem
git clone https://github.com/Eternalcodertanishq3/Advanced-Gym-Portal.git

# 2. Synchronize Dependencies
npm install

# 3. Environment Setup
# Copy .env.example to .env and configure DATABASE_URL, NEXTAUTH_SECRET, UPSTASH_REDIS_REST_URL, RESEND_API_KEY.

# 4. Synchronize Database & Seed Core
npx prisma db push
npx prisma db seed

# 5. Launch Local Dev Server
npm run dev
```

---

## 📋 COMMAND MODULES

<div align="center">

| Module | Access Level | Primary Objective | Docs |
| :--- | :---: | :--- | :---: |
| **Member** | `LEVEL 1` | Athlete Workout Logging, Macro Tracking & Gamification | [Explore](./docs/member.md) |
| **Trainer** | `LEVEL 2` | Workout/Diet Assignation & Progress Tracking | [Explore](./docs/trainer.md) |
| **Admin** | `LEVEL 3` | POS Sales, Inventory & Staff Management | [Explore](./docs/admin.md) |
| **Super Admin** | `MASTER` | Tenant Onboarding, Subscription Expiry & Platform Control | [Explore](./docs/super-admin.md) |

</div>

---

<div align="center">
  <p><b>AUTHORIZED PERSONNEL ONLY • SAAS PRODUCTION ENVIRONMENT</b></p>
  <p>© 2026 GYMFLOW SAAS • ECOSYSTEM SECURITY STABLE</p>
</div>
