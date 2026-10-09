'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { ShoppingCart, Heart, ShieldCheck, MapPin, Clock, ArrowRight, UserCheck } from 'lucide-react';

export const ForBuyersSection: React.FC = () => {
  const { language, t } = useLanguage();

  const buyerHighlights = [
    {
      icon: ShoppingCart,
      title: language === 'am' ? 'ዘመናዊ የግዢ ጋሪ' : 'Smart Shopping Cart & Instant Orders',
      desc: language === 'am'
        ? 'የተመረጡ እቃዎችን በአንድ ላይ በመሰብሰብ በቀላሉ ትዕዛዝዎን ያጠናቁ።'
        : 'Collect items across stores and submit orders with transparent subtotal calculation in ETB.',
    },
    {
      icon: Heart,
      title: language === 'am' ? 'የተወደዱ እቃዎች ዝርዝር' : 'Personalized Wishlists',
      desc: language === 'am'
        ? 'በማንኛውም ጊዜ በቀላሉ ለማግኘት እና የዋጋ ለውጦችን ለመከታተል እቃዎችን ያስቀምጡ።'
        : 'Save favorite listings with one tap and track price drops across Addis Ababa.',
    },
    {
      icon: Clock,
      title: language === 'am' ? 'የትዕዛዝ ሁኔታ ክትትል' : 'Live Order Tracking',
      desc: language === 'am'
        ? 'ትዕዛዝዎ ከተረጋገጠበት ጊዜ ጀምሮ እስኪደርስዎት ድረስ ያለውን ሁኔታ በቀጥታ ይከታተሉ።'
        : 'Monitor fulfillment stages from pending confirmation to dispatch and delivery.',
    },
    {
      icon: UserCheck,
      title: language === 'am' ? 'ደህንነቱ የተጠበቀ መለያ' : 'Secure Account Experience',
      desc: language === 'am'
        ? 'በ Google OAuth ጥበቃ የተደረገለት የግል ዳሽቦርድ እና የቋንቋ ምርጫዎች።'
        : 'Google OAuth identity protection with isolated buyer portal and bilingual preferences.',
    },
  ];

  return (
    <section className="py-5" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container py-lg-4">
        <div className="row align-items-center g-5">
          <div className="col-lg-5">
            <span className="badge bg-primary bg-opacity-10 text-primary text-uppercase px-3 py-1.5 rounded-pill fw-bold small mb-2">
              3. {t('for_buyers')}
            </span>
            <h2 className="fw-bold h2 mb-3" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {language === 'am' ? 'ለገዢዎች የተሟላ የሸመታ ምቾት' : 'A Dedicated Experience Built for Shoppers'}
            </h2>
            <p className="lead text-muted mb-4" style={{ fontSize: '1.05rem', lineHeight: 1.6 }}>
              {language === 'am'
                ? 'የሚፈልጉትን እቃ በአቅራቢያዎ ያግኙ፣ በግዢ ጋሪዎ ይሰብስቡ፣ እና ከታመኑ ሻጮች ጋር በነፃነት ይገናኙ።'
                : 'Browse verified listings, save favorites to your wishlist, manage functional shopping carts, and track genuine orders across Ethiopia.'}
            </p>
            <Link href="/auth/register?role=buyer" className="btn-orange px-4 py-2.5">
              {t('join_as_buyer')} <ArrowRight size={16} />
            </Link>
          </div>

          <div className="col-lg-7">
            <div className="row g-3">
              {buyerHighlights.map((hl, idx) => (
                <div key={idx} className="col-sm-6">
                  <div className="glass-card p-4 h-100 rounded-4">
                    <div
                      className="d-inline-flex p-2.5 rounded-3 mb-3"
                      style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#2563EB' }}
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
