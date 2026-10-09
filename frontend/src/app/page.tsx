'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Hero } from '@/components/home/Hero';
import { ExploreMarketplaceSection } from '@/components/home/ExploreMarketplaceSection';
import { HowItWorksSection } from '@/components/home/HowItWorksSection';
import { ForBuyersSection } from '@/components/home/ForBuyersSection';
import { ForSellersSection } from '@/components/home/ForSellersSection';
import { WhyYouGoMartSection } from '@/components/home/WhyYouGoMartSection';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { BecomeSellerCTA } from '@/components/home/BecomeSellerCTA';
import { FAQSection } from '@/components/home/FAQSection';
import { ListingCard } from '@/components/listing/ListingCard';
import { api } from '@/lib/api';
import { useLanguage } from '@/lib/language-context';
import { Category, ListingCard as ListingCardType } from '@/types';
import { Sparkles, ArrowRight, Clock, ShoppingBag } from 'lucide-react';

export default function HomePage() {
  const { language, t } = useLanguage();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredListings, setFeaturedListings] = useState<ListingCardType[]>([]);
  const [recentListings, setRecentListings] = useState<ListingCardType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, feat, rec] = await Promise.allSettled([
          api.categories.getAll(),
          api.listings.getFeatured(),
          api.listings.getRecent(),
        ]);
        if (cats.status === 'fulfilled') setCategories(cats.value || []);
        if (feat.status === 'fulfilled') setFeaturedListings(feat.value || []);
        if (rec.status === 'fulfilled') setRecentListings(rec.value || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div>
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Explore the Marketplace (Discovery, Search, Filtering) */}
      <ExploreMarketplaceSection />

      {/* 3. Real Product Highlights (Featured Listings) */}
      <section className="py-5" style={{ backgroundColor: '#FFF7F0' }}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center gap-2">
              <div
                className="p-2 rounded-3 text-warning"
                style={{ backgroundColor: 'var(--primary-orange-light)' }}
              >
                <Sparkles size={22} />
              </div>
              <div>
                <h3 className="fw-bold m-0" style={{ letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                  {language === 'am' ? 'ተለይተው የቀረቡ እቃዎች' : 'Featured Marketplace Deals'}
                </h3>
                <p className="text-muted small m-0">
                  {language === 'am'
                    ? 'በአዲስ አበባ እና በኢትዮጵያ ውስጥ ያሉ የተረጋገጡ ቅናሾች'
                    : 'Hand-picked spotlights and verified listings in Addis Ababa'}
                </p>
              </div>
            </div>
            <Link href="/search?promoted=true" className="btn btn-neutral btn-sm px-3 fw-semibold">
              {language === 'am' ? 'ሁሉንም እይ' : 'View All'} →
            </Link>
          </div>

          {loading ? (
            <div className="row g-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="col-12 col-sm-6 col-lg-3">
                  <div className="glass-card p-3" style={{ height: '320px', opacity: 0.6 }}>
                    <div className="bg-secondary bg-opacity-25 w-100 rounded mb-3" style={{ height: '180px' }} />
                    <div className="bg-secondary bg-opacity-25 w-75 rounded mb-2" style={{ height: '20px' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredListings.length > 0 ? (
            <div className="row g-3">
              {featuredListings.slice(0, 4).map((listing) => (
                <div key={listing.id} className="col-12 col-sm-6 col-lg-3">
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-5 text-center rounded-4">
              <ShoppingBag size={36} className="text-muted opacity-40 mb-2" />
              <p className="text-muted small m-0">
                {t('no_products_yet')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 4. How It Works (Clear steps for buyers & sellers) */}
      <HowItWorksSection />

      {/* 5. For Buyers Section (Wishlists, Carts, Order Tracking) */}
      <ForBuyersSection />

      {/* 6. For Sellers Section (Store Creation, Inventory, Real Analytics) */}
      <ForSellersSection />

      {/* 7. Why youGO-mart (Actual platform advantages, 0% commission) */}
      <WhyYouGoMartSection />

      {/* 8. Popular Categories (From real database) */}
      <CategoryGrid categories={categories} />

      {/* 9. Fresh Recent Listings */}
      <section className="py-5" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center gap-2">
              <div
                className="p-2 rounded-3 text-warning"
                style={{ backgroundColor: 'var(--primary-orange-light)' }}
              >
                <Clock size={22} />
              </div>
              <div>
                <h3 className="fw-bold m-0" style={{ letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                  {language === 'am' ? 'በቅርብ ጊዜ የተጨመሩ እቃዎች' : 'Recently Published Products'}
                </h3>
                <p className="text-muted small m-0">
                  {language === 'am'
                    ? 'በመጨረሻዎቹ ሰዓታት የተጨመሩ አዳዲስ እቃዎች'
                    : 'Freshly listed merchandise from verified merchants across Ethiopia'}
                </p>
              </div>
            </div>
            <Link href="/search" className="btn btn-neutral btn-sm px-3 fw-semibold">
              {language === 'am' ? 'ሁሉንም ፈልግ' : 'Browse All'} →
            </Link>
          </div>

          {loading ? (
            <div className="row g-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="col-12 col-sm-6 col-lg-3">
                  <div className="glass-card p-3" style={{ height: '320px', opacity: 0.6 }} />
                </div>
              ))}
            </div>
          ) : recentListings.length > 0 ? (
            <div className="row g-3">
              {recentListings.slice(0, 8).map((listing) => (
                <div key={listing.id} className="col-12 col-sm-6 col-lg-3">
                  <ListingCard listing={listing} />
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card p-5 text-center rounded-4">
              <p className="text-muted small m-0">{t('no_products_yet')}</p>
            </div>
          )}
        </div>
      </section>

      {/* 10. Become a Seller (Recruitment with registration CTA) */}
      <BecomeSellerCTA />

      {/* 11. Frequently Asked Questions */}
      <FAQSection />
    </div>
  );
}
