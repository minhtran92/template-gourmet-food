/**
 * @g66/template-gourmet-food — SDK Configuration
 *
 * Template config for F&B (Food & Beverage) storefront.
 *
 * Backend: Pancake POS API (via /api/pancake/* routes)
 * Payment: VNPay (card/QR) + SEPay (VietQR bank transfer)
 * Auth: Phone OTP + Social (Zalo/Google/Facebook — optional)
 * Storefront: Loyalty points + reorder + nutrition info + allergen warnings
 *
 * This config is consumed by:
 *   - TemplateResolver (reads from registry)
 *   - Engine provisioner (when provisioning a new storefront instance)
 *   - Storefront pages (BackendProvider uses this to select backend)
 *
 * @example
 * ```ts
 * import { gourmetFoodConfig } from '@g66/template-gourmet-food/sdk-config';
 * import { BackendProvider } from '@g66/storefront-sdk/backend';
 * import { PancakeBackend } from '@g66/storefront-sdk/backend/adapters';
 *
 * const backend = new PancakeBackend({
 *   apiUrl: '/api/pancake',  // Same-origin Next.js API routes
 *   apiKey: process.env.PANCAKE_API_KEY,
 *   shopId: process.env.PANCAKE_SHOP_ID,
 * });
 *
 * <BackendProvider backend={backend}>
 *   <App />
 * </BackendProvider>
 * ```
 */

/** Template configuration for gourmet-food */
export const gourmetFoodConfig = {
  /** Template ID — matches registry/index.json key */
  id: 'gourmet-food',

  /** Human-readable template name */
  name: 'Gourmet Food',

  /** Template description */
  description: 'F&B, thực phẩm, đồ uống — template cho nhà hàng, quán cafe, tiệm bánh',

  /** Backend selection — Pancake POS API
   *  Storefront calls /api/pancake/* (same-origin Next.js API routes)
   *  which proxy to the Pancake POS API via @g66/pancake-sdk.
   *  No separate Medusa instance needed — uses the same backend as admin. */
  backend: {
    type: 'pancake' as const,
    /** API base path — relative, same-origin (Next.js API routes) */
    apiBasePath: '/api/pancake',
    /** Customer auth API base path */
    authBasePath: '/api/auth',
    /** Cart API base path (for future cart endpoints) */
    cartBasePath: '/api/pancake/orders',
  },

  /** Payment providers enabled by default for F&B */
  payment: {
    providers: ['vnpay', 'sepay'] as const,
    /** VNPay: card + QR payment (popular in VN) */
    vnpay: { methods: ['card', 'qr'] as const },
    /** SEPay: VietQR bank transfer (low fee, good for F&B) */
    sepay: { methods: ['qr', 'bank_transfer'] as const },
  },

  /** Auth providers — phone OTP is standard for Vietnamese customers
   *  Social login is optional (configured per-tenant via env vars) */
  auth: {
    customer: {
      providers: ['phone-otp'] as const,
    },
    /** Social login (optional, configured per-tenant) */
    social: {
      zalo: true,   // Enable if ZALO_OA_ID is set
      google: true,  // Enable if GOOGLE_CLIENT_ID is set
      facebook: true, // Enable if FACEBOOK_APP_ID is set
    },
  },

  /** Storefront features specific to F&B */
  storefront: {
    features: ['loyalty', 'reorder', 'nutrition-info', 'allergen-warning'] as const,
    /** Product image mockup skills for F&B */
    mockup: {
      skills: 'food-*',
      autoGenerate: true,
    },
    /** Default product grid columns */
    productGrid: 3,
    /** Support for menu-style category browsing */
    menuStyle: true,
  },

  /** i18n — Vietnamese is the primary market */
  i18n: {
    defaultLocale: 'vi',
    supportedLocales: ['vi', 'en'] as const,
  },

  /** Shipping providers (VN-specific) */
  shipping: {
    providers: ['ghn', 'ghtk', 'pickup'] as const,
    defaultMethods: ['ghn-express', 'ghtk', 'pickup'] as const,
  },
} as const;

/** Type of the gourmet-food config (for external use) */
export type GourmetFoodConfig = typeof gourmetFoodConfig;
