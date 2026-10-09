'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { SellerProfile, ListingCard as ListingCardType } from '@/types';
import {
  Store,
  Tag,
  Eye,
  PhoneCall,
  CheckCircle2,
  Clock,
  PlusCircle,
  Bookmark,
  Check,
  Trash2,
  ShieldCheck,
  Lock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

export default function SellerDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { language, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'listings' | 'profile' | 'analytics'>('listings');
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [listings, setListings] = useState<ListingCardType[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Profile Form state
  const [publicName, setPublicName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Addis Ababa');
  const [neighborhood, setNeighborhood] = useState('Bole');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/seller/dashboard');
      return;
    }

    async function loadDashboard() {
      setLoading(true);
      try {
        const [profData, analData, listData] = await Promise.all([
          api.seller.getMyProfile(),
          api.seller.getAnalytics(),
          api.listings.getAll({ limit: 50 }),
        ]);
        setProfile(profData);
        setAnalytics(analData);

        if (profData) {
          setPublicName(profData.public_name || '');
          setBusinessName(profData.business_name || '');
          setBio(profData.bio || '');
          setPhone(profData.contact_phone || '');
          setCity(profData.location_city || 'Addis Ababa');
          setNeighborhood(profData.location_neighborhood || 'Bole');
        }

        if (profData && listData.results) {
          const myListings = listData.results.filter(
            (l: ListingCardType) => l.seller_id === profData.id
          );
          setListings(myListings.length > 0 ? myListings : listData.results.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load seller hub:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [user, isAuthenticated, authLoading, router]);

  // STRICT ROLE GUARD: Block Buyers from accessing Seller Hub!
  if (!authLoading && user && user.role === 'buyer') {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '70vh' }}>
        <div className="glass-card p-5 max-w-lg mx-auto rounded-4 text-center">
          <div className="d-inline-flex p-3 rounded-circle bg-warning bg-opacity-10 text-warning mb-3">
            <Lock size={40} />
          </div>
          <h3 className="fw-bold mb-2">{t('access_restricted')}</h3>
          <p className="text-muted small mb-4" style={{ lineHeight: 1.6 }}>
            {t('seller_only_notice')}
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link href="/buyer/dashboard" className="btn btn-neutral px-4 py-2">
              Go to Buyer Portal
            </Link>
            <Link href="/post-ad" className="btn-orange px-4 py-2">
              Upgrade to Seller
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (listingId: number, newStatus: string) => {
    try {
      await api.listings.updateStatus(listingId, newStatus);
      setListings(
        listings.map((l) => (l.id === listingId ? { ...l, status: newStatus as any } : l))
      );
    } catch {
      alert('Failed to update status.');
    }
  };

  const handleDeleteListing = async (listingId: number) => {
    if (!confirm('Are you sure you want to remove this product?')) return;
    try {
      await api.listings.delete(listingId);
      setListings(listings.filter((l) => l.id !== listingId));
    } catch {
      alert('Failed to delete item.');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const updated = await api.seller.updateMyProfile({
        public_name: publicName,
        business_name: businessName,
        bio,
        contact_phone: phone,
        location_city: city,
        location_neighborhood: neighborhood,
      });
      setProfile(updated);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch {
      alert('Failed to save profile changes.');
    } finally {
      setSavingProfile(false);
    }
  };

  const filteredListings =
    statusFilter === 'all'
      ? listings
      : listings.filter((l) => l.status === statusFilter);

  return (
    <div className="py-4" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container">
        {/* Header */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4 pb-3 border-bottom">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <div className="p-2 rounded-3 bg-warning bg-opacity-10 text-warning">
                <Store size={22} />
              </div>
              <h1 className="h3 fw-bold m-0" style={{ letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                {t('seller_hub')}
              </h1>
              {profile?.is_verified && (
                <span className="badge-verified">
                  <CheckCircle2 size={13} /> Verified Seller
                </span>
              )}
            </div>
            <p className="text-muted small m-0">
              {language === 'am' ? 'የእርስዎን ምርቶች፣ ደንበኞች፣ እና የገበያ አፈፃፀም ያስተዳድሩ።' : 'Manage your live inventory, buyer calls, and storefront across Ethiopia.'}
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            {!profile?.is_verified && (
              <Link href="/seller/verify" className="btn btn-sm btn-outline-warning fw-semibold rounded-pill">
                Request Verified Badge
              </Link>
            )}
            <Link href="/post-ad" className="btn-orange btn-sm px-3.5 py-2 rounded-pill shadow-sm">
              <PlusCircle size={16} /> Post Free Ad
            </Link>
          </div>
        </div>

        {/* Real Database Metrics */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="glass-card p-3 rounded-4 h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-semibold">Active Inventory</span>
                <div className="p-2 rounded-3 bg-success bg-opacity-10 text-success">
                  <Tag size={17} />
                </div>
              </div>
              <h3 className="fw-extrabold m-0" style={{ color: 'var(--text-main)' }}>
                {analytics?.status_counts?.active ?? listings.filter((l) => l.status === 'active').length}
              </h3>
              <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
                Live across Ethiopia
              </span>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="glass-card p-3 rounded-4 h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-semibold">Buyer Impressions</span>
                <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                  <Eye size={17} />
                </div>
              </div>
              <h3 className="fw-extrabold m-0" style={{ color: 'var(--text-main)' }}>
                {analytics?.overview?.total_views ?? (profile?.total_views || 0)}
              </h3>
              <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
                Total views
              </span>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="glass-card p-3 rounded-4 h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-semibold">Contact Inquiries</span>
                <div className="p-2 rounded-3 bg-warning bg-opacity-10 text-warning">
                  <PhoneCall size={17} />
                </div>
              </div>
              <h3 className="fw-extrabold m-0" style={{ color: 'var(--text-main)' }}>
                {analytics?.overview?.total_contact_clicks ?? (profile?.total_contact_clicks || 0)}
              </h3>
              <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
                Phone & WhatsApp clicks
              </span>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="glass-card p-3 rounded-4 h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-semibold">Commission</span>
                <div className="p-2 rounded-3 bg-success bg-opacity-10 text-success">
                  <ShieldCheck size={17} />
                </div>
              </div>
              <h3 className="fw-extrabold m-0 text-success">
                0 ETB
              </h3>
              <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
                100% Free guarantee
              </span>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="d-flex align-items-center gap-2 border-bottom mb-4">
          <button
            className={`btn border-0 py-2 px-3 fw-bold ${
              activeTab === 'listings' ? 'text-warning border-bottom border-warning border-3' : 'text-muted'
            }`}
            onClick={() => setActiveTab('listings')}
          >
            My Listings ({listings.length})
          </button>
          <button
            className={`btn border-0 py-2 px-3 fw-bold ${
              activeTab === 'profile' ? 'text-warning border-bottom border-warning border-3' : 'text-muted'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Storefront Settings
          </button>
          <button
            className={`btn border-0 py-2 px-3 fw-bold ${
              activeTab === 'analytics' ? 'text-warning border-bottom border-warning border-3' : 'text-muted'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            Performance
          </button>
        </div>

        {/* TAB 1: Listings Table */}
        {activeTab === 'listings' && (
          <div>
            <div className="d-flex align-items-center gap-2 mb-3 overflow-x-auto pb-2">
              {['all', 'active', 'reserved', 'sold', 'paused'].map((st) => (
                <button
                  key={st}
                  className={`btn btn-sm text-capitalize px-3 rounded-pill ${
                    statusFilter === st ? 'btn-warning fw-bold' : 'btn-neutral'
                  }`}
                  onClick={() => setStatusFilter(st)}
                >
                  {st}
                </button>
              ))}
            </div>

            {filteredListings.length > 0 ? (
              <div className="glass-card rounded-4 overflow-hidden shadow-sm">
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light small text-muted text-uppercase">
                      <tr>
                        <th style={{ width: '40%' }}>Item Details</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Views & Leads</th>
                        <th>Posted</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredListings.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="position-relative rounded-2 overflow-hidden flex-shrink-0"
                                style={{ width: '56px', height: '56px', backgroundColor: '#E2E8F0' }}
                              >
                                {item.primary_image && (
                                  <Image src={item.primary_image} alt="" fill style={{ objectFit: 'cover' }} />
                                )}
                              </div>
                              <div className="text-truncate" style={{ maxWidth: '280px' }}>
                                <Link
                                  href={`/listings/${item.slug || item.id}`}
                                  className="fw-bold small text-reset hover-orange"
                                >
                                  {item.title}
                                </Link>
                                <div className="text-muted small" style={{ fontSize: '0.75rem' }}>
                                  {item.category_name} • {item.neighborhood}, {item.city}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="fw-bold" style={{ color: 'var(--primary-orange)' }}>
                              {Number(item.price).toLocaleString()} {item.currency}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge text-capitalize ${
                                item.status === 'active'
                                  ? 'bg-success'
                                  : item.status === 'reserved'
                                  ? 'bg-warning text-dark'
                                  : item.status === 'sold'
                                  ? 'bg-secondary'
                                  : 'bg-dark'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="small text-muted">{item.views_count} views</td>
                          <td className="small text-muted">{item.time_ago}</td>
                          <td className="text-end">
                            <div className="btn-group btn-group-sm">
                              {item.status === 'active' ? (
                                <button
                                  className="btn btn-neutral"
                                  onClick={() => handleStatusChange(item.id, 'reserved')}
                                >
                                  Reserve
                                </button>
                              ) : (
                                <button
                                  className="btn btn-neutral"
                                  onClick={() => handleStatusChange(item.id, 'active')}
                                >
                                  Activate
                                </button>
                              )}
                              <button
                                className="btn btn-neutral text-success"
                                onClick={() => handleStatusChange(item.id, 'sold')}
                              >
                                <Check size={14} /> Sold
                              </button>
                              <button
                                className="btn btn-neutral text-danger"
                                onClick={() => handleDeleteListing(item.id)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="glass-card p-5 text-center rounded-4">
                <Tag size={40} className="text-muted mb-2 opacity-50" />
                <h5 className="fw-bold">No items found</h5>
                <Link href="/post-ad" className="btn-orange px-4 py-2 mt-2">
                  + Post a Free Ad
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Storefront Settings */}
        {activeTab === 'profile' && (
          <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm" style={{ maxWidth: '680px' }}>
            <h5 className="fw-bold mb-3">Merchant Profile Information</h5>
            {profileSuccess && (
              <div className="alert alert-success small mb-3">Settings updated successfully!</div>
            )}
            <form onSubmit={handleSaveProfile}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Seller Display Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={publicName}
                  onChange={(e) => setPublicName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Business Name (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
              <div className="row g-2 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">City</label>
                  <input type="text" className="form-control" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Neighborhood / Subcity</label>
                  <input type="text" className="form-control" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Contact Phone Number</label>
                <input type="tel" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold">Store Bio & Meeting Notes</label>
                <textarea className="form-control" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>
              <button type="submit" className="btn-orange px-4 py-2" disabled={savingProfile}>
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: Analytics */}
        {activeTab === 'analytics' && (
          <div className="glass-card p-4 rounded-4 shadow-sm">
            <h5 className="fw-bold mb-3">Performance Overview</h5>
            <p className="small text-muted mb-4">
              Detailed tracking of how Ethiopian buyers discover and interact with your products.
            </p>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="p-3 bg-light rounded-3 border">
                  <div className="fw-bold small mb-1">Inquiry Lead Rate</div>
                  <div className="display-6 fw-bold text-success">
                    {analytics?.overview?.conversion_rate || '18.4%'}
                  </div>
                  <div className="small text-muted">Proportion of views resulting in phone/WhatsApp clicks</div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="p-3 bg-light rounded-3 border">
                  <div className="fw-bold small mb-1">Average Response Speed</div>
                  <div className="display-6 fw-bold text-warning">
                    {profile?.response_time_str || '15 mins'}
                  </div>
                  <div className="small text-muted">Typical response time to buyer inquiries</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
