/**
 * 🦅 EAGLE GYM — Standard Membership Features
 * These keys are used in the Plan model to define access levels.
 */
export const MEMBERSHIP_FEATURES = [
  {
    id: "gym_access",
    label: "Full Gym Access",
    description: "Access to all gym equipment and floor",
  },
  {
    id: "cardio_zone",
    label: "Cardio Zone",
    description: "Access to treadmills, ellipticals, and cycles",
  },
  { id: "group_classes", label: "Group Classes", description: "Yoga, Zumba, and HIIT classes" },
  { id: "pt_sessions", label: "PT Sessions", description: "Personal Training sessions" },
  {
    id: "locker_room",
    label: "Private Locker",
    description: "Dedicated locker for personal belongings",
  },
  { id: "steam_sauna", label: "Steam & Sauna", description: "Access to relaxation facilities" },
  { id: "guest_pass", label: "Guest Passes", description: "Bring a friend for a workout" },
  { id: "diet_plan", label: "Personalized Diet", description: "Monthly diet consultation" },
  {
    id: "mobile_app",
    label: "Premium App Features",
    description: "Workout tracking and diet logging",
  },
  { id: "towel_service", label: "Towel Service", description: "Fresh towels on every visit" },
];

export type FeatureId = (typeof MEMBERSHIP_FEATURES)[number]["id"];
