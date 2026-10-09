'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import {
  Search,
  ShoppingCart,
  Heart,
  Store,
  ShoppingBag,
  ShieldAlert,
  User as UserIcon,
  LogOut,
  Globe,
  Menu,
  X,
  ArrowRight,
  PackageCheck,
  ChevronDown,
} from 'lucide-react';
import { api } from '@/lib/api';

function NavbarContent() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [cartItemCount, setCartItemCount] = useState<number>(0);

  // Poll or load cart item count for buyers
  useEffect(() => {
    if (isAuthenticated && user?.role === 'buyer') {
      api.cart.get().then((cart) => {
        if (cart && typeof cart.total_items === 'number') {
          setCartItemCount(cart.total_items);
        }
      }).catch(() => {});
    }
  }, [isAuthenticated, user]);

  const navLinks = [
    { label: t('nav_home'), href: '/' },
    { label: t('nav_explore'), href: '/search' },
    { label: t('nav_how_it_works'), href: '/how-it-works' },
    { label: t('nav_for_sellers'), href: '/for-sellers' },
    { label: t('nav_about_us'), href: '/about-us' },
  ];

  const isSeller = user?.role === 'seller' || user?.role === 'verified_seller';
  const isAdmin = user?.role === 'admin';
  const isBuyer = user?.role === 'buyer' || (!isSeller && !isAdmin && isAuthenticated);

  if (pathname === '/') {
    return null;
  }

  return (
    <header className="glass-navbar sticky-top py-2.5">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between gap-3">
          {/* 1. Logo */}
          <div className="flex-shrink-0 d-flex align-items-center">
            <Logo size="md" />
          </div>

          {/* 2. Desktop Navigation Menu */}
          <nav className="d-none d-lg-flex align-items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-pill small fw-semibold transition-all ${
                    isActive
                      ? 'text-white'
                      : 'text-stone-700 hover-orange'
                  }`}
                  style={{
                    backgroundColor: isActive ? 'var(--primary-orange)' : 'transparent',
                    color: isActive ? '#FFFFFF' : 'var(--text-main)',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* 3. Action Buttons & Account Controls */}
          <div className="d-flex align-items-center gap-2">
            {/* Language Switcher */}
            <button
              type="button"
              onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
              className="btn btn-neutral rounded-pill py-1.5 px-3 small fw-bold d-flex align-items-center gap-1.5"
              title="Toggle Language"
              style={{ fontSize: '0.84rem' }}
            >
              <Globe size={15} style={{ color: 'var(--primary-orange)' }} />
              <span>{language === 'en' ? 'አማርኛ' : 'English'}</span>
            </button>

            {/* If Authenticated: Cart & Profile Controls */}
            {isAuthenticated && user ? (
              <>
                {/* Cart link for buyers */}
                {isBuyer && (
                  <Link
                    href="/buyer/dashboard?tab=cart"
                    className="btn btn-neutral rounded-circle p-2 position-relative"
                    title={t('cart')}
                  >
                    <ShoppingCart size={18} />
                    {cartItemCount > 0 && (
                      <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                        style={{ backgroundColor: 'var(--primary-orange)', fontSize: '0.65rem' }}
                      >
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* User Dropdown */}
                <div className="position-relative">
                  <button
                    className="btn btn-neutral rounded-pill d-flex align-items-center gap-2 py-1.5 px-3"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                  >
                    <UserIcon size={16} />
                    <span className="d-none d-sm-inline small fw-semibold text-truncate" style={{ maxWidth: '100px' }}>
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
                    <ChevronDown size={14} className="text-muted" />
                  </button>

                  {showUserDropdown && (
                    <div
                      className="position-absolute end-0 mt-2 py-2 glass-card shadow-lg z-3"
                      style={{ minWidth: '220px' }}
                    >
                      <div className="px-3 py-2 border-bottom">
                        <div className="fw-bold small">{user.display_name || user.username}</div>
                        <div className="text-muted small text-truncate" style={{ fontSize: '0.75rem' }}>
                          {user.email}
                        </div>
                      </div>

                      {/* Direct role destination */}
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
                        <>
                          <Link
                            href="/buyer/dashboard"
                            className="dropdown-item px-3 py-2 d-flex align-items-center gap-2 small fw-semibold"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <ShoppingBag size={15} className="text-primary" /> {t('buyer_hub')}
                          </Link>
                          <Link
                            href="/buyer/dashboard?tab=orders"
                            className="dropdown-item px-3 py-2 d-flex align-items-center gap-2 small fw-semibold"
                            onClick={() => setShowUserDropdown(false)}
                          >
                            <PackageCheck size={15} className="text-success" /> {t('orders')}
                          </Link>
                        </>
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
              </>
            ) : (
              /* Public Visitor: Sign In and Prominent Orange "Get Started" */
              <div className="d-flex align-items-center gap-2">
                <Link
                  href="/auth/login"
                  className="btn btn-neutral rounded-pill px-3 py-1.5 small fw-semibold d-none d-sm-inline-flex"
                >
                  {t('nav_sign_in')}
                </Link>
                <Link
                  href="/auth/register"
                  className="btn-orange rounded-pill px-3.5 py-1.5 small shadow-sm text-nowrap"
                >
                  <span>{t('nav_get_started')}</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              className="btn btn-neutral d-lg-none p-2 rounded-circle ms-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="d-lg-none pt-3 pb-2 border-top mt-2">
            <div className="d-flex flex-column gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 rounded-3 small fw-semibold text-reset hover-orange"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {!isAuthenticated && (
                <div className="pt-2 border-top d-flex flex-column gap-2 mt-1">
                  <Link
                    href="/auth/login"
                    className="btn btn-neutral w-100 py-2 small fw-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav_sign_in')}
                  </Link>
                  <Link
                    href="/auth/register"
                    className="btn-orange w-100 py-2 small"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav_get_started')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export const Navbar: React.FC = () => {
  return (
    <React.Suspense fallback={<header className="glass-navbar py-2.5" />}>
      <NavbarContent />
    </React.Suspense>
  );
};
