'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { Logo } from '@/components/brand/Logo';
import { GoogleIcon } from '@/components/common/GoogleIcon';
import {
  ShieldCheck,
  User,
  Mail,
  Lock,
  Phone,
  Store,
  ShoppingBag,
  MapPin,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role');
  const provider = searchParams.get('provider');

  const { register } = useAuth();
  const { language, t } = useLanguage();

  const [role, setRole] = useState<'buyer' | 'seller'>(
    initialRole === 'seller' ? 'seller' : 'buyer'
  );
  const [displayName, setDisplayName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Addis Ababa');
  const [neighborhood, setNeighborhood] = useState('Bole');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (initialRole === 'seller') setRole('seller');
    else if (initialRole === 'buyer') setRole('buyer');
  }, [initialRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({
        display_name: role === 'seller' && businessName ? `${displayName} (${businessName})` : displayName,
        email,
        phone,
        password,
        role,
        is_seller: role === 'seller',
        city,
        neighborhood,
      });

      if (role === 'seller') {
        router.push('/seller/dashboard');
      } else {
        router.push('/buyer/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const promptEmail = window.prompt(
        language === 'am'
          ? `እንደ ${role === 'seller' ? 'ሻጭ' : 'ገዢ'} ለመመዝገብ የጉግል ኢሜይልዎን ያስገቡ:`
          : `Enter your Google email to register as a ${role === 'seller' ? 'Seller' : 'Buyer'}:`,
        `new_${role}@gmail.com`
      );
      if (promptEmail) {
        await register({
          display_name: promptEmail.split('@')[0],
          email: promptEmail,
          password: 'GoogleAuthSecure2026!',
          role,
          is_seller: role === 'seller',
          city: 'Addis Ababa',
        });
        if (role === 'seller') router.push('/seller/dashboard');
        else router.push('/buyer/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initialize Google registration.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="py-5" style={{ backgroundColor: 'var(--bg-main)', minHeight: '90vh' }}>
      <div className="container" style={{ maxWidth: '520px' }}>
        <div className="text-center mb-4">
          <div className="mb-3 d-inline-block">
            <Logo size="lg" />
          </div>
          <h1 className="h4 fw-bold" style={{ color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {language === 'am' ? 'የ ዩጎ-ማርት መለያ ይፍጠሩ' : 'Create Your youGO-mart Account'}
          </h1>
          <p className="text-muted small">
            {language === 'am'
              ? 'በኢትዮጵያ ያለ ኮሚሽን በቀጥታ ይገበያዩ'
              : 'Direct connection marketplace • 100% Free • No sales commission'}
          </p>
        </div>

        {/* STRICT ROLE SELECTOR CARDS */}
        <div className="row g-2 mb-4">
          <div className="col-6">
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`w-100 p-3 rounded-4 border text-start transition-all d-flex flex-column gap-1 ${
                role === 'buyer'
                  ? 'border-primary bg-primary bg-opacity-10 shadow-sm'
                  : 'bg-white border-light text-muted'
              }`}
            >
              <div className="d-flex align-items-center justify-content-between">
                <div className={`p-2 rounded-3 ${role === 'buyer' ? 'bg-primary text-white' : 'bg-light text-muted'}`}>
                  <ShoppingBag size={18} />
                </div>
                {role === 'buyer' && <CheckCircle2 size={16} className="text-primary" />}
              </div>
              <div className="fw-bold mt-1" style={{ color: role === 'buyer' ? 'var(--text-main)' : 'inherit' }}>
                {language === 'am' ? 'ገዢ (Buyer)' : 'Buyer'}
              </div>
              <div className="small text-muted" style={{ fontSize: '0.72rem' }}>
                {language === 'am' ? 'ምርቶችን ፈልግ እና እዘዝ' : 'Browse, wishlist & call sellers'}
              </div>
            </button>
          </div>

          <div className="col-6">
            <button
              type="button"
              onClick={() => setRole('seller')}
              className={`w-100 p-3 rounded-4 border text-start transition-all d-flex flex-column gap-1 ${
                role === 'seller'
                  ? 'border-warning bg-warning bg-opacity-10 shadow-sm'
                  : 'bg-white border-light text-muted'
              }`}
            >
              <div className="d-flex align-items-center justify-content-between">
                <div className={`p-2 rounded-3 ${role === 'seller' ? 'bg-warning text-dark' : 'bg-light text-muted'}`}>
                  <Store size={18} />
                </div>
                {role === 'seller' && <CheckCircle2 size={16} className="text-warning" />}
              </div>
              <div className="fw-bold mt-1" style={{ color: role === 'seller' ? 'var(--text-main)' : 'inherit' }}>
                {language === 'am' ? 'ሻጭ (Seller)' : 'Seller'}
              </div>
              <div className="small text-muted" style={{ fontSize: '0.72rem' }}>
                {language === 'am' ? 'ዕቃዎችን ያለ ኮሚሽን ሽጥ' : 'Post free ads & get leads'}
              </div>
            </button>
          </div>
        </div>

        {/* REGISTRATION CARD */}
        <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm">
          {error && <div className="alert alert-danger small mb-3">{error}</div>}

          {/* Google Auth Button tailored to selected role */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={googleLoading}
            className="btn-google w-100 py-3 mb-3 fw-semibold shadow-sm"
          >
            <GoogleIcon size={19} />
            <span>
              {googleLoading
                ? 'Connecting to Google...'
                : `${t('continue_with_google')} (${role === 'seller' ? 'Seller' : 'Buyer'})`}
            </span>
          </button>

          <div className="d-flex align-items-center my-3 text-muted small">
            <hr className="flex-grow-1 m-0 opacity-25" />
            <span className="px-3 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>
              {language === 'am' ? 'ወይም ቅጽ ይሙሉ' : 'Or fill registration form'}
            </span>
            <hr className="flex-grow-1 m-0 opacity-25" />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">
                {role === 'seller'
                  ? (language === 'am' ? 'የሻጭ ስም' : 'Seller / Merchant Name')
                  : (language === 'am' ? 'ሙሉ ስም' : 'Full Name')}
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted border-end-0">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder={role === 'seller' ? 'e.g. Abebe Electronics' : 'e.g. Almaz Bekele'}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>
            </div>

            {role === 'seller' && (
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">
                  {language === 'am' ? 'የንግድ ስም (ከተፈለገ)' : 'Business / Storefront Name (Optional)'}
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Addis Tech Hub"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                />
              </div>
            )}

            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">
                {language === 'am' ? 'የኢሜይል አድራሻ' : 'Email Address'}
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted border-end-0">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  className="form-control border-start-0 ps-0"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-muted">
                {language === 'am' ? 'ስልክ ቁጥር' : 'Phone Number'} {role === 'seller' ? '(Required for Buyer Calls)' : '(Optional)'}
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted border-end-0">
                  <Phone size={16} />
                </span>
                <input
                  type="tel"
                  className="form-control border-start-0 ps-0"
                  placeholder="+251 911 234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required={role === 'seller'}
                />
              </div>
            </div>

            <div className="row g-2 mb-3">
              <div className="col-6">
                <label className="form-label small fw-bold text-muted">
                  {language === 'am' ? 'ከተማ' : 'City'}
                </label>
                <select className="form-select" value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="Addis Ababa">Addis Ababa</option>
                  <option value="Hawassa">Hawassa</option>
                  <option value="Adama">Adama</option>
                  <option value="Bahir Dar">Bahir Dar</option>
                  <option value="Dire Dawa">Dire Dawa</option>
                </select>
              </div>
              <div className="col-6">
                <label className="form-label small fw-bold text-muted">
                  {language === 'am' ? 'ሰፈር / ክፍለ ከተማ' : 'Subcity / Area'}
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Bole / Kazanchis"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold text-muted">
                {language === 'am' ? 'የይለፍ ቃል' : 'Password (min 6 characters)'}
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted border-end-0">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  className="form-control border-start-0 ps-0"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-100 py-3 fw-bold mb-3 shadow-sm ${role === 'seller' ? 'btn-orange' : 'btn btn-primary'}`}
              disabled={loading}
            >
              {loading
                ? (language === 'am' ? 'በመመዝገብ ላይ...' : 'Creating Account...')
                : role === 'seller'
                ? (language === 'am' ? 'እንደ ሻጭ ተመዝገብ' : 'Register as Seller & Open Store')
                : (language === 'am' ? 'እንደ ገዢ ተመዝገብ' : 'Register as Buyer')}
            </button>

            <div className="text-center small text-muted">
              {language === 'am' ? 'ቀደም ሲል መለያ አለዎት?' : 'Already have an account?'}{' '}
              <Link href="/auth/login" className="fw-bold hover-orange" style={{ color: 'var(--primary-orange)' }}>
                {t('login')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-5 text-center">
          <div className="spinner-border text-warning" role="status" />
        </div>
      }
    >
      <RegisterFormContent />
    </Suspense>
  );
}
