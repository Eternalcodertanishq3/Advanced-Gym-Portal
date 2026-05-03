import React from "react";
import { getMemberSubscriptionDetails } from "@/actions/member/subscription-actions";
import { MemberSubscriptionClient } from "./components/subscription-client";
import { redirect } from "next/navigation";

export default async function MemberSubscriptionPage() {
  const res = await getMemberSubscriptionDetails();
  
  if (!res.success || !res.data) {
    if (res.error === "Not authenticated") {
      redirect("/login");
    }
    // Handle other errors (e.g. member not found)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-txt-secondary font-medium">{res.error}</p>
      </div>
    );
  }

  return (
    <MemberSubscriptionClient 
      subscription={res.data.subscription}
      payments={res.data.payments}
    />
  );
}
