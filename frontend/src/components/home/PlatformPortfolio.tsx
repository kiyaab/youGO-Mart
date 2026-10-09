'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { GoogleIcon } from '@/components/common/GoogleIcon';
import {
  Sparkles,
  ShieldCheck,
  Store,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  MessageCircle,
  MapPin,
  Lock,
  Globe2,
  Award,
} from 'lucide-react';

export const PlatformPortfolio: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <section className="py-5 position-relative overflow-hidden" style={{ borderBottom: '1px solid var(--border-color)' }}>
      <div className="container py-lg-4">
        {/* Section Header */}
        <div className="text-center mb-5" style={{ maxWidth: '780px', margin: '0 auto' }}>
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-warning bg-opacity-10 text-warning fw-bold small mb-2">
            <Award size={16} /> {t('about_title')}
          </div>
          <h2 className="fw-extrabold display-5 tracking-tight mb-3" style={{ color: 'var(--text-main)', letterSpacing: '-0.03em' }}>
            {language === 'am' ? 'ስለ ዩጎ-ማርት (youGO-mart) በዝርዝር' : 'Built for Ethiopia First, Ready for Africa'}
          </h2>
          <p className="lead text-muted" style={{ lineHeight: 1.6, fontSize: '1.1rem' }}>
            {t('about_desc')}
          </p>
        </div>

        {/* Founder & Vision Showcase Card */}
        <div className="glass-card p-4 p-md-5 mb-5 rounded-4 shadow-sm">
          <div className="row align-items-center g-4">
            <div className="col-lg-7">
              <span className="badge bg-dark text-white text-uppercase px-2.5 py-1 mb-2 fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                FOUNDER & ARCHITECT
              </span>
              <h3 className="fw-bold mb-2">Endegena Abebe</h3>
              <p className="text-muted mb-3" style={{ lineHeight: 1.7 }}>
                {t('founder_note')}
              </p>
              <div className="d-flex flex-wrap gap-3 small text-muted">
                <span className="d-flex align-items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-success" /> 0% Transaction Cuts
                </span>
                <span className="d-flex align-items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-success" /> Verified Ethiopian ID Checks
                </span>
                <span className="d-flex align-items-center gap-1.5">
                  <Globe2 size={16} className="text-primary" /> Scalable to African Economies
                </span>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="p-4 bg-warning bg-opacity-10 rounded-4 border border-warning">
                <h5 className="fw-bold text-dark mb-2">The Zero-Commission Promise</h5>
                <p className="small text-muted mb-3" style={{ lineHeight: 1.6 }}>
                  Traditional online stores charge up to 15% on each transaction. youGO-mart completely removes the middleman cut. Buyers and sellers communicate directly via Phone, WhatsApp, and in-platform messaging.
                </p>
                <div className="d-flex align-items-baseline gap-2">
                  <span className="display-6 fw-extrabold" style={{ color: 'var(--primary-orange)' }}>
                    0 ETB
                  </span>
                  <span className="small fw-bold text-muted">Platform Listing Cost</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TWO DEDICATED ROLES: SELLER & BUYER WITH GOOGLE AUTH */}
        <div className="row g-4 mb-5">
          {/* SELLER COLUMN */}
          <div className="col-md-6">
            <div className="glass-card p-4 p-lg-5 h-100 d-flex flex-column justify-content-between rounded-4 border-warning">
              <div>
                <div
                  className="d-inline-flex p-3 rounded-4 mb-3"
                  style={{ backgroundColor: 'rgba(249, 115, 22, 0.12)', color: 'var(--primary-orange)' }}
                >
                  <Store size={32} />
                </div>
                <div className="badge bg-warning text-dark text-uppercase mb-2 fw-bold" style={{ fontSize: '0.7rem' }}>
                  FOR MERCHANTS & SELLERS
                </div>
                <h3 className="fw-bold mb-2">
                  {language === 'am' ? 'ምርቶችዎን በነፃ ይሽጡ' : 'Sell Without Commission'}
                </h3>
                <p className="text-muted small mb-4" style={{ lineHeight: 1.6 }}>
                  List your smartphones, vehicles, laptops, fashion, or real estate in Addis Ababa. Receive instant phone calls and WhatsApp chats directly on your mobile device.
                </p>

                <ul className="list-unstyled d-flex flex-column gap-2 small text-muted mb-4">
                  <li className="d-flex align-items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" /> Unlimited free product postings
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" /> Direct phone & WhatsApp customer leads
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" /> Dedicated Seller Hub with performance metrics
                  </li>
                </ul>
              </div>

              {/* Seller Actions & Google Sign-In */}
              <div className="d-flex flex-column gap-2 pt-3 border-top">
                <Link href="/auth/register?role=seller" className="btn-orange w-100 py-3 fw-bold">
                  {t('join_as_seller')} <ArrowRight size={17} />
                </Link>
                <Link
                  href="/auth/register?role=seller&provider=google"
                  className="btn-google w-100 py-2.5 small"
                >
                  <GoogleIcon size={18} />
                  <span>{t('continue_with_google')} (Seller)</span>
                </Link>
              </div>
            </div>
          </div>

          {/* BUYER COLUMN */}
          <div className="col-md-6">
            <div className="glass-card p-4 p-lg-5 h-100 d-flex flex-column justify-content-between rounded-4 border-primary">
              <div>
                <div
                  className="d-inline-flex p-3 rounded-4 mb-3"
                  style={{ backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#2563EB' }}
                >
                  <ShoppingBag size={32} />
                </div>
                <div className="badge bg-primary text-white text-uppercase mb-2 fw-bold" style={{ fontSize: '0.7rem' }}>
                  FOR SMART SHOPPERS & BUYERS
                </div>
                <h3 className="fw-bold mb-2">
                  {language === 'am' ? 'ምርጥ ዕቃዎችን በአቅራቢያዎ ያግኙ' : 'Discover Genuine Local Deals'}
                </h3>
                <p className="text-muted small mb-4" style={{ lineHeight: 1.6 }}>
                  Search verified listings in Bole, Kazanchis, Piassa, Hawassa, and Adama. Negotiate prices directly with sellers, inspect items in person, and pay securely.
                </p>

                <ul className="list-unstyled d-flex flex-column gap-2 small text-muted mb-4">
                  <li className="d-flex align-items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" /> In-person product inspection before payment
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" /> Private chat & call options for every item
                  </li>
                  <li className="d-flex align-items-center gap-2">
                    <CheckCircle2 size={16} className="text-success" /> Saved favorites & local neighborhood filters
                  </li>
                </ul>
              </div>

              {/* Buyer Actions & Google Sign-In */}
              <div className="d-flex flex-column gap-2 pt-3 border-top">
                <Link href="/auth/register?role=buyer" className="btn btn-neutral w-100 py-3 fw-bold border-primary text-primary">
                  {t('join_as_buyer')} <ArrowRight size={17} />
                </Link>
                <Link
                  href="/auth/register?role=buyer&provider=google"
                  className="btn-google w-100 py-2.5 small"
                >
                  <GoogleIcon size={18} />
                  <span>{t('continue_with_google')} (Buyer)</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
