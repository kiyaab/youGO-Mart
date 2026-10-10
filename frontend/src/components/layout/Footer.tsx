'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { ShieldCheck, HeartHandshake, PhoneCall, AlertCircle, Info, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();

  if (pathname === '/about-us') {
    return null;
  }

  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-card)',
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
              <strong>youGO-mart</strong> is Ethiopia's premier commission-free online classifieds marketplace. We connect buyers and sellers directly across Addis Ababa and all Ethiopian regions with zero transaction cuts and zero middlemen.
            </p>
            <div className="p-3 yg-card mb-3 bg-opacity-50">
              <div className="small fw-bold text-uppercase text-muted" style={{ letterSpacing: '0.05em' }}>
                FOUNDER & VISION
              </div>
              <div className="fw-bold mt-1" style={{ color: 'var(--text-main)' }}>
                Endegena Abebe
              </div>
              <div className="small text-muted">
                "Empowering everyday Ethiopian buyers and sellers with an accessible, completely free digital marketplace."
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
                  Explore All Listings
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
                <Link href="/search?category=home-and-furniture" className="text-reset hover-orange">
                  Home & Furniture
                </Link>
              </li>
              <li>
                <Link href="/post-ad" className="text-reset text-warning fw-bold">
                  + Post a Free Ad
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div className="col-lg-3 col-md-6 col-6">
            <h6 className="fw-bold mb-3" style={{ color: 'var(--text-main)' }}>
              Trust & Safety
            </h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 text-muted">
              <li>
                <Link href="/safety" className="text-reset hover-orange d-flex align-items-center gap-1">
                  <ShieldCheck size={15} className="text-success" /> Ethiopian Buyer Safety Tips
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-reset hover-orange d-flex align-items-center gap-1">
                  <Info size={15} /> How youGO-mart Works
                </Link>
              </li>
              <li>
                <Link href="/seller/verify" className="text-reset hover-orange d-flex align-items-center gap-1">
                  <HeartHandshake size={15} className="text-warning" /> Get Verified Badge
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-reset hover-orange">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-reset hover-orange">
                  Privacy Policy & Cookies
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-reset hover-orange">
                  Community Rules
                </Link>
              </li>
            </ul>
          </div>

          {/* Marketplace Rules & Support */}
          <div className="col-lg-3 col-md-6">
            <h6 className="fw-bold mb-3" style={{ color: 'var(--text-main)' }}>
              Core Rules & Contact
            </h6>
            <div className="d-flex flex-column gap-2 small text-muted">
              <div className="d-flex align-items-start gap-2">
                <span className="badge bg-success mt-1">✓</span>
                <span><strong>100% Free:</strong> No listing fees, no commissions on sales.</span>
              </div>
              <div className="d-flex align-items-start gap-2">
                <span className="badge bg-success mt-1">✓</span>
                <span><strong>Direct Deals:</strong> Buyers and sellers connect directly via Phone, WhatsApp, or Chat.</span>
              </div>
              <div className="d-flex align-items-start gap-2">
                <span className="badge bg-warning text-dark mt-1">!</span>
                <span><strong>Safe Inspection:</strong> Always inspect goods in person before paying.</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-top">
              <div className="small fw-semibold text-muted mb-1">Need assistance or report spam?</div>
              <Link href="/search" className="btn btn-sm btn-neutral w-100 py-1">
                <AlertCircle size={14} className="text-danger" /> Report Suspicious Listing
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Guarantee */}
        <div className="pt-3 border-top d-flex flex-column flex-md-row align-items-center justify-content-between small text-muted gap-2">
          <div>
            © {new Date().getFullYear()} <strong>youGO-mart</strong>. Founded by Endegena Abebe. All rights reserved.
          </div>
          <div className="d-flex align-items-center gap-3">
            <span>Commission-free classifieds for Ethiopia</span>
            <span>•</span>
            <span className="text-warning fw-semibold">Currency: ETB</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
