import React, { useState } from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { CartItem, Language, ShopInfo } from '../types';
import { translations } from '../i18n';
import { DeviceVisual } from './DeviceVisual';
import { WhatsAppIcon } from './WhatsAppIcon';

interface CartDrawerProps {
  lang: Language;
  open: boolean;
  items: CartItem[];
  shopInfo: ShopInfo;
  onClose: () => void;
  onUpdateQty: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onClear: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  lang,
  open,
  items,
  shopInfo,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClear,
}) => {
  const [note, setNote] = useState('');
  const t = translations[lang];

  if (!open) return null;

  const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const cleanWa = shopInfo.whatsappNumber.replace(/[^0-9]/g, '');
  const formattedMsg = t.whatsapp.cartOrder(
    items.map((it) => ({
      name: lang === 'ar' && it.nameAr ? it.nameAr : it.name,
      storage: it.storage,
      color: it.color,
      condition: it.condition,
      price: it.price,
      quantity: it.quantity,
    })),
    subtotal,
    note
  );
  const waHref = `https://wa.me/${cleanWa}?text=${encodeURIComponent(formattedMsg)}`;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <aside
        className="w-full max-w-md bg-[#111111] border-s border-[#C9A13B]/35 h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#C9A13B]/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-4 h-4 text-[#C9A13B]" />
            <h2 className="font-display text-2xl font-semibold text-[#F5F1E8]">
              {t.cart.title}
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="w-10 h-10 text-[#C9A13B]/40 mb-4" strokeWidth={1.25} />
              <p className="font-display text-xl text-[#E8D08A]">{t.cart.empty}</p>
              <p className="text-xs text-[#F5F1E8]/60 mt-1.5 max-w-[26ch]">
                {t.cart.emptyHint}
              </p>
            </div>
          ) : (
            items.map((item) => {
              const title =
                lang === 'ar' && item.nameAr ? item.nameAr : item.name;
              const condLabel =
                item.condition === 'New' ? t.modal.newCond : t.modal.usedCond;
              const variantText = [item.storage, item.color, condLabel]
                .filter(Boolean)
                .join(' · ');

              return (
                <div
                  key={item.key}
                  className="bg-[#1A1A1A] border border-[#C9A13B]/20 p-3.5 flex gap-3.5"
                >
                  <div className="w-20 h-20 shrink-0 bg-[#0A0A0A] border border-[#C9A13B]/15 overflow-hidden">
                    <DeviceVisual src={item.image} alt={title} />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#F5F1E8] truncate">
                          {title}
                        </p>
                        <p className="text-xs text-[#F5F1E8]/55 mt-0.5 truncate">
                          {variantText}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.key)}
                        className="text-[#F5F1E8]/45 hover:text-[#E8D08A] transition-colors shrink-0 p-1"
                        aria-label={t.cart.remove}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center border border-[#C9A13B]/25 bg-[#0A0A0A]">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.key, -1)}
                          className="w-7 h-7 flex items-center justify-center text-[#F5F1E8]/80 hover:text-[#E8D08A]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-medium tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(item.key, 1)}
                          className="w-7 h-7 flex items-center justify-center text-[#F5F1E8]/80 hover:text-[#E8D08A]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm font-semibold text-[#E8D08A] tabular-nums">
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-[#C9A13B]/20 bg-[#0D0D0D] space-y-4">
            <div>
              <label className="block text-xs text-[#F5F1E8]/60 mb-1.5">
                {t.cart.noteLabel}
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t.cart.notePlaceholder}
                className="w-full h-10 bg-[#0A0A0A] border border-[#C9A13B]/25 px-3 text-xs text-[#F5F1E8] placeholder:text-[#F5F1E8]/35 focus:outline-none focus:border-[#C9A13B]"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs uppercase tracking-wider text-[#F5F1E8]/70">
                {t.cart.subtotal}
              </span>
              <span className="text-xl font-semibold text-[#E8D08A] tabular-nums">
                ${subtotal.toLocaleString()} USD
              </span>
            </div>

            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 flex items-center justify-center gap-2.5 bg-[#C9A13B] text-[#0A0A0A] text-xs font-bold tracking-[0.12em] uppercase hover:bg-[#E8D08A] transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>{t.cart.sendWhatsapp}</span>
            </a>

            <button
              type="button"
              onClick={onClear}
              className="w-full py-2 text-xs text-[#F5F1E8]/55 hover:text-[#E8D08A] transition-colors"
            >
              {t.cart.clearBag}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};
