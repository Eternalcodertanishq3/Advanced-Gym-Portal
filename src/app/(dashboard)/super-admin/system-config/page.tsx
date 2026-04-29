import React from "react";
import { getSystemConfig } from "@/actions/super-admin/config-actions";
import { SystemConfigClient } from "./components/system-config-client";

export default async function SystemConfigPage() {
  const res = await getSystemConfig();
  const config = res.success ? res.config : {};

  return <SystemConfigClient initialConfig={config || {}} />;
}
