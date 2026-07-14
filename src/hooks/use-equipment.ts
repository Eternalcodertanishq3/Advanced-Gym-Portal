import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEquipment, markEquipmentUnderMaintenance } from "@/actions/admin/equipment-actions";

export function useEquipment(page = 1, limit = 10, search = "") {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["equipment", page, limit, search],
    queryFn: async () => {
      const res = await getEquipment(page, limit, search);
      if (!res.success) throw new Error(res.error as string);
      return res.data;
    },
  });

  const setMaintenance = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
      const res = await markEquipmentUnderMaintenance(id, notes);
      if (!res.success) throw new Error(res.error as string);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
    },
  });

  return { ...query, setMaintenance };
}
