import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { PlanOption } from "@/lib/revenuecat";

interface PlanCardProps {
  plan: PlanOption;
  selected: boolean;
  onSelect: () => void;
  /** e.g. 25 -> "חיסכון 25%" badge. */
  savingPercent?: number;
  /** Monthly-equivalent price for the yearly plan, already localized. */
  perMonthNote?: string;
}

const PERIOD_LABEL: Record<PlanOption["planId"], string> = {
  monthly: "לחודש",
  yearly: "לשנה",
};

const PLAN_TITLE: Record<PlanOption["planId"], string> = {
  monthly: "מנוי חודשי",
  yearly: "מנוי שנתי",
};

export function PlanCard({ plan, selected, onSelect, savingPercent, perMonthNote }: PlanCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        "group relative flex w-full min-h-[76px] items-center justify-between gap-4 rounded-3xl border px-5 py-4 text-right transition-all duration-300",
        "bg-surface/80 hover:bg-surface-raised",
        selected
          ? "border-gold shadow-gold ring-1 ring-gold/40"
          : "border-border hover:border-foreground/25",
      )}
    >
      <span className="flex flex-col gap-1">
        <span className="flex items-center gap-2">
          <span className="font-display text-lg font-bold">{PLAN_TITLE[plan.planId]}</span>
          {savingPercent && savingPercent > 0 ? (
            <span className="rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold text-primary-foreground">
              חיסכון {savingPercent}%
            </span>
          ) : null}
        </span>
        <span className="text-sm text-muted-foreground">
          {plan.priceString} {PERIOD_LABEL[plan.planId]}
          {perMonthNote ? ` · ${perMonthNote} לחודש` : ""}
        </span>
        <span className="text-[11px] text-muted-foreground/80">
          חידוש אוטומטי · ניתן לביטול בכל עת
        </span>
      </span>

      <span
        aria-hidden
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded-full border transition-colors",
          selected ? "border-gold bg-gold text-primary-foreground" : "border-foreground/30",
        )}
      >
        {selected ? <Check className="size-4" strokeWidth={3} /> : null}
      </span>
    </button>
  );
}
