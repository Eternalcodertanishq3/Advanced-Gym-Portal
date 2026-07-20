# 📋 TRAINER WORKFLOWS & CLIENT MANAGEMENT GUIDE
### *Workout Assignment • Diet Customization • Progress Monitoring*

---

```
   GYMFLOW SaaS SYSTEM MODULE: TRAINER PORTAL
   ===========================================
   [AUTHORIZATION] : TRAINER (LEVEL 2) / ADMIN (LEVEL 3)
   [CLIENT SYSTEM] : WEB / MOBILE RESPONSIVE DASHBOARD
   ===========================================
```

---

## 📖 TABLE OF CONTENTS
1. [Trainer Interface Overview](#1-trainer-interface-overview)
2. [Workout Program Builder](#2-workout-program-builder)
3. [Nutrition & Calorie Allocation Panel](#3-nutrition--calorie-allocation-panel)
4. [Client Progress Monitoring](#4-client-progress-monitoring)
5. [Direct Client Communications](#5-direct-client-communications)
6. [Operational Activity Workflows](#6-operational-activity-workflows)
7. [Database Schema ER Diagram](#7-database-schema-er-diagram)
8. [Troubleshooting & Program Customization](#8-troubleshooting--program-customization)

---

## 1. TRAINER INTERFACE OVERVIEW

The Trainer Module provides fitness trainers with tools to manage assigned client rosters, build workout routines, track caloric targets, and monitor client progress.

```mermaid
graph TD
    A[Trainer User] --> B( Roster Management)
    A --> C(Workout Customization)
    A --> D(Nutrition Planner)
    A --> E(Progress Monitoring)
    
    B --> B1[Active Clients]
    B --> B2[New Assignations]
    
    C --> C1[Routine Library]
    C --> C2[Calisthenics Log]
    
    D --> D1[Macro Allocations]
    D --> D2[Meal Schedules]
    
    E --> E1[Measurement Charts]
    E --> E2[Assessment Sheets]
    
    style A fill:#1A1A1A,stroke:#F26522,stroke-width:4px,color:#F26522
```

Trainers design personalized programs for their assigned members.

---

## 2. WORKOUT PROGRAM BUILDER

Trainers can build custom exercise routines using the built-in program template editor.

### 2.1 Routine Logs & Exercise Definitions
Trainers customize exercises, sets, reps, and target loads:

```
+-----------------------------------------------------------------+
|                       Deadlift Program                          |
+--------+------------------+------------------+------------------+
| Set 1  | 8 reps @ 100kg   | Intensity: Low   | Rest: 120s       |
| Set 2  | 6 reps @ 120kg   | Intensity: Medium| Rest: 120s       |
| Set 3  | 4 reps @ 140kg   | Intensity: High  | Rest: 180s       |
+--------+------------------+------------------+------------------+
```

These programs are delivered to the member's portal automatically upon assignment.

---

## 3. NUTRITION & CALORIE ALLOCATION PANEL

Trainers set daily calorie and macronutrient targets for members based on their goals.

### 3.1 Diet Logs & Macro Configs
Calculates macro targets using the built-in calculator:

```mermaid
stateDiagram-v2
    [*] --> TargetConfigured : Targets Assigned
    TargetConfigured --> MealPlanSaved : Diet Sheet Created
    MealPlanSaved --> CalorieCheck : Member logs daily intake
    CalorieCheck --> TargetConfigured : Targets updated on check-in
```

These allocations update the member's portal dashboard.

---

## 4. CLIENT PROGRESS MONITORING

Trainers track member progress, including body weight, body fat percentage, and training history.
* **Progress Graphs**: Displays change charts mapping metrics over time to help trainers adjust programs.

---

## 5. DIRECT CLIENT COMMUNICATIONS

The Messaging interface allows trainers to communicate with their clients.
* **Message Logs**: Tracks messages between trainers and clients to maintain communication.

---

## 6. OPERATIONAL ACTIVITY WORKFLOWS

### 6.1 Program Creation Sequence
This sequence diagram shows the step-by-step process of creating a training program:

```mermaid
sequenceDiagram
    actor Trainer as Trainer User
    participant Server as Server Action
    participant DB as Prisma Database
    participant Email as Notification System

    Trainer->{Server}: Save Workout Program (memberId, exercises)
    Server->>DB: Check member profile ID
    alt Profile Valid
        DB-->>Server: Profile ID Confirmed
        Server->>DB: Create Program Record
        Server->>DB: Log "CREATE" event in AuditLog
        Server->>Email: Send workout update notification
        Email-->>Trainer: Delivery successful
    else Profile Invalid
        DB-->>Server: Invalid Profile ID
        Server-->>Trainer: Return error and abort creation
    end
```

---

## 7. DATABASE SCHEMA ER DIAGRAM

The following entity-relationship diagram shows how trainer activities map to database tables:

```mermaid
erDiagram
    TrainerProfile ||--o{ ClientAssignation : manages
    ClientAssignation }|--|| Member : references
    TrainerProfile ||--o{ WorkoutTemplate : creates
    TrainerProfile ||--o{ DietPlan : designs

    TrainerProfile {
        string id PK
        string userId FK
        string branchId
    }
    ClientAssignation {
        string id PK
        string trainerId FK
        string memberId FK
        datetime assignedAt
    }
    WorkoutTemplate {
        string id PK
        string name
        json routine
        string trainerId FK
    }
    DietPlan {
        string id PK
        int caloriesTarget
        int proteinTarget
        string trainerId FK
    }
```

---

## 8. TROUBLESHOOTING & PROGRAM CUSTOMIZATION

### 8.1 Resolution Procedures for Trainer Issues

#### Issue: Workout Template Fails to Load
* **Possible Cause**: Invalid characters in the exercise JSON data.
* **Resolution**: Re-save the template using standard characters.

#### Issue: Macro Targets Out of Bounds
* **Possible Cause**: Calorie inputs exceed maximum allowed limits.
* **Resolution**: Verify targets and ensure inputs match the member's calorie profile.

#### Issue: Client Not Showing in Roster
* **Possible Cause**: Client is assigned to a different branch or trainer.
* **Resolution**: Check assignments in the Admin panel.

---

<div align="center">
  <p><b>GymFlow SaaS Portal • Trainer Operations Guide</b></p>
  <p>© 2026 GYMFLOW SAAS. ALL RIGHTS RESERVED.</p>
</div>
