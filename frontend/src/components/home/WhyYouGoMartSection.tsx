'use client';

import React from 'react';
import { useLanguage } from '@/lib/language-context';
import { ShieldCheck, Percent, PhoneCall, Globe2, CheckCircle2, Lock } from 'lucide-react';

export const WhyYouGoMartSection: React.FC = () => {
  const { language, t } = useLanguage();

  const benefits = [
    {
      icon: Percent,
      title: language === 'am' ? '0% የሽያጭ ኮሚሽን ዋስትና' : '0% Commission Guarantee',
      desc: language === 'am'
        ? 'የተለመዱ የመስመር ላይ መደብሮች እስከ 15% ኮሚሽን ይቆርጣሉ። ዩጎ-ማርት ምንም አይነት የሽያጭ ኮሚሽን አይቆርጥም።'
        : 'Traditional online stores charge up to 15% per sale. youGO-mart takes zero commission, leaving all profits with the seller.',
    },
    {
      icon: PhoneCall,
      title: language === 'am' ? 'ቀጥታ ግንኙነት እና ድርድር' : 'Direct Buyer & Seller Negotiation',
      desc: language === 'am'
        ? 'በስልክ እና በ WhatsApp በቀጥታ በመደወል ዋጋ ይደራደሩ እና ቀጠሮ ይያዙ።'
        : 'Negotiate price and organize delivery directly over phone, WhatsApp, or message with zero middlemen.',
    },
    {
      icon: ShieldCheck,
      title: language === 'am' ? 'የተረጋገጠ የአገር ውስጥ ደህንነት' : 'Verified Local Identity',
      desc: language === 'am'
        ? 'ሻጮች የቀበሌ መታወቂያቸውን ወይም የንግድ ፈቃዳቸውን በማረጋገጥ የህዝብ አመኔታ ያገኛሉ።'
        : 'Sellers can verify credentials using Ethiopian Kebele ID or commercial registration for maximum trust.',
    },
    {
      icon: Globe2,
      title: language === 'am' ? 'ሁለት ቋንቋ (አማርኛ እና እንግሊዝኛ)' : 'Bilingual Ethiopian First',
      desc: language === 'am'
        ? 'ለሁሉም ዜጎች ተደራሽ እንዲሆን ሙሉ በሙሉ በአማርኛ እና በእንግሊዝኛ የተዘጋጀ።'
        : 'Full platform bilingual capability designed from the ground up for Ethiopia and expanding across Africa.',
    },
  ];

  return (
    <section className="py-5" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container py-lg-4">
        <div className="text-center mb-5" style={{ maxWidth: '680px', margin: '0 auto' }}>
          <span className="badge bg-warning bg-opacity-10 text-warning text-uppercase px-3 py-1.5 rounded-pill fw-bold small mb-2">
            5. {t('why_yougo_title')}
          </span>
          <h2 className="fw-bold h2 mb-2" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {language === 'am' ? 'እውነተኛ እና አስተማማኝ ጥቅሞች' : 'Actual Platform Advantages'}
          </h2>
          <p className="text-muted small m-0">
            {language === 'am'
              ? 'ተራ ዜጎችን እና ንግዶችን ተጠቃሚ የሚያደርግ ፍትሃዊ የገበያ መድረክ።'
              : 'Built for authentic peer-to-peer commerce without invented claims or hidden charges.'}
          </p>
        </div>

        <div className="row g-4">
          {benefits.map((b, idx) => (
            <div key={idx} className="col-12 col-md-6">
              <div className="glass-card p-4 p-md-4.5 h-100 rounded-4 d-flex align-items-start gap-3">
                <div
                  className="p-3 rounded-3 flex-shrink-0"
                  style={{ backgroundColor: 'var(--primary-orange-light)', color: 'var(--primary-orange)' }}
                >
                  <b.icon size={26} />
                </div>
                <div>
                  <h5 className="fw-bold mb-2">{b.title}</h5>
                  <p className="text-muted small mb-0" style={{ lineHeight: 1.65 }}>
                    {b.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
