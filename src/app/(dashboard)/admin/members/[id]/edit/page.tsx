"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MemberForm } from "@/app/(dashboard)/admin/members/components/member-form";
import { getMemberById, updateMember } from "@/actions/admin/member-management-actions";
import { toast } from "sonner";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Edit Member Profile
// ═══════════════════════════════════════════════════════════════

export default function EditMemberPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [member, setMember] = useState<any>(null);

  useEffect(() => {
    async function loadMember() {
      const res = await getMemberById(id);
      if (res.success) {
        setMember(res.data);
      } else {
        toast.error(res.error || "Failed to load member");
        router.push("/admin/members");
      }
      setLoading(false);
    }
    loadMember();
  }, [id, router]);

  const handleSubmit = async (formData: any) => {
    setSaving(true);
    try {
      const res = await updateMember(id, formData);
      if (res.success) {
        toast.success("Member updated successfully!");
        router.push(`/admin/members/${id}`);
      } else {
        toast.error(res.error || "Failed to update member");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 pb-12">
      {/* Header */}
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
            Edit <span className="text-brand-orange">Profile</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Modify member details and contact information.
          </p>
        </div>
      </div>

      <MemberForm initialData={member} onSubmit={handleSubmit} loading={saving} mode="edit" />
    </div>
  );
}
