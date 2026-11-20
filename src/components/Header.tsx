import React, { useState } from 'react';
import { Globe, Heart, Menu, ShoppingBag, X } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  hasServices: boolean;
  wishlistCount: number;
  cartCount: number;
  onOpenWishlist: () => void;
  onOpenCart: () => void;
  onSecretTrigger: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  hasServices,
  wishlistCount,
  cartCount,
  onOpenWishlist,
  onOpenCart,
  onSecretTrigger,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang];

  const navItems = [
    { href: '#categories', label: t.nav.categories },
    { href: '#catalog', label: t.nav.catalog },
    ...(hasServices ? [{ href: '#services', label: t.nav.services }] : []),
    { href: '#gallery', label: t.nav.gallery },
    { href: '#contact', label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0A]/92 backdrop-blur-md border-b border-[#C9A13B]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Lockup */}
        <div className="flex items-center gap-3 shrink-0">
          <BrandLogo size="sm" onSecretTrigger={onSecretTrigger} />
          <a
            href="#top"
            className="font-display text-lg sm:text-xl font-semibold tracking-[0.14em] text-[#E8D08A] whitespace-nowrap shrink-0"
          >
            OMAR CELL
          </a>
        </div>

        {/* Zone 2: Single-line Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-medium tracking-[0.08em] uppercase text-[#F5F1E8]/75">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-[#E8D08A] transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#C9A13B]/60"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleLang}
            className="h-10 px-3 flex items-center gap-1.5 text-xs font-medium text-[#E8D08A] border border-[#C9A13B]/30 hover:border-[#C9A13B] hover:bg-[#1A1A1A] transition-colors whitespace-nowrap shrink-0"
            aria-label="Switch Language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'عربي' : 'EN'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenWishlist}
            className="relative h-10 w-10 flex items-center justify-center text-[#F5F1E8]/85 border border-[#C9A13B]/25 hover:border-[#C9A13B] hover:text-[#E8D08A] transition-colors shrink-0"
            aria-label={t.nav.wishlist}
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -end-1.5 min-w-[18px] h-[18px] px-1 bg-[#C9A13B] text-[#0A0A0A] text-[10px] font-bold flex items-center justify-center tabular-nums">
                {wishlistCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            className="relative h-10 px-3.5 flex items-center gap-2 bg-[#C9A13B] text-[#0A0A0A] text-xs font-semibold tracking-wider uppercase hover:bg-[#E8D08A] transition-colors whitespace-nowrap shrink-0"
            aria-label={t.nav.bag}
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">{t.nav.bag}</span>
            <span className="tabular-nums font-bold">({cartCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="lg:hidden h-10 w-10 flex items-center justify-center text-[#F5F1E8] border border-[#C9A13B]/25 hover:border-[#C9A13B] transition-colors shrink-0"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#C9A13B]/20 bg-[#0A0A0A] px-4 py-4">
          <nav className="flex flex-col divide-y divide-[#C9A13B]/10">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 text-sm font-medium text-[#F5F1E8]/85 hover:text-[#E8D08A] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
