'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { Store, ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { GoogleIcon } from '@/components/common/GoogleIcon';

export const BecomeSellerCTA: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <section className="py-5" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container py-lg-4">
        <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm border-warning position-relative overflow-hidden">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="badge bg-warning text-dark text-uppercase px-3 py-1.5 rounded-pill fw-bold small mb-3">
                7. {t('become_seller_title')}
              </span>
              <h2 className="fw-bold display-6 mb-3" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                {language === 'am'
                  ? 'ምርቶችዎን በመላው ኢትዮጵያ በነፃ ይሽጡ'
                  : 'Start Selling Across Ethiopia with Zero Platform Fees'}
              </h2>
              <p className="lead text-muted mb-4" style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
                {t('become_seller_desc')}
              </p>

              <div className="d-flex flex-wrap gap-4 text-muted small mb-4">
                <span className="d-flex align-items-center gap-1.5 fw-semibold">
                  <CheckCircle2 size={17} className="text-success" /> Unlimited Free Listings
                </span>
                <span className="d-flex align-items-center gap-1.5 fw-semibold">
                  <CheckCircle2 size={17} className="text-success" /> Direct Phone & WhatsApp Calls
                </span>
                <span className="d-flex align-items-center gap-1.5 fw-semibold">
                  <CheckCircle2 size={17} className="text-success" /> 0% Transaction Commission
                </span>
              </div>

              <div className="d-flex flex-wrap align-items-center gap-3">
                <Link href="/auth/register?role=seller" className="btn-orange px-4 py-3 fw-bold">
                  <Store size={18} /> {t('join_as_seller')} <ArrowRight size={16} />
                </Link>
                <Link
                  href="/auth/register?role=seller&provider=google"
                  className="btn-google py-2.5 px-3.5 d-inline-flex"
                  style={{ width: 'auto' }}
                >
                  <GoogleIcon size={18} />
                  <span>{t('continue_with_google')} (Seller)</span>
                </Link>
              </div>
            </div>

            <div className="col-lg-5 text-center d-none d-lg-block">
              <div className="p-4 rounded-4 bg-warning bg-opacity-10 border border-warning text-start">
                <div className="d-flex align-items-center gap-2 mb-2 text-warning fw-bold">
                  <Zap size={20} />
                  <span>Instant Setup</span>
                </div>
                <h5 className="fw-bold mb-2">Open Storefront in 60 Seconds</h5>
                <p className="small text-muted mb-3" style={{ lineHeight: 1.6 }}>
                  No paperwork required for basic postings. Simply sign in with Google, fill in your store name and phone number, and begin welcoming buyers immediately.
                </p>
                <div className="d-flex align-items-baseline gap-2">
                  <span className="display-5 fw-extrabold" style={{ color: 'var(--primary-orange)' }}>
                    0 ETB
                  </span>
                  <span className="small text-muted fw-bold">Listing fee</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
