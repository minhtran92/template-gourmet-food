'use client';

/**
 * @g66/storefront-sdk — AllergenWarning component
 *
 * F&B-specific allergen warning labels display.
 * Shows colored badges for each allergen with Vietnamese labels.
 * Displays a green safe badge when no allergens are present.
 *
 * @example
 * ```tsx
 * <AllergenWarning allergens={['Sữa', 'Trứng', 'Lúa mì']} />
 * <AllergenWarning allergens={[]} />
 * ```
 */
import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export interface AllergenWarningProps {
  /** List of allergen names */
  allergens: string[];
  /** Additional CSS class */
  className?: string;
}

/** Map of known allergen names to their badge color classes */
const ALLERGEN_COLORS: Record<string, string> = {
  'Đậu phộng': 'bg-amber-100 text-amber-800',
  'Sữa': 'bg-amber-100 text-amber-800',
  'Trứng': 'bg-amber-100 text-amber-800',
  'Lúa mì': 'bg-amber-100 text-amber-800',
  'Đậu nành': 'bg-amber-100 text-amber-800',
  'Hải sản': 'bg-amber-100 text-amber-800',
  'Cá': 'bg-amber-100 text-amber-800',
  'Quế': 'bg-amber-100 text-amber-800',
  'Mè': 'bg-amber-100 text-amber-800',
};

const DEFAULT_BADGE_CLASS = 'bg-amber-100 text-amber-800';

/**
 * AllergenWarning — displays allergen badges with a warning header.
 * Shows a green safe badge when no allergens are present.
 */
export function AllergenWarning({ allergens, className }: AllergenWarningProps) {
  if (allergens.length === 0) {
    return (
      <div className={className}>
        <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
          <ShieldCheck className="h-3.5 w-3.5" />
          Không chứa chất dị ứng phổ biến
        </span>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-1.5 mb-2">
        <AlertTriangle
          className="h-4 w-4"
          style={{ color: 'var(--g66-color-destructive, var(--color-destructive, inherit))' }}
        />
        <span
          className="text-sm font-medium"
          style={{ color: 'var(--g66-color-destructive, var(--color-destructive, inherit))' }}
        >
          Cảnh báo dị ứng
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {allergens.map((allergen) => (
          <span
            key={allergen}
            className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${ALLERGEN_COLORS[allergen] ?? DEFAULT_BADGE_CLASS}`}
          >
            {allergen}
          </span>
        ))}
      </div>
    </div>
  );
}
