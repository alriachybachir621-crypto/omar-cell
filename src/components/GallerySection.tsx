import React from 'react';
import { ExternalLink } from 'lucide-react';
import { GalleryItem, Language, ShopInfo } from '../types';
import { translations } from '../i18n';
import { DeviceVisual } from './DeviceVisual';

interface GallerySectionProps {
  lang: Language;
  items: GalleryItem[];
  shopInfo: ShopInfo;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  lang,
  items,
  shopInfo,
}) => {
  const t = translations[lang];
  const fbUrl =
    shopInfo.facebookUrl || 'https://www.facebook.com/search/top?q=Omar%20Cell';

  return (
    <section
      id="gallery"
      className="py-16 sm:py-20 border-b border-[#C9A13B]/15 bg-[#0D0D0D]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#C9A13B] font-medium">
              {t.gallery.kicker}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F1E8] mt-1.5">
              {t.gallery.title}
            </h2>
            <p className="mt-2 text-sm text-[#F5F1E8]/65 max-w-lg">
              {t.gallery.subtitle}
            </p>
          </div>

          <a
            href={fbUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-5 py-3 border border-[#C9A13B]/45 text-[#E8D08A] text-xs font-semibold tracking-wider uppercase hover:bg-[#C9A13B] hover:text-[#0A0A0A] transition-colors self-start md:self-auto shrink-0"
          >
            <span>{t.gallery.facebookCta}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => {
            const caption =
              lang === 'ar' && item.captionAr ? item.captionAr : item.caption;
            return (
              <figure
                key={item.id}
                className="group bg-[#1A1A1A] border border-[#C9A13B]/20 overflow-hidden gold-glow-hover"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#0A0A0A]">
                  <DeviceVisual
                    src={item.image}
                    alt={caption || 'Omar Cell Showroom'}
                    variant="gallery"
                    className="transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </div>
                {caption && (
                  <figcaption className="px-4 py-3 text-xs text-[#F5F1E8]/75 border-t border-[#C9A13B]/15 truncate">
                    {caption}
                  </figcaption>
                )}
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
};
