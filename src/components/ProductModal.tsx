import React, { useEffect, useState } from 'react';
import { Check, Heart, ShoppingBag, X } from 'lucide-react';
import { Language, Product, ProductCondition, ShopInfo } from '../types';
import { translations } from '../i18n';
import { DeviceVisual } from './DeviceVisual';
import { WhatsAppIcon } from './WhatsAppIcon';

interface ProductModalProps {
  lang: Language;
  product: Product | null;
  shopInfo: ShopInfo;
  isWishlisted: boolean;
  onClose: () => void;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (item: {
    product: Product;
    storage?: string;
    color?: string;
    condition: ProductCondition;
  }) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  lang,
  product,
  shopInfo,
  isWishlisted,
  onClose,
  onToggleWishlist,
  onAddToCart,
}) => {
  const t = translations[lang];
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedCondition, setSelectedCondition] = useState<ProductCondition>('New');
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!product) return;
    setActiveImgIdx(0);
    setSelectedStorage(product.storageOptions?.[0] || '');
    setSelectedColor(product.colors?.[0] || '');
    setSelectedCondition(product.condition);
    setJustAdded(false);
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [product, onClose]);

  if (!product) return null;

  const title = lang === 'ar' && product.nameAr ? product.nameAr : product.name;
  const description =
    lang === 'ar' && product.descriptionAr
      ? product.descriptionAr
      : product.description;
  const images = product.images.length > 0 ? product.images : ['studio://default'];
  const currentImage = images[activeImgIdx] || images[0];

  const cleanWaNumber = shopInfo.whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappText = t.whatsapp.singleOrder({
    name: title,
    storage: selectedStorage || undefined,
    color: selectedColor || undefined,
    condition: selectedCondition,
    price: product.price,
  });
  const whatsappUrl = `https://wa.me/${cleanWaNumber}?text=${encodeURIComponent(whatsappText)}`;

  const handleAdd = () => {
    onAddToCart({
      product,
      storage: selectedStorage || undefined,
      color: selectedColor || undefined,
      condition: selectedCondition,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#121212] border border-[#C9A13B]/40 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t.modal.close}
          className="absolute top-3 end-3 z-20 w-10 h-10 flex items-center justify-center bg-[#0A0A0A]/90 border border-[#C9A13B]/35 text-[#F5F1E8] hover:border-[#C9A13B] hover:text-[#E8D08A] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          {/* Left Gallery */}
          <div className="md:col-span-6 bg-[#0A0A0A] border-b md:border-b-0 md:border-e border-[#C9A13B]/20 p-4 sm:p-6 flex flex-col gap-3">
            <div className="aspect-[4/3] w-full overflow-hidden border border-[#C9A13B]/20 bg-[#101010]">
              <DeviceVisual src={currentImage} alt={title} />
            </div>
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImgIdx(idx)}
                    className={`w-16 h-14 shrink-0 overflow-hidden border transition-colors ${
                      idx === activeImgIdx
                        ? 'border-[#C9A13B]'
                        : 'border-[#C9A13B]/20 opacity-65 hover:opacity-100'
                    }`}
                  >
                    <DeviceVisual src={img} alt={`${title} ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Contiguous Purchase Module */}
          <div className="md:col-span-6 p-5 sm:p-7 flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#C9A13B] uppercase tracking-[0.14em] font-medium">
                <span>{product.brand}</span>
                <span aria-hidden="true">·</span>
                <span>
                  {product.inStock ? t.modal.inStock : t.modal.outOfStock}
                </span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#F5F1E8] mt-1.5 pe-8">
                {title}
              </h2>

              <div className="mt-3 flex items-baseline gap-3 tabular-nums">
                <span className="text-2xl font-semibold text-[#E8D08A]">
                  ${product.price.toLocaleString()}
                </span>
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="text-sm text-[#F5F1E8]/45 line-through">
                    ${product.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {description && (
                <p className="mt-4 text-sm text-[#F5F1E8]/75 leading-relaxed">
                  {description}
                </p>
              )}

              {/* Storage Options */}
              {product.storageOptions && product.storageOptions.length > 0 && (
                <div className="mt-5">
                  <label className="block text-xs uppercase tracking-wider text-[#F5F1E8]/60 mb-2">
                    {t.modal.storage}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.storageOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedStorage(opt)}
                        className={`px-3.5 py-2 text-xs font-medium border transition-colors ${
                          selectedStorage === opt
                            ? 'bg-[#C9A13B] text-[#0A0A0A] border-[#C9A13B] font-semibold'
                            : 'bg-[#0A0A0A] text-[#F5F1E8]/80 border-[#C9A13B]/25 hover:border-[#C9A13B]'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Options */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-4">
                  <label className="block text-xs uppercase tracking-wider text-[#F5F1E8]/60 mb-2">
                    {t.modal.color}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((clr) => (
                      <button
                        key={clr}
                        type="button"
                        onClick={() => setSelectedColor(clr)}
                        className={`px-3.5 py-2 text-xs font-medium border transition-colors ${
                          selectedColor === clr
                            ? 'bg-[#C9A13B] text-[#0A0A0A] border-[#C9A13B] font-semibold'
                            : 'bg-[#0A0A0A] text-[#F5F1E8]/80 border-[#C9A13B]/25 hover:border-[#C9A13B]'
                        }`}
                      >
                        {clr}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Condition Selector */}
              <div className="mt-4">
                <label className="block text-xs uppercase tracking-wider text-[#F5F1E8]/60 mb-2">
                  {t.modal.condition}
                </label>
                <div className="inline-flex border border-[#C9A13B]/25 bg-[#0A0A0A]">
                  {(['New', 'Used'] as ProductCondition[]).map((cond) => (
                    <button
                      key={cond}
                      type="button"
                      onClick={() => setSelectedCondition(cond)}
                      className={`px-4 py-2 text-xs font-medium transition-colors ${
                        selectedCondition === cond
                          ? 'bg-[#C9A13B] text-[#0A0A0A] font-semibold'
                          : 'text-[#F5F1E8]/75 hover:text-[#E8D08A]'
                      }`}
                    >
                      {cond === 'New' ? t.modal.newCond : t.modal.usedCond}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Primary Actions */}
            <div className="pt-4 border-t border-[#C9A13B]/20 space-y-2.5">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 flex items-center justify-center gap-2.5 bg-[#C9A13B] text-[#0A0A0A] text-xs font-bold tracking-[0.12em] uppercase hover:bg-[#E8D08A] transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>{t.modal.orderWhatsapp}</span>
              </a>

              <div className="grid grid-cols-5 gap-2.5">
                <button
                  type="button"
                  disabled={!product.inStock}
                  onClick={handleAdd}
                  className="col-span-4 h-11 flex items-center justify-center gap-2 border border-[#C9A13B]/45 text-[#E8D08A] text-xs font-semibold tracking-wider uppercase hover:bg-[#1A1A1A] hover:border-[#C9A13B] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t.modal.addedToBag}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>
                        {product.inStock ? t.modal.addToBag : t.modal.outOfStock}
                      </span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onToggleWishlist(product.id)}
                  aria-label={
                    isWishlisted ? t.modal.savedWishlist : t.modal.saveWishlist
                  }
                  className={`col-span-1 h-11 flex items-center justify-center border transition-colors ${
                    isWishlisted
                      ? 'bg-[#C9A13B]/20 border-[#C9A13B] text-[#E8D08A]'
                      : 'border-[#C9A13B]/30 text-[#F5F1E8]/75 hover:border-[#C9A13B] hover:text-[#E8D08A]'
                  }`}
                >
                  <Heart
                    className="w-4 h-4"
                    fill={isWishlisted ? 'currentColor' : 'none'}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
