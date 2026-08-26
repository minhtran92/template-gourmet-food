'use client';

/**
 * gourmet-food HomePage — F&B storefront layout.
 * 
 * Đã tách components: HeroBanner + MenuCategoryNav + StorefrontHeader + DishGrid.
 * HomePage chỉ assemble — không có logic UI trực tiếp.
 *
 * Custom header: truyền authSlot vào StorefrontHeader.
 */

import { useRouter } from 'next/navigation';
import { gourmetFoodTheme } from '../theme';
import type { ThemeConfig } from '../theme';
import { HeroBanner } from '../components/HeroBanner';
import { MenuCategoryNav } from '../components/MenuCategoryNav';
import { DishGrid } from '../components/DishGrid';
import { StorefrontHeader } from '../components/StorefrontHeader';

export interface HomePageProps {
  tenant: {
    slug: string;
    name: string;
    isConfigured: boolean;
  };
  theme?: ThemeConfig;
  /** Main app inject login/logout component vào đây */
  authSlot?: React.ReactNode;
}

export function GourmetFoodHomePage({ tenant, theme = gourmetFoodTheme, authSlot }: HomePageProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.colors.background }}>
      <HeroBanner name={tenant.name} isConfigured={tenant.isConfigured} theme={theme} />
      <StorefrontHeader
        tenantName={tenant.name}
        tenantSlug={tenant.slug}
        isConfigured={tenant.isConfigured}
        theme={theme}
        authSlot={authSlot}
      />
      <MenuCategoryNav theme={theme} />
      <DishGrid
        tenantSlug={tenant.slug}
        isConfigured={tenant.isConfigured}
        theme={theme}
        onProductClick={(id) => router.push(`/shop/${tenant.slug}/products/${id}`)}
      />
    </div>
  );
}
