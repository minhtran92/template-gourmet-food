'use client';

/**
 * @g66/storefront-sdk — NutritionInfo component
 *
 * F&B-specific nutritional information display.
 * Shows a compact grid of nutrition facts with Vietnamese labels.
 * Collapsible via details/summary HTML elements.
 *
 * @example
 * ```tsx
 * <NutritionInfo
 *   calories={350}
 *   protein={12}
 *   carbs={45}
 *   fat={14}
 *   fiber={3}
 *   servingSize="1 phần (200g)"
 * />
 * ```
 */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface NutritionInfoProps {
  /** Calories in kcal */
  calories?: number;
  /** Protein in grams */
  protein?: number;
  /** Carbohydrates in grams */
  carbs?: number;
  /** Fat in grams */
  fat?: number;
  /** Dietary fiber in grams */
  fiber?: number;
  /** Serving size description */
  servingSize?: string;
  /** Additional CSS class */
  className?: string;
}

interface NutrientRow {
  label: string;
  value?: number;
  unit: string;
  highlight?: boolean;
}

/**
 * NutritionInfo — compact nutritional information display with Vietnamese labels.
 * Wrapped in a collapsible details/summary element for space efficiency.
 */
export function NutritionInfo({
  calories,
  protein,
  carbs,
  fat,
  fiber,
  servingSize,
  className,
}: NutritionInfoProps) {
  const nutrients: NutrientRow[] = [
    { label: 'Năng lượng', value: calories, unit: 'kcal', highlight: true },
    { label: 'Đạm', value: protein, unit: 'g' },
    { label: 'Tinh bột', value: carbs, unit: 'g' },
    { label: 'Béo', value: fat, unit: 'g' },
    { label: 'Chất xơ', value: fiber, unit: 'g' },
  ];

  const hasAnyNutrient = nutrients.some((n) => n.value !== undefined);

  if (!hasAnyNutrient && !servingSize) {
    return null;
  }

  return (
    <details className={className}>
      <summary className="cursor-pointer select-none text-sm font-medium py-2 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
        Thông tin dinh dưỡng
      </summary>

      <Card className="mt-2 py-4!">
        <CardHeader className="px-4! pb-0!">
          <CardTitle className="text-sm">Thông tin dinh dưỡng</CardTitle>
        </CardHeader>

        <CardContent className="px-4! pt-2!">
          {servingSize && (
            <div className="mb-3 text-xs" style={{ color: 'var(--g66-color-muted-foreground, inherit)' }}>
              <span className="font-medium">Khẩu phần:</span> {servingSize}
            </div>
          )}

          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {nutrients.map((nutrient) => {
              if (nutrient.value === undefined) return null;

              return (
                <div
                  key={nutrient.label}
                  className="flex items-baseline justify-between gap-1"
                >
                  <span
                    className="text-xs"
                    style={{
                      color: nutrient.highlight
                        ? 'var(--g66-color-primary, var(--color-primary, inherit))'
                        : 'var(--g66-color-muted-foreground, inherit)',
                    }}
                  >
                    {nutrient.label}
                  </span>
                  <span
                    className={`text-xs tabular-nums ${nutrient.highlight ? 'font-bold' : 'font-medium'}`}
                    style={{
                      color: nutrient.highlight
                        ? 'var(--g66-color-primary, var(--color-primary, inherit))'
                        : 'var(--g66-color-surface-foreground, inherit)',
                    }}
                  >
                    {nutrient.value}
                    <span className="ml-0.5 font-normal" style={{ color: 'var(--g66-color-muted-foreground, inherit)' }}>
                      {nutrient.unit}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </details>
  );
}
