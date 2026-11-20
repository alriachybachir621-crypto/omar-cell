import React, { useRef } from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  onSecretTrigger?: () => void;
  className?: string;
}

/**
 * Displays the attached Omar Cell logo (/assets/aistudio/image_477a304b.png)
 * cropped cleanly via CSS object-position so only the gold RA monogram + OMAR CELL
 * wordmark appears without surrounding screenshot chrome.
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'sm',
  onSecretTrigger,
  className = '',
}) => {
  const tapCountRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  const handleTap = () => {
    if (!onSecretTrigger) return;
    tapCountRef.current += 1;
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      onSecretTrigger();
      return;
    }
    timerRef.current = window.setTimeout(() => {
      tapCountRef.current = 0;
    }, 2200);
  };

  const sizeClasses =
    size === 'lg'
      ? 'w-28 h-28 sm:w-32 sm:h-32'
      : size === 'md'
        ? 'w-16 h-16 sm:w-20 sm:h-20'
        : 'w-11 h-11';

  return (
    <div
      onClick={handleTap}
      className={`relative overflow-hidden select-none shrink-0 ${sizeClasses} ${onSecretTrigger ? 'cursor-pointer' : ''} ${className}`}
      aria-label="Omar Cell"
    >
      <img
        src="/assets/aistudio/image_477a304b.png"
        alt="Omar Cell Logo"
        referrerPolicy="no-referrer"
        draggable={false}
        className="w-full h-full object-cover object-[50%_51%] scale-[1.18] mix-blend-lighten pointer-events-none"
      />
    </div>
  );
};
