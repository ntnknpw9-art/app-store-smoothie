/**
 * RevenueCat wrapper.
 *
 * RevenueCat is the single source of truth for pricing and entitlement status.
 * Prices are never hardcoded — they always come from the store products
 * returned inside the default offering.
 *
 * On the web (preview / browser) the native plugin is unavailable, so every
 * call resolves to a clearly-marked unavailable state instead of crashing.
 */

export const MONTHLY_PRODUCT_ID = "premium_monthly";
export const YEARLY_PRODUCT_ID = "premium_yearly";
export const ENTITLEMENT_ID = "premium";

export type PlanId = "monthly" | "yearly";

export interface PlanOption {
  planId: PlanId;
  /** RevenueCat package identifier — used to run the purchase. */
  packageIdentifier: string;
  productIdentifier: string;
  /** Localized, store-provided price string (e.g. "‏39.90 ₪"). */
  priceString: string;
  /** Raw numeric price, used only to compute the relative saving. */
  price: number;
  currencyCode: string;
  title: string;
}

export interface SubscriptionSnapshot {
  plans: PlanOption[];
  isSubscribed: boolean;
  /** Store-managed expiry / renewal date, if RevenueCat reports one. */
  renewsAt: string | null;
  /** True when running outside a native iOS build (no real store access). */
  storeUnavailable: boolean;
}

export class StoreUnavailableError extends Error {
  constructor() {
    super("החנות אינה זמינה בסביבה זו");
    this.name = "StoreUnavailableError";
  }
}

/** Native build without a RevenueCat public API key — purchases cannot start. */
export class MissingApiKeyError extends Error {
  constructor() {
    super("חסר מפתח RevenueCat (VITE_REVENUECAT_IOS_API_KEY) בבנייה");
    this.name = "MissingApiKeyError";
  }
}

/** True when running inside the native iOS shell. */
export async function isNative(): Promise<boolean> {
  return (await loadPlugin()) !== null;
}

export function hasApiKey(): boolean {
  return Boolean(API_KEY);
}

const API_KEY = import.meta.env["VITE_REVENUECAT_IOS_API_KEY"] as string | undefined;

let configurePromise: Promise<boolean> | null = null;

async function loadPlugin() {
  if (typeof window === "undefined") return null;
  try {
    const [{ Capacitor }, rc] = await Promise.all([
      import("@capacitor/core"),
      import("@revenuecat/purchases-capacitor"),
    ]);
    if (!Capacitor.isNativePlatform()) return null;
    return rc;
  } catch {
    return null;
  }
}

async function ensureConfigured() {
  if (!configurePromise) {
    configurePromise = (async () => {
      const rc = await loadPlugin();
      if (!rc || !API_KEY) return false;
      await rc.Purchases.configure({ apiKey: API_KEY });
      return true;
    })();
  }
  return configurePromise;
}

function packageToPlan(pkg: {
  identifier: string;
  product: { identifier: string; priceString: string; price: number; currencyCode: string; title: string };
}): PlanOption | null {
  const productIdentifier = pkg.product.identifier;
  const planId: PlanId | null = productIdentifier.startsWith(MONTHLY_PRODUCT_ID)
    ? "monthly"
    : productIdentifier.startsWith(YEARLY_PRODUCT_ID)
      ? "yearly"
      : null;
  if (!planId) return null;
  return {
    planId,
    packageIdentifier: pkg.identifier,
    productIdentifier,
    priceString: pkg.product.priceString,
    price: pkg.product.price,
    currencyCode: pkg.product.currencyCode,
    title: pkg.product.title,
  };
}

/**
 * Preview-only plans. On a real device the prices always come from App Store
 * via RevenueCat; these mirror the configured store prices so the paywall can
 * be reviewed (and its layout verified) in the browser preview.
 */
const PREVIEW_PLANS: PlanOption[] = [
  {
    planId: "yearly",
    packageIdentifier: "$rc_annual",
    productIdentifier: YEARLY_PRODUCT_ID,
    priceString: "‏179.90 ₪",
    price: 179.9,
    currencyCode: "ILS",
    title: "מנוי שנתי",
  },
  {
    planId: "monthly",
    packageIdentifier: "$rc_monthly",
    productIdentifier: MONTHLY_PRODUCT_ID,
    priceString: "‏39.90 ₪",
    price: 39.9,
    currencyCode: "ILS",
    title: "מנוי חודשי",
  },
];

/** Loads the default offering plus the current entitlement state. */
export async function loadSubscriptionState(): Promise<SubscriptionSnapshot> {
  const rc = await loadPlugin();
  const configured = await ensureConfigured();
  if (!rc || !configured) {
    return {
      plans: PREVIEW_PLANS,
      isSubscribed: false,
      renewsAt: null,
      storeUnavailable: true,
    };
  }


  const [{ current }, { customerInfo }] = await Promise.all([
    rc.Purchases.getOfferings(),
    rc.Purchases.getCustomerInfo(),
  ]);

  const plans = (current?.availablePackages ?? [])
    .map((pkg) => packageToPlan(pkg as never))
    .filter((plan): plan is PlanOption => plan !== null)
    .sort((a, b) => (a.planId === "yearly" ? -1 : b.planId === "yearly" ? 1 : 0));

  const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];

  return {
    plans,
    isSubscribed: Boolean(entitlement),
    renewsAt: entitlement?.expirationDate ?? null,
    storeUnavailable: false,
  };
}

/** Runs the App Store purchase flow. Returns true when the entitlement is active. */
export async function purchasePlan(packageIdentifier: string): Promise<boolean> {
  const rc = await loadPlugin();
  const configured = await ensureConfigured();
  if (rc && !API_KEY) throw new MissingApiKeyError();
  if (!rc || !configured) throw new StoreUnavailableError();

  const { current } = await rc.Purchases.getOfferings();
  const aPackage = current?.availablePackages.find((p) => p.identifier === packageIdentifier);
  if (!aPackage) throw new Error("המנוי המבוקש אינו זמין כרגע");

  const { customerInfo } = await rc.Purchases.purchasePackage({ aPackage });
  return Boolean(customerInfo.entitlements.active[ENTITLEMENT_ID]);
}

/** Apple requires a visible "Restore Purchases" action on every paywall. */
export async function restorePurchases(): Promise<boolean> {
  const rc = await loadPlugin();
  const configured = await ensureConfigured();
  if (rc && !API_KEY) throw new MissingApiKeyError();
  if (!rc || !configured) throw new StoreUnavailableError();

  const { customerInfo } = await rc.Purchases.restorePurchases();
  return Boolean(customerInfo.entitlements.active[ENTITLEMENT_ID]);
}

/** Deep link to the native Apple ID subscription management screen. */
export const MANAGE_SUBSCRIPTIONS_URL = "https://apps.apple.com/account/subscriptions";
