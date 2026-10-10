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
    <div className="position-relative overflow-hidden">
      {/* 1. NATIVE 3D DESIGN HERO SECTION */}
      <section className="hero-native-container">
        {/* Minimal Transparent Top Header */}
        <header
          className="w-100 px-3 px-md-5 py-3 py-md-4 d-flex align-items-center justify-content-between position-relative"
          style={{ zIndex: 30 }}
        >
          {/* Brand Logo: Top Left */}
          <Link
            href="/"
            className="d-flex align-items-center gap-2 text-white text-decoration-none"
            title="youGO-mart"
          >
            <div className="d-flex align-items-center gap-2">
              <span
                className="fw-black text-white"
                style={{
                  fontSize: '1.85rem',
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
                  fontSize: '1.3rem',
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

        {/* Hero Content Stage: Two Columns */}
        <div
          className="container-fluid px-3 px-md-5 my-auto py-3 py-md-4 position-relative"
          style={{ maxWidth: '1440px', zIndex: 10 }}
        >
          <div className="row align-items-center g-4 g-lg-5">
            {/* Left Column: 3D Logo, Headline, Buttons, Scroll Indicator */}
            <div className="col-12 col-lg-5 col-xl-5 ps-lg-4 text-start text-white">
              {/* Trust Badge Pill */}
              <div
                className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill mb-3"
                style={{
                  background: 'rgba(255, 255, 255, 0.16)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.06)',
                }}
              >
                <span
                  className="rounded-circle bg-white"
                  style={{
                    width: '7px',
                    height: '7px',
                    display: 'inline-block',
                    boxShadow: '0 0 8px #FFFFFF',
                  }}
                />
                <span className="text-white fw-bold" style={{ fontSize: '0.84rem', letterSpacing: '0.02em' }}>
                  {language === 'am'
                    ? 'የኢትዮጵያ #1 ኮሚሽን-አልባ የገበያ ቦታ'
                    : language === 'om'
                    ? 'Gabaa Komishinii Malee Itoophiyaa #1'
                    : 'Ethiopia’s #1 Commission-Free Marketplace'}
                </span>
              </div>

              {/* 3D Brand Logo */}
              <div className="mb-3 mb-md-4" style={{ maxWidth: '305px' }}>
                <Image
                  src="/images/logo-3d-clean.png"
                  alt="youGO-mart 3D Brand Logo"
                  width={305}
                  height={240}
                  priority
                  style={{
                    width: '100%',
                    maxWidth: '280px',
                    height: 'auto',
                    filter: 'drop-shadow(0 12px 28px rgba(0, 0, 0, 0.14))',
                  }}
                />
              </div>

              {/* Headline */}
              <h1
                className="fw-black text-white mb-3"
                style={{
                  fontSize: 'clamp(2rem, 3.2vw, 2.9rem)',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.16,
                  textShadow: '0 2px 14px rgba(0, 0, 0, 0.2)',
                  fontWeight: 900,
                }}
              >
                {headline}
              </h1>

              {/* Supporting Copy */}
              <p
                className="text-white mb-4 mb-lg-5"
                style={{
                  fontSize: 'clamp(1.05rem, 1.35vw, 1.25rem)',
                  lineHeight: 1.55,
                  opacity: 0.95,
                  textShadow: '0 1px 6px rgba(0, 0, 0, 0.14)',
                  maxWidth: '480px',
                }}
              >
                {supporting}
              </p>

              {/* CTA Action Buttons */}
              <div className="d-flex flex-wrap align-items-center gap-3 mb-4 mb-lg-5">
                {/* Button A: Register */}
                <Link
                  href="/register"
                  className="hero-btn-register"
                  title="Register on youGO-mart"
                >
                  <User size={20} />
                  <span>{registerText}</span>
                  <ArrowRight size={20} />
                </Link>

                {/* Button B: About Us */}
                <a
                  href="#about-us"
                  className="hero-btn-about"
                  title="About youGO-mart"
                >
                  <Info size={20} />
                  <span>{aboutText}</span>
                  <ArrowRight size={20} />
                </a>
              </div>

              {/* Mouse Scroll Down Indicator */}
              <div className="pt-2">
                <a
                  href="#explore-marketplace"
                  className="hero-scroll-indicator"
                  title="Scroll Down"
                >
                  <div className="mouse-pill">
                    <div className="mouse-wheel" />
                  </div>
                  <span>{scrollText} ↓</span>
                </a>
              </div>
            </div>

            {/* Right Column: 3D Mascot Character */}
            <div className="col-12 col-lg-7 col-xl-7 d-flex align-items-center justify-content-center justify-content-lg-end position-relative">
              <div
                className="position-relative text-center w-100 d-flex justify-content-center justify-content-lg-end"
                style={{ maxWidth: '680px' }}
              >
                {/* Ground reflection glow */}
                <div className="mascot-ground-glow" />
                <Image
                  src="/images/mascot-3d-clean.png"
                  alt="youGO-mart Delivery Courier Mascot"
                  width={1008}
                  height={985}
                  priority
                  quality={100}
                  className="hero-mascot-img"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Bottom Spacer */}
        <div style={{ height: '1.5rem', width: '100%', position: 'relative', zIndex: 10 }} />
      </section>

      {/* 2. QUICK SEARCH BAR DIRECTLY BENEATH HERO */}
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
