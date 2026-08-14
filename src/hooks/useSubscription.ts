import { useCallback, useEffect, useState } from "react";

import {
  loadSubscriptionState,
  purchasePlan,
  restorePurchases,
  type SubscriptionSnapshot,
} from "@/lib/revenuecat";

type Status = "loading" | "ready" | "error";

const EMPTY: SubscriptionSnapshot = {
  plans: [],
  isSubscribed: false,
  renewsAt: null,
  storeUnavailable: false,
};

export function useSubscription() {
  const [status, setStatus] = useState<Status>("loading");
  const [snapshot, setSnapshot] = useState<SubscriptionSnapshot>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);

  const refresh = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      setSnapshot(await loadSubscriptionState());
      setStatus("ready");
    } catch (err) {
      setError(err instanceof Error ? err.message : "טעינת המנויים נכשלה");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const purchase = useCallback(
    async (packageIdentifier: string) => {
      setIsWorking(true);
      try {
        const active = await purchasePlan(packageIdentifier);
        if (active) await refresh();
        return active;
      } finally {
        setIsWorking(false);
      }
    },
    [refresh],
  );

  const restore = useCallback(async () => {
    setIsWorking(true);
    try {
      const active = await restorePurchases();
      if (active) await refresh();
      return active;
    } finally {
      setIsWorking(false);
    }
  }, [refresh]);

  return { status, error, isWorking, refresh, purchase, restore, ...snapshot };
}
