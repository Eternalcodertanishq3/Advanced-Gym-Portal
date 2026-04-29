// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Application Constants
// ═══════════════════════════════════════════════════════════════

export const APP = {
  NAME: "Eagle Gym",
  TAGLINE: "Rise Above. Transform Beyond.",
  FULL_NAME: "Eagle Gym — Sunrise Complex, Vrindavan Chowkdi, Vadodara",
  VERSION: "2.0.0",
  COPYRIGHT: `© ${new Date().getFullYear()} Eagle Gym. All rights reserved.`,
  CONTACT: {
    PHONE: "+91-XXXXXXXXXX",
    EMAIL: "info@eaglegym.in",
    ADDRESS: "Sunrise Complex, Vrindavan Chowkdi, Vadodara, Gujarat 390001",
  },
  SOCIAL: {
    INSTAGRAM: "https://instagram.com/eaglegym",
    FACEBOOK: "https://facebook.com/eaglegym",
    WHATSAPP: "https://wa.me/91XXXXXXXXXX",
  },
  LOGO: "/logo.png",
  LOGO_WHITE: "/logo-white.png",
  FAVICON: "/favicon.ico",
} as const;

// ═══════════════════════════════════════════════════════════════
// ROLES & HIERARCHY
// ═══════════════════════════════════════════════════════════════

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  RECEPTIONIST: "RECEPTIONIST",
  TRAINER: "TRAINER",
  MEMBER: "MEMBER",
  WORKER: "WORKER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_HIERARCHY: Record<Role, number> = {
  SUPER_ADMIN: 100,
  ADMIN: 80,
  RECEPTIONIST: 60,
  TRAINER: 60,
  MEMBER: 40,
  WORKER: 20,
};

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  RECEPTIONIST: "Receptionist",
  TRAINER: "Trainer",
  MEMBER: "Member",
  WORKER: "Staff",
};

export const ROLE_COLORS: Record<Role, string> = {
  SUPER_ADMIN: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  ADMIN: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  RECEPTIONIST: "bg-electric-cyan/20 text-electric-cyan border-electric-cyan/30",
  TRAINER: "bg-neon-green/20 text-neon-green border-neon-green/30",
  MEMBER: "bg-gold-500/20 text-gold-400 border-gold-500/30",
  WORKER: "bg-obsidian-400/20 text-obsidian-300 border-obsidian-400/30",
};

// ═══════════════════════════════════════════════════════════════
// PERMISSIONS
// ═══════════════════════════════════════════════════════════════

export const PERMISSIONS = {
  // Member Management
  MEMBER_CREATE: "member:create",
  MEMBER_READ: "member:read",
  MEMBER_UPDATE: "member:update",
  MEMBER_DELETE: "member:delete",
  MEMBER_IMPORT: "member:import",
  MEMBER_EXPORT: "member:export",
  MEMBER_BULK: "member:bulk",

  // Trainer Management
  TRAINER_CREATE: "trainer:create",
  TRAINER_READ: "trainer:read",
  TRAINER_UPDATE: "trainer:update",
  TRAINER_DELETE: "trainer:delete",
  TRAINER_ASSIGN: "trainer:assign",

  // Receptionist Management
  RECEPTIONIST_CREATE: "receptionist:create",
  RECEPTIONIST_READ: "receptionist:read",
  RECEPTIONIST_UPDATE: "receptionist:update",
  RECEPTIONIST_DELETE: "receptionist:delete",

  // Staff/Worker Management
  STAFF_CREATE: "staff:create",
  STAFF_READ: "staff:read",
  STAFF_UPDATE: "staff:update",
  STAFF_DELETE: "staff:delete",

  // Admin Management (Super Admin only)
  ADMIN_CREATE: "admin:create",
  ADMIN_READ: "admin:read",
  ADMIN_UPDATE: "admin:update",
  ADMIN_DELETE: "admin:delete",
  ADMIN_PERMISSIONS: "admin:permissions",

  // Subscription Plans
  PLAN_CREATE: "plan:create",
  PLAN_READ: "plan:read",
  PLAN_UPDATE: "plan:update",
  PLAN_DELETE: "plan:delete",

  // Subscriptions
  SUBSCRIPTION_CREATE: "subscription:create",
  SUBSCRIPTION_READ: "subscription:read",
  SUBSCRIPTION_UPDATE: "subscription:update",
  SUBSCRIPTION_DELETE: "subscription:delete",
  SUBSCRIPTION_FREEZE: "subscription:freeze",
  SUBSCRIPTION_UPGRADE: "subscription:upgrade",

  // Payments
  PAYMENT_CREATE: "payment:create",
  PAYMENT_READ: "payment:read",
  PAYMENT_UPDATE: "payment:update",
  PAYMENT_DELETE: "payment:delete",
  PAYMENT_REFUND: "payment:refund",

  // Attendance
  ATTENDANCE_CHECKIN: "attendance:checkin",
  ATTENDANCE_READ: "attendance:read",
  ATTENDANCE_UPDATE: "attendance:update",
  ATTENDANCE_DELETE: "attendance:delete",

  // Classes
  CLASS_CREATE: "class:create",
  CLASS_READ: "class:read",
  CLASS_UPDATE: "class:update",
  CLASS_DELETE: "class:delete",
  CLASS_BOOK: "class:book",
  CLASS_CANCEL: "class:cancel",

  // Workouts & Diet
  WORKOUT_CREATE: "workout:create",
  WORKOUT_READ: "workout:read",
  WORKOUT_UPDATE: "workout:update",
  WORKOUT_DELETE: "workout:delete",
  DIET_CREATE: "diet:create",
  DIET_READ: "diet:read",
  DIET_UPDATE: "diet:update",
  DIET_DELETE: "diet:delete",

  // Progress
  PROGRESS_CREATE: "progress:create",
  PROGRESS_READ: "progress:read",
  PROGRESS_UPDATE: "progress:update",
  PROGRESS_DELETE: "progress:delete",
  PROGRESS_PHOTO: "progress:photo",

  // Equipment
  EQUIPMENT_CREATE: "equipment:create",
  EQUIPMENT_READ: "equipment:read",
  EQUIPMENT_UPDATE: "equipment:update",
  EQUIPMENT_DELETE: "equipment:delete",
  EQUIPMENT_MAINTENANCE: "equipment:maintenance",

  // Inventory / POS
  INVENTORY_CREATE: "inventory:create",
  INVENTORY_READ: "inventory:read",
  INVENTORY_UPDATE: "inventory:update",
  INVENTORY_DELETE: "inventory:delete",
  POS_SALE: "pos:sale",

  // Analytics
  ANALYTICS_READ: "analytics:read",
  ANALYTICS_REVENUE: "analytics:revenue",
  ANALYTICS_CHURN: "analytics:churn",
  ANALYTICS_EXPORT: "analytics:export",

  // Notifications
  NOTIFICATION_CREATE: "notification:create",
  NOTIFICATION_READ: "notification:read",
  NOTIFICATION_SEND: "notification:send",

  // Documents
  DOCUMENT_CREATE: "document:create",
  DOCUMENT_READ: "document:read",
  DOCUMENT_DELETE: "document:delete",

  // Settings
  SETTINGS_READ: "settings:read",
  SETTINGS_UPDATE: "settings:update",
  SYSTEM_CONFIG: "settings:system",

  // Audit Logs
  AUDIT_READ: "audit:read",

  // Import / Export
  IMPORT_DATA: "import:data",
  EXPORT_DATA: "export:data",
  EXPORT_UNLIMITED: "export:unlimited",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// ═══════════════════════════════════════════════════════════════
// ROLE-BASED PERMISSION MAP
// ═══════════════════════════════════════════════════════════════

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: Object.values(PERMISSIONS),

  ADMIN: [
    PERMISSIONS.MEMBER_CREATE,
    PERMISSIONS.MEMBER_READ,
    PERMISSIONS.MEMBER_UPDATE,
    PERMISSIONS.MEMBER_IMPORT,
    PERMISSIONS.MEMBER_EXPORT,
    PERMISSIONS.TRAINER_CREATE,
    PERMISSIONS.TRAINER_READ,
    PERMISSIONS.TRAINER_UPDATE,
    PERMISSIONS.TRAINER_ASSIGN,
    PERMISSIONS.RECEPTIONIST_CREATE,
    PERMISSIONS.RECEPTIONIST_READ,
    PERMISSIONS.RECEPTIONIST_UPDATE,
    PERMISSIONS.STAFF_CREATE,
    PERMISSIONS.STAFF_READ,
    PERMISSIONS.STAFF_UPDATE,
    PERMISSIONS.PLAN_READ,
    PERMISSIONS.SUBSCRIPTION_CREATE,
    PERMISSIONS.SUBSCRIPTION_READ,
    PERMISSIONS.SUBSCRIPTION_UPDATE,
    PERMISSIONS.SUBSCRIPTION_FREEZE,
    PERMISSIONS.SUBSCRIPTION_UPGRADE,
    PERMISSIONS.PAYMENT_CREATE,
    PERMISSIONS.PAYMENT_READ,
    PERMISSIONS.PAYMENT_UPDATE,
    PERMISSIONS.ATTENDANCE_CHECKIN,
    PERMISSIONS.ATTENDANCE_READ,
    PERMISSIONS.ATTENDANCE_UPDATE,
    PERMISSIONS.CLASS_CREATE,
    PERMISSIONS.CLASS_READ,
    PERMISSIONS.CLASS_UPDATE,
    PERMISSIONS.CLASS_BOOK,
    PERMISSIONS.CLASS_CANCEL,
    PERMISSIONS.WORKOUT_CREATE,
    PERMISSIONS.WORKOUT_READ,
    PERMISSIONS.WORKOUT_UPDATE,
    PERMISSIONS.DIET_CREATE,
    PERMISSIONS.DIET_READ,
    PERMISSIONS.DIET_UPDATE,
    PERMISSIONS.PROGRESS_CREATE,
    PERMISSIONS.PROGRESS_READ,
    PERMISSIONS.PROGRESS_UPDATE,
    PERMISSIONS.PROGRESS_PHOTO,
    PERMISSIONS.EQUIPMENT_CREATE,
    PERMISSIONS.EQUIPMENT_READ,
    PERMISSIONS.EQUIPMENT_UPDATE,
    PERMISSIONS.EQUIPMENT_MAINTENANCE,
    PERMISSIONS.INVENTORY_CREATE,
    PERMISSIONS.INVENTORY_READ,
    PERMISSIONS.INVENTORY_UPDATE,
    PERMISSIONS.POS_SALE,
    PERMISSIONS.ANALYTICS_READ,
    PERMISSIONS.ANALYTICS_REVENUE,
    PERMISSIONS.NOTIFICATION_CREATE,
    PERMISSIONS.NOTIFICATION_READ,
    PERMISSIONS.NOTIFICATION_SEND,
    PERMISSIONS.DOCUMENT_CREATE,
    PERMISSIONS.DOCUMENT_READ,
    PERMISSIONS.SETTINGS_READ,
    PERMISSIONS.SETTINGS_UPDATE,
    PERMISSIONS.IMPORT_DATA,
    PERMISSIONS.EXPORT_DATA,
  ],

  RECEPTIONIST: [
    PERMISSIONS.MEMBER_CREATE,
    PERMISSIONS.MEMBER_READ,
    PERMISSIONS.PAYMENT_CREATE,
    PERMISSIONS.PAYMENT_READ,
    PERMISSIONS.ATTENDANCE_CHECKIN,
    PERMISSIONS.ATTENDANCE_READ,
    PERMISSIONS.CLASS_BOOK,
    PERMISSIONS.CLASS_READ,
    PERMISSIONS.NOTIFICATION_READ,
    PERMISSIONS.POS_SALE,
    PERMISSIONS.INVENTORY_READ,
  ],

  TRAINER: [
    PERMISSIONS.MEMBER_READ,
    PERMISSIONS.WORKOUT_CREATE,
    PERMISSIONS.WORKOUT_READ,
    PERMISSIONS.WORKOUT_UPDATE,
    PERMISSIONS.DIET_CREATE,
    PERMISSIONS.DIET_READ,
    PERMISSIONS.DIET_UPDATE,
    PERMISSIONS.PROGRESS_CREATE,
    PERMISSIONS.PROGRESS_READ,
    PERMISSIONS.PROGRESS_UPDATE,
    PERMISSIONS.CLASS_READ,
    PERMISSIONS.NOTIFICATION_READ,
  ],

  MEMBER: [
    PERMISSIONS.MEMBER_READ,
    PERMISSIONS.SUBSCRIPTION_READ,
    PERMISSIONS.PAYMENT_READ,
    PERMISSIONS.ATTENDANCE_READ,
    PERMISSIONS.CLASS_READ,
    PERMISSIONS.CLASS_BOOK,
    PERMISSIONS.CLASS_CANCEL,
    PERMISSIONS.WORKOUT_READ,
    PERMISSIONS.DIET_READ,
    PERMISSIONS.PROGRESS_CREATE,
    PERMISSIONS.PROGRESS_READ,
    PERMISSIONS.PROGRESS_PHOTO,
    PERMISSIONS.NOTIFICATION_READ,
  ],

  WORKER: [
    PERMISSIONS.EQUIPMENT_READ,
    PERMISSIONS.EQUIPMENT_MAINTENANCE,
    PERMISSIONS.NOTIFICATION_READ,
  ],
};

// ═══════════════════════════════════════════════════════════════
// STATUS ENUMS
// ═══════════════════════════════════════════════════════════════

export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
  PENDING: "PENDING",
} as const;

export const MEMBER_STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  EXPIRED: "EXPIRED",
  FROZEN: "FROZEN",
  PENDING: "PENDING",
} as const;

export const SUBSCRIPTION_STATUS = {
  ACTIVE: "ACTIVE",
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
  FROZEN: "FROZEN",
  PENDING: "PENDING",
  GRACE: "GRACE",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
  PARTIAL: "PARTIAL",
} as const;

export const PAYMENT_METHOD = {
  CASH: "CASH",
  CARD: "CARD",
  UPI: "UPI",
  ONLINE: "ONLINE",
  CHEQUE: "CHEQUE",
  BANK_TRANSFER: "BANK_TRANSFER",
  EMI: "EMI",
} as const;

export const ATTENDANCE_STATUS = {
  PRESENT: "PRESENT",
  ABSENT: "ABSENT",
  LATE: "LATE",
  EARLY_LEAVE: "EARLY_LEAVE",
} as const;

export const EQUIPMENT_STATUS = {
  WORKING: "WORKING",
  UNDER_MAINTENANCE: "UNDER_MAINTENANCE",
  OUT_OF_ORDER: "OUT_OF_ORDER",
  RETIRED: "RETIRED",
} as const;

export const GENDER = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
  PREFER_NOT_TO_SAY: "PREFER_NOT_TO_SAY",
} as const;

export const BLOOD_GROUP = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export const CLASS_STATUS = {
  SCHEDULED: "SCHEDULED",
  ONGOING: "ONGOING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export const BOOKING_STATUS = {
  CONFIRMED: "CONFIRMED",
  WAITLIST: "WAITLIST",
  CANCELLED: "CANCELLED",
  NO_SHOW: "NO_SHOW",
} as const;

export const NOTIFICATION_TYPE = {
  PAYMENT_DUE: "PAYMENT_DUE",
  PAYMENT_RECEIVED: "PAYMENT_RECEIVED",
  SUBSCRIPTION_EXPIRING: "SUBSCRIPTION_EXPIRING",
  SUBSCRIPTION_EXPIRED: "SUBSCRIPTION_EXPIRED",
  CLASS_REMINDER: "CLASS_REMINDER",
  CLASS_CANCELLED: "CLASS_CANCELLED",
  WORKOUT_ASSIGNED: "WORKOUT_ASSIGNED",
  DIET_ASSIGNED: "DIET_ASSIGNED",
  ACHIEVEMENT_UNLOCKED: "ACHIEVEMENT_UNLOCKED",
  ANNOUNCEMENT: "ANNOUNCEMENT",
  MESSAGE: "MESSAGE",
  SYSTEM: "SYSTEM",
  BIRTHDAY: "BIRTHDAY",
  MAINTENANCE_ALERT: "MAINTENANCE_ALERT",
} as const;

export const DOCUMENT_TYPE = {
  ID_PROOF: "ID_PROOF",
  MEDICAL_CERTIFICATE: "MEDICAL_CERTIFICATE",
  JOINING_FORM: "JOINING_FORM",
  CONTRACT: "CONTRACT",
  RECEIPT: "RECEIPT",
  INVOICE: "INVOICE",
  PROGRESS_PHOTO: "PROGRESS_PHOTO",
  OTHER: "OTHER",
} as const;

// ═══════════════════════════════════════════════════════════════
// SUBSCRIPTION PLANS
// ═══════════════════════════════════════════════════════════════

export const MEMBERSHIP_TIERS = {
  BRONZE: "BRONZE",
  SILVER: "SILVER",
  GOLD: "GOLD",
  PLATINUM: "PLATINUM",
  DIAMOND: "DIAMOND",
} as const;

export const TIER_COLORS: Record<string, string> = {
  BRONZE: "from-amber-700 to-amber-600",
  SILVER: "from-slate-400 to-slate-300",
  GOLD: "from-gold-400 to-gold-300",
  PLATINUM: "from-cyan-400 to-cyan-300",
  DIAMOND: "from-purple-400 to-pink-400",
};

export const TIER_BADGE_COLORS: Record<string, string> = {
  BRONZE: "bg-amber-700/20 text-amber-500 border-amber-700/30",
  SILVER: "bg-slate-400/20 text-slate-300 border-slate-400/30",
  GOLD: "bg-gold-500/20 text-gold-400 border-gold-500/30",
  PLATINUM: "bg-cyan-400/20 text-cyan-300 border-cyan-400/30",
  DIAMOND: "bg-purple-400/20 text-purple-300 border-purple-400/30",
};

export const DEFAULT_PLANS = [
  {
    name: "Bronze",
    duration: 30,
    price: 999,
    features: ["Cardio Zone", "Weight Training", "Locker Access", "Basic App Access"],
    color: "bronze",
  },
  {
    name: "Silver",
    duration: 30,
    price: 1499,
    features: [
      "All Bronze Features",
      "Steam Room",
      "Group Classes",
      "Diet Consultation",
    ],
    color: "silver",
  },
  {
    name: "Gold",
    duration: 30,
    price: 2499,
    features: [
      "All Silver Features",
      "Personal Training (4 sessions)",
      "Nutrition Plan",
      "Progress Tracking",
      "Priority Booking",
    ],
    color: "gold",
  },
  {
    name: "Platinum",
    duration: 90,
    price: 6999,
    features: [
      "All Gold Features",
      "Unlimited PT Sessions",
      "SPA Access",
      "Guest Passes (2/month)",
      "Premium Locker",
    ],
    color: "platinum",
  },
  {
    name: "Diamond",
    duration: 365,
    price: 24999,
    features: [
      "All Platinum Features",
      "Dedicated Trainer",
      "Monthly Body Assessment",
      "Supplement Kit",
      "Eagle Elite Badge",
      "VIP Events Access",
    ],
    color: "diamond",
  },
];

// ═══════════════════════════════════════════════════════════════
// EQUIPMENT CATEGORIES
// ═══════════════════════════════════════════════════════════════

export const EQUIPMENT_CATEGORIES = [
  "CARDIO",
  "STRENGTH",
  "FREE_WEIGHTS",
  "FUNCTIONAL",
  "RECOVERY",
  "ACCESSORIES",
] as const;

// ═══════════════════════════════════════════════════════════════
// CLASS CATEGORIES
// ═══════════════════════════════════════════════════════════════

export const CLASS_CATEGORIES = [
  "YOGA",
  "ZUMBA",
  "CROSSFIT",
  "PILATES",
  "SPINNING",
  "HIIT",
  "BOXING",
  "DANCE",
  "MEDITATION",
  "AEROBICS",
] as const;

// ═══════════════════════════════════════════════════════════════
// GAMIFICATION
// ═══════════════════════════════════════════════════════════════

export const ACHIEVEMENTS = [
  {
    id: "first_checkin",
    name: "First Flight",
    description: "Complete your first check-in",
    icon: "Footprints",
    xp: 50,
    condition: { type: "CHECKIN_COUNT", count: 1 },
  },
  {
    id: "week_warrior",
    name: "Week Warrior",
    description: "7-day check-in streak",
    icon: "Flame",
    xp: 100,
    condition: { type: "CHECKIN_STREAK", count: 7 },
  },
  {
    id: "month_master",
    name: "Month Master",
    description: "30-day check-in streak",
    icon: "Crown",
    xp: 500,
    condition: { type: "CHECKIN_STREAK", count: 30 },
  },
  {
    id: "early_bird",
    name: "Early Bird",
    description: "Check in before 6 AM",
    icon: "Sunrise",
    xp: 75,
    condition: { type: "EARLY_CHECKIN", hour: 6 },
  },
  {
    id: "night_owl",
    name: "Night Owl",
    description: "Check in after 9 PM",
    icon: "Moon",
    xp: 75,
    condition: { type: "LATE_CHECKIN", hour: 21 },
  },
  {
    id: "heavy_lifter",
    name: "Heavy Lifter",
    description: "Log a personal record",
    icon: "Dumbbell",
    xp: 150,
    condition: { type: "PERSONAL_RECORD", count: 1 },
  },
  {
    id: "social_butterfly",
    name: "Social Butterfly",
    description: "Refer 5 friends who join",
    icon: "Users",
    xp: 1000,
    condition: { type: "REFERRAL_COUNT", count: 5 },
  },
  {
    id: "goal_crusher",
    name: "Goal Crusher",
    description: "Achieve your fitness goal",
    icon: "Target",
    xp: 1000,
    condition: { type: "GOAL_ACHIEVED", count: 1 },
  },
  {
    id: "transformation",
    name: "Transformation King",
    description: "Complete 90-day progress photos",
    icon: "Camera",
    xp: 2000,
    condition: { type: "PROGRESS_PHOTO_STREAK", count: 90 },
  },
  {
    id: "eagle_elite",
    name: "Eagle Elite",
    description: "Reach Diamond tier",
    icon: "Eagle",
    xp: 5000,
    condition: { type: "TIER_REACHED", tier: "DIAMOND" },
  },
] as const;

export const XP_LEVELS = [
  { level: 1, title: "Bronze", minXP: 0, maxXP: 499 },
  { level: 2, title: "Silver", minXP: 500, maxXP: 1499 },
  { level: 3, title: "Gold", minXP: 1500, maxXP: 3999 },
  { level: 4, title: "Platinum", minXP: 4000, maxXP: 7999 },
  { level: 5, title: "Diamond", minXP: 8000, maxXP: 14999 },
  { level: 6, title: "Eagle Elite", minXP: 15000, maxXP: Infinity },
] as const;

// ═══════════════════════════════════════════════════════════════
// PAGINATION & LIMITS
// ═══════════════════════════════════════════════════════════════

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  OPTIONS: [10, 25, 50, 100],
} as const;

export const FILE_LIMITS = {
  MAX_SIZE_MB: 5,
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp", "image/jpg"],
  ALLOWED_DOCUMENT_TYPES: [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  ALLOWED_IMPORT_TYPES: [
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ],
} as const;

export const EXPORT_LIMITS = {
  ADMIN_MAX_ROWS: 5000,
  SUPER_ADMIN_MAX_ROWS: 100000,
  CHUNK_SIZE: 100,
} as const;

// ═══════════════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════════════

export const ROUTES = {
  // Auth
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_OTP: "/verify-otp",

  // Dashboard Home (role-based redirect)
  DASHBOARD: "/",

  // Super Admin
  SUPER_ADMIN: "/super-admin",
  SUPER_ADMIN_ADMINS: "/super-admin/admins",
  SUPER_ADMIN_AUDIT: "/super-admin/audit-logs",
  SUPER_ADMIN_CONFIG: "/super-admin/system-config",
  SUPER_ADMIN_PLANS: "/super-admin/subscription-plans",
  SUPER_ADMIN_REVENUE: "/super-admin/revenue",
  SUPER_ADMIN_BRANCHES: "/super-admin/branches",
  SUPER_ADMIN_BACKUPS: "/super-admin/backups",

  // Admin
  ADMIN: "/admin",
  ADMIN_MEMBERS: "/admin/members",
  ADMIN_TRAINERS: "/admin/trainers",
  ADMIN_RECEPTIONISTS: "/admin/receptionists",
  ADMIN_STAFF: "/admin/staff",
  ADMIN_PAYMENTS: "/admin/payments",
  ADMIN_ATTENDANCE: "/admin/attendance",
  ADMIN_ANALYTICS: "/admin/analytics",
  ADMIN_CLASSES: "/admin/classes",
  ADMIN_INVENTORY: "/admin/inventory",
  ADMIN_EQUIPMENT: "/admin/equipment",
  ADMIN_NOTIFICATIONS: "/admin/notifications",
  ADMIN_DOCUMENTS: "/admin/documents",

  // Receptionist
  RECEPTIONIST: "/receptionist",
  RECEPTIONIST_CHECKIN: "/receptionist/check-in",
  RECEPTIONIST_WALKIN: "/receptionist/walk-in",
  RECEPTIONIST_MEMBERS: "/receptionist/members",
  RECEPTIONIST_PAYMENTS: "/receptionist/payments",
  RECEPTIONIST_SCHEDULE: "/receptionist/schedule",
  RECEPTIONIST_VISITOR: "/receptionist/visitor-pass",

  // Trainer
  TRAINER: "/trainer",
  TRAINER_MEMBERS: "/trainer/my-members",
  TRAINER_WORKOUTS: "/trainer/workouts",
  TRAINER_DIET: "/trainer/diet",
  TRAINER_SESSIONS: "/trainer/sessions",
  TRAINER_PROGRESS: "/trainer/progress",
  TRAINER_SCHEDULE: "/trainer/schedule",

  // Member
  MEMBER: "/member",
  MEMBER_PROFILE: "/member/profile",
  MEMBER_CARD: "/member/digital-card",
  MEMBER_SUBSCRIPTION: "/member/subscription",
  MEMBER_WORKOUT: "/member/workout",
  MEMBER_DIET: "/member/diet",
  MEMBER_PROGRESS: "/member/progress",
  MEMBER_PAYMENTS: "/member/payments",
  MEMBER_CLASSES: "/member/classes",
  MEMBER_TRAINER: "/member/trainer",
  MEMBER_ACHIEVEMENTS: "/member/achievements",
  MEMBER_LEADERBOARD: "/member/leaderboard",
  MEMBER_CHALLENGES: "/member/challenges",
  MEMBER_NUTRITION: "/member/nutrition",
  MEMBER_MESSAGES: "/member/messages",
  MEMBER_REFER: "/member/refer",

  // Worker
  WORKER: "/worker",
  WORKER_TASKS: "/worker/tasks",
  WORKER_EQUIPMENT: "/worker/equipment",
  WORKER_CLEANING: "/worker/cleaning",
} as const;

// ═══════════════════════════════════════════════════════════════
// LOCAL STORAGE KEYS
// ═══════════════════════════════════════════════════════════════

export const STORAGE_KEYS = {
  THEME: "eagle-gym-theme",
  SIDEBAR_COLLAPSED: "eagle-gym-sidebar",
  LANGUAGE: "eagle-gym-lang",
  LAST_ROUTE: "eagle-gym-last-route",
  NOTIFICATIONS: "eagle-gym-notifications",
  CART: "eagle-gym-cart",
  FILTERS: "eagle-gym-filters",
} as const;

// ═══════════════════════════════════════════════════════════════
// DATE/TIME FORMATS
// ═══════════════════════════════════════════════════════════════

export const DATE_FORMATS = {
  DISPLAY: "dd MMM yyyy",
  DISPLAY_WITH_TIME: "dd MMM yyyy, hh:mm a",
  INPUT: "yyyy-MM-dd",
  TIME: "hh:mm a",
  FULL: "EEEE, dd MMMM yyyy",
  MONTH_YEAR: "MMM yyyy",
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
} as const;

export const GYM_HOURS = {
  OPEN: "05:00",
  CLOSE: "22:00",
  PEAK_START: "17:00",
  PEAK_END: "21:00",
} as const;

// ═══════════════════════════════════════════════════════════════
// API & NETWORK
// ═══════════════════════════════════════════════════════════════

export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "/api",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// ═══════════════════════════════════════════════════════════════
// UI CONSTANTS
// ═══════════════════════════════════════════════════════════════

export const TOAST_DURATION = {
  SHORT: 2000,
  DEFAULT: 4000,
  LONG: 6000,
} as const;

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  PAGE_TRANSITION: 400,
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

// ═══════════════════════════════════════════════════════════════
// MISC
// ═══════════════════════════════════════════════════════════════

export const INDIAN_STATES = [
  "Gujarat",
  "Maharashtra",
  "Rajasthan",
  "Madhya Pradesh",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Telangana",
  "Kerala",
  "Punjab",
  "Haryana",
  "Uttar Pradesh",
  "West Bengal",
  "Bihar",
  "Odisha",
  "Assam",
  "Chhattisgarh",
  "Jharkhand",
  "Uttarakhand",
  "Himachal Pradesh",
  "Goa",
  "Andhra Pradesh",
] as const;

export const GST_RATE = 18; // 18% GST on gym services

export const SESSION_DURATION_MINUTES = 60;