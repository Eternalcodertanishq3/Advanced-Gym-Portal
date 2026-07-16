# Workspace Design and Architecture Rules

This file documents critical architectural constraints and design patterns learned during the development of **GymFlow SaaS**. All agents working on this codebase must follow these rules.

---

### 1. Next.js Middleware Edge Runtime Constraints
* **Problem**: Next.js Middleware runs inside Vercel's Edge Runtime, which does not support direct TCP database connections (e.g., Prisma Client) or standard Node.js APIs (e.g. sync_hooks used by Prisma).
* **Rule**: NEVER import the prisma client directly inside middleware.ts or any module it imports. Instead, implement a secure Node.js-based API route handler (e.g., in src/app/api/...) and perform database queries via HTTP etch requests inside the middleware.

---

### 2. Development HMR Cache Persistence
* **Problem**: Module-level caches (such as cache Maps declared in files) are wiped in development mode when Next.js Hot Module Replacement (HMR) re-compiles files.
* **Rule**: For development caching (like Middleware tenant caches), store the cache instance on globalThis (e.g., globalThis.tenantCache) rather than inside standard module scope. Always check and initialize it conditionally:
  `	ypescript
  const cache = (globalThis as any).tenantCache || new Map();
  if (process.env.NODE_ENV !== "production") {
    (globalThis as any).tenantCache = cache;
  }
  `

---

### 3. Preventing Radix UI Scrollbar Layout Shifts
* **Problem**: Opening select dropdowns, overlays, popovers, or modal dialogs built on Radix UI blocks body scroll, hiding the vertical scrollbar. This causes page widths to resize, triggering shifting/jumping of fixed headers and centered mx-auto page layouts.
* **Rule**: Prevent shifting globally by reserving scrollbar gutters on html and blocking inline margin/padding adjustments on ody in the global stylesheet:
  `css
  html {
    scrollbar-gutter: stable;
  }
  body {
    padding-right: 0px !important;
    margin-right: 0px !important;
  }
  `

---

### 4. Subscription Renewal Safeguards
* **Problem**: Allowing active, long-term memberships to renew months in advance creates pricing conflicts and operational overhead.
* **Rule**: Disable the "Renew Plan" button on member profile panels unless the subscription has expired or has 30 or fewer days remaining. Always display a helper caption below the disabled button clarifying when the renewal window opens.
