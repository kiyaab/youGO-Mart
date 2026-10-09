'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { Search, MapPin, ArrowRight, Store, ShoppingBag, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

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
        background: 'radial-gradient(circle at 80% 20%, rgba(249, 115, 22, 0.08) 0%, #FFF7F0 70%)',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      <div className="container py-lg-4">
        <div className="row align-items-center g-5">
          {/* Left Column: Headline and Value Proposition */}
          <div className="col-lg-7">
            {/* Launch Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="d-inline-flex align-items-center gap-2 px-3 py-1 mb-3 rounded-pill glass-card border-warning"
            >
              <span className="badge rounded-pill bg-warning text-dark fw-bold">
                {t('ethiopia_first')}
              </span>
              <span className="small fw-semibold" style={{ color: 'var(--text-main)' }}>
                {t('zero_commission')}
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="fw-extrabold display-4 mb-3 tracking-tight"
              style={{
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                fontWeight: 800,
                color: 'var(--text-main)',
              }}
            >
              {t('hero_headline')}
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lead text-muted mb-4"
              style={{ fontSize: '1.15rem', lineHeight: 1.6, maxWidth: '580px' }}
            >
              {t('hero_subheadline')}
            </motion.p>

            {/* Central Interactive Search Box */}
            <motion.form
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onSubmit={handleSearch}
              className="p-2 p-sm-3 glass-card shadow-sm rounded-4 mb-4"
              style={{ maxWidth: '640px' }}
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
                    {t('search_btn')}
                  </button>
                </div>
              </div>
            </motion.form>

            {/* Primary Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="d-flex flex-wrap align-items-center gap-3"
            >
              <Link href="/search" className="btn-orange py-2.5 px-4 shadow-sm">
                <ShoppingBag size={18} /> {t('start_shopping')}
              </Link>
              <Link href="/auth/register?role=seller" className="btn-orange-outline py-2.5 px-4">
                <Store size={18} /> {t('become_a_seller')}
              </Link>
            </motion.div>

            {/* Highlights row */}
            <div className="d-flex flex-wrap align-items-center gap-4 mt-4 pt-3 border-top text-muted small">
              <div className="d-flex align-items-center gap-2">
                <ShieldCheck size={18} className="text-success" />
                <span>{t('zero_commission')}</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <Sparkles size={18} className="text-warning" />
                <span>{t('direct_connection')}</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold text-dark">0 ETB</span>
                <span>Standard Postings</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Marketplace Showcase with Product Cards */}
          <div className="col-lg-5 d-none d-lg-block">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="position-relative"
            >
              {/* Product Card 1: Electronics */}
              <div
                className="glass-card shadow-lg p-3 position-relative z-2 mb-3"
                style={{
                  maxWidth: '350px',
                  borderRadius: '18px',
                  transform: 'rotate(-2deg)',
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    style={{
                      width: '74px',
                      height: '74px',
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
                    <div className="fw-bold" style={{ color: 'var(--primary-orange)', fontSize: '1.05rem' }}>
                      148,000 <small className="text-muted" style={{ fontSize: '0.75rem' }}>ETB</small>
                    </div>
                    <div className="small text-muted" style={{ fontSize: '0.75rem' }}>
                      Bole, Addis Ababa • Verified Seller
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Card 2: Vehicles */}
              <div
                className="glass-card shadow-lg p-3 position-relative z-1 ms-auto"
                style={{
                  maxWidth: '350px',
                  borderRadius: '18px',
                  transform: 'rotate(2deg) translateY(-10px)',
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    style={{
                      width: '74px',
                      height: '74px',
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
                    <span className="badge bg-light text-dark border mb-1 small fw-semibold" style={{ fontSize: '0.7rem' }}>
                      Verified Merchant
                    </span>
                    <h6 className="fw-bold mb-1 small">Toyota RAV4 2022 Hybrid</h6>
                    <div className="fw-bold" style={{ color: 'var(--primary-orange)', fontSize: '1.05rem' }}>
                      4,850,000 <small className="text-muted" style={{ fontSize: '0.75rem' }}>ETB</small>
                    </div>
                    <div className="small text-muted" style={{ fontSize: '0.75rem' }}>
                      Euro Spec • Addis Ababa
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Trust Indicator */}
              <div
                className="glass-card p-2.5 px-3 position-absolute start-0 bottom-0 z-3 d-flex align-items-center gap-2 shadow-sm"
                style={{ transform: 'translateY(15px)' }}
              >
                <CheckCircle2 size={18} className="text-success" />
                <span className="small fw-bold">Verified Ethiopian ID Checks</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
