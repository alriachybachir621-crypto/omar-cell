import React from 'react';
import { Clock, ExternalLink, MapPin, Phone } from 'lucide-react';
import { Language, ShopInfo } from '../types';
import { translations } from '../i18n';
import { WhatsAppIcon } from './WhatsAppIcon';

interface ContactSectionProps {
  lang: Language;
  shopInfo: ShopInfo;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  lang,
  shopInfo,
}) => {
  const t = translations[lang];
  const cleanWa = shopInfo.whatsappNumber.replace(/[^0-9]/g, '');
  const waHref = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    t.whatsapp.generalGreeting
  )}`;
  const telHref = `tel:+${cleanWa}`;
  const address =
    lang === 'ar' && shopInfo.addressAr ? shopInfo.addressAr : shopInfo.address;
  const hours = lang === 'ar' && shopInfo.hoursAr ? shopInfo.hoursAr : shopInfo.hours;

  return (
    <section
      id="contact"
      className="py-16 sm:py-20 border-b border-[#C9A13B]/15 bg-[#0A0A0A]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-xs tracking-[0.2em] uppercase text-[#C9A13B] font-medium">
            {t.contact.kicker}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#F5F1E8] mt-1.5">
            {t.contact.title}
          </h2>
          <p className="mt-2 text-sm text-[#F5F1E8]/65 max-w-lg">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 bg-[#1A1A1A] border border-[#C9A13B]/25 p-6 sm:p-8 flex flex-col justify-between gap-8">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 shrink-0 flex items-center justify-center border border-[#C9A13B]/35 bg-[#0A0A0A] text-[#E8D08A]">
                  <WhatsAppIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#F5F1E8]/55">
                    {t.contact.whatsappLabel} & {t.contact.phoneLabel}
                  </p>
                  <p
                    className="text-lg font-semibold text-[#E8D08A] mt-0.5 tabular-nums"
                    dir="ltr"
                  >
                    {shopInfo.phoneDisplay}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 shrink-0 flex items-center justify-center border border-[#C9A13B]/35 bg-[#0A0A0A] text-[#E8D08A]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[#F5F1E8]/55">
                    {t.contact.addressLabel}
                  </p>
                  <p className="text-sm text-[#F5F1E8]/90 mt-0.5 leading-relaxed">
                    {address}
                  </p>
                </div>
              </div>

              {hours && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 shrink-0 flex items-center justify-center border border-[#C9A13B]/35 bg-[#0A0A0A] text-[#E8D08A]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#F5F1E8]/55">
                      {t.contact.hoursLabel}
                    </p>
                    <p className="text-sm text-[#F5F1E8]/90 mt-0.5">{hours}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3 pt-4 border-t border-[#C9A13B]/15">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-12 flex items-center justify-center gap-2.5 bg-[#C9A13B] text-[#0A0A0A] text-xs font-bold tracking-[0.12em] uppercase hover:bg-[#E8D08A] transition-colors"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>{t.contact.chatWhatsapp}</span>
              </a>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={telHref}
                  className="h-11 flex items-center justify-center gap-2 border border-[#C9A13B]/35 text-[#E8D08A] text-xs font-semibold tracking-wider uppercase hover:border-[#C9A13B] hover:bg-[#0A0A0A] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span dir="ltr">{shopInfo.phoneDisplay}</span>
                </a>
                {shopInfo.mapsLink && (
                  <a
                    href={shopInfo.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-11 flex items-center justify-center gap-2 border border-[#C9A13B]/35 text-[#F5F1E8]/85 text-xs font-semibold tracking-wider uppercase hover:border-[#C9A13B] hover:text-[#E8D08A] hover:bg-[#0A0A0A] transition-colors"
                  >
                    <span>{t.contact.openMaps}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Google Maps Embed */}
          <div className="lg:col-span-7 bg-[#1A1A1A] border border-[#C9A13B]/25 p-2 min-h-[320px] lg:min-h-[400px] flex">
            <iframe
              title="Omar Cell Location — Qab Elias Road, Zahle Area"
              src={
                shopInfo.mapsEmbedUrl ||
                'https://www.google.com/maps?q=Qab+Elias+Zahle+Lebanon&output=embed'
              }
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full min-h-[304px] border-0 grayscale contrast-125 invert-[0.9] hue-rotate-180"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
