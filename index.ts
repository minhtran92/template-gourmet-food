/**
 * @g66/storefront-sdk — gourmet-food Template
 *
 * Barrel export for the gourmet-food template (Phase 4).
 * F&B template for restaurants, cafes, bakeries, and food delivery.
 *
 * @example
 * ```ts
 * import { gourmetFoodConfig, gourmetFoodTheme, HeroBanner, HomePage, CartPage } from '@g66/storefront-sdk/templates/gourmet-food';
 * ```
 */

// ─── Config & Theme ─────────────────────────────────────
export { gourmetFoodConfig, type GourmetFoodConfig } from './sdk-config';
export { gourmetFoodTheme, gourmetFoodDarkTheme } from './theme';

// ─── Template-specific Components ───────────────────────
export { HeroBanner, type HeroBannerProps } from './components/HeroBanner';
export { MenuGrid, type MenuCategory, type MenuGridProps } from './components/MenuGrid';
export { NutritionInfo, type NutritionInfoProps } from './components/NutritionInfo';
export { AllergenWarning, type AllergenWarningProps } from './components/AllergenWarning';
export { Footer, type FooterProps, type SocialLink } from './components/Footer';
export { Navigation, type NavigationProps, type NavItem } from './components/Navigation';
export { FnbLayout, type FnbLayoutProps } from './components/Layout';

// ─── Page Compositions ──────────────────────────────────
// 🔴 Template-specific pages
export { HomePage, type HomePageProps, type HeroContent } from './pages/HomePage';
export {
  ProductDetailPage,
  type ProductDetailPageProps,
  type ProductDetailData,
  type NutritionData,
} from './pages/ProductDetailPage';

// 🟡 Shared pages (compose SDK pre-built + F&B customizations)
export { CartPage, type CartPageProps } from './pages/CartPage';
export { CheckoutPage, type CheckoutPageProps } from './pages/CheckoutPage';
export { LoginPage, type LoginPageProps } from './pages/LoginPage';
export { AccountPage as FnbAccountPage, type AccountPageProps as FnbAccountPageProps } from './pages/AccountPage';
export { SearchPage as FnbSearchPage, type SearchPageProps as FnbSearchPageProps } from './pages/SearchPage';
