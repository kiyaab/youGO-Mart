'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import {
  User,
  Info,
  ArrowRight,
  Globe,
  ChevronDown,
  Search,
  MapPin,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

export const Hero: React.FC = () => {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('Addis Ababa');
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('q', searchTerm.trim());
    if (cityFilter && cityFilter !== 'All Ethiopia') params.set('city', cityFilter);
    router.push(`/search?${params.toString()}`);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'am' : 'en');
  };

  return (
    <div>
      {/* 1. MASTER 3D PORTFOLIO HERO (EXACT USER DESIGN) */}
      <section className="hero-3d-wrapper">
        {/* DESKTOP / WIDESCREEN 16:9 PIXEL-PERFECT RENDER */}
        <div className="d-none d-md-block hero-3d-desktop position-relative">
          <Image
            src="/images/hero-portfolio.png"
            alt="youGO-mart — Discover More. Shop Smarter. Go Further."
            width={1024}
            height={575}
            priority
            className="hero-3d-bg-img"
            style={{ width: '100%', height: 'auto' }}
          />

          {/* Interactive Hotspot: Top Left Logo */}
          <Link
            href="/"
            className="hero-hotspot hero-hotspot-logo"
            title="youGO-mart Home"
            aria-label="youGO-mart Home"
          />

          {/* Interactive Hotspot: Top Right Language Dropdown Pill */}
          <div className="position-absolute" style={{ right: '3.5%', top: '3.8%' }}>
            <button
              type="button"
              onClick={toggleLanguage}
              className="hero-hotspot hero-hotspot-lang d-flex align-items-center justify-content-center gap-1.5 px-3 py-1.5 border-0"
              style={{
                position: 'relative',
                color: '#FFFFFF',
                fontSize: '0.86rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
                textShadow: '0 1px 3px rgba(0,0,0,0.3)',
              }}
              title="Toggle English / አማርኛ"
              aria-label="Toggle Language"
            >
              <Globe size={16} />
              <span>{language === 'en' ? 'EN' : 'አማ'}</span>
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Interactive Hotspot: Primary White Pill "Register →" Button */}
          <Link
            href="/auth/register"
            className="hero-hotspot hero-hotspot-register"
            title={language === 'am' ? 'ተመዝገብ (Register)' : 'Register on youGO-mart'}
            aria-label="Register"
          />

          {/* Interactive Hotspot: Translucent Frosted "About Us →" Button */}
          <a
            href="#about-us"
            className="hero-hotspot hero-hotspot-about"
            title={language === 'am' ? 'ስለ እኛ (About Us)' : 'About youGO-mart Portfolio'}
            aria-label="About Us"
          />

          {/* Interactive Hotspot: Bottom Left "Scroll Down ↓" */}
          <a
            href="#explore-marketplace"
            className="hero-hotspot hero-hotspot-scroll"
            title="Scroll Down"
            aria-label="Scroll Down"
          />
        </div>

        {/* MOBILE / TABLET ADAPTIVE RENDER (PIXEL-PERFECT FIDELITY) */}
        <div className="d-block d-md-none px-4 py-5 text-center text-white position-relative">
          {/* Top Bar for Mobile */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <Link href="/" className="d-flex align-items-center gap-2 text-white text-decoration-none">
              <span className="fw-black fs-4" style={{ letterSpacing: '-0.03em' }}>
                <span className="text-white">YG</span> youGO-mart
              </span>
            </Link>

            <button
              type="button"
              onClick={toggleLanguage}
              className="btn btn-sm rounded-pill d-flex align-items-center gap-1 px-3 py-1 fw-bold text-white"
              style={{
                background: 'rgba(255, 255, 255, 0.18)',
                border: '1.5px solid rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Globe size={14} />
              <span>{language === 'en' ? 'EN' : 'አማ'}</span>
              <ChevronDown size={12} />
            </button>
          </div>

          {/* 3D Visual Graphic */}
          <div className="my-3 position-relative" style={{ maxWidth: '380px', margin: '0 auto' }}>
            <Image
              src="/images/hero-portfolio.png"
              alt="youGO-mart 3D Runner with Cart"
              width={512}
              height={288}
              priority
              className="img-fluid rounded-4 shadow-lg"
              style={{
                objectFit: 'cover',
                border: '2px solid rgba(255, 255, 255, 0.35)',
              }}
            />
          </div>

          {/* Main Title & Tagline */}
          <h1 className="fw-black display-6 mt-3 mb-2 text-white" style={{ letterSpacing: '-0.02em', textShadow: '0 2px 10px rgba(0,0,0,0.25)' }}>
            Everything you need,<br />
            <span style={{ color: '#FFF7ED' }}>just a click away.</span>
          </h1>
          <p className="small text-white-50 mb-4" style={{ fontSize: '0.92rem' }}>
            {language === 'am'
              ? 'የሚፈልጉትን ሁሉ፣ በአንድ ጠቅታ ብቻ። ያለ ኮሚሽን በቀጥታ ይገበያዩ!'
              : 'Direct connection marketplace • 100% Free • No sales commission'}
          </p>

          {/* Mobile Action Buttons */}
          <div className="d-flex flex-column gap-2.5 mb-4" style={{ maxWidth: '340px', margin: '0 auto' }}>
            <Link
              href="/auth/register"
              className="btn py-3 px-4 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2 shadow-lg"
              style={{
                backgroundColor: '#FFFFFF',
                color: '#F97316',
                boxShadow: '0 12px 30px rgba(234, 88, 12, 0.6)',
                fontSize: '1rem',
              }}
            >
              <User size={18} />
              <span>{language === 'am' ? 'ተመዝገብ' : 'Register'}</span>
              <ArrowRight size={18} />
            </Link>

            <a
              href="#about-us"
              className="btn py-2.5 px-4 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1.5px solid rgba(255, 255, 255, 0.7)',
                color: '#FFFFFF',
                backdropFilter: 'blur(10px)',
                fontSize: '0.95rem',
              }}
            >
              <Info size={17} />
              <span>{language === 'am' ? 'ስለ እኛ' : 'About Us'}</span>
              <ArrowRight size={17} />
            </a>
          </div>

          <a
            href="#explore-marketplace"
            className="d-inline-flex align-items-center gap-1.5 text-white-50 small text-decoration-none mt-2"
          >
            <span>↓ {language === 'am' ? 'ወደ ታች ይሸብልሉ' : 'Scroll Down'}</span>
          </a>
        </div>
      </section>

      {/* 2. FLOATING MARKETPLACE SEARCH & DISCOVERY BAR */}
      <section
        id="explore-marketplace"
        className="py-4 position-relative"
        style={{
          backgroundColor: 'var(--bg-soft)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div className="container" style={{ maxWidth: '840px' }}>
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
                  {language === 'am' ? 'ፈልግ' : 'Search'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};
