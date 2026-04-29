import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMembers } from '@/server/actions/member-actions';

export function useMembers(page = 1, limit = 10, search = "") {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['members', page, limit, search],
    queryFn: async () => {
      const res = await getMembers(page, limit, search);
      if (!res.success) throw new Error(res.error as string);
      return res;
    }
  });

  return { ...query };
}
