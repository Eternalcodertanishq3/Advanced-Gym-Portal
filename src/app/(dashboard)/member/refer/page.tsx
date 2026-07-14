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
      reason: { contains: "Referral" },
    },
  });

  const totalReferralXP = referralTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const referralCount = referralTransactions.length;

  return (
    <div className="mx-auto h-full w-full max-w-5xl space-y-10 p-6">
      <div className="flex flex-col justify-between gap-6 text-center md:flex-row md:items-center md:text-left">
        <div>
          <h1 className="mb-1 font-display text-3xl font-bold uppercase tracking-tight text-foreground">
            Refer <span className="text-brand-orange">& Earn</span>
          </h1>
          <p className="text-sm font-medium text-txt-secondary">
            Strength is better with friends. Invite them and get rewarded!
          </p>
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
