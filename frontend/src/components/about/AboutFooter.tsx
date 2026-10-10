'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';

export const AboutFooter: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="py-4 border-top"
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: 'rgba(231, 229, 228, 0.7)',
      }}
    >
      <div className="container" style={{ maxWidth: '1240px' }}>
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 text-center text-md-start">
          {/* Logo on Left */}
          <Link
            href="/"
            className="d-flex align-items-center gap-1.5 text-decoration-none"
            title="youGO-mart"
          >
            <span
              className="fw-black"
              style={{
                color: '#F97316',
                fontSize: '1.45rem',
                letterSpacing: '-0.04em',
                fontWeight: 900,
              }}
            >
              YG
            </span>
            <span
              className="fw-bold"
              style={{
                color: '#1C1917',
                fontSize: '1.15rem',
                letterSpacing: '-0.02em',
                fontWeight: 800,
              }}
            >
              youGO-mart
            </span>
          </Link>

          {/* Links Centered */}
          <nav className="d-flex flex-wrap align-items-center justify-content-center gap-3 gap-md-4 small fw-semibold text-muted">
            <Link href="/" className="text-reset hover-orange text-decoration-none">
              {t('about_nav_home')}
            </Link>
            <Link href="/search" className="text-reset hover-orange text-decoration-none">
              {t('about_nav_shop')}
            </Link>
            <Link href="/about-us" className="text-reset hover-orange text-decoration-none" style={{ color: '#F97316' }}>
              {t('about_nav_about_us')}
            </Link>
            <Link href="/messages" className="text-reset hover-orange text-decoration-none">
              {t('about_nav_contact')}
            </Link>
            <Link href="/terms" className="text-reset hover-orange text-decoration-none">
              Terms & Safety
            </Link>
          </nav>

          {/* Copyright Right */}
          <div className="text-muted small">
            &copy; {currentYear} youGO-mart. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
