<div align="center">

# 🦅 EAGLE GYM PORTAL
### *Athletic Clarity • Strategic Control • Performance Integrity*

---

<p align="center">
  <img src="./public/animations/eagle-pulse.svg" width="120" height="120" alt="Eagle Pulse" />
</p>

[![Status](https://img.shields.io/badge/System-ONLINE-00C786?style=for-the-badge&logo=statuspage&logoColor=white)]()
[![Version](https://img.shields.io/badge/Version-1.0.0_STABLE-F26522?style=for-the-badge&logo=expert-voice&logoColor=white)]()
[![Engine](https://img.shields.io/badge/Engine-NEXT.JS_14-black?style=for-the-badge&logo=next.js&logoColor=white)]()

---

</div>

## 🌀 SYSTEM PULSE (REAL-TIME ARCHITECTURE)

<p align="center">
  <img src="./public/animations/data-flow.svg" width="100%" alt="Data Flow" />
</p>

```mermaid
graph TD
    subgraph "External Access"
    U((Athletes & Staff))
    end
    
    subgraph "Security Layer"
    AG[Auth Gateway]
    end
    
    subgraph "Orchestration Layer"
    RM{Role Manager}
    end
    
    subgraph "Dashboards"
    direction LR
    MC[Member]
    TC[Trainer]
    AO[Admin]
    SC[Super Admin]
    end
    
    U --> AG
    AG --> RM
    RM --> MC
    RM --> TC
    RM --> AO
    RM --> SC
    
    style U fill:#F26522,stroke:#fff,stroke-width:2px,color:#fff
    style AG fill:#1A1A1A,stroke:#F26522,stroke-width:2px,color:#F26522
    style RM fill:#1A1A1A,stroke:#F26522,stroke-width:2px,color:#F26522
    style MC fill:#1A1A1A,stroke:#00BAFF,stroke-width:2px,color:#00BAFF
    style TC fill:#1A1A1A,stroke:#00BAFF,stroke-width:2px,color:#00BAFF
    style AO fill:#1A1A1A,stroke:#00C786,stroke-width:2px,color:#00C786
    style SC fill:#EA4335,stroke:#fff,stroke-width:2px,color:#fff
```

---

## 🚀 COMMAND MODULES

<div align="center">

| Module | Access Level | Primary Objective | Intel |
| :--- | :---: | :--- | :---: |
| **Member** | `LEVEL 1` | Athletic Journey & Performance | [Explore](./docs/member.md) |
| **Trainer** | `LEVEL 2` | Squad Blueprint & Surveillance | [Explore](./docs/trainer.md) |
| **Admin** | `LEVEL 3` | Facility Ops & Revenue Intelligence | [Explore](./docs/admin.md) |
| **Super Admin** | `MASTER` | Ecosystem Governance & Global Logic | [Explore](./docs/super-admin.md) |

</div>

---

## 🛠️ TECH STACK COMMAND

<p align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHR4M3R4M3R4M3R4M3R4M3R4M3R4M3R4M3R4M3R4M3R4M3R4JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1z/3o7TKQHqM16S0pM3yU/giphy.gif" width="150" alt="Tech Pulse" />
</p>

```mermaid
pie title "Infrastructure Composition"
    "Next.js 14" : 40
    "Prisma & Postgres" : 25
    "Tailwind CSS" : 20
    "NextAuth" : 15
```

---

## 📋 CORE FEATURES

- 🦾 **Member Command**: Advanced session tracking with real-time rest orchestration.
- 🥗 **Nutrition Engine**: Precision macro-tracking and nutritionist-approved blueprints.
- 📈 **Admin Analytics**: Live revenue charts and attendance heatmaps.
- 🏢 **Multi-Branch Control**: Isolated data environments for global gym networks.
- 🔐 **RBAC Security**: Military-grade role-based access control.

---

## ⚡ RAPID DEPLOYMENT

```bash
# 1. Clone Intelligence
git clone https://github.com/Eternalcodertanishq3/Advanced-Gym-Portal.git

# 2. Synchronize Dependencies
npm install

# 3. Initialize Core
npx prisma generate && npx prisma db push

# 4. Launch Terminal
npm run dev
```

---

<div align="center">
  <p><b>AUTHORIZED PERSONNEL ONLY</b></p>
  <p>© 2024 EAGLE GYM PORTAL • ATHLETIC CLARITY</p>
</div>
