import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { Language, ShopInfo } from '../types';
import { translations } from '../i18n';
import { BrandLogo } from './BrandLogo';
import { DeviceVisual } from './DeviceVisual';

interface HeroProps {
  lang: Language;
  shopInfo: ShopInfo;
  onSecretTrigger: () => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, shopInfo, onSecretTrigger }) => {
  const t = translations[lang];
  const isRtl = lang === 'ar';
  const images = shopInfo.heroImages.length > 0 ? shopInfo.heroImages : ['studio://hero-flagship'];
  const [activeSlide, setActiveSlide] = useState(0);

  const safeIndex = activeSlide >= images.length ? 0 : activeSlide;
  const headline =
    lang === 'ar'
      ? shopInfo.heroTitleAr || t.hero.headline
      : shopInfo.heroTitle || t.hero.headline;
  const subtitle =
    lang === 'ar'
      ? shopInfo.heroSubtitleAr || t.hero.subtitle
      : shopInfo.heroSubtitle || t.hero.subtitle;

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-[#C9A13B]/20 bg-[#0A0A0A]"
    >
      {/* Ambient Subtle Gold Radial Glow */}
      <div
        className="pointer-events-none absolute -top-28 start-1/2 -translate-x-1/2 w-[780px] h-[420px] opacity-30"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(201,161,59,0.22) 0%, rgba(201,161,59,0) 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Editorial Column */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-7">
                <div className="p-2 border border-[#C9A13B]/30 bg-[#0D0D0D]">
                  <BrandLogo size="md" onSecretTrigger={onSecretTrigger} />
                </div>
                <div className="h-12 w-px bg-[#C9A13B]/25" />
                <div>
                  <p className="text-xs tracking-[0.2em] uppercase text-[#C9A13B] font-medium">
                    OMAR CELL
                  </p>
                  <p className="text-xs text-[#F5F1E8]/65 mt-1">
                    {t.hero.locationLabel}
                  </p>
                </div>
              </div>

              <h1
                className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold leading-[1.08] tracking-tight text-[#F5F1E8] max-w-xl"
                style={{ textWrap: 'balance' }}
              >
                {headline}
              </h1>

              <p className="mt-5 text-base text-[#F5F1E8]/75 leading-relaxed max-w-lg">
                {subtitle}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#catalog"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#C9A13B] text-[#0A0A0A] text-xs font-semibold tracking-[0.14em] uppercase hover:bg-[#E8D08A] transition-colors shadow-[0_0_24px_rgba(201,161,59,0.2)]"
                >
                  <span>{t.hero.shopNow}</span>
                  <ArrowIcon className="w-4 h-4" />
                </a>

                <a
                  href="#contact"
                  className="inline-flex items-center justify-center px-6 py-3.5 border border-[#C9A13B]/45 text-[#E8D08A] text-xs font-semibold tracking-[0.14em] uppercase hover:border-[#C9A13B] hover:bg-[#1A1A1A] transition-colors"
                >
                  {t.hero.contactUs}
                </a>
              </div>
            </div>

            {/* Trust Strip */}
            <div className="mt-10 pt-6 border-t border-[#C9A13B]/20 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-[#E8D08A]">
              <ShieldCheck className="w-4 h-4 text-[#C9A13B] shrink-0" />
              {t.hero.trustItems.map((item, idx) => (
                <React.Fragment key={item}>
                  <span className="font-medium tracking-wide">{item}</span>
                  {idx < t.hero.trustItems.length - 1 && (
                    <span className="text-[#C9A13B]/50" aria-hidden="true">
                      •
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right Product Stage */}
          <div className="lg:col-span-6 flex">
            <div className="relative w-full min-h-[340px] sm:min-h-[420px] lg:min-h-[480px] bg-[#121212] border border-[#C9A13B]/35 p-3 sm:p-4 gold-glow-hover">
              {/* Architectural Corner Accents */}
              <span className="pointer-events-none absolute top-0 start-0 w-4 h-4 border-t-2 border-s-2 border-[#C9A13B]" />
              <span className="pointer-events-none absolute top-0 end-0 w-4 h-4 border-t-2 border-e-2 border-[#C9A13B]" />
              <span className="pointer-events-none absolute bottom-0 start-0 w-4 h-4 border-b-2 border-s-2 border-[#C9A13B]" />
              <span className="pointer-events-none absolute bottom-0 end-0 w-4 h-4 border-b-2 border-e-2 border-[#C9A13B]" />

              <div className="relative w-full h-full overflow-hidden bg-[#0A0A0A]">
                <DeviceVisual
                  src={images[safeIndex]}
                  alt="Omar Cell Flagship Smartphone Showcase"
                  variant="hero"
                />

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveSlide((prev) => (prev - 1 + images.length) % images.length)
                      }
                      className="absolute start-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-[#0A0A0A]/80 border border-[#C9A13B]/40 text-[#E8D08A] hover:bg-[#C9A13B] hover:text-[#0A0A0A] transition-colors"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSlide((prev) => (prev + 1) % images.length)}
                      className="absolute end-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-[#0A0A0A]/80 border border-[#C9A13B]/40 text-[#E8D08A] hover:bg-[#C9A13B] hover:text-[#0A0A0A] transition-colors"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveSlide(idx)}
                          className={`h-1.5 transition-all ${
                            idx === safeIndex
                              ? 'w-6 bg-[#C9A13B]'
                              : 'w-2 bg-[#F5F1E8]/35 hover:bg-[#E8D08A]'
                          }`}
                          aria-label={`Slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
