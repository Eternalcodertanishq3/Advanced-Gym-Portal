import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getChallenges } from "@/actions/member/challenge-actions";
import { ChallengesClient } from "./components/challenges-client";

export const metadata = {
  title: "Fitness Challenges | Eagle Gym",
  description: "Join community challenges and push your limits.",
};

export default async function ChallengesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const challengeRes = await getChallenges();
  const challenges = challengeRes.success ? challengeRes.data : [];

  return <ChallengesClient challenges={challenges} />;
}
