import React, { useState } from 'react';
import { Smartphone } from 'lucide-react';

interface DeviceVisualProps {
  src?: string;
  alt: string;
  className?: string;
  variant?: 'hero' | 'card' | 'gallery';
}

/**
 * Renders uploaded / external images with graceful fallback, plus bespoke
 * black-and-gold studio hardware visuals for built-in studio:// starter keys.
 */
export const DeviceVisual: React.FC<DeviceVisualProps> = ({
  src,
  alt,
  className = '',
  variant = 'card',
}) => {
  const [failed, setFailed] = useState(false);

  if (src && !src.startsWith('studio://') && !failed) {
    return (
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  const key = src || 'studio://default';

  if (key === 'studio://hero-flagship' || key === 'studio://iphone-16-pro' || key === 'studio://cat-iphone' || key === 'studio://iphone-15-pro') {
    const isWarm = key === 'studio://iphone-16-pro' || key === 'studio://cat-iphone';
    const isHero = key === 'studio://hero-flagship' || variant === 'hero';
    return (
      <div
        className={`relative w-full h-full overflow-hidden flex items-center justify-center bg-[#0D0D0D] ${className}`}
        role="img"
        aria-label={alt}
      >
        <div
          className="absolute inset-0"
          style={{
            background: isWarm
              ? 'radial-gradient(circle at 52% 40%, rgba(201,161,59,0.22), rgba(26,26,26,0.4) 48%, #0A0A0A 82%)'
              : 'radial-gradient(circle at 48% 38%, rgba(232,208,138,0.18), rgba(20,20,20,0.5) 52%, #0A0A0A 85%)',
          }}
        />
        {/* Architectural pedestal line */}
        <div className="absolute bottom-[14%] inset-x-[16%] h-px bg-gradient-to-r from-transparent via-[#C9A13B]/45 to-transparent" />
        <svg
          viewBox="0 0 320 380"
          className={`relative z-10 ${isHero ? 'w-[74%] h-[82%]' : 'w-[66%] h-[78%]'} drop-shadow-[0_24px_38px_rgba(0,0,0,0.85)]`}
          fill="none"
        >
          <defs>
            <linearGradient id={`frame-${key}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E8D08A" />
              <stop offset="45%" stopColor="#8E7947" />
              <stop offset="100%" stopColor="#3B3322" />
            </linearGradient>
            <linearGradient id={`back-${key}`} x1="0.1" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stopColor={isWarm ? '#2B2620' : '#222224'} />
              <stop offset="55%" stopColor="#141416" />
              <stop offset="100%" stopColor="#0B0B0C" />
            </linearGradient>
            <radialGradient id={`lens-${key}`} cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#3B4254" />
              <stop offset="45%" stopColor="#0E1015" />
              <stop offset="100%" stopColor="#050507" />
            </radialGradient>
          </defs>
          {/* Side Shadow */}
          <ellipse cx="160" cy="348" rx="76" ry="12" fill="#000000" opacity="0.7" />
          {/* Phone Outer Titanium Chassis */}
          <rect
            x="74"
            y="24"
            width="172"
            height="316"
            rx="34"
            fill={`url(#back-${key})`}
            stroke={`url(#frame-${key})`}
            strokeWidth="2.5"
          />
          {/* Inner hairline bezel */}
          <rect
            x="79"
            y="29"
            width="162"
            height="306"
            rx="30"
            stroke="#FFFFFF"
            strokeOpacity="0.06"
            strokeWidth="1"
          />
          {/* Camera Plateau */}
          <rect
            x="88"
            y="38"
            width="86"
            height="86"
            rx="22"
            fill="#171719"
            stroke="#C9A13B"
            strokeOpacity="0.35"
            strokeWidth="1.2"
          />
          {/* Top-left lens */}
          <circle cx="111" cy="61" r="16" fill="#09090B" stroke="#C9A13B" strokeOpacity="0.55" strokeWidth="1.5" />
          <circle cx="111" cy="61" r="10.5" fill={`url(#lens-${key})`} />
          <circle cx="107" cy="57" r="2.5" fill="#E8D08A" fillOpacity="0.45" />
          {/* Bottom-left lens */}
          <circle cx="111" cy="101" r="16" fill="#09090B" stroke="#C9A13B" strokeOpacity="0.55" strokeWidth="1.5" />
          <circle cx="111" cy="101" r="10.5" fill={`url(#lens-${key})`} />
          <circle cx="107" cy="97" r="2.5" fill="#E8D08A" fillOpacity="0.45" />
          {/* Center-right lens */}
          <circle cx="151" cy="81" r="16" fill="#09090B" stroke="#C9A13B" strokeOpacity="0.55" strokeWidth="1.5" />
          <circle cx="151" cy="81" r="10.5" fill={`url(#lens-${key})`} />
          <circle cx="147" cy="77" r="2.5" fill="#E8D08A" fillOpacity="0.45" />
          {/* Flash & LiDAR */}
          <circle cx="151" cy="52" r="5.5" fill="#E8D08A" fillOpacity="0.55" />
          <circle cx="151" cy="110" r="5" fill="#1C1C21" stroke="#444" strokeWidth="0.8" />
          {/* Subtle Center Reflection Line */}
          <path d="M160 148 L160 290" stroke="#C9A13B" strokeOpacity="0.14" strokeWidth="1" />
          <circle cx="160" cy="184" r="16" stroke="#C9A13B" strokeOpacity="0.22" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  if (key === 'studio://samsung-ultra' || key === 'studio://cat-samsung' || key === 'studio://samsung-a55') {
    const hasStylus = key !== 'studio://samsung-a55';
    return (
      <div
        className={`relative w-full h-full overflow-hidden flex items-center justify-center bg-[#0C0C0E] ${className}`}
        role="img"
        aria-label={alt}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 52% 44%, rgba(201,161,59,0.16), rgba(20,20,24,0.45) 52%, #0A0A0A 85%)',
          }}
        />
        <div className="absolute bottom-[14%] inset-x-[16%] h-px bg-gradient-to-r from-transparent via-[#C9A13B]/40 to-transparent" />
        <svg viewBox="0 0 320 380" className="relative z-10 w-[70%] h-[80%] drop-shadow-[0_24px_38px_rgba(0,0,0,0.85)]" fill="none">
          <defs>
            <linearGradient id={`sam-frame-${key}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E8D08A" />
              <stop offset="50%" stopColor="#776B53" />
              <stop offset="100%" stopColor="#2B2927" />
            </linearGradient>
          </defs>
          <ellipse cx="164" cy="348" rx="82" ry="12" fill="#000" opacity="0.7" />
          {/* Sharp rectangular Ultra body */}
          <rect
            x="84"
            y="26"
            width="166"
            height="312"
            rx="10"
            fill="#161618"
            stroke={`url(#sam-frame-${key})`}
            strokeWidth="2.4"
          />
          {/* Floating vertical camera rings */}
          {[58, 96, 134].map((cy) => (
            <g key={cy}>
              <circle cx="112" cy={cy} r="14.5" fill="#09090B" stroke="#C9A13B" strokeOpacity="0.6" strokeWidth="1.4" />
              <circle cx="112" cy={cy} r="9" fill="#181C26" />
              <circle cx="109" cy={cy - 3} r="2" fill="#E8D08A" fillOpacity="0.5" />
            </g>
          ))}
          <circle cx="144" cy="77" r="10.5" fill="#09090B" stroke="#C9A13B" strokeOpacity="0.45" strokeWidth="1.2" />
          <circle cx="144" cy="115" r="10.5" fill="#09090B" stroke="#C9A13B" strokeOpacity="0.45" strokeWidth="1.2" />
          <circle cx="144" cy="96" r="4" fill="#E8D08A" fillOpacity="0.55" />

          {hasStylus && (
            <g transform="translate(46, 98)">
              <rect x="0" y="0" width="12" height="236" rx="6" fill="#1C1C1F" stroke="#C9A13B" strokeOpacity="0.55" strokeWidth="1.2" />
              <path d="M3 0 L6 -9 L9 0 Z" fill="#C9A13B" />
              <rect x="2" y="218" width="8" height="14" rx="3" fill="#C9A13B" fillOpacity="0.7" />
            </g>
          )}
        </svg>
      </div>
    );
  }

  if (key === 'studio://other-flagship' || key === 'studio://cat-other') {
    return (
      <div
        className={`relative w-full h-full overflow-hidden flex items-center justify-center bg-[#0C0C0D] ${className}`}
        role="img"
        aria-label={alt}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 40%, rgba(201,161,59,0.2), rgba(22,22,22,0.4) 50%, #0A0A0A 85%)',
          }}
        />
        <svg viewBox="0 0 320 380" className="relative z-10 w-[68%] h-[78%]" fill="none">
          <ellipse cx="160" cy="348" rx="72" ry="11" fill="#000" opacity="0.7" />
          <rect x="76" y="28" width="168" height="310" rx="28" fill="#171719" stroke="#C9A13B" strokeOpacity="0.55" strokeWidth="2.2" />
          {/* Precision circular Leica-style camera island */}
          <circle cx="160" cy="108" r="54" fill="#0E0E10" stroke="#C9A13B" strokeOpacity="0.75" strokeWidth="2" />
          <circle cx="160" cy="108" r="46" stroke="#C9A13B" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="138" cy="92" r="13" fill="#161922" stroke="#E8D08A" strokeOpacity="0.4" strokeWidth="1" />
          <circle cx="182" cy="92" r="13" fill="#161922" stroke="#E8D08A" strokeOpacity="0.4" strokeWidth="1" />
          <circle cx="138" cy="126" r="13" fill="#161922" stroke="#E8D08A" strokeOpacity="0.4" strokeWidth="1" />
          <circle cx="182" cy="126" r="13" fill="#161922" stroke="#E8D08A" strokeOpacity="0.4" strokeWidth="1" />
        </svg>
      </div>
    );
  }

  if (
    key === 'studio://cat-accessories' ||
    key === 'studio://accessories-earbuds' ||
    key === 'studio://accessories-charger' ||
    key === 'studio://accessories-case'
  ) {
    return (
      <div
        className={`relative w-full h-full overflow-hidden flex items-center justify-center bg-[#0E0D0C] ${className}`}
        role="img"
        aria-label={alt}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 45%, rgba(201,161,59,0.18), rgba(26,24,20,0.4) 55%, #0A0A0A 88%)',
          }}
        />
        <svg viewBox="0 0 320 320" className="relative z-10 w-[72%] h-[72%]" fill="none">
          {/* Open sleek earbud case / charger block */}
          <rect x="64" y="96" width="112" height="118" rx="28" fill="#1A1A1C" stroke="#C9A13B" strokeOpacity="0.6" strokeWidth="2" />
          <path d="M64 140 H176" stroke="#C9A13B" strokeOpacity="0.35" strokeWidth="1.5" />
          <circle cx="120" cy="166" r="3" fill="#E8D08A" />
          {/* MagSafe ring */}
          <circle cx="212" cy="160" r="46" fill="#141416" stroke="#C9A13B" strokeOpacity="0.65" strokeWidth="2" />
          <circle cx="212" cy="160" r="24" stroke="#E8D08A" strokeOpacity="0.35" strokeWidth="4" />
          <path d="M212 206 V268" stroke="#C9A13B" strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (key === 'studio://gallery-showroom') {
    return (
      <div
        className={`relative w-full h-full overflow-hidden flex items-center justify-center bg-[#0D0C0A] ${className}`}
        role="img"
        aria-label={alt}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 30%, rgba(201,161,59,0.22), rgba(20,18,14,0.5) 55%, #0A0A0A 90%)',
          }}
        />
        <svg viewBox="0 0 480 300" className="relative z-10 w-[85%] h-[85%]" fill="none">
          <rect x="40" y="36" width="400" height="228" rx="8" stroke="#C9A13B" strokeOpacity="0.35" strokeWidth="1.5" />
          <line x1="40" y1="210" x2="440" y2="210" stroke="#C9A13B" strokeOpacity="0.45" strokeWidth="1.5" />
          {[130, 240, 350].map((cx) => (
            <g key={cx}>
              <rect x={cx - 26} y="88" width="52" height="96" rx="10" fill="#171719" stroke="#C9A13B" strokeOpacity="0.65" strokeWidth="1.5" />
              <line x1={cx} y1="184" x2={cx} y2="210" stroke="#C9A13B" strokeOpacity="0.5" strokeWidth="2" />
              <ellipse cx={cx} cy="210" rx="28" ry="4" fill="#C9A13B" fillOpacity="0.25" />
            </g>
          ))}
        </svg>
      </div>
    );
  }

  // Generic crisp fallback container
  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#1A1A1A] via-[#121212] to-[#0A0A0A] p-6 text-center ${className}`}
    >
      <Smartphone className="w-10 h-10 text-[#C9A13B]/60 mb-2" strokeWidth={1.25} />
      <span className="text-xs text-[#F5F1E8]/60 line-clamp-2 max-w-[18ch]">{alt}</span>
    </div>
  );
};
