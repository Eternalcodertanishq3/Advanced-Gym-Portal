import prisma from "@/lib/prisma";
import { auth } from "@/auth";

/**
 * 🦅 EAGLE GYM — Feature Access Check
 * Checks if the current authenticated member has access to a specific feature.
 */
export async function getMemberFeatures() {
  const session = await auth();
  if (!session?.user || session.user.role !== "MEMBER") return [];

  const member = await prisma.member.findUnique({
    where: { userId: session.user.id },
    include: {
      subscription: {
        include: { plan: true },
      },
    },
  });

  if (!member?.subscription || member.subscription.status !== "ACTIVE") {
    return [];
  }

  // Ensure the subscription hasn't expired
  if (new Date() > new Date(member.subscription.endDate)) {
    return [];
  }

  return member.subscription.plan.features || [];
}

/**
 * Check if a user has a specific feature
 */
export async function hasFeature(featureId: string) {
  const features = await getMemberFeatures();
  return features.includes(featureId);
}

/**
 * Check if a member has any active subscription
 */
export async function hasActiveSubscription(userId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: {
      member: { userId },
      status: "ACTIVE",
      endDate: { gte: new Date() },
    },
  });
  return !!subscription;
}
