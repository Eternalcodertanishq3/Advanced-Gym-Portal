import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllSentNotifications, sendBroadcast } from '@/server/actions/notification-actions';

export function useNotifications() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['notifications-admin'],
    queryFn: async () => {
      const res = await getAllSentNotifications();
      if (!res.success) throw new Error(res.error as string);
      return res.data;
    }
  });

  const broadcast = useMutation({
    mutationFn: async (data: { title: string, message: string, type: string }) => {
      const res = await sendBroadcast(data.title, data.message, data.type);
      if (!res.success) throw new Error(res.error as string);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications-admin'] });
    }
  });

  return { ...query, broadcast };
}
