'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { ForSellersSection } from '@/components/home/ForSellersSection';
import { BecomeSellerCTA } from '@/components/home/BecomeSellerCTA';
import { Store, Percent, PhoneCall, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ForSellersPage() {
  const { language, t } = useLanguage();

  return (
    <div className="py-4" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container mb-4">
        <div className="text-center py-5" style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div className="d-inline-flex p-3 rounded-circle bg-warning bg-opacity-10 text-warning mb-3">
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

        <ForSellersSection />
        <BecomeSellerCTA />
      </div>
    </div>
  );
}
