import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  clickable?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showWordmark = true,
  clickable = true,
}) => {
  const heights = {
    sm: 32,
    md: 44,
    lg: 56,
  };

  const currentHeight = heights[size];

  const content = (
    <div className="d-inline-flex align-items-center gap-2 text-decoration-none">
      {/* Brand Icon Badge using the official uploaded logo */}
      <div
        style={{
          width: currentHeight,
          height: currentHeight,
          borderRadius: size === 'sm' ? '8px' : '12px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F97316',
          boxShadow: '0 2px 8px rgba(249, 115, 22, 0.3)',
          flexShrink: 0,
        }}
      >
        <Image
          src="/logo.jpg"
          alt="youGO-mart logo"
          width={currentHeight}
          height={currentHeight}
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>

      {showWordmark && (
        <div className="d-flex flex-column justify-content-center" style={{ lineHeight: 1 }}>
          <div className="d-flex align-items-baseline">
            <span
              style={{
                fontSize: size === 'sm' ? '1.15rem' : size === 'md' ? '1.45rem' : '1.85rem',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                color: 'var(--text-main)',
              }}
            >
              you<span style={{ color: '#F97316' }}>GO</span>
              <span style={{ color: 'var(--text-main)' }}>-mart</span>
            </span>
          </div>
          <span
            style={{
              fontSize: size === 'sm' ? '0.62rem' : '0.7rem',
              color: 'var(--secondary-text)',
              letterSpacing: '0.04em',
              fontWeight: 600,
              textTransform: 'uppercase',
              marginTop: '1px',
            }}
          >
            Ethiopia • Commission-Free
          </span>
        </div>
      )}
    </div>
  );

  if (!clickable) return content;

  return (
    <Link href="/" className="d-inline-flex align-items-center text-decoration-none">
      {content}
    </Link>
  );
};
