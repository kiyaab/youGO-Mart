'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { ArrowRight, Sparkles, Heart, ShieldCheck, MapPin } from 'lucide-react';

export const StorySection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="our-story" className="py-5 py-lg-6 position-relative" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="container" style={{ maxWidth: '1240px' }}>
        <div className="row align-items-center g-5">
          {/* Left Column: Story Text & Action */}
          <div className="col-12 col-lg-6 text-start">
            {/* Eyebrow Label */}
            <div
              className="d-inline-flex align-items-center gap-1.5 px-3 py-1 rounded-pill mb-3"
              style={{
                backgroundColor: 'rgba(249, 115, 22, 0.1)',
                border: '1px solid rgba(249, 115, 22, 0.25)',
              }}
            >
              <span
                className="fw-bold"
                style={{
                  color: '#EA580C',
                  fontSize: '0.8rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {t('about_story_eyebrow')}
              </span>
            </div>

            {/* Headline */}
            <h2
              className="fw-black mb-3"
              style={{
                fontSize: 'clamp(2rem, 3.2vw, 2.75rem)',
                lineHeight: 1.2,
                letterSpacing: '-0.03em',
                color: '#1C1917',
                fontWeight: 900,
              }}
            >
              {t('about_story_title')}
            </h2>

            {/* Supporting Copy */}
            <p
              className="mb-4"
              style={{
                color: '#57534E',
                fontSize: '1.05rem',
                lineHeight: 1.7,
                maxWidth: '520px',
              }}
            >
              {t('about_story_desc')}
            </p>

            {/* Founder Note Quote */}
            <div
              className="p-3.5 p-sm-4 rounded-4 mb-4"
              style={{
                backgroundColor: '#FFF7F0',
                borderLeft: '4px solid #F97316',
              }}
            >
              <p className="small text-muted mb-2 fst-italic" style={{ lineHeight: 1.6 }}>
                &ldquo;Our vision is to empower everyday Ethiopian merchants, creators, and buyers to trade freely and transparently without paying unfair percentages or transaction barriers.&rdquo;
              </p>
              <div className="fw-bold small" style={{ color: '#C2410C' }}>
                Endegena Abebe <span className="fw-normal text-muted">— Founder, youGO-mart</span>
              </div>
            </div>

            {/* Action Button: Learn More */}
            <div>
              <Link
                href="/how-it-works"
                className="btn-orange rounded-pill px-4 py-2.5 fw-bold"
                style={{ fontSize: '0.98rem' }}
              >
                <span>{t('about_learn_more')}</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          {/* Right Column: Editorial Visual Composition */}
          <div className="col-12 col-lg-6 position-relative text-center">
            {/* Soft Organic Orange Backdrop */}
            <div
              className="position-absolute top-50 start-50 translate-middle"
              style={{
                width: '90%',
                height: '85%',
                borderRadius: '38% 62% 48% 52% / 55% 40% 60% 45%',
                background: 'linear-gradient(135deg, rgba(254, 215, 170, 0.5) 0%, rgba(249, 115, 22, 0.2) 100%)',
                filter: 'blur(14px)',
                zIndex: 0,
              }}
            />

            {/* Card Frame */}
            <div
              className="position-relative d-inline-block p-4 p-sm-5 rounded-5"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1.5px solid rgba(249, 115, 22, 0.2)',
                boxShadow: '0 20px 45px rgba(234, 88, 12, 0.08)',
                maxWidth: '480px',
                width: '100%',
                zIndex: 1,
              }}
            >
              {/* Badge: "Together We Go Further" */}
              <div
                className="position-absolute d-inline-flex align-items-center gap-1.5 px-3 py-1.5 rounded-pill shadow-sm"
                style={{
                  top: '-14px',
                  right: '10%',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid rgba(249, 115, 22, 0.35)',
                  boxShadow: '0 8px 20px rgba(249, 115, 22, 0.12)',
                  transform: 'rotate(-2deg)',
                  zIndex: 3,
                }}
              >
                <Heart size={15} style={{ color: '#F97316', fill: '#F97316' }} />
                <span className="fw-bold" style={{ color: '#C2410C', fontSize: '0.82rem' }}>
                  {t('about_story_badge')}
                </span>
              </div>

              {/* Mascot Centerpiece */}
              <div className="position-relative mx-auto my-2" style={{ maxWidth: '360px' }}>
                <Image
                  src="/images/mascot-3d-clean.png"
                  alt="youGO-mart Community"
                  width={1008}
                  height={985}
                  quality={92}
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 14px 28px rgba(234, 88, 12, 0.2))',
                  }}
                />
              </div>

              {/* Community Floating Cards */}
              <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-2">
                <div className="d-flex align-items-center gap-2 text-start">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '34px',
                      height: '34px',
                      backgroundColor: 'rgba(22, 163, 74, 0.12)',
                      color: '#16A34A',
                    }}
                  >
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <div className="fw-bold" style={{ fontSize: '0.82rem', color: '#1C1917' }}>
                      Addis Ababa & Regions
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.74rem' }}>
                      Empowering local commerce
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-1.5 text-muted small">
                  <MapPin size={15} style={{ color: '#F97316' }} />
                  <span className="fw-semibold">Ethiopia 🇪🇹</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
