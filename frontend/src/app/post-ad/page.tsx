'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Category, LocationGroup } from '@/types';
import { useAuth } from '@/lib/auth-context';
import {
  Sparkles,
  Upload,
  MapPin,
  Check,
  ChevronRight,
  ChevronLeft,
  X,
  Phone,
  MessageCircle,
  MessageSquare,
  ShieldCheck,
  Tag,
  PlusCircle,
} from 'lucide-react';
import Image from 'next/image';

export default function PostAdPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<LocationGroup[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [condition, setCondition] = useState('used_good');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');

  // Images (URLs or Sample Photography)
  const [imageUrls, setImageUrls] = useState<string[]>([
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // Location
  const [city, setCity] = useState('Addis Ababa');
  const [neighborhood, setNeighborhood] = useState('Bole');
  const [landmark, setLandmark] = useState('');

  // Contact Preferences
  const [allowCalls, setAllowCalls] = useState(true);
  const [allowWhatsapp, setAllowWhatsapp] = useState(true);
  const [allowMessages, setAllowMessages] = useState(true);
  const [contactPhone, setContactPhone] = useState(user?.phone || '+251911234567');

  useEffect(() => {
    api.categories.getAll().then((data) => {
      setCategories(data);
      if (data.length > 0) setCategoryId(data[0].id);
    }).catch(() => {});
    api.categories.getLocations().then(setLocations).catch(() => {});
  }, []);

  const handleAddImage = (urlToAdd?: string) => {
    const url = urlToAdd || newImageUrl.trim();
    if (url && !imageUrls.includes(url)) {
      setImageUrls([...imageUrls, url]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (idx: number) => {
    setImageUrls(imageUrls.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      alert('Please sign in or use the demo switcher to post an ad.');
      return;
    }

    if (!title.trim() || !price || !categoryId) {
      alert('Please complete required fields (Title, Price, Category).');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        category_id: Number(categoryId),
        description: description.trim() || 'Genuine product in Addis Ababa. Inquiries and inspection welcome.',
        price: Number(price),
        currency: 'ETB',
        is_negotiable: isNegotiable,
        condition,
        brand: brand.trim(),
        model: model.trim(),
        country: 'Ethiopia',
        region: city === 'Addis Ababa' ? 'Addis Ababa' : 'Regional',
        city,
        neighborhood,
        landmark: landmark.trim(),
        image_urls: imageUrls,
      };

      const res = await api.listings.create(payload);
      alert('Congratulations! Your listing has been published for free on youGO-mart.');
      router.push(`/listings/${res.slug || res.id}`);
    } catch (err: any) {
      alert(err.message || 'Failed to publish listing.');
    } finally {
      setSubmitting(false);
    }
  };

  const activeLoc = locations.find((l) => l.city.toLowerCase() === city.toLowerCase());

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container" style={{ maxWidth: '820px' }}>
        {/* Header */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill bg-warning bg-opacity-10 text-warning fw-bold small mb-2">
            <Sparkles size={16} /> 0% Commission • Free Standard Listing
          </div>
          <h1 className="h3 fw-bold tracking-tight">Post a Free Ad on youGO-mart</h1>
          <p className="text-muted small">
            Connect directly with verified buyers across Ethiopia. Settle payments without any middlemen fees.
          </p>
        </div>

        {/* 5-Step Progress Indicators */}
        <div className="yg-card p-3 rounded-4 mb-4 shadow-sm">
          <div className="d-flex align-items-center justify-content-between position-relative">
            {[
              { num: 1, label: 'Product Info' },
              { num: 2, label: 'Photos' },
              { num: 3, label: 'Location' },
              { num: 4, label: 'Contact' },
              { num: 5, label: 'Preview' },
            ].map((s) => (
              <div
                key={s.num}
                className="d-flex flex-column align-items-center z-1 text-center"
                style={{ flex: 1, cursor: 'pointer' }}
                onClick={() => setStep(s.num)}
              >
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center fw-bold mb-1"
                  style={{
                    width: '36px',
                    height: '36px',
                    fontSize: '0.85rem',
                    backgroundColor:
                      step === s.num
                        ? '#F97316'
                        : step > s.num
                        ? '#16A34A'
                        : 'var(--mist)',
                    color: step >= s.num ? '#FFFFFF' : 'var(--text-muted)',
                    transition: 'all 0.2s',
                  }}
                >
                  {step > s.num ? <Check size={18} /> : s.num}
                </div>
                <span
                  className="small d-none d-sm-inline"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: step === s.num ? 700 : 500,
                    color: step === s.num ? '#F97316' : 'var(--text-muted)',
                  }}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Step Container */}
        <div className="yg-card p-4 p-md-5 rounded-4 shadow-sm mb-4">
          {/* STEP 1: Product Information */}
          {step === 1 && (
            <div>
              <h4 className="fw-bold mb-3">Step 1: Product Information</h4>
              <p className="text-muted small mb-4">
                Provide accurate details to help Ethiopian buyers find your item quickly.
              </p>

              <div className="mb-3">
                <label className="form-label small fw-bold">
                  Listing Title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Apple iPhone 14 Pro 128GB Space Black"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">
                    Category <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">Condition</label>
                  <select
                    className="form-select"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                  >
                    <option value="brand_new">Brand New (Unopened)</option>
                    <option value="like_new">Like New / Open Box</option>
                    <option value="used_good">Used - Good Condition</option>
                    <option value="used_fair">Used - Fair Condition</option>
                    <option value="refurbished">Refurbished</option>
                  </select>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Brand (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Apple, Toyota, Samsung"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Model (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. iPhone 14, Corolla, S23"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-7">
                  <label className="form-label small fw-bold">
                    Price (ETB) <span className="text-danger">*</span>
                  </label>
                  <div className="input-group">
                    <span className="input-group-text fw-bold">ETB</span>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="e.g. 45000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-5 d-flex align-items-end">
                  <div className="form-check pb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="negotiableToggle"
                      checked={isNegotiable}
                      onChange={(e) => setIsNegotiable(e.target.checked)}
                    />
                    <label className="form-check-label small fw-semibold" htmlFor="negotiableToggle">
                      Price is Negotiable
                    </label>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Product Description</label>
                <textarea
                  className="form-control"
                  rows={5}
                  placeholder="Describe condition, battery health, accessories included, reason for selling..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-end pt-3">
                <button
                  type="button"
                  className="btn-orange px-4"
                  onClick={() => {
                    if (!title.trim() || !price) {
                      alert('Please fill in title and price.');
                      return;
                    }
                    setStep(2);
                  }}
                >
                  Continue to Photos <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Product Images */}
          {step === 2 && (
            <div>
              <h4 className="fw-bold mb-3">Step 2: Add Photos</h4>
              <p className="text-muted small mb-4">
                Listings with clear photos get 5x more buyer calls and messages in Ethiopia.
              </p>

              {/* Photos Grid */}
              <div className="row g-3 mb-4">
                {imageUrls.map((url, idx) => (
                  <div key={idx} className="col-6 col-sm-4 col-md-3">
                    <div
                      className="position-relative rounded-3 overflow-hidden border"
                      style={{ height: '140px', backgroundColor: '#F1F5F9' }}
                    >
                      <Image src={url} alt={`Photo ${idx + 1}`} fill style={{ objectFit: 'cover' }} />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 p-1 rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: '24px', height: '24px' }}
                        onClick={() => handleRemoveImage(idx)}
                      >
                        <X size={14} />
                      </button>
                      {idx === 0 && (
                        <span className="badge bg-dark bg-opacity-75 position-absolute bottom-0 start-0 m-1 small">
                          Cover Photo
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Image URL or Sample Photo Presets */}
              <div className="p-3 bg-light rounded-3 mb-4 border">
                <label className="form-label small fw-bold mb-2">Add Image via URL or Quick Preset</label>
                <div className="input-group mb-2">
                  <input
                    type="url"
                    className="form-control form-control-sm"
                    placeholder="Paste image URL (https://...)"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-warning btn-sm fw-bold"
                    onClick={() => handleAddImage()}
                  >
                    Add Image
                  </button>
                </div>
                <div className="d-flex flex-wrap gap-2 pt-2">
                  <span className="small text-muted align-self-center">Or sample presets:</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary py-0"
                    onClick={() => handleAddImage('https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80')}
                  >
                    + Car
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary py-0"
                    onClick={() => handleAddImage('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80')}
                  >
                    + Laptop
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary py-0"
                    onClick={() => handleAddImage('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80')}
                  >
                    + Furniture
                  </button>
                </div>
              </div>

              <div className="d-flex justify-content-between pt-3">
                <button type="button" className="btn btn-neutral" onClick={() => setStep(1)}>
                  <ChevronLeft size={18} /> Back
                </button>
                <button type="button" className="btn-orange px-4" onClick={() => setStep(3)}>
                  Continue to Location <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Location */}
          {step === 3 && (
            <div>
              <h4 className="fw-bold mb-3">Step 3: Location in Ethiopia</h4>
              <p className="text-muted small mb-4">
                Buyers search locally to arrange easy in-person meetings.
              </p>

              <div className="mb-3">
                <label className="form-label small fw-bold">Country</label>
                <input type="text" className="form-control" value="Ethiopia" disabled />
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold">City / Town</label>
                  <select
                    className="form-select"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      if (e.target.value === 'Addis Ababa') setNeighborhood('Bole');
                      else setNeighborhood('');
                    }}
                  >
                    <option value="Addis Ababa">Addis Ababa</option>
                    <option value="Hawassa">Hawassa</option>
                    <option value="Adama (Nazret)">Adama (Nazret)</option>
                    <option value="Bahir Dar">Bahir Dar</option>
                    <option value="Dire Dawa">Dire Dawa</option>
                    <option value="Mekelle">Mekelle</option>
                    <option value="Bishoftu (Debre Zeyit)">Bishoftu</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold">Neighborhood / Subcity</label>
                  {activeLoc && activeLoc.neighborhoods.length > 0 ? (
                    <select
                      className="form-select"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                    >
                      {activeLoc.neighborhoods.map((n, idx) => (
                        <option key={idx} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. City Center, Kebele 04"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                    />
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">Nearby Landmark (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Near Edna Mall, Behind Commercial Bank, Atlas Hotel area"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                />
              </div>

              <div className="d-flex justify-content-between pt-3">
                <button type="button" className="btn btn-neutral" onClick={() => setStep(2)}>
                  <ChevronLeft size={18} /> Back
                </button>
                <button type="button" className="btn-orange px-4" onClick={() => setStep(4)}>
                  Continue to Contact <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Contact Preferences */}
          {step === 4 && (
            <div>
              <h4 className="fw-bold mb-3">Step 4: Contact Preferences</h4>
              <p className="text-muted small mb-4">
                Choose how buyers can connect with you. You control which channels are enabled.
              </p>

              <div className="mb-4">
                <label className="form-label small fw-bold">Contact Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="+251 911 234567"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
                <div className="form-text small text-muted">
                  Used for phone calls and WhatsApp chats.
                </div>
              </div>

              <div className="d-flex flex-column gap-3 p-3 bg-light rounded-3 mb-4 border">
                <div className="form-check form-switch d-flex justify-content-between align-items-center ps-0 pe-2">
                  <label className="form-check-label fw-semibold small d-flex align-items-center gap-2" htmlFor="allowCallsSwitch">
                    <Phone size={17} className="text-success" /> Allow Direct Phone Calls
                  </label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="allowCallsSwitch"
                    checked={allowCalls}
                    onChange={(e) => setAllowCalls(e.target.checked)}
                  />
                </div>

                <div className="form-check form-switch d-flex justify-content-between align-items-center ps-0 pe-2">
                  <label className="form-check-label fw-semibold small d-flex align-items-center gap-2" htmlFor="allowWhatsappSwitch">
                    <MessageCircle size={17} className="text-success" /> Allow WhatsApp Inquiries
                  </label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="allowWhatsappSwitch"
                    checked={allowWhatsapp}
                    onChange={(e) => setAllowWhatsapp(e.target.checked)}
                  />
                </div>

                <div className="form-check form-switch d-flex justify-content-between align-items-center ps-0 pe-2">
                  <label className="form-check-label fw-semibold small d-flex align-items-center gap-2" htmlFor="allowMessagesSwitch">
                    <MessageSquare size={17} className="text-warning" /> Accept In-Platform Messages
                  </label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="allowMessagesSwitch"
                    checked={allowMessages}
                    onChange={(e) => setAllowMessages(e.target.checked)}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between pt-3">
                <button type="button" className="btn btn-neutral" onClick={() => setStep(3)}>
                  <ChevronLeft size={18} /> Back
                </button>
                <button type="button" className="btn-orange px-4" onClick={() => setStep(5)}>
                  Preview & Publish <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Realistic Preview and Submission */}
          {step === 5 && (
            <div>
              <h4 className="fw-bold mb-3">Step 5: Review & Publish Free Ad</h4>
              <p className="text-muted small mb-4">
                Verify your listing details before publishing to the live marketplace.
              </p>

              {/* Preview Box */}
              <div className="yg-card p-3 rounded-3 mb-4 border-warning">
                <div className="row g-3 align-items-center">
                  <div className="col-sm-4">
                    <div
                      className="position-relative rounded overflow-hidden"
                      style={{ height: '140px', backgroundColor: '#E2E8F0' }}
                    >
                      {imageUrls.length > 0 ? (
                        <Image src={imageUrls[0]} alt="Preview" fill style={{ objectFit: 'cover' }} />
                      ) : (
                        <div className="h-100 d-flex align-items-center justify-content-center text-muted small">
                          No Photo
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-sm-8">
                    <div className="small text-muted text-uppercase fw-bold mb-1">
                      {categories.find((c) => c.id === categoryId)?.name || 'General'}
                    </div>
                    <h5 className="fw-bold mb-1">{title || 'Untitled Listing'}</h5>
                    <div className="yg-price mb-2">
                      {Number(price || 0).toLocaleString()} ETB
                      {isNegotiable && <span className="badge-negotiable ms-2">Negotiable</span>}
                    </div>
                    <div className="small text-muted d-flex align-items-center gap-1">
                      <MapPin size={13} className="text-warning" />
                      {neighborhood ? `${neighborhood}, ` : ''}{city}
                      {landmark ? ` (${landmark})` : ''}
                    </div>
                  </div>
                </div>
              </div>

              {/* Non-Negotiable Business Guarantee Notice */}
              <div className="p-3 bg-success bg-opacity-10 text-success rounded-3 mb-4 d-flex align-items-start gap-2 small">
                <ShieldCheck size={20} className="flex-shrink-0 mt-1" />
                <div>
                  <strong>100% Free & Commission-Free:</strong> youGO-mart charges zero commission on sales. Buyers will contact you directly to arrange collection and payment.
                </div>
              </div>

              <div className="d-flex justify-content-between pt-3">
                <button type="button" className="btn btn-neutral" onClick={() => setStep(4)}>
                  <ChevronLeft size={18} /> Back
                </button>
                <button
                  type="button"
                  className="btn-orange px-5 py-3 fw-bold"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? 'Publishing...' : 'Publish Listing for Free 🚀'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
