import { z } from "zod";
import { GENDER, BLOOD_GROUP, PAYMENT_METHOD, CLASS_CATEGORIES, EQUIPMENT_CATEGORIES } from "./constants";

// ═══════════════════════════════════════════════════════════════
// COMMON / SHARED SCHEMAS
// ═══════════════════════════════════════════════════════════════

export const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

export const DateRangeSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});

export const IdSchema = z.object({
  id: z.string().cuid({ message: "Invalid ID format" }),
});

export const EmailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

export const PhoneSchema = z
  .string()
  .min(1, "Phone number is required")
  .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number");

export const PasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password is too long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const NameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")
  .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces");

export const AddressSchema = z.object({
  street: z.string().min(1, "Street is required").max(200),
  city: z.string().min(1, "City is required").max(50),
  state: z.string().min(1, "State is required").max(50),
  pincode: z
    .string()
    .regex(/^\d{6}$/, "Please enter a valid 6-digit PIN code"),
  country: z.string().default("India"),
});

export const FileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "File size must be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type),
      "Only JPG, PNG, and WebP images are allowed"
    ),
});

// ═══════════════════════════════════════════════════════════════
// AUTH SCHEMAS
// ═══════════════════════════════════════════════════════════════

export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false),
});

export const RegisterSchema = z
  .object({
    firstName: NameSchema,
    lastName: NameSchema,
    email: EmailSchema,
    phone: PhoneSchema,
    password: PasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).optional(),
    dateOfBirth: z
      .string()
      .optional()
      .refine((val) => {
        if (!val) return true;
        const date = new Date(val);
        const now = new Date();
        const age = now.getFullYear() - date.getFullYear();
        return age >= 12 && age <= 100;
      }, "Age must be between 12 and 100 years"),
    termsAccepted: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ForgotPasswordSchema = z.object({
  email: EmailSchema,
});

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, "Invalid reset token"),
    password: PasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const OTPSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

// ═══════════════════════════════════════════════════════════════
// USER SCHEMAS
// ═══════════════════════════════════════════════════════════════

export const CreateUserSchema = z.object({
  firstName: NameSchema,
  lastName: NameSchema,
  email: EmailSchema,
  phone: PhoneSchema,
  password: PasswordSchema.optional(),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "RECEPTIONIST", "TRAINER", "MEMBER", "WORKER"]),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING"]).default("ACTIVE"),
  avatar: z.string().url().optional().or(z.literal("")),
});

export const UpdateUserSchema = z.object({
  firstName: NameSchema.optional(),
  lastName: NameSchema.optional(),
  email: EmailSchema.optional(),
  phone: PhoneSchema.optional(),
  avatar: z.string().url().optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "PENDING"]).optional(),
});

export const UpdateProfileSchema = z.object({
  firstName: NameSchema,
  lastName: NameSchema,
  phone: PhoneSchema,
  avatar: z.string().optional(),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: PasswordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ═══════════════════════════════════════════════════════════════
// MEMBER SCHEMAS
// ═══════════════════════════════════════════════════════════════

export const CreateMemberSchema = z.object({
  firstName: NameSchema,
  lastName: NameSchema,
  email: EmailSchema,
  phone: PhoneSchema,
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).optional(),
  dateOfBirth: z.string().optional(),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
  emergencyContact: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit number")
    .optional()
    .or(z.literal("")),
  address: z.string().max(500).optional(),
  city: z.string().max(50).optional(),
  state: z.string().max(50).optional(),
  pincode: z.string().regex(/^\d{6}$/).optional().or(z.literal("")),
  planId: z.string().cuid({ message: "Please select a subscription plan" }),
  startDate: z.string().min(1, "Start date is required"),
  amount: z.coerce.number().min(0, "Amount must be positive"),
  paymentMethod: z.enum(["CASH", "CARD", "UPI", "ONLINE", "CHEQUE", "BANK_TRANSFER", "EMI"]),
  trainerId: z.string().cuid().optional().or(z.literal("")),
  source: z.string().optional(), // How they heard about the gym
  notes: z.string().max(1000).optional(),
});

export const UpdateMemberSchema = z.object({
  firstName: NameSchema.optional(),
  lastName: NameSchema.optional(),
  email: EmailSchema.optional(),
  phone: PhoneSchema.optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).optional(),
  dateOfBirth: z.string().optional(),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).optional(),
  emergencyContact: z
    .string()
    .regex(/^[6-9]\d{9}$/)
    .optional()
    .or(z.literal("")),
  address: z.string().max(500).optional(),
  city: z.string().max(50).optional(),
  state: z.string().max(50).optional(),
  pincode: z.string().regex(/^\d{6}$/).optional().or(z.literal("")),
  trainerId: z.string().cuid().optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "INACTIVE", "EXPIRED", "FROZEN", "PENDING"]).optional(),
  notes: z.string().max(1000).optional(),
});

export const MemberFilterSchema = PaginationSchema.merge(
  z.object({
    status: z.enum(["ACTIVE", "INACTIVE", "EXPIRED", "FROZEN", "PENDING", "ALL"]).optional(),
    planId: z.string().optional(),
    trainerId: z.string().optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY", "ALL"]).optional(),
    dateRange: DateRangeSchema.optional(),
    hasDue: z.boolean().optional(),
  })
);

// ═══════════════════════════════════════════════════════════════
// TRAINER SCHEMAS
// ═══════════════════════════════════════════════════════════════

export const CreateTrainerSchema = z.object({
  firstName: NameSchema,
  lastName: NameSchema,
  email: EmailSchema,
  phone: PhoneSchema,
  password: PasswordSchema.optional(),
  specialization: z.array(z.string()).min(1, "Select at least one specialization"),
  experience: z.coerce.number().min(0, "Experience cannot be negative").max(50, "Too much experience"),
  salary: z.coerce.number().min(0).optional(),
  certifications: z.array(z.string()).optional(),
  bio: z.string().max(1000).optional(),
  availableDays: z.array(z.enum(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"])).min(1),
  availableFrom: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  availableTo: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
});

export const UpdateTrainerSchema = CreateTrainerSchema.partial().omit({ password: true });

// ═══════════════════════════════════════════════════════════════
// RECEPTIONIST / STAFF SCHEMAS
// ═══════════════════════════════════════════════════════════════

export const CreateStaffSchema = z.object({
  firstName: NameSchema,
  lastName: NameSchema,
  email: EmailSchema,
  phone: PhoneSchema,
  password: PasswordSchema.optional(),
  role: z.enum(["RECEPTIONIST", "WORKER"]),
  shiftStart: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
  shiftEnd: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
  salary: z.coerce.number().min(0).optional(),
  joiningDate: z.string().optional(),
});

export const UpdateStaffSchema = CreateStaffSchema.partial().omit({ password: true });

// ═══════════════════════════════════════════════════════════════
// SUBSCRIPTION PLAN SCHEMAS
// ═══════════════════════════════════════════════════════════════

export const CreatePlanSchema = z.object({
  name: z.string().min(2, "Plan name is required").max(50),
  duration: z.coerce.number().min(1, "Duration must be at least 1 day").max(3650, "Duration too long"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  gstIncluded: z.boolean().default(true),
  features: z.array(z.string().min(1)).min(1, "Add at least one feature"),
  description: z.string().max(500).optional(),
  color: z.string().max(20).optional(),
  isActive: z.boolean().default(true),
  maxCheckIns: z.coerce.number().min(0).optional(), // 0 = unlimited
  ptSessions: z.coerce.number().min(0).optional(),
  guestPasses: z.coerce.number().min(0).optional(),
  sortOrder: z.coerce.number().default(0),
});

export const UpdatePlanSchema = CreatePlanSchema.partial();

// ═══════════════════════════════════════════════════════════════
// SUBSCRIPTION SCHEMAS
// ═══════════════════════════════════════════════════════════════

export const CreateSubscriptionSchema = z.object({
  memberId: z.string().cuid(),
  planId: z.string().cuid(),
  startDate: z.string().min(1, "Start date is required"),
  amount: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).default(0),
  notes: z.string().optional(),
  autoRenew: z.boolean().default(false),
});

export const UpdateSubscriptionSchema = z.object({
  status: z.enum(["ACTIVE", "EXPIRED", "CANCELLED", "FROZEN", "PENDING", "GRACE"]).optional(),
  freezeUntil: z.string().optional(),
  autoRenew: z.boolean().optional(),
});

export const UpgradeSubscriptionSchema = z.object({
  subscriptionId: z.string().cuid(),
  newPlanId: z.string().cuid(),
  effectiveDate: z.string().optional(),
});

// ═══════════════════════════════════════════════════════════════
// PAYMENT SCHEMAS
// ═══════════════════════════════════════════════════════════════

export const CreatePaymentSchema = z.object({
  memberId: z.string().cuid(),
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  method: z.enum(["CASH", "CARD", "UPI", "ONLINE", "CHEQUE", "BANK_TRANSFER", "EMI"]),
  type: z.enum(["SUBSCRIPTION", "PT_SESSION", "PRODUCT", "OTHER"]).default("SUBSCRIPTION"),
  subscriptionId: z.string().cuid().optional(),
  description: z.string().max(500).optional(),
  transactionId: z.string().optional(), // For online payments
  discount: z.coerce.number().min(0).default(0),
  tax: z.coerce.number().min(0).default(0),
});

export const PaymentFilterSchema = PaginationSchema.merge(
  z.object({
    memberId: z.string().optional(),
    method: z.enum(["CASH", "CARD", "UPI", "ONLINE", "CHEQUE", "BANK_TRANSFER", "EMI", "ALL"]).optional(),
    status: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED", "PARTIAL", "ALL"]).optional(),
    type: z.enum(["SUBSCRIPTION", "PT_SESSION", "PRODUCT", "OTHER", "ALL"]).optional(),
    dateRange: DateRangeSchema.optional(),
  })
);

// ═══════════════════════════════════════════════════════════════
// ATTENDANCE SCHEMAS
// ═══════════════════════════════════════════════════════════════

export const CheckInSchema = z.object({
  memberId: z.string().cuid(),
  mode: z.enum(["MANUAL", "QR", "BIOMETRIC", "KIOSK"]).default("MANUAL"),
});

export const CheckOutSchema = z.object({
  attendanceId: z.string().cuid(),
});

export const AttendanceFilterSchema = PaginationSchema.merge(
  z.object({
    memberId: z.string().optional(),
    status: z.enum(["PRESENT", "ABSENT", "LATE", "EARLY_LEAVE", "ALL"]).optional(),
    date: z.string().optional(),
    dateRange: DateRangeSchema.optional(),
  })
);

// ═══════════════════════════════════════════════════════════════
// CLASS / SCHEDULE SCHEMAS
// ═══════════════════════════════════════════════════════════════

export const CreateClassSchema = z.object({
  name: z.string().min(2, "Class name is required").max(100),
  description: z.string().max(1000).optional(),
  category: z.enum(["YOGA", "ZUMBA", "CROSSFIT", "PILATES", "SPINNING", "HIIT", "BOXING", "DANCE", "MEDITATION", "AEROBICS"]),
  trainerId: z.string().cuid(),
  maxCapacity: z.coerce.number().min(1, "Capacity must be at least 1").max(100),
  duration: z.coerce.number().min(15, "Minimum 15 minutes").max(180, "Maximum 3 hours"),
  color: z.string().max(20).optional(),
  isActive: z.boolean().default(true),
});

export const CreateScheduleSchema = z.object({
  classId: z.string().cuid(),
  dayOfWeek: z.coerce.number().min(0).max(6),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
  room: z.string().min(1, "Room name is required").max(50),
});

export const BookClassSchema = z.object({
  scheduleId: z.string().cuid(),
  memberId: z.string().cuid(),
});

export const CancelBookingSchema = z.object({
  bookingId: z.string().cuid(),
  reason: z.string().max(500).optional(),
});

// ═══════════════════════════════════════════════════════════════
// WORKOUT SCHEMAS
// ═══════════════════════════════════════════════════════════════

export const ExerciseSchema = z.object({
  name: z.string().min(1, "Exercise name is required"),
  muscleGroup: z.string().optional(),
  sets: z.coerce.number().min(1).max(50).default(3),
  reps: z.coerce.number().min(1).max(100).default(10),
  weight: z.coerce.number().min(0).optional(),
  duration: z.coerce.number().min(0).optional(), // seconds
  rest: z.coerce.number().min(0).default(60), // seconds
  notes: z.string().max(500).optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
});

export const CreateWorkoutSchema = z.object({
  name: z.string().min(2, "Workout name is required").max(100),
  description: z.string().max(1000).optional(),
  exercises: z.array(ExerciseSchema).min(1, "Add at least one exercise"),
  difficulty: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED", "ELITE"]).default("BEGINNER"),
  estimatedDuration: z.coerce.number().min(5).max(180).optional(),
  targetMuscleGroups: z.array(z.string()).optional(),
  isTemplate: z.boolean().default(false),
  memberId: z.string().cuid().optional(), // If assigning to specific member
});

export const UpdateWorkoutSchema = CreateWorkoutSchema.partial();

export const LogWorkoutSchema = z.object({
  workoutId: z.string().cuid(),
  memberId: z.string().cuid(),
  completedExercises: z.array(
    z.object({
      exerciseId: z.string(),
      setsCompleted: z.number(),
      repsCompleted: z.array(z.number()),
      weightUsed: z.array(z.number()).optional(),
      notes: z.string().optional(),
    })
  ),
  duration: z.coerce.number().min(1),
  caloriesBurned: z.coerce.number().optional(),
  feeling: z.enum(["EASY", "MODERATE", "HARD", "EXTREME"]).optional(),
});

// ═══════════════════════════════════════════════════════════════
// DIET SCHEMAS
// ═══════════════════════════════════════════════════════════════

export const MealSchema = z.object({
  name: z.string().min(1, "Meal name is required"),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
  items: z.array(z.string()).min(1, "Add at least one food item"),
  calories: z.coerce.number().min(0).optional(),
  protein: z.coerce.number().min(0).optional(),
  carbs: z.coerce.number().min(0).optional(),
  fats: z.coerce.number().min(0).optional(),
  fiber: z.coerce.number().min(0).optional(),
  notes: z.string().max(500).optional(),
});

export const CreateDietPlanSchema = z.object({
  name: z.string().min(2, "Plan name is required").max(100),
  description: z.string().max(1000).optional(),
  meals: z.array(MealSchema).min(1, "Add at least one meal"),
  totalCalories: z.coerce.number().min(0).optional(),
  type: z.enum(["WEIGHT_LOSS", "MUSCLE_GAIN", "MAINTENANCE", "KETO", "VEGAN", "CUSTOM"]).default("CUSTOM"),
  memberId: z.string().cuid().optional(),
  isTemplate: z.boolean().default(false),
});

export const UpdateDietPlanSchema = CreateDietPlanSchema.partial();

export const LogMealSchema = z.object({
  dietPlanId: z.string().cuid(),
  memberId: z.string().cuid(),
  mealId: z.string(),
  consumed: z.boolean(),
  actualCalories: z.coerce.number().optional(),
  notes: z.string().optional(),
});

// ═══════════════════════════════════════════════════════════════
// PROGRESS SCHEMAS
// ═══════════════════════════════════════════════════════════════

export const MeasurementSchema = z.object({
  weight: z.coerce.number().min(20).max(300).optional(),
  height: z.coerce.number().min(100).max(250).optional(),
  bodyFat: z.coerce.number().min(2).max(60).optional(),
  chest: z.coerce.number().min(50).max(200).optional(),
  waist: z.coerce.number().min(50).max(200).optional(),
  hips: z.coerce.number().min(50).max(200).optional(),
  biceps: z.coerce.number().min(20).max(80).optional(),
  thighs: z.coerce.number().min(30).max(120).optional(),
  shoulders: z.coerce.number().min(50).max(200).optional(),
  forearms: z.coerce.number().min(20).max(60).optional(),
  calves: z.coerce.number().min(20).max(80).optional(),
  neck: z.coerce.number().min(20).max(60).optional(),
  notes: z.string().max(1000).optional(),
});

export const CreateProgressSchema = z.object({
  memberId: z.string().cuid(),
  measurements: MeasurementSchema,
  photos: z
    .array(
      z.object({
        type: z.enum(["FRONT", "SIDE", "BACK"]),
        url: z.string().url(),
      })
    )
    .optional(),
});

export const CreateGoalSchema = z.object({
  memberId: z.string().cuid(),
  title: z.string().min(2, "Goal title is required").max(100),
  description: z.string().max(500).optional(),
  type: z.enum(["WEIGHT_LOSS", "WEIGHT_GAIN", "MUSCLE_GAIN", "ENDURANCE", "FLEXIBILITY", "STRENGTH", "CUSTOM"]),
  targetValue: z.coerce.number().min(0),
  currentValue: z.coerce.number().min(0).optional(),
  unit: z.string().min(1).max(20),
  deadline: z.string().optional(),
});

// ═══════════════════════════════════════════════════════════════
// EQUIPMENT SCHEMAS
// ═══════════════════════════════════════════════════════════════

export const CreateEquipmentSchema = z.object({
  name: z.string().min(2, "Equipment name is required").max(100),
  category: z.enum(["CARDIO", "STRENGTH", "FREE_WEIGHTS", "FUNCTIONAL", "RECOVERY", "ACCESSORIES"]),
  model: z.string().max(100).optional(),
  serialNumber: z.string().max(100).optional(),
  purchaseDate: z.string().optional(),
  purchasePrice: z.coerce.number().min(0).optional(),
  warrantyExpiry: z.string().optional(),
  vendor: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  status: z.enum(["WORKING", "UNDER_MAINTENANCE", "OUT_OF_ORDER", "RETIRED"]).default("WORKING"),
  nextServiceDate: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

export const UpdateEquipmentSchema = CreateEquipmentSchema.partial();

export const MaintenanceLogSchema = z.object({
  equipmentId: z.string().cuid(),
  issue: z.string().min(5, "Please describe the issue").max(1000),
  cost: z.coerce.number().min(0).optional(),
  resolvedBy: z.string().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED"]).default("PENDING"),
});

// ═══════════════════════════════════════════════════════════════
// INVENTORY / POS SCHEMAS
// ═══════════════════════════════════════════════════════════════

export const CreateProductSchema = z.object({
  name: z.string().min(2, "Product name is required").max(100),
  category: z.enum(["SUPPLEMENT", "MERCHANDISE", "BEVERAGE", "EQUIPMENT", "OTHER"]),
  description: z.string().max(1000).optional(),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  costPrice: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().min(0, "Stock cannot be negative").default(0),
  minStock: z.coerce.number().min(0).default(5),
  barcode: z.string().max(50).optional(),
  gstRate: z.coerce.number().min(0).max(100).default(18),
  isActive: z.boolean().default(true),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export const SaleItemSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  price: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).default(0),
});

export const CreateSaleSchema = z.object({
  items: z.array(SaleItemSchema).min(1, "Add at least one item"),
  customerId: z.string().cuid().optional(),
  customerName: z.string().optional(),
  customerPhone: z.string().optional(),
  paymentMethod: z.enum(["CASH", "CARD", "UPI", "ONLINE"]),
  discount: z.coerce.number().min(0).default(0),
  notes: z.string().max(500).optional(),
});

// ═══════════════════════════════════════════════════════════════
// NOTIFICATION SCHEMAS
// ═══════════════════════════════════════════════════════════════

export const CreateNotificationSchema = z.object({
  userIds: z.array(z.string().cuid()).min(1, "Select at least one recipient"),
  title: z.string().min(2, "Title is required").max(100),
  body: z.string().min(5, "Message body is required").max(1000),
  type: z.enum([
    "PAYMENT_DUE",
    "PAYMENT_RECEIVED",
    "SUBSCRIPTION_EXPIRING",
    "SUBSCRIPTION_EXPIRED",
    "CLASS_REMINDER",
    "CLASS_CANCELLED",
    "WORKOUT_ASSIGNED",
    "DIET_ASSIGNED",
    "ACHIEVEMENT_UNLOCKED",
    "ANNOUNCEMENT",
    "MESSAGE",
    "SYSTEM",
    "BIRTHDAY",
    "MAINTENANCE_ALERT",
  ]),
  data: z.record(z.string()).optional(),
  sendEmail: z.boolean().default(false),
  sendWhatsApp: z.boolean().default(false),
  sendPush: z.boolean().default(true),
});

// ═══════════════════════════════════════════════════════════════
// SETTINGS SCHEMAS
// ═══════════════════════════════════════════════════════════════

export const GymSettingsSchema = z.object({
  name: z.string().min(2).max(100).default("Eagle Gym"),
  tagline: z.string().max(200).optional(),
  address: z.string().max(500).optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  logo: z.string().optional(),
  workingHours: z.object({
    open: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
    close: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
  }),
  daysOpen: z.array(z.enum(["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"])),
  gstNumber: z.string().optional(),
  gstRate: z.coerce.number().min(0).max(100).default(18),
  currency: z.string().default("INR"),
  timezone: z.string().default("Asia/Kolkata"),
  dateFormat: z.string().default("dd MMM yyyy"),
  language: z.enum(["en", "hi", "gu"]).default("en"),
  theme: z.enum(["dark", "light", "system"]).default("dark"),
});

// ═══════════════════════════════════════════════════════════════
// IMPORT / EXPORT SCHEMAS
// ═══════════════════════════════════════════════════════════════

export const ImportConfigSchema = z.object({
  entity: z.enum(["MEMBERS", "PAYMENTS", "ATTENDANCE", "INVENTORY", "EQUIPMENT"]),
  fileType: z.enum(["CSV", "EXCEL"]),
  skipHeader: z.boolean().default(true),
  columnMapping: z.record(z.string()).optional(),
  updateExisting: z.boolean().default(false),
});

export const ExportConfigSchema = z.object({
  entity: z.enum([
    "MEMBERS",
    "PAYMENTS",
    "ATTENDANCE",
    "SUBSCRIPTIONS",
    "TRAINERS",
    "INVENTORY",
    "EQUIPMENT",
    "ANALYTICS",
  ]),
  format: z.enum(["CSV", "EXCEL", "PDF"]),
  filters: z.record(z.unknown()).optional(),
  dateRange: DateRangeSchema.optional(),
  columns: z.array(z.string()).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
});

// ═══════════════════════════════════════════════════════════════
// TYPE EXPORTS
// ═══════════════════════════════════════════════════════════════

export type PaginationInput = z.infer<typeof PaginationSchema>;
export type DateRangeInput = z.infer<typeof DateRangeSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type OTPInput = z.infer<typeof OTPSchema>;
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type CreateMemberInput = z.infer<typeof CreateMemberSchema>;
export type UpdateMemberInput = z.infer<typeof UpdateMemberSchema>;
export type MemberFilterInput = z.infer<typeof MemberFilterSchema>;
export type CreateTrainerInput = z.infer<typeof CreateTrainerSchema>;
export type UpdateTrainerInput = z.infer<typeof UpdateTrainerSchema>;
export type CreateStaffInput = z.infer<typeof CreateStaffSchema>;
export type UpdateStaffInput = z.infer<typeof UpdateStaffSchema>;
export type CreatePlanInput = z.infer<typeof CreatePlanSchema>;
export type UpdatePlanInput = z.infer<typeof UpdatePlanSchema>;
export type CreateSubscriptionInput = z.infer<typeof CreateSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof UpdateSubscriptionSchema>;
export type UpgradeSubscriptionInput = z.infer<typeof UpgradeSubscriptionSchema>;
export type CreatePaymentInput = z.infer<typeof CreatePaymentSchema>;
export type PaymentFilterInput = z.infer<typeof PaymentFilterSchema>;
export type CheckInInput = z.infer<typeof CheckInSchema>;
export type CheckOutInput = z.infer<typeof CheckOutSchema>;
export type AttendanceFilterInput = z.infer<typeof AttendanceFilterSchema>;
export type CreateClassInput = z.infer<typeof CreateClassSchema>;
export type CreateScheduleInput = z.infer<typeof CreateScheduleSchema>;
export type BookClassInput = z.infer<typeof BookClassSchema>;
export type CancelBookingInput = z.infer<typeof CancelBookingSchema>;
export type ExerciseInput = z.infer<typeof ExerciseSchema>;
export type CreateWorkoutInput = z.infer<typeof CreateWorkoutSchema>;
export type UpdateWorkoutInput = z.infer<typeof UpdateWorkoutSchema>;
export type LogWorkoutInput = z.infer<typeof LogWorkoutSchema>;
export type MealInput = z.infer<typeof MealSchema>;
export type CreateDietPlanInput = z.infer<typeof CreateDietPlanSchema>;
export type UpdateDietPlanInput = z.infer<typeof UpdateDietPlanSchema>;
export type LogMealInput = z.infer<typeof LogMealSchema>;
export type MeasurementInput = z.infer<typeof MeasurementSchema>;
export type CreateProgressInput = z.infer<typeof CreateProgressSchema>;
export type CreateGoalInput = z.infer<typeof CreateGoalSchema>;
export type CreateEquipmentInput = z.infer<typeof CreateEquipmentSchema>;
export type UpdateEquipmentInput = z.infer<typeof UpdateEquipmentSchema>;
export type MaintenanceLogInput = z.infer<typeof MaintenanceLogSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
export type SaleItemInput = z.infer<typeof SaleItemSchema>;
export type CreateSaleInput = z.infer<typeof CreateSaleSchema>;
export type CreateNotificationInput = z.infer<typeof CreateNotificationSchema>;
export type GymSettingsInput = z.infer<typeof GymSettingsSchema>;
export type ImportConfigInput = z.infer<typeof ImportConfigSchema>;
export type ExportConfigInput = z.infer<typeof ExportConfigSchema>;