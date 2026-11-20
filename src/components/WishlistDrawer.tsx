import React from 'react';
import { Heart, Trash2, X } from 'lucide-react';
import { Language, Product } from '../types';
import { translations } from '../i18n';
import { DeviceVisual } from './DeviceVisual';

interface WishlistDrawerProps {
  lang: Language;
  open: boolean;
  products: Product[];
  wishlistIds: string[];
  onClose: () => void;
  onRemove: (productId: string) => void;
  onOpenProduct: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  lang,
  open,
  products,
  wishlistIds,
  onClose,
  onRemove,
  onOpenProduct,
}) => {
  const t = translations[lang];
  if (!open) return null;

  const savedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <aside
        className="w-full max-w-md bg-[#111111] border-s border-[#C9A13B]/35 h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-[#C9A13B]/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Heart className="w-4 h-4 text-[#C9A13B]" />
            <h2 className="font-display text-2xl font-semibold text-[#F5F1E8]">
              {t.wishlist.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center border border-[#C9A13B]/25 text-[#F5F1E8]/80 hover:border-[#C9A13B] hover:text-[#E8D08A] transition-colors"
            aria-label={t.modal.close}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {savedProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <Heart className="w-10 h-10 text-[#C9A13B]/40 mb-4" strokeWidth={1.25} />
              <p className="font-display text-xl text-[#E8D08A]">{t.wishlist.empty}</p>
              <p className="text-xs text-[#F5F1E8]/60 mt-1.5 max-w-[26ch]">
                {t.wishlist.emptyHint}
              </p>
            </div>
          ) : (
            savedProducts.map((product) => {
              const title =
                lang === 'ar' && product.nameAr ? product.nameAr : product.name;
              return (
                <div
                  key={product.id}
                  className="bg-[#1A1A1A] border border-[#C9A13B]/20 p-3.5 flex gap-3.5"
                >
                  <div className="w-20 h-20 shrink-0 bg-[#0A0A0A] border border-[#C9A13B]/15 overflow-hidden">
                    <DeviceVisual
                      src={product.images[0] || 'studio://default'}
                      alt={title}
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wider text-[#C9A13B]">
                          {product.brand}
                        </p>
                        <p className="text-sm font-semibold text-[#F5F1E8] truncate mt-0.5">
                          {title}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(product.id)}
                        className="text-[#F5F1E8]/45 hover:text-[#E8D08A] p-1"
                        aria-label={t.wishlist.remove}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-[#E8D08A] tabular-nums">
                        ${product.price.toLocaleString()}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onOpenProduct(product);
                        }}
                        className="px-3.5 py-1.5 bg-[#C9A13B] text-[#0A0A0A] text-xs font-semibold uppercase tracking-wider hover:bg-[#E8D08A] transition-colors"
                      >
                        {t.wishlist.viewProduct}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </div>
  );
};
