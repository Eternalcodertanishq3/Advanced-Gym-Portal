import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMembers } from "@/actions/admin/member-management-actions";

export function useMembers(page = 1, limit = 10, search = "", branchId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["members", page, limit, search, branchId],
    queryFn: async () => {
      const res = await getMembers(page, limit, search, branchId);
      if (!res.success) throw new Error(res.error as string);
      return res;
    },
  });

  return { ...query };
}
