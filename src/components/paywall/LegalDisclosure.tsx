import { Link } from "@tanstack/react-router";

import { MANAGE_SUBSCRIPTIONS_URL } from "@/lib/revenuecat";

/**
 * Apple App Store Review Guideline 3.1.2 requires the paywall itself to state
 * the auto-renewal terms and to link to the EULA, the privacy policy and the
 * subscription management screen.
 */
export function LegalDisclosure() {
  return (
    <div className="space-y-4 text-center">
      <p className="mx-auto max-w-md text-[13px] leading-relaxed text-muted-foreground">
        התשלום ייגבה מחשבון ה־Apple ID שלך עם אישור הרכישה. המנוי מתחדש אוטומטית באותו מחיר ולאותה
        תקופה, אלא אם ביטלת אותו לפחות 24 שעות לפני תום התקופה הנוכחית. חשבונך יחויב עבור החידוש
        בתוך 24 השעות שלפני תום התקופה. ניתן לנהל או לבטל את המנוי בכל עת דרך הגדרות החשבון בחנות
        האפליקציות. אין תקופת ניסיון חינם.
      </p>
      <nav
        aria-label="קישורים משפטיים"
        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-[13px] font-medium"
      >
        <Link to="/terms" className="text-foreground/80 underline-offset-4 hover:underline">
          תנאי שימוש (EULA)
        </Link>
        <span aria-hidden className="text-muted-foreground/50">
          ·
        </span>
        <Link to="/privacy" className="text-foreground/80 underline-offset-4 hover:underline">
          מדיניות פרטיות
        </Link>
        <span aria-hidden className="text-muted-foreground/50">
          ·
        </span>
        <a
          href={MANAGE_SUBSCRIPTIONS_URL}
          target="_blank"
          rel="noreferrer"
          className="text-foreground/80 underline-offset-4 hover:underline"
        >
          ניהול המנוי
        </a>
      </nav>
    </div>
  );
}
