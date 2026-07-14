import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReceptionists } from "@/actions/admin/receptionist-actions";

// ═══════════════════════════════════════════════════════════════
// 🦅 EAGLE GYM — Receptionists Data Hook
// ═══════════════════════════════════════════════════════════════

export function useReceptionists(page = 1, limit = 10, search = "") {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["receptionists", page, limit, search],
    queryFn: async () => {
      const res = await getReceptionists(page, limit, search);
      if (!res.success) throw new Error(res.error as string);
      return res.data;
    },
  });

  return { ...query };
}
