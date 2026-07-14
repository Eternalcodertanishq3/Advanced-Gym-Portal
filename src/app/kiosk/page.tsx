import React from "react";
import { KioskClient } from "./components/kiosk-client";

export const metadata = {
  title: "Gym Entry Kiosk | Eagle Gym",
  description: "Fast self-check-in station for Eagle Gym members.",
};

export default function KioskPage() {
  return (
    <div className="h-full w-full overflow-hidden">
      <KioskClient />
    </div>
  );
}
