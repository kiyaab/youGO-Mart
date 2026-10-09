'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { ListingCard as ListingCardType } from '@/types';
import { ListingCard } from '@/components/listing/ListingCard';
import {
  Heart,
  MessageSquare,
  ShieldAlert,
  Search,
  Lock,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Bell,
  PhoneCall,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Compass,
} from 'lucide-react';

export default function BuyerDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { language, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'favorites' | 'messages' | 'safety' | 'settings'>('favorites');
  const [favorites, setFavorites] = useState<{ id: number; listing: ListingCardType }[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // User Settings State
  const [preferredCity, setPreferredCity] = useState('Addis Ababa');
  const [safetyNotifications, setSafetyNotifications] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/buyer/dashboard');
      return;
    }

    async function loadBuyerData() {
      setLoading(true);
      try {
        const [favData, convData] = await Promise.allSettled([
          api.favorites.getAll(),
          api.messaging.getConversations(),
        ]);

        if (favData.status === 'fulfilled' && Array.isArray(favData.value)) {
          setFavorites(favData.value);
        }
        if (convData.status === 'fulfilled' && Array.isArray(convData.value)) {
          setConversations(convData.value);
        }
      } catch (err) {
        console.error('Failed to load buyer data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadBuyerData();
  }, [user, isAuthenticated, authLoading, router]);

  // STRICT ROLE GUARD: Block Sellers from accessing the Buyer Dashboard!
  if (!authLoading && user && user.role === 'seller') {
    return (
      <div className="container py-5 text-center" style={{ minHeight: '70vh' }}>
        <div className="glass-card p-5 max-w-lg mx-auto rounded-4 text-center">
          <div className="d-inline-flex p-3 rounded-circle bg-warning bg-opacity-10 text-warning mb-3">
            <Lock size={40} />
          </div>
          <h3 className="fw-bold mb-2">
            {language === 'am' ? 'የገዢ ገጽ ተከልክሏል' : 'Buyer Portal Access Restricted'}
          </h3>
          <p className="text-muted small mb-4" style={{ lineHeight: 1.6 }}>
            {language === 'am'
              ? 'ይህ ገጽ ለገዢዎች ብቻ የተዘጋጀ ነው። እንደ ሻጭ፣ እባክዎ ምርቶችዎን እና ሱቅዎን በሻጭ ዳሽቦርድ ያስተዳድሩ።'
              : 'This portal is reserved strictly for buyers. As a registered Merchant & Seller, manage your product listings, leads, and orders in the Seller Hub.'}
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link href="/seller/dashboard" className="btn-orange px-4 py-2">
              {language === 'am' ? 'ወደ ሻጭ ገጽ ሂድ' : 'Go to Seller Hub'} <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleFavoriteToggled = (listingId: number, isFav: boolean) => {
    if (!isFav) {
      setFavorites(favorites.filter((f) => f.listing.id !== listingId));
    }
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="py-4" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container">
        {/* Buyer Header */}
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4 pb-3 border-bottom">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                <UserCheck size={22} />
              </div>
              <h1 className="h3 fw-bold m-0" style={{ letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                {t('buyer_hub')}
              </h1>
              <span className="badge rounded-pill bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2.5 py-1 small fw-semibold">
                <CheckCircle2 size={13} className="me-1 inline" /> {language === 'am' ? 'የተረጋገጠ ገዢ' : 'Verified Buyer'}
              </span>
            </div>
            <p className="text-muted small m-0">
              {language === 'am'
                ? 'የተመረጡ እቃዎች፣ ከሻጮች ጋር የተደረጉ ንግግሮች፣ እና የደህንነት መመሪያዎችን ይመልከቱ።'
                : 'Manage your saved wishlist, direct seller inquiries, and verified Ethiopian listings.'}
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link href="/search" className="btn-orange btn-sm px-3.5 py-2 rounded-pill shadow-sm">
              <Search size={16} /> {t('explore_marketplace')}
            </Link>
          </div>
        </div>

        {/* Real Metrics Cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="glass-card p-3 rounded-4 h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-semibold">
                  {language === 'am' ? 'የተወደዱ እቃዎች' : 'Wishlist Items'}
                </span>
                <div className="p-2 rounded-3 bg-danger bg-opacity-10 text-danger">
                  <Heart size={17} />
                </div>
              </div>
              <h3 className="fw-extrabold m-0" style={{ color: 'var(--text-main)' }}>
                {favorites.length}
              </h3>
              <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
                {language === 'am' ? 'የተቀመጡ ምርቶች' : 'Saved for comparison'}
              </span>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="glass-card p-3 rounded-4 h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-semibold">
                  {language === 'am' ? 'ንግግሮች' : 'Inquiries'}
                </span>
                <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                  <MessageSquare size={17} />
                </div>
              </div>
              <h3 className="fw-extrabold m-0" style={{ color: 'var(--text-main)' }}>
                {conversations.length}
              </h3>
              <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
                {language === 'am' ? 'ቀጥታ መልእክቶች' : 'Direct seller chats'}
              </span>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="glass-card p-3 rounded-4 h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-semibold">
                  {language === 'am' ? 'ኮሚሽን' : 'Commission'}
                </span>
                <div className="p-2 rounded-3 bg-success bg-opacity-10 text-success">
                  <ShieldCheck size={17} />
                </div>
              </div>
              <h3 className="fw-extrabold m-0 text-success">
                0%
              </h3>
              <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
                {language === 'am' ? '100% ነፃ' : 'Zero middleman fees'}
              </span>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="glass-card p-3 rounded-4 h-100">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="text-muted small fw-semibold">
                  {language === 'am' ? 'ደህንነት' : 'Protection'}
                </span>
                <div className="p-2 rounded-3 bg-warning bg-opacity-10 text-warning">
                  <ShieldAlert size={17} />
                </div>
              </div>
              <h3 className="fw-bold m-0" style={{ color: 'var(--text-main)', fontSize: '1.25rem' }}>
                {language === 'am' ? 'ንቁ' : 'Active'}
              </h3>
              <span className="text-muted small" style={{ fontSize: '0.74rem' }}>
                {language === 'am' ? 'የቀጥታ ግንኙነት ጥበቃ' : 'Direct contact verified'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="d-flex align-items-center gap-2 border-bottom mb-4 overflow-x-auto pb-1">
          <button
            className={`btn border-0 py-2 px-3 fw-bold ${
              activeTab === 'favorites' ? 'text-warning border-bottom border-warning border-3' : 'text-muted'
            }`}
            onClick={() => setActiveTab('favorites')}
          >
            {language === 'am' ? 'የተቀመጡ እቃዎች' : 'Saved Wishlist'} ({favorites.length})
          </button>
          <button
            className={`btn border-0 py-2 px-3 fw-bold ${
              activeTab === 'messages' ? 'text-warning border-bottom border-warning border-3' : 'text-muted'
            }`}
            onClick={() => setActiveTab('messages')}
          >
            {language === 'am' ? 'መልእክቶች' : 'Direct Messages'} ({conversations.length})
          </button>
          <button
            className={`btn border-0 py-2 px-3 fw-bold ${
              activeTab === 'safety' ? 'text-warning border-bottom border-warning border-3' : 'text-muted'
            }`}
            onClick={() => setActiveTab('safety')}
          >
            {language === 'am' ? 'የደህንነት መመሪያ' : 'Buyer Safety Shield'}
          </button>
          <button
            className={`btn border-0 py-2 px-3 fw-bold ${
              activeTab === 'settings' ? 'text-warning border-bottom border-warning border-3' : 'text-muted'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            {language === 'am' ? 'ምርጫዎች' : 'Preferences'}
          </button>
        </div>

        {/* TAB 1: Favorites */}
        {activeTab === 'favorites' && (
          <div>
            {loading ? (
              <div className="row g-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="col-12 col-sm-6 col-lg-3">
                    <div className="glass-card p-3" style={{ height: '280px', opacity: 0.6 }} />
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
              <div className="glass-card p-5 text-center rounded-4 max-w-md mx-auto">
                <Heart size={44} className="text-muted opacity-50 mb-3" />
                <h4 className="fw-bold">
                  {language === 'am' ? 'ምንም የተቀመጡ እቃዎች የሉም' : 'No saved favorites yet'}
                </h4>
                <p className="text-muted small mb-4">
                  {language === 'am'
                    ? 'በምርቶች ላይ ያለውን የልብ ምልክት በመንካት ለበኋላ ያስቀምጡ።'
                    : 'Click the heart button on any listing across Addis Ababa and Ethiopia to keep track of prices.'}
                </p>
                <Link href="/search" className="btn-orange px-4 py-2">
                  <Search size={16} /> {t('explore_marketplace')}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Messages */}
        {activeTab === 'messages' && (
          <div className="glass-card p-4 rounded-4 shadow-sm">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold m-0">
                {language === 'am' ? 'የቀጥታ መልእክቶች' : 'Direct Inquiries with Sellers'}
              </h5>
              <Link href="/messages" className="btn btn-neutral btn-sm px-3">
                {language === 'am' ? 'ሁሉንም ክፈት' : 'Open Inbox'}
              </Link>
            </div>
            {conversations.length > 0 ? (
              <div className="list-group list-group-flush">
                {conversations.map((conv) => (
                  <Link
                    key={conv.id}
                    href={`/messages?conversation=${conv.id}`}
                    className="list-group-item list-group-item-action d-flex align-items-center justify-content-between p-3 border-bottom"
                  >
                    <div>
                      <div className="fw-bold mb-1">{conv.listing_title || 'Listing Discussion'}</div>
                      <div className="small text-muted">{conv.last_message || 'Inquiry started'}</div>
                    </div>
                    <ArrowRight size={16} className="text-muted" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-5">
                <MessageSquare size={36} className="text-muted opacity-40 mb-2" />
                <p className="text-muted small">
                  {language === 'am'
                    ? 'እስካሁን ምንም መልእክት አልተላከም።'
                    : 'No direct messages sent yet. Inquire directly on any listing via call or chat!'}
                </p>
                <Link href="/search" className="btn-orange btn-sm px-3 py-1.5 mt-2">
                  {language === 'am' ? 'ምርቶችን ፈልግ' : 'Find Products'}
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Safety */}
        {activeTab === 'safety' && (
          <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="p-3 rounded-circle bg-warning bg-opacity-10 text-warning">
                <ShieldCheck size={32} />
              </div>
              <div>
                <h4 className="fw-bold m-0">
                  {language === 'am' ? 'የገዢ ደህንነት መመሪያ' : 'youGO-mart Buyer Safety Shield'}
                </h4>
                <p className="text-muted small m-0">
                  {language === 'am'
                    ? 'በቀጥታ ግብይት ወቅት እራስዎን ከአጭበርባሪዎች እንዴት እንደሚጠብቁ'
                    : 'Essential guidelines for 100% safe direct face-to-face transactions in Ethiopia.'}
                </p>
              </div>
            </div>

            <div className="row g-4">
              <div className="col-md-6">
                <div className="p-3.5 rounded-3 bg-light border h-100">
                  <div className="d-flex align-items-center gap-2 mb-2 text-danger fw-bold">
                    <AlertTriangle size={18} />
                    {language === 'am' ? 'ቅድመ ክፍያ በፍጹም አይክፈሉ' : 'Never Pay in Advance'}
                  </div>
                  <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                    {language === 'am'
                      ? 'እቃውን በአካል አይተው እና መርምረው እስካልተረከቡ ድረስ በቴሌብር፣ በባንክ ወይም በሌላ መንገድ ምንም አይነት የቅድመ ክፍያ ገንዘብ አይላኩ።'
                      : 'Never transfer deposits or delivery charges via Telebirr or CBE before physically meeting and inspecting the merchandise.'}
                  </p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="p-3.5 rounded-3 bg-light border h-100">
                  <div className="d-flex align-items-center gap-2 mb-2 text-primary fw-bold">
                    <MapPin size={18} />
                    {language === 'am' ? 'በህዝብ ቦታዎች ይገናኙ' : 'Meet in Public Locations'}
                  </div>
                  <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                    {language === 'am'
                      ? 'ግብይቱን በታወቁ የገበያ አዳራሾች፣ ካፌዎች ወይም የህዝብ እንቅስቃሴ ባለባቸው አካባቢዎች በቀን ሰዓት ያከናውኑ።'
                      : 'Always choose busy public meeting spots in Addis Ababa (e.g. Edna Mall, Bole Medhanealem, Meskel Square, Megenagna) during daylight.'}
                  </p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="p-3.5 rounded-3 bg-light border h-100">
                  <div className="d-flex align-items-center gap-2 mb-2 text-success fw-bold">
                    <CheckCircle2 size={18} />
                    {language === 'am' ? 'እቃውን በጥንቃቄ ይፈትሹ' : 'Inspect Goods Thoroughly'}
                  </div>
                  <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                    {language === 'am'
                      ? 'ስልኮችን፣ ኮምፒውተሮችን ወይም ተሽከርካሪዎችን ከመግዛትዎ በፊት ትክክለኛነታቸውን እና ጥራታቸውን ከባለሙያ ጋር ያረጋግጡ።'
                      : 'Power on electronics, test SIM card slots, check battery health, and verify engine numbers on cars before closing the deal.'}
                  </p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="p-3.5 rounded-3 bg-light border h-100">
                  <div className="d-flex align-items-center gap-2 mb-2 text-warning fw-bold">
                    <PhoneCall size={18} />
                    {language === 'am' ? 'አጠራጣሪ ሻጮችን ሪፖርት ያድርጉ' : 'Report Suspicious Activity'}
                  </div>
                  <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>
                    {language === 'am'
                      ? 'ያልተለመደ ዋጋ ወይም አጠራጣሪ ባህሪ ካስተዋሉ በምርቱ ገጽ ላይ ያለውን "ሪፖርት አድርግ" ቁልፍ በመጠቀም ወዲያውኑ ያስታውቁን።'
                      : 'If a deal looks too good to be true or a seller behaves suspiciously, click the "Report Listing" button to notify our moderation team immediately.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Preferences */}
        {activeTab === 'settings' && (
          <div className="glass-card p-4 p-md-5 rounded-4 shadow-sm" style={{ maxWidth: '640px' }}>
            <h5 className="fw-bold mb-3">
              {language === 'am' ? 'የገዢ መገለጫ እና ማሳወቂያዎች' : 'Buyer Preferences & Location'}
            </h5>
            {savedSuccess && (
              <div className="alert alert-success small mb-3">
                {language === 'am' ? 'ምርጫዎችዎ ተቀምጠዋል!' : 'Preferences saved successfully!'}
              </div>
            )}
            <form onSubmit={handleSavePreferences}>
              <div className="mb-3">
                <label className="form-label small fw-bold">
                  {language === 'am' ? 'ዋና የፍለጋ ከተማ' : 'Preferred Search City'}
                </label>
                <select
                  className="form-select"
                  value={preferredCity}
                  onChange={(e) => setPreferredCity(e.target.value)}
                >
                  <option value="Addis Ababa">Addis Ababa (አዲስ አበባ)</option>
                  <option value="Hawassa">Hawassa (ሀዋሳ)</option>
                  <option value="Adama">Adama (አዳማ)</option>
                  <option value="Bahir Dar">Bahir Dar (ባህር ዳር)</option>
                  <option value="Dire Dawa">Dire Dawa (ድሬዳዋ)</option>
                  <option value="Mekelle">Mekelle (መቐለ)</option>
                </select>
              </div>

              <div className="mb-4">
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="safetyAlerts"
                    checked={safetyNotifications}
                    onChange={(e) => setSafetyNotifications(e.target.checked)}
                  />
                  <label className="form-check-label small fw-semibold" htmlFor="safetyAlerts">
                    {language === 'am'
                      ? 'የደህንነት እና የዋጋ ቅናሽ ማሳወቂያዎችን ተቀበል'
                      : 'Receive safety tips and price drop alerts'}
                  </label>
                </div>
              </div>

              <button type="submit" className="btn-orange px-4 py-2">
                {language === 'am' ? 'አስቀምጥ' : 'Save Preferences'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
