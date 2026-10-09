'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { Search, MapPin, Sparkles, ArrowRight, Store, ShoppingBag, ShieldCheck } from 'lucide-react';
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
        background: 'linear-gradient(180deg, #FFFFFF 0%, var(--bg-soft) 100%)',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      <div className="container py-lg-4">
        <div className="row align-items-center g-5">
          {/* Left Column: Headline and Value Proposition */}
          <div className="col-lg-7">
            {/* Launch / Commission Badge */}
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-3 rounded-pill glass-card">
              <span className="badge rounded-pill bg-warning text-dark fw-bold">
                {language === 'am' ? 'ኢትዮጵያ 🇪🇹' : 'Ethiopia 🇪🇹'}
              </span>
              <span className="small fw-semibold" style={{ color: 'var(--text-main)' }}>
                {t('zero_commission_badge')}
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
                  የበለጠ ያግኙ። በብልሃት ይሸምቱ። <span style={{ color: 'var(--primary-orange)' }}>ወደፊት ይራመዱ።</span>
                </>
              ) : (
                <>
                  Discover More. Shop Smarter. <span style={{ color: 'var(--primary-orange)' }}>Go Further.</span>
                </>
              )}
            </h1>

            {/* Supporting Copy */}
            <p
              className="lead text-muted mb-4"
              style={{ fontSize: '1.15rem', lineHeight: 1.6, maxWidth: '580px' }}
            >
              {t('hero_supporting')}
            </p>

            {/* Central Glassy Search Box */}
            <form
              onSubmit={handleSearch}
              className="p-2 p-sm-2.5 glass-card shadow-sm rounded-4 mb-4"
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
                      placeholder={t('search_placeholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ fontSize: '0.92rem' }}
                    />
                  </div>
                </div>

                <div className="col-12 col-sm-4 border-start-sm">
                  <div className="input-group">
                    <span className="input-group-text bg-transparent border-0 pe-1" style={{ color: 'var(--primary-orange)' }}>
                      <MapPin size={18} />
                    </span>
                    <select
                      className="form-select border-0 ps-1 shadow-none bg-transparent"
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                      style={{ fontSize: '0.88rem' }}
                    >
                      <option value="Addis Ababa">Addis Ababa</option>
                      <option value="Hawassa">Hawassa</option>
                      <option value="Adama">Adama</option>
                      <option value="Bahir Dar">Bahir Dar</option>
                      <option value="Dire Dawa">Dire Dawa</option>
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
                <ShoppingBag size={18} />
                <span>{t('start_shopping')}</span>
                <ArrowRight size={17} />
              </Link>
              <Link href="/auth/register?role=seller" className="btn-neutral py-2.5 px-4 fw-semibold">
                <Store size={18} style={{ color: 'var(--primary-orange)' }} />
                <span>{t('become_a_seller')}</span>
              </Link>
            </div>

            {/* Marketplace Benefits Row */}
            <div className="d-flex flex-wrap align-items-center gap-4 mt-4 pt-3 border-top text-muted small">
              <div className="d-flex align-items-center gap-2">
                <ShieldCheck size={18} className="text-success" />
                <span>{language === 'am' ? 'ቀጥታ እና ደህንነቱ የተጠበቀ' : 'Direct & Verified'}</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Sparkles size={18} style={{ color: 'var(--primary-orange)' }} />
                <span>{language === 'am' ? '0% የሽያጭ ኮሚሽን' : '0% Commission'}</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold" style={{ color: 'var(--text-main)' }}>100% Free</span>
                <span>{language === 'am' ? 'ነፃ ምዝገባ' : 'Standard Postings'}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Marketplace Visual Composition */}
          <div className="col-lg-5 d-none d-lg-block">
            <div className="position-relative">
              {/* Product Card Showcase 1 */}
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
                      backgroundColor: '#F5F5F4',
                    }}
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=200&q=80"
                      alt="Product Spotlight"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <span className="badge-featured mb-1">Spotlight</span>
                    <h6 className="fw-bold mb-1 small">Smart Tech & Mobile</h6>
                    <div className="yg-price" style={{ fontSize: '1.1rem' }}>
                      148,000 <small className="text-muted" style={{ fontSize: '0.75rem' }}>ETB</small>
                    </div>
                    <div className="small text-muted" style={{ fontSize: '0.75rem' }}>
                      Bole, Addis Ababa
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Card Showcase 2 */}
              <div
                className="glass-card shadow-lg p-3 position-relative z-1 ms-auto"
                style={{
                  maxWidth: '350px',
                  borderRadius: '16px',
                  transform: 'rotate(2deg) translateY(-10px)',
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
                      backgroundColor: '#F5F5F4',
                    }}
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=200&q=80"
                      alt="Vehicle Showcase"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div>
                    <span className="badge-negotiable mb-1">Direct Deal</span>
                    <h6 className="fw-bold mb-1 small">Automotive & Transport</h6>
                    <div className="yg-price" style={{ fontSize: '1.1rem' }}>
                      4,850,000 <small className="text-muted" style={{ fontSize: '0.75rem' }}>ETB</small>
                    </div>
                    <div className="small text-muted" style={{ fontSize: '0.75rem' }}>
                      Addis Ababa, Ethiopia
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
                  background: 'radial-gradient(circle, rgba(249, 115, 22, 0.12) 0%, rgba(249, 115, 22, 0) 70%)',
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
