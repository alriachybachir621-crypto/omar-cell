import React from 'react';
import {
  BatteryCharging,
  Cpu,
  Headphones,
  Layers,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Truck,
  Wrench,
} from 'lucide-react';
import { Language, ServiceItem } from '../types';
import { translations } from '../i18n';

export const SERVICE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Smartphone,
  Wrench,
  ShieldCheck,
  RefreshCw,
  BatteryCharging,
  Cpu,
  Layers,
  Headphones,
  Sparkles,
  Truck,
};

interface ServicesSectionProps {
  lang: Language;
  services: ServiceItem[];
}

/**
 * Renders the Services section only when at least one service exists.
 */
export const ServicesSection: React.FC<ServicesSectionProps> = ({ lang, services }) => {
  if (!services || services.length === 0) {
    return null;
  }

  const t = translations[lang];

  return (
    <section
      id="services"
      className="py-16 sm:py-20 border-b border-[#C9A13B]/15 bg-[#0D0D0D]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#C9A13B] font-medium">
              {t.services.kicker}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F1E8] mt-1.5">
              {t.services.title}
            </h2>
          </div>
          <p className="text-sm text-[#F5F1E8]/65 max-w-md">{t.services.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const IconComponent = SERVICE_ICONS[service.icon] || Wrench;
            const title =
              lang === 'ar' && service.titleAr ? service.titleAr : service.title;
            const description =
              lang === 'ar' && service.descriptionAr
                ? service.descriptionAr
                : service.description;

            return (
              <div
                key={service.id}
                className="bg-[#1A1A1A] border border-[#C9A13B]/20 p-6 gold-glow-hover"
              >
                <div className="w-11 h-11 flex items-center justify-center border border-[#C9A13B]/40 bg-[#0A0A0A] text-[#E8D08A] mb-5">
                  <IconComponent className="w-5 h-5" />
                </div>
                <h3 className="font-display text-xl font-semibold text-[#F5F1E8]">
                  {title}
                </h3>
                {description && (
                  <p className="mt-2.5 text-sm text-[#F5F1E8]/70 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
