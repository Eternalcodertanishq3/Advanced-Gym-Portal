"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./use-auth";

export function useUser() {
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();

  // In a real app, you might fetch more detailed profile data
  const profile = useQuery({
    queryKey: ["profile", authUser?.id],
    queryFn: async () => {
      if (!authUser?.id) return null;
      // const res = await getProfile();
      // if (!res.success) throw new Error(res.error);
      // return res.data;
      return authUser; // Placeholder until user-actions are ready
    },
    enabled: !!authUser?.id,
  });

  return {
    ...profile,
    user: profile.data,
  };
}
