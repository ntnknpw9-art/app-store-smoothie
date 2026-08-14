import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Check, Crown, Loader2, RefreshCw, ShieldCheck, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

import { LegalDisclosure } from "@/components/paywall/LegalDisclosure";
import { PlanCard } from "@/components/paywall/PlanCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubscription } from "@/hooks/useSubscription";
import {
  MANAGE_SUBSCRIPTIONS_URL,
  MissingApiKeyError,
  StoreUnavailableError,
  type PlanId,
} from "@/lib/revenuecat";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "מנוי Premium — חודשי או שנתי" },
      {
        name: "description",
        content:
          "שדרגו ל-Premium: גישה מלאה לכל הכלים, ללא פרסומות וללא הגבלה. מנוי חודשי או שנתי, ניתן לביטול בכל עת דרך הגדרות Apple ID.",
      },
      { property: "og:title", content: "מנוי Premium — חודשי או שנתי" },
      {
        property: "og:description",
        content: "שדרגו ל-Premium: גישה מלאה לכל הכלים, ללא פרסומות וללא הגבלה. מנוי חודשי או שנתי, ניתן לביטול בכל עת דרך הגדרות Apple ID.",
      },
    ],
  }),
  component: PaywallPage,
});

const BENEFITS = [
  { title: "גישה בלתי מוגבלת", text: "כל הכלים והתכנים נפתחים מיד, ללא מכסות יומיות." },
  { title: "ללא פרסומות", text: "חוויית שימוש נקייה לחלוטין בכל מסכי האפליקציה." },
  { title: "סנכרון בין מכשירים", text: "המנוי עובר איתך לכל מכשיר עם אותו Apple ID." },
  { title: "תמיכה מועדפת", text: "מענה אנושי מהיר לכל שאלה, ישירות מתוך האפליקציה." },
];

function PaywallPage() {
  const {
    status,
    error,
    isWorking,
    plans,
    isSubscribed,
    renewsAt,
    storeUnavailable,
    refresh,
    purchase,
    restore,
  } = useSubscription();

  const [selected, setSelected] = useState<PlanId>("yearly");

  useEffect(() => {
    if (plans.length && !plans.some((p) => p.planId === selected)) {
      setSelected(plans[0]!.planId);
    }
  }, [plans, selected]);

  const selectedPlan = plans.find((p) => p.planId === selected) ?? plans[0];

  const { savingPercent, perMonthNote } = useMemo(() => {
    const monthly = plans.find((p) => p.planId === "monthly");
    const yearly = plans.find((p) => p.planId === "yearly");
    if (!monthly || !yearly || monthly.price <= 0) return { savingPercent: 0, perMonthNote: "" };
    const full = monthly.price * 12;
    const saving = Math.round(((full - yearly.price) / full) * 100);
    const perMonth = new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: yearly.currencyCode || "ILS",
    }).format(yearly.price / 12);
    return { savingPercent: saving > 0 ? saving : 0, perMonthNote: perMonth };
  }, [plans]);

  async function handlePurchase() {
    if (!selectedPlan) return;
    try {
      const active = await purchase(selectedPlan.packageIdentifier);
      if (active) toast.success("המנוי הופעל. תודה!");
      else toast.info("הרכישה לא הושלמה");
    } catch (err) {
      if (err instanceof MissingApiKeyError) {
        toast.error("חסר מפתח RevenueCat בבנייה — הוסף VITE_REVENUECAT_IOS_API_KEY והרץ build:ios מחדש");
      } else if (err instanceof StoreUnavailableError) {
        toast.info("הרכישה זמינה רק באפליקציית ה-iOS המותקנת מ-App Store");
      } else {
        toast.error(err instanceof Error ? err.message : "הרכישה נכשלה");
      }
    }
  }

  async function handleRestore() {
    try {
      const active = await restore();
      toast[active ? "success" : "info"](
        active ? "הרכישות שוחזרו בהצלחה" : "לא נמצאו רכישות קודמות לשחזור",
      );
    } catch (err) {
      if (err instanceof MissingApiKeyError) {
        toast.error("חסר מפתח RevenueCat בבנייה — הוסף VITE_REVENUECAT_IOS_API_KEY");
      } else if (err instanceof StoreUnavailableError) {
        toast.info("שחזור רכישות זמין רק באפליקציית ה-iOS");
      } else {
        toast.error("שחזור הרכישות נכשל");
      }
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-[420px] bg-[radial-gradient(60%_60%_at_50%_50%,var(--gold)_0%,transparent_70%)] opacity-[0.18] blur-2xl"
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-lg flex-col px-6 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
        {/* Dismissible header — Apple requires an obvious way out of a paywall */}
        <div className="flex items-center justify-between py-2">
          <button
            type="button"
            onClick={() => window.history.back()}
            aria-label="סגירת מסך המנוי"
            className="flex size-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
          >
            <X className="size-5" />
          </button>
          <button
            type="button"
            onClick={handleRestore}
            disabled={isWorking}
            className="min-h-11 rounded-full px-3 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground disabled:opacity-50"
          >
            שחזור רכישות
          </button>
        </div>

        <header className="animate-rise mt-4 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold-soft">
            <Crown className="size-3.5" />
            Premium
          </span>
          <h1 className="text-balance-rtl mt-5 text-[2rem] leading-tight font-extrabold">
            הכל נפתח.
            <br />
            בלי הגבלות, בלי פרסומות.
          </h1>
          <p className="text-balance-rtl mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
            מנוי אחד שמעניק גישה מלאה לכל הכלים, בכל המכשירים שלך.
          </p>
        </header>

        <ul className="animate-rise mt-8 space-y-3">
          {BENEFITS.map((benefit) => (
            <li key={benefit.title} className="flex items-start gap-3">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              <span>
                <span className="block text-[15px] font-semibold">{benefit.title}</span>
                <span className="block text-sm text-muted-foreground">{benefit.text}</span>
              </span>
            </li>
          ))}
        </ul>

        <section className="mt-8" aria-label="בחירת תוכנית">
          {status === "loading" ? (
            <div className="space-y-3">
              <Skeleton className="h-[92px] w-full rounded-3xl" />
              <Skeleton className="h-[92px] w-full rounded-3xl" />
            </div>
          ) : status === "error" ? (
            <ErrorState message={error} onRetry={refresh} />
          ) : isSubscribed ? (
            <ActiveState renewsAt={renewsAt} />
          ) : plans.length ? (
            <>
              <div role="radiogroup" aria-label="תוכניות מנוי" className="space-y-3">
                {plans.map((plan) => (
                  <PlanCard
                    key={plan.packageIdentifier}
                    plan={plan}
                    selected={plan.planId === selected}
                    onSelect={() => setSelected(plan.planId)}
                    {...(plan.planId === "yearly"
                      ? { savingPercent, perMonthNote }
                      : {})}
                  />
                ))}
              </div>
              {storeUnavailable ? (
                <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
                  תצוגה מקדימה בדפדפן — המחירים הסופיים נטענים מ-App Store באפליקציית ה-iOS.
                </p>
              ) : null}
            </>
          ) : (
            <StoreUnavailableState unavailable={storeUnavailable} onRetry={refresh} />
          )}

        </section>

        {!isSubscribed ? (
          <div className="mt-6">
            <button
              type="button"
              onClick={handlePurchase}
              disabled={isWorking || !selectedPlan}
              className="shadow-gold flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-gold text-[17px] font-bold text-primary-foreground transition-transform duration-200 active:scale-[0.98] disabled:opacity-50"
            >
              {isWorking ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Sparkles className="size-5" />
              )}
              {selectedPlan
                ? `המשך · ${selectedPlan.priceString} ${selectedPlan.planId === "yearly" ? "לשנה" : "לחודש"}`
                : "המשך"}
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5" />
              התשלום מאובטח ומעובד על ידי Apple
            </p>
          </div>
        ) : null}

        <div className="mt-8 border-t border-border pt-6">
          <LegalDisclosure />
        </div>
      </div>
    </main>
  );
}

function ErrorState({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return (
    <div className="rounded-3xl border border-border bg-surface/70 p-6 text-center">
      <p className="text-[15px] font-semibold">לא הצלחנו לטעון את המנויים</p>
      <p className="mt-1 text-sm text-muted-foreground">{message ?? "נסה שוב בעוד רגע."}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition-colors hover:bg-surface-raised"
      >
        <RefreshCw className="size-4" />
        נסה שוב
      </button>
    </div>
  );
}

function ActiveState({ renewsAt }: { renewsAt: string | null }) {
  const formatted = renewsAt
    ? new Intl.DateTimeFormat("he-IL", { dateStyle: "long" }).format(new Date(renewsAt))
    : null;

  return (
    <div className="rounded-3xl border border-gold/40 bg-gold/10 p-6 text-center">
      <Crown className="mx-auto size-6 text-gold" />
      <p className="mt-3 text-[17px] font-bold">המנוי שלך פעיל</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {formatted ? `החידוש הבא: ${formatted}` : "תודה שאתה איתנו."}
      </p>
      <a
        href={MANAGE_SUBSCRIPTIONS_URL}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm font-medium transition-colors hover:bg-surface-raised"
      >
        ניהול המנוי בהגדרות Apple ID
      </a>
    </div>
  );
}

function StoreUnavailableState({
  unavailable,
  onRetry,
}: {
  unavailable: boolean;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-surface/50 p-6 text-center">
      <p className="text-[15px] font-semibold">
        {unavailable ? "תצוגה מקדימה בדפדפן" : "אין כרגע מנויים זמינים"}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
        {unavailable
          ? "המחירים נטענים מ-App Store דרך RevenueCat ויוצגו כאן באפליקציית ה-iOS."
          : "לא נמצאו מוצרים ב-Offering הפעיל של RevenueCat."}
      </p>
      {!unavailable ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-medium transition-colors hover:bg-surface-raised"
        >
          <RefreshCw className="size-4" />
          רענון
        </button>
      ) : null}
    </div>
  );
}
