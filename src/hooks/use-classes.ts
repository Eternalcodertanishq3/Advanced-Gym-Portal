import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getClasses } from '@/server/actions/class-actions';

export function useClasses(page = 1, limit = 10, search = "") {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['classes', page, limit, search],
    queryFn: async () => {
      const res = await getClasses(page, limit, search);
      if (!res.success) throw new Error(res.error as string);
      return res.data;
    }
  });

  return { ...query };
}
