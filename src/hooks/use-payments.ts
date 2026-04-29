import { useQuery } from '@tanstack/react-query';
import { getPayments } from '@/server/actions/payment-actions';

export function usePayments(page = 1, limit = 10, status?: string) {
  const query = useQuery({
    queryKey: ['payments', page, limit, status],
    queryFn: async () => {
      const res = await getPayments(page, limit, status);
      if (!res.success) throw new Error(res.error as string);
      return res.data;
    }
  });

  return { ...query };
}
