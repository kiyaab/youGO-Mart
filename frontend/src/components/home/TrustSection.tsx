import React from 'react';
import Link from 'next/link';
import { Search, MessageSquare, Handshake, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const TrustSection: React.FC = () => {
  return (
    <section className="py-5" style={{ backgroundColor: 'var(--bg-card)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container py-lg-4">
        {/* Section Header */}
        <div className="text-center mb-5" style={{ maxWidth: '640px', margin: '0 auto' }}>
          <span className="badge rounded-pill bg-warning text-dark fw-bold px-3 py-1 mb-2">
            HOW YOUGO-MART WORKS
          </span>
          <h2 className="fw-bold tracking-tight" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Commission-Free. Direct. Transparent.
          </h2>
          <p className="text-muted">
            youGO-mart is a direct connection marketplace. No hidden checkout fees, no middleman cuts.
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="row g-4 mb-5">
          {/* Step 1 */}
          <div className="col-md-4">
            <div className="yg-card p-4 h-100 text-center text-md-start" style={{ borderRadius: '16px' }}>
              <div
                className="d-inline-flex align-items-center justify-content-center mb-3"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--primary-orange-light)',
                  color: 'var(--primary-orange)',
                }}
              >
                <Search size={28} />
              </div>
              <div className="badge bg-secondary mb-2 text-uppercase" style={{ fontSize: '0.65rem' }}>
                Step 1
              </div>
              <h5 className="fw-bold mb-2">1. Discover a Product</h5>
              <p className="text-muted small m-0" style={{ lineHeight: 1.6 }}>
                Search thousands of authentic items near you in Addis Ababa, Hawassa, Adama, and beyond. Filter by exact neighborhood, price, and condition.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="col-md-4">
            <div className="yg-card p-4 h-100 text-center text-md-start" style={{ borderRadius: '16px' }}>
              <div
                className="d-inline-flex align-items-center justify-content-center mb-3"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(22, 163, 74, 0.12)',
                  color: '#16A34A',
                }}
              >
                <MessageSquare size={28} />
              </div>
              <div className="badge bg-secondary mb-2 text-uppercase" style={{ fontSize: '0.65rem' }}>
                Step 2
              </div>
              <h5 className="fw-bold mb-2">2. Contact the Seller</h5>
              <p className="text-muted small m-0" style={{ lineHeight: 1.6 }}>
                Connect directly on your terms. Call via phone, start a WhatsApp chat, or send an in-platform message to ask questions and negotiate.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="col-md-4">
            <div className="yg-card p-4 h-100 text-center text-md-start" style={{ borderRadius: '16px' }}>
              <div
                className="d-inline-flex align-items-center justify-content-center mb-3"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(217, 119, 6, 0.12)',
                  color: '#D97706',
                }}
              >
                <Handshake size={28} />
              </div>
              <div className="badge bg-secondary mb-2 text-uppercase" style={{ fontSize: '0.65rem' }}>
                Step 3
              </div>
              <h5 className="fw-bold mb-2">3. Agree on the Purchase</h5>
              <p className="text-muted small m-0" style={{ lineHeight: 1.6 }}>
                Meet in a secure, public place (e.g. Bole, Kazanchis). Inspect the product thoroughly, and settle the payment directly via cash or telebirr.
              </p>
            </div>
          </div>
        </div>

        {/* Callout Banner with CTA */}
        <div
          className="p-4 p-md-5 rounded-4 d-flex flex-column flex-md-row align-items-center justify-content-between gap-4"
          style={{
            backgroundColor: '#171717',
            color: '#FFFFFF',
          }}
        >
          <div>
            <h4 className="fw-bold mb-2 text-white">Have something you no longer need?</h4>
            <p className="m-0 text-white-50" style={{ maxWidth: '500px' }}>
              Publish your first listing in less than 2 minutes. Free standard postings, zero sales commission forever.
            </p>
          </div>
          <Link href="/post-ad" className="btn-orange px-4 py-3 flex-shrink-0 text-nowrap">
            Start Selling for Free →
          </Link>
        </div>
      </div>
    </section>
  );
};
