'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { ListingCard as ListingCardType } from '@/types';
import { ListingCard } from '@/components/listing/ListingCard';
import {
  LayoutDashboard,
  Search,
  Grid,
  Heart,
  ShoppingCart,
  Package,
  Clock,
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
  Phone,
  AlertTriangle,
  User,
} from 'lucide-react';

function BuyerDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') as any;

  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'explore' | 'wishlist' | 'cart' | 'orders' | 'tracking' | 'notifications' | 'settings' | 'support'
  >(initialTab || 'overview');

  // State
  const [favorites, setFavorites] = useState<{ id: number; listing: ListingCardType }[]>([]);
  const [cart, setCart] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Checkout modal/form state
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [shippingName, setShippingName] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingCity, setShippingCity] = useState('Addis Ababa');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('telebirr');
  const [orderNotes, setOrderNotes] = useState('');
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<any>(null);

  // Settings state
  const [preferredCity, setPreferredCity] = useState('Addis Ababa');
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [favRes, cartRes, orderRes, notifRes] = await Promise.allSettled([
        api.favorites.getAll(),
        api.cart.get(),
        api.orders.getAll(),
        api.notifications.getAll(),
      ]);

      if (favRes.status === 'fulfilled' && Array.isArray(favRes.value)) {
        setFavorites(favRes.value);
      }
      if (cartRes.status === 'fulfilled' && cartRes.value) {
        setCart(cartRes.value);
      }
      if (orderRes.status === 'fulfilled' && Array.isArray(orderRes.value)) {
        setOrders(orderRes.value);
      }
      if (notifRes.status === 'fulfilled' && Array.isArray(notifRes.value)) {
        setNotifications(notifRes.value);
      }

      if (user) {
        setShippingName(user.display_name || user.username || '');
        setShippingPhone(user.phone || '');
      }
    } catch (err) {
      console.error('Failed to load buyer data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/buyer/dashboard');
      return;
    }
    loadData();
  }, [user, isAuthenticated, authLoading]);

  // STRICT RBAC: Block sellers from accessing the Buyer Dashboard
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
              {language === 'am' ? 'ወደ ሻጭ ገጽ ሂድ' : 'Go to Seller Workspace'} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Cart operations
  const handleUpdateQuantity = async (itemId: number, newQty: number) => {
    try {
      const updatedCart = await api.cart.updateQuantity(itemId, newQty);
      setCart(updatedCart);
    } catch {
      alert('Failed to update quantity');
    }
  };

  const handleRemoveCartItem = async (itemId: number) => {
    try {
      const updatedCart = await api.cart.removeItem(itemId);
      setCart(updatedCart);
    } catch {
      alert('Failed to remove item');
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingOrder(true);
    try {
      const order = await api.orders.checkout({
        shipping_name: shippingName,
        shipping_phone: shippingPhone,
        shipping_city: shippingCity,
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        notes: orderNotes,
      });
      setCheckoutSuccess(order);
      setIsCheckingOut(false);
      setCart({ items: [], total_items: 0, total_price: 0 });
      setOrders([order, ...orders]);
      setActiveTab('orders');
    } catch (err: any) {
      alert(err.message || 'Checkout failed.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  const navItems = [
    { id: 'overview', label: language === 'am' ? 'አጠቃላይ እይታ' : 'Overview', icon: LayoutDashboard },
    { id: 'cart', label: `${t('shopping_cart')} (${cart?.total_items || 0})`, icon: ShoppingCart },
    { id: 'wishlist', label: `${t('wishlist')} (${favorites.length})`, icon: Heart },
    { id: 'orders', label: `${t('orders')} (${orders.length})`, icon: Package },
    { id: 'tracking', label: t('order_tracking'), icon: Clock },
    { id: 'notifications', label: t('notifications'), icon: Bell },
    { id: 'settings', label: t('settings'), icon: Settings },
    { id: 'support', label: t('help_support'), icon: HelpCircle },
  ];

  return (
    <div className="py-4" style={{ backgroundColor: 'var(--bg-main)', minHeight: '85vh' }}>
      <div className="container">
        <div className="row g-4">
          {/* SIDEBAR NAVIGATION */}
          <div className="col-lg-3">
            <div className="glass-card p-3 rounded-4 shadow-sm sticky-top" style={{ top: '80px' }}>
              <div className="d-flex align-items-center gap-2.5 p-2 mb-3 border-bottom pb-3">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                  style={{ width: '42px', height: '42px', backgroundColor: '#2563EB' }}
                >
                  <User size={20} />
                </div>
                <div className="overflow-hidden">
                  <div className="fw-bold small text-truncate" style={{ color: 'var(--text-main)' }}>
                    {user?.display_name || user?.username}
                  </div>
                  <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary small" style={{ fontSize: '0.7rem' }}>
                    Verified Buyer
                  </span>
                </div>
              </div>

              <div className="d-flex flex-column gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`btn text-start d-flex align-items-center gap-2.5 px-3 py-2 rounded-3 small fw-semibold transition-all border-0 ${
                        isActive
                          ? 'bg-warning text-dark fw-bold'
                          : 'text-muted bg-transparent hover-orange'
                      }`}
                    >
                      <Icon size={17} />
                      <span className="flex-grow-1">{item.label}</span>
                    </button>
                  );
                })}

                <div className="border-top my-2" />

                <button
                  onClick={() => {
                    logout();
                    router.push('/');
                  }}
                  className="btn text-start d-flex align-items-center gap-2.5 px-3 py-2 rounded-3 small fw-semibold text-danger border-0 bg-transparent"
                >
                  <LogOut size={17} />
                  <span>{t('sign_out')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="col-lg-9">
            {/* 1. OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="d-flex flex-column gap-4">
                {/* Greeting Card */}
                <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm border-primary">
                  <span className="badge bg-primary text-white text-uppercase px-2.5 py-1 rounded-pill small fw-bold mb-2">
                    {language === 'am' ? 'የገዢ መነሻ ገጽ' : 'Buyer Dashboard'}
                  </span>
                  <h2 className="fw-bold h3 mb-2" style={{ color: 'var(--text-main)' }}>
                    {language === 'am' ? `እንኳን ደህና መጡ፣ ${user?.display_name || user?.username}!` : `Welcome back, ${user?.display_name || user?.username}!`}
                  </h2>
                  <p className="text-muted small mb-4" style={{ lineHeight: 1.6 }}>
                    {language === 'am'
                      ? 'የተመረጡ እቃዎችዎን ይመልከቱ፣ በግዢ ጋሪዎ ያሉትን ያረጋግጡ፣ እና ትዕዛዞችዎን በቀላሉ ይከታተሉ።'
                      : 'Explore verified Ethiopian listings, review your saved wishlist, manage your active cart, and monitor order delivery status.'}
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    <Link href="/search" className="btn-orange px-4 py-2 small">
                      <Search size={16} /> {t('explore_products')}
                    </Link>
                    <button onClick={() => setActiveTab('cart')} className="btn btn-neutral px-4 py-2 small fw-bold">
                      <ShoppingCart size={16} /> {t('shopping_cart')} ({cart?.total_items || 0})
                    </button>
                  </div>
                </div>

                {/* Live Real Metrics */}
                <div className="row g-3">
                  <div className="col-sm-4">
                    <div className="glass-card p-3 rounded-4 h-100">
                      <div className="d-flex justify-content-between align-items-center mb-1 text-muted small fw-semibold">
                        <span>{t('shopping_cart')}</span>
                        <ShoppingCart size={16} className="text-warning" />
                      </div>
                      <h3 className="fw-bold m-0" style={{ color: 'var(--text-main)' }}>{cart?.total_items || 0}</h3>
                      <span className="small text-muted">{cart?.total_price ? `${Number(cart.total_price).toLocaleString()} ETB` : '0 ETB'}</span>
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div className="glass-card p-3 rounded-4 h-100">
                      <div className="d-flex justify-content-between align-items-center mb-1 text-muted small fw-semibold">
                        <span>{t('wishlist')}</span>
                        <Heart size={16} className="text-danger" />
                      </div>
                      <h3 className="fw-bold m-0" style={{ color: 'var(--text-main)' }}>{favorites.length}</h3>
                      <span className="small text-muted">{language === 'am' ? 'የተቀመጡ እቃዎች' : 'Saved for review'}</span>
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div className="glass-card p-3 rounded-4 h-100">
                      <div className="d-flex justify-content-between align-items-center mb-1 text-muted small fw-semibold">
                        <span>{t('orders')}</span>
                        <Package size={16} className="text-success" />
                      </div>
                      <h3 className="fw-bold m-0" style={{ color: 'var(--text-main)' }}>{orders.length}</h3>
                      <span className="small text-muted">{language === 'am' ? 'የተሰጡ ትዕዛዞች' : 'Placed orders'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. SHOPPING CART TAB */}
            {activeTab === 'cart' && (
              <div className="glass-card p-4 rounded-4 shadow-sm">
                <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                  <div>
                    <h4 className="fw-bold m-0" style={{ color: 'var(--text-main)' }}>
                      {t('shopping_cart')}
                    </h4>
                    <p className="text-muted small m-0">
                      {language === 'am' ? 'የተመረጡ እቃዎች ዝርዝር እና ዋጋ' : 'Server-validated item quantities and pricing'}
                    </p>
                  </div>
                  {cart?.items?.length > 0 && (
                    <button
                      onClick={async () => {
                        await api.cart.clear();
                        setCart({ items: [], total_items: 0, total_price: 0 });
                      }}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Clear Cart
                    </button>
                  )}
                </div>

                {cart?.items && cart.items.length > 0 ? (
                  <div className="d-flex flex-column gap-3">
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light small text-uppercase">
                          <tr>
                            <th>Item</th>
                            <th>Unit Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                            <th className="text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cart.items.map((item: any) => (
                            <tr key={item.id}>
                              <td>
                                <div className="d-flex align-items-center gap-3">
                                  <div
                                    className="position-relative rounded-2 overflow-hidden flex-shrink-0"
                                    style={{ width: '48px', height: '48px', backgroundColor: '#E2E8F0' }}
                                  >
                                    {item.listing_image && (
                                      <Image src={item.listing_image} alt="" fill style={{ objectFit: 'cover' }} />
                                    )}
                                  </div>
                                  <div>
                                    <div className="fw-bold small text-truncate" style={{ maxWidth: '240px' }}>
                                      {item.listing_title}
                                    </div>
                                    <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
                                      ID #{item.listing_id}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="small fw-semibold">
                                {Number(item.listing_price).toLocaleString()} {item.listing_currency}
                              </td>
                              <td>
                                <div className="d-inline-flex align-items-center border rounded-pill px-2 py-0.5 gap-2">
                                  <button
                                    className="btn btn-sm p-0 text-muted border-0 bg-transparent"
                                    onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                  >
                                    <Minus size={13} />
                                  </button>
                                  <span className="small fw-bold">{item.quantity}</span>
                                  <button
                                    className="btn btn-sm p-0 text-muted border-0 bg-transparent"
                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Plus size={13} />
                                  </button>
                                </div>
                              </td>
                              <td className="fw-bold text-warning small">
                                {Number(item.subtotal).toLocaleString()} ETB
                              </td>
                              <td className="text-end">
                                <button
                                  className="btn btn-sm btn-neutral text-danger"
                                  onClick={() => handleRemoveCartItem(item.id)}
                                  title="Remove"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Cart Summary & Checkout Trigger */}
                    <div className="p-4 bg-light rounded-4 border d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-3">
                      <div>
                        <span className="text-muted small">Total ({cart.total_items} items):</span>
                        <div className="h3 fw-bold m-0" style={{ color: 'var(--primary-orange)' }}>
                          {Number(cart.total_price).toLocaleString()} ETB
                        </div>
                      </div>
                      <button
                        onClick={() => setIsCheckingOut(!isCheckingOut)}
                        className="btn-orange px-4 py-2.5 fw-bold"
                      >
                        {isCheckingOut ? 'Cancel' : t('checkout')} <ArrowRight size={17} />
                      </button>
                    </div>

                    {/* CHECKOUT FORM */}
                    {isCheckingOut && (
                      <div className="glass-card p-4 rounded-4 mt-3 border-warning">
                        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                          <CreditCard size={20} className="text-warning" /> Delivery & Payment Method
                        </h5>
                        <form onSubmit={handleCheckoutSubmit}>
                          <div className="row g-3 mb-3">
                            <div className="col-md-6">
                              <label className="form-label small fw-bold">Recipient Full Name</label>
                              <input
                                type="text"
                                className="form-control"
                                value={shippingName}
                                onChange={(e) => setShippingName(e.target.value)}
                                required
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label small fw-bold">Contact Phone Number</label>
                              <input
                                type="tel"
                                className="form-control"
                                value={shippingPhone}
                                onChange={(e) => setShippingPhone(e.target.value)}
                                placeholder="+251 911 000000"
                                required
                              />
                            </div>
                          </div>

                          <div className="row g-3 mb-3">
                            <div className="col-md-6">
                              <label className="form-label small fw-bold">City</label>
                              <select
                                className="form-select"
                                value={shippingCity}
                                onChange={(e) => setShippingCity(e.target.value)}
                              >
                                <option value="Addis Ababa">Addis Ababa</option>
                                <option value="Hawassa">Hawassa</option>
                                <option value="Adama">Adama</option>
                                <option value="Bahir Dar">Bahir Dar</option>
                                <option value="Dire Dawa">Dire Dawa</option>
                              </select>
                            </div>
                            <div className="col-md-6">
                              <label className="form-label small fw-bold">Specific Subcity / Address</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="e.g. Bole Medhanialem, House 450"
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                required
                              />
                            </div>
                          </div>

                          <div className="mb-3">
                            <label className="form-label small fw-bold">Payment Method</label>
                            <select
                              className="form-select"
                              value={paymentMethod}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                              <option value="telebirr">Telebirr (Ethiopian Mobile Money)</option>
                              <option value="cbe_birr">CBE Birr / Commercial Bank of Ethiopia</option>
                              <option value="bank_transfer">Direct Bank Transfer</option>
                              <option value="cash_on_delivery">Cash on Delivery / In-Person Inspection</option>
                            </select>
                          </div>

                          <div className="mb-4">
                            <label className="form-label small fw-bold">Order Notes / Meeting Time</label>
                            <textarea
                              className="form-control"
                              rows={2}
                              placeholder="Any instructions for the seller..."
                              value={orderNotes}
                              onChange={(e) => setOrderNotes(e.target.value)}
                            />
                          </div>

                          <button
                            type="submit"
                            className="btn-orange px-5 py-2.5 fw-bold"
                            disabled={submittingOrder}
                          >
                            {submittingOrder ? 'Submitting Order...' : 'Confirm Order Now'}
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <ShoppingCart size={40} className="text-muted opacity-40 mb-3" />
                    <h5 className="fw-bold">{t('cart_empty')}</h5>
                    <p className="text-muted small mb-4">
                      {language === 'am' ? 'እቃዎችን ለመጨመር ገበያውን ያስሱ።' : 'Explore marketplace products and add items to your cart.'}
                    </p>
                    <Link href="/search" className="btn-orange px-4 py-2">
                      {t('start_shopping')}
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* 3. WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <div>
                <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                  <div>
                    <h4 className="fw-bold m-0" style={{ color: 'var(--text-main)' }}>
                      {t('wishlist')}
                    </h4>
                    <p className="text-muted small m-0">
                      {language === 'am' ? 'የተቀመጡ እቃዎች ዝርዝር' : 'Your saved items for quick reference'}
                    </p>
                  </div>
                  <Link href="/search" className="btn btn-neutral btn-sm px-3">
                    {t('explore_products')}
                  </Link>
                </div>

                {favorites.length > 0 ? (
                  <div className="row g-3">
                    {favorites.map((fav) => (
                      <div key={fav.id} className="col-12 col-sm-6 col-lg-4">
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
                    <Heart size={40} className="text-muted opacity-40 mb-3" />
                    <h5 className="fw-bold">{t('no_wishlist_yet')}</h5>
                    <Link href="/search" className="btn-orange px-4 py-2 mt-3">
                      {t('start_shopping')}
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* 4. ORDERS TAB */}
            {activeTab === 'orders' && (
              <div className="glass-card p-4 rounded-4 shadow-sm">
                <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
                  <div>
                    <h4 className="fw-bold m-0" style={{ color: 'var(--text-main)' }}>
                      {t('orders')}
                    </h4>
                    <p className="text-muted small m-0">
                      {language === 'am' ? 'የተሰጡ እውነተኛ ትዕዛዞች ታሪክ' : 'Real database orders and fulfillment tracking'}
                    </p>
                  </div>
                </div>

                {orders.length > 0 ? (
                  <div className="d-flex flex-column gap-3">
                    {orders.map((ord: any) => (
                      <div key={ord.id} className="p-3.5 bg-light rounded-4 border">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2 pb-2 border-bottom">
                          <div>
                            <span className="fw-bold small me-2">Order #{ord.order_number}</span>
                            <span className="text-muted small">
                              {new Date(ord.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div>
                            <span
                              className={`badge text-capitalize ${
                                ord.status === 'delivered'
                                  ? 'bg-success'
                                  : ord.status === 'confirmed'
                                  ? 'bg-primary'
                                  : 'bg-warning text-dark'
                              }`}
                            >
                              {ord.status}
                            </span>
                          </div>
                        </div>

                        <div className="row g-2 align-items-center">
                          <div className="col-md-7">
                            <div className="small text-muted mb-1">
                              <strong>Delivery:</strong> {ord.shipping_name} • {ord.shipping_city}, {ord.shipping_address}
                            </div>
                            <div className="small text-muted">
                              <strong>Payment:</strong> {ord.payment_method} ({ord.payment_status})
                            </div>
                          </div>
                          <div className="col-md-5 text-md-end">
                            <span className="text-muted small">Total: </span>
                            <span className="fw-bold h5 text-warning m-0">
                              {Number(ord.total_amount).toLocaleString()} {ord.currency}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        {ord.items && ord.items.length > 0 && (
                          <div className="mt-3 pt-2 border-top">
                            <div className="small fw-bold text-muted mb-1">Items in this order:</div>
                            <ul className="list-unstyled mb-0 small text-muted">
                              {ord.items.map((it: any) => (
                                <li key={it.id} className="d-flex justify-content-between py-1">
                                  <span>{it.quantity}x {it.product_title}</span>
                                  <span className="fw-semibold">{Number(it.subtotal).toLocaleString()} ETB</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <Package size={40} className="text-muted opacity-40 mb-3" />
                    <h5 className="fw-bold">{t('no_orders_yet')}</h5>
                    <p className="text-muted small mb-4">
                      {language === 'am' ? 'ምርቶችን ያስሱ እና ዛሬ መሸመት ይጀምሩ።' : 'Browse products and start shopping today.'}
                    </p>
                    <Link href="/search" className="btn-orange px-4 py-2">
                      {t('start_shopping')}
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* 5. ORDER TRACKING TAB */}
            {activeTab === 'tracking' && (
              <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm">
                <h4 className="fw-bold mb-2">{t('order_tracking')}</h4>
                <p className="text-muted small mb-4">
                  Track live fulfillment stages for your orders across Addis Ababa.
                </p>

                {orders.length > 0 ? (
                  <div>
                    <div className="p-4 rounded-4 bg-light border mb-4">
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <span className="fw-bold">Latest Order: #{orders[0].order_number}</span>
                        <span className="badge bg-warning text-dark text-capitalize">{orders[0].status}</span>
                      </div>

                      {/* Visual Steps */}
                      <div className="row g-2 text-center pt-2">
                        {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((st, i) => {
                          const isDone = ['confirmed', 'processing', 'shipped', 'delivered'].includes(orders[0].status) && i <= 1;
                          return (
                            <div key={st} className="col">
                              <div
                                className={`p-2 rounded-3 small fw-bold text-capitalize ${
                                  orders[0].status === st
                                    ? 'bg-warning text-dark'
                                    : isDone
                                    ? 'bg-success text-white'
                                    : 'bg-white text-muted border'
                                }`}
                              >
                                {st}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted small">
                    <Clock size={36} className="opacity-40 mb-2" />
                    <p className="m-0">{t('no_orders_yet')}</p>
                  </div>
                )}
              </div>
            )}

            {/* 6. NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="glass-card p-4 rounded-4 shadow-sm">
                <h4 className="fw-bold mb-3">{t('notifications')}</h4>
                {notifications.length > 0 ? (
                  <div className="list-group list-group-flush">
                    {notifications.map((n: any) => (
                      <div key={n.id} className="list-group-item px-0 py-3 border-bottom">
                        <div className="fw-bold small">{n.title}</div>
                        <div className="text-muted small">{n.message}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5 text-muted small">
                    <Bell size={36} className="opacity-40 mb-2" />
                    <p className="m-0">No new notifications.</p>
                  </div>
                )}
              </div>
            )}

            {/* 7. SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm" style={{ maxWidth: '640px' }}>
                <h4 className="fw-bold mb-3">{t('settings')}</h4>
                {settingsSaved && <div className="alert alert-success small mb-3">Preferences updated!</div>}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSettingsSaved(true);
                    setTimeout(() => setSettingsSaved(false), 3000);
                  }}
                >
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Primary Location / City</label>
                    <select
                      className="form-select"
                      value={preferredCity}
                      onChange={(e) => setPreferredCity(e.target.value)}
                    >
                      <option value="Addis Ababa">Addis Ababa</option>
                      <option value="Hawassa">Hawassa</option>
                      <option value="Adama">Adama</option>
                      <option value="Bahir Dar">Bahir Dar</option>
                      <option value="Dire Dawa">Dire Dawa</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-bold">Platform Language</label>
                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        onClick={() => setLanguage('en')}
                        className={`btn btn-sm ${language === 'en' ? 'btn-warning fw-bold' : 'btn-neutral'}`}
                      >
                        English
                      </button>
                      <button
                        type="button"
                        onClick={() => setLanguage('am')}
                        className={`btn btn-sm ${language === 'am' ? 'btn-warning fw-bold' : 'btn-neutral'}`}
                      >
                        አማርኛ (Amharic)
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn-orange px-4 py-2">
                    Save Preferences
                  </button>
                </form>
              </div>
            )}

            {/* 8. SUPPORT & SAFETY TAB */}
            {activeTab === 'support' && (
              <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm">
                <h4 className="fw-bold mb-3">{t('help_support')}</h4>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="p-3.5 bg-light rounded-4 border h-100">
                      <div className="fw-bold text-danger mb-1 d-flex align-items-center gap-1.5">
                        <AlertTriangle size={17} /> Never Send Advance Deposits
                      </div>
                      <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                        Always inspect products in person before transferring funds via Telebirr or CBE Birr.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="p-3.5 bg-light rounded-4 border h-100">
                      <div className="fw-bold text-primary mb-1 d-flex align-items-center gap-1.5">
                        <MapPin size={17} /> Public Meeting Places
                      </div>
                      <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                        Meet in busy daylight areas in Addis Ababa (e.g. Bole Medhanialem, Edna Mall, Kazanchis).
                      </p>
                    </div>
                  </div>
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
    <Suspense
      fallback={
        <div className="container py-5 text-center">
          <div className="spinner-border text-warning" role="status" />
        </div>
      }
    >
      <BuyerDashboardContent />
    </Suspense>
  );
}
