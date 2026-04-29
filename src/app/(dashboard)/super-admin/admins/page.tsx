import React from "react";
import { getStaff } from "@/actions/super-admin/staff-actions";
import { AdminsClient } from "./components/admins-client";

export default async function AdminsPage() {
  const { staff = [] } = await getStaff();

  return <AdminsClient staff={staff || []} />;
}
