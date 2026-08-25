'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Coffee,
  UtensilsCrossed,
  Cake,
  Wine,
  Apple,
  Fish,
  Flame,
  Soup,
  Sandwich,
  Pizza,
  IceCreamCone,
  CupSoda,
  type LucideIcon,
} from 'lucide-react';

/**
 * Represents a single menu category in the restaurant menu grid.
 *
 * @property id       - Unique identifier for the category
 * @property name     - Display name of the category
 * @property icon     - Optional icon key used to resolve a Lucide icon
 * @property itemCount - Optional count of items in this category
 * @property image    - Optional image URL for the category
 */
export interface MenuCategory {
  id: string;
  name: string;
  icon?: string;
  itemCount?: number;
  image?: string;
}

/**
 * Props for the {@link MenuGrid} component.
 *
 * @property categories      - Array of menu categories to display
 * @property onCategorySelect - Callback fired when a category card is clicked
 * @property className        - Optional additional CSS class names for the grid container
 */
interface MenuGridProps {
  categories: MenuCategory[];
  onCategorySelect: (category: MenuCategory) => void;
  className?: string;
}

/** Mapping of icon key strings to their corresponding Lucide icon components. */
const ICON_MAP: Record<string, LucideIcon> = {
  drinks: Coffee,
  coffee: Coffee,
  beverage: CupSoda,
  tea: CupSoda,
  food: UtensilsCrossed,
  main: UtensilsCrossed,
  mains: UtensilsCrossed,
  rice: UtensilsCrossed,
  noodles: UtensilsCrossed,
  desserts: Cake,
  dessert: Cake,
  cake: Cake,
  pastry: Cake,
  sweets: IceCreamCone,
  icecream: IceCreamCone,
  wine: Wine,
  alcohol: Wine,
  beer: Wine,
  seafood: Fish,
  fish: Fish,
  fruit: Apple,
  fruits: Apple,
  grill: Flame,
  grilled: Flame,
  bbq: Flame,
  soup: Soup,
  soups: Soup,
  appetizer: Sandwich,
  starters: Sandwich,
  pizza: Pizza,
};

/**
 * Resolves an icon key to a Lucide icon component.
 *
 * Falls back to {@link UtensilsCrossed} when the key is not recognised or not
 * provided, ensuring every category card always displays an icon.
 *
 * @param iconKey - The icon key string from the category data
 * @returns The resolved Lucide icon component
 */
function resolveIcon(iconKey?: string): LucideIcon {
  if (!iconKey) return UtensilsCrossed;
  return ICON_MAP[iconKey.toLowerCase()] ?? UtensilsCrossed;
}

/**
 * MenuGrid -- A restaurant-style category browsing grid.
 *
 * Renders a responsive grid of category cards, each showing an icon (or a
 * fallback), the category name, an optional item-count badge, and an optional
 * background image. Clicking a card invokes the {@link MenuGridProps.onCategorySelect}
 * callback with the selected category.
 *
 * **Layout**
 * - 2 columns on mobile (`grid-cols-2`)
 * - 3 columns on medium screens (`md:grid-cols-3`)
 * - 4 columns on large screens (`lg:grid-cols-4`)
 *
 * **Icon resolution**
 * The component ships with a built-in Vietnamese-friendly icon mapping so
 * common keys like `drinks`, `food`, and `desserts` automatically resolve to
 * the most appropriate icon. Any unrecognised key falls back to
 * `UtensilsCrossed`.
 *
 * @example
 * ```tsx
 * <MenuGrid
 *   categories={[
 *     { id: '1', name: 'Thuc uong', icon: 'drinks', itemCount: 12 },
 *     { id: '2', name: 'Mon chinh', icon: 'food', itemCount: 18 },
 *     { id: '3', name: 'Trang mieng', icon: 'desserts', itemCount: 8 },
 *   ]}
 *   onCategorySelect={(cat) => router.push(`/menu/${cat.id}`)}
 * />
 * ```
 */
function MenuGrid({ categories, onCategorySelect, className }: MenuGridProps) {
  return (
    <div
      className={`grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 ${className ?? ''}`}
    >
      {categories.map((category) => {
        const Icon = resolveIcon(category.icon);

        return (
          <Card
            key={category.id}
            className="group cursor-pointer overflow-hidden transition-transform hover:scale-[1.02]"
            onClick={() => onCategorySelect(category)}
          >
            {category.image && (
              <div className="relative h-28 w-full overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            )}

            <CardContent className="flex flex-col items-center gap-2 p-4">
              <Icon className="h-8 w-8 text-primary" />
              <span className="text-center text-sm font-medium leading-tight">
                {category.name}
              </span>
              {category.itemCount !== undefined && (
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {category.itemCount} items
                </span>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export { MenuGrid };
