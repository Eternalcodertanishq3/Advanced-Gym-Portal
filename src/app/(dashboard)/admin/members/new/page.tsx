"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MemberForm } from "@/components/members/member-form";
import { createMember } from "@/server/actions/member-actions";
import { toast } from "sonner";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Add New Member
// ═══════════════════════════════════════════════════════════════

export default function AddMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    try {
      const res = await createMember(formData);
      if (res.success) {
        toast.success("Member created successfully!");
        router.push("/admin/members");
      } else {
        toast.error(res.error || "Failed to create member");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-surface-card border-surface-sunken"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">
            Add New <span className="text-brand-orange">Member</span>
          </h1>
          <p className="text-sm text-muted-foreground">Register a new member to the Eagle Gym community.</p>
        </div>
      </div>

      <MemberForm 
        onSubmit={handleSubmit}
        loading={loading}
        mode="create"
      />
    </div>
  );
}
