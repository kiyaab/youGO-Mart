import React from 'react';
import Link from 'next/link';
import { Sparkles, CheckCircle2, ShieldCheck, PlusCircle, Search, MessageSquare } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="py-5" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container" style={{ maxWidth: '840px' }}>
        <div className="text-center mb-5">
          <span className="badge rounded-pill bg-warning text-dark fw-bold px-3 py-1 mb-2">
            0% COMMISSION MARKETPLACE
          </span>
          <h1 className="h3 fw-bold">How youGO-mart Works</h1>
          <p className="text-muted small">
            Designed for Ethiopia first — connecting everyday buyers and sellers directly with complete transparency.
          </p>
        </div>

        <div className="yg-card p-4 p-md-5 rounded-4 shadow-sm mb-4">
          <h4 className="fw-bold mb-3" style={{ color: '#F97316' }}>Our Non-Negotiable Business Rules</h4>
          <p className="text-muted small mb-4">
            youGO-mart is not a traditional e-commerce store with mandatory carts or payout cuts. It is an open direct-connection classifieds marketplace similar to Jiji.
          </p>

          <div className="row g-3 mb-5">
            <div className="col-md-6">
              <div className="p-3 bg-light rounded-3 border h-100">
                <div className="fw-bold mb-1 text-success">✓ 0% Sales Commission</div>
                <div className="small text-muted">
                  Keep 100% of what you earn. We never deduct commissions from your item prices.
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-3 bg-light rounded-3 border h-100">
                <div className="fw-bold mb-1 text-success">✓ Free Standard Postings</div>
                <div className="small text-muted">
                  Anyone can publish product listings for free without hidden charges or subscription barriers.
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-3 bg-light rounded-3 border h-100">
                <div className="fw-bold mb-1 text-success">✓ Direct Seller Contact</div>
                <div className="small text-muted">
                  Buyers contact sellers directly via phone call, WhatsApp, or private in-platform messaging.
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="p-3 bg-light rounded-3 border h-100">
                <div className="fw-bold mb-1 text-success">✓ Self-Arranged Payment</div>
                <div className="small text-muted">
                  Buyers and sellers arrange payment (cash or telebirr) and pickup directly between themselves.
                </div>
              </div>
            </div>
          </div>

          <div className="text-center p-4 bg-warning bg-opacity-10 rounded-4 border border-warning">
            <h5 className="fw-bold mb-2">Ready to list your first item?</h5>
            <p className="small text-muted mb-3">
              Join thousands of buyers and sellers across Ethiopia today.
            </p>
            <Link href="/post-ad" className="btn-orange px-4 py-2">
              <PlusCircle size={18} /> Post a Free Ad Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
