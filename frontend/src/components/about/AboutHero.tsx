'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/language-context';
import { Zap, ShieldCheck, Sparkles } from 'lucide-react';

export const AboutHero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section
      className="position-relative overflow-hidden py-5 py-lg-6"
      style={{
        backgroundColor: '#FFFFFF',
      }}
    >
      <div className="container position-relative" style={{ maxWidth: '1240px', zIndex: 2 }}>
        <div className="row align-items-center g-5">
          {/* Left Column: Text & Value Propositions */}
          <div className="col-12 col-lg-6 text-start">
            {/* Eyebrow Label */}
            <div className="d-inline-flex align-items-center gap-1.5 px-3 py-1 rounded-pill mb-3"
              style={{
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                border: '1px solid rgba(249, 115, 22, 0.25)',
              }}
            >
              <Sparkles size={14} style={{ color: '#F97316' }} />
              <span
                className="fw-bold"
                style={{
                  color: '#EA580C',
                  fontSize: '0.8rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {t('about_hero_eyebrow')}
              </span>
            </div>

            {/* Main Headline */}
            <h1
              className="fw-black mb-3"
              style={{
                fontSize: 'clamp(2.3rem, 4vw, 3.6rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.035em',
                color: '#1C1917',
                fontWeight: 900,
              }}
            >
              {t('about_hero_title_1')}{' '}
              <br className="d-none d-sm-inline" />
              {t('about_hero_title_2')}{' '}
              <span
                className="position-relative d-inline-block"
                style={{ color: '#F97316' }}
              >
                {t('about_hero_title_highlight')}
                {/* Curved / hand-drawn orange accent stroke */}
                <svg
                  className="position-absolute start-0 w-100"
                  style={{
                    bottom: '-8px',
                    height: '10px',
                    overflow: 'visible',
                  }}
                  viewBox="0 0 240 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 8.5C65 2.5 175 1.5 237 8"
                    stroke="#F97316"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            {/* Supporting Copy */}
            <p
              className="mb-4 mt-4"
              style={{
                color: '#57534E',
                fontSize: 'clamp(1.05rem, 1.25vw, 1.2rem)',
                lineHeight: 1.65,
                maxWidth: '520px',
              }}
            >
              {t('about_hero_desc')}
            </p>

            {/* Benefit Indicators */}
            <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-3 gap-sm-4 pt-2">
              {/* Benefit 1: Fast Delivery */}
              <div className="d-flex align-items-center gap-2.5">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center shadow-sm flex-shrink-0"
                  style={{
                    width: '42px',
                    height: '42px',
                    backgroundColor: 'rgba(249, 115, 22, 0.12)',
                    color: '#F97316',
                  }}
                >
                  <Zap size={20} />
                </div>
                <div>
                  <div className="fw-bold" style={{ color: '#1C1917', fontSize: '0.94rem' }}>
                    {t('about_fast_delivery')}
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.82rem' }}>
                    {t('about_fast_delivery_desc')}
                  </div>
                </div>
              </div>

              {/* Benefit 2: Trusted by Millions */}
              <div className="d-flex align-items-center gap-2.5">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center shadow-sm flex-shrink-0"
                  style={{
                    width: '42px',
                    height: '42px',
                    backgroundColor: 'rgba(249, 115, 22, 0.12)',
                    color: '#F97316',
                  }}
                >
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="fw-bold" style={{ color: '#1C1917', fontSize: '0.94rem' }}>
                    {t('about_trusted')}
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.82rem' }}>
                    {t('about_trusted_desc')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Delivery Mascot Artwork with Organic Shape & Badge */}
          <div className="col-12 col-lg-6 text-center position-relative">
            {/* Organic Soft Orange Abstract Shape in Background */}
            <div
              className="position-absolute top-50 start-50 translate-middle"
              style={{
                width: '90%',
                maxWidth: '540px',
                height: '85%',
                borderRadius: '62% 38% 70% 30% / 45% 55% 45% 55%',
                background: 'linear-gradient(135deg, rgba(254, 215, 170, 0.45) 0%, rgba(251, 146, 60, 0.28) 50%, rgba(249, 115, 22, 0.15) 100%)',
                filter: 'blur(16px)',
                zIndex: 0,
                pointerEvents: 'none',
              }}
            />

            {/* Mascot Wrapper */}
            <div
              className="position-relative d-inline-block mx-auto"
              style={{
                maxWidth: '520px',
                width: '100%',
                zIndex: 1,
              }}
            >
              {/* Handwritten style badge: "Shop Smarter, Live Better" */}
              <div
                className="position-absolute d-inline-flex align-items-center gap-1.5 px-3 py-1.5 rounded-pill shadow-sm"
                style={{
                  top: '4%',
                  right: '2%',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid rgba(249, 115, 22, 0.35)',
                  boxShadow: '0 8px 24px rgba(249, 115, 22, 0.15)',
                  zIndex: 3,
                  transform: 'rotate(3deg)',
                }}
              >
                <span
                  className="fw-bold"
                  style={{
                    color: '#EA580C',
                    fontSize: '0.85rem',
                    fontStyle: 'italic',
                    letterSpacing: '-0.01em',
                  }}
                >
                  ✨ {t('about_badge_shop_smarter')}
                </span>
              </div>

              {/* 3D Mascot Image */}
              <Image
                src="/images/mascot-3d-clean.png"
                alt="youGO-mart Delivery Mascot"
                width={1008}
                height={985}
                priority
                quality={95}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 20px 35px rgba(234, 88, 12, 0.22))',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
