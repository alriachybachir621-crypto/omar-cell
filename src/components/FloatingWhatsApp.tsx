import React from 'react';
import { Language, ShopInfo } from '../types';
import { translations } from '../i18n';
import { WhatsAppIcon } from './WhatsAppIcon';

interface FloatingWhatsAppProps {
  lang: Language;
  shopInfo: ShopInfo;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  lang,
  shopInfo,
}) => {
  const t = translations[lang];
  const cleanWa = shopInfo.whatsappNumber.replace(/[^0-9]/g, '');
  const href = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    t.whatsapp.generalGreeting
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp Omar Cell"
      className="fixed bottom-5 end-5 z-40 w-13 h-13 flex items-center justify-center rounded-full bg-[#0A0A0A] border border-[#C9A13B] text-[#E8D08A] shadow-[0_8px_28px_rgba(0,0,0,0.65),0_0_18px_rgba(201,161,59,0.28)] hover:bg-[#C9A13B] hover:text-[#0A0A0A] transition-all duration-200 hover:scale-105"
    >
      <WhatsAppIcon className="w-6 h-6" />
    </a>
  );
};
