/**
 * @g66/storefront-sdk — gourmet-food HomePage
 *
 * Phase 4 §4.4: Template-specific homepage for F&B storefronts.
 * Composes: HeroBanner + MenuGrid + FeaturedProducts (from SDK primitives).
 *
 * This is a 🔴 TEMPLATE-SPECIFIC page — not a shared pre-built component.
 * Each template defines its own homepage layout.
 *
 * @example
 * ```tsx
 * <HomePage
 *   hero={{ title: 'Cà phê Trung Nguyên', subtitle: 'Hương vị từ đất đỏ...' }}
 *   categories={menuCategories}
 *   featuredProducts={topProducts}
 *   onCategorySelect={(cat) => router.push(`/menu/${cat.id}`)}
 *   onProductClick={(id) => router.push(`/product/${id}`)}
 * />
 * ```
 */
'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroBanner } from '../components/HeroBanner';
import { MenuGrid, type MenuCategory } from '../components/MenuGrid';
import { ProductImage } from '../../../primitives/shared/ProductImage';
import { PriceDisplay } from '../../../primitives/shared/PriceDisplay';
import type { SearchResultProduct } from '../../../types/search';

// ─── Props ──────────────────────────────────────────────

export interface HeroContent {
  /** Main hero title */
  title: string;
  /** Hero subtitle/tagline */
  subtitle: string;
  /** CTA button text */
  ctaText?: string;
  /** Background image URL */
  backgroundImage?: string;
}

export interface HomePageProps {
  /** Hero banner content */
  hero: HeroContent;
  /** Menu categories for grid */
  categories: MenuCategory[];
  /** Featured products (optional — falls back to useProducts hook) */
  featuredProducts?: SearchResultProduct[];
  /** Called when hero CTA is clicked */
  onHeroCta?: () => void;
  /** Called when a category is selected */
  onCategorySelect: (category: MenuCategory) => void;
  /** Called when a product is clicked */
  onProductClick?: (productId: string) => void;
  /** Section titles (Vietnamese defaults) */
  sectionTitles?: {
    menu?: string;
    featured?: string;
    viewAll?: string;
  };
  /** Additional CSS class */
  className?: string;
}

const DEFAULT_TITLES = {
  menu: 'Thực đơn',
  featured: 'Món nổi bật',
  viewAll: 'Xem tất cả',
};

// ─── Component ──────────────────────────────────────────

/**
 * HomePage — F&B storefront homepage with hero + menu grid + featured products.
 *
 * Layout:
 *   1. HeroBanner (full-width, full-height)
 *   2. MenuGrid (category browsing)
 *   3. Featured Products (product cards grid)
 */
export function HomePage({
  hero,
  categories,
  featuredProducts,
  onHeroCta,
  onCategorySelect,
  onProductClick,
  sectionTitles,
  className,
}: HomePageProps) {
  const titles = { ...DEFAULT_TITLES, ...sectionTitles };

  // If no featured products provided, we could use useProducts hook
  // For now, use the provided array or empty
  const products = featuredProducts ?? [];

  return (
    <div className={className}>
      {/* ── Hero ──────────────────────────────────────── */}
      <HeroBanner
        title={hero.title}
        subtitle={hero.subtitle}
        ctaText={hero.ctaText ?? titles.viewAll}
        onCtaClick={onHeroCta ?? (() => {})}
        backgroundImage={hero.backgroundImage}
      />

      {/* ── Menu Categories ───────────────────────────── */}
      <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-serif font-bold">{titles.menu}</h2>
        </div>
        <MenuGrid
          categories={categories}
          onCategorySelect={onCategorySelect}
        />
      </section>

      {/* ── Featured Products ─────────────────────────── */}
      {products.length > 0 && (
        <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold">{titles.featured}</h2>
            {onProductClick && (
              <Button variant="ghost" className="gap-1">
                {titles.viewAll}
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <article
                key={product.id}
                className="group cursor-pointer rounded-lg border bg-card p-0 overflow-hidden transition-shadow hover:shadow-lg"
                onClick={() => onProductClick?.(product.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onProductClick?.(product.id);
                }}
                role="button"
                tabIndex={0}
                aria-label={`View ${product.name}`}
              >
                <ProductImage
                  src={product.image ?? ''}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-medium text-card-foreground group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <PriceDisplay
                    price={product.price}
                    originalPrice={product.originalPrice}
                    className="mt-1"
                  />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
