import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStaff } from "@/actions/admin/staff-management-actions";

export function useStaff(page = 1, limit = 10, search = "") {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["staff", page, limit, search],
    queryFn: async () => {
      const res = await getStaff(page, limit, search);
      if (!res.success) throw new Error(res.error as string);
      return res.data;
    },
  });

  return { ...query };
}
