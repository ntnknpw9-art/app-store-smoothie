# דף מנויים (Paywall) ל-iOS עם RevenueCat

מסך תשלום בעברית RTL, מוכן לאריזה כאפליקציית iOS עם Capacitor, שמושך את המוצרים והמחירים ישירות מ-RevenueCat (ללא מחירים קשיחים בקוד).

## מה נבנה

**מסך הפייוול (דף הבית `/`)**
- כותרת ערך ברורה + רשימת יתרונות הפרימיום
- שני כרטיסי מנוי הנטענים מה-Offering הדיפולטי ב-RevenueCat: `premium_monthly` ו-`premium_yearly`
- כל טקסט מחיר מגיע מ-`product.priceString` של RevenueCat (מוצג ב-₪ לפי חנות אפל), כולל חישוב אחוז חיסכון שנתי מהנתונים עצמם
- בחירת תוכנית בלחיצה, כפתור רכישה ראשי אחד, ללא תקופת ניסיון
- מצבי טעינה (סקלטון), שגיאה עם ניסיון חוזר, ומצב "כבר מנוי" עם ניהול מנוי

**כל מה שאפל דורשת בדף תשלום (Guideline 3.1.2)**
- שם המנוי ואורך התקופה (חודשי / שנתי)
- המחיר לכל תקופה, כפי שמגיע מהחנות
- טקסט חידוש אוטומטי מלא: החיוב מתחדש אוטומטית אלא אם מבטלים לפחות 24 שעות לפני סוף התקופה; החשבון מחויב 24 שעות לפני סוף התקופה הנוכחית; ניהול וביטול דרך הגדרות ה-Apple ID
- קישור **שחזור רכישות** (`restorePurchases`) — חובה
- קישור **תנאי שימוש (EULA)** וקישור **מדיניות פרטיות** גלויים במסך עצמו
- קישור לניהול המנוי בהגדרות אפל
- כפתור סגירה/דילוג נגיש (כשהמסך נפתח כמודאל)
- טקסט ללא הבטחות מטעות, ללא אזכור אמצעי תשלום חיצוניים

**דפים משפטיים**
- `/terms` — תנאי שימוש כולל נוסח ה-EULA הסטנדרטי של אפל
- `/privacy` — מדיניות פרטיות (נדרש בטופס App Store Connect וגם בפייוול)

## פרטים טכניים

- התקנת `@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`, `@revenuecat/purchases-capacitor` + `capacitor.config.ts`
- שכבת עטיפה `src/lib/revenuecat.ts`: `configure`, `getOfferings`, `purchasePackage`, `restorePurchases`, `getCustomerInfo` — עם fallback ל-Web (מצב תצוגה מקדימה בדפדפן מציג את ה-UI עם placeholder ולא קורס)
- hook `useSubscription` המנהל offerings, entitlement, מצבי טעינה/שגיאה
- זיהוי המוצרים לפי מזהי החבילות מה-Offering הדיפולטי (`premium_monthly`, `premium_yearly`) — RevenueCat הוא מקור האמת למחיר ולסטטוס
- מפתח ה-SDK הציבורי של iOS יישמר כמשתנה סביבה `VITE_REVENUECAT_IOS_API_KEY` (מפתח publishable, מותר בקוד לקוח)
- עיצוב: design tokens ב-`src/styles.css`, כיוון RTL, טיפוגרפיה עברית, מגע ≥44pt, אנימציות עדינות
- מטא-דאטה ייעודית לכל ראוט (title/description/og)

## מה תצטרך לעשות בעצמך אחרי הבנייה
1. לייצא את הפרויקט ל-GitHub, `npm i && npx cap add ios && npx cap sync`
2. להזין את מפתח ה-RevenueCat של iOS
3. לפתוח ב-Xcode, להוסיף יכולת In-App Purchase, ולבדוק ב-Sandbox
