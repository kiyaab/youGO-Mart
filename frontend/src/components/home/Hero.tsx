'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { LanguageSwitcher } from '@/components/landing/LanguageSwitcher';
import {
  User,
  Info,
  ArrowRight,
  Search,
  MapPin,
} from 'lucide-react';

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

  // Localized hero strings
  const headline = t('hero_headline');
  const supporting = t('hero_supporting');
  const registerText = t('register_button');
  const aboutText = t('about_us_button');
  const scrollText = t('scroll_down');

  return (
    <div className="position-relative overflow-hidden" style={{ minHeight: '100svh', backgroundColor: '#F97316' }}>
      {/* 1. MINIMAL & TRANSPARENT TOP NAVIGATION */}
      <header
        className="position-absolute top-0 start-0 w-100 px-3 px-md-5 py-3 d-flex align-items-center justify-content-between"
        style={{ zIndex: 30 }}
      >
        {/* Brand Logo: Top Left */}
        <Link
          href="/"
          className="d-flex align-items-center gap-2 text-white text-decoration-none"
          title="youGO-mart"
        >
          <div className="d-flex align-items-center gap-1.5">
            <span
              className="fw-black text-white"
              style={{
                fontSize: '1.75rem',
                letterSpacing: '-0.04em',
                fontWeight: 900,
                textShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              YG
            </span>
            <span
              className="fw-bold text-white"
              style={{
                fontSize: '1.25rem',
                letterSpacing: '-0.02em',
                fontWeight: 700,
                textShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              youGO-mart
            </span>
          </div>
        </Link>

        {/* Compact Language Selector: Top Right */}
        <div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* 2. FULL-SCREEN HERO SECTION (MINIMUM 100svh) */}
      <section
        className="d-flex flex-column justify-content-between position-relative"
        style={{
          minHeight: '100svh',
          background: 'radial-gradient(circle at 65% 45%, #FB923C 0%, #F97316 48%, #EA580C 100%)',
          paddingTop: '4.5rem',
        }}
      >
        {/* DESKTOP / TABLET WIDESCREEN COMPOSITION */}
        <div className="container-fluid d-none d-lg-block position-relative my-auto px-4 px-xl-5" style={{ maxWidth: '1440px' }}>
          <div
            className="position-relative mx-auto"
            style={{
              width: '100%',
              maxWidth: '1240px',
              aspectRatio: '1024 / 575',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
            }}
          >
            {/* High-res reference visual artwork */}
            <Image
              src="/images/yougo-mart-hero.png"
              alt="youGO-mart — Discover More. Shop Smarter. Go Further."
              fill
              priority
              quality={95}
              style={{
                objectFit: 'cover',
                userSelect: 'none',
              }}
            />

            {/* Live Interactive Button: REGISTER */}
            <Link
              href="/register"
              className="position-absolute d-flex align-items-center justify-content-center gap-2 text-decoration-none fw-bold"
              style={{
                left: '7.4%',
                top: '68.2%',
                width: '16.6%',
                height: '9.4%',
                borderRadius: '9999px',
                background: '#FFFFFF',
                color: '#F97316',
                boxShadow: '0 12px 35px rgba(234, 88, 12, 0.7), 0 2px 10px rgba(0,0,0,0.1)',
                fontSize: 'clamp(0.85rem, 1.1vw, 1.05rem)',
                transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
                e.currentTarget.style.boxShadow = '0 16px 45px rgba(234, 88, 12, 0.9)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 12px 35px rgba(234, 88, 12, 0.7), 0 2px 10px rgba(0,0,0,0.1)';
              }}
              title="Register on youGO-mart"
            >
              <User size={18} />
              <span>{registerText}</span>
              <ArrowRight size={18} />
            </Link>

            {/* Live Interactive Button: ABOUT US */}
            <a
              href="#about-us"
              className="position-absolute d-flex align-items-center justify-content-center gap-2 text-decoration-none fw-bold text-white"
              style={{
                left: '24.8%',
                top: '68.2%',
                width: '15.6%',
                height: '9.4%',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1.5px solid rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                fontSize: 'clamp(0.85rem, 1.1vw, 1.05rem)',
                transition: 'all 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 255, 255, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              title="About youGO-mart"
            >
              <Info size={18} />
              <span>{aboutText}</span>
              <ArrowRight size={18} />
            </a>

            {/* Live Interactive: SCROLL DOWN INDICATOR */}
            <a
              href="#about-us"
              className="position-absolute d-flex align-items-center gap-2 text-decoration-none text-white fw-bold"
              style={{
                left: '5.5%',
                top: '89.0%',
                opacity: 0.92,
                fontSize: 'clamp(0.78rem, 0.95vw, 0.92rem)',
                transition: 'transform 0.2s ease, opacity 0.2s ease',
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(2px)';
                e.currentTarget.style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.opacity = '0.92';
              }}
              title="Scroll Down"
            >
              <div
                style={{
                  width: '20px',
                  height: '32px',
                  borderRadius: '10px',
                  border: '2px solid rgba(255, 255, 255, 0.85)',
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    width: '3px',
                    height: '6px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '2px',
                    marginTop: '5px',
                  }}
                />
              </div>
              <span>{scrollText} ↓</span>
            </a>
          </div>
        </div>

        {/* MOBILE & TABLET PORTRAIT RESPONSIVE COMPOSITION */}
        <div className="container d-block d-lg-none py-4 px-4 my-auto text-center text-white">
          {/* Animated 3D Mascot Graphic */}
          <div className="position-relative mx-auto mb-4" style={{ maxWidth: '420px', width: '100%', aspectRatio: '16 / 9' }}>
            <Image
              src="/images/yougo-mart-hero.png"
              alt="youGO-mart Mascot"
              fill
              priority
              className="rounded-4 shadow-lg"
              style={{
                objectFit: 'cover',
                border: '2px solid rgba(255, 255, 255, 0.35)',
              }}
            />
          </div>

          {/* Main Headline & Supporting Text */}
          <h1
            className="fw-black display-6 text-white mb-2"
            style={{
              letterSpacing: '-0.03em',
              fontWeight: 900,
              textShadow: '0 2px 12px rgba(0,0,0,0.25)',
              lineHeight: 1.18,
            }}
          >
            {headline}
          </h1>
          <p
            className="lead text-white-50 mb-4 mx-auto"
            style={{
              fontSize: '1.02rem',
              maxWidth: '440px',
              lineHeight: 1.5,
              textShadow: '0 1px 4px rgba(0,0,0,0.15)',
            }}
          >
            {supporting}
          </p>

          {/* The Two Primary Action Buttons */}
          <div className="d-flex flex-column gap-3 mx-auto mb-4" style={{ maxWidth: '360px' }}>
            {/* Button A: Register */}
            <Link
              href="/register"
              className="btn py-3 px-4 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 shadow-lg"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#F97316',
                boxShadow: '0 12px 30px rgba(234, 88, 12, 0.65)',
                fontSize: '1.05rem',
                border: 'none',
              }}
            >
              <User size={19} />
              <span>{registerText}</span>
              <ArrowRight size={19} />
            </Link>

            {/* Button B: About Us */}
            <a
              href="#about-us"
              className="btn py-3 px-4 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 text-white"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1.5px solid rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                fontSize: '1.05rem',
              }}
            >
              <Info size={19} />
              <span>{aboutText}</span>
              <ArrowRight size={19} />
            </a>
          </div>

          {/* Mobile Scroll Indicator */}
          <a
            href="#about-us"
            className="d-inline-flex align-items-center gap-1.5 text-white-50 small text-decoration-none"
          >
            <span>↓ {scrollText}</span>
          </a>
        </div>

        {/* BOTTOM SUBTLE TRANSITION STRIP */}
        <div style={{ height: '1.5rem', width: '100%' }} />
      </section>

      {/* 3. QUICK SEARCH BAR DIRECTLY BENEATH HERO */}
      <section
        id="explore-marketplace"
        className="py-4 position-relative"
        style={{
          backgroundColor: 'var(--bg-soft)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div className="container" style={{ maxWidth: '860px' }}>
          <form
            onSubmit={handleSearch}
            className="glass-card p-2.5 p-sm-3 shadow-md rounded-4"
          >
            <div className="row g-2 align-items-center">
              <div className="col-12 col-sm-6 position-relative">
                <div className="input-group">
                  <span className="input-group-text bg-transparent border-0 pe-1 text-muted">
                    <Search size={19} />
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 ps-1 shadow-none bg-transparent"
                    placeholder={
                      language === 'am'
                        ? 'ስልኮች፣ መኪናዎች፣ ልብሶች ወይም የኤሌክትሮኒክስ ዕቃዎችን ይፈልጉ...'
                        : language === 'om'
                        ? 'Bilbila, konkolaataa, uffata ykn meeshaalee elektirooniksii barbaadaa...'
                        : 'Search phones, electronics, vehicles, fashion...'
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ fontSize: '0.94rem' }}
                  />
                </div>
              </div>

              <div className="col-12 col-sm-4 border-start-sm">
                <div className="input-group">
                  <span
                    className="input-group-text bg-transparent border-0 pe-1"
                    style={{ color: 'var(--primary-orange)' }}
                  >
                    <MapPin size={18} />
                  </span>
                  <select
                    className="form-select border-0 ps-1 shadow-none bg-transparent fw-semibold"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    style={{ fontSize: '0.88rem' }}
                  >
                    <option value="Addis Ababa">Addis Ababa (አዲስ አበባ)</option>
                    <option value="Hawassa">Hawassa (ሐዋሳ)</option>
                    <option value="Adama">Adama (አዳማ)</option>
                    <option value="Bahir Dar">Bahir Dar (ባሕር ዳር)</option>
                    <option value="Dire Dawa">Dire Dawa (ድሬዳዋ)</option>
                    <option value="All Ethiopia">All Ethiopia (መላው ኢትዮጵያ)</option>
                  </select>
                </div>
              </div>

              <div className="col-12 col-sm-2">
                <button type="submit" className="btn-orange w-100 py-2.5 fw-bold">
                  {language === 'am' ? 'ፈልግ' : language === 'om' ? 'Barbaadi' : 'Search'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
