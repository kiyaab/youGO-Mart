'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { useLanguage } from '@/lib/language-context';
import { ShieldCheck, HeartHandshake, PhoneCall, AlertCircle, Info, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <footer
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '3.5rem',
        paddingBottom: '2.5rem',
        marginTop: '4rem',
      }}
    >
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand & Founder Column */}
          <div className="col-lg-4 col-md-6">
            <div className="mb-3">
              <Logo size="md" />
            </div>
            <p className="text-muted small mb-3" style={{ lineHeight: 1.6 }}>
              <strong>youGO-mart</strong> is Ethiopia’s premier commission-free marketplace connecting buyers and sellers directly with zero transaction cuts and zero middlemen.
            </p>
            <div className="p-3 glass-card mb-3 border-warning">
              <div className="small fw-bold text-uppercase text-muted" style={{ letterSpacing: '0.05em' }}>
                FOUNDER & ARCHITECT
              </div>
              <div className="fw-bold mt-1" style={{ color: 'var(--text-main)' }}>
                Endegena Abebe
              </div>
              <div className="small text-muted">
                "Empowering everyday Ethiopian merchants and shoppers through an accessible, 100% free digital marketplace."
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 small text-muted">
              <span>Launch Market: Ethiopia 🇪🇹</span>
              <span>•</span>
              <span>Architecture ready for Africa 🌍</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6">
            <h6 className="fw-bold mb-3" style={{ color: 'var(--text-main)' }}>
              Marketplace
            </h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-muted">
              <li>
                <Link href="/search" className="text-reset hover-orange">
                  Explore Products
                </Link>
              </li>
              <li>
                <Link href="/search?category=phones-and-electronics" className="text-reset hover-orange">
                  Phones & Electronics
                </Link>
              </li>
              <li>
                <Link href="/search?category=vehicles" className="text-reset hover-orange">
                  Vehicles & Cars
                </Link>
              </li>
              <li>
                <Link href="/search?category=computers-and-accessories" className="text-reset hover-orange">
                  Computers & Laptops
                </Link>
              </li>
              <li>
                <Link href="/for-sellers" className="text-reset text-warning fw-bold">
                  Become a Seller
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div className="col-lg-3 col-md-6 col-6">
            <h6 className="fw-bold mb-3" style={{ color: 'var(--text-main)' }}>
              Trust & Platform
            </h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-muted">
              <li>
                <Link href="/about-us" className="text-reset hover-orange d-flex align-items-center gap-1">
                  <Info size={15} /> About youGO-mart
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-reset hover-orange d-flex align-items-center gap-1">
                  <Info size={15} /> How It Works
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-reset hover-orange d-flex align-items-center gap-1">
                  <ShieldCheck size={15} className="text-success" /> Ethiopian Buyer Safety Tips
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-reset hover-orange">
                  Terms of Service & Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Language Controls & Rules */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3" style={{ color: 'var(--text-main)' }}>
              Language & Direct Rules
            </h6>
            <div className="d-flex align-items-center gap-2 mb-3">
              <Globe size={16} className="text-warning" />
              <button
                onClick={() => setLanguage('en')}
                className={`btn btn-sm ${language === 'en' ? 'btn-warning fw-bold' : 'btn-neutral'}`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('am')}
                className={`btn btn-sm ${language === 'am' ? 'btn-warning fw-bold' : 'btn-neutral'}`}
              >
                አማርኛ
              </button>
            </div>

            <div className="d-flex flex-column gap-2 small text-muted">
              <div className="d-flex align-items-start gap-2">
                <span className="badge bg-success mt-0.5">✓</span>
                <span><strong>0% Commission:</strong> Standard listings are 100% free.</span>
              </div>
              <div className="d-flex align-items-start gap-2">
                <span className="badge bg-success mt-0.5">✓</span>
                <span><strong>Direct Deals:</strong> Buyers and sellers connect directly via Phone or WhatsApp.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-3 border-top d-flex flex-column flex-md-row align-items-center justify-content-between small text-muted gap-2">
          <div>
            © {new Date().getFullYear()} <strong>youGO-mart</strong>. Founded by Endegena Abebe. All rights reserved.
          </div>
          <div className="d-flex align-items-center gap-3">
            <span>Commission-free marketplace for Ethiopia</span>
            <span>•</span>
            <span className="text-warning fw-semibold">Currency: ETB</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
