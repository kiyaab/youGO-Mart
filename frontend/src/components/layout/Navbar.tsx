'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { useLanguage } from '@/lib/language-context';
import {
  Search,
  MapPin,
  Heart,
  MessageSquare,
  PlusCircle,
  Sun,
  Moon,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  ShieldAlert,
  ChevronDown,
  X,
  Globe,
  Store,
  ShoppingBag,
} from 'lucide-react';
import { api } from '@/lib/api';
import { Category, LocationGroup } from '@/types';

function NavbarContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams?.get('city') || 'Addis Ababa');
  const [locations, setLocations] = useState<LocationGroup[]>([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    api.categories.getLocations().then(setLocations).catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() && !selectedCity) return;
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedCity && selectedCity !== 'All Ethiopia') params.set('city', selectedCity);
    router.push(`/search?${params.toString()}`);
  };

  const isSeller = user?.role === 'seller' || user?.role === 'verified_seller';
  const isAdmin = user?.role === 'admin';
  const isBuyer = user?.role === 'buyer';

  return (
    <>
      {/* 1. Dismissible Announcement Bar */}
      {!announcementDismissed && (
        <div className="top-announcement">
          <div className="container d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2 small">
              <span className="badge bg-warning text-dark fw-bold px-2 py-0.5">
                {t('zero_commission')}
              </span>
              <span>
                <strong>youGO-mart:</strong> {language === 'am' ? 'የኢትዮጵያ ነፃ የዲጂታል ማስታወቂያ ገበያ። ቀጥታ ከሻጮች ጋር ይገናኙ!' : 'Ethiopia’s free direct-connection marketplace. Direct seller contact with 0% commission!'}
              </span>
            </div>
            <button
              onClick={() => setAnnouncementDismissed(true)}
              className="btn btn-sm text-white p-0 d-flex align-items-center"
              aria-label="Dismiss announcement"
              style={{ opacity: 0.8 }}
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* 2. Glassmorphic Stylish Navbar */}
      <header className="glass-navbar py-2">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between gap-3">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo size="md" />
            </div>

            {/* Location Selector Button */}
            <div className="d-none d-lg-block flex-shrink-0">
              <button
                type="button"
                className="btn btn-neutral d-flex align-items-center gap-1 py-2 px-3 rounded-pill"
                onClick={() => setShowLocationModal(!showLocationModal)}
                style={{ fontSize: '0.86rem' }}
              >
                <MapPin size={15} className="text-warning" />
                <span className="fw-semibold text-truncate" style={{ maxWidth: '120px' }}>
                  {selectedCity || 'Ethiopia'}
                </span>
                <ChevronDown size={13} className="text-muted ms-1" />
              </button>
            </div>

            {/* Central Search Input */}
            <form
              onSubmit={handleSearchSubmit}
              className="d-none d-md-flex flex-grow-1 align-items-center position-relative"
              style={{ maxWidth: '460px' }}
            >
              <input
                type="text"
                className="form-control search-input-yg w-100 ps-4 pe-5"
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ height: '44px', fontSize: '0.9rem' }}
              />
              <button
                type="submit"
                className="btn position-absolute end-0 top-50 translate-middle-y me-2 p-1 text-muted"
                aria-label="Search"
                style={{ borderRadius: '50%' }}
              >
                <Search size={18} className="text-warning" />
              </button>
            </form>

            {/* Action Items */}
            <div className="d-flex align-items-center gap-2">
              {/* Dual Language Switcher: EN / አማ */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
                className="btn btn-neutral rounded-pill py-1 px-2.5 small fw-bold d-flex align-items-center gap-1"
                title="Switch Language"
                style={{ fontSize: '0.82rem' }}
              >
                <Globe size={14} className="text-warning" />
                <span>{language === 'en' ? 'አማርኛ' : 'English'}</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="btn btn-neutral rounded-circle p-2"
                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon size={17} /> : <Sun size={17} className="text-warning" />}
              </button>

              {/* Favorites (For Buyers / Logged-in users) */}
              <Link
                href="/favorites"
                className="btn btn-neutral rounded-circle p-2 position-relative"
                title={t('favorites')}
                aria-label="Favorites"
              >
                <Heart size={17} />
              </Link>

              {/* Messages */}
              <Link
                href="/messages"
                className="btn btn-neutral rounded-circle p-2 position-relative"
                title={t('messages')}
                aria-label="Messages"
              >
                <MessageSquare size={17} />
              </Link>

              {/* User Account / Role-based Navigation */}
              {isAuthenticated && user ? (
                <div className="position-relative">
                  <button
                    className="btn btn-neutral rounded-pill d-flex align-items-center gap-2 py-1.5 px-3"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                  >
                    <UserIcon size={16} />
                    <span className="d-none d-md-inline small fw-semibold">
                      {user.display_name?.split(' ')[0] || user.username}
                    </span>
                    <span
                      className={`badge rounded-pill text-uppercase ${
                        isAdmin ? 'bg-danger' : isSeller ? 'bg-warning text-dark' : 'bg-primary'
                      }`}
                      style={{ fontSize: '0.65rem' }}
                    >
                      {isAdmin ? 'Admin' : isSeller ? 'Seller' : 'Buyer'}
                    </span>
                  </button>

                  {showUserDropdown && (
                    <div
                      className="position-absolute end-0 mt-2 py-2 glass-card shadow-lg z-3"
                      style={{ minWidth: '220px' }}
                    >
                      <div className="px-3 py-2 border-bottom">
                        <div className="fw-bold small">{user.display_name}</div>
                        <div className="text-muted small text-truncate">{user.email}</div>
                      </div>

                      {/* Role Specific Destination */}
                      {isSeller && (
                        <Link
                          href="/seller/dashboard"
                          className="dropdown-item px-3 py-2 d-flex align-items-center gap-2 small fw-semibold"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <Store size={15} className="text-warning" /> {t('seller_hub')}
                        </Link>
                      )}

                      {isBuyer && (
                        <Link
                          href="/buyer/dashboard"
                          className="dropdown-item px-3 py-2 d-flex align-items-center gap-2 small fw-semibold"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <ShoppingBag size={15} className="text-primary" /> {t('buyer_hub')}
                        </Link>
                      )}

                      {isAdmin && (
                        <Link
                          href="/admin-portal"
                          className="dropdown-item px-3 py-2 text-danger d-flex align-items-center gap-2 small fw-bold"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <ShieldAlert size={15} /> {t('admin_portal')}
                        </Link>
                      )}

                      <div className="border-top my-1" />

                      <button
                        className="dropdown-item px-3 py-2 text-danger d-flex align-items-center gap-2 small border-0 bg-transparent w-100 text-start"
                        onClick={() => {
                          logout();
                          setShowUserDropdown(false);
                          router.push('/');
                        }}
                      >
                        <LogOut size={15} /> {t('sign_out')}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="d-flex align-items-center gap-1.5">
                  <Link href="/auth/login" className="btn btn-neutral rounded-pill px-3 py-1.5 small fw-semibold">
                    {t('sign_in')}
                  </Link>
                  <Link href="/auth/register" className="btn btn-neutral rounded-pill px-3 py-1.5 small fw-semibold d-none d-sm-inline-flex">
                    {t('register')}
                  </Link>
                </div>
              )}

              {/* Post a Free Ad Button */}
              <Link href="/post-ad" className="btn-orange rounded-pill text-nowrap py-2 px-3.5 shadow-sm">
                <PlusCircle size={17} />
                <span className="d-none d-sm-inline">{t('post_ad')}</span>
                <span className="d-sm-none">Sell</span>
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="d-md-none mt-2">
            <form onSubmit={handleSearchSubmit} className="position-relative">
              <input
                type="text"
                className="form-control search-input-yg w-100 ps-3 pe-5"
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ height: '40px', fontSize: '0.86rem' }}
              />
              <button
                type="submit"
                className="btn position-absolute end-0 top-50 translate-middle-y me-2 p-1 text-muted"
                aria-label="Search"
              >
                <Search size={17} className="text-warning" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Location Selector Modal */}
      {showLocationModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center z-3 p-3"
          onClick={() => setShowLocationModal(false)}
        >
          <div
            className="glass-card p-4 w-100"
            style={{ maxWidth: '520px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h5 className="m-0 fw-bold d-flex align-items-center gap-2">
                <MapPin className="text-warning" size={20} /> Select Location / ከተማ ይምረጡ
              </h5>
              <button
                className="btn btn-sm btn-close"
                onClick={() => setShowLocationModal(false)}
              ></button>
            </div>
            <p className="small text-muted mb-3">
              Browse listings specifically across Addis Ababa and Ethiopian cities.
            </p>
            <div className="row g-2">
              <div className="col-12">
                <button
                  className={`btn w-100 text-start py-2 px-3 rounded-3 ${
                    selectedCity === 'All Ethiopia' ? 'btn-warning fw-bold' : 'btn-outline-secondary'
                  }`}
                  onClick={() => {
                    setSelectedCity('All Ethiopia');
                    setShowLocationModal(false);
                    router.push('/search');
                  }}
                >
                  🇪🇹 All Ethiopia (National)
                </button>
              </div>
              {locations.map((loc, idx) => (
                <div className="col-sm-6" key={idx}>
                  <button
                    className={`btn w-100 text-start py-2 px-3 rounded-3 ${
                      selectedCity === loc.city ? 'btn-warning fw-bold' : 'btn-outline-secondary'
                    }`}
                    onClick={() => {
                      setSelectedCity(loc.city);
                      setShowLocationModal(false);
                      router.push(`/search?city=${encodeURIComponent(loc.city)}`);
                    }}
                  >
                    <div className="fw-semibold">{loc.city}</div>
                    <div className="small text-muted" style={{ fontSize: '0.75rem' }}>
                      {loc.region}
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export const Navbar: React.FC = () => {
  return (
    <React.Suspense fallback={<header className="glass-navbar py-2" />}>
      <NavbarContent />
    </React.Suspense>
  );
};
