'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ListingDetail, ListingCard as ListingCardType } from '@/types';
import { ListingCard } from '@/components/listing/ListingCard';
import { useAuth } from '@/lib/auth-context';
import {
  MapPin,
  Clock,
  Eye,
  CheckCircle2,
  Phone,
  MessageCircle,
  MessageSquare,
  Mail,
  Share2,
  Heart,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Tag,
  AlertTriangle,
} from 'lucide-react';

interface ListingDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ListingDetailPage({ params }: ListingDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { user, isAuthenticated } = useAuth();

  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [related, setRelated] = useState<ListingCardType[]>([]);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Contact & Modals
  const [showPhone, setShowPhone] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('scam');
  const [reportNotes, setReportNotes] = useState('');
  const [reportSent, setReportSent] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadListing() {
      setLoading(true);
      try {
        const data = await api.listings.getBySlugOrId(slug);
        setListing(data);
        if (data.id) {
          api.listings.getRelated(data.id).then(setRelated).catch(() => {});
        }
      } catch (err: any) {
        setError(err.message || 'Listing not found.');
      } finally {
        setLoading(false);
      }
    }
    loadListing();
  }, [slug]);

  const handleCallClick = () => {
    if (!listing) return;
    setShowPhone(true);
    api.listings.recordContactClick(listing.id, 'call').catch(() => {});
  };

  const handleWhatsAppClick = () => {
    if (!listing) return;
    api.listings.recordContactClick(listing.id, 'whatsapp').catch(() => {});
    const cleanPhone = listing.seller.contact_phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hello! I am inquiring about your listing "${listing.title}" on youGO-mart.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;
    if (!isAuthenticated) {
      alert('Please sign in or use the demo switcher to send messages.');
      return;
    }
    if (!messageContent.trim()) return;

    setSendingMessage(true);
    try {
      api.listings.recordContactClick(listing.id, 'message').catch(() => {});
      const res = await api.messaging.startConversation(listing.id, messageContent.trim());
      setShowMessageModal(false);
      setMessageContent('');
      router.push(`/messages?id=${res.conversation_id}`);
    } catch (err: any) {
      alert(err.message || 'Failed to send message.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;
    try {
      await api.listings.report(listing.id, {
        reason: reportReason,
        description: reportNotes,
      });
      setReportSent(true);
      setTimeout(() => {
        setShowReportModal(false);
        setReportSent(false);
      }, 2000);
    } catch {
      alert('Failed to submit report.');
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading listing...</span>
        </div>
        <p className="mt-3 text-muted">Loading product details...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="container py-5 text-center">
        <div className="yg-card p-5 max-w-md mx-auto">
          <AlertTriangle size={48} className="text-warning mb-3" />
          <h4 className="fw-bold">Listing Not Available</h4>
          <p className="text-muted small">
            {error || 'This listing may have expired, been sold, or was removed by the seller.'}
          </p>
          <Link href="/search" className="btn-orange px-4 py-2 mt-2">
            Back to Marketplace Search
          </Link>
        </div>
      </div>
    );
  }

  const images = listing.images && listing.images.length > 0 ? listing.images : [{ id: 0, url: '/placeholder-product.png', is_primary: true, display_order: 0 }];
  const currentImageUrl = images[selectedImageIdx]?.url || '/placeholder-product.png';
  const formattedPrice = Number(listing.price).toLocaleString('en-US');

  return (
    <div className="py-4">
      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-3">
          <ol className="breadcrumb small text-muted">
            <li className="breadcrumb-item">
              <Link href="/" className="text-reset hover-orange">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href={`/search?category=${listing.category_slug}`} className="text-reset hover-orange">
                {listing.category_name}
              </Link>
            </li>
            <li className="breadcrumb-item active text-truncate" style={{ maxWidth: '300px' }} aria-current="page">
              {listing.title}
            </li>
          </ol>
        </nav>

        <div className="row g-4">
          {/* Left Column: Image Gallery & Description */}
          <div className="col-lg-8">
            {/* Main Image Gallery */}
            <div className="yg-card p-2 rounded-4 mb-4">
              {/* Main Preview Container */}
              <div
                className="position-relative w-100 rounded-3 overflow-hidden"
                style={{
                  height: '460px',
                  backgroundColor: '#0F172A',
                }}
              >
                <Image
                  src={currentImageUrl}
                  alt={listing.title}
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />

                {/* Status Badges Overlay */}
                <div className="position-absolute top-0 start-0 m-3 d-flex flex-wrap gap-2">
                  {listing.is_promoted && (
                    <span className="badge-featured shadow-sm">
                      <Sparkles size={13} /> Featured Spotlight
                    </span>
                  )}
                  {listing.is_negotiable && (
                    <span className="badge-negotiable shadow-sm">
                      Price Negotiable
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails Navigation */}
              {images.length > 1 && (
                <div className="d-flex gap-2 p-2 overflow-x-auto mt-2">
                  {images.map((img, idx) => (
                    <button
                      key={img.id || idx}
                      type="button"
                      className={`btn p-0 rounded-2 overflow-hidden border-2 flex-shrink-0 ${
                        selectedImageIdx === idx ? 'border-warning' : 'border-transparent'
                      }`}
                      style={{
                        width: '74px',
                        height: '74px',
                        position: 'relative',
                        opacity: selectedImageIdx === idx ? 1 : 0.65,
                      }}
                      onClick={() => setSelectedImageIdx(idx)}
                    >
                      <Image
                        src={img.url}
                        alt={`Thumbnail ${idx + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details & Specifications */}
            <div className="yg-card p-4 rounded-4 mb-4">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pb-3 mb-3 border-bottom">
                <span className="badge-condition px-3 py-1 fw-bold">
                  Condition: {listing.condition_display || listing.condition}
                </span>
                <div className="d-flex align-items-center gap-3 text-muted small">
                  <span className="d-flex align-items-center gap-1">
                    <Clock size={14} /> Posted {listing.time_ago}
                  </span>
                  <span className="d-flex align-items-center gap-1">
                    <Eye size={14} /> {listing.views_count} views
                  </span>
                  <span className="badge bg-light text-dark border">
                    ID: {listing.reference_id}
                  </span>
                </div>
              </div>

              {/* Title & Price for Mobile */}
              <div className="d-lg-none mb-3">
                <h1 className="h4 fw-bold mb-2">{listing.title}</h1>
                <div className="d-flex align-items-baseline gap-2">
                  <span className="yg-price-large">{formattedPrice}</span>
                  <span className="fw-bold text-muted">{listing.currency}</span>
                </div>
              </div>

              {/* Attributes / Key Specifications */}
              <h5 className="fw-bold mb-3">Item Specifications</h5>
              <div className="row g-2 mb-4">
                <div className="col-sm-6">
                  <div className="p-2 bg-light bg-opacity-50 rounded border d-flex justify-content-between small">
                    <span className="text-muted">Brand:</span>
                    <strong className="text-end">{listing.brand || 'Unbranded'}</strong>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="p-2 bg-light bg-opacity-50 rounded border d-flex justify-content-between small">
                    <span className="text-muted">Model:</span>
                    <strong className="text-end">{listing.model || 'Standard'}</strong>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="p-2 bg-light bg-opacity-50 rounded border d-flex justify-content-between small">
                    <span className="text-muted">Location:</span>
                    <strong className="text-end">{listing.neighborhood}, {listing.city}</strong>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="p-2 bg-light bg-opacity-50 rounded border d-flex justify-content-between small">
                    <span className="text-muted">Negotiable:</span>
                    <strong className="text-end">{listing.is_negotiable ? 'Yes' : 'Fixed Price'}</strong>
                  </div>
                </div>
              </div>

              {/* Description Body */}
              <h5 className="fw-bold mb-3">Description</h5>
              <div
                className="text-break mb-4"
                style={{
                  whiteSpace: 'pre-line',
                  lineHeight: 1.7,
                  color: 'var(--text-main)',
                }}
              >
                {listing.description}
              </div>

              {/* Actions: Share & Report */}
              <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                <button
                  onClick={handleShare}
                  className="btn btn-neutral btn-sm d-flex align-items-center gap-1"
                >
                  <Share2 size={15} /> {copiedLink ? 'Link Copied!' : 'Share Listing'}
                </button>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="btn btn-sm text-danger d-flex align-items-center gap-1 hover-underline"
                >
                  <ShieldAlert size={15} /> Report this ad
                </button>
              </div>
            </div>

            {/* Related Listings */}
            {related.length > 0 && (
              <div className="mt-4">
                <h5 className="fw-bold mb-3">Similar Listings in {listing.category_name}</h5>
                <div className="row g-3">
                  {related.slice(0, 3).map((item) => (
                    <div key={item.id} className="col-md-4 col-sm-6">
                      <ListingCard listing={item} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Price & Seller Contact Conversion Panel */}
          <div className="col-lg-4">
            <div className="yg-card p-4 rounded-4 shadow-sm position-sticky" style={{ top: '80px' }}>
              {/* Desktop Price Header */}
              <div className="d-none d-lg-block mb-3">
                <h1 className="h4 fw-bold mb-2">{listing.title}</h1>
                <div className="d-flex align-items-baseline gap-2 mb-2">
                  <span className="yg-price-large">{formattedPrice}</span>
                  <span className="h6 fw-bold text-muted">{listing.currency}</span>
                  {listing.is_negotiable && (
                    <span className="badge-negotiable ms-1">Negotiable</span>
                  )}
                </div>
                <div className="d-flex align-items-center gap-1 text-muted small">
                  <MapPin size={15} className="text-warning" />
                  <span>
                    {listing.neighborhood ? `${listing.neighborhood}, ` : ''}{listing.city}
                    {listing.landmark ? ` (${listing.landmark})` : ''}
                  </span>
                </div>
              </div>

              {/* Seller Summary Box */}
              <div className="p-3 bg-light bg-opacity-75 rounded-3 mb-4 border">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="d-flex align-items-center justify-content-center bg-warning text-white fw-bold rounded-circle"
                      style={{ width: '42px', height: '42px' }}
                    >
                      {listing.seller.public_name.charAt(0)}
                    </div>
                    <div>
                      <div className="fw-bold small">{listing.seller.public_name}</div>
                      {listing.seller.business_name && (
                        <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                          {listing.seller.business_name}
                        </div>
                      )}
                    </div>
                  </div>
                  {listing.seller.is_verified && (
                    <span className="badge-verified">
                      <CheckCircle2 size={12} /> Verified
                    </span>
                  )}
                </div>

                <div className="small text-muted d-flex flex-column gap-1 pt-2 border-top" style={{ fontSize: '0.78rem' }}>
                  <div>• {listing.seller.response_time_str || 'Typically replies quickly'}</div>
                  <div>• Active seller in {listing.seller.location_city}</div>
                  <div>• {listing.seller.active_listings_count || 1} active listings on youGO-mart</div>
                </div>
              </div>

              {/* PRIMARY CONTACT ACTIONS */}
              <div className="d-flex flex-column gap-2 mb-4">
                {/* 1. Phone Call */}
                {listing.seller.allow_calls && (
                  <div>
                    {showPhone ? (
                      <a
                        href={`tel:${listing.seller.contact_phone}`}
                        className="btn btn-neutral w-100 py-3 d-flex align-items-center justify-content-center gap-2 fw-bold"
                        style={{ fontSize: '1.05rem', backgroundColor: '#ECFDF5', color: '#047857' }}
                      >
                        <Phone size={20} className="text-success" />
                        {listing.seller.contact_phone}
                      </a>
                    ) : (
                      <button
                        onClick={handleCallClick}
                        className="btn btn-neutral w-100 py-3 d-flex align-items-center justify-content-center gap-2 fw-bold"
                      >
                        <Phone size={19} className="text-warning" />
                        Show Phone Number
                      </button>
                    )}
                  </div>
                )}

                {/* 2. WhatsApp */}
                {listing.seller.allow_whatsapp && (
                  <button
                    onClick={handleWhatsAppClick}
                    className="btn w-100 py-3 d-flex align-items-center justify-content-center gap-2 fw-bold"
                    style={{ backgroundColor: '#25D366', color: '#FFFFFF' }}
                  >
                    <MessageCircle size={20} />
                    Chat on WhatsApp
                  </button>
                )}

                {/* 3. In-Platform Private Message */}
                {listing.seller.allow_messages && (
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        alert('Please sign in or use the demo switcher to send messages.');
                        return;
                      }
                      setShowMessageModal(true);
                    }}
                    className="btn-orange w-100 py-3 d-flex align-items-center justify-content-center gap-2 fw-bold"
                  >
                    <MessageSquare size={19} />
                    Send In-App Message
                  </button>
                )}
              </div>

              {/* ETHIOPIAN BUYER SAFETY NOTICE */}
              <div
                className="p-3 rounded-3"
                style={{
                  backgroundColor: 'rgba(217, 119, 6, 0.08)',
                  border: '1px solid rgba(217, 119, 6, 0.25)',
                }}
              >
                <div className="d-flex align-items-center gap-2 text-warning fw-bold small mb-2">
                  <ShieldCheck size={18} /> Safety Tips for Ethiopian Buyers
                </div>
                <ul className="list-unstyled m-0 text-muted small d-flex flex-column gap-1" style={{ fontSize: '0.78rem' }}>
                  <li>✓ Meet the seller in a busy, public place (e.g. Bole, Kazanchis, Piassa).</li>
                  <li>✓ Inspect the item and verify genuine condition before paying.</li>
                  <li>✓ Never send advance payments, deposits, or delivery fees before meeting.</li>
                  <li>✓ Pay with cash or instant telebirr/CBE confirmation on the spot.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center z-3 p-3"
          onClick={() => setShowMessageModal(false)}
        >
          <div
            className="yg-card p-4 w-100"
            style={{ maxWidth: '500px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <MessageSquare className="text-warning" size={20} /> Message {listing.seller.public_name}
            </h5>
            <div className="p-2 bg-light rounded small mb-3 border">
              <strong>Item:</strong> {listing.title} ({formattedPrice} {listing.currency})
            </div>
            <form onSubmit={handleSendMessage}>
              <div className="mb-3">
                <label className="form-label small fw-semibold">Your Message</label>
                <textarea
                  className="form-control"
                  rows={4}
                  placeholder="Is this still available? Can we arrange inspection?"
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  required
                />
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-neutral"
                  onClick={() => setShowMessageModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-orange"
                  disabled={sendingMessage}
                >
                  {sendingMessage ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center z-3 p-3"
          onClick={() => setShowReportModal(false)}
        >
          <div
            className="yg-card p-4 w-100"
            style={{ maxWidth: '480px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="fw-bold mb-2 text-danger d-flex align-items-center gap-2">
              <ShieldAlert size={20} /> Report This Listing
            </h5>
            <p className="text-muted small mb-3">
              Help youGO-mart stay safe. Reports are immediately reviewed by our moderation staff.
            </p>

            {reportSent ? (
              <div className="alert alert-success small">
                Report submitted successfully! Thank you for protecting the community.
              </div>
            ) : (
              <form onSubmit={handleReportSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Reason for Report</label>
                  <select
                    className="form-select form-select-sm"
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                  >
                    <option value="scam">Suspicious Scam / Advance Fee Fraud</option>
                    <option value="counterfeit">Counterfeit / Fake Item</option>
                    <option value="prohibited">Prohibited or Illegal Goods</option>
                    <option value="misleading">Misleading Price or Specs</option>
                    <option value="duplicate">Spam or Duplicate Post</option>
                    <option value="inappropriate">Inappropriate Content</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Additional Details</label>
                  <textarea
                    className="form-control form-control-sm"
                    rows={3}
                    placeholder="Describe what is suspicious about this listing..."
                    value={reportNotes}
                    onChange={(e) => setReportNotes(e.target.value)}
                  />
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-neutral btn-sm"
                    onClick={() => setShowReportModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-danger btn-sm">
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
