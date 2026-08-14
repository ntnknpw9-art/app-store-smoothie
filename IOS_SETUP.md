# הפעלת המנויים באפליקציית iOS

1. ייצא את הפרויקט ל-GitHub, שכפל למחשב והרץ:
   ```bash
   npm install
   npm run build
   npx cap add ios
   npx cap sync ios
   ```
2. הגדר את מפתח ה-SDK הציבורי של iOS מ-RevenueCat (Project settings → API keys → Apple, מתחיל ב-`appl_`):
   - בקובץ `.env` מקומי / הגדרות הפרויקט: `VITE_REVENUECAT_IOS_API_KEY=appl_xxx`
   - יש לבנות מחדש (`npm run build && npx cap sync ios`) אחרי שינוי.
3. עדכן ב-`capacitor.config.ts` את `appId` ו-`appName` לפי האפליקציה שלך ב-App Store Connect.
4. ב-Xcode: Signing & Capabilities → הוסף **In-App Purchase**.
5. RevenueCat: ודא ש-`premium_monthly` ו-`premium_yearly` מחוברים ל-Offering הדיפולטי ולזכאות (entitlement) בשם `premium`. אם שם הזכאות שונה — עדכן את `ENTITLEMENT_ID` ב-`src/lib/revenuecat.ts`.
6. בדיקה: הרץ על מכשיר עם משתמש Sandbox של App Store Connect. המחירים מגיעים מהחנות — אין מחירים קשיחים בקוד.
7. App Store Connect: הזן את הקישורים לתנאי השימוש (`/terms`) ולמדיניות הפרטיות (`/privacy`) גם בטופס האפליקציה.
