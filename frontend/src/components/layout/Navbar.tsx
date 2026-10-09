'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import {
  Search,
  ShoppingCart,
  Heart,
  User as UserIcon,
  LogOut,
  Globe,
  Store,
  ShoppingBag,
  ShieldAlert,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';
import { api } from '@/lib/api';

function NavbarContent() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      api.cart.get().then((c) => {
        if (c && c.total_items) setCartCount(c.total_items);
      }).catch(() => {});
    }
  }, [isAuthenticated, pathname]);

  const isSeller = user?.role === 'seller';
  const isAdmin = user?.role === 'admin';
  const isBuyer = user?.role === 'buyer';

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/search', label: t('explore_products') },
    { href: '/how-it-works', label: t('how_it_works') },
    { href: '/for-sellers', label: t('for_sellers') },
    { href: '/about-us', label: t('about_us') },
  ];

  return (
    <>
      <header className="glass-navbar py-2.5 px-3 px-lg-0 sticky-top">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between gap-3">
            {/* Logo */}
            <div className="flex-shrink-0 d-flex align-items-center">
              <Logo size="md" />
            </div>

            {/* Desktop Navigation Links */}
            <nav className="d-none d-lg-flex align-items-center gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`small fw-semibold transition-all ${
                    pathname === link.href ? 'text-warning fw-bold' : 'text-muted'
                  } hover-orange`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Action Items */}
            <div className="d-flex align-items-center gap-2">
              {/* Dual Language Switcher */}
              <button
                onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
                className="btn btn-neutral rounded-pill py-1.5 px-3 small fw-bold d-flex align-items-center gap-1.5"
                title="Switch Language / ቋንቋ ይቀይሩ"
                style={{ fontSize: '0.82rem' }}
              >
                <Globe size={14} className="text-warning" />
                <span>{language === 'en' ? 'አማርኛ' : 'English'}</span>
              </button>

              {/* Shopping Cart (Buyers) */}
              {isAuthenticated && isBuyer && (
                <Link
                  href="/buyer/dashboard?tab=cart"
                  className="btn btn-neutral rounded-circle p-2 position-relative"
                  title={t('shopping_cart')}
                  aria-label="Cart"
                >
                  <ShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark fw-bold"
                      style={{ fontSize: '0.65rem' }}
                    >
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Wishlist */}
              {isAuthenticated && (
                <Link
                  href={isBuyer ? '/buyer/dashboard?tab=wishlist' : '/favorites'}
                  className="btn btn-neutral rounded-circle p-2 position-relative d-none d-sm-inline-flex"
                  title={t('wishlist')}
                  aria-label="Wishlist"
                >
                  <Heart size={18} />
                </Link>
              )}

              {/* Authenticated User Menu */}
              {isAuthenticated && user ? (
                <div className="position-relative">
                  <button
                    className="btn btn-neutral rounded-pill d-flex align-items-center gap-2 py-1.5 px-3"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                  >
                    <UserIcon size={16} />
                    <span className="d-none d-md-inline small fw-semibold text-truncate" style={{ maxWidth: '120px' }}>
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
                        <div className="fw-bold small">{user.display_name || user.username}</div>
                        <div className="text-muted small text-truncate">{user.email}</div>
                      </div>

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
                <div className="d-flex align-items-center gap-2">
                  <Link href="/auth/login" className="btn btn-neutral rounded-pill px-3.5 py-1.5 small fw-semibold">
                    {t('sign_in')}
                  </Link>
                  <Link
                    href="/auth/register"
                    className="btn-orange rounded-pill px-4 py-2 small fw-bold shadow-sm d-none d-sm-inline-flex"
                  >
                    {t('get_started')} <ArrowRight size={15} />
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                className="btn btn-neutral p-2 d-lg-none rounded-circle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Polished Mobile Dropdown Navigation */}
          {mobileMenuOpen && (
            <div className="d-lg-none pt-3 pb-2 border-top mt-2">
              <div className="d-flex flex-column gap-2 mb-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="py-2 px-3 rounded-3 text-reset hover-orange small fw-semibold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              {!isAuthenticated && (
                <div className="d-grid gap-2 pt-2 border-top">
                  <Link
                    href="/auth/register"
                    className="btn-orange py-2 text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('get_started')}
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export const Navbar: React.FC = () => {
  return (
    <React.Suspense fallback={<header className="glass-navbar py-2.5" />}>
      <NavbarContent />
    </React.Suspense>
  );
};
