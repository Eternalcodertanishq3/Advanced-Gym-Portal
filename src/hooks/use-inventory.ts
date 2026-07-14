import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInventoryItems, updateInventoryQuantity } from "@/actions/admin/inventory-actions";

export function useInventory(page = 1, limit = 10, search = "") {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["inventory", page, limit, search],
    queryFn: async () => {
      const res = await getInventoryItems(page, limit, search);
      if (!res.success) throw new Error(res.error as string);
      return res.data;
    },
  });

  const updateQuantity = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const res = await updateInventoryQuantity(id, quantity);
      if (!res.success) throw new Error(res.error as string);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
  });

  return { ...query, updateQuantity };
}
