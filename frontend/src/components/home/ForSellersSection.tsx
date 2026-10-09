'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { Store, Package, BarChart3, ShieldCheck, Tag, ArrowRight } from 'lucide-react';

export const ForSellersSection: React.FC = () => {
  const { language, t } = useLanguage();

  const sellerHighlights = [
    {
      icon: Store,
      title: language === 'am' ? 'የግል ዲጂታል ሱቅ' : 'Branded Merchant Storefront',
      desc: language === 'am'
        ? 'የሱቅዎን ስም፣ አድራሻ እና የስልክ አድራሻዎች የያዘ የራስዎ የንግድ ገጽ ይፍጠሩ።'
        : 'Launch your store profile with your business name, neighborhood, and direct call settings.',
    },
    {
      icon: Package,
      title: language === 'am' ? 'የእቃዎች እና ክምችት አስተዳደር' : 'Inventory & Product Controls',
      desc: language === 'am'
        ? 'ምርቶችን ይለጥፉ፣ ዋጋን ያስተካክሉ፣ እና ያለቁ እቃዎችን በማንኛውም ጊዜ ያዘምኑ።'
        : 'Upload real product photos, update pricing in ETB, and manage availability statuses.',
    },
    {
      icon: BarChart3,
      title: language === 'am' ? 'እውነተኛ የሽያጭ እና የእይታ ትንተና' : 'Real Database Analytics',
      desc: language === 'am'
        ? 'የደንበኞች እይታዎችን እና የስልክ/WhatsApp ጥሪዎችን በቀጥታ ይከታተሉ።'
        : 'Track genuine buyer views, inquiries, and phone clicks computed from real database records.',
    },
    {
      icon: ShieldCheck,
      title: language === 'am' ? 'የተረጋገጠ ሻጭ ባጅ' : 'Verified Seller Badge Application',
      desc: language === 'am'
        ? 'የቀበሌ ወይም የንግድ ፈቃድ በማስገባት በገዢዎች ዘንድ ከፍተኛ አመኔታ ያግኙ።'
        : 'Submit Ethiopian business documents to earn verified badge status and boost buyer inquiries.',
    },
  ];

  return (
    <section className="py-5" style={{ backgroundColor: '#FFF7F0', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container py-lg-4">
        <div className="row align-items-center g-5 flex-lg-row-reverse">
          <div className="col-lg-5">
            <span className="badge bg-warning bg-opacity-10 text-warning text-uppercase px-3 py-1.5 rounded-pill fw-bold small mb-2">
              4. {t('for_sellers')}
            </span>
            <h2 className="fw-bold h2 mb-3" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {language === 'am' ? 'ለንግድዎ እድገት የተዘጋጀ የስራ ገጽ' : 'A Powerful Workspace to Run Your Business'}
            </h2>
            <p className="lead text-muted mb-4" style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
              {language === 'am'
                ? 'ምርቶችዎን ለሺዎች ያቅርቡ፣ የገዢዎችን ትዕዛዝ ያስተዳድሩ፣ እና ያለ ምንም የኮሚሽን ቅናሽ 100% ገቢዎን ይያዙ።'
                : 'Manage store profiles, publish unlimited product listings, review real buyer leads, and keep 100% of your earnings with zero commission.'}
            </p>
            <Link href="/auth/register?role=seller" className="btn-orange px-4 py-2.5">
              {t('join_as_seller')} <ArrowRight size={16} />
            </Link>
          </div>

          <div className="col-lg-7">
            <div className="row g-3">
              {sellerHighlights.map((hl, idx) => (
                <div key={idx} className="col-sm-6">
                  <div className="glass-card p-4 h-100 rounded-4 border-warning">
                    <div
                      className="d-inline-flex p-2.5 rounded-3 mb-3"
                      style={{ backgroundColor: 'var(--primary-orange-light)', color: 'var(--primary-orange)' }}
                    >
                      <hl.icon size={22} />
                    </div>
                    <h6 className="fw-bold mb-2">{hl.title}</h6>
                    <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>
                      {hl.desc}
                    </p>
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
