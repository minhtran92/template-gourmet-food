# @g66/template-gourmet-food

> F&B (Food & Beverage) storefront template for @g66 platform.
> Warm coffee/wood theme, phone OTP auth, VNPay/SEPay payments.

## Overview

This template is designed for restaurants, cafes, bakeries, and food delivery
stores. It uses the **Pancake POS API** as the commerce backend (no separate
Medusa instance needed).

## Structure

```
template-gourmet-food/
├── components/          # Template-specific F&B components
│   ├── HeroBanner.tsx   # F&B hero section
│   ├── MenuGrid.tsx     # Menu/category grid
│   ├── NutritionInfo.tsx# F&B nutrition info
│   ├── AllergenWarning.tsx # Allergen warnings
│   ├── Footer.tsx       # F&B footer (phone, address)
│   ├── Navigation.tsx   # F&B navigation
│   └── Layout.tsx       # F&B layout wrapper
├── pages/               # Storefront pages
│   ├── HomePage.tsx     # Hero + menu + featured products
│   ├── ProductDetailPage.tsx # Product + nutrition + allergen
│   ├── CartPage.tsx     # Cart with F&B labels
│   ├── CheckoutPage.tsx # VN F&B checkout defaults
│   ├── LoginPage.tsx    # Phone OTP + social login
│   ├── AccountPage.tsx  # Loyalty + reorder
│   └── SearchPage.tsx   # F&B category filters
├── content/             # Sample data
│   └── sample-data.json
├── theme.ts             # Warm coffee/wood theme config
├── sdk-config.ts        # Pancake backend + payment + auth config
├── index.ts             # Barrel exports
└── package.json
```

## Backend: Pancake POS API

This template uses **Pancake POS** as the commerce backend via:

```
Storefront → /api/pancake/* → @g66/pancake-sdk → Pancake POS API
```

Products, orders, customers, inventory — all fetched from Pancake.
No separate Medusa instance needed.

## Theme

- Primary: `#D4A574` (warm caramel/coffee)
- Accent: `#8B4513` (chocolate brown)
- Background: `#FFF8F0` (warm cream)
- Heading font: Playfair Display (elegant serif)
- Body font: Inter (clean sans-serif)

## Usage

```tsx
import { ThemeProvider } from '@g66/storefront-sdk/theme';
import { gourmetFoodTheme } from '@g66/template-gourmet-food/theme';
import { BackendProvider } from '@g66/storefront-sdk/backend';
import { PancakeCustomerAdapter } from '@g66/storefront-sdk/backend/adapters';

const backend = new PancakeCustomerAdapter({
  pancakeBasePath: '/api/pancake',
});

<ThemeProvider theme={gourmetFoodTheme}>
  <BackendProvider backend={backend}>
    <App />
  </BackendProvider>
</ThemeProvider>
```
