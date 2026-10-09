'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const { language, t } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: language === 'am' ? 'በ ዩጎ-ማርት ላይ እቃዎችን ለመሸጥ ክፍያ ይጠየቃል?' : 'Are there any fees or commissions to list and sell products?',
      a: language === 'am'
        ? 'በፍጹም! ዩጎ-ማርት 100% ነፃ የገበያ መድረክ ነው። ምንም አይነት የማስታወቂያ መለጠፊያ ክፍያ ወይም የሽያጭ ኮሚሽን አይቆረጥም። ያገኙት ሙሉ ገቢ የእርስዎ ነው።'
        : 'Never! youGO-mart guarantees 0% sales commission on all standard listings. You keep 100% of the price negotiated with your buyer.',
    },
    {
      q: language === 'am' ? 'በገዢ እና በሻጭ መካከል ክፍያ የሚፈጸመው እንዴት ነው?' : 'How are payments handled between buyers and sellers?',
      a: language === 'am'
        ? 'ክፍያዎች በገዢ እና በሻጭ መካከል በቀጥታ ይፈጸማሉ። እቃውን በአካል ከተመለከቱ እና ካረጋገጡ በኋላ በቴሌብር (Telebirr)፣ በሲቢኢ ብር (CBE Birr)፣ በባንክ ሂሳብ ወይም በጥሬ ገንዘብ መክፈል ይችላሉ።'
        : 'Payments are settled directly between buyers and sellers upon in-person inspection via Telebirr, CBE Birr, bank transfer, or cash. Never wire advance deposits prior to inspection.',
    },
    {
      q: language === 'am' ? 'የተረጋገጠ የሻጭ ባጅ (Verified Badge) እንዴት ማግኘት ይቻላል?' : 'How do sellers obtain the Verified Seller badge?',
      a: language === 'am'
        ? 'በሻጭ ዳሽቦርድ ውስጥ "ባጅ ጠይቅ" የሚለውን በመጫን የኢትዮጵያ የቀበሌ/ብሔራዊ መታወቂያ ወይም የንግድ ምዝገባ ፈቃድ ፎቶ በማያያዝ ማመልከት ይችላሉ። የአስተዳዳሪ ቡድናችን መረጃውን መርምሮ ያረጋግጣል።'
        : 'In your Seller Workspace, click "Request Verified Badge" and submit your Ethiopian National ID or Business Registration license. Our moderation team reviews and grants the badge.',
    },
    {
      q: language === 'am' ? 'አንድ ተጠቃሚ ሁለቱንም የገዢ እና የሻጭ ዳሽቦርድ በአንድ ጊዜ ማግኘት ይችላል?' : 'Can a single account access both Buyer and Seller dashboards simultaneously?',
      a: language === 'am'
        ? 'ደህንነትን እና ግልጽነትን ለመጠበቅ ዩጎ-ማርት ጥብቅ የፍቃድ ቁጥጥር (Strict RBAC) ይከተላል። ገዢዎች ወደ ሻጭ ገጽ ወይም ሻጮች ወደ ገዢ ገጽ እንዳይገቡ ተከልክለዋል። መገለጫዎን መቀየር ከፈለጉ በመገለጫ ቅንብሮች ውስጥ በደህንነት ማሻሻል ይቻላል።'
        : 'To ensure strict role-based integrity and data protection, Buyer and Seller workspaces are strictly separated. Sellers manage inventory, whereas Buyers manage wishlists and carts.',
    },
    {
      q: language === 'am' ? 'አጠራጣሪ ወይም ህገወጥ ማስታወቂያ ካየሁ ምን ማድረግ አለብኝ?' : 'What should I do if I encounter a suspicious listing or fake seller?',
      a: language === 'am'
        ? 'በማንኛውም ምርት ገጽ ላይ ያለውን "ሪፖርት አድርግ" (Report Listing) የሚለውን ቁልፍ በመጫን ወዲያውኑ ያስታውቁን። የአወያይ ቡድናችን አጣርቶ አስፈላጊውን እርምጃ ይወስዳል።'
        : 'Click the "Report Listing" button on any product detail page. Our admin moderation team investigates reports within 24 hours to suspend fraudulent accounts.',
    },
  ];

  return (
    <section className="py-5" style={{ backgroundColor: '#FFF7F0', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container py-lg-4" style={{ maxWidth: '820px' }}>
        <div className="text-center mb-5">
          <span className="badge bg-warning bg-opacity-10 text-warning text-uppercase px-3 py-1.5 rounded-pill fw-bold small mb-2">
            8. {t('faq_title')}
          </span>
          <h2 className="fw-bold h2 mb-2" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {language === 'am' ? 'የተለመዱ ጥያቄዎች እና መልሶቻቸው' : 'Everything You Need to Know'}
          </h2>
          <p className="text-muted small m-0">
            {language === 'am'
              ? 'ስለ ዩጎ-ማርት መለያዎች፣ ትዕዛዞች፣ እና የግብይት ደንቦች ግልጽ መረጃዎች።'
              : 'Clear answers about accounts, direct transactions, stores, and platform security.'}
          </p>
        </div>

        <div className="d-flex flex-column gap-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="glass-card p-3.5 p-md-4 rounded-4 shadow-sm"
              style={{ cursor: 'pointer' }}
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            >
              <div className="d-flex align-items-center justify-content-between gap-3">
                <h6 className="fw-bold m-0" style={{ color: 'var(--text-main)', fontSize: '0.96rem' }}>
                  {faq.q}
                </h6>
                <ChevronDown
                  size={18}
                  className={`text-muted transition-all flex-shrink-0 ${openIdx === idx ? 'rotate-180 text-warning' : ''}`}
                  style={{ transform: openIdx === idx ? 'rotate(180deg)' : 'none' }}
                />
              </div>

              {openIdx === idx && (
                <div className="pt-3 mt-2 border-top text-muted small" style={{ lineHeight: 1.65 }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
