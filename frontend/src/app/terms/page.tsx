import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="py-5" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <h1 className="h3 fw-bold mb-3">Terms of Service & Community Guidelines</h1>
        <p className="text-muted small mb-4">
          Effective date: October 2026 • youGO-mart Marketplace (Ethiopia)
        </p>

        <div className="yg-card p-4 p-md-5 rounded-4 shadow-sm">
          <section className="mb-4">
            <h5 className="fw-bold mb-2">1. About youGO-mart</h5>
            <p className="small text-muted" style={{ lineHeight: 1.7 }}>
              youGO-mart is a commission-free online classifieds marketplace founded by <strong>Endegena Abebe</strong>, designed for Ethiopia first with architectural readiness for African expansion. We provide discovery and communication tools connecting buyers and sellers directly.
            </p>
          </section>

          <section className="mb-4">
            <h5 className="fw-bold mb-2">2. Commission-Free Promise</h5>
            <p className="small text-muted" style={{ lineHeight: 1.7 }}>
              Standard product listings are completely free of charge. youGO-mart does not take any sales commission or transaction cuts. All payments and delivery arrangements are made directly between the buyer and the seller.
            </p>
          </section>

          <section className="mb-4">
            <h5 className="fw-bold mb-2">3. Prohibited Content</h5>
            <p className="small text-muted" style={{ lineHeight: 1.7 }}>
              Users are strictly prohibited from publishing fake, stolen, or counterfeit goods, illegal substances, deceptive job offers, or predatory schemes. Any suspicious activity will be reviewed by platform moderators and reported accounts will be suspended immediately.
            </p>
          </section>

          <section className="mb-4">
            <h5 className="fw-bold mb-2">4. User Safety & Responsibility</h5>
            <p className="small text-muted" style={{ lineHeight: 1.7 }}>
              While youGO-mart provides moderation queues, verified seller badges, and report tools, buyers and sellers are responsible for exercising good judgment, meeting in safe public locations across Ethiopia, and inspecting goods before handing over cash or telebirr payments.
            </p>
          </section>

          <div className="pt-3 border-top text-center">
            <Link href="/" className="btn-orange px-4 py-2">
              Back to youGO-mart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
