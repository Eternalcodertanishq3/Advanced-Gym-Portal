import { useQuery } from "@tanstack/react-query";
import { getTrainers } from "@/actions/admin/trainer-actions";

export function useTrainers() {
  const query = useQuery({
    queryKey: ["trainers"],
    queryFn: async () => {
      const res = await getTrainers();
      if (!res.success) throw new Error(res.error as string);
      return res;
    },
  });

  return { ...query };
}
