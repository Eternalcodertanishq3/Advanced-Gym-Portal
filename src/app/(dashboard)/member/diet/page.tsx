import React from "react";
import { getMemberDiets } from "@/actions/member/diet-actions";
import { DietClient } from "./components/diet-client";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Nutrition Command | Eagle Gym",
  description: "View your personalized diet plans and track your macros.",
};

export default async function DietPage() {
  const res = await getMemberDiets();

  if (!res.success || !res.data) {
    redirect("/member");
  }

  return (
    <div className="w-full h-full">
      <DietClient plans={res.data} />
    </div>
  );
}
