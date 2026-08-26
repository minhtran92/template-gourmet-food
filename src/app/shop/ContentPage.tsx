'use client';

/**
 * gourmet-food ContentPage — renders DB content (privacy, terms, about, FAQ).
 * Layout: tiêu đề + nội dung HTML (sanitized).
 */

import { gourmetFoodTheme } from '../theme';
import type { ThemeConfig } from '../theme';

export interface ContentPageProps {
  tenant: { slug: string; name: string; isConfigured: boolean };
  title: string;
  body: string;
  metaTitle?: string;
  metaDescription?: string;
  theme?: ThemeConfig;
}

export function GourmetFoodContentPage({ tenant, title, body, theme = gourmetFoodTheme }: ContentPageProps) {
  const colors = theme.colors;

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6" style={{ color: colors.accent }}>{title}</h1>
        <div
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      </div>
    </div>
  );
}
