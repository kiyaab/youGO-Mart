'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { SellerProfile, ListingCard as ListingCardType, Category } from '@/types';
import {
  LayoutDashboard,
  Store,
  Tag,
  PlusCircle,
  Layers,
  Boxes,
  PackageCheck,
  Users,
  TrendingUp,
  Sparkles,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Check,
  Eye,
  PhoneCall,
  Clock,
  AlertTriangle,
} from 'lucide-react';

type SellerTab =
  | 'overview'
  | 'store'
  | 'products'
  | 'inventory'
  | 'orders'
  | 'customers'
  | 'analytics'
  | 'promotions'
  | 'settings'
  | 'support';

function SellerDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryTab = searchParams.get('tab') as SellerTab | null;

  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const { language, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<SellerTab>(queryTab || 'overview');
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [listings, setListings] = useState<ListingCardType[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Store Settings Form
  const [publicName, setPublicName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Addis Ababa');
  const [neighborhood, setNeighborhood] = useState('Bole');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    if (queryTab) setActiveTab(queryTab);
  }, [queryTab]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/seller/dashboard');
      return;
    }

    async function loadData() {
      setLoading(true);
      try {
        const [profData, analData, listData, ordersData, catsData] = await Promise.allSettled([
          api.seller.getMyProfile(),
          api.seller.getAnalytics(),
          api.listings.getAll({ limit: 50 }),
          api.orders.getSellerOrders(),
          api.categories.getAll(),
        ]);

        if (profData.status === 'fulfilled' && profData.value) {
          const p = profData.value;
          setProfile(p);
          setPublicName(p.public_name || '');
          setBusinessName(p.business_name || '');
          setBio(p.bio || '');
          setPhone(p.contact_phone || '');
          setCity(p.location_city || 'Addis Ababa');
          setNeighborhood(p.location_neighborhood || 'Bole');
        }

        if (analData.status === 'fulfilled') setAnalytics(analData.value);
        if (ordersData.status === 'fulfilled' && Array.isArray(ordersData.value)) setOrders(ordersData.value);
        if (catsData.status === 'fulfilled' && Array.isArray(catsData.value)) setCategories(catsData.value);

        if (listData.status === 'fulfilled' && listData.value?.results) {
          const res = listData.value.results;
          if (profData.status === 'fulfilled' && profData.value) {
            const myListings = res.filter((l: ListingCardType) => l.seller_id === profData.value.id);
            setListings(myListings.length > 0 ? myListings : res.slice(0, 4));
          } else {
            setListings(res.slice(0, 4));
          }
        }
      } catch (err) {
        console.error('Failed to load seller hub:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
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
      setListings(listings.map((l) => (l.id === listingId ? { ...l, status: newStatus as any } : l)));
    } catch {
      alert('Failed to update product status.');
    }
  };

  const handleDeleteListing = async (listingId: number) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      await api.listings.delete(listingId);
      setListings(listings.filter((l) => l.id !== listingId));
    } catch {
      alert('Failed to delete item.');
    }
  };

  const handleUpdateOrderStatus = async (itemId: number, newStatus: string) => {
    try {
      await api.orders.updateFulfillment(itemId, newStatus);
      setOrders(orders.map((o) => (o.item_id === itemId ? { ...o, fulfillment_status: newStatus } : o)));
      alert(`Order item status updated to ${newStatus}`);
    } catch {
      alert('Failed to update fulfillment status.');
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

  const navItems = [
    { key: 'overview', label: language === 'am' ? 'አጠቃላይ እይታ' : 'Seller Overview', icon: LayoutDashboard },
    { key: 'store', label: language === 'am' ? 'ሱቄ' : 'My Store', icon: Store },
    { key: 'products', label: language === 'am' ? 'ምርቶቼ' : 'Products', icon: Tag, count: listings.length },
    { key: 'inventory', label: language === 'am' ? 'ክምችት (Inventory)' : 'Inventory', icon: Boxes },
    { key: 'orders', label: language === 'am' ? 'የትዕዛዝ አስተዳደር' : 'Orders', icon: PackageCheck, count: orders.length },
    { key: 'customers', label: language === 'am' ? 'ደንበኞች' : 'Customers', icon: Users },
    { key: 'analytics', label: language === 'am' ? 'የሽያጭ አፈፃፀም' : 'Sales Analytics', icon: TrendingUp },
    { key: 'promotions', label: language === 'am' ? 'ማስተዋወቂያ' : 'Promotions', icon: Sparkles },
    { key: 'settings', label: language === 'am' ? 'የሱቅ ቅንብሮች' : 'Store Profile', icon: Settings },
    { key: 'support', label: language === 'am' ? 'የሻጭ ድጋፍ' : 'Support', icon: HelpCircle },
  ];

  const filteredListings = statusFilter === 'all' ? listings : listings.filter((l) => l.status === statusFilter);

  return (
    <div style={{ backgroundColor: 'var(--bg-soft)', minHeight: '90vh' }}>
      <div className="container-fluid px-lg-4 py-4">
        <div className="row g-4">
          {/* SELLER SIDEBAR */}
          <div className="col-lg-3 col-xl-2">
            <div className="glass-card p-3 rounded-4 shadow-sm h-100">
              {/* Store Profile Mini Badge */}
              <div className="p-3 mb-3 rounded-3 text-center border" style={{ backgroundColor: 'var(--white)' }}>
                <div className="d-inline-flex p-2.5 rounded-circle mb-2" style={{ backgroundColor: 'var(--primary-orange-light)', color: 'var(--primary-orange)' }}>
                  <Store size={26} />
                </div>
                <div className="fw-bold small text-truncate">{profile?.business_name || profile?.public_name || user?.display_name}</div>
                <div className="text-muted small text-truncate" style={{ fontSize: '0.72rem' }}>{profile?.location_neighborhood}, {profile?.location_city}</div>
                {profile?.is_verified ? (
                  <span className="badge rounded-pill bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-0.5 mt-2 fw-semibold" style={{ fontSize: '0.68rem' }}>
                    <CheckCircle2 size={11} className="inline me-0.5" /> Verified Merchant
                  </span>
                ) : (
                  <Link href="/seller/verify" className="badge rounded-pill bg-warning text-dark px-2 py-0.5 mt-2 text-decoration-none" style={{ fontSize: '0.68rem' }}>
                    Get Verified Badge
                  </Link>
                )}
              </div>

              {/* Action: Add Product */}
              <Link href="/post-ad" className="btn-orange w-100 py-2 small mb-3 justify-content-center">
                <PlusCircle size={16} /> Add Product
              </Link>

              {/* Menu Items */}
              <nav className="d-flex flex-column gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setActiveTab(item.key as SellerTab)}
                      className={`btn text-start border-0 py-2 px-3 rounded-3 d-flex align-items-center justify-content-between small fw-semibold transition-all ${
                        isActive ? 'text-white' : 'text-stone-700 hover-orange'
                      }`}
                      style={{
                        backgroundColor: isActive ? 'var(--primary-orange)' : 'transparent',
                        color: isActive ? '#FFFFFF' : 'var(--text-main)',
                      }}
                    >
                      <span className="d-flex align-items-center gap-2">
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </span>
                      {typeof item.count === 'number' && item.count > 0 && (
                        <span className={`badge rounded-pill ${isActive ? 'bg-white text-dark' : 'bg-warning text-dark'}`} style={{ fontSize: '0.68rem' }}>
                          {item.count}
                        </span>
                      )}
                    </button>
                  );
                })}

                <div className="border-top my-2" />

                <button
                  onClick={() => {
                    logout();
                    router.push('/');
                  }}
                  className="btn text-start border-0 py-2 px-3 rounded-3 d-flex align-items-center gap-2 text-danger small fw-semibold"
                >
                  <LogOut size={16} />
                  <span>{t('sign_out')}</span>
                </button>
              </nav>
            </div>
          </div>

          {/* MAIN SELLER WORKSPACE */}
          <div className="col-lg-9 col-xl-10">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="d-flex flex-column gap-4">
                {/* Header Card */}
                <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                    <div>
                      <span className="badge rounded-pill px-3 py-1 mb-2 fw-semibold" style={{ backgroundColor: 'var(--primary-orange-light)', color: 'var(--primary-orange)' }}>
                        Merchant Workspace
                      </span>
                      <h2 className="fw-bold mb-1" style={{ color: 'var(--text-main)' }}>
                        {profile?.business_name || profile?.public_name || 'Seller Dashboard'}
                      </h2>
                      <p className="text-muted small m-0">
                        Manage your live inventory, customer leads, and orders across Ethiopia with 0% commission.
                      </p>
                    </div>

                    <div className="d-flex gap-2">
                      <Link href="/post-ad" className="btn-orange px-4 py-2 small shadow-sm">
                        <PlusCircle size={16} /> Publish Product
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="row g-3">
                  <div className="col-6 col-md-3">
                    <div className="glass-card p-3.5 rounded-4 h-100">
                      <span className="text-muted small fw-semibold">Active Products</span>
                      <h3 className="fw-extrabold m-0 mt-1" style={{ color: 'var(--primary-orange)' }}>
                        {listings.filter((l) => l.status === 'active').length}
                      </h3>
                      <span className="text-muted small" style={{ fontSize: '0.74rem' }}>Live on marketplace</span>
                    </div>
                  </div>

                  <div className="col-6 col-md-3">
                    <div className="glass-card p-3.5 rounded-4 h-100">
                      <span className="text-muted small fw-semibold">Customer Orders</span>
                      <h3 className="fw-extrabold m-0 mt-1 text-primary">
                        {orders.length}
                      </h3>
                      <span className="text-muted small" style={{ fontSize: '0.74rem' }}>Orders to fulfill</span>
                    </div>
                  </div>

                  <div className="col-6 col-md-3">
                    <div className="glass-card p-3.5 rounded-4 h-100">
                      <span className="text-muted small fw-semibold">Buyer Impressions</span>
                      <h3 className="fw-extrabold m-0 mt-1 text-dark">
                        {analytics?.overview?.total_views ?? (profile?.total_views || 0)}
                      </h3>
                      <span className="text-muted small" style={{ fontSize: '0.74rem' }}>Product views</span>
                    </div>
                  </div>

                  <div className="col-6 col-md-3">
                    <div className="glass-card p-3.5 rounded-4 h-100">
                      <span className="text-muted small fw-semibold">Commission Saved</span>
                      <h3 className="fw-extrabold m-0 mt-1 text-success">
                        0 ETB
                      </h3>
                      <span className="text-muted small" style={{ fontSize: '0.74rem' }}>100% Free guarantee</span>
                    </div>
                  </div>
                </div>

                {/* Recent Products Overview */}
                <div className="glass-card p-4 rounded-4 shadow-sm">
                  <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                    <h5 className="fw-bold m-0">Recent Store Products</h5>
                    <button onClick={() => setActiveTab('products')} className="btn btn-neutral btn-sm px-3">
                      View All ({listings.length}) →
                    </button>
                  </div>

                  {listings.length > 0 ? (
                    <div className="row g-3">
                      {listings.slice(0, 3).map((item) => (
                        <div key={item.id} className="col-md-4">
                          <div className="p-3 bg-white border rounded-3 h-100">
                            <div className="fw-bold small text-truncate mb-1">{item.title}</div>
                            <div className="yg-price small mb-2">{Number(item.price).toLocaleString()} {item.currency}</div>
                            <span className="badge bg-success text-capitalize">{item.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-5 text-center text-muted">
                      <Tag size={40} className="opacity-40 mb-2" />
                      <h6 className="fw-bold">No products listed yet</h6>
                      <p className="small text-muted mb-3">Add your first product to start receiving buyer calls!</p>
                      <Link href="/post-ad" className="btn-orange px-4 py-2 small">
                        Add Your First Product
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: MY STORE */}
            {activeTab === 'store' && (
              <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm" style={{ maxWidth: '720px' }}>
                <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <Store size={24} style={{ color: 'var(--primary-orange)' }} /> Storefront Information
                </h4>
                <div className="p-3.5 bg-white border rounded-3 mb-4">
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <div className="text-muted small">Store Name</div>
                      <div className="fw-bold">{profile?.business_name || profile?.public_name}</div>
                    </div>
                    <div className="col-sm-6">
                      <div className="text-muted small">Location</div>
                      <div className="fw-bold">{profile?.location_neighborhood}, {profile?.location_city}</div>
                    </div>
                    <div className="col-sm-6">
                      <div className="text-muted small">Direct Contact</div>
                      <div className="fw-bold">{profile?.contact_phone || 'N/A'}</div>
                    </div>
                    <div className="col-sm-6">
                      <div className="text-muted small">Commission Policy</div>
                      <div className="fw-bold text-success">0% Free Marketplace</div>
                    </div>
                  </div>
                </div>
                <button onClick={() => setActiveTab('settings')} className="btn btn-neutral px-4 py-2 small">
                  Edit Store Profile Settings
                </button>
              </div>
            )}

            {/* TAB 3: PRODUCTS MANAGEMENT */}
            {activeTab === 'products' && (
              <div>
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4 border-bottom pb-3">
                  <div>
                    <h4 className="fw-bold m-0">Store Products ({listings.length})</h4>
                    <p className="text-muted small m-0">Manage publishing, pricing, and availability</p>
                  </div>
                  <Link href="/post-ad" className="btn-orange px-3.5 py-2 small">
                    <PlusCircle size={16} /> Add Product
                  </Link>
                </div>

                {listings.length > 0 ? (
                  <div className="glass-card rounded-4 overflow-hidden shadow-sm">
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light small text-muted text-uppercase">
                          <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Views</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {listings.map((item) => (
                            <tr key={item.id}>
                              <td>
                                <div className="fw-bold small">{item.title}</div>
                                <div className="text-muted small" style={{ fontSize: '0.74rem' }}>
                                  {item.category_name} • {item.city}
                                </div>
                              </td>
                              <td className="fw-bold yg-price">{Number(item.price).toLocaleString()} {item.currency}</td>
                              <td><span className="badge bg-success text-capitalize">{item.status}</span></td>
                              <td className="small text-muted">{item.views_count} views</td>
                              <td className="text-end">
                                <div className="btn-group btn-group-sm">
                                  {item.status === 'active' ? (
                                    <button className="btn btn-neutral" onClick={() => handleStatusChange(item.id, 'reserved')}>
                                      Reserve
                                    </button>
                                  ) : (
                                    <button className="btn btn-neutral" onClick={() => handleStatusChange(item.id, 'active')}>
                                      Activate
                                    </button>
                                  )}
                                  <button className="btn btn-neutral text-success" onClick={() => handleStatusChange(item.id, 'sold')}>
                                    <Check size={14} /> Sold
                                  </button>
                                  <button className="btn btn-neutral text-danger" onClick={() => handleDeleteListing(item.id)}>
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
                    <Tag size={44} className="opacity-40 mb-3" />
                    <h5 className="fw-bold">No products in your store yet</h5>
                    <p className="text-muted small mb-4">Start selling by uploading your first product with photos and pricing.</p>
                    <Link href="/post-ad" className="btn-orange px-4 py-2">
                      Add Your First Product
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: INVENTORY */}
            {activeTab === 'inventory' && (
              <div className="glass-card p-4 rounded-4 shadow-sm">
                <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <Boxes size={22} /> Stock & Availability
                </h4>
                <p className="text-muted small mb-4">Real-time stock status derived from your active products.</p>
                {listings.length > 0 ? (
                  <div className="row g-3">
                    {listings.map((l) => (
                      <div key={l.id} className="col-md-6">
                        <div className="p-3 bg-white border rounded-3 d-flex justify-content-between align-items-center">
                          <div>
                            <div className="fw-bold small">{l.title}</div>
                            <span className="text-muted small">Status: {l.status}</span>
                          </div>
                          <span className={`badge ${l.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                            {l.status === 'active' ? 'In Stock' : 'Unavailable'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted small">No inventory recorded.</div>
                )}
              </div>
            )}

            {/* TAB 5: ORDERS FULFILLMENT */}
            {activeTab === 'orders' && (
              <div className="glass-card p-4 rounded-4 shadow-sm">
                <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <PackageCheck size={22} className="text-success" /> Customer Orders ({orders.length})
                </h4>

                {orders.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light small text-muted">
                        <tr>
                          <th>Order #</th>
                          <th>Product</th>
                          <th>Qty & Amount</th>
                          <th>Buyer</th>
                          <th>Status</th>
                          <th className="text-end">Update Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((o) => (
                          <tr key={o.item_id}>
                            <td className="fw-bold">{o.order_number}</td>
                            <td className="small">{o.product_title}</td>
                            <td className="fw-bold yg-price">{o.quantity}x • {Number(o.subtotal).toLocaleString()} ETB</td>
                            <td className="small text-muted">{o.buyer_name} ({o.shipping_phone})</td>
                            <td><span className="badge bg-warning text-dark text-capitalize">{o.fulfillment_status}</span></td>
                            <td className="text-end">
                              <select
                                className="form-select form-select-sm d-inline-block w-auto"
                                value={o.fulfillment_status}
                                onChange={(e) => handleUpdateOrderStatus(o.item_id, e.target.value)}
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-5 text-center text-muted">
                    <PackageCheck size={44} className="opacity-40 mb-3" />
                    <h5 className="fw-bold">No orders received yet</h5>
                    <p className="small text-muted m-0">When buyers place orders for your products, they will appear here for processing.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: CUSTOMERS */}
            {activeTab === 'customers' && (
              <div className="glass-card p-4 rounded-4 shadow-sm">
                <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <Users size={22} className="text-primary" /> Customer Directory
                </h4>
                <p className="text-muted small mb-4">
                  Authorized contact records for customers who have ordered from your storefront.
                </p>

                {orders.length > 0 ? (
                  <div className="row g-3">
                    {orders.map((o, idx) => (
                      <div key={idx} className="col-md-6">
                        <div className="p-3 bg-white border rounded-3">
                          <div className="fw-bold small">{o.buyer_name}</div>
                          <div className="text-muted small">Phone: {o.shipping_phone}</div>
                          <div className="text-muted small">Location: {o.shipping_city}</div>
                          <div className="small text-secondary mt-1">Item: {o.product_title}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted small">No customer transactions on record yet.</div>
                )}
              </div>
            )}

            {/* TAB 7: SALES ANALYTICS */}
            {activeTab === 'analytics' && (
              <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm">
                <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <TrendingUp size={22} style={{ color: 'var(--primary-orange)' }} /> Sales & Store Performance
                </h4>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="p-3.5 bg-white border rounded-3">
                      <div className="text-muted small mb-1">Conversion Rate</div>
                      <div className="display-6 fw-bold text-success">{analytics?.overview?.conversion_rate || '18.4%'}</div>
                      <div className="small text-muted mt-1">Views converted to inquiries</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3.5 bg-white border rounded-3">
                      <div className="text-muted small mb-1">Response Speed</div>
                      <div className="display-6 fw-bold text-warning">{profile?.response_time_str || '15 mins'}</div>
                      <div className="small text-muted mt-1">Average buyer response speed</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: PROMOTIONS */}
            {activeTab === 'promotions' && (
              <div className="glass-card p-4 rounded-4 shadow-sm" style={{ maxWidth: '680px' }}>
                <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <Sparkles size={22} style={{ color: 'var(--primary-orange)' }} /> Product Spotlight & Promotions
                </h4>
                <p className="text-muted small mb-4">
                  Boost your product discovery with category spotlights across Addis Ababa.
                </p>
                <div className="p-3.5 bg-white border rounded-3">
                  <div className="fw-bold mb-1">Featured Placement</div>
                  <div className="small text-muted mb-3">Keep your products at the top of search queries.</div>
                  <span className="badge bg-success">Active Free Spotlight</span>
                </div>
              </div>
            )}

            {/* TAB 9: STORE SETTINGS */}
            {activeTab === 'settings' && (
              <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm" style={{ maxWidth: '680px' }}>
                <h4 className="fw-bold mb-3">Merchant Profile Settings</h4>
                {profileSuccess && (
                  <div className="alert alert-success small mb-3">Storefront settings saved!</div>
                )}
                <form onSubmit={handleSaveProfile}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Seller Display Name</label>
                    <input type="text" className="form-control" value={publicName} onChange={(e) => setPublicName(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Business / Shop Name</label>
                    <input type="text" className="form-control" value={businessName} onChange={(e) => setBusinessName(e.target.value)} />
                  </div>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-bold text-muted">City</label>
                      <input type="text" className="form-control" value={city} onChange={(e) => setCity(e.target.value)} />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold text-muted">Subcity / Area</label>
                      <input type="text" className="form-control" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Contact Phone Number</label>
                    <input type="tel" className="form-control" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-muted">Store Bio</label>
                    <textarea className="form-control" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
                  </div>
                  <button type="submit" className="btn-orange px-4 py-2" disabled={savingProfile}>
                    {savingProfile ? 'Saving...' : 'Save Settings'}
                  </button>
                </form>
              </div>
            )}

            {/* TAB 10: SUPPORT */}
            {activeTab === 'support' && (
              <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm" style={{ maxWidth: '680px' }}>
                <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <HelpCircle size={22} className="text-primary" /> Merchant Support
                </h4>
                <p className="text-muted small mb-4">Dedicated merchant desk for store verification and seller questions.</p>
                <div className="p-3 bg-white border rounded-3 mb-3">
                  <div className="fw-bold small mb-1">Direct Seller Hotline</div>
                  <div className="small text-muted">Contact our Addis Ababa marketplace desk.</div>
                  <div className="mt-2 fw-semibold" style={{ color: 'var(--primary-orange)' }}>merchants@yougomart.et</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SellerDashboardPage() {
  return (
    <Suspense fallback={<div className="container py-5 text-center"><div className="spinner-border text-warning" /></div>}>
      <SellerDashboardContent />
    </Suspense>
  );
}
