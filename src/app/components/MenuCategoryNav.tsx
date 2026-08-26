'use client';

import { useState } from 'react';
import { ShoppingBag, UtensilsCrossed, Coffee, Cake } from 'lucide-react';
import type { ThemeConfig } from '../theme';

export interface MenuCategoryNavProps {
  theme: ThemeConfig;
  onCategoryChange?: (categoryId: string) => void;
}

export function MenuCategoryNav({ theme, onCategoryChange }: MenuCategoryNavProps) {
  const [active, setActive] = useState('all');
  const c = theme.colors;

  const categories = [
    { id: 'all', name: 'Tất cả', icon: ShoppingBag },
    { id: 'drinks', name: 'Đồ uống', icon: Coffee },
    { id: 'food', name: 'Món ăn', icon: UtensilsCrossed },
    { id: 'dessert', name: 'Tráng miệng', icon: Cake },
  ];

  function handleClick(id: string) {
    setActive(id);
    onCategoryChange?.(id);
  }

  return (
    <div
      className="sticky top-0 z-10 border-b backdrop-blur-sm"
      style={{ backgroundColor: `${c.surface}F0`, borderColor: c.border }}
    >
      <div className="max-w-4xl mx-auto px-4 py-2 flex gap-1 overflow-x-auto">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = active === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleClick(cat.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors"
              style={{
                backgroundColor: isActive ? c.primary : 'transparent',
                color: isActive ? c.primaryForeground : c.mutedForeground,
              }}
            >
              <Icon className="h-4 w-4" />
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
