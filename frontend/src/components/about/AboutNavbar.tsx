'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { LanguageSwitcher } from '@/components/landing/LanguageSwitcher';
import { Menu, X } from 'lucide-react';

export const AboutNavbar: React.FC = () => {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: t('about_nav_home'), href: '/' },
    { label: t('about_nav_shop'), href: '/search' },
    { label: t('about_nav_about_us'), href: '/about-us' },
    { label: t('about_nav_contact'), href: '#contact' },
  ];

  return (
    <header
      className="position-sticky top-0 w-100 bg-white"
      style={{
        zIndex: 1030,
        borderBottom: '1px solid rgba(231, 229, 228, 0.7)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
      }}
    >
      <div className="container" style={{ maxWidth: '1240px' }}>
        <div className="d-flex align-items-center justify-content-between py-3">
          {/* Brand Logo on Left */}
          <Link
            href="/"
            className="d-flex align-items-center gap-2 text-decoration-none"
            title="youGO-mart Home"
          >
            <div className="d-flex align-items-center gap-1.5">
              <span
                className="fw-black"
                style={{
                  color: '#F97316',
                  fontSize: '1.75rem',
                  letterSpacing: '-0.04em',
                  fontWeight: 900,
                  lineHeight: 1,
                }}
              >
                YG
              </span>
              <span
                className="fw-bold"
                style={{
                  color: '#1C1917',
                  fontSize: '1.25rem',
                  letterSpacing: '-0.02em',
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                youGO-mart
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="d-none d-md-flex align-items-center gap-4">
            {navLinks.map((item) => {
              const isActive = item.href === '/about-us' || pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="position-relative text-decoration-none fw-semibold py-1"
                  style={{
                    color: isActive ? '#F97316' : '#57534E',
                    fontSize: '0.96rem',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#F97316';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#57534E';
                  }}
                >
                  {item.label}
                  {isActive && (
                    <span
                      className="position-absolute bottom-0 start-0 w-100"
                      style={{
                        height: '2.5px',
                        backgroundColor: '#F97316',
                        borderRadius: '2px',
                        transform: 'translateY(4px)',
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Language Selector & Mobile Toggle */}
          <div className="d-flex align-items-center gap-2">
            <LanguageSwitcher />

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="btn btn-sm d-md-none border-0 p-1 text-muted shadow-none"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileOpen && (
          <div className="d-md-none py-3 border-top">
            <div className="d-flex flex-column gap-2">
              {navLinks.map((item) => {
                const isActive = item.href === '/about-us';
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="py-2 px-3 rounded-3 text-decoration-none fw-semibold d-flex align-items-center justify-content-between"
                    style={{
                      color: isActive ? '#F97316' : '#292524',
                      backgroundColor: isActive ? 'rgba(249, 115, 22, 0.08)' : 'transparent',
                    }}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <span
                        className="badge bg-warning rounded-pill"
                        style={{ width: '6px', height: '6px', padding: 0 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
