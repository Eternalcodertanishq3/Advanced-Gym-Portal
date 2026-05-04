import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAttendanceLogs } from '@/actions/admin/attendance-actions';

export function useAttendance(page = 1, limit = 10, search = "") {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['attendance', page, limit, search],
    queryFn: async () => {
      const res = await getAttendanceLogs(page, limit, search);
      if (!res.success) throw new Error(res.error as string);
      return res.data;
    }
  });

  return { ...query };
}

