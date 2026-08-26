/**
 * @g66/storefront-sdk — gourmet-food pages barrel export
 *
 * Page compositions for F&B storefronts.
 * - 🔴 TEMPLATE-SPECIFIC: HomePage, ProductDetailPage
 * - 🟡 SHARED: CartPage, CheckoutPage, LoginPage, AccountPage, SearchPage
 * All compose template components + SDK pre-built + SDK primitives.
 */

// ─── Template-specific pages ─────────────────────────────
export { HomePage, type HomePageProps, type HeroContent } from './HomePage';
export { ProductDetailPage, type ProductDetailPageProps, type ProductDetailData, type NutritionData } from './ProductDetailPage';

// ─── Shared pages (compose SDK pre-built + F&B customizations) ──────
export { CartPage, type CartPageProps } from './CartPage';
export { CheckoutPage, type CheckoutPageProps } from './CheckoutPage';
export { LoginPage, type LoginPageProps } from './LoginPage';
export { AccountPage as FnbAccountPage, type AccountPageProps as FnbAccountPageProps } from './AccountPage';
export { SearchPage as FnbSearchPage, type SearchPageProps as FnbSearchPageProps } from './SearchPage';
