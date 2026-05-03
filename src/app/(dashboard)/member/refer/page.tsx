import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ReferClient } from "./components/refer-client";

export const metadata = {
  title: "Refer a Friend | Eagle Gym",
  description: "Invite your friends to Eagle Gym and earn exclusive rewards.",
};

export default async function ReferPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;
  const referralCode = `EAGLE-${userId.substring(0, 8).toUpperCase()}`;

  const referralTransactions = await prisma.xPTransaction.findMany({
    where: { 
      userId: userId,
      reason: { contains: "Referral" }
    }
  });

  const totalReferralXP = referralTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const referralCount = referralTransactions.length;

  return (
    <div className="w-full h-full p-6 space-y-10 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 text-center md:text-left">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-1 uppercase tracking-tight">
            Refer <span className="text-brand-orange">& Earn</span>
          </h1>
          <p className="text-sm text-txt-secondary font-medium">Strength is better with friends. Invite them and get rewarded!</p>
        </div>
      </div>

      <ReferClient 
        referralCode={referralCode} 
        referralCount={referralCount} 
        totalReferralXP={totalReferralXP} 
      />
    </div>
  );
}
