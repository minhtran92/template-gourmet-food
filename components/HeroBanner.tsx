'use client';

/**
 * HeroBanner - A fullscreen hero banner component designed for F&B (Food & Beverage)
 * storefronts such as restaurants, cafes, bakeries, and dining establishments.
 *
 * Features:
 * - Full-viewport hero section with background image and overlay gradient
 * - Playfair Display serif font hint for an elegant, gourmet aesthetic
 * - Responsive height: 60vh on mobile, 80vh on desktop
 * - Dark gradient overlay (black/60 to transparent) ensuring text readability
 * - Centered content layout with a prominent title, subtitle, and CTA button
 * - Call-to-action button with an arrow icon for visual direction
 *
 * @example
 * ```tsx
 * <HeroBanner
 *   title="Artisan Dining"
 *   subtitle="Experience flavors crafted with passion and the finest ingredients"
 *   ctaText="Reserve a Table"
 *   onCtaClick={() => console.log('Navigate to reservations')}
 *   backgroundImage="/images/hero-restaurant.jpg"
 * />
 * ```
 */

import { Button } from '@/components/ui/button';
import { UtensilsCrossed, ArrowRight } from 'lucide-react';

/** Props for the HeroBanner component. */
interface HeroBannerProps {
  /** Primary heading displayed in the hero section. */
  title: string;
  /** Supporting text displayed below the title. */
  subtitle: string;
  /** Label for the call-to-action button. */
  ctaText: string;
  /** Click handler invoked when the CTA button is pressed. */
  onCtaClick: () => void;
  /** Optional background image URL. Rendered as a CSS background-image. */
  backgroundImage?: string;
  /** Additional CSS class names merged onto the root element. */
  className?: string;
}

/**
 * A visually polished hero banner tailored for gourmet food and beverage
 * storefronts. Combines a full-width background image with a dark overlay
 * gradient, centered typography, and a call-to-action button to drive
 * conversions such as table reservations or menu exploration.
 */
function HeroBanner({
  title,
  subtitle,
  ctaText,
  onCtaClick,
  backgroundImage,
  className,
}: HeroBannerProps) {
  return (
    <section
      className={[
        'relative w-full min-h-[60vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label="Hero banner"
    >
      {/* Background image layer */}
      {backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          aria-hidden="true"
        />
      )}

      {/* Gradient overlay for text readability */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 sm:px-8 md:px-12 lg:px-16 max-w-4xl mx-auto gap-6">
        {/* Decorative icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full border border-white/30 bg-white/10">
          <UtensilsCrossed className="w-5 h-5 text-white/90" />
        </div>

        {/* Title */}
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl leading-relaxed">
          {subtitle}
        </p>

        {/* CTA Button */}
        <Button
          size="lg"
          onClick={onCtaClick}
          className="mt-2 bg-white text-neutral-900 hover:bg-white/90 rounded-full px-8 py-6 text-base sm:text-lg font-medium shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 group"
        >
          {ctaText}
          <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </div>
    </section>
  );
}

export { HeroBanner };
export type { HeroBannerProps };
