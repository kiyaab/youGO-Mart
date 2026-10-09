'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { Search, MapPin, Sparkles, ShieldCheck, ArrowRight, PlusCircle, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export const Hero: React.FC = () => {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('Addis Ababa');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('q', searchTerm.trim());
    if (cityFilter && cityFilter !== 'All Ethiopia') params.set('city', cityFilter);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section
      className="py-5 position-relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at top, rgba(249, 115, 22, 0.08) 0%, var(--bg-main) 70%)',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      <div className="container py-lg-4">
        <div className="row align-items-center g-5">
          {/* Left Column: Headline and Value Proposition */}
          <div className="col-lg-7">
            {/* Launch / Commission Badge */}
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-3 rounded-pill glass-card border-warning">
              <span className="badge rounded-pill bg-warning text-dark fw-bold">
                {language === 'am' ? 'ኢትዮጵያ ቀዳሚ 🇪🇹' : 'Ethiopia First 🇪🇹'}
              </span>
              <span className="small fw-semibold" style={{ color: 'var(--text-main)' }}>
                {language === 'am' ? '100% ያለ ኮሚሽን ነፃ ግብይት' : '100% Commission-Free Classifieds'}
              </span>
            </div>

            {/* Main Headline */}
            <h1
              className="fw-extrabold display-4 mb-3 tracking-tight"
              style={{
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                fontWeight: 800,
                color: 'var(--text-main)',
              }}
            >
              {language === 'am' ? (
                <>
                  ፈልግ። ወደደው። <span style={{ color: 'var(--primary-orange)' }}>የራስህ አድርገው።</span>
                </>
              ) : (
                <>
                  Find it. Love it. <span style={{ color: 'var(--primary-orange)' }}>Make it yours.</span>
                </>
              )}
            </h1>

            {/* Supporting Copy */}
            <p
              className="lead text-muted mb-4"
              style={{ fontSize: '1.15rem', lineHeight: 1.6, maxWidth: '560px' }}
            >
              {language === 'am'
                ? 'በአቅራቢያዎ ያሉ ምርጥ ምርቶችን ያግኙ። የማያስፈልጉዎትን እቃዎች ይሽጡ። በመላው ኢትዮጵያ ካሉ ሰዎች ጋር ያለ ምንም የኮሚሽን ክፍያ በቀጥታ ይገናኙ።'
                : 'Discover great products near you. Sell what you no longer need. Connect directly with people across Ethiopia with zero transaction cuts.'}
            </p>

            {/* Central Glassy Search Box */}
            <form
              onSubmit={handleSearch}
              className="p-2 p-sm-3 glass-card shadow-md rounded-4 mb-4"
              style={{ maxWidth: '620px' }}
            >
              <div className="row g-2 align-items-center">
                <div className="col-12 col-sm-6 position-relative">
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-0 pe-1 text-muted">
                      <Search size={18} />
                    </span>
                    <input
                      type="text"
                      className="form-control border-0 ps-1 shadow-none bg-transparent"
                      placeholder={language === 'am' ? 'ምን መፈለግ ይፈልጋሉ?' : 'What are you looking for?'}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ fontSize: '0.95rem' }}
                    />
                  </div>
                </div>

                <div className="col-12 col-sm-4 border-start-sm">
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-0 pe-1 text-warning">
                      <MapPin size={18} />
                    </span>
                    <select
                      className="form-select border-0 ps-1 shadow-none bg-transparent"
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                      style={{ fontSize: '0.9rem' }}
                    >
                      <option value="Addis Ababa">Addis Ababa</option>
                      <option value="Hawassa">Hawassa</option>
                      <option value="Adama">Adama</option>
                      <option value="Bahir Dar">Bahir Dar</option>
                      <option value="Dire Dawa">Dire Dawa</option>
                      <option value="Mekelle">Mekelle</option>
                      <option value="All Ethiopia">All Ethiopia</option>
                    </select>
                  </div>
                </div>

                <div className="col-12 col-sm-2">
                  <button type="submit" className="btn-orange w-100 py-2">
                    {language === 'am' ? 'ፈልግ' : 'Search'}
                  </button>
                </div>
              </div>
            </form>

            {/* Primary Action Buttons */}
            <div className="d-flex flex-wrap align-items-center gap-3">
              <Link href="/search" className="btn-orange py-2.5 px-4 shadow-sm">
                {t('explore_marketplace')} <ArrowRight size={18} />
              </Link>
              <Link href="/post-ad" className="btn-neutral py-2.5 px-4 fw-semibold border-warning">
                <PlusCircle size={18} className="text-warning inline me-1" /> {t('post_free_ad')}
              </Link>
            </div>

            {/* Highlights row */}
            <div className="d-flex flex-wrap align-items-center gap-4 mt-4 pt-3 border-top text-muted small">
              <div className="d-flex align-items-center gap-2">
                <ShieldCheck size={18} className="text-success" />
                <span>{language === 'am' ? 'ምንም ኮሚሽን የለም' : '0% Commission'}</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Sparkles size={18} className="text-warning" />
                <span>{language === 'am' ? 'ቀጥታ ግንኙነት' : 'Direct Calls & WhatsApp'}</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold text-dark">0 ETB</span>
                <span>{language === 'am' ? 'ነፃ ማስታወቂያ' : 'Free Standard Postings'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="col-lg-5 d-none d-lg-block">
            <div className="position-relative">
              {/* Product Card 1 */}
              <div
                className="glass-card shadow-lg p-3 position-relative z-2 mb-3"
                style={{
                  maxWidth: '340px',
                  borderRadius: '16px',
                  transform: 'rotate(-2deg)',
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=200&q=80"
                      alt="iPhone 15 Pro Max"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <span className="badge-featured mb-1">Spotlight</span>
                    <h6 className="fw-bold mb-1 small">iPhone 15 Pro Max 256GB</h6>
                    <div className="yg-price" style={{ fontSize: '1.1rem' }}>
                      148,000 <small className="text-muted" style={{ fontSize: '0.75rem' }}>ETB</small>
                    </div>
                    <div className="small text-muted" style={{ fontSize: '0.75rem' }}>
                      Bole, Addis Ababa • Verified Seller
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Card 2 */}
              <div
                className="glass-card shadow-lg p-3 position-relative z-1 ms-auto"
                style={{
                  maxWidth: '350px',
                  borderRadius: '16px',
                  transform: 'rotate(2deg) translateY(-15px)',
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=200&q=80"
                      alt="Toyota RAV4 Hybrid"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <span className="badge-negotiable mb-1">Negotiable</span>
                    <h6 className="fw-bold mb-1 small">Toyota RAV4 2022 Hybrid</h6>
                    <div className="yg-price" style={{ fontSize: '1.1rem' }}>
                      4,850,000 <small className="text-muted" style={{ fontSize: '0.75rem' }}>ETB</small>
                    </div>
                    <div className="small text-muted" style={{ fontSize: '0.75rem' }}>
                      Euro Spec • Addis Ababa
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Subtle Background Element */}
              <div
                className="position-absolute top-50 start-50 translate-middle rounded-circle"
                style={{
                  width: '320px',
                  height: '320px',
                  background: 'radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, rgba(249, 115, 22, 0) 70%)',
                  zIndex: 0,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
