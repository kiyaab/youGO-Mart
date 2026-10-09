import React from 'react';
import Link from 'next/link';
import { ShieldCheck, AlertTriangle, MapPin, Eye, CheckCircle2, PhoneCall } from 'lucide-react';

export default function SafetyTipsPage() {
  return (
    <div className="py-5" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="text-center mb-5">
          <div className="d-inline-flex p-3 rounded-circle bg-success bg-opacity-10 text-success mb-2">
            <ShieldCheck size={36} />
          </div>
          <h1 className="h3 fw-bold">Marketplace Safety Guidelines</h1>
          <p className="text-muted small">
            Essential safety rules for buyers and sellers across Addis Ababa and Ethiopia.
          </p>
        </div>

        <div className="yg-card p-4 p-md-5 rounded-4 shadow-sm mb-4">
          <h5 className="fw-bold text-success mb-3 d-flex align-items-center gap-2">
            <CheckCircle2 size={20} /> Guidelines for Buyers
          </h5>
          <div className="d-flex flex-column gap-3 mb-4">
            <div className="d-flex align-items-start gap-3 p-3 bg-light rounded-3 border">
              <MapPin size={22} className="text-warning flex-shrink-0 mt-1" />
              <div>
                <strong>Always Meet in Safe, Public Spaces:</strong> Arrange to meet in well-lit, busy public spots in Addis Ababa (e.g. Bole Medhanialem, Kazanchis, Edna Mall, Piassa) during daytime hours. Avoid private or remote locations.
              </div>
            </div>

            <div className="d-flex align-items-start gap-3 p-3 bg-light rounded-3 border">
              <Eye size={22} className="text-warning flex-shrink-0 mt-1" />
              <div>
                <strong>Inspect Before You Pay:</strong> For electronics and phones, check IMEI, battery health, and test camera and SIM card. For cars, review customs and registration certificates with a mechanic.
              </div>
            </div>

            <div className="d-flex align-items-start gap-3 p-3 bg-light rounded-3 border">
              <AlertTriangle size={22} className="text-danger flex-shrink-0 mt-1" />
              <div>
                <strong>Never Send Advance Deposits:</strong> youGO-mart is a direct-deal classifieds platform. Never wire funds or telebirr deposits for "delivery reservation" before holding the item in your hand.
              </div>
            </div>
          </div>

          <h5 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2 pt-3 border-top">
            <CheckCircle2 size={20} /> Guidelines for Sellers
          </h5>
          <div className="d-flex flex-column gap-3 mb-4">
            <div className="d-flex align-items-start gap-3 p-3 bg-light rounded-3 border">
              <PhoneCall size={22} className="text-primary flex-shrink-0 mt-1" />
              <div>
                <strong>Confirm Payment Confirmation Immediately:</strong> When receiving payments via telebirr or Commercial Bank of Ethiopia (CBE), check your own banking SMS/app directly rather than trusting screenshots from buyers.
              </div>
            </div>

            <div className="d-flex align-items-start gap-3 p-3 bg-light rounded-3 border">
              <ShieldCheck size={22} className="text-success flex-shrink-0 mt-1" />
              <div>
                <strong>Apply for the Verified Badge:</strong> Verified sellers build instant credibility and receive 3x more buyer inquiries.
              </div>
            </div>
          </div>

          <div className="text-center pt-3 border-top">
            <Link href="/search" className="btn-orange px-4 py-2">
              Browse Safe Marketplace Listings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
