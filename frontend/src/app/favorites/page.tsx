'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { ListingCard as ListingCardType } from '@/types';
import { ListingCard } from '@/components/listing/ListingCard';
import { Heart, Search } from 'lucide-react';

export default function FavoritesPage() {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<{ id: number; listing: ListingCardType }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const data = await api.favorites.getAll();
        setFavorites(data || []);
      } catch (err) {
        console.error('Failed to load favorites:', err);
      } finally {
        setLoading(false);
      }
    }
    loadFavorites();
  }, [isAuthenticated]);

  const handleFavoriteToggled = (listingId: number, isFav: boolean) => {
    if (!isFav) {
      setFavorites(favorites.filter((f) => f.listing.id !== listingId));
    }
  };

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
          <div>
            <h1 className="h3 fw-bold m-0 d-flex align-items-center gap-2">
              <Heart className="text-danger fill-danger" size={24} /> Saved Favorites
            </h1>
            <p className="text-muted small m-0 mt-1">
              Your saved listings for quick access and price tracking.
            </p>
          </div>
          <Link href="/search" className="btn btn-neutral btn-sm px-3">
            Browse More Listings
          </Link>
        </div>

        {loading ? (
          <div className="row g-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="col-12 col-sm-6 col-lg-3">
                <div className="yg-card p-3" style={{ height: '320px', opacity: 0.6 }}>
                  <div className="bg-secondary bg-opacity-25 w-100 rounded mb-3" style={{ height: '180px' }} />
                  <div className="bg-secondary bg-opacity-25 w-75 rounded" style={{ height: '20px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="row g-3">
            {favorites.map((fav) => (
              <div key={fav.id} className="col-12 col-sm-6 col-lg-3">
                <ListingCard
                  listing={fav.listing}
                  onFavoriteToggled={handleFavoriteToggled}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="yg-card p-5 text-center rounded-4 max-w-md mx-auto">
            <Heart size={44} className="text-muted opacity-50 mb-3" />
            <h4 className="fw-bold">No saved favorites yet</h4>
            <p className="text-muted small mb-4">
              Click the heart icon on any product card while browsing to save it to your wishlist.
            </p>
            <Link href="/search" className="btn-orange px-4 py-2">
              <Search size={16} /> Explore Listings
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
