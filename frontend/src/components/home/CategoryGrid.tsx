'use client';

import React from 'react';
import Link from 'next/link';
import { Category } from '@/types';
import { useLanguage } from '@/lib/language-context';
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
  Tag,
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
  const { language, t } = useLanguage();

  return (
    <section className="py-5" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <span className="badge bg-warning bg-opacity-10 text-warning text-uppercase px-3 py-1 rounded-pill fw-bold small mb-2">
              6. {t('popular_categories_title')}
            </span>
            <h3 className="fw-bold m-0" style={{ letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              {language === 'am' ? 'የገበያ ምድቦችን ያስሱ' : 'Browse by Category'}
            </h3>
            <p className="text-muted small m-0 mt-1">
              {language === 'am'
                ? 'በኢትዮጵያ ውስጥ ያሉ እውነተኛ የምርት ምድቦች'
                : 'Verified categories with real listings across Ethiopia'}
            </p>
          </div>
          <Link href="/search" className="btn btn-neutral btn-sm px-3 fw-semibold">
            {language === 'am' ? 'ሁሉንም እይ' : 'All Products'} →
          </Link>
        </div>

        {categories && categories.length > 0 ? (
          <div className="row g-3">
            {categories.map((cat) => {
              const IconComponent = iconMap[cat.icon_identifier] || ShoppingBag;
              return (
                <div key={cat.id} className="col-6 col-md-4 col-lg-2">
                  <Link
                    href={`/search?category=${cat.slug}`}
                    className="glass-card p-3 d-flex flex-column align-items-center text-center text-decoration-none h-100 justify-content-center"
                    style={{ borderRadius: '16px', minHeight: '130px' }}
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
                      {cat.listing_count} {language === 'am' ? 'እቃዎች' : 'items'}
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card p-5 text-center rounded-4">
            <Tag size={36} className="text-muted opacity-40 mb-2" />
            <p className="text-muted small m-0">
              {t('no_products_yet')}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
