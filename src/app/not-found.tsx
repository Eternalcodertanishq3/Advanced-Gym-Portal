import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-obsidian-950 p-6 text-center">
      <div className="relative mb-8">
        <h1 className="text-9xl font-bold text-white/5 selection:bg-gold-500/10">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-full bg-gold-500/10 p-6 backdrop-blur-xl">
            <Search className="h-12 w-12 text-gold-500" />
          </div>
        </div>
      </div>
      
      <h2 className="mb-2 text-3xl font-bold text-white">Page Not Found</h2>
      <p className="mb-10 max-w-md text-white/60">
        The page you are looking for doesn't exist or has been moved. 
        Let's get you back on track.
      </p>

      <Button asChild className="bg-gold-500 text-black hover:bg-gold-600 px-8 py-6 text-lg">
        <Link href="/">
          <Home className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </Button>
      
      <div className="mt-16 flex gap-8 text-xs font-medium uppercase tracking-widest text-white/20">
        <span>Eagle Gym</span>
        <span>•</span>
        <span>Management Portal</span>
        <span>•</span>
        <span>v0.1.0</span>
      </div>
    </div>
  );
}
