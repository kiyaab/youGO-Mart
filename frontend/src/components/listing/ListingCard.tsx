'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ListingCard as ListingCardType } from '@/types';
import { MapPin, Clock, CheckCircle2, Heart, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';

interface ListingCardProps {
  listing: ListingCardType;
  onFavoriteToggled?: (id: number, isFav: boolean) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onFavoriteToggled }) => {
  const { isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const [isFavorited, setIsFavorited] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);

  const formattedPrice = Number(listing.price).toLocaleString('en-US');

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      alert(language === 'am' ? 'ምርቶችን ወደ ተወዳጆች ለመጨመር እባክዎ መጀመሪያ ይግቡ።' : 'Please sign in to save products to your favorites.');
      return;
    }
    setLoadingFav(true);
    try {
      const res = await api.listings.toggleFavorite(listing.id);
      setIsFavorited(res.is_favorited);
      if (onFavoriteToggled) {
        onFavoriteToggled(listing.id, res.is_favorited);
      }
    } catch {
      // ignore
    } finally {
      setLoadingFav(false);
    }
  };

  return (
    <div className="h-100 yg-card yg-card-interactive d-flex flex-column position-relative">
      <Link href={`/listings/${listing.slug || listing.id}`} className="text-reset text-decoration-none d-flex flex-column h-100">
        {/* Image Container with fixed Aspect Ratio */}
        <div
          className="position-relative w-100"
          style={{
            paddingTop: '66.66%', // 3:2 ratio
            backgroundColor: '#E2E8F0',
            overflow: 'hidden',
          }}
        >
          {listing.primary_image ? (
            <Image
              src={listing.primary_image}
              alt={listing.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: 'cover' }}
              className="transition-transform duration-300 hover:scale-105"
            />
          ) : (
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center text-muted small">
              No image available
            </div>
          )}

          {/* Badges Overlay */}
          <div className="position-absolute top-0 start-0 m-2 d-flex flex-wrap gap-1">
            {listing.is_promoted && (
              <span className="badge-featured shadow-sm">
                <Sparkles size={11} /> Featured
              </span>
            )}
            {listing.is_negotiable && (
              <span className="badge-negotiable shadow-sm">
                Negotiable
              </span>
            )}
          </div>

          {/* Favorite Button */}
          <button
            type="button"
            className="btn position-absolute top-0 end-0 m-2 p-2 bg-white bg-opacity-90 rounded-circle shadow-sm d-flex align-items-center justify-content-center"
            style={{ width: '34px', height: '34px', border: 'none' }}
            onClick={handleFavoriteClick}
            aria-label="Add to favorites"
            disabled={loadingFav}
          >
            <Heart
              size={17}
              className={isFavorited ? 'text-danger fill-danger' : 'text-secondary'}
              fill={isFavorited ? '#DC2626' : 'none'}
            />
          </button>

          {/* Condition Tag on Bottom Right of Image */}
          <div className="position-absolute bottom-0 start-0 m-2">
            <span className="badge-condition bg-dark bg-opacity-75 text-white border-0 py-1 px-2">
              {listing.condition_display || listing.condition}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3 d-flex flex-column flex-grow-1 justify-content-between">
          <div>
            {/* Category */}
            <div className="small text-muted mb-1 text-uppercase fw-semibold" style={{ fontSize: '0.72rem', letterSpacing: '0.04em' }}>
              {listing.category_name}
            </div>

            {/* Title */}
            <h6
              className="fw-bold mb-2 text-truncate-2"
              style={{
                fontSize: '0.96rem',
                lineHeight: 1.35,
                height: '2.7rem',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
              title={listing.title}
            >
              {listing.title}
            </h6>

            {/* Price */}
            <div className="d-flex align-items-baseline gap-1 mb-2">
              <span className="yg-price">{formattedPrice}</span>
              <span className="small fw-bold text-muted">{listing.currency || 'ETB'}</span>
            </div>
          </div>

          {/* Footer details: Location, Seller, Time */}
          <div className="pt-2 border-top mt-auto">
            <div className="d-flex align-items-center justify-content-between text-muted small mb-1" style={{ fontSize: '0.78rem' }}>
              <div className="d-flex align-items-center gap-1 text-truncate" style={{ maxWidth: '160px' }}>
                <MapPin size={13} className="flex-shrink-0 text-warning" />
                <span className="text-truncate">
                  {listing.neighborhood ? `${listing.neighborhood}, ` : ''}{listing.city}
                </span>
              </div>
              <div className="d-flex align-items-center gap-1 flex-shrink-0">
                <Clock size={12} />
                <span>{listing.time_ago}</span>
              </div>
            </div>

            {/* Seller with verification check */}
            <div className="d-flex align-items-center justify-content-between pt-1">
              <span className="small text-truncate fw-medium" style={{ maxWidth: '140px', fontSize: '0.78rem' }}>
                {listing.seller_name}
              </span>
              {listing.is_seller_verified && (
                <span className="badge-verified" title="Verified Seller">
                  <CheckCircle2 size={12} /> Verified
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
