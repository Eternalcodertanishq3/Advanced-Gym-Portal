import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllDocuments, deleteDocument } from '@/actions/shared/document-actions';

export function useDocuments() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const res = await getAllDocuments();
      if (!res.success) throw new Error(res.error as string);
      return res.data;
    }
  });

  const removeDocument = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteDocument(id);
      if (!res.success) throw new Error(res.error as string);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    }
  });

  return { ...query, removeDocument };
}

