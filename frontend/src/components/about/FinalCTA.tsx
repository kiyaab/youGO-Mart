'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { ShoppingCart, ArrowRight } from 'lucide-react';

export const FinalCTA: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-5" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="container" style={{ maxWidth: '1240px' }}>
        <div
          className="position-relative overflow-hidden p-4 p-md-5 rounded-4 shadow-lg text-white"
          style={{
            background: 'linear-gradient(135deg, #FB923C 0%, #F97316 45%, #EA580C 100%)',
            boxShadow: '0 20px 45px rgba(234, 88, 12, 0.28)',
          }}
        >
          {/* Subtle Background Shopping Cart Motif */}
          <div
            className="position-absolute end-0 bottom-0 text-white opacity-10 pointer-events-none"
            style={{
              transform: 'translate(15%, 25%) rotate(-10deg)',
              pointerEvents: 'none',
            }}
          >
            <ShoppingCart size={280} strokeWidth={1.5} />
          </div>

          <div className="row align-items-center g-4 position-relative" style={{ zIndex: 1 }}>
            {/* Left: White Brand Mark */}
            <div className="col-12 col-lg-3 text-center text-lg-start">
              <div className="d-inline-flex align-items-center gap-2">
                <span
                  className="fw-black text-white"
                  style={{
                    fontSize: '2.2rem',
                    letterSpacing: '-0.04em',
                    fontWeight: 900,
                    lineHeight: 1,
                  }}
                >
                  YG
                </span>
                <span
                  className="fw-bold text-white"
                  style={{
                    fontSize: '1.45rem',
                    letterSpacing: '-0.02em',
                    fontWeight: 800,
                    lineHeight: 1,
                  }}
                >
                  youGO-mart
                </span>
              </div>
            </div>

            {/* Center: Headline & Subtitle */}
            <div className="col-12 col-lg-6 text-center text-lg-start">
              <h3
                className="fw-black text-white mb-1.5"
                style={{
                  fontSize: 'clamp(1.5rem, 2.3vw, 2rem)',
                  letterSpacing: '-0.025em',
                  fontWeight: 900,
                }}
              >
                {t('about_cta_title')}
              </h3>
              <p
                className="text-white-50 mb-0"
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.5,
                  opacity: 0.92,
                }}
              >
                {t('about_cta_desc')}
              </p>
            </div>

            {/* Right: Rounded White Button */}
            <div className="col-12 col-lg-3 text-center text-lg-end">
              <Link
                href="/register"
                className="btn btn-light rounded-pill px-4 py-3 fw-bold d-inline-flex align-items-center gap-2 shadow-sm text-decoration-none"
                style={{
                  color: '#F97316',
                  backgroundColor: '#FFFFFF',
                  fontSize: '1.02rem',
                  border: 'none',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
                }}
              >
                <span>{t('about_cta_btn')}</span>
                <ArrowRight size={19} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
