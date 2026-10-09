'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { Logo } from '@/components/brand/Logo';
import { Award, Globe2, ShieldCheck, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AboutUsPage() {
  const { language, t } = useLanguage();

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        <div className="text-center mb-5">
          <div className="mb-3 d-inline-block">
            <Logo size="lg" />
          </div>
          <h1 className="display-5 fw-bold mb-3" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {language === 'am' ? 'ስለ ዩጎ-ማርት (youGO-mart)' : 'About youGO-mart'}
          </h1>
          <p className="lead text-muted" style={{ fontSize: '1.15rem', lineHeight: 1.6 }}>
            {language === 'am'
              ? 'የኢትዮጵያን የዲጂታል ግብይት ያለ ምንም ደላላ እና ኮሚሽን የሚያቀላጥፍ ዘመናዊ የገበያ መድረክ።'
              : 'Ethiopia’s premier commission-free direct marketplace connecting buyers and sellers with zero middleman cuts.'}
          </p>
        </div>

        {/* Founder & Vision */}
        <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm mb-4">
          <span className="badge bg-warning text-dark text-uppercase px-3 py-1 rounded-pill fw-bold small mb-2">
            FOUNDER & ARCHITECT
          </span>
          <h3 className="fw-bold mb-3">Endegena Abebe</h3>
          <p className="text-muted mb-3" style={{ lineHeight: 1.7 }}>
            {language === 'am'
              ? 'ዩጎ-ማርት የተመሰረተው በእሸቱ እንዳገና አበበ ሲሆን፣ አላማውም በኢትዮጵያ ውስጥ ያሉ የንግድ ባለቤቶችና ተራ ዜጎች ያለ ምንም የደላላ ክፍያ እና ከፍተኛ የኮሚሽን ቅናሽ በቀጥታ እንዲገበያዩ ማስቻል ነው።'
              : 'Founded by Endegena Abebe, youGO-mart was created to empower Ethiopian merchants and buyers by removing predatory transaction commissions. The platform enables direct phone, WhatsApp, and in-person negotiations with total financial transparency.'}
          </p>
          <div className="d-flex flex-wrap gap-3 small text-muted pt-2 border-top">
            <span className="d-flex align-items-center gap-1.5 fw-semibold">
              <CheckCircle2 size={16} className="text-success" /> 0% Transaction Cuts
            </span>
            <span className="d-flex align-items-center gap-1.5 fw-semibold">
              <CheckCircle2 size={16} className="text-success" /> Verified Ethiopian Kebele ID Checks
            </span>
            <span className="d-flex align-items-center gap-1.5 fw-semibold">
              <Globe2 size={16} className="text-primary" /> Architecture Ready for Africa
            </span>
          </div>
        </div>

        {/* Core Principles */}
        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="glass-card p-4 h-100 rounded-4">
              <div className="p-2.5 rounded-3 bg-warning bg-opacity-10 text-warning d-inline-flex mb-3">
                <ShieldCheck size={24} />
              </div>
              <h5 className="fw-bold mb-2">
                {language === 'am' ? 'የኮሚሽን-አልባ ቃልኪዳን' : 'Commission-Free Promise'}
              </h5>
              <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                {language === 'am'
                  ? 'መደበኛ ምርቶችን መለጠፍ ሙሉ በሙሉ ነፃ ነው። ሻጮች ያገኙትን እያንዳንዱን ብር ለራሳቸው ንግድ ማዋል ይችላሉ።'
                  : 'Standard listings are 100% free. Sellers retain every single Birr without platform deductions.'}
              </p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="glass-card p-4 h-100 rounded-4">
              <div className="p-2.5 rounded-3 bg-primary bg-opacity-10 text-primary d-inline-flex mb-3">
                <HeartHandshake size={24} />
              </div>
              <h5 className="fw-bold mb-2">
                {language === 'am' ? 'ቀጥታ እና ታማኝ ግንኙነት' : 'Direct & Honest Commerce'}
              </h5>
              <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                {language === 'am'
                  ? 'ገዢዎች እቃውን በአካል ከመክፈላቸው በፊት የመፈተሽ እድል አላቸው። ምንም የተደበቁ ወጪዎች የሉም።'
                  : 'Buyers inspect items in person before payment. No deceptive fees, no hidden escrow charges.'}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center pt-3">
          <Link href="/search" className="btn-orange px-4 py-2.5">
            {t('explore_products')} <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
