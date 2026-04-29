"use client";

import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An error occurred while fetching the data. Please try again later.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center bg-red-50/50 rounded-2xl border border-dashed border-red-200",
      className
    )}>
      <div className="mb-4 p-4 bg-red-100 rounded-full">
        <AlertCircle className="w-12 h-12 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-red-950 mb-1">{title}</h3>
      <p className="text-sm text-red-700 max-w-xs mb-6">
        {message}
      </p>
      {onRetry && (
        <Button 
          onClick={onRetry} 
          variant="outline"
          className="border-red-200 text-red-700 hover:bg-red-50"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
}
