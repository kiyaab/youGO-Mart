'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Hero } from '@/components/home/Hero';
import { LandingSections } from '@/components/home/LandingSections';
import { PlatformPortfolio } from '@/components/home/PlatformPortfolio';
import { ListingCard } from '@/components/listing/ListingCard';
import { api } from '@/lib/api';
import { Category, ListingCard as ListingCardType } from '@/types';
import { Sparkles, ArrowRight, Clock, PlusCircle } from 'lucide-react';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredListings, setFeaturedListings] = useState<ListingCardType[]>([]);
  const [recentListings, setRecentListings] = useState<ListingCardType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [cats, feat, rec] = await Promise.all([
          api.categories.getAll(),
          api.listings.getFeatured(),
          api.listings.getRecent(),
        ]);
        setCategories(cats || []);
        setFeaturedListings(feat || []);
        setRecentListings(rec || []);
      } catch (err) {
        console.error('Failed to load marketplace data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div>
      {/* 1. Homepage Hero Section */}
      <Hero />

      {/* 2. Public Marketplace Landing Sections (All 9 Modules) */}
      <LandingSections categories={categories} />

      {/* 3. Deep In-Depth Platform Portfolio & Dual Role Registration */}
      <div id="about-us">
        <PlatformPortfolio />
      </div>

      {/* 4. Live Featured Listings Section */}
      <section className="py-5" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center gap-2">
              <div
                className="p-2 rounded-3 text-warning"
                style={{ backgroundColor: 'var(--primary-orange-light)' }}
              >
                <Sparkles size={22} style={{ color: 'var(--primary-orange)' }} />
              </div>
              <div>
                <h3 className="fw-bold m-0" style={{ letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                  Featured Products
                </h3>
                <p className="text-muted small m-0">
                  Verified deals from local merchants across Ethiopia
                </p>
              </div>
            </div>
            <Link href="/search?promoted=true" className="btn btn-neutral btn-sm px-3 fw-semibold">
              View All Featured →
            </Link>
          </div>

          {loading ? (
            <div className="row g-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="col-12 col-sm-6 col-lg-3">
                  <div className="yg-card p-3" style={{ height: '320px', opacity: 0.6 }}>
                    <div className="bg-secondary bg-opacity-10 w-100 rounded mb-3" style={{ height: '180px' }} />
                    <div className="bg-secondary bg-opacity-10 w-75 rounded mb-2" style={{ height: '20px' }} />
                    <div className="bg-secondary bg-opacity-10 w-50 rounded" style={{ height: '16px' }} />
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
              <p className="text-muted m-0">No promoted featured listings at this moment. Discover recent items below!</p>
            </div>
          )}
        </div>
      </section>

      {/* 5. Live Recent Listings Section */}
      <section className="py-5" style={{ backgroundColor: 'var(--bg-soft)' }}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center gap-2">
              <div
                className="p-2 rounded-3 text-primary"
                style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
              >
                <Clock size={22} style={{ color: '#2563EB' }} />
              </div>
              <div>
                <h3 className="fw-bold m-0" style={{ letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                  Fresh Marketplace Uploads
                </h3>
                <p className="text-muted small m-0">
                  New authentic products published by local sellers
                </p>
              </div>
            </div>
            <Link href="/search" className="btn btn-neutral btn-sm px-3 fw-semibold">
              Browse All ({recentListings.length}) →
            </Link>
          </div>

          {loading ? (
            <div className="row g-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="col-12 col-sm-6 col-lg-3">
                  <div className="yg-card p-3" style={{ height: '320px', opacity: 0.6 }}>
                    <div className="bg-secondary bg-opacity-10 w-100 rounded mb-3" style={{ height: '180px' }} />
                    <div className="bg-secondary bg-opacity-10 w-75 rounded mb-2" style={{ height: '20px' }} />
                    <div className="bg-secondary bg-opacity-10 w-50 rounded" style={{ height: '16px' }} />
                  </div>
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
              <p className="text-muted m-0">The marketplace is waiting for its first products. Be the first to publish a listing!</p>
              <Link href="/post-ad" className="btn-orange px-4 py-2 mt-3">
                <PlusCircle size={16} /> Post Free Ad
              </Link>
            </div>
          )}

          <div className="text-center mt-5">
            <Link href="/search" className="btn-orange px-5 py-3">
              Explore All Marketplace Items <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
