import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@/server/actions/analytics-actions';

export function useAnalytics() {
  const query = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await getDashboardStats();
      if (!res.success) throw new Error(res.error as string);
      return res.data;
    }
  });

  return { ...query };
}
