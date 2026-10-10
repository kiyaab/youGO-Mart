'use client';

import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/lib/language-context';
import { Smartphone, Shield, Users, Leaf, Package } from 'lucide-react';

export const MissionSection: React.FC = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: <Smartphone size={22} />,
      title: t('about_val_convenience'),
      desc: t('about_val_convenience_desc'),
    },
    {
      icon: <Shield size={22} />,
      title: t('about_val_trust'),
      desc: t('about_val_trust_desc'),
    },
    {
      icon: <Users size={22} />,
      title: t('about_val_community'),
      desc: t('about_val_community_desc'),
    },
    {
      icon: <Leaf size={22} />,
      title: t('about_val_sustainability'),
      desc: t('about_val_sustainability_desc'),
    },
  ];

  return (
    <section
      className="py-5 py-lg-6 position-relative"
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid rgba(245, 245, 244, 0.8)',
      }}
    >
      <div className="container" style={{ maxWidth: '1240px' }}>
        <div className="row align-items-center g-5">
          {/* Left Column: Rounded Editorial Illustration */}
          <div className="col-12 col-lg-6 position-relative text-center order-2 order-lg-1">
            {/* Soft Organic Backdrop Shape */}
            <div
              className="position-absolute top-50 start-50 translate-middle"
              style={{
                width: '85%',
                height: '85%',
                borderRadius: '45% 55% 63% 37% / 50% 45% 55% 50%',
                background: 'linear-gradient(140deg, rgba(255, 237, 213, 0.6) 0%, rgba(254, 215, 170, 0.3) 100%)',
                zIndex: 0,
                filter: 'blur(10px)',
              }}
            />

            {/* Editorial Card Frame */}
            <div
              className="position-relative d-inline-block p-4 p-sm-5 rounded-5"
              style={{
                backgroundColor: 'rgba(255, 247, 240, 0.65)',
                border: '1.5px solid rgba(249, 115, 22, 0.15)',
                boxShadow: '0 16px 40px rgba(28, 25, 23, 0.04)',
                maxWidth: '480px',
                width: '100%',
                zIndex: 1,
              }}
            >
              {/* Playful Floating Annotation Pill */}
              <div
                className="position-absolute d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill shadow-sm"
                style={{
                  top: '-14px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid rgba(249, 115, 22, 0.3)',
                }}
              >
                <Package size={16} style={{ color: '#F97316' }} />
                <span className="fw-bold" style={{ color: '#C2410C', fontSize: '0.82rem' }}>
                  {t('about_door_to_door')}
                </span>
              </div>

              {/* Mascot in Action */}
              <div className="position-relative mx-auto my-2" style={{ maxWidth: '380px' }}>
                <Image
                  src="/images/mascot-3d-clean.png"
                  alt="youGO-mart Delivery"
                  width={1008}
                  height={985}
                  quality={92}
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 14px 28px rgba(234, 88, 12, 0.18))',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Mission Content & 4 Value Items */}
          <div className="col-12 col-lg-6 text-start order-1 order-lg-2">
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
                {t('about_mission_eyebrow')}
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
              {t('about_mission_title')}
            </h2>

            {/* Body Copy */}
            <p
              className="mb-4 pb-2"
              style={{
                color: '#57534E',
                fontSize: '1.05rem',
                lineHeight: 1.7,
                maxWidth: '540px',
              }}
            >
              {t('about_mission_desc')}
            </p>

            {/* Four Value Items in Clean Grid */}
            <div className="row g-3 g-sm-4 pt-1">
              {values.map((val, idx) => (
                <div key={idx} className="col-6">
                  <div className="d-flex align-items-start gap-2.5">
                    {/* Light Mist Circular Icon Background */}
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        width: '42px',
                        height: '42px',
                        backgroundColor: '#F5F5F5',
                        color: '#F97316',
                        border: '1px solid rgba(231, 229, 228, 0.8)',
                      }}
                    >
                      {val.icon}
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1" style={{ color: '#1C1917', fontSize: '0.94rem' }}>
                        {val.title}
                      </h6>
                      <p className="mb-0 text-muted" style={{ fontSize: '0.82rem', lineHeight: 1.4 }}>
                        {val.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
