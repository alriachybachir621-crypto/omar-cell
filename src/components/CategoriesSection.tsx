import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Category, Language } from '../types';
import { translations } from '../i18n';
import { DeviceVisual } from './DeviceVisual';

interface CategoriesSectionProps {
  lang: Language;
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (slug: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  lang,
  categories,
  activeCategory,
  onSelectCategory,
}) => {
  const t = translations[lang];

  const handleChoose = (slug: string) => {
    onSelectCategory(slug);
    const el = document.getElementById('catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="categories"
      className="py-16 sm:py-20 border-b border-[#C9A13B]/15 bg-[#0A0A0A]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#C9A13B] font-medium">
              {t.categories.kicker}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F1E8] mt-1.5">
              {t.categories.title}
            </h2>
          </div>
          <p className="text-sm text-[#F5F1E8]/65 max-w-md">{t.categories.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const title = lang === 'ar' && cat.nameAr ? cat.nameAr : cat.name;
            const subtitle =
              lang === 'ar' && cat.subtitleAr ? cat.subtitleAr : cat.subtitle;
            const isSelected = activeCategory === cat.slug;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleChoose(cat.slug)}
                className={`group text-start bg-[#1A1A1A] border transition-all duration-200 overflow-hidden flex flex-col gold-glow-hover hover:-translate-y-0.5 ${
                  isSelected
                    ? 'border-[#C9A13B] shadow-[0_0_24px_rgba(201,161,59,0.18)]'
                    : 'border-[#C9A13B]/20'
                }`}
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#101010] border-b border-[#C9A13B]/15">
                  <DeviceVisual
                    src={cat.image || 'studio://default'}
                    alt={title}
                    className="transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between w-full">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-display text-xl font-semibold text-[#F5F1E8] group-hover:text-[#E8D08A] transition-colors">
                        {title}
                      </h3>
                      <ArrowUpRight className="w-4 h-4 text-[#C9A13B] opacity-75 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                    {subtitle && (
                      <p className="mt-1.5 text-xs text-[#F5F1E8]/60 leading-relaxed line-clamp-2">
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
