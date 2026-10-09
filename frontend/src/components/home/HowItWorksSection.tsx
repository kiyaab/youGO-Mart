'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { ShoppingBag, Store, Search, PhoneCall, CheckCircle2, PackagePlus, Eye, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const { language, t } = useLanguage();

  const buyerSteps = [
    {
      num: '1',
      title: language === 'am' ? 'ምርቶችን ያስሱ' : 'Browse & Discover',
      desc: language === 'am'
        ? 'በአቅራቢያዎ ያሉ እቃዎችን በዋጋ፣ በምድብ እና በአካባቢ ይፈልጉ።'
        : 'Explore thousands of verified listings in Addis Ababa and across Ethiopia.',
    },
    {
      num: '2',
      title: language === 'am' ? 'ወደ ጋሪ ጨምር ወይም ይደውሉ' : 'Add to Cart or Contact Seller',
      desc: language === 'am'
        ? 'ትዕዛዝ ይስጡ ወይም በቀጥታ በስልክ እና በ WhatsApp ከሻጩ ጋር ይነጋገሩ።'
        : 'Place an order in your shopping cart or connect directly via phone call & WhatsApp.',
    },
    {
      num: '3',
      title: language === 'am' ? 'በአካል ይፈትሹና ይክፈሉ' : 'Inspect & Settle Safely',
      desc: language === 'am'
        ? 'እቃውን በአስተማማኝ የህዝብ ቦታ በአካል አይተው በቴሌብር ወይም በጥሬ ገንዘብ ይክፈሉ።'
        : 'Meet in a busy public area, verify the item in person, and pay securely.',
    },
  ];

  const sellerSteps = [
    {
      num: '1',
      title: language === 'am' ? 'ሱቅዎን በነፃ ይክፈቱ' : 'Create Free Storefront',
      desc: language === 'am'
        ? 'በ Google ወይም በኢሜይል በደቂቃዎች ውስጥ ይመዝገቡ፤ ምንም የክፍያ ቅድመ-ሁኔታ የለም።'
        : 'Register with Google or email in seconds. No upfront fees, no subscription required.',
    },
    {
      num: '2',
      title: language === 'am' ? 'ምርቶችዎን ይለጥፉ' : 'Publish Products',
      desc: language === 'am'
        ? 'ፎቶዎችን፣ ዋጋን እና ዝርዝር መግለጫዎችን በመጨመር እቃዎችዎን ለገዢዎች ያቅርቡ።'
        : 'Upload genuine photos, transparent prices in ETB, and clear descriptions.',
    },
    {
      num: '3',
      title: language === 'am' ? '100% ገቢዎን ይያዙ' : 'Keep 100% of Your Profits',
      desc: language === 'am'
        ? 'ምንም አይነት የኮሚሽን ቅናሽ አይደረግም፤ ሙሉ ገቢው በቀጥታ ወደ እርስዎ ይገባል።'
        : '0% sales commission cuts. Every Birr earned belongs entirely to your business.',
    },
  ];

  return (
    <section className="py-5" style={{ backgroundColor: '#FFF7F0', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container py-lg-4">
        <div className="text-center mb-5" style={{ maxWidth: '680px', margin: '0 auto' }}>
          <span className="badge bg-warning bg-opacity-10 text-warning text-uppercase px-3 py-1.5 rounded-pill fw-bold small mb-2">
            2. {t('how_it_works_title')}
          </span>
          <h2 className="fw-bold h2 mb-2" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {language === 'am' ? 'ግልጽ እና ቀላል የግብይት ሂደት' : 'Clear & Transparent Steps for Everyone'}
          </h2>
          <p className="text-muted small m-0">
            {language === 'am'
              ? 'ለገዢዎች እና ለሻጮች የተዘጋጀ ቀላሉ የኢትዮጵያ ዲጂታል የገበያ መድረክ።'
              : 'Designed for everyday convenience, zero transaction cuts, and direct trust.'}
          </p>
        </div>

        <div className="row g-4">
          {/* FOR BUYERS */}
          <div className="col-lg-6">
            <div className="glass-card p-4 p-md-5 h-100 rounded-4">
              <div className="d-flex align-items-center gap-2 mb-4">
                <div className="p-2.5 rounded-3 bg-primary bg-opacity-10 text-primary">
                  <ShoppingBag size={22} />
                </div>
                <h4 className="fw-bold m-0" style={{ color: 'var(--text-main)' }}>
                  {language === 'am' ? 'ለገዢዎች የሚሰሩ ደረጃዎች' : 'How It Works for Buyers'}
                </h4>
              </div>

              <div className="d-flex flex-column gap-4">
                {buyerSteps.map((step, idx) => (
                  <div key={idx} className="d-flex align-items-start gap-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                      style={{ width: '36px', height: '36px', backgroundColor: '#2563EB', fontSize: '0.9rem' }}
                    >
                      {step.num}
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">{step.title}</h6>
                      <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-top">
                <Link href="/search" className="btn btn-neutral px-4 py-2 small fw-bold">
                  {t('start_shopping')} <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>

          {/* FOR SELLERS */}
          <div className="col-lg-6">
            <div className="glass-card p-4 p-md-5 h-100 rounded-4 border-warning">
              <div className="d-flex align-items-center gap-2 mb-4">
                <div className="p-2.5 rounded-3 bg-warning bg-opacity-10 text-warning">
                  <Store size={22} />
                </div>
                <h4 className="fw-bold m-0" style={{ color: 'var(--text-main)' }}>
                  {language === 'am' ? 'ለሻጮች የሚሰሩ ደረጃዎች' : 'How It Works for Sellers'}
                </h4>
              </div>

              <div className="d-flex flex-column gap-4">
                {sellerSteps.map((step, idx) => (
                  <div key={idx} className="d-flex align-items-start gap-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white flex-shrink-0"
                      style={{ width: '36px', height: '36px', backgroundColor: 'var(--primary-orange)', fontSize: '0.9rem' }}
                    >
                      {step.num}
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">{step.title}</h6>
                      <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-top">
                <Link href="/auth/register?role=seller" className="btn-orange px-4 py-2 small">
                  {t('become_a_seller')} <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
