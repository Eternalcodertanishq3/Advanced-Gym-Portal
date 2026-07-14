import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGymSettings, updateGymSetting } from "@/actions/shared/settings-actions";

export function useSettings() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await getGymSettings();
      if (!res.success) throw new Error(res.error as string);
      return res.data;
    },
  });

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const res = await updateGymSetting(key, value);
      if (!res.success) throw new Error(res.error as string);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });

  return { ...query, updateSetting };
}
