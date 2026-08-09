import { useCallback, useEffect, useState } from "react";
import { notificationsService, type NotificationSummary } from "@/lib/notifications-service";

const POLL_INTERVAL_MS = 30_000;

export function useNotifications() {
  const [summary, setSummary] = useState<NotificationSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      const data = await notificationsService.getSummary();
      setSummary(data);
    } catch {
      // Silently ignore — the bell just won't update this cycle.
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
    const interval = setInterval(refetch, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refetch]);

  return { summary, isLoading, refetch };
}