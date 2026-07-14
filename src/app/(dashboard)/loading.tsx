import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="text-gold-500 h-12 w-12 animate-spin" />
        <p className="text-gold-500/60 animate-pulse text-xs font-medium uppercase tracking-widest">
          Loading Dashboard...
        </p>
      </div>
    </div>
  );
}
