import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "מדיניות פרטיות | Premium" },
      {
        name: "description",
        content:
          "כיצד אנו אוספים, משתמשים ושומרים על המידע שלך באפליקציה, כולל נתוני רכישה ומנוי המעובדים דרך Apple ו-RevenueCat.",
      },
      { property: "og:title", content: "מדיניות פרטיות | Premium" },
      {
        property: "og:description",
        content: "המידע שאנו אוספים, אופן השימוש בו, ואיך לממש את זכויותיך.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl px-6 pt-[max(2rem,env(safe-area-inset-top))] pb-16">
      <Link
        to="/"
        className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowRight className="size-4" />
        חזרה למסך המנוי
      </Link>
      <h1 className="mt-6 text-3xl font-extrabold">מדיניות פרטיות</h1>
      <p className="mt-2 text-sm text-muted-foreground">עודכן לאחרונה: 14 באוגוסט 2026</p>

      <div className="mt-8 space-y-7">
        <Section title="1. איזה מידע נאסף">
          מזהה מנוי אנונימי, סטטוס המנוי, סוג המכשיר וגרסת מערכת ההפעלה. איננו אוספים את פרטי אמצעי
          התשלום שלך — הם מטופלים כולם על ידי Apple.
        </Section>
        <Section title="2. עיבוד רכישות">
          נתוני הרכישה והמנוי מעובדים באמצעות Apple ו־RevenueCat, המספקת לנו את סטטוס המנוי בלבד.
          מדיניות הפרטיות של RevenueCat זמינה בכתובת{" "}
          <a
            className="text-gold underline underline-offset-4"
            href="https://www.revenuecat.com/privacy"
            target="_blank"
            rel="noreferrer"
          >
            revenuecat.com/privacy
          </a>
          .
        </Section>
        <Section title="3. למה אנחנו משתמשים במידע">
          לאימות הגישה לתכני הפרימיום, למניעת שימוש לרעה, לתמיכה טכנית ולשיפור האפליקציה. איננו
          מוכרים מידע אישי ואיננו מעבירים אותו למפרסמים.
        </Section>
        <Section title="4. שמירה ואבטחה">
          המידע נשמר כל עוד המנוי פעיל ולתקופה סבירה לאחר מכן לצורכי חשבונאות ותמיכה. הגישה מוגבלת
          וההעברה מוצפנת ב־TLS.
        </Section>
        <Section title="5. זכויותיך">
          ניתן לבקש עיון, תיקון או מחיקה של המידע האישי בפנייה לדוא״ל support@example.com. מחיקת
          נתונים אינה מבטלת מנוי פעיל — יש לבטל אותו דרך הגדרות ה־Apple ID.
        </Section>
        <Section title="6. ילדים">
          האפליקציה אינה מיועדת לילדים מתחת לגיל 13 ואיננו אוספים ביודעין מידע אודותיהם.
        </Section>
        <Section title="7. יצירת קשר">
          לשאלות בנושא פרטיות: support@example.com
        </Section>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{children}</p>
    </section>
  );
}
