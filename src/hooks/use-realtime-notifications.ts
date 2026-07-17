import { useEffect } from "react";
import { useNotificationStore } from "@/stores/notification-store";
import Pusher from "pusher-js";
import { toast } from "sonner";

/**
 * ═══════════════════════════════════════════════════════════════
 * 🦅 GymFlow SaaS — Realtime Notification Subscriptions (Pusher)
 * ═══════════════════════════════════════════════════════════════
 */
export function useRealtimeNotifications(userId: string | undefined, tenantId: string | null) {
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
    if (!userId || !key) return;

    // Enable logging in development mode
    if (process.env.NODE_ENV === "development") {
      Pusher.logToConsole = true;
    }

    const pusher = new Pusher(key, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap2",
    });

    // 1. Direct targeted user notifications
    const userChannel = pusher.subscribe(`user-${userId}`);
    userChannel.bind("notification", (data: any) => {
      addNotification({
        id: data.id || Math.random().toString(),
        title: data.title || "Notification Received",
        body: data.body || "",
        type: data.type || "INFO",
        isRead: false,
        createdAt: data.createdAt || new Date().toISOString(),
      });
      toast.info(data.title, { description: data.body });
    });

    // 2. Tenant broadcast messages
    if (tenantId) {
      const tenantChannel = pusher.subscribe(`tenant-${tenantId}`);
      tenantChannel.bind("broadcast", (data: any) => {
        addNotification({
          id: data.id || Math.random().toString(),
          title: data.title || "Gym Announcement",
          body: data.body || "",
          type: data.type || "SYSTEM",
          isRead: false,
          createdAt: data.createdAt || new Date().toISOString(),
        });
        toast.success(data.title, { description: data.body });
      });
    }

    return () => {
      pusher.unsubscribe(`user-${userId}`);
      if (tenantId) {
        pusher.unsubscribe(`tenant-${tenantId}`);
      }
      pusher.disconnect();
    };
  }, [userId, tenantId, addNotification]);
}
