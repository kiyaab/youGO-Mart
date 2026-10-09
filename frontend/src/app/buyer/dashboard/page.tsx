'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { ListingCard as ListingCardType, Category } from '@/types';
import { ListingCard } from '@/components/listing/ListingCard';
import {
  LayoutDashboard,
  Search,
  Layers,
  Heart,
  ShoppingCart,
  PackageCheck,
  Truck,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  MapPin,
  Clock,
  UserCheck,
} from 'lucide-react';

type BuyerTab =
  | 'overview'
  | 'explore'
  | 'categories'
  | 'wishlist'
  | 'cart'
  | 'orders'
  | 'tracking'
  | 'notifications'
  | 'settings'
  | 'support';

function BuyerDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryTab = searchParams.get('tab') as BuyerTab | null;

  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const { language, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<BuyerTab>(queryTab || 'overview');
  const [favorites, setFavorites] = useState<{ id: number; listing: ListingCardType }[]>([]);
  const [cart, setCart] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Checkout Form State
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingName, setShippingName] = useState(user?.display_name || '');
  const [shippingPhone, setShippingPhone] = useState(user?.phone || '');
  const [shippingCity, setShippingCity] = useState('Addis Ababa');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('telebirr');
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    if (queryTab) setActiveTab(queryTab);
  }, [queryTab]);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/buyer/dashboard');
      return;
    }

    async function loadData() {
      setLoading(true);
      try {
        const [favRes, cartRes, ordersRes, catsRes, notifRes] = await Promise.allSettled([
          api.favorites.getAll(),
          api.cart.get(),
          api.orders.getMyOrders(),
          api.categories.getAll(),
          api.notifications.getAll(),
        ]);

        if (favRes.status === 'fulfilled' && Array.isArray(favRes.value)) {
          setFavorites(favRes.value);
        }
        if (cartRes.status === 'fulfilled') {
          setCart(cartRes.value);
        }
        if (ordersRes.status === 'fulfilled' && Array.isArray(ordersRes.value)) {
          setOrders(ordersRes.value);
        }
        if (catsRes.status === 'fulfilled' && Array.isArray(catsRes.value)) {
          setCategories(catsRes.value);
        }
        if (notifRes.status === 'fulfilled' && Array.isArray(notifRes.value)) {
          setNotifications(notifRes.value);
        }
      } catch (err) {
        console.error('Failed to load buyer data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user, isAuthenticated, authLoading, router]);

  // STRICT ROLE GUARD: Block Sellers from accessing the Buyer Dashboard!
  if (!authLoading && user && user.role === 'seller') {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '70vh' }}>
        <div className="glass-card p-5 max-w-lg mx-auto rounded-4 text-center">
          <div className="d-inline-flex p-3 rounded-circle bg-warning bg-opacity-10 text-warning mb-3">
            <Lock size={40} />
          </div>
          <h3 className="fw-bold mb-2">{t('access_restricted')}</h3>
          <p className="text-muted small mb-4" style={{ lineHeight: 1.6 }}>
            {t('buyer_only_notice')}
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link href="/seller/dashboard" className="btn-orange px-4 py-2">
              Go to Seller Hub <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Cart operations
  const handleUpdateCartQty = async (itemId: number, newQty: number) => {
    try {
      const updated = await api.cart.updateQuantity(itemId, newQty);
      setCart(updated);
    } catch {
      alert('Failed to update cart quantity.');
    }
  };

  const handleRemoveCartItem = async (itemId: number) => {
    try {
      const updated = await api.cart.removeItem(itemId);
      setCart(updated);
    } catch {
      alert('Failed to remove cart item.');
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);
    setIsCheckingOut(true);
    try {
      const order = await api.orders.checkout({
        shipping_name: shippingName || user?.display_name || 'Customer',
        shipping_phone: shippingPhone,
        shipping_city: shippingCity,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
      });

      setOrderSuccess(`Order #${order.order_number} confirmed!`);
      setOrders([order, ...orders]);
      setCart(null);
      setTimeout(() => {
        setActiveTab('orders');
        setOrderSuccess(null);
      }, 2000);
    } catch (err: any) {
      setCheckoutError(err.message || 'Checkout failed. Please check inputs.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const navItems = [
    { key: 'overview', label: language === 'am' ? 'አጠቃላይ እይታ' : 'Overview', icon: LayoutDashboard },
    { key: 'explore', label: language === 'am' ? 'ምርቶችን ፈልግ' : 'Explore Products', icon: Search },
    { key: 'categories', label: language === 'am' ? 'ምድቦች' : 'Product Categories', icon: Layers },
    { key: 'wishlist', label: language === 'am' ? 'የተወደዱ' : 'Wishlist', icon: Heart, count: favorites.length },
    { key: 'cart', label: language === 'am' ? 'የግዢ ቅርጫት' : 'Shopping Cart', icon: ShoppingCart, count: cart?.items?.length || 0 },
    { key: 'orders', label: language === 'am' ? 'ትዕዛዞቼ' : 'My Orders', icon: PackageCheck, count: orders.length },
    { key: 'tracking', label: language === 'am' ? 'ትዕዛዝ መከታተያ' : 'Order Tracking', icon: Truck },
    { key: 'notifications', label: language === 'am' ? 'ማሳወቂያዎች' : 'Notifications', icon: Bell, count: notifications.length },
    { key: 'settings', label: language === 'am' ? 'መገለጫ እና ምርጫዎች' : 'Profile & Settings', icon: Settings },
    { key: 'support', label: language === 'am' ? 'እገዛ እና ድጋፍ' : 'Help & Support', icon: HelpCircle },
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-soft)', minHeight: '90vh' }}>
      <div className="container-fluid px-lg-4 py-4">
        <div className="row g-4">
          {/* SIDEBAR NAVIGATION */}
          <div className="col-lg-3 col-xl-2">
            <div className="glass-card p-3 rounded-4 shadow-sm h-100">
              {/* User Profile Mini Badge */}
              <div className="p-3 mb-3 rounded-3 text-center border" style={{ backgroundColor: 'var(--white)' }}>
                <div className="d-inline-flex p-2.5 rounded-circle mb-2" style={{ backgroundColor: 'var(--primary-orange-light)', color: 'var(--primary-orange)' }}>
                  <UserCheck size={26} />
                </div>
                <div className="fw-bold small text-truncate">{user?.display_name || user?.username}</div>
                <div className="text-muted small text-truncate" style={{ fontSize: '0.72rem' }}>{user?.email}</div>
                <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-0.5 mt-2 fw-semibold" style={{ fontSize: '0.68rem' }}>
                  Registered Buyer
                </span>
              </div>

              {/* Sidebar Menu Items */}
              <nav className="d-flex flex-column gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setActiveTab(item.key as BuyerTab)}
                      className={`btn text-start border-0 py-2 px-3 rounded-3 d-flex align-items-center justify-content-between small fw-semibold transition-all ${
                        isActive
                          ? 'text-white'
                          : 'text-stone-700 hover-orange'
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
                        <span
                          className={`badge rounded-pill ${
                            isActive ? 'bg-white text-dark' : 'bg-warning text-dark'
                          }`}
                          style={{ fontSize: '0.68rem' }}
                        >
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

          {/* MAIN WORKSPACE CONTENT */}
          <div className="col-lg-9 col-xl-10">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="d-flex flex-column gap-4">
                {/* Personalized Welcome Card */}
                <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm position-relative overflow-hidden">
                  <div className="position-relative z-1" style={{ maxWidth: '640px' }}>
                    <span className="badge rounded-pill px-3 py-1 mb-2 fw-semibold" style={{ backgroundColor: 'var(--primary-orange-light)', color: 'var(--primary-orange)' }}>
                      {language === 'am' ? 'የገዢ መነሻ ገጽ' : 'Buyer Workspace'}
                    </span>
                    <h2 className="fw-bold mb-2" style={{ color: 'var(--text-main)' }}>
                      {language === 'am' ? `እንኳን ደህና መጡ፣ ${user?.display_name || user?.username}` : `Welcome back, ${user?.display_name || user?.username}`}
                    </h2>
                    <p className="text-muted small mb-4" style={{ lineHeight: 1.6 }}>
                      {language === 'am'
                        ? 'በኢትዮጵያ ውስጥ ያሉ ምርጥ ምርቶችን ያስሱ፣ ወደ ተወዳጅ ዝርዝርዎ ያክሉ፣ እና ከሻጮች ጋር ያለ ምንም ኮሚሽን በቀጥታ ይገበያዩ።'
                        : 'Explore local merchandise across Addis Ababa, track active orders, curate your wishlist, and transact directly with zero platform commissions.'}
                    </p>
                    <div className="d-flex flex-wrap gap-2">
                      <Link href="/search" className="btn-orange px-4 py-2 small">
                        <Search size={16} /> {language === 'am' ? 'ምርቶችን ፈልግ' : 'Start Shopping'}
                      </Link>
                      <button onClick={() => setActiveTab('orders')} className="btn btn-neutral px-4 py-2 small">
                        <PackageCheck size={16} /> {language === 'am' ? 'ትዕዛዞቼን እይ' : 'View Orders'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Key Metrics Cards */}
                <div className="row g-3">
                  <div className="col-6 col-md-3">
                    <div className="glass-card p-3.5 rounded-4 h-100">
                      <span className="text-muted small fw-semibold">{language === 'am' ? 'ቅርጫት' : 'Cart Items'}</span>
                      <h3 className="fw-extrabold m-0 mt-1" style={{ color: 'var(--primary-orange)' }}>
                        {cart?.items?.length || 0}
                      </h3>
                      <span className="text-muted small" style={{ fontSize: '0.74rem' }}>Ready for checkout</span>
                    </div>
                  </div>

                  <div className="col-6 col-md-3">
                    <div className="glass-card p-3.5 rounded-4 h-100">
                      <span className="text-muted small fw-semibold">{language === 'am' ? 'ትዕዛዞች' : 'Total Orders'}</span>
                      <h3 className="fw-extrabold m-0 mt-1 text-primary">
                        {orders.length}
                      </h3>
                      <span className="text-muted small" style={{ fontSize: '0.74rem' }}>Placed orders</span>
                    </div>
                  </div>

                  <div className="col-6 col-md-3">
                    <div className="glass-card p-3.5 rounded-4 h-100">
                      <span className="text-muted small fw-semibold">{language === 'am' ? 'የተወደዱ' : 'Wishlist'}</span>
                      <h3 className="fw-extrabold m-0 mt-1 text-danger">
                        {favorites.length}
                      </h3>
                      <span className="text-muted small" style={{ fontSize: '0.74rem' }}>Saved for later</span>
                    </div>
                  </div>

                  <div className="col-6 col-md-3">
                    <div className="glass-card p-3.5 rounded-4 h-100">
                      <span className="text-muted small fw-semibold">{language === 'am' ? 'ኮሚሽን' : 'Commission'}</span>
                      <h3 className="fw-extrabold m-0 mt-1 text-success">
                        0%
                      </h3>
                      <span className="text-muted small" style={{ fontSize: '0.74rem' }}>100% Free guarantee</span>
                    </div>
                  </div>
                </div>

                {/* Recent Orders in Overview */}
                <div className="glass-card p-4 rounded-4 shadow-sm">
                  <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                    <h5 className="fw-bold m-0">{language === 'am' ? 'የቅርብ ጊዜ ትዕዛዞች' : 'Recent Orders'}</h5>
                    <button onClick={() => setActiveTab('orders')} className="btn btn-neutral btn-sm px-3">
                      {language === 'am' ? 'ሁሉንም እይ' : 'See All'} →
                    </button>
                  </div>

                  {orders.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light small text-muted">
                          <tr>
                            <th>Order #</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Payment</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.slice(0, 3).map((o) => (
                            <tr key={o.id}>
                              <td className="fw-bold">{o.order_number}</td>
                              <td className="small text-muted">{new Date(o.created_at).toLocaleDateString()}</td>
                              <td className="fw-bold yg-price">{Number(o.total_amount).toLocaleString()} {o.currency}</td>
                              <td><span className="badge bg-success">{o.status}</span></td>
                              <td className="small text-muted text-capitalize">{o.payment_method}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted small">
                      <PackageCheck size={36} className="text-muted opacity-40 mb-2" />
                      <p className="m-0">No orders placed yet. Browse the catalog and place your first order!</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: EXPLORE PRODUCTS */}
            {activeTab === 'explore' && (
              <div className="glass-card p-4 rounded-4 shadow-sm">
                <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                  <div>
                    <h4 className="fw-bold m-0">{language === 'am' ? 'ምርቶችን ያስሱ' : 'Product Catalog'}</h4>
                    <p className="text-muted small m-0">Browse live listings across Ethiopia</p>
                  </div>
                  <Link href="/search" className="btn-orange btn-sm px-3.5 py-2">
                    <Search size={16} /> Full Marketplace
                  </Link>
                </div>
                <div className="text-center py-5">
                  <Search size={40} className="text-muted opacity-50 mb-3" />
                  <h5 className="fw-bold">Ready to discover genuine deals?</h5>
                  <p className="text-muted small mb-4" style={{ maxWidth: '420px', margin: '0 auto' }}>
                    Access phones, electronics, vehicles, fashion, and home decor from local Ethiopian merchants.
                  </p>
                  <Link href="/search" className="btn-orange px-4 py-2">
                    Open Marketplace Search
                  </Link>
                </div>
              </div>
            )}

            {/* TAB 3: CATEGORIES */}
            {activeTab === 'categories' && (
              <div className="glass-card p-4 rounded-4 shadow-sm">
                <h4 className="fw-bold mb-3">{language === 'am' ? 'የገበያ ምድቦች' : 'Product Categories'}</h4>
                <div className="row g-3">
                  {categories.map((c) => (
                    <div key={c.id} className="col-sm-6 col-md-4">
                      <Link
                        href={`/search?category=${c.slug}`}
                        className="p-3 bg-white border rounded-3 d-flex align-items-center justify-content-between text-reset hover-orange transition-all h-100"
                      >
                        <div>
                          <div className="fw-bold small">{c.name}</div>
                          <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                            {c.listing_count ?? 0} items
                          </span>
                        </div>
                        <ArrowRight size={16} className="text-muted" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: WISHLIST / SAVED */}
            {activeTab === 'wishlist' && (
              <div>
                <div className="d-flex align-items-center justify-content-between mb-4 border-bottom pb-3">
                  <div>
                    <h4 className="fw-bold m-0 d-flex align-items-center gap-2">
                      <Heart className="text-danger" size={24} /> {language === 'am' ? 'የተወደዱ እቃዎች' : 'Saved Wishlist'}
                    </h4>
                    <p className="text-muted small m-0 mt-0.5">Track products and contact sellers when ready</p>
                  </div>
                  <Link href="/search" className="btn btn-neutral btn-sm px-3">
                    Add More Items
                  </Link>
                </div>

                {favorites.length > 0 ? (
                  <div className="row g-3">
                    {favorites.map((fav) => (
                      <div key={fav.id} className="col-sm-6 col-xl-4">
                        <ListingCard
                          listing={fav.listing}
                          onFavoriteToggled={(id, isFav) => {
                            if (!isFav) setFavorites(favorites.filter((f) => f.listing.id !== id));
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-card p-5 text-center rounded-4">
                    <Heart size={44} className="text-muted opacity-40 mb-3" />
                    <h5 className="fw-bold">Your wishlist is currently empty</h5>
                    <p className="text-muted small mb-4">
                      Tap the heart icon on any product to save it here for comparison.
                    </p>
                    <Link href="/search" className="btn-orange px-4 py-2">
                      Explore Products
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: SHOPPING CART & CHECKOUT */}
            {activeTab === 'cart' && (
              <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm">
                <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <ShoppingCart size={24} style={{ color: 'var(--primary-orange)' }} /> {language === 'am' ? 'የግዢ ቅርጫት' : 'Shopping Cart'}
                </h4>

                {orderSuccess && (
                  <div className="alert alert-success d-flex align-items-center gap-2 mb-4">
                    <CheckCircle2 size={18} /> {orderSuccess}
                  </div>
                )}

                {checkoutError && (
                  <div className="alert alert-danger mb-4 small">{checkoutError}</div>
                )}

                {cart?.items && cart.items.length > 0 ? (
                  <div className="row g-4">
                    {/* Items List */}
                    <div className="col-lg-7">
                      <div className="d-flex flex-column gap-3">
                        {cart.items.map((item: any) => (
                          <div key={item.id} className="p-3 bg-white border rounded-3 d-flex align-items-center justify-content-between gap-3">
                            <div className="flex-grow-1">
                              <h6 className="fw-bold mb-1 small">{item.listing.title}</h6>
                              <div className="yg-price small">
                                {Number(item.unit_price).toLocaleString()} ETB
                              </div>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                              <button
                                className="btn btn-sm btn-neutral p-1"
                                onClick={() => handleUpdateCartQty(item.id, item.quantity - 1)}
                              >
                                <Minus size={13} />
                              </button>
                              <span className="small fw-bold px-2">{item.quantity}</span>
                              <button
                                className="btn btn-sm btn-neutral p-1"
                                onClick={() => handleUpdateCartQty(item.id, item.quantity + 1)}
                              >
                                <Plus size={13} />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger p-1 ms-2"
                                onClick={() => handleRemoveCartItem(item.id)}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Checkout Form */}
                    <div className="col-lg-5">
                      <div className="p-4 bg-white border rounded-4 shadow-sm">
                        <h6 className="fw-bold mb-3">Order Checkout</h6>
                        <div className="d-flex justify-content-between small text-muted mb-2">
                          <span>Subtotal ({cart.total_items} items):</span>
                          <span className="fw-bold text-dark">{Number(cart.total_amount).toLocaleString()} ETB</span>
                        </div>
                        <div className="d-flex justify-content-between small text-muted mb-3 border-bottom pb-2">
                          <span>Delivery / Platform Fee:</span>
                          <span className="text-success fw-bold">0 ETB (Free)</span>
                        </div>
                        <div className="d-flex justify-content-between fw-bold mb-4">
                          <span>Total:</span>
                          <span className="yg-price fs-5">{Number(cart.total_amount).toLocaleString()} ETB</span>
                        </div>

                        <form onSubmit={handleCheckout}>
                          <div className="mb-2">
                            <label className="form-label small fw-bold text-muted">Recipient Name</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={shippingName}
                              onChange={(e) => setShippingName(e.target.value)}
                              required
                            />
                          </div>

                          <div className="mb-2">
                            <label className="form-label small fw-bold text-muted">Contact Phone</label>
                            <input
                              type="tel"
                              className="form-control form-control-sm"
                              value={shippingPhone}
                              onChange={(e) => setShippingPhone(e.target.value)}
                              placeholder="+251 911 234567"
                              required
                            />
                          </div>

                          <div className="row g-2 mb-2">
                            <div className="col-6">
                              <label className="form-label small fw-bold text-muted">City</label>
                              <select className="form-select form-select-sm" value={shippingCity} onChange={(e) => setShippingCity(e.target.value)}>
                                <option value="Addis Ababa">Addis Ababa</option>
                                <option value="Hawassa">Hawassa</option>
                                <option value="Adama">Adama</option>
                                <option value="Dire Dawa">Dire Dawa</option>
                              </select>
                            </div>
                            <div className="col-6">
                              <label className="form-label small fw-bold text-muted">Delivery Address</label>
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Bole / Kazanchis"
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="form-label small fw-bold text-muted">Payment Preference</label>
                            <select className="form-select form-select-sm" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                              <option value="telebirr">Telebirr (Ethiopia)</option>
                              <option value="cbe_birr">CBE Birr / Commercial Bank</option>
                              <option value="cash_on_delivery">Cash on Delivery / Inspection</option>
                            </select>
                          </div>

                          <button
                            type="submit"
                            className="btn-orange w-100 py-2.5 fw-bold"
                            disabled={isCheckingOut}
                          >
                            {isCheckingOut ? 'Processing Order...' : 'Confirm Order & Place Request'}
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 text-center text-muted">
                    <ShoppingCart size={44} className="opacity-40 mb-3" />
                    <h5 className="fw-bold">Your cart is empty</h5>
                    <p className="small text-muted mb-4">
                      Browse listings and click "Add to Cart" to start checkout.
                    </p>
                    <Link href="/search" className="btn-orange px-4 py-2">
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* TAB 6: MY ORDERS */}
            {activeTab === 'orders' && (
              <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm">
                <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <PackageCheck size={24} className="text-success" /> {language === 'am' ? 'የትዕዛዝ ታሪክ' : 'My Orders'}
                </h4>

                {orders.length > 0 ? (
                  <div className="d-flex flex-column gap-3">
                    {orders.map((o) => (
                      <div key={o.id} className="p-3.5 bg-white border rounded-4 shadow-sm">
                        <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 border-bottom pb-2.5 mb-3">
                          <div>
                            <span className="fw-bold text-dark me-2">{o.order_number}</span>
                            <span className="text-muted small">Placed on {new Date(o.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-success text-capitalize">{o.status}</span>
                            <span className="badge bg-light text-dark border text-capitalize">{o.payment_method}</span>
                          </div>
                        </div>

                        <div className="d-flex flex-column gap-2 mb-3">
                          {o.items?.map((it: any) => (
                            <div key={it.id} className="d-flex align-items-center justify-content-between small">
                              <div>
                                <span className="fw-semibold">{it.quantity}x {it.product_title}</span>
                                <span className="text-muted ms-2" style={{ fontSize: '0.75rem' }}>({it.seller_name || 'Merchant'})</span>
                              </div>
                              <span className="fw-bold yg-price">{Number(it.subtotal).toLocaleString()} ETB</span>
                            </div>
                          ))}
                        </div>

                        <div className="d-flex align-items-center justify-content-between pt-2 border-top small">
                          <div className="text-muted">
                            <Truck size={14} className="me-1 inline" /> Tracking: <code>{o.tracking_number || 'N/A'}</code>
                          </div>
                          <div className="fw-extrabold yg-price fs-6">
                            Total: {Number(o.total_amount).toLocaleString()} {o.currency}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-5 text-center text-muted">
                    <PackageCheck size={44} className="opacity-40 mb-3" />
                    <h5 className="fw-bold">No orders placed yet</h5>
                    <p className="small text-muted mb-4">
                      When you order items, your tracking details and receipts will appear here.
                    </p>
                    <Link href="/search" className="btn-orange px-4 py-2">
                      Browse Marketplace
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* TAB 7: ORDER TRACKING */}
            {activeTab === 'tracking' && (
              <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm" style={{ maxWidth: '680px' }}>
                <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <Truck size={24} style={{ color: 'var(--primary-orange)' }} /> {language === 'am' ? 'የትዕዛዝ መከታተያ' : 'Order Tracking'}
                </h4>
                <p className="text-muted small mb-4">
                  Track the real-time status of your shipments across Ethiopia.
                </p>

                {orders.length > 0 ? (
                  <div className="d-flex flex-column gap-4">
                    {orders.slice(0, 2).map((o) => (
                      <div key={o.id} className="p-3.5 bg-white border rounded-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="fw-bold">{o.order_number}</div>
                          <span className="badge bg-success">{o.status}</span>
                        </div>
                        <div className="small text-muted mb-3">
                          Destination: {o.shipping_address}, {o.shipping_city}
                        </div>

                        {/* Progress Stepper */}
                        <div className="d-flex align-items-center justify-content-between position-relative px-2 py-3">
                          <div className="text-center">
                            <div className="p-2 rounded-circle bg-success text-white mb-1"><CheckCircle2 size={16} /></div>
                            <span className="small fw-semibold" style={{ fontSize: '0.72rem' }}>Confirmed</span>
                          </div>
                          <div className="text-center">
                            <div className="p-2 rounded-circle bg-warning text-dark mb-1"><Clock size={16} /></div>
                            <span className="small fw-semibold" style={{ fontSize: '0.72rem' }}>Processing</span>
                          </div>
                          <div className="text-center">
                            <div className="p-2 rounded-circle bg-light border text-muted mb-1"><Truck size={16} /></div>
                            <span className="small text-muted" style={{ fontSize: '0.72rem' }}>In Transit</span>
                          </div>
                          <div className="text-center">
                            <div className="p-2 rounded-circle bg-light border text-muted mb-1"><PackageCheck size={16} /></div>
                            <span className="small text-muted" style={{ fontSize: '0.72rem' }}>Delivered</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted small">
                    <Truck size={36} className="opacity-40 mb-2" />
                    <p className="m-0">No active shipments to track right now.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 8: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="glass-card p-4 rounded-4 shadow-sm">
                <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <Bell size={22} className="text-warning" /> {language === 'am' ? 'ማሳወቂያዎች' : 'Notifications'}
                </h4>
                {notifications.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {notifications.map((n) => (
                      <div key={n.id} className="list-group-item p-3 border-bottom">
                        <div className="fw-semibold small">{n.title}</div>
                        <div className="text-muted small">{n.message}</div>
                        <span className="text-secondary small" style={{ fontSize: '0.7rem' }}>
                          {new Date(n.created_at).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-5 text-center text-muted small">
                    <Bell size={36} className="opacity-40 mb-2" />
                    <p className="m-0">No notifications. You are completely caught up!</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 9: SETTINGS */}
            {activeTab === 'settings' && (
              <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm" style={{ maxWidth: '640px' }}>
                <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <Settings size={22} /> {language === 'am' ? 'የመለያ ቅንብሮች' : 'Profile & Settings'}
                </h4>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Full Name</label>
                  <input type="text" className="form-control" value={user?.display_name || ''} readOnly />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold text-muted">Email Address</label>
                  <input type="email" className="form-control" value={user?.email || ''} readOnly />
                </div>
                <div className="mb-4">
                  <label className="form-label small fw-bold text-muted">Role</label>
                  <input type="text" className="form-control text-uppercase" value={user?.role || 'buyer'} readOnly />
                </div>
                <div className="p-3 bg-light rounded-3 border small text-muted">
                  Account security managed via token credentials and Google OAuth.
                </div>
              </div>
            )}

            {/* TAB 10: HELP & SUPPORT */}
            {activeTab === 'support' && (
              <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm" style={{ maxWidth: '680px' }}>
                <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                  <HelpCircle size={22} className="text-primary" /> {language === 'am' ? 'እገዛ እና ድጋፍ' : 'Help & Support'}
                </h4>
                <p className="text-muted small mb-4">
                  Need help with an order, a seller negotiation, or an issue? Our team is here to help.
                </p>
                <div className="p-3 bg-white border rounded-3 mb-3">
                  <div className="fw-bold small mb-1">Direct Assistance</div>
                  <div className="small text-muted">Contact our Addis Ababa marketplace support desk.</div>
                  <div className="mt-2 fw-semibold" style={{ color: 'var(--primary-orange)' }}>support@yougomart.et</div>
                </div>
                <div className="p-3 bg-white border rounded-3">
                  <div className="fw-bold small mb-1">Buyer Protection Guidelines</div>
                  <div className="small text-muted">Always inspect goods in person before releasing payment.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BuyerDashboardPage() {
  return (
    <Suspense fallback={<div className="container py-5 text-center"><div className="spinner-border text-warning" /></div>}>
      <BuyerDashboardContent />
    </Suspense>
  );
}
