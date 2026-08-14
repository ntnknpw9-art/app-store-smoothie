import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "תנאי שימוש ומנוי | Premium" },
      {
        name: "description",
        content:
          "תנאי השימוש והרישיון (EULA) של מנוי Premium, כולל תנאי חידוש אוטומטי, ביטול והחזרים.",
      },
      { property: "og:title", content: "תנאי שימוש ומנוי | Premium" },
      {
        property: "og:description",
        content: "תנאי השימוש והרישיון של מנוי Premium, כולל חידוש אוטומטי וביטול.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return <LegalPage title="תנאי שימוש ומנוי" updated="עודכן לאחרונה: 14 באוגוסט 2026">
      <Section title="1. הסכם רישיון למשתמש קצה (EULA)">
        השימוש באפליקציה כפוף להסכם הרישיון הסטנדרטי למשתמש קצה של Apple (Apple Standard EULA),
        הזמין בכתובת{" "}
        <a
          className="text-gold underline underline-offset-4"
          href="https://www.apple.com/legal/internet-services/itunes/dev/stdeula/"
          target="_blank"
          rel="noreferrer"
        >
          apple.com/legal/internet-services/itunes/dev/stdeula
        </a>
        . אנו מעניקים לך רישיון אישי, מוגבל, בלתי בלעדי ובלתי ניתן להעברה להשתמש באפליקציה במכשירים
        המשויכים לחשבון ה־Apple ID שלך.
      </Section>

      <Section title="2. המנוי והחיוב">
        המנוי נמכר כמנוי מתחדש בשתי תקופות: חודשית ושנתית. המחיר המדויק המוצג לך במסך הרכישה הוא
        המחיר המחייב, כפי שנקבע בחנות האפליקציות למדינה ולמטבע שלך. התשלום נגבה מחשבון ה־Apple ID
        עם אישור הרכישה.
      </Section>

      <Section title="3. חידוש אוטומטי">
        המנוי מתחדש אוטומטית לתקופה זהה, אלא אם בוטל לפחות 24 שעות לפני תום התקופה הנוכחית. החיוב
        עבור החידוש מתבצע בתוך 24 השעות שלפני תום התקופה. אין תקופת ניסיון חינם.
      </Section>

      <Section title="4. ביטול וניהול">
        ניתן לנהל ולבטל את המנוי בכל עת דרך הגדרות החשבון בחנות האפליקציות (הגדרות ← Apple ID ←
        מנויים). ביטול ייכנס לתוקף בתום תקופת החיוב הנוכחית, והגישה לתכני הפרימיום תישמר עד אז.
      </Section>

      <Section title="5. החזרים">
        רכישות מעובדות על ידי Apple. בקשות להחזר כספי מטופלות ישירות מול Apple דרך{" "}
        <a
          className="text-gold underline underline-offset-4"
          href="https://reportaproblem.apple.com"
          target="_blank"
          rel="noreferrer"
        >
          reportaproblem.apple.com
        </a>
        .
      </Section>

      <Section title="6. שימוש הוגן">
        חל איסור לבצע הנדסה לאחור, לשכפל, למכור מחדש או לשתף את גישת המנוי עם צדדים שלישיים. הפרה
        עלולה להוביל לחסימת הגישה ללא החזר.
      </Section>

      <Section title="7. שינויים בתנאים ובמחיר">
        נעדכן אותך מראש על כל שינוי מהותי בתנאים או במחיר המנוי. שינוי מחיר למנוי קיים ייכנס לתוקף
        רק לאחר קבלת הסכמתך, בהתאם למדיניות Apple.
      </Section>

      <Section title="8. יצירת קשר">
        לשאלות בנוגע לתנאים או למנוי ניתן לפנות אלינו בדוא״ל: support@example.com
      </Section>
    </LegalPage>;
}

function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl px-6 pt-[max(2rem,env(safe-area-inset-top))] pb-16">
      <Link
        to="/"
        className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowRight className="size-4" />
        חזרה למסך המנוי
      </Link>
      <h1 className="mt-6 text-3xl font-extrabold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{updated}</p>
      <div className="mt-8 space-y-7">{children}</div>
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
