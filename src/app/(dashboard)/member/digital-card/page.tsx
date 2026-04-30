import React from "react";
import { getMemberProfile } from "@/actions/member/member-actions";
import { DigitalCardClient } from "./components/digital-card-client";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Digital Access Pass | Eagle Gym",
  description: "Your digital membership card for gym entry.",
};

export default async function DigitalCardPage() {
  const res = await getMemberProfile();

  if (!res.success || !res.data) {
    redirect("/member");
  }

  return (
    <div className="w-full h-full">
      <DigitalCardClient member={res.data} />
    </div>
  );
}
