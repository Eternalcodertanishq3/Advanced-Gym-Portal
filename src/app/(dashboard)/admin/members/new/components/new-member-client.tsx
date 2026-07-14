"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MemberForm } from "@/app/(dashboard)/admin/members/components/member-form";
import { createMember } from "@/actions/admin/member-management-actions";
import { getBranches } from "@/actions/super-admin/branch-actions";
import { toast } from "sonner";

export function AddMemberClient({ userRole }: { userRole: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState<any[]>([]);

  useEffect(() => {
    if (userRole === "SUPER_ADMIN") {
      const fetchBranches = async () => {
        const res = await getBranches();
        if (res.success && res.branches) {
          setBranches(res.branches);
        }
      };
      fetchBranches();
    }
  }, [userRole]);

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
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-surface-sunken bg-surface-card"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Add New <span className="text-brand-orange">Member</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Register a new member to the Eagle Gym community.
          </p>
        </div>
      </div>

      <MemberForm onSubmit={handleSubmit} loading={loading} mode="create" branches={branches} />
    </div>
  );
}
