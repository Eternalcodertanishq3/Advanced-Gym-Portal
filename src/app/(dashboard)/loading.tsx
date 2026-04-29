import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-gold-500" />
        <p className="font-medium tracking-widest text-gold-500/60 animate-pulse uppercase text-xs">
          Loading Eagle Gym...
        </p>
      </div>
    </div>
  );
}
