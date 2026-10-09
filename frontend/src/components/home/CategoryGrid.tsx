'use client';

import React from 'react';
import Link from 'next/link';
import { Category } from '@/types';
import {
  Smartphone,
  Laptop,
  Shirt,
  Sparkles,
  Home,
  HeartHandshake,
  Bike,
  Car,
  Building,
  ShoppingBag,
  LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Smartphone,
  Laptop,
  Shirt,
  Sparkles,
  Home,
  HeartHandshake,
  Bike,
  Car,
  Building,
  ShoppingBag,
};

interface CategoryGridProps {
  categories: Category[];
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  return (
    <section className="py-5">
      <div className="container">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h3 className="fw-bold m-0" style={{ letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              Explore Categories
            </h3>
            <p className="text-muted small m-0 mt-1">
              Browse popular marketplace categories across Ethiopia
            </p>
          </div>
          <Link href="/search" className="btn btn-neutral btn-sm px-3 fw-semibold">
            All Categories →
          </Link>
        </div>

        <div className="row g-3">
          {categories.map((cat) => {
            const IconComponent = iconMap[cat.icon_identifier] || ShoppingBag;
            return (
              <div key={cat.id} className="col-6 col-md-4 col-lg-2-4 col-xl-2">
                <Link
                  href={`/search?category=${cat.slug}`}
                  className="yg-card yg-card-interactive p-3 d-flex flex-column align-items-center text-center text-decoration-none h-100 justify-content-center"
                  style={{ borderRadius: '14px', minHeight: '125px' }}
                >
                  <div
                    className="mb-2 d-flex align-items-center justify-content-center"
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--primary-orange-light)',
                      color: 'var(--primary-orange)',
                    }}
                  >
                    <IconComponent size={24} />
                  </div>
                  <h6
                    className="fw-bold mb-1 small text-truncate w-100"
                    style={{ color: 'var(--text-main)', fontSize: '0.86rem' }}
                    title={cat.name}
                  >
                    {cat.name}
                  </h6>
                  <span className="text-muted" style={{ fontSize: '0.74rem' }}>
                    {cat.listing_count} {cat.listing_count === 1 ? 'ad' : 'ads'}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
