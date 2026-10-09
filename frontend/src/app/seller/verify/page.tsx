'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { ShieldCheck, CheckCircle2, Upload, FileText, ArrowLeft, AlertCircle } from 'lucide-react';

export default function SellerVerificationPage() {
  const router = useRouter();
  const { user, isAuthenticated, refreshUser } = useAuth();

  const [docType, setDocType] = useState('national_id');
  const [docNumber, setDocNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please sign in first.');
      return;
    }

    setSubmitting(true);
    try {
      await api.seller.applyVerification({
        document_type: docType,
        document_number: docNumber,
        seller_notes: notes,
      });
      setSubmitted(true);
      await refreshUser();
    } catch (err: any) {
      alert(err.message || 'Failed to submit verification.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container" style={{ maxWidth: '680px' }}>
        <Link href="/dashboard" className="btn btn-neutral btn-sm mb-3 d-inline-flex align-items-center gap-1">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="yg-card p-4 p-md-5 rounded-4 shadow-sm">
          <div className="text-center mb-4">
            <div
              className="d-inline-flex p-3 rounded-circle bg-success bg-opacity-10 text-success mb-2"
            >
              <ShieldCheck size={36} />
            </div>
            <h2 className="h4 fw-bold">Seller Verification Program</h2>
            <p className="text-muted small">
              Receive the official verified seller badge across Ethiopia to gain maximum trust from buyers.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="row g-2 mb-4">
            <div className="col-sm-4">
              <div className="p-3 bg-light rounded-3 text-center border h-100">
                <CheckCircle2 size={20} className="text-success mb-1" />
                <div className="fw-bold small">Verified Badge</div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                  Green badge on all your ads
                </div>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="p-3 bg-light rounded-3 text-center border h-100">
                <CheckCircle2 size={20} className="text-success mb-1" />
                <div className="fw-bold small">3x Inquiries</div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                  Higher buyer call frequency
                </div>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="p-3 bg-light rounded-3 text-center border h-100">
                <CheckCircle2 size={20} className="text-success mb-1" />
                <div className="fw-bold small">Priority Review</div>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                  Fast moderation queue
                </div>
              </div>
            </div>
          </div>

          {submitted ? (
            <div className="alert alert-success p-4 rounded-3 text-center">
              <CheckCircle2 size={40} className="text-success mb-2" />
              <h5 className="fw-bold">Verification Application Received!</h5>
              <p className="small m-0 text-muted">
                Our marketplace team will inspect your details within 24 hours. You can monitor the status on your dashboard.
              </p>
              <Link href="/dashboard" className="btn-orange btn-sm mt-3 px-4">
                Return to Dashboard
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Verification Document Type</label>
                <select
                  className="form-select"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                >
                  <option value="national_id">Ethiopian Kebele / National ID</option>
                  <option value="business_license">Commercial Registration / Business License (ንግድ ፈቃድ)</option>
                  <option value="passport">Ethiopian Passport / Resident ID</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">
                  Document ID / Registration Number <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. AA-03-998822 or TIN Number"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">Store or Seller Notes</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="e.g. Physical electronics store in Bole Edna Mall, registered importer since 2021..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="p-3 bg-light rounded-3 mb-4 border small text-muted">
                <AlertCircle size={16} className="text-warning d-inline me-1" />
                <strong>Privacy Commitment:</strong> Verification documents are stored in private restricted storage and are never exposed publicly or shared with third parties.
              </div>

              <button
                type="submit"
                className="btn-orange w-100 py-3 fw-bold"
                disabled={submitting}
              >
                {submitting ? 'Submitting Application...' : 'Submit Verification Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
