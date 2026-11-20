import React from 'react';
import { Language, ShopInfo } from '../types';
import { translations } from '../i18n';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  lang: Language;
  shopInfo: ShopInfo;
  hasServices: boolean;
  onSecretTrigger: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  shopInfo,
  hasServices,
  onSecretTrigger,
}) => {
  const t = translations[lang];
  const cleanWa = shopInfo.whatsappNumber.replace(/[^0-9]/g, '');
  const fbUrl =
    shopInfo.facebookUrl || 'https://www.facebook.com/search/top?q=Omar%20Cell';

  return (
    <footer className="bg-[#070707] border-t border-[#C9A13B]/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-[#C9A13B]/15">
          <div className="flex items-center gap-4">
            <BrandLogo size="md" onSecretTrigger={onSecretTrigger} />
            <div>
              <p className="font-display text-2xl font-semibold tracking-[0.14em] text-[#E8D08A]">
                OMAR CELL
              </p>
              <p className="text-xs text-[#F5F1E8]/60 mt-1 max-w-xs">
                {t.footer.tagline}
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap items-center gap-6 text-xs uppercase tracking-[0.1em] text-[#F5F1E8]/70">
            <a href="#categories" className="hover:text-[#E8D08A] transition-colors">
              {t.nav.categories}
            </a>
            <a href="#catalog" className="hover:text-[#E8D08A] transition-colors">
              {t.nav.catalog}
            </a>
            {hasServices && (
              <a href="#services" className="hover:text-[#E8D08A] transition-colors">
                {t.nav.services}
              </a>
            )}
            <a href="#gallery" className="hover:text-[#E8D08A] transition-colors">
              {t.nav.gallery}
            </a>
            <a href="#contact" className="hover:text-[#E8D08A] transition-colors">
              {t.nav.contact}
            </a>
            <a
              href={fbUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#E8D08A] transition-colors"
            >
              Facebook
            </a>
            <a
              href={`https://wa.me/${cleanWa}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E8D08A] hover:underline"
            >
              WhatsApp
            </a>
          </nav>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#F5F1E8]/50">
          <p>© {new Date().getFullYear()} {t.footer.rights}</p>
          <p>{t.footer.location}</p>
        </div>
      </div>
    </footer>
  );
};
