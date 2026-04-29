import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useSubscriptions() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      // Replace with actual API call
      const res = await fetch('/api/subscriptions');
      return res.json();
    }
  });

  return { ...query };
}
