'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Hero } from '@/components/home/Hero';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { PlatformPortfolio } from '@/components/home/PlatformPortfolio';
import { TrustSection } from '@/components/home/TrustSection';
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

      {/* 2. In-Depth Platform Portfolio & Dual Role Registration */}
      <PlatformPortfolio />

      {/* 3. Category Discovery Grid */}
      <CategoryGrid categories={categories} />

      {/* 3. Featured Listings Section */}
      <section className="py-5" style={{ backgroundColor: 'var(--bg-main)' }}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center gap-2">
              <div
                className="p-2 rounded-3 text-warning"
                style={{ backgroundColor: 'rgba(249, 115, 22, 0.12)' }}
              >
                <Sparkles size={22} />
              </div>
              <div>
                <h3 className="fw-bold m-0" style={{ letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                  Featured Listings
                </h3>
                <p className="text-muted small m-0">
                  Hand-picked spotlights and verified deals in Addis Ababa
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
                    <div className="bg-secondary bg-opacity-25 w-100 rounded mb-3" style={{ height: '180px' }} />
                    <div className="bg-secondary bg-opacity-25 w-75 rounded mb-2" style={{ height: '20px' }} />
                    <div className="bg-secondary bg-opacity-25 w-50 rounded" style={{ height: '16px' }} />
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
            <div className="yg-card p-5 text-center">
              <p className="text-muted m-0">No featured listings found.</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. Recent & Popular Listings Section */}
      <section className="py-5" style={{ backgroundColor: 'var(--bg-card)' }}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center gap-2">
              <div
                className="p-2 rounded-3 text-primary"
                style={{ backgroundColor: 'rgba(59, 130, 246, 0.12)' }}
              >
                <Clock size={22} />
              </div>
              <div>
                <h3 className="fw-bold m-0" style={{ letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                  Recently Added
                </h3>
                <p className="text-muted small m-0">
                  Fresh marketplace listings uploaded within the last 24 hours
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
                    <div className="bg-secondary bg-opacity-25 w-100 rounded mb-3" style={{ height: '180px' }} />
                    <div className="bg-secondary bg-opacity-25 w-75 rounded mb-2" style={{ height: '20px' }} />
                    <div className="bg-secondary bg-opacity-25 w-50 rounded" style={{ height: '16px' }} />
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
            <div className="yg-card p-5 text-center">
              <p className="text-muted m-0">No recent listings available.</p>
            </div>
          )}

          <div className="text-center mt-5">
            <Link href="/search" className="btn-orange px-5 py-3">
              Explore All Marketplace Items <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Trust and Direct Selling Section */}
      <TrustSection />
    </div>
  );
}
