'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { Store, Percent, PhoneCall, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, TrendingUp, Boxes } from 'lucide-react';

export default function ForSellersPage() {
  const { language, t } = useLanguage();

  return (
    <div className="py-4" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container mb-4">
        <div className="text-center py-5" style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ backgroundColor: 'var(--primary-orange-light)', color: 'var(--primary-orange)' }}>
            <Store size={36} />
          </div>
          <h1 className="display-5 fw-bold mb-3" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {language === 'am' ? 'በ ዩጎ-ማርት ላይ ይሽጡ' : 'Sell on youGO-mart'}
          </h1>
          <p className="lead text-muted mb-4" style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
            {language === 'am'
              ? 'ምርቶችዎን ለሺዎች የኢትዮጵያ ገዢዎች በነፃ ያቅርቡ። ምንም አይነት የኮሚሽን ቅናሽ የለም፤ ሙሉ ገቢው የእርስዎ ነው።'
              : 'Empower your business with direct buyer leads, free standard listings, and zero sales commissions.'}
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link href="/auth/register?role=seller" className="btn-orange px-4 py-2.5">
              {t('join_as_seller')} <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* 3 Pillars for Sellers */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="glass-card p-4 rounded-4 h-100 text-center">
              <div className="p-3 rounded-circle d-inline-flex mb-3" style={{ backgroundColor: 'var(--primary-orange-light)', color: 'var(--primary-orange)' }}>
                <Percent size={28} />
              </div>
              <h5 className="fw-bold mb-2">0% Commission</h5>
              <p className="small text-muted mb-0">
                {language === 'am'
                  ? 'ከሽያጭዎ ምንም አይነት ኮሚሽን አንወስድም። እያንዳንዱን ብር ለራስዎ ንግድ ያውላሉ።'
                  : 'Keep 100% of your earnings. Standard listings are completely free with zero commission fees.'}
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="glass-card p-4 rounded-4 h-100 text-center">
              <div className="p-3 rounded-circle d-inline-flex mb-3" style={{ backgroundColor: 'var(--primary-orange-light)', color: 'var(--primary-orange)' }}>
                <PhoneCall size={28} />
              </div>
              <h5 className="fw-bold mb-2">Direct Buyer Leads</h5>
              <p className="small text-muted mb-0">
                {language === 'am'
                  ? 'ገዢዎች በቀጥታ በስልክ፣ በዋትስአፕ ወይም በውስጥ መልእክት ያግኙዎታል።'
                  : 'Buyers contact you directly via phone, WhatsApp, or platform messaging for quick deals.'}
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="glass-card p-4 rounded-4 h-100 text-center">
              <div className="p-3 rounded-circle d-inline-flex mb-3" style={{ backgroundColor: 'var(--primary-orange-light)', color: 'var(--primary-orange)' }}>
                <ShieldCheck size={28} />
              </div>
              <h5 className="fw-bold mb-2">Verified Merchant Trust</h5>
              <p className="small text-muted mb-0">
                {language === 'am'
                  ? 'በቀላል የመታወቂያ ማረጋገጫ የክብር ባጅ ያግኙ እና የደንበኞችን እምነት ያሳድጉ።'
                  : 'Build credibility with a verified badge through simple Ethiopian ID or business license verification.'}
              </p>
            </div>
          </div>
        </div>

        {/* Seller Registration CTA */}
        <div className="glass-card p-5 rounded-4 text-center border-orange">
          <h3 className="fw-bold mb-2">Ready to expand your business?</h3>
          <p className="text-muted small mb-4">
            Join hundreds of Ethiopian merchants on youGO-mart today.
          </p>
          <Link href="/auth/register?role=seller" className="btn-orange px-5 py-3 fw-bold">
            Register as a Seller & Open Store
          </Link>
        </div>
      </div>
    </div>
  );
}
