import React from 'react';
import { MapPin, ShieldCheck, Tag } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n';

export const WhyOmarCell: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = translations[lang];
  const icons = [ShieldCheck, Tag, MapPin];

  return (
    <section
      id="why-us"
      className="py-16 sm:py-20 border-b border-[#C9A13B]/15 bg-[#0A0A0A]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-xs tracking-[0.2em] uppercase text-[#C9A13B] font-medium">
            {t.whyUs.kicker}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F1E8] mt-1.5">
            {t.whyUs.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.whyUs.cards.map((card, idx) => {
            const Icon = icons[idx] || ShieldCheck;
            return (
              <div
                key={card.num}
                className="bg-[#1A1A1A] border border-[#C9A13B]/20 p-6 sm:p-7 flex flex-col justify-between gold-glow-hover"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-display text-2xl text-[#C9A13B]/75 tabular-nums">
                      {card.num}
                    </span>
                    <div className="w-10 h-10 flex items-center justify-center border border-[#C9A13B]/35 text-[#E8D08A] bg-[#0A0A0A]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-[#F5F1E8]">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm text-[#F5F1E8]/70 leading-relaxed">
                    {card.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
