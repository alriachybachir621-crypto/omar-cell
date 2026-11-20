import React, { useMemo } from 'react';
import { Heart, Search, ShoppingBag, SlidersHorizontal } from 'lucide-react';
import { Category, Language, Product } from '../types';
import { translations } from '../i18n';
import { DeviceVisual } from './DeviceVisual';

interface ProductCatalogProps {
  lang: Language;
  products: Product[];
  categories: Category[];
  wishlistIds: string[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onCategoryChange: (c: string) => void;
  selectedBrand: string;
  onBrandChange: (b: string) => void;
  selectedStorage: string;
  onStorageChange: (s: string) => void;
  selectedCondition: string;
  onConditionChange: (c: string) => void;
  maxPrice: number | null;
  onMaxPriceChange: (p: number | null) => void;
  onResetFilters: () => void;
  onToggleWishlist: (productId: string) => void;
  onOpenProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  lang,
  products,
  categories,
  wishlistIds,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedBrand,
  onBrandChange,
  selectedStorage,
  onStorageChange,
  selectedCondition,
  onConditionChange,
  maxPrice,
  onMaxPriceChange,
  onResetFilters,
  onToggleWishlist,
  onOpenProduct,
  onQuickAddToCart,
}) => {
  const t = translations[lang];

  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand).filter(Boolean));
    return Array.from(set).sort();
  }, [products]);

  const storages = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      (p.storageOptions || []).forEach((s) => set.add(s));
    });
    return Array.from(set);
  }, [products]);

  const priceCaps = [100, 400, 800, 1200, 1800];

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
        return false;
      }
      if (
        selectedStorage !== 'all' &&
        !(p.storageOptions || []).includes(selectedStorage)
      ) {
        return false;
      }
      if (selectedCondition !== 'all' && p.condition !== selectedCondition) {
        return false;
      }
      if (maxPrice !== null && p.price > maxPrice) {
        return false;
      }
      if (q) {
        const hay = `${p.name} ${p.nameAr || ''} ${p.brand} ${p.description || ''} ${p.descriptionAr || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedBrand,
    selectedStorage,
    selectedCondition,
    maxPrice,
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    selectedStorage !== 'all' ||
    selectedCondition !== 'all' ||
    maxPrice !== null;

  return (
    <section
      id="catalog"
      className="py-16 sm:py-20 border-b border-[#C9A13B]/15 bg-[#0A0A0A]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#C9A13B] font-medium">
              {t.catalog.kicker}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F1E8] mt-1.5">
              {t.catalog.title}
            </h2>
          </div>
          <p className="text-xs text-[#F5F1E8]/60 tabular-nums">
            {filteredProducts.length} {t.catalog.resultsCount}
          </p>
        </div>

        {/* Search & Filters Panel */}
        <div className="bg-[#141414] border border-[#C9A13B]/20 p-4 sm:p-5 mb-10 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#C9A13B] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t.catalog.searchPlaceholder}
                className="w-full h-11 bg-[#0A0A0A] border border-[#C9A13B]/25 ps-10 pe-4 text-sm text-[#F5F1E8] placeholder:text-[#F5F1E8]/40 focus:outline-none focus:border-[#C9A13B]"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <button
                type="button"
                onClick={() => onCategoryChange('all')}
                className={`h-11 px-4 text-xs font-medium whitespace-nowrap shrink-0 border transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#C9A13B] text-[#0A0A0A] border-[#C9A13B] font-semibold'
                    : 'bg-[#0A0A0A] text-[#F5F1E8]/75 border-[#C9A13B]/20 hover:border-[#C9A13B]/60'
                }`}
              >
                {t.catalog.allCategories}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onCategoryChange(cat.slug)}
                  className={`h-11 px-4 text-xs font-medium whitespace-nowrap shrink-0 border transition-colors ${
                    selectedCategory === cat.slug
                      ? 'bg-[#C9A13B] text-[#0A0A0A] border-[#C9A13B] font-semibold'
                      : 'bg-[#0A0A0A] text-[#F5F1E8]/75 border-[#C9A13B]/20 hover:border-[#C9A13B]/60'
                  }`}
                >
                  {lang === 'ar' && cat.nameAr ? cat.nameAr : cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary Select Filters */}
          <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-[#C9A13B]/10">
            <div className="flex items-center gap-1.5 text-xs text-[#C9A13B]">
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </div>

            <select
              value={selectedBrand}
              onChange={(e) => onBrandChange(e.target.value)}
              aria-label={t.catalog.allBrands}
              className="h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-xs text-[#F5F1E8] focus:outline-none focus:border-[#C9A13B]"
            >
              <option value="all">{t.catalog.allBrands}</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <select
              value={selectedStorage}
              onChange={(e) => onStorageChange(e.target.value)}
              aria-label={t.catalog.allStorage}
              className="h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-xs text-[#F5F1E8] focus:outline-none focus:border-[#C9A13B]"
            >
              <option value="all">{t.catalog.allStorage}</option>
              {storages.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={selectedCondition}
              onChange={(e) => onConditionChange(e.target.value)}
              aria-label={t.catalog.allConditions}
              className="h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-xs text-[#F5F1E8] focus:outline-none focus:border-[#C9A13B]"
            >
              <option value="all">{t.catalog.allConditions}</option>
              <option value="New">{t.catalog.badgeNew}</option>
              <option value="Used">{t.catalog.badgeUsed}</option>
            </select>

            <select
              value={maxPrice === null ? 'any' : String(maxPrice)}
              onChange={(e) =>
                onMaxPriceChange(
                  e.target.value === 'any' ? null : Number(e.target.value)
                )
              }
              aria-label={t.catalog.maxPrice}
              className="h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-xs text-[#F5F1E8] focus:outline-none focus:border-[#C9A13B]"
            >
              <option value="any">{t.catalog.anyPrice}</option>
              {priceCaps.map((cap) => (
                <option key={cap} value={cap}>
                  ≤ ${cap.toLocaleString()}
                </option>
              ))}
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="h-10 px-3.5 text-xs text-[#E8D08A] border border-[#C9A13B]/35 hover:bg-[#C9A13B] hover:text-[#0A0A0A] transition-colors ms-auto"
              >
                {t.catalog.resetFilters}
              </button>
            )}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-[#1A1A1A] border border-[#C9A13B]/20 p-12 text-center">
            <p className="font-display text-2xl text-[#E8D08A]">
              {t.catalog.noResults}
            </p>
            <p className="text-sm text-[#F5F1E8]/60 mt-2 mb-6">
              {t.catalog.noResultsHint}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="px-6 py-2.5 bg-[#C9A13B] text-[#0A0A0A] text-xs font-semibold tracking-wider uppercase hover:bg-[#E8D08A] transition-colors"
              >
                {t.catalog.resetFilters}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const title =
                lang === 'ar' && product.nameAr ? product.nameAr : product.name;
              const isWishlisted = wishlistIds.includes(product.id);
              const primaryImage = product.images[0] || 'studio://default';
              const badgeLabel = product.isSale
                ? t.catalog.badgeSale
                : product.isNew
                  ? t.catalog.badgeNew
                  : product.condition === 'Used'
                    ? t.catalog.badgeUsed
                    : null;
              const condLabel =
                product.condition === 'New'
                  ? t.catalog.badgeNew
                  : t.catalog.badgeUsed;

              return (
                <article
                  key={product.id}
                  className="group bg-[#1A1A1A] border border-[#C9A13B]/20 flex flex-col gold-glow-hover hover:-translate-y-0.5"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#101010] border-b border-[#C9A13B]/15">
                    <button
                      type="button"
                      onClick={() => onOpenProduct(product)}
                      className="w-full h-full block text-start focus:outline-none"
                    >
                      <DeviceVisual
                        src={primaryImage}
                        alt={title}
                        className="transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    </button>

                    {/* Top-start restrained marker */}
                    {badgeLabel && (
                      <span className="pointer-events-none absolute top-3 start-3 px-2.5 py-1 bg-[#0A0A0A]/90 border border-[#C9A13B]/50 text-[#E8D08A] text-[11px] font-medium tracking-wider uppercase">
                        {badgeLabel}
                      </span>
                    )}

                    {/* Top-end wishlist heart */}
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(product.id)}
                      aria-label={
                        isWishlisted ? t.modal.savedWishlist : t.modal.saveWishlist
                      }
                      className={`absolute top-3 end-3 w-9 h-9 flex items-center justify-center border transition-colors ${
                        isWishlisted
                          ? 'bg-[#C9A13B] border-[#C9A13B] text-[#0A0A0A]'
                          : 'bg-[#0A0A0A]/85 border-[#C9A13B]/35 text-[#F5F1E8]/80 hover:text-[#E8D08A] hover:border-[#C9A13B]'
                      }`}
                    >
                      <Heart
                        className="w-4 h-4"
                        fill={isWishlisted ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 text-xs text-[#F5F1E8]/55">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="uppercase tracking-wider">{product.brand}</span>
                          <span aria-hidden="true">·</span>
                          <span>{condLabel}</span>
                          {product.storageOptions && product.storageOptions[0] && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>{product.storageOptions[0]}</span>
                            </>
                          )}
                        </div>
                        <span
                          className={`shrink-0 font-medium ${
                            product.inStock ? 'text-[#E8D08A]' : 'text-[#F5F1E8]/45'
                          }`}
                        >
                          {product.inStock ? t.catalog.available : t.catalog.soldOut}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => onOpenProduct(product)}
                        className="mt-2 block text-start w-full"
                      >
                        <h3 className="text-base font-semibold text-[#F5F1E8] group-hover:text-[#E8D08A] transition-colors line-clamp-1">
                          {title}
                        </h3>
                      </button>
                    </div>

                    {/* Price & Action Baseline */}
                    <div className="pt-3 border-t border-[#C9A13B]/15 flex items-center justify-between gap-3">
                      <div className="flex items-baseline gap-2 tabular-nums">
                        <span className="text-lg font-semibold text-[#E8D08A]">
                          ${product.price.toLocaleString()}
                        </span>
                        {product.oldPrice && product.oldPrice > product.price && (
                          <span className="text-xs text-[#F5F1E8]/45 line-through">
                            ${product.oldPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenProduct(product)}
                          className="h-9 px-3 text-xs font-medium text-[#F5F1E8]/85 border border-[#C9A13B]/30 hover:border-[#C9A13B] hover:text-[#E8D08A] transition-colors whitespace-nowrap"
                        >
                          {t.catalog.viewDetails}
                        </button>
                        {product.inStock && (
                          <button
                            type="button"
                            onClick={() => onQuickAddToCart(product)}
                            className="h-9 w-9 flex items-center justify-center bg-[#C9A13B] text-[#0A0A0A] hover:bg-[#E8D08A] transition-colors shrink-0"
                            aria-label={t.catalog.addToBag}
                            title={t.catalog.addToBag}
                          >
                            <ShoppingBag className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
