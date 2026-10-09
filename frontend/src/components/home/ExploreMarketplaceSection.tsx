'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { Search, SlidersHorizontal, MapPin, Tag, ArrowRight } from 'lucide-react';

export const ExploreMarketplaceSection: React.FC = () => {
  const { language, t } = useLanguage();

  const features = [
    {
      icon: Search,
      title: language === 'am' ? 'ፈጣን የፍለጋ ሞተር' : 'Real-Time Product Search',
      desc: language === 'am'
        ? 'በሺዎች ከሚቆጠሩ እቃዎች መካከል የሚፈልጉትን በስም ወይም በምድብ በቀላሉ ያግኙ።'
        : 'Find smartphones, cars, laptops, and fashion by title, keyword, or brand.',
    },
    {
      icon: MapPin,
      title: language === 'am' ? 'በአካባቢ ላይ የተመሰረተ ማጣሪያ' : 'Neighborhood & City Filters',
      desc: language === 'am'
        ? 'በአዲስ አበባ (ቦሌ፣ ካዛንቺስ፣ ፒያሳ) ወይም በሌሎች ከተሞች ያሉ እቃዎችን ይለዩ።'
        : 'Filter deals by location in Addis Ababa (Bole, Kazanchis, Piassa) or regional cities.',
    },
    {
      icon: SlidersHorizontal,
      title: language === 'am' ? 'ትክክለኛ የዋጋ እና ሁኔታ ማጣሪያ' : 'Price & Condition Filters',
      desc: language === 'am'
        ? 'በጀትዎን የሚመጥኑ አዳዲስ ወይም በጥሩ ሁኔታ ላይ ያሉ እቃዎችን ይምረጡ።'
        : 'Filter by exact price range in Ethiopian Birr (ETB) and product condition.',
    },
    {
      icon: Tag,
      title: language === 'am' ? 'የተረጋገጡ ሻጮች ባጅ' : 'Verified Merchant Badges',
      desc: language === 'am'
        ? 'የቀበሌ መታወቂያ እና የንግድ ፈቃድ ያረጋገጡ ሻጮችን በቀላሉ ለይተው ይወቁ።'
        : 'Identify trusted merchants with verified Kebele ID and Commercial Registration.',
    },
  ];

  return (
    <section className="py-5" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container py-lg-3">
        <div className="text-center mb-5" style={{ maxWidth: '680px', margin: '0 auto' }}>
          <span className="badge bg-warning bg-opacity-10 text-warning text-uppercase px-3 py-1.5 rounded-pill fw-bold small mb-2">
            1. {t('explore_marketplace_title')}
          </span>
          <h2 className="fw-bold h2 mb-2" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {language === 'am' ? 'ቀላል፣ ፈጣን እና አስተማማኝ ግብይት' : 'Smart Product Discovery for Ethiopia'}
          </h2>
          <p className="text-muted small m-0">
            {t('explore_marketplace_desc')}
          </p>
        </div>

        <div className="row g-4 mb-4">
          {features.map((item, idx) => (
            <div key={idx} className="col-12 col-sm-6 col-lg-3">
              <div className="glass-card p-4 h-100 rounded-4 d-flex flex-column justify-content-between">
                <div>
                  <div
                    className="d-inline-flex p-3 rounded-3 mb-3"
                    style={{ backgroundColor: 'var(--primary-orange-light)', color: 'var(--primary-orange)' }}
                  >
                    <item.icon size={22} />
                  </div>
                  <h6 className="fw-bold mb-2">{item.title}</h6>
                  <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-3">
          <Link href="/search" className="btn-orange px-4 py-2.5">
            {t('explore_products')} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};
