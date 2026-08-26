/**
 * @g66/storefront-sdk — gourmet-food ProductDetailPage
 *
 * Phase 4 §4.4: Template-specific product detail for F&B storefronts.
 * Shows: image gallery + product info + NutritionInfo + AllergenWarning + add-to-cart.
 *
 * This is a 🔴 TEMPLATE-SPECIFIC page — F&B products have nutrition/allergen data
 * that other templates (fashion, electronics) don't need.
 *
 * @example
 * ```tsx
 * <ProductDetailPage
 *   product={product}
 *   nutrition={{ calories: 350, protein: 12, carbs: 45, fat: 14 }}
 *   allergens={['Sữa', 'Lúa mì']}
 *   onAddToCart={(id, qty) => cart.addItem({ ... })}
 * />
 * ```
 */
'use client';

import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PriceDisplay } from '../../../primitives/shared/PriceDisplay';
import { ProductImage } from '../../../primitives/shared/ProductImage';
import { Breadcrumb } from '../../../primitives/shared/Breadcrumb';
import { NutritionInfo } from '../components/NutritionInfo';
import { AllergenWarning } from '../components/AllergenWarning';

// ─── Props ──────────────────────────────────────────────

export interface NutritionData {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  servingSize?: string;
}

export interface ProductDetailData {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description?: string;
  images?: string[];
  category?: string;
  inStock?: boolean;
}

export interface ProductDetailPageProps {
  /** Product data */
  product: ProductDetailData;
  /** Nutrition information (optional — only for F&B) */
  nutrition?: NutritionData;
  /** Allergen warnings */
  allergens?: string[];
  /** Breadcrumb items */
  breadcrumbs?: Array<{ label: string; href?: string }>;
  /** Called when user adds to cart */
  onAddToCart: (productId: string, quantity: number) => void;
  /** Related products for cross-sell */
  relatedProducts?: Array<{
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image?: string;
  }>;
  /** Called when a related product is clicked */
  onRelatedProductClick?: (productId: string) => void;
  /** Section titles (Vietnamese defaults) */
  labels?: {
    addToCart?: string;
    outOfStock?: string;
    quantity?: string;
    description?: string;
    related?: string;
  };
  /** Additional CSS class */
  className?: string;
}

const DEFAULT_LABELS = {
  addToCart: 'Thêm vào giỏ',
  outOfStock: 'Tạm hết hàng',
  quantity: 'Số lượng',
  description: 'Mô tả',
  related: 'Món liên quan',
};

// ─── Component ──────────────────────────────────────────

/**
 * ProductDetailPage — F&B product detail with nutrition + allergen info.
 *
 * Layout (desktop):
 *   Left: Image gallery (with prev/next navigation)
 *   Right: Product info + quantity selector + add-to-cart + nutrition + allergens
 *   Bottom: Related products carousel
 */
export function ProductDetailPage({
  product,
  nutrition,
  allergens = [],
  breadcrumbs,
  onAddToCart,
  relatedProducts = [],
  onRelatedProductClick,
  labels,
  className,
}: ProductDetailPageProps) {
  const lbl = { ...DEFAULT_LABELS, ...labels };
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = product.images?.length ? product.images : [product.images?.[0] ?? ''];
  const canAddToCart = product.inStock !== false;

  return (
    <div className={className}>
      {/* ── Breadcrumb ───────────────────────────────── */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="px-4 md:px-8 pt-4 max-w-7xl mx-auto">
          <Breadcrumb items={breadcrumbs.map((b) => ({ label: b.label, href: b.href }))} />
        </div>
      )}

      {/* ── Main content ─────────────────────────────── */}
      <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Image gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              <ProductImage
                src={images[activeImageIndex] ?? ''}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white"
                    onClick={() => setActiveImageIndex((i) => (i - 1 + images.length) % images.length)}
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white"
                    onClick={() => setActiveImageIndex((i) => (i + 1) % images.length)}
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
            {/* Thumbnail strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden transition-colors ${
                      i === activeImageIndex ? 'border-primary' : 'border-transparent'
                    }`}
                    aria-label={`View image ${i + 1}`}
                  >
                    <ProductImage src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product info */}
          <div className="space-y-4">
            <h1 className="text-2xl md:text-3xl font-serif font-bold">{product.name}</h1>

            <PriceDisplay
              price={product.price}
              originalPrice={product.originalPrice}
              size="lg"
            />

            {/* Stock status */}
            {!canAddToCart && (
              <p className="text-sm text-destructive font-medium">{lbl.outOfStock}</p>
            )}

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {lbl.description}
                </h3>
                <p className="text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            <Separator />

            {/* Quantity selector + Add to cart */}
            {canAddToCart && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{lbl.quantity}</span>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="w-full gap-2"
                  onClick={() => onAddToCart(product.id, quantity)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {lbl.addToCart}
                </Button>
              </div>
            )}

            <Separator />

            {/* Nutrition info (F&B specific) */}
            {nutrition && (
              <NutritionInfo
                calories={nutrition.calories}
                protein={nutrition.protein}
                carbs={nutrition.carbs}
                fat={nutrition.fat}
                fiber={nutrition.fiber}
                servingSize={nutrition.servingSize}
              />
            )}

            {/* Allergen warning (F&B specific) */}
            <AllergenWarning allergens={allergens} />
          </div>
        </div>
      </div>

      {/* ── Related products ─────────────────────────── */}
      {relatedProducts.length > 0 && (
        <section className="px-4 md:px-8 py-8 max-w-7xl mx-auto">
          <h2 className="text-xl font-serif font-bold mb-4">{lbl.related}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((rp) => (
              <article
                key={rp.id}
                className="group cursor-pointer rounded-lg border bg-card overflow-hidden transition-shadow hover:shadow-md"
                onClick={() => onRelatedProductClick?.(rp.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onRelatedProductClick?.(rp.id);
                }}
                role="button"
                tabIndex={0}
                aria-label={`View ${rp.name}`}
              >
                <ProductImage
                  src={rp.image ?? ''}
                  alt={rp.name}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <h3 className="text-sm font-medium truncate">{rp.name}</h3>
                  <PriceDisplay price={rp.price} originalPrice={rp.originalPrice} className="mt-1" />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
