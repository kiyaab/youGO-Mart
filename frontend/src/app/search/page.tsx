'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Category, ListingCard as ListingCardType, LocationGroup } from '@/types';
import { ListingCard } from '@/components/listing/ListingCard';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Tag,
  CheckCircle2,
  RotateCcw,
  Grid3X3,
  List,
  ChevronDown,
} from 'lucide-react';

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State from URL
  const [q, setQ] = useState(searchParams?.get('q') || '');
  const [category, setCategory] = useState(searchParams?.get('category') || '');
  const [city, setCity] = useState(searchParams?.get('city') || '');
  const [neighborhood, setNeighborhood] = useState(searchParams?.get('neighborhood') || '');
  const [minPrice, setMinPrice] = useState(searchParams?.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams?.get('max_price') || '');
  const [condition, setCondition] = useState(searchParams?.get('condition') || '');
  const [negotiable, setNegotiable] = useState(searchParams?.get('negotiable') === 'true');
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams?.get('verified_only') === 'true');
  const [sort, setSort] = useState(searchParams?.get('sort') || 'newest');

  // View Mode
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Data
  const [listings, setListings] = useState<ListingCardType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<LocationGroup[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load Categories & Locations on mount
  useEffect(() => {
    api.categories.getAll().then(setCategories).catch(() => {});
    api.categories.getLocations().then(setLocations).catch(() => {});
  }, []);

  // Fetch listings
  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {
        q: q.trim(),
        category,
        city,
        neighborhood,
        min_price: minPrice,
        max_price: maxPrice,
        condition,
        negotiable: negotiable ? 'true' : '',
        verified_only: verifiedOnly ? 'true' : '',
        sort,
      };
      const res = await api.listings.getAll(params);
      setListings(res.results || []);
      setTotalCount(res.count || 0);
    } catch (err) {
      console.error('Failed to fetch search listings:', err);
    } finally {
      setLoading(false);
    }
  }, [q, category, city, neighborhood, minPrice, maxPrice, condition, negotiable, verifiedOnly, sort]);

  // Sync to URL
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (category) params.set('category', category);
    if (city) params.set('city', city);
    if (neighborhood) params.set('neighborhood', neighborhood);
    if (minPrice) params.set('min_price', minPrice);
    if (maxPrice) params.set('max_price', maxPrice);
    if (condition) params.set('condition', condition);
    if (negotiable) params.set('negotiable', 'true');
    if (verifiedOnly) params.set('verified_only', 'true');
    if (sort && sort !== 'newest') params.set('sort', sort);

    router.replace(`/search?${params.toString()}`);
  }, [q, category, city, neighborhood, minPrice, maxPrice, condition, negotiable, verifiedOnly, sort, router]);

  useEffect(() => {
    fetchListings();
    updateUrl();
  }, [fetchListings, updateUrl]);

  const resetFilters = () => {
    setQ('');
    setCategory('');
    setCity('');
    setNeighborhood('');
    setMinPrice('');
    setMaxPrice('');
    setCondition('');
    setNegotiable(false);
    setVerifiedOnly(false);
    setSort('newest');
    router.replace('/search');
  };

  // Selected city neighborhoods
  const activeLocation = locations.find((l) => l.city.toLowerCase() === city.toLowerCase());

  return (
    <div className="py-4">
      <div className="container">
        {/* Top Search bar and quick stats */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4 pb-3 border-bottom">
          <div>
            <h1 className="h3 fw-bold m-0" style={{ letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              Marketplace Search & Listings
            </h1>
            <p className="text-muted small m-0 mt-1">
              {loading ? 'Searching listings...' : `Found ${totalCount} ${totalCount === 1 ? 'listing' : 'listings'} in Ethiopia`}
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-neutral d-md-none d-flex align-items-center gap-1"
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            >
              <SlidersHorizontal size={16} /> Filters
            </button>

            {/* Sort Dropdown */}
            <select
              className="form-select form-select-sm"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              style={{ width: '160px' }}
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>

            {/* View Grid/List toggle */}
            <div className="btn-group d-none d-sm-flex" role="group">
              <button
                type="button"
                className={`btn btn-sm ${viewMode === 'grid' ? 'btn-warning text-dark' : 'btn-neutral'}`}
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
              >
                <Grid3X3 size={16} />
              </button>
              <button
                type="button"
                className={`btn btn-sm ${viewMode === 'list' ? 'btn-warning text-dark' : 'btn-neutral'}`}
                onClick={() => setViewMode('list')}
                aria-label="List view"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Filters Sidebar */}
          <div className={`col-lg-3 ${showFiltersMobile ? 'd-block' : 'd-none d-lg-block'}`}>
            <div className="yg-card p-3 p-xl-4 rounded-4 position-sticky" style={{ top: '80px' }}>
              <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                <h6 className="fw-bold m-0 d-flex align-items-center gap-2">
                  <SlidersHorizontal size={18} className="text-warning" /> Filter Listings
                </h6>
                <button
                  type="button"
                  className="btn btn-sm text-muted p-0 d-flex align-items-center gap-1 small hover-orange"
                  onClick={resetFilters}
                >
                  <RotateCcw size={13} /> Reset
                </button>
              </div>

              {/* Keyword Search Input */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted mb-1">Keyword</label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control form-control-sm ps-4"
                    placeholder="e.g. iPhone, Toyota, Sofa"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                  />
                  <Search size={14} className="position-absolute start-0 top-50 translate-middle-y ms-2 text-muted" />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted mb-1">Category</label>
                <select
                  className="form-select form-select-sm"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name} ({cat.listing_count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Location: City Filter */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted mb-1">City / Region</label>
                <select
                  className="form-select form-select-sm"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setNeighborhood('');
                  }}
                >
                  <option value="">All Cities (Ethiopia)</option>
                  <option value="Addis Ababa">Addis Ababa</option>
                  <option value="Hawassa">Hawassa</option>
                  <option value="Adama (Nazret)">Adama (Nazret)</option>
                  <option value="Bahir Dar">Bahir Dar</option>
                  <option value="Dire Dawa">Dire Dawa</option>
                  <option value="Mekelle">Mekelle</option>
                  <option value="Bishoftu (Debre Zeyit)">Bishoftu</option>
                  <option value="Gondar">Gondar</option>
                  <option value="Jimma">Jimma</option>
                </select>
              </div>

              {/* Neighborhood Filter (active when city has subcities) */}
              {activeLocation && activeLocation.neighborhoods.length > 0 && (
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-muted mb-1">Neighborhood / Area</label>
                  <select
                    className="form-select form-select-sm"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                  >
                    <option value="">All Neighborhoods</option>
                    {activeLocation.neighborhoods.map((n, idx) => (
                      <option key={idx} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Price Range (ETB) */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted mb-1">Price Range (ETB)</label>
                <div className="d-flex align-items-center gap-2">
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                  <span className="text-muted small">-</span>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              {/* Condition */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-muted mb-1">Item Condition</label>
                <select
                  className="form-select form-select-sm"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                >
                  <option value="">Any Condition</option>
                  <option value="brand_new">Brand New</option>
                  <option value="like_new">Like New / Open Box</option>
                  <option value="used_good">Used - Good</option>
                  <option value="used_fair">Used - Fair</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </div>

              {/* Checkboxes: Negotiable & Verified Seller */}
              <div className="d-flex flex-column gap-2 pt-2 border-top">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="negotiableCheck"
                    checked={negotiable}
                    onChange={(e) => setNegotiable(e.target.checked)}
                  />
                  <label className="form-check-label small" htmlFor="negotiableCheck">
                    Negotiable Price Only
                  </label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="verifiedCheck"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                  />
                  <label className="form-check-label small d-flex align-items-center gap-1" htmlFor="verifiedCheck">
                    <CheckCircle2 size={13} className="text-success" /> Verified Sellers Only
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid / List */}
          <div className="col-lg-9">
            {loading ? (
              <div className="row g-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="col-md-4 col-sm-6">
                    <div className="yg-card p-3" style={{ height: '340px', opacity: 0.6 }}>
                      <div className="bg-secondary bg-opacity-25 w-100 rounded mb-3" style={{ height: '180px' }} />
                      <div className="bg-secondary bg-opacity-25 w-75 rounded mb-2" style={{ height: '20px' }} />
                      <div className="bg-secondary bg-opacity-25 w-50 rounded" style={{ height: '16px' }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className={`row g-3 ${viewMode === 'list' ? 'row-cols-1' : 'row-cols-1 row-cols-sm-2 row-cols-md-3'}`}>
                {listings.map((item) => (
                  <div key={item.id} className="col">
                    <ListingCard listing={item} />
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="yg-card p-5 text-center rounded-4">
                <div
                  className="d-inline-flex p-3 rounded-circle bg-warning bg-opacity-10 text-warning mb-3"
                >
                  <Search size={36} />
                </div>
                <h4 className="fw-bold mb-2">No matching listings found</h4>
                <p className="text-muted small mx-auto mb-4" style={{ maxWidth: '420px' }}>
                  We could not find any items matching your selected criteria. Try removing some filters or searching with a different term.
                </p>
                <button onClick={resetFilters} className="btn-orange py-2 px-4">
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container py-5 text-center">Loading marketplace search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
