/**
 * @g66/storefront-sdk — gourmet-food SearchPage
 *
 * Phase 4 §4.4: 🟡 SHARED page — Search composition for F&B storefronts.
 * Wraps SearchPage pre-built with F&B-specific filter presets:
 * - Menu category filters (Món chính, Thức uống, Tráng miệng...)
 * - Dietary filters (Chay, Không gluten, Không đường...)
 * - Vietnamese sort labels
 * - F&B-specific empty state and placeholder text
 *
 * @example
 * ```tsx
 * <SearchPage
 *   fetcher={async (q, filters, sort, page) => { ... }}
 *   onProductClick={(id, slug) => router.push(`/product/${slug}`)}
 * />
 * ```
 */
'use client';

import React, { useState } from 'react';
import { Search, UtensilsCrossed, LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from '@/components/ui/pagination';
import { useSearch } from '../../../hooks/use-search';
import { SearchInput } from '../../../primitives/search/SearchInput';
import { FilterChip } from '../../../primitives/search/FilterChip';
import { SearchResultItem } from '../../../primitives/search/SearchResultItem';
import type { SearchFilter, SortOption, SearchResults } from '../../../types/search';

// ─── Props ──────────────────────────────────────────────

export interface SearchPageProps {
  /** Fetcher function for search */
  fetcher: (query: string, filters: SearchFilter[], sort: SortOption, page: number) => Promise<SearchResults>;
  /** Debounce delay in ms */
  debounceMs?: number;
  /** Called when a product is clicked */
  onProductClick?: (productId: string, slug: string) => void;
  /** Additional menu category filters (merged with defaults) */
  categoryFilters?: SearchFilter[];
  /** Show dietary filter presets */
  showDietaryFilters?: boolean;
  /** Labels (Vietnamese defaults) */
  labels?: {
    title?: string;
    placeholder?: string;
    categories?: string;
    dietary?: string;
    sortBy?: string;
    results?: string;
    noResults?: string;
    clearFilters?: string;
    startSearch?: string;
  };
  /** Additional CSS class */
  className?: string;
}

const DEFAULT_LABELS = {
  title: 'Tìm kiếm',
  placeholder: 'Tìm món ăn, thức uống...',
  categories: 'Danh mục',
  dietary: 'Chế độ ăn',
  sortBy: 'Sắp xếp',
  results: 'kết quả',
  noResults: 'Không tìm thấy kết quả. Thử tìm kiếm khác.',
  clearFilters: 'Xóa bộ lọc',
  startSearch: 'Gõ để tìm kiếm món ăn hoặc thức uống',
};

/** F&B default category filters */
const DEFAULT_CATEGORY_FILTERS: SearchFilter[] = [
  { key: 'category', value: 'mains', label: 'Món chính' },
  { key: 'category', value: 'drinks', label: 'Thức uống' },
  { key: 'category', value: 'desserts', label: 'Tráng miệng' },
  { key: 'category', value: 'appetizers', label: 'Khai vị' },
  { key: 'category', value: 'seafood', label: 'Hải sản' },
  { key: 'category', value: 'grill', label: 'Nướng/BBQ' },
  { key: 'category', value: 'soup', label: 'Sup/Súp' },
  { key: 'category', value: 'salad', label: 'Salad' },
];

/** Dietary filter presets */
const DIETARY_FILTERS: SearchFilter[] = [
  { key: 'dietary', value: 'vegetarian', label: 'Chay' },
  { key: 'dietary', value: 'vegan', label: 'Thuần chay' },
  { key: 'dietary', value: 'gluten-free', label: 'Không gluten' },
  { key: 'dietary', value: 'sugar-free', label: 'Không đường' },
  { key: 'dietary', value: 'dairy-free', label: 'Không sữa' },
  { key: 'dietary', value: 'nut-free', label: 'Không hạt' },
];

/** Vietnamese sort options */
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevance', label: 'Liên quan' },
  { value: 'price-asc', label: 'Giá tăng dần' },
  { value: 'price-desc', label: 'Giá giảm dần' },
  { value: 'newest', label: 'Mới nhất' },
  { value: 'popular', label: 'Phổ biến nhất' },
];

// ─── Component ──────────────────────────────────────────

/**
 * SearchPage — F&B search page with category/dietary filter presets.
 *
 * Layout:
 *   1. Search bar with F&B placeholder
 *   2. Category filter preset chips (Món chính, Thức uống, Tráng miệng...)
 *   3. Dietary filter preset chips (Chay, Không gluten, Không đường...)
 *   4. Active filters + sort + view toggle
 *   5. Results grid/list
 *   6. Pagination
 */
export function SearchPage({
  fetcher,
  debounceMs,
  onProductClick,
  categoryFilters: customCategories,
  showDietaryFilters = true,
  labels,
  className,
}: SearchPageProps) {
  const lbl = { ...DEFAULT_LABELS, ...labels };
  const categoryFilters = customCategories ?? DEFAULT_CATEGORY_FILTERS;

  const {
    query,
    filters,
    sort,
    results,
    isSearching,
    page,
    setQuery,
    addFilter,
    removeFilter,
    clearFilters,
    setSort,
    setPage,
  } = useSearch({ fetcher, debounceMs });

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  /** Check if a category/dietary filter is active */
  const isFilterActive = (key: string, value: string) =>
    filters.some((f) => f.key === key && f.value === value);

  /** Toggle a filter preset chip */
  const toggleFilter = (filter: SearchFilter) => {
    if (isFilterActive(filter.key, filter.value)) {
      removeFilter(filter.key, filter.value);
    } else {
      addFilter(filter);
    }
  };

  return (
    <div className={`px-4 md:px-8 py-8 max-w-7xl mx-auto ${className ?? ''}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Search className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-serif font-bold">{lbl.title}</h1>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <SearchInput
          value={query}
          onChange={setQuery}
          isSearching={isSearching}
          onClear={() => {
            setQuery('');
            clearFilters();
          }}
        />
      </div>

      {/* Category filter presets */}
      <div className="mb-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          {lbl.categories}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {categoryFilters.map((filter) => (
            <Button
              key={`${filter.key}-${filter.value}`}
              variant={isFilterActive(filter.key, filter.value) ? 'default' : 'outline'}
              size="sm"
              className="h-7 text-xs rounded-full"
              onClick={() => toggleFilter(filter)}
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Dietary filter presets */}
      {showDietaryFilters && (
        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            {lbl.dietary}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {DIETARY_FILTERS.map((filter) => (
              <Badge
                key={`${filter.key}-${filter.value}`}
                variant={isFilterActive(filter.key, filter.value) ? 'default' : 'outline'}
                className="cursor-pointer select-none"
                onClick={() => toggleFilter(filter)}
              >
                {filter.label}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Active filter chips + sort */}
      {(filters.length > 0 || (results && results.total > 0)) && (
        <>
          <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
            {/* Active filter chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {filters.map((filter) => (
                <FilterChip
                  key={`${filter.key}-${filter.value}`}
                  label={`${filter.key === 'category' ? '' : filter.key === 'dietary' ? '' : filter.key + ': '}${filter.label}`}
                  onRemove={() => removeFilter(filter.key, filter.value)}
                />
              ))}
              {filters.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground h-7"
                  aria-label={lbl.clearFilters}
                >
                  {lbl.clearFilters}
                </Button>
              )}
            </div>

            {/* Sort dropdown + View toggle */}
            <div className="flex items-center gap-2">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="text-sm border border-input rounded-md px-2 py-1 bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                aria-label={lbl.sortBy}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Grid/List toggle */}
              <div className="flex border border-input rounded-md overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  className="h-8 w-8 rounded-none"
                  onClick={() => setViewMode('grid')}
                  aria-label="Dạng lưới"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  className="h-8 w-8 rounded-none"
                  onClick={() => setViewMode('list')}
                  aria-label="Dạng danh sách"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <Separator className="mb-4" />
        </>
      )}

      {/* Results */}
      {results && (
        <>
          <p className="text-sm text-muted-foreground mb-3">
            {results.total.toLocaleString('vi-VN')} {lbl.results}
          </p>

          {/* Grid layout */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {results.items.map((product) => (
                <SearchResultItem
                  key={product.id}
                  product={product}
                  onClick={(p) => onProductClick?.(p.id, p.slug)}
                />
              ))}
            </div>
          ) : (
            /* List layout */
            <div className="space-y-2">
              {results.items.map((product) => (
                <SearchResultItem
                  key={product.id}
                  product={product}
                  onClick={(p) => onProductClick?.(p.id, p.slug)}
                />
              ))}
            </div>
          )}

          {results.items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {lbl.noResults}
            </div>
          )}

          {/* Pagination */}
          {results.totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  {page > 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setPage(page - 1)}
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                  )}
                  {Array.from({ length: results.totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === results.totalPages || Math.abs(p - page) <= 1)
                    .map((p) => (
                      <PaginationItem key={p}>
                        <PaginationLink
                          onClick={() => setPage(p)}
                          isActive={p === page}
                          className="cursor-pointer"
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                  {page < results.totalPages && (
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setPage(page + 1)}
                        className="cursor-pointer"
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}

      {/* Initial empty state */}
      {!results && !isSearching && !query && (
        <div className="text-center py-12">
          <UtensilsCrossed className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">{lbl.startSearch}</p>
        </div>
      )}
    </div>
  );
}
