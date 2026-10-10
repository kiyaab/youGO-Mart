'use client';

import React from 'react';
import { useLanguage } from '@/lib/language-context';
import { Tag, ShoppingBag, MessageSquare, ShieldCheck } from 'lucide-react';

export const ImpactSection: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    {
      icon: <Tag size={24} style={{ color: '#F97316' }} />,
      val: t('about_stat_1_val'),
      label: t('about_stat_1_label'),
      desc: t('about_stat_1_sub'),
    },
    {
      icon: <ShoppingBag size={24} style={{ color: '#F97316' }} />,
      val: t('about_stat_2_val'),
      label: t('about_stat_2_label'),
      desc: t('about_stat_2_sub'),
    },
    {
      icon: <MessageSquare size={24} style={{ color: '#F97316' }} />,
      val: t('about_stat_3_val'),
      label: t('about_stat_3_label'),
      desc: t('about_stat_3_sub'),
    },
    {
      icon: <ShieldCheck size={24} style={{ color: '#F97316' }} />,
      val: t('about_stat_4_val'),
      label: t('about_stat_4_label'),
      desc: t('about_stat_4_sub'),
    },
  ];

  return (
    <section className="py-5" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="container" style={{ maxWidth: '1240px' }}>
        <div
          className="bg-white p-4 p-md-5 rounded-4 shadow-sm"
          style={{
            border: '1px solid rgba(231, 229, 228, 0.8)',
          }}
        >
          <div className="row g-4 align-items-center text-center">
            {stats.map((item, idx) => (
              <div
                key={idx}
                className={`col-6 col-md-3 ${
                  idx < stats.length - 1 ? 'border-end-md' : ''
                }`}
                style={{
                  borderRight: idx < stats.length - 1 ? '1px solid rgba(231, 229, 228, 0.6)' : 'none',
                }}
              >
                <div className="d-flex flex-column align-items-center">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center mb-2 shadow-xs"
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: 'rgba(249, 115, 22, 0.1)',
                    }}
                  >
                    {item.icon}
                  </div>
                  <div
                    className="fw-black mb-1"
                    style={{
                      fontSize: 'clamp(1.8rem, 2.5vw, 2.3rem)',
                      color: '#F97316',
                      letterSpacing: '-0.03em',
                      fontWeight: 900,
                    }}
                  >
                    {item.val}
                  </div>
                  <div className="fw-bold mb-1" style={{ color: '#1C1917', fontSize: '0.98rem' }}>
                    {item.label}
                  </div>
                  <div className="text-muted small" style={{ fontSize: '0.8rem', maxWidth: '200px' }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
