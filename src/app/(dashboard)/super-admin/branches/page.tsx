import React from "react";
import { getBranches } from "@/actions/super-admin/branch-actions";
import { BranchesClient } from "./components/branches-client";

export default async function BranchesPage() {
  const { branches = [] } = await getBranches();

  return <BranchesClient branches={branches || []} />;
}
